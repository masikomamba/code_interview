/**
 * Real-Time Collaborative Code Interview Platform
 * Interviewer Private Rubric & Observation Manager
 */

class InterviewerManager {
  constructor() {
    this.notesInput = document.getElementById('interviewer-notes-input');
    this.syncIndicator = document.getElementById('notes-sync-indicator');
    this.sliders = {
      dsa: document.getElementById('slider-rubric-dsa'),
      ps: document.getElementById('slider-rubric-ps'),
      quality: document.getElementById('slider-rubric-quality'),
      comm: document.getElementById('slider-rubric-comm')
    };
    this.scoreDisplays = {
      dsa: document.getElementById('val-rubric-dsa'),
      ps: document.getElementById('val-rubric-ps'),
      quality: document.getElementById('val-rubric-quality'),
      comm: document.getElementById('val-rubric-comm')
    };

    this.saveTimeout = null;
    this.initEvents();
  }

  initEvents() {
    // Slider listeners
    for (const [key, slider] of Object.entries(this.sliders)) {
      if (slider) {
        slider.addEventListener('input', () => {
          if (this.scoreDisplays[key]) {
            this.scoreDisplays[key].textContent = slider.value;
          }
          this.triggerSave();
        });
      }
    }

    // Notes textarea
    if (this.notesInput) {
      this.notesInput.addEventListener('input', () => {
        if (this.syncIndicator) this.syncIndicator.textContent = 'Saving...';
        this.triggerSave();
      });
    }

    // Quick observation buttons
    const quickButtons = document.querySelectorAll('.quick-flag-btn');
    quickButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const flagText = btn.getAttribute('data-flag') || btn.textContent.trim();
        this.logObservation(flagText, btn.classList.contains('positive') ? 'positive' : 'caution');
      });
    });
  }

  setScoresAndNotes(data) {
    if (!data) return;
    const scores = data.scores || {};
    if (scores.dsa && this.sliders.dsa) {
      this.sliders.dsa.value = scores.dsa;
      if (this.scoreDisplays.dsa) this.scoreDisplays.dsa.textContent = scores.dsa;
    }
    if (scores.problemSolving && this.sliders.ps) {
      this.sliders.ps.value = scores.problemSolving;
      if (this.scoreDisplays.ps) this.scoreDisplays.ps.textContent = scores.problemSolving;
    }
    if (scores.codeQuality && this.sliders.quality) {
      this.sliders.quality.value = scores.codeQuality;
      if (this.scoreDisplays.quality) this.scoreDisplays.quality.textContent = scores.codeQuality;
    }
    if (scores.communication && this.sliders.comm) {
      this.sliders.comm.value = scores.communication;
      if (this.scoreDisplays.comm) this.scoreDisplays.comm.textContent = scores.communication;
    }
    if (data.notes && this.notesInput) {
      this.notesInput.value = data.notes;
    }
  }

  getScoresAndNotes() {
    return {
      scores: {
        dsa: parseFloat(this.sliders.dsa ? this.sliders.dsa.value : 4),
        problemSolving: parseFloat(this.sliders.ps ? this.sliders.ps.value : 4),
        codeQuality: parseFloat(this.sliders.quality ? this.sliders.quality.value : 4),
        communication: parseFloat(this.sliders.comm ? this.sliders.comm.value : 4)
      },
      notes: this.notesInput ? this.notesInput.value : ''
    };
  }

  triggerSave() {
    clearTimeout(this.saveTimeout);
    this.saveTimeout = setTimeout(() => {
      const payload = this.getScoresAndNotes();
      window.socketClient.send('INTERVIEWER_NOTES_UPDATE', {
        notesData: payload
      });
      if (this.syncIndicator) this.syncIndicator.textContent = 'Saved to session';
    }, 400);
  }

  logObservation(text, flag = 'note') {
    const timerEl = document.getElementById('timer-display');
    const timeStr = timerEl ? timerEl.textContent.trim() : '00:00';

    window.socketClient.send('TIMELINE_EVENT', {
      text,
      timeStr,
      author: 'Interviewer',
      flag
    });

    // Also append to private notes automatically
    if (this.notesInput) {
      const noteEntry = `[${timeStr}] ${text}\n`;
      this.notesInput.value += noteEntry;
      this.triggerSave();
    }
  }
}

window.InterviewerManager = InterviewerManager;
