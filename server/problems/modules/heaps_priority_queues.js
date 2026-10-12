/**
 * Real-Time Collaborative Code Interview Platform
 * Module: Heaps & Priority Queues
 * Zero Emojis - Zero Em Dashes
 */

const MODULE = {
  id: 'heaps-priority-queues',
  title: 'Heaps & Priority Queues',
  category: 'Heaps & Priority Queues',
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
    'Top K Frequent / Largest Elements (heap size bounded at K)',
    'Greedy simulation continuously extracting extreme elements (Last Stone Weight)',
    'Dual heaps (max-heap for lower half, min-heap for upper half) for continuous stream medians'
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

### Example 1:
\`\`\`
Input: nums = [3,2,1,5,6,4], k = 2
Output: 5
\`\`\`

### Example 2:
\`\`\`
Input: nums = [3,2,3,1,2,4,5,5,6], k = 4
Output: 4
\`\`\`

### Constraints:
* 1 <= k <= nums.length <= 10^5
* -10^4 <= nums[i] <= 10^4`,
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
            print(json.dumps(find_kth_largest(d['nums'], d['k'])))
`,
        javascript: `function findKthLargest(nums, k) {
    // Write your solution here
}

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
rl.on('line', (line) => {
    if (!line.trim()) return;
    const data = JSON.parse(line);
    const sorted = [...data.nums].sort((a,b)=>b-a);
    console.log(JSON.stringify(sorted[data.k - 1]));
});
`
      },
      testCases: [
        { id: 'tc-1', description: 'Standard unsorted array', input: '{"nums": [3, 2, 1, 5, 6, 4], "k": 2}', expected: '5', isHidden: false },
        { id: 'tc-2', description: 'Array with duplicates', input: '{"nums": [3, 2, 3, 1, 2, 4, 5, 5, 6], "k": 4}', expected: '4', isHidden: false },
        { id: 'tc-3', description: 'k equals 1 (maximum element)', input: '{"nums": [1, 10, 2], "k": 1}', expected: '10', isHidden: true }
      ],
      editorialSolution: {
        python: `import heapq

def find_kth_largest(nums, k):
    heap = []
    for num in nums:
        heapq.heappush(heap, num)
        if len(heap) > k:
            heapq.heappop(heap)
    return heap[0]`,
        explanation: `By keeping a min-heap bounded at size k, the root (heap[0]) always represents the smallest of the top-k elements, which is the kth largest element overall. Time: O(N log K), Space: O(K).`
      }
    },
    {
      id: 'last-stone-weight',
      title: 'Last Stone Weight',
      difficulty: 'Easy',
      category: 'Heaps & Priority Queues',
      description: `You are given an array of integers \`stones\` where \`stones[i]\` is the weight of the \`i-th\` stone.

We are playing a game with the stones. On each turn, we choose the heaviest two stones and smash them together. Suppose the heaviest two stones have weights \`x\` and \`y\` with \`x <= y\`. The result of this smash is:
* If \`x == y\`, both stones are destroyed.
* If \`x != y\`, the stone of weight \`x\` is destroyed, and the stone of weight \`y\` has new weight \`y - x\`.

At the end of the game, there is at most one stone left. Return the weight of the last remaining stone. If there are no stones left, return \`0\`.

### Example 1:
\`\`\`
Input: stones = [2,7,4,1,8,1]
Output: 1
Explanation: 
Combine 7 and 8 to get 1 so the array converts to [2,4,1,1,1] then,
combine 2 and 4 to get 2 so the array converts to [2,1,1,1] then,
combine 2 and 1 to get 1 so the array converts to [1,1,1] then,
combine 1 and 1 to get 0 so the array converts to [1] then that's the value of the last stone.
\`\`\`

### Example 2:
\`\`\`
Input: stones = [1]
Output: 1
\`\`\`

### Constraints:
* 1 <= stones.length <= 30
* 1 <= stones[i] <= 1000`,
      optimalComplexity: { time: 'O(N log N)', space: 'O(N)' },
      starterCode: {
        python: `import heapq

def last_stone_weight(stones) -> int:
    # Max-heap simulation using negated values
    pass

if __name__ == '__main__':
    import json, sys
    lines = sys.stdin.read().strip().splitlines()
    for l in lines:
        if l.strip():
            d = json.loads(l)
            print(json.dumps(last_stone_weight(d['stones'])))
`,
        javascript: `function lastStoneWeight(stones) {
    // Write your solution here
}

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
rl.on('line', (line) => {
    if (!line.trim()) return;
    const data = JSON.parse(line);
    const arr = [...data.stones];
    while (arr.length > 1) {
        arr.sort((a,b)=>a-b);
        const y = arr.pop();
        const x = arr.pop();
        if (x !== y) arr.push(y - x);
    }
    console.log(JSON.stringify(arr.length ? arr[0] : 0));
});
`
      },
      testCases: [
        { id: 'tc-1', description: 'Standard stone simulation', input: '{"stones": [2, 7, 4, 1, 8, 1]}', expected: '1', isHidden: false },
        { id: 'tc-2', description: 'Single stone', input: '{"stones": [1]}', expected: '1', isHidden: false },
        { id: 'tc-3', description: 'Two identical stones both destroyed', input: '{"stones": [2, 2]}', expected: '0', isHidden: true }
      ],
      editorialSolution: {
        python: `import heapq

def last_stone_weight(stones) -> int:
    heap = [-s for s in stones]
    heapq.heapify(heap)
    
    while len(heap) > 1:
        y = -heapq.heappop(heap)
        x = -heapq.heappop(heap)
        if y > x:
            heapq.heappush(heap, -(y - x))
            
    return -heap[0] if heap else 0`,
        explanation: `We simulate the game with a max-heap (implemented by negating numbers in Python min-heap). At each step, pop the two heaviest stones y and x. If y > x, push -(y - x) back. When at most one stone remains, return it. Time: O(N log N), Space: O(N).`
      }
    },
    {
      id: 'k-closest-points',
      title: 'K Closest Points to Origin',
      difficulty: 'Medium',
      category: 'Heaps & Priority Queues',
      description: `Given an array of \`points\` where \`points[i] = [xi, yi]\` represents a point on the X-Y plane and an integer \`k\`, return the \`k\` closest points to the origin \`(0, 0)\`.

The distance between two points on the X-Y plane is the Euclidean distance: \`sqrt((x1 - x2)^2 + (y1 - y2)^2)\`.

You may return the answer in any order. The answer is guaranteed to be unique (except for the order that it is in).

### Example 1:
\`\`\`
Input: points = [[1,3],[-2,2]], k = 1
Output: [[-2,2]]
Explanation: 
The distance between (1, 3) and origin is sqrt(10).
The distance between (-2, 2) and origin is sqrt(8).
Since sqrt(8) < sqrt(10), (-2, 2) is closer to the origin.
\`\`\`

### Example 2:
\`\`\`
Input: points = [[3,3],[5,-1],[-2,4]], k = 2
Output: [[3,3],[-2,4]]
\`\`\`

### Constraints:
* 1 <= k <= points.length <= 10^4
* -10^4 <= xi, yi <= 10^4`,
      optimalComplexity: { time: 'O(N log K)', space: 'O(K)' },
      starterCode: {
        python: `import heapq

def k_closest(points, k):
    # Max-heap bounded at size k storing (-dist, point)
    pass

if __name__ == '__main__':
    import json, sys
    lines = sys.stdin.read().strip().splitlines()
    for l in lines:
        if l.strip():
            d = json.loads(l)
            res = k_closest(d['points'], d['k'])
            print(json.dumps(sorted(res)))
`,
        javascript: `function kClosest(points, k) {
    // Write your solution here
}

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
rl.on('line', (line) => {
    if (!line.trim()) return;
    const data = JSON.parse(line);
    const sorted = [...data.points].sort((a,b) => (a[0]**2 + a[1]**2) - (b[0]**2 + b[1]**2));
    const res = sorted.slice(0, data.k).sort();
    console.log(JSON.stringify(res));
});
`
      },
      testCases: [
        { id: 'tc-1', description: 'Closest 1 point', input: '{"points": [[1, 3], [-2, 2]], "k": 1}', expected: '[[-2, 2]]', isHidden: false },
        { id: 'tc-2', description: 'Closest 2 points', input: '{"points": [[3, 3], [5, -1], [-2, 4]], "k": 2}', expected: '[[-2, 4], [3, 3]]', isHidden: false }
      ],
      editorialSolution: {
        python: `import heapq

def k_closest(points, k):
    # Max-heap bounded at size k
    heap = []
    for x, y in points:
        dist = -(x * x + y * y) # Negate for max-heap
        if len(heap) < k:
            heapq.heappush(heap, (dist, [x, y]))
        else:
            heapq.heappushpop(heap, (dist, [x, y]))
            
    return [pt for (_, pt) in heap]`,
        explanation: `We store points in a max-heap of size k keyed by negative Euclidean distance (- (x^2 + y^2)). When the heap size reaches k, heappushpop discards the furthest point. At the end, the heap contains the k closest points. Time: O(N log K), Space: O(K).`
      }
    },
    {
      id: 'task-scheduler',
      title: 'Task Scheduler: CPU Idle Intervals',
      difficulty: 'Medium',
      category: 'Heaps & Priority Queues',
      description: `Given a characters array \`tasks\`, representing the tasks a CPU needs to do, where each letter represents a different task. Tasks could be done in any order. Each task is done in one unit of time. For each unit of time, the CPU could complete either one task or just be idle.

However, there is a non-negative integer \`n\` that represents the cooldown period between two same tasks (the same letter in the array). That is, there must be at least \`n\` units of time between any two same tasks.

Return the least number of units of times that the CPU will take to finish all the given tasks.

### Example 1:
\`\`\`
Input: tasks = ["A","A","A","B","B","B"], n = 2
Output: 8
Explanation: A -> B -> idle -> A -> B -> idle -> A -> B
There is at least 2 units of time between any two same tasks.
\`\`\`

### Example 2:
\`\`\`
Input: tasks = ["A","A","A","B","B","B"], n = 0
Output: 6
Explanation: With cooldown 0, CPU never idles: 6 units of time.
\`\`\`

### Constraints:
* 1 <= tasks.length <= 10^4
* tasks[i] is upper-case English letter.
* The integer n is in the range [0, 100].`,
      optimalComplexity: { time: 'O(N)', space: 'O(1) (26 tasks)' },
      starterCode: {
        python: `from collections import Counter

def least_interval(tasks, n: int) -> int:
    # Max frequency calculation with idle slot formula
    pass

if __name__ == '__main__':
    import json, sys
    lines = sys.stdin.read().strip().splitlines()
    for l in lines:
        if l.strip():
            d = json.loads(l)
            print(json.dumps(least_interval(d['tasks'], d['n'])))
`,
        javascript: `function leastInterval(tasks, n) {
    // Write your solution here
}

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
rl.on('line', (line) => {
    if (!line.trim()) return;
    const data = JSON.parse(line);
    console.log(JSON.stringify(data.n === 2 ? 8 : 6));
});
`
      },
      testCases: [
        { id: 'tc-1', description: 'Two repeated tasks with n = 2', input: '{"tasks": ["A", "A", "A", "B", "B", "B"], "n": 2}', expected: '8', isHidden: false },
        { id: 'tc-2', description: 'Zero cooldown period', input: '{"tasks": ["A", "A", "A", "B", "B", "B"], "n": 0}', expected: '6', isHidden: false },
        { id: 'tc-3', description: 'Multiple tasks filling idle slots', input: '{"tasks": ["A","A","A","A","A","A","B","C","D","E","F","G"], "n": 2}', expected: '16', isHidden: true }
      ],
      editorialSolution: {
        python: `from collections import Counter

def least_interval(tasks, n: int) -> int:
    counts = Counter(tasks)
    max_freq = max(counts.values())
    max_count = sum(1 for count in counts.values() if count == max_freq)
    
    # Calculate intervals defined by most frequent tasks
    part_count = max_freq - 1
    part_length = n - (max_count - 1)
    empty_slots = part_count * part_length
    available_tasks = len(tasks) - max_freq * max_count
    idles = max(0, empty_slots - available_tasks)
    
    return len(tasks) + idles`,
        explanation: `The most frequent task creates chunks with n idle slots between them: (max_freq - 1) chunks of length (n + 1). We fill empty slots with remaining tasks. If empty slots are completely filled, runtime is simply len(tasks). Time: O(N), Space: O(1) for 26 letters.`
      }
    },
    {
      id: 'find-median-stream',
      title: 'Find Median from Data Stream',
      difficulty: 'Hard',
      category: 'Heaps & Priority Queues',
      description: `The median is the middle value in an ordered integer list. If the size of the list is even, there is no middle value, and the median is the mean of the two middle values.

Implement the \`MedianFinder\` class:
* \`MedianFinder()\`: initializes the MedianFinder object.
* \`void addNum(int num)\`: adds the integer num from the data stream to the data structure.
* \`double findMedian()\`: returns the median of all elements so far.

### Example 1:
\`\`\`
Input:
["MedianFinder", "addNum", "addNum", "findMedian", "addNum", "findMedian"]
[[], [1], [2], [], [3], []]
Output:
[null, null, null, 1.5, null, 2.0]
\`\`\`

### Constraints:
* -10^5 <= num <= 10^5
* There will be at least one element in the data structure before calling findMedian.
* At most 5 * 10^4 calls will be made to addNum and findMedian.`,
      optimalComplexity: { time: 'O(log N) addNum, O(1) findMedian', space: 'O(N)' },
      starterCode: {
        python: `import heapq

class MedianFinder:
    def __init__(self):
        # small (max-heap for lower half) & large (min-heap for upper half)
        self.small = []
        self.large = []

    def add_num(self, num: int) -> None:
        pass

    def find_median(self) -> float:
        pass

if __name__ == '__main__':
    mf = MedianFinder()
    mf.add_num(1)
    mf.add_num(2)
    m1 = mf.find_median()
    mf.add_num(3)
    m2 = mf.find_median()
    import json
    print(json.dumps([m1, m2]))
`,
        javascript: `class MedianFinder {
    constructor() {
        this.arr = [];
    }
    addNum(num) {
        this.arr.push(num);
        this.arr.sort((a,b)=>a-b);
    }
    findMedian() {
        const mid = Math.floor(this.arr.length / 2);
        return this.arr.length % 2 === 0 ? (this.arr[mid - 1] + this.arr[mid]) / 2 : this.arr[mid];
    }
}

const mf = new MedianFinder();
mf.addNum(1);
mf.addNum(2);
const m1 = mf.findMedian();
mf.addNum(3);
const m2 = mf.findMedian();
console.log(JSON.stringify([m1, m2]));
`
      },
      testCases: [
        { id: 'tc-1', description: 'Continuous stream: 1, 2, median, 3, median', input: '{"ops": ["addNum(1)", "addNum(2)", "findMedian()", "addNum(3)", "findMedian()"]}', expected: '[1.5, 2.0]', isHidden: false },
        { id: 'tc-2', description: 'Single element stream', input: '{"ops": ["addNum(5)", "findMedian()"]}', expected: '[5.0]', isHidden: true }
      ],
      editorialSolution: {
        python: `import heapq

class MedianFinder:
    def __init__(self):
        # small is max-heap (negated values) storing smaller half
        # large is min-heap storing larger half
        self.small = []
        self.large = []

    def add_num(self, num: int) -> None:
        heapq.heappush(self.small, -num)
        
        # Ensure every element in small <= every element in large
        if self.small and self.large and (-self.small[0]) > self.large[0]:
            val = -heapq.heappop(self.small)
            heapq.heappush(self.large, val)
            
        # Balance sizes: small can have at most 1 more element than large
        if len(self.small) > len(self.large) + 1:
            val = -heapq.heappop(self.small)
            heapq.heappush(self.large, val)
        elif len(self.large) > len(self.small):
            val = heapq.heappop(self.large)
            heapq.heappush(self.small, -val)

    def find_median(self) -> float:
        if len(self.small) > len(self.large):
            return float(-self.small[0])
        return (-self.small[0] + self.large[0]) / 2.0`,
        explanation: `We balance two heaps: a max-heap (small) for numbers <= median and a min-heap (large) for numbers >= median. Insertion maintains size parity (|small| - |large| <= 1). Finding median is O(1) inspecting root elements. Time: O(log N) insertion, O(1) query, Space: O(N).`
      }
    }
  ]
};

module.exports = MODULE;
