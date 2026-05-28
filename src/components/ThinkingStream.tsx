import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Target, Search, Code2, Scale, FileText, Brain, 
  ChevronRight, Check, X, Loader2 
} from "lucide-react";
import { AgentStep } from "../types";

interface ThinkingStreamProps {
  steps: AgentStep[];
  isStreaming: boolean;
  onStepClick?: (stepId: string) => void;
}

const getStepIcon = (agentKey: string) => {
  const key = (agentKey || "").toUpperCase();
  if (key.includes("PLANNER")) return Target;
  if (key.includes("RESEARCHER")) return Search;
  if (key.includes("ENGINEER")) return Code2;
  if (key.includes("CRITIC") || key.includes("SAFETY")) return Scale;
  if (key.includes("REPORTER")) return FileText;
  return Brain;
};

const getAgentTitle = (agentKey: string): string => {
  const key = (agentKey || "").toUpperCase();
  if (key.includes("PLANNER")) return "Query Deconstruction & strategic planning";
  if (key.includes("RESEARCHER")) return "Strategic Planning & Targeted Web Research";
  if (key.includes("ENGINEER")) return "Architecture & Code Generation Blueprint";
  if (key.includes("CRITIC")) return "Quality Audit and Code Review Checks";
  if (key.includes("REPORTER")) return "Final Assembly & Delivery";
  return agentKey;
};

