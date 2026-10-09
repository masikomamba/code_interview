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

    this.init();
  }

  async init() {
    this.initEvents();
    this.checkInactivityAndStreak();
    this.updateProgressUI();
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
    this.curriculumContainer.innerHTML = this.curriculumData.map(module => `
      <div class="curriculum-module-card">
        <div class="curriculum-module-header">
          <span class="curriculum-module-title">${module.title}</span>
        </div>
        <p class="curriculum-module-desc">${module.description}</p>

        <!-- Python Functions to Know -->
        <div class="toolkit-section">
          <span class="toolkit-section-title">Python Functions & Methods to Know</span>
          <div class="toolkit-cards-list">
            ${(module.pythonToolkit || []).map(tool => `
              <div class="toolkit-card">
                <div class="toolkit-card-top">
                  <span class="toolkit-fn-name">${tool.name}</span>
                  <span class="toolkit-complexity-badge">${tool.complexity}</span>
                </div>
                <div class="toolkit-syntax-code">${tool.syntax}</div>
                <div class="toolkit-desc">${tool.description}</div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Topic Practice Questions -->
        <div class="toolkit-section">
          <span class="toolkit-section-title">Topic Practice Questions</span>
          <div class="module-questions-list">
            ${(module.problems || []).map(prob => {
              const isSolved = this.progress.solvedProblemIds.includes(prob.id);
              return `
                <div class="curriculum-question-item">
                  <span class="question-status-circle ${isSolved ? 'solved' : ''}" title="${isSolved ? 'Solved' : 'Not yet solved'}"></span>
                  <span class="curriculum-question-name">${prob.title}</span>
                  <span class="difficulty-badge ${prob.difficulty.toLowerCase()}">${prob.difficulty}</span>
                  <button type="button" class="btn btn-secondary curriculum-practice-btn" data-problem-id="${prob.id}">
                    Practice
                  </button>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    `).join('');

    // Attach click listeners to "Practice" buttons
    const practiceBtns = this.curriculumContainer.querySelectorAll('.curriculum-practice-btn');
    practiceBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const problemId = btn.getAttribute('data-problem-id');
        this.selectProblemInApp(problemId);
      });
    });
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

  async revealSolution() {
    const problemId = window.currentProblemId || 'two-sum';
    try {
      const res = await fetch(`/api/problems/${problemId}/solution`);
      if (!res.ok) {
        alert('Editorial solution is not available for this problem yet.');
        return;
      }
      const data = await res.json();
      this.currentEditorialSolution = data;

      if (this.editorialTitleEl) {
        const probTitle = document.getElementById('problem-heading-title');
        this.editorialTitleEl.textContent = probTitle ? probTitle.textContent : 'Solution Walkthrough';
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

  recordActivity(problemId, status = 'attempted') {
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

    // Sync to backend
    fetch('/api/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ problemId, status })
    }).catch(() => {});
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
