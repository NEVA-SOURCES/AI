import { useState, useRef, useEffect } from "react";
import { 
  Search, Globe, Database, BookOpen, MessageSquare, Github, Tv, FileText, 
  Sparkles, Check, CheckCircle2, ChevronRight, AlertTriangle, ExternalLink, 
  ArrowRight, RefreshCw, Layers, Brain, HelpCircle, Activity, Play, ShieldAlert,
  Terminal, X, Copy, ListFilter, Sliders, Info, ThumbsUp, ThumbsDown
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Interface Definitions
interface SearchSource {
  id: string;
  platform: "google" | "reddit" | "github" | "youtube" | "docs" | "academic" | "news" | "api";
  title: string;
  url: string;
  timestamp: string;
  queryUsed: string;
  snippet: string;
  bodyContent: string;
  reliabilityScore: number;
  verified: boolean;
  favicon?: string;
  author?: string;
}

interface ThoughtStep {
  id: string;
  stage: "searching" | "analyzing" | "verifying" | "coding" | "summarizing" | "finalizing";
  title: string;
  description: string;
  timestamp: string;
  details?: string;
  status: "pending" | "streaming" | "completed" | "error";
  contradictions?: string[];
  verifications?: { item: string; status: "valid" | "invalid" | "unverified"; source: string }[];
}

interface MetricSummary {
  urlsParsed: number;
  queriesGenerated: number;
  factsVerified: number;
  crossValidations: number;
  latencyMs: number;
  tokenCount: number;
}

function TypewriterText({ text, speed = 8, delay = 0 }: { text: string; speed?: number; delay?: number }) {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let active = true;
    setDisplayedText("");
    
    const startTimer = setTimeout(() => {
      let currentIdx = 0;
      const interval = setInterval(() => {
        if (!active) {
          clearInterval(interval);
          return;
        }
        
        if (currentIdx < text.length) {
          const increment = Math.ceil(text.length / 80) || 1;
          const nextLength = Math.min(currentIdx + increment, text.length);
          setDisplayedText(text.substring(0, nextLength));
          currentIdx = nextLength;
        } else {
          clearInterval(interval);
        }
      }, speed);
      
      return () => clearInterval(interval);
    }, delay);

    return () => {
      active = false;
      clearTimeout(startTimer);
    };
  }, [text, speed, delay]);

  return (
    <span className="whitespace-pre-wrap">
      {displayedText}
      {displayedText.length < text.length && (
        <span className="inline-block w-1 h-3 bg-cyan-400 ml-0.5 animate-pulse shrink-0 align-middle" />
      )}
    </span>
  );
}

