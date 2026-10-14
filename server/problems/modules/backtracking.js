/**
 * Real-Time Collaborative Code Interview Platform
 * Module: Backtracking
 * Zero Emojis - Zero Em Dashes
 */

const MODULE = {
  id: 'backtracking',
  title: 'Backtracking',
  category: 'Backtracking',
  description: 'Exhaustive state space search, constraint satisfaction, decision trees, and prune-and-undo backtracking.',
  pythonToolkit: [
    {
      name: 'Backtracking Template',
      syntax: 'def backtrack(path, choices):\n    if is_solution(path):\n        res.append(path[:])\n        return\n    for choice in choices:\n        path.append(choice)\n        backtrack(path, new_choices)\n        path.pop()',
      complexity: 'Branching factor b^depth d',
      description: 'Choose, explore, and unchoose pattern.'
    },
    {
      name: 'In-Place Grid Visited Marker',
      syntax: 'board[r][c] = "#"  # visited\n# explore neighbours\nboard[r][c] = original  # backtrack',
      complexity: 'O(1) extra space',
      description: 'Replaces separate visited set with in-place character substitution.'
    }
  ],
  keyPatterns: [
    'Subsets and combinations with duplicate avoidance via sorted input',
    'Permutations with used elements boolean array',
    '2D grid exploration with cell unmarking'
  ],
  problems: [
    {
      id: 'combination-sum',
      title: 'Combination Sum',
      difficulty: 'Medium',
      category: 'Backtracking',
      neetcodeCategory: 'Backtracking',
      neetcodeOrder: 42,
      isNeetCode75: true,
      description: `Given an array of distinct integers \`candidates\` and a target integer \`target\`, return a list of all unique combinations of \`candidates\` where the chosen numbers sum to \`target\`. You may return the combinations in any order.

The same number may be chosen from \`candidates\` an unlimited number of times. Two combinations are unique if the frequency of at least one of the chosen numbers is different.

### Example 1:
\`\`\`
Input: candidates = [2, 3, 6, 7], target = 7
Output: [[2, 2, 3], [7]]
Explanation:
2 and 3 are candidates, and 2 + 2 + 3 = 7. Note that 2 can be used multiple times.
7 is a candidate, and 7 = 7.
These are the only two combinations.
\`\`\`

### Example 2:
\`\`\`
Input: candidates = [2, 3, 5], target = 8
Output: [[2, 2, 2, 2], [2, 3, 3], [3, 5]]
\`\`\`

### Constraints:
* 1 <= candidates.length <= 30
* 2 <= candidates[i] <= 40
* All elements of \`candidates\` are distinct.
* 1 <= target <= 40`,
      optimalComplexity: { time: 'O(2^(target / min_candidate))', space: 'O(target / min_candidate)' },
      starterCode: {
        python: `def combination_sum(candidates, target):
    # Use DFS backtracking exploring with and without reusing current element
    pass

if __name__ == '__main__':
    import json, sys
    lines = sys.stdin.read().strip().splitlines()
    for l in lines:
        if l.strip():
            d = json.loads(l)
            res = combination_sum(d['candidates'], d['target'])
            # Sort for stable testing
            normalized = sorted([sorted(c) for c in res])
            print(json.dumps(normalized))
`,
        javascript: `function combinationSum(candidates, target) {
    // Write your solution here
}

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
rl.on('line', (line) => {
    if (!line.trim()) return;
    const data = JSON.parse(line);
    const res = combinationSum(data.candidates, data.target) || [];
    const normalized = res.map(arr => arr.slice().sort((a,b)=>a-b)).sort((a,b)=>JSON.stringify(a).localeCompare(JSON.stringify(b)));
    console.log(JSON.stringify(normalized));
});
`
      },
      testCases: [
        {
          id: 'tc-1',
          description: 'Basic target sum combinations',
          input: '{"candidates": [2, 3, 6, 7], "target": 7}',
          expected: '[[2, 2, 3], [7]]',
          isHidden: false
        },
        {
          id: 'tc-2',
          description: 'Multiple combinations with repeats',
          input: '{"candidates": [2, 3, 5], "target": 8}',
          expected: '[[2, 2, 2, 2], [2, 3, 3], [3, 5]]',
          isHidden: false
        },
        {
          id: 'tc-3',
          description: 'No combination possible',
          input: '{"candidates": [2], "target": 1}',
          expected: '[]',
          isHidden: true
        }
      ],
      editorialSolution: {
        python: `def combination_sum(candidates, target):
    res = []
    candidates.sort()

    def backtrack(start, remain, path):
        if remain == 0:
            res.append(path[:])
            return
        for i in range(start, len(candidates)):
            num = candidates[i]
            if num > remain:
                break # Prune search branch
            path.append(num)
            backtrack(i, remain - num, path) # Reuse same index i
            path.pop()

    backtrack(0, target, [])
    return res`,
        explanation: `We sort candidates to allow early pruning whenever a number exceeds the remaining target. In the backtracking loop, passing the same index i to the recursive call allows candidates to be reused arbitrarily, while starting subsequent iterations from i prevents permutation duplicates.`
      }
    },
    {
      id: 'word-search',
      title: 'Word Search',
      difficulty: 'Medium',
      category: 'Backtracking',
      neetcodeCategory: 'Backtracking',
      neetcodeOrder: 43,
      isNeetCode75: true,
      description: `Given an \`m x n\` grid of characters \`board\` and a string \`word\`, return \`true\` if \`word\` exists in the grid.

The word can be constructed from letters of sequentially adjacent cells, where adjacent cells are horizontally or vertically neighboring. The same letter cell may not be used more than once.

### Example 1:
\`\`\`
Input: board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCCED"
Output: true
\`\`\`

### Example 2:
\`\`\`
Input: board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "SEE"
Output: true
\`\`\`

### Example 3:
\`\`\`
Input: board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCB"
Output: false
\`\`\`

### Constraints:
* m == board.length
* n = board[i].length
* 1 <= m, n <= 6
* 1 <= word.length <= 15
* \`board\` and \`word\` consist of only lowercase and uppercase English letters.`,
      optimalComplexity: { time: 'O(M * N * 3^L) where L = word.length', space: 'O(L) recursion stack' },
      starterCode: {
        python: `def exist(board, word):
    # Perform DFS from every cell matching word[0]
    pass

if __name__ == '__main__':
    import json, sys
    lines = sys.stdin.read().strip().splitlines()
    for l in lines:
        if l.strip():
            d = json.loads(l)
            print(json.dumps(exist(d['board'], d['word'])))
`,
        javascript: `function exist(board, word) {
    // Write your solution here
}

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
rl.on('line', (line) => {
    if (!line.trim()) return;
    const data = JSON.parse(line);
    console.log(JSON.stringify(exist(data.board, data.word)));
});
`
      },
      testCases: [
        {
          id: 'tc-1',
          description: 'Word exists along path',
          input: '{"board": [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], "word": "ABCCED"}',
          expected: 'true',
          isHidden: false
        },
        {
          id: 'tc-2',
          description: 'Shorter word matching suffix',
          input: '{"board": [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], "word": "SEE"}',
          expected: 'true',
          isHidden: false
        },
        {
          id: 'tc-3',
          description: 'Path requires reusing cell, which is illegal',
          input: '{"board": [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], "word": "ABCB"}',
          expected: 'false',
          isHidden: false
        }
      ],
      editorialSolution: {
        python: `def exist(board, word):
    rows, cols = len(board), len(board[0])

    def dfs(r, c, idx):
        if idx == len(word):
            return True
        if r < 0 or r >= rows or c < 0 or c >= cols or board[r][c] != word[idx]:
            return False

        temp = board[r][c]
        board[r][c] = '#' # Mark visited

        found = (dfs(r + 1, c, idx + 1) or
                 dfs(r - 1, c, idx + 1) or
                 dfs(r, c + 1, idx + 1) or
                 dfs(r, c - 1, idx + 1))

        board[r][c] = temp # Backtrack
        return found

    for r in range(rows):
        for c in range(cols):
            if board[r][c] == word[0] and dfs(r, c, 0):
                return True
    return False`,
        explanation: `We iterate through every cell in the matrix. If a cell matches the initial character of word, we launch a DFS. In each step, we temporarily replace the current cell character with a sentinel '#' to prevent revisiting it along the active search path, test all 4 adjacent directions, and restore the original character upon backtracking.`
      }
    }
  ]
};

module.exports = MODULE;
