/**
 * Real-Time Collaborative Code Interview Platform
 * Module: Hash Maps & Hash Sets
 * Zero Emojis - Zero Em Dashes
 */

const MODULE = {
  id: 'hashmaps-sets',
  title: 'Hash Maps & Hash Sets',
  category: 'Hash Maps & Hash Sets',
  description: 'Fast O(1) average lookups, frequency counting, and uniqueness tracking in Python.',
  pythonToolkit: [
    {
      name: 'collections.defaultdict',
      syntax: 'from collections import defaultdict\ngraph = defaultdict(list)\ncounts = defaultdict(int)',
      complexity: 'O(1) lookup & insertion',
      description: 'Auto-initializes missing keys with a default factory function, avoiding KeyError checks.'
    },
    {
      name: 'collections.Counter',
      syntax: 'from collections import Counter\nfreq = Counter(nums)\nmost_common = freq.most_common(k)',
      complexity: 'O(N) initialization',
      description: 'Creates a hash map of item frequencies instantly. Supports arithmetic and most_common(k).'
    },
    {
      name: 'dict.get(key, default)',
      syntax: 'val = mapping.get(key, 0)',
      complexity: 'O(1) lookup',
      description: 'Safely retrieves a key with a fallback value without mutating the dict.'
    },
    {
      name: 'set operations',
      syntax: 'seen.add(x), seen.discard(x)\nunion = set_a | set_b\nintersect = set_a & set_b',
      complexity: 'O(1) membership test (x in seen)',
      description: 'Provides constant-time uniqueness checks and set algebra.'
    }
  ],
  keyPatterns: [
    'Lookup complement (target - num in hash_map)',
    'Frequency map grouping and sorting',
    'Set membership for contiguous sequence expansion in O(N)'
  ],
  problems: [
    {
      id: 'two-sum',
      title: 'Two Sum: Target Pair Index',
      difficulty: 'Easy',
      category: 'Hash Maps & Hash Sets',
      description: `Given an array of integers \`nums\` and an integer \`target\`, return the indices of the two numbers such that they add up to \`target\`.

You may assume that each input will have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.

### Example 1:
\`\`\`
Input: nums = [2, 7, 11, 15], target = 9
Output: [0, 1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].
\`\`\`

### Example 2:
\`\`\`
Input: nums = [3, 2, 4], target = 6
Output: [1, 2]
\`\`\`

### Constraints:
* 2 <= nums.length <= 10^4
* -10^9 <= nums[i] <= 10^9
* -10^9 <= target <= 10^9
* Only one valid answer exists.`,
      optimalComplexity: { time: 'O(N)', space: 'O(N)' },
      starterCode: {
        python: `def two_sum(nums, target):
    # Maintain hash map of value -> index
    pass

if __name__ == '__main__':
    import json, sys
    lines = sys.stdin.read().strip().splitlines()
    for l in lines:
        if l.strip():
            d = json.loads(l)
            print(json.dumps(two_sum(d['nums'], d['target'])))
`,
        javascript: `function twoSum(nums, target) {
    // Write your solution here
}

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
rl.on('line', (line) => {
    if (!line.trim()) return;
    const data = JSON.parse(line);
    console.log(JSON.stringify(twoSum(data.nums, data.target)));
});
`
      },
      testCases: [
        { id: 'tc-1', description: 'Standard positive array', input: '{"nums": [2, 7, 11, 15], "target": 9}', expected: '[0, 1]', isHidden: false },
        { id: 'tc-2', description: 'Unsorted array with duplicate elements', input: '{"nums": [3, 2, 4], "target": 6}', expected: '[1, 2]', isHidden: false },
        { id: 'tc-3', description: 'Identical pair targets', input: '{"nums": [3, 3], "target": 6}', expected: '[0, 1]', isHidden: true },
        { id: 'tc-4', description: 'Negative integers', input: '{"nums": [-1, -2, -3, -4, -5], "target": -8}', expected: '[2, 4]', isHidden: true }
      ],
      editorialSolution: {
        python: `def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []`,
        explanation: `Iterate through the array while storing visited elements in a dictionary mapping value -> index. For each number, check if target - num has been seen in O(1) average time. Time: O(N), Space: O(N).`
      }
    },
    {
      id: 'valid-anagram',
      title: 'Valid Anagram: Frequency Match',
      difficulty: 'Easy',
      category: 'Hash Maps & Hash Sets',
      description: `Given two strings \`s\` and \`t\`, return \`true\` if \`t\` is an anagram of \`s\`, and \`false\` otherwise.

An Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.

### Example 1:
\`\`\`
Input: s = "anagram", t = "nagaram"
Output: true
\`\`\`

### Example 2:
\`\`\`
Input: s = "rat", t = "car"
Output: false
\`\`\`

### Constraints:
* 1 <= s.length, t.length <= 5 * 10^4
* s and t consist of lowercase English letters.`,
      optimalComplexity: { time: 'O(N)', space: 'O(1) (26 characters)' },
      starterCode: {
        python: `def is_anagram(s: str, t: str) -> bool:
    # Compare character frequencies
    pass

if __name__ == '__main__':
    import json, sys
    lines = sys.stdin.read().strip().splitlines()
    for l in lines:
        if l.strip():
            d = json.loads(l)
            print(json.dumps(is_anagram(d['s'], d['t'])))
`,
        javascript: `function isAnagram(s, t) {
    // Write your solution here
}

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
rl.on('line', (line) => {
    if (!line.trim()) return;
    const data = JSON.parse(line);
    console.log(JSON.stringify(isAnagram(data.s, data.t)));
});
`
      },
      testCases: [
        { id: 'tc-1', description: 'Valid anagram pair', input: '{"s": "anagram", "t": "nagaram"}', expected: 'true', isHidden: false },
        { id: 'tc-2', description: 'Different characters', input: '{"s": "rat", "t": "car"}', expected: 'false', isHidden: false },
        { id: 'tc-3', description: 'Different lengths', input: '{"s": "ab", "t": "a"}', expected: 'false', isHidden: true }
      ],
      editorialSolution: {
        python: `from collections import Counter

def is_anagram(s: str, t: str) -> bool:
    if len(s) != len(t):
        return False
    return Counter(s) == Counter(t)`,
        explanation: `If lengths differ, they cannot be anagrams. We count character frequencies of both strings in O(N) using collections.Counter and verify that both frequency mappings are equal. Space is O(1) since the alphabet is bounded to 26 lowercase English letters.`
      }
    },
    {
      id: 'group-anagrams',
      title: 'Group Anagrams',
      difficulty: 'Medium',
      category: 'Hash Maps & Hash Sets',
      description: `Given an array of strings \`strs\`, group the anagrams together. You can return the answer in any order.

### Example 1:
\`\`\`
Input: strs = ["eat","tea","tan","ate","nat","bat"]
Output: [["bat"],["nat","tan"],["ate","eat","tea"]]
\`\`\`

### Example 2:
\`\`\`
Input: strs = ["a"]
Output: [["a"]]
\`\`\`

### Constraints:
* 1 <= strs.length <= 10^4
* 0 <= strs[i].length <= 100
* strs[i] consists of lowercase English letters.`,
      optimalComplexity: { time: 'O(N * K log K)', space: 'O(N * K)' },
      starterCode: {
        python: `def group_anagrams(strs):
    # Use collections.defaultdict(list) keyed by sorted string or char tuple
    pass

if __name__ == '__main__':
    import json, sys
    lines = sys.stdin.read().strip().splitlines()
    for l in lines:
        if l.strip():
            d = json.loads(l)
            res = group_anagrams(d['strs'])
            sorted_res = sorted([sorted(g) for g in res])
            print(json.dumps(sorted_res))
`,
        javascript: `function groupAnagrams(strs) {
    // Write your solution here
}

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
rl.on('line', (line) => {
    if (!line.trim()) return;
    const data = JSON.parse(line);
    const res = groupAnagrams(data.strs);
    const sortedRes = (res || []).map(g => [...g].sort()).sort();
    console.log(JSON.stringify(sortedRes));
});
`
      },
      testCases: [
        { id: 'tc-1', description: 'Multiple anagram groups', input: '{"strs": ["eat","tea","tan","ate","nat","bat"]}', expected: '[["ate", "eat", "tea"], ["bat"], ["nat", "tan"]]', isHidden: false },
        { id: 'tc-2', description: 'Single character string', input: '{"strs": ["a"]}', expected: '[["a"]]', isHidden: false },
        { id: 'tc-3', description: 'Empty string input', input: '{"strs": [""]}', expected: '[[""]]', isHidden: true }
      ],
      editorialSolution: {
        python: `from collections import defaultdict

def group_anagrams(strs):
    groups = defaultdict(list)
    for s in strs:
        key = tuple(sorted(s))
        groups[key].append(s)
    return list(groups.values())`,
        explanation: `Every anagram of a word produces the exact same sorted tuple of characters. Using this sorted tuple as the hash key in a defaultdict(list) groups all strings in O(N * K log K) time where N is total words and K is max string length.`
      }
    },
    {
      id: 'top-k-frequent-elements',
      title: 'Top K Frequent Elements',
      difficulty: 'Medium',
      category: 'Hash Maps & Hash Sets',
      description: `Given an integer array \`nums\` and an integer \`k\`, return the \`k\` most frequent elements. You may return the answer in any order.

### Example 1:
\`\`\`
Input: nums = [1,1,1,2,2,3], k = 2
Output: [1,2]
\`\`\`

### Example 2:
\`\`\`
Input: nums = [1], k = 1
Output: [1]
\`\`\`

### Constraints:
* 1 <= nums.length <= 10^5
* -10^4 <= nums[i] <= 10^4
* k is in the range [1, the number of unique elements in the array].
* It is guaranteed that the answer is unique.`,
      optimalComplexity: { time: 'O(N)', space: 'O(N)' },
      starterCode: {
        python: `def top_k_frequent(nums, k):
    # Count frequencies, then bucket sort or use min-heap
    pass

if __name__ == '__main__':
    import json, sys
    lines = sys.stdin.read().strip().splitlines()
    for l in lines:
        if l.strip():
            d = json.loads(l)
            res = top_k_frequent(d['nums'], d['k'])
            print(json.dumps(sorted(res)))
`,
        javascript: `function topKFrequent(nums, k) {
    // Write your solution here
}

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
rl.on('line', (line) => {
    if (!line.trim()) return;
    const data = JSON.parse(line);
    const res = topKFrequent(data.nums, data.k);
    console.log(JSON.stringify((res || []).sort((a,b)=>a-b)));
});
`
      },
      testCases: [
        { id: 'tc-1', description: 'Standard distribution', input: '{"nums": [1, 1, 1, 2, 2, 3], "k": 2}', expected: '[1, 2]', isHidden: false },
        { id: 'tc-2', description: 'Single element', input: '{"nums": [1], "k": 1}', expected: '[1]', isHidden: false },
        { id: 'tc-3', description: 'Negative values with varying counts', input: '{"nums": [4, 1, -1, 2, -1, 2, 3], "k": 2}', expected: '[-1, 2]', isHidden: true }
      ],
      editorialSolution: {
        python: `from collections import Counter

def top_k_frequent(nums, k):
    count = Counter(nums)
    buckets = [[] for _ in range(len(nums) + 1)]
    
    for num, freq in count.items():
        buckets[freq].append(num)
        
    res = []
    for freq in range(len(buckets) - 1, 0, -1):
        for num in buckets[freq]:
            res.append(num)
            if len(res) == k:
                return res
    return res`,
        explanation: `Using bucket sort, the index of the bucket array represents the frequency (from 0 to N). We populate the buckets from the frequency Counter, then read from highest frequency downwards until we collect k elements. Runs in strictly O(N) time with O(N) memory.`
      }
    },
    {
      id: 'longest-consecutive-sequence',
      title: 'Longest Consecutive Sequence',
      difficulty: 'Medium',
      category: 'Hash Maps & Hash Sets',
      description: `Given an unsorted array of integers \`nums\`, return the length of the longest consecutive elements sequence.

You must write an algorithm that runs in \`O(n)\` time.

### Example 1:
\`\`\`
Input: nums = [100,4,200,1,3,2]
Output: 4
Explanation: The longest consecutive elements sequence is [1, 2, 3, 4]. Therefore its length is 4.
\`\`\`

### Example 2:
\`\`\`
Input: nums = [0,3,7,2,5,8,4,6,0,1]
Output: 9
\`\`\`

### Constraints:
* 0 <= nums.length <= 10^5
* -10^9 <= nums[i] <= 10^9`,
      optimalComplexity: { time: 'O(N)', space: 'O(N)' },
      starterCode: {
        python: `def longest_consecutive(nums):
    # Convert nums to a set and check if num - 1 is present
    pass

if __name__ == '__main__':
    import json, sys
    lines = sys.stdin.read().strip().splitlines()
    for l in lines:
        if l.strip():
            d = json.loads(l)
            print(json.dumps(longest_consecutive(d['nums'])))
`,
        javascript: `function longestConsecutive(nums) {
    // Write your solution here
}

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
rl.on('line', (line) => {
    if (!line.trim()) return;
    const data = JSON.parse(line);
    console.log(JSON.stringify(longestConsecutive(data.nums)));
});
`
      },
      testCases: [
        { id: 'tc-1', description: 'Unsorted integers sequence', input: '{"nums": [100, 4, 200, 1, 3, 2]}', expected: '4', isHidden: false },
        { id: 'tc-2', description: 'Large continuous range with duplicates', input: '{"nums": [0, 3, 7, 2, 5, 8, 4, 6, 0, 1]}', expected: '9', isHidden: false },
        { id: 'tc-3', description: 'Empty list', input: '{"nums": []}', expected: '0', isHidden: true }
      ],
      editorialSolution: {
        python: `def longest_consecutive(nums):
    num_set = set(nums)
    longest_streak = 0
    
    for num in num_set:
        # Only start counting if num is the beginning of a sequence
        if num - 1 not in num_set:
            current_num = num
            current_streak = 1
            
            while current_num + 1 in num_set:
                current_num += 1
                current_streak += 1
                
            longest_streak = max(longest_streak, current_streak)
            
    return longest_streak`,
        explanation: `Converting nums to a hash set provides O(1) membership checks. We only attempt to build a sequence if num - 1 is not in the set, ensuring each sequence is traversed only once. Total operations are bounded by 2N, achieving O(N) time with O(N) space.`
      }
    },
    {
      id: 'contains-duplicate',
      title: 'Contains Duplicate',
      difficulty: 'Easy',
      category: 'Hash Maps & Sets',
      neetcodeCategory: 'Arrays & Hashing',
      neetcodeOrder: 1,
      isNeetCode75: true,
      description: `Given an integer array \`nums\`, return \`true\` if any value appears **at least twice** in the array, and return \`false\` if every element is distinct.

### Example 1:
\`\`\`
Input: nums = [1,2,3,1]
Output: true
\`\`\`

### Example 2:
\`\`\`
Input: nums = [1,2,3,4]
Output: false
\`\`\`

### Example 3:
\`\`\`
Input: nums = [1,1,1,3,3,4,3,2,4,2]
Output: true
\`\`\`

### Constraints:
* 1 <= nums.length <= 10^5
* -10^9 <= nums[i] <= 10^9`,
      optimalComplexity: { time: 'O(N)', space: 'O(N)' },
      starterCode: {
        python: `def contains_duplicate(nums):
    # Use hash set to check for duplicates
    pass

if __name__ == '__main__':
    import json, sys
    lines = sys.stdin.read().strip().splitlines()
    for l in lines:
        if l.strip():
            d = json.loads(l)
            print(json.dumps(contains_duplicate(d['nums'])))
`,
        javascript: `function containsDuplicate(nums) {
    // Write your solution here
}

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
rl.on('line', (line) => {
    if (!line.trim()) return;
    const data = JSON.parse(line);
    console.log(JSON.stringify(containsDuplicate(data.nums)));
});
`
      },
      testCases: [
        { id: 'tc-1', description: 'Duplicate present: [1, 2, 3, 1]', input: '{"nums": [1, 2, 3, 1]}', expected: 'true', isHidden: false },
        { id: 'tc-2', description: 'All unique elements: [1, 2, 3, 4]', input: '{"nums": [1, 2, 3, 4]}', expected: 'false', isHidden: false },
        { id: 'tc-3', description: 'Multiple repeats', input: '{"nums": [1, 1, 1, 3, 3, 4, 3, 2, 4, 2]}', expected: 'true', isHidden: true }
      ],
      editorialSolution: {
        python: `def contains_duplicate(nums):
    seen = set()
    for num in nums:
        if num in seen:
            return True
        seen.add(num)
    return False`,
        explanation: `By maintaining a hash set of visited values, each lookup and insertion takes O(1) on average. As soon as we encounter a number already in the set, we return True immediately. Runs in O(N) time and O(N) space.`
      }
    },
    {
      id: 'product-except-self',
      title: 'Product of Array Except Self',
      difficulty: 'Medium',
      category: 'Hash Maps & Sets',
      neetcodeCategory: 'Arrays & Hashing',
      neetcodeOrder: 6,
      isNeetCode75: true,
      description: `Given an integer array \`nums\`, return an array \`answer\` such that \`answer[i]\` is equal to the product of all the elements of \`nums\` except \`nums[i]\`.

The product of any prefix or suffix of \`nums\` is guaranteed to fit in a **32-bit** integer.

You must write an algorithm that runs in **O(n)** time and without using the division operation.

### Example 1:
\`\`\`
Input: nums = [1,2,3,4]
Output: [24,12,8,6]
\`\`\`

### Example 2:
\`\`\`
Input: nums = [-1,1,0,-3,3]
Output: [0,0,9,0,0]
\`\`\`

### Constraints:
* 2 <= nums.length <= 10^5
* -30 <= nums[i] <= 30
* Do not use the division operation.`,
      optimalComplexity: { time: 'O(N)', space: 'O(1) auxiliary space (excluding output array)' },
      starterCode: {
        python: `def product_except_self(nums):
    # Calculate prefix and suffix products in two passes
    pass

if __name__ == '__main__':
    import json, sys
    lines = sys.stdin.read().strip().splitlines()
    for l in lines:
        if l.strip():
            d = json.loads(l)
            print(json.dumps(product_except_self(d['nums'])))
`,
        javascript: `function productExceptSelf(nums) {
    // Write your solution here
}

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
rl.on('line', (line) => {
    if (!line.trim()) return;
    const data = JSON.parse(line);
    console.log(JSON.stringify(productExceptSelf(data.nums)));
});
`
      },
      testCases: [
        { id: 'tc-1', description: 'Standard array: [1, 2, 3, 4]', input: '{"nums": [1, 2, 3, 4]}', expected: '[24, 12, 8, 6]', isHidden: false },
        { id: 'tc-2', description: 'Array with single zero', input: '{"nums": [-1, 1, 0, -3, 3]}', expected: '[0, 0, 9, 0, 0]', isHidden: false }
      ],
      editorialSolution: {
        python: `def product_except_self(nums):
    n = len(nums)
    res = [1] * n

    prefix = 1
    for i in range(n):
        res[i] = prefix
        prefix *= nums[i]

    postfix = 1
    for i in range(n - 1, -1, -1):
        res[i] *= postfix
        postfix *= nums[i]

    return res`,
        explanation: `In the first forward pass, res[i] stores the cumulative prefix product of all elements to the left of i. In the second backward pass, a running postfix multiplier scales res[i] by the product of all elements to the right of i. Avoids division and runs in O(N) time with O(1) extra space.`
      }
    },
    {
      id: 'encode-decode-strings',
      title: 'Encode and Decode Strings',
      difficulty: 'Medium',
      category: 'Hash Maps & Sets',
      neetcodeCategory: 'Arrays & Hashing',
      neetcodeOrder: 7,
      isNeetCode75: true,
      description: `Design an algorithm to encode a list of strings to a string. The encoded string is then sent over the network and is decoded back to the original list of strings.

Please implement \`encode\` and \`decode\`.

### Example 1:
\`\`\`
Input: ["neet","code","love","you"]
Output: ["neet","code","love","you"]
\`\`\`

### Example 2:
\`\`\`
Input: ["we","say",":","yes"]
Output: ["we","say",":","yes"]
\`\`\`

### Constraints:
* 0 <= strs.length < 100
* 0 <= strs[i].length < 200
* strs[i] contains any possible characters out of 256 valid ASCII characters.`,
      optimalComplexity: { time: 'O(N)', space: 'O(1) extra space' },
      starterCode: {
        python: `def encode(strs):
    # Length-prefixed string encoding
    pass

def decode(s):
    # Decode length-prefixed string
    pass

def round_trip(strs):
    return decode(encode(strs))

if __name__ == '__main__':
    import json, sys
    lines = sys.stdin.read().strip().splitlines()
    for l in lines:
        if l.strip():
            d = json.loads(l)
            print(json.dumps(round_trip(d['strs'])))
`,
        javascript: `function encode(strs) {
    let res = '';
    for (const s of strs) {
        res += s.length + '#' + s;
    }
    return res;
}

function decode(s) {
    const res = [];
    let i = 0;
    while (i < s.length) {
        const j = s.indexOf('#', i);
        const len = parseInt(s.substring(i, j), 10);
        res.push(s.substring(j + 1, j + 1 + len));
        i = j + 1 + len;
    }
    return res;
}

function roundTrip(strs) {
    return decode(encode(strs));
}

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
rl.on('line', (line) => {
    if (!line.trim()) return;
    const data = JSON.parse(line);
    console.log(JSON.stringify(roundTrip(data.strs)));
});
`
      },
      testCases: [
        { id: 'tc-1', description: 'Standard word list', input: '{"strs": ["neet", "code", "love", "you"]}', expected: '["neet", "code", "love", "you"]', isHidden: false },
        { id: 'tc-2', description: 'Delimiter inside string', input: '{"strs": ["we", "say", ":", "yes"]}', expected: '["we", "say", ":", "yes"]', isHidden: false }
      ],
      editorialSolution: {
        python: `def encode(strs):
    res = ""
    for s in strs:
        res += f"{len(s)}#{s}"
    return res

def decode(s):
    res = []
    i = 0
    while i < len(s):
        j = s.find('#', i)
        length = int(s[i:j])
        res.append(s[j + 1 : j + 1 + length])
        i = j + 1 + length
    return res`,
        explanation: `We encode each string using length-prefix framing: length + '#' + string. Even if the string contains '#' or digits, we read up to the '#' delimiter to know exactly how many subsequent characters belong to the string payload. O(N) time and handles arbitrary characters.`
      }
    }
  ]
};

module.exports = MODULE;
