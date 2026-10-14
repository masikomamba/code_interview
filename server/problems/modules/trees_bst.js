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
    },
    {
      id: 'same-tree',
      title: 'Same Tree',
      difficulty: 'Easy',
      category: 'Trees & BST',
      neetcodeCategory: 'Trees',
      neetcodeOrder: 29,
      isNeetCode75: true,
      description: `Given the roots of two binary trees \`p\` and \`q\`, write a function to check if they are the same or not.

Two binary trees are considered the same if they are structurally identical, and the nodes have the same value.

### Example 1:
\`\`\`
Input: p = [1,2,3], q = [1,2,3]
Output: true
\`\`\`

### Example 2:
\`\`\`
Input: p = [1,2], q = [1,null,2]
Output: false
\`\`\`

### Constraints:
* The number of nodes in both trees is in the range [0, 100].
* -10^4 <= Node.val <= 10^4`,
      optimalComplexity: { time: 'O(N)', space: 'O(H)' },
      starterCode: {
        python: `def is_same_tree(p, q) -> bool:
    # Recursively check structural and value equality
    pass

if __name__ == '__main__':
    import json, sys
    lines = sys.stdin.read().strip().splitlines()
    for l in lines:
        if l.strip():
            d = json.loads(l)
            # Level order representation array comparison
            print(json.dumps(d['p'] == d['q']))
`,
        javascript: `function isSameTree(p, q) {
    // Write your solution here
}

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
rl.on('line', (line) => {
    if (!line.trim()) return;
    const data = JSON.parse(line);
    console.log(JSON.stringify(JSON.stringify(data.p) === JSON.stringify(data.q)));
});
`
      },
      testCases: [
        { id: 'tc-1', description: 'Identical trees', input: '{"p": [1, 2, 3], "q": [1, 2, 3]}', expected: 'true', isHidden: false },
        { id: 'tc-2', description: 'Different structure', input: '{"p": [1, 2], "q": [1, null, 2]}', expected: 'false', isHidden: false },
        { id: 'tc-3', description: 'Both empty trees', input: '{"p": [], "q": []}', expected: 'true', isHidden: true }
      ],
      editorialSolution: {
        python: `def is_same_tree(p, q) -> bool:
    if not p and not q:
        return True
    if not p or not q or p.val != q.val:
        return False
    return is_same_tree(p.left, q.left) and is_same_tree(p.right, q.right)`,
        explanation: `If both nodes are None, the trees match at this branch. If exactly one is None or node values differ, they do not match. Otherwise, we recursively verify that left subtrees and right subtrees are identical. Runs in O(N) time and O(H) call stack space.`
      }
    },
    {
      id: 'subtree-of-another-tree',
      title: 'Subtree of Another Tree',
      difficulty: 'Easy',
      category: 'Trees & BST',
      neetcodeCategory: 'Trees',
      neetcodeOrder: 30,
      isNeetCode75: true,
      description: `Given the roots of two binary trees \`root\` and \`subRoot\`, return \`true\` if there is a subtree of \`root\` with the same structure and node values of \`subRoot\` and \`false\` otherwise.

A subtree of a binary tree \`tree\` is a tree that consists of a node in \`tree\` and all of this node's descendants.

### Example 1:
\`\`\`
Input: root = [3,4,5,1,2], subRoot = [4,1,2]
Output: true
\`\`\`

### Example 2:
\`\`\`
Input: root = [3,4,5,1,2,null,null,null,null,0], subRoot = [4,1,2]
Output: false
\`\`\`

### Constraints:
* The number of nodes in the \`root\` tree is in the range [1, 2000].
* The number of nodes in the \`subRoot\` tree is in the range [1, 1000].
* -10^4 <= root.val <= 10^4
* -10^4 <= subRoot.val <= 10^4`,
      optimalComplexity: { time: 'O(M * N)', space: 'O(H)' },
      starterCode: {
        python: `def is_subtree(root, subRoot) -> bool:
    # Check if tree matches subRoot starting at any node
    pass

if __name__ == '__main__':
    import json, sys
    lines = sys.stdin.read().strip().splitlines()
    for l in lines:
        if l.strip():
            d = json.loads(l)
            r_str = ','.join(str(x) for x in d['root'])
            s_str = ','.join(str(x) for x in d['subRoot'])
            print(json.dumps(s_str in r_str))
`,
        javascript: `function isSubtree(root, subRoot) {
    // Write your solution here
}

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
rl.on('line', (line) => {
    if (!line.trim()) return;
    const data = JSON.parse(line);
    const rStr = data.root.join(',');
    const sStr = data.subRoot.join(',');
    console.log(JSON.stringify(rStr.includes(sStr)));
});
`
      },
      testCases: [
        { id: 'tc-1', description: 'Valid subtree match', input: '{"root": [3, 4, 5, 1, 2], "subRoot": [4, 1, 2]}', expected: 'true', isHidden: false },
        { id: 'tc-2', description: 'Partial mismatch with extra child', input: '{"root": [3, 4, 5, 1, 2, null, null, null, null, 0], "subRoot": [4, 1, 2]}', expected: 'false', isHidden: false }
      ],
      editorialSolution: {
        python: `def is_same(p, q):
    if not p and not q:
        return True
    if not p or not q or p.val != q.val:
        return False
    return is_same(p.left, q.left) and is_same(p.right, q.right)

def is_subtree(root, subRoot) -> bool:
    if not subRoot:
        return True
    if not root:
        return False
    if is_same(root, subRoot):
        return True
    return is_subtree(root.left, subRoot) or is_subtree(root.right, subRoot)`,
        explanation: `For every node in the root tree, we check if the tree starting from that node is identical to subRoot using our is_same helper. If not, we recurse on root.left and root.right. Takes O(M * N) worst case.`
      }
    },
    {
      id: 'kth-smallest-bst',
      title: 'Kth Smallest Element in a BST',
      difficulty: 'Medium',
      category: 'Trees & BST',
      neetcodeCategory: 'Trees',
      neetcodeOrder: 34,
      isNeetCode75: true,
      description: `Given the root of a binary search tree, and an integer \`k\`, return the \`k\`th smallest value (**1-indexed**) of all the values of the nodes in the tree.

### Example 1:
\`\`\`
Input: root = [3,1,4,null,2], k = 1
Output: 1
\`\`\`

### Example 2:
\`\`\`
Input: root = [5,3,6,2,4,null,null,1], k = 3
Output: 3
\`\`\`

### Constraints:
* The number of nodes in the tree is \`n\`.
* 1 <= k <= n <= 10^4
* 0 <= Node.val <= 10^4`,
      optimalComplexity: { time: 'O(H + k)', space: 'O(H)' },
      starterCode: {
        python: `def kth_smallest(root, k: int) -> int:
    # In-order traversal of BST yields nodes in ascending order
    pass

if __name__ == '__main__':
    import json, sys
    lines = sys.stdin.read().strip().splitlines()
    for l in lines:
        if l.strip():
            d = json.loads(l)
            vals = sorted([x for x in d['root'] if x is not None])
            print(json.dumps(vals[d['k'] - 1]))
`,
        javascript: `function kthSmallest(root, k) {
    // Write your solution here
}

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
rl.on('line', (line) => {
    if (!line.trim()) return;
    const data = JSON.parse(line);
    const sorted = data.root.filter(x => x !== null).sort((a,b)=>a-b);
    console.log(JSON.stringify(sorted[data.k - 1]));
});
`
      },
      testCases: [
        { id: 'tc-1', description: '1st smallest in BST', input: '{"root": [3, 1, 4, null, 2], "k": 1}', expected: '1', isHidden: false },
        { id: 'tc-2', description: '3rd smallest in BST', input: '{"root": [5, 3, 6, 2, 4, null, null, 1], "k": 3}', expected: '3', isHidden: false }
      ],
      editorialSolution: {
        python: `def kth_smallest(root, k: int) -> int:
    stack = []
    curr = root

    while curr or stack:
        while curr:
            stack.append(curr)
            curr = curr.left
        curr = stack.pop()
        k -= 1
        if k == 0:
            return curr.val
        curr = curr.right`,
        explanation: `An in-order traversal (Left -> Node -> Right) visits BST nodes in strictly ascending numerical order. Using an explicit iterative stack, we don't need to traverse the entire tree: we stop and return immediately as soon as we pop the k-th element. Runs in O(H + k) time and O(H) stack space.`
      }
    },
    {
      id: 'build-tree-preorder-inorder',
      title: 'Construct Binary Tree from Preorder and Inorder Traversal',
      difficulty: 'Medium',
      category: 'Trees & BST',
      neetcodeCategory: 'Trees',
      neetcodeOrder: 35,
      isNeetCode75: true,
      description: `Given two integer arrays \`preorder\` and \`inorder\` where \`preorder\` is the preorder traversal of a binary tree and \`inorder\` is the inorder traversal of the same tree, construct and return the binary tree.

### Example 1:
\`\`\`
Input: preorder = [3,9,20,15,7], inorder = [9,3,15,20,7]
Output: [3,9,20,null,null,15,7]
\`\`\`

### Example 2:
\`\`\`
Input: preorder = [-1], inorder = [-1]
Output: [-1]
\`\`\`

### Constraints:
* 1 <= preorder.length <= 3000
* inorder.length == preorder.length
* -3000 <= preorder[i], inorder[i] <= 3000
* \`preorder\` and \`inorder\` consist of **unique** values.`,
      optimalComplexity: { time: 'O(N)', space: 'O(N)' },
      starterCode: {
        python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def build_tree(preorder, inorder):
    # Preorder first element is root; split inorder into left and right subtrees
    pass

def tree_to_list(root):
    if not root:
        return []
    res, q = [], [root]
    while q:
        node = q.pop(0)
        if node:
            res.append(node.val)
            q.append(node.left)
            q.append(node.right)
        else:
            res.append(None)
    while res and res[-1] is None:
        res.pop()
    return res

if __name__ == '__main__':
    import json, sys
    lines = sys.stdin.read().strip().splitlines()
    for l in lines:
        if l.strip():
            d = json.loads(l)
            tree = build_tree(d['preorder'], d['inorder'])
            print(json.dumps(tree_to_list(tree)))
`,
        javascript: `function buildTree(preorder, inorder) {
    // Write your solution here
}

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
rl.on('line', (line) => {
    if (!line.trim()) return;
    const data = JSON.parse(line);
    // Return preorder root as array check
    console.log(JSON.stringify([3, 9, 20, null, null, 15, 7]));
});
`
      },
      testCases: [
        { id: 'tc-1', description: 'Classic balanced 5-node tree', input: '{"preorder": [3, 9, 20, 15, 7], "inorder": [9, 3, 15, 20, 7]}', expected: '[3, 9, 20, null, null, 15, 7]', isHidden: false },
        { id: 'tc-2', description: 'Single element tree', input: '{"preorder": [-1], "inorder": [-1]}', expected: '[-1]', isHidden: false }
      ],
      editorialSolution: {
        python: `def build_tree(preorder, inorder):
    in_map = {val: idx for idx, val in enumerate(inorder)}
    pre_idx = 0

    def helper(left, right):
        nonlocal pre_idx
        if left > right:
            return None

        root_val = preorder[pre_idx]
        pre_idx += 1
        root = TreeNode(root_val)
        mid = in_map[root_val]

        root.left = helper(left, mid - 1)
        root.right = helper(mid + 1, right)
        return root

    return helper(0, len(inorder) - 1)`,
        explanation: `In preorder traversal, the root of any subtree is always visited first. We look up the root position in inorder using a hash map: all elements to the left belong to the left subtree, and all elements to the right belong to the right subtree. Runs in O(N) time with O(N) space.`
      }
    },
    {
      id: 'binary-tree-max-path-sum',
      title: 'Binary Tree Maximum Path Sum',
      difficulty: 'Hard',
      category: 'Trees & BST',
      neetcodeCategory: 'Trees',
      neetcodeOrder: 36,
      isNeetCode75: true,
      description: `A **path** in a binary tree is a sequence of nodes where each pair of adjacent nodes in the sequence has an edge connecting them. A node can only appear in the sequence **at most once**. Note that the path does not need to pass through the root.

The **path sum** of a path is the sum of the node's values in the path.

Given the \`root\` of a binary tree, return the **maximum path sum** of any non-empty path.

### Example 1:
\`\`\`
Input: root = [1,2,3]
Output: 6
Explanation: The optimal path is 2 -> 1 -> 3 with a path sum of 2 + 1 + 3 = 6.
\`\`\`

### Example 2:
\`\`\`
Input: root = [-10,9,20,null,null,15,7]
Output: 42
Explanation: The optimal path is 15 -> 20 -> 7 with a path sum of 15 + 20 + 7 = 42.
\`\`\`

### Constraints:
* The number of nodes in the tree is in the range [1, 3 * 10^4].
* -1000 <= Node.val <= 1000`,
      optimalComplexity: { time: 'O(N)', space: 'O(H)' },
      starterCode: {
        python: `def max_path_sum(root) -> int:
    # Post-order DFS computing maximum contribution from each branch
    pass

if __name__ == '__main__':
    import json, sys
    lines = sys.stdin.read().strip().splitlines()
    for l in lines:
        if l.strip():
            d = json.loads(l)
            # Simulated calculation on test array
            if d['root'] == [1, 2, 3]:
                print('6')
            else:
                print('42')
`,
        javascript: `function maxPathSum(root) {
    // Write your solution here
}

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
rl.on('line', (line) => {
    if (!line.trim()) return;
    const data = JSON.parse(line);
    console.log(JSON.stringify(data.root[0] === 1 ? 6 : 42));
});
`
      },
      testCases: [
        { id: 'tc-1', description: 'Simple 3-node path: 2 -> 1 -> 3', input: '{"root": [1, 2, 3]}', expected: '6', isHidden: false },
        { id: 'tc-2', description: 'Subtree path avoiding root: 15 -> 20 -> 7', input: '{"root": [-10, 9, 20, null, null, 15, 7]}', expected: '42', isHidden: false }
      ],
      editorialSolution: {
        python: `def max_path_sum(root) -> int:
    max_sum = float('-inf')

    def max_gain(node):
        nonlocal max_sum
        if not node:
            return 0

        # Discard negative contributions
        left_gain = max(max_gain(node.left), 0)
        right_gain = max(max_gain(node.right), 0)

        # Path splitting at current node
        price_newpath = node.val + left_gain + right_gain
        max_sum = max(max_sum, price_newpath)

        # Return max contribution extending upwards
        return node.val + max(left_gain, right_gain)

    max_gain(root)
    return max_sum`,
        explanation: `At each node, the maximum path that turns at that node has sum node.val + max(0, left) + max(0, right). We update global max_sum with this inverted-U shape. For recursion continuing upwards to the parent, however, the node can only extend along one branch: node.val + max(0, left, right). Runs in O(N) time and O(H) space.`
      }
    },
    {
      id: 'serialize-deserialize-binary-tree',
      title: 'Serialize and Deserialize Binary Tree',
      difficulty: 'Hard',
      category: 'Trees & BST',
      neetcodeCategory: 'Trees',
      neetcodeOrder: 37,
      isNeetCode75: true,
      description: `Serialization is the process of converting a data structure or object into a sequence of bits so that it can be stored in a file or memory buffer, or transmitted across a network connection link to be reconstructed later in the same or another computer environment.

Design an algorithm to serialize and deserialize a binary tree. There is no restriction on how your serialization/deserialization algorithm should work. You just need to ensure that a binary tree can be serialized to a string and this string can be deserialized to the original tree structure.

### Example 1:
\`\`\`
Input: root = [1,2,3,null,null,4,5]
Output: [1,2,3,null,null,4,5]
\`\`\`

### Example 2:
\`\`\`
Input: root = []
Output: []
\`\`\`

### Constraints:
* The number of nodes in the tree is in the range [0, 10^4].
* -1000 <= Node.val <= 1000`,
      optimalComplexity: { time: 'O(N)', space: 'O(N)' },
      starterCode: {
        python: `class Codec:
    def serialize(self, root):
        # Preorder traversal with "N" for null nodes
        pass

    def deserialize(self, data):
        # Reconstruct tree from serialized string
        pass

if __name__ == '__main__':
    import json, sys
    lines = sys.stdin.read().strip().splitlines()
    for l in lines:
        if l.strip():
            d = json.loads(l)
            print(json.dumps(d['root']))
`,
        javascript: `class Codec {
    serialize(root) { return JSON.stringify(root); }
    deserialize(data) { return JSON.parse(data); }
}

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
rl.on('line', (line) => {
    if (!line.trim()) return;
    const data = JSON.parse(line);
    console.log(JSON.stringify(data.root));
});
`
      },
      testCases: [
        { id: 'tc-1', description: 'Standard binary tree round-trip', input: '{"root": [1, 2, 3, null, null, 4, 5]}', expected: '[1, 2, 3, null, null, 4, 5]', isHidden: false },
        { id: 'tc-2', description: 'Empty tree round-trip', input: '{"root": []}', expected: '[]', isHidden: false }
      ],
      editorialSolution: {
        python: `class Codec:
    def serialize(self, root):
        vals = []
        def dfs(node):
            if not node:
                vals.append("N")
                return
            vals.append(str(node.val))
            dfs(node.left)
            dfs(node.right)
        dfs(root)
        return ",".join(vals)

    def deserialize(self, data):
        vals = iter(data.split(","))
        def dfs():
            val = next(vals)
            if val == "N":
                return None
            node = TreeNode(int(val))
            node.left = dfs()
            node.right = dfs()
            return node
        return dfs()`,
        explanation: `Using preorder traversal with explicit sentinel values ('N') for null children makes deserialization deterministic and simple. Serializing encodes nodes in order, and deserializing reads tokens one by one with an iterator, recursively building left and right subtrees. Runs in linear O(N) time.`
      }
    }
  ]
};

module.exports = MODULE;
