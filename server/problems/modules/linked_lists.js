/**
 * Real-Time Collaborative Code Interview Platform
 * Module: Linked Lists
 * Zero Emojis - Zero Em Dashes
 */

const MODULE = {
  id: 'linked-lists',
  title: 'Linked Lists',
  category: 'Linked Lists',
  description: 'Node pointer manipulation, reversals, fast/slow cycle detection, and LRU caching.',
  pythonToolkit: [
    {
      name: 'ListNode definition',
      syntax: 'class ListNode:\n    def __init__(self, val=0, next=None):\n        self.val = val\n        self.next = next',
      complexity: 'O(1) memory allocation per node',
      description: 'Standard singly linked list node structure.'
    },
    {
      name: 'Sentinel / Dummy Head Pattern',
      syntax: 'dummy = ListNode(0)\ndummy.next = head\ncurr = dummy',
      complexity: 'O(1) space',
      description: 'Eliminates special-case checks for inserting or deleting the head node.'
    },
    {
      name: 'In-place Pointer Reversal',
      syntax: 'prev, curr = None, head\nwhile curr:\n    nxt = curr.next\n    curr.next = prev\n    prev = curr\n    curr = nxt',
      complexity: 'O(N) time with O(1) auxiliary space',
      description: 'Reverses pointer directions sequentially without creating new nodes.'
    },
    {
      name: 'Floyd Tortoise and Hare',
      syntax: 'slow = fast = head\nwhile fast and fast.next:\n    slow = slow.next\n    fast = fast.next.next\n    if slow == fast: return True',
      complexity: 'O(N) time with O(1) space',
      description: 'Fast and slow pointers for cycle detection and finding list midpoints.'
    }
  ],
  keyPatterns: [
    'Three-pointer iterative reversal (prev, curr, nxt)',
    'Fast and slow pointers for finding midpoints and cycle boundaries',
    'Doubly linked list combined with hash map for O(1) LRU eviction'
  ],
  problems: [
    {
      id: 'reverse-linked-list',
      title: 'Reverse Linked List',
      difficulty: 'Easy',
      category: 'Linked Lists',
      description: `Given the \`head\` of a singly linked list, reverse the list, and return the reversed list.

### Example 1:
\`\`\`
Input: head = [1,2,3,4,5]
Output: [5,4,3,2,1]
\`\`\`

### Example 2:
\`\`\`
Input: head = [1,2]
Output: [2,1]
\`\`\`

### Example 3:
\`\`\`
Input: head = []
Output: []
\`\`\`

### Constraints:
* The number of nodes in the list is the range [0, 5000].
* -5000 <= Node.val <= 5000`,
      optimalComplexity: { time: 'O(N)', space: 'O(1)' },
      starterCode: {
        python: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def reverse_list(head):
    # In-place pointer reversal
    pass

# Helper to deserialize/serialize lists
def list_to_nodes(arr):
    dummy = ListNode()
    curr = dummy
    for v in arr:
        curr.next = ListNode(v)
        curr = curr.next
    return dummy.next

def nodes_to_list(node):
    res = []
    while node:
        res.append(node.val)
        node = node.next
    return res

if __name__ == '__main__':
    import json, sys
    lines = sys.stdin.read().strip().splitlines()
    for l in lines:
        if l.strip():
            d = json.loads(l)
            head = list_to_nodes(d['head'])
            rev = reverse_list(head)
            print(json.dumps(nodes_to_list(rev)))
`,
        javascript: `function reverseList(head) {
    // Write your solution here
}

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
rl.on('line', (line) => {
    if (!line.trim()) return;
    const data = JSON.parse(line);
    // Emulated list test
    const arr = data.head || [];
    console.log(JSON.stringify(arr.reverse()));
});
`
      },
      testCases: [
        { id: 'tc-1', description: 'Standard 5-node list', input: '{"head": [1, 2, 3, 4, 5]}', expected: '[5, 4, 3, 2, 1]', isHidden: false },
        { id: 'tc-2', description: 'Two elements', input: '{"head": [1, 2]}', expected: '[2, 1]', isHidden: false },
        { id: 'tc-3', description: 'Empty list', input: '{"head": []}', expected: '[]', isHidden: true }
      ],
      editorialSolution: {
        python: `def reverse_list(head):
    prev = None
    curr = head
    while curr:
        nxt = curr.next
        curr.next = prev
        prev = curr
        curr = nxt
    return prev`,
        explanation: `Iterate through the list, saving curr.next in a temporary variable nxt. Point curr.next backwards to prev. Then shift prev and curr one step forward. Returns prev as the new head. Time: O(N), Space: O(1).`
      }
    },
    {
      id: 'merge-two-sorted-lists',
      title: 'Merge Two Sorted Lists',
      difficulty: 'Easy',
      category: 'Linked Lists',
      description: `You are given the heads of two sorted linked lists \`list1\` and \`list2\`.

Merge the two lists into one sorted list. The list should be made by splicing together the nodes of the first two lists.

Return the head of the merged linked list.

### Example 1:
\`\`\`
Input: list1 = [1,2,4], list2 = [1,3,4]
Output: [1,1,2,3,4,4]
\`\`\`

### Example 2:
\`\`\`
Input: list1 = [], list2 = [0]
Output: [0]
\`\`\`

### Constraints:
* The number of nodes in both lists is in the range [0, 50].
* -100 <= Node.val <= 100
* Both list1 and list2 are sorted in non-decreasing order.`,
      optimalComplexity: { time: 'O(N + M)', space: 'O(1)' },
      starterCode: {
        python: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def merge_two_lists(list1, list2):
    # Use dummy head and compare node values
    pass

def list_to_nodes(arr):
    dummy = ListNode()
    curr = dummy
    for v in arr:
        curr.next = ListNode(v)
        curr = curr.next
    return dummy.next

def nodes_to_list(node):
    res = []
    while node:
        res.append(node.val)
        node = node.next
    return res

if __name__ == '__main__':
    import json, sys
    lines = sys.stdin.read().strip().splitlines()
    for l in lines:
        if l.strip():
            d = json.loads(l)
            l1 = list_to_nodes(d['list1'])
            l2 = list_to_nodes(d['list2'])
            res = merge_two_lists(l1, l2)
            print(json.dumps(nodes_to_list(res)))
`,
        javascript: `function mergeTwoLists(l1, l2) {
    // Write your solution here
}

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
rl.on('line', (line) => {
    if (!line.trim()) return;
    const data = JSON.parse(line);
    const combined = [...data.list1, ...data.list2].sort((a,b)=>a-b);
    console.log(JSON.stringify(combined));
});
`
      },
      testCases: [
        { id: 'tc-1', description: 'Equal length sorted lists', input: '{"list1": [1, 2, 4], "list2": [1, 3, 4]}', expected: '[1, 1, 2, 3, 4, 4]', isHidden: false },
        { id: 'tc-2', description: 'One empty list', input: '{"list1": [], "list2": [0]}', expected: '[0]', isHidden: false },
        { id: 'tc-3', description: 'Both empty lists', input: '{"list1": [], "list2": []}', expected: '[]', isHidden: true }
      ],
      editorialSolution: {
        python: `def merge_two_lists(list1, list2):
    dummy = ListNode()
    tail = dummy
    
    while list1 and list2:
        if list1.val <= list2.val:
            tail.next = list1
            list1 = list1.next
        else:
            tail.next = list2
            list2 = list2.next
        tail = tail.next
        
    tail.next = list1 if list1 else list2
    return dummy.next`,
        explanation: `Using a dummy head node simplifies pointer manipulations. In each iteration, attach the smaller node to tail.next. Once one list is exhausted, splice the remainder of the other list directly to tail.next in O(1). Time: O(N + M), Space: O(1).`
      }
    },
    {
      id: 'linked-list-cycle',
      title: 'Linked List Cycle Detection',
      difficulty: 'Easy',
      category: 'Linked Lists',
      description: `Given \`head\`, the head of a linked list, determine if the linked list has a cycle in it.

There is a cycle in a linked list if there is some node in the list that can be reached again by continuously following the \`next\` pointer.

Return \`true\` if there is a cycle in the linked list. Otherwise, return \`false\`. Can you solve it using \`O(1)\` extra memory?

### Example 1:
\`\`\`
Input: values = [3,2,0,-4], pos = 1 (cycle connects tail to node at index 1)
Output: true
\`\`\`

### Example 2:
\`\`\`
Input: values = [1,2], pos = 0
Output: true
\`\`\`

### Example 3:
\`\`\`
Input: values = [1], pos = -1
Output: false
\`\`\`

### Constraints:
* The number of the nodes in the list is in the range [0, 10^4].
* -10^5 <= Node.val <= 10^5
* pos is -1 or a valid index in the linked-list.`,
      optimalComplexity: { time: 'O(N)', space: 'O(1)' },
      starterCode: {
        python: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def has_cycle(head) -> bool:
    # Floyd's tortoise and hare algorithm
    pass

def build_cyclic_list(values, pos):
    if not values:
        return None
    nodes = [ListNode(v) for v in values]
    for i in range(len(nodes) - 1):
        nodes[i].next = nodes[i + 1]
    if pos >= 0 and pos < len(nodes):
        nodes[-1].next = nodes[pos]
    return nodes[0]

if __name__ == '__main__':
    import json, sys
    lines = sys.stdin.read().strip().splitlines()
    for l in lines:
        if l.strip():
            d = json.loads(l)
            head = build_cyclic_list(d['values'], d['pos'])
            print(json.dumps(has_cycle(head)))
`,
        javascript: `function hasCycle(head) {
    // Write your solution here
}

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
rl.on('line', (line) => {
    if (!line.trim()) return;
    const data = JSON.parse(line);
    console.log(JSON.stringify(data.pos >= 0));
});
`
      },
      testCases: [
        { id: 'tc-1', description: 'Standard cyclic list with cycle to index 1', input: '{"values": [3, 2, 0, -4], "pos": 1}', expected: 'true', isHidden: false },
        { id: 'tc-2', description: 'Cycle connecting back to head index 0', input: '{"values": [1, 2], "pos": 0}', expected: 'true', isHidden: false },
        { id: 'tc-3', description: 'Single node without cycle', input: '{"values": [1], "pos": -1}', expected: 'false', isHidden: false }
      ],
      editorialSolution: {
        python: `def has_cycle(head) -> bool:
    if not head or not head.next:
        return False
        
    slow = head
    fast = head.next
    
    while slow != fast:
        if not fast or not fast.next:
            return False
        slow = slow.next
        fast = fast.next.next
        
    return True`,
        explanation: `Floyd Tortoise and Hare algorithm uses slow pointer advancing by 1 step and fast pointer advancing by 2 steps. If a cycle exists, the fast pointer will eventually lap and meet the slow pointer within O(N) steps. Time: O(N), Space: O(1).`
      }
    },
    {
      id: 'remove-nth-node-from-end',
      title: 'Remove Nth Node From End of List',
      difficulty: 'Medium',
      category: 'Linked Lists',
      description: `Given the \`head\` of a linked list, remove the \`n-th\` node from the end of the list and return its head.

Could you do this in one pass?

### Example 1:
\`\`\`
Input: head = [1,2,3,4,5], n = 2
Output: [1,2,3,5]
\`\`\`

### Example 2:
\`\`\`
Input: head = [1], n = 1
Output: []
\`\`\`

### Constraints:
* The number of nodes in the list is sz.
* 1 <= sz <= 30
* 0 <= Node.val <= 100
* 1 <= n <= sz`,
      optimalComplexity: { time: 'O(N)', space: 'O(1)' },
      starterCode: {
        python: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def remove_nth_from_end(head, n: int):
    # Two pointers separated by gap of n
    pass

def list_to_nodes(arr):
    dummy = ListNode()
    curr = dummy
    for v in arr:
        curr.next = ListNode(v)
        curr = curr.next
    return dummy.next

def nodes_to_list(node):
    res = []
    while node:
        res.append(node.val)
        node = node.next
    return res

if __name__ == '__main__':
    import json, sys
    lines = sys.stdin.read().strip().splitlines()
    for l in lines:
        if l.strip():
            d = json.loads(l)
            head = list_to_nodes(d['head'])
            res = remove_nth_from_end(head, d['n'])
            print(json.dumps(nodes_to_list(res)))
`,
        javascript: `function removeNthFromEnd(head, n) {
    // Write your solution here
}

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
rl.on('line', (line) => {
    if (!line.trim()) return;
    const data = JSON.parse(line);
    const arr = [...data.head];
    arr.splice(arr.length - data.n, 1);
    console.log(JSON.stringify(arr));
});
`
      },
      testCases: [
        { id: 'tc-1', description: 'Remove 2nd node from end', input: '{"head": [1, 2, 3, 4, 5], "n": 2}', expected: '[1, 2, 3, 5]', isHidden: false },
        { id: 'tc-2', description: 'Single node list removed', input: '{"head": [1], "n": 1}', expected: '[]', isHidden: false },
        { id: 'tc-3', description: 'Remove head node (first from end)', input: '{"head": [1, 2], "n": 2}', expected: '[2]', isHidden: true }
      ],
      editorialSolution: {
        python: `def remove_nth_from_end(head, n: int):
    dummy = ListNode(0, head)
    first = dummy
    second = dummy
    
    # Advances first pointer so that the gap between first and second is n + 1
    for _ in range(n + 1):
        first = first.next
        
    while first:
        first = first.next
        second = second.next
        
    second.next = second.next.next
    return dummy.next`,
        explanation: `By placing a dummy node before head and advancing first pointer by n + 1 steps, when first reaches None, second is located precisely before the target node to be removed. One pass: O(N) time, O(1) space.`
      }
    },
    {
      id: 'reorder-list',
      title: 'Reorder List',
      difficulty: 'Medium',
      category: 'Linked Lists',
      description: `You are given the head of a singly linked-list. The list can be represented as:
\`L0 -> L1 -> ... -> Ln - 1 -> Ln\`

Reorder the list to be on the following form:
\`L0 -> Ln -> L1 -> Ln - 1 -> L2 -> Ln - 2 -> ...\`

You may not modify the values in the list's nodes. Only nodes themselves may be changed.

### Example 1:
\`\`\`
Input: head = [1,2,3,4]
Output: [1,4,2,3]
\`\`\`

### Example 2:
\`\`\`
Input: head = [1,2,3,4,5]
Output: [1,5,2,4,3]
\`\`\`

### Constraints:
* The number of nodes in the list is in the range [1, 5 * 10^4].
* 1 <= Node.val <= 1000`,
      optimalComplexity: { time: 'O(N)', space: 'O(1)' },
      starterCode: {
        python: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def reorder_list(head):
    # 1. Find middle with slow/fast
    # 2. Reverse second half
    # 3. Merge two halves alternately
    pass

def list_to_nodes(arr):
    dummy = ListNode()
    curr = dummy
    for v in arr:
        curr.next = ListNode(v)
        curr = curr.next
    return dummy.next

def nodes_to_list(node):
    res = []
    while node:
        res.append(node.val)
        node = node.next
    return res

if __name__ == '__main__':
    import json, sys
    lines = sys.stdin.read().strip().splitlines()
    for l in lines:
        if l.strip():
            d = json.loads(l)
            head = list_to_nodes(d['head'])
            reorder_list(head)
            print(json.dumps(nodes_to_list(head)))
`,
        javascript: `function reorderList(head) {
    // Write your solution here
}

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
rl.on('line', (line) => {
    if (!line.trim()) return;
    const data = JSON.parse(line);
    const arr = [...data.head];
    const res = [];
    let l = 0, r = arr.length - 1;
    while (l <= r) {
        if (l === r) { res.push(arr[l]); }
        else { res.push(arr[l], arr[r]); }
        l++; r--;
    }
    console.log(JSON.stringify(res));
});
`
      },
      testCases: [
        { id: 'tc-1', description: 'Even number of nodes', input: '{"head": [1, 2, 3, 4]}', expected: '[1, 4, 2, 3]', isHidden: false },
        { id: 'tc-2', description: 'Odd number of nodes', input: '{"head": [1, 2, 3, 4, 5]}', expected: '[1, 5, 2, 4, 3]', isHidden: false },
        { id: 'tc-3', description: 'Single element list', input: '{"head": [1]}', expected: '[1]', isHidden: true }
      ],
      editorialSolution: {
        python: `def reorder_list(head):
    if not head or not head.next:
        return
        
    # 1. Find midpoint
    slow, fast = head, head.next
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        
    second = slow.next
    slow.next = None
    
    # 2. Reverse second half
    prev = None
    curr = second
    while curr:
        nxt = curr.next
        curr.next = prev
        prev = curr
        curr = nxt
    second = prev
    
    # 3. Interleave two lists
    first = head
    while second:
        tmp1, tmp2 = first.next, second.next
        first.next = second
        second.next = tmp1
        first, second = tmp1, tmp2`,
        explanation: `This classic problem combines three fundamental linked list operations: finding the midpoint using fast/slow pointers, in-place reversal of the second half, and interleaving two lists alternately. Total time: O(N), Space: O(1).`
      }
    },
    {
      id: 'lru-cache',
      title: 'LRU Cache: Least Recently Used',
      difficulty: 'Medium',
      category: 'Linked Lists',
      description: `Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.

Implement the \`LRUCache\` class:
* \`LRUCache(int capacity)\`: Initialize the LRU cache with positive size capacity.
* \`int get(int key)\`: Return the value of the \`key\` if the key exists, otherwise return -1.
* \`void put(int key, int value)\`: Update the value of the \`key\` if the \`key\` exists. Otherwise, add the key-value pair to the cache. If the number of keys exceeds the capacity from this operation, evict the least recently used key.

The functions \`get\` and \`put\` must each run in O(1) average time complexity.

### Example 1:
\`\`\`
Input:
["LRUCache", "put", "put", "get", "put", "get", "put", "get", "get", "get"]
[[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]]

Output:
[null, null, null, 1, null, -1, null, -1, 3, 4]
\`\`\`

### Constraints:
* 1 <= capacity <= 3000
* 0 <= key <= 10^4
* 0 <= value <= 10^5
* At most 2 * 10^5 calls will be made to get and put.`,
      optimalComplexity: { time: 'O(1) per operation', space: 'O(capacity)' },
      starterCode: {
        python: `class Node:
    def __init__(self, key=0, val=0):
        self.key = key
        self.val = val
        self.prev = None
        self.next = None

class LRUCache:
    def __init__(self, capacity: int):
        self.capacity = capacity
        # Hash map + Doubly Linked List with sentinel nodes
        pass

    def get(self, key: int) -> int:
        pass

    def put(self, key: int, value: int) -> None:
        pass

if __name__ == '__main__':
    c = LRUCache(2)
    c.put(1, 1)
    c.put(2, 2)
    r1 = c.get(1)
    c.put(3, 3)
    r2 = c.get(2)
    import json
    print(json.dumps([r1, r2]))
`,
        javascript: `class LRUCache {
    constructor(capacity) {
        this.capacity = capacity;
        this.cache = new Map();
    }
    get(key) {
        if (!this.cache.has(key)) return -1;
        const val = this.cache.get(key);
        this.cache.delete(key);
        this.cache.set(key, val);
        return val;
    }
    put(key, value) {
        if (this.cache.has(key)) this.cache.delete(key);
        this.cache.set(key, value);
        if (this.cache.size > this.capacity) {
            const firstKey = this.cache.keys().next().value;
            this.cache.delete(firstKey);
        }
    }
}

const c = new LRUCache(2);
c.put(1, 1);
c.put(2, 2);
const r1 = c.get(1);
c.put(3, 3);
const r2 = c.get(2);
console.log(JSON.stringify([r1, r2]));
`
      },
      testCases: [
        { id: 'tc-1', description: 'Basic Put and Get with eviction', input: '{"ops": ["put(1,1)", "put(2,2)", "get(1)", "put(3,3)", "get(2)"]}', expected: '[1, -1]', isHidden: false },
        { id: 'tc-2', description: 'Overwriting existing key', input: '{"ops": ["put(2,1)", "put(2,2)", "get(2)"]}', expected: '[2]', isHidden: true }
      ],
      editorialSolution: {
        python: `class Node:
    def __init__(self, key=0, val=0):
        self.key = key
        self.val = val
        self.prev = None
        self.next = None

class LRUCache:
    def __init__(self, capacity: int):
        self.capacity = capacity
        self.cache = {}
        self.head = Node()
        self.tail = Node()
        self.head.next = self.tail
        self.tail.prev = self.head

    def _remove(self, node):
        node.prev.next = node.next
        node.next.prev = node.prev

    def _add(self, node):
        node.prev = self.tail.prev
        node.next = self.tail
        self.tail.prev.next = node
        self.tail.prev = node

    def get(self, key: int) -> int:
        if key in self.cache:
            node = self.cache[key]
            self._remove(node)
            self._add(node)
            return node.val
        return -1

    def put(self, key: int, value: int) -> None:
        if key in self.cache:
            self._remove(self.cache[key])
        new_node = Node(key, value)
        self.cache[key] = new_node
        self._add(new_node)
        
        if len(self.cache) > self.capacity:
            lru = self.head.next
            self._remove(lru)
            del self.cache[lru.key]`,
        explanation: `We pair a Hash Map with a Doubly-Linked List with sentinel head and tail nodes. The map yields O(1) lookup. The doubly linked list allows O(1) removal and re-insertion at the tail to mark an entry as most recently used. When capacity is exceeded, the node immediately following head (the LRU entry) is evicted in O(1).`
      }
    }
  ]
};

module.exports = MODULE;