export default function ThinkingStream({ steps = [], isStreaming, onStepClick }: ThinkingStreamProps) {
  const [expandedSteps, setExpandedSteps] = useState<Record<string, boolean>>({});

  // Auto-expand the currently running step
  useEffect(() => {
    const runningStep = steps.find(s => s.status === "running");
    if (runningStep) {
      setExpandedSteps(prev => ({
        ...prev,
        [runningStep.id]: true
      }));
    }
  }, [steps]);

  const toggleExpand = (stepId: string) => {
    setExpandedSteps(prev => ({
      ...prev,
      [stepId]: !prev[stepId]
    }));
    if (onStepClick) {
      onStepClick(stepId);
    }
  };

  if (!steps || steps.length === 0) return null;

  const allCompleted = steps.every(s => s.status === "completed" || s.status === "failed");

  return (
    <div className="glass-card bg-[#0b0c15]/75 border border-white/5 rounded-xl p-4 my-3 text-left shadow-2xl relative overflow-hidden">
      {/* Decorative cyber neon accents */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />
      
      {/* Header section */}
      <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-2">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            {isStreaming && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            )}
            <span className={`relative inline-flex rounded-full h-2 w-2 ${isStreaming ? "bg-cyan-400" : "bg-zinc-550"}`}></span>
          </span>
          <span className="text-[10px] font-mono tracking-wider font-extrabold uppercase text-zinc-400">
            {isStreaming ? "NEVA Multi-Agent Synthesizer Running..." : "NEVA Coagent Reasoning Narrative Compiled"}
          </span>
        </div>
        
        {isStreaming && (
          <div className="flex items-center gap-1 text-[9px] font-mono bg-cyan-950/40 text-cyan-400 px-2 py-0.5 rounded border border-cyan-500/10">
            <Loader2 className="w-2.5 h-2.5 animate-spin" />
            <span>Real-time stream</span>
          </div>
        )}
      </div>

      {/* Steps List */}
      <div className="relative pl-6 space-y-4">
        {/* The Timeline Vertical Line with subtle neon glow and anim flow */}
        <div 
          className={`absolute left-[11px] top-2 bottom-2 w-[2px] rounded-full transition-all duration-700 ${
            isStreaming 
              ? "bg-gradient-to-b from-cyan-400 via-purple-500 to-transparent bg-[length:100%_200%] animate-gradient-shift shadow-[0_0_10px_rgba(6,182,212,0.4)]" 
              : "bg-white/10"
          }`} 
        />

        <AnimatePresence initial={false}>
          {steps.map((step, index) => {
            const IconComponent = getStepIcon(step.agentKey);
            const isExpanded = !!expandedSteps[step.id];
            
            // Status calculations
            const isRunning = step.status === "running";
            const isDone = step.status === "completed";
            const isFailed = step.status === "failed";
            
            // Subtitle status narrative
            let statusText = step.outputPreview || "Awaiting thread dispatch...";
            if (isRunning) {
              statusText = step.inputPreview || "Parsing context frame metrics...";
            } else if (isFailed) {
              statusText = "Error during step synthesis";
            }

            return (
              <motion.div 
                key={step.id || index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25, delay: index * 0.1 }}
                className="group select-none"
              >
                <div className="flex items-start justify-between gap-3">
                  <div 
                    onClick={() => toggleExpand(step.id)}
                    className="flex-1 flex gap-3 cursor-pointer items-start"
                  >
                    {/* Circle icon with reactive state and glowing ring effects */}
                    <div className="relative flex items-center justify-center shrink-0 mt-0.5 z-10">
                      {isRunning && (
                        <div className="absolute inset-0 -m-1.5 rounded-full border border-cyan-400/40 animate-spin border-dashed duration-3000 pointer-events-none" />
                      )}
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-300 ${
                        isRunning 
                          ? "bg-cyan-950/40 border border-cyan-400 text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.6)] animate-pulse"
                          : isDone
                            ? "bg-emerald-950/30 border border-emerald-500/45 text-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.2)]"
                            : isFailed
                              ? "bg-rose-950/30 border border-rose-500/45 text-rose-400 shadow-[0_0_8px_rgba(239,68,68,0.2)]"
                              : "bg-zinc-900 border border-zinc-800 text-zinc-500"
                      }`}>
                        {isDone ? (
                          <Check className="w-3 h-3" />
                        ) : isFailed ? (
                          <X className="w-3 h-3" />
                        ) : (
                          <IconComponent className="w-3 h-3" />
                        )}
                      </div>
                    </div>

                    {/* Step details headings */}
                    <div className="min-w-0 flex-1">
                      <h4 className={`text-xs font-semibold ${
                        isRunning 
                          ? "text-cyan-300 font-bold" 
                          : isDone 
                            ? "text-zinc-200" 
                            : isFailed 
                              ? "text-rose-400" 
                              : "text-zinc-500"
                      }`}>
                        {(step as any).title || getAgentTitle(step.agentKey)}
                      </h4>
                      <p className="text-[10px] text-zinc-500 mt-0.5 truncate max-w-sm">
                        {statusText}
                      </p>
                    </div>
                  </div>

                  {/* Toggle expand control button */}
                  <button 
                    onClick={() => toggleExpand(step.id)}
                    className="p-1 rounded hover:bg-white/5 text-zinc-500 hover:text-zinc-300 transition-all cursor-pointer transform shrink-0 mt-0.5"
                  >
                    <ChevronRight className={`w-3.5 h-3.5 transition-all duration-300 ${isExpanded ? "rotate-90 text-cyan-400" : ""}`} />
                  </button>
                </div>

                {/* Expanded font-mono raw content block */}
                <AnimatePresence initial={false}>
                  {isExpanded && (step.reasoningTrace || step.toolOutput) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden mt-2 ml-8 text-left"
                    >
                      <div className="font-mono text-[9.5px] leading-relaxed text-zinc-400 bg-black/45 p-3 rounded-lg border border-white/5 select-text whitespace-pre-wrap max-h-52 overflow-y-auto scrollbar-thin">
                        {step.reasoningTrace || (typeof step.toolOutput === 'object' ? JSON.stringify(step.toolOutput, null, 2) : String(step.toolOutput))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Subtle completed responder response block delimiter */}
      {allCompleted && (
        <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-center gap-3">
          <div className="h-[1px] bg-white/5 flex-1" />
          <span className="text-[8px] font-mono uppercase text-zinc-650 tracking-widest font-bold">─── Coagent Execution Pipeline Final Response ───</span>
          <div className="h-[1px] bg-white/5 flex-1" />
        </div>
      )}
    </div>
  );
}
