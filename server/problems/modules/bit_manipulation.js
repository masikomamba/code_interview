/**
 * Real-Time Collaborative Code Interview Platform
 * Module: Bit Manipulation
 * Zero Emojis - Zero Em Dashes
 */

const MODULE = {
  id: 'bit-manipulation',
  title: 'Bit Manipulation',
  category: 'Bit Manipulation',
  description: 'Bitwise operations, binary masking, Hamming weight, XOR arithmetic, and parity logic.',
  pythonToolkit: [
    {
      name: 'Kernighan bit clearing',
      syntax: 'n = n & (n - 1)',
      complexity: 'O(1) step per set bit',
      description: 'Clears the lowest set bit in an integer.'
    },
    {
      name: 'XOR Cancellation',
      syntax: 'a ^ a == 0, a ^ 0 == a',
      complexity: 'O(1)',
      description: 'Cancels out paired numbers to isolate singletons.'
    },
    {
      name: 'Bit Shifts',
      syntax: 'val << k (multiply by 2^k), val >> k (divide by 2^k)',
      complexity: 'O(1)',
      description: 'Fast binary shifts.'
    }
  ],
  keyPatterns: [
    'n & (n - 1) to count 1s in O(number of 1s) time',
    'DP counting bits: dp[i] = dp[i >> 1] + (i & 1)',
    '32-bit integer masking in Python (0xFFFFFFFF) for two complement'
  ],
  problems: [
    {
      id: 'number-of-1-bits',
      title: 'Number of 1 Bits (Hamming Weight)',
      difficulty: 'Easy',
      category: 'Bit Manipulation',
      neetcodeCategory: 'Bit Manipulation',
      neetcodeOrder: 73,
      isNeetCode75: true,
      description: `Write a function that takes the binary representation of a positive integer and returns the number of set bits it has (also known as the **Hamming weight**).

### Example 1:
\`\`\`
Input: n = 11
Output: 3
Explanation: The input binary string 1011 has a total of three set bits.
\`\`\`

### Example 2:
\`\`\`
Input: n = 128
Output: 1
Explanation: The input binary string 10000000 has a total of one set bit.
\`\`\`

### Example 3:
\`\`\`
Input: n = 2147483645
Output: 30
\`\`\`

### Constraints:
* 1 <= n <= 2^31 - 1`,
      optimalComplexity: { time: 'O(1) 32-bit iterations', space: 'O(1)' },
      starterCode: {
        python: `def hamming_weight(n: int) -> int:
    # Use Brian Kernighan bit clearing
    pass

if __name__ == '__main__':
    import json, sys
    lines = sys.stdin.read().strip().splitlines()
    for l in lines:
        if l.strip():
            d = json.loads(l)
            print(json.dumps(hamming_weight(d['n'])))
`,
        javascript: `function hammingWeight(n) {
    // Write your solution here
}

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
rl.on('line', (line) => {
    if (!line.trim()) return;
    const data = JSON.parse(line);
    console.log(JSON.stringify(hammingWeight(data.n)));
});
`
      },
      testCases: [
        {
          id: 'tc-1',
          description: 'Three set bits (11 = 1011)',
          input: '{"n": 11}',
          expected: '3',
          isHidden: false
        },
        {
          id: 'tc-2',
          description: 'Single set bit (128 = 2^7)',
          input: '{"n": 128}',
          expected: '1',
          isHidden: false
        },
        {
          id: 'tc-3',
          description: 'Large integer (2147483645)',
          input: '{"n": 2147483645}',
          expected: '30',
          isHidden: true
        }
      ],
      editorialSolution: {
        python: `def hamming_weight(n: int) -> int:
    count = 0
    while n:
        n &= (n - 1) # Clears the least significant set bit
        count += 1
    return count`,
        explanation: `Brian Kernighan algorithm repeatedly executes n = n & (n - 1), which directly zeroes out the least significant 1-bit in constant time. The loop runs exactly once per set bit (at most 32 times for a 32-bit integer) rather than checking all 32 bits unconditionally.`
      }
    },
    {
      id: 'counting-bits',
      title: 'Counting Bits',
      difficulty: 'Easy',
      category: 'Bit Manipulation',
      neetcodeCategory: 'Bit Manipulation',
      neetcodeOrder: 74,
      isNeetCode75: true,
      description: `Given an integer \`n\`, return an array \`ans\` of length \`n + 1\` such that for each \`i\` (\`0 <= i <= n\`), \`ans[i]\` is the **number of \`1\`'s** in the binary representation of \`i\`.

Can you do it in linear time **O(n)** in a single pass without using any built-in functions?

### Example 1:
\`\`\`
Input: n = 2
Output: [0, 1, 1]
Explanation:
0 --> 0
1 --> 1
2 --> 10
\`\`\`

### Example 2:
\`\`\`
Input: n = 5
Output: [0, 1, 1, 2, 1, 2]
Explanation:
0 --> 0
1 --> 1
2 --> 10
3 --> 11
4 --> 100
5 --> 101
\`\`\`

### Constraints:
* 0 <= n <= 10^5`,
      optimalComplexity: { time: 'O(N)', space: 'O(1) extra space beyond output array' },
      starterCode: {
        python: `def count_bits(n: int):
    # Use dynamic programming relation: dp[i] = dp[i >> 1] + (i & 1)
    pass

if __name__ == '__main__':
    import json, sys
    lines = sys.stdin.read().strip().splitlines()
    for l in lines:
        if l.strip():
            d = json.loads(l)
            print(json.dumps(count_bits(d['n'])))
`,
        javascript: `function countBits(n) {
    // Write your solution here
}

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
rl.on('line', (line) => {
    if (!line.trim()) return;
    const data = JSON.parse(line);
    console.log(JSON.stringify(countBits(data.n)));
});
`
      },
      testCases: [
        {
          id: 'tc-1',
          description: 'Small count up to n = 2',
          input: '{"n": 2}',
          expected: '[0, 1, 1]',
          isHidden: false
        },
        {
          id: 'tc-2',
          description: 'Count up to n = 5',
          input: '{"n": 5}',
          expected: '[0, 1, 1, 2, 1, 2]',
          isHidden: false
        }
      ],
      editorialSolution: {
        python: `def count_bits(n: int):
    ans = [0] * (n + 1)
    for i in range(1, n + 1):
        ans[i] = ans[i >> 1] + (i & 1)
    return ans`,
        explanation: `Right-shifting i by 1 (i >> 1) preserves all bits except the least significant bit. The number of set bits in i is therefore the set bits in (i >> 1) plus 1 if i is odd (i & 1 == 1) or 0 if i is even. This DP recurrence calculates all counts in a single O(N) linear pass.`
      }
    },
    {
      id: 'reverse-bits',
      title: 'Reverse Bits',
      difficulty: 'Easy',
      category: 'Bit Manipulation',
      neetcodeCategory: 'Bit Manipulation',
      neetcodeOrder: 75,
      isNeetCode75: true,
      description: `Reverse bits of a given 32 bits unsigned integer.

### Example 1:
\`\`\`
Input: n = 43261596 (binary: 00000010100101000001111010011100)
Output: 964176192 (binary: 00111001011110000010100101000000)
\`\`\`

### Example 2:
\`\`\`
Input: n = 4294967293
Output: 3221225471
\`\`\`

### Constraints:
* The input must be a binary string of length 32.`,
      optimalComplexity: { time: 'O(1) 32 iterations', space: 'O(1)' },
      starterCode: {
        python: `def reverse_bits(n: int) -> int:
    # Shift result left and extract lowest bit of n
    pass

if __name__ == '__main__':
    import json, sys
    lines = sys.stdin.read().strip().splitlines()
    for l in lines:
        if l.strip():
            d = json.loads(l)
            print(json.dumps(reverse_bits(d['n'])))
`,
        javascript: `function reverseBits(n) {
    // Write your solution here
}

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
rl.on('line', (line) => {
    if (!line.trim()) return;
    const data = JSON.parse(line);
    console.log(JSON.stringify(reverseBits(data.n)));
});
`
      },
      testCases: [
        {
          id: 'tc-1',
          description: 'Standard 32-bit reversal',
          input: '{"n": 43261596}',
          expected: '964176192',
          isHidden: false
        },
        {
          id: 'tc-2',
          description: 'High bits inversion',
          input: '{"n": 4294967293}',
          expected: '3221225471',
          isHidden: false
        }
      ],
      editorialSolution: {
        python: `def reverse_bits(n: int) -> int:
    res = 0
    for _ in range(32):
        res = (res << 1) | (n & 1)
        n >>= 1
    return res`,
        explanation: `In each iteration of 32 steps, we left-shift our accumulated result by 1 to make space for the next bit, bitwise-OR the least significant bit of n (n & 1), and right-shift n by 1. Always takes exactly 32 steps and O(1) space.`
      }
    },
    {
      id: 'missing-number',
      title: 'Missing Number',
      difficulty: 'Easy',
      category: 'Bit Manipulation',
      neetcodeCategory: 'Bit Manipulation',
      neetcodeOrder: 76,
      isNeetCode75: true,
      description: `Given an array \`nums\` containing \`n\` distinct numbers in the range \`[0, n]\`, return the only number in the range that is missing from the array.

### Example 1:
\`\`\`
Input: nums = [3, 0, 1]
Output: 2
Explanation: n = 3 since there are 3 numbers, so all numbers are in the range [0, 3]. 2 is the missing number in the range since it does not appear in nums.
\`\`\`

### Example 2:
\`\`\`
Input: nums = [0, 1]
Output: 2
\`\`\`

### Example 3:
\`\`\`
Input: nums = [9,6,4,2,3,5,7,0,1]
Output: 8
\`\`\`

### Constraints:
* n == nums.length
* 1 <= n <= 10^4
* 0 <= nums[i] <= n
* All the numbers of \`nums\` are unique.`,
      optimalComplexity: { time: 'O(N)', space: 'O(1)' },
      starterCode: {
        python: `def missing_number(nums):
    # Use XOR properties or Gauss formula
    pass

if __name__ == '__main__':
    import json, sys
    lines = sys.stdin.read().strip().splitlines()
    for l in lines:
        if l.strip():
            d = json.loads(l)
            print(json.dumps(missing_number(d['nums'])))
`,
        javascript: `function missingNumber(nums) {
    // Write your solution here
}

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
rl.on('line', (line) => {
    if (!line.trim()) return;
    const data = JSON.parse(line);
    console.log(JSON.stringify(missingNumber(data.nums)));
});
`
      },
      testCases: [
        {
          id: 'tc-1',
          description: 'Missing 2 in [3, 0, 1]',
          input: '{"nums": [3, 0, 1]}',
          expected: '2',
          isHidden: false
        },
        {
          id: 'tc-2',
          description: 'Missing 8 in range [0, 9]',
          input: '{"nums": [9,6,4,2,3,5,7,0,1]}',
          expected: '8',
          isHidden: false
        }
      ],
      editorialSolution: {
        python: `def missing_number(nums):
    res = len(nums)
    for i, num in enumerate(nums):
        res ^= i ^ num
    return res`,
        explanation: `Because a ^ a = 0 and a ^ 0 = a, XORing all indices from 0 to n together with all array elements cancels every number that appears in both, leaving precisely the missing value in O(N) time and O(1) space.`
      }
    },
    {
      id: 'sum-of-two-integers',
      title: 'Sum of Two Integers (Bitwise Addition)',
      difficulty: 'Medium',
      category: 'Bit Manipulation',
      neetcodeCategory: 'Bit Manipulation',
      neetcodeOrder: 77,
      isNeetCode75: true,
      description: `Given two integers \`a\` and \`b\`, return the sum of the two integers without using the operators \`+\` and \`-\`.

### Example 1:
\`\`\`
Input: a = 1, b = 2
Output: 3
\`\`\`

### Example 2:
\`\`\`
Input: a = 2, b = 3
Output: 5
\`\`\`

### Constraints:
* -1000 <= a, b <= 1000`,
      optimalComplexity: { time: 'O(1)', space: 'O(1)' },
      starterCode: {
        python: `def get_sum(a: int, b: int) -> int:
    # Use XOR for sum without carry, AND shifted left for carry
    pass

if __name__ == '__main__':
    import json, sys
    lines = sys.stdin.read().strip().splitlines()
    for l in lines:
        if l.strip():
            d = json.loads(l)
            print(json.dumps(get_sum(d['a'], d['b'])))
`,
        javascript: `function getSum(a, b) {
    // Write your solution here
}

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
rl.on('line', (line) => {
    if (!line.trim()) return;
    const data = JSON.parse(line);
    console.log(JSON.stringify(getSum(data.a, data.b)));
});
`
      },
      testCases: [
        {
          id: 'tc-1',
          description: 'Basic sum: 1 + 2 = 3',
          input: '{"a": 1, "b": 2}',
          expected: '3',
          isHidden: false
        },
        {
          id: 'tc-2',
          description: 'Sum with carry: 2 + 3 = 5',
          input: '{"a": 2, "b": 3}',
          expected: '5',
          isHidden: false
        },
        {
          id: 'tc-3',
          description: 'Negative addition: -1 + 1 = 0',
          input: '{"a": -1, "b": 1}',
          expected: '0',
          isHidden: true
        }
      ],
      editorialSolution: {
        python: `def get_sum(a: int, b: int) -> int:
    mask = 0xFFFFFFFF
    while b & mask != 0:
        carry = (a & b) << 1
        a = (a ^ b)
        b = carry
    return a if b == 0 else (a & mask) if a <= 0x7FFFFFFF else ~(a ^ mask)`,
        explanation: `XOR computes addition without carry (0+1=1, 1+0=1, 1+1=0). Bitwise AND (a & b) followed by left shift (<< 1) isolates and positions the carry. In Python, an explicit 32-bit mask (0xFFFFFFFF) is used to simulate standard 32-bit two-complement integer overflow.`
      }
    }
  ]
};

module.exports = MODULE;
