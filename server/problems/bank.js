/**
 * Real-Time Collaborative Code Interview Platform
 * Problem Bank Repository: Curated Technical Interview Problems & Editorial Solutions
 */

const { DSA_CURRICULUM } = require('./dsa_curriculum');

const BASE_PROBLEMS = [
  {
    id: 'two-sum',
    title: 'Two Sum: Target Pair Index',
    difficulty: 'Easy',
    category: 'Arrays & HashMaps',
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
    optimalComplexity: {
      time: 'O(N)',
      space: 'O(N)'
    },
    starterCode: {
      python: `def two_sum(nums, target):
    # Write your solution here
    pass

# Test harness runner
if __name__ == '__main__':
    import json, sys
    lines = sys.stdin.read().strip().splitlines()
    if lines:
        for line in lines:
            if not line.strip(): continue
            data = json.loads(line)
            res = two_sum(data['nums'], data['target'])
            print(json.dumps(res))
`,
      javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function twoSum(nums, target) {
    // Write your solution here
}

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
rl.on('line', (line) => {
    if (!line.trim()) return;
    const data = JSON.parse(line);
    const res = twoSum(data.nums, data.target);
    console.log(JSON.stringify(res));
});
`
    },
    testCases: [
      {
        id: 'tc-1',
        description: 'Standard positive array',
        input: '{"nums": [2, 7, 11, 15], "target": 9}',
        expected: '[0, 1]',
        isHidden: false
      },
      {
        id: 'tc-2',
        description: 'Unsorted array with duplicate elements',
        input: '{"nums": [3, 2, 4], "target": 6}',
        expected: '[1, 2]',
        isHidden: false
      },
      {
        id: 'tc-3',
        description: 'Identical pair targets',
        input: '{"nums": [3, 3], "target": 6}',
        expected: '[0, 1]',
        isHidden: true
      },
      {
        id: 'tc-4',
        description: 'Negative integers',
        input: '{"nums": [-1, -2, -3, -4, -5], "target": -8}',
        expected: '[2, 4]',
        isHidden: true
      }
    ],
    editorialSolution: {
      python: `def two_sum(nums, target):
    seen = {} # mapping value -> index
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []`,
      explanation: `By iterating through the array once and maintaining a hash map of elements seen so far, we can check if the required complement (target - num) has already been encountered in O(1) average time.
Time Complexity: O(N) single pass.
Space Complexity: O(N) storing up to N elements in the hash map.`
    }
  },
  {
    id: 'lru-cache',
    title: 'LRU Cache: Least Recently Used',
    difficulty: 'Medium',
    category: 'Design & Data Structures',
    description: `Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.

Implement the \`LRUCache\` class:
* \`LRUCache(int capacity)\`: Initialize the LRU cache with positive size capacity.
* \`int get(int key)\`: Return the value of the \`key\` if the key exists, otherwise return -1.
* \`void put(int key, int value)\`: Update the value of the \`key\` if the \`key\` exists. Otherwise, add the key-value pair to the cache. If the number of keys exceeds the capacity from this operation, evict the least recently used key.

The functions \`get\` and \`put\` must each run in O(1) average time complexity.`,
    optimalComplexity: {
      time: 'O(1) per operation',
      space: 'O(capacity)'
    },
    starterCode: {
      python: `class LRUCache:
    def __init__(self, capacity: int):
        self.capacity = capacity
        pass

    def get(self, key: int) -> int:
        pass

    def put(self, key: int, value: int) -> None:
        pass

if __name__ == '__main__':
    c = LRUCache(2)
    c.put(1, 1)
    c.put(2, 2)
    print(c.get(1))
    c.put(3, 3)
    print(c.get(2))
`
    },
    testCases: [
      {
        id: 'tc-1',
        description: 'Basic Put and Get with eviction',
        input: '{"ops": ["put(1,1)", "put(2,2)", "get(1)", "put(3,3)", "get(2)"]}',
        expected: '1\n-1',
        isHidden: false
      }
    ],
    editorialSolution: {
      python: `class Node:
    def __init__(self, key=0, val=0):
        self.key = key
        self.val = val
        self.prev = None
        self.next = None

class LRUCache:
    def __init__(self, capacity: int):
        self.capacity = capacity
        self.cache = {}
        # Sentinel dummy nodes
        self.head = Node()
        self.tail = Node()
        self.head.next = self.tail
        self.tail.prev = self.head

    def _remove(self, node):
        node.prev.next = node.next
        node.next.prev = node.prev

    def _add(self, node):
        # Insert right before tail (most recently used)
        node.prev = self.tail.prev
        node.next = self.tail
        self.tail.prev.next = node
        self.tail.prev = node

    def get(self, key: int) -> int:
        if key in self.cache:
            node = self.cache[key]
            self._remove(node)
            self._add(node)
            return node.val
        return -1

    def put(self, key: int, value: int) -> None:
        if key in self.cache:
            self._remove(self.cache[key])
        new_node = Node(key, value)
        self.cache[key] = new_node
        self._add(new_node)
        
        if len(self.cache) > self.capacity:
            lru = self.head.next
            self._remove(lru)
            del self.cache[lru.key]`,
      explanation: `We combine a Hash Map with a Doubly-Linked List with dummy head and tail sentinel nodes.
The hash map provides O(1) lookup of nodes.
The doubly-linked list allows O(1) node removal and re-insertion at the tail to mark an item as most recently used.
When capacity is exceeded, the least recently used node immediately following head is evicted in O(1).`
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
\`\`\``,
    optimalComplexity: {
      time: 'O(N)',
      space: 'O(min(N, M))'
    },
    starterCode: {
      python: `def length_of_longest_substring(s: str) -> int:
    pass

if __name__ == '__main__':
    import json, sys
    lines = sys.stdin.read().strip().splitlines()
    for l in lines:
        if l.strip():
            d = json.loads(l)
            print(length_of_longest_substring(d['s']))
`
    },
    testCases: [
      { id: 'tc-1', description: 'Mixed repeating characters', input: '{"s": "abcabcbb"}', expected: '3', isHidden: false },
      { id: 'tc-2', description: 'Single repeated character', input: '{"s": "bbbbb"}', expected: '1', isHidden: false }
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
      explanation: `Using a sliding window with pointers left and right, we record the most recent index of each character in a dictionary.
When a repeated character is encountered within the current window (char_index[ch] >= left), we jump the left boundary to char_index[ch] + 1.
Runs in a single pass: O(N) time, O(min(N, charset)) auxiliary memory.`
    }
  },
  {
    id: 'merge-intervals',
    title: 'Merge Intervals: Overlapping Ranges',
    difficulty: 'Medium',
    category: 'Intervals & Sorting',
    description: `Given an array of \`intervals\` where \`intervals[i] = [start_i, end_i]\`, merge all overlapping intervals, and return an array of non-overlapping intervals.`,
    optimalComplexity: { time: 'O(N log N)', space: 'O(N)' },
    starterCode: {
      python: `def merge(intervals):
    pass

if __name__ == '__main__':
    import json, sys
    lines = sys.stdin.read().strip().splitlines()
    for l in lines:
        if l.strip():
            d = json.loads(l)
            print(json.dumps(merge(d['intervals'])))
`
    },
    testCases: [
      { id: 'tc-1', description: 'Overlapping adjacent intervals', input: '{"intervals": [[1,3],[2,6],[8,10],[15,18]]}', expected: '[[1, 6], [8, 10], [15, 18]]', isHidden: false },
      { id: 'tc-2', description: 'Touching boundaries', input: '{"intervals": [[1,4],[4,5]]}', expected: '[[1, 5]]', isHidden: false }
    ],
    editorialSolution: {
      python: `def merge(intervals):
    intervals.sort(key=lambda x: x[0])
    merged = []
    
    for interval in intervals:
        if not merged or merged[-1][1] < interval[0]:
            merged.append(interval)
        else:
            merged[-1][1] = max(merged[-1][1], interval[1])
            
    return merged`,
      explanation: `First sort intervals by starting position in O(N log N).
Then scan linearly: if the current interval starts after the last merged interval finishes, append it.
Otherwise, they overlap: extend the end of the last merged interval to max(last.end, current.end).
Time: O(N log N), Space: O(N).`
    }
  }
];

// Combine base problems with curriculum module problems
const CURRICULUM_PROBLEMS = DSA_CURRICULUM.flatMap(c => c.problems);
const ALL_PROBLEMS = [...BASE_PROBLEMS];

for (const cp of CURRICULUM_PROBLEMS) {
  if (!ALL_PROBLEMS.some(p => p.id === cp.id)) {
    ALL_PROBLEMS.push(cp);
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
    testCasesCount: p.testCases.length,
    hasEditorial: !!p.editorialSolution
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