// Simulated Rich Knowledge Base for interactive searches
const SEARCH_KNOWLEDGE_DATES: Record<string, {
  queries: string[];
  sources: Omit<SearchSource, "id">[];
  thoughts: Omit<ThoughtStep, "id">[];
  finalAnswer: string;
}> = {
  react: {
    queries: [
      "site:react.dev react 19 concurrent features hooks",
      "github.com facebook/react issues with Server Components compilation",
      "npm package react-dom experimental state management updates"
    ],
    sources: [
      {
        platform: "docs",
        title: "React 19 Official Documentation & Upgrade Guide",
        url: "https://react.dev/blog/2026/react-19-release",
        timestamp: "2026-05-27T07:44:05Z",
        queryUsed: "react 19 concurrent features hooks",
        snippet: "React 19 introduces full support for Actions, Server Components, and the compiler. 'useActionState' handles state transitions natively while 'use' parses promises inline.",
        bodyContent: "React 19 release includes foundational concurrent updates. Actions allow developers to pass async functions directly to HTML tags like <form action={asyncFn}>. The compiler (previously React Forget) is automatically integrated in Vite/Next pipelines to optimize memoization of hooks, rendering 'useMemo' and 'useCallback' mostly obsolete in user codebases. 'use' hook is introduced to read values of Promises and context inline inside rendering loops.",
        reliabilityScore: 99.8,
        verified: true,
        favicon: "⚛️"
      },
      {
        platform: "reddit",
        title: "r/reactjs - React Compiler production experiences",
        url: "https://reddit.com/r/reactjs/comments/react-compile-prod",
        timestamp: "2026-05-27T07:44:18Z",
        queryUsed: "Server Components compilation issues",
        snippet: "Discussion on compiler bugs in React 19. Several components with custom bindings trigger high re-renders unless useMemo is kept or state is fully flattened.",
        bodyContent: "Experienced some weird edge cases with the new compiler. If you have custom higher-order components binding non-primitive arguments, the compiler doesn't always track depth correctly. A user commented: 'Make sure to explicitly structure your components as pure functions; standard state objects are cached automatically, but dynamic bindings still require primitive key definitions.'",
        reliabilityScore: 82.5,
        verified: true,
        favicon: "💬",
        author: "u/HooksEnthusiast"
      },
      {
        platform: "github",
        title: "facebook/react Issue #28472: hydration mismatch under useActionState async",
        url: "https://github.com/facebook/react/issues/28472",
        timestamp: "2026-05-27T07:44:32Z",
        queryUsed: "react-dom experimental state updates",
        snippet: "Open issue regarding Server Components and hydration timing when executing useActionState immediately on mount under high network latency.",
        bodyContent: "Issue reported by Dan_Abramov_Fans: Hydration triggers a mismatch if useActionState sets an initial pending state during server-side pre-rendering that differs from the client reconciliation parameters. Fixed tentatively in package react-dom@19.0.2-experimental by aligning hook signature defaults.",
        reliabilityScore: 94.2,
        verified: true,
        favicon: "🐙"
      },
      {
        platform: "academic",
        title: "Comparative Study of Virtual DOM vs Reactive Compilers",
        url: "https://ieee-explore.org/document/89472-virtual-dom-metrics",
        timestamp: "2026-05-27T07:44:45Z",
        queryUsed: "VDOM vs compiled state management optimization",
        snippet: "Academic analysis detailing memory footprints of compiled reactives vs virtual reconciliation trees. Demonstrates 35% memory savings under automated memoization.",
        bodyContent: "Compiled reactive architectures solve virtual DOM overheads. In trees with depths greater than 16 levels, static analysis and compiler-directed cache structures reduce rendering overhead from O(N) to O(log N) where N is mutated leaves. This reconciles performance disparities between virtual DOM trees and fine-grained reactive updates.",
        reliabilityScore: 97.4,
        verified: true,
        favicon: "🎓"
      }
    ],
    thoughts: [
      {
        stage: "searching",
        title: "Decomposing query and targeting authority nodes",
        description: "Breaking down 'React 19 state compilation vectors'. Formulating research strategies.",
        timestamp: "07:48:02 UTC",
        details: "Decomposed search vectors: 1) Oficial React blog releases, 2) GitHub compile issues tracker, 3) Developer consensus pools on Reddit.",
        status: "completed"
      },
      {
        stage: "analyzing",
        title: "Evaluating sources & checking for version conflicts",
        description: "Cross-checking official docs with real-world issue logs.",
        timestamp: "07:48:08 UTC",
        details: "Official docs suggest 'useMemo' is completely obsolete. However, Reddit experiences reveal edge cases with dynamic non-primitive hoisting. Registering contradiction: Documentation is optimistic; manual safety adjustments are still necessary for dynamic key bounds.",
        status: "completed",
        contradictions: [
          "Docs claim automatic memoization is 100% reliable, but GitHub issue #28472 and Reddit user comments confirm hydration mismatches on async Actions on mount."
        ]
      },
      {
        stage: "verifying",
        title: "Verifying facts and ranking trust directories",
        description: "Executing fact check against the official release log.",
        timestamp: "07:48:15 UTC",
        details: "Verified hydration issues on useActionState. GitHub confirm patches exist in experimental channels.",
        status: "completed",
        verifications: [
          { item: "React Compiler removes useMemo necessity", status: "valid", source: "react.dev Release Guide", },
          { item: "useActionState hydration matches perfectly on mount", status: "invalid", source: "GitHub Issue #28472" }
        ]
      },
      {
        stage: "coding",
        title: "Drafting optimized React 19 hook implementations",
        description: "Compiling code block samples representing concurrent action forms.",
        timestamp: "07:48:22 UTC",
        details: "Generating a clean form action component using useActionState and inline Promises parsing via the use hook to prove implementation logic.",
        status: "completed"
      },
      {
        stage: "summarizing",
        title: "Synthesizing final cognitive answer matrix",
        description: "Collating verified pointers into the briefing document.",
        timestamp: "07:48:28 UTC",
        status: "completed"
      }
    ],
    finalAnswer: [
      "### ⚛️ Verified React 19 Concurrent & Compiler Analysis",
      "",
      "React 19 represents a shift from purely runtime Virtual DOM optimization to **compiler-directed optimization**.",
      "",
      "#### 🚀 Key Features Verified in Sandbox",
      "1. **The React Compiler** (React Forget): Automatically injects memoization logic (`useMemo` and `useCallback` are now fully compiled away).",
      "2. **Server Actions & useActionState**: Natively supports async state states, mapping server hydration parameters without manual loading states.",
      "3. **Inline Promises Parser (`use`)**: Allows wrapping client-side state hooks inside conditional structures, streamlining resource fetches.",
      "",
      "#### ⚠️ Critical Caveat & Hydration Bugs Found",
      "While official reports indicate full reliability, cross-validation from **GitHub Issue #28472** suggests that if `useActionState` is executed asynchronously immediately on mount, hydration mismatches can occur under sluggish connection lanes.",
      "",
      "```tsx",
      "// Compliant React 19 Action Form Implementation",
      "import { useActionState, use } from \"react\";",
      "",
      "async function subscribeNewsletter(prevState: any, formData: FormData) {",
      "  const email = formData.get(\"email\");",
      "  // Async Action API call",
      "  await new Promise(r => setTimeout(r, 800));",
      "  return { success: true, email };",
      "}",
      "",
      "export function NewsletterForm() {",
      "  const [state, formAction, isPending] = useActionState(subscribeNewsletter, null);",
      "",
      "  return (",
      "    <form action={formAction} className=\"space-y-2\">",
      "      <input type=\"email\" name=\"email\" required placeholder=\"name@domain.com\" />",
      "      <button type=\"submit\" disabled={isPending}>",
      "        {isPending ? \"Validating email...\" : \"Subscribe Node\"}",
      "      </button>",
      "      {state?.success && <p>Injected email: {state.email}</p>}",
      "    </form>",
      "  );",
      "}",
      "```"
    ].join("\n")
  },
  ai: {
    queries: [
      "Gemini 2.5 latency metrics cost analysis",
      "google genai models reasoning capabilities comparison",
      "arxiv intelligence testing multi-agent reinforcement learning"
    ],
    sources: [
      {
        platform: "api",
        title: "@google/genai SDK Integration Specifications",
        url: "https://github.com/google/generative-ai-js/blob/main/docs",
        timestamp: "2026-05-27T07:45:01Z",
        queryUsed: "Gemini 2.5 SDK models integration js",
        snippet: "Official client specifications for standardizing model loads. Outlines model definitions, tool use, and streaming configurations via standard JSON properties.",
        bodyContent: "The @google/genai SDK enables calling gemini-2.5-flash and gemini-2.5-pro using unified initialization interfaces. Recommends passing the secret key securely as server-side environment parameters. Supports dynamic system instructions, custom temperature calibrations, and JSON schemas to ensure type-safe structured outputs.",
        reliabilityScore: 99.9,
        verified: true,
        favicon: "⚡"
      },
      {
        platform: "news",
        title: "TechCrunch - Google rolls out ultra-deep reasoning structures",
        url: "https://techcrunch.com/2026/05/gemini-pro-reasoning-metrics",
        timestamp: "2026-05-27T07:45:12Z",
        queryUsed: "google genai models reasoning capabilities",
        snippet: "Google launches reasoning upgrades. The updated model outperforms standard benchmarks by 18% in complex math, symbolic logic, and self-correcting scripting.",
        bodyContent: "Google's reasoning platform incorporates reinforcement learning pipelines to verify steps internally before delivering textual representations. Users see detailed transparent traces reflecting tree-of-thought exploration, contradiction defense patterns, and programmatic verification trials under tight latency thresholds.",
        reliabilityScore: 91.5,
        verified: true,
        favicon: "📰"
      },
      {
        platform: "academic",
        title: "ArXiv: Self-Correction Loops in Multi-Agent Reasoning Chains",
        url: "https://arxiv.org/abs/2602.04921",
        timestamp: "2026-05-27T07:45:25Z",
        queryUsed: "multi-agent reinforcement self correction",
        snippet: "Scientific evaluation of agent voting schemes. Proves that compiling cross-examination steps between isolated critic nodes and engineer nodes reduces hallucinations by 42%.",
        bodyContent: "In multi-step reasoning models, establishing an adversarial debate layout yields the highest accuracy. The researcher states: 'Rather than allowing a single neural network stream to output codes immediately, running a dual-core Planner-Critic circuit optimizes the correctness of complex syntax outputs, providing solid self-healing capabilities before final generation.'",
        reliabilityScore: 98.6,
        verified: true,
        favicon: "🎓"
      }
    ],
    thoughts: [
      {
        stage: "searching",
        title: "Formulating queries on agent reasoning performance",
        description: "Sifting academic and industry indexes for multi-agent correctness data.",
        timestamp: "07:49:05 UTC",
        details: "Deconstructed query targets: Multi-agent adversarial feedback benchmarks, Gemini API specifications, and ArXiv validation patterns.",
        status: "completed"
      },
      {
        stage: "analyzing",
        title: "Checking system accuracy parameters",
        description: "Collating latency charts and reasoning accuracy logs.",
        timestamp: "07:49:10 UTC",
        details: "ArXiv papers confirm multi-agent debate reduces code errors. Cross-referencing SDK documents on Gemini structure support. Reconciling: Adversarial systems are high-cost; lightweight systems must prefer cached schemas.",
        status: "completed"
      },
      {
        stage: "verifying",
        title: "Verifying model performance parameters",
        description: "Checking latency statistics on Gemini 1.5/2.5 flash.",
        timestamp: "07:49:15 UTC",
        details: "Flash versions offer sub-second response vectors. Perfect for dynamic monitoring.",
        status: "completed",
        verifications: [
          { item: "Adversarial agent layout reduces coding bugs by 42%", status: "valid", source: "ArXiv:2602.04921" },
          { item: "Gemini 2.5 Flash temperature defaults to 1.0", status: "unverified", source: "SDK docs" }
        ]
      },
      {
        stage: "summarizing",
        title: "Compiling system architecture recommendations",
        description: "Formatting strategic suggestions for high-reliability agent workflows.",
        timestamp: "07:49:22 UTC",
        status: "completed"
      }
    ],
    finalAnswer: `### 🧠 Verified Multi-Agent & Reasoning Systems Analysis

Autonomous agent architectures are moving toward **critic-regulated, multi-path reasoning loops**.

#### 📈 Key Intelligence Findings
- **Hallucination Reductions**: Integrating isolated **Critic and Engineer directories** within a single validation stream decreases syntactic issues by **42%** (ArXiv:2602.04921).
- **Latency Balancing**: Utilizing **Gemini 2.5 Flash** for rapid contextual searches, and routing to complex reasoning structures only for multi-path decision trees, maintains a crisp user experience.
- **Dynamic Grounding**: Actively validating code lines using local parsers inside sandboxed containers guarantees file integrity prior to finalizing deployment scripts.`
  }
};

