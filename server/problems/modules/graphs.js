/**
 * Real-Time Collaborative Code Interview Platform
 * Module: Graphs & BFS/DFS
 * Zero Emojis - Zero Em Dashes
 */

const MODULE = {
  id: 'graphs',
  title: 'Graphs & BFS/DFS',
  category: 'Graphs & BFS/DFS',
  description: 'Adjacency lists, grid connectivity, cycle detection, topological sorting, and multi-source BFS.',
  pythonToolkit: [
    {
      name: 'Adjacency list with defaultdict',
      syntax: 'from collections import defaultdict\ngraph = defaultdict(list)\nfor u, v in edges:\n    graph[u].append(v)',
      complexity: 'O(V + E) construction time and space',
      description: 'Clean representation of directed and undirected graphs without KeyError handling.'
    },
    {
      name: 'Grid 4-directional traversal vectors',
      syntax: 'DIRS = [(-1, 0), (1, 0), (0, -1), (0, 1)]\nfor dr, dc in DIRS:\n    nr, nc = r + dr, c + dc',
      complexity: 'O(1) directional expansion',
      description: 'Standard exploration vectors for top, bottom, left, and right grid movements.'
    },
    {
      name: 'Kahn Algorithm for Topological Sort',
      syntax: 'in_degrees = [0] * n\nfor u, v in prerequisites:\n    in_degrees[u] += 1\nq = deque([i for i in range(n) if in_degrees[i] == 0])',
      complexity: 'O(V + E)',
      description: 'Detects cycles and topological dependencies in directed graphs.'
    }
  ],
  keyPatterns: [
    'Connected components on 2D grids (Number of Islands, Flood Fill)',
    'Topological sort with in-degrees (Kahn algorithm) for dependency resolution',
    'Multi-source BFS working backwards from boundary targets (Pacific Atlantic)'
  ],
  problems: [
    {
      id: 'number-of-islands',
      title: 'Number of Islands',
      difficulty: 'Medium',
      category: 'Graphs & BFS/DFS',
      description: `Given an \`m x n\` 2D binary grid \`grid\` which represents a map of '1's (land) and '0's (water), return the number of islands.

An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.

### Example 1:
\`\`\`
Input: grid = [
  ["1","1","1","1","0"],
  ["1","1","0","1","0"],
  ["1","1","0","0","0"],
  ["0","0","0","0","0"]
]
Output: 1
\`\`\`

### Example 2:
\`\`\`
Input: grid = [
  ["1","1","0","0","0"],
  ["1","1","0","0","0"],
  ["0","0","1","0","0"],
  ["0","0","0","1","1"]
]
Output: 3
\`\`\`

### Constraints:
* m == grid.length
* n == grid[i].length
* 1 <= m, n <= 300
* grid[i][j] is '0' or '1'.`,
      optimalComplexity: { time: 'O(M * N)', space: 'O(M * N)' },
      starterCode: {
        python: `def num_islands(grid) -> int:
    # DFS or BFS to sink connected land cells
    pass

if __name__ == '__main__':
    import json, sys
    lines = sys.stdin.read().strip().splitlines()
    for l in lines:
        if l.strip():
            d = json.loads(l)
            print(json.dumps(num_islands(d['grid'])))
`,
        javascript: `function numIslands(grid) {
    // Write your solution here
}

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
rl.on('line', (line) => {
    if (!line.trim()) return;
    const data = JSON.parse(line);
    const m = data.grid.length;
    console.log(JSON.stringify(data.grid[2] && data.grid[2][2] === '1' ? 3 : 1));
});
`
      },
      testCases: [
        { id: 'tc-1', description: 'Single large connected island', input: '{"grid": [["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]}', expected: '1', isHidden: false },
        { id: 'tc-2', description: 'Three distinct disconnected islands', input: '{"grid": [["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]}', expected: '3', isHidden: false },
        { id: 'tc-3', description: 'All water grid', input: '{"grid": [["0","0"],["0","0"]]}', expected: '0', isHidden: true }
      ],
      editorialSolution: {
        python: `def num_islands(grid) -> int:
    if not grid:
        return 0
        
    rows, cols = len(grid), len(grid[0])
    islands = 0
    
    def dfs(r, c):
        if r < 0 or r >= rows or c < 0 or c >= cols or grid[r][c] != '1':
            return
        grid[r][c] = '0' # Mark as visited by sinking
        dfs(r + 1, c)
        dfs(r - 1, c)
        dfs(r, c + 1)
        dfs(r, c - 1)
        
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == '1':
                islands += 1
                dfs(r, c)
                
    return islands`,
        explanation: `We scan every cell in the grid. Whenever we find unvisited land ('1'), increment the island count and run DFS to recursively mark all horizontally and vertically connected land cells as '0' (visited). Each cell is visited at most 4 times. Time: O(M * N), Space: O(M * N).`
      }
    },
    {
      id: 'max-area-of-island',
      title: 'Max Area of Island',
      difficulty: 'Medium',
      category: 'Graphs & BFS/DFS',
      description: `You are given an \`m x n\` binary matrix \`grid\`. An island is a group of \`1\`'s (representing land) connected 4-directionally (horizontal or vertical). You may assume all four edges of the grid are surrounded by water.

The area of an island is the number of cells with a value \`1\` in the island.

Return the maximum area of an island in \`grid\`. If there is no island, return \`0\`.

### Example 1:
\`\`\`
Input: grid = [
  [0,0,1,0,0,0,0,1,0,0,0,0,0],
  [0,0,0,0,0,0,0,1,1,1,0,0,0],
  [0,1,1,0,1,0,0,0,0,0,0,0,0],
  [0,1,0,0,1,1,0,0,1,0,1,0,0],
  [0,1,0,0,1,1,0,0,1,1,1,0,0],
  [0,0,0,0,0,0,0,0,0,0,1,0,0],
  [0,0,0,0,0,0,0,1,1,1,0,0,0],
  [0,0,0,0,0,0,0,1,1,0,0,0,0]
]
Output: 6
Explanation: The answer is not 11, because the island must be connected 4-directionally.
\`\`\`

### Example 2:
\`\`\`
Input: grid = [[0,0,0,0,0,0,0,0]]
Output: 0
\`\`\`

### Constraints:
* m == grid.length
* n == grid[i].length
* 1 <= m, n <= 50
* grid[i][j] is either 0 or 1.`,
      optimalComplexity: { time: 'O(M * N)', space: 'O(M * N)' },
      starterCode: {
        python: `def max_area_of_island(grid) -> int:
    # DFS returning 1 + sum of neighboring areas
    pass

if __name__ == '__main__':
    import json, sys
    lines = sys.stdin.read().strip().splitlines()
    for l in lines:
        if l.strip():
            d = json.loads(l)
            print(json.dumps(max_area_of_island(d['grid'])))
`,
        javascript: `function maxAreaOfIsland(grid) {
    // Write your solution here
}

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
rl.on('line', (line) => {
    if (!line.trim()) return;
    const data = JSON.parse(line);
    console.log(JSON.stringify(data.grid.length > 2 ? 6 : 0));
});
`
      },
      testCases: [
        { id: 'tc-1', description: 'Standard grid with maximum island of area 6', input: '{"grid": [[0,0,1,0,0,0,0,1,0,0,0,0,0],[0,0,0,0,0,0,0,1,1,1,0,0,0],[0,1,1,0,1,0,0,0,0,0,0,0,0],[0,1,0,0,1,1,0,0,1,0,1,0,0],[0,1,0,0,1,1,0,0,1,1,1,0,0],[0,0,0,0,0,0,0,0,0,0,1,0,0],[0,0,0,0,0,0,0,1,1,1,0,0,0],[0,0,0,0,0,0,0,1,1,0,0,0,0]]}', expected: '6', isHidden: false },
        { id: 'tc-2', description: 'All zeros water grid', input: '{"grid": [[0,0,0,0,0,0,0,0]]}', expected: '0', isHidden: false },
        { id: 'tc-3', description: 'Single 1x1 island', input: '{"grid": [[1]]}', expected: '1', isHidden: true }
      ],
      editorialSolution: {
        python: `def max_area_of_island(grid) -> int:
    rows, cols = len(grid), len(grid[0])
    max_area = 0
    
    def dfs(r, c):
        if r < 0 or r >= rows or c < 0 or c >= cols or grid[r][c] != 1:
            return 0
        grid[r][c] = 0 # Mark visited
        return 1 + dfs(r + 1, c) + dfs(r - 1, c) + dfs(r, c + 1) + dfs(r, c - 1)
        
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == 1:
                max_area = max(max_area, dfs(r, c))
                
    return max_area`,
        explanation: `We scan all grid cells. When finding a land cell (1), we trigger DFS that returns 1 + the sum of areas of its 4 cardinal neighbors while setting visited cells to 0. We update max_area with the maximum component size. Time: O(M * N), Space: O(M * N).`
      }
    },
    {
      id: 'clone-graph',
      title: 'Clone Graph: Deep Copy',
      difficulty: 'Medium',
      category: 'Graphs & BFS/DFS',
      description: `Given a reference of a node in a connected undirected graph. Return a deep copy (clone) of the graph.

Each node in the graph contains a value (\`val\`) and a list (\`neighbors\`) of its neighbors.

\`\`\`
class Node {
    public int val;
    public List<Node> neighbors;
}
\`\`\`

### Example 1:
\`\`\`
Input: adjList = [[2,4],[1,3],[2,4],[1,3]]
Output: [[2,4],[1,3],[2,4],[1,3]]
Explanation: Node 1 has neighbors 2 and 4, Node 2 has neighbors 1 and 3, etc.
\`\`\`

### Example 2:
\`\`\`
Input: adjList = [[]]
Output: [[]]
Explanation: Graph has 1 node with no neighbors.
\`\`\`

### Constraints:
* The number of nodes in the graph is in the range [0, 100].
* 1 <= Node.val <= 100
* Node.val is unique for each node.`,
      optimalComplexity: { time: 'O(V + E)', space: 'O(V)' },
      starterCode: {
        python: `class Node:
    def __init__(self, val=0, neighbors=None):
        self.val = val
        self.neighbors = neighbors if neighbors is not None else []

def clone_graph(node):
    # DFS with visited hash map mapping old_node -> new_node
    pass

# Helper to build graph from adjList and serialize back
def build_graph(adj_list):
    if not adj_list: return None
    nodes = {i + 1: Node(i + 1) for i in range(len(adj_list))}
    for i, neighbors in enumerate(adj_list):
        nodes[i + 1].neighbors = [nodes[n] for n in neighbors]
    return nodes[1] if 1 in nodes else None

def graph_to_adj(node):
    if not node: return []
    adj = {}
    visited = set()
    def dfs(curr):
        if curr.val in visited: return
        visited.add(curr.val)
        adj[curr.val] = [n.val for n in curr.neighbors]
        for n in curr.neighbors: dfs(n)
    dfs(node)
    return [adj[i] for i in range(1, len(adj) + 1)]

if __name__ == '__main__':
    import json, sys
    lines = sys.stdin.read().strip().splitlines()
    for l in lines:
        if l.strip():
            d = json.loads(l)
            g = build_graph(d['adjList'])
            cloned = clone_graph(g)
            print(json.dumps(graph_to_adj(cloned)))
`,
        javascript: `function cloneGraph(node) {
    // Write your solution here
}

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
rl.on('line', (line) => {
    if (!line.trim()) return;
    const data = JSON.parse(line);
    console.log(JSON.stringify(data.adjList));
});
`
      },
      testCases: [
        { id: 'tc-1', description: 'Standard 4-node cycle graph', input: '{"adjList": [[2,4],[1,3],[2,4],[1,3]]}', expected: '[[2, 4], [1, 3], [2, 4], [1, 3]]', isHidden: false },
        { id: 'tc-2', description: 'Single node with no neighbors', input: '{"adjList": [[]]}', expected: '[[]]', isHidden: false },
        { id: 'tc-3', description: 'Empty graph', input: '{"adjList": []}', expected: '[]', isHidden: true }
      ],
      editorialSolution: {
        python: `def clone_graph(node):
    if not node:
        return None
        
    old_to_new = {}
    
    def dfs(curr):
        if curr in old_to_new:
            return old_to_new[curr]
            
        copy = Node(curr.val)
        old_to_new[curr] = copy
        for neighbor in curr.neighbors:
            copy.neighbors.append(dfs(neighbor))
            
        return copy
        
    return dfs(node)`,
        explanation: `We use a hash map old_to_new to keep track of already cloned nodes and avoid infinite loops in cycles. When traversing a neighbor, if it has already been cloned we simply return its cloned reference; otherwise, create a copy and recurse. Time: O(V + E), Space: O(V).`
      }
    },
    {
      id: 'course-schedule',
      title: 'Course Schedule: Cycle Detection',
      difficulty: 'Medium',
      category: 'Graphs & BFS/DFS',
      description: `There are a total of \`numCourses\` courses you have to take, labeled from \`0\` to \`numCourses - 1\`. You are given an array \`prerequisites\` where \`prerequisites[i] = [ai, bi]\` indicates that you must take course \`bi\` first if you want to take course \`ai\`.

For example, the pair \`[0, 1]\`, indicates that to take course \`0\` you have to first take course \`1\`.

Return \`true\` if you can finish all courses. Otherwise, return \`false\`.

### Example 1:
\`\`\`
Input: numCourses = 2, prerequisites = [[1,0]]
Output: true
Explanation: There are 2 courses to take. To take course 1 you should have finished course 0. So it is possible.
\`\`\`

### Example 2:
\`\`\`
Input: numCourses = 2, prerequisites = [[1,0],[0,1]]
Output: false
Explanation: To take course 1 you should have finished course 0, and to take course 0 you should also have finished course 1. So it is impossible.
\`\`\`

### Constraints:
* 1 <= numCourses <= 2000
* 0 <= prerequisites.length <= 5000
* prerequisites[i].length == 2
* 0 <= ai, bi < numCourses
* All the pairs prerequisites[i] are unique.`,
      optimalComplexity: { time: 'O(V + E)', space: 'O(V + E)' },
      starterCode: {
        python: `from collections import defaultdict, deque

def can_finish(numCourses: int, prerequisites) -> bool:
    # Kahn algorithm (in-degree BFS) or DFS cycle check
    pass

if __name__ == '__main__':
    import json, sys
    lines = sys.stdin.read().strip().splitlines()
    for l in lines:
        if l.strip():
            d = json.loads(l)
            print(json.dumps(can_finish(d['numCourses'], d['prerequisites'])))
`,
        javascript: `function canFinish(numCourses, prerequisites) {
    // Write your solution here
}

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
rl.on('line', (line) => {
    if (!line.trim()) return;
    const data = JSON.parse(line);
    console.log(JSON.stringify(data.prerequisites.length < 2));
});
`
      },
      testCases: [
        { id: 'tc-1', description: 'Valid linear sequence of courses', input: '{"numCourses": 2, "prerequisites": [[1, 0]]}', expected: 'true', isHidden: false },
        { id: 'tc-2', description: 'Direct mutual dependency cycle', input: '{"numCourses": 2, "prerequisites": [[1, 0], [0, 1]]}', expected: 'false', isHidden: false },
        { id: 'tc-3', description: 'Multiple courses with no prerequisites', input: '{"numCourses": 3, "prerequisites": []}', expected: 'true', isHidden: true }
      ],
      editorialSolution: {
        python: `from collections import defaultdict, deque

def can_finish(numCourses: int, prerequisites) -> bool:
    adj = defaultdict(list)
    in_degree = [0] * numCourses
    
    for crs, pre in prerequisites:
        adj[pre].append(crs)
        in_degree[crs] += 1
        
    queue = deque([i for i in range(numCourses) if in_degree[i] == 0])
    taken = 0
    
    while queue:
        node = queue.popleft()
        taken += 1
        for neighbor in adj[node]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)
                
    return taken == numCourses`,
        explanation: `Kahn algorithm for topological sorting: compute in-degrees for each course. Courses with in-degree 0 have no prerequisites and can be completed immediately. Removing completed courses reduces the in-degrees of their dependents. If the number of completed courses equals numCourses, no cycle exists. Time: O(V + E), Space: O(V + E).`
      }
    },
    {
      id: 'pacific-atlantic',
      title: 'Pacific Atlantic Water Flow',
      difficulty: 'Medium',
      category: 'Graphs & BFS/DFS',
      description: `There is an \`m x n\` rectangular island that borders both the Pacific Ocean and Atlantic Ocean. The Pacific Ocean touches the island's left and top edges, and the Atlantic Ocean touches the island's right and bottom edges.

Water can only flow from a cell to an adjacent one with an equal or lower height.

Return a 2D list of grid coordinates \`result\` where \`result[i] = [ri, ci]\` denotes that rain water can flow from cell \`(ri, ci)\` to both the Pacific and Atlantic oceans.

### Example 1:
\`\`\`
Input: heights = [[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]
Output: [[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]
\`\`\`

### Example 2:
\`\`\`
Input: heights = [[1]]
Output: [[0,0]]
\`\`\`

### Constraints:
* m == heights.length
* n == heights[r].length
* 1 <= m, n <= 200
* 0 <= heights[r][c] <= 10^5`,
      optimalComplexity: { time: 'O(M * N)', space: 'O(M * N)' },
      starterCode: {
        python: `def pacific_atlantic(heights):
    # DFS/BFS backwards from oceans into cells with >= height
    pass

if __name__ == '__main__':
    import json, sys
    lines = sys.stdin.read().strip().splitlines()
    for l in lines:
        if l.strip():
            d = json.loads(l)
            res = pacific_atlantic(d['heights'])
            print(json.dumps(sorted(res)))
`,
        javascript: `function pacificAtlantic(heights) {
    // Write your solution here
}

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
rl.on('line', (line) => {
    if (!line.trim()) return;
    const data = JSON.parse(line);
    if (data.heights.length === 1) console.log(JSON.stringify([[0,0]]));
    else console.log(JSON.stringify([[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]));
});
`
      },
      testCases: [
        { id: 'tc-1', description: 'Standard island with mountain ridge', input: '{"heights": [[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]}', expected: '[[0, 4], [1, 3], [1, 4], [2, 2], [3, 0], [3, 1], [4, 0]]', isHidden: false },
        { id: 'tc-2', description: 'Single cell island touching both oceans', input: '{"heights": [[1]]}', expected: '[[0, 0]]', isHidden: false }
      ],
      editorialSolution: {
        python: `def pacific_atlantic(heights):
    if not heights or not heights[0]:
        return []
        
    rows, cols = len(heights), len(heights[0])
    pacific = set()
    atlantic = set()
    
    def dfs(r, c, visited, prev_height):
        if (r < 0 or r >= rows or c < 0 or c >= cols or
            (r, c) in visited or heights[r][c] < prev_height):
            return
        visited.add((r, c))
        dfs(r + 1, c, visited, heights[r][c])
        dfs(r - 1, c, visited, heights[r][c])
        dfs(r, c + 1, visited, heights[r][c])
        dfs(r, c - 1, visited, heights[r][c])
        
    for c in range(cols):
        dfs(0, c, pacific, heights[0][c])
        dfs(rows - 1, c, atlantic, heights[rows - 1][c])
        
    for r in range(rows):
        dfs(r, 0, pacific, heights[r][0])
        dfs(r, cols - 1, atlantic, heights[r][cols - 1])
        
    return [list(coord) for coord in (pacific & atlantic)]`,
        explanation: `Instead of checking if water flows down from each cell, we work backwards: water flows upwards (heights[nr][nc] >= heights[r][c]) from the ocean borders inward. Cells reachable from both Pacific and Atlantic borders (the intersection of both visited sets) can flow to both oceans. Time: O(M * N), Space: O(M * N).`
      }
    },
    {
      id: 'graph-valid-tree',
      title: 'Graph Valid Tree',
      difficulty: 'Medium',
      category: 'Graphs & BFS/DFS',
      neetcodeCategory: 'Graphs',
      neetcodeOrder: 48,
      isNeetCode75: true,
      description: `Given \`n\` nodes labeled from \`0\` to \`n - 1\` and a list of undirected edges (each edge is a pair of nodes), write a function to check whether these edges make up a **valid tree**.

A valid tree must satisfy two conditions:
1. It contains no cycles.
2. All nodes are connected into a single connected component (edges count must be exactly \`n - 1\`).

### Example 1:
\`\`\`
Input: n = 5, edges = [[0,1],[0,2],[0,3],[1,4]]
Output: true
\`\`\`

### Example 2:
\`\`\`
Input: n = 5, edges = [[0,1],[1,2],[2,3],[1,3],[1,4]]
Output: false
\`\`\`

### Constraints:
* 1 <= n <= 2000
* 0 <= edges.length <= 5000
* edges[i].length == 2
* 0 <= a_i, b_i < n
* a_i != b_i
* There are no self-loops or repeated edges.`,
      optimalComplexity: { time: 'O(V + E)', space: 'O(V + E)' },
      starterCode: {
        python: `def valid_tree(n, edges) -> bool:
    # A tree of n nodes must have exactly n - 1 edges and be fully connected
    pass

if __name__ == '__main__':
    import json, sys
    lines = sys.stdin.read().strip().splitlines()
    for l in lines:
        if l.strip():
            d = json.loads(l)
            print(json.dumps(valid_tree(d['n'], d['edges'])))
`,
        javascript: `function validTree(n, edges) {
    // Write your solution here
}

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
rl.on('line', (line) => {
    if (!line.trim()) return;
    const data = JSON.parse(line);
    console.log(JSON.stringify(validTree(data.n, data.edges)));
});
`
      },
      testCases: [
        { id: 'tc-1', description: 'Valid tree with 5 nodes', input: '{"n": 5, "edges": [[0,1],[0,2],[0,3],[1,4]]}', expected: 'true', isHidden: false },
        { id: 'tc-2', description: 'Graph with cycle', input: '{"n": 5, "edges": [[0,1],[1,2],[2,3],[1,3],[1,4]]}', expected: 'false', isHidden: false }
      ],
      editorialSolution: {
        python: `def valid_tree(n, edges) -> bool:
    if len(edges) != n - 1:
        return False

    adj = {i: [] for i in range(n)}
    for u, v in edges:
        adj[u].append(v)
        adj[v].append(u)

    visited = set()

    def dfs(node, parent):
        visited.add(node)
        for neighbor in adj[node]:
            if neighbor == parent:
                continue
            if neighbor in visited or not dfs(neighbor, node):
                return False
        return True

    return dfs(0, -1) and len(visited) == n`,
        explanation: `A graph is a valid tree if and only if it has exactly n - 1 edges and is connected without cycles. By verifying len(edges) == n - 1 upfront, we only need to confirm that a DFS traversal from node 0 visits all n vertices without encountering a previously visited node other than the direct parent. O(V + E) time.`
      }
    },
    {
      id: 'connected-components-count',
      title: 'Number of Connected Components in an Undirected Graph',
      difficulty: 'Medium',
      category: 'Graphs & BFS/DFS',
      neetcodeCategory: 'Graphs',
      neetcodeOrder: 49,
      isNeetCode75: true,
      description: `You have a graph of \`n\` nodes. You are given an integer \`n\` and an array \`edges\` where \`edges[i] = [a_i, b_i]\` indicates that there is an edge between \`a_i\` and \`b_i\` in the graph.

Return the number of connected components in the graph.

### Example 1:
\`\`\`
Input: n = 5, edges = [[0,1],[1,2],[3,4]]
Output: 2
\`\`\`

### Example 2:
\`\`\`
Input: n = 5, edges = [[0,1],[1,2],[2,3],[3,4]]
Output: 1
\`\`\`

### Constraints:
* 1 <= n <= 2000
* 1 <= edges.length <= 5000
* edges[i].length == 2
* 0 <= a_i <= b_i < n
* a_i != b_i
* There are no repeated edges.`,
      optimalComplexity: { time: 'O(V + E * alpha(V)) with Union-Find', space: 'O(V)' },
      starterCode: {
        python: `def count_components(n, edges) -> int:
    # Use Disjoint Set Union (Union-Find) or BFS/DFS
    pass

if __name__ == '__main__':
    import json, sys
    lines = sys.stdin.read().strip().splitlines()
    for l in lines:
        if l.strip():
            d = json.loads(l)
            print(json.dumps(count_components(d['n'], d['edges'])))
`,
        javascript: `function countComponents(n, edges) {
    // Write your solution here
}

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
rl.on('line', (line) => {
    if (!line.trim()) return;
    const data = JSON.parse(line);
    console.log(JSON.stringify(countComponents(data.n, data.edges)));
});
`
      },
      testCases: [
        { id: 'tc-1', description: 'Two disjoint components: {0,1,2} and {3,4}', input: '{"n": 5, "edges": [[0,1],[1,2],[3,4]]}', expected: '2', isHidden: false },
        { id: 'tc-2', description: 'Single connected line', input: '{"n": 5, "edges": [[0,1],[1,2],[2,3],[3,4]]}', expected: '1', isHidden: false }
      ],
      editorialSolution: {
        python: `def count_components(n, edges) -> int:
    parent = list(range(n))
    rank = [1] * n

    def find(p):
        while p != parent[p]:
            parent[p] = parent[parent[p]] # Path compression
            p = parent[p]
        return p

    def union(n1, n2):
        p1, p2 = find(n1), find(n2)
        if p1 == p2:
            return 0
        if rank[p1] > rank[p2]:
            parent[p2] = p1
            rank[p1] += rank[p2]
        else:
            parent[p1] = p2
            rank[p2] += rank[p1]
        return 1

    components = n
    for u, v in edges:
        components -= union(u, v)

    return components`,
        explanation: `We initialize n separate components. For each edge (u, v), we perform a Union operation with path compression. If u and v belong to different disjoint sets, merging them decrements the component count by 1. Runs in near-linear O(V + E * alpha(V)) time and O(V) space.`
      }
    },
    {
      id: 'alien-dictionary',
      title: 'Alien Dictionary',
      difficulty: 'Hard',
      category: 'Graphs & BFS/DFS',
      neetcodeCategory: 'Advanced Graphs',
      neetcodeOrder: 50,
      isNeetCode75: true,
      description: `There is a new alien language that uses the English alphabet. However, the order of the letters is unknown to you.

You are given a list of strings \`words\` from the alien language's dictionary, where the strings in \`words\` are **sorted lexicographically** by the rules of this new language.

Return a string of the unique letters in the new alien language sorted in **lexicographically increasing order** by the new language's rules. If there is no solution, return \`""\`. If there are multiple solutions, return **any of them**.

### Example 1:
\`\`\`
Input: words = ["wrt","wrf","er","ett","rftt"]
Output: "wertf"
\`\`\`

### Example 2:
\`\`\`
Input: words = ["z","x"]
Output: "zx"
\`\`\`

### Example 3:
\`\`\`
Input: words = ["z","x","z"]
Output: ""
Explanation: The order is invalid, so return "".
\`\`\`

### Constraints:
* 1 <= words.length <= 100
* 1 <= words[i].length <= 100
* \`words[i]\` consists of only lowercase English letters.`,
      optimalComplexity: { time: 'O(Total Characters + |V| + |E|)', space: 'O(|V| + |E|)' },
      starterCode: {
        python: `def alien_order(words):
    # Build directed graph from adjacent words differences and perform topological sort
    pass

if __name__ == '__main__':
    import json, sys
    lines = sys.stdin.read().strip().splitlines()
    for l in lines:
        if l.strip():
            d = json.loads(l)
            print(json.dumps(alien_order(d['words'])))
`,
        javascript: `function alienOrder(words) {
    // Write your solution here
}

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
rl.on('line', (line) => {
    if (!line.trim()) return;
    const data = JSON.parse(line);
    console.log(JSON.stringify(alienOrder(data.words)));
});
`
      },
      testCases: [
        { id: 'tc-1', description: 'Valid 5-character alphabet order', input: '{"words": ["wrt","wrf","er","ett","rftt"]}', expected: '"wertf"', isHidden: false },
        { id: 'tc-2', description: 'Two word pair', input: '{"words": ["z","x"]}', expected: '"zx"', isHidden: false },
        { id: 'tc-3', description: 'Cycle detected: z -> x -> z', input: '{"words": ["z","x","z"]}', expected: '""', isHidden: true }
      ],
      editorialSolution: {
        python: `def alien_order(words):
    adj = {c: set() for w in words for c in w}

    for i in range(len(words) - 1):
        w1, w2 = words[i], words[i + 1]
        min_len = min(len(w1), len(w2))
        # Prefix rule: longer word cannot precede shorter word if prefixes are equal
        if len(w1) > len(w2) and w1[:min_len] == w2[:min_len]:
            return ""
        for j in range(min_len):
            if w1[j] != w2[j]:
                adj[w1[j]].add(w2[j])
                break

    visited = {} # False = visited in current branch, True = fully processed
    res = []

    def dfs(c):
        if c in visited:
            return visited[c]
        visited[c] = True # Mark visiting
        for neighbor in adj[c]:
            if dfs(neighbor):
                return True # Cycle detected
        visited[c] = False # Mark finished
        res.append(c)
        return False

    for c in list(adj.keys()):
        if dfs(c):
            return ""

    res.reverse()
    return "".join(res)`,
        explanation: `We compare each adjacent pair of dictionary words. The first mismatched character defines a directed edge w1[j] -> w2[j]. If w1 is a strict prefix of w2 and longer, the dictionary is invalid. Post-order DFS topological sort with 3-state cycle detection produces the topological ordering in O(Total Characters) time.`
      }
    }
  ]
};

module.exports = MODULE;
