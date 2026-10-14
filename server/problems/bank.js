/**
 * Real-Time Collaborative Code Interview Platform
 * Problem Bank Repository: Curated Technical Interview Problems & Editorial Solutions
 * Covers 11 Core DSA Topics with Comprehensive LeetCode Practice Problems
 * Zero Emojis - Zero Em Dashes
 */

const { DSA_CURRICULUM } = require('./dsa_curriculum');
const { NEETCODE_75_ROADMAP, NEETCODE_75_MAP } = require('./neetcode75');

// Collect all curated problems directly from curriculum modules
const CURRICULUM_PROBLEMS = DSA_CURRICULUM.flatMap(c => c.problems);

const ALL_PROBLEMS = [];
const seenIds = new Set();

for (const p of CURRICULUM_PROBLEMS) {
  if (!seenIds.has(p.id)) {
    seenIds.add(p.id);
    const ncInfo = NEETCODE_75_MAP.get(p.id);
    if (ncInfo) {
      p.isNeetCode75 = true;
      p.neetcodeOrder = ncInfo.order;
      p.neetcodeCategory = ncInfo.category;
    }
    ALL_PROBLEMS.push(p);
  }
}

// Sort problems so NeetCode 75 problems appear in their canonical order (1 to 75+)
ALL_PROBLEMS.sort((a, b) => {
  const orderA = a.neetcodeOrder || 999;
  const orderB = b.neetcodeOrder || 999;
  if (orderA !== orderB) return orderA - orderB;
  return a.title.localeCompare(b.title);
});

function getProblemById(id) {
  return ALL_PROBLEMS.find(p => p.id === id) || null;
}

function listProblems() {
  return ALL_PROBLEMS.map(p => ({
    id: p.id,
    title: p.title,
    difficulty: p.difficulty,
    category: p.category,
    neetcodeCategory: p.neetcodeCategory || p.category,
    neetcodeOrder: p.neetcodeOrder || null,
    isNeetCode75: !!p.isNeetCode75,
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
  NEETCODE_75_ROADMAP,
  getProblemById,
  listProblems,
  getEditorialSolution,
  DSA_CURRICULUM
};
