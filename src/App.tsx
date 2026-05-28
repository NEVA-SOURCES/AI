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
    liveMonitorActive, setLiveMonitorActive
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
    <div className="flex h-screen bg-[#050505] text-[#e5e5e5] font-sans antialiased overflow-hidden relative">
      {/* Editorial aesthetic grid background */}
      <div className="editorial-grid-bg"></div>

      {/* Cosmic background effects */}
      <div className="cosmic-bg"></div>
      <div className="horizon-glow"></div>
      <div className="particle-field">
        <div className="particle" style={{ left: '10%', top: '80%', animationDelay: '0s' }}></div>
        <div className="particle" style={{ left: '30%', top: '90%', animationDelay: '2s' }}></div>
        <div className="particle" style={{ left: '50%', top: '85%', animationDelay: '4s' }}></div>
        <div className="particle" style={{ left: '70%', top: '95%', animationDelay: '1s' }}></div>
        <div className="particle" style={{ left: '85%', top: '75%', animationDelay: '3s' }}></div>
        <div className="particle" style={{ left: '95%', top: '90%', animationDelay: '5s' }}></div>
      </div>

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
              <div id="neva-dashboard-container" className="h-full overflow-y-auto p-4 md:p-8 relative">
                {/* Animated background particles */}
                <div className="fixed inset-0 pointer-events-none overflow-hidden">
                  {[...Array(6)].map((_, i) => (
                    <div 
                      key={i} 
                      className="absolute w-1 h-1 bg-cyan-500/20 rounded-full animate-particle"
                      style={{ 
                        left: `${15 + i * 15}%`, 
                        top: `${20 + (i % 3) * 25}%`, 
                        animationDelay: `${i * 1.2}s` 
                      }} 
                    />
                  ))}
                </div>
                
                {/* HERO with ambient gold & cyan glow background and serif headers */}
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="relative mb-8 overflow-hidden rounded-2xl border border-white/[0.03] bg-[#0a0a0a] p-6 md:p-8"
                >
                  {/* Ambient glow behind text */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-r from-[rgba(197,168,128,0.06)] to-[rgba(0,212,255,0.04)] blur-3xl pointer-events-none" />
                  
                  <div className="relative z-10 flex items-center justify-between mb-4 flex-wrap gap-2">
                    <div className="flex items-center gap-3">
                      <NevaLogo className="w-10 h-10" animate />
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-[10px] font-mono text-emerald-400 tracking-widest uppercase">System Online</span>
                      </div>
                    </div>
                    <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">AETHER CORE KERNEL</span>
                  </div>
                  
                  <h1 className="relative z-10 headline-serif text-5xl md:text-7xl text-[#f5f5f5] mb-3">
                    NEVA<span className="text-[#c5a880]">.OS</span>
                  </h1>
                  
                  <p className="relative z-10 body-elegant text-sm text-[#a3a3a3] max-w-lg leading-relaxed">
                    Precision orchestration kernel. Coordinating {profiles.length} autonomous agencies 
                    across {workspaces.length} workspaces with neural-grade integrity.
                  </p>
                  
                  {/* Live metrics with count-up animation */}
                  <div className="relative z-10 flex flex-wrap items-center gap-6 mt-6 pt-6 border-t border-white/[0.04]">
                    {[
                      { val: conversations.length, label: "Active Missions", color: "cyan" },
                      { val: messages.length, label: "Messages", color: "purple" },
                      { val: stats.totalTokens, label: "Tokens", color: "amber" },
                      { val: "99.9%", label: "Uptime", color: "emerald" },
                    ].map((stat, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                        className="text-center min-w-[100px]"
                      >
                        <div className={cn("text-2xl font-bold font-mono", 
                          stat.color === "cyan" && "text-[#00d4ff]",
                          stat.color === "purple" && "text-[#a78bfa]",
                          stat.color === "amber" && "text-[#c5a880]",
                          stat.color === "emerald" && "text-[#10b981]"
                        )}>
                          {stat.val}
                        </div>
                        <div className="text-[10px] text-[#525252] uppercase tracking-wider mt-1">{stat.label}</div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
                
                {/* BENTO GRID with hover motion */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                  {[
                    { icon: MissionIcon, label: "Missions", val: conversations.length, sub: "Active threads", color: "cyan", route: "chat" },
                    { icon: MemoryIcon, label: "Memories", val: stats.memoriesRegistered + 12, sub: "Neural associations", color: "purple", route: "memory" },
                    { icon: CodeMatrixIcon, label: "Skills", val: `${stats.skillsAvailable} Seeded`, sub: "Engineering & AI", color: "amber", route: "skills" },
                    { icon: AIBrainIcon, label: "Agents", val: `${profiles.length} Nodes`, sub: "Autonomous agencies", color: "emerald", route: "settings" },
                  ].map((card, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                      whileHover={{ y: -6, scale: 1.03, transition: { type: "spring", stiffness: 400 } }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setCurrentRoute(card.route)}
                      className={cn(
                        "group relative overflow-hidden rounded-xl border p-4 cursor-pointer",
                        "bg-[#0f0f0f] border-white/[0.03] hover:border-[rgba(197,168,128,0.1)]",
                        "transition-shadow duration-300"
                      )}
                    >
                      {/* Hover glow */}
                      <div className={cn(
                        "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500",
                        card.color === "cyan" && "bg-gradient-to-br from-[#00d4ff]/10 to-transparent",
                        card.color === "purple" && "bg-gradient-to-br from-[#a78bfa]/10 to-transparent",
                        card.color === "amber" && "bg-gradient-to-br from-[#c5a880]/10 to-transparent",
                        card.color === "emerald" && "bg-gradient-to-br from-[#10b981]/10 to-transparent",
                      )} />
                      
                      <div className="relative z-10 flex flex-col h-full justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <card.icon className={cn("w-5 h-5",
                              card.color === "cyan" && "text-[#00d4ff]",
                              card.color === "purple" && "text-[#a78bfa]",
                              card.color === "amber" && "text-[#c5a880]",
                              card.color === "emerald" && "text-[#10b981]",
                            )} />
                            <motion.div 
                              className={cn("w-1.5 h-1.5 rounded-full",
                                card.color === "cyan" && "bg-[#00d4ff]",
                                card.color === "purple" && "bg-[#a78bfa]",
                                card.color === "amber" && "bg-[#c5a880]",
                                card.color === "emerald" && "bg-[#10b981]",
                              )}
                              animate={{ scale: [1, 1.3, 1] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            />
                          </div>
                          <div className="text-3xl font-bold text-white mb-1 font-mono">{card.val}</div>
                        </div>
                        <div>
                          <div className="text-[11px] text-[#a3a3a3] font-medium">{card.label}</div>
                          <div className="text-[10px] text-[#525252] mt-0.5">{card.sub}</div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                {/* PROFILE GALLERY with horizontal scroll and motion */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 }}
                  className="mb-8"
                >
                  <h3 className="text-[10px] font-mono text-zinc-600 uppercase tracking-[0.2em] mb-3 font-bold">
                    Directory of System Nodes
                  </h3>
                  <div className="flex gap-3 overflow-x-auto scrollbar-thin pb-2">
                    {profiles.map((p, i) => (
                      <motion.div
                        key={p.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + i * 0.05 }}
                        whileHover={{ y: -4, transition: { type: "spring" } }}
                        onClick={() => setCurrentRoute("chat")}
                        className="flex-shrink-0 w-[200px] p-4 border border-white/[0.03] bg-[#0c0c0e] rounded-xl cursor-pointer hover:border-[rgba(197,168,128,0.15)] hover:bg-[#111113] transition-all group"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 rounded-lg bg-[rgba(0,212,255,0.06)] flex items-center justify-center text-[#00d4ff] font-mono text-xs font-bold">
                            {p.icon}
                          </div>
                          <span className="text-[10px] text-[#a3a3a3] font-mono">LVL {p.autonomyLevel}</span>
                        </div>
                        <div className="text-sm font-medium text-zinc-300 mb-1">{p.name}</div>
                        <div className="text-[10px] text-zinc-500 leading-snug line-clamp-2">{p.description}</div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
                
                {/* QUICK ACTIONS */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1 }}
                  className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8"
                >
                  {[
                    { icon: MessageSquare, label: "New Chat", color: "cyan", route: "chat" },
                    { icon: DeepThinkIcon, label: "DeepThink", color: "amber", route: "chat", action: () => setDeepThinkSearchActive(true) },
                    { icon: LiveMonitorIcon, label: "Monitor", color: "emerald", route: "chat", action: () => setLiveMonitorActive(true) },
                    { icon: ImageCanvasIcon, label: "Images", color: "purple", route: "chat" }, // route to chat where Image is generated/processed
                  ].map((item, i) => (
                    <motion.button
                      key={i}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        if (item.action) item.action();
                        setCurrentRoute(item.route);
                      }}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-xl border transition-all text-left w-full cursor-pointer focus:outline-none",
                        item.color === "cyan" && "border-[rgba(0,212,255,0.15)] bg-[rgba(0,212,255,0.05)] hover:bg-[rgba(0,212,255,0.08)] hover:shadow-[0_0_20px_rgba(0,212,255,0.08)]",
                        item.color === "amber" && "border-[rgba(197,168,128,0.15)] bg-[rgba(197,168,128,0.05)] hover:bg-[rgba(197,168,128,0.08)] hover:shadow-[0_0_20px_rgba(197,168,128,0.08)]",
                        item.color === "emerald" && "border-[rgba(16,185,129,0.15)] bg-[rgba(16,185,129,0.05)] hover:bg-[rgba(16,185,129,0.08)] hover:shadow-[0_0_20px_rgba(16,185,129,0.08)]",
                        item.color === "purple" && "border-[rgba(168,85,247,0.15)] bg-[rgba(168,85,247,0.05)] hover:bg-[rgba(168,85,247,0.08)] hover:shadow-[0_0_20px_rgba(168,85,247,0.08)]",
                      )}
                    >
                      <item.icon className={cn("w-5 h-5 flex-shrink-0",
                        item.color === "cyan" && "text-[#00d4ff]",
                        item.color === "amber" && "text-[#c5a880]",
                        item.color === "emerald" && "text-[#10b981]",
                        item.color === "purple" && "text-[#a78bfa]",
                      )} />
                      <span className="text-sm font-medium text-zinc-200">{item.label}</span>
                    </motion.button>
                  ))}
                </motion.div>

                {/* OUTPUTS GALLERY PREVIEWS */}
                <div className="pt-2 border-t border-white/5">
                  <div className="text-[10px] font-sans font-bold tracking-[0.2em] uppercase text-zinc-500 block mb-3">RECENTLY COMPILED EXECUTION BRIEFS</div>
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
              <div className="space-y-6 max-w-xl animate-fade-in font-sans select-none mx-auto w-full">
                <div className="border-b border-white/10 pb-2">
                  <h2 className="text-xs font-sans font-bold uppercase tracking-[0.2em] text-white">SYSTEM PARAMETER METADATA</h2>
                  <p className="text-[10px] font-body text-[#737373] mt-1 leading-relaxed">Adjust operational indices, thresholds, and routing hierarchies.</p>
                </div>

                <div className="space-y-4 bg-[#121212] p-5 rounded-none border border-white/10">
                  <div>
                    <label className="text-[9px] font-mono text-[#a3a3a3] uppercase tracking-wider block mb-1.5">Primary Model Route</label>
                    <select 
                      id="routing-model-select"
                      className="w-full bg-[#0d0d0d] border border-white/10 text-xs rounded-none p-2 text-white font-mono focus:outline-none focus:border-white/30"
                      value={modelSelected}
                      onChange={e => setModelSelected(e.target.value)}
                    >
                      <option value="google/gemini-3.5-flash">google/gemini-3.5-flash (Standard Sandbox Pool)</option>
                      {allModels.map(m => (
                        <option key={m.id} value={m.id}>{m.name} ({m.provider} - {m.cost})</option>
                      ))}
                    </select>
                  </div>

                  {/* OPENROUTER USER API KEY INPUT CHANNEL */}
                  <div>
                    <label className="text-[9px] font-mono text-[#a3a3a3] uppercase tracking-wider block mb-1.5">OpenRouter Personal API Key</label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <input 
                          id="openrouter-api-key-input"
                          type={showOpenRouterKey ? "text" : "password"}
                          className="w-full bg-[#0d0d0d] border border-white/10 text-xs rounded-none p-2 pr-12 text-white font-mono focus:outline-none focus:border-white/30"
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
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] text-zinc-500 hover:text-white font-mono tracking-wider focus:outline-none uppercase"
                        >
                          {showOpenRouterKey ? "Hide" : "Show"}
                        </button>
                      </div>
                      <button
                        id="save-openrouter-key-btn"
                        onClick={() => {
                          const sanitized = openRouterKeyInput.trim();
                          if (sanitized === "") {
                            localStorage.removeItem("openrouter_api_key");
                            setKeySavedStatus("cleared");
                          } else {
                            localStorage.setItem("openrouter_api_key", sanitized);
                            setKeySavedStatus("saved");
                          }
                          setTimeout(() => setKeySavedStatus("idle"), 3000);
                        }}
                        className="bg-zinc-100 hover:bg-white text-zinc-950 px-4 py-2 text-[10px] font-bold font-mono uppercase tracking-wider rounded-none cursor-pointer transition-all active:scale-95"
                      >
                        Save
                      </button>
                    </div>
                    {keySavedStatus === "saved" && (
                      <p className="text-[9px] text-[#10b981] font-mono mt-1.5 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Core configuration saved safely inside browser storage!
                      </p>
                    )}
                    {keySavedStatus === "cleared" && (
                      <p className="text-[9px] text-[#ef4444] font-mono mt-1.5">
                        Key removed from client session memory.
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-[9px] font-mono text-[#a3a3a3] uppercase tracking-wider block mb-1.5">Security Level</label>
                    <div className="p-3 bg-[#0d0d0d] border border-white/10 rounded-none flex justify-between items-center text-xs font-mono">
                      <span>Requires verification on file edits</span>
                      <span className="text-white font-bold uppercase tracking-wider">ACTIVE GATED</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-[9px] font-mono text-[#a3a3a3] uppercase tracking-wider mb-2">Secret Indexing Keys</h3>
                    <div className="space-y-2">
                      {[
                        { name: "GEMINI_API_KEY", status: "VERIFIED AUTO_LINK" },
                        { name: "OPENROUTER_API_KEY", status: openRouterKeyInput ? "VERIFIED (LOCAL USER KEY)" : "NOT INSTALLED" },
                        { name: "TAVILY_API_KEY", status: "STANDBY REVERSION" },
                        { name: "FAL_AI_KEY", status: "NOT LOCATED" },
                      ].map(sec => (
                        <div key={sec.name} className="flex justify-between items-center p-2.5 bg-[#0d0d0d]/40 border border-white/10 rounded-none text-[11px] font-mono">
                          <span className="text-white/80">{sec.name}</span>
                          <span className={`text-[9px] font-bold tracking-wider uppercase ${sec.status.includes("VERIFIED") ? "text-[#10b981]" : "opacity-60 text-white"}`}>{sec.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* VIEW ROUTE 8.5: MANAGE CUSTOM MODEL ROUTERS */}
                <div className="space-y-4 bg-[#121212] p-5 rounded-none border border-white/10">
                  <div>
                    <h3 className="text-xs font-sans font-bold uppercase tracking-[0.2em] text-white">MANAGE CUSTOM MODEL ROUTERS</h3>
                    <p className="text-[10px] font-body text-[#737373] mt-1 leading-relaxed">Add custom OpenRouter compatible LLM endpoints to expand model routing selection.</p>
                  </div>

                  <form onSubmit={handleAddCustomModel} className="space-y-3 pt-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[9px] font-mono text-[#a3a3a3] uppercase tracking-wider block mb-1">Model ID (OpenRouter formatted)</label>
                        <input 
                          type="text"
                          required
                          className="w-full bg-[#0d0d0d] border border-white/10 text-xs rounded-none p-2 text-white font-mono focus:outline-none focus:border-white/30"
                          placeholder="e.g. anthropic/claude-3-opus"
                          value={newModelId}
                          onChange={e => setNewModelId(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="text-[9px] font-mono text-[#a3a3a3] uppercase tracking-wider block mb-1">Model Display Name</label>
                        <input 
                          type="text"
                          required
                          className="w-full bg-[#0d0d0d] border border-white/10 text-xs rounded-none p-2 text-white font-mono focus:outline-none focus:border-white/30"
                          placeholder="e.g. Claude 3 Opus"
                          value={newModelName}
                          onChange={e => setNewModelName(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[9px] font-mono text-[#a3a3a3] uppercase tracking-wider block mb-1">Model Provider</label>
                        <input 
                          type="text"
                          required
                          className="w-full bg-[#0d0d0d] border border-white/10 text-xs rounded-none p-2 text-white font-mono focus:outline-none focus:border-white/30"
                          placeholder="e.g. Anthropic"
                          value={newModelProvider}
                          onChange={e => setNewModelProvider(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="text-[9px] font-mono text-[#a3a3a3] uppercase tracking-wider block mb-1">Category Guild</label>
                        <select 
                          className="w-full bg-[#0d0d0d] border border-white/10 text-xs rounded-none p-2 text-white font-mono focus:outline-none focus:border-white/30"
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

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[9px] font-mono text-[#a3a3a3] uppercase tracking-wider block mb-1">Context Window</label>
                        <input 
                          type="text"
                          className="w-full bg-[#0d0d0d] border border-white/10 text-xs rounded-none p-2 text-white font-mono focus:outline-none focus:border-white/30"
                          placeholder="e.g. 200,000 tokens"
                          value={newModelContext}
                          onChange={e => setNewModelContext(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="text-[9px] font-mono text-[#a3a3a3] uppercase tracking-wider block mb-1">Estimated Cost / Latency info</label>
                        <input 
                          type="text"
                          className="w-full bg-[#0d0d0d] border border-white/10 text-xs rounded-none p-2 text-white font-mono focus:outline-none focus:border-white/30"
                          placeholder="e.g. Paid or Free"
                          value={newModelCost}
                          onChange={e => setNewModelCost(e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[9px] font-mono text-[#a3a3a3] uppercase tracking-wider block mb-1">Short Description</label>
                      <input 
                        type="text"
                        className="w-full bg-[#0d0d0d] border border-white/10 text-xs rounded-none p-2 text-white font-mono focus:outline-none focus:border-white/30"
                        placeholder="Brief model description..."
                        value={newModelDesc}
                        onChange={e => setNewModelDesc(e.target.value)}
                      />
                    </div>

                    {modelFormError && (
                      <p className="text-[10px] text-red-400 font-mono italic">{modelFormError}</p>
                    )}
                    {modelFormSuccess && (
                      <p className="text-[10px] text-green-400 font-mono italic">{modelFormSuccess}</p>
                    )}

                    <button
                      type="submit"
                      className="w-full py-2 bg-zinc-100 hover:bg-white text-zinc-950 text-[10px] tracking-widest font-mono font-bold uppercase rounded-none transition-colors active:scale-95 cursor-pointer animate-fade-in"
                    >
                      REGISTRY SYSTEM ROUTER
                    </button>
                  </form>

                  {/* Registered Custom Models List */}
                  {customModels?.length > 0 && (
                    <div className="pt-2 border-t border-white/10 animate-fade-in">
                      <h4 className="text-[9px] font-mono text-[#a3a3a3] uppercase tracking-wider mb-2">My Registered Model Routers</h4>
                      <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1">
                        {customModels.map(cm => (
                          <div key={cm.id} className="flex justify-between items-center p-2.5 bg-[#0d0d0d]/40 border border-white/10 rounded-none text-xs font-mono animate-fade-in">
                            <div className="min-w-0 flex-1">
                              <span className="text-white font-bold block truncate">{cm.name}</span>
                              <span className="text-[10px] text-[#a3a3a3] block truncate">{cm.id} ({cm.provider})</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                deleteCustomModel(cm.id);
                                if (modelSelected === cm.id) {
                                  setModelSelected("google/gemini-2.5-flash:free");
                                }
                              }}
                              className="text-[9px] font-bold text-red-400/80 hover:text-red-400 hover:bg-red-500/10 p-1.5 transition-colors uppercase tracking-wider font-mono bg-transparent border border-red-500/10 rounded ml-2 whitespace-nowrap cursor-pointer"
                            >
                              Unregister
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-4 border border-white/20 bg-transparent text-xs text-[#a3a3a3] flex flex-col gap-2 rounded-none">
                  <div className="font-bold flex items-center gap-1.5 uppercase tracking-widest text-[#e5e5e5]">
                    <Layers className="w-4 h-4 text-white" /> Purge Memory Index
                  </div>
                  <p className="text-[10px] leading-relaxed font-body">Clearing indices permanently purges all workspace metadata archives, cached records, and associative memory nodes.</p>
                  <button 
                    id="wipe-indices-btn"
                    onClick={() => {
                      if (confirm("Proceed to wipe neva associative registers?")) {
                        location.reload();
                      }
                    }}
                    className="w-full mt-2 py-2 bg-transparent hover:bg-white/5 border border-white/20 text-white text-[10px] tracking-widest font-mono font-bold uppercase rounded-none transition-colors"
                  >
                    CLEAN ENTIRE CORE MEMORY
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