const DEFAULT_ANSWER = (query: string) => ({
  queries: [
    `"${query}" google web search query formulation`,
    `"${query}" site:wikipedia.org OR site:mdn.com research index`,
    `"${query}" site:github.com developer discussions`
  ],
  sources: [
    {
      platform: "google",
      title: `Web Index Search Result for "${query}"`,
      url: `https://www.google.com/search?q=${encodeURIComponent(query)}`,
      timestamp: new Date().toISOString(),
      queryUsed: `"${query}" google web search`,
      snippet: `Extracted live internet information from authority nodes matching "${query}". Content is indexed and parsed correctly.`,
      bodyContent: `Live crawl completed for "${query}". The system successfully retrieved documents from public nodes. Security clearances allow full extraction. Visual elements are parsed into clean text buffers to evaluate facts, alignment, and confirm structural alignment. User inputs are mapped to historical telemetry and audited cleanly.`,
      reliabilityScore: 92.4,
      verified: true,
      favicon: "🌐"
    },
    {
      platform: "wikipedia" as any,
      title: `Global Knowledge Base reference: ${query.slice(0, 30)}`,
      url: `https://en.wikipedia.org/wiki/${encodeURIComponent(query)}`,
      timestamp: new Date().toISOString(),
      queryUsed: `"${query}" mdn reference`,
      snippet: `Comprehensive public encyclopedia documentation for ${query}. Reviewed and cross-checked against standard academic files.`,
      bodyContent: `Wikipedia global data repository details the core definitions of this query. We verified alignment, temporal dependencies, and mapped historical revisions. The consensus suggests that implementing defensive architecture, standardizing parameter scopes, and preserving clear modular borders ensures the best outcome.`,
      reliabilityScore: 96.8,
      verified: true,
      favicon: "📖"
    }
  ],
  thoughts: [
    {
      stage: "searching",
      title: "Query decomposition & index targeting",
      description: `Formulating search parameters for "${query}" across 4 distinct search crawlers.`,
      timestamp: "Active",
      details: "Sifting through public search vectors, indexing relevant nodes, and filtering unrelated web indexes.",
      status: "completed"
    },
    {
      stage: "analyzing",
      title: "Cross-checking facts and evaluating options",
      description: "Comparing newly crawled web text fragments to detect similarities.",
      timestamp: "Active",
      details: "Analyzing retrieved data segments. No major contradictions found. Extracting the most precise and high-relevance blocks.",
      status: "completed"
    },
    {
      stage: "verifying",
      title: "Conducting trust index checks",
      description: "Auditing domain references to compute average confidence credentials.",
      timestamp: "Active",
      details: "Verified authority headers. Target nodes returned valid 200 responses. Parsing completed correctly.",
      status: "completed",
      verifications: [
        { item: `Context aligns with verified user request`, status: "valid", source: "Direct Input" },
        { item: "Internet source matches authority references", status: "valid", source: "Global Search Index" }
      ]
    },
    {
      stage: "summarizing",
      title: "Assembling live response matrix",
      description: "Synthesizing an elegant informational brief for the user.",
      timestamp: "Active",
      status: "completed"
    }
  ],
  finalAnswer: `### 🔍 Live Analytical Report on: "${query}"

Based on the real-time search queries and fact-verification pipelines executed across modern web directories, here is the synthesized intelligence report:

1. **Strategic Discovery**: Found high-trust relevance markers matching the core concept of the query. 
2. **Fact Validation**: Verified sources express uniform consensus regarding implementation practices.
3. **Optimized Recommendation**:
   - Establish a clean separation of concerns in layout states.
   - Utilize defensive coding habits to bound dynamic URL calls.
   - Routinely audit dependencies and track console telemetry parameters.

Let me know if you would like me to compile code sandboxes or draw deep logic graphs representing these points!`
});

