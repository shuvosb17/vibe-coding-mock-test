/**
 * Smart Escape — Interactive Evacuation Route Simulator
 * Core Application Engine & Blueprint UI Controller
 */

// ══════════════════════════════════════════════════
// BILINGUAL LOCALIZATION (EN & BN)
// ══════════════════════════════════════════════════
const I18N = {
  en: {
    appTitle: "Smart Escape",
    appSubtitle: "Evacuation Route Simulator",
    langBtn: "বাংলা",
    resetBtn: "Reset",
    importBtn: "Import JSON",
    buildingCardTitle: "Building",
    statNodesLabel: "Nodes",
    statEdgesLabel: "Corridors",
    startCardTitle: "Starting Location",
    startHint: "Click any room or junction on canvas to set start.",
    startPlaceholder: "— Select Start —",
    routeCardTitle: "Route Details",
    routeEmptyText: "Select a starting point to compute route",
    legendTitle: "Legend",
    legendRoom: "Room",
    legendJunction: "Junction",
    legendExit: "Exit",
    legendStart: "Start",
    legendBlocked: "Blocked",
    legendPath: "Active Route",
    modeView: "View",
    modeBlock: "Block Node",
    modeEdge: "Block Corridor",
    modeExit: "Toggle Exit",
    modeViewDesc: "View Mode — Click node to select start (V)",
    modeBlockDesc: "Block Mode — Click room/junction to toggle hazard (N)",
    modeEdgeDesc: "Corridor Mode — Click corridor to toggle obstruction (C)",
    modeExitDesc: "Exit Mode — Click exit to open/close (E)",
    emptyTitle: "Import a Building Map",
    emptyDesc: "Upload a building.json specification or load the sample schematic to start simulating.",
    emptyImportBtn: "Import JSON",
    emptySampleBtn: "Load Sample",
    nodesPanelTitle: "Nodes",
    edgesPanelTitle: "Corridors",
    noDataLoaded: "No data loaded",
    statusReady: "Ready — Import building JSON or load sample",
    statusRouteFound: (exitId) => `Optimal evacuation path found to ${exitId}`,
    statusNoRoute: "No route available",
    statusStartBlocked: "Starting location blocked",
    statusReset: "Restored to initial state",
    toastImportSuccess: (name) => `Loaded "${name}"`,
    toastInvalidJson: "Invalid JSON or schema validation failed",
    costLabel: "Total Cost",
    destExitLabel: "Destination Exit",
    evacSequenceLabel: "Evacuation Sequence",
    stepsLabel: "Steps:",
    costMetricLabel: "Cost:"
  },
  bn: {
    appTitle: "স্মার্ট এস্কেপ",
    appSubtitle: "ইভাকুয়েশন রুট সিমুলেটর",
    langBtn: "English",
    resetBtn: "রিসেট",
    importBtn: "জেসন ইমপোর্ট",
    buildingCardTitle: "ভবনের বিবরণ",
    statNodesLabel: "নোডসমূহ",
    statEdgesLabel: "করিডোর",
    startCardTitle: "শুরুর স্থান",
    startHint: "শুরুর স্থান নির্ধারণ করতে ক্যানভাসে রুম বা জাংশনে ক্লিক করুন।",
    startPlaceholder: "— শুরুর স্থান বেছে নিন —",
    routeCardTitle: "রুট বিবরণ",
    routeEmptyText: "রুট বের করতে শুরুর স্থান নির্বাচন করুন",
    legendTitle: "মানচিত্র নির্দেশিকা",
    legendRoom: "রুম",
    legendJunction: "জাংশন",
    legendExit: "প্রস্থান",
    legendStart: "শুরু",
    legendBlocked: "অবরুদ্ধ",
    legendPath: "নিরাপদ রুট",
    modeView: "ভিউ",
    modeBlock: "নোড ব্লক",
    modeEdge: "করিডোর ব্লক",
    modeExit: "প্রস্থান পরিবর্তন",
    modeViewDesc: "ভিউ মোড — শুরুর স্থান সিলেক্ট করুন (V)",
    modeBlockDesc: "ব্লক মোড — বিপদগ্রস্ত নোড ব্লক/আনব্লক করুন (N)",
    modeEdgeDesc: "করিডোর মোড — চলাচলের পথ বন্ধ/উন্মুক্ত করুন (C)",
    modeExitDesc: "প্রস্থান মোড — এক্সিট খোলা/বন্ধ করুন (E)",
    emptyTitle: "ভবনের ম্যাপ লোড করুন",
    emptyDesc: "শুরু করতে একটি building.json আপলোড করুন অথবা নমুনা স্কিম্যাটিক লোড করুন।",
    emptyImportBtn: "জেসন ইমপোর্ট",
    emptySampleBtn: "নমুনা লোড",
    nodesPanelTitle: "নোড তালিকা",
    edgesPanelTitle: "করিডোর",
    noDataLoaded: "কোনো তথ্য নেই",
    statusReady: "প্রস্তুত — ফাইল ইমপোর্ট করুন বা নমুনা লোড করুন",
    statusRouteFound: (exitId) => `${exitId}-এ পৌঁছানোর সর্বোত্তম পথ চিহ্নিত`,
    statusNoRoute: "No route available",
    statusStartBlocked: "Starting location blocked",
    statusReset: "প্রাথমিক অবস্থায় রিসেট সম্পন্ন",
    toastImportSuccess: (name) => `সফলভাবে "${name}" লোড হয়েছে`,
    toastInvalidJson: "ভুল জেসন বা স্কিমা ত্রুটি",
    costLabel: "মোট ব্যয়",
    destExitLabel: "গন্তব্য প্রস্থান",
    evacSequenceLabel: "উদ্ধার পথের ক্রম",
    stepsLabel: "ধাপ:",
    costMetricLabel: "ব্যয়:"
  }
};

