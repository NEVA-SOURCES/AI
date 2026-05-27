import { useState } from "react";
import { useApp } from "../AppContext";
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, 
  CartesianGrid, Tooltip, BarChart, Bar, Cell 
} from "recharts";
import { BarChart3, Activity, Coins, TrendingUp, Cpu, Network, RefreshCw } from "lucide-react";

export default function AnalyticsDashboard() {
  const { stats } = useApp();
  const [timeframe, setTimeframe] = useState<"7d" | "30d" | "90d">("7d");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const simulateRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 900);
  };

  // Modern timesheet metrics
  const tokenTrendData = [
    { name: "Day 1", standard: 12450, reasoning: 3200 },
    { name: "Day 2", standard: 18900, reasoning: 5400 },
    { name: "Day 3", standard: 15400, reasoning: 4100 },
    { name: "Day 4", standard: 22000, reasoning: 8600 },
    { name: "Day 5", standard: 29400, reasoning: 11000 },
    { name: "Day 6", standard: 35000, reasoning: 14500 },
    { name: "Day 7", standard: 41000, reasoning: 19800 },
  ];

  const modelCostData = [
    { name: "Gemini 2.5 Flash", cost: 1.25 },
    { name: "Llama 3.3 70B", cost: 0.15 },
    { name: "Gemini 2.5 Pro", cost: 9.80 },
    { name: "DeepSeek V3", cost: 0.45 },
    { name: "Command-R", cost: 0.20 },
  ];

  // Coordinated luxury cyber tones: Cyber Cyan to Solar Orange
  const COLORS = ["#06b6d4", "#f97316", "#0ea5e9", "#10b981", "#f43f5e"];

  return (
    <div className="space-y-6 select-none animate-fade-in font-sans pb-10">
      
      {/* HEADER SECTION */}
      <div className="flex flex-wrap items-center justify-between border-b border-zinc-850 pb-4 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-500/10 rounded-xl border border-cyan-500/20 text-cyan-400">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xs uppercase font-sans tracking-[0.2em] text-white font-extrabold flex items-center gap-2">
              NEVA OS Telemetry Control Center
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
            </h2>
            <p className="text-[10px] text-zinc-500 font-mono mt-0.5">LATEST REAL-TIME COGNITIVE STREAM STATISTICS</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* REFRESH SENSOR */}
          <button
            onClick={simulateRefresh}
            className="p-1.5 bg-zinc-900 border border-zinc-850 text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-800/80 transition-all cursor-pointer mr-1"
            title="Force refresh diagnostics metrics"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-cyan-400" : ""}`} />
          </button>

          <div className="flex bg-zinc-950 p-1 border border-zinc-850 rounded-xl">
            {["7d", "30d", "90d"].map(tf => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf as "7d")}
                className={`px-3 py-1 text-[9px] uppercase tracking-wider font-mono transition-all rounded-lg cursor-pointer ${
                  timeframe === tf 
                    ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/20 font-bold" 
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* CORE DIAGNOSTICS CARD ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { key: "missions", icon: <TrendingUp className="text-cyan-400 w-4 h-4" />, label: "COMPLETED COGNITIVE MISSIONS", value: stats.totalMissions + 42, sub: "+12 since thread refresh", progress: "88%", color: "border-cyan-500/20" },
          { key: "tokens", icon: <Activity className="text-emerald-400 w-4 h-4 show-glow-emerald" />, label: "AGGREGATED VECTOR TOKENS", value: (stats.tokenUsage).toLocaleString(), sub: "Network latency: 1.18s", progress: "64%", color: "border-emerald-500/20" },
          { key: "cost", icon: <Coins className="text-amber-400 w-4 h-4" />, label: "ESTIMATED OVERRIDE COST (USD)", value: `$${(stats.estimatedCostUsd).toFixed(4)}`, sub: "Simulator router active", progress: "35%", color: "border-amber-500/20" },
          { key: "files", icon: <Network className="text-sky-450 w-4 h-4" />, label: "INDEXED VECTORIZED FILES", value: stats.filesIndexed, sub: "100% operational schemas", progress: "92%", color: "border-sky-500/20" },
        ].map(card => (
          <div key={card.key} className={`glass-card p-5 relative overflow-hidden group border ${card.color} hover:border-cyan-500/30 transition-all duration-300`}>
            
            {/* AMBIENT GLOW ON HOVER */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

            <div className="flex justify-between items-center text-zinc-500 text-[8px] tracking-[0.18em] uppercase font-sans mb-3 font-extrabold pb-2 border-b border-zinc-900/40">
              <span className="truncate">{card.label}</span>
              {card.icon}
            </div>
            
            <div className="font-extrabold text-2xl text-white mb-1.5 tracking-tight font-mono select-all">
              {card.value}
            </div>

            <div className="flex justify-between items-center pt-1">
              <span className="text-[10px] text-zinc-400 font-mono">{card.sub}</span>
              <span className="text-[9px] font-mono font-bold text-rose-500/80 bg-rose-500/5 px-1.5 py-0.5 rounded border border-rose-500/15">DIAG: OK</span>
            </div>

            {/* DYNAMIC METRIC LINE */}
            <div className="mt-4 bg-zinc-900/80 h-1 w-full rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-cyan-500 to-sky-500 rounded-full group-hover:animate-pulse" 
                style={{ width: card.progress }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* CHARTS CONTAINER GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* CHART 1: LINE AREA TOKENS */}
        <div className="glass-panel p-5.5 flex flex-col justify-between h-[340px] border border-zinc-850/80 rounded-2xl relative shadow-lg">
          <div className="flex items-center justify-between border-b border-zinc-900/60 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span className="text-[10px] font-mono font-extrabold text-zinc-200 uppercase tracking-[0.2em]">VECTOR TOKEN DENSITIES</span>
            </div>
            <span className="text-[8px] font-mono text-emerald-400 bg-emerald-500/5 px-2 py-0.5 rounded-lg border border-emerald-500/15 uppercase font-bold animate-pulse">STREAM ACTIVE</span>
          </div>

          <div className="flex-1 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={tokenTrendData}>
                <defs>
                  <linearGradient id="colorStd" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorReason" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" />
                <XAxis dataKey="name" stroke="#52525b" fontSize={9} tickLine={false} />
                <YAxis stroke="#52525b" fontSize={9} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "#09090b", borderColor: "#27272a", fontSize: "11px", borderRadius: "12px", color: "#f4f4f5" }} />
                <Area type="monotone" dataKey="standard" stroke="#06b6d4" fillOpacity={1} fill="url(#colorStd)" name="Default context" strokeWidth={2.5} />
                <Area type="monotone" dataKey="reasoning" stroke="#10b981" fillOpacity={1} fill="url(#colorReason)" name="Reasoning outputs" strokeWidth={2.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 2: BAR CHART COST */}
        <div className="glass-panel p-5.5 flex flex-col justify-between h-[340px] border border-zinc-850/80 rounded-2xl relative shadow-lg">
          <div className="flex items-center justify-between border-b border-zinc-900/60 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Coins className="w-4 h-4 text-emerald-400" />
              <span className="text-[10px] font-mono font-extrabold text-zinc-200 uppercase tracking-[0.2em]">ROUTING COST INDICES</span>
            </div>
            <span className="text-[8.5px] font-mono text-zinc-500 uppercase font-bold">ESTIMATION UNITS</span>
          </div>

          <div className="flex-1 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={modelCostData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" />
                <XAxis dataKey="name" stroke="#52525b" fontSize={9} tickLine={false} />
                <YAxis stroke="#52525b" fontSize={9} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "#09090b", borderColor: "#27272a", fontSize: "11px", borderRadius: "12px", color: "#f4f4f5" }} />
                <Bar dataKey="cost" fill="#06b6d4" radius={[6, 6, 0, 0]} maxBarSize={32}>
                  {modelCostData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
}
