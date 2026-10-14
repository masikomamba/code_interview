/**
 * Real-Time Collaborative Code Interview Platform
 * Main Menu Hub & Platform Directory Controller
 * Zero Emojis - Zero Em Dashes
 */

class MainMenuController {
  constructor() {
    this.problems = [];
    this.topics = [
      { name: 'Arrays & Hashing', count: 8, samples: 'Two Sum, Group Anagrams, Top K Frequent' },
      { name: 'Two Pointers', count: 5, samples: 'Valid Palindrome, 3Sum, Container Water' },
      { name: 'Sliding Window', count: 4, samples: 'Buy Stock, Longest Substring, Min Window' },
      { name: 'Stack', count: 1, samples: 'Valid Parentheses' },
      { name: 'Binary Search', count: 2, samples: 'Find Min Rotated, Search Rotated' },
      { name: 'Linked List', count: 6, samples: 'Reverse List, Merge Lists, Reorder List' },
      { name: 'Trees', count: 11, samples: 'Invert Tree, LCA, Validate BST, Max Path Sum' },
      { name: 'Tries', count: 3, samples: 'Implement Trie, Word Search II' },
      { name: 'Heap / Priority Queue', count: 1, samples: 'Find Median from Data Stream' },
      { name: 'Backtracking', count: 2, samples: 'Combination Sum, Word Search' },
      { name: 'Graphs', count: 6, samples: 'Number of Islands, Clone Graph, Course Schedule' },
      { name: 'Advanced Graphs', count: 1, samples: 'Alien Dictionary' },
      { name: '1-D Dynamic Programming', count: 10, samples: 'Climbing Stairs, House Robber, Coin Change' },
      { name: '2-D Dynamic Programming', count: 2, samples: 'Unique Paths, Longest Common Subseq' },
      { name: 'Greedy', count: 2, samples: 'Maximum Subarray (Kadane), Jump Game' },
      { name: 'Intervals', count: 5, samples: 'Merge Intervals, Non-overlapping, Meeting Rooms' },
      { name: 'Math & Geometry', count: 3, samples: 'Rotate Image, Spiral Matrix, Set Zeroes' },
      { name: 'Bit Manipulation', count: 5, samples: 'Number of 1 Bits, Reverse Bits, Sum Integers' }
    ];

    this.cacheDom();
    this.bindEvents();
    this.fetchData();
  }

  cacheDom() {
    // Views
    this.mainMenuView = document.getElementById('view-main-menu-hub');
    this.problemMenuView = document.getElementById('view-menu-dashboard');
    this.workspaceGrid = document.querySelector('.workspace-grid');

    // Navigation buttons
    this.btnNavHome = document.getElementById('nav-btn-home');
    this.btnNavMenu = document.getElementById('nav-btn-menu');
    this.btnNavWorkspace = document.getElementById('nav-btn-workspace');
    this.brandTitle = document.getElementById('nav-brand-title') || document.querySelector('.brand-title');

    // Hero stats
    this.statProblems = document.getElementById('mm-stat-problems');
    this.statSolved = document.getElementById('mm-stat-solved');
    this.statStreak = document.getElementById('mm-stat-streak');
    this.statReadiness = document.getElementById('mm-stat-readiness');

    // Search
    this.searchInput = document.getElementById('mm-search-input');
    this.searchResults = document.getElementById('mm-search-results');

    // Topic container
    this.topicsContainer = document.getElementById('mm-topics-container');
  }

