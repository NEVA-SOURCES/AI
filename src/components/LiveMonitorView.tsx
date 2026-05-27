import { useState, useEffect, useRef } from "react";
import { useApp } from "../AppContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Globe, Search, FileCode, Terminal, FileText, PenTool, Brain, CheckCircle, 
  X, ExternalLink, Play, SkipBack, SkipForward, Lock, ChevronLeft, 
  ChevronRight, RefreshCw, Layers, Clock, Coins, Sparkles, BookOpen, 
  ShieldAlert, Cpu, Check, Copy, Ban, Eye, EyeOff
} from "lucide-react";
import { AgentStep, LogEvent, StepState } from "../types";

// Dynamic types representing simulated or real action pipelines
interface ActionItem {
  id: string;
  type: 'browser' | 'search' | 'editor' | 'terminal' | 'file_read' | 'file_write' | 'thinking' | 'complete';
  title: string;           // e.g., "Reading file upload/GOOD.txt"
  subtitle: string;        // e.g., "Extract documentation from the Fluent Modded UI li..."
  status: 'running' | 'completed' | 'failed' | 'pending';
  timestamp: string;
  previewData?: any;       // URL for browser, code for editor, results for search
  icon: string;            // lucide icon name mapped from type
  reasoningTrace?: string;
  originalStep?: AgentStep;
}

