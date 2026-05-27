import { useState, useEffect } from "react";
import { useApp } from "../AppContext";
import { Cpu, Network, Zap, HelpCircle } from "lucide-react";

interface Node {
  id: string;
  label: string;
  kind: "system" | "memory" | "skills" | "workspace" | "agent" | "tool" | "model";
  x: number;
  y: number;
}

interface Edge {
  fromNodeId: string;
  toNodeId: string;
  relation: string;
  weight: number;
}

export default function KnowledgeGraph() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>("n1");

  useEffect(() => {
    const fetchGraph = async () => {
      try {
        const res = await fetch("/api/knowledge-graph");
        const data = await res.json();
        setNodes(data.nodes);
        setEdges(data.edges);
      } catch (err) {
        console.error("Failed to load knowledge metrics: ", err);
      }
    };
    fetchGraph();
  }, []);

  // Premium editorial color index mapping
  const getNodeColor = (kind: string) => {
    switch (kind) {
      case "system": return "#ffffff"; // pure white
      case "memory": return "#c5a880"; // antique gold
      case "skills": return "#a3a3a3"; // silver-gray
      case "workspace": return "#e5e5e5"; // light-gray
      case "agent": return "#737373"; // mid-gray
      default: return "#525252";
    }
  };

  const selectedNode = nodes.find(item => item.id === selectedNodeId);

  return (
    <div className="border border-white/10 bg-[#121212] rounded-none p-5 flex flex-col justify-between h-full relative select-none animate-fade-in overflow-hidden">
      {/* HEADER SECTION */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <Network className="w-4 h-4 text-white/80" />
          <span className="text-[10px] uppercase font-sans tracking-[0.2em] text-white font-bold">
            Interactive Cognitive Knowledge Network Graph
          </span>
        </div>
        <div className="text-[9px] text-[#737373] tracking-[0.15em] font-sans font-bold flex items-center gap-1.5 bg-white/5 px-2 py-0.5 border border-white/10 rounded-none">
          <span>COGNITIVE LAYER SYSTEM</span>
          <div className="w-1.5 h-1.5 rounded-full bg-white opacity-40"></div>
        </div>
      </div>

      {/* GRAPH CANVAS WRAPPER */}
      <div className="flex-1 w-full relative min-h-[380px] bg-[#0d0d0d] rounded-none p-2 mt-3 overflow-hidden border border-white/10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"></div>

        {/* Dynamic Nodes and Connection vectors on SVG canvas */}
        <svg className="absolute inset-0 w-full h-full animate-fade-in" style={{ minHeight: "385px" }}>
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="15" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="rgba(255, 255, 255, 0.4)" />
            </marker>
          </defs>

          {/* Render connection links */}
          {edges.map((ed, idx) => {
            const sourceNode = nodes.find(n => n.id === ed.fromNodeId);
            const targetNode = nodes.find(n => n.id === ed.toNodeId);
            if (!sourceNode || !targetNode) return null;
            return (
              <g key={idx}>
                <line
                  x1={sourceNode.x}
                  y1={sourceNode.y}
                  x2={targetNode.x}
                  y2={targetNode.y}
                  stroke="rgba(255, 255, 255, 0.12)"
                  strokeWidth={ed.weight * 1.5}
                  strokeDasharray="1 3"
                  markerEnd="url(#arrow)"
                />
                {/* Connection textual label in between nodes */}
                <text
                  x={(sourceNode.x + targetNode.x) / 2}
                  y={(sourceNode.y + targetNode.y) / 2 - 5}
                  fill="rgba(115, 115, 115, 0.7)"
                  fontSize="8px"
                  fontFamily="JetBrains Mono"
                  textAnchor="middle"
                >
                  {ed.relation}
                </text>
              </g>
            );
          })}

          {/* Render node circles */}
          {nodes.map(nd => {
            const color = getNodeColor(nd.kind);
            const isSelected = selectedNodeId === nd.id;
            return (
              <g 
                key={nd.id} 
                className="cursor-pointer group"
                onClick={() => setSelectedNodeId(nd.id)}
              >
                <circle
                  cx={nd.x}
                  cy={nd.y}
                  r={isSelected ? 8 : 5}
                  fill={color}
                  stroke={isSelected ? "white" : "rgba(13, 13, 13, 1)"}
                  strokeWidth="2"
                  className="transition-all duration-300"
                />
                <text
                  x={nd.x}
                  y={nd.y + 18}
                  fill={isSelected ? "#white" : "rgba(163, 163, 163, 0.8)"}
                  fontSize="8px"
                  fontFamily="JetBrains Mono"
                  fontWeight={isSelected ? "bold" : "normal"}
                  textAnchor="middle"
                  className="transition-all tracking-wider"
                >
                  {nd.label}
                </text>
              </g>
            );
          })}
        </svg>

        {/* NODE PROPERTY SPEC SHEET LAYOUT OVERLAY */}
        {selectedNode && (
          <div className="absolute bottom-3 left-3 right-3 p-4 rounded-none bg-[#121212] border border-white/15 text-xs font-mono text-[#a3a3a3] flex items-start gap-4 animate-slide-in shadow-xl">
            <div className="w-8 h-8 rounded-none bg-[#0d0d0d] border border-white/10 flex items-center justify-center text-sm">
              ▪
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center text-[9px] mb-1">
                <span className="text-white font-sans font-bold tracking-widest uppercase">COGNITIVE INDEX SPECTRAL [ACTIVE]</span>
                <span className="text-neutral-500 font-mono">ID: {selectedNode.id}</span>
              </div>
              <div className="font-serif font-bold italic text-white text-xs mb-1">{selectedNode.label}</div>
              <p className="text-[10px] text-[#737373] leading-relaxed font-body">This node represents an active conceptual anchor within the unified neural repository. Relational vectors project system state guidelines to prevent processing errors.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
