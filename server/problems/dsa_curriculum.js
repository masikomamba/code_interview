/**
 * Real-Time Collaborative Code Interview Platform
 * Comprehensive Python DSA Curriculum & Technical Interview Problem Repository
 * Covers 11 Core DSA Interview Topics with Curated LeetCode Classics
 * Zero Emojis - Zero Em Dashes
 */

const arraysTwoPointers = require('./modules/arrays_two_pointers');
const hashmapsSets = require('./modules/hashmaps_sets');
const slidingWindow = require('./modules/sliding_window');
const stacksQueues = require('./modules/stacks_queues');
const linkedLists = require('./modules/linked_lists');
const treesBst = require('./modules/trees_bst');
const heapsPriorityQueues = require('./modules/heaps_priority_queues');
const binarySearch = require('./modules/binary_search');
const graphs = require('./modules/graphs');
const dynamicProgramming = require('./modules/dynamic_programming');
const intervalsGreedy = require('./modules/intervals_greedy');
const tries = require('./modules/tries');
const backtracking = require('./modules/backtracking');
const mathGeometry = require('./modules/math_geometry');
const bitManipulation = require('./modules/bit_manipulation');

const DSA_CURRICULUM = [
  hashmapsSets,
  arraysTwoPointers,
  slidingWindow,
  stacksQueues,
  binarySearch,
  linkedLists,
  treesBst,
  tries,
  heapsPriorityQueues,
  backtracking,
  graphs,
  dynamicProgramming,
  intervalsGreedy,
  mathGeometry,
  bitManipulation
];

module.exports = {
  DSA_CURRICULUM
};
