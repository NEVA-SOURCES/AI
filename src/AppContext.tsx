import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Workspace, Project, Conversation, Message, CapabilityProfile, AgentRun, AgentStep, Memory, Skill, FileItem, AgentPoll, AgentApproval, OutputItem, LogEvent, StepState } from "./types";
import { OPENROUTER_MODELS, OpenRouterModel } from "./data/models";

interface AppContextType {
  workspaces: Workspace[];
  activeWorkspace: Workspace | null;
  projects: Project[];
  conversations: Conversation[];
  activeConversation: Conversation | null;
  messages: Message[];
  profiles: CapabilityProfile[];
  skills: Skill[];
  memories: Memory[];
  files: FileItem[];
  runs: AgentRun[];
  steps: AgentStep[];
  polls: AgentPoll[];
  approvals: AgentApproval[];
  outputs: OutputItem[];
  logs: LogEvent[];
  stats: any;
  modelSelected: string;
  setModelSelected: (m: string) => void;
  missionModeActive: boolean;
  setMissionModeActive: (active: boolean) => void;
  isInspectorCollapsed: boolean;
  setIsInspectorCollapsed: (collapsed: boolean) => void;
  commandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;
  thinkingEnabled: boolean;
  setThinkingEnabled: (enabled: boolean) => void;
  searchEnabled: boolean;
  setSearchEnabled: (enabled: boolean) => void;
  customModels: OpenRouterModel[];
  allModels: OpenRouterModel[];
  addCustomModel: (model: OpenRouterModel) => void;
  deleteCustomModel: (id: string) => void;
  
