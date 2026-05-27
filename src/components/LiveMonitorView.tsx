import { useState, useEffect, useRef } from "react";
import { useApp } from "../AppContext";
import { 
  Brain, Search, Activity, Code, Terminal, Clock, Coins, 
  Cpu, Network, Play, Pause, RefreshCw, ChevronDown, ChevronRight,
  ShieldAlert, Globe, Check, Layers, Sparkles, FileCode, ArrowRight,
  Folder, ArrowLeft, ArrowRight as ArrowRightIcon, RefreshCw as RotateIcon,
  Laptop, Eye, BookOpen, FileText, CheckCircle
} from "lucide-react";

interface ThoughtStreamItem {
  id: string;
  time: string;
  category: "planning" | "searching" | "synthesizing" | "validating" | "compiling" | "safety";
  title: string;
  details: string;
  model: string;
  tokenCount: number;
}

interface LiveUrlCrawl {
  url: string;
  status: "scanning" | "extracting" | "validated";
  progress: number;
  resultsCount: number;
}

// Global dictionary of mock browser pages for realistic crawler behavior
const MOCK_BROWSER_DASHBOARD: Record<string, { title: string; subtitle: string; domain: string; text: string; keywords: string[] }> = {
  "default": {
    title: "NEVA Grounding Core",
    subtitle: "Awaiting Live Web Grounding Query...",
    domain: "neva.internal",
    text: "The web ingestor node is idle. Enter a custom search term above or await autonomous agent execution to stream crawling matrices live.",
    keywords: ["cognitive", "ingestion", "sandbox", "grounding"]
  },
  "openrouter endpoint metrics": {
    title: "OpenRouter Unified API Model Catalog & Realtime Latency Indices",
    subtitle: "Grounding Data Retrieved on May 27, 2026",
    domain: "openrouter.ai/docs/models",
    text: "Unified routing schemas represent the standard path for Antigravity-class clusters. Current best performance tier points directly to deep-reasoning layers. Re-weighting factors suggest scaling fallback channels automatically using Flash architectures when latency reaches critical 4500ms response bounds.",
    keywords: ["unified standard", "antigravity routing", "pro fallback", "latency limits"]
  },
  "esbuild package build parameters": {
    title: "esbuild API - Bundler & Compiler Architecture Benchmarks",
    subtitle: "esbuild native compilation vectors",
    domain: "esbuild.github.io/faq",
    text: "By utilizing parallel Go routine parsing, esbuild bypasses standard JavaScript runtime bottlenecks. Bundle optimization structures execute tree-shaking across AST registers simultaneously. Output format formats to CommonJS or ESModules seamlessly without allocating intermediate virtual storage nodes.",
    keywords: ["esbuild bundle", "go compiler parallel", "tree-shaking registers", "commonjs bundle"]
  },
  "react concurrent custom state synchronization": {
    title: "React Virtual DOM Reconciliation Strategy in Sandbox Systems",
    subtitle: "MDN CSS Custom Properties & State Bindings Reference",
    domain: "react.dev/reference/react",
    text: "Concurrent rendering allows state engines to maintain background state snapshots while progressive loaders transition page views. When building visual timelines, stabilize your update intervals outside the render cycles to prevent high-frequency re-execution and potential UI thread freezing.",
    keywords: ["concurrent rendering", "reconciliation snapshots", "stablized intervals", "progressive loader"]
  },
  "antigravity hyper-agent sandboxing parameters": {
    title: "AI Studio Build - Hyper-Agent Sandbox Constraints & Telemetry",
    subtitle: "Official Platform Security Guidelines v4.11",
    domain: "ai.studio/build/security-telemetry",
    text: "Virtual workspaces are restricted to isolated folder trees. Direct socket connections are audited by the Security Integrity Guard. Files created via custom file-write handlers are automatically compiled at build intervals without spawning unrequested background process daemons.",
    keywords: ["sandbox restrictions", "integrity-guard check", "safe folder trees", "isolated ports"]
  }
};

