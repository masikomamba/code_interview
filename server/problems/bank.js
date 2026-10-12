/**
 * Real-Time Collaborative Code Interview Platform
 * Problem Bank Repository: Curated Technical Interview Problems & Editorial Solutions
 * Covers 11 Core DSA Topics with Comprehensive LeetCode Practice Problems
 * Zero Emojis - Zero Em Dashes
 */

const { DSA_CURRICULUM } = require('./dsa_curriculum');

// Collect all curated problems directly from curriculum modules
const CURRICULUM_PROBLEMS = DSA_CURRICULUM.flatMap(c => c.problems);

const ALL_PROBLEMS = [];
const seenIds = new Set();

for (const p of CURRICULUM_PROBLEMS) {
  if (!seenIds.has(p.id)) {
    seenIds.add(p.id);
    ALL_PROBLEMS.push(p);
  }
}

function getProblemById(id) {
  return ALL_PROBLEMS.find(p => p.id === id) || null;
}

function listProblems() {
  return ALL_PROBLEMS.map(p => ({
    id: p.id,
    title: p.title,
    difficulty: p.difficulty,
    category: p.category,
    optimalComplexity: p.optimalComplexity,
    testCasesCount: p.testCases ? p.testCases.length : 0,
    hasEditorial: !!p.editorialSolution,
    summary: p.description ? p.description.split('\n')[0].replace(/[#`*]/g, '').trim() : ''
  }));
}

function getEditorialSolution(id) {
  const p = getProblemById(id);
  return p ? p.editorialSolution : null;
}

module.exports = {
  PROBLEMS: ALL_PROBLEMS,
  getProblemById,
  listProblems,
  getEditorialSolution,
  DSA_CURRICULUM
};
