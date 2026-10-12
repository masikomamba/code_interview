/**
 * Real-Time Collaborative Code Interview Platform
 * Timed Coding Assessment Manager & Countdown Engine
 */

class AssessmentManager {
  constructor() {
    this.modal = document.getElementById('assessment-modal');
    this.openBtn = document.getElementById('open-assessment-btn');
    this.closeBtn = document.getElementById('close-assessment-modal-btn');
    this.startBtn = document.getElementById('start-assessment-btn');
    this.submitBtn = document.getElementById('submit-assessment-btn');
    this.abortBtn = document.getElementById('abort-assessment-btn');

    this.countdownPill = document.getElementById('assessment-countdown-pill');
    this.countdownDisplay = document.getElementById('assessment-countdown-display');
    this.sessionTimer = document.querySelector('.session-timer');
    this.revealSolutionBtn = document.getElementById('reveal-solution-btn');
    this.problemSelect = document.getElementById('assessment-problem-select');

    this.active = false;
    this.totalSeconds = 45 * 60; // Default 45 minutes
    this.remainingSeconds = 45 * 60;
    this.timerInterval = null;
    this.selectedDuration = 45; // Minutes
    this.lockSolution = true;
    this.problemId = 'two-sum';
    this.warned5Min = false;
    this.warned1Min = false;

    this.init();
  }

  init() {
    this.bindEvents();
    this.populateProblemList();
  }