  bindEvents() {
    // Top Nav buttons
    if (this.btnNavHome) {
      this.btnNavHome.addEventListener('click', () => this.showMainMenu());
    }

    if (this.brandTitle) {
      this.brandTitle.addEventListener('click', () => this.showMainMenu());
    }

    if (this.btnNavMenu) {
      this.btnNavMenu.addEventListener('click', () => this.showNeetCodeRoadmap());
    }

    if (this.btnNavWorkspace) {
      this.btnNavWorkspace.addEventListener('click', () => this.showWorkspace());
    }

    // Main Menu Quick Action Buttons
    const btnResume = document.getElementById('mm-btn-resume');
    if (btnResume) {
      btnResume.addEventListener('click', () => this.showWorkspace());
    }

    const btnRoadmap = document.getElementById('mm-btn-roadmap');
    if (btnRoadmap) {
      btnRoadmap.addEventListener('click', () => this.showNeetCodeRoadmap());
    }

    const btnAssessment = document.getElementById('mm-btn-assessment');
    if (btnAssessment) {
      btnAssessment.addEventListener('click', () => this.launchAssessment());
    }

    const btnAcademy = document.getElementById('mm-btn-academy');
    if (btnAcademy) {
      btnAcademy.addEventListener('click', () => this.showWorkspace('curriculum'));
    }

    // Core Pillar Action Buttons
    document.querySelectorAll('[data-mm-action]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const action = e.currentTarget.dataset.mmAction;
        this.handlePillarAction(action);
      });
    });

    // Fast Search Bar
    if (this.searchInput) {
      this.searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
      document.addEventListener('click', (e) => {
        if (!e.target.closest('.mm-search-bar-section') && this.searchResults) {
          this.searchResults.hidden = true;
        }
      });
    }

    // Render Topics Grid
    this.renderTopicsGrid();

    // Re-render stats on auth change
    if (window.authService) {
      window.authService.onAuthChange(() => this.updateStats());
    }
  }

  async fetchData() {
    try {
      const res = await fetch('/api/problems');
      this.problems = await res.json();
      this.updateStats();
    } catch (err) {
      console.warn('Failed to fetch problems for main menu:', err);
    }
  }

  updateStats() {
    const solvedSet = this.getUserSolvedSet();
    const ncCount = this.problems.filter(p => p.isNeetCode75).length || 77;
    const solvedCount = solvedSet.size;
    const pct = Math.round((solvedCount / ncCount) * 100);

    if (this.statProblems) this.statProblems.textContent = `${ncCount}`;
    if (this.statSolved) this.statSolved.textContent = `${solvedCount}`;
    if (this.statReadiness) this.statReadiness.textContent = `${pct}%`;

    let streak = '1 Day';
    try {
      const user = window.authService ? window.authService.getCurrentUser() : null;
      if (user && user.streakDays) {
        streak = `${user.streakDays} Day${user.streakDays === 1 ? '' : 's'}`;
      }
    } catch (_) {}
    if (this.statStreak) this.statStreak.textContent = streak;
  }

  getUserSolvedSet() {
    try {
      if (window.curriculumService && window.curriculumService.progress) {
        return new Set(window.curriculumService.progress.solvedProblemIds || []);
      }
      const raw = localStorage.getItem('dsa_solved');
      if (raw) return new Set(JSON.parse(raw));
    } catch (_) {}
    return new Set();
  }

  renderTopicsGrid() {
    if (!this.topicsContainer) return;

    this.topicsContainer.innerHTML = this.topics.map(t => `
      <div class="mm-topic-card" data-topic="${this.escapeHtml(t.name)}" title="Explore ${this.escapeHtml(t.name)} problems">
        <div class="mm-topic-card-header">
          <span class="mm-topic-name">${this.escapeHtml(t.name)}</span>
          <span class="mm-topic-count">${t.count}</span>
        </div>
        <div class="mm-topic-sample">${this.escapeHtml(t.samples)}</div>
      </div>
    `).join('');

    this.topicsContainer.querySelectorAll('.mm-topic-card').forEach(card => {
      card.addEventListener('click', () => {
        const topicName = card.dataset.topic;
        this.showNeetCodeRoadmap(topicName);
      });
    });
  }

  handlePillarAction(action) {
    switch (action) {
      case 'neetcode-roadmap':
        this.showNeetCodeRoadmap();
        break;
      case 'workspace':
        this.showWorkspace();
        break;
      case 'timed-assessment':
        this.launchAssessment();
        break;
      case 'dsa-academy':
        this.showWorkspace('curriculum');
        break;
      case 'ai-mentor':
        this.showWorkspace('problem');
        this.focusAiMentor();
        break;
      case 'whiteboard':
        this.showWorkspace();
        this.toggleWhiteboard();
        break;
      case 'interviewer-notes':
        this.showWorkspace('interviewer');
        break;
      case 'evaluation-report':
        this.openEvaluationReport();
        break;
      default:
        this.showWorkspace();
    }
  }

  showMainMenu() {
    if (this.mainMenuView) this.mainMenuView.hidden = false;
    if (this.problemMenuView) this.problemMenuView.hidden = true;
    if (this.workspaceGrid) this.workspaceGrid.hidden = true;

    if (this.btnNavHome) this.btnNavHome.classList.add('active');
    if (this.btnNavMenu) this.btnNavMenu.classList.remove('active');
    if (this.btnNavWorkspace) this.btnNavWorkspace.classList.remove('active');

    try {
      window.history.replaceState(null, '', '#main-menu');
    } catch (_) {}

    this.updateStats();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  showNeetCodeRoadmap(category = null) {
    if (this.mainMenuView) this.mainMenuView.hidden = true;
    if (this.workspaceGrid) this.workspaceGrid.hidden = true;
    if (this.problemMenuView) this.problemMenuView.hidden = false;

    if (this.btnNavMenu) this.btnNavMenu.classList.add('active');
    if (this.btnNavHome) this.btnNavHome.classList.remove('active');
    if (this.btnNavWorkspace) this.btnNavWorkspace.classList.remove('active');

    try {
      window.history.replaceState(null, '', '#roadmap');
    } catch (_) {}

    if (window.menuService) {
      window.menuService.currentCollection = 'neetcode75';
      if (category) {
        window.menuService.currentCategory = category;
      }
      window.menuService.renderCategoryChips();
      window.menuService.updateStats();
      window.menuService.renderProblemGrid();
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  showWorkspace(subView = null) {
    if (this.mainMenuView) this.mainMenuView.hidden = true;
    if (this.problemMenuView) this.problemMenuView.hidden = true;
    if (this.workspaceGrid) this.workspaceGrid.hidden = false;

    if (this.btnNavWorkspace) this.btnNavWorkspace.classList.add('active');
    if (this.btnNavHome) this.btnNavHome.classList.remove('active');
    if (this.btnNavMenu) this.btnNavMenu.classList.remove('active');

    try {
      window.history.replaceState(null, '', '#workspace');
    } catch (_) {}

    if (subView) {
      const tab = document.querySelector(`.panel-tab[data-view="${subView}"]`);
      if (tab) tab.click();
    }
  }

  launchAssessment(problemId = null) {
    const assessBtn = document.getElementById('open-assessment-btn');
    if (assessBtn) {
      assessBtn.click();
      if (problemId) {
        const select = document.getElementById('assessment-problem-select');
        if (select) {
          select.value = problemId;
        }
      }
    }
  }

  focusAiMentor() {
    const chatInput = document.getElementById('chat-text-input');
    if (chatInput) {
      chatInput.focus();
      chatInput.placeholder = 'Ask AI Mentor for an algorithmic hint or complexity advice...';
    }
  }

  toggleWhiteboard() {
    const dock = document.getElementById('whiteboard-dock');
    if (dock) {
      dock.hidden = false;
      const overlay = document.getElementById('annotation-canvas');
      if (overlay) overlay.style.pointerEvents = 'auto';
    }
  }

  openEvaluationReport() {
    const evalBtn = document.getElementById('finish-evaluate-btn');
    if (evalBtn) {
      evalBtn.click();
    }
  }

  handleSearch(rawQuery) {
    const query = (rawQuery || '').trim().toLowerCase();
    if (!this.searchResults) return;

    if (!query) {
      this.searchResults.hidden = true;
      return;
    }

    const matches = this.problems.filter(p => {
      const text = `${p.title} ${p.category} ${p.neetcodeCategory || ''} ${p.id}`.toLowerCase();
      return text.includes(query);
    }).slice(0, 8);

    if (matches.length === 0) {
      this.searchResults.innerHTML = `
        <div style="padding: 12px 16px; font-size: 0.82rem; color: #94a3b8;">
          No problems found matching "${this.escapeHtml(query)}".
        </div>
      `;
      this.searchResults.hidden = false;
      return;
    }

    this.searchResults.innerHTML = matches.map(p => {
      const order = p.neetcodeOrder ? `#${p.neetcodeOrder}` : '';
      return `
        <div class="mm-search-result-item" data-problem-id="${this.escapeHtml(p.id)}">
          <div class="mm-search-res-title">
            <span class="difficulty-badge ${p.difficulty.toLowerCase()}">${p.difficulty}</span>
            <span>${order} ${this.escapeHtml(p.title)}</span>
          </div>
          <div class="mm-search-res-cat">${this.escapeHtml(p.neetcodeCategory || p.category)}</div>
        </div>
      `;
    }).join('');

    this.searchResults.querySelectorAll('.mm-search-result-item').forEach(item => {
      item.addEventListener('click', () => {
        const pid = item.dataset.problemId;
        this.selectAndOpenProblem(pid);
        this.searchResults.hidden = true;
        if (this.searchInput) this.searchInput.value = '';
      });
    });

    this.searchResults.hidden = false;
  }

  selectAndOpenProblem(problemId) {
    const problemSelect = document.getElementById('problem-select');
    if (problemSelect) {
      problemSelect.value = problemId;
      problemSelect.dispatchEvent(new Event('change'));
    }
    this.showWorkspace('problem');
    const p = this.problems.find(x => x.id === problemId);
    if (window.showToast && p) {
      window.showToast(`Loaded ${p.title} in Workspace`);
    }
  }

  escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}

// Instantiate on DOM load
document.addEventListener('DOMContentLoaded', () => {
  window.mainMenuController = new MainMenuController();
});
