/**
 * Real-Time Collaborative Code Interview Platform
 * Canonical NeetCode 75 Problem Index & Roadmap Specification
 * Zero Emojis - Zero Em Dashes
 */

const NEETCODE_75_ROADMAP = [
  // 1. Arrays & Hashing (8)
  { id: 'contains-duplicate', order: 1, title: 'Contains Duplicate', category: 'Arrays & Hashing', difficulty: 'Easy' },
  { id: 'valid-anagram', order: 2, title: 'Valid Anagram', category: 'Arrays & Hashing', difficulty: 'Easy' },
  { id: 'two-sum', order: 3, title: 'Two Sum', category: 'Arrays & Hashing', difficulty: 'Easy' },
  { id: 'group-anagrams', order: 4, title: 'Group Anagrams', category: 'Arrays & Hashing', difficulty: 'Medium' },
  { id: 'top-k-frequent', order: 5, title: 'Top K Frequent Elements', category: 'Arrays & Hashing', difficulty: 'Medium' },
  { id: 'product-except-self', order: 6, title: 'Product of Array Except Self', category: 'Arrays & Hashing', difficulty: 'Medium' },
  { id: 'encode-decode-strings', order: 7, title: 'Encode and Decode Strings', category: 'Arrays & Hashing', difficulty: 'Medium' },
  { id: 'longest-consecutive', order: 8, title: 'Longest Consecutive Sequence', category: 'Arrays & Hashing', difficulty: 'Medium' },

  // 2. Two Pointers (5)
  { id: 'valid-palindrome', order: 9, title: 'Valid Palindrome', category: 'Two Pointers', difficulty: 'Easy' },
  { id: 'two-sum-sorted', order: 10, title: 'Two Sum II: Input Array Is Sorted', category: 'Two Pointers', difficulty: 'Medium' },
  { id: 'three-sum', order: 11, title: '3Sum', category: 'Two Pointers', difficulty: 'Medium' },
  { id: 'container-most-water', order: 12, title: 'Container With Most Water', category: 'Two Pointers', difficulty: 'Medium' },
  { id: 'trapping-rain-water', order: 13, title: 'Trapping Rain Water', category: 'Two Pointers', difficulty: 'Hard' },

  // 3. Sliding Window (4)
  { id: 'stock-buy-sell', order: 14, title: 'Best Time to Buy and Sell Stock', category: 'Sliding Window', difficulty: 'Easy' },
  { id: 'longest-unique-substring', order: 15, title: 'Longest Substring Without Repeating Characters', category: 'Sliding Window', difficulty: 'Medium' },
  { id: 'longest-repeating-char-replacement', order: 16, title: 'Longest Repeating Character Replacement', category: 'Sliding Window', difficulty: 'Medium' },
  { id: 'minimum-window-substring', order: 17, title: 'Minimum Window Substring', category: 'Sliding Window', difficulty: 'Hard' },

  // 4. Stack (1)
  { id: 'valid-parentheses', order: 18, title: 'Valid Parentheses', category: 'Stack', difficulty: 'Easy' },

  // 5. Binary Search (2)
  { id: 'find-min-rotated', order: 19, title: 'Find Minimum in Rotated Sorted Array', category: 'Binary Search', difficulty: 'Medium' },
  { id: 'search-rotated-array', order: 20, title: 'Search in Rotated Sorted Array', category: 'Binary Search', difficulty: 'Medium' },

  // 6. Linked List (6)
  { id: 'reverse-linked-list', order: 21, title: 'Reverse Linked List', category: 'Linked List', difficulty: 'Easy' },
  { id: 'merge-sorted-lists', order: 22, title: 'Merge Two Sorted Lists', category: 'Linked List', difficulty: 'Easy' },
  { id: 'reorder-list', order: 23, title: 'Reorder List', category: 'Linked List', difficulty: 'Medium' },
  { id: 'remove-nth-from-end', order: 24, title: 'Remove Nth Node From End of List', category: 'Linked List', difficulty: 'Medium' },
  { id: 'linked-list-cycle', order: 25, title: 'Linked List Cycle', category: 'Linked List', difficulty: 'Easy' },
  { id: 'merge-k-sorted-lists', order: 26, title: 'Merge k Sorted Lists', category: 'Linked List', difficulty: 'Hard' },

  // 7. Trees (11)
  { id: 'invert-binary-tree', order: 27, title: 'Invert Binary Tree', category: 'Trees', difficulty: 'Easy' },
  { id: 'max-depth-binary-tree', order: 28, title: 'Maximum Depth of Binary Tree', category: 'Trees', difficulty: 'Easy' },
  { id: 'same-tree', order: 29, title: 'Same Tree', category: 'Trees', difficulty: 'Easy' },
  { id: 'subtree-of-another-tree', order: 30, title: 'Subtree of Another Tree', category: 'Trees', difficulty: 'Easy' },
  { id: 'lowest-common-ancestor-bst', order: 31, title: 'Lowest Common Ancestor of a BST', category: 'Trees', difficulty: 'Medium' },
  { id: 'level-order-traversal', order: 32, title: 'Binary Tree Level Order Traversal', category: 'Trees', difficulty: 'Medium' },
  { id: 'validate-bst', order: 33, title: 'Validate Binary Search Tree', category: 'Trees', difficulty: 'Medium' },
  { id: 'kth-smallest-bst', order: 34, title: 'Kth Smallest Element in a BST', category: 'Trees', difficulty: 'Medium' },
  { id: 'build-tree-preorder-inorder', order: 35, title: 'Construct Binary Tree from Preorder and Inorder Traversal', category: 'Trees', difficulty: 'Medium' },
  { id: 'binary-tree-max-path-sum', order: 36, title: 'Binary Tree Maximum Path Sum', category: 'Trees', difficulty: 'Hard' },
  { id: 'serialize-deserialize-binary-tree', order: 37, title: 'Serialize and Deserialize Binary Tree', category: 'Trees', difficulty: 'Hard' },

  // 8. Tries (3)
  { id: 'implement-trie', order: 38, title: 'Implement Trie (Prefix Tree)', category: 'Tries', difficulty: 'Medium' },
  { id: 'design-add-search-words', order: 39, title: 'Design Add and Search Words Data Structure', category: 'Tries', difficulty: 'Medium' },
  { id: 'word-search-ii', order: 40, title: 'Word Search II', category: 'Tries', difficulty: 'Hard' },

  // 9. Heap / Priority Queue (1)
  { id: 'median-finder', order: 41, title: 'Find Median from Data Stream', category: 'Heap / Priority Queue', difficulty: 'Hard' },

  // 10. Backtracking (2)
  { id: 'combination-sum', order: 42, title: 'Combination Sum', category: 'Backtracking', difficulty: 'Medium' },
  { id: 'word-search', order: 43, title: 'Word Search', category: 'Backtracking', difficulty: 'Medium' },

  // 11. Graphs (6)
  { id: 'number-of-islands', order: 44, title: 'Number of Islands', category: 'Graphs', difficulty: 'Medium' },
  { id: 'clone-graph', order: 45, title: 'Clone Graph', category: 'Graphs', difficulty: 'Medium' },
  { id: 'pacific-atlantic', order: 46, title: 'Pacific Atlantic Water Flow', category: 'Graphs', difficulty: 'Medium' },
  { id: 'course-schedule', order: 47, title: 'Course Schedule', category: 'Graphs', difficulty: 'Medium' },
  { id: 'graph-valid-tree', order: 48, title: 'Graph Valid Tree', category: 'Graphs', difficulty: 'Medium' },
  { id: 'connected-components-count', order: 49, title: 'Number of Connected Components in an Undirected Graph', category: 'Graphs', difficulty: 'Medium' },

  // 12. Advanced Graphs (1)
  { id: 'alien-dictionary', order: 50, title: 'Alien Dictionary', category: 'Advanced Graphs', difficulty: 'Hard' },

  // 13. 1-D Dynamic Programming (10)
  { id: 'climbing-stairs', order: 51, title: 'Climbing Stairs', category: '1-D Dynamic Programming', difficulty: 'Easy' },
  { id: 'house-robber', order: 52, title: 'House Robber', category: '1-D Dynamic Programming', difficulty: 'Medium' },
  { id: 'house-robber-ii', order: 53, title: 'House Robber II (Circular Street)', category: '1-D Dynamic Programming', difficulty: 'Medium' },
  { id: 'longest-palindromic-substring', order: 54, title: 'Longest Palindromic Substring', category: '1-D Dynamic Programming', difficulty: 'Medium' },
  { id: 'palindromic-substrings', order: 55, title: 'Palindromic Substrings (Count All Palindromes)', category: '1-D Dynamic Programming', difficulty: 'Medium' },
  { id: 'decode-ways', order: 56, title: 'Decode Ways', category: '1-D Dynamic Programming', difficulty: 'Medium' },
  { id: 'coin-change', order: 57, title: 'Coin Change', category: '1-D Dynamic Programming', difficulty: 'Medium' },
  { id: 'max-product-subarray', order: 58, title: 'Maximum Product Subarray', category: '1-D Dynamic Programming', difficulty: 'Medium' },
  { id: 'word-break', order: 59, title: 'Word Break', category: '1-D Dynamic Programming', difficulty: 'Medium' },
  { id: 'longest-increasing-subsequence', order: 60, title: 'Longest Increasing Subsequence', category: '1-D Dynamic Programming', difficulty: 'Medium' },

  // 14. 2-D Dynamic Programming (2)
  { id: 'unique-paths', order: 61, title: 'Unique Paths', category: '2-D Dynamic Programming', difficulty: 'Medium' },
  { id: 'longest-common-subsequence', order: 62, title: 'Longest Common Subsequence', category: '2-D Dynamic Programming', difficulty: 'Medium' },

  // 15. Greedy (2)
  { id: 'maximum-subarray', order: 63, title: 'Maximum Subarray (Kadane Algorithm)', category: 'Greedy', difficulty: 'Medium' },
  { id: 'jump-game', order: 64, title: 'Jump Game', category: 'Greedy', difficulty: 'Medium' },

  // 16. Intervals (5)
  { id: 'insert-interval', order: 65, title: 'Insert Interval', category: 'Intervals', difficulty: 'Medium' },
  { id: 'merge-intervals', order: 66, title: 'Merge Intervals', category: 'Intervals', difficulty: 'Medium' },
  { id: 'non-overlapping-intervals', order: 67, title: 'Non-overlapping Intervals', category: 'Intervals', difficulty: 'Medium' },
  { id: 'meeting-rooms', order: 68, title: 'Meeting Rooms', category: 'Intervals', difficulty: 'Easy' },
  { id: 'meeting-rooms-ii', order: 69, title: 'Meeting Rooms II (Minimum Rooms Required)', category: 'Intervals', difficulty: 'Medium' },

  // 17. Math & Geometry (3)
  { id: 'rotate-image', order: 70, title: 'Rotate Image', category: 'Math & Geometry', difficulty: 'Medium' },
  { id: 'spiral-matrix', order: 71, title: 'Spiral Matrix', category: 'Math & Geometry', difficulty: 'Medium' },
  { id: 'set-matrix-zeroes', order: 72, title: 'Set Matrix Zeroes', category: 'Math & Geometry', difficulty: 'Medium' },

  // 18. Bit Manipulation (5)
  { id: 'number-of-1-bits', order: 73, title: 'Number of 1 Bits (Hamming Weight)', category: 'Bit Manipulation', difficulty: 'Easy' },
  { id: 'counting-bits', order: 74, title: 'Counting Bits', category: 'Bit Manipulation', difficulty: 'Easy' },
  { id: 'reverse-bits', order: 75, title: 'Reverse Bits', category: 'Bit Manipulation', difficulty: 'Easy' },
  { id: 'missing-number', order: 76, title: 'Missing Number', category: 'Bit Manipulation', difficulty: 'Easy' },
  { id: 'sum-of-two-integers', order: 77, title: 'Sum of Two Integers (Bitwise Addition)', category: 'Bit Manipulation', difficulty: 'Medium' }
];

const NEETCODE_75_MAP = new Map(NEETCODE_75_ROADMAP.map(item => [item.id, item]));

module.exports = {
  NEETCODE_75_ROADMAP,
  NEETCODE_75_MAP
};
