/**
 * Real-Time Collaborative Code Interview Platform
 * Application Master Orchestrator & UI Controller
 */

(() => {
  'use strict';

  // Global Toast Function
  window.showToast = function(msg) {
    const toast = document.getElementById('toast-notice');
    if (!toast) return;
    toast.textContent = msg;
    toast.hidden = false;
    clearTimeout(window._toastTimeout);
    window._toastTimeout = setTimeout(() => { toast.hidden = true; }, 3000);
  };

  class InterviewApp {
    constructor() {
      this.params = new URLSearchParams(window.location.search);
      this.roomId = this.params.get('room');
      this.role = this.params.get('role') || 'candidate';
      this.token = this.params.get('token') || '';
      this.currentProblem = null;
      this.timerSeconds = 0;
      this.timerInterval = null;

      this.init();
    }

    async init() {
      // 1. Initialize UI Elements
      this.cacheDom();
      this.initTimer();
      this.initModals();
      this.initTabs();
      this.initChat();

      // 2. Instantiate Subsystem Modules
      window.editor = new window.CollaborativeEditor();
      window.runner = new window.CodeRunner();
      window.webrtc = new window.WebRTCManager();
      window.interviewer = new window.InterviewerManager();
      window.annotation = new window.AnnotationManager();
      window.report = new window.ReportManager();
      window.curriculum = new window.CurriculumManager();

      // 3. Ensure Room Exists or Auto-Create Practice Session
      if (!this.roomId) {
        await this.createPracticeSession();
      } else {
        await this.bootstrapSession();
      }

      // 4. Start media
      window.webrtc.startMedia();
    }

    cacheDom() {
      this.roomBadge = document.getElementById('nav-room-id');
      this.roleBadge = document.getElementById('nav-role-badge');
      this.problemSelect = document.getElementById('problem-select');
      this.languageSelect = document.getElementById('language-select');
      this.interviewerTabBtn = document.getElementById('tab-interviewer-notes');
      this.timerDisplay = document.getElementById('timer-display');
    }

    async createPracticeSession() {
      try {
        const res = await fetch('/api/rooms', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            problemId: 'two-sum',
            title: 'Technical Interview Practice'
          })
        });
        const data = await res.json();
        this.roomId = data.roomId;
        this.token = data.interviewerToken;
        this.role = 'interviewer'; // Default solo practice as interviewer to give user full controls

        // Update URL quietly without page reload
        const newUrl = `${window.location.pathname}?room=${this.roomId}&role=interviewer&token=${this.token}`;
        window.history.replaceState({}, '', newUrl);

        await this.bootstrapSession();
      } catch (err) {
        console.error('Failed to create room:', err);
      }
    }

    async bootstrapSession() {
      window.currentRoomId = this.roomId;
      if (this.roomBadge) this.roomBadge.textContent = this.roomId;

      // Update role display
      if (this.roleBadge) {
        this.roleBadge.textContent = this.role === 'interviewer' ? 'Interviewer' : 'Candidate';
        this.roleBadge.className = `role-pill ${this.role}`;
      }

      // Show/Hide Interviewer Tab based on role
      if (this.interviewerTabBtn) {
        this.interviewerTabBtn.hidden = this.role !== 'interviewer';
      }

      // Load Problem Bank
      await this.loadProblemBank();

      // Connect WebSocket
      window.socketClient.connect({
        roomId: this.roomId,
        role: this.role,
        token: this.token,
        name: this.role === 'interviewer' ? 'Interviewer' : 'Candidate',
        color: this.role === 'interviewer' ? '#3b82f6' : '#10b981'
      });

      this.bindSocketEvents();
    }

    bindSocketEvents() {
      window.socketClient.on('ROOM_STATE', (data) => {
        const { state, role } = data;
        this.role = role;

        if (this.roleBadge) {
          this.roleBadge.textContent = role === 'interviewer' ? 'Interviewer' : 'Candidate';
          this.roleBadge.className = `role-pill ${role}`;
        }
        if (this.interviewerTabBtn) {
          this.interviewerTabBtn.hidden = role !== 'interviewer';
        }

        if (state.code) {
          window.editor.setCode(state.code);
        }

        if (state.language && this.languageSelect) {
          this.languageSelect.value = state.language;
        }

        if (state.problemId) {
          this.selectProblem(state.problemId, false);
        }

        if (role === 'interviewer' && state.interviewerNotes) {
          window.interviewer.setScoresAndNotes(state.interviewerNotes);
        }

        // Render timeline
        if (state.timelineEvents) {
          this.renderTimeline(state.timelineEvents);
        }
      });

      window.socketClient.on('TIMELINE_UPDATE', (data) => {
        this.appendTimelineEvent(data.event);
      });

      window.socketClient.on('LANGUAGE_UPDATE', (data) => {
        if (this.languageSelect && data.language !== this.languageSelect.value) {
          this.languageSelect.value = data.language;
        }
      });
    }

    async loadProblemBank() {
      try {
        const res = await fetch('/api/problems');
        const problems = await res.json();

        if (this.problemSelect) {
          this.problemSelect.innerHTML = problems.map(p => `
            <option value="${p.id}">${p.title} (${p.difficulty})</option>
          `).join('');

          this.problemSelect.addEventListener('change', (e) => {
            this.selectProblem(e.target.value, true);
          });
        }

        // Select initial problem
        const initialProblemId = problems[0] ? problems[0].id : 'two-sum';
        await this.selectProblem(initialProblemId, false);
      } catch (err) {
        console.error('Failed to load problem bank:', err);
      }
    }

    async selectProblem(problemId, updateStarterCode = false) {
      window.currentProblemId = problemId;
      try {
        const res = await fetch(`/api/problems/${problemId}`);
        const p = await res.json();
        this.currentProblem = p;

        // Render Problem Details
        const diffBadge = document.getElementById('problem-diff-badge');
        const catTag = document.getElementById('problem-category-tag');
        const heading = document.getElementById('problem-heading-title');
        const content = document.getElementById('problem-content-body');
        const targetTime = document.getElementById('target-complexity-time');
        const targetSpace = document.getElementById('target-complexity-space');

        if (diffBadge) {
          diffBadge.textContent = p.difficulty;
          diffBadge.className = `difficulty-badge ${p.difficulty.toLowerCase()}`;
        }
        if (catTag) catTag.textContent = p.category;
        if (heading) heading.textContent = p.title;
        if (content) content.innerHTML = this.formatMarkdown(p.description);
        if (targetTime) targetTime.textContent = p.optimalComplexity ? p.optimalComplexity.time : 'O(N)';
        if (targetSpace) targetSpace.textContent = p.optimalComplexity ? p.optimalComplexity.space : 'O(N)';

        // Populate test cases in test tab
        this.populateTestTab(p.testCases || []);

        // Load starter code if requested or empty
        const lang = this.languageSelect ? this.languageSelect.value : 'python';
        if (updateStarterCode && p.starterCode && p.starterCode[lang]) {
          window.editor.setCode(p.starterCode[lang]);
          window.editor.broadcastCodeChange();
        } else if (!window.editor.getCode() && p.starterCode && p.starterCode[lang]) {
          window.editor.setCode(p.starterCode[lang]);
        }
      } catch (err) {
        console.error('Failed to select problem:', err);
      }
    }

    populateTestTab(testCases) {
      const container = document.getElementById('test-cards-container');
      if (!container) return;
      container.innerHTML = testCases.map((tc, idx) => `
        <div class="test-card">
          <div class="test-card-top">
            <span class="test-title">Case ${idx + 1}: ${tc.description}</span>
            <span class="test-status-tag" style="background-color: var(--bg-surface-elevated); color: var(--text-muted);">
              ${tc.isHidden ? 'Hidden Test' : 'Public Test'}
            </span>
          </div>
          <div class="test-io-row">
            <span class="test-io-label">Input:</span>
            <span class="test-io-val">${tc.input}</span>
          </div>
          <div class="test-io-row">
            <span class="test-io-label">Expected:</span>
            <span class="test-io-val">${tc.expected}</span>
          </div>
        </div>
      `).join('');
    }

    formatMarkdown(text) {
      if (!text) return '';
      return text
        .replace(/### (.*)/g, '<h3>$1</h3>')
        .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        .replace(/\* (.*)/g, '<li>$1</li>')
        .replace(/\n\n/g, '<p></p>');
    }

    initTimer() {
      this.timerInterval = setInterval(() => {
        this.timerSeconds++;
        const hrs = Math.floor(this.timerSeconds / 3600);
        const mins = Math.floor((this.timerSeconds % 3600) / 60);
        const secs = this.timerSeconds % 60;
        const timeStr = `${hrs > 0 ? String(hrs).padStart(2, '0') + ':' : ''}${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
        if (this.timerDisplay) this.timerDisplay.textContent = timeStr;
      }, 1000);
    }

    initTabs() {
      const tabs = document.querySelectorAll('.panel-tab[data-view]');
      tabs.forEach(tab => {
        tab.addEventListener('click', () => {
          tabs.forEach(t => t.classList.remove('active'));
          tab.classList.add('active');
          const viewId = tab.getAttribute('data-view');

          document.querySelectorAll('.panel-body-view').forEach(v => {
            v.hidden = true;
          });
          const target = document.getElementById(`view-${viewId}`);
          if (target) target.hidden = false;
        });
      });

      // Console tabs
      const consoleTabs = document.querySelectorAll('.console-tab[data-pane]');
      consoleTabs.forEach(ct => {
        ct.addEventListener('click', () => {
          consoleTabs.forEach(c => c.classList.remove('active'));
          ct.classList.add('active');
          const pane = ct.getAttribute('data-pane');
          document.getElementById('console-stdout-view').hidden = pane !== 'output';
          document.getElementById('console-stderr-view').hidden = pane !== 'output';
          document.getElementById('console-tests-view').hidden = pane !== 'tests';
        });
      });

      window.switchConsoleTab = (pane) => {
        const ct = document.querySelector(`.console-tab[data-pane="${pane}"]`);
        if (ct) ct.click();
      };
    }

    initModals() {
      const inviteBtn = document.getElementById('open-invite-modal-btn');
      const inviteModal = document.getElementById('invite-modal');
      const closeInviteBtn = document.getElementById('close-invite-modal-btn');

      if (inviteBtn && inviteModal) {
        inviteBtn.addEventListener('click', () => {
          this.populateInviteLinks();
          inviteModal.hidden = false;
        });
      }

      if (closeInviteBtn && inviteModal) {
        closeInviteBtn.addEventListener('click', () => {
          inviteModal.hidden = true;
        });
      }

      // Copy invite buttons
      const copyCandidateBtn = document.getElementById('copy-candidate-link-btn');
      const copyInterviewerBtn = document.getElementById('copy-interviewer-link-btn');

      if (copyCandidateBtn) {
        copyCandidateBtn.addEventListener('click', () => {
          const input = document.getElementById('candidate-link-input');
          if (input) {
            navigator.clipboard.writeText(input.value);
            window.showToast('Candidate link copied to clipboard');
          }
        });
      }

      if (copyInterviewerBtn) {
        copyInterviewerBtn.addEventListener('click', () => {
          const input = document.getElementById('interviewer-link-input');
          if (input) {
            navigator.clipboard.writeText(input.value);
            window.showToast('Interviewer link copied to clipboard');
          }
        });
      }
    }

    populateInviteLinks() {
      const base = `${window.location.protocol}//${window.location.host}${window.location.pathname}`;
      const candInput = document.getElementById('candidate-link-input');
      const intInput = document.getElementById('interviewer-link-input');

      if (candInput) {
        candInput.value = `${base}?room=${this.roomId}&role=candidate`;
      }
      if (intInput) {
        intInput.value = `${base}?room=${this.roomId}&role=interviewer&token=${this.token}`;
      }
    }

    initChat() {
      const chatInput = document.getElementById('chat-text-input');
      const chatSendBtn = document.getElementById('chat-send-btn');
      const chatAskAiBtn = document.getElementById('chat-ask-ai-btn');
      const aiChips = document.querySelectorAll('.ai-chip-btn');

      const triggerAiQuery = async (questionText) => {
        const text = questionText.trim();
        if (!text) return;

        const timeStr = this.timerDisplay ? this.timerDisplay.textContent : '00:00';
        const userAuthor = this.role === 'interviewer' ? 'Interviewer' : 'Candidate';
        const msgId = `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

        // 1. Post user message immediately to local UI
        const userEvt = {
          id: msgId,
          text,
          timeStr,
          author: userAuthor,
          flag: 'chat'
        };
        this.appendTimelineEvent(userEvt);

        // Broadcast to peers if connected
        window.socketClient.send('TIMELINE_EVENT', userEvt);

        // 2. Add temporary thinking indicator
        const thinkingEvt = {
          id: 'thinking-indicator-entry',
          text: 'Analyzing problem context and formulating guidance...',
          timeStr,
          author: 'AI Mentor',
          flag: 'ai-thinking'
        };
        this.appendTimelineEvent(thinkingEvt);

        try {
          const res = await fetch('/api/ai/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              question: text.replace(/^@ai\s*/i, ''),
              problemId: this.currentProblem ? this.currentProblem.id : 'two-sum',
              code: window.editor ? window.editor.getCode() : '',
              language: this.languageSelect ? this.languageSelect.value : 'python'
            })
          });

          // Remove thinking indicator
          const thinkingEl = document.getElementById('ai-thinking-indicator');
          if (thinkingEl) thinkingEl.remove();

          if (!res.ok) {
            throw new Error(`Server returned HTTP ${res.status}`);
          }

          const data = await res.json();
          const aiResponseText = data.answer || 'I am ready to help. Please ask any question about the problem or implementation.';

          const aiEvt = {
            id: `ai-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            text: aiResponseText,
            timeStr,
            author: 'AI Mentor',
            provider: data.provider || 'AI Assistant',
            flag: 'ai'
          };

          // Render AI message immediately to local UI
          this.appendTimelineEvent(aiEvt);

          // Broadcast to peers
          window.socketClient.send('TIMELINE_EVENT', aiEvt);
        } catch (err) {
          const thinkingEl = document.getElementById('ai-thinking-indicator');
          if (thinkingEl) thinkingEl.remove();

          this.appendTimelineEvent({
            id: `ai-err-${Date.now()}`,
            text: `Failed to query AI Mentor: ${err.message}`,
            timeStr,
            author: 'AI Mentor',
            flag: 'ai'
          });
        }
      };

      const send = () => {
        if (!chatInput) return;
        const text = chatInput.value.trim();
        if (!text) return;

        chatInput.value = '';

        // If explicitly addressing AI or asking a question
        const isQuestion = /^@ai\b/i.test(text) || text.endsWith('?') || /^(how|why|what|can you|hint|help)\b/i.test(text);

        if (isQuestion) {
          triggerAiQuery(text);
          return;
        }

        const timeStr = this.timerDisplay ? this.timerDisplay.textContent : '00:00';
        const userEvt = {
          id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          text,
          timeStr,
          author: this.role === 'interviewer' ? 'Interviewer' : 'Candidate',
          flag: 'chat'
        };

        // Render immediately in local UI
        this.appendTimelineEvent(userEvt);

        // Broadcast to WebSocket peers
        window.socketClient.send('TIMELINE_EVENT', userEvt);
      };

      if (chatSendBtn) chatSendBtn.addEventListener('click', send);
      if (chatAskAiBtn) {
        chatAskAiBtn.addEventListener('click', () => {
          if (!chatInput) return;
          const text = chatInput.value.trim() || 'Can you give me a hint on how to approach this problem?';
          chatInput.value = '';
          triggerAiQuery(text);
        });
      }

      if (chatInput) {
        chatInput.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') send();
        });
      }

      // Quick Prompt Chips
      aiChips.forEach(chip => {
        chip.addEventListener('click', () => {
          const prompt = chip.getAttribute('data-prompt');
          if (prompt) triggerAiQuery(prompt);
        });
      });
    }

    renderTimeline(events) {
      const container = document.getElementById('chat-messages-scroll');
      if (!container) return;
      container.innerHTML = '';
      if (!this.renderedEventIds) this.renderedEventIds = new Set();
      this.renderedEventIds.clear();
      for (const evt of events) {
        this.appendTimelineEvent(evt);
      }
    }

    appendTimelineEvent(evt) {
      const container = document.getElementById('chat-messages-scroll');
      if (!container || !evt) return;

      if (!this.renderedEventIds) this.renderedEventIds = new Set();
      const dedupeKey = evt.id || `${evt.author}-${evt.timeStr}-${evt.text}`;
      if (evt.flag !== 'ai-thinking' && this.renderedEventIds.has(dedupeKey)) {
        return;
      }
      if (evt.flag !== 'ai-thinking') {
        this.renderedEventIds.add(dedupeKey);
      }

      const bubble = document.createElement('div');
      if (evt.flag === 'info' || evt.flag === 'join' || evt.flag === 'leave') {
        bubble.className = 'timeline-system-entry';
        bubble.textContent = `[${evt.timeStr || '00:00'}] ${evt.text}`;
      } else if (evt.flag === 'ai-thinking') {
        bubble.id = 'ai-thinking-indicator';
        bubble.className = 'timeline-system-entry';
        bubble.style.color = '#60a5fa';
        bubble.textContent = `[${evt.timeStr || '00:00'}] AI Mentor is analyzing...`;
      } else if (evt.flag === 'ai' || evt.author === 'AI Mentor') {
        bubble.className = 'chat-bubble ai-mentor';
        const formattedHtml = this.formatMarkdown(evt.text);
        bubble.innerHTML = `
          <div class="chat-bubble-header">
            <span class="chat-author">AI Mentor</span>
            ${evt.provider ? `<span class="chat-provider-tag">(${evt.provider})</span>` : ''}
            <span class="chat-time">${evt.timeStr || '00:00'}</span>
          </div>
          <div class="chat-text">${formattedHtml}</div>
        `;
      } else {
        bubble.className = 'chat-bubble';
        bubble.innerHTML = `
          <div class="chat-bubble-header">
            <span class="chat-author">${evt.author || 'User'}</span>
            <span class="chat-time">${evt.timeStr || '00:00'}</span>
          </div>
          <div class="chat-text">${this.formatMarkdown(evt.text)}</div>
        `;
      }
      container.appendChild(bubble);
      container.scrollTop = container.scrollHeight;
    }
  }

  window.addEventListener('DOMContentLoaded', () => {
    new InterviewApp();
  });
})();
