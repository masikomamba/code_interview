/**
 * Real-Time Collaborative Code Interview Platform
 * Module: Stacks & Queues
 * Zero Emojis - Zero Em Dashes
 */

const MODULE = {
  id: 'stacks-queues',
  title: 'Stacks & Queues',
  category: 'Stacks & Queues',
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
    },
    {
      name: 'Monotonic stack pattern',
      syntax: 'stack = [] # stores indices\nfor i, val in enumerate(nums):\n    while stack and nums[stack[-1]] < val:\n        prev_idx = stack.pop()',
      complexity: 'O(N) total (each element pushed and popped once)',
      description: 'Finds next greater or next smaller elements efficiently.'
    }
  ],
  keyPatterns: [
    'Matching brackets and syntax verification',
    'Monotonic stack for next greater / smaller element',
    'Dual stack maintaining parallel minimum values'
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

### Example 1:
\`\`\`
Input: s = "()[]{}"
Output: true
\`\`\`

### Example 2:
\`\`\`
Input: s = "(]"
Output: false
\`\`\`

### Constraints:
* 1 <= s.length <= 10^4
* s consists of parentheses only '()[]{}'.`,
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
            print(json.dumps(is_valid(d['s'])))
`,
        javascript: `function isValid(s) {
    // Write your solution here
}

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
rl.on('line', (line) => {
    if (!line.trim()) return;
    const data = JSON.parse(line);
    console.log(JSON.stringify(isValid(data.s)));
});
`
      },
      testCases: [
        { id: 'tc-1', description: 'Simple valid parens', input: '{"s": "()[]{}"}', expected: 'true', isHidden: false },
        { id: 'tc-2', description: 'Mismatched brackets', input: '{"s": "(]"}', expected: 'false', isHidden: false },
        { id: 'tc-3', description: 'Unclosed open bracket', input: '{"s": "["}', expected: 'false', isHidden: true },
        { id: 'tc-4', description: 'Nested matching brackets', input: '{"s": "{[()()]} "}', expected: 'false', isHidden: true }
      ],
      editorialSolution: {
        python: `def is_valid(s: str) -> bool:
    pairs = {')': '(', '}': '{', ']': '['}
    stack = []
    
    for ch in s:
        if ch in pairs:
            if not stack or stack[-1] != pairs[ch]:
                return False
            stack.pop()
        else:
            stack.append(ch)
            
    return len(stack) == 0`,
        explanation: `We scan characters from left to right. Opening brackets are pushed onto the stack. When encountering a closing bracket, the top element of the stack must be its corresponding opener. If the stack is empty at the end, all brackets were cleanly paired. Time: O(N), Space: O(N).`
      }
    },
    {
      id: 'min-stack',
      title: 'Min Stack: Constant Time Minimum',
      difficulty: 'Medium',
      category: 'Stacks & Queues',
      description: `Design a stack that supports push, pop, top, and retrieving the minimum element in constant time.

Implement the \`MinStack\` class:
* \`MinStack()\`: initializes the stack object.
* \`void push(int val)\`: pushes the element val onto the stack.
* \`void pop()\`: removes the element on the top of the stack.
* \`int top()\`: gets the top element of the stack.
* \`int getMin()\`: retrieves the minimum element in the stack.

You must implement a solution with \`O(1)\` time complexity for each function.

### Example 1:
\`\`\`
Input:
["MinStack","push","push","push","getMin","pop","top","getMin"]
[[],[-2],[0],[-3],[],[],[],[]]

Output:
[null,null,null,null,-3,null,0,-2]
\`\`\`

### Constraints:
* -2^31 <= val <= 2^31 - 1
* Methods pop, top and getMin operations will always be called on non-empty stacks.
* At most 3 * 10^4 calls will be made to push, pop, top, and getMin.`,
      optimalComplexity: { time: 'O(1) all ops', space: 'O(N)' },
      starterCode: {
        python: `class MinStack:
    def __init__(self):
        # Maintain main stack and min_tracker stack
        self.stack = []
        self.min_stack = []

    def push(self, val: int) -> None:
        pass

    def pop(self) -> None:
        pass

    def top(self) -> int:
        pass

    def getMin(self) -> int:
        pass

if __name__ == '__main__':
    ms = MinStack()
    ms.push(-2)
    ms.push(0)
    ms.push(-3)
    r1 = ms.getMin()
    ms.pop()
    r2 = ms.top()
    r3 = ms.getMin()
    import json
    print(json.dumps([r1, r2, r3]))
`,
        javascript: `class MinStack {
    constructor() {
        this.stack = [];
        this.minStack = [];
    }
    push(val) {}
    pop() {}
    top() {}
    getMin() {}
}

const ms = new MinStack();
ms.push(-2);
ms.push(0);
ms.push(-3);
const r1 = ms.getMin();
ms.pop();
const r2 = ms.top();
const r3 = ms.getMin();
console.log(JSON.stringify([r1, r2, r3]));
`
      },
      testCases: [
        { id: 'tc-1', description: 'Standard MinStack operations', input: '{"ops": ["push(-2)", "push(0)", "push(-3)", "getMin()", "pop()", "top()", "getMin()"]}', expected: '[-3, 0, -2]', isHidden: false },
        { id: 'tc-2', description: 'Duplicate minimums pushed', input: '{"ops": ["push(1)", "push(1)", "getMin()", "pop()", "getMin()"]}', expected: '[1, 1]', isHidden: true }
      ],
      editorialSolution: {
        python: `class MinStack:
    def __init__(self):
        self.stack = []
        self.min_stack = []

    def push(self, val: int) -> None:
        self.stack.append(val)
        if not self.min_stack or val <= self.min_stack[-1]:
            self.min_stack.append(val)

    def pop(self) -> None:
        val = self.stack.pop()
        if val == self.min_stack[-1]:
            self.min_stack.pop()

    def top(self) -> int:
        return self.stack[-1]

    def getMin(self) -> int:
        return self.min_stack[-1]`,
        explanation: `By maintaining a secondary stack (min_stack) where we only push elements that are <= the current minimum, the top of min_stack always holds the current minimum in O(1) time. When popping, if the removed value equals min_stack[-1], we pop min_stack as well.`
      }
    },
    {
      id: 'eval-rpn',
      title: 'Evaluate Reverse Polish Notation',
      difficulty: 'Medium',
      category: 'Stacks & Queues',
      description: `You are given an array of strings \`tokens\` that represents an arithmetic expression in a Reverse Polish Notation.

Evaluate the expression. Return an integer that represents the value of the expression.

Valid operators are '+', '-', '*', and '/'. Each operand may be an integer or another expression. Division between two integers should truncate toward zero.

### Example 1:
\`\`\`
Input: tokens = ["2","1","+","3","*"]
Output: 9
Explanation: ((2 + 1) * 3) = 9
\`\`\`

### Example 2:
\`\`\`
Input: tokens = ["4","13","5","/","+"]
Output: 6
Explanation: (4 + (13 / 5)) = 6
\`\`\`

### Constraints:
* 1 <= tokens.length <= 10^4
* tokens[i] is either an operator: "+", "-", "*", or "/", or an integer in the range [-200, 200].`,
      optimalComplexity: { time: 'O(N)', space: 'O(N)' },
      starterCode: {
        python: `def eval_rpn(tokens):
    # Use stack: push numbers, pop two on operator
    pass

if __name__ == '__main__':
    import json, sys
    lines = sys.stdin.read().strip().splitlines()
    for l in lines:
        if l.strip():
            d = json.loads(l)
            print(json.dumps(eval_rpn(d['tokens'])))
`,
        javascript: `function evalRPN(tokens) {
    // Write your solution here
}

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
rl.on('line', (line) => {
    if (!line.trim()) return;
    const data = JSON.parse(line);
    console.log(JSON.stringify(evalRPN(data.tokens)));
});
`
      },
      testCases: [
        { id: 'tc-1', description: 'Simple addition and multiplication', input: '{"tokens": ["2", "1", "+", "3", "*"]}', expected: '9', isHidden: false },
        { id: 'tc-2', description: 'Truncation division with addition', input: '{"tokens": ["4", "13", "5", "/", "+"]}', expected: '6', isHidden: false },
        { id: 'tc-3', description: 'Negative numbers and division truncating toward zero', input: '{"tokens": ["10", "6", "9", "3", "+", "-11", "*", "/", "*", "17", "+", "5", "+"]}', expected: '22', isHidden: true }
      ],
      editorialSolution: {
        python: `def eval_rpn(tokens):
    stack = []
    
    for token in tokens:
        if token in "+-*/":
            b = stack.pop()
            a = stack.pop()
            if token == '+':
                stack.append(a + b)
            elif token == '-':
                stack.append(a - b)
            elif token == '*':
                stack.append(a * b)
            else:
                # Truncate toward zero: int(a / b)
                stack.append(int(a / b))
        else:
            stack.append(int(token))
            
    return stack[0]`,
        explanation: `Reverse Polish Notation is evaluated using a stack. Operands are pushed onto the stack. When an operator is met, pop the last two operands (b = stack.pop(), a = stack.pop()), perform the operation a OP b, and push the result back. In Python, int(a / b) correctly truncates division towards zero. Time: O(N), Space: O(N).`
      }
    },
    {
      id: 'daily-temperatures',
      title: 'Daily Temperatures: Next Warmer Day',
      difficulty: 'Medium',
      category: 'Stacks & Queues',
      description: `Given an array of integers \`temperatures\` represents the daily temperatures, return an array \`answer\` such that \`answer[i]\` is the number of days you have to wait after the \`i-th\` day to get a warmer temperature. If there is no future day for which this is possible, keep \`answer[i] == 0\` instead.

### Example 1:
\`\`\`
Input: temperatures = [73,74,75,71,69,72,76,73]
Output: [1,1,4,2,1,1,0,0]
\`\`\`

### Example 2:
\`\`\`
Input: temperatures = [30,40,50,60]
Output: [1,1,1,0]
\`\`\`

### Constraints:
* 1 <= temperatures.length <= 10^5
* 30 <= temperatures[i] <= 100`,
      optimalComplexity: { time: 'O(N)', space: 'O(N)' },
      starterCode: {
        python: `def daily_temperatures(temperatures):
    # Monotonic decreasing stack storing indices
    pass

if __name__ == '__main__':
    import json, sys
    lines = sys.stdin.read().strip().splitlines()
    for l in lines:
        if l.strip():
            d = json.loads(l)
            print(json.dumps(daily_temperatures(d['temperatures'])))
`,
        javascript: `function dailyTemperatures(temperatures) {
    // Write your solution here
}

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
rl.on('line', (line) => {
    if (!line.trim()) return;
    const data = JSON.parse(line);
    console.log(JSON.stringify(dailyTemperatures(data.temperatures)));
});
`
      },
      testCases: [
        { id: 'tc-1', description: 'Standard fluctuating weather sequence', input: '{"temperatures": [73, 74, 75, 71, 69, 72, 76, 73]}', expected: '[1, 1, 4, 2, 1, 1, 0, 0]', isHidden: false },
        { id: 'tc-2', description: 'Strictly ascending temperatures', input: '{"temperatures": [30, 40, 50, 60]}', expected: '[1, 1, 1, 0]', isHidden: false },
        { id: 'tc-3', description: 'Strictly descending temperatures', input: '{"temperatures": [30, 20, 10]}', expected: '[0, 0, 0]', isHidden: true }
      ],
      editorialSolution: {
        python: `def daily_temperatures(temperatures):
    res = [0] * len(temperatures)
    stack = [] # holds indices
    
    for i, temp in enumerate(temperatures):
        while stack and temperatures[stack[-1]] < temp:
            prev_idx = stack.pop()
            res[prev_idx] = i - prev_idx
        stack.append(i)
        
    return res`,
        explanation: `We use a monotonic decreasing stack storing indices. When the current temperature is higher than temperatures[stack[-1]], we pop stack[-1] and calculate the day difference as i - prev_idx. Each index is pushed and popped at most once. Time: O(N), Space: O(N).`
      }
    },
    {
      id: 'largest-rectangle-histogram',
      title: 'Largest Rectangle in Histogram',
      difficulty: 'Hard',
      category: 'Stacks & Queues',
      description: `Given an array of integers \`heights\` representing the histogram's bar height where the width of each bar is \`1\`, return the area of the largest rectangle in the histogram.

### Example 1:
\`\`\`
Input: heights = [2,1,5,6,2,3]
Output: 10
Explanation: The largest rectangle has an area = 10 units (between height 5 and 6, width 2, height 5).
\`\`\`

### Example 2:
\`\`\`
Input: heights = [2,4]
Output: 4
\`\`\`

### Constraints:
* 1 <= heights.length <= 10^5
* 0 <= heights[i] <= 10^4`,
      optimalComplexity: { time: 'O(N)', space: 'O(N)' },
      starterCode: {
        python: `def largest_rectangle_area(heights):
    # Monotonic stack of (index, height) pairs
    pass

if __name__ == '__main__':
    import json, sys
    lines = sys.stdin.read().strip().splitlines()
    for l in lines:
        if l.strip():
            d = json.loads(l)
            print(json.dumps(largest_rectangle_area(d['heights'])))
`,
        javascript: `function largestRectangleArea(heights) {
    // Write your solution here
}

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
rl.on('line', (line) => {
    if (!line.trim()) return;
    const data = JSON.parse(line);
    console.log(JSON.stringify(largestRectangleArea(data.heights)));
});
`
      },
      testCases: [
        { id: 'tc-1', description: 'Standard irregular histogram', input: '{"heights": [2, 1, 5, 6, 2, 3]}', expected: '10', isHidden: false },
        { id: 'tc-2', description: 'Two increasing bars', input: '{"heights": [2, 4]}', expected: '4', isHidden: false },
        { id: 'tc-3', description: 'Single bar', input: '{"heights": [1]}', expected: '1', isHidden: true }
      ],
      editorialSolution: {
        python: `def largest_rectangle_area(heights):
    max_area = 0
    stack = [] # pair: (index, height)
    
    for i, h in enumerate(heights):
        start = i
        while stack and stack[-1][1] > h:
            idx, height = stack.pop()
            max_area = max(max_area, height * (i - idx))
            start = idx
        stack.append((start, h))
        
    for idx, height in stack:
        max_area = max(max_area, height * (len(heights) - idx))
        
    return max_area`,
        explanation: `We maintain a monotonic increasing stack of (index, height). When a bar is shorter than the top of the stack, the taller bar cannot extend further right. We pop it, calculate area = height * (current_index - start_index), and record max_area. Each bar is pushed and popped once. Time: O(N), Space: O(N).`
      }
    }
  ]
};

module.exports = MODULE;