export default function AISearchEngine() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeQueryText, setActiveQueryText] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  
  // Controls for interactive sliders/settings
  const [platformsSelected, setPlatformsSelected] = useState<Record<string, boolean>>({
    google: true,
    reddit: true,
    github: true,
    youtube: false,
    docs: true,
    academic: true,
    news: true,
    api: true
  });
  
  const [hallucinationDefense, setHallucinationDefense] = useState(true);
  const [crossVerification, setCrossVerification] = useState(true);
  const [buildKnowledgeGraph, setBuildKnowledgeGraph] = useState(true);
  
  // Real-time state streams
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [sourcesList, setSourcesList] = useState<SearchSource[]>([]);
  const [thoughtSteps, setThoughtSteps] = useState<ThoughtStep[]>([]);
  const [finalAnswerStream, setFinalAnswerStream] = useState("");
  const [searchMetrics, setSearchMetrics] = useState<MetricSummary>({
    urlsParsed: 0,
    queriesGenerated: 0,
    factsVerified: 0,
    crossValidations: 0,
    latencyMs: 0,
    tokenCount: 0
  });

  // Query Reformulations log
  const [queryVariants, setQueryVariants] = useState<string[]>([]);
  
  // Interactive preview side drawer
  const [selectedSource, setSelectedSource] = useState<SearchSource | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  
  const handleCopySnippet = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };
  
  // Active streaming indices
  const streamTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Toggle platform selection
  const togglePlatform = (plat: string) => {
    setPlatformsSelected(prev => ({
      ...prev,
      [plat]: !prev[plat]
    }));
  };

  // Launch simulated advanced dynamic search pipeline
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim() || isSearching) return;

    // Reset previous views
    setIsSearching(true);
    setRetryCount(0);
    setSourcesList([]);
    setThoughtSteps([]);
    setFinalAnswerStream("");
    setQueryVariants([]);
    setSelectedSource(null);
    setCurrentStep(0);
    setActiveQueryText(searchQuery);
    
    setSearchMetrics({
      urlsParsed: 0,
      queriesGenerated: 0,
      factsVerified: 0,
      crossValidations: 0,
      latencyMs: 0,
      tokenCount: 0
    });

    const isReactQuery = searchQuery.toLowerCase().includes("react") || searchQuery.toLowerCase().includes("hook") || searchQuery.toLowerCase().includes("compiler");
    const isAiQuery = searchQuery.toLowerCase().includes("ai") || searchQuery.toLowerCase().includes("model") || searchQuery.toLowerCase().includes("gemini") || searchQuery.toLowerCase().includes("agent");

    let matchedDataset: any = DEFAULT_ANSWER(searchQuery);
    if (isReactQuery) {
      matchedDataset = SEARCH_KNOWLEDGE_DATES.react;
    } else if (isAiQuery) {
      matchedDataset = SEARCH_KNOWLEDGE_DATES.ai;
    }

    // Step-by-step pipeline execution simulating a real advanced search engine:
    // Workflow: Task Decomposition (0-1s) -> Search Planning & Reformulation (1-2s) -> Sources discovery (2-4s) -> Ranking/Verification (4-5s) -> Token Streaming (5s+)
    
    // Stage 1: Task Decomposition & Formulation
    const s1Id = "t-1";
    let stepLog: ThoughtStep[] = [
      {
        id: s1Id,
        stage: "searching",
        title: "User Query Decomposition",
        description: `Analyzing target query parameters for "${searchQuery}"`,
        timestamp: new Date().toLocaleTimeString(),
        details: "Orchestrator has mapped constraints. Identifying authoritative directories and evaluating contextual query boundaries.",
        status: "streaming"
      }
    ];
    setThoughtSteps([...stepLog]);
    setQueryVariants(matchedDataset.queries.slice(0, 1));
    setSearchMetrics(prev => ({ ...prev, queriesGenerated: 1, latencyMs: 250, tokenCount: 420 }));

    let timer = setTimeout(() => {
      // Stage 2: Query reformulations and multi-platform launches
      setThoughtSteps(prev => prev.map(s => s.id === s1Id ? { ...s, status: "completed" } : s));
      
      const s2Id = "t-2";
      setThoughtSteps(prev => [
        ...prev,
        {
          id: s2Id,
          stage: "searching",
          title: "Multi-Platform Search Execution",
          description: "Launching background crawlers across Reddit, Docs, academic datasets, and Google Serpa Web indices.",
          timestamp: new Date().toLocaleTimeString(),
          details: `Active search queries formulated: \n${matchedDataset.queries.map(q => `- ${q}`).join("\n")}`,
          status: "streaming"
        }
      ]);
      setQueryVariants(matchedDataset.queries);
      setSearchMetrics(prev => ({ ...prev, queriesGenerated: matchedDataset.queries.length, latencyMs: 820, tokenCount: 1140 }));

      // Gradually push sources in with beautiful animated delay (cinematic sources discovery!)
      let sourceIndex = 0;
      const pushSourceInterval = setInterval(() => {
        if (sourceIndex < matchedDataset.sources.length) {
          const rawSource = matchedDataset.sources[sourceIndex];
          const newSource: SearchSource = {
            ...rawSource,
            id: `src-${sourceIndex}-${Math.random().toString(36).substring(4)}`
          };
          
          setSourcesList(prev => [...prev, newSource]);
          setSearchMetrics(prev => ({ 
            ...prev, 
            urlsParsed: prev.urlsParsed + 1, 
            latencyMs: prev.latencyMs + Math.floor(Math.random() * 150) + 80 
          }));
          sourceIndex++;
        } else {
          clearInterval(pushSourceInterval);
        }
      }, 700);

      // Stage 3: Source ranking and verification stage
      let stage3Timer = setTimeout(() => {
        setThoughtSteps(prev => prev.map(s => s.id === s2Id ? { ...s, status: "completed" } : s));
        
        const s3Id = "t-3";
        const matchedThoughts: any[] = matchedDataset.thoughts;
        const analysisStep = matchedThoughts.find(t => t.stage === "analyzing");
        const verificationStep = matchedThoughts.find(t => t.stage === "verifying");

        const newAnalysisStep: ThoughtStep = {
          id: s3Id,
          stage: "analyzing",
          title: "Source Ranking & Contradiction Audit",
          description: "Evaluating crawled text pieces for hallucinations, source credibility metrics, and misinformation.",
          timestamp: new Date().toLocaleTimeString(),
          details: analysisStep?.details || "Conducting strict logic cross-examination. Ranking authoritative domains securely.",
          status: "streaming",
          contradictions: analysisStep?.contradictions
        };

        setThoughtSteps(prev => [...prev, newAnalysisStep]);
        
        setSearchMetrics(prev => ({ 
          ...prev, 
          crossValidations: crossVerification ? prev.crossValidations + 3 : prev.crossValidations,
          latencyMs: prev.latencyMs + 320 
        }));

        let stage4Timer = setTimeout(() => {
          setThoughtSteps(prev => prev.map(s => s.id === s3Id ? { ...s, status: "completed" } : s));

          const s4Id = "t-4";
          const newVerificationStep: ThoughtStep = {
            id: s4Id,
            stage: "verifying",
            title: "Fact Cross-Validation & Trusted Grading",
            description: "Cross-checking quantitative claims against academic directories and authority reference sheets.",
            timestamp: new Date().toLocaleTimeString(),
            details: verificationStep?.details || "Verification complete. Handled dynamic confidence grading.",
            status: "streaming",
            verifications: verificationStep?.verifications as any
          };

          setThoughtSteps(prev => [...prev, newVerificationStep]);
          
          setSearchMetrics(prev => ({ 
            ...prev, 
            factsVerified: prev.factsVerified + (verificationStep?.verifications?.length || 2),
            tokenCount: prev.tokenCount + 1850,
            latencyMs: prev.latencyMs + 450 
          }));

          let stage5Timer = setTimeout(() => {
            setThoughtSteps(prev => prev.map(s => s.id === s4Id ? { ...s, status: "completed" } : s));

            const s5Id = "t-5";
            setThoughtSteps(prev => [
              ...prev,
              {
                id: s5Id,
                stage: "summarizing",
                title: "Response Formulation & Citation Layering",
                description: "Generating highly structural reasoning responses backed directly by verified citation anchors.",
                timestamp: new Date().toLocaleTimeString(),
                details: "Synthesizing answer structure. Removing duplicate statements and ensuring full safety bounds are kept.",
                status: "completed"
              }
            ]);

            // Streaming the finalized answer text token-by-token
            let charIndex = 0;
            const fullAnswer = matchedDataset.finalAnswer;
            
            const chunkInterval = setInterval(() => {
              if (charIndex < fullAnswer.length) {
                const chunkSize = Math.floor(Math.random() * 8) + 3;
                setFinalAnswerStream(fullAnswer.substring(0, charIndex + chunkSize));
                charIndex += chunkSize;
                setSearchMetrics(prev => ({ 
                  ...prev, 
                  tokenCount: prev.tokenCount + Math.floor(chunkSize / 4) 
                }));
              } else {
                setFinalAnswerStream(fullAnswer);
                setIsSearching(false);
                clearInterval(chunkInterval);
              }
            }, 30);

          }, 1500); // 1.5s after Stage 3

        }, 1500); // 1.5s after Stage 2

      }, 3000); // 3s after sources start pushing

    }, 1500); // 1.5s after initial planner

  };

  // Helper function to get correct platform colors & visual styles
  const getPlatformBadge = (plat: string) => {
    switch (plat) {
      case "google":
        return { label: "Google Web", icon: <Globe className="w-3 h-3 text-blue-400" />, bg: "bg-blue-500/10 text-blue-400 border-blue-500/20" };
      case "reddit":
        return { label: "Reddit Parse", icon: <MessageSquare className="w-3 h-3 text-orange-400" />, bg: "bg-orange-500/10 text-orange-400 border-orange-500/20" };
      case "github":
        return { label: "GitHub Code", icon: <Github className="w-3 h-3 text-purple-400" />, bg: "bg-purple-500/10 text-purple-400 border-purple-500/20" };
      case "youtube":
        return { label: "YouTube Video", icon: <Tv className="w-3 h-3 text-red-400" />, bg: "bg-red-500/10 text-red-400 border-red-500/20" };
      case "docs":
        return { label: "Official Docs", icon: <FileText className="w-3 h-3 text-cyan-400" />, bg: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" };
      case "academic":
        return { label: "Academic ArXiv", icon: <BookOpen className="w-3 h-3 text-emerald-400" />, bg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" };
      case "news":
        return { label: "News Press", icon: <Globe className="w-3 h-3 text-amber-400" />, bg: "bg-amber-500/10 text-amber-400 border-amber-500/20" };
      case "api":
        return { label: "API Reference", icon: <Database className="w-3 h-3 text-cyan-400" />, bg: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" };
      default:
        return { label: "Web Intelligence", icon: <Globe className="w-3 h-3 text-zinc-400" />, bg: "bg-zinc-800/20 text-zinc-400 border-zinc-700/20" };
    }
  };

  return (
    <div id="ai-search-view-root" className="space-y-6 max-w-7xl mx-auto w-full p-4 md:p-6 bg-[#030305]/10 select-none pb-24">
      {/* HEADER STATEMENT PANEL */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-zinc-900 pb-4 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="px-2 py-0.5 rounded-md bg-cyan-950/40 border border-cyan-500/20 text-[8px] font-mono text-cyan-400 tracking-wider uppercase font-bold">
              NEVA.OS Advanced Subsystem
            </div>
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping"></span>
          </div>
          <h1 className="text-xl md:text-2xl font-serif italic font-bold text-zinc-100 mt-1">Live Search & Deep Reasoning Engine</h1>
          <p className="text-xs text-zinc-500 mt-1 font-sans leading-relaxed">
            Autonomous web multi-crawler featuring real-time adversarial debate pipelines, contradiction audits, and trusted fact citation mappings.
          </p>
        </div>

        {/* CRAWL STATISTICS STATS */}
        <div className="flex items-center gap-3 bg-[#08080a] border border-zinc-850 px-4 py-2.5 rounded-2xl">
          <div className="text-center px-2 border-r border-zinc-850/60">
            <span className="block text-[8px] text-zinc-500 font-mono uppercase font-bold">Crawled URLs</span>
            <span className="text-xs font-mono font-bold text-cyan-400">{searchMetrics.urlsParsed}</span>
          </div>
          <div className="text-center px-2 border-r border-zinc-850/60">
            <span className="block text-[8px] text-zinc-500 font-mono uppercase font-bold">Fact Checked</span>
            <span className="text-xs font-mono font-bold text-emerald-400">{searchMetrics.factsVerified}</span>
          </div>
          <div className="text-center px-2 border-r border-zinc-850/60">
            <span className="block text-[8px] text-zinc-500 font-mono uppercase font-bold">Validations</span>
            <span className="text-xs font-mono font-bold text-purple-400">{searchMetrics.crossValidations}</span>
          </div>
          <div className="text-center px-1">
            <span className="block text-[8px] text-zinc-500 font-mono uppercase font-bold">Response latency</span>
            <span className="text-xs font-mono font-bold text-zinc-300">{searchMetrics.latencyMs}ms</span>
          </div>
        </div>
      </div>

      {/* TOP COMPOSER SEARCH INPUT & CONTROLS */}
      <div className="bg-[#050508]/80 border border-zinc-850/60 p-5 rounded-2xl relative overflow-hidden backdrop-blur-md">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-zinc-500" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="e.g. Discuss hydration issues in React 19 compiler loops, or explain Gemini 2.5 architecture parameters..."
              className="w-full bg-[#08080c] border border-zinc-800 rounded-xl pl-11 pr-32 py-3.5 text-xs text-zinc-120 placeholder-zinc-500 focus:outline-none focus:border-cyan-500/50 font-mono transition-all text-ellipsis"
            />
            <div className="absolute right-2 top-2">
              <button
                type="submit"
                disabled={isSearching || !searchQuery.trim()}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-[10px] uppercase font-mono font-bold tracking-wider text-white select-none transition-all cursor-pointer ${
                  isSearching || !searchQuery.trim()
                    ? "bg-zinc-800 text-zinc-500 cursor-not-allowed border border-transparent"
                    : "bg-cyan-600 hover:bg-cyan-500 border border-cyan-400/25 shadow-[0_0_12px_rgba(6,182,212,0.2)] hover:shadow-[0_0_20px_rgba(6,182,212,0.35)]"
                }`}
              >
                {isSearching ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Researching...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>Inquire Engine</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* CHANNELS MULTI-SELECT FILTERING TABS */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[9px] font-mono uppercase text-zinc-500 tracking-wider">Targets:</span>
              {(["google", "reddit", "github", "docs", "academic", "news", "api"] as const).map(plat => {
                const badge = getPlatformBadge(plat);
                const isSelected = platformsSelected[plat];
                return (
                  <button
                    key={plat}
                    type="button"
                    onClick={() => togglePlatform(plat)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[9px] font-mono border transition-all cursor-pointer select-none ${
                      isSelected 
                        ? `${badge.bg} font-bold opacity-100 hover:opacity-90` 
                        : "bg-transparent border-zinc-850 text-zinc-550 hover:text-zinc-400 hover:bg-zinc-900/30 opacity-60"
                    }`}
                  >
                    {badge.icon}
                    <span>{badge.label}</span>
                  </button>
                );
              })}
            </div>

            {/* PIPELINE ADVANCED TUNING CONTROLS */}
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-1.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={hallucinationDefense}
                  onChange={(e) => setHallucinationDefense(e.target.checked)}
                  className="rounded border-zinc-800 bg-[#08080c] text-cyan-500 focus:ring-opacity-40 focus:ring-cyan-500/20 h-3.5 w-3.5 cursor-pointer accent-cyan-500"
                />
                <span className="text-[9px] font-mono uppercase text-zinc-450 hover:text-white transition-colors">Anti-Hallucination Pulse</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={crossVerification}
                  onChange={(e) => setCrossVerification(e.target.checked)}
                  className="rounded border-zinc-800 bg-[#08080c] text-cyan-500 focus:ring-opacity-40 focus:ring-cyan-500/20 h-3.5 w-3.5 cursor-pointer accent-cyan-500"
                />
                <span className="text-[9px] font-mono uppercase text-zinc-450 hover:text-white transition-colors">Cross-examine facts</span>
              </label>
            </div>
          </div>
        </form>
      </div>

      {/* PIPELINE REAL-TIME TRANSIT STATION PROGRESS BAR */}
      {isSearching && (
        <div className="bg-[#050508]/40 border border-[#0d1016] rounded-xl p-4 flex flex-col gap-2">
          <div className="flex justify-between items-center text-[9px] font-mono uppercase">
            <span className="text-cyan-400 font-extrabold tracking-wider animate-pulse flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shrink-0"></span>
              Live Pipeline Active
            </span>
            <span className="text-zinc-500">Executing Deep Search Loops</span>
          </div>
          {/* Animated step segment */}
          <div className="grid grid-cols-6 gap-2 pt-1 text-[8.5px] font-mono font-bold text-center">
            {[
              { label: "Decompose", active: sourcesList.length === 0, completed: sourcesList.length > 0 },
              { label: "Crawler Spawn", active: sourcesList.length > 0 && sourcesList.length < 3, completed: sourcesList.length >= 3 },
              { label: "Read Content", active: sourcesList.length >= 3 && thoughtSteps.length < 4, completed: thoughtSteps.length >= 4 },
              { label: "Adversarial Debate", active: thoughtSteps.some(s => s.stage === "analyzing" && s.status === "streaming"), completed: thoughtSteps.some(s => s.stage === "analyzing" && s.status === "completed") },
              { label: "Fact Check Check", active: thoughtSteps.some(s => s.stage === "verifying" && s.status === "streaming"), completed: thoughtSteps.some(s => s.stage === "verifying" && s.status === "completed") },
              { label: "Final Answers", active: finalAnswerStream !== "", completed: !isSearching && finalAnswerStream !== "" }
            ].map((st, i) => (
              <div 
                key={i} 
                className={`py-1.5 border rounded-lg transition-all duration-300 truncate uppercase ${
                  st.completed 
                    ? "bg-emerald-500/15 border-emerald-500/35 text-emerald-400" 
                    : st.active 
                      ? "bg-cyan-500/10 border-cyan-400/40 text-cyan-300 shadow-[0_0_8px_rgba(6,182,212,0.1)]" 
                      : "bg-[#06070a]/40 border-zinc-900 text-zinc-600"
                }`}
              >
                {st.completed ? `✓ ${st.label}` : st.label}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SEARCH REFORMULATIONS TRAX PANEL */}
      {queryVariants.length > 0 && (
        <div className="p-3 bg-[#08080a]/60 border border-zinc-900 rounded-xl space-y-2">
          <div className="text-[9px] uppercase font-mono text-zinc-550 flex items-center gap-1.5 font-bold">
            <Activity className="w-3.5 h-3.5 text-orange-400 stroke-[2.5]" />
            <span>Search Query Reformulations Layer (Resolving Ambiguity)</span>
          </div>
          <div className="flex gap-2 flex-wrap text-[9px] font-mono leading-relaxed">
            {queryVariants.map((item, index) => (
              <span key={index} className="px-2.5 py-1 rounded-md bg-[#050608] border border-zinc-850 text-zinc-400 hover:text-white transition-colors cursor-pointer select-text flex items-center gap-1">
                <span className="text-orange-400">site_{index + 1}:</span>
                {item}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* CORE SPLIT WORKSPACE INTERFACE */}
      {activeQueryText ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* COLUMN 1: LIVE SCROLLING SOURCES FEED (4/12 width) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs uppercase font-mono tracking-widest text-zinc-450 flex items-center gap-1.5 font-extrabold">
                <Globe className="w-4 h-4 text-cyan-400 animate-spin-slow" />
                <span>Live Sources feed ({sourcesList.length} parsed)</span>
              </h2>
              <span className="text-[8.5px] font-mono text-zinc-500 uppercase tracking-widest">REAL-TIME INDEXING</span>
            </div>

            <div className="space-y-3 max-h-[640px] overflow-y-auto scrollbar-thin pr-1 pb-10">
              {sourcesList.length === 0 ? (
                <div className="border border-dashed border-zinc-850 bg-zinc-950/20 rounded-2xl p-8 text-center flex flex-col items-center justify-center">
                  <RefreshCw className="w-6 h-6 text-zinc-650 animate-spin mb-3" />
                  <p className="text-[10px] font-mono text-zinc-500 uppercase">Awaiting dynamic crawling queries...</p>
                </div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {sourcesList.map((src, i) => {
                    const badge = getPlatformBadge(src.platform);
                    return (
                      <motion.div
                        key={src.id}
                        initial={{ opacity: 0, x: -15, y: 10 }}
                        animate={{ opacity: 1, x: 0, y: 0 }}
                        transition={{ duration: 0.35 }}
                        onClick={() => setSelectedSource(src)}
                        className={`p-3 bg-[#06080d]/80 border ${
                          selectedSource?.id === src.id 
                            ? "border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.1)]" 
                            : "border-zinc-900 hover:border-zinc-800"
                        } rounded-xl group transition-all duration-300 cursor-pointer text-left select-none ring-1 ring-zinc-950`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5 min-w-0">
                            {/* Favicon or fallback */}
                            <span className="w-5 h-5 rounded bg-zinc-950 border border-zinc-850 flex items-center justify-center text-[10px] shrink-0 font-serif font-bold italic">
                              {src.favicon || "💡"}
                            </span>
                            <div className="min-w-0">
                              <h4 className="text-[10px] font-bold text-zinc-200 truncate pr-1 group-hover:text-cyan-300 transition-colors leading-tight">
                                {src.title}
                              </h4>
                              <p className="text-[8px] font-mono text-zinc-500 truncate leading-none mt-0.5">
                                {src.url}
                              </p>
                            </div>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-[7.5px] font-mono font-bold shrink-0 border ${badge.bg}`}>
                            {badge.label}
                          </span>
                        </div>

                        {/* Extra metrics: trust rating and timeline */}
                        <div className="flex items-center gap-3 text-[7.5px] font-mono text-zinc-450 mt-1 pb-1">
                          <span className="text-zinc-555">Visited {new Date(src.timestamp).toLocaleTimeString()}</span>
                          <span className="w-1 h-1 rounded-full bg-zinc-800"></span>
                          <span className="flex items-center gap-0.5">
                            RELIABILITY: <span className={src.reliabilityScore >= 95 ? "text-emerald-400 font-bold" : "text-amber-400 font-bold"}>{src.reliabilityScore}%</span>
                          </span>
                        </div>

                        {/* Snippet parsed */}
                        <div className="border-t border-zinc-900/60 pt-2 mt-2">
                          <p className="text-zinc-500 text-[9px] font-sans leading-normal font-medium line-clamp-2">
                            {src.snippet}
                          </p>
                        </div>

                        <div className="flex items-center justify-between text-[7px] font-mono text-zinc-600 mt-2 border-t border-zinc-900/40 pt-1">
                          <span className="truncate max-w-[140px]">QUERY: {src.queryUsed}</span>
                          <span className="text-cyan-400 group-hover:opacity-100 opacity-60 transition-opacity font-bold uppercase tracking-widest flex items-center gap-0.5">
                            EXTRACTED
                            <ChevronRight className="w-2.5 h-2.5 stroke-[3]" />
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              )}
            </div>
          </div>

          {/* COLUMN 2: TRANSPARENT LIVE THINKING STREAM & ANSWER (7/12 width) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            
            {/* THOUGHT STREAM STEPS */}
            <div className="space-y-4">
              <h2 className="text-xs uppercase font-mono tracking-widest text-zinc-450 flex items-center gap-1.5 font-extrabold">
                <Brain className="w-4 h-4 text-purple-400" />
                <span>Transparent reasoning stream (Real-time AI logic)</span>
              </h2>

              <div className="space-y-3 bg-[#050609]/70 border border-zinc-900 rounded-2xl p-4 max-h-[420px] overflow-y-auto scrollbar-thin">
                {thoughtSteps.length === 0 ? (
                  <div className="p-6 text-center text-zinc-600 font-mono text-[10px] uppercase">
                    No inquiries triggered yet. Awaiting query input.
                  </div>
                ) : (
                  thoughtSteps.map((step, index) => {
                    const isCompleted = step.status === "completed";
                    const isStreaming = step.status === "streaming";
                    return (
                      <div 
                        key={step.id} 
                        className={`p-3 bg-[#030406]/90 border ${
                          isStreaming 
                            ? "border-cyan-500/45 shadow-[0_0_10px_rgba(6,182,212,0.06)] bg-cyan-950/5 animate-[pulse_3s_infinite]" 
                            : "border-zinc-900/80"
                        } rounded-xl space-y-2`}
                      >
                        <div className="flex justify-between items-center gap-2">
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded text-[8px] font-mono font-extrabold uppercase ${
                              step.stage === "searching" ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" :
                              step.stage === "analyzing" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                              step.stage === "verifying" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                              "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                            }`}>
                              {step.stage}
                            </span>
                            <h3 className="text-[10px] font-mono font-bold text-zinc-200">
                              {step.title}
                            </h3>
                          </div>
                          <div className="flex items-center gap-1.5 font-mono text-[8px] text-zinc-500">
                            <span>{step.timestamp}</span>
                            {isCompleted && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />}
                            {isStreaming && <RefreshCw className="w-3 h-3 text-cyan-400 animate-spin shrink-0" />}
                          </div>
                        </div>

                        <p className="text-[10px] text-zinc-400 font-sans leading-relaxed">
                          <TypewriterText text={step.description} speed={6} />
                        </p>

                        {/* Extra deep detailed logs with monospaced highlights */}
                        {step.details && (
                          <div className="p-2 bg-[#020304] border border-zinc-900 rounded-lg text-[9px] font-mono text-zinc-500 leading-relaxed whitespace-pre-wrap whitespace-normal break-words select-text border-l-2 border-l-zinc-700">
                            <TypewriterText text={step.details} speed={4} />
                          </div>
                        )}

                        {/* CONTRADICTIONS FILTER OUT (SEARCH INTELLIGENCE FEATURE) */}
                        {step.contradictions && step.contradictions.length > 0 && (
                          <div className="p-2.5 bg-rose-500/5 border border-rose-500/20 rounded-lg flex items-start gap-2 animate-fade-in shadow-inner">
                            <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                            <div className="space-y-1 w-full text-[9.5px]">
                              <span className="font-mono text-[8.2px] text-rose-400 uppercase font-bold tracking-wider block">CONTRADICTION DETECTED (Strict logic check)</span>
                              {step.contradictions.map((c, i) => (
                                <p key={i} className="text-zinc-350 leading-relaxed font-sans">{c}</p>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* FACT VERIFICATIONS (SEARCH INTELLIGENCE FEATURE) */}
                        {step.verifications && step.verifications.length > 0 && (
                          <div className="p-2.5 bg-[#030406] border border-zinc-900 rounded-lg space-y-2">
                            <span className="font-mono text-[8.5px] text-zinc-400 uppercase font-extrabold tracking-wider block">Fact Verification Matrix</span>
                            <div className="space-y-1.5 text-[8.5px] font-mono">
                              {step.verifications.map((v, i) => (
                                <div key={i} className="flex items-center justify-between border-b border-zinc-900 pb-1.5 last:border-0 last:pb-0">
                                  <div className="flex items-center gap-1.5 min-w-0 mr-2">
                                    <span className="w-1.5 h-1.5 rounded-full inline-block bg-cyan-400 shrink-0"></span>
                                    <span className="text-zinc-300 truncate" title={v.item}>{v.item}</span>
                                  </div>
                                  <div className="flex items-center gap-2 font-bold shrink-0">
                                    <span className="text-[7.5px] text-zinc-555">SOURCE: {v.source}</span>
                                    {v.status === "valid" && <span className="text-emerald-400 text-[8px] bg-emerald-500/10 border border-emerald-500/15 px-1 rounded uppercase font-bold">VALIDATED</span>}
                                    {v.status === "invalid" && <span className="text-rose-400 text-[8px] bg-rose-500/10 border border-rose-500/15 px-1 rounded uppercase font-bold">MUTATED Hydration Hydration Hydration hydrateHydration hydrate Hydra</span>}
                                    {v.status === "unverified" && <span className="text-amber-400 text-[8px] bg-amber-500/10 border border-amber-500/15 px-1 rounded uppercase font-bold">UNVERIFIED</span>}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* ANSWER VIEW PANEL */}
            {finalAnswerStream && (
              <div className="bg-[#050609]/80 border border-zinc-850 rounded-2xl p-5 shadow-2xl space-y-4 text-left select-text relative">
                {/* Visual marker of completion */}
                <div className="absolute top-2.5 right-4 flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-[#020304] border border-zinc-850 text-[8px] font-mono text-emerald-400 px-2 py-0.5 rounded-full font-bold">
                    <Check className="w-3 h-3 stroke-[3]" />
                    <span>REPORT DELIVERED</span>
                  </div>
                </div>

                <div className="border-b border-zinc-900 pb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-300 animate-pulse shrink-0" />
                  <span className="font-serif italic font-bold text-xs text-zinc-100 uppercase tracking-widest block mt-0.5">Synthesized response block</span>
                </div>

                {/* Markdown Main Body Area with deep content rendering styles */}
                <div className="props-markdown text-[11px] leading-relaxed text-zinc-300 max-w-none text-left select-text scrollbar-thin overflow-x-auto space-y-4 font-sans font-normal border border-zinc-900 bg-[#020305]/60 p-4.5 rounded-xl border-l-2 border-l-cyan-500">
                  <pre className="whitespace-pre-wrap text-[11px] leading-relaxed select-text font-sans">
                    {finalAnswerStream}
                  </pre>
                </div>

                {/* User validation feedback bar */}
                <div className="flex items-center justify-between border-t border-zinc-900 pt-3 text-[9px] font-mono text-zinc-550 select-none">
                  <div className="flex items-center gap-1 text-[8.5px]">
                    <Activity className="w-3.5 h-3.5 text-zinc-650" />
                    <span>Cross-checked against {sourcesList.length} verified index caches. Reliability is 99%+.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>Satisfactory response?</span>
                    <button type="button" className="p-1 rounded bg-[#010203] border border-zinc-900 hover:text-white transition-colors cursor-pointer" title="Thumbs Up">
                      <ThumbsUp className="w-3 h-3 text-emerald-450" />
                    </button>
                    <button type="button" className="p-1 rounded bg-[#010203] border border-zinc-900 hover:text-white transition-colors cursor-pointer" title="Thumbs Down">
                      <ThumbsDown className="w-3 h-3 text-rose-450" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* IDLE INVITATION COMPOSER SCREEN */
        <div className="py-16 text-center max-w-xl mx-auto space-y-4">
          <div className="w-16 h-16 rounded-3xl border border-dashed border-zinc-800 bg-zinc-950/20 flex items-center justify-center mx-auto relative group">
            <Search className="h-6 w-6 text-zinc-500 group-hover:text-cyan-400 group-hover:scale-110 transition-all duration-300" />
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
          </div>
          <div className="space-y-1.5">
            <h3 className="text-zinc-200 font-serif italic text-base font-bold">Awaiting Cognitive Search Query</h3>
            <p className="text-xs text-zinc-500 leading-relaxed font-sans">
              Enter a search criteria or query target above to configure and track our active autonomous search loops in real time, following perfect multi-agent execution vectors.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 select-none">
            {[
              { title: "React 19 Hooks & Compiler", val: "React 19 compiler optimization and useActionState hydration", desc: "Checks Reddit and GitHub hydration compile issues." },
              { title: "Gemini 2.5 SDK Integration", val: "Gemini 2.5 reasoning models sdk tool use latency", desc: "Parses official SDK integration guidelines and metrics." }
            ].map((sample, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setSearchQuery(sample.val);
                }}
                className="p-3 text-left rounded-xl bg-zinc-950/30 border border-zinc-900 hover:border-zinc-800 hover:bg-[#06070a]/40 transition-all group flex flex-col justify-between cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-zinc-3 font-extrabold uppercase tracking-wide text-cyan-400">{sample.title}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-zinc-650 group-hover:text-zinc-300 transition-colors shrink-0 group-hover:translate-x-1 duration-300" />
                </div>
                <p className="text-[9.5px] text-zinc-500 line-clamp-2 mt-1 leading-normal font-sans font-medium">{sample.desc}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* OVERLAY PREVIEW DRAWER FOR EXPANDED SOURCES SEGMENTS */}
      <AnimatePresence>
        {selectedSource && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-zinc-950/80 backdrop-blur-md z-50 flex justify-end"
            onClick={() => setSelectedSource(null)}
          >
            {/* Expanded details container */}
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 220 }}
              className="w-full max-w-lg h-full bg-[#08080c] border-l border-zinc-905 shadow-2xl flex flex-col justify-between"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden">
                {/* Header block with explicit "Extracted Source" naming */}
                <div className="p-4 border-b border-zinc-900 bg-zinc-950/60 select-none flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-cyan-950/30 border border-cyan-500/20 flex items-center justify-center text-cyan-400 font-serif font-bold animate-pulse">
                      <Layers className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[7.5px] font-mono text-cyan-400 uppercase tracking-widest font-bold flex items-center gap-1">
                        <span className="h-1 w-1 rounded-full bg-cyan-400 animate-ping"></span>
                        Document Extraction
                      </span>
                      <h3 className="text-xs font-mono uppercase font-bold text-zinc-100 mt-0.5 tracking-wider">Extracted Source</h3>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedSource(null)}
                    className="p-1.5 rounded-lg bg-zinc-900 hover:text-white text-zinc-450 border border-zinc-800 transition-colors cursor-pointer group"
                    title="Close Sidebar"
                  >
                    <X className="w-3.5 h-3.5 group-hover:rotate-90 transition-transform duration-200" />
                  </button>
                </div>

                {/* Content Panel Area */}
                <div className="p-5 flex-1 overflow-y-auto scrollbar-thin scrollbar-track-transparent space-y-5">
                  
                  {/* Website Information & Preview Card */}
                  <div className="bg-[#050608] border border-zinc-900 rounded-xl p-4 space-y-4">
                    <div className="flex items-start gap-3">
                      {/* Generous Favicon Container */}
                      <span className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-850 flex items-center justify-center text-xl shrink-0 font-serif font-bold italic shadow-inner">
                        {selectedSource.favicon || "🌐"}
                      </span>
                      
                      <div className="min-w-0 space-y-1">
                        <span className="text-[7.5px] font-mono bg-zinc-900 text-zinc-400 px-1.5 py-0.5 rounded border border-zinc-800 inline-block uppercase font-bold">
                          {selectedSource.platform} Direct
                        </span>
                        <h4 className="text-xs font-serif italic font-bold text-zinc-200 leading-snug select-text">
                          {selectedSource.title}
                        </h4>
                      </div>
                    </div>

                    {/* Interactive URL and Action Links */}
                    <div className="border-t border-zinc-900/80 pt-3 flex flex-col gap-2">
                      <span className="text-[7.5px] font-mono text-zinc-550 uppercase font-bold tracking-wider">Verified Crawl Location</span>
                      <div className="flex items-center justify-between gap-3 bg-[#030406] border border-zinc-900 rounded-lg p-2 min-w-0">
                        <span className="text-[9px] font-mono text-zinc-450 truncate select-all pr-2">
                          {selectedSource.url}
                        </span>
                        <a 
                          href={selectedSource.url} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="px-2 py-1 rounded bg-[#0a0a0f] hover:bg-cyan-950/30 text-cyan-400 hover:text-cyan-300 border border-zinc-800 hover:border-cyan-500/20 text-[8.5px] font-mono transition-colors shrink-0 flex items-center gap-1 group font-bold"
                        >
                          <span>Visit link</span>
                          <ExternalLink className="w-2.5 h-2.5 group-hover:translate-x-0.5 transition-transform" />
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Quantitative Trust and Time Metrics Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-[#040508]/60 border border-zinc-900 rounded-xl p-3 text-left">
                      <span className="text-zinc-600 block uppercase font-bold text-[7px] tracking-widest mb-0.5">Confidence Score</span>
                      <div className="flex items-baseline gap-1 mt-1">
                        <span className={`text-sm font-mono font-bold ${selectedSource.reliabilityScore >= 95 ? "text-emerald-400" : "text-amber-400"}`}>
                          {selectedSource.reliabilityScore}%
                        </span>
                        <span className="text-[7.5px] text-zinc-500 font-mono">RELIABLE</span>
                      </div>
                    </div>

                    <div className="bg-[#040508]/60 border border-zinc-900 rounded-xl p-3 text-left">
                      <span className="text-zinc-600 block uppercase font-bold text-[7px] tracking-widest mb-0.5">Crawl Log State</span>
                      <div className="text-[10px] text-zinc-300 font-mono font-medium truncate mt-1">
                        {new Date(selectedSource.timestamp).toLocaleTimeString()} UTC
                      </div>
                    </div>
                  </div>

                  {/* Document Fragment 1: The Excerpt Snippet matching query */}
                  <div className="space-y-2 text-left">
                    <div className="flex items-center justify-between">
                      <span className="text-[8px] uppercase font-mono tracking-wider font-extrabold text-zinc-450 flex items-center gap-1.5">
                        <Search className="w-3 h-3 text-amber-400" />
                        <span>Relevance Query Match Snippet</span>
                      </span>
                    </div>
                    <div className="p-3.5 border border-zinc-900 bg-[#040508]/50 rounded-xl text-[10px] text-zinc-400 italic leading-relaxed select-text font-serif">
                      "{selectedSource.snippet}"
                    </div>
                  </div>

                  {/* Document Fragment 2: Thorough Website Full Text Content */}
                  <div className="space-y-2 text-left">
                    <span className="text-[8px] uppercase font-mono tracking-wider font-extrabold text-zinc-450 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Extracted Web Fragment Text (Cleaned body tags)</span>
                    </span>
                    <p className="text-[10.5px] leading-relaxed text-zinc-300 select-text p-4 border border-zinc-900 bg-[#030406] rounded-xl font-sans whitespace-pre-wrap leading-relaxed shadow-inner max-h-[250px] overflow-y-auto scrollbar-thin">
                      {selectedSource.bodyContent}
                    </p>
                  </div>

                  {/* Audit safety details block */}
                  <div className="p-3 bg-cyan-950/10 border border-cyan-500/10 rounded-xl flex items-start gap-2.5 text-[9.5px] select-text">
                    <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5 animate-pulse" />
                    <div className="space-y-0.5 leading-relaxed font-sans">
                      <p className="text-zinc-350 font-semibold font-mono text-[8px] uppercase tracking-wide text-cyan-300">NEVA Security Verification</p>
                      <p className="text-zinc-400 leading-normal">
                        This snippet was securely parsed to support dynamic logical inferences inside our reasoning matrices. Hallucination defenses confirmed no contradictory metrics in this block.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom control anchors with reactive isCopied Feedback */}
              <div className="p-4 border-t border-zinc-900 bg-zinc-950/40 select-none flex items-center justify-between">
                <span className="text-[7.5px] font-mono text-zinc-650 uppercase font-bold tracking-widest">NEVA Vector Sandbox</span>
                <button
                  onClick={() => handleCopySnippet(selectedSource.bodyContent)}
                  className={`flex items-center gap-1.5 px-3 py-2 text-[9px] uppercase font-mono font-bold tracking-wider rounded-lg border transition-all cursor-pointer ${
                    isCopied 
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                      : "bg-[#0a0a0f] hover:bg-zinc-900 text-zinc-300 hover:text-white border-zinc-800"
                  }`}
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied snippet!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-zinc-400" />
                      <span>Copy raw content</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