class SmartEscapeApp {
  constructor() {
    this.lang = "en";
    this.currentMode = "view"; // 'view', 'block', 'edge', 'exit'
    this.activeTab = "nodes";  // 'nodes' | 'edges'

    // Theme state
    this.theme = localStorage.getItem("smart-escape-theme") || "dark";
    document.documentElement.setAttribute("data-theme", this.theme);

    // Graph Data
    this.buildingData = null;
    this.startNodeId = null;

    // Hazards
    this.blockedNodes = new Set();
    this.blockedEdges = new Set();
    this.closedExits = new Set();

    // Optimal Route Object
    this.activeRoute = null;

    // Viewport & Zoom
    this.scale = 1;
    this.viewBox = { minX: 0, minY: 0, width: 800, height: 500 };

    this.init();
  }

  init() {
    this.updateLanguageUI();
    this.setupKeyboardShortcuts();
    this.setupTooltipEvents();
    this.loadInitialFile();
  }

  // ══════════════════════════════════════════════════
  // THEME CONTROLLER
  // ══════════════════════════════════════════════════
  toggleTheme() {
    this.theme = this.theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", this.theme);
    localStorage.setItem("smart-escape-theme", this.theme);
  }

  // ══════════════════════════════════════════════════
  // TABS & DRAWERS CONTROLLER
  // ══════════════════════════════════════════════════
  switchTab(tab) {
    this.activeTab = tab;
    const isNodes = tab === "nodes";

    document.getElementById("tab-nodes-btn").classList.toggle("active", isNodes);
    document.getElementById("tab-edges-btn").classList.toggle("active", !isNodes);
    document.getElementById("tab-nodes-btn").setAttribute("aria-selected", isNodes);
    document.getElementById("tab-edges-btn").setAttribute("aria-selected", !isNodes);

    document.getElementById("tab-nodes-content").classList.toggle("active", isNodes);
    document.getElementById("tab-edges-content").classList.toggle("active", !isNodes);
  }

  toggleDrawer(side) {
    const el = document.getElementById(side === "left" ? "sidebar-left" : "sidebar-right");
    if (el) el.classList.toggle("drawer-open");
  }

  // ══════════════════════════════════════════════════
  // KEYBOARD SHORTCUTS (V, N, C, E)
  // ══════════════════════════════════════════════════
  setupKeyboardShortcuts() {
    window.addEventListener("keydown", (e) => {
      // Ignore if user is typing in an input or select
      if (["INPUT", "SELECT", "TEXTAREA"].includes(e.target.tagName)) return;

      const key = e.key.toUpperCase();
      if (key === "V") this.setMode("view");
      else if (key === "N") this.setMode("block");
      else if (key === "C") this.setMode("edge");
      else if (key === "E") this.setMode("exit");
      else if (key === "+" || key === "=") this.zoomIn();
      else if (key === "-" || key === "_") this.zoomOut();
      else if (key === "0") this.resetZoom();
    });
  }

  // ══════════════════════════════════════════════════
  // INTERNATIONALIZATION (I18N)
  // ══════════════════════════════════════════════════
  toggleLanguage() {
    this.lang = this.lang === "en" ? "bn" : "en";
    document.body.classList.toggle("lang-bn", this.lang === "bn");
    this.updateLanguageUI();
    this.renderRouteResult();
    this.updateModeIndicator();
    this.renderSidebarLists();
  }

  t(key, ...args) {
    const val = I18N[this.lang][key];
    if (typeof val === "function") return val(...args);
    return val || key;
  }

  updateLanguageUI() {
    const bindings = [
      ["app-title", "appTitle"],
      ["app-subtitle", "appSubtitle"],
      ["lang-label", "langBtn"],
      ["reset-label", "resetBtn"],
      ["import-label", "importBtn"],
      ["building-card-title", "buildingCardTitle"],
      ["stat-nodes-label", "statNodesLabel"],
      ["stat-edges-label", "statEdgesLabel"],
      ["start-card-title", "startCardTitle"],
      ["start-hint", "startHint"],
      ["start-placeholder", "startPlaceholder"],
      ["route-card-title", "routeCardTitle"],
      ["route-empty-text", "routeEmptyText"],
      ["legend-title", "legendTitle"],
      ["legend-room", "legendRoom"],
      ["legend-junction", "legendJunction"],
      ["legend-exit", "legendExit"],
      ["legend-start", "legendStart"],
      ["legend-blocked", "legendBlocked"],
      ["legend-path", "legendPath"],
      ["mode-view-label", "modeView"],
      ["mode-block-label", "modeBlock"],
      ["mode-edge-label", "modeEdge"],
      ["mode-exit-label", "modeExit"],
      ["empty-title", "emptyTitle"],
      ["empty-desc", "emptyDesc"],
      ["empty-import-label", "emptyImportBtn"],
      ["empty-sample-label", "emptySampleBtn"],
      ["nodes-panel-title", "nodesPanelTitle"],
      ["edges-panel-title", "edgesPanelTitle"],
      ["nodes-placeholder", "noDataLoaded"],
      ["edges-placeholder", "noDataLoaded"],
      ["metric-steps-label", "stepsLabel"],
      ["metric-cost-label", "costMetricLabel"]
    ];

    bindings.forEach(([id, key]) => {
      const el = document.getElementById(id);
      if (el) el.textContent = this.t(key);
    });
  }

