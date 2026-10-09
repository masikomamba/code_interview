/**
 * Real-Time Collaborative Code Interview Platform
 * WebSocket Client Manager & Message Router
 */

class SocketClient {
  constructor() {
    this.ws = null;
    this.handlers = new Map();
    this.connected = false;
    this.reconnectAttempts = 0;
    this.clientId = `client-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }

  connect({ roomId, role = 'candidate', token = '', name = 'User', color = '#10b981' }) {
    this.roomId = roomId;
    this.role = role;
    this.token = token;
    this.name = name;
    this.color = color;

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    const wsUrl = `${protocol}//${host}/ws`;

    this.ws = new WebSocket(wsUrl);

    this.ws.onopen = () => {
      this.connected = true;
      this.reconnectAttempts = 0;
      this.trigger('connect', { clientId: this.clientId });

      // Join the session room
      this.send('JOIN_ROOM', {
        roomId: this.roomId,
        clientId: this.clientId,
        role: this.role,
        token: this.token,
        name: this.name,
        color: this.color
      });
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.trigger(data.type, data);
      } catch (err) {
        console.error('[Socket] Failed to parse message:', err);
      }
    };

    this.ws.onclose = () => {
      this.connected = false;
      this.trigger('disconnect');
      // Exponential backoff reconnect
      if (this.reconnectAttempts < 6) {
        const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 10000);
        this.reconnectAttempts++;
        setTimeout(() => this.connect({ roomId, role, token, name, color }), delay);
      }
    };

    this.ws.onerror = (err) => {
      console.warn('[Socket] Connection error:', err);
    };
  }

  send(type, payload = {}) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, roomId: this.roomId, clientId: this.clientId, ...payload }));
    }
  }

  on(type, callback) {
    if (!this.handlers.has(type)) {
      this.handlers.set(type, []);
    }
    this.handlers.get(type).push(callback);
  }

  trigger(type, data) {
    const list = this.handlers.get(type) || [];
    for (const cb of list) {
      try {
        cb(data);
      } catch (err) {
        console.error(`[Socket] Handler error for '${type}':`, err);
      }
    }
  }
}

window.socketClient = new SocketClient();
