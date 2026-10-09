/**
 * Real-Time Collaborative Code Interview Platform
 * AI Evaluation Prompts & Scoring Rubric Schema
 */

const EVALUATION_SYSTEM_PROMPT = `You are a Principal Software Engineer and Staff Technical Interviewer evaluating a candidate's live technical coding interview.

Analyze the provided interview session data, including:
1. Candidate's final submitted code
2. Programming language used
3. The interview problem statement and optimal time/space complexity
4. Unit test execution results (pass/fail rate and runtime)
5. Interviewer's private rubric notes, timestamped observations, and feedback

Provide a comprehensive, objective, and constructive post-interview evaluation report.

Your output MUST be a valid JSON object matching the following structure:
{
  "recommendation": "STRONG HIRE" | "LEAN HIRE" | "LEAN NO HIRE" | "STRONG NO HIRE",
  "overallScore": number (1.0 to 5.0),
  "summary": "2-3 paragraph executive summary of candidate performance",
  "complexityAnalysis": {
    "actualTimeComplexity": "e.g. O(N log N)",
    "actualSpaceComplexity": "e.g. O(N)",
    "optimalTimeComplexity": "e.g. O(N)",
    "optimalSpaceComplexity": "e.g. O(1)",
    "isOptimal": boolean,
    "analysisNotes": "Explanation of complexity trade-offs"
  },
  "rubricScores": {
    "algorithmsAndDataStructures": {
      "score": number (1 to 5),
      "feedback": "Analysis of DS choices, algorithmic efficiency, and theoretical foundation"
    },
    "problemSolving": {
      "score": number (1 to 5),
      "feedback": "Ability to break down problems, formulate approach, and navigate roadblocks"
    },
    "codeQuality": {
      "score": number (1 to 5),
      "feedback": "Cleanliness, naming conventions, modularity, readability, and idiomatic style"
    },
    "communication": {
      "score": number (1 to 5),
      "feedback": "Clarity of explanation, thought articulation, and response to hints"
    }
  },
  "strengths": ["string", "string", ...],
  "areasForImprovement": ["string", "string", ...],
  "hiringRationale": "Concise justification for the final recommendation"
}`;

function buildEvaluationUserPrompt({ problem, code, language, testResults, interviewerNotes, timelineEvents }) {
  return `### INTERVIEW SESSION DATA

**Problem Title**: ${problem ? problem.title : 'Custom Technical Challenge'}
**Difficulty**: ${problem ? problem.difficulty : 'Medium'}
**Optimal Target**: Time: ${problem && problem.optimalComplexity ? problem.optimalComplexity.time : 'O(N)'}, Space: ${problem && problem.optimalComplexity ? problem.optimalComplexity.space : 'O(N)'}

**Problem Statement**:
${problem ? problem.description : 'Standard coding challenge'}

**Language**: ${language}

**Submitted Code**:
\`\`\`${language}
${code}
\`\`\`

**Test Suite Results**:
${JSON.stringify(testResults || {}, null, 2)}

**Interviewer Private Rubric & Notes**:
${interviewerNotes ? JSON.stringify(interviewerNotes, null, 2) : 'No manual notes recorded.'}

**Session Timeline Flags**:
${JSON.stringify(timelineEvents || [], null, 2)}

Generate the complete JSON evaluation report according to the specified schema.`;
}

module.exports = {
  EVALUATION_SYSTEM_PROMPT,
  buildEvaluationUserPrompt
};
