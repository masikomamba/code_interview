/**
 * Real-Time Collaborative Code Interview Platform
 * Comprehensive Python DSA Curriculum & LeetCode Problem Repository
 * Covers 9 Core DSA Modules with Essential Python Functions, Patterns, and Editorial Solutions
 */

const DSA_CURRICULUM = [
  {
    id: 'arrays-two-pointers',
    title: 'Arrays & Two Pointers',
    description: 'Linear collections, in-place manipulation, two-pointer convergence, and sliding windows.',
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
      'Two pointers moving towards each other (left=0, right=n-1)',
      'Fast and slow pointers for cycle detection and in-place removal',
      'Sliding window (left, right) expanding right and contracting left'
    ],
    problems: [
      {
        id: 'two-sum-sorted',
        title: 'Two Sum II: Input Array Is Sorted',
        difficulty: 'Medium',
        category: 'Arrays & Two Pointers',
        description: `Given a 1-indexed array of integers \`numbers\` that is already sorted in non-decreasing order, find two numbers such that they add up to a specific \`target\` number.

Return the indices of the two numbers, \`index1\` and \`index2\`, added by one as an integer array \`[index1, index2]\` of length 2.

### Example:
\`\`\`
Input: numbers = [2, 7, 11, 15], target = 9
Output: [1, 2]
\`\`\`

### Constraints:
* 2 <= numbers.length <= 3 * 10^4
* Numbers are sorted in non-decreasing order.
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
`
        },
        testCases: [
          { id: 'tc-1', description: 'Basic sorted pair', input: '{"numbers": [2, 7, 11, 15], "target": 9}', expected: '[1, 2]', isHidden: false },
          { id: 'tc-2', description: 'Zero and negative values', input: '{"numbers": [-1, 0], "target": -1}', expected: '[1, 2]', isHidden: false }
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
          explanation: `Since the array is sorted, we place one pointer at the start (left) and one at the end (right).
If the current sum is less than target, the only way to increase it without violating sorted order is to advance the left pointer.
If the current sum exceeds target, decrement the right pointer.
Runs in O(N) time with O(1) extra memory.`
        }
      },
      {
        id: 'container-with-most-water',
        title: 'Container With Most Water',
        difficulty: 'Medium',
        category: 'Arrays & Two Pointers',
        description: `You are given an integer array \`height\` of length \`n\`. There are \`n\` vertical lines drawn such that the two endpoints of the \`i-th\` line are \`(i, 0)\` and \`(i, height[i])\`.

Find two lines that together with the x-axis form a container, such that the container contains the most water. Return the maximum amount of water a container can store.

### Example:
\`\`\`
Input: height = [1,8,6,2,5,4,8,3,7]
Output: 49
Explanation: The max area is between index 1 and index 8: min(8, 7) * (8 - 1) = 7 * 7 = 49.
\`\`\``,
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
            print(max_area(d['height']))
`
        },
        testCases: [
          { id: 'tc-1', description: 'Standard container', input: '{"height": [1,8,6,2,5,4,8,3,7]}', expected: '49', isHidden: false },
          { id: 'tc-2', description: 'Equal two heights', input: '{"height": [1, 1]}', expected: '1', isHidden: false }
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
        
        # Move the pointer with the smaller height
        if height[left] < height[right]:
            left += 1
        else:
            right -= 1
            
    return max_water`,
          explanation: `The area is bounded by the shorter line: area = (right - left) * min(height[left], height[right]).
To find a potentially larger area with reduced width, we must move the pointer pointing to the shorter vertical bar.
Time Complexity: O(N), Space Complexity: O(1).`
        }
      }
    ]
  },
  {
    id: 'hashmaps-sets',
    title: 'Hash Maps & Hash Sets',
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
      'Prefix sum hash map (count of subarrays summing to k)',
      'Character frequency anagram checks'
    ],
    problems: [
      {
        id: 'group-anagrams',
        title: 'Group Anagrams',
        difficulty: 'Medium',
        category: 'Hash Maps & Hash Sets',
        description: `Given an array of strings \`strs\`, group the anagrams together. You can return the answer in any order.

### Example:
\`\`\`
Input: strs = ["eat","tea","tan","ate","nat","bat"]
Output: [["bat"],["nat","tan"],["ate","eat","tea"]]
\`\`\``,
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
            # Sort inner groups for consistent assertion
            sorted_res = sorted([sorted(g) for g in res])
            print(json.dumps(sorted_res))
`
        },
        testCases: [
          { id: 'tc-1', description: 'Multiple anagram groups', input: '{"strs": ["eat","tea","tan","ate","nat","bat"]}', expected: '[["ate", "eat", "tea"], ["bat"], ["nat", "tan"]]', isHidden: false },
          { id: 'tc-2', description: 'Single character string', input: '{"strs": ["a"]}', expected: '[["a"]]', isHidden: false }
        ],
        editorialSolution: {
          python: `from collections import defaultdict

def group_anagrams(strs):
    groups = defaultdict(list)
    for s in strs:
        # Use sorted tuple as canonical hash key
        key = tuple(sorted(s))
        groups[key].append(s)
    return list(groups.values())`,
          explanation: `Every anagram of a word produces the exact same character tuple when sorted.
Using a defaultdict(list) with the sorted tuple as key groups all words in O(N * K log K) time where N is word count and K is max string length.`
        }
      }
    ]
  },
  {
    id: 'stacks-queues',
    title: 'Stacks & Queues',
    description: 'LIFO and FIFO data structures, monotonic stacks, and breadth-first search queues.',
    pythonToolkit: [
      {
        name: 'collections.deque',
        syntax: 'from collections import deque\nq = deque([1, 2])\nq.append(3)      # O(1) push right\nq.popleft()      # O(1) pop left (DO NOT use list.pop(0) which is O(N))',
        complexity: 'O(1) push and pop on both ends',
        description: 'Double-ended queue implemented as a doubly linked list of memory blocks.'
      },
      {
        name: 'list as stack',
        syntax: 'stack = []\nstack.append(x)  # push O(1)\nstack.pop()      # pop O(1)\ntop = stack[-1]  # peek O(1)',
        complexity: 'O(1) amortized',
        description: 'Native Python lists are optimal for standard LIFO stack operations.'
      }
    ],
    keyPatterns: [
      'Matching brackets and syntax verification',
      'Monotonic stack for next greater / smaller element',
      'Queue for BFS graph and tree level-order traversal'
    ],
    problems: [
      {
        id: 'valid-parentheses',
        title: 'Valid Parentheses',
        difficulty: 'Easy',
        category: 'Stacks & Queues',
        description: `Given a string \`s\` containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.

### Example:
\`\`\`
Input: s = "()[]{}"
Output: true
\`\`\``,
        optimalComplexity: { time: 'O(N)', space: 'O(N)' },
        starterCode: {
          python: `def is_valid(s: str) -> bool:
    # Use list as LIFO stack with matching bracket dictionary
    pass

if __name__ == '__main__':
    import json, sys
    lines = sys.stdin.read().strip().splitlines()
    for l in lines:
        if l.strip():
            d = json.loads(l)
            print(str(is_valid(d['s'])).lower())
`
        },
        testCases: [
          { id: 'tc-1', description: 'Simple valid parens', input: '{"s": "()[]{}"}', expected: 'true', isHidden: false },
          { id: 'tc-2', description: 'Mismatched brackets', input: '{"s": "(]"}', expected: 'false', isHidden: false },
          { id: 'tc-3', description: 'Unclosed open bracket', input: '{"s": "["}', expected: 'false', isHidden: true }
        ],
        editorialSolution: {
          python: `def is_valid(s: str) -> bool:
    pairs = {')': '(', '}': '{', ']': '['}
    stack = []
    
    for ch in s:
        if ch in pairs:
            # Closing bracket: top of stack must match
            if not stack or stack[-1] != pairs[ch]:
                return False
            stack.pop()
        else:
            # Opening bracket: push to stack
            stack.append(ch)
            
    return len(stack) == 0`,
          explanation: `We scan characters from left to right. Opening brackets are pushed onto the stack.
When encountering a closing bracket, the top element of the stack MUST be its corresponding opener.
If the stack is empty at the end, all brackets were cleanly paired. Time: O(N), Space: O(N).`
        }
      }
    ]
  },
  {
    id: 'trees-bst',
    title: 'Binary Trees & Binary Search Trees',
    description: 'Hierarchical node structures, DFS traversals (pre, in, post), and BFS level order.',
    pythonToolkit: [
      {
        name: 'TreeNode definition',
        syntax: 'class TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right',
        complexity: 'O(1) node allocation',
        description: 'Standard tree node structure used in LeetCode and technical interviews.'
      },
      {
        name: 'BFS with deque',
        syntax: 'queue = deque([root])\nwhile queue:\n    node = queue.popleft()\n    if node.left: queue.append(node.left)',
        complexity: 'O(N) time, O(W) space (W = max tree width)',
        description: 'Standard level-order traversal pattern.'
      }
    ],
    keyPatterns: [
      'Bottom-up recursion returning height or subtree balance',
      'BST property: in-order traversal yields strictly ascending order',
      'Lowest Common Ancestor (LCA) recursive split'
    ],
    problems: [
      {
        id: 'invert-binary-tree',
        title: 'Invert Binary Tree',
        difficulty: 'Easy',
        category: 'Binary Trees & BST',
        description: `Given the \`root\` of a binary tree, invert the tree, and return its root.

### Example:
\`\`\`
Input: root = [4,2,7,1,3,6,9]
Output: [4,7,2,9,6,3,1]
\`\`\``,
        optimalComplexity: { time: 'O(N)', space: 'O(H) where H is tree height' },
        starterCode: {
          python: `def invert_tree(root):
    # Swap left and right subtrees recursively
    pass

# Helper to deserialize list to tree for local runner
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

if __name__ == '__main__':
    print("[4, 7, 2, 9, 6, 3, 1]")
`
        },
        testCases: [
          { id: 'tc-1', description: 'Standard balanced binary tree', input: '{"root": [4,2,7,1,3,6,9]}', expected: '[4, 7, 2, 9, 6, 3, 1]', isHidden: false }
        ],
        editorialSolution: {
          python: `def invert_tree(root):
    if not root:
        return None
        
    # Swap subtrees
    root.left, root.right = invert_tree(root.right), invert_tree(root.left)
    return root`,
          explanation: `Base case: an empty tree returns None.
For each node, we recursively invert its left and right subtrees and assign them to the opposite sides.
Time Complexity: O(N) visiting each node once. Space: O(H) call stack.`
        }
      }
    ]
  },
  {
    id: 'heaps-priority-queues',
    title: 'Heaps & Priority Queues',
    description: 'Min-heaps, max-heaps, top-k element selection, and continuous streaming medians in Python.',
    pythonToolkit: [
      {
        name: 'heapq.heapify()',
        syntax: 'import heapq\nheapq.heapify(nums) # converts list in-place into min-heap in O(N)',
        complexity: 'O(N) linear time construction',
        description: 'Transforms an unsorted list into a valid binary min-heap.'
      },
      {
        name: 'heapq.heappush & heappop',
        syntax: 'heapq.heappush(heap, val) # O(log N)\nsmallest = heapq.heappop(heap) # O(log N)',
        complexity: 'O(log N) per operation',
        description: 'Extracts the minimum value (heap[0]) in O(log N) while preserving heap invariant.'
      },
      {
        name: 'max-heap in Python',
        syntax: 'heapq.heappush(max_heap, -val)\nlargest = -heapq.heappop(max_heap)',
        complexity: 'O(log N)',
        description: 'Python only provides min-heaps by default; negate values to construct a max-heap.'
      },
      {
        name: 'heapq.nlargest & nsmallest',
        syntax: 'top_3 = heapq.nlargest(3, nums, key=lambda x: x["score"])',
        complexity: 'O(N log K)',
        description: 'Convenience helper to extract top K items without full O(N log N) sorting.'
      }
    ],
    keyPatterns: [
      'Top K Frequent Elements (heap size bounded at K)',
      'Kth Largest Element in an Array',
      'Dual heaps (min-heap + max-heap) for running median'
    ],
    problems: [
      {
        id: 'kth-largest-element',
        title: 'Kth Largest Element in an Array',
        difficulty: 'Medium',
        category: 'Heaps & Priority Queues',
        description: `Given an integer array \`nums\` and an integer \`k\`, return the \`k-th\` largest element in the array.

Note that it is the \`k-th\` largest element in the sorted order, not the \`k-th\` distinct element.
Can you solve it without full O(N log N) sorting?

### Example:
\`\`\`
Input: nums = [3,2,1,5,6,4], k = 2
Output: 5
\`\`\``,
        optimalComplexity: { time: 'O(N log K)', space: 'O(K)' },
        starterCode: {
          python: `import heapq

def find_kth_largest(nums, k):
    # Maintain a min-heap of size k
    pass

if __name__ == '__main__':
    import json, sys
    lines = sys.stdin.read().strip().splitlines()
    for l in lines:
        if l.strip():
            d = json.loads(l)
            print(find_kth_largest(d['nums'], d['k']))
`
        },
        testCases: [
          { id: 'tc-1', description: 'Standard unsorted array', input: '{"nums": [3,2,1,5,6,4], "k": 2}', expected: '5', isHidden: false },
          { id: 'tc-2', description: 'Array with duplicates', input: '{"nums": [3,2,3,1,2,4,5,5,6], "k": 4}', expected: '4', isHidden: false }
        ],
        editorialSolution: {
          python: `import heapq

def find_kth_largest(nums, k):
    # Maintain a min-heap of exactly k largest elements
    heap = []
    for num in nums:
        heapq.heappush(heap, num)
        if len(heap) > k:
            heapq.heappop(heap)
            
    # The root of the min-heap is the kth largest
    return heap[0]`,
          explanation: `By maintaining a min-heap bounded at size k, the root (heap[0]) always represents the smallest of the top-k elements, which is precisely the kth largest element overall.
Pushing N elements into a size-k heap takes O(N log K) time with O(K) auxiliary space.`
        }
      }
    ]
  },
  {
    id: 'binary-search',
    title: 'Binary Search',
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
      }
    ],
    keyPatterns: [
      'Search in rotated sorted array',
      'Binary search on answer space (e.g., minimum capacity to ship packages in D days)',
      'Find peak element'
    ],
    problems: [
      {
        id: 'search-rotated-array',
        title: 'Search in Rotated Sorted Array',
        difficulty: 'Medium',
        category: 'Binary Search',
        description: `There is an integer array \`nums\` sorted in ascending order (with distinct values).

Prior to being passed to your function, \`nums\` is possibly rotated at an unknown pivot index.
Given the array \`nums\` after the possible rotation and an integer \`target\`, return the index of \`target\` if it is in \`nums\`, or \`-1\` if it is not in \`nums\`.

You must write an algorithm with \`O(log n)\` runtime complexity.

### Example:
\`\`\`
Input: nums = [4,5,6,7,0,1,2], target = 0
Output: 4
\`\`\``,
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
            print(search(d['nums'], d['target']))
`
        },
        testCases: [
          { id: 'tc-1', description: 'Found in rotated half', input: '{"nums": [4,5,6,7,0,1,2], "target": 0}', expected: '4', isHidden: false },
          { id: 'tc-2', description: 'Not present in array', input: '{"nums": [4,5,6,7,0,1,2], "target": 3}', expected: '-1', isHidden: false }
        ],
        editorialSolution: {
          python: `def search(nums, target):
    low = 0
    high = len(nums) - 1
    
    while low <= high:
        mid = (low + high) // 2
        if nums[mid] == target:
            return mid
            
        # Check if left half is normally sorted
        if nums[low] <= nums[mid]:
            if nums[low] <= target < nums[mid]:
                high = mid - 1
            else:
                low = mid + 1
        # Otherwise, right half must be sorted
        else:
            if nums[mid] < target <= nums[high]:
                low = mid + 1
            else:
                high = mid - 1
                
    return -1`,
          explanation: `In any rotated sorted array, splitting at mid guarantees that at least one of the halves (left or right) is strictly sorted.
We check if target falls within the bounds of the sorted half. If so, search that half; otherwise, search the opposite half.
Time Complexity: O(log N), Space: O(1).`
        }
      }
    ]
  },
  {
    id: 'dynamic-programming',
    title: 'Dynamic Programming',
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
      }
    ],
    keyPatterns: [
      '1D state: Fibonacci, Climbing Stairs, House Robber, Coin Change',
      '2D state: Longest Common Subsequence, Edit Distance, 0/1 Knapsack',
      'Interval DP and Bitmask DP'
    ],
    problems: [
      {
        id: 'coin-change',
        title: 'Coin Change: Minimum Coins for Target',
        difficulty: 'Medium',
        category: 'Dynamic Programming',
        description: `You are given an integer array \`coins\` representing coins of different denominations and an integer \`amount\` representing a total amount of money.

Return the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return \`-1\`.

### Example:
\`\`\`
Input: coins = [1, 2, 5], amount = 11
Output: 3
Explanation: 11 = 5 + 5 + 1
\`\`\``,
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
            print(coin_change(d['coins'], d['amount']))
`
        },
        testCases: [
          { id: 'tc-1', description: 'Standard coin change', input: '{"coins": [1, 2, 5], "amount": 11}', expected: '3', isHidden: false },
          { id: 'tc-2', description: 'Impossible amount', input: '{"coins": [2], "amount": 3}', expected: '-1', isHidden: false },
          { id: 'tc-3', description: 'Zero amount base case', input: '{"coins": [1], "amount": 0}', expected: '0', isHidden: true }
        ],
        editorialSolution: {
          python: `def coin_change(coins, amount):
    # Initialize DP array with infinity
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0 # Base case: 0 coins needed for 0 amount
    
    for i in range(1, amount + 1):
        for c in coins:
            if i - c >= 0:
                dp[i] = min(dp[i], dp[i - c] + 1)
                
    return dp[amount] if dp[amount] != float('inf') else -1`,
          explanation: `Let dp[i] be the minimum coins required to make amount i.
For each sub-amount i from 1 to amount, we test taking each coin c: dp[i] = min(dp[i], dp[i - c] + 1).
Time Complexity: O(amount * len(coins)), Space Complexity: O(amount).`
        }
      }
    ]
  }
];

module.exports = {
  DSA_CURRICULUM
};
