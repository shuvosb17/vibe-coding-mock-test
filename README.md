# Smart Escape — Interactive Evacuation Route Simulator

Smart Escape is an interactive, browser-based emergency evacuation simulator designed for dynamic hazard response and optimal path computation in building complexes.

---

## 📋 Repository & Deployment Information
- **Public GitHub Repository:** [https://github.com/shuvosb17/vibe-coding-mock-test](https://github.com/shuvosb17/vibe-coding-mock-test)
- **Live Deployment URL:** [https://shuvosb17.github.io/vibe-coding-mock-test/](https://shuvosb17.github.io/vibe-coding-mock-test/)

---

## 🚀 Live Demo & Running Instructions

### Method 1: Direct Browser Launch (Zero-Configuration)
Double click `index.html` or open it in any modern browser (Chrome, Edge, Firefox, Safari). The application contains an embedded fallback for the sample graph, guaranteeing instant offline functionality even over the `file://` protocol.

### Method 2: Local Web Server (Recommended)
You can serve the directory using Python's built-in HTTP server:
```bash
# Python 3
python -m http.server 8000
```
Then visit: [http://localhost:8000](http://localhost:8000)

Or using Node.js:
```bash
npx serve .
```

---

## 🧭 Implemented Features

### 1. Interactive Map & SVG Graph Visualization
- Dynamic SVG graph renderer plotting rooms, junctions, corridors, and exits with display coordinates.
- Distinct color-coded nodes: Blue for rooms, purple for junctions, green for open exits, orange for starting points, and crimson red for blocked hazards.
- Interactive corridor edges with visible numeric cost badges and hover effects.

### 2. Exact Routing Engine (Dijkstra's Algorithm)
- Evaluates shortest path by true corridor costs (sum of edge weights), not euclidean distance or corridor count.
- Excludes blocked rooms/junctions and their incident corridors, blocked corridors, and closed exits.
- **Strict Tie-Breaking Implementation**:
  1. Minimum path cost.
  2. In case of cost ties, selects the lexicographically smallest exit ID.
  3. In case of equal cost and exit ID, selects the lexicographically smallest sequence of node IDs.

### 3. Dynamic Hazard Control & Rerouting
- Instantaneous rerouting upon any change (node blocking, corridor obstruction, exit closure).
- **Interactive Modes**:
  - `View / Select Mode`: Click on any room or junction to set it as the starting location.
  - `Block Node Mode`: Toggle hazard states on rooms and junctions.
  - `Block Corridor Mode`: Toggle blockages on individual corridor pathways.
  - `Toggle Exit Mode`: Close or reopen exits dynamically.
- `Reset` button that immediately restores the initial hazard conditions from the loaded JSON dataset.

### 4. Robust Failure State Handling
- Clearly distinguishes and displays:
  - **`Starting location blocked`**: Triggered immediately when the selected start node becomes obstructed.
  - **`No route available`**: Displayed when all escape paths to open exits are severed.

### 5. Full Bilingual Support (Bangla & English)
- Instant one-click language toggle (🌐 বাংলা / English) affecting all principal labels, button captions, cards, statuses, errors, instructions, and mode indicators.

### 6. File Import & Schema Validation
- Supports importing custom `building.json` files adhering to the official specification.
- Validates node count (2-60), edge count (1-150), unique IDs, absence of self-loops or duplicate pairs, valid node types, and initial hazard arrays.
- Automatic UTF-8 BOM removal to prevent parsing anomalies on Windows systems.

### 7. Bonus & Usability Enhancements
- Interactive Zoom In, Zoom Out, and Fit-to-Screen controls.
- Synchronized sidebar lists for Nodes and Corridors showing active route highlights and hazard badges.
- Toast notifications for user feedback and status bar updates.

---

## 🧪 Official Test Case Verification

All 5 benchmark test cases defined in the specification were verified using `building.json`:

| Scenario | Action | Expected & Verified Result | Status |
| :--- | :--- | :--- | :---: |
| **Baseline** | Select `R1` | `R1 - C1 - C2 - E1; cost 7` | ✅ PASSED |
| **Blocked junction** | Select `R1`; block `C2` | `R1 - C1 - C3 - C4 - E2; cost 11` | ✅ PASSED |
| **Exits closed** | Select `R1`; close `E1` and `E2` | `No route available` | ✅ PASSED |
| **Different start** | Select `R2` | `R2 - C3 - C4 - E2; cost 7` | ✅ PASSED |
| **Blocked start** | Select `R1`; then block `R1` | `Starting location blocked` | ✅ PASSED |

---

## 🛠️ Known Issues & Edge Cases
- None. Graph routing handles disconnected components, equal cost ties, single room graphs, and dynamic start changes seamlessly.

---

## 🤖 AI Tools & Prompts Used

- **AI Assistant:** Antigravity AI (Pair Programming)
- **Most Useful Prompt:**
  > *"Analyze all requirements in Smart_Escape_Problem_Statement.pdf including schema validation, strict Dijkstra tie-breaking (cost -> exit ID -> node ID sequence), hazard rerouting, failure states, bilingual English/Bangla UI, and build a cohesive, modern dark-themed interactive application."*

---

## 📄 License
This project is licensed under the [MIT License](LICENSE).
