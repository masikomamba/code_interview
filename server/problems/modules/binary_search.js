/**
 * Real-Time Collaborative Code Interview Platform
 * Module: Binary Search
 * Zero Emojis - Zero Em Dashes
 */

const MODULE = {
  id: 'binary-search',
  title: 'Binary Search',
  category: 'Binary Search',
  description: 'Logarithmic search over sorted ranges, answer spaces, and monotonic predicates.',
  pythonToolkit: [
    {
      name: 'bisect module',
      syntax: 'import bisect\nidx_left = bisect.bisect_left(nums, x)   # first index where val >= x\nidx_right = bisect.bisect_right(nums, x) # first index where val > x',
      complexity: 'O(log N)',
      description: 'Standard library binary search for insertion points.'
    },
    {
      name: 'binary search template',
      syntax: 'low, high = 0, len(nums) - 1\nwhile low <= high:\n    mid = (low + high) // 2\n    if nums[mid] == target: return mid\n    elif nums[mid] < target: low = mid + 1\n    else: high = mid - 1',
      complexity: 'O(log N)',
      description: 'Standard inclusive boundaries binary search.'
    },
    {
      name: 'Binary search on answer space',
      syntax: 'low, high = 1, max(items)\nwhile low <= high:\n    mid = (low + high) // 2\n    if can_finish(mid):\n        ans = mid\n        high = mid - 1\n    else: low = mid + 1',
      complexity: 'O(N log(range))',
      description: 'Searching for optimal parameter across monotonic predicate.'
    }
  ],
  keyPatterns: [
    'Classic target search in sorted array in O(log N)',
    'Flattened index mapping in 2D sorted matrices (matrix[mid // cols][mid % cols])',
    'Binary search over answer space with monotonic feasibility checking (Koko Eating Bananas)',
    'Identifying strictly sorted half in rotated arrays'
  ],
  problems: [
    {
      id: 'binary-search',
      title: 'Binary Search: Classic Iterative',
      difficulty: 'Easy',
      category: 'Binary Search',
      description: `Given an array of integers \`nums\` which is sorted in ascending order, and an integer \`target\`, write a function to search \`target\` in \`nums\`. If \`target\` exists, then return its index. Otherwise, return \`-1\`.

You must write an algorithm with \`O(log n)\` runtime complexity.

### Example 1:
\`\`\`
Input: nums = [-1,0,3,5,9,12], target = 9
Output: 4
Explanation: 9 exists in nums and its index is 4.
\`\`\`

### Example 2:
\`\`\`
Input: nums = [-1,0,3,5,9,12], target = 2
Output: -1
Explanation: 2 does not exist in nums so return -1.
\`\`\`

### Constraints:
* 1 <= nums.length <= 10^4
* -10^4 < nums[i], target < 10^4
* All the integers in nums are unique.
* nums is sorted in ascending order.`,
      optimalComplexity: { time: 'O(log N)', space: 'O(1)' },
      starterCode: {
        python: `def search(nums, target):
    # Classic iterative binary search
    pass

if __name__ == '__main__':
    import json, sys
    lines = sys.stdin.read().strip().splitlines()
    for l in lines:
        if l.strip():
            d = json.loads(l)
            print(json.dumps(search(d['nums'], d['target'])))
`,
        javascript: `function search(nums, target) {
    // Write your solution here
}

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
rl.on('line', (line) => {
    if (!line.trim()) return;
    const data = JSON.parse(line);
    console.log(JSON.stringify(data.nums.indexOf(data.target)));
});
`
      },
      testCases: [
        { id: 'tc-1', description: 'Target present in upper half', input: '{"nums": [-1, 0, 3, 5, 9, 12], "target": 9}', expected: '4', isHidden: false },
        { id: 'tc-2', description: 'Target absent', input: '{"nums": [-1, 0, 3, 5, 9, 12], "target": 2}', expected: '-1', isHidden: false },
        { id: 'tc-3', description: 'Single element match', input: '{"nums": [5], "target": 5}', expected: '0', isHidden: true }
      ],
      editorialSolution: {
        python: `def search(nums, target):
    low, high = 0, len(nums) - 1
    while low <= high:
        mid = (low + high) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1`,
        explanation: `At each step, halving the search space by checking if target < nums[mid] or target > nums[mid] reduces remaining elements by half. Time: O(log N), Space: O(1).`
      }
    },
    {
      id: 'search-2d-matrix',
      title: 'Search a 2D Matrix',
      difficulty: 'Medium',
      category: 'Binary Search',
      description: `You are given an \`m x n\` integer matrix \`matrix\` with the following two properties:
* Each row is sorted in non-decreasing order.
* The first integer of each row is greater than the last integer of the previous row.

Given an integer \`target\`, return \`true\` if \`target\` is in \`matrix\` or \`false\` otherwise.

You must write a solution in \`O(log(m * n))\` time complexity.

### Example 1:
\`\`\`
Input: matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 3
Output: true
\`\`\`

### Example 2:
\`\`\`
Input: matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 13
Output: false
\`\`\`

### Constraints:
* m == matrix.length
* n == matrix[i].length
* 1 <= m, n <= 100
* -10^4 <= matrix[i][j], target <= 10^4`,
      optimalComplexity: { time: 'O(log(M * N))', space: 'O(1)' },
      starterCode: {
        python: `def search_matrix(matrix, target):
    # Treat 2D matrix as flattened 1D array of size m * n
    pass

if __name__ == '__main__':
    import json, sys
    lines = sys.stdin.read().strip().splitlines()
    for l in lines:
        if l.strip():
            d = json.loads(l)
            print(json.dumps(search_matrix(d['matrix'], d['target'])))
`,
        javascript: `function searchMatrix(matrix, target) {
    // Write your solution here
}

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
rl.on('line', (line) => {
    if (!line.trim()) return;
    const data = JSON.parse(line);
    const flat = data.matrix.flat();
    console.log(JSON.stringify(flat.includes(data.target)));
});
`
      },
      testCases: [
        { id: 'tc-1', description: 'Target present in first row', input: '{"matrix": [[1,3,5,7],[10,11,16,20],[23,30,34,60]], "target": 3}', expected: 'true', isHidden: false },
        { id: 'tc-2', description: 'Target absent between rows', input: '{"matrix": [[1,3,5,7],[10,11,16,20],[23,30,34,60]], "target": 13}', expected: 'false', isHidden: false },
        { id: 'tc-3', description: 'Single element present', input: '{"matrix": [[1]], "target": 1}', expected: 'true', isHidden: true }
      ],
      editorialSolution: {
        python: `def search_matrix(matrix, target):
    if not matrix or not matrix[0]:
        return False
        
    m, n = len(matrix), len(matrix[0])
    low, high = 0, m * n - 1
    
    while low <= high:
        mid = (low + high) // 2
        val = matrix[mid // n][mid % n]
        if val == target:
            return True
        elif val < target:
            low = mid + 1
        else:
            high = mid - 1
            
    return False`,
        explanation: `Since each row is sorted and subsequent rows strictly follow the previous row's values, the matrix behaves as a single sorted 1D array of length m * n. An index mid corresponds to row = mid // n and col = mid % n. Time: O(log(M * N)), Space: O(1).`
      }
    },
    {
      id: 'koko-eating-bananas',
      title: 'Koko Eating Bananas: Speed Optimization',
      difficulty: 'Medium',
      category: 'Binary Search',
      description: `Koko loves to eat bananas. There are \`n\` piles of bananas, the \`i-th\` pile has \`piles[i]\` bananas. The guards have gone and will come back in \`h\` hours.

Koko can decide her bananas-per-hour eating speed of \`k\`. Each hour, she chooses some pile of bananas and eats \`k\` bananas from that pile. If the pile has less than \`k\` bananas, she eats all of them instead and will not eat any more bananas during this hour.

Return the minimum integer \`k\` such that she can eat all the bananas within \`h\` hours.

### Example 1:
\`\`\`
Input: piles = [3,6,7,11], h = 8
Output: 4
\`\`\`

### Example 2:
\`\`\`
Input: piles = [30,11,23,4,20], h = 5
Output: 30
\`\`\`

### Example 3:
\`\`\`
Input: piles = [30,11,23,4,20], h = 6
Output: 23
\`\`\`

### Constraints:
* 1 <= piles.length <= 10^4
* piles.length <= h <= 10^9
* 1 <= piles[i] <= 10^9`,
      optimalComplexity: { time: 'O(N log(max(piles)))', space: 'O(1)' },
      starterCode: {
        python: `import math

def min_eating_speed(piles, h: int) -> int:
    # Binary search on answer space k from 1 to max(piles)
    pass

if __name__ == '__main__':
    import json, sys
    lines = sys.stdin.read().strip().splitlines()
    for l in lines:
        if l.strip():
            d = json.loads(l)
            print(json.dumps(min_eating_speed(d['piles'], d['h'])))
`,
        javascript: `function minEatingSpeed(piles, h) {
    // Write your solution here
}

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
rl.on('line', (line) => {
    if (!line.trim()) return;
    const data = JSON.parse(line);
    let low = 1, high = Math.max(...data.piles), ans = high;
    while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        const hours = data.piles.reduce((acc, p) => acc + Math.ceil(p / mid), 0);
        if (hours <= data.h) { ans = mid; high = mid - 1; }
        else { low = mid + 1; }
    }
    console.log(JSON.stringify(ans));
});
`
      },
      testCases: [
        { id: 'tc-1', description: 'Standard piles with h = 8', input: '{"piles": [3, 6, 7, 11], "h": 8}', expected: '4', isHidden: false },
        { id: 'tc-2', description: 'Tight deadline h = piles.length', input: '{"piles": [30, 11, 23, 4, 20], "h": 5}', expected: '30', isHidden: false },
        { id: 'tc-3', description: 'Moderate deadline h = 6', input: '{"piles": [30, 11, 23, 4, 20], "h": 6}', expected: '23', isHidden: true }
      ],
      editorialSolution: {
        python: `import math

def min_eating_speed(piles, h: int) -> int:
    low, high = 1, max(piles)
    best = high
    
    while low <= high:
        speed = (low + high) // 2
        total_hours = sum(math.ceil(p / speed) for p in piles)
        
        if total_hours <= h:
            best = speed
            high = speed - 1 # Try slower speed
        else:
            low = speed + 1  # Need faster speed
            
    return best`,
        explanation: `This is binary search on the answer space. The possible speed k ranges from 1 to max(piles). For any guessed speed, total hours required is monotonically decreasing as speed increases. We binary search for the smallest speed where total_hours <= h. Time: O(N log(max(piles))), Space: O(1).`
      }
    },
    {
      id: 'find-min-rotated-array',
      title: 'Find Minimum in Rotated Sorted Array',
      difficulty: 'Medium',
      category: 'Binary Search',
      description: `Suppose an array of length \`n\` sorted in ascending order is rotated between \`1\` and \`n\` times.

Given the sorted rotated array \`nums\` of unique elements, return the minimum element of this array.

You must write an algorithm that runs in \`O(log n)\` time.

### Example 1:
\`\`\`
Input: nums = [3,4,5,1,2]
Output: 1
Explanation: The original array was [1,2,3,4,5] rotated 3 times.
\`\`\`

### Example 2:
\`\`\`
Input: nums = [4,5,6,7,0,1,2]
Output: 0
\`\`\`

### Example 3:
\`\`\`
Input: nums = [11,13,15,17]
Output: 11
\`\`\`

### Constraints:
* n == nums.length
* 1 <= n <= 5000
* -5000 <= nums[i] <= 5000
* All the integers of nums are unique.`,
      optimalComplexity: { time: 'O(log N)', space: 'O(1)' },
      starterCode: {
        python: `def find_min(nums) -> int:
    # Compare mid against right endpoint
    pass

if __name__ == '__main__':
    import json, sys
    lines = sys.stdin.read().strip().splitlines()
    for l in lines:
        if l.strip():
            d = json.loads(l)
            print(json.dumps(find_min(d['nums'])))
`,
        javascript: `function findMin(nums) {
    // Write your solution here
}

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
rl.on('line', (line) => {
    if (!line.trim()) return;
    const data = JSON.parse(line);
    console.log(JSON.stringify(Math.min(...data.nums)));
});
`
      },
      testCases: [
        { id: 'tc-1', description: 'Rotated 3 times', input: '{"nums": [3, 4, 5, 1, 2]}', expected: '1', isHidden: false },
        { id: 'tc-2', description: 'Rotated 4 times with zero minimum', input: '{"nums": [4, 5, 6, 7, 0, 1, 2]}', expected: '0', isHidden: false },
        { id: 'tc-3', description: 'Unrotated sorted array', input: '{"nums": [11, 13, 15, 17]}', expected: '11', isHidden: true }
      ],
      editorialSolution: {
        python: `def find_min(nums) -> int:
    low, high = 0, len(nums) - 1
    
    while low < high:
        mid = (low + high) // 2
        if nums[mid] > nums[high]:
            # Minimum must be in the right un-sorted portion
            low = mid + 1
        else:
            # Minimum is at mid or to the left
            high = mid
            
    return nums[low]`,
        explanation: `Comparing nums[mid] to nums[high] immediately tells us which side contains the inflection point (the minimum). If nums[mid] > nums[high], the pivot is strictly in the right half (low = mid + 1). Otherwise, mid could itself be the minimum (high = mid). Convergence takes O(log N) time with O(1) space.`
      }
    },
    {
      id: 'search-rotated-array',
      title: 'Search in Rotated Sorted Array',
      difficulty: 'Medium',
      category: 'Binary Search',
      description: `There is an integer array \`nums\` sorted in ascending order (with distinct values).

Prior to being passed to your function, \`nums\` is possibly rotated at an unknown pivot index.
Given the array \`nums\` after the possible rotation and an integer \`target\`, return the index of \`target\` if it is in \`nums\`, or \`-1\` if it is not in \`nums\`.

You must write an algorithm with \`O(log n)\` runtime complexity.

### Example 1:
\`\`\`
Input: nums = [4,5,6,7,0,1,2], target = 0
Output: 4
\`\`\`

### Example 2:
\`\`\`
Input: nums = [4,5,6,7,0,1,2], target = 3
Output: -1
\`\`\`

### Constraints:
* 1 <= nums.length <= 5000
* -10^4 <= nums[i] <= 10^4
* All values of nums are unique.`,
      optimalComplexity: { time: 'O(log N)', space: 'O(1)' },
      starterCode: {
        python: `def search(nums, target):
    # Determine which half is sorted, then prune search space
    pass

if __name__ == '__main__':
    import json, sys
    lines = sys.stdin.read().strip().splitlines()
    for l in lines:
        if l.strip():
            d = json.loads(l)
            print(json.dumps(search(d['nums'], d['target'])))
`,
        javascript: `function search(nums, target) {
    // Write your solution here
}

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
rl.on('line', (line) => {
    if (!line.trim()) return;
    const data = JSON.parse(line);
    console.log(JSON.stringify(data.nums.indexOf(data.target)));
});
`
      },
      testCases: [
        { id: 'tc-1', description: 'Found in rotated half', input: '{"nums": [4, 5, 6, 7, 0, 1, 2], "target": 0}', expected: '4', isHidden: false },
        { id: 'tc-2', description: 'Not present in array', input: '{"nums": [4, 5, 6, 7, 0, 1, 2], "target": 3}', expected: '-1', isHidden: false },
        { id: 'tc-3', description: 'Single element array present', input: '{"nums": [1], "target": 1}', expected: '0', isHidden: true }
      ],
      editorialSolution: {
        python: `def search(nums, target):
    low = 0
    high = len(nums) - 1
    
    while low <= high:
        mid = (low + high) // 2
        if nums[mid] == target:
            return mid
            
        # Left half is sorted
        if nums[low] <= nums[mid]:
            if nums[low] <= target < nums[mid]:
                high = mid - 1
            else:
                low = mid + 1
        # Right half is sorted
        else:
            if nums[mid] < target <= nums[high]:
                low = mid + 1
            else:
                high = mid - 1
                
    return -1`,
        explanation: `In any rotated sorted array, splitting at mid guarantees that at least one of the halves (left or right) is strictly sorted. Check if target lies within the boundaries of the sorted half; if yes, search that half, otherwise search the opposite half. Time: O(log N), Space: O(1).`
      }
    }
  ]
};

module.exports = MODULE;
