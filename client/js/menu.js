/**
 * Real-Time Collaborative Code Interview Platform
 * Menu / Problem Directory Dashboard Service
 * Zero Emojis - Zero Em Dashes
 */

class MenuService {
  constructor() {
    this.problems = [];
    this.currentCollection = 'neetcode75'; // 'neetcode75' | 'all'
    this.currentCategory = 'all';
    this.currentDifficulty = 'all';
    this.currentStatus = 'all';
    this.searchQuery = '';
    this.sortBy = 'recommended';
    this.activeView = 'workspace'; // 'workspace' | 'menu'

    this.initElements();
    this.bindEvents();
  }

  initElements() {
    // Top Nav buttons
    this.btnNavMenu = document.getElementById('nav-btn-menu');
    this.btnNavWorkspace = document.getElementById('nav-btn-workspace');

    // Containers
    this.menuView = document.getElementById('view-menu-dashboard');
    this.workspaceGrid = document.querySelector('.workspace-grid');
    this.collectionTabsContainer = document.getElementById('menu-collection-tabs');

    // Stats
    this.statTotal = document.getElementById('menu-stat-total');
    this.statTotalLabel = document.getElementById('menu-stat-total-label');
    this.statSolved = document.getElementById('menu-stat-solved');
    this.statRate = document.getElementById('menu-stat-rate');
    this.statStreak = document.getElementById('menu-stat-streak');

    // Controls
    this.searchInput = document.getElementById('menu-search-input');
    this.clearSearchBtn = document.getElementById('menu-clear-search-btn');
    this.filterDifficulty = document.getElementById('menu-filter-difficulty');
    this.filterStatus = document.getElementById('menu-filter-status');
    this.sortBySelect = document.getElementById('menu-sort-by');
    this.resetFiltersBtn = document.getElementById('menu-reset-filters-btn');
    this.categoryChipsContainer = document.getElementById('menu-category-chips');
    this.resultsCount = document.getElementById('menu-results-count');
    this.problemGrid = document.getElementById('menu-problem-grid');
  }

