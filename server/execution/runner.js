/**
 * Real-Time Collaborative Code Interview Platform
 * Master Code Execution Coordinator & Test Case Runner
 */

const { executeLocally } = require('./localRunner');
const { executeInDocker, isDockerAvailable } = require('./dockerRunner');

const PREFERRED_ENGINE = process.env.EXECUTION_ENGINE || 'local';

/**
 * Execute raw code string
 */
async function executeCode({ language, code, stdin = '', timeoutMs = 6000 }) {
  if (PREFERRED_ENGINE === 'docker') {
    const dockerOk = await isDockerAvailable();
    if (dockerOk) {
      return executeInDocker(language, code, stdin, timeoutMs);
    }
  }
  // Default to local isolated runner
  return executeLocally(language, code, stdin, timeoutMs);
}

/**
 * Run test cases for a specific problem
 * @param {Object} params
 * @param {string} params.language
 * @param {string} params.code
 * @param {Array} params.testCases
 * @param {boolean} params.includeHidden
 */
async function runTestCases({ language, code, testCases = [], includeHidden = true }) {
  const results = [];
  let allPassed = true;
  let totalTime = 0;

  for (const tc of testCases) {
    if (!includeHidden && tc.isHidden) {
      continue;
    }

    const execResult = await executeCode({
      language,
      code,
      stdin: tc.input || '',
      timeoutMs: 5000
    });

    totalTime += execResult.durationMs || 0;

    const actualTrimmed = (execResult.stdout || '').trim();
    const expectedTrimmed = (tc.expected || '').trim();
    
    // Check match (support JSON structural match if applicable)
    let passed = false;
    if (actualTrimmed === expectedTrimmed) {
      passed = true;
    } else {
      try {
        const actualJson = JSON.parse(actualTrimmed);
        const expectedJson = JSON.parse(expectedTrimmed);
        passed = JSON.stringify(actualJson) === JSON.stringify(expectedJson);
      } catch (_) {
        passed = false;
      }
    }

    if (!passed) allPassed = false;

    results.push({
      testCaseId: tc.id,
      description: tc.description,
      isHidden: tc.isHidden,
      passed,
      status: execResult.status,
      input: tc.isHidden ? '[Hidden Test Input]' : tc.input,
      expected: tc.isHidden ? '[Hidden]' : tc.expected,
      actual: execResult.status === 'SUCCESS' ? actualTrimmed : (execResult.stderr || execResult.status),
      durationMs: execResult.durationMs
    });
  }

  const passedCount = results.filter(r => r.passed).length;

  return {
    summary: {
      total: results.length,
      passed: passedCount,
      failed: results.length - passedCount,
      allPassed,
      totalDurationMs: totalTime
    },
    results
  };
}

module.exports = {
  executeCode,
  runTestCases
};
