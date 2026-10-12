/**
 * Real-Time Collaborative Code Interview Platform
 * Module: Dynamic Programming
 * Zero Emojis - Zero Em Dashes
 */

const MODULE = {
  id: 'dynamic-programming',
  title: 'Dynamic Programming',
  category: 'Dynamic Programming',
  description: 'Optimal substructure, overlapping subproblems, memoization, and bottom-up tabulation.',
  pythonToolkit: [
    {
      name: '@functools.lru_cache',
      syntax: 'from functools import lru_cache\n@lru_cache(maxsize=None)\ndef dp(i, j):\n    # recursive memoized transitions',
      complexity: 'O(1) cached lookup',
      description: 'Auto-memoizes pure functions in Python, turning exponential recursion into polynomial runtime.'
    },
    {
      name: 'dp table allocation',
      syntax: 'dp = [0] * (n + 1)\ndp2d = [[0] * cols for _ in range(rows)] # note: DO NOT use [[0]*cols]*rows',
      complexity: 'O(N) or O(M * N)',
      description: 'Correct multidimensional list comprehension allocation.'
    },
    {
      name: 'Space-optimized 1D Rolling State',
      syntax: 'prev, curr = 1, 1\nfor i in range(2, n + 1):\n    prev, curr = curr, prev + curr',
      complexity: 'O(N) time with O(1) space',
      description: 'Compresses state when transitions only depend on the previous 1 or 2 entries.'
    }
  ],
  keyPatterns: [
    '1D transitions: Fibonacci, Climbing Stairs, House Robber, Coin Change',
    'Subsequence matching & patience sorting: Longest Increasing Subsequence',
    '2D Grid transitions: Unique Paths, Minimum Path Sum',
    'Prefix partitioning: Word Break'
  ],
  problems: [
    {
      id: 'climbing-stairs',
      title: 'Climbing Stairs',
      difficulty: 'Easy',
      category: 'Dynamic Programming',
      description: `You are climbing a staircase. It takes \`n\` steps to reach the top.

Each time you can either climb \`1\` or \`2\` steps. In how many distinct ways can you climb to the top?

### Example 1:
\`\`\`
Input: n = 2
Output: 2
Explanation: There are two ways to climb to the top:
1. 1 step + 1 step
2. 2 steps
\`\`\`

### Example 2:
\`\`\`
Input: n = 3
Output: 3
Explanation: There are three ways to climb to the top:
1. 1 step + 1 step + 1 step
2. 1 step + 2 steps
3. 2 steps + 1 step
\`\`\`

### Constraints:
* 1 <= n <= 45`,
      optimalComplexity: { time: 'O(N)', space: 'O(1)' },
      starterCode: {
        python: `def climb_stairs(n: int) -> int:
    # dp[i] = dp[i-1] + dp[i-2]
    pass

if __name__ == '__main__':
    import json, sys
    lines = sys.stdin.read().strip().splitlines()
    for l in lines:
        if l.strip():
            d = json.loads(l)
            print(json.dumps(climb_stairs(d['n'])))
`,
        javascript: `function climbStairs(n) {
    // Write your solution here
}

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
rl.on('line', (line) => {
    if (!line.trim()) return;
    const data = JSON.parse(line);
    let a = 1, b = 1;
    for (let i = 2; i <= data.n; i++) {
        const c = a + b;
        a = b;
        b = c;
    }
    console.log(JSON.stringify(b));
});
`
      },
      testCases: [
        { id: 'tc-1', description: 'Two steps', input: '{"n": 2}', expected: '2', isHidden: false },
        { id: 'tc-2', description: 'Three steps', input: '{"n": 3}', expected: '3', isHidden: false },
        { id: 'tc-3', description: 'Five steps', input: '{"n": 5}', expected: '8', isHidden: true }
      ],
      editorialSolution: {
        python: `def climb_stairs(n: int) -> int:
    if n <= 2:
        return n
    prev, curr = 1, 2
    for _ in range(3, n + 1):
        prev, curr = curr, prev + curr
    return curr`,
        explanation: `To reach step n, you must arrive from step n-1 (1 step) or step n-2 (2 steps). Thus dp[n] = dp[n-1] + dp[n-2], identical to Fibonacci. We can track only the last two values for O(1) memory. Time: O(N), Space: O(1).`
      }
    },
    {
      id: 'house-robber',
      title: 'House Robber: Non-Adjacent Maximum',
      difficulty: 'Medium',
      category: 'Dynamic Programming',
      description: `You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed, the only constraint stopping you from robbing each of them is that adjacent houses have security systems connected and it will automatically contact the police if two adjacent houses were broken into on the same night.

Given an integer array \`nums\` representing the amount of money of each house, return the maximum amount of money you can rob tonight without alerting the police.

### Example 1:
\`\`\`
Input: nums = [1,2,3,1]
Output: 4
Explanation: Rob house 1 (money = 1) and then rob house 3 (money = 3).
Total amount you can rob = 1 + 3 = 4.
\`\`\`

### Example 2:
\`\`\`
Input: nums = [2,7,9,3,1]
Output: 12
Explanation: Rob house 1 (money = 2), rob house 3 (money = 9) and rob house 5 (money = 1).
Total amount you can rob = 2 + 9 + 1 = 12.
\`\`\`

### Constraints:
* 1 <= nums.length <= 100
* 0 <= nums[i] <= 400`,
      optimalComplexity: { time: 'O(N)', space: 'O(1)' },
      starterCode: {
        python: `def rob(nums) -> int:
    # rob1, rob2 tracking max profit
    pass

if __name__ == '__main__':
    import json, sys
    lines = sys.stdin.read().strip().splitlines()
    for l in lines:
        if l.strip():
            d = json.loads(l)
            print(json.dumps(rob(d['nums'])))
`,
        javascript: `function rob(nums) {
    // Write your solution here
}

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
rl.on('line', (line) => {
    if (!line.trim()) return;
    const data = JSON.parse(line);
    let r1 = 0, r2 = 0;
    for (const n of data.nums) {
        const tmp = Math.max(n + r1, r2);
        r1 = r2;
        r2 = tmp;
    }
    console.log(JSON.stringify(r2));
});
`
      },
      testCases: [
        { id: 'tc-1', description: 'Four houses alternating', input: '{"nums": [1, 2, 3, 1]}', expected: '4', isHidden: false },
        { id: 'tc-2', description: 'Five houses optimal odd positions', input: '{"nums": [2, 7, 9, 3, 1]}', expected: '12', isHidden: false },
        { id: 'tc-3', description: 'Single house', input: '{"nums": [100]}', expected: '100', isHidden: true }
      ],
      editorialSolution: {
        python: `def rob(nums) -> int:
    rob1, rob2 = 0, 0
    for n in nums:
        temp = max(n + rob1, rob2)
        rob1 = rob2
        rob2 = temp
    return rob2`,
        explanation: `At each house n, we can either rob it (earning n + rob1, where rob1 is the best up to house i-2) or skip it (retaining rob2, the best up to house i-1). State transition: new_max = max(n + rob1, rob2). Time: O(N), Space: O(1).`
      }
    },
    {
      id: 'coin-change',
      title: 'Coin Change: Minimum Coins for Target',
      difficulty: 'Medium',
      category: 'Dynamic Programming',
      description: `You are given an integer array \`coins\` representing coins of different denominations and an integer \`amount\` representing a total amount of money.

Return the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return \`-1\`.

### Example 1:
\`\`\`
Input: coins = [1, 2, 5], amount = 11
Output: 3
Explanation: 11 = 5 + 5 + 1
\`\`\`

### Example 2:
\`\`\`
Input: coins = [2], amount = 3
Output: -1
\`\`\`

### Example 3:
\`\`\`
Input: coins = [1], amount = 0
Output: 0
\`\`\`

### Constraints:
* 1 <= coins.length <= 12
* 1 <= coins[i] <= 2^31 - 1
* 0 <= amount <= 10^4`,
      optimalComplexity: { time: 'O(amount * len(coins))', space: 'O(amount)' },
      starterCode: {
        python: `def coin_change(coins, amount):
    # dp[i] represents min coins to reach amount i
    pass

if __name__ == '__main__':
    import json, sys
    lines = sys.stdin.read().strip().splitlines()
    for l in lines:
        if l.strip():
            d = json.loads(l)
            print(json.dumps(coin_change(d['coins'], d['amount'])))
`,
        javascript: `function coinChange(coins, amount) {
    // Write your solution here
}

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
rl.on('line', (line) => {
    if (!line.trim()) return;
    const data = JSON.parse(line);
    const dp = new Array(data.amount + 1).fill(Infinity);
    dp[0] = 0;
    for (let i = 1; i <= data.amount; i++) {
        for (const c of data.coins) {
            if (i - c >= 0) dp[i] = Math.min(dp[i], dp[i - c] + 1);
        }
    }
    console.log(JSON.stringify(dp[data.amount] === Infinity ? -1 : dp[data.amount]));
});
`
      },
      testCases: [
        { id: 'tc-1', description: 'Standard coin change', input: '{"coins": [1, 2, 5], "amount": 11}', expected: '3', isHidden: false },
        { id: 'tc-2', description: 'Impossible amount', input: '{"coins": [2], "amount": 3}', expected: '-1', isHidden: false },
        { id: 'tc-3', description: 'Zero amount base case', input: '{"coins": [1], "amount": 0}', expected: '0', isHidden: true }
      ],
      editorialSolution: {
        python: `def coin_change(coins, amount):
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    
    for i in range(1, amount + 1):
        for c in coins:
            if i - c >= 0:
                dp[i] = min(dp[i], dp[i - c] + 1)
                
    return dp[amount] if dp[amount] != float('inf') else -1`,
        explanation: `Let dp[i] be the minimum coins required to make amount i. For each sub-amount from 1 to amount, we try taking each coin c: dp[i] = min(dp[i], dp[i - c] + 1). Time Complexity: O(amount * len(coins)), Space Complexity: O(amount).`
      }
    },
    {
      id: 'longest-increasing-subsequence',
      title: 'Longest Increasing Subsequence',
      difficulty: 'Medium',
      category: 'Dynamic Programming',
      description: `Given an integer array \`nums\`, return the length of the longest strictly increasing subsequence.

### Example 1:
\`\`\`
Input: nums = [10,9,2,5,3,7,101,18]
Output: 4
Explanation: The longest increasing subsequence is [2,3,7,101], therefore the length is 4.
\`\`\`

### Example 2:
\`\`\`
Input: nums = [0,1,0,3,2,3]
Output: 4
\`\`\`

### Example 3:
\`\`\`
Input: nums = [7,7,7,7,7]
Output: 1
\`\`\`

### Constraints:
* 1 <= nums.length <= 2500
* -10^4 <= nums[i] <= 10^4`,
      optimalComplexity: { time: 'O(N log N) patience sort / O(N^2) DP', space: 'O(N)' },
      starterCode: {
        python: `import bisect

def length_of_lis(nums) -> int:
    # Patience sorting with bisect_left
    pass

if __name__ == '__main__':
    import json, sys
    lines = sys.stdin.read().strip().splitlines()
    for l in lines:
        if l.strip():
            d = json.loads(l)
            print(json.dumps(length_of_lis(d['nums'])))
`,
        javascript: `function lengthOfLIS(nums) {
    // Write your solution here
}

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
rl.on('line', (line) => {
    if (!line.trim()) return;
    const data = JSON.parse(line);
    const tails = [];
    for (const x of data.nums) {
        let l = 0, r = tails.length;
        while (l < r) {
            const m = Math.floor((l + r) / 2);
            if (tails[m] < x) l = m + 1;
            else r = m;
        }
        tails[l] = x;
    }
    console.log(JSON.stringify(tails.length));
});
`
      },
      testCases: [
        { id: 'tc-1', description: 'Standard unsorted array with LIS of 4', input: '{"nums": [10, 9, 2, 5, 3, 7, 101, 18]}', expected: '4', isHidden: false },
        { id: 'tc-2', description: 'Duplicates with alternating values', input: '{"nums": [0, 1, 0, 3, 2, 3]}', expected: '4', isHidden: false },
        { id: 'tc-3', description: 'All identical values', input: '{"nums": [7, 7, 7, 7, 7]}', expected: '1', isHidden: true }
      ],
      editorialSolution: {
        python: `import bisect

def length_of_lis(nums) -> int:
    tails = []
    for x in nums:
        idx = bisect.bisect_left(tails, x)
        if idx == len(tails):
            tails.append(x)
        else:
            tails[idx] = x
    return len(tails)`,
        explanation: `Using the patience sorting algorithm with binary search (bisect_left): tails[i] stores the smallest tail of all increasing subsequences of length i + 1 found so far. Replacing tails[idx] with x extends or tightens existing subsequences in O(log N). Total runtime: O(N log N), Space: O(N).`
      }
    },
    {
      id: 'unique-paths',
      title: 'Unique Paths in a Grid',
      difficulty: 'Medium',
      category: 'Dynamic Programming',
      description: `There is a robot on an \`m x n\` grid. The robot is initially located at the top-left corner (i.e., \`grid[0][0]\`). The robot tries to move to the bottom-right corner (i.e., \`grid[m - 1][n - 1]\`). The robot can only move either down or right at any point in time.

Given the two integers \`m\` and \`n\`, return the number of possible unique paths that the robot can take to reach the bottom-right corner.

### Example 1:
\`\`\`
Input: m = 3, n = 7
Output: 28
\`\`\`

### Example 2:
\`\`\`
Input: m = 3, n = 2
Output: 3
Explanation: From the top-left corner, there are a total of 3 ways to reach the bottom-right corner:
1. Right -> Down -> Down
2. Down -> Down -> Right
3. Down -> Right -> Down
\`\`\`

### Constraints:
* 1 <= m, n <= 100`,
      optimalComplexity: { time: 'O(M * N)', space: 'O(N)' },
      starterCode: {
        python: `def unique_paths(m: int, n: int) -> int:
    # 1D row rolling array
    pass

if __name__ == '__main__':
    import json, sys
    lines = sys.stdin.read().strip().splitlines()
    for l in lines:
        if l.strip():
            d = json.loads(l)
            print(json.dumps(unique_paths(d['m'], d['n'])))
`,
        javascript: `function uniquePaths(m, n) {
    // Write your solution here
}

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
rl.on('line', (line) => {
    if (!line.trim()) return;
    const data = JSON.parse(line);
    const row = new Array(data.n).fill(1);
    for (let i = 1; i < data.m; i++) {
        for (let j = 1; j < data.n; j++) {
            row[j] += row[j - 1];
        }
    }
    console.log(JSON.stringify(row[data.n - 1]));
});
`
      },
      testCases: [
        { id: 'tc-1', description: '3x7 grid', input: '{"m": 3, "n": 7}', expected: '28', isHidden: false },
        { id: 'tc-2', description: '3x2 grid', input: '{"m": 3, "n": 2}', expected: '3', isHidden: false },
        { id: 'tc-3', description: '1x1 grid', input: '{"m": 1, "n": 1}', expected: '1', isHidden: true }
      ],
      editorialSolution: {
        python: `def unique_paths(m: int, n: int) -> int:
    row = [1] * n
    for _ in range(m - 1):
        new_row = [1] * n
        for j in range(1, n):
            new_row[j] = new_row[j - 1] + row[j]
        row = new_row
    return row[-1]`,
        explanation: `Each cell dp[r][c] = dp[r-1][c] + dp[r][c-1]. Because each row only depends on the previous row and the cell to its immediate left, we can reduce space to a single array of size n. Time: O(M * N), Space: O(N).`
      }
    },
    {
      id: 'word-break',
      title: 'Word Break: Dictionary Segmentation',
      difficulty: 'Medium',
      category: 'Dynamic Programming',
      description: `Given a string \`s\` and a dictionary of strings \`wordDict\`, return \`true\` if \`s\` can be segmented into a space-separated sequence of one or more dictionary words.

Note that the same word in the dictionary may be reused multiple times in the segmentation.

### Example 1:
\`\`\`
Input: s = "leetcode", wordDict = ["leet","code"]
Output: true
Explanation: Return true because "leetcode" can be segmented as "leet code".
\`\`\`

### Example 2:
\`\`\`
Input: s = "applepenapple", wordDict = ["apple","pen"]
Output: true
Explanation: Return true because "applepenapple" can be segmented as "apple pen apple". Note that you are allowed to reuse a dictionary word.
\`\`\`

### Example 3:
\`\`\`
Input: s = "catsandog", wordDict = ["cats","dog","sand","and","cat"]
Output: false
\`\`\`

### Constraints:
* 1 <= s.length <= 300
* 1 <= wordDict.length <= 1000
* 1 <= wordDict[i].length <= 20
* s and wordDict[i] consist of only lowercase English letters.
* All the strings of wordDict are unique.`,
      optimalComplexity: { time: 'O(N^2 * K)', space: 'O(N)' },
      starterCode: {
        python: `def word_break(s: str, wordDict) -> bool:
    # dp[i] is True if s[:i] can be segmented
    pass

if __name__ == '__main__':
    import json, sys
    lines = sys.stdin.read().strip().splitlines()
    for l in lines:
        if l.strip():
            d = json.loads(l)
            print(json.dumps(word_break(d['s'], d['wordDict'])))
`,
        javascript: `function wordBreak(s, wordDict) {
    // Write your solution here
}

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
rl.on('line', (line) => {
    if (!line.trim()) return;
    const data = JSON.parse(line);
    const dp = new Array(data.s.length + 1).fill(false);
    dp[0] = true;
    for (let i = 1; i <= data.s.length; i++) {
        for (const w of data.wordDict) {
            if (i >= w.length && dp[i - w.length] && data.s.slice(i - w.length, i) === w) {
                dp[i] = true;
                break;
            }
        }
    }
    console.log(JSON.stringify(dp[data.s.length]));
});
`
      },
      testCases: [
        { id: 'tc-1', description: 'Two distinct words in dictionary', input: '{"s": "leetcode", "wordDict": ["leet", "code"]}', expected: 'true', isHidden: false },
        { id: 'tc-2', description: 'Reusing words from dictionary', input: '{"s": "applepenapple", "wordDict": ["apple", "pen"]}', expected: 'true', isHidden: false },
        { id: 'tc-3', description: 'Overlapping candidate words that cannot form full string', input: '{"s": "catsandog", "wordDict": ["cats", "dog", "sand", "and", "cat"]}', expected: 'false', isHidden: true }
      ],
      editorialSolution: {
        python: `def word_break(s: str, wordDict) -> bool:
    dp = [False] * (len(s) + 1)
    dp[0] = True # Base case: empty string
    words = set(wordDict)
    
    for i in range(1, len(s) + 1):
        for j in range(i):
            if dp[j] and s[j:i] in words:
                dp[i] = True
                break
                
    return dp[len(s)]`,
        explanation: `Let dp[i] represent whether prefix s[:i] can be segmented into words. For each prefix ending at index i, we test splitting at index j: if dp[j] is True and the substring s[j:i] is in wordDict, then dp[i] is True. Time: O(N^2), Space: O(N).`
      }
    }
  ]
};

module.exports = MODULE;
