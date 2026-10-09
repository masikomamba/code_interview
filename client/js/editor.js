/**
 * Real-Time Collaborative Code Interview Platform
 * Collaborative Code Editor Controller
 */

class CollaborativeEditor {
  constructor() {
    this.textarea = document.getElementById('code-editor-input');
    this.gutter = document.getElementById('line-numbers-gutter');
    this.cursorCoords = document.getElementById('cursor-coords-display');
    this.presenceBar = document.getElementById('peer-presence-bar');
    this.remoteCursorsLayer = document.getElementById('remote-cursors-layer');

    this.version = 1;
    this.isLocalUpdate = false;
    this.peers = new Map(); // clientId -> { name, color, cursor, selection, element }

    this.initEvents();
  }

  initEvents() {
    if (!this.textarea) return;

    // Line counting and cursor updates
    this.textarea.addEventListener('input', () => {
      this.updateLineNumbers();
      this.broadcastCodeChange();
    });

    this.textarea.addEventListener('keyup', () => this.handleCursorMove());
    this.textarea.addEventListener('click', () => this.handleCursorMove());
    this.textarea.addEventListener('scroll', () => this.syncScroll());

    // Tab key indentation and auto-closing pairs
    this.textarea.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        const start = this.textarea.selectionStart;
        const end = this.textarea.selectionEnd;
        const val = this.textarea.value;
        this.textarea.value = val.substring(0, start) + '    ' + val.substring(end);
        this.textarea.selectionStart = this.textarea.selectionEnd = start + 4;
        this.updateLineNumbers();
        this.broadcastCodeChange();
        this.handleCursorMove();
      } else if (e.key === 'Enter') {
        // Auto-indent
        const start = this.textarea.selectionStart;
        const val = this.textarea.value;
        const curLine = val.substring(0, start).split('\n').pop();
        const match = curLine.match(/^(\s+)/);
        if (match) {
          e.preventDefault();
          const indent = match[1] + (curLine.trim().endsWith(':') || curLine.trim().endsWith('{') ? '    ' : '');
          this.textarea.value = val.substring(0, start) + '\n' + indent + val.substring(start);
          this.textarea.selectionStart = this.textarea.selectionEnd = start + 1 + indent.length;
          this.updateLineNumbers();
          this.broadcastCodeChange();
          this.handleCursorMove();
        }
      }
    });

    // Listen for socket events
    window.socketClient.on('CODE_UPDATE', (data) => {
      if (data.authorId !== window.socketClient.clientId) {
        this.applyRemoteCode(data.code, data.version);
      }
    });

    window.socketClient.on('CURSOR_UPDATE', (data) => {
      this.updateRemoteCursor(data.clientId, data.cursor, data.selection);
    });

    window.socketClient.on('PEER_JOINED', (data) => {
      this.addPeerPresence(data.peer);
    });

    window.socketClient.on('PEER_LEFT', (data) => {
      this.removePeerPresence(data.clientId);
    });
  }

  setCode(code) {
    if (!this.textarea) return;
    this.textarea.value = code;
    this.updateLineNumbers();
  }

  getCode() {
    return this.textarea ? this.textarea.value : '';
  }

  updateLineNumbers() {
    if (!this.gutter || !this.textarea) return;
    const lines = this.textarea.value.split('\n').length;
    let gutterHtml = '';
    for (let i = 1; i <= Math.max(lines, 1); i++) {
      gutterHtml += `<span class="line-number" data-line="${i}">${i}</span>`;
    }
    this.gutter.innerHTML = gutterHtml;
  }

  syncScroll() {
    if (this.gutter && this.textarea) {
      this.gutter.scrollTop = this.textarea.scrollTop;
    }
  }

  handleCursorMove() {
    if (!this.textarea) return;
    const pos = this.textarea.selectionStart;
    const val = this.textarea.value;
    const lines = val.substring(0, pos).split('\n');
    const line = lines.length;
    const col = lines[lines.length - 1].length + 1;

    if (this.cursorCoords) {
      this.cursorCoords.textContent = `Ln ${line}, Col ${col}`;
    }

    // Highlight active line in gutter
    const allNums = this.gutter.querySelectorAll('.line-number');
    allNums.forEach(n => n.classList.remove('active-line'));
    const active = this.gutter.querySelector(`.line-number[data-line="${line}"]`);
    if (active) active.classList.add('active-line');

    // Broadcast cursor position
    window.socketClient.send('CURSOR_MOVE', {
      cursor: { line, col, pos },
      selection: this.textarea.selectionStart !== this.textarea.selectionEnd ? {
        start: this.textarea.selectionStart,
        end: this.textarea.selectionEnd
      } : null
    });
  }

  broadcastCodeChange() {
    this.version++;
    window.socketClient.send('CODE_CHANGE', {
      code: this.textarea.value,
      version: this.version
    });
  }

  applyRemoteCode(code, version) {
    if (!this.textarea) return;
    const selStart = this.textarea.selectionStart;
    const selEnd = this.textarea.selectionEnd;

    this.textarea.value = code;
    this.version = version;
    this.updateLineNumbers();

    // Preserve cursor position if possible
    this.textarea.selectionStart = Math.min(selStart, code.length);
    this.textarea.selectionEnd = Math.min(selEnd, code.length);
  }

  addPeerPresence(peer) {
    if (!this.peers.has(peer.id)) {
      this.peers.set(peer.id, peer);
      this.renderPresenceBar();
    }
  }

  removePeerPresence(clientId) {
    if (this.peers.has(clientId)) {
      const p = this.peers.get(clientId);
      if (p.element && p.element.parentNode) {
        p.element.parentNode.removeChild(p.element);
      }
      this.peers.delete(clientId);
      this.renderPresenceBar();
    }
  }

  renderPresenceBar() {
    if (!this.presenceBar) return;
    let html = '';
    for (const [id, peer] of this.peers.entries()) {
      html += `
        <span class="peer-chip" title="${peer.name} (${peer.role})">
          <span class="peer-chip-dot" style="background-color: ${peer.color || '#3b82f6'};"></span>
          ${peer.name}
        </span>
      `;
    }
    this.presenceBar.innerHTML = html;
  }

  updateRemoteCursor(clientId, cursor, selection) {
    if (!this.remoteCursorsLayer || !this.textarea) return;

    let peer = this.peers.get(clientId);
    if (!peer) {
      peer = { id: clientId, name: 'Collaborator', color: '#3b82f6' };
      this.peers.set(clientId, peer);
    }

    let cursorEl = peer.element;
    if (!cursorEl) {
      cursorEl = document.createElement('div');
      cursorEl.className = 'remote-cursor';
      cursorEl.style.backgroundColor = peer.color || '#3b82f6';

      const labelEl = document.createElement('div');
      labelEl.className = 'remote-cursor-label';
      labelEl.style.backgroundColor = peer.color || '#3b82f6';
      labelEl.textContent = peer.name || 'User';

      cursorEl.appendChild(labelEl);
      this.remoteCursorsLayer.appendChild(cursorEl);
      peer.element = cursorEl;
    }

    // Estimate coordinates based on line and character position
    const lineHeight = 20;
    const charWidth = 8.1;
    const top = (cursor.line - 1) * lineHeight + 12 - this.textarea.scrollTop;
    const left = (cursor.col - 1) * charWidth + 60 - this.textarea.scrollLeft;

    cursorEl.style.top = `${Math.max(0, top)}px`;
    cursorEl.style.left = `${Math.max(0, left)}px`;
  }
}

window.CollaborativeEditor = CollaborativeEditor;
