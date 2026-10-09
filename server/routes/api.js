/**
 * Real-Time Collaborative Code Interview Platform
 * REST API Routes
 */

const express = require('express');
const router = express.Router();
const { listProblems, getProblemById, getEditorialSolution, DSA_CURRICULUM } = require('../problems/bank');
const { createRoom, getRoom, validateRole, getClientRoomState, broadcast } = require('../rooms');
const { executeCode, runTestCases } = require('../execution/runner');
const { generateEvaluationReport } = require('../ai/evaluator');

// In-Memory Progress Store with Persistent Streak Calculator
let userProgress = {
  solvedProblemIds: [],
  attemptedProblemIds: [],
  lastPracticeTimestamp: Date.now(),
  streakDays: 1,
  history: []
};

/**
 * Health check endpoint
 */
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

/**
 * List all available problems
 */
router.get('/problems', (req, res) => {
  res.json(listProblems());
});

/**
 * Get problem details by ID
 */
router.get('/problems/:id', (req, res) => {
  const problem = getProblemById(req.params.id);
  if (!problem) {
    return res.status(404).json({ error: 'Problem not found' });
  }
  // Sanitize hidden test cases for client display
  const sanitized = {
    ...problem,
    testCases: problem.testCases.map(tc => ({
      id: tc.id,
      description: tc.description,
      input: tc.isHidden ? '[Hidden]' : tc.input,
      expected: tc.isHidden ? '[Hidden]' : tc.expected,
      isHidden: tc.isHidden
    }))
  };
  res.json(sanitized);
});

/**
 * Get editorial solution for a problem
 */
router.get('/problems/:id/solution', (req, res) => {
  const solution = getEditorialSolution(req.params.id);
  if (!solution) {
    return res.status(404).json({ error: 'Editorial solution not available for this problem' });
  }
  res.json(solution);
});

/**
 * Get entire Python DSA learning curriculum
 */
router.get('/curriculum', (req, res) => {
  res.json(DSA_CURRICULUM);
});

/**
 * Get user learning progress and streak data
 */
router.get('/progress', (req, res) => {
  const now = Date.now();
  const daysSinceLast = Math.floor((now - userProgress.lastPracticeTimestamp) / (1000 * 60 * 60 * 24));
  res.json({
    ...userProgress,
    daysSinceLastPractice: daysSinceLast,
    needsReminder: daysSinceLast >= 3
  });
});

/**
 * Update user progress (e.g. problem solved or attempted)
 */
router.post('/progress', (req, res) => {
  const { problemId, status } = req.body;
  const now = Date.now();

  if (problemId) {
    if (status === 'solved') {
      if (!userProgress.solvedProblemIds.includes(problemId)) {
        userProgress.solvedProblemIds.push(problemId);
      }
    } else {
      if (!userProgress.attemptedProblemIds.includes(problemId)) {
        userProgress.attemptedProblemIds.push(problemId);
      }
    }
  }

  // Update streak logic
  const daysDiff = Math.floor((now - userProgress.lastPracticeTimestamp) / (1000 * 60 * 60 * 24));
  if (daysDiff === 1) {
    userProgress.streakDays += 1;
  } else if (daysDiff > 1) {
    userProgress.streakDays = 1; // streak reset if missed a day
  }

  userProgress.lastPracticeTimestamp = now;
  userProgress.history.push({
    timestamp: now,
    problemId,
    status
  });

  res.json({
    success: true,
    progress: userProgress,
    daysSinceLastPractice: 0,
    needsReminder: false
  });
});

/**
 * Create a new interview session room
 */
router.post('/rooms', (req, res) => {
  const { problemId, title } = req.body;
  const room = createRoom({ problemId, title });
  res.json({
    roomId: room.id,
    title: room.title,
    interviewerToken: room.interviewerToken,
    candidateToken: room.candidateToken,
    interviewerUrl: `/room.html?room=${room.id}&role=interviewer&token=${room.interviewerToken}`,
    candidateUrl: `/room.html?room=${room.id}&role=candidate&token=${room.candidateToken}`
  });
});

/**
 * Get room state
 */
router.get('/rooms/:id', (req, res) => {
  const room = getRoom(req.params.id);
  if (!room) {
    return res.status(404).json({ error: 'Room not found' });
  }

  const role = req.query.role || 'candidate';
  const token = req.query.token || '';
  const auth = validateRole(room, role, token);

  res.json(getClientRoomState(room, auth.role));
});

/**
 * Execute arbitrary code or test runner
 */
router.post('/execute', async (req, res) => {
  try {
    const { language, code, stdin, problemId, mode = 'run' } = req.body;

    if (!code || !language) {
      return res.status(400).json({ error: 'Code and language are required.' });
    }

    if (mode === 'tests' && problemId) {
      const problem = getProblemById(problemId);
      if (!problem) {
        return res.status(404).json({ error: 'Problem not found for test execution' });
      }

      const testRun = await runTestCases({
        language,
        code,
        testCases: problem.testCases,
        includeHidden: true
      });

      return res.json(testRun);
    }

    // Default raw code execution
    const result = await executeCode({
      language,
      code,
      stdin: stdin || '',
      timeoutMs: 6000
    });

    res.json(result);
  } catch (err) {
    console.error('Execution error:', err);
    res.status(500).json({ error: `Internal execution error: ${err.message}` });
  }
});

/**
 * Generate post-interview AI evaluation report
 */
router.post('/evaluate', async (req, res) => {
  try {
    const { roomId, token, problemId, code, language, testResults } = req.body;

    let problem = null;
    let interviewerNotes = null;
    let timelineEvents = [];

    if (roomId) {
      const room = getRoom(roomId);
      if (room) {
        problem = getProblemById(room.problemId);
        interviewerNotes = room.interviewerNotes;
        timelineEvents = room.timelineEvents;
      }
    }

    if (!problem && problemId) {
      problem = getProblemById(problemId);
    }

    const report = await generateEvaluationReport({
      problem,
      code,
      language: language || 'python',
      testResults,
      interviewerNotes,
      timelineEvents
    });

    // Save to room if valid
    if (roomId) {
      const room = getRoom(roomId);
      if (room) {
        room.evaluationReport = report;
        broadcast(room, {
          type: 'EVALUATION_REPORT_READY',
          report
        });
      }
    }

    res.json(report);
  } catch (err) {
    console.error('Evaluation error:', err);
    res.status(500).json({ error: `Failed to generate evaluation report: ${err.message}` });
  }
});

module.exports = router;
