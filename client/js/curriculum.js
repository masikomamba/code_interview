/**
 * Real-Time Collaborative Code Interview Platform
 * DSA Curriculum, Progress Tracker, 3-Day Inactivity Reminders & Editorial Solution Engine
 */

class CurriculumManager {
  constructor() {
    this.curriculumContainer = document.getElementById('curriculum-content-body');
    this.inactivityBanner = document.getElementById('inactivity-reminder-banner');
    this.streakDisplay = document.getElementById('nav-streak-display');
    this.solvedCountDisplay = document.getElementById('nav-solved-count');

    // Editorial Modal Elements
    this.editorialModal = document.getElementById('editorial-modal');
    this.editorialCodeEl = document.getElementById('editorial-code-display');
    this.editorialExplanationEl = document.getElementById('editorial-explanation-display');
    this.editorialTitleEl = document.getElementById('editorial-problem-title');
    this.revealSolutionBtn = document.getElementById('reveal-solution-btn');
    this.closeEditorialBtn = document.getElementById('close-editorial-modal-btn');
    this.copySolutionToEditorBtn = document.getElementById('copy-solution-to-editor-btn');

    this.curriculumData = [];
    this.progress = {
      solvedProblemIds: JSON.parse(localStorage.getItem('dsa_solved') || '[]'),
      attemptedProblemIds: JSON.parse(localStorage.getItem('dsa_attempted') || '[]'),
      lastPracticeTimestamp: parseInt(localStorage.getItem('dsa_last_practice') || Date.now().toString(), 10),
      streakDays: parseInt(localStorage.getItem('dsa_streak') || '1', 10)
    };

    this.currentEditorialSolution = null;
    this.username = localStorage.getItem('dsa_user') || 'masiko';
    this.selectedModuleId = localStorage.getItem('dsa_active_module') || null;

    this.init();
  }

  async init() {
    this.initEvents();
    this.updateProgressUI();
    await this.syncProgressFromDatabase();
    this.checkInactivityAndStreak();
    await this.loadCurriculum();
    this.requestNotificationPermission();
  }

  initEvents() {
    if (this.revealSolutionBtn) {
      this.revealSolutionBtn.addEventListener('click', () => this.revealSolution());
    }

    if (this.closeEditorialBtn) {
      this.closeEditorialBtn.addEventListener('click', () => {
        if (this.editorialModal) this.editorialModal.hidden = true;
      });
    }

    if (this.copySolutionToEditorBtn) {
      this.copySolutionToEditorBtn.addEventListener('click', () => {
        if (this.currentEditorialSolution && window.editor) {
          window.editor.setCode(this.currentEditorialSolution.python);
          window.editor.broadcastCodeChange();
          if (this.editorialModal) this.editorialModal.hidden = true;
          if (window.showToast) window.showToast('Editorial solution copied into editor');
        }
      });
    }

    // Inactivity Banner Dismiss
    const dismissBtn = document.getElementById('dismiss-inactivity-btn');
    if (dismissBtn && this.inactivityBanner) {
      dismissBtn.addEventListener('click', () => {
        this.inactivityBanner.hidden = true;
      });
    }

    const practiceNowBtn = document.getElementById('practice-now-btn');
    if (practiceNowBtn) {
      practiceNowBtn.addEventListener('click', () => {
        if (this.inactivityBanner) this.inactivityBanner.hidden = true;
        this.loadRecommendedProblem();
      });
    }
  }

  async loadCurriculum() {
    try {
      const res = await fetch('/api/curriculum');
      this.curriculumData = await res.json();
      this.renderCurriculum();
    } catch (err) {
      console.error('[Curriculum] Failed to load curriculum:', err);
    }
  }

  renderCurriculum() {
    if (!this.curriculumContainer) return;
    if (this.selectedModuleId) {
      const module = this.curriculumData.find(m => m.id === this.selectedModuleId);
      if (module) {
        this.renderModulePage(module);
        return;
      }
      this.selectedModuleId = null;
    }
    this.renderMainHub();
  }