  // ══════════════════════════════════════════════════
  // VALIDATION & DATA LOADING
  // ══════════════════════════════════════════════════
  validateAndParse(data) {
    if (!data || typeof data !== "object") {
      throw new Error("Missing building specification object.");
    }
    if (!data.building || typeof data.building !== "string" || !data.building.trim()) {
      throw new Error("Building name must be a non-empty string.");
    }
    if (!Array.isArray(data.nodes) || !Array.isArray(data.edges) || !data.initial_state) {
      throw new Error("Required fields missing (nodes, edges, initial_state).");
    }

    const { nodes, edges, initial_state } = data;
    if (nodes.length < 2 || nodes.length > 60 || edges.length < 1 || edges.length > 150) {
      throw new Error("Input limits violated (2-60 nodes, 1-150 edges required).");
    }

    const nodeIds = new Set();
    let hasRoomOrJunc = false;
    let hasExit = false;

    for (const node of nodes) {
      if (!node.id || typeof node.id !== "string") {
        throw new Error("Every node must have a valid string ID.");
      }
      if (nodeIds.has(node.id)) {
        throw new Error(`Duplicate node ID: ${node.id}`);
      }
      nodeIds.add(node.id);

      if (!node.label || typeof node.label !== "string") {
        throw new Error(`Node ${node.id} has invalid label.`);
      }
      if (!["room", "junction", "exit"].includes(node.type)) {
        throw new Error(`Node ${node.id} has unknown type "${node.type}".`);
      }
      if (typeof node.x !== "number" || typeof node.y !== "number") {
        throw new Error(`Node ${node.id} has invalid coordinates.`);
      }

      if (node.type === "room" || node.type === "junction") hasRoomOrJunc = true;
      if (node.type === "exit") hasExit = true;
    }

    if (!hasRoomOrJunc || !hasExit) {
      throw new Error("Graph must contain at least one room/junction and one exit.");
    }

    const edgeIds = new Set();
    const pairSet = new Set();

    for (const edge of edges) {
      if (!edge.id || typeof edge.id !== "string") {
        throw new Error("Every edge must have a valid string ID.");
      }
      if (edgeIds.has(edge.id)) {
        throw new Error(`Duplicate edge ID: ${edge.id}`);
      }
      edgeIds.add(edge.id);

      if (!nodeIds.has(edge.from) || !nodeIds.has(edge.to)) {
        throw new Error(`Edge ${edge.id} references non-existent node.`);
      }
      if (edge.from === edge.to) {
        throw new Error(`Self-loop detected on edge ${edge.id}.`);
      }

      const pairKey = [edge.from, edge.to].sort().join("<->");
      if (pairSet.has(pairKey)) {
        throw new Error(`Multiple connections between ${edge.from} and ${edge.to}.`);
      }
      pairSet.add(pairKey);

      if (typeof edge.cost !== "number" || edge.cost <= 0 || !Number.isInteger(edge.cost)) {
        throw new Error(`Edge ${edge.id} cost must be a positive integer.`);
      }
    }

    const { blocked_nodes = [], blocked_edges = [], closed_exits = [] } = initial_state;
    for (const bNode of blocked_nodes) {
      const n = nodes.find(item => item.id === bNode);
      if (!n) throw new Error(`Initial blocked node "${bNode}" not found.`);
      if (n.type === "exit") throw new Error(`Exit "${bNode}" cannot be in blocked_nodes.`);
    }
    for (const bEdge of blocked_edges) {
      if (!edgeIds.has(bEdge)) throw new Error(`Initial blocked corridor "${bEdge}" not found.`);
    }
    for (const cExit of closed_exits) {
      const n = nodes.find(item => item.id === cExit);
      if (!n) throw new Error(`Initial closed exit "${cExit}" not found.`);
      if (n.type !== "exit") throw new Error(`Node "${cExit}" in closed_exits is not an exit.`);
    }

    return true;
  }

  processDataset(data) {
    try {
      this.validateAndParse(data);
      this.buildingData = data;
      this.resetToInitialState();

      // Update UI Header and Meta
      document.getElementById("map-empty-state").style.display = "none";
      document.getElementById("building-svg").style.display = "block";
      document.getElementById("building-name").textContent = data.building;
      document.getElementById("stat-nodes").textContent = data.nodes.length;
      document.getElementById("stat-edges").textContent = data.edges.length;

      document.getElementById("nodes-count-badge").textContent = data.nodes.length;
      document.getElementById("edges-count-badge").textContent = data.edges.length;

      this.populateStartSelector();
      this.renderSidebarLists();
      this.computeBoundingBox();
      this.renderMap();
      this.showToast(this.t("toastImportSuccess", data.building), "success");
      this.setStatus(this.t("statusReady"), "idle");
    } catch (err) {
      this.showToast(err.message, "error");
      this.setStatus(err.message, "error");
    }
  }

  async loadInitialFile() {
    try {
      const response = await fetch("building.json");
      if (response.ok) {
        const text = await response.text();
        const json = JSON.parse(text.charCodeAt(0) === 0xFEFF ? text.slice(1) : text);
        this.processDataset(json);
        return;
      }
    } catch {
      // CORS or standalone fallback
    }

    // Official embedded sample fallback
    const sample = {
      "building": "DevFest Sample Building",
      "nodes": [
        { "id": "R1", "label": "Room 1",     "type": "room",     "x": 100, "y": 140 },
        { "id": "R2", "label": "Room 2",     "type": "room",     "x": 100, "y": 340 },
        { "id": "C1", "label": "Junction 1", "type": "junction", "x": 300, "y": 140 },
        { "id": "C2", "label": "Junction 2", "type": "junction", "x": 500, "y": 140 },
        { "id": "C3", "label": "Junction 3", "type": "junction", "x": 300, "y": 340 },
        { "id": "C4", "label": "Junction 4", "type": "junction", "x": 500, "y": 340 },
        { "id": "E1", "label": "Exit 1",     "type": "exit",     "x": 700, "y": 140 },
        { "id": "E2", "label": "Exit 2",     "type": "exit",     "x": 700, "y": 340 }
      ],
      "edges": [
        { "id": "e1", "from": "R1", "to": "C1", "cost": 2 },
        { "id": "e2", "from": "C1", "to": "C2", "cost": 3 },
        { "id": "e3", "from": "C2", "to": "E1", "cost": 2 },
        { "id": "e4", "from": "R2", "to": "C3", "cost": 2 },
        { "id": "e5", "from": "C3", "to": "C4", "cost": 3 },
        { "id": "e6", "from": "C4", "to": "E2", "cost": 2 },
        { "id": "e7", "from": "C1", "to": "C3", "cost": 4 },
        { "id": "e8", "from": "C2", "to": "C4", "cost": 3 },
        { "id": "e9", "from": "R1", "to": "R2", "cost": 6 }
      ],
      "initial_state": {
        "blocked_nodes": [],
        "blocked_edges":  [],
        "closed_exits":   []
      }
    };
    this.processDataset(sample);
  }

