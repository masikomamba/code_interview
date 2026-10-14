/**
 * Real-Time Collaborative Code Interview Platform
 * Module: Intervals & Greedy
 * Zero Emojis - Zero Em Dashes
 */

const MODULE = {
  id: 'intervals-greedy',
  title: 'Intervals & Greedy',
  category: 'Intervals & Greedy',
  description: 'Range mergers, boundary intersections, and forward-looking greedy decision algorithms.',
  pythonToolkit: [
    {
      name: 'Interval sorting by starting or ending time',
      syntax: 'intervals.sort(key=lambda x: x[0]) # by start\nintervals.sort(key=lambda x: x[1]) # by end',
      complexity: 'O(N log N) using Timsort',
      description: 'The foundation for almost all interval scheduling and merging algorithms.'
    },
    {
      name: 'Greedy choice property',
      syntax: 'max_reach = max(max_reach, i + nums[i])',
      complexity: 'O(1) state update per step',
      description: 'Always makes the locally optimal choice without needing backtracking.'
    },
    {
      name: 'Interval overlapping test',
      syntax: 'if curr[0] <= last_merged[1]:\n    last_merged[1] = max(last_merged[1], curr[1])',
      complexity: 'O(1) comparison and extension',
      description: 'Checks and merges overlapping interval endpoints in a sorted list.'
    }
  ],
  keyPatterns: [
    'Sort by start time and merge contiguous overlapping intervals',
    'Insert into sorted intervals with partition (before, overlapping merge, after)',
    'Activity selection: sort by end time and remove minimal overlapping intervals',
    'Greedy furthest reach frontier (Jump Game)'
  ],
  problems: [
    {
      id: 'merge-intervals',
      title: 'Merge Intervals: Overlapping Ranges',
      difficulty: 'Medium',
      category: 'Intervals & Greedy',
      description: `Given an array of \`intervals\` where \`intervals[i] = [start_i, end_i]\`, merge all overlapping intervals, and return an array of non-overlapping intervals that cover all the intervals in the input.

### Example 1:
\`\`\`
Input: intervals = [[1,3],[2,6],[8,10],[15,18]]
Output: [[1,6],[8,10],[15,18]]
Explanation: Since intervals [1,3] and [2,6] overlap, merge them into [1,6].
\`\`\`

### Example 2:
\`\`\`
Input: intervals = [[1,4],[4,5]]
Output: [[1,5]]
Explanation: Intervals [1,4] and [4,5] are considered overlapping.
\`\`\`

### Constraints:
* 1 <= intervals.length <= 10^4
* intervals[i].length == 2
* 0 <= start_i <= end_i <= 10^4`,
      optimalComplexity: { time: 'O(N log N)', space: 'O(N)' },
      starterCode: {
        python: `def merge(intervals):
    # Sort by start time, then merge adjacent overlapping intervals
    pass

if __name__ == '__main__':
    import json, sys
    lines = sys.stdin.read().strip().splitlines()
    for l in lines:
        if l.strip():
            d = json.loads(l)
            print(json.dumps(merge(d['intervals'])))
`,
        javascript: `function merge(intervals) {
    // Write your solution here
}

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
rl.on('line', (line) => {
    if (!line.trim()) return;
    const data = JSON.parse(line);
    const sorted = [...data.intervals].sort((a,b)=>a[0]-b[0]);
    const res = [];
    for (const cur of sorted) {
        if (!res.length || res[res.length - 1][1] < cur[0]) res.push(cur);
        else res[res.length - 1][1] = Math.max(res[res.length - 1][1], cur[1]);
    }
    console.log(JSON.stringify(res));
});
`
      },
      testCases: [
        { id: 'tc-1', description: 'Overlapping adjacent intervals', input: '{"intervals": [[1,3],[2,6],[8,10],[15,18]]}', expected: '[[1, 6], [8, 10], [15, 18]]', isHidden: false },
        { id: 'tc-2', description: 'Touching boundaries', input: '{"intervals": [[1,4],[4,5]]}', expected: '[[1, 5]]', isHidden: false },
        { id: 'tc-3', description: 'Single interval', input: '{"intervals": [[1, 4]]}', expected: '[[1, 4]]', isHidden: true }
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
        explanation: `First sort the intervals by starting time. Then iterate through them: if the current interval starts after the last merged interval finishes, append it. Otherwise, they overlap, so expand the end of the last merged interval to max(last.end, current.end). Time: O(N log N), Space: O(N).`
      }
    },
    {
      id: 'insert-interval',
      title: 'Insert Interval: Merge and Place',
      difficulty: 'Medium',
      category: 'Intervals & Greedy',
      description: `You are given an array of non-overlapping intervals \`intervals\` where \`intervals[i] = [start_i, end_i]\` sorted in ascending order by \`start_i\`. You are also given an interval \`newInterval = [start, end]\` that represents the start and end of another interval.

Insert \`newInterval\` into \`intervals\` such that \`intervals\` is still sorted in ascending order by \`start_i\` and \`intervals\` still does not have any overlapping intervals (merge overlapping intervals if necessary).

Return \`intervals\` after the insertion.

### Example 1:
\`\`\`
Input: intervals = [[1,3],[6,9]], newInterval = [2,5]
Output: [[1,5],[6,9]]
\`\`\`

### Example 2:
\`\`\`
Input: intervals = [[1,2],[3,5],[6,7],[8,10],[12,16]], newInterval = [4,8]
Output: [[1,2],[3,10],[12,16]]
Explanation: Because the new interval [4,8] overlaps with [3,5],[6,7],[8,10].
\`\`\`

### Constraints:
* 0 <= intervals.length <= 10^4
* intervals[i].length == 2
* 0 <= start_i <= end_i <= 10^5
* intervals is sorted by start_i in ascending order.
* newInterval.length == 2
* 0 <= start <= end <= 10^5`,
      optimalComplexity: { time: 'O(N)', space: 'O(N)' },
      starterCode: {
        python: `def insert(intervals, newInterval):
    # Linear scan: before, overlap merge, after
    pass

if __name__ == '__main__':
    import json, sys
    lines = sys.stdin.read().strip().splitlines()
    for l in lines:
        if l.strip():
            d = json.loads(l)
            print(json.dumps(insert(d['intervals'], d['newInterval'])))
`,
        javascript: `function insert(intervals, newInterval) {
    // Write your solution here
}

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
rl.on('line', (line) => {
    if (!line.trim()) return;
    const data = JSON.parse(line);
    const res = [];
    let i = 0;
    while (i < data.intervals.length && data.intervals[i][1] < data.newInterval[0]) {
        res.push(data.intervals[i++]);
    }
    while (i < data.intervals.length && data.intervals[i][0] <= data.newInterval[1]) {
        data.newInterval[0] = Math.min(data.newInterval[0], data.intervals[i][0]);
        data.newInterval[1] = Math.max(data.newInterval[1], data.intervals[i][1]);
        i++;
    }
    res.push(data.newInterval);
    while (i < data.intervals.length) res.push(data.intervals[i++]);
    console.log(JSON.stringify(res));
});
`
      },
      testCases: [
        { id: 'tc-1', description: 'Single overlapping interval merge', input: '{"intervals": [[1,3],[6,9]], "newInterval": [2,5]}', expected: '[[1, 5], [6, 9]]', isHidden: false },
        { id: 'tc-2', description: 'Multiple overlapping intervals spanning middle', input: '{"intervals": [[1,2],[3,5],[6,7],[8,10],[12,16]], "newInterval": [4,8]}', expected: '[[1, 2], [3, 10], [12, 16]]', isHidden: false },
        { id: 'tc-3', description: 'Insert into empty intervals list', input: '{"intervals": [], "newInterval": [5, 7]}', expected: '[[5, 7]]', isHidden: true }
      ],
      editorialSolution: {
        python: `def insert(intervals, newInterval):
    res = []
    i = 0
    n = len(intervals)
    
    # 1. Add all intervals ending before newInterval starts
    while i < n and intervals[i][1] < newInterval[0]:
        res.append(intervals[i])
        i += 1
        
    # 2. Merge all overlapping intervals with newInterval
    while i < n and intervals[i][0] <= newInterval[1]:
        newInterval[0] = min(newInterval[0], intervals[i][0])
        newInterval[1] = max(newInterval[1], intervals[i][1])
        i += 1
    res.append(newInterval)
    
    # 3. Add all remaining intervals starting after newInterval ends
    while i < n:
        res.append(intervals[i])
        i += 1
        
    return res`,
        explanation: `Since the input intervals are already sorted, we split into three phases: (1) append all intervals ending before newInterval starts, (2) merge all overlapping intervals into newInterval by updating its endpoints, (3) append all intervals starting after newInterval ends. Runs in a single O(N) pass with O(N) space.`
      }
    },
    {
      id: 'non-overlapping-intervals',
      title: 'Non-overlapping Intervals: Minimum Removals',
      difficulty: 'Medium',
      category: 'Intervals & Greedy',
      description: `Given an array of intervals \`intervals\` where \`intervals[i] = [start_i, end_i]\`, return the minimum number of intervals you need to remove to make the rest of the intervals non-overlapping.

### Example 1:
\`\`\`
Input: intervals = [[1,2],[2,3],[3,4],[1,3]]
Output: 1
Explanation: [1,3] can be removed and the rest of the intervals are non-overlapping.
\`\`\`

### Example 2:
\`\`\`
Input: intervals = [[1,2],[1,2],[1,2]]
Output: 2
Explanation: You need to remove two [1,2] to make the rest of the intervals non-overlapping.
\`\`\`

### Example 3:
\`\`\`
Input: intervals = [[1,2],[2,3]]
Output: 0
Explanation: You don't need to remove any of the intervals since they're already non-overlapping.
\`\`\`

### Constraints:
* 1 <= intervals.length <= 10^5
* intervals[i].length == 2
* -5 * 10^4 <= start_i < end_i <= 5 * 10^4`,
      optimalComplexity: { time: 'O(N log N)', space: 'O(1)' },
      starterCode: {
        python: `def erase_overlap_intervals(intervals) -> int:
    # Sort by end time: activity selection greedy choice
    pass

if __name__ == '__main__':
    import json, sys
    lines = sys.stdin.read().strip().splitlines()
    for l in lines:
        if l.strip():
            d = json.loads(l)
            print(json.dumps(erase_overlap_intervals(d['intervals'])))
`,
        javascript: `function eraseOverlapIntervals(intervals) {
    // Write your solution here
}

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
rl.on('line', (line) => {
    if (!line.trim()) return;
    const data = JSON.parse(line);
    const sorted = [...data.intervals].sort((a,b)=>a[1]-b[1]);
    let count = 0, prevEnd = -Infinity;
    for (const [start, end] of sorted) {
        if (start >= prevEnd) prevEnd = end;
        else count++;
    }
    console.log(JSON.stringify(count));
});
`
      },
      testCases: [
        { id: 'tc-1', description: 'One overlapping interval to remove', input: '{"intervals": [[1,2],[2,3],[3,4],[1,3]]}', expected: '1', isHidden: false },
        { id: 'tc-2', description: 'Identical duplicated intervals', input: '{"intervals": [[1,2],[1,2],[1,2]]}', expected: '2', isHidden: false },
        { id: 'tc-3', description: 'Already non-overlapping', input: '{"intervals": [[1,2],[2,3]]}', expected: '0', isHidden: false }
      ],
      editorialSolution: {
        python: `def erase_overlap_intervals(intervals) -> int:
    intervals.sort(key=lambda x: x[1])
    removals = 0
    prev_end = float('-inf')
    
    for start, end in intervals:
        if start >= prev_end:
            prev_end = end
        else:
            removals += 1
            
    return removals`,
        explanation: `This is equivalent to the classic greedy Activity Selection problem: maximizing the number of compatible non-overlapping intervals minimizes the number of removals. Sorting by end time ensures we always greedily pick the interval that finishes earliest, leaving maximum room for subsequent intervals. Time: O(N log N), Space: O(1).`
      }
    },
    {
      id: 'jump-game',
      title: 'Jump Game: Reach Last Index',
      difficulty: 'Medium',
      category: 'Intervals & Greedy',
      description: `You are given an integer array \`nums\`. You are initially positioned at the array's first index, and each element in the array represents your maximum jump length at that position.

Return \`true\` if you can reach the last index, or \`false\` otherwise.

### Example 1:
\`\`\`
Input: nums = [2,3,1,1,4]
Output: true
Explanation: Jump 1 step from index 0 to 1, then 3 steps to the last index.
\`\`\`

### Example 2:
\`\`\`
Input: nums = [3,2,1,0,4]
Output: false
Explanation: You will always arrive at index 3 no matter what. Its maximum jump length is 0, which makes it impossible to reach the last index.
\`\`\`

### Constraints:
* 1 <= nums.length <= 10^4
* 0 <= nums[i] <= 10^5`,
      optimalComplexity: { time: 'O(N)', space: 'O(1)' },
      starterCode: {
        python: `def can_jump(nums) -> bool:
    # Greedy tracking max reachable index
    pass

if __name__ == '__main__':
    import json, sys
    lines = sys.stdin.read().strip().splitlines()
    for l in lines:
        if l.strip():
            d = json.loads(l)
            print(json.dumps(can_jump(d['nums'])))
`,
        javascript: `function canJump(nums) {
    // Write your solution here
}

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
rl.on('line', (line) => {
    if (!line.trim()) return;
    const data = JSON.parse(line);
    let maxReach = 0;
    for (let i = 0; i < data.nums.length; i++) {
        if (i > maxReach) { console.log("false"); return; }
        maxReach = Math.max(maxReach, i + data.nums[i]);
    }
    console.log("true");
});
`
      },
      testCases: [
        { id: 'tc-1', description: 'Reachable end', input: '{"nums": [2, 3, 1, 1, 4]}', expected: 'true', isHidden: false },
        { id: 'tc-2', description: 'Trapped at zero index', input: '{"nums": [3, 2, 1, 0, 4]}', expected: 'false', isHidden: false },
        { id: 'tc-3', description: 'Single element array (already at end)', input: '{"nums": [0]}', expected: 'true', isHidden: true }
      ],
      editorialSolution: {
        python: `def can_jump(nums) -> bool:
    max_reach = 0
    for i, jump in enumerate(nums):
        if i > max_reach:
            return False
        max_reach = max(max_reach, i + jump)
        if max_reach >= len(nums) - 1:
            return True
    return True`,
        explanation: `We maintain max_reach, the furthest index we can reach so far. As we iterate through each index i, if i > max_reach, we can never reach index i and return False. Otherwise, update max_reach = max(max_reach, i + nums[i]). Time: O(N), Space: O(1).`
      }
    },
    {
      id: 'gas-station',
      title: 'Gas Station: Complete Circular Route',
      difficulty: 'Medium',
      category: 'Intervals & Greedy',
      description: `There are \`n\` gas stations along a circular route, where the amount of gas at the \`i-th\` station is \`gas[i]\`.

You have a car with an unlimited gas tank and it costs \`cost[i]\` of gas to travel from the \`i-th\` station to its next \`(i + 1)-th\` station. You begin the journey with an empty tank at one of the gas stations.

Given two integer arrays \`gas\` and \`cost\`, return the starting gas station's index if you can travel around the circuit once in the clockwise direction, otherwise return \`-1\`. If there exists a solution, it is guaranteed to be unique.

### Example 1:
\`\`\`
Input: gas = [1,2,3,4,5], cost = [3,4,5,1,2]
Output: 3
Explanation:
Start at station 3 (index 3) and fill up with 4 unit of gas. Your tank = 0 + 4 = 4
Travel to station 4. Your tank = 4 - 1 + 5 = 8
Travel to station 0. Your tank = 8 - 2 + 1 = 7
Travel to station 1. Your tank = 7 - 3 + 2 = 6
Travel to station 2. Your tank = 6 - 4 + 3 = 5
Travel to station 3. The cost is 5. Your gas is just enough to travel back to station 3.
Therefore, return 3 as the starting index.
\`\`\`

### Example 2:
\`\`\`
Input: gas = [2,3,4], cost = [3,4,3]
Output: -1
\`\`\`

### Constraints:
* n == gas.length == cost.length
* 1 <= n <= 10^5
* 0 <= gas[i], cost[i] <= 10^4`,
      optimalComplexity: { time: 'O(N)', space: 'O(1)' },
      starterCode: {
        python: `def can_complete_circuit(gas, cost) -> int:
    # If sum(gas) < sum(cost) impossible; otherwise reset start on deficit
    pass

if __name__ == '__main__':
    import json, sys
    lines = sys.stdin.read().strip().splitlines()
    for l in lines:
        if l.strip():
            d = json.loads(l)
            print(json.dumps(can_complete_circuit(d['gas'], d['cost'])))
`,
        javascript: `function canCompleteCircuit(gas, cost) {
    // Write your solution here
}

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
rl.on('line', (line) => {
    if (!line.trim()) return;
    const data = JSON.parse(line);
    let total = 0, curr = 0, start = 0;
    for (let i = 0; i < data.gas.length; i++) {
        total += data.gas[i] - data.cost[i];
        curr += data.gas[i] - data.cost[i];
        if (curr < 0) { start = i + 1; curr = 0; }
    }
    console.log(JSON.stringify(total >= 0 ? start : -1));
});
`
      },
      testCases: [
        { id: 'tc-1', description: 'Successful circular route starting at index 3', input: '{"gas": [1, 2, 3, 4, 5], "cost": [3, 4, 5, 1, 2]}', expected: '3', isHidden: false },
        { id: 'tc-2', description: 'Net negative gas deficit across all stations', input: '{"gas": [2, 3, 4], "cost": [3, 4, 3]}', expected: '-1', isHidden: false },
        { id: 'tc-3', description: 'Single station with equal gas and cost', input: '{"gas": [2], "cost": [2]}', expected: '0', isHidden: true }
      ],
      editorialSolution: {
        python: `def can_complete_circuit(gas, cost) -> int:
    if sum(gas) < sum(cost):
        return -1
        
    total_tank = 0
    curr_tank = 0
    start_station = 0
    
    for i in range(len(gas)):
        diff = gas[i] - cost[i]
        total_tank += diff
        curr_tank += diff
        
        # If we cannot reach station i + 1 from current start
        if curr_tank < 0:
            start_station = i + 1
            curr_tank = 0
            
    return start_station`,
        explanation: `If total gas < total cost, a complete circuit is physically impossible. Otherwise, a valid starting station is guaranteed to exist. If the tank drops below 0 when traveling from start_station to i, none of the stations between start_station and i could possibly be a valid start. We greedily reset start_station to i + 1. Time: O(N), Space: O(1).`
      }
    },
    {
      id: 'maximum-subarray',
      title: 'Maximum Subarray (Kadane Algorithm)',
      difficulty: 'Medium',
      category: 'Intervals & Greedy',
      neetcodeCategory: 'Greedy',
      neetcodeOrder: 63,
      isNeetCode75: true,
      description: `Given an integer array \`nums\`, find the subarray with the largest sum, and return its sum.

### Example 1:
\`\`\`
Input: nums = [-2,1,-3,4,-1,2,1,-5,4]
Output: 6
Explanation: The subarray [4,-1,2,1] has the largest sum 6.
\`\`\`

### Example 2:
\`\`\`
Input: nums = [1]
Output: 1
\`\`\`

### Example 3:
\`\`\`
Input: nums = [5,4,-1,7,8]
Output: 23
\`\`\`

### Constraints:
* 1 <= nums.length <= 10^5
* -10^4 <= nums[i] <= 10^4`,
      optimalComplexity: { time: 'O(N)', space: 'O(1)' },
      starterCode: {
        python: `def max_sub_array(nums) -> int:
    # Use Kadane's algorithm tracking max sum ending at current index
    pass

if __name__ == '__main__':
    import json, sys
    lines = sys.stdin.read().strip().splitlines()
    for l in lines:
        if l.strip():
            d = json.loads(l)
            print(json.dumps(max_sub_array(d['nums'])))
`,
        javascript: `function maxSubArray(nums) {
    // Write your solution here
}

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
rl.on('line', (line) => {
    if (!line.trim()) return;
    const data = JSON.parse(line);
    console.log(JSON.stringify(maxSubArray(data.nums)));
});
`
      },
      testCases: [
        { id: 'tc-1', description: 'Standard mixed signs: [-2,1,-3,4,-1,2,1,-5,4]', input: '{"nums": [-2,1,-3,4,-1,2,1,-5,4]}', expected: '6', isHidden: false },
        { id: 'tc-2', description: 'All positive numbers: [5,4,-1,7,8]', input: '{"nums": [5,4,-1,7,8]}', expected: '23', isHidden: false },
        { id: 'tc-3', description: 'All negative numbers: [-3, -2, -5]', input: '{"nums": [-3, -2, -5]}', expected: '-2', isHidden: true }
      ],
      editorialSolution: {
        python: `def max_sub_array(nums) -> int:
    max_sum = nums[0]
    cur_sum = 0
    for n in nums:
        cur_sum = max(cur_sum + n, n)
        max_sum = max(max_sum, cur_sum)
    return max_sum`,
        explanation: `Kadane algorithm greedily decides at each index whether to extend the previous subarray sum (cur_sum + n) or restart a new subarray from the current element (n). If cur_sum becomes negative, restarting is always superior. Runs in O(N) time with O(1) space.`
      }
    },
    {
      id: 'meeting-rooms',
      title: 'Meeting Rooms',
      difficulty: 'Easy',
      category: 'Intervals & Greedy',
      neetcodeCategory: 'Intervals',
      neetcodeOrder: 68,
      isNeetCode75: true,
      description: `Given an array of meeting time intervals where \`intervals[i] = [start_i, end_i]\`, determine if a person could attend all meetings.

### Example 1:
\`\`\`
Input: intervals = [[0,30],[5,10],[15,20]]
Output: false
Explanation: [0, 30] conflicts with [5, 10] and [15, 20].
\`\`\`

### Example 2:
\`\`\`
Input: intervals = [[7,10],[2,4]]
Output: true
\`\`\`

### Constraints:
* 0 <= intervals.length <= 10^4
* intervals[i].length == 2
* 0 <= start_i < end_i <= 10^6`,
      optimalComplexity: { time: 'O(N log N)', space: 'O(1) auxiliary' },
      starterCode: {
        python: `def can_attend_meetings(intervals) -> bool:
    # Sort by start times and check for overlapping adjacent intervals
    pass

if __name__ == '__main__':
    import json, sys
    lines = sys.stdin.read().strip().splitlines()
    for l in lines:
        if l.strip():
            d = json.loads(l)
            print(json.dumps(can_attend_meetings(d['intervals'])))
`,
        javascript: `function canAttendMeetings(intervals) {
    // Write your solution here
}

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
rl.on('line', (line) => {
    if (!line.trim()) return;
    const data = JSON.parse(line);
    console.log(JSON.stringify(canAttendMeetings(data.intervals)));
});
`
      },
      testCases: [
        { id: 'tc-1', description: 'Overlapping intervals: [[0,30],[5,10],[15,20]]', input: '{"intervals": [[0,30],[5,10],[15,20]]}', expected: 'false', isHidden: false },
        { id: 'tc-2', description: 'Non-overlapping sorted pairs: [[7,10],[2,4]]', input: '{"intervals": [[7,10],[2,4]]}', expected: 'true', isHidden: false }
      ],
      editorialSolution: {
        python: `def can_attend_meetings(intervals) -> bool:
    intervals.sort(key=lambda x: x[0])
    for i in range(1, len(intervals)):
        if intervals[i][0] < intervals[i - 1][1]:
            return False
    return True`,
        explanation: `We sort intervals chronologically by their start times. If any meeting starts before the previous meeting finishes (intervals[i][0] < intervals[i-1][1]), attendance is impossible due to overlap. Runs in O(N log N) time.`
      }
    },
    {
      id: 'meeting-rooms-ii',
      title: 'Meeting Rooms II (Minimum Rooms Required)',
      difficulty: 'Medium',
      category: 'Intervals & Greedy',
      neetcodeCategory: 'Intervals',
      neetcodeOrder: 69,
      isNeetCode75: true,
      description: `Given an array of meeting time intervals where \`intervals[i] = [start_i, end_i]\`, return the minimum number of conference rooms required.

### Example 1:
\`\`\`
Input: intervals = [[0,30],[5,10],[15,20]]
Output: 2
Explanation:
Room 1: [0, 30]
Room 2: [5, 10], [15, 20]
\`\`\`

### Example 2:
\`\`\`
Input: intervals = [[7,10],[2,4]]
Output: 1
\`\`\`

### Constraints:
* 1 <= intervals.length <= 10^4
* 0 <= start_i < end_i <= 10^6`,
      optimalComplexity: { time: 'O(N log N)', space: 'O(N)' },
      starterCode: {
        python: `def min_meeting_rooms(intervals) -> int:
    # Separate and sort start and end times, or use min-heap of active end times
    pass

if __name__ == '__main__':
    import json, sys
    lines = sys.stdin.read().strip().splitlines()
    for l in lines:
        if l.strip():
            d = json.loads(l)
            print(json.dumps(min_meeting_rooms(d['intervals'])))
`,
        javascript: `function minMeetingRooms(intervals) {
    // Write your solution here
}

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
rl.on('line', (line) => {
    if (!line.trim()) return;
    const data = JSON.parse(line);
    console.log(JSON.stringify(minMeetingRooms(data.intervals)));
});
`
      },
      testCases: [
        { id: 'tc-1', description: 'Requires 2 rooms: [[0,30],[5,10],[15,20]]', input: '{"intervals": [[0,30],[5,10],[15,20]]}', expected: '2', isHidden: false },
        { id: 'tc-2', description: 'Requires 1 room: [[7,10],[2,4]]', input: '{"intervals": [[7,10],[2,4]]}', expected: '1', isHidden: false }
      ],
      editorialSolution: {
        python: `def min_meeting_rooms(intervals) -> int:
    start_times = sorted([i[0] for i in intervals])
    end_times = sorted([i[1] for i in intervals])

    res = 0
    count = 0
    s_ptr, e_ptr = 0, 0

    while s_ptr < len(intervals):
        if start_times[s_ptr] < end_times[e_ptr]:
            count += 1 # Meeting begins before earliest finishes: need new room
            s_ptr += 1
        else:
            count -= 1 # Meeting finished: room freed
            e_ptr += 1
        res = max(res, count)

    return res`,
        explanation: `By separating all start times and end times into two independently sorted arrays and running two pointers, we track the concurrent number of active meetings over time. Whenever a meeting starts before the earliest room is freed, count increments. The maximum count at any moment is the minimum rooms required. Runs in O(N log N) time and O(N) space.`
      }
    }
  ]
};

module.exports = MODULE;