  renderMainHub() {
    const allProblems = this.curriculumData.flatMap(m => m.problems || []);
    const totalProblems = allProblems.length;
    const solvedCount = allProblems.filter(p => this.progress.solvedProblemIds.includes(p.id)).length;
    const percent = Math.round((solvedCount / Math.max(1, totalProblems)) * 100);

    this.curriculumContainer.innerHTML = `
      <div class="academy-hub">
        <!-- Hub Hero Overview -->
        <div class="academy-hero-card">
          <div class="academy-hero-title-row">
            <span class="academy-hero-title">Python DSA Academy</span>
            <span class="difficulty-badge easy">${this.curriculumData.length} Core Modules</span>
          </div>
          <p class="academy-hero-subtitle">
            Master fundamental data structures and algorithmic patterns in Python with curated LeetCode questions and function toolkits.
          </p>

          <div class="academy-overall-progress">
            <div class="academy-progress-label-row">
              <span class="academy-progress-title">Curriculum Mastery</span>
              <span class="academy-progress-stats">${solvedCount} / ${totalProblems} Solved (${percent}%)</span>
            </div>
            <div class="academy-progress-track">
              <div class="academy-progress-bar" style="width: ${percent}%;"></div>
            </div>
          </div>
        </div>

        <!-- Modules Directory Grid -->
        <div class="academy-modules-grid">
          ${this.curriculumData.map(mod => {
            const modProblems = mod.problems || [];
            const modSolved = modProblems.filter(p => this.progress.solvedProblemIds.includes(p.id)).length;
            const isMastered = modSolved === modProblems.length && modProblems.length > 0;

            return `
              <div class="academy-module-card" data-open-module="${mod.id}" title="Click to open ${mod.title} study page">
                <div class="academy-module-header">
                  <span class="academy-module-title">${mod.title}</span>
                  <span class="academy-module-badge ${isMastered ? 'mastered' : ''}">${isMastered ? 'Mastered' : `${modSolved}/${modProblems.length}`}</span>
                </div>
                <p class="academy-module-desc">${mod.description}</p>
                <div class="academy-module-meta-row">
                  <div class="academy-module-counts">
                    <span>${(mod.pythonToolkit || []).length} Python Tools</span>
                    <span>•</span>
                    <span>${modProblems.length} Problems</span>
                  </div>
                  <span class="academy-module-open-link">
                    Explore Page
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                  </span>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;

    // Click on module card to navigate to its dedicated page
    const cards = this.curriculumContainer.querySelectorAll('.academy-module-card[data-open-module]');
    cards.forEach(c => {
      c.addEventListener('click', () => {
        const modId = c.getAttribute('data-open-module');
        this.openModule(modId);
      });
    });
  }

  renderModulePage(module) {
    const modProblems = module.problems || [];
    const modSolved = modProblems.filter(p => this.progress.solvedProblemIds.includes(p.id)).length;

    this.curriculumContainer.innerHTML = `
      <div class="data-structure-page">
        <!-- Navigation Bar / Back button -->
        <div class="ds-nav-bar">
          <button type="button" class="ds-back-btn" id="ds-back-to-hub-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
            All Data Structures
          </button>
          <span style="font-size: 0.72rem; color: var(--text-muted); font-family: var(--font-mono);">
            Module: ${module.id}
          </span>
        </div>

        <!-- Module Hero Section -->
        <div class="ds-hero-section">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <h2 class="ds-hero-title">${module.title}</h2>
            <span class="difficulty-badge easy">${modSolved} / ${modProblems.length} Solved</span>
          </div>
          <p class="ds-hero-desc">${module.description}</p>
          <div class="ds-stats-strip">
            <span class="ds-stat-pill">${(module.pythonToolkit || []).length} Python Functions</span>
            <span class="ds-stat-pill">${modProblems.length} Practice Problems</span>
            <span class="ds-stat-pill">${(module.keyPatterns || []).length} Core Patterns</span>
          </div>
        </div>

        <!-- Part 1: Python Functions & Methods to Know -->
        <div class="toolkit-section">
          <span class="toolkit-section-title">Must-Know Python Functions & Methods</span>
          <div class="toolkit-cards-list">
            ${(module.pythonToolkit || []).map((tool, idx) => `
              <div class="toolkit-card">
                <div class="toolkit-card-top">
                  <span class="toolkit-fn-name">${tool.name}</span>
                  <span class="toolkit-complexity-badge">${tool.complexity}</span>
                </div>
                <div class="toolkit-syntax-code" id="syntax-code-${idx}">${tool.syntax}</div>
                <div class="toolkit-desc">${tool.description}</div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Part 2: Core Algorithmic Patterns & Mental Models -->
        ${module.keyPatterns && module.keyPatterns.length > 0 ? `
          <div class="patterns-section">
            <span class="toolkit-section-title">Core Interview Patterns</span>
            ${module.keyPatterns.map(pat => `
              <div class="pattern-item">${pat}</div>
            `).join('')}
          </div>
        ` : ''}

        <!-- Part 3: Curated LeetCode Practice Problems -->
        <div class="toolkit-section">
          <span class="toolkit-section-title">Topic Practice Problems</span>
          <div class="module-questions-list">
            ${modProblems.map(prob => {
              const isSolved = this.progress.solvedProblemIds.includes(prob.id);
              return `
                <div class="curriculum-question-item">
                  <span class="question-status-circle ${isSolved ? 'solved' : ''}" title="${isSolved ? 'Solved' : 'Not yet solved'}"></span>
                  <div style="flex: 1; display: flex; flex-direction: column; gap: 2px;">
                    <span class="curriculum-question-name">${prob.title}</span>
                    <span style="font-size: 0.7rem; color: var(--text-muted); font-family: var(--font-mono);">
                      Target: ${prob.optimalComplexity ? `${prob.optimalComplexity.time} time, ${prob.optimalComplexity.space} space` : 'O(N)'}
                    </span>
                  </div>
                  <span class="difficulty-badge ${prob.difficulty.toLowerCase()}">${prob.difficulty}</span>
                  <div class="curriculum-question-actions">
                    <button type="button" class="btn btn-secondary curriculum-practice-btn" data-problem-id="${prob.id}" title="Open problem in code editor">
                      Practice
                    </button>
                    <button type="button" class="btn btn-secondary curriculum-solution-btn" data-problem-id="${prob.id}" title="View editorial solution">
                      Solution
                    </button>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Part 4: Ask AI Mentor for Coaching -->
        <div style="background-color: var(--bg-surface); border: 1px dashed var(--border-medium); border-radius: var(--radius-sm); padding: 12px; display: flex; flex-direction: column; gap: 8px;">
          <span style="font-size: 0.76rem; font-weight: 700; color: #60a5fa; text-transform: uppercase;">AI Coaching on ${module.title}</span>
          <p style="font-size: 0.78rem; color: var(--text-secondary); margin: 0;">Need clarification on when to use this data structure or how to optimize? Ask the AI Mentor in chat.</p>
          <button type="button" class="btn btn-secondary ds-ask-ai-mentor-btn" data-mod-title="${module.title}" style="align-self: flex-start; color: #60a5fa; border-color: #3b82f6;">
            Ask AI Mentor about ${module.title}
          </button>
        </div>

      </div>
    `;

    // Back to hub button
    const backBtn = document.getElementById('ds-back-to-hub-btn');
    if (backBtn) {
      backBtn.addEventListener('click', () => this.backToHub());
    }

    // Practice buttons
    const practiceBtns = this.curriculumContainer.querySelectorAll('.curriculum-practice-btn');
    practiceBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const problemId = btn.getAttribute('data-problem-id');
        this.selectProblemInApp(problemId);
      });
    });

