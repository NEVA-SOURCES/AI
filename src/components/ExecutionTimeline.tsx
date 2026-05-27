import { useState } from "react";
import { AgentRun, AgentStep, StepState } from "../types";
import { ChevronDown, ChevronUp, Cpu, Timer, CheckCircle, AlertTriangle, Play } from "lucide-react";

export default function ExecutionTimeline({ 
  run, 
  steps 
}: { 
  run: AgentRun | null; 
  steps: AgentStep[] 
}) {
  const [expandedStepId, setExpandedStepId] = useState<string | null>(null);

  if (!run || steps.length === 0) return null;

  // Compile active workflow node color matches - customized for Editorial Monochrome/Slate
  const getNodeColor = (status: string, state: string) => {
    if (state === StepState.WAITING_APPROVAL) return "border-white bg-white/5 text-white";
    if (status === "running") return "border-white/80 bg-white/10 text-white font-bold";
    if (status === "completed") return "border-white/20 bg-transparent text-[#a3a3a3]";
    if (status === "failed") return "border-white bg-[#1a1a1a] text-white";
    return "border-white/10 bg-[#121212] text-neutral-500";
  };

  const getStatusIndicator = (status: string, state: string) => {
    if (state === StepState.WAITING_APPROVAL) {
      return (
        <span className="flex items-center gap-1 text-[9px] text-white font-sans font-bold uppercase tracking-widest animate-pulse">
          PENDING CONSENT
        </span>
      );
    }
    if (status === "running") {
      return (
        <span className="flex items-center gap-1.5 text-[9px] text-white font-sans font-bold uppercase tracking-widest">
          <span className="w-1.5 h-1.5 rounded-full bg-white opacity-80 animate-ping"></span>
          WORKING
        </span>
      );
    }
    if (status === "completed") {
      return (
        <span className="flex items-center gap-1.5 text-[9px] text-[#737373] font-sans uppercase tracking-widest">
          COMPLETE
        </span>
      );
    }
    if (status === "failed") {
      return (
        <span className="flex items-center gap-1.5 text-[9px] text-white font-sans uppercase tracking-widest bg-red-800/10 px-1 border border-red-500/20">
          ABORTED
        </span>
      );
    }
    return <span className="text-[9px] text-[#737373] font-mono tracking-widest">STANDBY</span>;
  };

  return (
    <div className="border border-white/10 rounded-none bg-[#121212] p-5 mb-5 shadow-sm animate-slide-in">
      {/* HEADER SECTION */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-sans font-bold text-white uppercase tracking-[0.25em] flex items-center gap-2">
            NEVA.ORCHESTRATOR FLIGHT-DECK DAG <span className="text-white/30">|</span> MODE: {run.mode.toUpperCase()}
          </span>
        </div>
        <div className="flex items-center gap-4 text-[9px] font-mono text-[#737373] tracking-widest">
          <span>COGNITIVE RUN: <span className="text-white font-bold">{run.id.slice(0, 8).toUpperCase()}</span></span>
          <span>COMPUTE CHARGES: <span className="text-white font-bold">${run.estimatedCostUsd.toFixed(5)}</span></span>
          <span>TOKENS: <span className="text-white font-bold">{run.totalTokens}</span></span>
        </div>
      </div>

      {/* HORIZONTAL DAG VISUALIZATION CANVAS */}
      <div className="relative py-6 overflow-x-auto flex items-center justify-start gap-4 scrollbar-thin">
        {/* Dynamic connection line tracker */}
        <div className="absolute inset-0 pointer-events-none z-0 px-8 py-10">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <line 
              x1="5%" y1="50%" x2="95%" y2="50%" 
              stroke="rgba(255, 255, 255, 0.05)" 
              strokeWidth="1.5" 
              strokeDasharray="2 3"
            />
          </svg>
        </div>

        {steps.map((st, idx) => {
          const isActive = st.status === "running";
          const nodeColor = getNodeColor(st.status, st.state);
          return (
            <div key={st.id} className="relative z-10 flex-1 min-w-[170px] max-w-[210px]">
              <div className={`p-3.5 rounded-none border flex flex-col justify-between h-28 cursor-pointer transition-all hover:border-white/40 ${nodeColor}`}
                onClick={() => setExpandedStepId(expandedStepId === st.id ? null : st.id)}
              >
                <div className="flex items-center justify-between border-b border-white/5 pb-1">
                  <div className="text-[8px] font-sans font-bold tracking-widest uppercase text-white/50">{st.agentKey}</div>
                  <Cpu className="w-3 h-3 opacity-40" />
                </div>
                <div className="text-[11px] font-serif font-bold italic leading-tight line-clamp-2 my-2 text-[#e5e5e5]">
                  {st.inputPreview || "Task initialized"}
                </div>
                <div className="flex items-center justify-between border-t border-white/5 pt-1.5">
                  {getStatusIndicator(st.status, st.state)}
                  {expandedStepId === st.id ? <ChevronUp className="w-3.5 h-3.5 opacity-40" /> : <ChevronDown className="w-3.5 h-3.5 opacity-40" />}
                </div>
              </div>

              {/* STAGE LINK INDICATOR */}
              {idx < steps.length - 1 && (
                <div className="absolute top-[40%] -right-3 pointer-events-none z-20">
                  <div className="w-2.5 h-2.5 rotate-45 border-t border-r border-white/20"></div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* DISCLOSURE DETAILS POPUP FOR SELECTED STEPS */}
      {expandedStepId && (() => {
        const selected = steps.find(item => item.id === expandedStepId);
        if (!selected) return null;
        return (
          <div className="mt-2 p-4 rounded-none bg-[#0d0d0d] border border-white/10 text-[10px] font-mono text-[#a3a3a3] grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in relative z-20">
            <div>
              <div className="font-sans font-bold uppercase tracking-[0.15em] text-white text-[9px] mb-1.5">ROUTING SPEC DETAILS</div>
              <div className="space-y-1 mb-3 text-[10px]">
                <div>NODE CAPABILITY: <span className="text-white">{selected.agentKey}</span></div>
                <div>STATE CLOCK: <span className="text-white">{selected.state}</span></div>
                <div>OPTIMIZED MODEL: <span className="text-white">{selected.modelUsed}</span></div>
                <div>ACTIVE CONDUIT: <span className="text-white">{selected.tool || "STANDBY"}</span></div>
              </div>
              <div className="font-sans font-bold uppercase tracking-[0.15em] text-white text-[9px] mb-1.5">INGEST METHOD PARAMETERS</div>
              <pre className="p-2.5 rounded-none bg-white/5 text-[9px] text-white overflow-x-auto max-h-[85px]">
                {JSON.stringify(selected.toolInput || {}, null, 2)}
              </pre>
            </div>
            <div>
              <div className="font-sans font-bold uppercase tracking-[0.15em] text-white text-[9px] mb-1.5">RESULT CAPTURE TRACE</div>
              <pre className="p-2.5 rounded-none bg-white/5 text-[9px] text-[#a3a3a3] overflow-x-auto max-h-[85px] mb-2">
                {JSON.stringify(selected.toolOutput || { status: "Awaiting channel payload..." }, null, 2)}
              </pre>
              <div className="text-[9px] text-[#737373] flex items-center justify-between tracking-wide">
                <span>TIMESTAMP: {new Date(selected.startedAt).toLocaleTimeString()}</span>
                <span>STATUS: {selected.status.toUpperCase()}</span>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
