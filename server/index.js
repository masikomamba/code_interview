/**
 * Real-Time Collaborative Code Interview Platform
 * Master Server: Express REST + WebSocket Server + WebRTC Signaling Relay
 */

try {
  require.resolve('express');
  require.resolve('ws');
} catch (err) {
  console.error('\n======================================================');
  console.error(' [CODEINTERVIEW] Missing dependencies.');
  console.error(' Please install dependencies or run with Docker:');
  console.error('   1. Local:  npm install && npm start');
  console.error('   2. Docker: docker compose up --build');
  console.error('======================================================\n');
  process.exit(1);
}

const http = require('http');
const path = require('path');
const express = require('express');
const { WebSocketServer } = require('ws');
const apiRoutes = require('./routes/api');
const {
  getRoom,
  validateRole,
  addPeer,
  removePeer,
  broadcast,
  getClientRoomState
} = require('./rooms');
const { initDatabase } = require('./db');

const app = express();
const server = http.createServer(app);

// Middleware
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static frontend assets
const clientPath = path.join(__dirname, '..', 'client');
app.use(express.static(clientPath));

// API routes
app.use('/api', apiRoutes);

// Fallback route for SPA navigation
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(clientPath, 'index.html'));
});

// WebSocket Server for Real-Time Collaboration & WebRTC Signaling
const wss = new WebSocketServer({ server, path: '/ws' });

wss.on('connection', (ws, req) => {
  let currentRoomId = null;
  let currentClientId = null;
  let currentRole = 'candidate';

  ws.isAlive = true;
  ws.on('pong', () => { ws.isAlive = true; });

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      const { type, roomId } = data;

      switch (type) {
        case 'JOIN_ROOM': {
          const room = getRoom(roomId);
          if (!room) {
            return ws.send(JSON.stringify({ type: 'ERROR', message: 'Room does not exist' }));
          }

          const requestedRole = data.role || 'candidate';
          const token = data.token || '';
          const auth = validateRole(room, requestedRole, token);

          currentRoomId = roomId;
          currentClientId = data.clientId || `client-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
          currentRole = auth.role;

          const peer = addPeer(room, currentClientId, {
            name: data.name,
            role: currentRole,
            color: data.color,
            ws
          });

          // Send current room state to joining peer
          ws.send(JSON.stringify({
            type: 'ROOM_STATE',
            clientId: currentClientId,
            role: currentRole,
            state: getClientRoomState(room, currentRole)
          }));

          // Notify other peers in the room
          broadcast(room, {
            type: 'PEER_JOINED',
            peer: {
              id: peer.id,
              name: peer.name,
              role: peer.role,
              color: peer.color
            }
          }, currentClientId);
          break;
        }

        case 'CODE_CHANGE': {
          const room = getRoom(currentRoomId);
          if (!room) return;

          room.code = data.code;
          room.version = (room.version || 0) + 1;
          if (data.language) room.language = data.language;

          // Broadcast code update to all other peers in the room
          broadcast(room, {
            type: 'CODE_UPDATE',
            code: room.code,
            version: room.version,
            language: room.language,
            authorId: currentClientId
          }, currentClientId);
          break;
        }

        case 'CURSOR_MOVE': {
          const room = getRoom(currentRoomId);
          if (!room) return;

          const peer = room.peers.get(currentClientId);
          if (peer) {
            peer.cursor = data.cursor;
            peer.selection = data.selection;
          }

          broadcast(room, {
            type: 'CURSOR_UPDATE',
            clientId: currentClientId,
            cursor: data.cursor,
            selection: data.selection
          }, currentClientId);
          break;
        }

        case 'LANGUAGE_CHANGE': {
          const room = getRoom(currentRoomId);
          if (!room) return;

          room.language = data.language;
          broadcast(room, {
            type: 'LANGUAGE_UPDATE',
            language: room.language,
            authorId: currentClientId
          });
          break;
        }

        case 'WHITEBOARD_DRAW': {
          const room = getRoom(currentRoomId);
          if (!room) return;

          if (data.clear) {
            room.whiteboardStrokes = [];
          } else if (data.stroke) {
            room.whiteboardStrokes.push(data.stroke);
          }

          broadcast(room, {
            type: 'WHITEBOARD_UPDATE',
            stroke: data.stroke,
            clear: data.clear,
            authorId: currentClientId
          }, currentClientId);
          break;
        }

        case 'INTERVIEWER_NOTES_UPDATE': {
          const room = getRoom(currentRoomId);
          if (!room) return;

          // Only allow if client has verified interviewer token
          if (currentRole === 'interviewer') {
            room.interviewerNotes = data.notesData;
          }
          break;
        }

        case 'TIMELINE_EVENT': {
          const room = getRoom(currentRoomId);
          if (!room) return;

          const evt = {
            id: `evt-${Date.now()}`,
            timestamp: Date.now(),
            timeStr: data.timeStr || '00:00',
            text: data.text,
            author: data.author || (currentRole === 'interviewer' ? 'Interviewer' : 'Candidate'),
            flag: data.flag || 'note'
          };
          room.timelineEvents.push(evt);

          broadcast(room, {
            type: 'TIMELINE_UPDATE',
            event: evt
          });
          break;
        }

        // WebRTC P2P Signaling Relay (offer, answer, candidate)
        case 'WEBRTC_SIGNAL': {
          const room = getRoom(currentRoomId);
          if (!room) return;

          const targetClientId = data.targetClientId;
          const targetPeer = room.peers.get(targetClientId);

          if (targetPeer && targetPeer.ws && targetPeer.ws.readyState === 1) {
            targetPeer.ws.send(JSON.stringify({
              type: 'WEBRTC_SIGNAL',
              senderClientId: currentClientId,
              senderRole: currentRole,
              signal: data.signal
            }));
          } else if (!targetClientId) {
            // Broadcast to other peers if no specific target
            broadcast(room, {
              type: 'WEBRTC_SIGNAL',
              senderClientId: currentClientId,
              senderRole: currentRole,
              signal: data.signal
            }, currentClientId);
          }
          break;
        }

        default:
          break;
      }
    } catch (err) {
      console.error('WebSocket message handling error:', err.message);
    }
  });

  ws.on('close', () => {
    if (currentRoomId && currentClientId) {
      const room = getRoom(currentRoomId);
      if (room) {
        removePeer(room, currentClientId);
        broadcast(room, {
          type: 'PEER_LEFT',
          clientId: currentClientId
        });
      }
    }
  });
});

// Periodic ping/pong to clean up dead connections
const pingInterval = setInterval(() => {
  wss.clients.forEach((ws) => {
    if (ws.isAlive === false) return ws.terminate();
    ws.isAlive = false;
    ws.ping();
  });
}, 30000);

wss.on('close', () => clearInterval(pingInterval));

const PORT = parseInt(process.env.PORT, 10) || 8080;
const HOST = process.env.HOST || '0.0.0.0';

initDatabase().catch(err => {
  console.error('[DB] Failed to initialize database:', err);
});

server.listen(PORT, HOST, () => {
  console.log(`[CODEINTERVIEW PLATFORM] Server active at http://${HOST === '0.0.0.0' ? 'localhost' : HOST}:${PORT}`);
  console.log(`[CODEINTERVIEW PLATFORM] WebSocket signaling ready at ws://${HOST === '0.0.0.0' ? 'localhost' : HOST}:${PORT}/ws`);
  console.log(`[CODEINTERVIEW PLATFORM] Code execution engine: ${process.env.EXECUTION_ENGINE || 'local'}`);
});

module.exports = { app, server };
