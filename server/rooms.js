/**
 * Real-Time Collaborative Code Interview Platform
 * Room State & Dual-Role Session Management
 */

const crypto = require('crypto');
const { getProblemById } = require('./problems/bank');

const ROOMS = new Map();

/**
 * Generate a cryptographically secure random token
 */
function generateToken(length = 16) {
  return crypto.randomBytes(length).toString('hex');
}

/**
 * Create a new interview session room
 */
function createRoom({ id = null, problemId = 'two-sum', title = 'Technical Interview Session' } = {}) {
  const roomId = id || `iv-${crypto.randomBytes(4).toString('hex')}`;
  const interviewerToken = generateToken(12);
  const candidateToken = generateToken(8);
  const problem = getProblemById(problemId) || getProblemById('two-sum');

  const initialLanguage = 'python';
  const initialCode = problem ? (problem.starterCode[initialLanguage] || '') : '# Write your solution here\n';

  const room = {
    id: roomId,
    title,
    interviewerToken,
    candidateToken,
    createdAt: Date.now(),
    problemId: problem ? problem.id : 'two-sum',
    language: initialLanguage,
    code: initialCode,
    version: 1,
    whiteboardStrokes: [],
    interviewerNotes: {
      scores: {
        dsa: 4,
        problemSolving: 4,
        codeQuality: 4,
        communication: 4
      },
      notes: ''
    },
    timelineEvents: [
      {
        id: 'evt-init',
        timestamp: Date.now(),
        timeStr: '00:00',
        text: 'Interview session created.',
        author: 'System',
        flag: 'info'
      }
    ],
    testResults: null,
    evaluationReport: null,
    peers: new Map() // clientId -> peer metadata & ws
  };

  ROOMS.set(roomId, room);
  return room;
}

/**
 * Get room by ID
 */
function getRoom(roomId) {
  return ROOMS.get(roomId) || null;
}

/**
 * Validate role access
 */
function validateRole(room, role, token) {
  if (role === 'interviewer') {
    // Check if token matches or allow if in solo practice mode
    if (token && token === room.interviewerToken) {
      return { authorized: true, role: 'interviewer' };
    }
    // If no token provided or mismatched, fall back to candidate view for safety
    return { authorized: false, role: 'candidate' };
  }
  return { authorized: true, role: 'candidate' };
}

/**
 * Add peer to room
 */
function addPeer(room, clientId, { name, role, color, ws }) {
  const peer = {
    id: clientId,
    name: name || (role === 'interviewer' ? 'Interviewer' : 'Candidate'),
    role,
    color: color || (role === 'interviewer' ? '#2563eb' : '#16a34a'),
    cursor: { line: 1, ch: 1 },
    selection: null,
    joinedAt: Date.now(),
    ws
  };

  room.peers.set(clientId, peer);

  // Add timeline entry
  room.timelineEvents.push({
    id: `evt-join-${Date.now()}`,
    timestamp: Date.now(),
    timeStr: formatElapsed(Date.now() - room.createdAt),
    text: `${peer.name} (${role}) joined the room.`,
    author: 'System',
    flag: 'join'
  });

  return peer;
}

/**
 * Remove peer from room
 */
function removePeer(room, clientId) {
  const peer = room.peers.get(clientId);
  if (peer) {
    room.peers.delete(clientId);
    room.timelineEvents.push({
      id: `evt-leave-${Date.now()}`,
      timestamp: Date.now(),
      timeStr: formatElapsed(Date.now() - room.createdAt),
      text: `${peer.name} left the room.`,
      author: 'System',
      flag: 'leave'
    });
  }
}

/**
 * Broadcast payload to peers in room
 */
function broadcast(room, payload, excludeClientId = null, filterRole = null) {
  const messageStr = typeof payload === 'string' ? payload : JSON.stringify(payload);

  for (const [clientId, peer] of room.peers.entries()) {
    if (excludeClientId && clientId === excludeClientId) continue;
    if (filterRole && peer.role !== filterRole) continue;

    if (peer.ws && peer.ws.readyState === 1 /* OPEN */) {
      try {
        peer.ws.send(messageStr);
      } catch (err) {
        console.error(`Broadcast error to ${clientId}:`, err.message);
      }
    }
  }
}

/**
 * Get sanitized room state for client consumption
 */
function getClientRoomState(room, clientRole) {
  const activePeers = Array.from(room.peers.values()).map(p => ({
    id: p.id,
    name: p.name,
    role: p.role,
    color: p.color,
    cursor: p.cursor,
    selection: p.selection
  }));

  const state = {
    id: room.id,
    title: room.title,
    problemId: room.problemId,
    language: room.language,
    code: room.code,
    version: room.version,
    whiteboardStrokes: room.whiteboardStrokes,
    timelineEvents: room.timelineEvents,
    testResults: room.testResults,
    evaluationReport: room.evaluationReport,
    peers: activePeers,
    candidateToken: room.candidateToken,
    interviewerToken: clientRole === 'interviewer' ? room.interviewerToken : undefined
  };

  // Only interviewers get access to the private scorecard notes
  if (clientRole === 'interviewer') {
    state.interviewerNotes = room.interviewerNotes;
  }

  return state;
}

function formatElapsed(ms) {
  const totalSecs = Math.floor(ms / 1000);
  const mins = Math.floor(totalSecs / 60).toString().padStart(2, '0');
  const secs = (totalSecs % 60).toString().padStart(2, '0');
  return `${mins}:${secs}`;
}

module.exports = {
  createRoom,
  getRoom,
  validateRole,
  addPeer,
  removePeer,
  broadcast,
  getClientRoomState
};
