// === THEME UPDATE === Complete Redesign of ThinkingStream to Minimal Solid Dark Aesthetic
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
    <div className="bg-[#0f0f0f] border border-white/[0.06] rounded-2xl p-5 my-4 text-left shadow-md relative overflow-hidden">
      {/* Header section with minimal styling */}
      <div className="flex items-center justify-between mb-4 border-b border-white/[0.04] pb-3">
        <div className="flex items-center gap-2">
          <span className="relative flex h-1.5 w-1.5">
            {isStreaming && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22d3ee] opacity-75"></span>
            )}
            <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${isStreaming ? "bg-[#22d3ee]" : "bg-[#444444]"}`}></span>
          </span>
          <span className="text-[10px] font-mono tracking-wider font-semibold uppercase text-[#a0a0a0]">
            {isStreaming ? "NEVA Multi-Agent Synthesizer Running..." : "NEVA Coagent Reasoning Narrative Compiled"}
          </span>
        </div>
        
        {isStreaming && (
          <div className="flex items-center gap-1.5 text-[9px] font-mono bg-[rgba(34,211,238,0.06)] text-[#22d3ee] px-2.5 py-0.5 rounded-lg border border-[rgba(34,211,238,0.12)] font-semibold">
            <Loader2 className="w-2.5 h-2.5 animate-spin" />
            <span>Active Stream</span>
          </div>
        )}
      </div>

      {/* Steps List */}
      <div className="relative pl-6 space-y-4">
        {/* Subtle, standard vertical line on left side */}
        <div className="absolute left-[11px] top-2 bottom-2 w-[1px] bg-white/[0.06] rounded-full" />

        <AnimatePresence initial={false}>
          {steps.map((step, index) => {
            const IconComponent = getStepIcon(step.agentKey);
            const isExpanded = !!expandedSteps[step.id];
            
            const isRunning = step.status === "running";
            const isDone = step.status === "completed";
            const isFailed = step.status === "failed";
            
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
                transition={{ duration: 0.25, delay: index * 0.05 }}
                className={`group select-none rounded-xl p-3 border border-transparent transition-all ${
                  isRunning 
                    ? "border-l-2 !border-l-[#22d3ee] bg-[rgba(34,211,238,0.03)] border-white/[0.04]" 
                    : isDone
                      ? "border-l-2 !border-l-[#10b981] bg-[#141414]/40" 
                      : "bg-[#141414]/30"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div 
                    onClick={() => toggleExpand(step.id)}
                    className="flex-1 flex gap-3 cursor-pointer items-start"
                  >
                    <div className="relative flex items-center justify-center shrink-0 mt-0.5 z-10">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-300 ${
                        isRunning 
                          ? "bg-[rgba(34,211,238,0.06)] border border-[#22d3ee]/30 text-[#22d3ee]"
                          : isDone
                            ? "bg-[rgba(16,185,129,0.06)] border border-[#10b981]/30 text-[#10b981]"
                            : isFailed
                              ? "bg-rose-950/20 border border-rose-500/30 text-rose-400"
                              : "bg-[#1a1a1a] border border-white/[0.04] text-[#666666]"
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

                    <div className="min-w-0 flex-1">
                      <h4 className={`text-xs font-semibold ${
                        isRunning 
                          ? "text-[#22d3ee]" 
                          : isDone 
                            ? "text-white" 
                            : isFailed 
                              ? "text-rose-400" 
                              : "text-[#666666]"
                      }`}>
                        {(step as any).title || getAgentTitle(step.agentKey)}
                      </h4>
                      <p className="text-[10px] text-[#666666] mt-0.5 truncate max-w-sm">
                        {statusText}
                      </p>
                    </div>
                  </div>

                  <button 
                    onClick={() => toggleExpand(step.id)}
                    className="p-1 rounded hover:bg-white/5 text-[#666666] hover:text-white transition-all cursor-pointer transform shrink-0 mt-0.5"
                  >
                    <ChevronRight className={`w-3.5 h-3.5 transition-all duration-300 ${isExpanded ? "rotate-90 text-[#22d3ee]" : ""}`} />
                  </button>
                </div>

                <AnimatePresence initial={false}>
                  {isExpanded && (step.reasoningTrace || step.toolOutput) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden mt-2 ml-8 text-left"
                    >
                      <div className="font-mono text-xs leading-relaxed text-[#666666] bg-[#0a0a0a] p-3 rounded-lg border border-white/[0.04] select-text whitespace-pre-wrap max-h-52 overflow-y-auto scrollbar-thin">
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

      {allCompleted && (
        <div className="mt-4 pt-3 border-t border-white/[0.04] flex items-center justify-center gap-3">
          <div className="h-[1px] bg-white/[0.04] flex-1" />
          <span className="text-[8px] font-mono uppercase text-[#444444] tracking-widest font-semibold">─── Coagent Execution Pipeline Response Complete ───</span>
          <div className="h-[1px] bg-white/[0.04] flex-1" />
        </div>
      )}
    </div>
  );
}
