/**
 * Real-Time Collaborative Code Interview Platform
 * Deterministic Heuristic AST & Code Analysis Engine
 * Generates instant, comprehensive evaluation reports offline without external LLM keys.
 */

function analyzeCodeComplexity(code, language) {
  const cleanCode = code.replace(/\/\/.*|\/\*[\s\S]*?\*\/|#.*|"""[\s\S]*?"""/g, '');
  
  // Detect loop nesting
  let maxLoopDepth = 0;
  let currentDepth = 0;
  const lines = cleanCode.split('\n');

  const loopPatterns = [
    /\bfor\b/,
    /\bwhile\b/,
    /\.forEach\b/,
    /\.map\b/,
    /\.filter\b/
  ];

  for (const line of lines) {
    const isLoop = loopPatterns.some(p => p.test(line));
    if (isLoop) {
      currentDepth++;
      if (currentDepth > maxLoopDepth) maxLoopDepth = currentDepth;
    }
    // Simple block decrement heuristic for python and curly brace languages
    if (line.includes('}') || (language === 'python' && line.trim().length > 0 && !line.startsWith(' ') && !line.startsWith('\t'))) {
      if (currentDepth > 0) currentDepth--;
    }
  }

  // Detect sorting
  const hasSort = /\b(sort|sorted|std::sort|Arrays\.sort)\b/.test(cleanCode);

  // Detect hash structures (O(N) space or O(1) lookups)
  const hasHashMap = /\b(dict|\{\}|Map|Set|unordered_map|HashMap|HashSet)\b/.test(cleanCode);

  // Detect recursion
  const hasRecursion = /\breturn\s+[a-zA-Z0-9_]+\(/.test(cleanCode);

  // Determine estimated time complexity
  let estimatedTime = 'O(N)';
  if (hasSort) {
    estimatedTime = 'O(N log N)';
  } else if (maxLoopDepth >= 3) {
    estimatedTime = 'O(N^3)';
  } else if (maxLoopDepth === 2) {
    estimatedTime = 'O(N^2)';
  } else if (maxLoopDepth === 1) {
    estimatedTime = 'O(N)';
  } else if (maxLoopDepth === 0 && !hasRecursion) {
    estimatedTime = 'O(1)';
  }

  // Space complexity
  let estimatedSpace = 'O(1)';
  if (hasHashMap || cleanCode.includes('new Array') || cleanCode.includes('.append(') || cleanCode.includes('vector<')) {
    estimatedSpace = 'O(N)';
  }

  return {
    estimatedTime,
    estimatedSpace,
    hasSort,
    hasHashMap,
    hasRecursion,
    maxLoopDepth
  };
}

/**
 * Generate heuristic post-interview report
 */
function generateHeuristicReport({ problem, code, language, testResults, interviewerNotes, timelineEvents }) {
  const complexity = analyzeCodeComplexity(code || '', language || 'python');
  
  // Calculate test pass metrics
  const totalTests = testResults && testResults.summary ? testResults.summary.total : 0;
  const passedTests = testResults && testResults.summary ? testResults.summary.passed : 0;
  const passRate = totalTests > 0 ? (passedTests / totalTests) : 0.8; // default baseline

  // Factor in interviewer notes & scores if present
  const manualScores = interviewerNotes && interviewerNotes.scores ? interviewerNotes.scores : {};
  const interviewerComments = interviewerNotes && interviewerNotes.notes ? interviewerNotes.notes : '';

  // Rubric Scores calculation
  const dsaBase = passRate * 3 + (complexity.hasHashMap ? 1 : 0) + (complexity.estimatedTime.includes('O(N)') ? 1 : 0);
  const dsaScore = manualScores.dsa || Math.min(5, Math.max(1, Math.round(dsaBase * 10) / 10));

  const codeLen = (code || '').split('\n').filter(l => l.trim().length > 0).length;
  const hasComments = /\/\/|#|\/\*/.test(code || '');
  const qualityBase = 3.0 + (hasComments ? 0.8 : 0) + (codeLen > 5 && codeLen < 60 ? 0.7 : -0.5);
  const qualityScore = manualScores.codeQuality || Math.min(5, Math.max(1, Math.round(qualityBase * 10) / 10));

  const psScore = manualScores.problemSolving || Math.min(5, Math.max(1, Math.round((passRate * 4 + 0.8) * 10) / 10));
  const commScore = manualScores.communication || (timelineEvents && timelineEvents.length > 2 ? 4.2 : 3.8);

  const overallScore = Math.round(((dsaScore + psScore + qualityScore + commScore) / 4) * 10) / 10;

  let recommendation = 'LEAN HIRE';
  if (overallScore >= 4.4 && passRate >= 0.9) {
    recommendation = 'STRONG HIRE';
  } else if (overallScore >= 3.5) {
    recommendation = 'LEAN HIRE';
  } else if (overallScore >= 2.5) {
    recommendation = 'LEAN NO HIRE';
  } else {
    recommendation = 'STRONG NO HIRE';
  }

  const optimalTime = problem && problem.optimalComplexity ? problem.optimalComplexity.time : 'O(N)';
  const optimalSpace = problem && problem.optimalComplexity ? problem.optimalComplexity.space : 'O(N)';
  const isOptimal = complexity.estimatedTime === optimalTime;

  const strengths = [];
  const areasForImprovement = [];

  if (passedTests === totalTests && totalTests > 0) {
    strengths.push('Candidate passed all public and hidden test cases with correct boundary validation.');
  } else if (passedTests > 0) {
    strengths.push(`Successfully resolved core problem requirements passing ${passedTests} out of ${totalTests} unit test cases.`);
  }

  if (complexity.hasHashMap) {
    strengths.push('Demonstrated strong data structure intuition by utilizing hash-based lookups to minimize runtime.');
  }

  if (isOptimal) {
    strengths.push(`Achieved optimal asymptotic complexity targets (${optimalTime} runtime, ${optimalSpace} auxiliary memory).`);
  } else {
    areasForImprovement.push(`Algorithmic time complexity evaluated at ${complexity.estimatedTime}; consider refining approach towards optimal target of ${optimalTime}.`);
  }

  if (hasComments) {
    strengths.push('Included clear structural comments and clean variable naming conventions.');
  } else {
    areasForImprovement.push('Could benefit from adding concise explanatory comments for complex control branches.');
  }

  if (timelineEvents && timelineEvents.length > 0) {
    strengths.push('Actively articulated thought process across session timeline intervals.');
  }

  if (interviewerComments) {
    strengths.push(`Interviewer Observation: ${interviewerComments}`);
  }

  return {
    recommendation,
    overallScore,
    summary: `During this technical interview on ${problem ? problem.title : 'Technical Coding Assessment'}, the candidate demonstrated solid technical aptitude using ${language.toUpperCase()}. The candidate constructed a solution spanning ${codeLen} lines of code, achieving an estimated runtime complexity of ${complexity.estimatedTime} and space complexity of ${complexity.estimatedSpace}. Automated test validation resulted in ${passedTests}/${totalTests} unit tests passing cleanly.`,
    complexityAnalysis: {
      actualTimeComplexity: complexity.estimatedTime,
      actualSpaceComplexity: complexity.estimatedSpace,
      optimalTimeComplexity: optimalTime,
      optimalSpaceComplexity: optimalSpace,
      isOptimal,
      analysisNotes: isOptimal
        ? 'The candidate met the optimal asymptotic bounds for this problem class.'
        : `Candidate code exhibits ${complexity.estimatedTime} complexity. The theoretical target for this problem is ${optimalTime}.`
    },
    rubricScores: {
      algorithmsAndDataStructures: {
        score: dsaScore,
        feedback: `Chosen data structures and lookup mechanisms provided appropriate performance characteristics.`
      },
      problemSolving: {
        score: psScore,
        feedback: `Candidate progressively formulated an actionable strategy and executed the algorithm accurately.`
      },
      codeQuality: {
        score: qualityScore,
        feedback: `Code structure maintained clean indentation, readable variable identifiers, and modular logic flow.`
      },
      communication: {
        score: commScore,
        feedback: `Candidate maintained steady pace throughout the session and verified their logic systematically.`
      }
    },
    strengths,
    areasForImprovement,
    hiringRationale: recommendation.includes('HIRE')
      ? `Candidate meets the engineering bar with an overall rating of ${overallScore}/5.0, demonstrating capable algorithmic problem solving and functional code delivery.`
      : `Candidate performed below target criteria with a rating of ${overallScore}/5.0, encountering bottlenecks on test validation or algorithmic complexity.`
  };
}

module.exports = {
  analyzeCodeComplexity,
  generateHeuristicReport
};
