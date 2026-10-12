/**
 * Real-Time Collaborative Code Interview Platform
 * Module: Sliding Window
 * Zero Emojis - Zero Em Dashes
 */

const MODULE = {
  id: 'sliding-window',
  title: 'Sliding Window',
  category: 'Sliding Window',
  description: 'Contiguous subarray and substring optimization using dynamic and fixed sliding windows.',
  pythonToolkit: [
    {
      name: 'Dynamic window expansion & contraction',
      syntax: 'left = 0\nfor right in range(len(s)):\n    # expand window with s[right]\n    while not valid:\n        # contract window with s[left]\n        left += 1',
      complexity: 'O(N) amortized (each index visited at most twice)',
      description: 'The standard two-pointer pattern for variable-size sliding window problems.'
    },
    {
      name: 'Fixed window initialization',
      syntax: 'window_sum = sum(nums[:k])\nfor i in range(k, len(nums)):\n    window_sum += nums[i] - nums[i - k]',
      complexity: 'O(N) time with O(1) space',
      description: 'Maintains state across an exact window length of k in linear time.'
    },
    {
      name: 'Character frequency window map',
      syntax: 'from collections import defaultdict\ncounts = defaultdict(int)\ncounts[char] += 1',
      complexity: 'O(1) state update per step',
      description: 'Maintains character frequencies inside the window boundaries.'
    }
  ],
  keyPatterns: [
    'One-pass running minimum for profit tracking',
    'Tracking most recent index of characters to fast-forward left pointer',
    'Window condition validation (max frequency + k >= window size)'
  ],
  problems: [
    {
      id: 'best-time-stock',
      title: 'Best Time to Buy and Sell Stock',
      difficulty: 'Easy',
      category: 'Sliding Window',
      description: `You are given an array \`prices\` where \`prices[i]\` is the price of a given stock on the \`i-th\` day.

You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.

Return the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return \`0\`.

### Example 1:
\`\`\`
Input: prices = [7,1,5,3,6,4]
Output: 5
Explanation: Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6 - 1 = 5.
\`\`\`

### Example 2:
\`\`\`
Input: prices = [7,6,4,3,1]
Output: 0
Explanation: In this case, no transactions are done and the max profit = 0.
\`\`\`

### Constraints:
* 1 <= prices.length <= 10^5
* 0 <= prices[i] <= 10^4`,
      optimalComplexity: { time: 'O(N)', space: 'O(1)' },
      starterCode: {
        python: `def max_profit(prices):
    # Track min_price seen so far and max_profit
    pass

if __name__ == '__main__':
    import json, sys
    lines = sys.stdin.read().strip().splitlines()
    for l in lines:
        if l.strip():
            d = json.loads(l)
            print(json.dumps(max_profit(d['prices'])))
`,
        javascript: `function maxProfit(prices) {
    // Write your solution here
}

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
rl.on('line', (line) => {
    if (!line.trim()) return;
    const data = JSON.parse(line);
    console.log(JSON.stringify(maxProfit(data.prices)));
});
`
      },
      testCases: [
        { id: 'tc-1', description: 'Standard fluctuating prices', input: '{"prices": [7, 1, 5, 3, 6, 4]}', expected: '5', isHidden: false },
        { id: 'tc-2', description: 'Strictly declining prices', input: '{"prices": [7, 6, 4, 3, 1]}', expected: '0', isHidden: false },
        { id: 'tc-3', description: 'Single element array', input: '{"prices": [5]}', expected: '0', isHidden: true }
      ],
      editorialSolution: {
        python: `def max_profit(prices):
    min_price = float('inf')
    max_profit = 0
    
    for price in prices:
        if price < min_price:
            min_price = price
        elif price - min_price > max_profit:
            max_profit = price - min_price
            
    return max_profit`,
        explanation: `We scan prices from left to right. At each day, we maintain the lowest price observed so far and check if selling at the current price yields a higher profit than our previous maximum. Time: O(N), Space: O(1).`
      }
    },
    {
      id: 'longest-substring',
      title: 'Longest Substring Without Repeating Characters',
      difficulty: 'Medium',
      category: 'Sliding Window',
      description: `Given a string \`s\`, find the length of the longest substring without duplicate characters.

### Example 1:
\`\`\`
Input: s = "abcabcbb"
Output: 3
Explanation: The answer is "abc", with the length of 3.
\`\`\`

### Example 2:
\`\`\`
Input: s = "bbbbb"
Output: 1
Explanation: The answer is "b", with the length of 1.
\`\`\`

### Example 3:
\`\`\`
Input: s = "pwwkew"
Output: 3
Explanation: The answer is "wke", with the length of 3.
\`\`\`

### Constraints:
* 0 <= s.length <= 5 * 10^4
* s consists of English letters, digits, symbols and spaces.`,
      optimalComplexity: { time: 'O(N)', space: 'O(min(N, M)) where M is charset size' },
      starterCode: {
        python: `def length_of_longest_substring(s: str) -> int:
    # Use sliding window with dict mapping char -> latest index
    pass

if __name__ == '__main__':
    import json, sys
    lines = sys.stdin.read().strip().splitlines()
    for l in lines:
        if l.strip():
            d = json.loads(l)
            print(json.dumps(length_of_longest_substring(d['s'])))
`,
        javascript: `function lengthOfLongestSubstring(s) {
    // Write your solution here
}

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
rl.on('line', (line) => {
    if (!line.trim()) return;
    const data = JSON.parse(line);
    console.log(JSON.stringify(lengthOfLongestSubstring(data.s)));
});
`
      },
      testCases: [
        { id: 'tc-1', description: 'Mixed repeating characters', input: '{"s": "abcabcbb"}', expected: '3', isHidden: false },
        { id: 'tc-2', description: 'Single repeated character', input: '{"s": "bbbbb"}', expected: '1', isHidden: false },
        { id: 'tc-3', description: 'Substrings with repeats in middle', input: '{"s": "pwwkew"}', expected: '3', isHidden: false },
        { id: 'tc-4', description: 'Empty string', input: '{"s": ""}', expected: '0', isHidden: true }
      ],
      editorialSolution: {
        python: `def length_of_longest_substring(s: str) -> int:
    char_index = {}
    left = 0
    max_len = 0
    
    for right, ch in enumerate(s):
        if ch in char_index and char_index[ch] >= left:
            left = char_index[ch] + 1
        char_index[ch] = right
        max_len = max(max_len, right - left + 1)
        
    return max_len`,
        explanation: `Using a sliding window, we keep the latest seen index of each character in a dictionary. When a repeated character is encountered at or after left, we update left to char_index[ch] + 1. Single pass: O(N) time, O(min(N, charset)) auxiliary memory.`
      }
    },
    {
      id: 'character-replacement',
      title: 'Longest Repeating Character Replacement',
      difficulty: 'Medium',
      category: 'Sliding Window',
      description: `You are given a string \`s\` and an integer \`k\`. You can choose any character of the string and change it to any other uppercase English character. You can perform this operation at most \`k\` times.

Return the length of the longest substring containing the same letter you can get after performing the above operations.

### Example 1:
\`\`\`
Input: s = "ABAB", k = 2
Output: 4
Explanation: Replace the two 'A's with 'B's or vice versa.
\`\`\`

### Example 2:
\`\`\`
Input: s = "AABABBA", k = 1
Output: 4
Explanation: Replace the one 'B' in the middle with 'A', form "AABAA" or "ABBA".
\`\`\`

### Constraints:
* 1 <= s.length <= 10^5
* s consists of only uppercase English letters.
* 0 <= k <= s.length`,
      optimalComplexity: { time: 'O(N)', space: 'O(1) (26 uppercase letters)' },
      starterCode: {
        python: `def character_replacement(s: str, k: int) -> int:
    # Maintain character frequencies and max_freq in current window
    pass

if __name__ == '__main__':
    import json, sys
    lines = sys.stdin.read().strip().splitlines()
    for l in lines:
        if l.strip():
            d = json.loads(l)
            print(json.dumps(character_replacement(d['s'], d['k'])))
`,
        javascript: `function characterReplacement(s, k) {
    // Write your solution here
}

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
rl.on('line', (line) => {
    if (!line.trim()) return;
    const data = JSON.parse(line);
    console.log(JSON.stringify(characterReplacement(data.s, data.k)));
});
`
      },
      testCases: [
        { id: 'tc-1', description: 'Alternating characters', input: '{"s": "ABAB", "k": 2}', expected: '4', isHidden: false },
        { id: 'tc-2', description: 'Mixed sequences with limited replacements', input: '{"s": "AABABBA", "k": 1}', expected: '4', isHidden: false },
        { id: 'tc-3', description: 'All identical characters', input: '{"s": "AAAA", "k": 2}', expected: '4', isHidden: true }
      ],
      editorialSolution: {
        python: `from collections import defaultdict

def character_replacement(s: str, k: int) -> int:
    count = defaultdict(int)
    max_len = 0
    max_freq = 0
    left = 0
    
    for right in range(len(s)):
        count[s[right]] += 1
        max_freq = max(max_freq, count[s[right]])
        
        # If replacements needed exceeds k, shrink window from left
        while (right - left + 1) - max_freq > k:
            count[s[left]] -= 1
            left += 1
            
        max_len = max(max_len, right - left + 1)
        
    return max_len`,
        explanation: `A window of length L is valid if L - max_freq <= k (the remaining characters can be converted to the most frequent character using at most k operations). We expand the right pointer and only increment left when the condition is violated. Time: O(N), Space: O(1).`
      }
    },
    {
      id: 'permutation-in-string',
      title: 'Permutation in String',
      difficulty: 'Medium',
      category: 'Sliding Window',
      description: `Given two strings \`s1\` and \`s2\`, return \`true\` if \`s2\` contains a permutation of \`s1\`, or \`false\` otherwise.

In other words, return \`true\` if one of \`s1\`'s permutations is the substring of \`s2\`.

### Example 1:
\`\`\`
Input: s1 = "ab", s2 = "eidbaooo"
Output: true
Explanation: s2 contains one permutation of s1 ("ba").
\`\`\`

### Example 2:
\`\`\`
Input: s1 = "ab", s2 = "eidboaoo"
Output: false
\`\`\`

### Constraints:
* 1 <= s1.length, s2.length <= 10^4
* s1 and s2 consist of lowercase English letters.`,
      optimalComplexity: { time: 'O(N)', space: 'O(1) (26 letters)' },
      starterCode: {
        python: `def check_inclusion(s1: str, s2: str) -> bool:
    # Use fixed-size sliding window of length len(s1)
    pass

if __name__ == '__main__':
    import json, sys
    lines = sys.stdin.read().strip().splitlines()
    for l in lines:
        if l.strip():
            d = json.loads(l)
            print(json.dumps(check_inclusion(d['s1'], d['s2'])))
`,
        javascript: `function checkInclusion(s1, s2) {
    // Write your solution here
}

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
rl.on('line', (line) => {
    if (!line.trim()) return;
    const data = JSON.parse(line);
    console.log(JSON.stringify(checkInclusion(data.s1, data.s2)));
});
`
      },
      testCases: [
        { id: 'tc-1', description: 'Substring matches permutation', input: '{"s1": "ab", "s2": "eidbaooo"}', expected: 'true', isHidden: false },
        { id: 'tc-2', description: 'Characters separated', input: '{"s1": "ab", "s2": "eidboaoo"}', expected: 'false', isHidden: false },
        { id: 'tc-3', description: 's1 longer than s2', input: '{"s1": "hello", "s2": "o"}', expected: 'false', isHidden: true }
      ],
      editorialSolution: {
        python: `from collections import Counter

def check_inclusion(s1: str, s2: str) -> bool:
    n1, n2 = len(s1), len(s2)
    if n1 > n2:
        return False
        
    s1_count = Counter(s1)
    window = Counter(s2[:n1])
    
    if window == s1_count:
        return True
        
    for i in range(n1, n2):
        window[s2[i]] += 1
        window[s2[i - n1]] -= 1
        if window[s2[i - n1]] == 0:
            del window[s2[i - n1]]
            
        if window == s1_count:
            return True
            
    return False`,
        explanation: `Since a permutation of s1 must have the exact same length as s1, we maintain a fixed-size sliding window of length len(s1) across s2. Adding the new right character and evicting the left character takes O(1) time. Comparing the 26-char Counter takes O(1). Total time: O(N), Space: O(1).`
      }
    },
    {
      id: 'min-window-substring',
      title: 'Minimum Window Substring',
      difficulty: 'Hard',
      category: 'Sliding Window',
      description: `Given two strings \`s\` and \`t\` of lengths \`m\` and \`n\` respectively, return the minimum window substring of \`s\` such that every character in \`t\` (including duplicates) is included in the window. If there is no such substring, return the empty string \`""\`.

The testcases will be generated such that the answer is unique.

### Example 1:
\`\`\`
Input: s = "ADOBECODEBANC", t = "ABC"
Output: "BANC"
Explanation: The minimum window substring "BANC" includes 'A', 'B', and 'C' from string t.
\`\`\`

### Example 2:
\`\`\`
Input: s = "a", t = "a"
Output: "a"
\`\`\`

### Constraints:
* m == s.length
* n == t.length
* 1 <= m, n <= 10^5
* s and t consist of uppercase and lowercase English letters.`,
      optimalComplexity: { time: 'O(M + N)', space: 'O(charset)' },
      starterCode: {
        python: `def min_window(s: str, t: str) -> str:
    # Sliding window tracking matched required character counts
    pass

if __name__ == '__main__':
    import json, sys
    lines = sys.stdin.read().strip().splitlines()
    for l in lines:
        if l.strip():
            d = json.loads(l)
            print(json.dumps(min_window(d['s'], d['t'])))
`,
        javascript: `function minWindow(s, t) {
    // Write your solution here
}

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
rl.on('line', (line) => {
    if (!line.trim()) return;
    const data = JSON.parse(line);
    console.log(JSON.stringify(minWindow(data.s, data.t)));
});
`
      },
      testCases: [
        { id: 'tc-1', description: 'Standard minimum window match', input: '{"s": "ADOBECODEBANC", "t": "ABC"}', expected: '"BANC"', isHidden: false },
        { id: 'tc-2', description: 'Single matching character', input: '{"s": "a", "t": "a"}', expected: '"a"', isHidden: false },
        { id: 'tc-3', description: 'Target character missing in s', input: '{"s": "a", "t": "aa"}', expected: '""', isHidden: true }
      ],
      editorialSolution: {
        python: `from collections import Counter, defaultdict

def min_window(s: str, t: str) -> str:
    if not s or not t:
        return ""
        
    t_count = Counter(t)
    required = len(t_count)
    window = defaultdict(int)
    formed = 0
    
    left = 0
    min_len = float('inf')
    best_range = (0, 0)
    
    for right in range(len(s)):
        char = s[right]
        window[char] += 1
        
        if char in t_count and window[char] == t_count[char]:
            formed += 1
            
        while left <= right and formed == required:
            if right - left + 1 < min_len:
                min_len = right - left + 1
                best_range = (left, right + 1)
                
            removed = s[left]
            window[removed] -= 1
            if removed in t_count and window[removed] < t_count[removed]:
                formed -= 1
            left += 1
            
    return s[best_range[0]:best_range[1]] if min_len != float('inf') else ""`,
        explanation: `Maintain a frequency dictionary of t and expand right until all required characters are satisfied (formed == required). Then contract left to find the minimal valid window. Each pointer traverses s at most once. Time: O(M + N), Space: O(charset).`
      }
    }
  ]
};

module.exports = MODULE;
