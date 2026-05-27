import { useState } from "react";
import { useApp } from "../AppContext";
import { 
  Users, Cpu, Brain, Award, FolderOpen, Terminal, 
  Trash2, Plus, Star, Search, Check, Shield, FileCode, CheckSquare,
  History, Clock, ChevronRight, ChevronDown, Code, Coins, Filter, Loader2, AlertCircle, CheckCircle2, X, Download
} from "lucide-react";
import { CapabilityProfile, Memory, Skill, FileItem, StepState, AgentStep } from "../types";
import { downloadFileItem, downloadFilesAsZip } from "../utils/fileExporter";

export default function InspectorTabs() {
  const { 
    profiles, createProfile, 
    skills, createSkill,
    memories, addMemory, forgetMemory,
    files, uploadFile,
    logs,
    modelSelected, setModelSelected,
    allModels,
    runs,
    activeConversation
  } = useApp();

  const [activeTab, setActiveTab] = useState<"profiles" | "models" | "memory" | "skills" | "files" | "logs" | "history">("profiles");

  // Selected files for batch download/export
  const [selectedFileIds, setSelectedFileIds] = useState<Record<string, boolean>>({});

  // History tab specific state
  const [selectedRunId, setSelectedRunId] = useState<string | null>(null);
  const [expandedRunSteps, setExpandedRunSteps] = useState<Record<string, AgentStep[]>>({});
  const [loadingRunSteps, setLoadingRunSteps] = useState<Record<string, boolean>>({});
  const [runsStatusFilter, setRunsStatusFilter] = useState<string>("all");
  const [runsModeFilter, setRunsModeFilter] = useState<string>("all");
  const [runsSearchQuery, setRunsSearchQuery] = useState("");
  const [expandedStepIds, setExpandedStepIds] = useState<Record<string, boolean>>({});

  const fetchStepsForRun = async (runId: string) => {
    if (expandedRunSteps[runId]) return; // already loaded
    setLoadingRunSteps(prev => ({ ...prev, [runId]: true }));
    try {
      const res = await fetch(`/api/runs/${encodeURIComponent(runId)}/steps`);
      if (res.ok) {
        const data = await res.json();
        setExpandedRunSteps(prev => ({ ...prev, [runId]: data }));
      }
    } catch (err) {
      console.error("Error loading steps for run:", err);
    } finally {
      setLoadingRunSteps(prev => ({ ...prev, [runId]: false }));
    }
  };

  const handleToggleRun = (runId: string) => {
    if (selectedRunId === runId) {
      setSelectedRunId(null);
    } else {
      setSelectedRunId(runId);
      fetchStepsForRun(runId);
    }
  };

  const toggleStepDetails = (stepId: string) => {
    setExpandedStepIds(prev => ({ ...prev, [stepId]: !prev[stepId] }));
  };

  // Models specific state
  const [modelSearch, setModelSearch] = useState("");
  const [filterFreeOnly, setFilterFreeOnly] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(["google/gemini-3.5-flash", "deepseek/deepseek-reasoner"]);

  // Memories specific state
  const [memorySearch, setMemorySearch] = useState("");
  const [memoryFilter, setMemoryFilter] = useState<string>("All");
  const [newMemoryText, setNewMemoryText] = useState("");

  // Skills specific state
  const [skillCategory, setSkillCategory] = useState<string>("All");
  const [skillSearch, setSkillSearch] = useState("");

  // Profiles specific state: Editable sliding profile panel
  const [selectedProfile, setSelectedProfile] = useState<CapabilityProfile | null>(null);
  const [editingPrompt, setEditingPrompt] = useState("");
  const [editingAutonomy, setEditingAutonomy] = useState(5);

  const toggleFavoriteModel = (model: string) => {
    if (favorites.includes(model)) {
      setFavorites(favorites.filter(item => item !== model));
    } else {
      setFavorites([...favorites, model]);
    }
  };

  const handleCreateMemory = () => {
    if (!newMemoryText.trim()) return;
    addMemory(newMemoryText, "long");
    setNewMemoryText("");
  };

  const selectAndEditProfile = (prof: CapabilityProfile) => {
    setSelectedProfile(prof);
    setEditingPrompt(prof.systemPrompt);
    setEditingAutonomy(prof.autonomyLevel);
  };

  const saveProfileEdits = () => {
    if (!selectedProfile) return;
    selectedProfile.systemPrompt = editingPrompt;
    selectedProfile.autonomyLevel = editingAutonomy;
    setSelectedProfile(null);
  };

  return (
    <div className="w-full h-full bg-[#09090b]/90 backdrop-blur-md border-l border-zinc-850/60 flex flex-col justify-between select-none">
      {/* TAB SWITCH BAR */}
      <div className="grid grid-cols-7 border-b border-zinc-850/60 bg-[#0c0c0e]/80 p-1.5 gap-1 shrink-0">
        {[
          { key: "profiles", icon: <Users className="w-3.5 h-3.5" />, label: "Profiles" },
          { key: "models", icon: <Cpu className="w-3.5 h-3.5" />, label: "Models" },
          { key: "memory", icon: <Brain className="w-3.5 h-3.5" />, label: "Memory" },
          { key: "skills", icon: <Award className="w-3.5 h-3.5" />, label: "Skills" },
          { key: "files", icon: <FolderOpen className="w-3.5 h-3.5" />, label: "Files" },
          { key: "logs", icon: <Terminal className="w-3.5 h-3.5" />, label: "Logs" },
          { key: "history", icon: <History className="w-3.5 h-3.5" />, label: "History" },
        ].map(tb => (
          <button
            key={tb.key}
            onClick={() => {
              setActiveTab(tb.key as any);
              setSelectedProfile(null);
            }}
            title={tb.label}
            className={`py-2 px-0.5 flex flex-col items-center justify-center rounded-xl text-[8px] uppercase tracking-wider font-sans font-extrabold transition-all duration-200 cursor-pointer ${
              activeTab === tb.key 
                ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-inner" 
                : "text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900/60 border border-transparent"
            }`}
          >
            {tb.icon}
            <span className="mt-1 text-[7px] tracking-wider truncate max-w-full">{tb.label}</span>
          </button>
        ))}
      </div>

      {/* RENDER SPACE */}
      <div className="flex-1 overflow-y-auto p-4 text-xs scrollbar-thin">
        {/* TAB 1: PROFILES */}
        {activeTab === "profiles" && (
          <div className="space-y-4 animate-fade-in">
            {!selectedProfile ? (
              <>
                <div className="flex items-center justify-between border-b border-zinc-850/60 pb-2">
                  <div className="font-serif italic text-zinc-100 text-xs font-bold">Agents Index</div>
                  <span className="text-[8px] font-mono text-cyan-400 bg-cyan-500/10 border border-cyan-500/10 px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">{profiles.length} Active System Nodes</span>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {profiles.map(prof => (
                    <div
                      key={prof.id}
                      onClick={() => selectAndEditProfile(prof)}
                      className="p-3.5 border border-zinc-850 bg-zinc-950/40 hover:bg-zinc-900/40 cursor-pointer transition-all duration-200 flex items-start gap-3 rounded-xl hover:border-cyan-500/20 group relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-bl from-cyan-500/5 to-transparent pointer-events-none rounded-tr-xl"></div>
                      <div 
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-base font-semibold shrink-0 bg-zinc-900 border border-zinc-800 text-cyan-400 group-hover:scale-105 transition-transform"
                      >
                        {prof.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-serif font-bold text-xs italic text-zinc-200 group-hover:text-cyan-300 transition-colors truncate">{prof.name}</span>
                          <span className="text-[8px] font-mono px-1.5 py-0.2 bg-zinc-900 border border-zinc-800 rounded text-zinc-400">LVL {prof.autonomyLevel}</span>
                        </div>
                        <p className="text-[10.5px] text-zinc-500 mt-2 leading-relaxed line-clamp-2 font-body font-medium">{prof.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              /* DETAIL PROFILE SLIDING PANEL */
              <div className="space-y-4 animate-slide-in">
                <div className="flex items-center justify-between border-b border-zinc-850 pb-2">
                  <button 
                    onClick={() => setSelectedProfile(null)}
                    className="text-[9px] text-zinc-400 hover:text-white font-sans uppercase tracking-widest flex items-center gap-1 font-bold"
                  >
                    ← Back to Index
                  </button>
                  <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest">Calibration Panel</span>
                </div>

                <div className="flex items-center gap-3 p-3 bg-zinc-950/50 border border-zinc-850 rounded-xl">
                  <span className="text-2xl p-1 bg-zinc-900 border border-zinc-800 rounded-lg">{selectedProfile.icon}</span>
                  <div>
                    <span className="font-serif font-bold italic text-zinc-100 text-sm">{selectedProfile.name}</span>
                    <span className="block text-[8px] font-mono text-zinc-500 uppercase tracking-wider mt-0.5">Autonomy calibrated node</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[8px] font-sans font-bold text-zinc-500 block uppercase tracking-widest">System Prompts guideline</label>
                  <textarea
                    rows={6}
                    value={editingPrompt}
                    onChange={e => setEditingPrompt(e.target.value)}
                    className="w-full bg-[#08080a] border border-zinc-850 focus:border-cyan-500/40 p-3 text-[10.5px] text-zinc-200 font-mono resize-none focus:outline-none rounded-xl tracking-wide leading-relaxed scrollbar-thin"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[8px] font-sans font-bold text-zinc-500 uppercase tracking-widest">Autonomy Level Limit</label>
                    <span className="font-mono text-cyan-400 font-bold text-[10.5px] bg-cyan-500/10 px-1.5 py-0.2 rounded border border-cyan-500/10">{editingAutonomy} / 10</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    value={editingAutonomy}
                    onChange={e => setEditingAutonomy(Number(e.target.value))}
                    className="w-full h-1.5 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                  />
                  <div className="flex justify-between text-[7px] font-mono text-zinc-600 mt-1 uppercase font-bold">
                    <span>Supervised</span>
                    <span>Co-pilot Mode</span>
                    <span>Autonomous</span>
                  </div>
                </div>

                <button
                  onClick={saveProfileEdits}
                  className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-400 text-white text-[9px] font-sans font-extrabold uppercase tracking-[0.15em] transition-all rounded-xl shadow-md cursor-pointer active:scale-95"
                >
                  Confirm and Sync Registry
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: MODELS */}
        {activeTab === "models" && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between border-b border-zinc-850 pb-2">
              <div className="font-serif italic text-zinc-100 text-xs font-bold">Model Registry</div>
              <span className="text-[8px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">Dynamic Routing</span>
            </div>

            {/* SEARCH */}
            <div className="flex gap-2 bg-zinc-950/60 border border-zinc-850 rounded-xl px-3 py-2 items-center focus-within:border-zinc-700 transition-colors">
              <Search className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
              <input 
                type="text" 
                placeholder="Query search indexes..."
                className="bg-transparent border-none outline-none text-[11px] text-zinc-200 w-full placeholder-zinc-600"
                value={modelSearch}
                onChange={e => setModelSearch(e.target.value)}
              />
            </div>

            {/* MODELS DISPLAY */}
            <div className="space-y-3">
              {allModels.filter(m => 
                (m.id.toLowerCase().includes(modelSearch.toLowerCase()) || m.name.toLowerCase().includes(modelSearch.toLowerCase())) && 
                (!filterFreeOnly || m.cost === "Free")
              ).map(m => {
                const isSelected = modelSelected === m.id;
                const isFav = favorites.includes(m.id);
                return (
                  <div
                    key={m.id}
                    className={`p-3.5 border rounded-xl transition-all duration-200 relative overflow-hidden ${
                      isSelected 
                        ? "border-cyan-500/40 bg-cyan-500/5 shadow-[0_0_15px_rgba(6,182,212,0.02)]" 
                        : "border-zinc-850 bg-zinc-950/40 hover:bg-zinc-900/40 hover:border-zinc-800"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <button 
                        onClick={() => setModelSelected(m.id)}
                        className="font-serif text-[11px] font-bold text-left text-zinc-100 hover:text-cyan-400 hover:underline truncate max-w-[190px] italic transition-colors"
                        title={m.id}
                      >
                        {m.name}
                      </button>
                      <button onClick={() => toggleFavoriteModel(m.id)}>
                        <Star className={`w-3.5 h-3.5 transition-colors ${isFav ? "fill-cyan-400 text-cyan-400" : "text-zinc-650 hover:text-white"}`} />
                      </button>
                    </div>

                    <div className="text-[10px] text-zinc-500 font-sans mt-2 leading-relaxed">
                      {m.description}
                    </div>

                    <div className="flex justify-between items-center text-[9px] text-zinc-600 mt-3 font-mono border-t border-zinc-900/60 pt-2 font-semibold">
                      <span>PROVIDER: {m.provider.toUpperCase()}</span>
                      <span>WINDOW: {m.contextWindow.split(" ")[0]}</span>
                    </div>

                    <div className="flex flex-wrap gap-1 mt-2 items-center">
                      {m.tags.map(t => (
                        <span key={t} className="text-[7px] font-mono uppercase bg-zinc-900/80 px-1.5 py-0.5 border border-zinc-850 text-zinc-500 rounded">
                          {t}
                        </span>
                      ))}
                      <span className={`text-[7px] font-mono px-1.5 py-0.5 border rounded ml-auto uppercase font-bold ${
                        isSelected 
                          ? "bg-cyan-500/10 border-cyan-500/20 text-cyan-400" 
                          : "bg-zinc-900 border-zinc-800 text-zinc-400"
                      }`}>
                        {m.latency}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: KEYED LAYER MEMORY */}
        {activeTab === "memory" && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between border-b border-zinc-850 pb-2">
              <div className="font-serif italic text-zinc-100 text-xs font-bold">Semantic Memories</div>
              <span className="text-[8px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">{memories.length} Blocks Indexed</span>
            </div>

            {/* QUICK RETRIEVAL MATRIX SEARCH */}
            <div className="flex gap-2 bg-zinc-950/60 border border-zinc-850 rounded-xl px-3 py-2 items-center focus-within:border-zinc-700 transition-colors">
              <Search className="w-3.5 h-3.5 text-zinc-650 shrink-0" />
              <input 
                type="text" 
                placeholder="Query memory keys..."
                className="bg-transparent border-none outline-none text-[11px] text-zinc-200 w-full placeholder-zinc-650"
                value={memorySearch}
                onChange={e => setNewMemoryText(e.target.value)}
              />
            </div>

            {/* TAB LAYOUT SLIDERS */}
            <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none font-bold">
              {["All", "long", "preference", "short"].map(kind => (
                <button
                  key={kind}
                  onClick={() => setMemoryFilter(kind)}
                  className={`px-2.5 py-1 rounded-lg text-[8px] font-mono uppercase border transition-all cursor-pointer shrink-0 ${
                    memoryFilter === kind 
                      ? "border-cyan-500/20 text-cyan-400 bg-cyan-500/10 font-bold" 
                      : "border-zinc-850 text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900/50"
                  }`}
                >
                  {kind}
                </button>
              ))}
            </div>

            {/* LISTING RECORD CARDS */}
            <div className="space-y-2.5 max-h-[220px] overflow-y-auto scrollbar-thin pr-1">
              {memories.filter(m => 
                memoryFilter === "All" || m.kind === memoryFilter
              ).map(m => (
                <div key={m.id} className="p-3 bg-zinc-950/40 border border-zinc-850 hover:border-zinc-800 transition-all flex justify-between items-start rounded-xl group relative overflow-hidden">
                  <div className="flex-1 min-w-0 pr-2">
                    <div className="flex items-center gap-1.5 text-[8px] font-mono">
                      <span className={`px-1.5 py-0.2 rounded font-bold uppercase ${
                        m.kind === "long" 
                          ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/10" 
                          : m.kind === "short" 
                            ? "bg-emerald-400/10 text-emerald-400 border border-emerald-400/10" 
                            : "bg-blue-400/10 text-blue-400 border border-blue-400/10"
                      }`}>{m.kind}</span>
                      <span className="text-zinc-600">RELEVANCE: {(m.importanceScore * 100).toFixed()}%</span>
                    </div>
                    <p className="mt-2 text-zinc-300 text-[10.5px] leading-relaxed font-body font-medium">{m.content}</p>
                  </div>
                  <button 
                    onClick={() => forgetMemory(m.id)}
                    className="text-zinc-600 hover:text-rose-400 transition-colors p-1 rounded-md hover:bg-zinc-900 cursor-pointer shrink-0 mt-0.5"
                    title="Purge Fact"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* MANUAL INGEST FORM */}
            <div className="flex gap-1.5 mt-4">
              <input
                type="text"
                placeholder="Ingest fact statement..."
                className="flex-1 bg-[#08080a] border border-zinc-850 p-2.5 text-[10.5px] text-zinc-100 focus:outline-none focus:border-cyan-500/40 rounded-xl font-medium"
                value={newMemoryText}
                onChange={e => setNewMemoryText(e.target.value)}
              />
              <button 
                onClick={handleCreateMemory}
                className="bg-cyan-500 hover:bg-cyan-400 text-white text-[9px] font-sans font-bold uppercase tracking-widest px-3.5 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer shrink-0"
              >
                Ingest
              </button>
            </div>
          </div>
        )}

        {/* TAB 4: SKILLS LISTING */}
        {activeTab === "skills" && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between border-b border-zinc-850 pb-2">
              <div className="font-serif italic text-zinc-100 text-xs font-bold">System Skills</div>
              <span className="text-[8px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">{skills.length} Installed Core</span>
            </div>

            {/* CATEGORIES FILT */}
            <div className="flex flex-wrap gap-1 font-bold">
              {["All", "Research", "Engineering", "Writing", "Data", "AI"].map(cat => (
                <button
                  key={cat}
                  onClick={() => setSkillCategory(cat)}
                  className={`px-2 py-0.5 text-[8px] font-mono border uppercase transition-all rounded-lg cursor-pointer ${
                    skillCategory === cat 
                      ? "border-cyan-550 text-cyan-400 bg-cyan-500/10" 
                      : "border-zinc-850 text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900/50"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin">
              {skills.filter(sk => 
                skillCategory === "All" || sk.category === skillCategory
              ).slice(0, 15).map(sk => (
                <div key={sk.id} className="p-3 border border-zinc-850 rounded-xl bg-zinc-950/40 flex items-start gap-2.5 group hover:border-cyan-500/10 transition-colors">
                  <div className="text-cyan-400/60 group-hover:text-cyan-400 font-mono text-xs mt-0.5 shrink-0">▪</div>
                  <div className="min-w-0 flex-1">
                    <div className="flex justify-between items-center">
                      <span className="font-serif text-xs font-bold text-zinc-200 italic group-hover:text-cyan-300 transition-colors">{sk.name}</span>
                      <span className="text-[7px] font-mono text-zinc-550 truncate">/{sk.slug}</span>
                    </div>
                    <p className="text-[10.5px] text-zinc-500 mt-1.5 font-body leading-relaxed font-medium">{sk.description}</p>
                    
                    {/* CUSTOM PROGRESS PERCENTAGE METRICS BAR GAUGE */}
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-[8px] font-mono uppercase text-zinc-650 mb-1">
                        <span>Success Integration</span>
                        <span className="text-zinc-400">{(sk.successRate*100).toFixed()}%</span>
                      </div>
                      <div className="w-full bg-zinc-900 border border-zinc-850 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-cyan-500 h-full rounded-full" 
                          style={{ width: `${sk.successRate * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-2 text-[8px] font-mono font-bold tracking-wider text-zinc-600">
                      <span>RATING: HIGH PROFILE</span>
                      <span>{sk.usageCount} TOTAL RUNS</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: FILES INDEX */}
        {activeTab === "files" && (
          <div className="space-y-4 animate-fade-in text-left">
            <div className="flex items-center justify-between border-b border-zinc-c pb-2">
              <div className="font-serif italic text-zinc-100 text-xs font-bold">Files Archives</div>
              <span className="text-[8px] font-mono text-[#a3a3a3] uppercase tracking-widest">{files.length} ITEMS</span>
            </div>

            {/* SIMULATED UPLOAD */}
            <div className="border border-dashed border-zinc-800 hover:border-cyan-500/30 rounded-xl transition-all duration-300 p-4 text-center bg-zinc-950/60 cursor-pointer group hover:bg-cyan-950/5 relative overflow-hidden"
              onClick={() => {
                const name = prompt("Enter file label mapping (e.g., config.json, index.html, script.py):");
                if (name) {
                  uploadFile(name, Math.floor(Math.random() * 50000) + 2000, "text/plain");
                }
              }}
            >
              <div className="absolute inset-0 bg-radial-gradient from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity"></div>
              <FolderOpen className="w-5 h-5 text-zinc-450 mx-auto mb-1 group-hover:scale-105 group-hover:text-cyan-400 transition-all" />
              <span className="text-[10px] text-zinc-200 font-sans uppercase tracking-[0.08em] block font-bold">Mount Sandbox Archive</span>
              <span className="text-[8px] text-zinc-600 font-mono mt-0.5 block">SUPPORTED: TS/JS, PY, HTML, CSV, JSON, MD, ANY ZIP TYPE</span>
            </div>

            {/* BATCH DOWNLOAD AND SELECTION CONTROLS */}
            {files.length > 0 && (
              <div className="flex items-center justify-between bg-zinc-950/80 border border-zinc-900 rounded-xl p-2.5 text-[9px] font-mono">
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox"
                    id="select-all-files"
                    className="accent-cyan-400 cursor-pointer rounded bg-zinc-900 border-zinc-800 w-3 h-3"
                    checked={files.length > 0 && files.every(f => selectedFileIds[f.id])}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      const next: Record<string, boolean> = {};
                      if (checked) {
                        files.forEach(f => { next[f.id] = true; });
                      }
                      setSelectedFileIds(next);
                    }}
                  />
                  <label htmlFor="select-all-files" className="text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer select-none">
                    {files.every(f => selectedFileIds[f.id]) ? "Deselect All" : "Select All"}
                  </label>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={async () => {
                      const selected = files.filter(f => selectedFileIds[f.id]);
                      if (selected.length === 0) {
                        alert("Please select at least one file to zip.");
                        return;
                      }
                      await downloadFilesAsZip(selected, "neva_workspace_archive.zip");
                    }}
                    className={`px-2.5 py-1 rounded text-[8.5px] font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-all ${
                      files.some(f => selectedFileIds[f.id])
                        ? "bg-cyan-500 text-white shadow-[0_0_10px_rgba(6,182,212,0.2)]"
                        : "bg-zinc-900 text-zinc-650 border border-zinc-850"
                    }`}
                  >
                    <Download className="w-2.5 h-2.5" />
                    ZIP Selected ({files.filter(f => selectedFileIds[f.id]).length})
                  </button>

                  <button
                    onClick={async () => {
                      await downloadFilesAsZip(files, "neva_all_workspace_files.zip");
                    }}
                    className="px-2.5 py-1 rounded text-[8.5px] font-bold uppercase tracking-wider text-zinc-300 hover:text-white bg-zinc-900 border border-zinc-800 hover:bg-zinc-850 cursor-pointer transition-colors flex items-center gap-1"
                  >
                    <Download className="w-2.5 h-2.5 text-cyan-400" />
                    ZIP All ({files.length})
                  </button>
                </div>
              </div>
            )}

            {/* LIST FILE */}
            <div className="space-y-2 pt-0.5 max-h-[300px] overflow-y-auto scrollbar-thin">
              {files.map(f => {
                const isSelected = !!selectedFileIds[f.id];
                return (
                  <div key={f.id} className={`p-3 rounded-xl border transition-all flex items-start gap-2.5 ${
                    isSelected ? "border-cyan-500/25 bg-cyan-950/5" : "border-zinc-850 hover:border-zinc-800 bg-zinc-950/40"
                  }`}>
                    {/* Checkbox */}
                    <input 
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => {
                        setSelectedFileIds(prev => ({
                          ...prev,
                          [f.id]: e.target.checked
                        }));
                      }}
                      className="accent-cyan-400 mt-0.5 shrink-0 cursor-pointer rounded w-3 h-3"
                    />

                    <FileCode className={`w-4 h-4 mt-0.5 shrink-0 ${isSelected ? "text-cyan-400" : "text-zinc-500"}`} />
                    
                    <div className="min-w-0 flex-1 text-[11px]">
                      <div className="flex items-center justify-between font-mono">
                        <span className={`font-bold truncate text-[10px] ${isSelected ? "text-white" : "text-zinc-200"}`}>{f.name}</span>
                        <span className="text-zinc-550 text-[9px] shrink-0 font-medium">{(f.sizeBytes / 1024).toFixed(1)} KB</span>
                      </div>
                      
                      {f.summary && <p className="text-[10px] text-zinc-500 mt-1 font-body leading-relaxed font-medium">{f.summary}</p>}
                      
                      <div className="flex justify-between items-center text-[8px] font-mono mt-2 pt-2 border-t border-zinc-900/60 text-zinc-655 leading-none">
                        <div className="flex items-center gap-2">
                          <span className="text-cyan-400 bg-cyan-500/10 border border-cyan-500/5 px-1.5 py-0.2 rounded font-bold uppercase">{f.parseStatus}</span>
                          <span>{new Date(f.createdAt).toLocaleDateString()}</span>
                        </div>

                        {/* File Action Controls */}
                        <div className="flex items-center gap-1.5 font-sans font-bold">
                          <button
                            onClick={() => downloadFileItem(f)}
                            className="text-[9px] text-cyan-400 hover:text-cyan-300 font-semibold cursor-pointer py-0.5 px-1.5 rounded hover:bg-zinc-900/65 transition-colors flex items-center gap-0.5"
                            title="Download Raw File"
                          >
                            <Download className="w-2.5 h-2.5" />
                            RAW
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 6: TELEMETRY LOGS */}
        {activeTab === "logs" && (
          <div className="space-y-4 font-mono h-full flex flex-col justify-between animate-fade-in">
            <div className="flex items-center justify-between border-b border-zinc-850 pb-2">
              <span className="font-bold text-zinc-100 text-[9px] tracking-widest uppercase">System Execution Terminal</span>
              <span className="text-[8px] text-zinc-500 uppercase tracking-wide flex items-center gap-1 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 glow-pulse-cyan"></span>
                Streaming Live
              </span>
            </div>

            <div className="p-3.5 bg-zinc-950/80 border border-zinc-850 rounded-xl text-[9px] leading-relaxed space-y-3 overflow-y-auto max-h-[360px] h-[360px] scrollbar-thin text-zinc-350 font-mono">
              {logs.map((lg, idx) => (
                <div key={lg.id || idx} className="border-b border-zinc-900 pb-2.5 last:border-b-0">
                  <div className="flex items-center justify-between text-[8px] text-zinc-600 tracking-wider font-extrabold pb-1">
                    <span>ROOT_NODE_TRACE://{lg.eventType.toUpperCase()}</span>
                    <span>{new Date(lg.createdAt).toLocaleTimeString()}</span>
                  </div>
                  <pre className="whitespace-pre-wrap text-cyan-300 mt-1 leading-normal font-mono text-[9px] font-medium max-h-[150px] overflow-y-auto">
                    {lg.payload?.message || JSON.stringify(lg.payload)}
                  </pre>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: HISTORICAL RUNS & STEPS */}
        {activeTab === "history" && (
          <div className="space-y-4 animate-fade-in text-xs">
            <div className="flex items-center justify-between border-b border-zinc-850 pb-2">
              <div className="font-serif italic text-zinc-100 text-xs font-bold">Execution History</div>
              <span className="text-[8px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">
                {runs.length} Runs Logged
              </span>
            </div>

            {/* QUICK FILTERS */}
            <div className="space-y-2.5">
              {/* Search */}
              <div className="flex gap-2 bg-zinc-950/60 border border-zinc-850 rounded-xl px-3 py-2 items-center focus-within:border-zinc-700 transition-colors">
                <Search className="w-3.5 h-3.5 text-zinc-650 shrink-0" />
                <input
                  type="text"
                  placeholder="Filter executions by ID / Plan..."
                  className="bg-transparent border-none outline-none text-[11px] text-zinc-200 w-full placeholder-zinc-650"
                  value={runsSearchQuery}
                  onChange={e => setRunsSearchQuery(e.target.value)}
                />
              </div>

              {/* Status and Mode selects */}
              <div className="flex gap-1.5">
                <div className="flex-1 min-w-0">
                  <div className="text-[8px] font-mono uppercase text-zinc-650 mb-1 font-bold">Filter Status</div>
                  <select
                    value={runsStatusFilter}
                    onChange={e => setRunsStatusFilter(e.target.value)}
                    className="w-full bg-zinc-950/60 border border-zinc-850 text-[10.5px] p-2 rounded-xl text-zinc-300 focus:outline-none focus:border-zinc-750 select-none cursor-pointer"
                  >
                    <option value="all">ALL STATUSES</option>
                    <option value="running">ACTIVE/RUNNING</option>
                    <option value="completed">COMPLETED</option>
                    <option value="failed">FAILED</option>
                    <option value="cancelled">CANCELLED</option>
                  </select>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="text-[8px] font-mono uppercase text-zinc-650 mb-1 font-bold">Filter Mode</div>
                  <select
                    value={runsModeFilter}
                    onChange={e => setRunsModeFilter(e.target.value)}
                    className="w-full bg-zinc-950/60 border border-zinc-850 text-[10.5px] p-2 rounded-xl text-zinc-300 focus:outline-none focus:border-zinc-750 select-none cursor-pointer"
                  >
                    <option value="all">ALL MODES</option>
                    <option value="solo">SOLO</option>
                    <option value="pipeline">PIPELINE</option>
                    <option value="parallel">PARALLEL</option>
                    <option value="debate">DEBATE</option>
                    <option value="mission">MISSION</option>
                  </select>
                </div>
              </div>
            </div>

            {/* HISTORY RUNS LIST */}
            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1 scrollbar-thin">
              {runs
                .filter(run => {
                  const matchesSearch =
                    run.id.toLowerCase().includes(runsSearchQuery.toLowerCase()) ||
                    (run.plan?.objective || "").toLowerCase().includes(runsSearchQuery.toLowerCase());
                  const matchesStatus = runsStatusFilter === "all" || run.status === runsStatusFilter;
                  const matchesMode = runsModeFilter === "all" || run.mode === runsModeFilter;
                  return matchesSearch && matchesStatus && matchesMode;
                })
                .map(run => {
                  const isExpanded = selectedRunId === run.id;
                  const runSteps = expandedRunSteps[run.id] || [];
                  const isLoading = loadingRunSteps[run.id];

                  // Status badge styling
                  let statusColor = "border-zinc-800 text-zinc-400 bg-zinc-900/60";
                  let glowPulse = "";
                  if (run.status === "completed") {
                    statusColor = "border-emerald-500/20 text-emerald-400 bg-emerald-500/5";
                  } else if (run.status === "running") {
                    statusColor = "border-amber-500/20 text-amber-400 bg-amber-500/5";
                    glowPulse = "w-1.5 h-1.5 bg-amber-500 glow-pulse-amber rounded-full animate-pulse";
                  } else if (run.status === "failed") {
                    statusColor = "border-rose-500/20 text-rose-400 bg-rose-500/5";
                  }

                  return (
                    <div
                      key={run.id}
                      className={`p-3 border rounded-xl transition-all duration-200 relative overflow-hidden ${
                        isExpanded
                          ? "border-cyan-500/30 bg-cyan-950/5 shadow-[0_0_15px_rgba(6,182,212,0.01)]"
                          : "border-zinc-850 bg-zinc-950/30 hover:bg-zinc-900/30 hover:border-zinc-800"
                      }`}
                    >
                      {/* RUN ROW HEADER */}
                      <div
                        onClick={() => handleToggleRun(run.id)}
                        className="cursor-pointer space-y-2.5"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex flex-wrap gap-1.5 items-center">
                            <span className="text-[7px] font-mono uppercase bg-zinc-900 border border-zinc-800 px-1.5 py-0.2 rounded font-bold text-zinc-500 select-none">
                              {run.mode}
                            </span>
                            <span className="text-[7.5px] font-mono text-zinc-650 truncate max-w-[80px]" title={run.id}>
                              #{run.id.substring(0, 10)}
                            </span>
                          </div>
                          <div className={`text-[8px] font-mono px-2 py-0.2 border rounded-full font-extrabold uppercase flex items-center gap-1 shrink-0 ${statusColor}`}>
                            {glowPulse && <span className={glowPulse}></span>}
                            {run.status}
                          </div>
                        </div>

                        {/* RUN OBJECTIVE */}
                        <div className="font-serif italic text-zinc-200 text-xs font-bold leading-normal text-left group-hover:text-cyan-300 transition-colors">
                          {run.plan?.objective || "Cognitive Node Integration Run"}
                        </div>

                        {/* SECONDARY ROW */}
                        <div className="flex justify-between items-center text-[8px] font-mono text-zinc-500 border-t border-zinc-905 pt-2 font-semibold">
                          <span className="flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5 opacity-60" />
                            {new Date(run.startedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                          </span>
                          <span className="flex items-center gap-1 text-cyan-400/80">
                            <Coins className="w-2.5 h-2.5 opacity-60" />
                            ${run.estimatedCostUsd.toFixed(4)}
                          </span>
                          <span className="text-zinc-500 font-mono text-[7px] uppercase font-bold bg-zinc-900/40 border border-zinc-850 px-1 rounded-sm">
                            {run.totalTokens.toLocaleString()} TOKENS
                          </span>
                        </div>
                      </div>

                      {/* RUN DETAILS EXPANDED BLOCK */}
                      {isExpanded && (
                        <div className="mt-3 border-t border-zinc-900/80 pt-3 space-y-3.5 animate-slide-in">
                          <div className="text-[8px] font-mono uppercase text-zinc-650 tracking-wider font-bold">
                            Dynamic Steps Trace Timeline
                          </div>

                          {isLoading ? (
                            <div className="py-4 text-center text-zinc-500 font-mono text-[9px] flex items-center justify-center gap-2">
                              <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                              Decompressing node step arrays...
                            </div>
                          ) : runSteps.length === 0 ? (
                            <div className="py-2.5 text-center text-zinc-600 font-mono text-[9px]">
                              No discrete operational steps logged for this segment.
                            </div>
                          ) : (
                            <div className="space-y-3 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-zinc-850/60 pb-1">
                              {runSteps.map((step, sIdx) => {
                                const isStepOpen = expandedStepIds[step.id];

                                // State styling
                                let stateColor = "text-zinc-500 bg-zinc-900/80 border border-zinc-800";
                                if (step.status === "running") {
                                  stateColor = "text-amber-400 bg-amber-500/10 border border-amber-500/20";
                                } else if (step.status === "completed") {
                                  stateColor = "text-cyan-400 bg-cyan-500/10 border border-cyan-500/20";
                                } else if (step.status === "failed") {
                                  stateColor = "text-rose-400 bg-rose-500/10 border border-rose-500/20";
                                }

                                return (
                                  <div key={step.id} className="relative pl-5 text-[10.5px]">
                                    {/* NODE PIN ON TIMELINE */}
                                    <div className={`absolute left-0.5 top-1 w-3.5 h-3.5 rounded-full flex items-center justify-center text-[7.5px] font-extrabold ${stateColor}`}>
                                      {sIdx + 1}
                                    </div>

                                    {/* STEP DATA BODY */}
                                    <div className="space-y-1.5 text-left">
                                      {/* Header */}
                                      <div className="flex items-center justify-between font-mono">
                                        <div className="flex items-center gap-1.5">
                                          <span className="font-serif font-bold text-zinc-300 italic">
                                            {step.agentKey}
                                          </span>
                                          <span className="text-[7.5px] px-1 py-0.2 bg-zinc-900 border border-zinc-850 text-zinc-500 rounded font-bold uppercase">
                                            {step.state}
                                          </span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-[8px] text-zinc-550 font-bold">
                                          <span>{step.durationMs ? `${(step.durationMs / 1000).toFixed(1)}s` : "pending"}</span>
                                          <button
                                            onClick={() => toggleStepDetails(step.id)}
                                            className="text-cyan-400 hover:text-cyan-300 transition-colors p-0.5"
                                          >
                                            {isStepOpen ? (
                                              <ChevronDown className="w-3.5 h-3.5 animate-pulse" />
                                            ) : (
                                              <ChevronRight className="w-3.5 h-3.5" />
                                            )}
                                          </button>
                                        </div>
                                      </div>

                                      {/* Tool Call inline marker */}
                                      {step.tool && (
                                        <div className="flex items-center gap-1.5 text-[9px] font-mono text-cyan-300 bg-cyan-500/5 border border-cyan-500/10 p-1 rounded-md px-1.5">
                                          <Code className="w-2.5 h-2.5 text-cyan-400" />
                                          <span className="font-bold">EXEC:</span>
                                          <span className="text-zinc-450 font-medium truncate max-w-[150px]" title={step.tool}>
                                            {step.tool}({step.toolInput ? JSON.stringify(step.toolInput).substring(0, 25) : ""})
                                          </span>
                                        </div>
                                      )}

                                      {/* Expanded step debug details panel */}
                                      {isStepOpen && (
                                        <div className="space-y-2 mt-1.5 p-2 bg-black/60 border border-zinc-900 rounded-xl text-[9.5px] font-mono leading-relaxed transition-all animate-slide-in">
                                          {/* Model details */}
                                          {step.modelUsed && (
                                            <div className="text-[8px] text-zinc-550 tracking-wider">
                                              MODEL LAYER: <span className="text-zinc-400 font-bold">{step.modelUsed}</span>
                                            </div>
                                          )}

                                          {/* Internal thoughts accordion style display */}
                                          {step.reasoningTrace && (
                                            <div className="space-y-1">
                                              <div className="text-[7.5px] uppercase text-zinc-650 tracking-wide font-bold">
                                                Inner Thought Trace
                                              </div>
                                              <pre className="p-2 bg-zinc-950/80 border border-zinc-900 text-zinc-400/90 whitespace-pre-wrap leading-normal font-mono text-[9px] rounded-lg max-h-[120px] overflow-y-auto scrollbar-thin text-left">
                                                {step.reasoningTrace}
                                              </pre>
                                            </div>
                                          )}

                                          {/* Tool input outputs */}
                                          {step.toolInput && (
                                            <div className="space-y-1">
                                              <div className="text-[7.5px] uppercase text-zinc-650 tracking-wide font-bold">
                                                Argument Payload
                                              </div>
                                              <pre className="p-1.5 bg-[#08080a] border border-zinc-900 text-cyan-500/85 whitespace-pre-wrap font-mono text-[8.5px] rounded border-l-2 border-l-cyan-500/30 text-left">
                                                {JSON.stringify(step.toolInput, null, 2)}
                                              </pre>
                                            </div>
                                          )}

                                          {step.toolOutput && (
                                            <div className="space-y-1">
                                              <div className="text-[7.5px] uppercase text-zinc-650 tracking-wide font-bold">
                                                Return Response
                                              </div>
                                              <pre className="p-1.5 bg-[#08080a] border border-zinc-900 text-emerald-450/85 whitespace-pre-wrap font-mono text-[8.5px] rounded border-l-2 border-l-emerald-500/30 max-h-[150px] overflow-y-auto scrollbar-thin text-left">
                                                {JSON.stringify(step.toolOutput, null, 2)}
                                              </pre>
                                            </div>
                                          )}

                                          <div className="flex justify-between items-center text-[7.5px] text-zinc-600 border-t border-zinc-900/60 pt-1">
                                            <span>TRACE://{step.id}</span>
                                            <span>{new Date(step.startedAt).toLocaleTimeString()}</span>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}

              {/* EMPTY STATE */}
              {runs.length === 0 && (
                <div className="py-8 text-center border border-dashed border-zinc-850 rounded-xl bg-zinc-950/20 text-zinc-500 space-y-2">
                  <Clock className="w-5 h-5 mx-auto opacity-40 text-cyan-400" />
                  <p className="font-serif italic text-zinc-400 text-xs text-center">No Executions Registered</p>
                  <p className="text-[10px] text-zinc-600 font-sans max-w-[180px] mx-auto leading-normal text-center">
                    Past multi-agent operations, neural trajectories, and tool executions stream directly to this index.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
