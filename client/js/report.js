/**
 * Real-Time Collaborative Code Interview Platform
 * AI Post-Interview Evaluation Report Controller & Exporter
 */

class ReportManager {
  constructor() {
    this.modal = document.getElementById('report-modal');
    this.closeBtn = document.getElementById('close-report-modal-btn');
    this.generateBtn = document.getElementById('finish-evaluate-btn');
    this.reportContainer = document.getElementById('report-content-body');
    this.copyMdBtn = document.getElementById('copy-report-md-btn');
    this.printPdfBtn = document.getElementById('print-report-pdf-btn');

    this.currentReport = null;
    this.initEvents();
  }

  initEvents() {
    if (this.generateBtn) {
      this.generateBtn.addEventListener('click', () => this.generate());
    }

    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => {
        if (this.modal) this.modal.hidden = true;
      });
    }

    if (this.copyMdBtn) {
      this.copyMdBtn.addEventListener('click', () => this.copyMarkdown());
    }

    if (this.printPdfBtn) {
      this.printPdfBtn.addEventListener('click', () => window.print());
    }

    window.socketClient.on('EVALUATION_REPORT_READY', (data) => {
      if (data.report) {
        this.renderReport(data.report);
        if (this.modal) this.modal.hidden = false;
      }
    });
  }

  async generate() {
    const originalText = this.generateBtn ? this.generateBtn.innerHTML : '';
    if (this.generateBtn) {
      this.generateBtn.disabled = true;
      this.generateBtn.textContent = 'Generating AI Report...';
    }

    try {
      const code = window.editor ? window.editor.getCode() : '';
      const languageSelect = document.getElementById('language-select');
      const language = languageSelect ? languageSelect.value : 'python';
      const roomId = window.currentRoomId || null;
      const problemId = window.currentProblemId || 'two-sum';

      const response = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId,
          problemId,
          code,
          language,
          testResults: window.lastTestResults || null
        })
      });

      const report = await response.json();
      this.renderReport(report);

      if (this.modal) {
        this.modal.hidden = false;
      }
    } catch (err) {
      alert(`Failed to generate evaluation report: ${err.message}`);
    } finally {
      if (this.generateBtn) {
        this.generateBtn.disabled = false;
        this.generateBtn.innerHTML = originalText;
      }
    }
  }

  renderReport(report) {
    this.currentReport = report;
    if (!this.reportContainer) return;

    const recClass = (report.recommendation || '').toLowerCase().replace(/\s+/g, '-');
    const comp = report.complexityAnalysis || {};
    const rubrics = report.rubricScores || {};

    this.reportContainer.innerHTML = `
      <div class="report-modal-content">
        <!-- Hero Recommendation Banner -->
        <div class="report-hero-card">
          <div>
            <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700; margin-bottom: 6px;">
              Hiring Decision Recommendation
            </div>
            <span class="recommendation-pill ${recClass}">
              ${report.recommendation || 'LEAN HIRE'}
            </span>
          </div>
          <div class="score-rating-box">
            <div class="score-big-num">${report.overallScore || '4.0'}</div>
            <div class="score-max-sub">Overall Rating / 5.0</div>
          </div>
        </div>

        <!-- Executive Summary -->
        <p class="report-summary-text">${report.summary || ''}</p>

        <!-- Asymptotic Complexity Breakdown -->
        <div class="complexity-grid">
          <div class="complexity-card">
            <span class="complexity-card-title">Runtime Complexity</span>
            <div class="complexity-comparison-row">
              <span style="font-size: 0.8rem; color: var(--text-secondary);">Actual vs Optimal</span>
              <div>
                <span class="complexity-badge ${comp.isOptimal ? 'optimal' : 'suboptimal'}">
                  ${comp.actualTimeComplexity || 'O(N)'}
                </span>
                <span style="color: var(--text-muted); font-size: 0.8rem; margin: 0 4px;">target:</span>
                <span class="complexity-badge optimal">
                  ${comp.optimalTimeComplexity || 'O(N)'}
                </span>
              </div>
            </div>
          </div>

          <div class="complexity-card">
            <span class="complexity-card-title">Memory / Space Complexity</span>
            <div class="complexity-comparison-row">
              <span style="font-size: 0.8rem; color: var(--text-secondary);">Auxiliary Space</span>
              <div>
                <span class="complexity-badge optimal">
                  ${comp.actualSpaceComplexity || 'O(N)'}
                </span>
                <span style="color: var(--text-muted); font-size: 0.8rem; margin: 0 4px;">target:</span>
                <span class="complexity-badge optimal">
                  ${comp.optimalSpaceComplexity || 'O(N)'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Competency Rubric Scores -->
        <div class="rubric-scores-grid">
          ${this.renderRubricCard('Algorithms & Data Structures', rubrics.algorithmsAndDataStructures)}
          ${this.renderRubricCard('Problem Solving Strategy', rubrics.problemSolving)}
          ${this.renderRubricCard('Code Quality & Cleanliness', rubrics.codeQuality)}
          ${this.renderRubricCard('Communication & Articulation', rubrics.communication)}
        </div>

        <!-- Strengths & Opportunities -->
        <div class="highlights-columns">
          <div class="highlights-card">
            <span class="highlights-title strengths">Demonstrated Strengths</span>
            <ul class="highlights-list">
              ${(report.strengths || []).map(s => `<li>${s}</li>`).join('')}
            </ul>
          </div>
          <div class="highlights-card">
            <span class="highlights-title improvements">Areas For Improvement</span>
            <ul class="highlights-list">
              ${(report.areasForImprovement || []).map(i => `<li>${i}</li>`).join('')}
            </ul>
          </div>
        </div>

        <!-- Hiring Rationale -->
        <div class="hiring-rationale-box">
          <strong>Hiring Rationale:</strong> ${report.hiringRationale || ''}
        </div>
      </div>
    `;
  }

  renderRubricCard(title, data) {
    if (!data) return '';
    const score = data.score || 4;
    const pct = Math.round((score / 5) * 100);
    return `
      <div class="rubric-score-card">
        <div class="rubric-card-header">
          <span class="rubric-card-name">${title}</span>
          <span class="rubric-card-score">${score} / 5</span>
        </div>
        <div class="rubric-bar-track">
          <div class="rubric-bar-fill" style="width: ${pct}%;"></div>
        </div>
        <p class="rubric-card-feedback">${data.feedback || ''}</p>
      </div>
    `;
  }

  copyMarkdown() {
    if (!this.currentReport) return;
    const r = this.currentReport;
    const md = `# TECHNICAL INTERVIEW EVALUATION REPORT

## Executive Recommendation: ${r.recommendation} (${r.overallScore} / 5.0)

${r.summary}

### Asymptotic Complexity Analysis
- **Runtime Complexity**: ${r.complexityAnalysis ? r.complexityAnalysis.actualTimeComplexity : 'O(N)'} (Optimal: ${r.complexityAnalysis ? r.complexityAnalysis.optimalTimeComplexity : 'O(N)'})
- **Space Complexity**: ${r.complexityAnalysis ? r.complexityAnalysis.actualSpaceComplexity : 'O(N)'} (Optimal: ${r.complexityAnalysis ? r.complexityAnalysis.optimalSpaceComplexity : 'O(N)'})

### Competency Rubric Scores
1. **Algorithms & Data Structures**: ${r.rubricScores && r.rubricScores.algorithmsAndDataStructures ? r.rubricScores.algorithmsAndDataStructures.score : 'N/A'}/5
   ${r.rubricScores && r.rubricScores.algorithmsAndDataStructures ? r.rubricScores.algorithmsAndDataStructures.feedback : ''}

2. **Problem Solving**: ${r.rubricScores && r.rubricScores.problemSolving ? r.rubricScores.problemSolving.score : 'N/A'}/5
   ${r.rubricScores && r.rubricScores.problemSolving ? r.rubricScores.problemSolving.feedback : ''}

3. **Code Quality**: ${r.rubricScores && r.rubricScores.codeQuality ? r.rubricScores.codeQuality.score : 'N/A'}/5
   ${r.rubricScores && r.rubricScores.codeQuality ? r.rubricScores.codeQuality.feedback : ''}

4. **Communication**: ${r.rubricScores && r.rubricScores.communication ? r.rubricScores.communication.score : 'N/A'}/5
   ${r.rubricScores && r.rubricScores.communication ? r.rubricScores.communication.feedback : ''}

### Key Strengths
${(r.strengths || []).map(s => `- ${s}`).join('\n')}

### Areas for Improvement
${(r.areasForImprovement || []).map(i => `- ${i}`).join('\n')}

### Hiring Rationale
${r.hiringRationale}
`;

    navigator.clipboard.writeText(md).then(() => {
      if (window.showToast) window.showToast('Report copied to clipboard as Markdown');
    });
  }
}

window.ReportManager = ReportManager;