  bindEvents() {
    if (this.openBtn) {
      this.openBtn.addEventListener('click', () => {
        if (this.active) {
          if (confirm('An assessment is already running. Would you like to view status or submit?')) {
            this.submitAssessment(false);
          }
          return;
        }
        this.openModal();
      });
    }

    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.closeModal());
    }

    if (this.startBtn) {
      this.startBtn.addEventListener('click', () => this.startAssessment());
    }

    if (this.submitBtn) {
      this.submitBtn.addEventListener('click', () => {
        if (confirm('Are you ready to submit your timed assessment for grading and AI evaluation?')) {
          this.submitAssessment(false);
        }
      });
    }

    if (this.abortBtn) {
      this.abortBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to abort the timed assessment? Progress will not be evaluated.')) {
          this.abortAssessment();
        }
      });
    }

    // Duration card clicks
    const durationCards = document.querySelectorAll('.preset-duration-card');
    durationCards.forEach(card => {
      card.addEventListener('click', () => {
        durationCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        const minutes = parseInt(card.getAttribute('data-minutes'), 10);
        if (!isNaN(minutes)) {
          this.selectedDuration = minutes;
        }
      });
    });

    // Custom duration input sync
    const customInput = document.getElementById('custom-duration-input');
    if (customInput) {
      customInput.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10);
        if (val >= 5 && val <= 180) {
          durationCards.forEach(c => c.classList.remove('active'));
          this.selectedDuration = val;
        }
      });
    }
  }

  populateProblemList() {
    if (!this.problemSelect) return;
    this.problemSelect.innerHTML = '<option value="current">Current Selected Problem</option><option value="random">Random LeetCode Problem</option>';

    fetch('/api/problems')
      .then(res => res.json())
      .then(problems => {
        this.allProblems = problems;
        problems.forEach(p => {
          const opt = document.createElement('option');
          opt.value = p.id;
          opt.textContent = `${p.title} (${p.difficulty})`;
          this.problemSelect.appendChild(opt);
        });
      })
      .catch(() => {});
  }

  openModal() {
    if (this.modal) {
      this.populateProblemList();
      this.modal.hidden = false;
    }
  }

  closeModal() {
    if (this.modal) this.modal.hidden = true;
  }

  startAssessment() {
    this.closeModal();

    const lockSolutionCheckbox = document.getElementById('lock-solutions-check');
    this.lockSolution = lockSolutionCheckbox ? lockSolutionCheckbox.checked : true;

    // Determine problem
    let chosenProblemId = this.problemSelect ? this.problemSelect.value : 'current';
    if (chosenProblemId === 'current') {
      chosenProblemId = window.currentProblemId || 'two-sum';
    } else if (chosenProblemId === 'random' && this.allProblems && this.allProblems.length > 0) {
      const rand = this.allProblems[Math.floor(Math.random() * this.allProblems.length)];
      chosenProblemId = rand.id;
    }

    this.problemId = chosenProblemId;

    // Load problem into app
    const appProblemSelect = document.getElementById('problem-select');
    if (appProblemSelect && appProblemSelect.value !== chosenProblemId) {
      appProblemSelect.value = chosenProblemId;
      appProblemSelect.dispatchEvent(new Event('change'));
    }

    // Initialize timers
    this.totalSeconds = this.selectedDuration * 60;
    this.remainingSeconds = this.totalSeconds;
    this.warned5Min = false;
    this.warned1Min = false;
    this.active = true;

    // UI Updates
    if (this.countdownPill) this.countdownPill.hidden = false;
    if (this.submitBtn) this.submitBtn.hidden = false;
    if (this.abortBtn) this.abortBtn.hidden = false;
    if (this.openBtn) this.openBtn.hidden = true;
    if (this.sessionTimer) this.sessionTimer.hidden = true;

    // Lock Solution button if strict mode
    if (this.lockSolution && this.revealSolutionBtn) {
      this.revealSolutionBtn.disabled = true;
      this.revealSolutionBtn.style.opacity = '0.5';
      this.revealSolutionBtn.title = 'Solution walkthrough locked during timed assessment';
    }

    this.updateCountdownDisplay();

    // Start interval
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => this.tick(), 1000);

    // Announce to timeline
    window.socketClient.send('TIMELINE_EVENT', {
      text: `Timed Coding Assessment started! Time limit: ${this.selectedDuration} minutes.`,
      author: 'Assessment Engine',
      flag: 'info'
    });

    if (window.showToast) {
      window.showToast(`Timed Assessment started: ${this.selectedDuration} minutes remaining.`);
    }
  }

  tick() {
    if (!this.active) return;
    this.remainingSeconds--;

    this.updateCountdownDisplay();

    // 5-minute warning
    if (this.remainingSeconds === 300 && !this.warned5Min) {
      this.warned5Min = true;
      if (this.countdownPill) {
        this.countdownPill.classList.add('warning');
      }
      if (window.showToast) {
        window.showToast('5 minutes remaining in your coding assessment!');
      }
    }

    // 1-minute warning
    if (this.remainingSeconds === 60 && !this.warned1Min) {
      this.warned1Min = true;
      if (this.countdownPill) {
        this.countdownPill.classList.remove('warning');
        this.countdownPill.classList.add('danger');
      }
      if (window.showToast) {
        window.showToast('1 minute remaining! Finalize your solution and run tests.');
      }
    }

    // Time expired
    if (this.remainingSeconds <= 0) {
      clearInterval(this.timerInterval);
      if (window.showToast) {
        window.showToast('Time has expired! Submitting assessment for automated grading.');
      }
      this.submitAssessment(true);
    }
  }

  updateCountdownDisplay() {
    if (!this.countdownDisplay) return;
    const mins = Math.floor(Math.max(0, this.remainingSeconds) / 60);
    const secs = Math.max(0, this.remainingSeconds) % 60;
    const str = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    this.countdownDisplay.textContent = str;

    // Update browser tab title
    document.title = `[${str}] Assessment - CODEINTERVIEW`;
  }

  async submitAssessment(isExpired = false) {
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.active = false;

    const timeSpentSeconds = this.totalSeconds - Math.max(0, this.remainingSeconds);
    const timeSpentMinutes = (timeSpentSeconds / 60).toFixed(1);

    // Reset UI state
    if (this.countdownPill) {
      this.countdownPill.hidden = true;
      this.countdownPill.classList.remove('warning', 'danger');
    }
    if (this.submitBtn) this.submitBtn.hidden = true;
    if (this.abortBtn) this.abortBtn.hidden = true;
    if (this.openBtn) this.openBtn.hidden = false;
    if (this.sessionTimer) this.sessionTimer.hidden = false;

    // Unlock Solution button
    if (this.revealSolutionBtn) {
      this.revealSolutionBtn.disabled = false;
      this.revealSolutionBtn.style.opacity = '1';
      this.revealSolutionBtn.title = 'View optimal Python solution and editorial';
    }

    document.title = 'CODEINTERVIEW - Real-Time Collaborative Platform';

    if (window.showToast) {
      window.showToast(isExpired ? 'Time expired. Grading assessment...' : 'Evaluating assessment submission...');
    }

    // Execute test cases automatically
    let testResults = null;
    const currentCode = window.editor ? window.editor.getCode() : '';
    const langSelect = document.getElementById('language-select');
    const language = langSelect ? langSelect.value : 'python';

    try {
      const execRes = await fetch('/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language,
          code: currentCode,
          problemId: this.problemId
        })
      });

      if (execRes.ok) {
        testResults = await execRes.json();
      }
    } catch (err) {
      console.warn('[Assessment] Test execution error:', err.message);
    }

    // Call AI Evaluation with Assessment metrics
    try {
      const evalRes = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId: window.currentRoomId,
          problemId: this.problemId,
          code: currentCode,
          language,
          testResults,
          assessment: {
            isTimed: true,
            totalSeconds: this.totalSeconds,
            timeSpentSeconds,
            timeSpentMinutes,
            allocatedMinutes: this.selectedDuration,
            timedOut: isExpired
          }
        })
      });

      if (evalRes.ok) {
        const report = await evalRes.json();
        // Display AI report
        if (window.reportManager) {
          window.reportManager.renderReport(report);
          const modal = document.getElementById('report-modal');
          if (modal) modal.hidden = false;
        }

        // Mark problem solved if test pass rate is 100%
        if (testResults && testResults.summary && testResults.summary.passed === testResults.summary.total) {
          if (window.curriculumManager) {
            window.curriculumManager.markProblemSolved(this.problemId);
          }
        }
      }
    } catch (err) {
      console.error('[Assessment] Evaluation error:', err.message);
    }
  }

  abortAssessment() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.active = false;

    if (this.countdownPill) {
      this.countdownPill.hidden = true;
      this.countdownPill.classList.remove('warning', 'danger');
    }
    if (this.submitBtn) this.submitBtn.hidden = true;
    if (this.abortBtn) this.abortBtn.hidden = true;
    if (this.openBtn) this.openBtn.hidden = false;
    if (this.sessionTimer) this.sessionTimer.hidden = false;

    if (this.revealSolutionBtn) {
      this.revealSolutionBtn.disabled = false;
      this.revealSolutionBtn.style.opacity = '1';
    }

    document.title = 'CODEINTERVIEW - Real-Time Collaborative Platform';
    if (window.showToast) window.showToast('Timed Assessment aborted.');
  }
}

window.AssessmentManager = AssessmentManager;
