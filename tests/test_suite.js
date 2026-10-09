/**
 * Real-Time Collaborative Code Interview Platform
 * Automated Verification & Architecture Test Suite
 */

const assert = require('assert');
const { listProblems, getProblemById, getEditorialSolution, DSA_CURRICULUM } = require('../server/problems/bank');
const { createRoom, getRoom, validateRole, getClientRoomState } = require('../server/rooms');
const { executeCode, runTestCases } = require('../server/execution/runner');
const { analyzeCodeComplexity, generateHeuristicReport } = require('../server/ai/heuristics');
const { generateEvaluationReport } = require('../server/ai/evaluator');
const { getUserProgress, recordUserActivity } = require('../server/db');

async function runTestSuite() {
  console.log('==================================================');
  console.log('  CODEINTERVIEW PLATFORM - ARCHITECTURE TEST SUITE');
  console.log('==================================================\n');

  let passedTests = 0;
  let totalTests = 0;

  function test(name, fn) {
    totalTests++;
    try {
      fn();
      console.log(`[PASS] ${name}`);
      passedTests++;
    } catch (err) {
      console.error(`[FAIL] ${name}: ${err.message}`);
    }
  }

  async function testAsync(name, fn) {
    totalTests++;
    try {
      await fn();
      console.log(`[PASS] ${name}`);
      passedTests++;
    } catch (err) {
      console.error(`[FAIL] ${name}: ${err.message}`);
    }
  }

  // 1. Problem Bank Tests
  test('Problem Bank: Contains curated problems with starter templates', () => {
    const problems = listProblems();
    assert(problems.length >= 5, 'Should have at least 5 curated problems');
    
    const twoSum = getProblemById('two-sum');
    assert(twoSum !== null, 'Should find two-sum');
    assert(twoSum.starterCode.python, 'Should have Python starter code');
    assert(twoSum.starterCode.javascript, 'Should have JS starter code');
    assert(twoSum.testCases.length >= 4, 'Should have at least 4 test cases for Two Sum');
  });

  // 2. Room State & Dual-Role Security Tests
  test('Room Manager: Dual-role token generation and isolation', () => {
    const room = createRoom({ problemId: 'two-sum', title: 'Senior Mock Interview' });
    assert(room.id, 'Room must have an ID');
    assert(room.interviewerToken, 'Must generate interviewer secret token');
    assert(room.candidateToken, 'Must generate candidate token');

    // Candidate view should NOT leak interviewer secret or private notes
    const candidateState = getClientRoomState(room, 'candidate');
    assert.strictEqual(candidateState.interviewerToken, undefined, 'Candidate state must not reveal interviewer token');
    assert.strictEqual(candidateState.interviewerNotes, undefined, 'Candidate state must not reveal private rubric notes');

    // Interviewer view should have access
    const interviewerState = getClientRoomState(room, 'interviewer');
    assert(interviewerState.interviewerToken, 'Interviewer state has token');
    assert(interviewerState.interviewerNotes, 'Interviewer state has private notes');

    // Role validation
    const validAuth = validateRole(room, 'interviewer', room.interviewerToken);
    assert.strictEqual(validAuth.authorized, true);
    assert.strictEqual(validAuth.role, 'interviewer');

    const invalidAuth = validateRole(room, 'interviewer', 'wrong-secret');
    assert.strictEqual(invalidAuth.authorized, false);
    assert.strictEqual(invalidAuth.role, 'candidate');
  });

  // 3. Complexity Static Analysis Tests
  test('Heuristic Engine: Static AST and Big-O Complexity Detection', () => {
    const singleLoopCode = `
def solve(nums):
    res = []
    for x in nums:
        res.append(x * 2)
    return res
    `;
    const res1 = analyzeCodeComplexity(singleLoopCode, 'python');
    assert.strictEqual(res1.estimatedTime, 'O(N)', 'Single loop should be O(N)');

    const nestedLoopCode = `
def solve(nums):
    for i in range(len(nums)):
        for j in range(i+1, len(nums)):
            if nums[i] == nums[j]: return True
    return False
    `;
    const res2 = analyzeCodeComplexity(nestedLoopCode, 'python');
    assert.strictEqual(res2.estimatedTime, 'O(N^2)', 'Nested loop should be O(N^2)');
  });

  // 4. AI Post-Interview Evaluation Report Generation Tests
  await testAsync('AI Evaluator: Generates comprehensive evaluation report schema', async () => {
    const problem = getProblemById('two-sum');
    const mockCode = `
def two_sum(nums, target):
    seen = {}
    for i, n in enumerate(nums):
        comp = target - n
        if comp in seen:
            return [seen[comp], i]
        seen[n] = i
    return []
    `;

    const report = await generateEvaluationReport({
      problem,
      code: mockCode,
      language: 'python',
      testResults: {
        summary: { total: 4, passed: 4, failed: 0, allPassed: true, totalDurationMs: 85 }
      },
      interviewerNotes: {
        scores: { dsa: 5, problemSolving: 5, codeQuality: 4.5, communication: 4.5 },
        notes: 'Candidate wrote optimal hash table solution in under 15 minutes.'
      },
      timelineEvents: [
        { timeStr: '02:15', text: 'Explained brute-force O(N^2) then proposed O(N) hash map' }
      ]
    });

    assert(report.recommendation, 'Report must have recommendation');
    assert(report.overallScore >= 1 && report.overallScore <= 5, 'Score must be between 1 and 5');
    assert(report.complexityAnalysis, 'Must have complexity analysis');
    assert.strictEqual(report.complexityAnalysis.optimalTimeComplexity, 'O(N)');
    assert(report.rubricScores.algorithmsAndDataStructures, 'Must score DSA');
    assert(report.rubricScores.problemSolving, 'Must score Problem Solving');
    assert(report.strengths.length > 0, 'Must contain strengths');
    assert(report.hiringRationale, 'Must have hiring rationale');
  });

  // 5. DSA Curriculum & Editorial Solution Tests
  test('DSA Curriculum: Modules cover essential Python toolkits and solutions', () => {
    assert(DSA_CURRICULUM.length >= 6, 'Should have at least 6 core DSA modules');
    const arraysModule = DSA_CURRICULUM.find(m => m.id === 'arrays-two-pointers');
    assert(arraysModule, 'Arrays module must exist');
    assert(arraysModule.pythonToolkit.length >= 3, 'Must contain Python toolkit functions');
    assert(arraysModule.problems.length >= 2, 'Must contain practice questions');

    // Editorial solutions
    const twoSumSolution = getEditorialSolution('two-sum');
    assert(twoSumSolution, 'Two Sum must have editorial solution');
    assert(twoSumSolution.python.includes('def two_sum'), 'Must have valid Python solution');
    assert(twoSumSolution.explanation, 'Must have algorithmic explanation');
  });

  // 6. Database Progress & Multi-Device Sync Tests
  await testAsync('Database Service: Tracks and syncs user progress across devices', async () => {
    const testUser = `test_user_${Date.now()}`;
    const initial = await getUserProgress(testUser);
    assert.strictEqual(initial.solvedProblemIds.length, 0);
    assert.strictEqual(initial.streakDays, 1);

    // Record solved problem
    const updated = await recordUserActivity(testUser, 'two-sum', 'solved');
    assert(updated.solvedProblemIds.includes('two-sum'), 'Solved problems must include two-sum');

    // Re-query user progress (simulating opening on a new device)
    const synced = await getUserProgress(testUser);
    assert(synced.solvedProblemIds.includes('two-sum'), 'New device must fetch persisted solved problems');
  });

  console.log(`\n--------------------------------------------------`);
  console.log(`Test Results: ${passedTests} / ${totalTests} Passed (${Math.round((passedTests / totalTests) * 100)}%)`);
  console.log(`--------------------------------------------------\n`);
}

runTestSuite();
