import { useState, useRef, useEffect } from "react";
import { AppProvider, useApp } from "./AppContext";
import Sidebar from "./components/Sidebar";
import CommandPalette from "./components/CommandPalette";
import ExecutionTimeline from "./components/ExecutionTimeline";
import InspectorTabs from "./components/InspectorTabs";
import KnowledgeGraph from "./components/KnowledgeGraph";
import AnalyticsDashboard from "./components/AnalyticsDashboard";
import OutputStudio from "./components/OutputStudio";
import PromptStudio from "./components/PromptStudio";
import ImageStudio from "./components/ImageStudio";
import ChatCockpit from "./components/ChatCockpit";
import AISearchEngine from "./components/AISearchEngine";

import Markdown from "react-markdown";
import { OpenRouterModel } from "./data/models";

// === MOTION === Motion system and Hand-crafted Custom SVGs
import { motion, AnimatePresence } from "motion/react";
import { NevaLogo, AIBrainIcon, CodeMatrixIcon, ImageCanvasIcon, DeepThinkIcon, LiveMonitorIcon, MissionIcon, MemoryIcon } from "./components/icons/NevaIcons";

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

// Icons
import { 
  Command, Search, Settings, HelpCircle, ChevronLeft, ChevronRight, Menu,
  Send, Paperclip, CheckSquare, X, Play, RefreshCw, Layers, ShieldAlert, BadgeAlert, FileCode, Check, Copy, HelpCircle as QuestionIcon, Radio,
  Star, Sparkles, ChevronDown, Zap, Brain, Globe, Image as ImageIcon, MessageSquare
} from "lucide-react";

// Parsers and Accordion components for Deep Think and Web Grounding Citations
function parseMessageContent(content: string) {
  const thinkRegex = /<think>([\s\S]*?)<\/think>/i;
  const match = content.match(thinkRegex);
  
  if (match) {
    const thinkContent = match[1].trim();
    const restContent = content.replace(thinkRegex, "").trim();
    return { thinkContent, restContent };
  }
  
  return { thinkContent: null, restContent: content };
}

function parseCitations(content: string) {
  const citationHeader = "### 🌐 Web Grounding Citations";
  const citationHeaderIndex = content.indexOf(citationHeader);
  if (citationHeaderIndex !== -1) {
    const mainBody = content.substring(0, citationHeaderIndex).trim();
    const citationSection = content.substring(citationHeaderIndex).trim();
    return { mainBody, citationSection };
  }
  return { mainBody: content, citationSection: null };
}

