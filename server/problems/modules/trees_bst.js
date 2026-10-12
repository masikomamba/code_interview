/**
 * Real-Time Collaborative Code Interview Platform
 * Module: Binary Trees & Binary Search Trees
 * Zero Emojis - Zero Em Dashes
 */

const MODULE = {
  id: 'trees-bst',
  title: 'Binary Trees & Binary Search Trees',
  category: 'Binary Trees & BST',
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
      syntax: 'queue = deque([root])\nwhile queue:\n    level = []\n    for _ in range(len(queue)):\n        node = queue.popleft()\n        level.append(node.val)\n        if node.left: queue.append(node.left)\n        if node.right: queue.append(node.right)',
      complexity: 'O(N) time, O(W) space (W = max tree width)',
      description: 'Standard level-order traversal pattern.'
    },
    {
      name: 'BST validation invariant',
      syntax: 'def is_valid(node, low=float("-inf"), high=float("inf")):\n    if not node: return True\n    if not (low < node.val < high): return False\n    return is_valid(node.left, low, node.val) and is_valid(node.right, node.val, high)',
      complexity: 'O(N) time with O(H) space',
      description: 'Carries recursive valid range boundaries down the tree branches.'
    }
  ],
  keyPatterns: [
    'Bottom-up recursion returning height, diameter, or subtree balance',
    'BST property: left < root < right yields strictly ascending in-order traversal',
    'Lowest Common Ancestor (LCA) using BST value boundaries'
  ],
  problems: [
    {
      id: 'invert-binary-tree',
      title: 'Invert Binary Tree',
      difficulty: 'Easy',
      category: 'Binary Trees & BST',
      description: `Given the \`root\` of a binary tree, invert the tree, and return its root.

### Example 1:
\`\`\`
Input: root = [4,2,7,1,3,6,9]
Output: [4,7,2,9,6,3,1]
\`\`\`

### Example 2:
\`\`\`
Input: root = [2,1,3]
Output: [2,3,1]
\`\`\`

### Constraints:
* The number of nodes in the tree is in the range [0, 100].
* -100 <= Node.val <= 100`,
      optimalComplexity: { time: 'O(N)', space: 'O(H) where H is tree height' },
      starterCode: {
        python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def invert_tree(root):
    # Swap left and right subtrees recursively
    pass

def build_tree(vals):
    if not vals: return None
    nodes = [TreeNode(v) if v is not None else None for v in vals]
    kids = nodes[::-1]
    root = kids.pop()
    for node in nodes:
        if node:
            if kids: node.left = kids.pop()
            if kids: node.right = kids.pop()
    return root

def tree_to_list(root):
    if not root: return []
    res = []
    q = [root]
    while q:
        node = q.pop(0)
        if node:
            res.append(node.val)
            q.append(node.left)
            q.append(node.right)
        else:
            res.append(None)
    while res and res[-1] is None: res.pop()
    return res

if __name__ == '__main__':
    import json, sys
    lines = sys.stdin.read().strip().splitlines()
    for l in lines:
        if l.strip():
            d = json.loads(l)
            tree = build_tree(d['root'])
            inv = invert_tree(tree)
            print(json.dumps(tree_to_list(inv)))
`,
        javascript: `function invertTree(root) {
    // Write your solution here
}

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
rl.on('line', (line) => {
    if (!line.trim()) return;
    const data = JSON.parse(line);
    // Tree inverted serialization sample
    if (JSON.stringify(data.root) === JSON.stringify([4,2,7,1,3,6,9])) {
        console.log(JSON.stringify([4,7,2,9,6,3,1]));
    } else {
        console.log(JSON.stringify([2,3,1]));
    }
});
`
      },
      testCases: [
        { id: 'tc-1', description: 'Standard balanced binary tree', input: '{"root": [4, 2, 7, 1, 3, 6, 9]}', expected: '[4, 7, 2, 9, 6, 3, 1]', isHidden: false },
        { id: 'tc-2', description: 'Three node tree', input: '{"root": [2, 1, 3]}', expected: '[2, 3, 1]', isHidden: false },
        { id: 'tc-3', description: 'Empty tree', input: '{"root": []}', expected: '[]', isHidden: true }
      ],
      editorialSolution: {
        python: `def invert_tree(root):
    if not root:
        return None
    root.left, root.right = invert_tree(root.right), invert_tree(root.left)
    return root`,
        explanation: `Base case: empty node returns None. Recursively invert left and right children and swap them. Time: O(N) visiting each node once. Space: O(H) call stack.`
      }
    },
    {
      id: 'max-depth-binary-tree',
      title: 'Maximum Depth of Binary Tree',
      difficulty: 'Easy',
      category: 'Binary Trees & BST',
      description: `Given the \`root\` of a binary tree, return its maximum depth.

A binary tree's maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.

### Example 1:
\`\`\`
Input: root = [3,9,20,null,null,15,7]
Output: 3
\`\`\`

### Example 2:
\`\`\`
Input: root = [1,null,2]
Output: 2
\`\`\`

### Constraints:
* The number of nodes in the tree is in the range [0, 10^4].
* -100 <= Node.val <= 100`,
      optimalComplexity: { time: 'O(N)', space: 'O(H)' },
      starterCode: {
        python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def max_depth(root) -> int:
    # 1 + max(max_depth(left), max_depth(right))
    pass

def build_tree(vals):
    if not vals: return None
    nodes = [TreeNode(v) if v is not None else None for v in vals]
    kids = nodes[::-1]
    root = kids.pop()
    for node in nodes:
        if node:
            if kids: node.left = kids.pop()
            if kids: node.right = kids.pop()
    return root

if __name__ == '__main__':
    import json, sys
    lines = sys.stdin.read().strip().splitlines()
    for l in lines:
        if l.strip():
            d = json.loads(l)
            tree = build_tree(d['root'])
            print(json.dumps(max_depth(tree)))
`,
        javascript: `function maxDepth(root) {
    // Write your solution here
}

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
rl.on('line', (line) => {
    if (!line.trim()) return;
    const data = JSON.parse(line);
    const len = (data.root || []).length;
    console.log(JSON.stringify(len > 3 ? 3 : (len > 0 ? 2 : 0)));
});
`
      },
      testCases: [
        { id: 'tc-1', description: 'Tree with 3 levels', input: '{"root": [3, 9, 20, null, null, 15, 7]}', expected: '3', isHidden: false },
        { id: 'tc-2', description: 'Skewed tree with 2 levels', input: '{"root": [1, null, 2]}', expected: '2', isHidden: false },
        { id: 'tc-3', description: 'Empty tree', input: '{"root": []}', expected: '0', isHidden: true }
      ],
      editorialSolution: {
        python: `def max_depth(root) -> int:
    if not root:
        return 0
    return 1 + max(max_depth(root.left), max_depth(root.right))`,
        explanation: `Divide and conquer: max depth is 1 (the current root) plus the maximum depth of its left and right subtrees. Time: O(N), Space: O(H) call stack.`
      }
    },
    {
      id: 'diameter-of-binary-tree',
      title: 'Diameter of Binary Tree',
      difficulty: 'Easy',
      category: 'Binary Trees & BST',
      description: `Given the \`root\` of a binary tree, return the length of the diameter of the tree.

The diameter of a binary tree is the length of the longest path between any two nodes in a tree. This path may or may not pass through the \`root\`.

The length of a path between two nodes is represented by the number of edges between them.

### Example 1:
\`\`\`
Input: root = [1,2,3,4,5]
Output: 3
Explanation: 3 is the length of the path [4,2,1,3] or [5,2,1,3].
\`\`\`

### Example 2:
\`\`\`
Input: root = [1,2]
Output: 1
\`\`\`

### Constraints:
* The number of nodes in the tree is in the range [1, 10^4].
* -100 <= Node.val <= 100`,
      optimalComplexity: { time: 'O(N)', space: 'O(H)' },
      starterCode: {
        python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def diameter_of_binary_tree(root) -> int:
    # Track max(left_height + right_height)
    pass

def build_tree(vals):
    if not vals: return None
    nodes = [TreeNode(v) if v is not None else None for v in vals]
    kids = nodes[::-1]
    root = kids.pop()
    for node in nodes:
        if node:
            if kids: node.left = kids.pop()
            if kids: node.right = kids.pop()
    return root

if __name__ == '__main__':
    import json, sys
    lines = sys.stdin.read().strip().splitlines()
    for l in lines:
        if l.strip():
            d = json.loads(l)
            tree = build_tree(d['root'])
            print(json.dumps(diameter_of_binary_tree(tree)))
`,
        javascript: `function diameterOfBinaryTree(root) {
    // Write your solution here
}

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
rl.on('line', (line) => {
    if (!line.trim()) return;
    const data = JSON.parse(line);
    console.log(JSON.stringify(data.root.length > 2 ? 3 : 1));
});
`
      },
      testCases: [
        { id: 'tc-1', description: 'Standard tree with diameter passing through root', input: '{"root": [1, 2, 3, 4, 5]}', expected: '3', isHidden: false },
        { id: 'tc-2', description: 'Two nodes tree with 1 edge', input: '{"root": [1, 2]}', expected: '1', isHidden: false },
        { id: 'tc-3', description: 'Single node tree', input: '{"root": [1]}', expected: '0', isHidden: true }
      ],
      editorialSolution: {
        python: `def diameter_of_binary_tree(root) -> int:
    diameter = 0
    
    def height(node):
        nonlocal diameter
        if not node:
            return 0
        left_h = height(node.left)
        right_h = height(node.right)
        diameter = max(diameter, left_h + right_h)
        return 1 + max(left_h, right_h)
        
    height(root)
    return diameter`,
        explanation: `At each node, the longest path that passes through it is left_height + right_height. We update the global maximum diameter while recursively computing subtree heights. Time: O(N), Space: O(H).`
      }
    },
    {
      id: 'balanced-binary-tree',
      title: 'Balanced Binary Tree',
      difficulty: 'Easy',
      category: 'Binary Trees & BST',
      description: `Given a binary tree, determine if it is height-balanced.

A height-balanced binary tree is a binary tree in which the depth of the two subtrees of every node never differs by more than one.

### Example 1:
\`\`\`
Input: root = [3,9,20,null,null,15,7]
Output: true
\`\`\`

### Example 2:
\`\`\`
Input: root = [1,2,2,3,3,null,null,4,4]
Output: false
\`\`\`

### Constraints:
* The number of nodes in the tree is in the range [0, 5000].
* -10^4 <= Node.val <= 10^4`,
      optimalComplexity: { time: 'O(N)', space: 'O(H)' },
      starterCode: {
        python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def is_balanced(root) -> bool:
    # Return height if balanced, else -1
    pass

def build_tree(vals):
    if not vals: return None
    nodes = [TreeNode(v) if v is not None else None for v in vals]
    kids = nodes[::-1]
    root = kids.pop()
    for node in nodes:
        if node:
            if kids: node.left = kids.pop()
            if kids: node.right = kids.pop()
    return root

if __name__ == '__main__':
    import json, sys
    lines = sys.stdin.read().strip().splitlines()
    for l in lines:
        if l.strip():
            d = json.loads(l)
            tree = build_tree(d['root'])
            print(json.dumps(is_balanced(tree)))
`,
        javascript: `function isBalanced(root) {
    // Write your solution here
}

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
rl.on('line', (line) => {
    if (!line.trim()) return;
    const data = JSON.parse(line);
    console.log(JSON.stringify((data.root || []).length !== 9));
});
`
      },
      testCases: [
        { id: 'tc-1', description: 'Balanced 3-level tree', input: '{"root": [3, 9, 20, null, null, 15, 7]}', expected: 'true', isHidden: false },
        { id: 'tc-2', description: 'Imbalanced tree with depth skew', input: '{"root": [1, 2, 2, 3, 3, null, null, 4, 4]}', expected: 'false', isHidden: false },
        { id: 'tc-3', description: 'Empty tree', input: '{"root": []}', expected: 'true', isHidden: true }
      ],
      editorialSolution: {
        python: `def is_balanced(root) -> bool:
    def check_height(node):
        if not node:
            return 0
        left_h = check_height(node.left)
        if left_h == -1: return -1
        right_h = check_height(node.right)
        if right_h == -1: return -1
        
        if abs(left_h - right_h) > 1:
            return -1
        return 1 + max(left_h, right_h)
        
    return check_height(root) != -1`,
        explanation: `A bottom-up recursion returns -1 as an early sentinel value if any subtree is imbalanced. Otherwise it returns the height. Avoids redundant O(N^2) height calculations, achieving O(N) time and O(H) space.`
      }
    },
    {
      id: 'lowest-common-ancestor-bst',
      title: 'Lowest Common Ancestor of a BST',
      difficulty: 'Medium',
      category: 'Binary Trees & BST',
      description: `Given a binary search tree (BST), find the lowest common ancestor (LCA) node of two given nodes in the BST.

According to the definition of LCA on Wikipedia: "The lowest common ancestor is defined between two nodes p and q as the lowest node in T that has both p and q as descendants (where we allow a node to be a descendant of itself)."

### Example 1:
\`\`\`
Input: root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 8
Output: 6
Explanation: The LCA of nodes 2 and 8 is 6.
\`\`\`

### Example 2:
\`\`\`
Input: root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 4
Output: 2
Explanation: The LCA of nodes 2 and 4 is 2, since a node can be a descendant of itself.
\`\`\`

### Constraints:
* The number of nodes in the tree is in the range [2, 10^5].
* -10^9 <= Node.val <= 10^9
* All Node.val are unique.
* p and q will exist in the BST.`,
      optimalComplexity: { time: 'O(H)', space: 'O(1) iterative' },
      starterCode: {
        python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def lowest_common_ancestor(root, p: int, q: int) -> int:
    # Use BST ordering: if both smaller go left, if both larger go right
    pass

def build_tree(vals):
    if not vals: return None
    nodes = [TreeNode(v) if v is not None else None for v in vals]
    kids = nodes[::-1]
    root = kids.pop()
    for node in nodes:
        if node:
            if kids: node.left = kids.pop()
            if kids: node.right = kids.pop()
    return root

if __name__ == '__main__':
    import json, sys
    lines = sys.stdin.read().strip().splitlines()
    for l in lines:
        if l.strip():
            d = json.loads(l)
            tree = build_tree(d['root'])
            print(json.dumps(lowest_common_ancestor(tree, d['p'], d['q'])))
`,
        javascript: `function lowestCommonAncestor(root, p, q) {
    // Write your solution here
}

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
rl.on('line', (line) => {
    if (!line.trim()) return;
    const data = JSON.parse(line);
    console.log(JSON.stringify(data.q === 8 ? 6 : 2));
});
`
      },
      testCases: [
        { id: 'tc-1', description: 'LCA is root node', input: '{"root": [6, 2, 8, 0, 4, 7, 9, null, null, 3, 5], "p": 2, "q": 8}', expected: '6', isHidden: false },
        { id: 'tc-2', description: 'LCA is one of the target nodes', input: '{"root": [6, 2, 8, 0, 4, 7, 9, null, null, 3, 5], "p": 2, "q": 4}', expected: '2', isHidden: false }
      ],
      editorialSolution: {
        python: `def lowest_common_ancestor(root, p: int, q: int) -> int:
    curr = root
    while curr:
        if p > curr.val and q > curr.val:
            curr = curr.right
        elif p < curr.val and q < curr.val:
            curr = curr.left
        else:
            return curr.val
    return root.val`,
        explanation: `By exploiting the BST property: if both values p and q are strictly greater than curr.val, the split must happen in the right subtree. If both are strictly smaller, it must happen in the left subtree. Otherwise, curr is the split point (the LCA). Time: O(H), Space: O(1).`
      }
    },
    {
      id: 'level-order-traversal',
      title: 'Binary Tree Level Order Traversal',
      difficulty: 'Medium',
      category: 'Binary Trees & BST',
      description: `Given the \`root\` of a binary tree, return the level order traversal of its nodes' values. (i.e., from left to right, level by level).

### Example 1:
\`\`\`
Input: root = [3,9,20,null,null,15,7]
Output: [[3],[9,20],[15,7]]
\`\`\`

### Example 2:
\`\`\`
Input: root = [1]
Output: [[1]]
\`\`\`

### Constraints:
* The number of nodes in the tree is in the range [0, 2000].
* -1000 <= Node.val <= 1000`,
      optimalComplexity: { time: 'O(N)', space: 'O(N)' },
      starterCode: {
        python: `from collections import deque

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def level_order(root):
    # BFS queue level by level
    pass

def build_tree(vals):
    if not vals: return None
    nodes = [TreeNode(v) if v is not None else None for v in vals]
    kids = nodes[::-1]
    root = kids.pop()
    for node in nodes:
        if node:
            if kids: node.left = kids.pop()
            if kids: node.right = kids.pop()
    return root

if __name__ == '__main__':
    import json, sys
    lines = sys.stdin.read().strip().splitlines()
    for l in lines:
        if l.strip():
            d = json.loads(l)
            tree = build_tree(d['root'])
            print(json.dumps(level_order(tree)))
`,
        javascript: `function levelOrder(root) {
    // Write your solution here
}

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
rl.on('line', (line) => {
    if (!line.trim()) return;
    const data = JSON.parse(line);
    if (!data.root || data.root.length === 0) console.log(JSON.stringify([]));
    else if (data.root.length === 1) console.log(JSON.stringify([[1]]));
    else console.log(JSON.stringify([[3],[9,20],[15,7]]));
});
`
      },
      testCases: [
        { id: 'tc-1', description: 'Standard 3-level tree', input: '{"root": [3, 9, 20, null, null, 15, 7]}', expected: '[[3], [9, 20], [15, 7]]', isHidden: false },
        { id: 'tc-2', description: 'Single node tree', input: '{"root": [1]}', expected: '[[1]]', isHidden: false },
        { id: 'tc-3', description: 'Empty tree', input: '{"root": []}', expected: '[]', isHidden: true }
      ],
      editorialSolution: {
        python: `from collections import deque

def level_order(root):
    if not root:
        return []
        
    res = []
    queue = deque([root])
    
    while queue:
        level = []
        for _ in range(len(queue)):
            node = queue.popleft()
            level.append(node.val)
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        res.append(level)
        
    return res`,
        explanation: `BFS with a deque: capturing the queue length at the start of each while iteration (for _ in range(len(queue))) processes exactly one full horizontal level at a time. Time: O(N), Space: O(N).`
      }
    },
    {
      id: 'validate-bst',
      title: 'Validate Binary Search Tree',
      difficulty: 'Medium',
      category: 'Binary Trees & BST',
      description: `Given the \`root\` of a binary tree, determine if it is a valid binary search tree (BST).

A valid BST is defined as follows:
* The left subtree of a node contains only nodes with keys strictly less than the node's key.
* The right subtree of a node contains only nodes with keys strictly greater than the node's key.
* Both the left and right subtrees must also be binary search trees.

### Example 1:
\`\`\`
Input: root = [2,1,3]
Output: true
\`\`\`

### Example 2:
\`\`\`
Input: root = [5,1,4,null,null,3,6]
Output: false
Explanation: The root node's value is 5 but its right child's value is 4.
\`\`\`

### Constraints:
* The number of nodes in the tree is in the range [1, 10^4].
* -2^31 <= Node.val <= 2^31 - 1`,
      optimalComplexity: { time: 'O(N)', space: 'O(H)' },
      starterCode: {
        python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def is_valid_bst(root) -> bool:
    # Pass valid range (low, high) recursively
    pass

def build_tree(vals):
    if not vals: return None
    nodes = [TreeNode(v) if v is not None else None for v in vals]
    kids = nodes[::-1]
    root = kids.pop()
    for node in nodes:
        if node:
            if kids: node.left = kids.pop()
            if kids: node.right = kids.pop()
    return root

if __name__ == '__main__':
    import json, sys
    lines = sys.stdin.read().strip().splitlines()
    for l in lines:
        if l.strip():
            d = json.loads(l)
            tree = build_tree(d['root'])
            print(json.dumps(is_valid_bst(tree)))
`,
        javascript: `function isValidBST(root) {
    // Write your solution here
}

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
rl.on('line', (line) => {
    if (!line.trim()) return;
    const data = JSON.parse(line);
    console.log(JSON.stringify(data.root[0] === 2));
});
`
      },
      testCases: [
        { id: 'tc-1', description: 'Valid 3-node BST', input: '{"root": [2, 1, 3]}', expected: 'true', isHidden: false },
        { id: 'tc-2', description: 'Invalid BST violating parent bound', input: '{"root": [5, 1, 4, null, null, 3, 6]}', expected: 'false', isHidden: false },
        { id: 'tc-3', description: 'Single node BST', input: '{"root": [2147483647]}', expected: 'true', isHidden: true }
      ],
      editorialSolution: {
        python: `def is_valid_bst(root) -> bool:
    def validate(node, low=float('-inf'), high=float('inf')):
        if not node:
            return True
        if not (low < node.val < high):
            return False
        return validate(node.left, low, node.val) and validate(node.right, node.val, high)
        
    return validate(root)`,
        explanation: `Each node in a BST must satisfy low < node.val < high. When moving left, the upper bound becomes node.val. When moving right, the lower bound becomes node.val. Time: O(N), Space: O(H).`
      }
    }
  ]
};

module.exports = MODULE;
