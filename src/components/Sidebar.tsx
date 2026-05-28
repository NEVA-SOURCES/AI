import { useState } from "react";
import { useApp } from "../AppContext";
import { 
  Plus, ChevronDown, ChevronRight, Terminal, Radio, 
  BarChart2, FolderOpen, ShieldCheck, Database, Award, 
  History, Settings, Cpu, FileText, LayoutDashboard, Share2,
  Trash2, Pencil, Check, X, Sparkles, Image, Brain, Search
} from "lucide-react";

// === MOTION === Hand-crafted SVGs and animations
import { motion } from "motion/react";
import { NevaLogo, MissionIcon, MemoryIcon, CodeMatrixIcon, AIBrainIcon, DeepThinkIcon, LiveMonitorIcon, ImageCanvasIcon } from "./icons/NevaIcons";

// Local classnames utility for conditional Tailwind classes
function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Sidebar({ 
  onNavigate,
  onClose
}: { 
  onNavigate: (route: string) => void;
  onClose?: () => void;
}) {
  const { 
    workspaces, 
    activeWorkspace, 
    switchWorkspace, 
    conversations, 
    activeConversation, 
    switchConversation, 
    createMission,
    renameConversation,
    deleteConversation,
    projects,
    deepThinkSearchActive,
    setDeepThinkSearchActive
  } = useApp();

  const [workspaceDropdownOpen, setWorkspaceDropdownOpen] = useState(false);
  const [projectsCollapsed, setProjectsCollapsed] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [editingConvId, setEditingConvId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");

  const submitNewMission = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const title = newTitle.trim() || `Mission_${Math.random().toString(36).substring(7).toUpperCase()}`;
    await createMission(title, "chat");
    setNewTitle("");
    setIsCreating(false);
    onNavigate("chat");
  };

  const submitRename = async (id: string) => {
    if (editingTitle.trim()) {
      await renameConversation(id, editingTitle.trim());
    }
    setEditingConvId(null);
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to permanently delete this chat session?")) {
      await deleteConversation(id);
    }
  };

  return (
    <div className="w-60 h-full bg-[#050505] border-r border-white/[0.04] flex flex-col justify-between font-sans select-none overflow-y-auto scrollbar-thin">
      {/* BRAND & WORKSPACE HEAD */}
      <div>
        <div className="p-4 flex items-center justify-between border-b border-white/[0.04] bg-[#0a0a0a]/40 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <motion.div 
              whileHover={{ rotate: 90, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
              className="w-8 h-8 rounded-lg border border-[rgba(0,212,255,0.15)] flex items-center justify-center bg-[rgba(0,212,255,0.05)] relative shrink-0 cursor-pointer"
            >
              <NevaLogo className="w-6 h-6" animate />
              <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-[#00d4ff] glow-pulse-cyan"></span>
            </motion.div>
            <div>
              <div className="text-xs tracking-[0.2em] font-sans font-bold text-zinc-100 uppercase flex items-center gap-1 leading-none">
                NEVA.OS <span className="text-[8px] font-mono opacity-80 text-[#00d4ff] bg-[#00d4ff]/15 border border-[#00d4ff]/10 px-1 rounded animate-pulse font-extrabold">V01</span>
              </div>
              <div className="text-[9px] font-mono text-zinc-500 mt-1 uppercase tracking-[0.1em]">PRECISION ARCHIVE</div>
            </div>
          </div>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="md:hidden text-zinc-500 hover:text-white p-1 hover:bg-[#0f0f0f] rounded-lg transition-all cursor-pointer"
              title="Close Panel"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* WORKSPACE SELECTOR */}
        <div className="p-3 relative">
          <button 
            id="workspace-selector-btn"
            onClick={() => setWorkspaceDropdownOpen(!workspaceDropdownOpen)}
            className="w-full flex items-center justify-between p-2 rounded-xl bg-[#0a0a0a] border border-white/[0.04] hover:border-[rgba(197,168,128,0.15)] text-left transition-all duration-200"
          >
            <div className="flex items-center gap-2">
              <span className="text-xs p-1 bg-[#111111] border border-white/[0.03] rounded">{activeWorkspace?.icon || "⚡"}</span>
              <span className="text-[11px] font-medium text-zinc-200 truncate max-w-[120px]">{activeWorkspace?.name}</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
          </button>

          {workspaceDropdownOpen && (
            <div className="absolute top-12 left-3 right-3 bg-[#0a0a0a] border border-white/[0.04] rounded-xl shadow-2xl z-50 p-1.5 backdrop-blur-xl animate-fade-in">
              <div className="text-[8px] uppercase font-mono text-zinc-500 px-2 py-1 tracking-widest border-b border-zinc-900 mb-1">Switch System Node</div>
              {workspaces.map(w => (
                <button
                  key={w.id}
                  onClick={() => {
                    switchWorkspace(w.id);
                    setWorkspaceDropdownOpen(false);
                  }}
                  className={`w-full text-left px-2 py-1.5 rounded-lg text-[11px] transition-colors flex items-center gap-2 ${
                    activeWorkspace?.id === w.id 
                      ? "bg-[rgba(197,168,128,0.08)] text-[#c5a880] font-bold border border-[rgba(197,168,128,0.15)]" 
                      : "hover:bg-[rgba(255,255,255,0.02)] text-[#525252] hover:text-[#a3a3a3]"
                  }`}
                >
                  <span>{w.icon}</span>
                  <span className="truncate">{w.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* CONTROLS NEW MISSION */}
        <div className="px-3 pb-2">
          {!isCreating ? (
            <button 
              id="new-mission-btn"
              onClick={() => setIsCreating(true)}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-gradient-to-r from-[rgba(197,168,128,0.12)] via-transparent to-transparent border border-[rgba(197,168,128,0.2)] hover:border-[rgba(197,168,128,0.45)] text-[10px] font-sans font-bold uppercase tracking-[0.15em] text-[#c5a880] shadow-sm hover:shadow-[0_0_15px_rgba(197,168,128,0.12)] transition-all duration-300 hover:bg-[rgba(197,168,128,0.06)] cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-[#c5a880]" />
              New Chat Session
            </button>
          ) : (
            <form onSubmit={submitNewMission} className="space-y-2.5 p-3.5 bg-[#0a0a0a] border border-white/[0.04] rounded-xl shadow-xl animate-fade-in">
              <div className="text-[8px] font-mono text-zinc-500 uppercase tracking-wider font-bold">New Mission Name</div>
              <input
                id="new-chat-input"
                autoFocus
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Cognitive Debugger"
                className="w-full bg-[#111111] border border-white/[0.05] rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-[rgba(197,168,128,0.3)] font-mono transition-all"
              />
              <div className="flex items-center gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreating(false);
                    setNewTitle("");
                  }}
                  className="px-2 py-1 text-[9px] uppercase font-mono text-zinc-500 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 text-[9px] uppercase font-mono bg-[#c5a880] hover:bg-[#d6bc98] text-black font-bold transition-all rounded-md shadow-md active:scale-95"
                >
                  Launch
                </button>
              </div>
            </form>
          )}
        </div>

        {/* NAVIGATION LINKS */}
        <div className="px-2 py-2 text-[#a3a3a3]">
          <div className="text-[10px] text-[#404040] tracking-[0.2em] uppercase px-3 py-1.5 border-b border-white/[0.03] mb-1.5 font-bold">SYSTEM CONTROLS</div>

          <motion.button 
            whileHover={{ x: 4, backgroundColor: "rgba(255,255,255,0.02)" }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onNavigate("dashboard")} 
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[11px] transition-all text-left text-zinc-400 hover:text-zinc-100 group cursor-pointer"
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-zinc-500 group-hover:text-[#00d4ff] transition-colors" />
            <span className="font-medium">OS Dashboard</span>
          </motion.button>

          <motion.button 
            whileHover={{ x: 4, backgroundColor: "rgba(255,255,255,0.02)" }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onNavigate("chat")} 
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[11px] transition-all text-left text-zinc-400 hover:text-zinc-100 group cursor-pointer"
          >
            <Radio className="w-3.5 h-3.5 text-zinc-500 group-hover:text-emerald-400 transition-colors" />
            <span className="font-medium">Active Mission</span>
          </motion.button>

          <motion.button 
            whileHover={{ x: 4, backgroundColor: "rgba(255,255,255,0.02)" }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onNavigate("prompt")} 
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[11px] transition-all text-left text-zinc-400 hover:text-zinc-100 group cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#c5a880] group-hover:animate-pulse" />
            <span className="font-medium text-zinc-200 group-hover:text-zinc-100 font-bold">Prompt Architect</span>
            <span className="text-[8px] font-mono bg-[rgba(197,168,128,0.15)] text-[#c5a880] border border-[rgba(197,168,128,0.2)] px-1.5 py-0.2 rounded font-extrabold ml-auto">PRO</span>
          </motion.button>

          <motion.button 
            id="nav-images-btn"
            whileHover={{ x: 4, backgroundColor: "rgba(255,255,255,0.02)" }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onNavigate("images")} 
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[11px] transition-all text-left text-zinc-400 hover:text-zinc-100 group cursor-pointer"
          >
            <Image className="w-3.5 h-3.5 text-orange-400 group-hover:animate-bounce" />
            <span className="font-medium text-zinc-200 group-hover:text-zinc-100">Image Studio</span>
            <span className="text-[8px] font-mono bg-orange-500/10 text-orange-400 border border-orange-500/10 px-1.5 py-0.2 rounded font-bold ml-auto flex items-center gap-1">NEW</span>
          </motion.button>

          {/* COGNITIVE VECTORS SECTION */}
          <div className="mt-6 border-t border-zinc-900 pt-4">
            <div className="px-3 mb-2 text-[10px] font-medium text-zinc-650 tracking-[0.15em] uppercase font-mono">
              Cognitive Vectors
            </div>
            
            {/* AI DeepThink Search */}
            <button
              onClick={() => {
                setDeepThinkSearchActive(true);
                onNavigate("chat");
                // Create a new DeepThink conversation if none active
                if (!activeConversation || activeConversation.title !== "DeepThink Search") {
                  createMission("DeepThink Search", "research");
                }
              }}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all group border",
                deepThinkSearchActive 
                  ? "bg-amber-950/20 border-amber-500/20 text-amber-300"
                  : "hover:bg-zinc-900/50 text-zinc-450 hover:text-zinc-200 border-transparent bg-zinc-950/20"
              )}
            >
              <div className={cn(
                "w-9 h-9 rounded-lg flex items-center justify-center transition-all shrink-0",
                deepThinkSearchActive ? "bg-amber-500/15" : "bg-[#090a10] group-hover:bg-zinc-800"
              )}>
                <Search size={18} className={deepThinkSearchActive ? "text-amber-400" : "text-zinc-500"} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[12px] sm:text-[13px] font-semibold leading-normal">AI DeepThink Search</div>
                <div className="text-[10px] text-zinc-600 truncate mt-0.5 font-medium">Multi-step web research</div>
              </div>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/25 shrink-0 font-extrabold select-none">
                PRO
              </span>
            </button>
          </div>

          {/* MISSIONS RECENT LIST */}
          <div className="mt-4">
            <div className="text-[9px] uppercase font-mono text-zinc-600 px-3 py-1 tracking-[0.2em] flex items-center justify-between font-bold">
              <span>ARCHIVES INDEX</span>
              <span className="text-[8px] bg-zinc-900 text-zinc-400 border border-zinc-850 px-1.5 py-0.2 rounded font-mono">{conversations.length}</span>
            </div>
            <div className="max-h-[220px] overflow-y-auto mt-2 space-y-0.5 px-0.5 scrollbar-thin">
              {conversations.map(conv => {
                const isActive = activeConversation?.id === conv.id;
                const isEditing = editingConvId === conv.id;

                if (isEditing) {
                  return (
                    <div key={conv.id} className="px-2 py-1 bg-zinc-950 rounded-lg flex items-center gap-1.5 mx-1 border border-zinc-800 animate-fade-in">
                      <input
                        type="text"
                        autoFocus
                        value={editingTitle}
                        onChange={(e) => setEditingTitle(e.target.value)}
                        onBlur={() => submitRename(conv.id)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") submitRename(conv.id);
                          if (e.key === "Escape") setEditingConvId(null);
                        }}
                        className="flex-1 bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-[11px] text-white font-mono focus:outline-none focus:border-cyan-500/30"
                      />
                      <button
                        onClick={() => submitRename(conv.id)}
                        className="text-zinc-400 hover:text-white transition-colors p-0.5"
                        title="Save"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setEditingConvId(null)}
                        className="text-zinc-500 hover:text-rose-400 transition-colors p-0.5"
                        title="Cancel"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                }

                return (
                  <div
                    key={conv.id}
                    onClick={() => {
                      switchConversation(conv.id);
                      onNavigate("chat");
                    }}
                    className={`group w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11px] text-left transition-all cursor-pointer border ${
                      isActive 
                        ? "bg-cyan-950/20 text-cyan-300 font-medium border-cyan-500/20" 
                        : "hover:bg-zinc-900/50 text-zinc-500 hover:text-zinc-300 border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate flex-1 min-w-0 mr-1">
                      <span className={`w-1.5 h-1.5 rounded-full inline-block shrink-0 ${isActive ? "bg-cyan-400 glow-pulse-cyan" : "bg-zinc-700"}`}></span>
                      <span className="truncate" title={conv.title}>{conv.title}</span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {/* ACTION CONTROLS */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingConvId(conv.id);
                          setEditingTitle(conv.title);
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-zinc-500 hover:text-white p-0.5"
                        title="Rename Chat"
                      >
                        <Pencil className="w-3 h-3" />
                      </button>
                      
                      <button
                        onClick={(e) => handleDelete(e, conv.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-zinc-600 hover:text-rose-400 p-0.5"
                        title="Delete Chat"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>

                      <span className="text-[8px] opacity-40 font-mono uppercase group-hover:hidden transition-all">
                        {conv.mode.toUpperCase()}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* COLLAPSIBLE PROJECTS LIST */}
          <div className="mt-4">
            <button 
              onClick={() => setProjectsCollapsed(!projectsCollapsed)}
              className="w-full text-[9px] uppercase font-mono text-[#737373] px-3 py-1 tracking-[0.2em] flex items-center justify-between hover:text-white/60"
            >
              <span>OPERATIONAL GROUPS</span>
              {projectsCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
            {!projectsCollapsed && (
              <div className="mt-1 space-y-0.5 px-1">
                {projects.map(proj => (
                  <div 
                    key={proj.id} 
                    className="flex items-center justify-between px-2.5 py-1 text-[11px] text-[#a3a3a3] hover:text-white transition-colors"
                  >
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="text-[9px]">▪</span>
                      <span className="truncate">{proj.name}</span>
                    </div>
                    {proj.pinned && <span className="text-[9px] text-[#c5a880]">✦</span>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CORE LIBRARY BOTTOM */}
      <div className="px-2 py-3 border-t border-zinc-850/60 bg-[#08080a]">
        <div className="text-[9px] uppercase font-mono text-zinc-650 px-3 py-1.5 tracking-[0.2em] border-b border-zinc-900 mb-1.5 font-bold">REGISTRIES LOG</div>
        
        <button 
          onClick={() => onNavigate("memory")} 
          className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-[11px] transition-all hover:bg-zinc-900 text-left text-zinc-400 hover:text-zinc-100 group cursor-pointer"
        >
          <Database className="w-3.5 h-3.5 text-zinc-600 group-hover:text-cyan-400 transition-colors" />
          <span className="font-medium">Memories Store</span>
        </button>

        <button 
          onClick={() => onNavigate("skills")} 
          className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-[11px] transition-all hover:bg-zinc-900 text-left text-zinc-400 hover:text-zinc-100 group cursor-pointer"
        >
          <Award className="w-3.5 h-3.5 text-zinc-600 group-hover:text-cyan-400 transition-colors" />
          <span className="font-medium">Skills Register</span>
        </button>

        <button 
          onClick={() => onNavigate("files")} 
          className="w-full flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] transition-all hover:bg-zinc-900 text-left text-zinc-400 hover:text-zinc-100 group cursor-pointer"
        >
          <FolderOpen className="w-3.5 h-3.5 text-zinc-600 group-hover:text-cyan-400 transition-colors" />
          <span className="font-medium">Files Sandbox</span>
        </button>

        <button 
          onClick={() => onNavigate("analytics")} 
          className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-[11px] transition-all hover:bg-zinc-900 text-left text-zinc-400 hover:text-zinc-100 group cursor-pointer"
        >
          <BarChart2 className="w-3.5 h-3.5 text-zinc-600 group-hover:text-cyan-400 transition-colors" />
          <span className="font-medium">System Telemetry</span>
        </button>

        <button 
          onClick={() => onNavigate("knowledge")} 
          className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-[11px] transition-all hover:bg-zinc-900 text-left text-zinc-400 hover:text-zinc-100 group cursor-pointer"
        >
          <Cpu className="w-3.5 h-3.5 text-zinc-600 group-hover:text-cyan-400 transition-colors" />
          <span className="font-medium">Knowledge Graph</span>
        </button>

        <button 
          onClick={() => onNavigate("settings")} 
          className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-[11px] transition-all hover:bg-zinc-900 text-left text-zinc-400 hover:text-zinc-100 group cursor-pointer"
        >
          <Settings className="w-3.5 h-3.5 text-zinc-600 group-hover:text-cyan-400 transition-colors" />
          <span className="font-medium">System Calibration</span>
        </button>

        {/* Operational tag marker */}
        <div className="mt-3 px-3 pt-2 border-t border-zinc-900 flex items-center justify-between text-[8px] font-mono text-zinc-500">
          <span>© VOL.01 INTEGRITY</span>
          <span className="text-emerald-400/80 font-bold flex items-center gap-1 font-sans">
            <span className="w-1 h-1 rounded-full bg-emerald-400 glow-pulse-emerald"></span>
            ACTIVE OS
          </span>
        </div>
      </div>
    </div>
  );
}