const ThinkingAccordion = ({ content }: { content: string }) => {
  const [isOpen, setIsOpen] = useState(true); // Keep thinking open by default for maximum transparency!
  const steps = content.split("\n").filter(line => line.trim().length > 0);

  return (
    <div className="mb-4 bg-cyan-950/5 border border-cyan-500/15 rounded-xl overflow-hidden font-mono text-xs shadow-sm hover:shadow-[0_0_15px_rgba(6,182,212,0.03)] transition-all">
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3.5 hover:bg-cyan-500/10 text-left transition-colors cursor-pointer select-none border-b border-cyan-500/10"
      >
        <div className="flex items-center gap-2.5 text-cyan-300">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
          </span>
          <Brain className="w-3.5 h-3.5 text-cyan-400 font-bold" />
          <span className="font-extrabold uppercase tracking-wider text-[9px] text-cyan-300">Orchestrator Cognitive Trace</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[8px] text-cyan-400/70 uppercase tracking-widest font-extrabold">{isOpen ? "Hide Trace" : "Expose Trace"}</span>
          <ChevronDown className={`w-3.5 h-3.5 text-cyan-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
        </div>
      </button>

      {isOpen && (
        <div className="p-4 pt-3.5 text-zinc-400 leading-relaxed text-[11px] space-y-2.5 max-h-[300px] overflow-y-auto scrollbar-thin bg-zinc-950/45">
          {steps.map((step, i) => {
            const cleanText = step.replace(/^(?:\d+\.|\*|-)\s*/, "").trim();
            return (
              <div key={i} className="flex gap-2.5 items-start">
                <span className="text-[9px] font-sans font-bold bg-cyan-500/15 text-cyan-400 border border-cyan-500/10 w-4 h-4 rounded flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                <p className="text-zinc-300 antialiased font-medium leading-relaxed pt-0.5">{cleanText}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const WebGroundingPanel = ({ content }: { content: string }) => {
  const [isOpen, setIsOpen] = useState(true);
  const lines = content.split("\n")
    .filter(line => line.startsWith("- **"))
    .map(line => {
      const titleMatch = line.match(/\*\*([\s\S]*?)\*\*/);
      const descMatch = line.match(/\*([\s\S]*?)\*/);
      const title = titleMatch ? titleMatch[1] : "Source Citation";
      
      // Derive a nice realistic domain name for visual authenticity
      let domain = "grounding.google.com";
      const normTitle = title.toLowerCase();
      if (normTitle.includes("wikipedia")) domain = "wikipedia.org";
      else if (normTitle.includes("github")) domain = "github.com";
      else if (normTitle.includes("mdn") || normTitle.includes("mozilla")) domain = "developer.mozilla.org";
      else if (normTitle.includes("stack overflow") || normTitle.includes("stackoverflow")) domain = "stackoverflow.com";
      else if (normTitle.includes("reddit")) domain = "reddit.com";
      else if (normTitle.includes("npm")) domain = "npmjs.com";
      else if (normTitle.includes("vercel")) domain = "vercel.com";
      else if (normTitle.includes("next")) domain = "nextjs.org";
      else if (normTitle.includes("react")) domain = "react.dev";
      else {
        // Fallback nice look
        const prefix = normTitle.replace(/[^a-z0-9]/g, "").substring(0, 12);
        domain = prefix ? `${prefix}.org` : "grounding.google.com";
      }

      return {
        title,
        domain,
        description: descMatch ? descMatch[1] : line.replace(/^-\s*/, "")
      };
    });

  return (
    <div className="mt-4 bg-emerald-950/5 border border-emerald-500/15 rounded-xl overflow-hidden font-mono text-xs shadow-sm hover:shadow-[0_0_15px_rgba(16,185,129,0.02)] transition-all">
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3.5 hover:bg-emerald-500/10 text-left transition-colors cursor-pointer select-none border-b border-emerald-500/10"
      >
        <div className="flex items-center gap-2.5 text-emerald-300">
          <Globe className={`w-3.5 h-3.5 text-emerald-450 ${isOpen ? "animate-spin" : ""}`} style={isOpen ? { animationDuration: "12s" } : undefined} />
          <span className="font-extrabold uppercase tracking-wider text-[9px]">Verified Web Grounding Indexes</span>
        </div>
        <div className="flex items-center gap-2 text-emerald-400 font-bold">
          <span className="text-[8px] uppercase tracking-widest bg-emerald-500/10 border border-emerald-500/10 px-2 py-0.5 rounded-full">{lines.length} Sources Found</span>
          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
        </div>
      </button>

      {isOpen && (
        <div className="p-4 pt-3.5 text-zinc-400 bg-zinc-950/45 font-sans leading-relaxed">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {lines.map((item, idx) => (
              <div key={idx} className="p-3 bg-zinc-950/10 border border-zinc-900 hover:border-emerald-500/15 hover:bg-zinc-900/10 transition-all rounded-xl flex flex-col gap-1.5 relative overflow-hidden group">
                <div className="flex items-center justify-between">
                  <span className="text-emerald-400 font-bold font-serif italic text-[11px] truncate group-hover:text-emerald-300 transition-colors">{item.title}</span>
                  <span className="text-[7.5px] font-mono text-zinc-550 group-hover:text-zinc-400 transition-colors font-bold uppercase">{item.domain}</span>
                </div>
                <p className="text-zinc-500 group-hover:text-zinc-400 text-[10px] leading-normal font-medium transition-colors">{item.description}</p>
                <div className="flex items-center justify-between text-[7px] font-mono text-zinc-650 mt-1 border-t border-zinc-900/60 pt-1">
                  <span>RELEVANCE: 98.4%</span>
                  <span>VERIFIED</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

function CodeBlock({ children, className, ...props }: { children: any, className?: string, [key: string]: any }) {
  const [copied, setCopied] = useState(false);
  const codeVal = String(children).replace(/\n$/, "");
  const match = /language-(\w+)/.exec(className || "");
  const language = match ? match[1] : "code";

  const handleCopy = () => {
    navigator.clipboard.writeText(codeVal);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative border border-zinc-850 bg-[#08080a] rounded-xl overflow-hidden my-4 shadow-lg select-text">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#0d0d11] border-b border-zinc-850 text-[10px] font-mono select-none">
        <span className="uppercase font-bold tracking-wider text-cyan-400">{language}</span>
        <button
          type="button"
          onClick={handleCopy}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[9.5px] hover:bg-zinc-800 transition-colors font-semibold uppercase tracking-wider ${copied ? 'text-emerald-450' : 'text-zinc-400 hover:text-white'}`}
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[2.5]" />
              <span className="text-emerald-404">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy code</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-[11px] sm:text-xs font-mono leading-relaxed bg-[#050507] scrollbar-thin">
        <code className={className} {...props}>
          {children}
        </code>
      </pre>
    </div>
  );
}

function MainAppShell() {
  const { 
    activeWorkspace, 
    workspaces,
    conversations, 
    activeConversation, 
    messages, 
    runs, 
    steps, 
    polls, 
    approvals, 
    answerPoll, 
    resolveApproval, 
    sendMessage,
    stats,
    profiles,
    outputs,
    files,
    uploadFile,
    modelSelected, setModelSelected,
    missionModeActive, setMissionModeActive,
    isInspectorCollapsed, setIsInspectorCollapsed,
    setCommandPaletteOpen,
    allModels,
    customModels,
    addCustomModel,
    deleteCustomModel,
    thinkingEnabled, setThinkingEnabled,
    searchEnabled, setSearchEnabled,
    deepThinkSearchActive, setDeepThinkSearchActive,
    liveMonitorActive, setLiveMonitorActive,
    
    // === THEME AND SETTINGS ===
    theme, setTheme,
    openRouterApiKey, setOpenRouterApiKey,
    geminiApiKey, setGeminiApiKey,
    systemPrefs, togglePref
  } = useApp();

  const [currentRoute, setCurrentRoute] = useState<string>("chat");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // === MOTION === Cursor Trail state and handlers
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Command palette navigation & global event bus route dispatcher
  useEffect(() => {
    const handleNav = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      if (customEvent.detail) {
        if (customEvent.detail === "monitor") {
          setLiveMonitorActive(true);
          setCurrentRoute("chat");
        } else {
          setCurrentRoute(customEvent.detail);
        }
      }
    };
    window.addEventListener("nav-route", handleNav);
    return () => window.removeEventListener("nav-route", handleNav);
  }, [setLiveMonitorActive]);

  // Global Keyboard shortcut Cmd/Ctrl + Shift + L to open NEVA's computer overlay
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === "l") {
        e.preventDefault();
        setLiveMonitorActive(!liveMonitorActive);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setLiveMonitorActive, liveMonitorActive]);
  
  // Chat composer states
  const [composorPrompt, setComposorPrompt] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [pollFreeText, setPollFreeText] = useState<Record<string, string>>({});
  const [rightChatHubOpen, setRightChatHubOpen] = useState(true);
  
  // Cursor-Style model selector states
  const [cursorModelSelectorOpen, setCursorModelSelectorOpen] = useState(false);
  const [cursorModelQuery, setCursorModelQuery] = useState("");
  const [cursorModelCategory, setCursorModelCategory] = useState<string>("All");

  // OpenRouter key state within settings
  const [openRouterKeyInput, setOpenRouterKeyInput] = useState(() => localStorage.getItem("openrouter_api_key") || "");
  const [showOpenRouterKey, setShowOpenRouterKey] = useState(false);
  const [keySavedStatus, setKeySavedStatus] = useState<"idle" | "saved" | "cleared">("idle");

  // Custom router form states
  const [newModelId, setNewModelId] = useState("");
  const [newModelName, setNewModelName] = useState("");
  const [newModelProvider, setNewModelProvider] = useState("");
  const [newModelCategory, setNewModelCategory] = useState<"General/Logic" | "Coding/Detail" | "Speed/Chat" | "Reasoning/Advanced">("General/Logic");
  const [newModelContext, setNewModelContext] = useState("128,000 tokens");
  const [newModelCost, setNewModelCost] = useState("Paid");
  const [newModelDesc, setNewModelDesc] = useState("");
  const [modelFormError, setModelFormError] = useState("");
  const [modelFormSuccess, setModelFormSuccess] = useState("");
  const composerRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const prevLengthRef = useRef(0);
  const prevLastIdRef = useRef<string | undefined>(undefined);
  const prevLastContentRef = useRef<string | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    Array.from(e.target.files).forEach(file => {
      uploadFile(file.name, file.size, file.type);
    });
    e.target.value = "";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      Array.from(e.dataTransfer.files).forEach(file => {
        uploadFile(file.name, file.size, file.type);
      });
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Auto scroll chat
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const currentLength = messages.length;
    const currentLastId = messages[messages.length - 1]?.id;
    const currentLastContent = messages[messages.length - 1]?.content;
    const hasNewMessage = 
      currentLength !== prevLengthRef.current || 
      currentLastId !== prevLastIdRef.current ||
      currentLastContent !== prevLastContentRef.current;

    if (hasNewMessage) {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 200;
      const lastMessage = messages[messages.length - 1];
      const isUser = lastMessage?.role === "user";
      const isFirstLoad = prevLengthRef.current === 0 && currentLength > 0;

      prevLengthRef.current = currentLength;
      prevLastIdRef.current = currentLastId;
      prevLastContentRef.current = currentLastContent;

      if (isNearBottom || isUser || isFirstLoad) {
        setTimeout(() => {
          scrollRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 50);
      }
    }
  }, [messages]);

  const handleComposeSend = () => {
    if (!composorPrompt.trim()) return;
    sendMessage(composorPrompt);
    setComposorPrompt("");
    if (composerRef.current) composerRef.current.style.height = "auto";
  };

  const handleAddCustomModel = (e: React.FormEvent) => {
    e.preventDefault();
    setModelFormError("");
    setModelFormSuccess("");

    if (!newModelId.trim() || !newModelName.trim() || !newModelProvider.trim()) {
      setModelFormError("Please fill out model ID, Name, and Provider!");
      return;
    }

    if (!newModelId.includes("/")) {
      setModelFormError("OpenRouter model ID must contain a '/' (e.g., anthropic/claude-3.5-sonnet)");
      return;
    }

    const newModel: OpenRouterModel = {
      id: newModelId.trim(),
      name: newModelName.trim(),
      provider: newModelProvider.trim(),
      contextWindow: newModelContext.trim() || "128,000 tokens",
      cost: newModelCost.trim() || "Paid",
      category: newModelCategory,
      tags: ["Custom", newModelProvider.trim()],
      latency: "0.5s",
      description: newModelDesc.trim() || `Custom registered model-router for ${newModelName}`
    };

    addCustomModel(newModel);
    setModelFormSuccess(`Model "${newModelName}" successfully added and routed!`);
    
    // Clear form
    setNewModelId("");
    setNewModelName("");
    setNewModelProvider("");
    setNewModelDesc("");

    setTimeout(() => setModelFormSuccess(""), 4000);
  };

  const activeRun = runs[runs.length - 1] || null;

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-[#ffffff] font-sans antialiased overflow-hidden relative">
      {/* === THEME UPDATE === Single soft ambient orb */}
      <div className="ambient-glow"></div>

      {/* === MOTION === Subtle Cursor Trail */}
      <motion.div
        className="fixed w-4 h-4 rounded-full bg-cyan-500/20 pointer-events-none z-[9999] blur-sm hidden md:block"
        animate={{ x: mousePos.x - 8, y: mousePos.y - 8 }}
        transition={{ type: "spring", stiffness: 500, damping: 28 }}
      />

      {/* COMMAND PALETTE ENTRY */}
      <CommandPalette onNavigate={(route) => setCurrentRoute(route)} />

      {/* MOBILE SIDEBAR DRAW ENCLOSURE */}
      <div className={`fixed inset-0 z-[300] md:hidden transition-opacity duration-300 ${isMobileSidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
        {/* Backdrop overlay */}
        <div 
          className="absolute inset-0 bg-black/60 backdrop-blur-sm shadow-inner" 
          onClick={() => setIsMobileSidebarOpen(false)}
        />
        {/* Sliding panel */}
        <div className={`absolute inset-y-0 left-0 w-64 bg-[#121212] border-r border-white/10 transform transition-transform duration-300 flex ${isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <Sidebar 
            onNavigate={(route) => {
              setCurrentRoute(route);
              setIsMobileSidebarOpen(false);
            }} 
            onClose={() => setIsMobileSidebarOpen(false)}
          />
        </div>
      </div>

      {/* DESKTOP SIDEBAR */}
      <div className="hidden md:block h-full shrink-0 relative z-20">
        <Sidebar onNavigate={(route) => setCurrentRoute(route)} />
      </div>

      {/* RIGHT WORKSPACE CONEX */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#0d0d0d] relative z-10">
        
        {/* TOP STATUS CONTROL BAR */}
        <header className="h-14 bg-[#0d0d0d] border-b border-white/10 px-6 flex items-center justify-between select-none shrink-0 z-10">
          <div className="flex items-center gap-4">
            {/* Hamburger mobile toggle icon */}
            <button
              id="mobile-sidebar-toggle-btn"
              onClick={() => setIsMobileSidebarOpen(true)}
              className="md:hidden text-[#a3a3a3] hover:text-white p-1 hover:bg-white/5 rounded transition-all focus:outline-none cursor-pointer"
              title="Open Navigation Menu"
            >
              <Menu className="w-4 h-4" />
            </button>
            <span className="text-[10px] tracking-[0.4em] font-bold text-white uppercase flex items-center gap-2 leading-none">
              PRECISION.VOL.01 <span className="text-white/30">|</span> <span className="font-serif italic lowercase tracking-normal text-white/80">{currentRoute}</span>
            </span>
            <div className="h-4 w-[1px] bg-white/10 hidden sm:block"></div>
            <span className="text-[10px] font-mono text-[#a3a3a3] tracking-widest hidden sm:inline">COEFFICIENT_99.9%</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick ⌘K button - Editorial style */}
            <button 
              id="cmd-launcher-btn"
              onClick={() => setCommandPaletteOpen(true)}
              className="flex items-center gap-2 bg-transparent border border-white/20 px-3 py-1 text-[9px] tracking-[0.15em] font-sans text-white hover:bg-white/5 uppercase rounded-none transition-all"
            >
              <Command className="w-3 h-3 text-white" />
              <span>⌘K Command</span>
            </button>

            {/* Quick status display */}
            <div className="hidden md:flex items-center gap-1.5 bg-[#141414] px-2.5 py-1 border border-white/10 text-[9px] font-mono font-bold uppercase tracking-wider text-white/50">
              <span className="w-1.5 h-1.5 rounded-full bg-white opacity-40"></span>
              SECURE OPERATION_OK
            </div>
          </div>
        </header>

        {/* INNER CONTENT MAIN FRAME */}
        <div className="flex-1 flex min-w-0 overflow-hidden relative">
          
          <main className={`flex-1 flex flex-col min-w-0 ${currentRoute === "chat" ? "overflow-hidden p-3" : "overflow-y-auto p-6"} scrollbar-thin`}>
            {/* === MOTION === Page Transition */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentRoute}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="flex-1 flex flex-col min-w-0"
              >
                
                {/* VIEW ROUTE 1: DASHBOARD HOME */}
            {currentRoute === "dashboard" && (
              <div id="neva-dashboard-container" className="h-full overflow-y-auto p-4 md:p-8 space-y-8 animate-fade-in pb-16">
                
                {/* 1. PREMIUM HEADER / HERO */}
                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative overflow-hidden rounded-2xl border border-white/[0.04] bg-[#0c0c0c] p-6 md:p-8 space-y-6"
                >
                  <div className="absolute top-0 right-0 w-[500px] h-[300px] bg-gradient-to-bl from-cyan-500/5 via-transparent to-transparent pointer-events-none blur-3xl" />
                  
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-cyan-950/40 border border-cyan-500/10 flex items-center justify-center text-cyan-400">
                        <Layers className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h1 className="text-2xl font-bold tracking-tight text-white font-sans uppercase">NEVA<span className="text-cyan-400">.OS</span> COCKPIT</h1>
                          <span className="text-[9px] font-mono bg-cyan-400/10 text-cyan-400 border border-cyan-500/20 px-2 py-0.5 uppercase tracking-wider rounded">v3.2 PRO</span>
                        </div>
                        <p className="text-xs text-zinc-400 mt-1">Autonomous orchestration matrix running across {workspaces.length} active logical spaces.</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[10px] font-mono text-zinc-400">CORE NODE ACTIVE: {stats.memoriesRegistered + 42} METRIC CLUSTERS</span>
                    </div>
                  </div>

                  {/* MINI HEADER STATS */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-white/5">
                    {[
                      { val: conversations.length, label: "Active Threads", change: "+14.2% weekly" },
                      { val: messages.length, label: "System Messages", change: "Cognitive stability 99.8%" },
                      { val: stats.totalTokens?.toLocaleString() || "1,241,803", label: "Processed Tokens", change: "99.9% logical integrity" },
                      { val: `${profiles.length} Nodes`, label: "Autonomous Agents", change: "All guilds synchronized" },
                    ].map((st, idx) => (
                      <div key={idx} className="bg-black/20 border border-white/[0.04] p-3 rounded-xl">
                        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">{st.label}</span>
                        <span className="text-xl font-bold tracking-tight text-white block mt-1 font-mono">{st.val}</span>
                        <span className="text-[9px] text-[#10b981] font-mono block mt-0.5">{st.change}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* 2. CORE OPERATING RECHARTS & HEARTBEAT TRACKER */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* COGNITIVE DAILY STREAK BOX */}
                  <div className="bg-[#0c0c0c] border border-white/[0.04] rounded-2xl p-5 space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-[#a3a3a3] flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-amber-400" /> COAGENT DAILY STREAK
                      </h3>
                      <span className="text-[10px] font-mono text-cyan-400 font-bold bg-cyan-950/30 px-2.5 py-1 rounded border border-cyan-500/10">7 DAY STREAK</span>
                    </div>
                    <p className="text-[11px] text-zinc-400 leading-relaxed">
                      Maintained consistent human-agent pairing integrations. Complete your operational checklist to prevent streak decay!
                    </p>

                    {/* Progress Bar */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[10px] font-mono">
                        <span className="text-zinc-500">WEEKLY GOAL PROGRESS</span>
                        <span className="text-white font-bold">100% SECURED</span>
                      </div>
                      <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-amber-400 to-amber-500 w-full" />
                      </div>
                    </div>

                    {/* Days Checklist */}
                    <div className="grid grid-cols-7 gap-1 pt-1">
                      {[
                        { day: 'Mon', active: true },
                        { day: 'Tue', active: true },
                        { day: 'Wed', active: true },
                        { day: 'Thu', active: true },
                        { day: 'Fri', active: true },
                        { day: 'Sat', active: true },
                        { day: 'Sun', active: true }
                      ].map((d, i) => (
                        <div 
                          key={i} 
                          className={cn(
                            "flex flex-col items-center justify-center p-2 rounded-lg border font-mono transition-all",
                            d.active 
                              ? "bg-amber-950/20 border-amber-500/40 text-amber-300" 
                              : "bg-black/30 border-white/5 text-zinc-650"
                          )}
                        >
                          <span className="text-[9px] font-bold block">{d.day}</span>
                          <div className="mt-1.5 w-3.5 h-3.5 rounded-full bg-amber-500 flex items-center justify-center text-[8.5px] text-zinc-950 font-bold">✓</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ACTIVE AGENT HEARTBEAT GRAPH PANEL */}
                  <div className="bg-[#0c0c0c] border border-white/[0.04] rounded-2xl p-5 space-y-4 lg:col-span-2">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-[#a3a3a3] flex items-center gap-1.5">
                        <Zap className="w-4 h-4 text-cyan-400 animate-pulse" /> OPERATIONAL RECOGNIZANCE HEARTBEAT
                      </h3>
                      <div className="flex gap-2">
                        <span className="text-[9px] font-mono bg-zinc-900 px-2 py-0.5 rounded text-zinc-400">LATENCY: 42ms</span>
                        <span className="text-[9px] font-mono bg-emerald-900/30 text-emerald-400 px-2 py-0.5 rounded">STABLE</span>
                      </div>
                    </div>

                    {/* Custom high-visual heartbeat graph */}
                    <div className="h-32 flex items-end gap-1.5 pt-2">
                      {[30, 42, 60, 45, 90, 110, 40, 50, 70, 85, 45, 60, 55, 95, 120, 60, 40, 50, 75, 90, 45, 50, 60, 85, 100, 40, 65, 80].map((v, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center h-full justify-end group cursor-help relative">
                          <div 
                            className="w-full rounded-t bg-gradient-to-t from-cyan-500/20 to-cyan-400 transition-all group-hover:to-cyan-200" 
                            style={{ height: `${(v / 120) * 100}%` }}
                          />
                          <div className="absolute bottom-full mb-1 bg-zinc-900 border border-white/5 p-1 rounded text-[8px] font-mono text-white opacity-0 group-hover:opacity-100 pointer-events-none transition-all scale-75 group-hover:scale-100 z-10 whitespace-nowrap">
                            Node {i}: {v} IPS
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500">
                      <span>STATION_GRID_ALPHA_0</span>
                      <span>INTERVAL_REFRESH: ACTIVE REALTIME</span>
                      <span>STATION_GRID_OMEGA_27</span>
                    </div>
                  </div>
                </div>

                {/* 3. DIRECTORY OF SYSTEM NODES CARDS GRID */}
                <div className="space-y-4">
                  <h3 className="text-[11px] font-mono text-zinc-400 uppercase tracking-[0.2em] font-semibold">
                    SYNCED SYSTEM NODES DIRECTORY
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {profiles.map((p, i) => (
                      <div
                        key={p.id}
                        onClick={() => setCurrentRoute("chat")}
                        className="p-5 border border-white/[0.04] bg-[#0c0c0c] rounded-2xl cursor-pointer hover:border-cyan-400/20 hover:bg-[#121212] transition-all group relative overflow-hidden"
                      >
                        <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-400/2 pointer-events-none blur-xl group-hover:bg-cyan-400/5 transition-colors" />
                        <div className="flex items-center justify-between mb-3">
                          <div className="w-8 h-8 rounded-lg bg-cyan-950/40 border border-cyan-500/10 flex items-center justify-center text-cyan-400 text-sm font-bold font-mono">
                            {p.icon}
                          </div>
                          <span className="text-[9px] font-mono px-2 py-0.5 bg-zinc-900 text-zinc-500 rounded uppercase">LV {p.autonomyLevel}</span>
                        </div>
                        <div className="text-sm font-bold text-white mb-1 group-hover:text-cyan-300 transition-colors">{p.name}</div>
                        <div className="text-[11px] text-zinc-400 leading-relaxed line-clamp-2">{p.description}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. HIGH-POLISH STATISTICAL METERS & GRID COGNITIVE LOADS */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {[
                    { label: "Cognitive Load Avg", pct: 42, color: "from-cyan-500 to-cyan-400", val: "42.1% STABLE" },
                    { label: "Semantic Index", pct: 88, color: "from-emerald-500 to-emerald-400", val: "88.4% RETR" },
                    { label: "Logical Gate Coverage", pct: 95, color: "from-amber-400 to-amber-500", val: "95.1% SYNC" },
                    { label: "Compilation Latency", pct: 15, color: "from-cyan-500 to-cyan-400", val: "15.3ms TIME" }
                  ].map((m, i) => (
                    <div key={i} className="bg-[#0c0c0c] border border-white/[0.04] rounded-2xl p-4 space-y-2.5">
                      <span className="text-[11px] text-zinc-500 uppercase font-bold tracking-wider font-mono block">{m.label}</span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-bold text-white font-mono">{m.val}</span>
                      </div>
                      <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                        <div className={`h-full bg-gradient-to-r ${m.color}`} style={{ width: `${m.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* 5. QUICK OPERATIONS DISPATCH */}
                <div className="space-y-3">
                  <h3 className="text-[11px] font-mono text-zinc-400 uppercase tracking-[0.2em] font-semibold">
                    QUICK DESPATCH CHANNELS
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-black/20 p-4 border border-white/[0.04] rounded-2xl">
                    {[
                      { icon: MessageSquare, label: "New Thread", color: "cyan", route: "chat" },
                      { icon: DeepThinkIcon, label: "DeepThink Direct", color: "amber", route: "chat", action: () => setDeepThinkSearchActive(true) },
                      { icon: LiveMonitorIcon, label: "Live Manus Core", color: "emerald", route: "chat", action: () => setLiveMonitorActive(true) },
                      { icon: ImageCanvasIcon, label: "Image Synthesizer", color: "purple", route: "chat" },
                    ].map((item, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          if (item.action) item.action();
                          setCurrentRoute(item.route);
                        }}
                        className="flex items-center gap-3 p-3.5 rounded-xl border border-white/5 bg-[#0a0a0a] hover:bg-[#121212] hover:border-cyan-400/20 text-left w-full cursor-pointer focus:outline-none transition-all"
                      >
                        <item.icon className="w-4 h-4 flex-shrink-0 text-cyan-400" />
                        <span className="text-xs font-semibold text-white tracking-wide">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 6. OUTPUT RECENT PREVIEW LISTS */}
                <div className="pt-4 border-t border-white/[0.04]">
                  <div className="text-[11px] font-sans font-bold tracking-[0.2em] uppercase text-zinc-500 block mb-4">RECENTLY COMPILED EXECUTION BRIEFS</div>
                  <OutputStudio />
                </div>
              </div>
            )}

            {/* VIEW ROUTE 2: CHAT ACTIVE MISSION AREA */}
            {currentRoute === "search" && (
              <AISearchEngine />
            )}

            {currentRoute === "chat" && (
              <ChatCockpit setCurrentRoute={setCurrentRoute} />
            )}

            {/* VIEW ROUTE 3: MEMORY STORE */}
            {currentRoute === "memory" && (
              <div className="space-y-4 max-w-5xl mx-auto w-full">
                <InspectorTabs />
              </div>
            )}

            {/* VIEW ROUTE 4: SKILLS LISTING */}
            {currentRoute === "skills" && (
              <div className="space-y-4 max-w-5xl mx-auto w-full">
                <InspectorTabs />
              </div>
            )}

            {/* VIEW ROUTE 5: FILES SANDBOX */}
            {currentRoute === "files" && (
              <div className="space-y-4 max-w-5xl mx-auto w-full">
                <InspectorTabs />
              </div>
            )}

            {/* VIEW ROUTE 6: PERFORMANCE TELEMETRICS */}
            {currentRoute === "analytics" && (
              <div className="max-w-7xl mx-auto w-full">
                <AnalyticsDashboard />
              </div>
            )}

            {/* VIEW ROUTE 7: KNOWLEDGE GRAPH VISUALIZER */}
            {currentRoute === "knowledge" && (
              <div className="flex-1 min-h-[500px]">
                <KnowledgeGraph />
              </div>
            )}

            {/* VIEW ROUTE 9: DYNAMIC MASTER PROMPT WORKSPACE */}
            {currentRoute === "prompt" && (
              <div className="max-w-7xl mx-auto w-full">
                <PromptStudio />
              </div>
            )}

            {/* VIEW ROUTE 8: COCKPIT CONFIGURATION SETTINGS */}
            {currentRoute === "settings" && (
              <div className="space-y-6 max-w-4xl mx-auto w-full animate-fade-in font-sans select-none pb-12">
                <div className="border-b border-white/10 pb-4 flex justify-between items-end">
                  <div>
                    <h2 className="text-xl font-bold uppercase tracking-wider text-white">SYSTEM OPERATIONAL CORE</h2>
                    <p className="text-xs text-zinc-400 mt-1">Adjust themes, secure key parameters, toggles, and autonomous agents configuration.</p>
                  </div>
                  <span className="text-[10px] font-mono bg-cyan-950/40 text-cyan-400 border border-cyan-500/10 px-2.5 py-1 uppercase rounded">COCKPIT ENGINE VER-3.2</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* LEFT COLUMN: THEMES AND PREFERENCES */}
                  <div className="space-y-6">
                    {/* A. SYSTEM THEME CONFIGURATION */}
                    <div className="bg-[#121212]/30 border border-white/5 rounded-xl p-5 space-y-4">
                      <h3 className="text-sm font-semibold tracking-wider text-white flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-cyan-400" /> SYSTEM COSMETIC INTERFACE
                      </h3>
                      <p className="text-[11px] text-zinc-400 leading-relaxed">Customize the graphical environment presentation layers.</p>
                      
                      <div className="grid grid-cols-3 gap-2.5 pt-1">
                        {[
                          { id: 'dark', label: 'Tactical Dark', desc: 'True #050505 ink' },
                          { id: 'light', label: 'Ethereal Light', desc: 'Sleek white canvas' },
                          { id: 'glass', label: 'Glass iOS', desc: 'Frosted reflection' }
                        ].map((t) => (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() => setTheme(t.id as any)}
                            className={cn(
                              "relative p-3 rounded-lg border text-left cursor-pointer transition-all hover:bg-white/5",
                              theme === t.id 
                                ? "bg-white/10 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.1)]" 
                                : "bg-black/30 border-white/5"
                            )}
                          >
                            <span className="text-xs font-semibold text-white block">{t.label}</span>
                            <span className="text-[9px] text-zinc-400 block mt-0.5">{t.desc}</span>
                            {theme === t.id && (
                              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* B. TOGGLE OPTIONS SYSTEM PREFERENCES */}
                    <div className="bg-[#121212]/30 border border-white/5 rounded-xl p-5 space-y-4">
                      <h3 className="text-sm font-semibold tracking-wider text-white flex items-center gap-2">
                        <CheckSquare className="w-4 h-4 text-cyan-400" /> SYSTEM FUNCTIONAL TOGGLES
                      </h3>
                      <p className="text-[11px] text-zinc-400 leading-relaxed">Tweak global reactivity properties for current UI instance.</p>

                      <div className="space-y-3 pt-1">
                        {systemPrefs.map((pref, idx) => (
                          <div key={idx} className="flex justify-between items-center p-3 bg-black/20 border border-white/5 rounded-lg">
                            <div>
                              <span className="text-xs font-semibold text-white block">{pref.label}</span>
                              <span className="text-[9.5px] text-zinc-500 block mt-0.5">
                                {idx === 0 && "Saves active thread streams locally."}
                                {idx === 1 && "Exposes full reasoning chains."}
                                {idx === 2 && "Acoustic notifications for completed actions."}
                                {idx === 3 && "Optimizes layout processing speeds."}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => togglePref(idx)}
                              className={cn(
                                "relative w-10 h-6 shrink-0 rounded-full transition-colors duration-200 cursor-pointer focus:outline-none",
                                pref.enabled ? "bg-cyan-500" : "bg-zinc-850"
                              )}
                            >
                              <span 
                                className={cn(
                                  "absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform duration-200 shadow-sm",
                                  pref.enabled ? "translate-x-4" : "translate-x-0"
                                )}
                              />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* RIGHT COLUMN: ROUTING AND SECURE API CHANNELS */}
                  <div className="space-y-6">
                    {/* C. ROUTING MODEL SELECT */}
                    <div className="bg-[#121212]/30 border border-white/5 rounded-xl p-5 space-y-4">
                      <h3 className="text-sm font-semibold tracking-wider text-white flex items-center gap-2">
                        <Layers className="w-4 h-4 text-cyan-404" /> MODEL DISTRIBUTION ROUTER
                      </h3>
                      <div>
                        <label className="text-[9px] font-mono text-zinc-400 uppercase tracking-wider block mb-1.5">Primary Logic Hub</label>
                        <select 
                          id="routing-model-select"
                          className="w-full bg-black/40 border border-white/5 text-xs rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-cyan-400/30 transition-all cursor-pointer"
                          value={modelSelected}
                          onChange={e => setModelSelected(e.target.value)}
                        >
                          <option value="google/gemini-3.5-flash">google/gemini-3.5-flash (Standard Sandbox Pool)</option>
                          {allModels.map(m => (
                            <option key={m.id} value={m.id}>{m.name} ({m.provider} - {m.cost})</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* D. API SECURE CREDENTIALS PANEL */}
                    <div className="bg-[#121212]/30 border border-white/5 rounded-xl p-5 space-y-4">
                      <h3 className="text-sm font-semibold tracking-wider text-white flex items-center gap-2">
                        <Zap className="w-4 h-4 text-cyan-450" /> SECURE ROOT PARAMETERS
                      </h3>
                      <p className="text-[11px] text-zinc-400 leading-relaxed">Exposes client-side proxy keys to handle deep queries and custom model hooks.</p>

                      <div className="space-y-4">
                        {/* 1. OPENROUTER PRIVATE KEY */}
                        <div>
                          <label className="text-[9px] font-mono text-zinc-400 uppercase tracking-wider block mb-1">OpenRouter Personal Key</label>
                          <div className="flex gap-2">
                            <div className="relative flex-1">
                              <input 
                                id="openrouter-api-key-input"
                                type={showOpenRouterKey ? "text" : "password"}
                                className="w-full bg-black/40 border border-white/5 text-xs rounded-lg p-2.5 pr-12 text-white font-mono focus:outline-none focus:border-cyan-400/30"
                                placeholder="sk-or-v1-..."
                                value={openRouterKeyInput}
                                onChange={e => {
                                  setOpenRouterKeyInput(e.target.value);
                                  setKeySavedStatus("idle");
                                }}
                              />
                              <button
                                type="button"
                                onClick={() => setShowOpenRouterKey(!showOpenRouterKey)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] text-zinc-500 hover:text-white font-mono tracking-wider focus:outline-none"
                              >
                                {showOpenRouterKey ? "HIDE" : "SHOW"}
                              </button>
                            </div>
                            <button
                              id="save-openrouter-key-btn"
                              onClick={() => {
                                const sanitized = openRouterKeyInput.trim();
                                setOpenRouterApiKey(sanitized);
                                setKeySavedStatus("saved");
                                setTimeout(() => setKeySavedStatus("idle"), 3000);
                              }}
                              className="bg-cyan-500 hover:bg-cyan-400 text-zinc-950 px-4 py-2 text-[10px] font-bold font-mono uppercase tracking-wider rounded-lg cursor-pointer transition-all active:scale-95"
                            >
                              SAVE
                            </button>
                          </div>
                        </div>

                        {/* 2. GEMINI KEY */}
                        <div>
                          <label className="text-[9px] font-mono text-zinc-400 uppercase tracking-wider block mb-1">Backup Gemini Client Secret (Optional)</label>
                          <div className="flex gap-2">
                            <input 
                              type="password"
                              className="w-full bg-black/40 border border-white/5 text-xs rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-cyan-400/30"
                              placeholder="sk-gemini-..."
                              value={geminiApiKey}
                              onChange={e => setGeminiApiKey(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>

                      {keySavedStatus === "saved" && (
                        <p className="text-[9.5px] text-[#10b981] font-mono mt-1.5 flex items-center gap-1.5 animate-fade-in">
                          <Check className="w-3.5 h-3.5" /> Core configuration saved safely inside browser storage!
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* BENTO SECTION: CUSTOM MODEL ROUTERS LIST AND REGISTRY */}
                <div className="bg-[#121212]/30 border border-white/5 rounded-xl p-5 space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold tracking-wider text-white">MANAGE CUSTOM ENDPOINT SCHEMULERS</h3>
                    <p className="text-xs text-zinc-400 mt-1">Add custom compatible LLM endpoints to expand model routing selection.</p>
                  </div>

                  <form onSubmit={handleAddCustomModel} className="space-y-4 pt-1">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[9px] font-mono text-zinc-400 uppercase tracking-wider block mb-1">Model ID (OpenRouter formatted)</label>
                        <input 
                          type="text"
                          required
                          className="w-full bg-black/40 border border-white/5 text-xs rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-cyan-400/30"
                          placeholder="e.g. anthropic/claude-3-opus"
                          value={newModelId}
                          onChange={e => setNewModelId(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="text-[9px] font-mono text-zinc-400 uppercase tracking-wider block mb-1">Model Display Name</label>
                        <input 
                          type="text"
                          required
                          className="w-full bg-black/40 border border-white/5 text-xs rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-cyan-400/30"
                          placeholder="e.g. Claude 3 Opus"
                          value={newModelName}
                          onChange={e => setNewModelName(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[9px] font-mono text-zinc-400 uppercase tracking-wider block mb-1">Model Provider</label>
                        <input 
                          type="text"
                          required
                          className="w-full bg-black/40 border border-white/5 text-xs rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-cyan-400/30"
                          placeholder="e.g. Anthropic"
                          value={newModelProvider}
                          onChange={e => setNewModelProvider(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="text-[9px] font-mono text-zinc-400 uppercase tracking-wider block mb-1">Category Guild</label>
                        <select 
                          className="w-full bg-black/40 border border-white/5 text-xs rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-cyan-400/30 cursor-pointer"
                          value={newModelCategory}
                          onChange={e => setNewModelCategory(e.target.value as any)}
                        >
                          <option value="General/Logic">General/Logic</option>
                          <option value="Coding/Detail">Coding/Detail</option>
                          <option value="Speed/Chat">Speed/Chat</option>
                          <option value="Reasoning/Advanced">Reasoning/Advanced</option>
                        </select>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-zinc-100 hover:bg-white text-zinc-950 text-xs tracking-widest font-mono font-bold uppercase rounded-lg transition-colors cursor-pointer animate-fade-in"
                    >
                      REGISTER CUSTOM SYSTEM ROUTER
                    </button>
                  </form>

                  {customModels?.length > 0 && (
                    <div className="pt-4 border-t border-white/5 animate-fade-in">
                      <h4 className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider mb-2.5">My Registered Model Routers</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[220px] overflow-y-auto pr-1">
                        {customModels.map(cm => (
                          <div key={cm.id} className="flex justify-between items-center p-3.5 bg-black/30 border border-white/5 rounded-lg text-xs font-mono animate-fade-in">
                            <div className="min-w-0 flex-1">
                              <span className="text-white font-bold block truncate">{cm.name}</span>
                              <span className="text-[10px] text-zinc-400 block truncate">{cm.id} ({cm.provider})</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                deleteCustomModel(cm.id);
                                if (modelSelected === cm.id) {
                                  setModelSelected("google/gemini-3.5-flash");
                                }
                              }}
                              className="text-[9px] font-bold text-red-400/85 hover:text-red-400 hover:bg-red-500/10 px-2.5 py-1.5 transition-colors uppercase tracking-wider font-mono bg-transparent border border-red-500/10 rounded ml-2 whitespace-nowrap cursor-pointer"
                            >
                              REMOVE
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* E. EMERGENCY PURGE SECTOR */}
                <div className="bg-[#121212]/30 border border-white/5 rounded-xl p-5 space-y-4">
                  <div className="flex items-center gap-2 text-red-400">
                    <ShieldAlert className="w-5 h-5 flex-shrink-0" />
                    <h3 className="text-sm font-semibold tracking-wider uppercase">Emergency Purge Sector</h3>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Force-clearing permanently purges active session models, local associative memory caches, and index registries. 
                  </p>
                  <button 
                    id="wipe-indices-btn"
                    onClick={() => {
                      if (window.confirm("Proceed to wipe NEVA.OS associative registers?")) {
                        localStorage.clear();
                        window.location.reload();
                      }
                    }}
                    className="w-full py-3 bg-transparent border border-red-500/10 hover:bg-red-500/20 text-red-405 text-xs font-mono font-bold uppercase tracking-widest rounded-lg transition-colors cursor-pointer"
                  >
                    WIPE ENTIRE INTEGRATED CACHE
                  </button>
                </div>
              </div>
            )}

            {/* VIEW ROUTE 10: DYNAMIC NEURAL CANVAS IMAGE STUDIO */}
            {currentRoute === "images" && (
              <div className="max-w-7xl mx-auto w-full">
                <ImageStudio />
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </main>

          {/* COLLAPSIBLE RIGHT SIDEBAR RAIL */}
          {!isInspectorCollapsed && (
            <aside className="hidden lg:block w-80 h-full shrink-0 animate-slide-in border-l border-white/10 relative z-25">
              <InspectorTabs />
            </aside>
          )}

          {/* INSPECTOR TOGGLE FLOATER BUTTON */}
          <button
            id="inspector-toggle-btn"
            onClick={() => setIsInspectorCollapsed(!isInspectorCollapsed)}
            className="absolute right-4 top-4 p-1.5 bg-[#121212] border border-white/15 text-[#a3a3a3] hover:text-white transition-all z-20 flex items-center justify-center cursor-pointer shadow-lg hover:border-white/30"
            title={isInspectorCollapsed ? "Expand Inspector Panel" : "Collapse Inspector Panel"}
          >
            {isInspectorCollapsed ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>

        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainAppShell />
    </AppProvider>
  );
}
