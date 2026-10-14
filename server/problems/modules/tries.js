/**
 * Real-Time Collaborative Code Interview Platform
 * Module: Tries (Prefix Trees)
 * Zero Emojis - Zero Em Dashes
 */

const MODULE = {
  id: 'tries',
  title: 'Tries',
  category: 'Tries',
  description: 'Prefix tree data structures for efficient prefix lookup, word search, and autocomplete.',
  pythonToolkit: [
    {
      name: 'TrieNode via dict',
      syntax: 'class TrieNode:\n    def __init__(self):\n        self.children = {}\n        self.is_end = False',
      complexity: 'O(1) child insert/lookup',
      description: 'Dictionary-backed Trie nodes allow arbitrary character alphabets.'
    },
    {
      name: 'Prefix traversal',
      syntax: 'curr = self.root\nfor ch in word:\n    if ch not in curr.children:\n        return False\n    curr = curr.children[ch]',
      complexity: 'O(L) where L is prefix length',
      description: 'Standard traversal along character links.'
    }
  ],
  keyPatterns: [
    'Character branching with terminal boolean flag',
    'Prefix search vs exact word match verification',
    'Backtracking with Trie pruning on 2D grid'
  ],
  problems: [
    {
      id: 'implement-trie',
      title: 'Implement Trie (Prefix Tree)',
      difficulty: 'Medium',
      category: 'Tries',
      neetcodeCategory: 'Tries',
      neetcodeOrder: 38,
      isNeetCode75: true,
      description: `A **trie** (pronounced as "try") or **prefix tree** is a tree data structure used to efficiently store and retrieve keys in a dataset of strings. There are various applications of this data structure, such as autocomplete and spellchecker.

Implement the Trie class:
* \`Trie()\` Initializes the trie object.
* \`void insert(String word)\` Inserts the string \`word\` into the trie.
* \`boolean search(String word)\` Returns \`true\` if the string \`word\` is in the trie (i.e., was inserted before), and \`false\` otherwise.
* \`boolean startsWith(String prefix)\` Returns \`true\` if there is a previously inserted string \`word\` that has the prefix \`prefix\`, and \`false\` otherwise.

### Example:
\`\`\`
Operations: ["insert", "search", "search", "startsWith", "insert", "search"]
Arguments: [["apple"], ["apple"], ["app"], ["app"], ["app"], ["app"]]
Output: [null, true, false, true, null, true]
\`\`\`

### Constraints:
* 1 <= word.length, prefix.length <= 2000
* \`word\` and \`prefix\` consist only of lowercase English letters.
* At most 3 * 10^4 calls in total will be made to insert, search, and startsWith.`,
      optimalComplexity: { time: 'O(L) per operation', space: 'O(Total Characters)' },
      starterCode: {
        python: `class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end = False

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word: str) -> None:
        curr = self.root
        for ch in word:
            if ch not in curr.children:
                curr.children[ch] = TrieNode()
            curr = curr.children[ch]
        curr.is_end = True

    def search(self, word: str) -> bool:
        curr = self.root
        for ch in word:
            if ch not in curr.children:
                return False
            curr = curr.children[ch]
        return curr.is_end

    def startsWith(self, prefix: str) -> bool:
        curr = self.root
        for ch in prefix:
            if ch not in curr.children:
                return False
            curr = curr.children[ch]
        return True

def run_operations(ops, args):
    trie = Trie()
    res = []
    for op, arg in zip(ops, args):
        if op == 'insert':
            trie.insert(arg[0])
            res.append(None)
        elif op == 'search':
            res.append(trie.search(arg[0]))
        elif op == 'startsWith':
            res.append(trie.startsWith(arg[0]))
    return res

if __name__ == '__main__':
    import json, sys
    lines = sys.stdin.read().strip().splitlines()
    for l in lines:
        if l.strip():
            d = json.loads(l)
            print(json.dumps(run_operations(d['ops'], d['args'])))
`,
        javascript: `class TrieNode {
    constructor() {
        this.children = {};
        this.isEnd = false;
    }
}

class Trie {
    constructor() {
        this.root = new TrieNode();
    }
    insert(word) {
        let curr = this.root;
        for (const ch of word) {
            if (!curr.children[ch]) curr.children[ch] = new TrieNode();
            curr = curr.children[ch];
        }
        curr.isEnd = true;
    }
    search(word) {
        let curr = this.root;
        for (const ch of word) {
            if (!curr.children[ch]) return false;
            curr = curr.children[ch];
        }
        return curr.isEnd;
    }
    startsWith(prefix) {
        let curr = this.root;
        for (const ch of prefix) {
            if (!curr.children[ch]) return false;
            curr = curr.children[ch];
        }
        return true;
    }
}

function runOperations(ops, args) {
    const trie = new Trie();
    const res = [];
    for (let i = 0; i < ops.length; i++) {
        const op = ops[i];
        const arg = args[i];
        if (op === 'insert') { trie.insert(arg[0]); res.push(null); }
        else if (op === 'search') { res.push(trie.search(arg[0])); }
        else if (op === 'startsWith') { res.push(trie.startsWith(arg[0])); }
    }
    return res;
}

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
rl.on('line', (line) => {
    if (!line.trim()) return;
    const data = JSON.parse(line);
    console.log(JSON.stringify(runOperations(data.ops, data.args)));
});
`
      },
      testCases: [
        {
          id: 'tc-1',
          description: 'Basic insert, search, and startsWith sequence',
          input: '{"ops": ["insert", "search", "search", "startsWith", "insert", "search"], "args": [["apple"], ["apple"], ["app"], ["app"], ["app"], ["app"]]}',
          expected: '[null, true, false, true, null, true]',
          isHidden: false
        },
        {
          id: 'tc-2',
          description: 'Empty prefix match and non-existent words',
          input: '{"ops": ["insert", "search", "startsWith"], "args": [["cat"], ["dog"], ["ca"]]}',
          expected: '[null, false, true]',
          isHidden: false
        }
      ],
      editorialSolution: {
        python: `class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end = False

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word: str) -> None:
        curr = self.root
        for ch in word:
            if ch not in curr.children:
                curr.children[ch] = TrieNode()
            curr = curr.children[ch]
        curr.is_end = True

    def search(self, word: str) -> bool:
        curr = self.root
        for ch in word:
            if ch not in curr.children:
                return False
            curr = curr.children[ch]
        return curr.is_end

    def startsWith(self, prefix: str) -> bool:
        curr = self.root
        for ch in prefix:
            if ch not in curr.children:
                return False
            curr = curr.children[ch]
        return True`,
        explanation: `Each node in a Trie holds a dictionary of children characters and an is_end boolean flag. Inserting or searching a word of length L requires examining L character transitions, achieving O(L) time complexity per operation with minimal overhead.`
      }
    },
    {
      id: 'design-add-search-words',
      title: 'Design Add and Search Words Data Structure',
      difficulty: 'Medium',
      category: 'Tries',
      neetcodeCategory: 'Tries',
      neetcodeOrder: 39,
      isNeetCode75: true,
      description: `Design a data structure that supports adding new words and finding if a string matches any previously added string.

Implement the \`WordDictionary\` class:
* \`WordDictionary()\` Initializes the object.
* \`void addWord(word)\` Adds \`word\` to the data structure, it can be matched later.
* \`bool search(word)\` Returns \`true\` if there is any string in the data structure that matches \`word\` or \`false\` otherwise. \`word\` may contain dots \`'.'\` where dots can be matched with any letter.

### Example:
\`\`\`
Operations: ["addWord","addWord","addWord","search","search","search","search"]
Arguments: [["bad"],["dad"],["mad"],["pad"],["bad"],[".ad"],["b.."]]
Output: [null,null,null,false,true,true,true]
\`\`\`

### Constraints:
* 1 <= word.length <= 25
* \`word\` in \`addWord\` consists of lowercase English letters.
* \`word\` in \`search\` consist of \`'.'\` or lowercase English letters.
* There will be at most 2 dots in \`word\` for search queries.
* At most 10^4 calls will be made to addWord and search.`,
      optimalComplexity: { time: 'O(L) for add, O(26^D * L) for search with D dots', space: 'O(Total Characters)' },
      starterCode: {
        python: `class WordDictionary:
    def __init__(self):
        self.root = {}

    def addWord(self, word: str) -> None:
        curr = self.root
        for ch in word:
            if ch not in curr:
                curr[ch] = {}
            curr = curr[ch]
        curr['$'] = True

    def search(self, word: str) -> bool:
        def dfs(idx, node):
            if idx == len(word):
                return '$' in node
            ch = word[idx]
            if ch == '.':
                for k in node:
                    if k != '$' and dfs(idx + 1, node[k]):
                        return True
                return False
            else:
                if ch not in node:
                    return False
                return dfs(idx + 1, node[ch])

        return dfs(0, self.root)

def run_word_dict(ops, args):
    wd = WordDictionary()
    res = []
    for op, arg in zip(ops, args):
        if op == 'addWord':
            wd.addWord(arg[0])
            res.append(None)
        elif op == 'search':
            res.append(wd.search(arg[0]))
    return res

if __name__ == '__main__':
    import json, sys
    lines = sys.stdin.read().strip().splitlines()
    for l in lines:
        if l.strip():
            d = json.loads(l)
            print(json.dumps(run_word_dict(d['ops'], d['args'])))
`,
        javascript: `class WordDictionary {
    constructor() {
        this.root = {};
    }
    addWord(word) {
        let curr = this.root;
        for (const ch of word) {
            if (!curr[ch]) curr[ch] = {};
            curr = curr[ch];
        }
        curr['$'] = true;
    }
    search(word) {
        function dfs(idx, node) {
            if (idx === word.length) return !!node['$'];
            const ch = word[idx];
            if (ch === '.') {
                for (const k of Object.keys(node)) {
                    if (k !== '$' && dfs(idx + 1, node[k])) return true;
                }
                return false;
            } else {
                if (!node[ch]) return false;
                return dfs(idx + 1, node[ch]);
            }
        }
        return dfs(0, this.root);
    }
}

function runWordDict(ops, args) {
    const wd = new WordDictionary();
    const res = [];
    for (let i = 0; i < ops.length; i++) {
        if (ops[i] === 'addWord') { wd.addWord(args[i][0]); res.push(null); }
        else if (ops[i] === 'search') { res.push(wd.search(args[i][0])); }
    }
    return res;
}

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
rl.on('line', (line) => {
    if (!line.trim()) return;
    const data = JSON.parse(line);
    console.log(JSON.stringify(runWordDict(data.ops, data.args)));
});
`
      },
      testCases: [
        {
          id: 'tc-1',
          description: 'Example with wildcard matching',
          input: '{"ops": ["addWord", "addWord", "addWord", "search", "search", "search", "search"], "args": [["bad"], ["dad"], ["mad"], ["pad"], ["bad"], [".ad"], ["b.."]]}',
          expected: '[null, null, null, false, true, true, true]',
          isHidden: false
        }
      ],
      editorialSolution: {
        python: `class WordDictionary:
    def __init__(self):
        self.root = {}

    def addWord(self, word: str) -> None:
        curr = self.root
        for ch in word:
            if ch not in curr:
                curr[ch] = {}
            curr = curr[ch]
        curr['$'] = True

    def search(self, word: str) -> bool:
        def dfs(idx, node):
            if idx == len(word):
                return '$' in node
            ch = word[idx]
            if ch == '.':
                for k in node:
                    if k != '$' and dfs(idx + 1, node[k]):
                        return True
                return False
            else:
                if ch not in node:
                    return False
                return dfs(idx + 1, node[ch])

        return dfs(0, self.root)`,
        explanation: `We store words in a Trie. For exact characters, search transitions directly in O(1). For wildcard '.' characters, DFS explores all child branches at the current node. Since the problem constrains '.' to at most 2 per query, recursion remains extremely fast.`
      }
    },
    {
      id: 'word-search-ii',
      title: 'Word Search II',
      difficulty: 'Hard',
      category: 'Tries',
      neetcodeCategory: 'Tries',
      neetcodeOrder: 40,
      isNeetCode75: true,
      description: `Given an \`m x n\` \`board\` of characters and a list of strings \`words\`, return all words on the board.

Each word must be constructed from letters of sequentially adjacent cells, where adjacent cells are horizontally or vertically neighboring. The same letter cell may not be used more than once in a word.

### Example 1:
\`\`\`
Input: board = [["o","a","a","n"],["e","t","a","e"],["i","h","k","r"],["i","f","l","v"]], words = ["oath","pea","eat","rain"]
Output: ["eat","oath"]
\`\`\`

### Constraints:
* m == board.length
* n == board[i].length
* 1 <= m, n <= 12
* 1 <= words.length <= 3 * 10^4
* 1 <= words[i].length <= 10
* \`board\` and \`words[i]\` consist of lowercase English letters.
* All strings of \`words\` are unique.`,
      optimalComplexity: { time: 'O(M * N * 4^L) pruned by Trie', space: 'O(Total characters in words)' },
      starterCode: {
        python: `def find_words(board, words):
    # Insert all words into Trie, then DFS on grid with Trie pruning
    pass

if __name__ == '__main__':
    import json, sys
    lines = sys.stdin.read().strip().splitlines()
    for l in lines:
        if l.strip():
            d = json.loads(l)
            res = find_words(d['board'], d['words'])
            print(json.dumps(sorted(res)))
`,
        javascript: `function findWords(board, words) {
    // Write your solution here
}

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
rl.on('line', (line) => {
    if (!line.trim()) return;
    const data = JSON.parse(line);
    const res = findWords(data.board, data.words);
    console.log(JSON.stringify((res || []).sort()));
});
`
      },
      testCases: [
        {
          id: 'tc-1',
          description: 'Standard board with partial word matches',
          input: '{"board": [["o","a","a","n"],["e","t","a","e"],["i","h","k","r"],["i","f","l","v"]], "words": ["oath","pea","eat","rain"]}',
          expected: '["eat", "oath"]',
          isHidden: false
        },
        {
          id: 'tc-2',
          description: 'Single cell board matching',
          input: '{"board": [["a", "b"], ["c", "d"]], "words": ["abcb"]}',
          expected: '[]',
          isHidden: false
        }
      ],
      editorialSolution: {
        python: `def find_words(board, words):
    root = {}
    for w in words:
        curr = root
        for ch in w:
            if ch not in curr:
                curr[ch] = {}
            curr = curr[ch]
        curr['#'] = w

    rows, cols = len(board), len(board[0])
    res = []

    def dfs(r, c, parent):
        ch = board[r][c]
        curr_node = parent[ch]

        if '#' in curr_node:
            res.append(curr_node.pop('#'))

        board[r][c] = '*' # Mark visited
        for dr, dc in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols and board[nr][nc] in curr_node:
                dfs(nr, nc, curr_node)
        board[r][c] = ch  # Backtrack

        # Prune empty branches
        if not curr_node:
            parent.pop(ch)

    for r in range(rows):
        for c in range(cols):
            if board[r][c] in root:
                dfs(r, c, root)

    return res`,
        explanation: `Instead of running separate DFS searches for every word, we build a Trie of all words and traverse the board once. As DFS moves to adjacent cells, it only continues if the character exists in the current Trie node. When a word is found, we remove it from the Trie to prevent duplicates and prune empty child branches.`
      }
    }
  ]
};

module.exports = MODULE;