// Global dictionary of files for mock Editor workspace
const LOCAL_WORKSPACE_FILES: Record<string, { name: string; lang: string; code: string }> = {
  "NevaBrainCore.ts": {
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
  "fileExporter.ts": {
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
}`
  },
  "LiveMonitorView.tsx": {
    name: "LiveMonitorView.tsx",
    lang: "tsx",
    code: `// Manus AI-Style "Agent Computer" View
import React, { useState, useEffect } from "react";
import { useApp } from "../AppContext";

export default function LiveMonitorView() {
  const { steps, runs, activeConversation } = useApp();
  // Live Agent Computer visualization render loop
  return <div className="text-cyan-400">NEVA's Computer Active</div>;
}`
  }
};

const MOCK_BROWSER_DASHBOARD: Record<string, { title: string; subtitle: string; domain: string; text: string; keywords: string[] }> = {
  "default": {
    title: "NEVA Grounding Core Ingestion Framework",
    subtitle: "Awaiting Live Web Grounding Query...",
    domain: "neva.internal",
    text: "The web ingestor node is idle. Enter a custom search term in the control bar or await autonomous agent execution to stream crawling matrices live in real time.",
    keywords: ["cognitive", "ingestion", "sandbox", "grounding"]
  },
  "react concurrent state-synchronizer models": {
    title: "React Virtual DOM Reconciliation Strategy in Shared Workspace Nodes",
    subtitle: "React documentation grounding block v19.0.2",
    domain: "react.dev/reference/react/concurrent",
    text: "Concurrent state management permits background render buffers to compile state snapshots. When creating visual scrubbing bars, decouple update timelines from frame reconciliation routines to protect UI responsiveness from high-frequency telemetry loads.",
    keywords: ["concurrent rendering", "reconciliation snapshots", "state tracker", "progressive loader"]
  }
};

// Map tool keywords to icon strings
function getIconForTool(tool: string | undefined): string {
  const t = (tool || "").toLowerCase();
  if (t.includes("search") || t.includes("citation")) return "Search";
  if (t.includes("url") || t.includes("fetch") || t.includes("browser")) return "Globe";
  if (t.includes("audit") || t.includes("view") || t.includes("read")) return "FileText";
  if (t.includes("compile") || t.includes("build") || t.includes("lint")) return "FileCode";
  if (t.includes("write") || t.includes("save") || t.includes("create")) return "PenTool";
  if (t.includes("term") || t.includes("exec") || t.includes("shell") || t.includes("run")) return "Terminal";
  if (t.includes("decompose") || t.includes("plan")) return "Brain";
  return "Brain";
}

// Convert action mode key to respective Lucide icon components 
const getLucideIconForType = (type: ActionItem['type']) => {
  switch (type) {
    case 'browser': return Globe;
    case 'search': return Search;
    case 'editor': return FileCode;
    case 'terminal': return Terminal;
    case 'file_read': return FileText;
    case 'file_write': return PenTool;
    case 'thinking': return Brain;
    case 'complete': return CheckCircle;
    default: return Brain;
  }
};

export default function LiveMonitorView() {
  const { steps, runs, activeConversation, profiles, logs } = useApp();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isLeftSidebarCollapsed, setIsLeftSidebarCollapsed] = useState(false);
  const [isRightPanelCollapsed, setIsRightPanelCollapsed] = useState(false);

  // Editor states
  const [activeEditorTab, setActiveEditorTab] = useState("NevaBrainCore.ts");
  const [editorMode, setEditorMode] = useState<"diff" | "original" | "modified">("modified");

  // Custom address bar override URL inputs
  const [customBrowserUrl, setCustomBrowserUrl] = useState("https://neva.internal/monitor/nodes");

  // Notifications or cancel state indicators
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const activeRun = runs[runs.length - 1] || null;
  // Read real steps if they belong to the latest run, otherwise fallback to mock sequence
  const realSteps = steps.filter(s => s.runId === activeRun?.id);

  // Simulated fallback actions designed to make the layout beautiful and immediate
  const placeholderSteps: AgentStep[] = [
    {
      id: "st_planner_mock",
      runId: activeRun?.id || "mock_run",
      agentKey: "NEVA_PLANNER",
      status: "completed",
      state: StepState.PLANNING,
      startedAt: new Date(Date.now() - 35000).toISOString(),
      finishedAt: new Date(Date.now() - 30000).toISOString(),
      durationMs: 5000,
      reasoningTrace: "Deconstructing prompt input parameters: 'Refactor state updates and align workspace synchronization parameters'. Establishing tactical sequence indices across 5 agent sandboxes.",
      inputPreview: "Refactor state updates & align workspace synchronization",
      tool: "decompose_mission"
    },
    {
      id: "st_researcher_mock",
      runId: activeRun?.id || "mock_run",
      agentKey: "NEVA_RESEARCHER",
      status: "completed",
      state: StepState.RESEARCHING,
      startedAt: new Date(Date.now() - 29000).toISOString(),
      finishedAt: new Date(Date.now() - 17000).toISOString(),
      durationMs: 12000,
      reasoningTrace: "Web crawling indices for 'react concurrent state-synchronizer models'. Scanning high-integrity documentation vectors on React v19. Finding AST boundaries for custom timers.",
      inputPreview: "react concurrent state-synchronizer models",
      tool: "web_search"
    },
    {
      id: "st_engineer_mock",
      runId: activeRun?.id || "mock_run",
      agentKey: "NEVA_ENGINEER",
      status: "completed",
      state: StepState.EXECUTING,
      startedAt: new Date(Date.now() - 16000).toISOString(),
      finishedAt: new Date(Date.now() - 10000).toISOString(),
      durationMs: 6000,
      reasoningTrace: "Writing structural additions inside NevaBrainCore.ts. Compressing payload sizes to maintain latency stability levels. Formatting output to verified CommonJS.",
      inputPreview: "Writing /src/components/LiveMonitorView.tsx",
      tool: "system_write"
    },
    {
      id: "st_critic_mock",
      runId: activeRun?.id || "mock_run",
      agentKey: "NEVA_CRITIC",
      status: "running",
      state: StepState.ANALYZING,
      startedAt: new Date(Date.now() - 9000).toISOString(),
      reasoningTrace: "Reviewing code structures for race conditions. Launching container verification suite:\n$ npx -y eslint --quiet src/components/LiveMonitorView.tsx\nChecking import paths. 0 fatal syntax errors found. Ready.",
      inputPreview: "eslint audit --cache",
      tool: "compile_code"
    },
    {
      id: "st_reporter_mock",
      runId: activeRun?.id || "mock_run",
      agentKey: "NEVA_REPORTER",
      status: "pending",
      state: StepState.COMPLETED,
      startedAt: new Date(Date.now() - 1000).toISOString(),
      reasoningTrace: "Compiling strategic executive report. Layout assembly scheduled on verification parameters validation.",
      inputPreview: "Awaiting preceding audit sequence completion",
      tool: ""
    }
  ];

  const targetSteps = realSteps.length > 0 ? realSteps : placeholderSteps;

  // Map AgentStep to ActionItem representation
  const actions: ActionItem[] = targetSteps.map((step, idx) => {
    const tool = (step.tool || "").toLowerCase();
    const agent = (step.agentKey || "").toUpperCase();

    let type: ActionItem['type'] = 'thinking';
    if (tool.includes('search') || tool.includes('citation') || tool.includes('browse_search')) {
      type = 'search';
    } else if (tool.includes('url') || tool.includes('fetch') || tool.includes('browser') || tool.includes('web')) {
      type = 'browser';
    } else if (tool.includes('audit') || tool.includes('read') || tool.includes('view') || tool.includes('get_file')) {
      type = 'file_read';
    } else if (tool.includes('compile') || tool.includes('build') || tool.includes('lint') || tool.includes('eval')) {
      type = 'editor';
    } else if (tool.includes('write') || tool.includes('save') || tool.includes('create') || tool.includes('edit')) {
      type = 'file_write';
    } else if (tool.includes('term') || tool.includes('exec') || tool.includes('shell') || tool.includes('run') || tool.includes('cmd')) {
      type = 'terminal';
    }

    // Default heuristics based on Agent roles
    if (!step.tool) {
      if (agent.includes('PLANNER')) type = 'thinking';
      else if (agent.includes('RESEARCHER')) type = 'search';
      else if (agent.includes('ENGINEER')) type = 'editor';
      else if (agent.includes('CRITIC')) type = 'terminal';
      else if (agent.includes('REPORTER')) type = 'complete';
    }

    let customTitle = step.agentKey.replace('NEVA_', '') + ' is ' + (step.status === 'running' ? 'working' : 'done');
    if (agent.includes('PLANNER')) {
      customTitle = step.status === 'running' ? "Strategizing prompt" : "Decomposed task requirements";
    } else if (agent.includes('RESEARCHER')) {
      customTitle = step.status === 'running' ? "Browsing references" : "Verified grounding context";
    } else if (agent.includes('ENGINEER')) {
      customTitle = step.status === 'running' ? "Refactoring script" : "Wrote structural script additions";
    } else if (agent.includes('CRITIC')) {
      customTitle = step.status === 'running' ? "Evaluating build" : "Build parameters verified";
    } else if (agent.includes('REPORTER')) {
      customTitle = step.status === 'running' ? "Synthesizing briefing" : "Briefing compiled";
    }

    return {
      id: step.id || `action-${idx}`,
      type,
      title: customTitle,
      subtitle: step.inputPreview || step.reasoningTrace?.slice(0, 50) + '...' || 'Operational processing',
      status: step.status as any,
      timestamp: step.startedAt,
      previewData: step.toolOutput || step.toolInput || step.reasoningTrace,
      icon: getIconForTool(step.tool),
      originalStep: step
    };
  });

  // Track the absolute newest action
  const liveIndex = actions.length > 0 ? actions.length - 1 : 0;

  // Auto-advance to the live index if changes occur
  useEffect(() => {
    if (isPlaying) {
      setCurrentIndex(liveIndex);
    }
  }, [liveIndex, isPlaying]);

  // Support global Escape key press to exit overlay
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        window.dispatchEvent(new CustomEvent("nav-route", { detail: "chat" }));
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleCancelTask = () => {
    triggerToast("Task cancellation payload successfully issued to NEVA orchestrator cores.");
  };

  const handleScrub = (idx: number) => {
    const clampIdx = Math.max(0, Math.min(actions.length - 1, idx));
    setCurrentIndex(clampIdx);
    if (clampIdx !== liveIndex) {
      setIsPlaying(false); // Pause auto-advancing to live
    } else {
      setIsPlaying(true);
    }
  };

  const handleJumpToLive = () => {
    setCurrentIndex(liveIndex);
    setIsPlaying(true);
    triggerToast("Snapped computer synchronized to active live sequence.");
  };

  const currentViewingAction = actions[currentIndex];
  // Extract associated step
  const currentStep = currentViewingAction?.originalStep;
  const currentProfile = profiles.find(p => p.name === currentStep?.agentKey) || {
    name: currentStep?.agentKey || "NEVA_AGENT",
    icon: "🧠",
    autonomyLevel: 4,
    description: "Multi-modal cognitive worker specialized in tactical sandbox integrations."
  };

  // Helper colors for status indicators
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'running':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold font-mono tracking-wider bg-cyan-500/10 text-[#00F5FF]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00F5FF] animate-ping"></span>
            ACTIVE RUNNING
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold font-mono tracking-wider bg-emerald-500/10 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            SUCCESS DONE
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold font-mono tracking-wider bg-rose-500/10 text-rose-450">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            FAILED EXCEPTION
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold font-mono tracking-wider bg-zinc-800 text-zinc-400">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-650"></span>
            PENDING STANDBY
          </span>
        );
    }
  };

  // Helper colors for sidebar items
  const getHighlightBorder = (type: string) => {
    switch (type) {
      case 'browser': return 'border-b-blue-500/10';
      case 'search': return 'border-b-purple-500/10';
      case 'editor': return 'border-b-emerald-500/10';
      case 'terminal': return 'border-b-orange-500/10';
      case 'file_read': return 'border-b-indigo-500/10';
      case 'file_write': return 'border-b-pink-500/10';
      case 'thinking': return 'border-b-cyan-500/10';
      default: return 'border-b-cyan-500/10';
    }
  };

  // Inline regex code highlighter for VSCode editor simulation
  const highlightTokenDetails = (lineString: string) => {
    const parts: React.ReactNode[] = [];
    let index = 0;
    
    // Simple custom compiler keywords matcher
    const tokenRegex = /(\"[^\"]*\"|\'[^\']*\'|\`[^\`]*\`|\b(?:const|let|var|function|return|import|export|from|if|else|for|while|class|interface|type|extends|as|new|async|await|true|false|null|this|public|private)\b|\b\d+\b)/g;
    
    let match;
    while ((match = tokenRegex.exec(lineString)) !== null) {
      const beforeString = lineString.substring(index, match.index);
      if (beforeString) {
        parts.push(beforeString);
      }
      
      const matchedWord = match[0];
      if (matchedWord.startsWith('"') || matchedWord.startsWith("'") || matchedWord.startsWith('`')) {
        parts.push(<span key={match.index} className="text-green-400 font-mono">{matchedWord}</span>);
      } else if (/^\d+$/.test(matchedWord)) {
        parts.push(<span key={match.index} className="text-orange-400 font-mono">{matchedWord}</span>);
      } else {
        parts.push(<span key={match.index} className="text-purple-400 font-bold font-mono">{matchedWord}</span>);
      }
      index = tokenRegex.lastIndex;
    }
    
    const remainingText = lineString.substring(index);
    if (remainingText) {
      parts.push(remainingText);
    }
    
    return parts.length > 0 ? parts : lineString;
  };

  const renderHighlightedCode = (textValue: string) => {
    if (!textValue) return <div className="text-zinc-650 text-xs italic">// Code workspace empty</div>;
    const lines = textValue.split("\n");
    return lines.map((line, i) => {
      let mainText = line;
      let commentText = "";
      const commentIndex = line.indexOf("//");
      if (commentIndex !== -1) {
        mainText = line.substring(0, commentIndex);
        commentText = line.substring(commentIndex);
      }
      return (
        <div key={i} className="flex hover:bg-white/[0.01] py-0.5 leading-relaxed font-mono text-[11px] sm:text-xs text-zinc-300">
          <span className="w-10 text-right pr-4 shrink-0 select-none text-zinc-650 font-mono">{i + 1}</span>
          <span className="whitespace-pre break-all">
            {highlightTokenDetails(mainText)}
            {commentText && <span className="text-zinc-550 italic font-mono">{commentText}</span>}
          </span>
        </div>
      );
    });
  };

  // Terminal simulated typist output effect
  const [typedTermBuffer, setTypedTermBuffer] = useState("");
  useEffect(() => {
    if (!currentViewingAction) return;
    
    // If completed or pending, display instantly
    if (currentViewingAction.status !== "running") {
      setTypedTermBuffer(currentViewingAction.subtitle || "Exit code 0. Node offline.");
      return;
    }

    let progressCounter = 0;
    const rawOut = currentViewingAction.subtitle || "Compiling structural additions...\nValidating esbuild configurations...\nChecking system dependencies Integrity...\n0 warnings found.";
    const typingInterval = setInterval(() => {
      setTypedTermBuffer(rawOut.substring(0, progressCounter));
      progressCounter += 12;
      if (progressCounter >= rawOut.length) {
        setTypedTermBuffer(rawOut);
        clearInterval(typingInterval);
      }
    }, 15);

    return () => clearInterval(typingInterval);
  }, [currentViewingAction]);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-[#09090b]/98 backdrop-blur-xl flex flex-col font-sans select-none antialiased">
      {/* Editorial aesthetic line grid in background */}
      <div className="absolute inset-0 bg-[radial-gradient(#1c1c1e_1px,transparent_1px)] [background-size:16px_16px] opacity-25 pointer-events-none"></div>

      {/* HEADER BAR (56px) */}
      <header className="h-[56px] bg-[#121212]/90 backdrop-blur-md border-b border-white/5 px-6 flex items-center justify-between shrink-0 relative z-10 select-none">
        
        {/* Left Side: X Close and App Domain metadata */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => window.dispatchEvent(new CustomEvent("nav-route", { detail: "chat" }))}
            className="p-1 px-2.5 bg-zinc-900 border border-white/10 hover:border-white/20 text-[#a1a1aa] hover:text-[#f4f4f5] rounded transition-all cursor-pointer flex items-center gap-1.5 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            title="Close Computer (Esc)"
          >
            <X className="w-3.5 h-3.5" />
            <span className="text-[10px] font-mono tracking-widest font-bold uppercase hidden sm:inline">Close</span>
          </button>
          
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
            <span className="text-xs sm:text-sm font-semibold tracking-wider text-zinc-100 font-sans">NEVA's Computer</span>
          </div>
        </div>

        {/* Center Side: Pulsing Action Chip */}
        <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center">
          <AnimatePresence mode="wait">
            {actions.some(a => a.status === 'running') ? (
              <motion.div 
                key="running-chip"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="bg-cyan-500/10 border border-cyan-400/25 px-3 py-1 text-xs text-zinc-200 rounded-full flex items-center gap-2.5 max-w-xl truncate shadow-[#00F5FF]/5"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00F5FF]"></span>
                </span>
                <span className="font-mono text-[10px] uppercase font-bold text-[#00F5FF] tracking-wider shrink-0">CURRENT PIPELINE:</span>
                <span className="truncate max-w-xs font-medium">{actions.find(a => a.status === 'running')?.title}</span>
                <button 
                  onClick={handleCancelTask}
                  className="rounded-full hover:bg-white/10 p-0.5 text-zinc-400 hover:text-red-400 cursor-pointer transition-colors"
                  title="Abruptly Cancel Task Engine"
                >
                  <Ban className="w-3 h-3" />
                </button>
              </motion.div>
            ) : (
              <motion.div 
                key="idle-chip"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="bg-zinc-800/40 border border-zinc-750 px-3 py-1 text-xs text-zinc-400 rounded-full flex items-center gap-2"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-650"></span>
                <span className="font-mono text-[10px] tracking-wider uppercase font-bold">ALL PIPELINES SILENT</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Side: External links & Navigation helpers */}
        <div className="flex items-center gap-3">
          <a 
            href={activeConversation ? `https://ais-pre-oqgxyecziyg57eqnnqoter-483631116519.europe-west1.run.app` : '#'} 
            target="_blank" 
            referrerPolicy="no-referrer"
            className="p-1.5 bg-zinc-900 border border-white/10 hover:border-white/20 hover:bg-zinc-850 text-zinc-400 hover:text-[#f4f4f5] rounded transition-all cursor-pointer focus:outline-none"
            title="Open Sandbox in New Tab"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </header>

      {/* COMPACT FLOATING SIGNAL NOTIFICATION */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-[#121212] border border-[#00F5FF]/20 px-4 py-2 text-zinc-300 font-mono text-xs rounded-lg flex items-center gap-3 shadow-xl shadow-[#00F5FF]/5"
          >
            <Sparkles className="w-4 h-4 text-[#00F5FF] shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN CONTAINER BODY (SQUEEZES P REVIEW AND SIDEBARS) */}
      <div className="flex-1 flex overflow-hidden relative select-none">
        
        {/* COLLAPSIBLE LEFT SIDEBAR: ACTION HISTORY */}
        <aside 
          className={`shrink-0 bg-[#0d0d0d] border-r border-white/5 flex flex-col transition-all duration-300 relative z-30 select-none ${
            isLeftSidebarCollapsed ? "w-0 overflow-hidden border-r-0" : "w-[280px]"
          }`}
        >
          {/* Sidebar Header */}
          <div className="h-11 border-b border-white/5 px-4 flex items-center justify-between select-none">
            <span className="text-[10px] font-sans font-extrabold tracking-[0.2em] text-zinc-500 uppercase">Computer Chronology</span>
            <span className="text-[10px] font-mono font-bold bg-zinc-900 text-zinc-400 px-2 py-0.5 rounded border border-white/5">
              {actions.length} NODES
            </span>
          </div>

          {/* Chronological Step List */}
          <div className="flex-1 overflow-y-auto scrollbar-thin select-none py-1.5 space-y-1">
            {actions.map((act, idx) => {
              const isActive = currentIndex === idx;
              const IconComp = getLucideIconForType(act.type);
              const isRunning = act.status === 'running';

              return (
                <div 
                  key={act.id}
                  onClick={() => handleScrub(idx)}
                  className={`mx-2 p-3 rounded-lg border flex gap-3 transition-all cursor-pointer select-none group relative overflow-hidden ${
                    isActive 
                      ? "bg-white/5 border-l-2 border-l-[#00F5FF] border-white/10" 
                      : "bg-transparent border-transparent hover:bg-white/3"
                  }`}
                >
                  {/* Left Column Icon */}
                  <div className="shrink-0 mt-0.5 relative">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-zinc-900 border border-white/5">
                      <IconComp className={`w-4 h-4 text-zinc-400 group-hover:text-zinc-200 transition-colors ${
                        isRunning ? "animate-pulse text-[#00F5FF]" : ""
                      }`} />
                    </div>
                    {/* Tiny visual status indicator */}
                    <span className={`absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-black ${
                      isRunning 
                        ? "bg-[#00F5FF] animate-ping" 
                        : (act.status === 'completed' ? "bg-emerald-500" : (act.status === 'failed' ? "bg-rose-500" : "bg-zinc-700"))
                    }`}></span>
                  </div>

                  {/* Center Column Texts */}
                  <div className="min-w-0 flex-1 flex flex-col justify-center select-none">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-semibold text-zinc-200 truncate group-hover:text-zinc-50 transition-colors">
                        {act.title}
                      </h4>
                    </div>
                    <p className="text-[10px] text-zinc-550 truncate mt-0.5 font-medium leading-none select-none">
                      {act.subtitle}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Toggle Tab */}
          <button 
            onClick={() => setIsLeftSidebarCollapsed(true)}
            className="absolute -right-3 top-1/2 -translate-y-1/2 z-40 bg-[#121212] border border-white/10 p-1 hover:bg-zinc-800 text-zinc-400 rounded-full cursor-pointer hover:text-white transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
        </aside>

        {/* Collapsed Left Sidebar Launcher indicator */}
        {isLeftSidebarCollapsed && (
          <button 
            onClick={() => setIsLeftSidebarCollapsed(false)}
            className="absolute left-2 top-11 p-1 bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white cursor-pointer z-40 rounded flex items-center"
            title="Expand Actions Panel"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}

        {/* CENTER PANE: COMPUTER CORE VISUAL PREVIEW SCREEN */}
        <main className="flex-1 bg-[#121212] flex flex-col min-w-0 overflow-hidden relative">
          
          {/* Inner content wrapper depending on current action parameters */}
          <div className="flex-1 p-5 md:p-6 overflow-y-auto min-h-0 relative select-none">
            
            {currentViewingAction ? (
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentViewingAction.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.25 }}
                  className="h-full flex flex-col min-h-0"
                >
                  
                  {/* BROWSER MODE VIEW */}
                  {(currentViewingAction.type === 'browser' || currentViewingAction.type === 'search') && (
                    <div className="flex-1 flex flex-col min-h-0 bg-[#0d0d0d] rounded-xl border border-white/5 shadow-2xl overflow-hidden select-text">
                      {/* Chrome Header */}
                      <div className="bg-[#1a1a1a] px-4 py-2 border-b border-white/5 flex items-center gap-3 shrink-0">
                        {/* Traffic dot icons */}
                        <div className="flex items-center gap-1.5 shrink-0 select-none">
                          <span className="w-2.5 h-2.5 rounded-full bg-red-500/80"></span>
                          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></span>
                          <span className="w-2.5 h-2.5 rounded-full bg-green-500/80"></span>
                        </div>
                        {/* Address Block */}
                        <div className="flex-1 bg-zinc-950/80 border border-white/5 rounded-lg px-3 py-1 flex items-center gap-2 max-w-xl text-xs font-mono text-zinc-450 truncate">
                          <Lock className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span className="truncate select-all">{`https://neva-sandbox.core/${currentViewingAction.type}?q=${encodeURIComponent(currentViewingAction.subtitle)}`}</span>
                        </div>
                      </div>

                      {/* Web Page View Area */}
                      <div className="flex-grow p-6 overflow-y-auto bg-zinc-900 scrollbar-thin flex flex-col select-text font-serif">
                        <div className="bg-zinc-950/50 border border-white/5 p-6 rounded-xl flex-1 flex flex-col max-w-3xl mx-auto w-full">
                          
                          {currentViewingAction.type === 'search' ? (
                            /* Simulated Search page */
                            <div className="font-sans space-y-5 antialiased select-text">
                              <div className="border-b border-white/5 pb-3">
                                <h3 className="text-xl font-bold text-sky-400">Google Grounding Sandbox Engine</h3>
                                <p className="text-xs text-zinc-500 font-mono mt-0.5">Found about 7,240,000 matches in 0.042 seconds</p>
                              </div>
                              
                              {/* Search results mapping list */}
                              <div className="space-y-4 pt-1">
                                {[
                                  { title: "React v19 state scheduling metrics and pipeline updates", domain: "https://react.dev/blog/state-scheduling", snippet: "Exploring progressive synchronization constraints. Learn how virtual DOM reconciling and memory-snapshot stabilization prevent heavy frame thread bottlenecks during telemetry sweeps." },
                                  { title: "GitHub - openrouter-api/unified-model-router-schema", domain: "https://github.com/openrouter/router-schema", snippet: "Official types, interfaces, and fallback route declarations for multi-providers API networks. Supports intelligent re-weighting queues and dynamic latency index monitors." },
                                  { title: "Vite SSR - Node express custom hot-reload proxy middleware", domain: "https://vite.dev/guide/ssr-express-hot", snippet: "A complete walkthrough implementing the fast developer proxy pipeline. Restricts standard websocket allocations and serves optimized client SPA bundles." }
                                ].map((resItem, resIdx) => (
                                  <div key={resIdx} className="hover:bg-white/[0.01] p-3 rounded-lg border border-transparent hover:border-white/5 transition-all select-text">
                                    <span className="text-[11px] font-mono text-emerald-400 block tracking-wide select-all">{resItem.domain}</span>
                                    <a href="#" className="text-sky-400 font-semibold text-sm hover:underline mt-0.5 block">{resItem.title}</a>
                                    <p className="text-xs text-zinc-450 leading-relaxed mt-1">{resItem.snippet}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : (
                            /* Real webpage document layout mode */
                            <article className="prose prose-invert select-text leading-relaxed">
                              <header className="border-b border-white/5 pb-4 mb-4">
                                <span className="text-xs font-mono text-cyan-400 tracking-wider">GROUNDING MATRIX DOCUMENT</span>
                                <h2 className="text-xl sm:text-2xl font-serif text-zinc-100 font-bold mt-1">
                                  {MOCK_BROWSER_DASHBOARD[currentViewingAction.subtitle] ? MOCK_BROWSER_DASHBOARD[currentViewingAction.subtitle].title : "Crawl Grounding Summary Context Page"}
                                </h2>
                                <p className="text-xs text-zinc-500 font-mono mt-1">Source: {MOCK_BROWSER_DASHBOARD[currentViewingAction.subtitle] ? MOCK_BROWSER_DASHBOARD[currentViewingAction.subtitle].domain : "sandbox.google.com/grounding-cache"}</p>
                              </header>
                              
                              <p className="text-sm font-sans leading-relaxed text-zinc-300 antialiased font-medium select-text">
                                {MOCK_BROWSER_DASHBOARD[currentViewingAction.subtitle] ? MOCK_BROWSER_DASHBOARD[currentViewingAction.subtitle].text : "Unified specifications for grounding. Synchronizing the active agent pipelines helps preserve long-term associative linkages, verifying AST compilers without invoking background tasks."}
                              </p>

                              <p className="text-sm font-sans leading-relaxed text-zinc-300 mt-4 select-text">
                                Grounding verification helps insulate the running host from hallucination matrices. The verified indicators assure that execution files remain inside isolated sandboxed boundaries.
                              </p>
                              
                              <div className="flex gap-2 flex-wrap pt-6 border-t border-white/5 mt-6 font-mono">
                                {(MOCK_BROWSER_DASHBOARD[currentViewingAction.subtitle] || MOCK_BROWSER_DASHBOARD.default).keywords.map((kw, i) => (
                                  <span key={i} className="text-[9px] bg-sky-500/10 border border-sky-500/15 text-sky-300 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                                    #{kw}
                                  </span>
                                ))}
                              </div>
                            </article>
                          )}

                        </div>
                      </div>
                    </div>
                  )}

                  {/* CODELINE / EDITOR MODE VIEW */}
                  {(currentViewingAction.type === 'editor' || currentViewingAction.type === 'file_read' || currentViewingAction.type === 'file_write') && (
                    <div className="flex-1 flex flex-col min-h-0 bg-[#0d0d0d] rounded-xl border border-white/5 shadow-2xl overflow-hidden font-mono text-xs">
                      
                      {/* Control Tab Bar (Top) */}
                      <div className="bg-[#1a1a1a] flex justify-between items-center px-4 py-0 shrink-0 select-none">
                        
                        {/* Tab file list selectors */}
                        <div className="flex pt-1.5 overflow-x-auto gap-1">
                          {Object.keys(LOCAL_WORKSPACE_FILES).map(fn => {
                            const isTabActive = activeEditorTab === fn;
                            return (
                              <button
                                key={fn}
                                onClick={() => setActiveEditorTab(fn)}
                                className={`px-4.5 py-2 text-xs font-mono font-medium rounded-t-lg transition-all border-t focus:outline-none cursor-pointer border-b ${
                                  isTabActive 
                                    ? "bg-[#0d0d0d] text-zinc-150 border-t-[#00F5FF] border-b-transparent border-x border-x-white/5" 
                                    : "bg-[#161616] text-zinc-500 hover:bg-zinc-900 border-t-transparent border-b-white/5 hover:text-zinc-300 border-x border-transparent"
                                }`}
                              >
                                {fn}
                              </button>
                            );
                          })}
                        </div>

                        {/* Diff Mode selectors */}
                        <div className="flex border border-white/5 bg-[#0d0d0d] p-0.5 rounded">
                          {(['diff', 'original', 'modified'] as const).map(m => (
                            <button
                              key={m}
                              onClick={() => setEditorMode(m)}
                              className={`text-[9px] uppercase tracking-wider font-bold font-mono px-2 py-1 rounded transition-colors focus:outline-none cursor-pointer ${
                                editorMode === m 
                                  ? "bg-zinc-800 text-zinc-150" 
                                  : "text-zinc-550 hover:text-zinc-350"
                              }`}
                            >
                              {m}
                            </button>
                          ))}
                        </div>

                      </div>

                      {/* Code and Highlighting container */}
                      <div className="flex-grow overflow-auto p-4 bg-[#0d0d0d] font-mono text-xs text-zinc-100 select-all leading-relaxed scrollbar-thin">
                        <AnimatePresence mode="wait">
                          {editorMode === "diff" ? (
                            /* Visual Diff */
                            <motion.div 
                              key="diff-body"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="p-3 select-text space-y-2 border-l-2 border-l-zinc-700 bg-zinc-950/20"
                            >
                              <div className="text-zinc-550 leading-loose">// Displaying delta code difference comparisons for {activeEditorTab}</div>
                              <div className="bg-rose-955/20 border-l border-rose-500/40 px-3 py-1 text-rose-350">
                                <span className="text-rose-500 font-bold font-mono inline-block w-4 shrink-0">-</span>
                                <span className="font-mono">const latencyBounds = 3500; // Old operational limits parameters</span>
                              </div>
                              <div className="bg-emerald-955/20 border-l border-emerald-500/40 px-3 py-1 text-emerald-350">
                                <span className="text-emerald-500 font-bold font-mono inline-block w-4 shrink-0">+</span>
                                <span className="font-mono">const latencyBounds = 4500; // New scaled optimization limits bounds</span>
                              </div>
                              <div>
                                {renderHighlightedCode(LOCAL_WORKSPACE_FILES[activeEditorTab].code.substring(0, 300) + "\n...")}
                              </div>
                            </motion.div>
                          ) : (
                            /* Pure code highlighting lines */
                            <motion.div 
                              key="normal-body"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="font-mono"
                            >
                              {renderHighlightedCode(LOCAL_WORKSPACE_FILES[activeEditorTab].code)}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                    </div>
                  )}

                  {/* LOGS AND SHELL TERMINAL MODE VIEW */}
                  {currentViewingAction.type === 'terminal' && (
                    <div className="flex-grow flex flex-col min-h-0">
                      <TerminalView 
                        command={currentStep?.inputPreview || "npx -y eslint --quiet src/components/LiveMonitorView.tsx"} 
                        output={typedTermBuffer} 
                        isRunning={currentViewingAction.status === "running"} 
                      />
                    </div>
                  )}

                  {/* COGNITIVE BRAIN REASONING BUBBLES MODE VIEW */}
                  {currentViewingAction.type === 'thinking' && (
                    <div className="flex-grow flex flex-col min-h-0 rounded-xl overflow-hidden border border-white/5 relative z-10 select-none">
                      <ThinkingVisualization trace={currentViewingAction.reasoningTrace || ""} />
                    </div>
                  )}

                  {/* COMPLETION VIEW */}
                  {currentViewingAction.type === 'complete' && (
                    <div className="flex-1 flex flex-col justify-center items-center text-center p-8 bg-gradient-to-br from-emerald-950/10 to-zinc-950/30 rounded-xl border border-white/5 select-none">
                      <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center mb-5 animate-bounce">
                        <CheckCircle className="w-8 h-8 text-emerald-400" />
                      </div>
                      <h2 className="text-xl sm:text-2xl font-serif text-white font-bold uppercase tracking-wide">
                        All Orchestrator Steps Validated
                      </h2>
                      <p className="text-xs sm:text-sm text-zinc-400 mt-2 max-w-sm font-sans mx-auto leading-relaxed">
                        The Multi-Agent cascade successfully finalized compliance operations. Brief generated and ready for final report integration.
                      </p>
                      
                      <div className="mt-8 p-4 bg-zinc-950/50 border border-white/5 rounded-xl text-left max-w-lg font-mono text-xs w-full text-zinc-400 leading-relaxed">
                        <div className="flex items-center gap-1.5 text-[#00F5FF] uppercase tracking-wider font-bold mb-2">
                          <Check className="w-4 h-4" /> Operations Audit Verified
                        </div>
                        <div>Completed cycles: 5 Sequential Nodes</div>
                        <div>Average Latency: 440ms/cycle-node</div>
                        <div>Output Brief Registry: COMPLETED_OPERATIONS_SUMMARY_SECURE</div>
                      </div>
                    </div>
                  )}

                </motion.div>
              </AnimatePresence>
            ) : (
              /* Absolutely EMPTY State */
              <div className="h-full flex flex-col justify-center items-center text-zinc-500 font-mono text-xs select-none">
                <ShieldAlert className="w-10 h-10 text-zinc-700 animate-spin mb-3" />
                <span>NO ACTIONS INDEXED ON SYSTEM THREADS</span>
              </div>
            )}

          </div>

          {/* BOTTOM TIMELINE CONTROLS SCRUBBER VIEW */}
          <footer className="h-[64px] bg-[#121212]/95 backdrop-blur-md border-t border-white/5 px-6 flex items-center justify-between shrink-0 select-none z-10 relative">
            <TimelineScrubber 
              actions={actions} 
              currentIndex={currentIndex} 
              onScrub={handleScrub} 
              onJumpToLive={handleJumpToLive} 
            />
          </footer>

        </main>

        {/* COLLAPSIBLE RIGHT INSIGHTS PANEL (STEP DETAILS) */}
        <aside 
          className={`shrink-0 bg-[#0d0d0d] border-l border-white/5 flex flex-col transition-all duration-300 relative z-30 select-none ${
            isRightPanelCollapsed ? "w-0 overflow-hidden border-l-0" : "w-[320px] hidden md:flex"
          }`}
        >
          {/* Collapse trigger */}
          <button 
            onClick={() => setIsRightPanelCollapsed(true)}
            className="absolute -left-3 top-1/2 -translate-y-1/2 z-40 bg-[#121212] border border-white/10 p-1 hover:bg-zinc-800 text-zinc-400 rounded-full cursor-pointer hover:text-white transition-colors"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          {/* Sidebar Header */}
          <div className="h-11 border-b border-white/5 px-4 flex items-center uppercase tracking-wider font-extrabold text-[10px] text-zinc-500">
            Node Diagnostics
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-thin select-all p-4 space-y-5">
            {currentStep ? (
              <>
                {/* Agent Profile Card */}
                <div className="p-3 bg-zinc-950 border border-white/5 rounded-xl flex items-start gap-3">
                  <span className="text-2xl mt-0.5 shrink-0 block">{currentProfile.icon}</span>
                  <div className="min-w-0 flex-1">
                    <span className="text-xs font-bold text-white block uppercase tracking-wide">{currentProfile.name}</span>
                    <span className="text-[10px] text-zinc-550 block font-normal leading-relaxed mt-0.5">{currentProfile.description}</span>
                    
                    {/* Autonomy meter */}
                    <div className="mt-2.5 flex items-center justify-between">
                      <span className="text-[8px] font-mono text-zinc-650 tracking-wider">AUTONOMY_LEVEL:</span>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map(lvl => (
                          <span 
                            key={lvl} 
                            className={`w-3 h-1.5 rounded-sm ${
                              lvl <= (currentProfile.autonomyLevel || 4) ? "bg-[#00F5FF]" : "bg-zinc-800"
                            }`}
                          ></span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status Badging & Timing details */}
                <div className="space-y-2 border-t border-white/5 pt-3 select-none">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-500 font-mono text-[10px]">STATUS:</span>
                    {getStatusBadge(currentViewingAction.status)}
                  </div>
                  
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-500 font-mono text-[10px]">STARTED_AT:</span>
                    <span className="font-mono text-[10px] text-zinc-300">
                      {new Date(currentStep.startedAt).toLocaleTimeString()}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-500 font-mono text-[10px]">DURATION_SEC:</span>
                    <span className="font-mono text-[10px] text-zinc-300">
                      {currentStep.durationMs 
                        ? `${(currentStep.durationMs / 1000).toFixed(1)}s` 
                        : `${(Math.max(100, Date.now() - new Date(currentStep.startedAt).getTime()) / 1000).toFixed(1)}s`
                      }
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-500 font-mono text-[10px]">EST_TOKENS:</span>
                    <span className="font-mono text-[10px] text-[#00F5FF]/90 font-bold">
                      {(currentIndex * 1238 + 2048).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Collapsible raw Tool Input parameter metrics */}
                {currentStep.tool && (
                  <CollapsibleToolBlock tool={currentStep.tool} input={currentStep.toolInput} output={currentStep.toolOutput} />
                )}

                {/* Expanded full reasoning trace */}
                <div className="border-t border-white/5 pt-4 flex flex-col min-h-[140px]">
                  <span className="text-[9px] font-mono text-zinc-500 tracking-wider block mb-2 uppercase">REASONING_TRACE_COGNITIVE</span>
                  <div className="flex-grow bg-black/40 border border-white/5 rounded p-3 text-[10px] text-zinc-400 font-mono leading-relaxed max-h-[180px] overflow-y-auto scrollbar-thin select-text">
                    {currentStep.reasoningTrace || "Establishing orchestrator nodes parameters validation patterns."}
                  </div>
                </div>

                {/* Logs of events relevant to the current actions run */}
                <div className="border-t border-white/5 pt-4">
                  <span className="text-[9px] font-mono text-zinc-500 tracking-wider block mb-2 uppercase">CORE_EVENT_LOGS (LAST 5)</span>
                  <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1 scrollbar-thin select-all font-mono">
                    {logs.slice(0, 5).map(lg => (
                      <div key={lg.id} className="text-[9px] tracking-tight leading-normal text-zinc-500 bg-white/[0.01] p-1.5 rounded border border-white/5">
                        <span className="text-zinc-450 text-[8px] font-mono mr-1">[{new Date(lg.createdAt).toLocaleTimeString()}]</span>
                        <span className="text-cyan-400 font-bold uppercase">{lg.eventType}:</span>
                        <span className="text-zinc-350 ml-1 block mt-0.5">{(lg.payload as any)?.message || "Event recorded"}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </>
            ) : (
              <p className="text-zinc-650 text-xs italic font-mono uppercase">Select step node to inspect diagnostics</p>
            )}
          </div>
        </aside>

        {/* Collapsed right insights indicator launcher */}
        {isRightPanelCollapsed && (
          <button 
            onClick={() => setIsRightPanelCollapsed(false)}
            className="absolute right-2 top-11 p-1 bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white cursor-pointer z-40 rounded flex items-center hidden md:flex"
            title="Expand Diagnostics Panel"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}

      </div>

      <style>{`
        .scrollbar-thin::-webkit-scrollbar {
          width: 4px;
          height: 4px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #27272a;
          border-radius: 9999px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: #3f3f46;
        }
      `}</style>

    </div>
  );
}

// =================== LOGICAL SUBCOMPONENTS EXTRINSICS ===================

interface ScrubberProps {
  actions: ActionItem[];
  currentIndex: number;
  onScrub: (index: number) => void;
  onJumpToLive: () => void;
}

// Bottom tracking timeline Scrubber bar
function TimelineScrubber({ actions, currentIndex, onScrub, onJumpToLive }: ScrubberProps) {
  const isBackDisabled = currentIndex <= 0;
  const isForwardDisabled = currentIndex >= actions.length - 1;

  const currentPercentage = actions.length > 1 ? (currentIndex / (actions.length - 1)) * 100 : 100;

  return (
    <div className="w-full flex items-center justify-between gap-6 relative font-mono text-xs select-none">
      
      {/* Left Back Command buttons */}
      <button
        onClick={() => onScrub(currentIndex - 1)}
        disabled={isBackDisabled}
        className="w-8 h-8 rounded-lg bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-300 hover:text-white hover:border-white/20 disabled:opacity-30 disabled:pointer-events-none cursor-pointer focus:outline-none"
        title="Previous step node (Ctrl+Shift+L back)"
      >
        <SkipBack className="w-3.5 h-3.5" />
      </button>

      {/* Center Horizontal scrubber track dragging overlay wrapper */}
      <div className="flex-1 flex flex-col justify-center relative">
        <div className="h-4 flex items-center relative cursor-horizontal-glass-slider cursor-pointer group">
          {/* Slider Input range overlay - pure HTML input for flawless native dragging! */}
          <input 
            type="range"
            min={0}
            max={actions.length - 1}
            value={currentIndex}
            onChange={(e) => onScrub(parseInt(e.target.value))}
            className="w-full h-4 absolute inset-0 opacity-0 cursor-pointer z-20"
          />
          
          {/* Visual Track background style */}
          <div className="w-full h-1 bg-zinc-800 rounded-full relative">
            <div 
              className="h-1 bg-[#00F5FF] rounded-full" 
              style={{ width: `${currentPercentage}%` }}
            ></div>
            <div 
              className="w-3 h-3 rounded-full bg-[#00F5FF] border-2 border-[#121212] absolute top-1/2 -translate-y-1/2 shadow-lg scale-0 group-hover:scale-100 transition-transform origin-center"
              style={{ left: `calc(${currentPercentage}% - 6px)` }}
            ></div>
          </div>
        </div>

        {/* Dynamic labels line under Slider */}
        <div className="flex justify-between items-center mt-1 text-[9px] text-[#a1a1aa] font-medium leading-none font-mono tracking-wider">
          <span className="truncate max-w-sm shrink">
            {actions[currentIndex] ? actions[currentIndex].subtitle : "Operational Sandbox Ingest"}
          </span>
          <span className="shrink-0">{currentIndex + 1} of {actions.length} NODES</span>
        </div>
      </div>

      {/* SNAPPING JUMP PILL OVERLAY */}
      {currentIndex !== actions.length - 1 && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[45px] z-40 select-none">
          <button
            onClick={onJumpToLive}
            className="px-4 py-1.5 bg-[#00F5FF] hover:bg-white text-zinc-950 text-[10px] font-bold tracking-widest uppercase rounded-full shadow-lg shadow-[#00F5FF]/10 flex items-center gap-2 transition-all active:scale-95 cursor-pointer font-mono"
          >
            <Play className="w-3 h-3 fill-zinc-950 text-zinc-950 stroke-[2.5]" />
            <span>JUMP TO LIVE</span>
          </button>
        </div>
      )}

      {/* Right Forward Skip Button */}
      <button
        onClick={() => onScrub(currentIndex + 1)}
        disabled={isForwardDisabled}
        className="w-8 h-8 rounded-lg bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-300 hover:text-white hover:border-white/20 disabled:opacity-30 disabled:pointer-events-none cursor-pointer focus:outline-none"
        title="Next step node (Ctrl+Shift+L forward)"
      >
        <SkipForward className="w-3.5 h-3.5" />
      </button>

    </div>
  );
}

// ======================= VISUAL REASONING GRAPH CANVAS =======================

function ThinkingVisualization({ trace }: { trace: string }) {
  const sentencesRef = useRef<string[]>([]);
  
  // Stablize custom fragments
  if (sentencesRef.current.length === 0) {
    const rawFrags = (trace || "Analyzing algorithmic variables indices.")
      .split(/[.!?]\s+/)
      .map(s => s.trim())
      .filter(s => s.length > 5 && s.length < 90)
      .slice(-6);

    sentencesRef.current = rawFrags.length > 0 ? rawFrags : [
      "Optimizing prompt tokens weights constraints.",
      "Reviewing compiler directories logs index.",
      "Decomposing operations priorities nodes layout.",
      "Deploying file monitoring listeners buffers.",
      "Restricting processes to secure sandbox container."
    ];
  }

  return (
    <div className="flex-grow flex flex-col justify-center items-center relative overflow-hidden bg-gradient-to-br from-cyan-950/20 to-purple-950/20 p-8 min-h-[350px]">
      <div className="absolute inset-0 bg-radial-[circle_at_center,rgba(0,245,255,0.03)_0%,transparent_70%] pointer-events-none animate-pulse"></div>
      
      {/* Pulse Center */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="w-20 h-20 rounded-full bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center glow-pulse-cyan scale-110">
          <Brain className="w-10 h-10 text-[#00F5FF]" />
        </div>
        <p className="text-[10px] font-mono text-cyan-400 tracking-[0.2em] uppercase mt-4.5 font-bold leading-none select-none">
          COGNITIVE DEEP THINKING
        </p>
      </div>

      {/* Floating coordinates indices bubbles */}
      <div className="absolute inset-0 pointer-events-none select-none">
        {sentencesRef.current.map((text, idx) => {
          const angles = [45, 135, 225, 315, 90, 270];
          const radius = 120 + (idx % 2) * 40;
          const rad = (angles[idx % angles.length] * Math.PI) / 180;
          const x = Math.round(Math.cos(rad) * radius);
          const y = Math.round(Math.sin(rad) * radius);

          return (
            <div
              key={idx}
              className="absolute bg-[#09090b]/90 border border-cyan-500/15 text-cyan-200/90 rounded-full px-4 py-2 shadow-lg backdrop-blur-md text-[10px] font-mono max-w-[240px] flex items-center gap-2"
              style={{
                top: `calc(50% + ${y}px - 14px)`,
                left: `calc(50% + ${x}px - 75px)`,
                animation: `orbitFloat ${5 + (idx % 3)}s ease-in-out infinite alternate`,
                animationDelay: `${idx * 0.5}s`
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
              <span className="truncate">{text}</span>
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes orbitFloat {
          from { transform: translateY(0px) scale(0.97); opacity: 0.8; }
          to { transform: translateY(-10px) scale(1.02); opacity: 1; }
        }
        .glow-pulse-cyan {
          box-shadow: 0 0 30px rgba(0, 245, 255, 0.08);
          animation: monitorGlowPulse 2.5s infinite alternate;
        }
        @keyframes monitorGlowPulse {
          from { border-color: rgba(0, 245, 255, 0.15); box-shadow: 0 0 15px rgba(0, 245, 255, 0.05); }
          to { border-color: rgba(0, 245, 255, 0.4); box-shadow: 0 0 35px rgba(0, 245, 255, 0.25); }
        }
      `}</style>
    </div>
  );
}

// ======================== MOCKED TERMINAL SANDBOX SCREEN ========================

function TerminalView({ command, output, isRunning }: { command: string; output: string; isRunning: boolean }) {
  return (
    <div className="flex-grow flex flex-col min-h-0 bg-[#0d0d0d] rounded-xl border border-white/5 overflow-hidden font-mono shadow-2xl">
      {/* Chrome header */}
      <div className="bg-[#1a1a1a] px-4 py-2.5 flex items-center justify-between border-b border-white/5 shrink-0 select-none">
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500/80"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-green-500/80"></span>
        </div>
        <span className="text-[10px] text-zinc-400 tracking-wider">NEVA Terminal Sandbox</span>
        <div className="w-10"></div>
      </div>
      
      {/* terminal lines */}
      <div className="flex-grow p-5 overflow-y-auto font-mono text-xs leading-loose select-text bg-[#030303] text-zinc-300">
        <div className="flex gap-2 text-purple-400">
          <span className="shrink-0 select-none font-bold">neva-sandbox@cli:~$</span>
          <span className="text-zinc-200 select-all">{command}</span>
        </div>
        <pre className="text-emerald-400 whitespace-pre-wrap select-all font-mono mt-3">
          {output}
          {isRunning && <span className="animate-pulse">|</span>}
        </pre>
      </div>
    </div>
  );
}

// ======================== CODE ACCORDIONS MODULES ========================

function CollapsibleToolBlock({ tool, input, output }: { tool: string; input: any; output: any }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-white/5 rounded-lg overflow-hidden relative select-none">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-2.5 bg-zinc-950 hover:bg-zinc-90 w-full text-left font-mono text-[9px] uppercase tracking-wider text-zinc-400"
      >
        <span>TOOL_CALL: {tool}</span>
        {isOpen ? <ChevronRight className="w-3.5 h-3.5 rotate-90" /> : <ChevronRight className="w-3.5 h-3.5" />}
      </button>

      {isOpen && (
        <div className="p-3 bg-black/60 font-mono text-[9px] text-zinc-450 leading-relaxed border-t border-white/5 space-y-2 select-text overflow-x-auto">
          {input && (
            <div>
              <span className="text-[#00F5FF]/85 font-bold block">INPUT:</span>
              <pre className="select-all block text-zinc-350">{typeof input === 'object' ? JSON.stringify(input, null, 2) : input}</pre>
            </div>
          )}
          {output && (
            <div>
              <span className="text-emerald-450 font-bold block">OUTPUT:</span>
              <pre className="select-all block text-zinc-350">{typeof output === 'object' ? JSON.stringify(output, null, 2) : output}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
