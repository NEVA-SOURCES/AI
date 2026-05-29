// === THEME UPDATE === Complete Sidebar Redesign to Ultra-Minimal Soft-Dark Aesthetic
import { useState } from "react";
import { useApp } from "../AppContext";
import { 
  Plus, ChevronDown, ChevronRight, Terminal, Radio, 
  BarChart2, FolderOpen, ShieldCheck, Database, Award, 
  History, Settings, Cpu, FileText, LayoutDashboard, Share2,
  Trash2, Pencil, Check, X, Sparkles, Image, Brain, Search
} from "lucide-react";
import { motion } from "motion/react";
import { NevaLogo } from "./icons/NevaIcons";

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
    <div className="w-60 h-full bg-[#0a0a0a] border-r border-[#1a1a1a] flex flex-col justify-between font-sans select-none overflow-y-auto scrollbar-thin">
      <div>
        {/* BRAND HEADER */}
        <div className="p-4 flex items-center justify-between border-b border-white/[0.04] bg-[#0a0a0a]">
          <div className="flex items-center gap-3">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              onClick={() => onNavigate("dashboard")}
              className="w-8 h-8 rounded-lg border border-white/[0.08] flex items-center justify-center bg-[#141414] relative shrink-0 cursor-pointer"
            >
              <NevaLogo className="w-5 h-5 text-[#22d3ee]" animate={false} />
            </motion.div>
            <div>
              <div className="text-xs font-semibold text-white tracking-[0.1em] flex items-center gap-1.5 leading-none">
                NEVA<span className="text-[#22d3ee]">.OS</span>
                <span className="text-[8px] font-mono opacity-80 text-[#22d3ee] bg-[#22d3ee]/10 border border-[#22d3ee]/15 px-1 rounded font-extrabold">V01</span>
              </div>
              <div className="text-[9px] font-mono text-[#666666] mt-1 uppercase tracking-[0.05em]">PRECISION ARCHIVE</div>
            </div>
          </div>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="md:hidden text-[#666666] hover:text-white p-1 hover:bg-[#1a1a1a] rounded-lg transition-all cursor-pointer"
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
            className="w-full flex items-center justify-between p-2 rounded-xl bg-[#141414] border border-white/[0.06] hover:border-white/[0.12] text-left transition-all duration-200"
          >
            <div className="flex items-center gap-2">
              <span className="text-xs p-1 bg-[#1a1a1a] border border-white/[0.04] rounded">{activeWorkspace?.icon || "⚡"}</span>
              <span className="text-[11px] font-medium text-white truncate max-w-[120px]">{activeWorkspace?.name}</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#666666]" />
          </button>

          {workspaceDropdownOpen && (
            <div className="absolute top-12 left-3 right-3 bg-[#0f0f0f] border border-white/[0.06] rounded-xl shadow-xl z-50 p-1.5 backdrop-blur-xl">
              <div className="text-[8px] uppercase font-mono text-[#666666] px-2 py-1 tracking-widest border-b border-white/[0.04] mb-1">Switch System Node</div>
              {workspaces.map(w => (
                <button
                  key={w.id}
                  onClick={() => {
                    switchWorkspace(w.id);
                    setWorkspaceDropdownOpen(false);
                  }}
                  className={`w-full text-left px-2 py-1.5 rounded-lg text-[11px] transition-colors flex items-center gap-2 ${
                    activeWorkspace?.id === w.id 
                      ? "bg-[rgba(34,211,238,0.06)] text-[#22d3ee] font-medium border border-[rgba(34,211,238,0.12)]" 
                      : "hover:bg-[#161616] text-[#a0a0a0] hover:text-white"
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
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white text-black hover:bg-[#e5e5e5] text-[10px] font-bold uppercase tracking-[0.1em] shadow-sm transition-all duration-200 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-black" />
              New Chat Session
            </button>
          ) : (
            <form onSubmit={submitNewMission} className="space-y-2.5 p-3.5 bg-[#141414] border border-white/[0.06] rounded-xl shadow-xl">
              <div className="text-[8px] font-mono text-[#666666] uppercase tracking-wider font-semibold">New Mission Name</div>
              <input
                id="new-chat-input"
                autoFocus
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Cognitive Debugger"
                className="w-full bg-[#1a1a1a] border border-white/[0.06] rounded-xl px-2.5 py-1.5 text-xs text-white placeholder-[#444444] focus:outline-none focus:border-[rgba(34,211,238,0.25)] font-mono transition-all"
              />
              <div className="flex items-center gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreating(false);
                    setNewTitle("");
                  }}
                  className="px-2 py-1 text-[9px] uppercase font-mono text-[#666666] hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 text-[9px] uppercase font-mono bg-white text-black font-bold transition-all rounded-lg hover:bg-[#e5e5e5]"
                >
                  Launch
                </button>
              </div>
            </form>
          )}
        </div>

        {/* NAVIGATION LINKS */}
        <div className="px-2 py-2">
          <div className="text-[11px] text-[#444444] font-medium tracking-wide uppercase px-3 py-1.5 border-b border-white/[0.03] mb-1.5">SYSTEM CONTROLS</div>

          <button 
            onClick={() => onNavigate("dashboard")} 
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[11px] transition-all text-left text-[#666666] hover:text-[#a0a0a0] hover:bg-[#111111] cursor-pointer"
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-[#666666]" />
            <span className="font-medium">OS Dashboard</span>
          </button>

          <button 
            onClick={() => onNavigate("chat")} 
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[11px] transition-all text-left text-[#666666] hover:text-[#a0a0a0] hover:bg-[#111111] cursor-pointer"
          >
            <Radio className="w-3.5 h-3.5 text-[#666666]" />
            <span className="font-medium">Active Mission</span>
          </button>

          <button 
            onClick={() => onNavigate("prompt")} 
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[11px] transition-all text-left text-[#666666] hover:text-[#a0a0a0] hover:bg-[#111111] cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#22d3ee]" />
            <span className="font-medium text-[#a0a0a0] font-semibold">Prompt Architect</span>
            <span className="text-[8px] font-mono bg-[rgba(34,211,238,0.06)] text-[#22d3ee] border border-[rgba(34,211,238,0.12)] px-1.5 py-0.2 rounded font-extrabold ml-auto">PRO</span>
          </button>

          <button 
            id="nav-images-btn"
            onClick={() => onNavigate("images")} 
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[11px] transition-all text-left text-[#666666] hover:text-[#a0a0a0] hover:bg-[#111111] cursor-pointer"
          >
            <Image className="w-3.5 h-3.5 text-[#666666]" />
            <span className="font-medium">Image Studio</span>
            <span className="text-[8px] font-mono bg-white/[0.04] text-white border border-white/[0.06] px-1.5 py-0.2 rounded font-bold ml-auto flex items-center gap-1">NEW</span>
          </button>

          {/* COGNITIVE VECTORS SECTION */}
          <div className="mt-6 border-t border-white/[0.04] pt-4">
            <div className="px-3 mb-2 text-[11px] text-[#444444] font-medium tracking-wide uppercase">
              Neural Grounding
            </div>
            
            {/* AI DeepThink Search */}
            <button
              onClick={() => {
                setDeepThinkSearchActive(true);
                onNavigate("chat");
                if (!activeConversation || activeConversation.title !== "DeepThink Search") {
                  createMission("DeepThink Search", "research");
                }
              }}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all border",
                deepThinkSearchActive 
                  ? "bg-[rgba(34,211,238,0.06)] border-[rgba(34,211,238,0.12)] text-[#22d3ee]"
                  : "hover:bg-[#111111] text-[#666666] hover:text-[#a0a0a0] border-transparent bg-transparent"
              )}
            >
              <div className="w-8 h-8 rounded-lg bg-[#141414] border border-white/[0.04] flex items-center justify-center shrink-0">
                <Search size={14} className={deepThinkSearchActive ? "text-[#22d3ee]" : "text-[#666666]"} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-semibold">AI DeepThink</div>
                <div className="text-[9px] text-[#666666] truncate">Deep internet research</div>
              </div>
              <span className="text-[8px] font-mono px-1 py-0.2 rounded bg-[rgba(34,211,238,0.06)] text-[#22d3ee] border border-[rgba(34,211,238,0.12)] shrink-0 font-extrabold">
                PRO
              </span>
            </button>
          </div>

          {/* MISSIONS RECENT LIST */}
          <div className="mt-4">
            <div className="text-[11px] text-[#444444] font-medium tracking-wide uppercase px-3 py-1 flex items-center justify-between">
              <span>Archives Index</span>
              <span className="text-[8px] font-mono bg-[#141414] text-[#a0a0a0] border border-white/[0.04] px-1.5 py-0.2 rounded font-bold">{conversations.length}</span>
            </div>
            <div className="max-h-[220px] overflow-y-auto mt-2 space-y-0.5 px-0.5 scrollbar-thin">
              {conversations.map(conv => {
                const isActive = activeConversation?.id === conv.id;
                const isEditing = editingConvId === conv.id;

                if (isEditing) {
                  return (
                    <div key={conv.id} className="px-2 py-1 bg-[#141414] border border-white/[0.06] rounded-xl flex items-center gap-1.5 mx-1">
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
                        className="flex-1 bg-[#1a1a1a] border border-white/[0.04] rounded px-2 py-1 text-[11px] text-white font-mono focus:outline-none"
                      />
                      <button
                        onClick={() => submitRename(conv.id)}
                        className="text-[#666666] hover:text-white transition-colors"
                      >
                        <Check className="w-3.5 h-3.5" />
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
                    className={cn(
                      "group w-full flex items-center justify-between px-3 py-2 rounded-xl text-[11px] text-left transition-all cursor-pointer border",
                      isActive 
                        ? "bg-[#161616] text-white border border-white/[0.08]" 
                        : "hover:bg-[#111111] text-[#666666] hover:text-[#a0a0a0] border-transparent"
                    )}
                  >
                    <div className="flex items-center gap-2 truncate flex-1 min-w-0 mr-1">
                      <span className={cn(
                        "w-1.5 h-1.5 rounded-full inline-block shrink-0",
                        isActive ? "bg-[#22d3ee]" : "bg-[#444444]"
                      )} />
                      <span className="truncate" title={conv.title}>{conv.title}</span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingConvId(conv.id);
                          setEditingTitle(conv.title);
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-[#666666] hover:text-white p-0.5"
                      >
                        <Pencil className="w-3 h-3" />
                      </button>
                      
                      <button
                        onClick={(e) => handleDelete(e, conv.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-[#666666] hover:text-[#22d3ee] p-0.5"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>

                      <span className="text-[8px] font-mono text-[#444444] uppercase group-hover:hidden select-none">
                        {conv.mode.slice(0, 3)}
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
              className="w-full text-[11px] text-[#444444] font-medium tracking-wide uppercase px-3 py-1 flex items-center justify-between"
            >
              <span>OPERATIONAL GROUPS</span>
              {projectsCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
            {!projectsCollapsed && (
              <div className="mt-1 space-y-0.5 px-1">
                {projects.map(proj => (
                  <div 
                    key={proj.id} 
                    className="flex items-center justify-between px-3 py-1 text-[11px] text-[#666666] hover:text-[#a0a0a0] transition-colors"
                  >
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="text-[#444444]">▪</span>
                      <span className="truncate">{proj.name}</span>
                    </div>
                    {proj.pinned && <span className="text-[#22d3ee]">✦</span>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CORE LIBRARY BOTTOM */}
      <div className="px-2 py-3 border-t border-white/[0.04] bg-[#0a0a0a]">
        <div className="text-[11px] text-[#444444] font-medium tracking-wide uppercase px-3 py-1.5 border-b border-white/[0.03] mb-1.5">REGISTRIES LOG</div>
        
        <button 
          onClick={() => onNavigate("memory")} 
          className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-[11px] transition-all text-left text-[#666666] hover:text-[#a0a0a0] hover:bg-[#111111] cursor-pointer"
        >
          <Database className="w-3.5 h-3.5 text-[#666666]" />
          <span className="font-medium">Memories Store</span>
        </button>

        <button 
          onClick={() => onNavigate("skills")} 
          className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-[11px] transition-all text-left text-[#666666] hover:text-[#a0a0a0] hover:bg-[#111111] cursor-pointer"
        >
          <Award className="w-3.5 h-3.5 text-[#666666]" />
          <span className="font-medium">Skills Register</span>
        </button>

        <button 
          onClick={() => onNavigate("files")} 
          className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-[11px] transition-all text-left text-[#666666] hover:text-[#a0a0a0] hover:bg-[#111111] cursor-pointer"
        >
          <FolderOpen className="w-3.5 h-3.5 text-[#666666]" />
          <span className="font-medium">Files Sandbox</span>
        </button>

        <button 
          onClick={() => onNavigate("analytics")} 
          className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-[11px] transition-all text-left text-[#666666] hover:text-[#a0a0a0] hover:bg-[#111111] cursor-pointer"
        >
          <BarChart2 className="w-3.5 h-3.5 text-[#666666]" />
          <span className="font-medium">System Telemetry</span>
        </button>

        <button 
          onClick={() => onNavigate("knowledge")} 
          className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-[11px] transition-all text-left text-[#666666] hover:text-[#a0a0a0] hover:bg-[#111111] cursor-pointer"
        >
          <Cpu className="w-3.5 h-3.5 text-[#666666]" />
          <span className="font-medium">Knowledge Graph</span>
        </button>

        <button 
          onClick={() => onNavigate("settings")} 
          className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-[11px] transition-all text-left text-[#666666] hover:text-[#a0a0a0] hover:bg-[#111111] cursor-pointer"
        >
          <Settings className="w-3.5 h-3.5 text-[#666666]" />
          <span className="font-medium">System Calibration</span>
        </button>

        <div className="mt-3 px-3 pt-2 border-t border-white/[0.04] flex items-center justify-between text-[8px] font-mono text-[#444444]">
          <span>© VOL.01 INTEGRITY</span>
          <span className="text-[#22d3ee] font-semibold flex items-center gap-1 font-sans">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22d3ee]" />
            ACTIVE OS
          </span>
        </div>
      </div>
    </div>
  );
}
