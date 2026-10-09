# Real-Time Collaborative Code Interview Platform

A production-grade engineering system designed for conducting live technical coding interviews and personal interview preparation. The platform combines a shared collaborative code editor, peer-to-peer WebRTC audio/video and screen sharing, a sandboxed code execution engine, an interviewer annotation and rubric layer, and automated post-interview AI evaluation reports.

---

## Architecture Overview

```
                                      +------------------------------------+
                                      |     Client Browser Workstation     |
                                      | (Monaco-style Editor + WebRTC + AV)|
                                      +-----------------+------------------+
                                                        |
                                 +----------------------+----------------------+
                                 | HTTP / Static Files  | WebSocket (/ws)      |
                                 v                      v                      v
                +------------------------------------------------------------------+
                |                       Node.js / Express Server                   |
                |  - Room Management & Token Auth       - Real-time Cursor & OT    |
                |  - Problem Bank Repository            - WebRTC P2P Signaling     |
                |  - REST API Routes (/api/*)           - Whiteboard Sync Relay    |
                +-------------------+------------------------------+---------------+
                                    |                              |
                                    v                              v
                +------------------------------------+   +------------------------------------+
                |    Sandboxed Execution Engine      |   |       AI Evaluation Service        |
                |  - Ephemeral Docker Containers     |   |  - LLM Providers (Gemini/OpenAI)   |
                |    (--net=none, -m 128m, --cpus)   |   |  - Deterministic AST Heuristics    |
                |  - Local Subprocess Fallback       |   |  - Big-O Complexity & Rubric Score |
                +------------------------------------+   +------------------------------------+
```

---

## The Seven Technical Challenges

### 1. Real-Time Collaborative Code Editor
- **State Synchronization**: WebSocket protocol broadcasting operational changes, monotonic versioning, and remote text synchronization.
- **Multi-Cursor Presence**: Visual presence tags and caret markers color-coded for each participant.
- **Language Support**: Out-of-the-box support for Python 3, JavaScript (Node.js), and C++ (GCC).
- **Engineering Features**: Line numbers gutter, active line tracking, 4-space tab indentation, auto-indent on newline, and bracket completion.

### 2. Audio/Video Communication via WebRTC
- **Peer-to-Peer Streaming**: Native `RTCPeerConnection` utilizing Google STUN servers (`stun:stun.l.google.com:19302`).
- **Signaling Channel**: WebSocket relay for session description exchange (`offer` / `answer`) and ICE candidates.
- **Hardware Controls**: Instant microphone mute/unmute, camera toggle, and display screen sharing (`getDisplayMedia`).
- **Resilient Fallback**: Canvas visualizer and audio stream generation when testing locally in environments without physical camera hardware.

### 3. Sandboxed Code Execution Environment (Docker)
- **Container Isolation**: Ephemeral container execution via `docker run --rm -i --net=none --memory=128m --cpus=0.5`. Networking is completely disabled inside containers to prevent unauthorized network requests.
- **Timeout Quota**: Hard 6000ms execution ceiling terminating long-running or infinite loops.
- **Local Fallback Runner**: Built-in isolated subprocess runner enforcing timeouts and sanitized environment variables when Docker daemon is not active.

### 4. Interviewer Annotation Layer & Dual-Role Model
- **Role Token Separation**: Distinct URLs for Interviewer (`?role=interviewer&token=<secret>`) and Candidate (`?role=candidate`).
- **Interviewer Private Scorecard**: 4 competency evaluation sliders (1 to 5) with rubric criteria:
  1. Data Structures & Algorithms
  2. Problem Solving Strategy
  3. Code Quality & Modularity
  4. Communication & Articulation
- **Private Observation Logger**: Timestamped flags (e.g., "Identified optimal O(N) strategy", "Encountered boundary condition").
- **Code Annotation Overlay**: Transparent whiteboard canvas overlay allowing interviewers to draw freehand arrows, bounding boxes, and highlights over the code in real-time.

### 5. AI-Generated Post-Interview Evaluation Report
- **Multi-Provider Architecture**: Direct integration with Google Gemini, OpenAI, Anthropic Claude, or the built-in deterministic heuristic engine.
- **Asymptotic Complexity Analysis**: Compares candidate's actual Big-O runtime and auxiliary space complexity against theoretical targets.
- **Rubric Competencies**: Evaluates each engineering competency with qualitative feedback.
- **Executive Hiring Decision**: Generates hiring recommendation (STRONG HIRE, LEAN HIRE, LEAN NO HIRE, STRONG NO HIRE) with hiring rationale.
- **Export Options**: Formatted PDF printing (`window.print`) and single-click Markdown export.