// Global dictionary of files for mock Editor workspace
const SYSTEM_WORKSPACE_FILES: Record<string, { name: string; lang: string; code: string }> = {
  "/src/components/NevaBrainCore.ts": {
    name: "NevaBrainCore.ts",
    lang: "typescript",
    code: `// NEVA Cognitive Brain Core processing unit
// Coordinates prompt density, model prioritization, and safe shell routing

export interface CoreConfig {
  temperature: number;
  maxTokens: number;
  autonomousLevel: number;
}

export class CoreDispatcher {
  private config: CoreConfig;
  private threadBuffer: string[] = [];

  constructor(cfg: CoreConfig) {
    this.config = cfg;
    console.log("NEVA_COGNITIVE_OS initialized successfully.");
  }

  public async coordinateTaskNode(task: string) {
    const confidence = Math.random() * 0.12 + 0.88;
    this.threadBuffer.push(task);
    
    return {
      status: "aligned",
      confidence,
      allocatedNode: confidence > 0.92 ? "planner" : "crawler",
      timestamp: new Date().toISOString()
    };
  }
}`
  },
  "/src/utils/fileExporter.ts": {
    name: "fileExporter.ts",
    lang: "typescript",
    code: `// Dynamic ZIP Bundle Packager & Streaming Blob Producer
// Handles multi-format output compilation on-the-fly

import JSZip from "jszip";

export function downloadRawFile(filename: string, text: string, mimeType: string) {
  const blob = new Blob([text], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function packageBundleToZip(files: { name: string; content: string }[]) {
  const zip = new JSZip();
  files.forEach(f => {
    zip.file(f.name, f.content);
  });
  return await zip.generateAsync({ type: "blob" });
}`
  },
  "/src/components/OutputStudio.tsx": {
    name: "OutputStudio.tsx",
    lang: "tsx",
    code: `import React, { useState } from "react";
import { Download, Archive, Copy } from "lucide-react";

export function OutputStudio() {
  const [copied, setCopied] = useState(false);

  return (
    <div className="border border-white/10 rounded-xl bg-zinc-950 p-5">
      <div className="flex justify-between items-center border-b border-white/5 pb-3">
        <h3 className="text-xs font-mono font-bold text-cyan-400">OUTPUT_ARCHIVE</h3>
        <button className="p-1 text-[9px] border border-zinc-800 text-zinc-400">
          <Copy className="w-2.5 h-2.5" />
        </button>
      </div>
      <div className="p-4 text-xs text-zinc-300">
        Generated files ready for immediate export. Supports RAW text, Markdown, HTML, and ZIP bundles.
      </div>
    </div>
  );
}`
  },
  "/src/App.tsx": {
    name: "App.tsx",
    lang: "tsx",
    code: `import React from "react";
import ChatCockpit from "./components/ChatCockpit";
import LiveMonitorView from "./components/LiveMonitorView";

export default function App() {
  return (
    <main className="min-h-screen bg-[#020204] text-zinc-200">
      <div className="max-w-7xl mx-auto p-4 space-y-6">
        <ChatCockpit />
        <LiveMonitorView />
      </div>
    </main>
  );
}`
  },
  "/index.html": {
    name: "index.html",
    lang: "html",
    code: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>NEVA Artificial Intelligent Workspace</title>
  </head>
  <body class="bg-[#030305]">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`
  }
};

export default function LiveMonitorView() {
  const { steps, activeConversation, files } = useApp();
  const [simulationActive, setSimulationActive] = useState(true);
  const [activeNode, setActiveNode] = useState<"planner" | "crawler" | "compiler" | "auditor">("planner");
  const [tokenCounter, setTokenCounter] = useState(124580);
  const [costCounter, setCostCounter] = useState(0.2468);
  const [cpuLoad, setCpuLoad] = useState(38);
  const [radarAngle, setRadarAngle] = useState(0);
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [expandedThoughtId, setExpandedThoughtId] = useState<string | null>(null);

  // SANDBOX AGENT SCREEN STATES (MANUS STYLE)
  const [screenTab, setScreenTab] = useState<"browser" | "editor">("editor");
  
  // Custom interactive browser state
  const [browserUrl, setBrowserUrl] = useState("https://google.com/search?q=openrouter+unified+endpoint+indicators");
  const [browserQuery, setBrowserQuery] = useState("openrouter endpoint metrics");
  const [browserSearchInputValue, setBrowserSearchInputValue] = useState("");
  const [browserLoading, setBrowserLoading] = useState(false);
  
  // Custom interactive editor workspace state
  const [editorFile, setEditorFile] = useState("/src/components/NevaBrainCore.ts");
  const [editorCode, setEditorCode] = useState(SYSTEM_WORKSPACE_FILES["/src/components/NevaBrainCore.ts"].code);
  const [editorWriting, setEditorWriting] = useState(false);
  const [editorWorkspaceFiles, setEditorWorkspaceFiles] = useState<Record<string, {name: string, lang: string, code: string}>>(SYSTEM_WORKSPACE_FILES);

  // Lists of simulated thoughts for the Digital Brain Loop
  const simulatedThoughts: ThoughtStreamItem[] = [

    {
      id: "sim-1",
      time: "07:44:01",
      category: "planning",
      title: "Analyzing initial layout workspace hierarchy",
      details: "Inspecting directory nodes to map component layout vectors inside /src/components and /src/App.tsx.",
      model: "Gemini 2.5 Pro",
      tokenCount: 1540
    },
    {
      id: "sim-2",
      time: "07:44:12",
      category: "searching",
      title: "Web crawling grounding indexes: OpenRouter endpoints",
      details: "Formulating crawl query for OpenRouter model schema indices to confirm available latency bounds & pricing.",
      model: "Gemini 2.5 Flash",
      tokenCount: 980
    },
    {
      id: "sim-3",
      time: "07:44:25",
      category: "synthesizing",
      title: "Synthesizing dynamic state manager for History timeline",
      details: "Executing React state context mapping definitions to track runs & steps within a 7-column grid component.",
      model: "Gemini 2.5 Pro",
      tokenCount: 4210
    },
    {
      id: "sim-4",
      time: "07:44:38",
      category: "validating",
      title: "Evaluating layout contrast scores & accessibility index",
      details: "Running programmatic contrast auditing across background Slate levels and custom accent Cyan vectors.",
      model: "Gemini 1.5 Flash",
      tokenCount: 720
    },
    {
      id: "sim-5",
      time: "07:44:50",
      category: "compiling",
      title: "Compiling esbuild production bundle vectors",
      details: "Triggering client-side tree-shaking parser on new /src/components modules for deployment optimization.",
      model: "esbuild compiler",
      tokenCount: 0
    },
    {
      id: "sim-6",
      time: "07:44:58",
      category: "safety",
      title: "Running threat vector audit: sandbox directory check",
      details: "Auditing write payloads to ensure compliance with container permissions and isolate filesystem scopes.",
      model: "NEVA Integrity Guard",
      tokenCount: 340
    }
  ];

  const simulatedCrawls: LiveUrlCrawl[] = [
    { url: "https://openrouter.ai/docs/models/gemini", status: "validated", progress: 100, resultsCount: 12 },
    { url: "https://api.github.com/repos/vitejs/vite/issues", status: "extracting", progress: 78, resultsCount: 4 },
    { url: "https://npmjs.org/package/lucide-react", status: "scanning", progress: 35, resultsCount: 1 }
  ];

  const [thoughtStream, setThoughtStream] = useState<ThoughtStreamItem[]>(simulatedThoughts);
  const [crawlList, setCrawlList] = useState<LiveUrlCrawl[]>(simulatedCrawls);

  // Dynamic Simulators for cinematic experience
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (simulationActive) {
      interval = setInterval(() => {
        // Fluctuating metric values
        setTokenCounter(prev => prev + Math.floor(Math.random() * 22) + 5);
        setCostCounter(prev => prev + (Math.random() * 0.00015));
        setCpuLoad(prev => {
          const delta = Math.floor(Math.random() * 21) - 10;
          return Math.min(96, Math.max(15, prev + delta));
        });

        // Rotate sonar angle
        setRadarAngle(prev => (prev + 4) % 360);

        // Randomly rotate active node in schematic
        const nodes: ("planner" | "crawler" | "compiler" | "auditor")[] = ["planner", "crawler", "compiler", "auditor"];
        if (Math.random() > 0.75) {
          const nextNode = nodes[Math.floor(Math.random() * nodes.length)];
          setActiveNode(nextNode);

          const toolMap: Record<string, string[]> = {
            planner: ["decompose_task_tree", "formulate_heuristics"],
            crawler: ["google_web_search", "read_url_content"],
            compiler: ["write_to_file", "npm_run_compile"],
            auditor: ["run_safety_audit", "validate_imports"]
          };
          const tools = toolMap[nextNode];
          setActiveTool(tools[Math.floor(Math.random() * tools.length)]);
        }

        // Every 9 seconds, simulate an interactive screen transition (browsing or typing)
        if (Math.random() > 0.8) {
          const actions = ["search_a", "search_b", "write_a", "write_b"];
          const act = actions[Math.floor(Math.random() * actions.length)];
          
          if (act === "search_a") {
            setScreenTab("browser");
            setBrowserLoading(true);
            setBrowserQuery("openrouter endpoint metrics");
            setBrowserUrl("https://openrouter.ai/docs/models/gemini");
            setTimeout(() => setBrowserLoading(false), 800);
          } else if (act === "search_b") {
            setScreenTab("browser");
            setBrowserLoading(true);
            setBrowserQuery("esbuild package build parameters");
            setBrowserUrl("https://esbuild.github.io/faq/#bundler");
            setTimeout(() => setBrowserLoading(false), 800);
          } else if (act === "write_a") {
            setScreenTab("editor");
            setEditorFile("/src/components/NevaBrainCore.ts");
            setEditorCode(SYSTEM_WORKSPACE_FILES["/src/components/NevaBrainCore.ts"].code);
            setEditorWriting(true);
            setTimeout(() => setEditorWriting(false), 1100);
          } else if (act === "write_b") {
            setScreenTab("editor");
            setEditorFile("/src/utils/fileExporter.ts");
            setEditorCode(SYSTEM_WORKSPACE_FILES["/src/utils/fileExporter.ts"].code);
            setEditorWriting(true);
            setTimeout(() => setEditorWriting(false), 1100);
          }
        }

        // Simulating scrolling thoughts stream
        if (Math.random() > 0.88) {
          const categories: ThoughtStreamItem["category"][] = ["planning", "searching", "synthesizing", "validating", "compiling", "safety"];
          const cat = categories[Math.floor(Math.random() * categories.length)];
          const models = ["Gemini 2.5 Pro", "Gemini 2.5 Flash", "Gemini 1.5 Flash", "esbuild compiler", "NEVA Integrity Guard"];
          
          const messagesMap: Record<ThoughtStreamItem["category"], { title: string; desc: string }> = {
            planning: { title: "Refining goal path metrics", desc: "Analyzing current project state to prioritize high-level UX adjustments." },
            searching: { title: "Deep query formulation", desc: "Formulated search tokens on modern CSS variables standard for dark canvas layouts." },
            synthesizing: { title: "Drafting layout optimizations", desc: "Injecting flex-wrap and responsive clamp font sizes inside App component hooks." },
            validating: { title: "Reviewing type parametersafety", desc: "Auditing React hook dependency arrays to eliminate potential loops." },
            compiling: { title: "Parsing package asset maps", desc: "Loading icons from lucide-react dynamically and preparing tree shaking indexes." },
            safety: { title: "Verifying container sandboxes", desc: "Executing sandbox permissions check on modified workspaces." }
          };

          const selection = messagesMap[cat];
          const newThought: ThoughtStreamItem = {
            id: `sim-th-${Date.now()}`,
            time: new Date().toLocaleTimeString(),
            category: cat,
            title: selection.title,
            details: selection.desc,
            model: models[Math.floor(Math.random() * models.length)],
            tokenCount: cat === "compiling" ? 0 : Math.floor(Math.random() * 2200) + 200
          };

          setThoughtStream(prev => [newThought, ...prev.slice(0, 8)]);
        }

        // Simulating crawling Urls changes
        setCrawlList(prev => {
          return prev.map(cr => {
            if (cr.status === "validated") {
              if (Math.random() > 0.95) {
                const urls = [
                  "https://openrouter.ai/docs/api-reference",
                  "https://github.com/microsoft/typescript/issues",
                  "https://caniuse.com/mdn-css_custom_properties",
                  "https://react.dev/reference/react"
                ];
                return {
                  url: urls[Math.floor(Math.random() * urls.length)],
                  status: "scanning",
                  progress: 5,
                  resultsCount: 0
                };
              }
              return cr;
            }
            if (cr.status === "scanning") {
              const nextProgress = cr.progress + Math.floor(Math.random() * 15) + 5;
              return {
                ...cr,
                progress: nextProgress >= 60 ? 60 : nextProgress,
                status: nextProgress >= 60 ? "extracting" : "scanning"
              };
            }
            // extracting
            const nextProgress = cr.progress + Math.floor(Math.random() * 10) + 5;
            return {
              ...cr,
              progress: nextProgress >= 100 ? 100 : nextProgress,
              status: nextProgress >= 100 ? "validated" : "extracting",
              resultsCount: nextProgress >= 100 ? Math.floor(Math.random() * 15) + 2 : cr.resultsCount
            };
          });
        });

      }, 1000);
    } else {
      // Live mode mappings
      interval = setInterval(() => {
        setRadarAngle(prev => (prev + 3) % 360);
        setCpuLoad(prev => {
          // If active running steps exist, cpu goes up
          const running = steps.some(s => s.status === "running");
          return running ? Math.min(92, Math.floor(65 + Math.random() * 15)) : Math.max(12, Math.floor(22 + Math.random() * 8));
        });

        // Sync live outputs from real step array inside AppContext
        if (steps.length > 0) {
          const mapped: ThoughtStreamItem[] = steps.slice(-6).reverse().map(s => {
            let cat: ThoughtStreamItem["category"] = "planning";
            if (s.agentKey === "NEVA_RESEARCHER") cat = "searching";
            if (s.agentKey === "NEVA_ENGINEER") cat = "synthesizing";
            if (s.agentKey === "NEVA_SAFETY") cat = "safety";
            if (s.agentKey === "NEVA_CRITIC") cat = "validating";

            return {
              id: s.id,
              time: new Date(s.startedAt).toLocaleTimeString(),
              category: cat,
              title: s.tool ? `Tool execution: ${s.tool}` : `Running ${s.agentKey}`,
              details: s.reasoningTrace || s.inputPreview || "Executing node-level operational pipeline routines.",
              model: s.modelUsed || "Gemini 2.5 Pro",
              tokenCount: s.durationMs ? Math.floor(s.durationMs * 0.4) : 480
            };
          });
          setThoughtStream(mapped);
        }
      }, 1100);
    }

    return () => clearInterval(interval);
  }, [simulationActive, steps]);

  // Dedicated secondary hook for processing actual active steps to drive Browser/IDE screen tab automatically
  useEffect(() => {
    if (simulationActive || steps.length === 0) return;

    // Grab latest step containing tool arguments
    const toolSteps = steps.filter(s => s.tool);
    if (toolSteps.length === 0) return;
    const lastToolStep = toolSteps[toolSteps.length - 1];

    setActiveTool(lastToolStep.tool || null);

    // If searching web, update Browser screen
    if (lastToolStep.tool === "google_web_search") {
      setScreenTab("browser");
      setBrowserLoading(true);
      const argStr = JSON.stringify(lastToolStep.toolInput);
      let queryStr = "live query";
      // Safe parsing
      try {
        if (lastToolStep.toolInput && typeof lastToolStep.toolInput === "object") {
          queryStr = lastToolStep.toolInput.query || lastToolStep.toolInput.Query || lastToolStep.toolInput.queryStr || "web reference specs";
        } else if (lastToolStep.inputPreview) {
          queryStr = lastToolStep.inputPreview;
        }
      } catch(e) {}
      
      setBrowserQuery(queryStr);
      setBrowserUrl(`https://google.com/search?q=${encodeURIComponent(queryStr)}`);
      
      const timer = setTimeout(() => {
        setBrowserLoading(false);
      }, 850);
      return () => clearTimeout(timer);
    }

    // Handlers for crawled Link contents
    if (lastToolStep.tool === "read_url_content") {
      setScreenTab("browser");
      setBrowserLoading(true);
      let urlStr = "https://neva.ai/ingestor-docs";
      try {
        if (lastToolStep.toolInput && typeof lastToolStep.toolInput === "object") {
          urlStr = lastToolStep.toolInput.Url || lastToolStep.toolInput.url || lastToolStep.toolInput.targetUrl || "https://neva.ai/spec-index";
        }
      } catch(e) {}
      setBrowserUrl(urlStr);

      const timer = setTimeout(() => {
        setBrowserLoading(false);
      }, 750);
      return () => clearTimeout(timer);
    }

    // Handlers for file writing
    if (lastToolStep.tool === "edit_file" || lastToolStep.tool === "create_file" || lastToolStep.tool === "multi_edit_file") {
      setScreenTab("editor");
      setEditorWriting(true);

      let targetPath = "/src/components/NevaBrainCore.ts";
      let incomingCode = "// Safe automated synthesis executed under Sandbox engine boundary...";

      try {
        if (lastToolStep.toolInput && typeof lastToolStep.toolInput === "object") {
          targetPath = lastToolStep.toolInput.TargetFile || lastToolStep.toolInput.AbsolutePath || lastToolStep.toolInput.path || targetPath;
          incomingCode = lastToolStep.toolInput.Content || lastToolStep.toolInput.content || lastToolStep.toolInput.ReplacementContent || incomingCode;
        }
      } catch(e) {}

      setEditorFile(targetPath);
      setEditorCode(incomingCode);

      // Dynamically add to editor view record so fileexplorer lists it on the fly
      setEditorWorkspaceFiles(prev => ({
        ...prev,
        [targetPath]: {
          name: targetPath.split("/").pop() || "draft.tsx",
          lang: targetPath.endsWith(".tsx") || targetPath.endsWith(".ts") ? "typescript" : "javascript",
          code: incomingCode
        }
      }));

      const timer = setTimeout(() => {
        setEditorWriting(false);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [steps, simulationActive]);

  return (
    <div className="space-y-6 select-none animate-fade-in font-sans pb-10 max-w-7xl mx-auto w-full">
      
      {/* GLOWING HEADER & SIMULATOR ACCENT CONTROL */}
      <div className="flex flex-wrap items-center justify-between border-b border-zinc-900 pb-5 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-cyan-500/10 rounded-xl border border-cyan-500/25 text-cyan-400 relative">
            <Brain className="w-5.5 h-5.5 animate-pulse text-cyan-300" />
            <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-cyan-400 glow-pulse-cyan animate-ping"></span>
          </div>
          <div className="text-left">
            <h1 className="text-xs font-mono font-bold uppercase tracking-[0.25em] text-white flex items-center gap-2">
              NEVA Live Cognitive Brain OS Monitor
              <span className="w-2 h-2 rounded-full bg-emerald-400 glow-pulse-emerald animate-pulse"></span>
            </h1>
            <p className="text-[10px] text-zinc-500 font-mono mt-0.5">MANUS-INSPIRED FULL VISUAL INTELLIGENCE WORKSPACE</p>
          </div>
        </div>

        {/* WORKSPACE FEED SWITCHER */}
        <div className="flex items-center gap-3.5 bg-zinc-950 p-1 border border-zinc-900 rounded-2xl shadow-inner select-none">
          <button
            onClick={() => {
              setSimulationActive(true);
              setThoughtStream(simulatedThoughts);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-[10px] font-mono uppercase tracking-wider font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              simulationActive 
                ? "bg-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.3)] font-extrabold" 
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <Sparkles className="w-3 h-3" />
            Simulated OS Brain
          </button>
          <button
            onClick={() => {
              setSimulationActive(false);
              // populate from actual memory steps initially if any
              if (steps.length > 0) {
                // translate steps immediately
              } else {
                setThoughtStream([]);
              }
            }}
            className={`px-3.5 py-1.5 rounded-xl text-[10px] font-mono uppercase tracking-wider font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              !simulationActive 
                ? "bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)] font-extrabold" 
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <Activity className="w-3 h-3" />
            Live Client Sync
          </button>
        </div>
      </div>

      {/* CHIPS ROW: COGNITIVE OVERRIDE VELOCITY TICKERS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 leading-none">
        
        {/* Token Counter */}
        <div className="glass-panel p-4.5 border border-zinc-900/80 bg-[#040507]/40 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 opacity-25 group-hover:opacity-40 transition-opacity">
            <Cpu className="w-8 h-8 text-cyan-400" />
          </div>
          <span className="text-[8px] font-mono text-zinc-600 block uppercase tracking-wider font-bold">Spent Token Density</span>
          <span className="text-xl font-mono font-bold text-zinc-100 block mt-2 tracking-tight select-all">
            {simulationActive ? tokenCounter.toLocaleString() : (steps.reduce((acc, curr) => acc + (curr.durationMs ? Math.floor(curr.durationMs * 0.4) : 120), 0) + 120500).toLocaleString()}
          </span>
          <span className="text-[9px] text-cyan-400 font-mono block mt-1 uppercase font-semibold">TICK RATE: CLK RECTIFY</span>
        </div>

        {/* Estimated Cost USD */}
        <div className="glass-panel p-4.5 border border-zinc-900/80 bg-[#040507]/40 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 opacity-25 group-hover:opacity-40 transition-opacity">
            <Coins className="w-8 h-8 text-emerald-400" />
          </div>
          <span className="text-[8px] font-mono text-zinc-650 block uppercase tracking-wider font-bold">Estimated Cost (USD)</span>
          <span className="text-xl font-mono font-bold text-[#10b981] block mt-2 tracking-tight select-all">
            ${simulationActive ? costCounter.toFixed(5) : ((steps.reduce((acc, curr) => acc + (curr.durationMs ? Math.floor(curr.durationMs * 0.4) : 120), 0) + 120500) * 0.000002).toFixed(5)}
          </span>
          <span className="text-[9px] text-zinc-500 font-mono block mt-1 uppercase">DYNAMIC API OVERLAY</span>
        </div>

        {/* Active Node Buffer Load */}
        <div className="glass-panel p-4.5 border border-zinc-900/80 bg-[#040507]/40 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 opacity-25 group-hover:opacity-40 transition-opacity">
            <Activity className="w-8 h-8 text-purple-400" />
          </div>
          <span className="text-[8px] font-mono text-zinc-650 block uppercase tracking-wider font-bold">Active Host CPU load</span>
          <span className="text-xl font-mono font-bold text-purple-400 block mt-2 tracking-tight select-all">
            {cpuLoad}% CPU
          </span>
          <span className="text-[9px] text-zinc-550 font-mono block mt-1 uppercase">SENSORS STABILIZED: OK</span>
        </div>

        {/* Cognitive Rate */}
        <div className="glass-panel p-4.5 border border-zinc-900/80 bg-[#040507]/40 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 opacity-25 group-hover:opacity-40 transition-opacity">
            <Layers className="w-8 h-8 text-amber-500" />
          </div>
          <span className="text-[8px] font-mono text-zinc-650 block uppercase tracking-wider font-bold">Cognitive Velocity</span>
          <span className="text-xl font-mono font-bold text-amber-500 block mt-2 tracking-tight">
            {simulationActive ? "148 t/sec" : steps.some(s => s.status === "running") ? "224 t/sec" : "0 t/sec"}
          </span>
          <span className="text-[9px] text-[#737373] font-mono block mt-1 uppercase">HYPERTHREADED SCHEMES</span>
        </div>
      </div>

      {/* AGENT LIVE SANDBOX MONITOR SCREEN (MANUS-AI STYLE VISUAL CONTAINER) */}
      <div className="border border-zinc-900 bg-[#030407] rounded-[24px] overflow-hidden p-1 shadow-2xl relative select-none">
        
        {/* Glow Ambient Ring */}
        <div className="absolute -inset-px rounded-[24px] bg-gradient-to-r from-cyan-500/10 via-[#27272a]/20 to-purple-500/10 pointer-events-none z-0" />
        
        {/* Screen Bezel Frame Inner */}
        <div className="bg-[#05070c] rounded-[22px] border border-zinc-900/50 p-4 relative z-10">
          
          {/* Top Chassis Panel Control */}
          <div className="flex flex-wrap items-center justify-between border-b border-zinc-900/80 pb-3 mb-4 gap-3">
            <div className="flex items-center gap-3">
              {/* Colored Monitor Circles */}
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 border border-rose-600/30 block shadow-[0_0_8px_rgba(239,68,68,0.3)]"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 border border-amber-600/30 block shadow-[0_0_8px_rgba(245,158,11,0.3)]"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 border border-emerald-600/30 block shadow-[0_0_8px_rgba(16,185,129,0.3)]"></span>
              </div>
              <div className="h-4 w-px bg-zinc-800 shrink-0" />
              <div className="flex items-center gap-2">
                <Laptop className="w-4 h-4 text-cyan-400" />
                <span className="text-[10.5px] font-mono font-black text-zinc-350 tracking-wider uppercase">
                  AGENT SANDBOX CONSOLE MONITOR
                </span>
                <span className="text-[7.5px] font-mono font-bold bg-cyan-950/40 text-cyan-400 px-1.5 py-0.5 rounded border border-cyan-800/20 uppercase tracking-widest animate-pulse">
                  {simulationActive ? "virtual_sim" : "live_client"}
                </span>
              </div>
            </div>

            {/* SCREEN SELECTOR TABS (MANUS STYLE) */}
            <div className="flex items-center gap-1.5 bg-zinc-950/80 border border-zinc-850 p-1 rounded-xl shadow-inner shrink-0">
              <button
                onClick={() => setScreenTab("browser")}
                className={`px-3 py-1.5 rounded-lg text-[9.5px] font-mono uppercase tracking-wider font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  screenTab === "browser"
                    ? "bg-zinc-900 text-cyan-400 border border-cyan-500/10 shadow-sm"
                    : "text-zinc-550 hover:text-zinc-350"
                }`}
              >
                <Globe className={`w-3.5 h-3.5 ${screenTab === "browser" && browserLoading ? "animate-spin text-cyan-400" : "text-zinc-500"}`} />
                <span>🌐 crawling_browser.sh</span>
                {browserLoading && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>}
              </button>

              <button
                onClick={() => setScreenTab("editor")}
                className={`px-3 py-1.5 rounded-lg text-[9.5px] font-mono uppercase tracking-wider font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  screenTab === "editor"
                    ? "bg-zinc-900 text-purple-400 border border-purple-500/10 shadow-sm"
                    : "text-zinc-555 hover:text-zinc-350"
                }`}
              >
                <Code className={`w-3.5 h-3.5 ${screenTab === "editor" && editorWriting ? "animate-pulse text-purple-400" : "text-zinc-550"}`} />
                <span>📁 engineer_editor.app</span>
                {editorWriting && <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping"></span>}
              </button>
            </div>
          </div>

          {/* MAIN MONITOR PRESENTATION VIEWPORTS */}
          <div className="relative min-h-[380px] bg-[#020306] border border-zinc-900/60 rounded-xl overflow-hidden shadow-inner flex flex-col justify-between">
            
            {/* 1. INTERACTIVE WEB BROWSER SUB-VIEW */}
            {screenTab === "browser" && (
              <div className="w-full h-full flex flex-col p-3 space-y-3.5 flex-grow animate-fade-in text-left">
                
                {/* Browser Top Navigation Address Bar */}
                <div className="flex items-center bg-[#07090f] border border-zinc-900 p-2 rounded-xl gap-2.5">
                  <div className="flex items-center gap-1 bg-[#010204] p-1 border border-zinc-950 rounded-lg shrink-0">
                    <button className="p-1 text-zinc-650 hover:text-zinc-400 cursor-pointer hover:bg-zinc-900 rounded transition-colors">
                      <ArrowLeft className="w-3 h-3" />
                    </button>
                    <button className="p-1 text-zinc-700 hover:text-zinc-400 cursor-pointer">
                      <ArrowRightIcon className="w-3 h-3" />
                    </button>
                    <button 
                      onClick={() => {
                        setBrowserLoading(true);
                        setTimeout(() => setBrowserLoading(false), 700);
                      }}
                      className="p-1 text-zinc-650 hover:text-zinc-400 cursor-pointer hover:bg-zinc-900 rounded transition-colors"
                    >
                      <RotateIcon className={`w-3 h-3 ${browserLoading ? "animate-spin text-cyan-400" : ""}`} />
                    </button>
                  </div>

                  {/* Real URL block */}
                  <div className="flex-grow bg-[#010204]/80 border border-zinc-950 rounded-lg px-3 py-1 flex items-center justify-between font-mono text-[9px] text-zinc-400 select-all overflow-hidden truncate">
                    <span className="flex items-center gap-1 text-zinc-550">
                      <Globe className="w-2.5 h-2.5 text-cyan-500 shrink-0" />
                      https://
                    </span>
                    <span className="flex-grow text-zinc-300 font-medium pl-1 text-[9.5px]">{browserUrl.replace("https://", "")}</span>
                    <span className="text-[7.5px] font-bold text-zinc-600 bg-zinc-950 px-1.5 py-0.2 rounded border border-zinc-900 shrink-0 select-none">
                      SECURED SENSORS
                    </span>
                  </div>
                </div>

                {/* Sub-Header: Search groundings queries (Playable & Interactive search bar) */}
                <div className="flex flex-wrap items-center justify-between bg-zinc-950/50 p-2.5 rounded-xl border border-zinc-900/70 gap-3">
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!browserSearchInputValue.trim()) return;
                      setBrowserQuery(browserSearchInputValue.toLowerCase().trim());
                      setBrowserLoading(true);
                      setBrowserUrl(`https://google.com/search?q=${encodeURIComponent(browserSearchInputValue)}`);
                      setBrowserSearchInputValue("");
                      setTimeout(() => setBrowserLoading(false), 800);
                    }}
                    className="flex items-center flex-grow bg-zinc-950 border border-zinc-900 rounded-lg px-2 py-1 relative max-w-sm"
                  >
                    <Search className="w-3 h-3 text-zinc-500 mr-2 shrink-0" />
                    <input
                      type="text"
                      placeholder="Simulate search (e.g., 'esbuild packager', 'react concurrent')..."
                      value={browserSearchInputValue}
                      onChange={(e) => setBrowserSearchInputValue(e.target.value)}
                      className="bg-transparent text-zinc-300 font-mono text-[9px] focus:outline-none w-full pr-10"
                    />
                    <button 
                      type="submit"
                      disabled={!browserSearchInputValue.trim()}
                      className="absolute right-1 text-[7.5px] uppercase font-mono bg-cyan-950/60 hover:bg-cyan-900 hover:text-white text-cyan-400 px-2 py-0.8 rounded border border-cyan-800/10 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      Search
                    </button>
                  </form>

                  {/* Hot terms indexer */}
                  <div className="flex items-center gap-1.5 text-[8.5px] font-mono">
                    <span className="text-zinc-600 font-semibold uppercase">QUICK SEARCH:</span>
                    {[
                      { query: "openrouter endpoint metrics", display: "OpenRouter metrics" },
                      { query: "esbuild package build parameters", display: "esbuild config" },
                      { query: "antigravity hyper-agent sandboxing parameters", display: "sandbox guidelines" }
                    ].map((term, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => {
                          setBrowserQuery(term.query);
                          setBrowserLoading(true);
                          setBrowserUrl(`https://google.com/search?q=${encodeURIComponent(term.query)}`);
                          setTimeout(() => setBrowserLoading(false), 800);
                        }}
                        className={`px-2 py-0.8 border rounded text-[8px] transition-all cursor-pointer ${
                          browserQuery === term.query 
                            ? "bg-cyan-950 border-cyan-800 text-cyan-400 font-bold" 
                            : "bg-zinc-950 border-zinc-900 text-zinc-500 hover:text-zinc-400"
                        }`}
                      >
                        {term.display}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Rendered simulated Crawler Web view frame wrapper */}
                <div className="flex-grow bg-[#04060b] border border-zinc-900/60 rounded-xl p-4.5 relative min-h-[220px] select-text">
                  
                  {browserLoading ? (
                    <div className="absolute inset-0 bg-[#020306]/85 backdrop-blur-sm z-30 flex flex-col items-center justify-center gap-2">
                      <div className="relative flex h-8 w-8 items-center justify-center">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400/30 opacity-75"></span>
                        <Search className="w-4 h-4 text-cyan-400 animate-pulse relative z-10" />
                      </div>
                      <p className="font-mono text-[9px] text-zinc-400 tracking-wider uppercase animate-pulse">
                        INGESTING DOM VECTORS // SCRAPING WEB REGISTERS...
                      </p>
                    </div>
                  ) : null}

                  {(() => {
                    const lookupKey = MOCK_BROWSER_DASHBOARD[browserQuery] ? browserQuery : "default";
                    const page = MOCK_BROWSER_DASHBOARD[lookupKey] || MOCK_BROWSER_DASHBOARD["default"];
                    
                    return (
                      <div className="space-y-4 font-sans leading-relaxed text-zinc-400">
                        {/* Domain name Breadcrumb indicator */}
                        <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
                          <span className="font-mono text-[9.5px] text-zinc-600 block">
                            PAGE_SOURCE: <span className="text-[#38bdf8] hover:underline cursor-pointer font-bold">{page.domain}</span>
                          </span>
                          <span className="font-mono text-[8.5px] text-zinc-650 flex items-center gap-1.5 uppercase font-bold">
                            <BookOpen className="w-3 h-3 text-cyan-500" />
                            parsed Markdown block
                          </span>
                        </div>

                        {/* Page Title & Subtitle */}
                        <div className="space-y-1">
                          <h1 className="text-sm font-semibold text-zinc-100 uppercase tracking-tight font-mono">
                            {page.title}
                          </h1>
                          <p className="text-[10px] text-zinc-500 font-medium">
                            {page.subtitle}
                          </p>
                        </div>

                        {/* Page Body Text */}
                        <div className="relative bg-[#020306]/60 border border-zinc-950 p-3.5 rounded-xl text-[11px] leading-relaxed select-text text-zinc-300 mr-2 shadow-inner">
                          {page.text}
                          <span className="absolute bottom-1 right-1.5 text-[7px] font-mono text-zinc-750 select-none uppercase font-bold">
                            Grounding segment buffer
                          </span>
                        </div>

                        {/* Extracted page Keywords chips */}
                        <div className="space-y-2 pt-1 border-t border-zinc-900/40">
                          <span className="text-[8.5px] font-mono text-zinc-600 block uppercase font-bold tracking-widest">
                            extracted ingestion tokens:
                          </span>
                          <div className="flex flex-wrap items-center gap-2">
                            {page.keywords.map((word, i) => (
                              <span 
                                key={i}
                                className="px-2.5 py-0.5 font-mono text-[8px] border border-cyan-900/30 bg-cyan-950/20 text-cyan-400 rounded-full font-bold uppercase tracking-wider block"
                              >
                                {word}
                              </span>
                            ))}
                            <span className="px-2 py-0.5 font-mono text-[8px] border border-green-900/30 bg-green-950/20 text-emerald-400 rounded-full font-bold uppercase tracking-wider block">
                              200_ok
                            </span>
                          </div>
                        </div>

                      </div>
                    );
                  })()}

                </div>

                {/* Scraper parameters block */}
                <div className="flex items-center justify-between text-[8px] font-mono text-zinc-550 border-t border-zinc-900/50 pt-3">
                  <span className="flex items-center gap-1">
                    <Check className="w-3 h-3 text-emerald-500" />
                    SOCKET CONNECTION SECURE: SSL VERIFIED (port ingress automatic)
                  </span>
                  <span className="uppercase tracking-widest font-black">
                    grounding.sh v2.0
                  </span>
                </div>

              </div>
            )}

            {/* 2. SANDBOX CODE EDITOR / FILES Explorer VIEWPORT */}
            {screenTab === "editor" && (
              <div className="w-full h-full flex flex-grow animate-fade-in text-left">
                
                {/* Left Panel: Files sidebar explorer */}
                <div className="w-52 bg-[#05070c]/50 border-r border-zinc-900/80 p-3 flex flex-col justify-between shrink-0 h-full">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-[8.5px] font-mono text-zinc-550 border-b border-zinc-900 pb-1.5 uppercase font-extrabold tracking-wider select-none">
                      <span>📁 Workspace Files</span>
                      <span className="text-zinc-650 font-bold">{Object.keys(editorWorkspaceFiles).length} files</span>
                    </div>

                    {/* Miniature tree list */}
                    <div className="space-y-1 max-h-[290px] overflow-y-auto pr-0.5 scrollbar-thin select-none">
                      
                      {/* Interactive File item buttons */}
                      {Object.keys(editorWorkspaceFiles).map((p) => {
                        const file = editorWorkspaceFiles[p];
                        const isActive = editorFile === p;
                        
                        return (
                          <button
                            key={p}
                            onClick={() => {
                              setEditorFile(p);
                              setEditorCode(file.code);
                            }}
                            className={`w-full text-left px-2 py-1.5 rounded-lg flex items-center justify-between text-[9.5px] font-mono transition-colors border cursor-pointer ${
                              isActive
                                ? "bg-purple-950/20 border-purple-800/20 text-purple-400 font-bold font-sans"
                                : "bg-transparent border-transparent text-zinc-500 hover:text-zinc-350 hover:bg-zinc-950/50"
                            }`}
                          >
                            <span className="flex items-center gap-1.5 truncate max-w-[140px]" title={p}>
                              <FileText className={`w-3 h-3 ${isActive ? "text-purple-400" : "text-zinc-600"} shrink-0`} />
                              {file.name}
                            </span>
                            <span className="text-[7px] text-zinc-650 font-medium shrink-0">
                              {(file.code.length / 1000).toFixed(1)}K
                            </span>
                          </button>
                        );
                      })}

                      {/* Display authentic global files uploaded in project too! */}
                      {files && files.map(cf => {
                        const fakePath = `/src/workspace/${cf.name}`;
                        const isActive = editorFile === fakePath;
                        return (
                          <button
                            key={cf.id}
                            onClick={() => {
                              setEditorFile(fakePath);
                              setEditorCode(`// Active dynamic Workspace Uploaded File\n// File Weight: ${cf.sizeBytes} bytes\n// Format Parsing: ${cf.parseStatus}\n\nexport const metadata = {\n  id: "${cf.id}",\n  filename: "${cf.name}",\n  parsed: "${cf.parseStatus}",\n  summary: "${cf.summary || "Pending semantic summary parser."}"\n};`);
                            }}
                            className={`w-full text-left px-2 py-1.5 rounded-lg flex items-center justify-between text-[9.5px] font-mono transition-colors border cursor-pointer ${
                              isActive
                                ? "bg-purple-950/20 border-purple-800/20 text-purple-400 font-bold font-sans"
                                : "bg-transparent border-transparent text-zinc-500 hover:text-zinc-350 hover:bg-zinc-950/50"
                            }`}
                          >
                            <span className="flex items-center gap-1.5 truncate max-w-[140px]" title={cf.name}>
                              <FileCode className={`w-3 h-3 ${isActive ? "text-cyan-400 animate-pulse" : "text-zinc-650"} shrink-0`} />
                              {cf.name}
                            </span>
                            <span className="text-[7px] text-zinc-600 block shrink-0">
                              {(cf.sizeBytes / 1000).toFixed(1)}K
                            </span>
                          </button>
                        );
                      })}

                    </div>
                  </div>

                  {/* Sidebar bottom diagnostic decree */}
                  <div className="pt-2 border-t border-zinc-900 leading-none">
                    <span className="text-[7px] text-zinc-600 font-mono block uppercase select-none">sandbox integrity</span>
                    <span className="text-[8px] text-purple-500 font-mono font-bold block mt-0.5 select-none uppercase tracking-tight">INDEXED WORKSPACE OK</span>
                  </div>
                </div>

                {/* Right Panel: Code Workspace display view */}
                <div className="flex-grow flex flex-col h-full bg-[#020306]">
                  {/* Code Toolbar */}
                  <div className="px-4 py-2 border-b border-zinc-900 bg-zinc-950/45 flex items-center justify-between select-none">
                    <div className="flex items-center gap-2">
                      <Terminal className="text-purple-400 w-3.5 h-3.5" />
                      <span className="text-[9.5px] font-mono text-zinc-300 font-bold truncate pr-3 max-w-[210px]">
                        {editorFile}
                      </span>
                    </div>

                    {/* Writing light */}
                    <div className="flex items-center gap-2">
                      {editorWriting && (
                        <span className="text-[7.5px] font-mono text-purple-400 uppercase font-black tracking-widest animate-pulse flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping" />
                          writing code...
                        </span>
                      )}
                      
                      <span className="text-[8px] font-mono text-zinc-600 uppercase border border-zinc-900 bg-zinc-950 px-2 py-0.5 rounded select-all font-bold">
                        {editorFile.endsWith(".tsx") || editorFile.endsWith(".html") ? "JSX / REACT" : "TS BINDING"}
                      </span>
                    </div>
                  </div>

                  {/* Real Code Body lines output editor mock */}
                  <div className="p-3.5 flex-grow font-mono text-[9.5px] leading-relaxed text-zinc-400 bg-black/45 select-text overflow-auto scrollbar-thin max-h-[310px]">
                    
                    {editorWriting && (
                      <div className="mb-2 text-[#a855f7] bg-purple-950/15 border border-purple-900/10 p-2 rounded-xl text-[9px] animate-[pulse_1.5s_infinite]">
                        [SYSTEM DECREE] Active file-writing transaction in progress. Syncing esbuild bundler matrices dynamically...
                      </div>
                    )}

                    <div className="font-mono leading-normal">
                      {editorCode.split("\n").map((line, index) => (
                        <div key={index} className="flex select-all hover:bg-zinc-900/15 py-0.2">
                          {/* Code line index marker */}
                          <span className="w-6 text-right text-zinc-700 select-none pr-2.5 font-sans scrollbar-thin font-bold text-[8.5px]">
                            {index + 1}
                          </span>
                          {/* Code code segment */}
                          <pre className={`text-zinc-350 pr-2 whitespace-pre text-[9.5px] ${line.trim().startsWith("//") || line.trim().startsWith("/*") ? "text-zinc-600 italic" : ""}`}>
                            {line}
                          </pre>
                        </div>
                      ))}
                    </div>

                  </div>

                </div>

              </div>
            )}

            {/* Bottom active state tracker overlay */}
            <div className="bg-[#04060b] border-t border-zinc-900/60 p-2 flex items-center justify-between text-[8px] font-mono text-zinc-550 leading-none select-none">
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
                COGNITIVE CONSOLE TERMINAL EMULANT // STATUS: SECURE IN-PERMIT BOUNDS
              </span>
              <span className="text-zinc-600 uppercase font-extrabold tracking-widest">
                SYS_BEZEL_ONLINE
              </span>
            </div>

          </div>

        </div>

      </div>

      {/* GRAND BIPARTITE VISUAL: MULTI-AGENT SCHEMATIC & SONAR RADAR CRAWLER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* LEFT COLUMN (COL-SPAN 7): SVG MULTI-AGENT PATHWAY SCHEMATIC */}
        <div className="lg:col-span-8 p-5 bg-[#040507]/45 border border-zinc-900 rounded-3xl flex flex-col justify-between relative overflow-hidden h-full min-h-[350px]">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/[0.015] to-transparent pointer-events-none" />
          
          <div className="flex items-center justify-between border-b border-zinc-950 pb-3.5 mb-2.5">
            <div className="flex items-center gap-2">
              <Network className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span className="text-[10px] font-mono font-extrabold text-zinc-200 uppercase tracking-widest">
                Decentralized Neural Agent Coordination Schematic
              </span>
            </div>
            <span className="text-[8px] font-mono text-zinc-600 uppercase bg-[#020203] px-2 py-0.5 border border-zinc-900 rounded">
              SCHEMATIC PATHWAYS: OK
            </span>
          </div>

          {/* SVG SCHEMATIC CANVAS */}
          <div className="relative flex-grow flex items-center justify-center p-4 min-h-[200px]">
            {/* SVG Interactive Flowing Paths */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
              <defs>
                <linearGradient id="cyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgba(6, 182, 212, 0.4)" />
                  <stop offset="100%" stopColor="rgba(168, 85, 247, 0.4)" />
                </linearGradient>
                <filter id="glowFilter">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Connections paths */}
              {/* Route: Planner -> Crawler (Row 1 Left -> Row 1 Right) */}
              <path d="M 180, 70 C 260, 70 260, 70 340, 70" fill="none" stroke="url(#cyanGrad)" strokeWidth="1.5" strokeDasharray="4 3" />
              {/* Route: Planner -> Compiler (Row 1 Left -> Row 2 Left) */}
              <path d="M 130, 110 C 130, 170 130, 170 130, 225" fill="none" stroke="url(#cyanGrad)" strokeWidth="1.5" strokeDasharray="4 3" />
              {/* Route: Crawler -> Auditor (Row 1 Right -> Row 2 Right) */}
              <path d="M 390, 110 C 390, 170 390, 170 390, 225" fill="none" stroke="url(#cyanGrad)" strokeWidth="1.5" strokeDasharray="4 3" />
              {/* Route: Compiler -> Auditor (Row 2 Left -> Row 2 Right) */}
              <path d="M 180, 260 C 260, 260 260, 260 340, 260" fill="none" stroke="url(#cyanGrad)" strokeWidth="1.5" strokeDasharray="4 3" />

              {/* Glowing Pulse Particles traveling the lines */}
              {activeNode === "planner" && (
                <circle r="4" fill="#22d3ee" className="animate-[pulse_1s_infinite]">
                  <animateMotion dur="2.5s" repeatCount="indefinite" path="M 180, 70 C 260, 70 260, 70 340, 70" />
                </circle>
              )}
              {activeNode === "crawler" && (
                <circle r="4" fill="#a855f7" className="animate-[pulse_1s_infinite]">
                  <animateMotion dur="2.5s" repeatCount="indefinite" path="M 390, 110 C 390, 170 390, 170 390, 225" />
                </circle>
              )}
              {activeNode === "compiler" && (
                <circle r="4" fill="#a855f7" className="animate-[pulse_1s_infinite]">
                  <animateMotion dur="2.5s" repeatCount="indefinite" path="M 180, 260 C 260, 260 260, 260 340, 260" />
                </circle>
              )}
              {activeNode === "auditor" && (
                <circle r="4" fill="#10b981" className="animate-[pulse_1s_infinite]">
                  <animateMotion dur="2.5s" repeatCount="indefinite" path="M 130, 225 C 130, 170 130, 170 130, 110" />
                </circle>
              )}
            </svg>

            {/* NODES CARDS (ABSOLUTELY POSITIONED FOR EXTREME PRECISION) */}
            <div className="w-full h-full min-h-[220px] relative z-10 flex flex-col justify-between py-2">
              
              {/* TOP NODE ROW (PLANNER + CRAWLER) */}
              <div className="flex justify-between items-center w-full px-4">
                {/* PLANNER (Node Left) */}
                <div 
                  className={`p-3.5 rounded-2xl border transition-all duration-300 w-44 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] leading-tight cursor-pointer ${
                    activeNode === "planner" 
                      ? "border-cyan-500/40 bg-cyan-950/20 shadow-[0_0_15px_rgba(6,182,212,0.1)] ring-1 ring-cyan-500/20" 
                      : "border-zinc-850 bg-zinc-950/40 text-zinc-500"
                  }`}
                  onClick={() => setActiveNode("planner")}
                >
                  <div className="flex items-center gap-2 mb-1.5 border-b border-zinc-900/50 pb-1.5">
                    <Cpu className={`w-4 h-4 ${activeNode === "planner" ? "text-cyan-400 animate-spin" : "text-zinc-650"}`} />
                    <span className="text-[9.5px] font-sans font-black uppercase text-zinc-300">Command Planner</span>
                  </div>
                  <span className="text-[7.5px] font-mono block text-zinc-600 uppercase">ROLE: 전략 분해기</span>
                  <p className="text-[8px] font-mono mt-1 leading-normal text-zinc-400 line-clamp-2 uppercase">Deconstructs goals into execution paths</p>
                  <div className="flex items-center justify-between mt-2.5">
                    <span className="text-[7px] font-mono text-zinc-500 block">SENSE: HIGH</span>
                    <span className={`w-1.5 h-1.5 rounded-full ${activeNode === "planner" ? "bg-cyan-400 animate-ping" : "bg-transparent border border-zinc-800"}`} />
                  </div>
                </div>

                {/* CRAWLER (Node Right) */}
                <div 
                  className={`p-3.5 rounded-2xl border transition-all duration-300 w-44 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)] leading-tight cursor-pointer ${
                    activeNode === "crawler" 
                      ? "border-purple-500/40 bg-purple-950/20 shadow-[0_0_15px_rgba(168,85,247,0.1)] ring-1 ring-purple-500/20" 
                      : "border-zinc-850 bg-zinc-950/40 text-zinc-500"
                  }`}
                  onClick={() => setActiveNode("crawler")}
                >
                  <div className="flex items-center gap-2 mb-1.5 border-b border-zinc-900/50 pb-1.5">
                    <Globe className={`w-4 h-4 ${activeNode === "crawler" ? "text-purple-400 animate-pulse" : "text-zinc-650"}`} />
                    <span className="text-[9.5px] font-sans font-black uppercase text-zinc-300">Web Ingestor</span>
                  </div>
                  <span className="text-[7.5px] font-mono block text-zinc-600 uppercase">ROLE: 실시간 웹 크롤러</span>
                  <p className="text-[8px] font-mono mt-1 leading-normal text-zinc-400 line-clamp-2 uppercase">Ingests, scrapes and parses search indexes</p>
                  <div className="flex items-center justify-between mt-2.5">
                    <span className="text-[7px] font-mono text-zinc-500 block">SENSE: BUSY</span>
                    <span className={`w-1.5 h-1.5 rounded-full ${activeNode === "crawler" ? "bg-purple-400 animate-ping" : "bg-transparent border border-zinc-800"}`} />
                  </div>
                </div>
              </div>

              {/* BOTTOM NODE ROW (COMPILER + AUDITOR) */}
              <div className="flex justify-between items-center w-full px-4 mt-8">
                {/* COMPILER (Node Left) */}
                <div 
                  className={`p-3.5 rounded-2xl border transition-all duration-300 w-44 hover:shadow-[0_0_20px_rgba(244,63,94,0.15)] leading-tight cursor-pointer ${
                    activeNode === "compiler" 
                      ? "border-rose-500/40 bg-rose-950/20 shadow-[0_0_15px_rgba(244,63,94,0.1)] ring-1 ring-rose-500/20" 
                      : "border-zinc-850 bg-zinc-950/40 text-zinc-500"
                  }`}
                  onClick={() => setActiveNode("compiler")}
                >
                  <div className="flex items-center gap-2 mb-1.5 border-b border-zinc-900/50 pb-1.5">
                    <Terminal className={`w-4 h-4 ${activeNode === "compiler" ? "text-rose-400" : "text-zinc-650"}`} />
                    <span className="text-[9.5px] font-sans font-black uppercase text-zinc-300">Synthesis Engine</span>
                  </div>
                  <span className="text-[7.5px] font-mono block text-zinc-600 uppercase">ROLE: 코드 드래프터</span>
                  <p className="text-[8px] font-mono mt-1 leading-normal text-zinc-400 line-clamp-2 uppercase">Writes sandbox models and triggers build tools</p>
                  <div className="flex items-center justify-between mt-2.5">
                    <span className="text-[7px] font-mono text-zinc-500 block">SENSE: IDLE</span>
                    <span className={`w-1.5 h-1.5 rounded-full ${activeNode === "compiler" ? "bg-rose-400 animate-ping" : "bg-transparent border border-zinc-800"}`} />
                  </div>
                </div>

                {/* AUDITOR (Node Right) */}
                <div 
                  className={`p-3.5 rounded-2xl border transition-all duration-300 w-44 hover:shadow-[0_0_20px_rgba(16,185,129,0.15)] leading-tight cursor-pointer ${
                    activeNode === "auditor" 
                      ? "border-emerald-500/40 bg-emerald-950/20 shadow-[0_0_15px_rgba(16,185,129,0.1)] ring-1 ring-emerald-500/20" 
                      : "border-zinc-850 bg-zinc-950/40 text-zinc-500"
                  }`}
                  onClick={() => setActiveNode("auditor")}
                >
                  <div className="flex items-center gap-2 mb-1.5 border-b border-zinc-900/50 pb-1.5">
                    <ShieldAlert className={`w-4 h-4 ${activeNode === "auditor" ? "text-emerald-400" : "text-zinc-650"}`} />
                    <span className="text-[9.5px] font-sans font-black uppercase text-zinc-300">Safety Auditor</span>
                  </div>
                  <span className="text-[7.5px] font-mono block text-zinc-600 uppercase">ROLE: 안정성 검증기</span>
                  <p className="text-[8px] font-mono mt-1 leading-normal text-zinc-400 line-clamp-2 uppercase">Verifies container sandbox and integrity boundaries</p>
                  <div className="flex items-center justify-between mt-2.5">
                    <span className="text-[7px] font-mono text-zinc-500 block">SENSE: SECURE</span>
                    <span className={`w-1.5 h-1.5 rounded-full ${activeNode === "auditor" ? "bg-emerald-400 animate-ping" : "bg-transparent border border-zinc-800"}`} />
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* ACTIVE TOOL STATUS BAR */}
          <div className="border-t border-zinc-950 pt-3 mt-3.5 flex justify-between items-center text-[8.5px] font-mono text-zinc-550 leading-none">
            <span className="flex items-center gap-1.5">
              <Code className="w-3.5 h-3.5 text-cyan-400" />
              LAST EXECUTED DIRECTIVE: 
              <span className="text-zinc-350 font-bold bg-[#010203] border border-zinc-900 px-1.5 py-0.5 rounded uppercase">
                {activeTool || "idle_await"}
              </span>
            </span>
            <span className="text-zinc-600 uppercase font-bold tracking-widest leading-none">
              COGNITION FEED: ACTIVE
            </span>
          </div>

        </div>

        {/* RIGHT COLUMN (COL-SPAN 5): HIGH-TECH RADAR & URL scraper monitor */}
        <div className="lg:col-span-4 p-5 bg-[#040507]/45 border border-zinc-900 rounded-3xl flex flex-col justify-between items-center relative overflow-hidden h-full min-h-[350px]">
          <div className="w-full flex justify-between items-center border-b border-zinc-950 pb-3 mb-2">
            <span className="text-[10px] font-mono text-zinc-200 uppercase tracking-widest block font-extrabold">
              Realtime Search Grounding Sonar
            </span>
            <span className="text-[8px] text-cyan-400 font-mono tracking-widest font-extrabold animate-pulse">
              SYS_RADAR
            </span>
          </div>

          {/* SONAR CIRCLE SCANNER */}
          <div className="relative w-36 h-36 border border-zinc-900 rounded-full flex items-center justify-center bg-[#020203] shadow-[inset_0_0_30px_rgba(6,182,212,0.04)]">
            {/* Sonar axis lines */}
            <div className="absolute inset-y-0 w-px bg-zinc-900/60 font-mono text-[7px]" />
            <div className="absolute inset-x-0 h-px bg-zinc-900/60 font-mono text-[7px]" />
            
            {/* Concentric rings */}
            <div className="absolute w-28 h-28 border border-dashed border-zinc-850/60 rounded-full animate-pulse" />
            <div className="absolute w-16 h-16 border border-dashed border-zinc-900/40 rounded-full" />
            <div className="absolute w-6 h-6 border border-zinc-950 rounded-full" />

            {/* Sweep hand */}
            <div 
              className="absolute inset-0 origin-center pointer-events-none"
              style={{ transform: `rotate(${radarAngle}deg)` }}
            >
              <div className="w-1/2 h-[1.5px] bg-gradient-to-r from-transparent to-cyan-500 absolute top-1/2 left-0" />
              <div className="w-2 h-2 bg-cyan-400 rounded-full absolute top-[calc(50%-3px)] left-2 animate-ping" />
            </div>

            {/* Target vectors spotted */}
            <div className="absolute top-8 left-14 w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <div className="absolute bottom-11 right-8 w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
            <div className="absolute top-16 right-9 w-1.5 h-1.5 rounded-full bg-purple-500/90 animate-ping delay-200" />

            <div className="absolute bottom-2 font-mono text-[8px] text-zinc-650 bg-black/80 border border-zinc-900 rounded px-1.5 py-0.2 select-none z-10 font-bold uppercase">
              SCAN MODE: ACTIVE
            </div>
          </div>

          {/* URL TICKER LISTING PROGRESS BARS */}
          <div className="w-full mt-4 space-y-2.5">
            <span className="text-[8px] font-mono text-zinc-555 uppercase tracking-widest block font-extrabold">Active Grounding Sockets queue</span>
            
            <div className="space-y-2 bg-[#020203] p-2.5 border border-zinc-900 rounded-2xl w-full">
              {crawlList.map((crawl, idx) => (
                <div key={idx} className="space-y-1.5 text-left leading-none font-mono text-[9px]">
                  <div className="flex justify-between items-center text-[8.5px]">
                    <span className="text-zinc-400 truncate max-w-[150px] font-semibold" title={crawl.url}>
                      {crawl.url.replace("https://", "")}
                    </span>
                    <span className={`text-[7px] font-bold uppercase ${
                      crawl.status === "validated" ? "text-emerald-400" :
                      crawl.status === "extracting" ? "text-cyan-400 animate-pulse" :
                      "text-amber-500"
                    }`}>
                      {crawl.status}
                    </span>
                  </div>

                  {/* Progress Line */}
                  <div className="flex items-center gap-2">
                    <div className="w-full bg-zinc-950 border border-zinc-900 h-1.5 rounded-full overflow-hidden shrink-0">
                      <div 
                        className={`h-full transition-all duration-300 ${
                          crawl.status === "validated" ? "bg-emerald-500" :
                          crawl.status === "extracting" ? "bg-cyan-500 animate-pulse" :
                          "bg-amber-500"
                        }`}
                        style={{ width: `${crawl.progress}%` }}
                      />
                    </div>
                    <span className="text-[7.5px] text-zinc-500 font-bold shrink-0">{crawl.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* DETAILED LIVESTREAM OF THOUGHTS & COGNITIVE SEQUENCES */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

        {/* THOUGHTS STREAM WINDOW (COL-SPAN 8) */}
        <div className="md:col-span-8 p-5 bg-[#040507]/45 border border-zinc-900 rounded-3xl space-y-4 text-left">
          <div className="flex items-center justify-between border-b border-zinc-950 pb-3">
            <div className="flex items-center gap-2">
              <Brain className="w-4.5 h-4.5 text-purple-400" />
              <span className="text-[10.5px] font-mono font-extrabold text-zinc-200 uppercase tracking-widest">
                Cognitive Thinking Streams Tracker (Timestamps & Detail expand)
              </span>
            </div>
            <span className="text-[8px] font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-800/20 uppercase font-black tracking-wider animate-pulse">
              STREAMING DIRECT
            </span>
          </div>

          <div className="space-y-3 max-h-[440px] overflow-y-auto pr-1 scrollbar-thin">
            {thoughtStream.map(thought => {
              const isOpen = expandedThoughtId === thought.id;

              // Color coordinate tags based on category
              let tagColor = "bg-zinc-900 border-zinc-800 text-zinc-500";
              if (thought.category === "planning") {
                tagColor = "bg-cyan-950/20 border-cyan-800/20 text-cyan-400";
              } else if (thought.category === "searching") {
                tagColor = "bg-emerald-950/20 border-emerald-500/10 text-emerald-400";
              } else if (thought.category === "synthesizing") {
                tagColor = "bg-purple-950/20 border-purple-800/20 text-purple-400";
              } else if (thought.category === "validating") {
                tagColor = "bg-rose-950/20 border-rose-800/10 text-rose-400";
              } else if (thought.category === "compiling") {
                tagColor = "bg-amber-950/20 border-amber-800/20 text-amber-500";
              } else if (thought.category === "safety") {
                tagColor = "bg-zinc-950 border-emerald-900/20 text-emerald-300";
              }

              return (
                <div 
                  key={thought.id}
                  className={`p-3.5 border rounded-2xl transition-all duration-300 relative overflow-hidden group hover:border-zinc-805 ${
                    isOpen 
                      ? "border-purple-500/25 bg-purple-950/5 shadow-[0_0_15px_rgba(168,85,247,0.02)]" 
                      : "border-zinc-900 bg-[#020305]/45"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2 flex-wrap text-[10.5px] leading-tight shrink-0 mr-2">
                      <span className="text-[8.5px] font-mono text-zinc-650 font-bold shrink-0">{thought.time}</span>
                      <span className={`text-[7px] font-mono uppercase px-1.5 py-0.2 rounded font-extrabold border shrink-0 tracking-wider ${tagColor}`}>
                        {thought.category}
                      </span>
                      <span className="text-[8.5px] font-mono text-zinc-500 truncate max-w-[100px]" title={thought.id}>
                        #{thought.id.substring(0, 10)}
                      </span>
                    </div>

                    <div className="text-[9px] font-mono font-bold text-zinc-650 flex items-center gap-2">
                      <span>{thought.model}</span>
                      <button
                        onClick={() => setExpandedThoughtId(isOpen ? null : thought.id)}
                        className="text-purple-400 hover:text-purple-300 p-0.5 cursor-pointer hover:bg-zinc-900 rounded transition-colors"
                        title="Display execution variables"
                      >
                        {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* THOUGHT TITLE */}
                  <div className="text-[11.5px] font-mono font-bold text-zinc-200 mt-2 hover:text-purple-350 transition-colors">
                    {thought.title}
                  </div>

                  {/* EXPANDABLE DETAILS ACCORDION BLOCK */}
                  {isOpen && (
                    <div className="mt-3.5 pt-3.5 border-t border-zinc-900/80 space-y-3 font-mono text-[10px] text-zinc-400 leading-relaxed animate-slide-in select-text">
                      <p className="italic text-zinc-350 border-l-2 border-purple-500/20 pl-2">
                        "{thought.details}"
                      </p>
                      <div className="grid grid-cols-2 gap-2 text-[8px] bg-black/60 p-2 border border-zinc-900 rounded-xl leading-none">
                        <div>
                          <span className="text-zinc-600 block mb-1">PROMPT TOKEN OFFSET:</span>
                          <span className="text-zinc-350 font-bold">{thought.tokenCount}</span>
                        </div>
                        <div>
                          <span className="text-zinc-600 block mb-1">NEURAL CONFIDENCE ACCENT:</span>
                          <span className="text-emerald-400 font-bold">98.42%</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {thoughtStream.length === 0 && (
              <div className="py-12 text-center border border-dashed border-zinc-905 rounded-3xl bg-[#020305]/20 text-zinc-550 space-y-2">
                <Brain className="w-6 h-6 mx-auto opacity-35 text-purple-400" />
                <p className="font-serif italic text-zinc-400 text-xs">Awaiting client workspace signals</p>
                <p className="text-[10px] text-zinc-600 font-sans max-w-[210px] mx-auto leading-normal">
                  Toggle Simulated OS mode above to stream autonomous structural reasoning, files parsing, and crawling timelines.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* TOOL EXECUTION PROGRESS MONITOR (COL-SPAN 4) */}
        <div className="md:col-span-4 p-5 bg-[#040507]/45 border border-zinc-900 rounded-3xl text-left flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-950 pb-3">
              <div className="flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-[#e11d48]" />
                <span className="text-[10px] font-mono font-extrabold text-zinc-200 uppercase tracking-widest">
                  Tool execution monitoring
                </span>
              </div>
              <span className="text-rose-500 uppercase font-mono text-[7px] font-extrabold tracking-wider border border-rose-500/20 bg-rose-500/5 px-2 py-0.5 rounded animate-pulse">
                REAL_TIME
              </span>
            </div>

            {/* HIGH-TECH WIDGETS */}
            <div className="space-y-3">
              {[
                { label: "File Systems Write", cmd: "create_file / edit_file", val: steps.filter(s => s.tool === "create_file" || s.tool === "edit_file").length || 15, active: activeNode === "compiler", color: "from-cyan-500/20 text-cyan-400 border-cyan-500/10" },
                { label: "Web grounding parser", cmd: "google_web_search / read_url_content", val: steps.filter(s => s.tool === "google_web_search").length || 38, active: activeNode === "crawler", color: "from-purple-500/20 text-purple-400 border-purple-500/10" },
                { label: "Defensive sandboxing review", cmd: "validate_workspace_escape", val: 54, active: activeNode === "auditor", color: "from-emerald-500/20 text-emerald-400 border-emerald-500/10" }
              ].map((tool, idx) => (
                <div 
                  key={idx}
                  className={`p-3 border rounded-2xl bg-gradient-to-r to-transparent relative overflow-hidden transition-all duration-300 ${tool.color} ${
                    tool.active 
                      ? "ring-1 ring-white/10 shadow-[0_0_15px_rgba(255,255,255,0.03)] scale-[1.01]" 
                      : "opacity-60 border-zinc-900"
                  }`}
                >
                  <div className="flex justify-between items-center font-mono">
                    <div>
                      <span className="text-[10px] block font-extrabold">{tool.label}</span>
                      <span className="text-[7.5px] text-zinc-600 block mt-0.5">{tool.cmd}</span>
                    </div>
                    <span className="text-xs font-mono font-bold bg-[#020304] px-2 py-0.5 rounded border border-zinc-850 text-zinc-400">
                      {tool.val} CALLED
                    </span>
                  </div>

                  {/* Active scanning feedback ticker */}
                  {tool.active && (
                    <div className="mt-3.5 space-y-1 animate-slide-in">
                      <div className="flex justify-between items-center text-[7.5px] font-mono text-zinc-550">
                        <span>PIPELINE SECTOR: COMPILING</span>
                        <span className="animate-pulse">STREAM ACTIVE</span>
                      </div>
                      <div className="w-full bg-zinc-950 h-1.2 rounded-full overflow-hidden">
                        <div className="bg-gradient-to-r from-cyan-400 to-purple-500 h-full w-3/4 animate-[shimmer_1.5s_infinite]"></div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* TOTAL PERFORMANCE TELEM CONTEXT */}
          <div className="border border-zinc-900 bg-black/60 p-3 rounded-2xl text-[8.5px] font-mono leading-normal text-zinc-500 mt-4 leading-relaxed">
            <span className="text-zinc-400 block font-bold mb-1 uppercase tracking-wide">SYSTEM DIAGNOSTICS DECREE</span>
            Cognitive loops bound to container process. If latency is detected, model routing weights automatically downscale context to Flash segments to sustain throughput metrics.
          </div>
        </div>

      </div>

    </div>
  );
}
