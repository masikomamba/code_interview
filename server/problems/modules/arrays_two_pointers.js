/**
 * Real-Time Collaborative Code Interview Platform
 * Module: Arrays & Two Pointers
 * Zero Emojis - Zero Em Dashes
 */

const MODULE = {
  id: 'arrays-two-pointers',
  title: 'Arrays & Two Pointers',
  category: 'Arrays & Two Pointers',
  description: 'Linear collections, in-place manipulation, two-pointer convergence, and boundary partitioning.',
  pythonToolkit: [
    {
      name: 'list slicing',
      syntax: 'nums[start:end:step], nums[::-1]',
      complexity: 'O(k) where k is slice length',
      description: 'Extracts sublists or reverses a list in O(N).'
    },
    {
      name: 'enumerate()',
      syntax: 'for i, val in enumerate(nums):',
      complexity: 'O(1) per step',
      description: 'Yields index-value pairs simultaneously without manual index incrementing.'
    },
    {
      name: 'zip()',
      syntax: 'for a, b in zip(list1, list2):',
      complexity: 'O(1) per step',
      description: 'Pairs elements from multiple iterables up to the shortest length.'
    },
    {
      name: 'list.sort() vs sorted()',
      syntax: 'nums.sort(key=lambda x: x[1]) # in-place\nres = sorted(nums)',
      complexity: 'O(N log N) using Timsort',
      description: 'In-place sorting (.sort()) vs returning a new sorted list (sorted()).'
    }
  ],
  keyPatterns: [
    'Two pointers moving towards each other (left = 0, right = n - 1)',
    'Fast and slow pointers for cycle detection and in-place removal',
    'Three pointers partitioning around a pivot (Dutch National Flag)'
  ],
  problems: [
    {
      id: 'two-sum-sorted',
      title: 'Two Sum II: Input Array Is Sorted',
      difficulty: 'Medium',
      category: 'Arrays & Two Pointers',
      description: `Given a 1-indexed array of integers \`numbers\` that is already sorted in non-decreasing order, find two numbers such that they add up to a specific \`target\` number.

Return the indices of the two numbers, \`index1\` and \`index2\`, added by one as an integer array \`[index1, index2]\` of length 2.

### Example 1:
\`\`\`
Input: numbers = [2, 7, 11, 15], target = 9
Output: [1, 2]
Explanation: The sum of 2 and 7 is 9. Therefore index1 = 1, index2 = 2. We return [1, 2].
\`\`\`

### Example 2:
\`\`\`
Input: numbers = [-1, 0], target = -1
Output: [1, 2]
\`\`\`

### Constraints:
* 2 <= numbers.length <= 3 * 10^4
* -1000 <= numbers[i] <= 1000
* numbers is sorted in non-decreasing order.
* Use only O(1) extra space.`,
      optimalComplexity: { time: 'O(N)', space: 'O(1)' },
      starterCode: {
        python: `def two_sum_sorted(numbers, target):
    # Use two pointers at ends
    pass

if __name__ == '__main__':
    import json, sys
    lines = sys.stdin.read().strip().splitlines()
    for l in lines:
        if l.strip():
            d = json.loads(l)
            print(json.dumps(two_sum_sorted(d['numbers'], d['target'])))
`,
        javascript: `function twoSumSorted(numbers, target) {
    // Write your solution here
}

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
rl.on('line', (line) => {
    if (!line.trim()) return;
    const data = JSON.parse(line);
    console.log(JSON.stringify(twoSumSorted(data.numbers, data.target)));
});
`
      },
      testCases: [
        { id: 'tc-1', description: 'Basic sorted pair', input: '{"numbers": [2, 7, 11, 15], "target": 9}', expected: '[1, 2]', isHidden: false },
        { id: 'tc-2', description: 'Zero and negative values', input: '{"numbers": [-1, 0], "target": -1}', expected: '[1, 2]', isHidden: false },
        { id: 'tc-3', description: 'Duplicates with exact sum', input: '{"numbers": [2, 3, 4], "target": 6}', expected: '[1, 3]', isHidden: true }
      ],
      editorialSolution: {
        python: `def two_sum_sorted(numbers, target):
    left = 0
    right = len(numbers) - 1
    
    while left < right:
        curr_sum = numbers[left] + numbers[right]
        if curr_sum == target:
            return [left + 1, right + 1] # 1-indexed
        elif curr_sum < target:
            left += 1  # Need larger sum
        else:
            right -= 1 # Need smaller sum
            
    return []`,
        explanation: `Since the array is sorted, we place one pointer at the start (left) and one at the end (right). If the current sum is less than target, advance the left pointer. If the current sum exceeds target, decrement the right pointer. Runs in O(N) time with O(1) extra memory.`
      }
    },
    {
      id: 'valid-palindrome',
      title: 'Valid Palindrome',
      difficulty: 'Easy',
      category: 'Arrays & Two Pointers',
      description: `A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers.

Given a string \`s\`, return \`true\` if it is a palindrome, or \`false\` otherwise.

### Example 1:
\`\`\`
Input: s = "A man, a plan, a canal: Panama"
Output: true
Explanation: "amanaplanacanalpanama" is a palindrome.
\`\`\`

### Example 2:
\`\`\`
Input: s = "race a car"
Output: false
Explanation: "raceacar" is not a palindrome.
\`\`\`

### Constraints:
* 1 <= s.length <= 2 * 10^5
* s consists only of printable ASCII characters.`,
      optimalComplexity: { time: 'O(N)', space: 'O(1)' },
      starterCode: {
        python: `def is_palindrome(s: str) -> bool:
    # Use two pointers skipping non-alphanumeric chars
    pass

if __name__ == '__main__':
    import json, sys
    lines = sys.stdin.read().strip().splitlines()
    for l in lines:
        if l.strip():
            d = json.loads(l)
            print(json.dumps(is_palindrome(d['s'])))
`,
        javascript: `function isPalindrome(s) {
    // Write your solution here
}

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
rl.on('line', (line) => {
    if (!line.trim()) return;
    const data = JSON.parse(line);
    console.log(JSON.stringify(isPalindrome(data.s)));
});
`
      },
      testCases: [
        { id: 'tc-1', description: 'Standard palindrome with punctuation', input: '{"s": "A man, a plan, a canal: Panama"}', expected: 'true', isHidden: false },
        { id: 'tc-2', description: 'Not a palindrome', input: '{"s": "race a car"}', expected: 'false', isHidden: false },
        { id: 'tc-3', description: 'Single whitespace character', input: '{"s": " "}', expected: 'true', isHidden: true },
        { id: 'tc-4', description: 'Alphanumeric numbers', input: '{"s": "0P"}', expected: 'false', isHidden: true }
      ],
      editorialSolution: {
        python: `def is_palindrome(s: str) -> bool:
    left, right = 0, len(s) - 1
    
    while left < right:
        while left < right and not s[left].isalnum():
            left += 1
        while left < right and not s[right].isalnum():
            right -= 1
            
        if s[left].lower() != s[right].lower():
            return False
            
        left += 1
        right -= 1
        
    return True`,
        explanation: `We use two pointers converging inward. At each step, skip characters that are not alphanumeric using .isalnum(). Compare characters in lowercase. Time: O(N), Space: O(1) in-place without building intermediate strings.`
      }
    },
    {
      id: 'three-sum',
      title: '3Sum: Zero Sum Triplets',
      difficulty: 'Medium',
      category: 'Arrays & Two Pointers',
      description: `Given an integer array \`nums\`, return all the triplets \`[nums[i], nums[j], nums[k]]\` such that \`i != j\`, \`i != k\`, and \`j != k\`, and \`nums[i] + nums[j] + nums[k] == 0\`.

Notice that the solution set must not contain duplicate triplets.

### Example 1:
\`\`\`
Input: nums = [-1,0,1,2,-1,-4]
Output: [[-1,-1,2],[-1,0,1]]
Explanation: 
nums[0] + nums[1] + nums[2] = (-1) + 0 + 1 = 0.
nums[1] + nums[2] + nums[4] = 0 + 1 + (-1) = 0.
nums[0] + nums[3] + nums[4] = (-1) + 2 + (-1) = 0.
The distinct triplets are [-1,0,1] and [-1,-1,2].
\`\`\`

### Example 2:
\`\`\`
Input: nums = [0,1,1]
Output: []
\`\`\`

### Constraints:
* 3 <= nums.length <= 3000
* -10^5 <= nums[i] <= 10^5`,
      optimalComplexity: { time: 'O(N^2)', space: 'O(1) extra space' },
      starterCode: {
        python: `def three_sum(nums):
    # Sort first, then fix one element and use two pointers
    pass

if __name__ == '__main__':
    import json, sys
    lines = sys.stdin.read().strip().splitlines()
    for l in lines:
        if l.strip():
            d = json.loads(l)
            res = three_sum(d['nums'])
            sorted_res = sorted([sorted(x) for x in res])
            print(json.dumps(sorted_res))
`,
        javascript: `function threeSum(nums) {
    // Write your solution here
}

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
rl.on('line', (line) => {
    if (!line.trim()) return;
    const data = JSON.parse(line);
    const res = threeSum(data.nums);
    const sortedRes = (res || []).map(r => [...r].sort((a,b)=>a-b)).sort();
    console.log(JSON.stringify(sortedRes));
});
`
      },
      testCases: [
        { id: 'tc-1', description: 'Standard array with negative and positive values', input: '{"nums": [-1, 0, 1, 2, -1, -4]}', expected: '[[-1, -1, 2], [-1, 0, 1]]', isHidden: false },
        { id: 'tc-2', description: 'All positive numbers', input: '{"nums": [0, 1, 1]}', expected: '[]', isHidden: false },
        { id: 'tc-3', description: 'Three zeros', input: '{"nums": [0, 0, 0]}', expected: '[[0, 0, 0]]', isHidden: true }
      ],
      editorialSolution: {
        python: `def three_sum(nums):
    nums.sort()
    res = []
    
    for i in range(len(nums) - 2):
        if i > 0 and nums[i] == nums[i - 1]:
            continue # Skip duplicate first values
        if nums[i] > 0:
            break    # Sum cannot be 0 if smallest value is positive
            
        left = i + 1
        right = len(nums) - 1
        
        while left < right:
            total = nums[i] + nums[left] + nums[right]
            if total < 0:
                left += 1
            elif total > 0:
                right -= 1
            else:
                res.append([nums[i], nums[left], nums[right]])
                while left < right and nums[left] == nums[left + 1]:
                    left += 1
                while left < right and nums[right] == nums[right - 1]:
                    right -= 1
                left += 1
                right -= 1
                
    return res`,
        explanation: `Sort nums first. For each index i, we fix nums[i] as the first element and solve Two Sum for target -nums[i] using two pointers (left and right). We skip adjacent duplicate values to avoid duplicate triplets. Time: O(N^2), Space: O(1) beyond sorting output.`
      }
    },
    {
      id: 'container-with-most-water',
      title: 'Container With Most Water',
      difficulty: 'Medium',
      category: 'Arrays & Two Pointers',
      description: `You are given an integer array \`height\` of length \`n\`. There are \`n\` vertical lines drawn such that the two endpoints of the \`i-th\` line are \`(i, 0)\` and \`(i, height[i])\`.

Find two lines that together with the x-axis form a container, such that the container contains the most water. Return the maximum amount of water a container can store.

### Example 1:
\`\`\`
Input: height = [1,8,6,2,5,4,8,3,7]
Output: 49
Explanation: The max area is between index 1 and index 8: min(8, 7) * (8 - 1) = 7 * 7 = 49.
\`\`\`

### Example 2:
\`\`\`
Input: height = [1,1]
Output: 1
\`\`\`

### Constraints:
* n == height.length
* 2 <= n <= 10^5
* 0 <= height[i] <= 10^4`,
      optimalComplexity: { time: 'O(N)', space: 'O(1)' },
      starterCode: {
        python: `def max_area(height):
    # Two pointers calculating width * min(height[l], height[r])
    pass

if __name__ == '__main__':
    import json, sys
    lines = sys.stdin.read().strip().splitlines()
    for l in lines:
        if l.strip():
            d = json.loads(l)
            print(json.dumps(max_area(d['height'])))
`,
        javascript: `function maxArea(height) {
    // Write your solution here
}

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
rl.on('line', (line) => {
    if (!line.trim()) return;
    const data = JSON.parse(line);
    console.log(JSON.stringify(maxArea(data.height)));
});
`
      },
      testCases: [
        { id: 'tc-1', description: 'Standard container', input: '{"height": [1,8,6,2,5,4,8,3,7]}', expected: '49', isHidden: false },
        { id: 'tc-2', description: 'Equal two heights', input: '{"height": [1, 1]}', expected: '1', isHidden: false },
        { id: 'tc-3', description: 'Decreasing heights', input: '{"height": [4, 3, 2, 1, 4]}', expected: '16', isHidden: true }
      ],
      editorialSolution: {
        python: `def max_area(height):
    left = 0
    right = len(height) - 1
    max_water = 0
    
    while left < right:
        width = right - left
        h = min(height[left], height[right])
        max_water = max(max_water, width * h)
        
        if height[left] < height[right]:
            left += 1
        else:
            right -= 1
            
    return max_water`,
        explanation: `The area is bounded by the shorter line: area = (right - left) * min(height[left], height[right]). Moving the taller line can only decrease width without increasing min-height. Therefore, we always advance the shorter line pointer. Time: O(N), Space: O(1).`
      }
    },
    {
      id: 'trapping-rain-water',
      title: 'Trapping Rain Water',
      difficulty: 'Hard',
      category: 'Arrays & Two Pointers',
      description: `Given \`n\` non-negative integers representing an elevation map where the width of each bar is \`1\`, compute how much water it can trap after raining.

### Example 1:
\`\`\`
Input: height = [0,1,0,2,1,0,1,3,2,1,2,1]
Output: 6
Explanation: The elevation map traps 6 units of rain water.
\`\`\`

### Example 2:
\`\`\`
Input: height = [4,2,0,3,2,5]
Output: 9
\`\`\`

### Constraints:
* n == height.length
* 1 <= n <= 2 * 10^4
* 0 <= height[i] <= 10^5`,
      optimalComplexity: { time: 'O(N)', space: 'O(1)' },
      starterCode: {
        python: `def trap(height):
    # Two pointers maintaining max_left and max_right
    pass

if __name__ == '__main__':
    import json, sys
    lines = sys.stdin.read().strip().splitlines()
    for l in lines:
        if l.strip():
            d = json.loads(l)
            print(json.dumps(trap(d['height'])))
`,
        javascript: `function trap(height) {
    // Write your solution here
}

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
rl.on('line', (line) => {
    if (!line.trim()) return;
    const data = JSON.parse(line);
    console.log(JSON.stringify(trap(data.height)));
});
`
      },
      testCases: [
        { id: 'tc-1', description: 'Standard terrain', input: '{"height": [0,1,0,2,1,0,1,3,2,1,2,1]}', expected: '6', isHidden: false },
        { id: 'tc-2', description: 'Deep valley', input: '{"height": [4,2,0,3,2,5]}', expected: '9', isHidden: false },
        { id: 'tc-3', description: 'Monotonically increasing terrain (no traps)', input: '{"height": [1,2,3,4,5]}', expected: '0', isHidden: true }
      ],
      editorialSolution: {
        python: `def trap(height):
    if not height:
        return 0
        
    left, right = 0, len(height) - 1
    left_max, right_max = height[left], height[right]
    water = 0
    
    while left < right:
        if left_max < right_max:
            left += 1
            left_max = max(left_max, height[left])
            water += left_max - height[left]
        else:
            right -= 1
            right_max = max(right_max, height[right])
            water += right_max - height[right]
            
    return water`,
        explanation: `Water trapped at index i is determined by min(max_left, max_right) - height[i]. By keeping two pointers at the ends and updating left_max and right_max, we know that if left_max < right_max, the water level at left is solely constrained by left_max. Time: O(N), Space: O(1).`
      }
    }
  ]
};

module.exports = MODULE;