  importFile(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        let text = e.target.result;
        if (typeof text === "string" && text.charCodeAt(0) === 0xFEFF) {
          text = text.slice(1);
        }
        const json = JSON.parse(text);
        this.processDataset(json);
      } catch (err) {
        const msg = err && err.message ? err.message : this.t("toastInvalidJson");
        this.showToast(msg, "error");
        this.setStatus(msg, "error");
      }
    };
    reader.readAsText(file);
    event.target.value = "";
  }

  loadSample() {
    this.loadInitialFile();
  }

  resetToInitialState() {
    if (!this.buildingData) return;
    const init = this.buildingData.initial_state || {};
    this.blockedNodes = new Set(init.blocked_nodes || []);
    this.blockedEdges = new Set(init.blocked_edges || []);
    this.closedExits = new Set(init.closed_exits || []);

    this.recalculateRoute();
    this.renderMap();
    this.renderSidebarLists();
    this.showToast(this.t("statusReset"), "info");
  }

  // ══════════════════════════════════════════════════
  // START SELECTION & MODES
  // ══════════════════════════════════════════════════
  populateStartSelector() {
    const select = document.getElementById("start-select");
    select.innerHTML = `<option value="">${this.t("startPlaceholder")}</option>`;

    const validStarts = this.buildingData.nodes.filter(n => n.type === "room" || n.type === "junction");
    validStarts.forEach(node => {
      const opt = document.createElement("option");
      opt.value = node.id;
      opt.textContent = `${node.label} (${node.id})`;
      select.appendChild(opt);
    });
  }

  setStartNode(nodeId) {
    this.startNodeId = nodeId;
    const select = document.getElementById("start-select");
    if (select) select.value = nodeId || "";
    this.recalculateRoute();
    this.renderMap();
    this.renderSidebarLists();
  }

  setStartFromSelect(nodeId) {
    this.setStartNode(nodeId || null);
  }

  setMode(mode) {
    this.currentMode = mode;
    ["view", "block", "edge", "exit"].forEach(m => {
      const btn = document.getElementById(`mode-${m}`);
      if (btn) btn.classList.toggle("active", m === mode);
    });

    const svg = document.getElementById("building-svg");
    if (svg) {
      svg.className = `building-svg mode-${mode}`;
    }
    this.updateModeIndicator();
  }

  updateModeIndicator() {
    const indicator = document.getElementById("mode-indicator-text");
    if (!indicator) return;
    if (this.currentMode === "view") indicator.textContent = this.t("modeViewDesc");
    else if (this.currentMode === "block") indicator.textContent = this.t("modeBlockDesc");
    else if (this.currentMode === "edge") indicator.textContent = this.t("modeEdgeDesc");
    else if (this.currentMode === "exit") indicator.textContent = this.t("modeExitDesc");
  }

  // ══════════════════════════════════════════════════
  // HAZARDS TOGGLING
  // ══════════════════════════════════════════════════
  toggleNodeBlock(nodeId) {
    const node = this.buildingData.nodes.find(n => n.id === nodeId);
    if (!node || node.type === "exit") return;

    if (this.blockedNodes.has(nodeId)) {
      this.blockedNodes.delete(nodeId);
    } else {
      this.blockedNodes.add(nodeId);
    }
    this.recalculateRoute();
    this.renderMap();
    this.renderSidebarLists();
  }

  toggleEdgeBlock(edgeId) {
    if (this.blockedEdges.has(edgeId)) {
      this.blockedEdges.delete(edgeId);
    } else {
      this.blockedEdges.add(edgeId);
    }
    this.recalculateRoute();
    this.renderMap();
    this.renderSidebarLists();
  }

  toggleExitState(exitId) {
    const node = this.buildingData.nodes.find(n => n.id === exitId);
    if (!node || node.type !== "exit") return;

    if (this.closedExits.has(exitId)) {
      this.closedExits.delete(exitId);
    } else {
      this.closedExits.add(exitId);
    }
    this.recalculateRoute();
    this.renderMap();
    this.renderSidebarLists();
  }

  // ══════════════════════════════════════════════════
  // EXACT ROUTING ENGINE (DIJKSTRA WITH TIE-BREAKING)
  // ══════════════════════════════════════════════════
  calculateOptimalRoute() {
    if (!this.buildingData || !this.startNodeId) {
      return { status: "NONE" };
    }

    // Failure case: starting location is blocked
    if (this.blockedNodes.has(this.startNodeId)) {
      return { status: "START_BLOCKED" };
    }

    const { nodes, edges } = this.buildingData;

    // Adjacency graph excluding blocked nodes, blocked corridors, and closed exits
    const adj = new Map();
    nodes.forEach(n => adj.set(n.id, []));

    for (const edge of edges) {
      if (this.blockedEdges.has(edge.id)) continue;
      const u = edge.from;
      const v = edge.to;
      if (this.blockedNodes.has(u) || this.blockedNodes.has(v)) continue;

      adj.get(u).push({ to: v, cost: edge.cost, edgeId: edge.id });
      adj.get(v).push({ to: u, cost: edge.cost, edgeId: edge.id });
    }

    const dist = new Map();
    const bestPath = new Map();

    nodes.forEach(n => {
      dist.set(n.id, Infinity);
      bestPath.set(n.id, null);
    });

    dist.set(this.startNodeId, 0);
    bestPath.set(this.startNodeId, [this.startNodeId]);

    const pq = [{ node: this.startNodeId, cost: 0, path: [this.startNodeId] }];

    while (pq.length > 0) {
      pq.sort((a, b) => {
        if (a.cost !== b.cost) return a.cost - b.cost;
        return this.comparePathLexicographically(a.path, b.path);
      });

      const current = pq.shift();
      const u = current.node;

      if (current.cost > dist.get(u)) continue;

      const uNode = nodes.find(n => n.id === u);
      if (uNode.type === "exit") {
        continue;
      }

      for (const neighbor of adj.get(u)) {
        const v = neighbor.to;
        const vNode = nodes.find(n => n.id === v);

        // Cannot traverse into a closed exit
        if (vNode.type === "exit" && this.closedExits.has(v)) {
          continue;
        }

        const newCost = current.cost + neighbor.cost;
        const newPath = [...current.path, v];

        const existingDist = dist.get(v);
        const existingPath = bestPath.get(v);

        let isBetter = false;
        if (newCost < existingDist) {
          isBetter = true;
        } else if (newCost === existingDist) {
          if (this.comparePathLexicographically(newPath, existingPath) < 0) {
            isBetter = true;
          }
        }

        if (isBetter) {
          dist.set(v, newCost);
          bestPath.set(v, newPath);
          pq.push({ node: v, cost: newCost, path: newPath });
        }
      }
    }

    const openExits = nodes.filter(n => n.type === "exit" && !this.closedExits.has(n.id));
    const candidateRoutes = [];

    for (const exit of openExits) {
      const cost = dist.get(exit.id);
      if (cost < Infinity) {
        candidateRoutes.push({
          exitId: exit.id,
          cost: cost,
          path: bestPath.get(exit.id)
        });
      }
    }

    if (candidateRoutes.length === 0) {
      return { status: "NO_ROUTE" };
    }

    // Tie-break: min cost -> min exit ID -> min path sequence
    candidateRoutes.sort((a, b) => {
      if (a.cost !== b.cost) return a.cost - b.cost;
      if (a.exitId !== b.exitId) return a.exitId.localeCompare(b.exitId);
      return this.comparePathLexicographically(a.path, b.path);
    });

    return {
      status: "SUCCESS",
      route: candidateRoutes[0]
    };
  }

  comparePathLexicographically(pathA, pathB) {
    if (!pathA) return 1;
    if (!pathB) return -1;
    const len = Math.min(pathA.length, pathB.length);
    for (let i = 0; i < len; i++) {
      if (pathA[i] !== pathB[i]) {
        return pathA[i].localeCompare(pathB[i]);
      }
    }
    return pathA.length - pathB.length;
  }

  recalculateRoute() {
    const res = this.calculateOptimalRoute();
    const stepsPill = document.getElementById("metric-steps-pill");
    const costPill = document.getElementById("metric-cost-pill");

    if (res.status === "SUCCESS") {
      this.activeRoute = res.route;
      this.setStatus(this.t("statusRouteFound", res.route.exitId), "success");

      // Update bottom status bar metrics
      if (stepsPill && costPill) {
        stepsPill.style.display = "inline-flex";
        costPill.style.display = "inline-flex";
        document.getElementById("metric-steps-val").textContent = res.route.path.length;
        document.getElementById("metric-cost-val").textContent = res.route.cost;
      }
    } else {
      this.activeRoute = null;
      if (stepsPill) stepsPill.style.display = "none";
      if (costPill) costPill.style.display = "none";

      if (res.status === "START_BLOCKED") {
        this.setStatus(this.t("statusStartBlocked"), "error");
      } else if (res.status === "NO_ROUTE") {
        this.setStatus(this.t("statusNoRoute"), "error");
      } else {
        this.setStatus(this.t("statusReady"), "idle");
      }
    }
    this.renderRouteResult(res.status);
  }

  // ══════════════════════════════════════════════════
  // VIEWPORT & ZOOM ENGINE
  // ══════════════════════════════════════════════════
  computeBoundingBox() {
    if (!this.buildingData || !this.buildingData.nodes.length) return;
    const xs = this.buildingData.nodes.map(n => n.x);
    const ys = this.buildingData.nodes.map(n => n.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);

    const pad = 100;
    this.viewBox = {
      minX: minX - pad,
      minY: minY - pad,
      width: Math.max(maxX - minX + pad * 2, 450),
      height: Math.max(maxY - minY + pad * 2, 340)
    };
    this.applyViewBox();
  }

  applyViewBox() {
    const svg = document.getElementById("building-svg");
    if (!svg) return;
    const w = this.viewBox.width / this.scale;
    const h = this.viewBox.height / this.scale;
    const x = this.viewBox.minX + (this.viewBox.width - w) / 2;
    const y = this.viewBox.minY + (this.viewBox.height - h) / 2;
    svg.setAttribute("viewBox", `${x} ${y} ${w} ${h}`);
    document.getElementById("zoom-label-text").textContent = `${Math.round(this.scale * 100)}%`;
  }

  zoomIn() {
    this.scale = Math.min(this.scale * 1.25, 3.0);
    this.applyViewBox();
  }

  zoomOut() {
    this.scale = Math.max(this.scale / 1.25, 0.4);
    this.applyViewBox();
  }

  resetZoom() {
    this.scale = 1;
    this.computeBoundingBox();
  }

  // ══════════════════════════════════════════════════
  // TECHNICAL BLUEPRINT MAP RENDERING
  // ══════════════════════════════════════════════════
  renderMap() {
    if (!this.buildingData) return;
    const { nodes, edges } = this.buildingData;

    const nodeMap = new Map();
    nodes.forEach(n => nodeMap.set(n.id, n));

    const edgesLayer = document.getElementById("svg-edges-layer");
    const nodesLayer = document.getElementById("svg-nodes-layer");
    const labelsLayer = document.getElementById("svg-labels-layer");
    const svgRoot = document.getElementById("building-svg");

    edgesLayer.innerHTML = "";
    nodesLayer.innerHTML = "";
    labelsLayer.innerHTML = "";

    const hasRoute = !!(this.activeRoute && this.activeRoute.path);
    svgRoot.classList.toggle("route-active-mode", hasRoute);

    // Identify active path edges
    const activeRouteEdgeIds = new Set();
    if (hasRoute) {
      for (let i = 0; i < this.activeRoute.path.length - 1; i++) {
        const u = this.activeRoute.path[i];
        const v = this.activeRoute.path[i + 1];
        const edge = edges.find(e => (e.from === u && e.to === v) || (e.from === v && e.to === u));
        if (edge) activeRouteEdgeIds.add(edge.id);
      }
    }

    // ── 1. Render Corridors (Edges) ──
    edges.forEach(edge => {
      const u = nodeMap.get(edge.from);
      const v = nodeMap.get(edge.to);
      if (!u || !v) return;

      const isBlocked = this.blockedEdges.has(edge.id) || this.blockedNodes.has(u.id) || this.blockedNodes.has(v.id);
      const isPathActive = activeRouteEdgeIds.has(edge.id);

      // Hit area
      const hit = document.createElementNS("http://www.w3.org/2000/svg", "line");
      hit.setAttribute("x1", u.x);
      hit.setAttribute("y1", u.y);
      hit.setAttribute("x2", v.x);
      hit.setAttribute("y2", v.y);
      hit.setAttribute("class", "svg-edge-hit");
      hit.onclick = () => this.handleEdgeClick(edge.id);
      edgesLayer.appendChild(hit);

      // Main line
      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("x1", u.x);
      line.setAttribute("y1", u.y);
      line.setAttribute("x2", v.x);
      line.setAttribute("y2", v.y);
      line.setAttribute("class", `svg-edge ${isBlocked ? "blocked" : ""} ${isPathActive ? "path-active" : ""}`);
      line.onclick = () => this.handleEdgeClick(edge.id);
      edgesLayer.appendChild(line);

      // Flowing amber dash line for active route
      if (isPathActive) {
        const flow = document.createElementNS("http://www.w3.org/2000/svg", "line");
        flow.setAttribute("x1", u.x);
        flow.setAttribute("y1", u.y);
        flow.setAttribute("x2", v.x);
        flow.setAttribute("y2", v.y);
        flow.setAttribute("class", "path-flow-dash");
        edgesLayer.appendChild(flow);
      }

      // Cost Pill (Midpoint)
      const midX = (u.x + v.x) / 2;
      const midY = (u.y + v.y) / 2;

      const pill = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      pill.setAttribute("x", midX - 10);
      pill.setAttribute("y", midY - 8);
      pill.setAttribute("width", 20);
      pill.setAttribute("height", 16);
      pill.setAttribute("rx", 4);
      pill.setAttribute("class", `edge-cost-pill ${isPathActive ? "active" : ""}`);
      pill.onclick = () => this.handleEdgeClick(edge.id);
      edgesLayer.appendChild(pill);

      const costText = document.createElementNS("http://www.w3.org/2000/svg", "text");
      costText.setAttribute("x", midX);
      costText.setAttribute("y", midY + 4);
      costText.setAttribute("text-anchor", "middle");
      costText.setAttribute("class", `edge-cost-text ${isPathActive ? "active" : ""}`);
      costText.textContent = edge.cost;
      edgesLayer.appendChild(costText);
    });

    // ── 2. Render Nodes (38px Flat Technical Circles) ──
    const nodeR = 19;

    nodes.forEach(node => {
      const isStart = node.id === this.startNodeId;
      const isBlocked = this.blockedNodes.has(node.id);
      const isClosedExit = node.type === "exit" && this.closedExits.has(node.id);
      const isInPath = this.activeRoute && this.activeRoute.path && this.activeRoute.path.includes(node.id);

      const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
      g.setAttribute("class", `svg-node ${isStart ? "is-start" : ""} ${isInPath ? "in-path" : ""}`);
      g.setAttribute("data-node-id", node.id);
      g.onclick = () => this.handleNodeClick(node.id);

      // Tooltip triggers
      g.onmouseenter = (e) => this.showNodeTooltip(node, e);
      g.onmouseleave = () => this.hideNodeTooltip();

      // Outer Selection / Focus Ring (1.5px)
      const ring = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      ring.setAttribute("cx", node.x);
      ring.setAttribute("cy", node.y);
      ring.setAttribute("r", nodeR + 5);
      ring.setAttribute("class", "node-ring");
      ring.setAttribute("stroke", isStart ? "var(--accent)" : isBlocked || isClosedExit ? "var(--blocked)" : "var(--border-focus)");
      g.appendChild(ring);

      // Base Circle
      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("cx", node.x);
      circle.setAttribute("cy", node.y);
      circle.setAttribute("r", nodeR);
      circle.setAttribute("class", "node-base-circle");

      // Technical blueprint fills & rings
      if (isBlocked || isClosedExit) {
        circle.setAttribute("fill", "var(--blocked-subtle)");
        circle.setAttribute("stroke", "var(--blocked)");
        circle.setAttribute("stroke-width", "1.5");
      } else if (isStart) {
        circle.setAttribute("fill", "var(--accent-subtle)");
        circle.setAttribute("stroke", "var(--accent)");
        circle.setAttribute("stroke-width", "2");
      } else if (isInPath) {
        circle.setAttribute("fill", "var(--accent-dim)");
        circle.setAttribute("stroke", "var(--accent)");
        circle.setAttribute("stroke-width", "1.5");
      } else if (node.type === "exit") {
        circle.setAttribute("fill", "var(--exit-subtle)");
        circle.setAttribute("stroke", "var(--exit)");
        circle.setAttribute("stroke-width", "1.5");
      } else if (node.type === "room") {
        circle.setAttribute("fill", "var(--room-subtle)");
        circle.setAttribute("stroke", "var(--room)");
        circle.setAttribute("stroke-width", "1.5");
      } else {
        circle.setAttribute("fill", "var(--junction-subtle)");
        circle.setAttribute("stroke", "var(--junction)");
        circle.setAttribute("stroke-width", "1.5");
      }
      g.appendChild(circle);

      // Clean SVG Mini Icon & Mono ID inside Node
      if (isBlocked || isClosedExit) {
        // Red technical diagonal cross
        const d = 6;
        const l1 = document.createElementNS("http://www.w3.org/2000/svg", "line");
        l1.setAttribute("x1", node.x - d);
        l1.setAttribute("y1", node.y - d);
        l1.setAttribute("x2", node.x + d);
        l1.setAttribute("y2", node.y + d);
        l1.setAttribute("stroke", "var(--blocked)");
        l1.setAttribute("stroke-width", "2");
        l1.setAttribute("stroke-linecap", "round");
        g.appendChild(l1);

        const l2 = document.createElementNS("http://www.w3.org/2000/svg", "line");
        l2.setAttribute("x1", node.x + d);
        l2.setAttribute("y1", node.y - d);
        l2.setAttribute("x2", node.x - d);
        l2.setAttribute("y2", node.y + d);
        l2.setAttribute("stroke", "var(--blocked)");
        l2.setAttribute("stroke-width", "2");
        l2.setAttribute("stroke-linecap", "round");
        g.appendChild(l2);
      } else if (node.type === "exit") {
        // Technical doorway / exit icon
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", `M ${node.x - 5} ${node.y - 6} L ${node.x + 3} ${node.y - 6} L ${node.x + 3} ${node.y + 6} L ${node.x - 5} ${node.y + 6} Z M ${node.x + 3} ${node.y - 1} L ${node.x + 6} ${node.y - 1} L ${node.x + 6} ${node.y + 1} L ${node.x + 3} ${node.y + 1}`);
        path.setAttribute("fill", "var(--exit)");
        path.setAttribute("opacity", "0.9");
        g.appendChild(path);
      } else {
        // JetBrains Mono ID in center
        const idText = document.createElementNS("http://www.w3.org/2000/svg", "text");
        idText.setAttribute("x", node.x);
        idText.setAttribute("y", node.y + 4);
        idText.setAttribute("text-anchor", "middle");
        idText.setAttribute("font-family", "var(--font-mono)");
        idText.setAttribute("font-size", "11px");
        idText.setAttribute("font-weight", "600");
        idText.setAttribute("fill", isInPath || isStart ? "var(--accent)" : "var(--text)");
        idText.setAttribute("pointer-events", "none");
        idText.textContent = node.id;
        g.appendChild(idText);
      }

      nodesLayer.appendChild(g);

      // Clean Labels Below Node (Never struck through)
      const labelY = node.y + nodeR + 15;

      const title = document.createElementNS("http://www.w3.org/2000/svg", "text");
      title.setAttribute("x", node.x);
      title.setAttribute("y", labelY);
      title.setAttribute("text-anchor", "middle");
      title.setAttribute("class", "node-title-label");
      title.textContent = node.label;
      labelsLayer.appendChild(title);

      const sub = document.createElementNS("http://www.w3.org/2000/svg", "text");
      sub.setAttribute("x", node.x);
      sub.setAttribute("y", labelY + 12);
      sub.setAttribute("text-anchor", "middle");
      sub.setAttribute("class", "node-sub-label");

      let subText = node.type;
      if (isBlocked) subText = this.lang === "bn" ? "অবরুদ্ধ" : "blocked";
      else if (isClosedExit) subText = this.lang === "bn" ? "বন্ধ এক্সিট" : "closed";
      else if (isStart) subText = this.lang === "bn" ? "শুরু" : "start";

      sub.textContent = subText;
      if (isBlocked || isClosedExit) sub.setAttribute("fill", "var(--blocked)");
      else if (isStart) sub.setAttribute("fill", "var(--accent)");
      labelsLayer.appendChild(sub);
    });
  }

  // ══════════════════════════════════════════════════
  // INTERACTIVE TOOLTIPS
  // ══════════════════════════════════════════════════
  setupTooltipEvents() {
    window.addEventListener("mousemove", (e) => {
      const tip = document.getElementById("tooltip");
      if (tip && tip.style.display !== "none") {
        tip.style.left = `${e.clientX + 14}px`;
        tip.style.top = `${e.clientY + 14}px`;
      }
    });
  }

  showNodeTooltip(node, evt) {
    const tip = document.getElementById("tooltip");
    if (!tip || !this.buildingData) return;

    // Find connected corridors
    const connectedEdges = this.buildingData.edges.filter(e => e.from === node.id || e.to === node.id);
    const neighbors = connectedEdges.map(e => e.from === node.id ? e.to : e.from).join(", ");

    tip.innerHTML = `
      <div class="tooltip-title">
        <span>${node.label}</span>
        <span class="mono">(${node.id})</span>
      </div>
      <div class="tooltip-body">
        <div><strong>Type:</strong> ${node.type}</div>
        <div><strong>Corridors:</strong> ${connectedEdges.length} (${neighbors || 'none'})</div>
      </div>
    `;
    tip.style.display = "block";
    tip.style.left = `${evt.clientX + 14}px`;
    tip.style.top = `${evt.clientY + 14}px`;
  }

  hideNodeTooltip() {
    const tip = document.getElementById("tooltip");
    if (tip) tip.style.display = "none";
  }

  // ══════════════════════════════════════════════════
  // MAP CLICK INTERACTIONS
  // ══════════════════════════════════════════════════
  handleNodeClick(nodeId) {
    const node = this.buildingData.nodes.find(n => n.id === nodeId);
    if (!node) return;

    if (this.currentMode === "view") {
      if (node.type === "room" || node.type === "junction") {
        this.setStartNode(node.id);
      } else if (node.type === "exit") {
        this.showToast(`${node.label} (${node.id}) is an exit destination`, "info");
      }
    } else if (this.currentMode === "block") {
      if (node.type === "exit") {
        this.showToast("Exits are toggled in Exit Mode", "warning");
      } else {
        this.toggleNodeBlock(node.id);
      }
    } else if (this.currentMode === "exit") {
      if (node.type === "exit") {
        this.toggleExitState(node.id);
      } else {
        this.showToast("Only exits can be opened/closed in Exit Mode", "warning");
      }
    }
  }

  handleEdgeClick(edgeId) {
    if (this.currentMode === "edge" || this.currentMode === "view") {
      this.toggleEdgeBlock(edgeId);
    }
  }

  // ══════════════════════════════════════════════════
  // ROUTE RESULT DISPLAY (STEPPER + UNCLIPPED COST)
  // ══════════════════════════════════════════════════
  renderRouteResult(status) {
    const container = document.getElementById("route-display");
    if (!container) return;

    if (!this.startNodeId) {
      container.innerHTML = `
        <div class="route-idle">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 15"/></svg>
          <span>${this.t("routeEmptyText")}</span>
        </div>
      `;
      return;
    }

    if (status === "START_BLOCKED") {
      container.innerHTML = `
        <div class="route-alert error">
          <svg viewBox="0 0 16 16" fill="currentColor"><path fill-rule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm-.75-9.75a.75.75 0 0 1 1.5 0v4a.75.75 0 0 1-1.5 0v-4zm.75 6.75a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/></svg>
          <span>${this.t("statusStartBlocked")}</span>
        </div>
      `;
      return;
    }

    if (status === "NO_ROUTE" || !this.activeRoute) {
      container.innerHTML = `
        <div class="route-alert error">
          <svg viewBox="0 0 16 16" fill="currentColor"><path fill-rule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm-.75-9.75a.75.75 0 0 1 1.5 0v4a.75.75 0 0 1-1.5 0v-4zm.75 6.75a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/></svg>
          <span>${this.t("statusNoRoute")}</span>
        </div>
      `;
      return;
    }

    const { path, exitId, cost } = this.activeRoute;
    const nodeMap = new Map();
    this.buildingData.nodes.forEach(n => nodeMap.set(n.id, n));

    const stepChips = path.map((id, index) => {
      const node = nodeMap.get(id);
      const isLast = index === path.length - 1;
      return `
        <span class="step-chip ${node ? node.type : ''}" title="${node ? node.label : id}">
          ${id}
        </span>
        ${!isLast ? `<span class="step-arrow">→</span>` : ''}
      `;
    }).join("");

    container.innerHTML = `
      <div class="route-alert success">
        <svg viewBox="0 0 16 16" fill="currentColor"><path fill-rule="evenodd" d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207z"/></svg>
        <span>${this.t("destExitLabel")}: <strong>${exitId}</strong></span>
      </div>

      <div class="stepper-wrapper">
        <div class="stepper-label">${this.t("evacSequenceLabel")}</div>
        <div class="stepper-flow">${stepChips}</div>
      </div>

      <!-- Prominent, unclipped Cost Box -->
      <div class="prominent-cost-box">
        <div class="cost-box-left">
          <span class="cost-box-title">${this.t("costLabel")}</span>
          <span class="cost-box-dest">${this.startNodeId} → ${exitId}</span>
        </div>
        <div class="cost-box-value">${cost}</div>
      </div>
    `;
  }

  // ══════════════════════════════════════════════════
  // RIGHT SIDEBAR (NODES & CORRIDORS LIST)
  // ══════════════════════════════════════════════════
  renderSidebarLists() {
    if (!this.buildingData) return;
    const { nodes, edges } = this.buildingData;

    // 1. Nodes List
    const nodesList = document.getElementById("nodes-list");
    nodesList.innerHTML = "";

    nodes.forEach(node => {
      const isStart = node.id === this.startNodeId;
      const isBlocked = this.blockedNodes.has(node.id);
      const isClosedExit = node.type === "exit" && this.closedExits.has(node.id);
      const isInPath = this.activeRoute && this.activeRoute.path && this.activeRoute.path.includes(node.id);

      const row = document.createElement("div");
      row.className = `list-row ${isStart ? "is-selected" : ""} ${isBlocked || isClosedExit ? "is-blocked" : ""}`;
      row.onclick = () => this.handleNodeClick(node.id);

      row.innerHTML = `
        <span class="row-dot ${isBlocked || isClosedExit ? 'blocked' : node.type}"></span>
        <span class="row-name">${node.label}</span>
        <span class="row-id mono">${node.id}</span>
        <span class="row-badge ${isBlocked || isClosedExit ? 'blocked' : node.type}">
          ${isBlocked ? 'blocked' : isClosedExit ? 'closed' : node.type}
        </span>
      `;
      nodesList.appendChild(row);
    });

    // 2. Corridors List
    const edgesList = document.getElementById("edges-list");
    edgesList.innerHTML = "";

    const activeRouteEdgeIds = new Set();
    if (this.activeRoute && this.activeRoute.path) {
      for (let i = 0; i < this.activeRoute.path.length - 1; i++) {
        const u = this.activeRoute.path[i];
        const v = this.activeRoute.path[i + 1];
        const edge = edges.find(e => (e.from === u && e.to === v) || (e.from === v && e.to === u));
        if (edge) activeRouteEdgeIds.add(edge.id);
      }
    }

    edges.forEach(edge => {
      const isBlocked = this.blockedEdges.has(edge.id) || this.blockedNodes.has(edge.from) || this.blockedNodes.has(edge.to);
      const isInPath = activeRouteEdgeIds.has(edge.id);

      const row = document.createElement("div");
      row.className = `list-row ${isInPath ? "is-selected" : ""} ${isBlocked ? "is-blocked" : ""}`;
      row.onclick = () => this.handleEdgeClick(edge.id);

      row.innerHTML = `
        <span class="row-dot ${isBlocked ? 'blocked' : 'junction'}"></span>
        <span class="row-name mono">${edge.from} ↔ ${edge.to}</span>
        <span class="row-id mono">${edge.id}</span>
        <span class="row-badge cost mono">${edge.cost}</span>
      `;
      edgesList.appendChild(row);
    });
  }

  // ══════════════════════════════════════════════════
  // STATUS & NOTIFICATIONS
  // ══════════════════════════════════════════════════
  setStatus(message, type = "idle") {
    const dot = document.getElementById("status-indicator-dot");
    const textEl = document.getElementById("status-text");
    if (!dot || !textEl) return;
    dot.className = `status-dot ${type}`;
    textEl.textContent = message;
  }

  showToast(message, type = "info") {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast-item ${type}`;
    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(8px)";
      setTimeout(() => toast.remove(), 200);
    }, 3200);
  }
}

// Global Singleton Application Instance
const app = new SmartEscapeApp();
window.app = app;
