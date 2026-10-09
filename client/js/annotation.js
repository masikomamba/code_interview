/**
 * Real-Time Collaborative Code Interview Platform
 * Code Annotation & Whiteboard Canvas Overlay
 */

class AnnotationManager {
  constructor() {
    this.canvas = document.getElementById('annotation-canvas');
    this.dock = document.getElementById('whiteboard-dock');
    this.toggleBtn = document.getElementById('toggle-whiteboard-btn');
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;

    this.active = false;
    this.currentTool = 'pen'; // pen | arrow | box | highlight | eraser
    this.currentColor = '#ef4444';
    this.strokeWidth = 3;

    this.isDrawing = false;
    this.startX = 0;
    this.startY = 0;
    this.strokes = [];

    this.initEvents();
  }

  initEvents() {
    if (!this.canvas) return;

    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());

    if (this.toggleBtn) {
      this.toggleBtn.addEventListener('click', () => this.toggleWhiteboard());
    }

    // Canvas drawing mouse events
    this.canvas.addEventListener('mousedown', (e) => this.startDraw(e));
    this.canvas.addEventListener('mousemove', (e) => this.draw(e));
    this.canvas.addEventListener('mouseup', (e) => this.endDraw(e));
    this.canvas.addEventListener('mouseleave', () => this.endDraw());

    // Whiteboard tool buttons
    const toolBtns = document.querySelectorAll('.dock-tool-btn[data-tool]');
    toolBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        toolBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentTool = btn.getAttribute('data-tool');
      });
    });

    // Color swatches
    const swatches = document.querySelectorAll('.dock-color-swatch');
    swatches.forEach(s => {
      s.addEventListener('click', () => {
        swatches.forEach(sw => sw.classList.remove('active'));
        s.classList.add('active');
        this.currentColor = s.getAttribute('data-color');
      });
    });

    // Clear button
    const clearBtn = document.getElementById('wb-clear-btn');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => this.clear(true));
    }

    // Socket synchronization
    window.socketClient.on('WHITEBOARD_UPDATE', (data) => {
      if (data.clear) {
        this.clear(false);
      } else if (data.stroke) {
        this.strokes.push(data.stroke);
        this.drawStroke(data.stroke);
      }
    });
  }

  resizeCanvas() {
    if (!this.canvas) return;
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
    this.redrawAll();
  }

  toggleWhiteboard() {
    this.active = !this.active;
    if (this.canvas) {
      this.canvas.classList.toggle('active-mode', this.active);
    }
    if (this.dock) {
      this.dock.hidden = !this.active;
    }
    if (this.toggleBtn) {
      this.toggleBtn.classList.toggle('active', this.active);
    }
  }

  startDraw(e) {
    if (!this.active) return;
    this.isDrawing = true;
    const rect = this.canvas.getBoundingClientRect();
    this.startX = e.clientX - rect.left;
    this.startY = e.clientY - rect.top;

    if (this.currentTool === 'pen') {
      this.currentStroke = {
        tool: 'pen',
        color: this.currentColor,
        width: this.strokeWidth,
        points: [{ x: this.startX, y: this.startY }]
      };
    }
  }

  draw(e) {
    if (!this.active || !this.isDrawing) return;
    const rect = this.canvas.getBoundingClientRect();
    const curX = e.clientX - rect.left;
    const curY = e.clientY - rect.top;

    if (this.currentTool === 'pen') {
      this.currentStroke.points.push({ x: curX, y: curY });
      this.ctx.beginPath();
      this.ctx.strokeStyle = this.currentColor;
      this.ctx.lineWidth = this.strokeWidth;
      this.ctx.lineCap = 'round';
      const pts = this.currentStroke.points;
      const p1 = pts[pts.length - 2];
      const p2 = pts[pts.length - 1];
      this.ctx.moveTo(p1.x, p1.y);
      this.ctx.lineTo(p2.x, p2.y);
      this.ctx.stroke();
    } else if (this.currentTool === 'highlight') {
      this.redrawAll();
      this.ctx.fillStyle = 'rgba(251, 191, 36, 0.3)';
      this.ctx.fillRect(this.startX, this.startY, curX - this.startX, curY - this.startY);
    } else if (this.currentTool === 'box') {
      this.redrawAll();
      this.ctx.strokeStyle = this.currentColor;
      this.ctx.lineWidth = 2;
      this.ctx.strokeRect(this.startX, this.startY, curX - this.startX, curY - this.startY);
    }
  }

  endDraw(e) {
    if (!this.active || !this.isDrawing) return;
    this.isDrawing = false;

    let finalStroke = null;
    const rect = this.canvas.getBoundingClientRect();
    const curX = e ? e.clientX - rect.left : this.startX;
    const curY = e ? e.clientY - rect.top : this.startY;

    if (this.currentTool === 'pen' && this.currentStroke) {
      finalStroke = this.currentStroke;
    } else if (this.currentTool === 'box') {
      finalStroke = {
        tool: 'box',
        color: this.currentColor,
        x: this.startX,
        y: this.startY,
        w: curX - this.startX,
        h: curY - this.startY
      };
    } else if (this.currentTool === 'highlight') {
      finalStroke = {
        tool: 'highlight',
        x: this.startX,
        y: this.startY,
        w: curX - this.startX,
        h: curY - this.startY
      };
    }

    if (finalStroke) {
      this.strokes.push(finalStroke);
      this.redrawAll();
      window.socketClient.send('WHITEBOARD_DRAW', { stroke: finalStroke });
    }
  }

  drawStroke(stroke) {
    if (!this.ctx) return;
    if (stroke.tool === 'pen' && stroke.points && stroke.points.length > 1) {
      this.ctx.beginPath();
      this.ctx.strokeStyle = stroke.color;
      this.ctx.lineWidth = stroke.width || 3;
      this.ctx.lineCap = 'round';
      this.ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
      for (let i = 1; i < stroke.points.length; i++) {
        this.ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
      }
      this.ctx.stroke();
    } else if (stroke.tool === 'box') {
      this.ctx.strokeStyle = stroke.color;
      this.ctx.lineWidth = 2;
      this.ctx.strokeRect(stroke.x, stroke.y, stroke.w, stroke.h);
    } else if (stroke.tool === 'highlight') {
      this.ctx.fillStyle = 'rgba(251, 191, 36, 0.3)';
      this.ctx.fillRect(stroke.x, stroke.y, stroke.w, stroke.h);
    }
  }

  redrawAll() {
    if (!this.ctx || !this.canvas) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (const stroke of this.strokes) {
      this.drawStroke(stroke);
    }
  }

  clear(broadcast = true) {
    this.strokes = [];
    if (this.ctx && this.canvas) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    if (broadcast) {
      window.socketClient.send('WHITEBOARD_DRAW', { clear: true });
    }
  }
}

window.AnnotationManager = AnnotationManager;
