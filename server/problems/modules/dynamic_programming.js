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
    },
    {
      id: 'house-robber-ii',
      title: 'House Robber II (Circular Street)',
      difficulty: 'Medium',
      category: 'Dynamic Programming',
      neetcodeCategory: '1-D Dynamic Programming',
      neetcodeOrder: 53,
      isNeetCode75: true,
      description: `You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed. All houses at this place are **arranged in a circle**. That means the first house is the neighbor of the last one. Meanwhile, adjacent houses have a security system connected, and **it will automatically contact the police if two adjacent houses were broken into on the same night**.

Given an integer array \`nums\` representing the amount of money of each house, return the maximum amount of money you can rob tonight **without alerting the police**.

### Example 1:
\`\`\`
Input: nums = [2,3,2]
Output: 3
Explanation: You cannot rob house 1 (money = 2) and then rob house 3 (money = 2), because they are adjacent houses.
\`\`\`

### Example 2:
\`\`\`
Input: nums = [1,2,3,1]
Output: 4
Explanation: Rob house 1 (money = 1) and then rob house 3 (money = 3). Total amount = 1 + 3 = 4.
\`\`\`

### Constraints:
* 1 <= nums.length <= 100
* 0 <= nums[i] <= 1000`,
      optimalComplexity: { time: 'O(N)', space: 'O(1)' },
      starterCode: {
        python: `def rob(nums) -> int:
    # Run House Robber I twice: nums[1:] and nums[:-1]
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
    console.log(JSON.stringify(rob(data.nums)));
});
`
      },
      testCases: [
        { id: 'tc-1', description: 'Circular 3 houses [2, 3, 2]', input: '{"nums": [2, 3, 2]}', expected: '3', isHidden: false },
        { id: 'tc-2', description: 'Four houses [1, 2, 3, 1]', input: '{"nums": [1, 2, 3, 1]}', expected: '4', isHidden: false },
        { id: 'tc-3', description: 'Single house [1]', input: '{"nums": [1]}', expected: '1', isHidden: true }
      ],
      editorialSolution: {
        python: `def rob(nums) -> int:
    if len(nums) == 1:
        return nums[0]

    def rob_linear(houses):
        rob1, rob2 = 0, 0
        for h in houses:
            new_rob = max(rob1 + h, rob2)
            rob1 = rob2
            rob2 = new_rob
        return rob2

    # Cannot include both first and last house: compare [1:] vs [:-1]
    return max(rob_linear(nums[1:]), rob_linear(nums[:-1]))`,
        explanation: `Since houses are in a circle, the first and last houses are adjacent: we cannot rob both. This splits the problem into two independent linear subproblems: robbing houses from index 0 to n-2 (excluding the last house), or robbing houses from index 1 to n-1 (excluding the first house). O(N) time and O(1) space.`
      }
    },
    {
      id: 'longest-palindromic-substring',
      title: 'Longest Palindromic Substring',
      difficulty: 'Medium',
      category: 'Dynamic Programming',
      neetcodeCategory: '1-D Dynamic Programming',
      neetcodeOrder: 54,
      isNeetCode75: true,
      description: `Given a string \`s\`, return the **longest palindromic substring** in \`s\`.

### Example 1:
\`\`\`
Input: s = "babad"
Output: "bab"
Explanation: "aba" is also a valid answer.
\`\`\`

### Example 2:
\`\`\`
Input: s = "cbbd"
Output: "bb"
\`\`\`

### Constraints:
* 1 <= s.length <= 1000
* \`s\` consist of only digits and English letters.`,
      optimalComplexity: { time: 'O(N^2)', space: 'O(1) extra space' },
      starterCode: {
        python: `def longest_palindrome(s: str) -> str:
    # Expand around center for both odd and even length centers
    pass

if __name__ == '__main__':
    import json, sys
    lines = sys.stdin.read().strip().splitlines()
    for l in lines:
        if l.strip():
            d = json.loads(l)
            print(json.dumps(longest_palindrome(d['s'])))
`,
        javascript: `function longestPalindrome(s) {
    // Write your solution here
}

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
rl.on('line', (line) => {
    if (!line.trim()) return;
    const data = JSON.parse(line);
    console.log(JSON.stringify(longestPalindrome(data.s)));
});
`
      },
      testCases: [
        { id: 'tc-1', description: 'Center palindrome: "babad"', input: '{"s": "babad"}', expected: '"bab"', isHidden: false },
        { id: 'tc-2', description: 'Even palindrome: "cbbd"', input: '{"s": "cbbd"}', expected: '"bb"', isHidden: false }
      ],
      editorialSolution: {
        python: `def longest_palindrome(s: str) -> str:
    res = ""
    for i in range(len(s)):
        # Odd length palindrome: center at i
        l, r = i, i
        while l >= 0 and r < len(s) and s[l] == s[r]:
            if (r - l + 1) > len(res):
                res = s[l : r + 1]
            l -= 1
            r += 1

        # Even length palindrome: center between i and i + 1
        l, r = i, i + 1
        while l >= 0 and r < len(s) and s[l] == s[r]:
            if (r - l + 1) > len(res):
                res = s[l : r + 1]
            l -= 1
            r += 1

    return res`,
        explanation: `A palindrome mirrors around its center. There are 2N - 1 possible centers (N single characters for odd palindromes and N - 1 character pairs for even palindromes). Expanding outward from each center checks all palindromes in O(N^2) time and O(1) extra memory.`
      }
    },
    {
      id: 'palindromic-substrings',
      title: 'Palindromic Substrings (Count All Palindromes)',
      difficulty: 'Medium',
      category: 'Dynamic Programming',
      neetcodeCategory: '1-D Dynamic Programming',
      neetcodeOrder: 55,
      isNeetCode75: true,
      description: `Given a string \`s\`, return the number of **palindromic substrings** in it.

A string is a **palindrome** when it reads the same backward as forward.

A **substring** is a contiguous sequence of characters within the string.

### Example 1:
\`\`\`
Input: s = "abc"
Output: 3
Explanation: Three palindromic strings: "a", "b", "c".
\`\`\`

### Example 2:
\`\`\`
Input: s = "aaa"
Output: 6
Explanation: Six palindromic strings: "a", "a", "a", "aa", "aa", "aaa".
\`\`\`

### Constraints:
* 1 <= s.length <= 1000
* \`s\` consists of lowercase English letters.`,
      optimalComplexity: { time: 'O(N^2)', space: 'O(1)' },
      starterCode: {
        python: `def count_substrings(s: str) -> int:
    # Expand around centers and increment count
    pass

if __name__ == '__main__':
    import json, sys
    lines = sys.stdin.read().strip().splitlines()
    for l in lines:
        if l.strip():
            d = json.loads(l)
            print(json.dumps(count_substrings(d['s'])))
`,
        javascript: `function countSubstrings(s) {
    // Write your solution here
}

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
rl.on('line', (line) => {
    if (!line.trim()) return;
    const data = JSON.parse(line);
    console.log(JSON.stringify(countSubstrings(data.s)));
});
`
      },
      testCases: [
        { id: 'tc-1', description: 'Distinct letters: "abc"', input: '{"s": "abc"}', expected: '3', isHidden: false },
        { id: 'tc-2', description: 'Identical letters: "aaa"', input: '{"s": "aaa"}', expected: '6', isHidden: false }
      ],
      editorialSolution: {
        python: `def count_substrings(s: str) -> int:
    count = 0
    for i in range(len(s)):
        # Odd length
        l, r = i, i
        while l >= 0 and r < len(s) and s[l] == s[r]:
            count += 1
            l -= 1
            r += 1

        # Even length
        l, r = i, i + 1
        while l >= 0 and r < len(s) and s[l] == s[r]:
            count += 1
            l -= 1
            r += 1

    return count`,
        explanation: `Just like Longest Palindromic Substring, expanding around all 2N - 1 centers allows counting every valid palindrome immediately as soon as boundary matching holds. Runs in O(N^2) time and O(1) space.`
      }
    },
    {
      id: 'decode-ways',
      title: 'Decode Ways',
      difficulty: 'Medium',
      category: 'Dynamic Programming',
      neetcodeCategory: '1-D Dynamic Programming',
      neetcodeOrder: 56,
      isNeetCode75: true,
      description: `A message containing letters from A-Z can be encoded into numbers using the following mapping:
'A' -> "1", 'B' -> "2", ..., 'Z' -> "26".

To decode an encoded message, all the digits must be grouped then mapped back into letters using the reverse of the mapping above.

Given a string \`s\` containing only digits, return the **number of ways** to decode it.

### Example 1:
\`\`\`
Input: s = "12"
Output: 2
Explanation: "12" could be decoded as "AB" (1 2) or "L" (12).
\`\`\`

### Example 2:
\`\`\`
Input: s = "226"
Output: 3
Explanation: "226" could be decoded as "BZ" (2 26), "VF" (22 6), or "BBF" (2 2 6).
\`\`\`

### Example 3:
\`\`\`
Input: s = "06"
Output: 0
Explanation: "06" cannot be mapped to "F" because of the leading zero.
\`\`\`

### Constraints:
* 1 <= s.length <= 100
* \`s\` contains only digits and may contain leading zero(s).`,
      optimalComplexity: { time: 'O(N)', space: 'O(1)' },
      starterCode: {
        python: `def num_decodings(s: str) -> int:
    # 1D DP tracking single-digit (1-9) and double-digit (10-26) decodings
    pass

if __name__ == '__main__':
    import json, sys
    lines = sys.stdin.read().strip().splitlines()
    for l in lines:
        if l.strip():
            d = json.loads(l)
            print(json.dumps(num_decodings(d['s'])))
`,
        javascript: `function numDecodings(s) {
    // Write your solution here
}

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
rl.on('line', (line) => {
    if (!line.trim()) return;
    const data = JSON.parse(line);
    console.log(JSON.stringify(numDecodings(data.s)));
});
`
      },
      testCases: [
        { id: 'tc-1', description: 'Two digits: "12"', input: '{"s": "12"}', expected: '2', isHidden: false },
        { id: 'tc-2', description: 'Three digits: "226"', input: '{"s": "226"}', expected: '3', isHidden: false },
        { id: 'tc-3', description: 'Leading zero invalid: "06"', input: '{"s": "06"}', expected: '0', isHidden: false }
      ],
      editorialSolution: {
        python: `def num_decodings(s: str) -> int:
    if not s or s[0] == '0':
        return 0

    prev2 = 1 # dp[i-2]
    prev1 = 1 # dp[i-1]

    for i in range(1, len(s)):
        curr = 0
        one_digit = int(s[i])
        two_digits = int(s[i-1:i+1])

        if one_digit != 0:
            curr += prev1
        if 10 <= two_digits <= 26:
            curr += prev2

        prev2 = prev1
        prev1 = curr

    return prev1`,
        explanation: `At each index i, we can decode s[i] as a standalone character (if s[i] != '0') adding dp[i-1], and/or decode s[i-1:i+1] as a two-digit character (if 10 <= s[i-1:i+1] <= 26) adding dp[i-2]. By maintaining only the last two states, we reduce space from O(N) to O(1) in O(N) time.`
      }
    },
    {
      id: 'max-product-subarray',
      title: 'Maximum Product Subarray',
      difficulty: 'Medium',
      category: 'Dynamic Programming',
      neetcodeCategory: '1-D Dynamic Programming',
      neetcodeOrder: 58,
      isNeetCode75: true,
      description: `Given an integer array \`nums\`, find a subarray that has the largest product, and return the product.

The test cases are generated so that the answer will fit in a **32-bit** integer.

### Example 1:
\`\`\`
Input: nums = [2,3,-2,4]
Output: 6
Explanation: [2,3] has the largest product 6.
\`\`\`

### Example 2:
\`\`\`
Input: nums = [-2,0,-1]
Output: 0
Explanation: The result cannot be 2, because [-2,-1] is not a subarray.
\`\`\`

### Constraints:
* 1 <= nums.length <= 2 * 10^4
* -10 <= nums[i] <= 10
* The product of any prefix or suffix of nums fits in 32-bit.`,
      optimalComplexity: { time: 'O(N)', space: 'O(1)' },
      starterCode: {
        python: `def max_product(nums) -> int:
    # Track both current maximum and minimum product to handle negative flips
    pass

if __name__ == '__main__':
    import json, sys
    lines = sys.stdin.read().strip().splitlines()
    for l in lines:
        if l.strip():
            d = json.loads(l)
            print(json.dumps(max_product(d['nums'])))
`,
        javascript: `function maxProduct(nums) {
    // Write your solution here
}

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
rl.on('line', (line) => {
    if (!line.trim()) return;
    const data = JSON.parse(line);
    console.log(JSON.stringify(maxProduct(data.nums)));
});
`
      },
      testCases: [
        { id: 'tc-1', description: 'Positive contiguous block: [2, 3, -2, 4]', input: '{"nums": [2, 3, -2, 4]}', expected: '6', isHidden: false },
        { id: 'tc-2', description: 'Zero boundary reset: [-2, 0, -1]', input: '{"nums": [-2, 0, -1]}', expected: '0', isHidden: false }
      ],
      editorialSolution: {
        python: `def max_product(nums) -> int:
    res = max(nums)
    cur_min, cur_max = 1, 1

    for n in nums:
        if n == 0:
            cur_min, cur_max = 1, 1
            continue

        temp_max = cur_max * n
        cur_max = max(n, temp_max, cur_min * n)
        cur_min = min(n, temp_max, cur_min * n)

        res = max(res, cur_max)

    return res`,
        explanation: `Multiplying by a negative number can turn a large positive product into a large negative number, or turn a large negative product into a huge positive product. Therefore, we track both cur_max and cur_min at each step. Runs in a single linear pass in O(N) time and O(1) space.`
      }
    },
    {
      id: 'longest-common-subsequence',
      title: 'Longest Common Subsequence',
      difficulty: 'Medium',
      category: 'Dynamic Programming',
      neetcodeCategory: '2-D Dynamic Programming',
      neetcodeOrder: 62,
      isNeetCode75: true,
      description: `Given two strings \`text1\` and \`text2\`, return the length of their **longest common subsequence**. If there is no common subsequence, return \`0\`.

A **subsequence** of a string is a new string generated from the original string with some characters (can be none) deleted without changing the relative order of the remaining characters.

### Example 1:
\`\`\`
Input: text1 = "abcde", text2 = "ace" 
Output: 3  
Explanation: The longest common subsequence is "ace" and its length is 3.
\`\`\`

### Example 2:
\`\`\`
Input: text1 = "abc", text2 = "abc"
Output: 3
\`\`\`

### Example 3:
\`\`\`
Input: text1 = "abc", text2 = "def"
Output: 0
\`\`\`

### Constraints:
* 1 <= text1.length, text2.length <= 1000
* \`text1\` and \`text2\` consist of only lowercase English characters.`,
      optimalComplexity: { time: 'O(M * N)', space: 'O(min(M, N))' },
      starterCode: {
        python: `def longest_common_subsequence(text1: str, text2: str) -> int:
    # 2D DP table: if text1[i] == text2[j], 1 + dp[i+1][j+1], else max(dp[i+1][j], dp[i][j+1])
    pass

if __name__ == '__main__':
    import json, sys
    lines = sys.stdin.read().strip().splitlines()
    for l in lines:
        if l.strip():
            d = json.loads(l)
            print(json.dumps(longest_common_subsequence(d['text1'], d['text2'])))
`,
        javascript: `function longestCommonSubsequence(text1, text2) {
    // Write your solution here
}

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
rl.on('line', (line) => {
    if (!line.trim()) return;
    const data = JSON.parse(line);
    console.log(JSON.stringify(longestCommonSubsequence(data.text1, data.text2)));
});
`
      },
      testCases: [
        { id: 'tc-1', description: 'Subsequence match "ace" in "abcde"', input: '{"text1": "abcde", "text2": "ace"}', expected: '3', isHidden: false },
        { id: 'tc-2', description: 'Exact identical strings', input: '{"text1": "abc", "text2": "abc"}', expected: '3', isHidden: false },
        { id: 'tc-3', description: 'Zero overlap', input: '{"text1": "abc", "text2": "def"}', expected: '0', isHidden: true }
      ],
      editorialSolution: {
        python: `def longest_common_subsequence(text1: str, text2: str) -> int:
    m, n = len(text1), len(text2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]

    for i in range(m - 1, -1, -1):
        for j in range(n - 1, -1, -1):
            if text1[i] == text2[j]:
                dp[i][j] = 1 + dp[i + 1][j + 1]
            else:
                dp[i][j] = max(dp[i + 1][j], dp[i][j + 1])

    return dp[0][0]`,
        explanation: `Let dp[i][j] be the LCS of text1[i:] and text2[j:]. When characters match (text1[i] == text2[j]), we take 1 + dp[i+1][j+1]. When they differ, we take the maximum of skipping a character from text1 (dp[i+1][j]) or text2 (dp[i][j+1]). Runs in O(M * N) time.`
      }
    }
  ]
};

module.exports = MODULE;
