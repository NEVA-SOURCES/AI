import { useState, useEffect } from "react";
import { useApp } from "../AppContext";
import { Command, Search, Sparkles, Sliders, Play, Award, Database, Terminal, FileCode } from "lucide-react";

export default function CommandPalette({ 
  onNavigate 
}: { 
  onNavigate: (route: string) => void 
}) {
  const { commandPaletteOpen, setCommandPaletteOpen, profiles, switchWorkspace } = useApp();
  const [search, setSearch] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandPaletteOpen(!commandPaletteOpen);
      }
      if (e.key === "Escape") {
        setCommandPaletteOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [commandPaletteOpen]);

  if (!commandPaletteOpen) return null;

  const quickCommands = [
    { name: "Orchestrate Mission Module", action: () => { onNavigate("chat"); setCommandPaletteOpen(false); }, icon: <Play className="w-3.5 h-3.5" />, category: "Navigation" },
    { name: "Inspect System Dashboards", action: () => { onNavigate("dashboard"); setCommandPaletteOpen(false); }, icon: <Sliders className="w-3.5 h-3.5" />, category: "Navigation" },
    { name: "Explore Memories Store", action: () => { onNavigate("memory"); setCommandPaletteOpen(false); }, icon: <Database className="w-3.5 h-3.5" />, category: "Navigation" },
    { name: "Audit Core System Skills", action: () => { onNavigate("skills"); setCommandPaletteOpen(false); }, icon: <Award className="w-3.5 h-3.5" />, category: "Navigation" },
    { name: "Audit File Sandbox Uploads", action: () => { onNavigate("files"); setCommandPaletteOpen(false); }, icon: <FileCode className="w-3.5 h-3.5" />, category: "Navigation" },
  ];

  const filtered = quickCommands.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-[#0d0d0d]/80 backdrop-blur-md z-[100] flex items-start justify-center pt-[15%] px-4 font-sans select-none animate-fade-in">
      <div 
        id="cmd-palette-box"
        className="w-full max-w-xl bg-[#121212] border border-white/10 rounded-none shadow-2xl flex flex-col justify-between overflow-hidden"
      >
        {/* INPUT RETRIEVAL BAR */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10 bg-[#0d0d0d]">
          <Search className="w-4 h-4 text-neutral-400" />
          <input 
            type="text"
            className="flex-1 bg-transparent border-none outline-none text-xs text-white placeholder-[#737373] font-sans"
            placeholder="Type active command keywords (e.g. Memory, Skills, Dashboard)..."
            autoFocus
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <div className="flex items-center gap-1.5 text-[8px] font-mono text-neutral-400 uppercase tracking-widest bg-white/5 border border-white/10 px-2 py-0.5 rounded-none">
            ESC TO EXIT
          </div>
        </div>

        {/* LIST GROUPS */}
        <div className="p-2 space-y-1 max-h-[300px] overflow-y-auto scrollbar-thin">
          <div className="text-[8px] uppercase tracking-[0.25em] font-bold text-[#737373] px-3 py-1">FLIGHT OPERATIONS COMMANDS</div>
          
          {filtered.length > 0 ? (
            filtered.map((item, idx) => (
              <div
                key={idx}
                onClick={item.action}
                className="flex items-center justify-between px-3 py-2 border border-transparent hover:border-white/15 bg-transparent hover:bg-white/5 cursor-pointer transition-all rounded-none text-xs text-[#a3a3a3] hover:text-white"
              >
                <div className="flex items-center gap-2.5">
                  <span className="opacity-60">{item.icon}</span>
                  <span className="font-medium font-serif italic text-[11px] leading-none">{item.name}</span>
                </div>
                <span className="text-[8px] font-mono uppercase tracking-widest text-[#737373] bg-white/5 px-1.5 py-0.2 border border-white/5 rounded-none">
                  {item.category}
                </span>
              </div>
            ))
          ) : (
            <div className="text-center py-10 font-body italic text-[#737373]">
              No operations indexed matching query criteria.
            </div>
          )}

          {/* ADD SYSTEM PROFILE SHORTCUTS */}
          <div className="text-[8px] uppercase tracking-[0.25em] font-bold text-[#737373] px-3 py-1 mt-3">DEPLOY INTELLECTUAL NODES PROFILE</div>
          {profiles.slice(0, 3).map(p => (
            <div
              key={p.id}
              onClick={() => {
                onNavigate("chat");
                setCommandPaletteOpen(false);
              }}
              className="flex items-center justify-between px-3 py-2 border border-transparent hover:border-white/15 bg-transparent hover:bg-white/5 cursor-pointer transition-all rounded-none text-xs text-[#a3a3a3] hover:text-white"
            >
              <div className="flex items-center gap-2.5">
                <span>{p.icon}</span>
                <span className="font-serif italic text-[11px] font-bold leading-none">{p.name}</span>
              </div>
              <span className="text-[8px] font-mono text-[#737373] uppercase tracking-wide">
                AUTONOMY LEVEL {p.autonomyLevel}
              </span>
            </div>
          ))}
        </div>

        {/* FOOTER */}
        <div className="px-4 py-2 bg-[#0d0d0d] border-t border-white/5 flex items-center justify-between text-[8px] font-mono text-[#737373] tracking-widest">
          <span>NEVA CONSOLE UTILITY PORTAL</span>
          <span>TAG CAPABILITY: 3pa8</span>
        </div>
      </div>
    </div>
  );
}
