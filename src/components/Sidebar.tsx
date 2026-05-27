import { useState } from "react";
import { useApp } from "../AppContext";
import { 
  Plus, ChevronDown, ChevronRight, Terminal, Radio, 
  BarChart2, FolderOpen, ShieldCheck, Database, Award, 
  History, Settings, Cpu, FileText, LayoutDashboard, Share2,
  Trash2, Pencil, Check, X, Sparkles, Image, Brain, Search
} from "lucide-react";

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
    projects
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
    <div className="w-60 h-full bg-[#0c0c0e] border-r border-zinc-850/60 flex flex-col justify-between font-sans select-none overflow-y-auto scrollbar-thin">
      {/* BRAND & WORKSPACE HEAD */}
      <div>
        <div className="p-4 flex items-center justify-between border-b border-zinc-850/60 bg-zinc-950/40 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg border border-cyan-500/20 flex items-center justify-center bg-cyan-500/5 relative shrink-0">
              <span className="text-cyan-400 font-serif italic text-base font-bold">N</span>
              <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-cyan-500 glow-pulse-cyan"></span>
            </div>
            <div>
              <div className="text-xs tracking-[0.2em] font-sans font-bold text-zinc-100 uppercase flex items-center gap-1 leading-none">
                NEVA.OS <span className="text-[8px] font-mono opacity-80 text-cyan-400 bg-cyan-400/15 border border-cyan-500/10 px-1 rounded">V01</span>
              </div>
              <div className="text-[9px] font-mono text-zinc-500 mt-1 uppercase tracking-[0.1em]">PRECISION ARCHIVE</div>
            </div>
          </div>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="md:hidden text-zinc-500 hover:text-white p-1 hover:bg-zinc-900 rounded-lg transition-all cursor-pointer"
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
            className="w-full flex items-center justify-between p-2 rounded-xl bg-zinc-950/60 border border-zinc-850/50 hover:border-zinc-700/80 text-left transition-all duration-200"
          >
            <div className="flex items-center gap-2">
              <span className="text-xs p-1 bg-zinc-900 border border-zinc-850/60 rounded">{activeWorkspace?.icon || "⚡"}</span>
              <span className="text-[11px] font-medium text-zinc-200 truncate max-w-[120px]">{activeWorkspace?.name}</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
          </button>

          {workspaceDropdownOpen && (
            <div className="absolute top-12 left-3 right-3 bg-zinc-950 border border-zinc-850 rounded-xl shadow-2xl z-50 p-1.5 backdrop-blur-xl animate-fade-in">
              <div className="text-[8px] uppercase font-mono text-zinc-500 px-2 py-1 tracking-widest border-b border-zinc-900 mb-1">Switch System Node</div>
              {workspaces.map(w => (
                <button
                  key={w.id}
                  onClick={() => {
                    switchWorkspace(w.id);
                    setWorkspaceDropdownOpen(false);
                  }}
                  className={`w-full text-left px-2 py-1.5 rounded-lg text-[11px] transition-colors flex items-center gap-2 ${
                    activeWorkspace?.id === w.id ? "bg-cyan-500/10 text-cyan-400 font-bold border border-cyan-500/10" : "hover:bg-zinc-900/50 text-zinc-400"
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
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-gradient-to-r from-cyan-500/10 via-orange-500/5 to-transparent border border-cyan-500/25 hover:border-cyan-500/55 text-[10px] font-sans font-bold uppercase tracking-[0.15em] text-zinc-100 shadow-sm hover:shadow-[0_0_15px_rgba(6,182,212,0.12)] transition-all duration-300 hover:bg-cyan-500/10 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-cyan-400" />
              New Chat Session
            </button>
          ) : (
            <form onSubmit={submitNewMission} className="space-y-2.5 p-3.5 bg-zinc-950/90 border border-zinc-850 rounded-xl shadow-xl animate-fade-in">
              <div className="text-[8px] font-mono text-zinc-500 uppercase tracking-wider font-bold">New Mission Name</div>
              <input
                id="new-chat-input"
                autoFocus
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Cognitive Debugger"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-zinc-650 focus:outline-none focus:border-cyan-500/50 font-mono transition-all"
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
                  className="px-3 py-1.5 text-[9px] uppercase font-mono bg-cyan-500 hover:bg-cyan-400 text-white font-bold transition-all rounded-md shadow-md active:scale-95"
                >
                  Launch
                </button>
              </div>
            </form>
          )}
        </div>

        {/* NAVIGATION LINKS */}
        <div className="px-2 py-2 text-[#a3a3a3]">
          <div className="text-[9px] uppercase font-mono text-zinc-600 px-3 py-1.5 tracking-[0.2em] border-b border-zinc-900 mb-1.5 font-bold">SYSTEM CONTROLS</div>
          
          <button 
            id="nav-monitor-btn"
            onClick={() => onNavigate("monitor")} 
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[11px] transition-all hover:bg-zinc-900 text-left text-zinc-400 hover:text-zinc-100 group cursor-pointer mb-1"
          >
            <Brain className="w-3.5 h-3.5 text-cyan-400 group-hover:animate-pulse animate-pulse shrink-0" />
            <span className="font-semibold text-zinc-100 group-hover:text-cyan-300">Live AI Monitor</span>
            <span className="text-[7.5px] font-mono bg-cyan-400/15 text-cyan-404 border border-cyan-500/20 px-1.5 py-0.2 rounded font-bold ml-auto flex items-center gap-1">
              <span className="relative flex h-1.5 w-1.5 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-cyan-400"></span>
              </span>
              LIVE
            </span>
          </button>

          <button 
            id="nav-search-btn"
            onClick={() => onNavigate("search")} 
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[11px] transition-all hover:bg-zinc-900 text-left text-zinc-400 hover:text-zinc-100 group cursor-pointer mb-2 border border-cyan-500/10 bg-cyan-500/5 shadow-[inset_0_0_10px_rgba(6,182,212,0.03)]"
          >
            <Search className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform blink-cyan shrink-0 animate-pulse" />
            <span className="font-semibold text-zinc-100 group-hover:text-cyan-300">AI DeepThink Search</span>
            <span className="text-[7px] font-mono bg-amber-400/15 text-amber-400 border border-amber-500/20 px-1 py-0.2 rounded font-bold ml-auto flex items-center gap-1">
              PRO
            </span>
          </button>

          <button 
            onClick={() => onNavigate("dashboard")} 
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[11px] transition-all hover:bg-zinc-900 text-left text-zinc-400 hover:text-zinc-100 group cursor-pointer"
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-zinc-500 group-hover:text-cyan-400 transition-colors" />
            <span className="font-medium">OS Dashboard</span>
          </button>

          <button 
            onClick={() => onNavigate("chat")} 
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[11px] transition-all hover:bg-zinc-900 text-left text-zinc-400 hover:text-zinc-100 group cursor-pointer"
          >
            <Radio className="w-3.5 h-3.5 text-zinc-500 group-hover:text-emerald-400 transition-colors" />
            <span className="font-medium">Active Mission</span>
          </button>

          <button 
            onClick={() => onNavigate("prompt")} 
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[11px] transition-all hover:bg-zinc-900 text-left text-zinc-400 hover:text-zinc-100 group cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400 group-hover:animate-pulse" />
            <span className="font-medium text-zinc-200 group-hover:text-zinc-100">Prompt Architect</span>
            <span className="text-[8px] font-mono bg-amber-400/10 text-amber-400 border border-amber-450/20 px-1.5 py-0.2 rounded font-bold ml-auto">PRO</span>
          </button>

          <button 
            id="nav-images-btn"
            onClick={() => onNavigate("images")} 
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[11px] transition-all hover:bg-zinc-900 text-left text-zinc-400 hover:text-zinc-100 group cursor-pointer"
          >
            <Image className="w-3.5 h-3.5 text-orange-400 group-hover:animate-bounce" />
            <span className="font-medium text-zinc-200 group-hover:text-zinc-100">Image Studio</span>
            <span className="text-[8px] font-mono bg-orange-500/10 text-orange-400 border border-orange-500/20 px-1.5 py-0.2 rounded font-bold ml-auto flex items-center gap-1">NEW</span>
          </button>

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