### 6. Problem Bank & Automated Unit Test Runner
- **Curated Questions**: High-frequency technical interview questions spanning Arrays, HashMaps, Sliding Windows, Intervals, and System Design:
  - Two Sum: Target Pair Index (Easy)
  - Longest Substring Without Repeating Characters (Medium)
  - LRU Cache Implementation (Medium)
  - Merge Intervals: Overlapping Ranges (Medium)
  - System Design: Token Bucket Rate Limiter (Hard)
- **Test Harness**: Runs public and hidden test cases, reporting status, runtime in milliseconds, and input/output diffs.

### 7. Production Deployment & DevOps Readiness
- **Docker Compose**: Single-command containerized production build.
- **Multi-Stage Dockerfile**: Multi-language base container equipped with Python, GCC, OpenJDK, and Node.js.
- **Standard Tooling**: No proprietary launch scripts; standard commands only.

---

## Getting Started

### Prerequisites
- Node.js (v18 or higher) or Docker Desktop.

### Option 1: Launch with Docker Compose (Recommended for Production)

```bash
# Clone or navigate to the project directory
cd code-interview-platform

# Build and start container
docker compose up --build
```
Access the application at `http://localhost:3000`.

---

### Option 2: Launch with Node.js

```bash
# Navigate to the project directory
cd code-interview-platform

# Install dependencies
npm install

# Start the application server
npm start
```
Access the application at `http://localhost:3000`.

---

## Configuration (.env)

Copy `.env.example` to `.env` to configure optional cloud LLM providers:

```bash
PORT=3000
HOST=0.0.0.0
NODE_ENV=production

# Execution engine: 'docker' or 'local'
EXECUTION_ENGINE=local
EXECUTION_TIMEOUT_MS=6000

# AI Evaluation provider: 'heuristic' (default offline), 'gemini', 'openai', or 'anthropic'
AI_EVALUATION_PROVIDER=heuristic

# Optional API Keys for cloud evaluation
GEMINI_API_KEY=your_gemini_key
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key
```

---

## Running the Verification Test Suite

To verify room token isolation, problem bank loading, heuristic complexity analysis, and evaluation schema:

```bash
npm test
```

---

## Usage Guide

1. **Solo Practice Mode & LeetCode Workflow**:
   - Open `http://localhost:3000` in your browser.
   - Select any problem from the dropdown or the DSA Academy.
   - Write your solution in Python 3, click **Run Tests** (or press `Ctrl+Enter`) to test against unit tests.
   - When you finish or get stuck, click **Solution & Editorial** in the toolbar to reveal the optimal Python implementation, line-by-line algorithm walkthrough, and Big-O complexity breakdown.
   - You can copy the editorial solution directly into your editor with one click.

2. **Python DSA Learning Academy**:
   - Click the **DSA Academy** tab in the left panel.
   - Explore 9 core DSA modules:
     - Arrays & Two Pointers
     - Hash Maps & Sets
     - Stacks & Queues
     - Binary Trees & BST
     - Heaps & Priority Queues
     - Binary Search
     - Dynamic Programming
     - Graphs & BFS/DFS
     - Intervals & Systems
   - Study the **Python Functions to Know** for each module (exact methods like `collections.deque.popleft()`, `heapq.heappush()`, `bisect.bisect_left()`, time complexities, and syntax pitfalls).
   - Click **Practice** next to any question to load it directly into your code editor in Python 3.

3. **Progress Tracking & Streak Engine**:
   - The platform tracks every problem solved and attempted in local storage and backend sync.
   - Live **Streak** indicator (`Streak: X Days`) and **Solved Counter** displayed in the top navigation bar.
   - Solved status indicators update automatically across problem lists as unit tests pass.

4. **3-Day Inactivity Reminders**:
   - If 3 days pass without solving or attempting a DSA question, a prominent alert banner activates at the top of the interface:
     *"Reminder: It has been X days since your last DSA practice. Maintain momentum with today's challenge!"*
   - Includes a one-click **Practice Now** button that queues an unsolved problem immediately.
   - Browser notifications: The platform requests permission to send desktop notifications when inactive.
   - **Antigravity Slash Command**: You can also use the `/schedule` command in your Antigravity chat to set a recurring reminder (e.g. `/schedule 3 days reminder to solve a LeetCode problem`).

5. **Conducting a Mock Interview with Friends**:
   - Click the **Invite** button in the top navigation bar.
   - Send the **Candidate Link** to your friend.
   - Open the **Interviewer Link** in your browser.
   - Watch their code typing live, use the **Annotate** tool to draw arrows or boxes on the code, log observations, grade the 4-competency scorecard, and review the final AI hiring report.