  bindEvents() {
    // View Switchers
    if (this.btnNavMenu) {
      this.btnNavMenu.addEventListener('click', () => this.showMenuView());
    }

    if (this.btnNavWorkspace) {
      this.btnNavWorkspace.addEventListener('click', () => this.showWorkspaceView());
    }

    // Collection Switchers (NeetCode 75 vs All)
    if (this.collectionTabsContainer) {
      this.collectionTabsContainer.querySelectorAll('.menu-collection-tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
          const col = e.currentTarget.dataset.collection;
          if (col && col !== this.currentCollection) {
            this.currentCollection = col;
            this.collectionTabsContainer.querySelectorAll('.menu-collection-tab').forEach(t => t.classList.remove('active'));
            e.currentTarget.classList.add('active');
            this.currentCategory = 'all';
            this.renderCategoryChips();
            this.updateStats();
            this.renderProblemGrid();
          }
        });
      });
    }

    // Search Input
    if (this.searchInput) {
      this.searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.trim().toLowerCase();
        if (this.clearSearchBtn) {
          this.clearSearchBtn.hidden = !this.searchQuery;
        }
        this.renderProblemGrid();
      });
    }

    if (this.clearSearchBtn) {
      this.clearSearchBtn.addEventListener('click', () => {
        if (this.searchInput) this.searchInput.value = '';
        this.searchQuery = '';
        this.clearSearchBtn.hidden = true;
        this.renderProblemGrid();
      });
    }

    // Dropdown Filters
    if (this.filterDifficulty) {
      this.filterDifficulty.addEventListener('change', (e) => {
        this.currentDifficulty = e.target.value;
        this.renderProblemGrid();
      });
    }

    if (this.filterStatus) {
      this.filterStatus.addEventListener('change', (e) => {
        this.currentStatus = e.target.value;
        this.renderProblemGrid();
      });
    }

    if (this.sortBySelect) {
      this.sortBySelect.addEventListener('change', (e) => {
        this.sortBy = e.target.value;
        this.renderProblemGrid();
      });
    }

    // Reset Filters
    if (this.resetFiltersBtn) {
      this.resetFiltersBtn.addEventListener('click', () => {
        this.resetAllFilters();
      });
    }
  }

  async init() {
    try {
      const res = await fetch('/api/problems');
      if (res.ok) {
        this.problems = await res.json();
      }
    } catch (err) {
      console.warn('[Menu] Could not fetch problems:', err.message);
    }

    this.renderCategoryChips();
    this.updateStats();
    this.renderProblemGrid();

    // Listen to auth changes to re-render status & stats
    if (window.authService) {
      window.authService.onAuthChange(() => {
        this.updateStats();
        this.renderProblemGrid();
      });
    }
  }

  showMenuView() {
    this.activeView = 'menu';
    if (this.menuView) this.menuView.hidden = false;
    if (this.workspaceGrid) this.workspaceGrid.hidden = true;

    if (this.btnNavMenu) this.btnNavMenu.classList.add('active');
    if (this.btnNavWorkspace) this.btnNavWorkspace.classList.remove('active');

    this.updateStats();
    this.renderProblemGrid();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  showWorkspaceView() {
    this.activeView = 'workspace';
    if (this.menuView) this.menuView.hidden = true;
    if (this.workspaceGrid) this.workspaceGrid.hidden = false;

    if (this.btnNavWorkspace) this.btnNavWorkspace.classList.add('active');
    if (this.btnNavMenu) this.btnNavMenu.classList.remove('active');
  }

  resetAllFilters() {
    this.searchQuery = '';
    this.currentCategory = 'all';
    this.currentDifficulty = 'all';
    this.currentStatus = 'all';
    this.sortBy = 'recommended';

    if (this.searchInput) this.searchInput.value = '';
    if (this.clearSearchBtn) this.clearSearchBtn.hidden = true;
    if (this.filterDifficulty) this.filterDifficulty.value = 'all';
    if (this.filterStatus) this.filterStatus.value = 'all';
    if (this.sortBySelect) this.sortBySelect.value = 'recommended';

    this.renderCategoryChips();
    this.renderProblemGrid();
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

  getUserAttemptedSet() {
    try {
      if (window.curriculumService && window.curriculumService.progress) {
        return new Set(window.curriculumService.progress.attemptedProblemIds || []);
      }
      const raw = localStorage.getItem('dsa_attempted');
      if (raw) return new Set(JSON.parse(raw));
    } catch (_) {}
    return new Set();
  }

  updateStats() {
    const relevantProblems = (this.currentCollection === 'neetcode75')
      ? this.problems.filter(p => p.isNeetCode75)
      : this.problems;

    const total = relevantProblems.length;
    const solvedSet = this.getUserSolvedSet();
    const solvedCount = relevantProblems.filter(p => solvedSet.has(p.id)).length;
    const rate = total > 0 ? Math.round((solvedCount / total) * 100) : 0;

    let streak = 1;
    if (window.curriculumService && window.curriculumService.progress) {
      streak = window.curriculumService.progress.streakDays || 1;
    } else {
      streak = parseInt(localStorage.getItem('dsa_streak'), 10) || 1;
    }

    if (this.statTotal) this.statTotal.textContent = total.toString();
    if (this.statTotalLabel) {
      this.statTotalLabel.textContent = (this.currentCollection === 'neetcode75') ? 'NeetCode 75' : 'Total Problems';
    }
    if (this.statSolved) this.statSolved.textContent = solvedCount.toString();
    if (this.statRate) this.statRate.textContent = `${rate}%`;
    if (this.statStreak) this.statStreak.textContent = `${streak}d`;

    if (window.authService) {
      window.authService.updateStatsInDropdown(solvedCount, streak);
    }
  }

  renderCategoryChips() {
    if (!this.categoryChipsContainer) return;

    const relevant = (this.currentCollection === 'neetcode75')
      ? this.problems.filter(p => p.isNeetCode75)
      : this.problems;

    const categories = Array.from(new Set(relevant.map(p => p.neetcodeCategory || p.category).filter(Boolean)));
    categories.sort();

    const allChips = ['all', ...categories];

    this.categoryChipsContainer.innerHTML = allChips.map(cat => {
      const isAll = cat === 'all';
      const label = isAll ? (this.currentCollection === 'neetcode75' ? 'All NeetCode 75' : 'All Topics') : cat;
      const activeClass = (this.currentCategory === cat) ? 'active' : '';
      return `<button type="button" class="menu-chip ${activeClass}" data-category="${this.escapeHtml(cat)}">${this.escapeHtml(label)}</button>`;
    }).join('');

    this.categoryChipsContainer.querySelectorAll('.menu-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        this.currentCategory = btn.dataset.category;
        this.categoryChipsContainer.querySelectorAll('.menu-chip').forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
        this.renderProblemGrid();
      });
    });
  }

  getFilteredProblems() {
    const solvedSet = this.getUserSolvedSet();
    const attemptedSet = this.getUserAttemptedSet();

    let list = this.problems;
    if (this.currentCollection === 'neetcode75') {
      list = list.filter(p => p.isNeetCode75);
    }

    return list.filter(p => {
      // Search query filter
      if (this.searchQuery) {
        const text = `${p.title} ${p.category} ${p.neetcodeCategory || ''} ${p.summary || ''} ${p.id}`.toLowerCase();
        if (!text.includes(this.searchQuery)) return false;
      }

      // Category filter
      if (this.currentCategory !== 'all') {
        const cat = p.neetcodeCategory || p.category;
        if (cat !== this.currentCategory && p.category !== this.currentCategory) {
          return false;
        }
      }

      // Difficulty filter
      if (this.currentDifficulty !== 'all') {
        if ((p.difficulty || '').toLowerCase() !== this.currentDifficulty.toLowerCase()) {
          return false;
        }
      }

      // Status filter
      if (this.currentStatus !== 'all') {
        const isSolved = solvedSet.has(p.id);
        const isAttempted = attemptedSet.has(p.id) && !isSolved;

        if (this.currentStatus === 'solved' && !isSolved) return false;
        if (this.currentStatus === 'attempted' && !isAttempted) return false;
        if (this.currentStatus === 'unsolved' && (isSolved || isAttempted)) return false;
      }

      return true;
    });
  }

  sortProblems(list) {
    const diffWeights = { easy: 1, medium: 2, hard: 3 };

    switch (this.sortBy) {
      case 'difficulty-asc':
        return [...list].sort((a, b) => (diffWeights[a.difficulty.toLowerCase()] || 2) - (diffWeights[b.difficulty.toLowerCase()] || 2));
      case 'difficulty-desc':
        return [...list].sort((a, b) => (diffWeights[b.difficulty.toLowerCase()] || 2) - (diffWeights[a.difficulty.toLowerCase()] || 2));
      case 'title-asc':
        return [...list].sort((a, b) => a.title.localeCompare(b.title));
      case 'recommended':
      default:
        return [...list].sort((a, b) => {
          const oA = a.neetcodeOrder || 999;
          const oB = b.neetcodeOrder || 999;
          if (oA !== oB) return oA - oB;
          return a.title.localeCompare(b.title);
        });
    }
  }

  renderProblemGrid() {
    if (!this.problemGrid) return;

    const filtered = this.getFilteredProblems();
    const sorted = this.sortProblems(filtered);

    const baseCount = (this.currentCollection === 'neetcode75')
      ? this.problems.filter(p => p.isNeetCode75).length
      : this.problems.length;

    if (this.resultsCount) {
      const scopeName = (this.currentCollection === 'neetcode75') ? 'NeetCode 75' : 'total';
      this.resultsCount.textContent = `Showing ${sorted.length} of ${baseCount} ${scopeName} problems`;
    }

    if (sorted.length === 0) {
      this.problemGrid.innerHTML = `
        <div class="menu-empty-state">
          <div class="menu-empty-title">No Matching Problems Found</div>
          <p class="menu-empty-desc">
            No technical interview questions match your current search and filter settings. Try clearing your filters or searching with different keywords.
          </p>
          <button type="button" id="btn-empty-reset" class="btn btn-secondary">Reset All Filters</button>
        </div>
      `;
      const btnReset = document.getElementById('btn-empty-reset');
      if (btnReset) btnReset.addEventListener('click', () => this.resetAllFilters());
      return;
    }

    const solvedSet = this.getUserSolvedSet();
    const attemptedSet = this.getUserAttemptedSet();

    this.problemGrid.innerHTML = sorted.map(problem => {
      const isSolved = solvedSet.has(problem.id);
      const isAttempted = attemptedSet.has(problem.id) && !isSolved;

      let statusClass = 'unsolved';
      let statusLabel = 'Unsolved';
      if (isSolved) {
        statusClass = 'solved';
        statusLabel = 'Solved';
      } else if (isAttempted) {
        statusClass = 'attempted';
        statusLabel = 'Attempted';
      }

      const diffClass = (problem.difficulty || 'Easy').toLowerCase();
      const timeComp = problem.optimalComplexity?.time || 'O(N)';
      const spaceComp = problem.optimalComplexity?.space || 'O(1)';
      const summaryText = problem.summary || 'Practice optimal algorithms and interview problem-solving approaches.';

      const ncBadge = problem.isNeetCode75
        ? `<span class="card-neetcode-badge">NC 75 ${problem.neetcodeOrder ? '#' + problem.neetcodeOrder : ''}</span>`
        : '';

      return `
        <div class="menu-problem-card ${statusClass}" data-id="${this.escapeHtml(problem.id)}">
          <div class="card-top-row">
            <div class="card-badges">
              ${ncBadge}
              <span class="difficulty-badge ${diffClass}">${this.escapeHtml(problem.difficulty)}</span>
              <span class="category-tag">${this.escapeHtml(problem.neetcodeCategory || problem.category || 'Algorithms')}</span>
            </div>
            <span class="card-status-badge ${statusClass}">
              ${statusLabel}
            </span>
          </div>

          <h3 class="card-title">${this.escapeHtml(problem.title)}</h3>
          <p class="card-summary">${this.escapeHtml(summaryText)}</p>

          <div class="card-complexity-row">
            <span class="complexity-pill"><span>Time:</span>${this.escapeHtml(timeComp)}</span>
            <span class="complexity-pill"><span>Space:</span>${this.escapeHtml(spaceComp)}</span>
          </div>

          <div class="card-actions-row">
            <button type="button" class="btn-card-solve" data-solve="${this.escapeHtml(problem.id)}">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="16 18 22 12 16 6"></polyline>
                <polyline points="8 6 2 12 8 18"></polyline>
              </svg>
              Solve in Workspace
            </button>
            <button type="button" class="btn-card-assessment" data-assess="${this.escapeHtml(problem.id)}" title="Take a timed assessment with this problem">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              Assessment
            </button>
          </div>
        </div>
      `;
    }).join('');

    // Attach click events
    this.problemGrid.querySelectorAll('[data-solve]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const problemId = e.currentTarget.dataset.solve;
        this.selectAndSolveProblem(problemId);
      });
    });

    this.problemGrid.querySelectorAll('[data-assess]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const problemId = e.currentTarget.dataset.assess;
        this.launchTimedAssessment(problemId);
      });
    });
  }

  selectAndSolveProblem(problemId) {
    const problemSelect = document.getElementById('problem-select');
    if (problemSelect) {
      problemSelect.value = problemId;
      problemSelect.dispatchEvent(new Event('change'));
    }

    this.showWorkspaceView();

    const targetProblem = this.problems.find(p => p.id === problemId);
    if (window.showToast && targetProblem) {
      window.showToast(`Loaded ${targetProblem.title} into workspace`);
    }
  }

  launchTimedAssessment(problemId) {
    // Select this problem in the assessment dropdown
    const assessSelect = document.getElementById('assessment-problem-select');
    if (assessSelect) {
      // Check if problem option exists or add it
      let opt = Array.from(assessSelect.options).find(o => o.value === problemId);
      if (!opt) {
        const prob = this.problems.find(p => p.id === problemId);
        opt = document.createElement('option');
        opt.value = problemId;
        opt.textContent = prob ? prob.title : problemId;
        assessSelect.appendChild(opt);
      }
      assessSelect.value = problemId;
    }

    // Open assessment modal
    const assessModal = document.getElementById('assessment-modal');
    if (assessModal) {
      assessModal.hidden = false;
    }
  }

  escapeHtml(text) {
    if (!text) return '';
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
}

// Global singleton instance
window.menuService = new MenuService();