    // Editorial Solution buttons
    const solutionBtns = this.curriculumContainer.querySelectorAll('.curriculum-solution-btn');
    solutionBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const problemId = btn.getAttribute('data-problem-id');
        this.revealSolution(problemId);
      });
    });

    // Ask AI Mentor button
    const askAiBtn = this.curriculumContainer.querySelector('.ds-ask-ai-mentor-btn');
    if (askAiBtn) {
      askAiBtn.addEventListener('click', () => {
        const title = askAiBtn.getAttribute('data-mod-title');
        const chatInput = document.getElementById('chat-text-input');
        const chatAskAiBtn = document.getElementById('chat-ask-ai-btn');
        if (chatInput && chatAskAiBtn) {
          chatInput.value = `Can you explain the key patterns and Python idioms I need to know for ${title}?`;
          chatAskAiBtn.click();
          if (window.showToast) window.showToast(`Asking AI Mentor about ${title}...`);
        }
      });
    }
  }

  openModule(moduleId) {
    this.selectedModuleId = moduleId;
    localStorage.setItem('dsa_active_module', moduleId);
    this.renderCurriculum();
    if (this.curriculumContainer) this.curriculumContainer.scrollTop = 0;
  }

  backToHub() {
    this.selectedModuleId = null;
    localStorage.removeItem('dsa_active_module');
    this.renderCurriculum();
    if (this.curriculumContainer) this.curriculumContainer.scrollTop = 0;
  }

  selectProblemInApp(problemId) {
    const probSelect = document.getElementById('problem-select');
    if (probSelect) {
      probSelect.value = problemId;
      probSelect.dispatchEvent(new Event('change'));
    }

    // Force Python language
    const langSelect = document.getElementById('language-select');
    if (langSelect) {
      langSelect.value = 'python';
      langSelect.dispatchEvent(new Event('change'));
    }

    // Switch left panel back to Problem view
    const problemTab = document.querySelector('.panel-tab[data-view="problem"]');
    if (problemTab) problemTab.click();

    if (window.showToast) window.showToast(`Loaded ${problemId} in Python 3`);
  }

  async revealSolution(problemId = null) {
    const targetId = problemId || window.currentProblemId || 'two-sum';
    try {
      const res = await fetch(`/api/problems/${targetId}/solution`);
      if (!res.ok) {
        alert('Editorial solution is not available for this problem yet.');
        return;
      }
      const data = await res.json();
      this.currentEditorialSolution = data;

      if (this.editorialTitleEl) {
        this.editorialTitleEl.textContent = data.title || targetId;
      }
      if (this.editorialCodeEl) {
        this.editorialCodeEl.textContent = data.python;
      }
      if (this.editorialExplanationEl) {
        this.editorialExplanationEl.textContent = data.explanation;
      }

      if (this.editorialModal) {
        this.editorialModal.hidden = false;
      }
    } catch (err) {
      console.error('[Curriculum] Error fetching solution:', err);
    }
  }

  markProblemSolved(problemId) {
    if (!this.progress.solvedProblemIds.includes(problemId)) {
      this.progress.solvedProblemIds.push(problemId);
    }
    this.recordActivity(problemId, 'solved');
    this.updateProgressUI();
    this.renderCurriculum();
  }

  async syncProgressFromDatabase() {
    try {
      const res = await fetch(`/api/progress?username=${encodeURIComponent(this.username)}`);
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.solvedProblemIds)) {
          this.progress.solvedProblemIds = data.solvedProblemIds;
          this.progress.attemptedProblemIds = data.attemptedProblemIds || [];
          this.progress.streakDays = data.streakDays || 1;
          this.progress.lastPracticeTimestamp = data.lastPracticeTimestamp || Date.now();

          localStorage.setItem('dsa_solved', JSON.stringify(this.progress.solvedProblemIds));
          localStorage.setItem('dsa_attempted', JSON.stringify(this.progress.attemptedProblemIds));
          localStorage.setItem('dsa_streak', this.progress.streakDays.toString());
          localStorage.setItem('dsa_last_practice', this.progress.lastPracticeTimestamp.toString());
          this.updateProgressUI();
        }
      }
    } catch (err) {
      console.warn('[Curriculum] Could not reach database, using local cached progress:', err);
    }
  }

  async recordActivity(problemId, status = 'attempted') {
    const now = Date.now();
    const daysSince = Math.floor((now - this.progress.lastPracticeTimestamp) / (1000 * 60 * 60 * 24));
    
    if (daysSince === 1) {
      this.progress.streakDays += 1;
    } else if (daysSince > 1) {
      this.progress.streakDays = 1;
    }

    this.progress.lastPracticeTimestamp = now;

    // Save locally
    localStorage.setItem('dsa_solved', JSON.stringify(this.progress.solvedProblemIds));
    localStorage.setItem('dsa_attempted', JSON.stringify(this.progress.attemptedProblemIds));
    localStorage.setItem('dsa_last_practice', now.toString());
    localStorage.setItem('dsa_streak', this.progress.streakDays.toString());

    // Sync to database
    try {
      const res = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: this.username,
          problemId,
          status
        })
      });
      const data = await res.json();
      if (data.progress) {
        this.progress.solvedProblemIds = data.progress.solvedProblemIds || this.progress.solvedProblemIds;
        this.progress.streakDays = data.progress.streakDays || this.progress.streakDays;
        this.updateProgressUI();
      }
    } catch (_) {}
  }

  checkInactivityAndStreak() {
    const now = Date.now();
    const diffMs = now - this.progress.lastPracticeTimestamp;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    // Show 3-Day Inactivity Banner if >= 3 days
    if (diffDays >= 3 && this.inactivityBanner) {
      this.inactivityBanner.hidden = false;
      const countEl = document.getElementById('inactivity-days-count');
      if (countEl) countEl.textContent = `${diffDays} days`;

      // Trigger Web Notification if allowed
      this.sendBrowserNotification(`DSA Practice Reminder: It has been ${diffDays} days since your last problem. Solve a quick problem today to build your skills!`);
    } else if (this.inactivityBanner) {
      this.inactivityBanner.hidden = true;
    }
  }

  updateProgressUI() {
    if (this.streakDisplay) {
      this.streakDisplay.textContent = `Streak: ${this.progress.streakDays} Day${this.progress.streakDays === 1 ? '' : 's'}`;
    }
    if (this.solvedCountDisplay) {
      this.solvedCountDisplay.textContent = `Solved: ${this.progress.solvedProblemIds.length}`;
    }
  }

  loadRecommendedProblem() {
    // Pick an unsolved problem from curriculum
    const allProbs = this.curriculumData.flatMap(c => c.problems);
    const unsolved = allProbs.find(p => !this.progress.solvedProblemIds.includes(p.id));
    if (unsolved) {
      this.selectProblemInApp(unsolved.id);
    } else {
      this.selectProblemInApp('two-sum');
    }
  }

  requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }

  sendBrowserNotification(msg) {
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification('CODEINTERVIEW DSA Practice', {
          body: msg,
          icon: '/favicon.ico'
        });
      } catch (_) {}
    }
  }
}

window.CurriculumManager = CurriculumManager;
