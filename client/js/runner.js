/**
 * Real-Time Collaborative Code Interview Platform
 * Code Execution & Test Case Runner Coordinator
 */

class CodeRunner {
  constructor() {
    this.runCodeBtn = document.getElementById('run-code-btn');
    this.runTestsBtn = document.getElementById('run-tests-btn');
    this.stdoutEl = document.getElementById('console-stdout-view');
    this.stderrEl = document.getElementById('console-stderr-view');
    this.testCardsContainer = document.getElementById('test-cards-container');
    this.testSummaryStrip = document.getElementById('test-summary-strip');
    this.testCasesCountBadge = document.getElementById('test-cases-count-badge');

    this.initEvents();
  }

  initEvents() {
    if (this.runCodeBtn) {
      this.runCodeBtn.addEventListener('click', () => this.run(false));
    }
    if (this.runTestsBtn) {
      this.runTestsBtn.addEventListener('click', () => this.run(true));
    }

    // Keyboard shortcut: Ctrl+Enter / Cmd+Enter runs tests
    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        this.run(true);
      }
    });
  }

  async run(isTestSuite = false) {
    const code = window.editor ? window.editor.getCode() : '';
    const languageSelect = document.getElementById('language-select');
    const language = languageSelect ? languageSelect.value : 'python';
    const problemId = window.currentProblemId || 'two-sum';

    const btn = isTestSuite ? this.runTestsBtn : this.runCodeBtn;
    const originalText = btn ? btn.innerHTML : '';
    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Executing...';
    }

    // Switch console tab
    if (window.switchConsoleTab) {
      window.switchConsoleTab(isTestSuite ? 'tests' : 'output');
    }

    try {
      const response = await fetch('/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          language,
          problemId,
          mode: isTestSuite ? 'tests' : 'run'
        })
      });

      const data = await response.json();

      if (isTestSuite) {
        this.renderTestResults(data);
      } else {
        this.renderRawOutput(data);
      }

      // Record last test execution for AI evaluator
      window.lastTestResults = isTestSuite ? data : null;

      // Update curriculum progress and streak
      if (window.curriculum) {
        if (isTestSuite && data.summary && data.summary.allPassed) {
          window.curriculum.markProblemSolved(problemId);
        } else {
          window.curriculum.recordActivity(problemId, 'attempted');
        }
      }

      // Broadcast timeline event
      window.socketClient.send('TIMELINE_EVENT', {
        text: isTestSuite
          ? `Executed test suite: ${data.summary ? data.summary.passed : 0}/${data.summary ? data.summary.total : 0} passed.`
          : `Executed code script in ${language.toUpperCase()}.`,
        flag: isTestSuite && data.summary && data.summary.allPassed ? 'success' : 'test'
      });

    } catch (err) {
      this.renderRawOutput({
        status: 'FETCH_ERROR',
        stdout: '',
        stderr: `Failed to connect to execution engine: ${err.message}`
      });
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = originalText;
      }
    }
  }

  renderRawOutput(result) {
    if (this.stdoutEl) {
      this.stdoutEl.textContent = result.stdout || (result.status === 'SUCCESS' && !result.stderr ? '[Process finished with no output]' : '');
    }
    if (this.stderrEl) {
      this.stderrEl.textContent = result.stderr || '';
    }
  }

  renderTestResults(testRun) {
    if (!testRun || !testRun.summary) return;
    const { total, passed, failed, totalDurationMs } = testRun.summary;

    if (this.testSummaryStrip) {
      this.testSummaryStrip.innerHTML = `
        <span class="test-metric-pill ${passed === total ? 'success' : 'failed'}">
          ${passed} / ${total} Tests Passed (${Math.round((passed / total) * 100)}%)
        </span>
        <span style="font-size: 0.75rem; color: var(--text-muted);">
          Total Runtime: ${totalDurationMs}ms
        </span>
      `;
    }

    if (this.testCardsContainer) {
      this.testCardsContainer.innerHTML = (testRun.results || []).map((r, i) => `
        <div class="test-card ${r.passed ? 'passed' : 'failed'}">
          <div class="test-card-top">
            <span class="test-title">Case ${i + 1}: ${r.description || 'Test Case'}</span>
            <span class="test-status-tag ${r.passed ? 'passed' : 'failed'}">
              ${r.passed ? 'Passed' : r.status || 'Failed'} (${r.durationMs || 0}ms)
            </span>
          </div>
          <div class="test-io-row">
            <span class="test-io-label">Input:</span>
            <span class="test-io-val">${r.input}</span>
          </div>
          <div class="test-io-row">
            <span class="test-io-label">Expected:</span>
            <span class="test-io-val">${r.expected}</span>
          </div>
          <div class="test-io-row">
            <span class="test-io-label">Actual:</span>
            <span class="test-io-val">${r.actual}</span>
          </div>
        </div>
      `).join('');
    }
  }
}

window.CodeRunner = CodeRunner;