  // Handlers
  switchWorkspace: (id: string) => void;
  switchConversation: (id: string) => void;
  addWorkspace: (name: string, description: string, icon: string) => Promise<Workspace>;
  createMission: (title: string, mode: any) => Promise<Conversation>;
  renameConversation: (id: string, title: string) => Promise<void>;
  deleteConversation: (id: string) => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
  answerPoll: (pollId: string, answer: any) => Promise<void>;
  resolveApproval: (approvalId: string, resolution: "approved" | "denied" | "modified", modifiedPayload?: any) => Promise<void>;
  addMemory: (content: string, kind: any) => Promise<void>;
  forgetMemory: (id: string) => Promise<void>;
  uploadFile: (name: string, size: number, type: string) => Promise<void>;
  createProfile: (data: Partial<CapabilityProfile>) => Promise<void>;
  createSkill: (name: string, slug: string, description: string, category: string) => Promise<void>;
  triggerReFetch: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [activeWorkspace, setActiveWorkspace] = useState<Workspace | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [profiles, setProfiles] = useState<CapabilityProfile[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [runs, setRuns] = useState<AgentRun[]>([]);
  const [steps, setSteps] = useState<AgentStep[]>([]);
  const [polls, setPolls] = useState<AgentPoll[]>([]);
  const [approvals, setApprovals] = useState<AgentApproval[]>([]);
  const [outputs, setOutputs] = useState<OutputItem[]>([]);
  const [logs, setLogs] = useState<LogEvent[]>([]);
  const [stats, setStats] = useState<any>({
    totalMissions: 0,
    filesIndexed: 0,
    memoriesRegistered: 0,
    skillsAvailable: 0,
    tokenUsage: 0,
    estimatedCostUsd: 0,
  });

  const [modelSelected, setModelSelected] = useState("google/gemini-3.5-flash");
  const [missionModeActive, setMissionModeActive] = useState(false);
  const [isInspectorCollapsed, setIsInspectorCollapsed] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [refreshCount, setRefreshCount] = useState(0);

  const [thinkingEnabled, setThinkingEnabled] = useState<boolean>(() => {
    return localStorage.getItem("neva_thinking_enabled") === "true";
  });
  const [searchEnabled, setSearchEnabled] = useState<boolean>(() => {
    return localStorage.getItem("neva_search_enabled") === "true";
  });

  useEffect(() => {
    localStorage.setItem("neva_thinking_enabled", String(thinkingEnabled));
  }, [thinkingEnabled]);

  useEffect(() => {
    localStorage.setItem("neva_search_enabled", String(searchEnabled));
  }, [searchEnabled]);

  const [customModels, setCustomModels] = useState<OpenRouterModel[]>(() => {
    try {
      const stored = localStorage.getItem("custom_openrouter_models");
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error("Failed to parse custom models from local storage:", e);
      return [];
    }
  });

  const allModels = [...OPENROUTER_MODELS, ...customModels];

  const addCustomModel = (model: OpenRouterModel) => {
    setCustomModels(prev => {
      const updated = [...prev.filter(m => m.id !== model.id), model];
      localStorage.setItem("custom_openrouter_models", JSON.stringify(updated));
      return updated;
    });
  };

  const deleteCustomModel = (id: string) => {
    setCustomModels(prev => {
      const updated = prev.filter(m => m.id !== id);
      localStorage.setItem("custom_openrouter_models", JSON.stringify(updated));
      return updated;
    });
  };

  const triggerReFetch = () => setRefreshCount(prev => prev + 1);

  // Fetch initial base entities
  useEffect(() => {
    const fetchBase = async () => {
      try {
        const resW = await fetch("/api/workspaces");
        const wData = await resW.json();
        setWorkspaces(wData);
        if (wData.length > 0 && !activeWorkspace) {
          setActiveWorkspace(wData[0]);
        }

        const resP = await fetch("/api/projects");
        setProjects(await resP.json());

        const resC = await fetch("/api/conversations");
        const cData = await resC.json();
        setConversations(cData);
        if (cData.length > 0 && !activeConversation) {
          setActiveConversation(cData[0]);
        }

        // Stats
        const resStats = await fetch("/api/metrics");
        setStats(await resStats.json());

        // Panels options
        const resProfiles = await fetch("/api/profiles");
        setProfiles(await resProfiles.json());

        const resSkills = await fetch("/api/skills");
        setSkills(await resSkills.json());

        const resMemories = await fetch("/api/memories");
        setMemories(await resMemories.json());

        const resFiles = await fetch("/api/files");
        setFiles(await resFiles.json());

        const resOutputs = await fetch("/api/outputs");
        setOutputs(await resOutputs.json());

        // Approvals & Polls
        const resApprovals = await fetch("/api/approvals");
        setApprovals(await resApprovals.json());

        const resPolls = await fetch("/api/polls");
        setPolls(await resPolls.json());
      } catch (err) {
        console.error("Error fetching operational database values: ", err);
      }
    };
    fetchBase();
  }, [refreshCount]);

  // Fetch conversation-specific items (messages, runs, steps, logs)
  useEffect(() => {
    if (!activeConversation || !activeConversation.id) return;
    const rawId = String(activeConversation.id).trim();
    if (!rawId || rawId === "undefined" || rawId === "null" || rawId.includes("[object")) return;

    const fetchConvDetails = async () => {
      const targetId = String(activeConversation?.id || "").trim();
      if (!targetId || targetId === "undefined" || targetId === "null" || targetId.includes("[object")) {
        return;
      }
      // Safely encode dynamic ID parameter
      const convId = encodeURIComponent(targetId);

      // 1. Fetch & set messages
      try {
        const resM = await fetch(`/api/conversations/${convId}/messages`);
        if (!resM.ok) {
          throw new Error(`HTTP error fetching messages! Status: ${resM.status}`);
        }
        const messagesData = await resM.json();
        try {
          setMessages(messagesData);
        } catch (err: any) {
          console.error("setMessages rendering/state update error: ", err, err?.stack);
        }
      } catch (err: any) {
        console.error("Fetch/parse messages API error: ", err, err?.stack);
      }

      // 2. Fetch & set runs
      let runsData: any[] = [];
      try {
        const resRuns = await fetch(`/api/conversations/${convId}/runs`);
        if (!resRuns.ok) {
          throw new Error(`HTTP error fetching runs! Status: ${resRuns.status}`);
        }
        runsData = await resRuns.json();
        try {
          setRuns(runsData);
        } catch (err: any) {
          console.error("setRuns rendering/state update error: ", err, err?.stack);
        }
      } catch (err: any) {
        console.error("Fetch/parse runs API error: ", err, err?.stack);
      }

      // 3. Fetch & set steps
      try {
        if (runsData && runsData.length > 0) {
          const latestRun = runsData[runsData.length - 1];
          if (latestRun && latestRun.id) {
            const runId = encodeURIComponent(String(latestRun.id));
            const resSteps = await fetch(`/api/runs/${runId}/steps`);
            if (!resSteps.ok) {
              throw new Error(`HTTP error fetching steps! Status: ${resSteps.status}`);
            }
            const stepsData = await resSteps.json();
            try {
              setSteps(stepsData);
            } catch (err: any) {
              console.error("setSteps rendering/state update error: ", err, err?.stack);
            }
          } else {
            setSteps([]);
          }
        } else {
          setSteps([]);
        }
      } catch (err: any) {
        console.error("Fetch/parse steps API error: ", err, err?.stack);
      }

      // 4. Fetch & set logs
      try {
        const resLogs = await fetch("/api/logs");
        if (!resLogs.ok) {
          throw new Error(`HTTP error fetching logs! Status: ${resLogs.status}`);
        }
        const logsData = await resLogs.json();
        try {
          setLogs(logsData);
        } catch (err: any) {
          console.error("setLogs rendering/state update error: ", err, err?.stack);
        }
      } catch (err: any) {
        console.error("Fetch/parse logs API error: ", err, err?.stack);
      }
    };

    fetchConvDetails();
    // Poll updates every 2 seconds to capture live agent runs moving state
    const interval = setInterval(fetchConvDetails, 2000);
    return () => clearInterval(interval);
  }, [activeConversation, refreshCount]);

  // Actions
  const switchWorkspace = (id: string) => {
    const w = workspaces.find(item => item.id === id);
    if (w) setActiveWorkspace(w);
  };

  const switchConversation = (id: string) => {
    const c = conversations.find(orig => orig.id === id);
    if (c) setActiveConversation(c);
  };

  const addWorkspace = async (name: string, description: string, icon: string) => {
    const res = await fetch("/api/workspaces", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description, icon }),
    });
    const ws = await res.json();
    setWorkspaces(prev => [...prev, ws]);
    setActiveWorkspace(ws);
    triggerReFetch();
    return ws;
  };

  const createMission = async (title: string, mode: any) => {
    const res = await fetch("/api/conversations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        workspaceId: activeWorkspace?.id || "w1",
        title,
        mode,
        tags: [mode.toUpperCase(), "LIVE"],
      }),
    });
    const mission = await res.json();
    setConversations(prev => [mission, ...prev]);
    setActiveConversation(mission);
    triggerReFetch();
    return mission;
  };

  const renameConversation = async (id: string, title: string) => {
    await fetch(`/api/conversations/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    setConversations(prev => 
      prev.map(c => c.id === id ? { ...c, title } : c)
    );
    if (activeConversation?.id === id) {
      setActiveConversation(prev => prev ? { ...prev, title } : null);
    }
    triggerReFetch();
  };

  const deleteConversation = async (id: string) => {
    await fetch(`/api/conversations/${id}`, {
      method: "DELETE",
    });
    setConversations(prev => prev.filter(c => c.id !== id));
    if (activeConversation?.id === id) {
      const remaining = conversations.filter(c => c.id !== id);
      if (remaining.length > 0) {
        setActiveConversation(remaining[0]);
      } else {
        setActiveConversation(null);
      }
    }
    triggerReFetch();
  };

  const sendMessage = async (content: string) => {
    if (!activeConversation) return;

    // Create optimistic user message
    const optimMsg: Message = {
      id: "optim_" + Math.random().toString(36).substring(7),
      conversationId: activeConversation.id,
      role: "user",
      content,
      createdAt: new Date().toISOString(),
    };
    setMessages(prev => [...prev, optimMsg]);

    const openRouterApiKey = localStorage.getItem("openrouter_api_key") || "";

    if (thinkingEnabled) {
      // 2. Setup dynamic placeholder for assistant thinking message
      const asstTempId = "thinking_" + Math.random().toString(36).substring(7);
      const tempAsstMsg: Message = {
        id: asstTempId,
        conversationId: activeConversation.id,
        role: "assistant",
        content: "",
        thinkingTrace: "",
        isThinking: true,
        steps: [],
        createdAt: new Date().toISOString()
      };
      setMessages(prev => [...prev, tempAsstMsg]);

      try {
        const response = await fetch("/api/chat/stream", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            conversationId: activeConversation.id,
            content,
            workspaceId: activeWorkspace?.id || "w1",
            modelSelected,
            missionModeActive,
            openRouterApiKey,
            thinkingEnabled,
            searchEnabled
          })
        });

        if (!response.body) throw new Error("Null stream response body");
        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");
        let buffer = "";

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const parts = buffer.split("\n\n");
          buffer = parts.pop() || "";

          for (const part of parts) {
            if (!part.trim()) continue;

            let currentEvent = "";
            let currentDataString = "";

            const lines = part.split("\n");
            for (const line of lines) {
              if (line.startsWith("event:")) {
                currentEvent = line.replace("event:", "").trim();
              } else if (line.startsWith("data:")) {
                currentDataString = line.replace("data:", "").trim();
              }
            }

            if (!currentDataString) continue;

            try {
              const payload = JSON.parse(currentDataString);

              if (currentEvent === "thinking_start") {
                const initSteps = (payload.plan?.steps || []).map((s: any) => ({
                  id: s.id,
                  runId: payload.runId,
                  agentKey: s.agent,
                  status: "pending" as const,
                  state: s.state || StepState.PLANNING,
                  startedAt: new Date().toISOString(),
                  reasoningTrace: ""
                }));
                setMessages(prev => prev.map(m => m.id === asstTempId ? { ...m, steps: initSteps } : m));
              } 
              else if (currentEvent === "step_update") {
                const updatedStep = payload.step;
                setMessages(prev => prev.map(m => {
                  if (m.id === asstTempId) {
                    const currentSteps = m.steps || [];
                    const exists = currentSteps.find(s => s.id === updatedStep.id);
                    let newSteps;
                    if (exists) {
                      newSteps = currentSteps.map(s => s.id === updatedStep.id ? { ...s, ...updatedStep, status: "running" as const } : s);
                    } else {
                      newSteps = [...currentSteps, { ...updatedStep, status: "running" as const }];
                    }
                    return { ...m, steps: newSteps };
                  }
                  return m;
                }));
              }
              else if (currentEvent === "step_thinking_chunk") {
                const { stepId, chunk } = payload;
                setMessages(prev => prev.map(m => {
                  if (m.id === asstTempId) {
                    const newSteps = (m.steps || []).map(s => {
                      if (s.id === stepId) {
                        return { ...s, reasoningTrace: (s.reasoningTrace || "") + chunk };
                      }
                      return s;
                    });
                    return { ...m, steps: newSteps };
                  }
                  return m;
                }));
              }
              else if (currentEvent === "step_complete") {
                const completedStep = payload.step;
                setMessages(prev => prev.map(m => {
                  if (m.id === asstTempId) {
                    const newSteps = (m.steps || []).map(s => {
                      if (s.id === completedStep.id) {
                        return { ...s, ...completedStep, status: "completed" as const };
                      }
                      return s;
                    });
                    return { ...m, steps: newSteps };
                  }
                  return m;
                }));
              }
              else if (currentEvent === "final_response") {
                const resMessage = payload.message;
                setMessages(prev => prev.map(m => m.id === asstTempId ? {
                  ...m,
                  id: resMessage.id,
                  content: resMessage.content,
                  isThinking: false,
                  modelUsed: resMessage.modelUsed,
                  thinkingTrace: resMessage.thinkingTrace,
                  steps: resMessage.steps || m.steps
                } : m));
              }
            } catch (pErr) {
              console.error("SSE parse exception inside event stream loop:", pErr);
            }
          }
        }
        triggerReFetch();
      } catch (streamErr) {
        console.error("Stream reader execution failed, falling back to synchronous fetch:", streamErr);
        // Fallback
        setMessages(prev => prev.filter(m => m.id !== asstTempId));
        await sendFallbackSyncMessage(content);
      }
    } else {
      await sendFallbackSyncMessage(content);
    }
  };

  const sendFallbackSyncMessage = async (content: string) => {
    try {
      const openRouterApiKey = localStorage.getItem("openrouter_api_key") || "";
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: activeConversation.id,
          content,
          workspaceId: activeWorkspace?.id || "w1",
          modelSelected,
          missionModeActive,
          openRouterApiKey,
          thinkingEnabled,
          searchEnabled,
        }),
      });
      await res.json();
      triggerReFetch();
    } catch (err) {
      console.error("Failed to post message telemetry: ", err);
    }
  };

  const answerPoll = async (pollId: string, answer: any) => {
    await fetch(`/api/polls/${pollId}/answer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answer }),
    });
    triggerReFetch();
  };

  const resolveApproval = async (approvalId: string, resolution: "approved" | "denied" | "modified", modifiedPayload?: any) => {
    await fetch(`/api/approvals/${approvalId}/resolve`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resolution, modifiedPayload }),
    });
    triggerReFetch();
  };

  const addMemory = async (content: string, kind: any) => {
    await fetch("/api/memories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, kind, workspaceId: activeWorkspace?.id }),
    });
    triggerReFetch();
  };

  const forgetMemory = async (id: string) => {
    await fetch(`/api/memories/${id}`, { method: "DELETE" });
    triggerReFetch();
  };

  const uploadFile = async (name: string, size: number, type: string) => {
    await fetch("/api/files/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, size, type }),
    });
    triggerReFetch();
  };

  const createProfile = async (data: Partial<CapabilityProfile>) => {
    await fetch("/api/profiles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    triggerReFetch();
  };

  const createSkill = async (name: string, slug: string, description: string, category: string) => {
    await fetch("/api/skills", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, slug, description, category }),
    });
    triggerReFetch();
  };

  return (
    <AppContext.Provider
      value={{
        workspaces,
        activeWorkspace,
        projects,
        conversations,
        activeConversation,
        messages,
        profiles,
        skills,
        memories,
        files,
        runs,
        steps,
        polls,
        approvals,
        outputs,
        logs,
        stats,
        modelSelected,
        setModelSelected,
        missionModeActive,
        setMissionModeActive,
        isInspectorCollapsed,
        setIsInspectorCollapsed,
        commandPaletteOpen,
        setCommandPaletteOpen,
        thinkingEnabled,
        setThinkingEnabled,
        searchEnabled,
        setSearchEnabled,
        customModels,
        allModels,
        addCustomModel,
        deleteCustomModel,
        switchWorkspace,
        switchConversation,
        addWorkspace,
        createMission,
        renameConversation,
        deleteConversation,
        sendMessage,
        answerPoll,
        resolveApproval,
        addMemory,
        forgetMemory,
        uploadFile,
        createProfile,
        createSkill,
        triggerReFetch,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used inside operational AppProvider context");
  return context;
}
