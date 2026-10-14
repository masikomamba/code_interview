/**
 * Real-Time Collaborative Code Interview Platform
 * Module: Math & 2D Geometry
 * Zero Emojis - Zero Em Dashes
 */

const MODULE = {
  id: 'math-geometry',
  title: 'Math & Geometry',
  category: 'Math & Geometry',
  description: 'In-place matrix transformations, coordinate boundaries, spiral sweeps, and row/column projections.',
  pythonToolkit: [
    {
      name: 'Matrix Transposition',
      syntax: 'for i in range(n):\n    for j in range(i, n):\n        matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]',
      complexity: 'O(N^2) time, O(1) space',
      description: 'Swaps rows and columns across the primary diagonal in-place.'
    },
    {
      name: 'Row Inversion',
      syntax: 'for row in matrix:\n    row.reverse()',
      complexity: 'O(N^2) time, O(1) space',
      description: 'Flips rows horizontally.'
    }
  ],
  keyPatterns: [
    'Transpose + Horizontal Reflection = 90 degree clockwise rotation',
    'Four-boundary pointers (top, bottom, left, right) for spiral scanning',
    'First row and column state projection for O(1) space cell marking'
  ],
  problems: [
    {
      id: 'rotate-image',
      title: 'Rotate Image',
      difficulty: 'Medium',
      category: 'Math & Geometry',
      neetcodeCategory: 'Math & Geometry',
      neetcodeOrder: 70,
      isNeetCode75: true,
      description: `You are given an \`n x n\` 2D \`matrix\` representing an image, rotate the image by **90 degrees clockwise** in-place.

You have to rotate the image **in-place**, which means you have to modify the input 2D matrix directly. **DO NOT** allocate another 2D matrix and do the rotation.

### Example 1:
\`\`\`
Input: matrix = [[1,2,3],[4,5,6],[7,8,9]]
Output: [[7,4,1],[8,5,2],[9,6,3]]
\`\`\`

### Example 2:
\`\`\`
Input: matrix = [[5,1,9,11],[2,4,8,10],[13,3,6,7],[15,14,12,16]]
Output: [[15,13,2,5],[14,3,4,1],[12,6,8,9],[16,7,10,11]]
\`\`\`

### Constraints:
* n == matrix.length == matrix[i].length
* 1 <= n <= 20
* -1000 <= matrix[i][j] <= 1000`,
      optimalComplexity: { time: 'O(N^2)', space: 'O(1) auxiliary' },
      starterCode: {
        python: `def rotate(matrix):
    # Transpose matrix, then reverse each row in-place
    pass

if __name__ == '__main__':
    import json, sys
    lines = sys.stdin.read().strip().splitlines()
    for l in lines:
        if l.strip():
            d = json.loads(l)
            mat = d['matrix']
            rotate(mat)
            print(json.dumps(mat))
`,
        javascript: `function rotate(matrix) {
    // Modify matrix in-place
}

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
rl.on('line', (line) => {
    if (!line.trim()) return;
    const data = JSON.parse(line);
    rotate(data.matrix);
    console.log(JSON.stringify(data.matrix));
});
`
      },
      testCases: [
        {
          id: 'tc-1',
          description: '3x3 standard rotation',
          input: '{"matrix": [[1,2,3],[4,5,6],[7,8,9]]}',
          expected: '[[7,4,1],[8,5,2],[9,6,3]]',
          isHidden: false
        },
        {
          id: 'tc-2',
          description: '4x4 square rotation',
          input: '{"matrix": [[5,1,9,11],[2,4,8,10],[13,3,6,7],[15,14,12,16]]}',
          expected: '[[15,13,2,5],[14,3,4,1],[12,6,8,9],[16,7,10,11]]',
          isHidden: false
        }
      ],
      editorialSolution: {
        python: `def rotate(matrix):
    n = len(matrix)
    # Step 1: Transpose matrix in-place
    for i in range(n):
        for j in range(i + 1, n):
            matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]

    # Step 2: Reverse each row
    for row in matrix:
        row.reverse()`,
        explanation: `Rotating a matrix 90 degrees clockwise is mathematically equivalent to transposing the matrix across its main diagonal (swapping matrix[i][j] with matrix[j][i]), followed by horizontally reflecting each row (reversing it). Both phases operate strictly in-place with O(1) auxiliary space.`
      }
    },
    {
      id: 'spiral-matrix',
      title: 'Spiral Matrix',
      difficulty: 'Medium',
      category: 'Math & Geometry',
      neetcodeCategory: 'Math & Geometry',
      neetcodeOrder: 71,
      isNeetCode75: true,
      description: `Given an \`m x n\` \`matrix\`, return all elements of the \`matrix\` in **spiral order**.

### Example 1:
\`\`\`
Input: matrix = [[1,2,3],[4,5,6],[7,8,9]]
Output: [1,2,3,6,9,8,7,4,5]
\`\`\`

### Example 2:
\`\`\`
Input: matrix = [[1,2,3,4],[5,6,7,8],[9,10,11,12]]
Output: [1,2,3,4,8,12,11,10,9,5,6,7]
\`\`\`

### Constraints:
* m == matrix.length
* n == matrix[i].length
* 1 <= m, n <= 10
* -100 <= matrix[i][j] <= 100`,
      optimalComplexity: { time: 'O(M * N)', space: 'O(1) extra space' },
      starterCode: {
        python: `def spiral_order(matrix):
    # Maintain boundaries: top, bottom, left, right
    pass

if __name__ == '__main__':
    import json, sys
    lines = sys.stdin.read().strip().splitlines()
    for l in lines:
        if l.strip():
            d = json.loads(l)
            print(json.dumps(spiral_order(d['matrix'])))
`,
        javascript: `function spiralOrder(matrix) {
    // Write your solution here
}

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
rl.on('line', (line) => {
    if (!line.trim()) return;
    const data = JSON.parse(line);
    console.log(JSON.stringify(spiralOrder(data.matrix)));
});
`
      },
      testCases: [
        {
          id: 'tc-1',
          description: '3x3 spiral order',
          input: '{"matrix": [[1,2,3],[4,5,6],[7,8,9]]}',
          expected: '[1, 2, 3, 6, 9, 8, 7, 4, 5]',
          isHidden: false
        },
        {
          id: 'tc-2',
          description: 'Rectangular matrix (3x4)',
          input: '{"matrix": [[1,2,3,4],[5,6,7,8],[9,10,11,12]]}',
          expected: '[1, 2, 3, 4, 8, 12, 11, 10, 9, 5, 6, 7]',
          isHidden: false
        }
      ],
      editorialSolution: {
        python: `def spiral_order(matrix):
    res = []
    if not matrix:
        return res

    top, bottom = 0, len(matrix) - 1
    left, right = 0, len(matrix[0]) - 1

    while top <= bottom and left <= right:
        # 1. Traverse Right along Top row
        for c in range(left, right + 1):
            res.append(matrix[top][c])
        top += 1

        # 2. Traverse Down along Right column
        for r in range(top, bottom + 1):
            res.append(matrix[r][right])
        right -= 1

        # 3. Traverse Left along Bottom row (if still valid)
        if top <= bottom:
            for c in range(right, left - 1, -1):
                res.append(matrix[bottom][c])
            bottom -= 1

        # 4. Traverse Up along Left column (if still valid)
        if left <= right:
            for r in range(bottom, top - 1, -1):
                res.append(matrix[r][left])
            left += 1

    return res`,
        explanation: `We maintain four boundary pointers: top, bottom, left, and right. In each cycle of the while loop, we sweep left-to-right across the top row, top-to-bottom down the right column, right-to-left along the bottom row, and bottom-to-top up the left column. After each sweep, we advance the respective boundary inwards.`
      }
    },
    {
      id: 'set-matrix-zeroes',
      title: 'Set Matrix Zeroes',
      difficulty: 'Medium',
      category: 'Math & Geometry',
      neetcodeCategory: 'Math & Geometry',
      neetcodeOrder: 72,
      isNeetCode75: true,
      description: `Given an \`m x n\` integer matrix \`matrix\`, if an element is \`0\`, set its entire row and column to \`0\`'s.

You must do it **in place** with **O(1)** constant space.

### Example 1:
\`\`\`
Input: matrix = [[1,1,1],[1,0,1],[1,1,1]]
Output: [[1,0,1],[0,0,0],[1,0,1]]
\`\`\`

### Example 2:
\`\`\`
Input: matrix = [[0,1,2,0],[3,4,5,2],[1,3,1,5]]
Output: [[0,0,0,0],[0,4,5,0],[0,3,1,0]]
\`\`\`

### Constraints:
* m == matrix.length
* n == matrix[0].length
* 1 <= m, n <= 200
* -2^31 <= matrix[i][j] <= 2^31 - 1`,
      optimalComplexity: { time: 'O(M * N)', space: 'O(1) extra space' },
      starterCode: {
        python: `def set_zeroes(matrix):
    # Use first row and column as zero indicator arrays
    pass

if __name__ == '__main__':
    import json, sys
    lines = sys.stdin.read().strip().splitlines()
    for l in lines:
        if l.strip():
            d = json.loads(l)
            mat = d['matrix']
            set_zeroes(mat)
            print(json.dumps(mat))
`,
        javascript: `function setZeroes(matrix) {
    // Modify in-place
}

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
rl.on('line', (line) => {
    if (!line.trim()) return;
    const data = JSON.parse(line);
    setZeroes(data.matrix);
    console.log(JSON.stringify(data.matrix));
});
`
      },
      testCases: [
        {
          id: 'tc-1',
          description: 'Center zero propagating cross',
          input: '{"matrix": [[1,1,1],[1,0,1],[1,1,1]]}',
          expected: '[[1,0,1],[0,0,0],[1,0,1]]',
          isHidden: false
        },
        {
          id: 'tc-2',
          description: 'Multiple corner zeroes',
          input: '{"matrix": [[0,1,2,0],[3,4,5,2],[1,3,1,5]]}',
          expected: '[[0,0,0,0],[0,4,5,0],[0,3,1,0]]',
          isHidden: false
        }
      ],
      editorialSolution: {
        python: `def set_zeroes(matrix):
    rows, cols = len(matrix), len(matrix[0])
    first_row_zero = False
    first_col_zero = False

    # Check if first col contains zero
    for r in range(rows):
        if matrix[r][0] == 0:
            first_col_zero = True
            break

    # Check if first row contains zero
    for c in range(cols):
        if matrix[0][c] == 0:
            first_row_zero = True
            break

    # Use first row and col as flags
    for r in range(1, rows):
        for c in range(1, cols):
            if matrix[r][c] == 0:
                matrix[r][0] = 0
                matrix[0][c] = 0

    # Zero out cells based on flags
    for r in range(1, rows):
        for c in range(1, cols):
            if matrix[r][0] == 0 or matrix[0][c] == 0:
                matrix[r][c] = 0

    # Zero out first row if needed
    if first_row_zero:
        for c in range(cols):
            matrix[0][c] = 0

    # Zero out first col if needed
    if first_col_zero:
        for r in range(rows):
            matrix[r][0] = 0`,
        explanation: `To achieve strictly O(1) extra space, we reuse the matrix's own first row and first column as markers. Two boolean variables track whether the first row and first column originally contained zeroes. In the second pass, we zero inner cells whose row header or column header is 0, and lastly zero the headers themselves if needed.`
      }
    }
  ]
};

module.exports = MODULE;
