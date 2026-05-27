/**
 * NEVA AI Types and Interfaces
 */

export enum RunStatus {
  RUNNING = "running",
  COMPLETED = "completed",
  FAILED = "failed",
  CANCELLED = "cancelled",
}

export enum StepState {
  IDLE = "IDLE",
  PLANNING = "PLANNING",
  ANALYZING = "ANALYZING",
  RESEARCHING = "RESEARCHING",
  EXECUTING = "EXECUTING",
  WAITING_APPROVAL = "WAITING_APPROVAL",
  RETRYING = "RETRYING",
  FAILED = "FAILED",
  COMPLETED = "COMPLETED",
}

export interface Workspace {
  id: string;
  name: string;
  description: string;
  icon: string;
  systemPromptOverride?: string;
  createdAt: string;
}

export interface Project {
  id: string;
  workspaceId: string;
  name: string;
  description: string;
  status: string;
  pinned: boolean;
  createdAt: string;
}

export interface Conversation {
  id: string;
  workspaceId: string;
  projectId?: string;
  title: string;
  mode: "chat" | "mission" | "research" | "code" | "analysis" | "creative";
  status: "active" | "running" | "completed";
  summary?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  role: "user" | "assistant" | "system";
  content: string;
  agentId?: string;
  modelUsed?: string;
  inputTokens?: number;
  outputTokens?: number;
  createdAt: string;
  toolCalls?: {
    id: string;
    name: string;
    arguments: any;
  }[];
  toolResults?: {
    id: string;
    result: any;
  }[];
  isThinking?: boolean;          // true while stream is live
  steps?: AgentStep[];             // live steps for ThinkingStream
  thinkingTrace?: string;        // compiled full trace after completion
}

export interface CapabilityProfile {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  systemPrompt: string;
  reasoningBehavior: "fast" | "balanced" | "deep" | "ultra-deep";
  executionStyle: "autonomous" | "supervised" | "collaborative";
  autonomyLevel: number; // 1-10
  verbosity: "silent" | "minimal" | "normal" | "verbose" | "debug";
  preferredModel: string;
  allowedTools: string[];
  isSystem: boolean;
  isPublic: boolean;
}

export interface AgentRun {
  id: string;
  conversationId: string;
  mode: "solo" | "pipeline" | "parallel" | "debate" | "mission";
  status: RunStatus;
  plan?: {
    objective: string;
    steps: { id: string; title: string; agent: string; status: string }[];
  };
  dag?: {
    nodes: { id: string; label: string; agent: string; x?: number; y?: number }[];
    edges: { source: string; target: string }[];
  };
  totalTokens: number;
  estimatedCostUsd: number;
  startedAt: string;
  finishedAt?: string;
}

export interface AgentStep {
  id: string;
  runId: string;
  agentKey: string;
  parentStepId?: string;
  capabilityProfileId?: string;
  tool?: string;
  toolInput?: any;
  toolOutput?: any;
  inputPreview?: string;
  outputPreview?: string;
  modelUsed?: string;
  status: "running" | "completed" | "failed" | "pending";
  state: StepState;
  reasoningTrace?: string;
  startedAt: string;
  finishedAt?: string;
  durationMs?: number;
  thinkingChunks?: string[];     // incremental thinking text pieces
  isExpanded?: boolean;            // UI state (optional, can be client-only)
}

export interface Memory {
  id: string;
  userId?: string;
  workspaceId: string;
  projectId?: string;
  conversationId?: string;
  kind: "short" | "long" | "project" | "preference" | "episodic" | "graph_node";
  content: string;
  metadata?: any;
  importanceScore: number;
  createdAt: string;
}

export interface Skill {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: "Research" | "Engineering" | "Writing" | "Data" | "AI";
  definition: any;
  isBuiltin: boolean;
  isPublic: boolean;
  usageCount: number;
  successRate: number;
}

export interface FileItem {
  id: string;
  workspaceId: string;
  projectId?: string;
  name: string;
  sizeBytes: number;
  mimeType: string;
  parseStatus: "pending" | "processing" | "done" | "failed";
  summary?: string;
  createdAt: string;
}

export interface AgentPoll {
  id: string;
  conversationId: string;
  runId: string;
  stepId: string;
  question: string;
  questionType: "single_choice" | "multi_choice" | "free_text" | "confirm";
  options: string[];
  answeredAt?: string;
  answer?: any;
}

export interface AgentApproval {
  id: string;
  runId: string;
  stepId: string;
  actionType: string;
  actionPayload: any;
  riskLevel: "low" | "medium" | "high" | "critical";
  requestedAt: string;
  resolvedAt?: string;
  resolution?: "approved" | "denied" | "modified";
  modifiedPayload?: any;
}

export interface OutputItem {
  id: string;
  workspaceId: string;
  conversationId: string;
  runId?: string;
  kind: "report" | "dashboard" | "chart" | "diagram" | "markdown" | "code" | "image" | "dataset";
  title: string;
  contentInline: string;
  metadata?: any;
  createdAt: string;
}

export interface KnowledgeNode {
  id: string;
  workspaceId: string;
  kind: string;
  label: string;
  properties?: any;
}

export interface KnowledgeEdge {
  id: string;
  workspaceId: string;
  fromNodeId: string;
  toNodeId: string;
  relation: string;
  weight: number;
}

export interface LogEvent {
  id: string;
  workspaceId: string;
  conversationId?: string;
  eventType: string;
  payload: any;
  createdAt: string;
}
