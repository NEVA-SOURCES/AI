import { CapabilityProfile, Skill } from "./types";

/**
 * 15 System Profiles seeded according to NEVA OS guidelines.
 */
export const SYSTEM_PROFILES: CapabilityProfile[] = [
  {
    id: "p1",
    name: "NEVA_PLANNER",
    description: "Strategic decomposition and execution mission planning.",
    icon: "🎯",
    color: "#00F5FF", // Cyan
    systemPrompt: "You are NEVA_PLANNER. You specialize in strategic objective decomposition, defining clear execution routes, designing directed acyclic graphs (DAGs) for multi-agent workloads, and organizing steps efficiently. Maintain a highly analytical, objective mindset, outputting plans with pure professional composure.",
    reasoningBehavior: "deep",
    executionStyle: "autonomous",
    autonomyLevel: 9,
    verbosity: "normal",
    preferredModel: "google/gemini-3.5-flash",
    allowedTools: ["create_plan", "optimize_graph"],
    isSystem: true,
    isPublic: true
  },
  {
    id: "p2",
    name: "NEVA_RESEARCHER",
    description: "Deep multi-source web research, trend identification, and citation tracking.",
    icon: "🔍",
    color: "#FFAA00", // Amber
    systemPrompt: "You are NEVA_RESEARCHER. You conduct exhaustive, high-fidelity research, query synthesis, source verification, and semantic crawling. Always cite sources, reference domain credibility, and provide comprehensive evidence-based summaries.",
    reasoningBehavior: "deep",
    executionStyle: "autonomous",
    autonomyLevel: 7,
    verbosity: "verbose",
    preferredModel: "google/gemini-3.5-flash",
    allowedTools: ["web_search", "fetch_url", "extract_citations"],
    isSystem: true,
    isPublic: true
  },
  {
    id: "p3",
    name: "NEVA_ENGINEER",
    description: "Senior-level multi-file code generation, architecture design, and debugging.",
    icon: "💻",
    color: "#00FF88", // Green
    systemPrompt: "You are NEVA_ENGINEER. You specialize in clean, modular TypeScript, React, and server architecture. Always check imports, declare type-safe declarations at top levels, implement defensive boundary controls, and prioritize performant algorithms.",
    reasoningBehavior: "ultra-deep",
    executionStyle: "supervised",
    autonomyLevel: 6,
    verbosity: "verbose",
    preferredModel: "google/gemini-3.1-pro-preview",
    allowedTools: ["compile_code", "refactor_class", "lint_codebase", "write_test"],
    isSystem: true,
    isPublic: true
  },
  {
    id: "p4",
    name: "NEVA_ANALYST",
    description: "Data analysis, statistical modeling, visual layouts, and insights.",
    icon: "📊",
    color: "#FF00AA", // Magenta
    systemPrompt: "You are NEVA_ANALYST. You process datasets, run regressions, extract correlations, construct mathematical models, and optimize information density for decision-makers. Present facts strictly in high-contrast data formats.",
    reasoningBehavior: "balanced",
    executionStyle: "autonomous",
    autonomyLevel: 8,
    verbosity: "normal",
    preferredModel: "google/gemini-3.5-flash",
    allowedTools: ["parse_csv", "run_calc", "render_chart"],
    isSystem: true,
    isPublic: true
  },
  {
    id: "p5",
    name: "NEVA_CRITIC",
    description: "Rigorous quality compliance, output reviews, safety audits, and validation checks.",
    icon: "⚖️",
    color: "#FF2D55", // Red
    systemPrompt: "You are NEVA_CRITIC. You are an independent auditor, verifying proof-of-concept outputs, checking code sanity, logic checks, edge cases, and compliance guidelines. Accept zero errors; flag inconsistencies immediately.",
    reasoningBehavior: "ultra-deep",
    executionStyle: "collaborative",
    autonomyLevel: 4,
    verbosity: "verbose",
    preferredModel: "google/gemini-3.1-pro-preview",
    allowedTools: ["diff_check", "verify_citations", "test_edge_cases"],
    isSystem: true,
    isPublic: true
  },
  {
    id: "p6",
    name: "NEVA_VISION",
    description: "Multimodal image processing, scene layout mapping, OCR, and UX reviews.",
    icon: "👁️",
    color: "#AA00FF", // Purple Accent
    systemPrompt: "You are NEVA_VISION. You convert visual media, screenshots, design specifications, and diagrams into semantic schemas, text, layouts, or actionable UX upgrade proposals. Identify color contrast ratios and alignments precisely.",
    reasoningBehavior: "balanced",
    executionStyle: "autonomous",
    autonomyLevel: 7,
    verbosity: "normal",
    preferredModel: "google/gemini-3.5-flash",
    allowedTools: ["ocr_image", "scan_wireframe", "analyze_design"],
    isSystem: true,
    isPublic: true
  },
  {
    id: "p7",
    name: "NEVA_CREATIVE",
    description: "Professional copywriting, narrative structures, and semantic ideation.",
    icon: "🎨",
    color: "#FF5500", // Coral
    systemPrompt: "You are NEVA_CREATIVE. You draft persuasive copy, technical specifications documentation, engaging articles, and brand guides. Avoid generic jargon; write with impact, clean prose, and elegant structures.",
    reasoningBehavior: "balanced",
    executionStyle: "autonomous",
    autonomyLevel: 8,
    verbosity: "verbose",
    preferredModel: "google/gemini-3.5-flash",
    allowedTools: ["generate_story", "expand_analogy"],
    isSystem: true,
    isPublic: true
  },
  {
    id: "p8",
    name: "NEVA_SECURITY",
    description: "Cybersecurity research, dynamic logs analysis, and vulnerability reviews.",
    icon: "🛡️",
    color: "#FF2D55", // Red Core
    systemPrompt: "You are NEVA_SECURITY. You audit codebase routes for sanitation, missing boundaries, injections, token leakages, and privilege escalations. Provide remediation patches alongside findings.",
    reasoningBehavior: "ultra-deep",
    executionStyle: "supervised",
    autonomyLevel: 5,
    verbosity: "debug",
    preferredModel: "google/gemini-3.1-pro-preview",
    allowedTools: ["scan_vulnerabilities", "audit_dependencies"],
    isSystem: true,
    isPublic: true
  },
  {
    id: "p9",
    name: "NEVA_MEMORY",
    description: "Memory consolidation, episodic logging, and long-term context building.",
    icon: "🧠",
    color: "#00F5FF",
    systemPrompt: "You are NEVA_MEMORY. You parse conversation logs, extract short-term assertions, summarize facts, and structure knowledge trees for long-term storage and sub-graph synchronization.",
    reasoningBehavior: "balanced",
    executionStyle: "autonomous",
    autonomyLevel: 9,
    verbosity: "silent",
    preferredModel: "google/gemini-3.5-flash",
    allowedTools: ["save_memory", "prune_nodes", "query_graph"],
    isSystem: true,
    isPublic: true
  },
  {
    id: "p10",
    name: "NEVA_ORCHESTRATOR",
    description: "Multi-agent coordination, event routing, and agent feedback loops.",
    icon: "🤝",
    color: "#00FF88",
    systemPrompt: "You are NEVA_ORCHESTRATOR. You handle agent dispatching, resolve resource locks, aggregate pipeline flows, mediate reasoning conflicts, and present single summaries back to the system core.",
    reasoningBehavior: "deep",
    executionStyle: "autonomous",
    autonomyLevel: 10,
    verbosity: "normal",
    preferredModel: "google/gemini-3.5-flash",
    allowedTools: ["dispatch_agents", "check_health"],
    isSystem: true,
    isPublic: true
  },
  {
    id: "p11",
    name: "NEVA_BROWSER",
    description: "Automated site navigation, cookie management simulation, and DOM extraction.",
    icon: "🌐",
    color: "#FFAA00",
    systemPrompt: "You are NEVA_BROWSER. You clean web content, parse readability nodes, strip advertising junk, and extract deep inner texts with absolute structure.",
    reasoningBehavior: "fast",
    executionStyle: "autonomous",
    autonomyLevel: 8,
    verbosity: "minimal",
    preferredModel: "google/gemini-3.5-flash",
    allowedTools: ["render_dom", "extract_meta"],
    isSystem: true,
    isPublic: true
  },
  {
    id: "p12",
    name: "NEVA_FILES",
    description: "File chunking, archive folder structures, metadata parsing, and codebase imports tracing.",
    icon: "📂",
    color: "#FF00AA",
    systemPrompt: "You are NEVA_FILES. You index directories, compute similarity indices, parse archive schemas, check MIME validity, and isolate file code symbols recursively.",
    reasoningBehavior: "balanced",
    executionStyle: "autonomous",
    autonomyLevel: 8,
    verbosity: "normal",
    preferredModel: "google/gemini-3.5-flash",
    allowedTools: ["parse_tree", "generate_summary"],
    isSystem: true,
    isPublic: true
  },
  {
    id: "p13",
    name: "NEVA_DATA",
    description: "Heavy database ETL pipelines design, SQL script checking, and schema generation.",
    icon: "💾",
    color: "#00F5FF",
    systemPrompt: "You are NEVA_DATA. You evaluate database indexing, structure JSONB indices, write clean SQL transactions, and draft relational DDL schemas.",
    reasoningBehavior: "balanced",
    executionStyle: "autonomous",
    autonomyLevel: 8,
    verbosity: "normal",
    preferredModel: "google/gemini-3.5-flash",
    allowedTools: ["generate_sql", "dry_run"],
    isSystem: true,
    isPublic: true
  },
  {
    id: "p14",
    name: "NEVA_REPORTER",
    description: "Production executive briefs, reports compiling, and markdown exports styling.",
    icon: "📝",
    color: "#00FF88",
    systemPrompt: "You are NEVA_REPORTER. You assemble insights from other agents, polish visual presentation hierarchies, add clear dividers, and structure elegant document reports.",
    reasoningBehavior: "fast",
    executionStyle: "autonomous",
    autonomyLevel: 9,
    verbosity: "normal",
    preferredModel: "google/gemini-3.5-flash",
    allowedTools: ["format_pdf_markdown", "export_slides"],
    isSystem: true,
    isPublic: true
  },
  {
    id: "p15",
    name: "NEVA_SELF_IMPROVE",
    description: "Performance analysis, parameter calibrations, and routing rules optimizations.",
    icon: "⚡",
    color: "#FF00AA",
    systemPrompt: "You are NEVA_SELF_IMPROVE. You analyze logs, evaluate speed-to-tokens latencies, diagnose bottlenecks, design routing exceptions, and suggest skill enhancements for system compilation.",
    reasoningBehavior: "ultra-deep",
    executionStyle: "supervised",
    autonomyLevel: 5,
    verbosity: "debug",
    preferredModel: "google/gemini-3.1-pro-preview",
    allowedTools: ["analyze_metrics", "compile_overrides"],
    isSystem: true,
    isPublic: true
  }
];

/**
 * 50 pre-seeded skills categorized inside Research, Engineering, Writing, Data, AI
 */
export const SEEDED_SKILLS: Skill[] = [
  // RESEARCH Category (10)
  { id: "sk1", name: "Deep Web Investigator", slug: "deep-research", description: "Multi-layered web query expanding and crawling with target prioritization.", category: "Research", definition: {}, isBuiltin: true, isPublic: true, usageCount: 247, successRate: 0.98 },
  { id: "sk2", name: "Competitive Analysis Engine", slug: "competitive-analysis", description: "Saves target profiles, maps layout structures, and aggregates product comparison columns.", category: "Research", definition: {}, isBuiltin: true, isPublic: true, usageCount: 184, successRate: 0.95 },
  { id: "sk3", name: "Literature Review Compilator", slug: "literature-review", description: "Indexes academic articles, normalizes citations, and identifies conceptual voids.", category: "Research", definition: {}, isBuiltin: true, isPublic: true, usageCount: 92, successRate: 0.97 },
  { id: "sk4", name: "Fact Check Cross-Referencer", slug: "fact-check", description: "Verifies controversial assertions across multiple trust networks.", category: "Research", definition: {}, isBuiltin: true, isPublic: true, usageCount: 153, successRate: 0.99 },
  { id: "sk5", name: "Trend Analysis Predictor", slug: "trend-analysis", description: "Monitors search queries volume, interest indexing, and structures direction vectors.", category: "Research", definition: {}, isBuiltin: true, isPublic: true, usageCount: 211, successRate: 0.94 },
  { id: "sk6", name: "Market Intelligent Monitor", slug: "market-research", description: "Evaluates consumer patterns, pricing indices, and sentiment logs.", category: "Research", definition: {}, isBuiltin: true, isPublic: true, usageCount: 139, successRate: 0.96 },
  { id: "sk7", name: "Semantic Data Synthesis", slug: "data-insights", description: "Discovers semantic categories across large unstructured texts.", category: "Research", definition: {}, isBuiltin: true, isPublic: true, usageCount: 305, successRate: 0.97 },
  { id: "sk8", name: "Bespoke News Crawler", slug: "news-monitor", description: "Periodically polls RSS schedules, scrapes body content, and detects anomalies.", category: "Research", definition: {}, isBuiltin: true, isPublic: true, usageCount: 78, successRate: 0.92 },
  { id: "sk9", name: "Dual-source Citations Validator", slug: "source-synthesis", description: "Tracks source origins and builds reliable reference indexes.", category: "Research", definition: {}, isBuiltin: true, isPublic: true, usageCount: 120, successRate: 0.99 },
  { id: "sk10", name: "Scientific Hypothesis Tester", slug: "hypothesis-test", description: "Generates test cases, constructs control parameters, logic checks conclusions.", category: "Research", definition: {}, isBuiltin: true, isPublic: true, usageCount: 45, successRate: 0.91 },

  // ENGINEERING Category (10)
  { id: "sk11", name: "Code Review Auditor", slug: "code-review", description: "Audits repository diffs, alerts security violations, structures clean style guides.", category: "Engineering", definition: {}, isBuiltin: true, isPublic: true, usageCount: 512, successRate: 0.99 },
  { id: "sk12", name: "Repository Interactive Explainer", slug: "repo-explain", description: "Walks through directory maps, file dependancies routing, and modular components definitions.", category: "Engineering", definition: {}, isBuiltin: true, isPublic: true, usageCount: 382, successRate: 0.97 },
  { id: "sk13", name: "Architectural System Designer", slug: "architecture-design", description: "Generates UML mapping schemas, state machine configurations, and C4 charts diagrams.", category: "Engineering", definition: {}, isBuiltin: true, isPublic: true, usageCount: 201, successRate: 0.96 },
  { id: "sk14", name: "Code debugger & Bug Hunter", slug: "bug-hunt", description: "Traces dynamic stack overflows, sanitizes variables types, and patches code limits.", category: "Engineering", definition: {}, isBuiltin: true, isPublic: true, usageCount: 433, successRate: 0.98 },
  { id: "sk15", name: "Refactoring Blueprint planner", slug: "refactor-plan", description: "Optimizes modular components, decouples heavy helper classes, and cleans code paths.", category: "Engineering", definition: {}, isBuiltin: true, isPublic: true, usageCount: 189, successRate: 0.95 },
  { id: "sk16", name: "Test harness Generator", slug: "test-generator", description: "Assembles complete Jest mock, Vitest, and Playwright system integration test files.", category: "Engineering", definition: {}, isBuiltin: true, isPublic: true, usageCount: 265, successRate: 0.99 },
  { id: "sk17", name: "Comprehensive Security Auditor", slug: "security-audit", description: "Scans imports for deprecated modules, missing sanitations, and secret API leaks.", category: "Engineering", definition: {}, isBuiltin: true, isPublic: true, usageCount: 172, successRate: 0.98 },
  { id: "sk18", name: "REST API Endpoint Designer", slug: "api-design", description: "Outlines robust OpenAPI JSON definitions, validation models, and router handlers.", category: "Engineering", definition: {}, isBuiltin: true, isPublic: true, usageCount: 228, successRate: 0.97 },
  { id: "sk19", name: "Performance Bottleneck Auditor", slug: "performance-audit", description: "Tracks memory leaks, loops blockings, and database indexing speeds.", category: "Engineering", definition: {}, isBuiltin: true, isPublic: true, usageCount: 114, successRate: 0.94 },
  { id: "sk20", name: "Code Dependancy Mapper", slug: "dependency-map", description: "Calculates cycles, builds modules lists, and checks import depth boundaries.", category: "Engineering", definition: {}, isBuiltin: true, isPublic: true, usageCount: 140, successRate: 0.98 },

  // WRITING Category (10)
  { id: "sk21", name: "Executive Brief Compiler", slug: "research-brief", description: "Condenses deep briefings into tight 1-page structures.", category: "Writing", definition: {}, isBuiltin: true, isPublic: true, usageCount: 310, successRate: 0.98 },
  { id: "sk22", name: "Technical Writer & Documentor", slug: "technical-writer", description: "Formats SDK readmes, code files, and custom components parameters tutorials.", category: "Writing", definition: {}, isBuiltin: true, isPublic: true, usageCount: 421, successRate: 0.99 },
  { id: "sk23", name: "Proposal Writer Planner", slug: "proposal-writer", description: "Drafts comprehensive business specifications, bids packages, and estimates documents.", category: "Writing", definition: {}, isBuiltin: true, isPublic: true, usageCount: 156, successRate: 0.96 },
  { id: "sk24", name: "Cold Reachout email Designer", slug: "email-composer", description: "Designs conversational, concise intro hooks with high conversions rates.", category: "Writing", definition: {}, isBuiltin: true, isPublic: true, usageCount: 198, successRate: 0.94 },
  { id: "sk25", name: "Executive Report Generator", slug: "report-generator", description: "Combines analyst data grids into gorgeous styled reports with clear headers.", category: "Writing", definition: {}, isBuiltin: true, isPublic: true, usageCount: 340, successRate: 0.98 },
  { id: "sk26", name: "Engaging Content Writer", slug: "blog-post", description: "Drafts rich, explanatory articles with friendly voice and clean dividers.", category: "Writing", definition: {}, isBuiltin: true, isPublic: true, usageCount: 215, successRate: 0.97 },
  { id: "sk27", name: "Presentation Deck Outline Planner", slug: "presentation-writer", description: "Structures slide-by-slide titles, key takeaways, and visual diagram ideas.", category: "Writing", definition: {}, isBuiltin: true, isPublic: true, usageCount: 187, successRate: 0.95 },
  { id: "sk28", name: "High-impact Press Releaser", slug: "press-release", description: "Drafts official launch announcements aligning to journalist formats.", category: "Writing", definition: {}, isBuiltin: true, isPublic: true, usageCount: 88, successRate: 0.96 },
  { id: "sk29", name: "SEO Content strategist", slug: "content-strategy", description: "Analyzes high-impact keyword groups and schedules article publishing planners.", category: "Writing", definition: {}, isBuiltin: true, isPublic: true, usageCount: 167, successRate: 0.94 },
  { id: "sk30", name: "Bespoke Copywriting Synthesizer", slug: "copywriter", description: "Evaluates messaging variations, edits styles, and improves readability parameters.", category: "Writing", definition: {}, isBuiltin: true, isPublic: true, usageCount: 290, successRate: 0.97 },

  // DATA Category (10)
  { id: "sk31", name: "CSV Dynamic Analyzer", slug: "csv-insights", description: "Queries dataset rows, calculates statistical correlations, and parses columns limits.", category: "Data", definition: {}, isBuiltin: true, isPublic: true, usageCount: 395, successRate: 0.97 },
  { id: "sk32", name: "Optimized SQL Planner & Generator", slug: "sql-generator", description: "Writes safe SQL queries, creates joins, structures indices, and plans triggers.", category: "Data", definition: {}, isBuiltin: true, isPublic: true, usageCount: 460, successRate: 0.98 },
  { id: "sk33", name: "Recharts Dashboard Architect", slug: "dashboard-builder", description: "Generates layout specs, color arrays, and visual indicators for stats logs.", category: "Data", definition: {}, isBuiltin: true, isPublic: true, usageCount: 288, successRate: 0.98 },
  { id: "sk34", name: "Log file Anomaly Hunter", slug: "anomaly-detect", description: "Flags outlier counts, rate limits hits, system exceptions, and security risks.", category: "Data", definition: {}, isBuiltin: true, isPublic: true, usageCount: 177, successRate: 0.96 },
  { id: "sk35", name: "Dynamic forecast Predictor", slug: "forecast-model", description: "Runs progression logic, averages seasonality shifts, and projects bounds ranges.", category: "Data", definition: {}, isBuiltin: true, isPublic: true, usageCount: 142, successRate: 0.93 },
  { id: "sk36", name: "Dataset sanitator & Column Cleaner", slug: "data-cleaner", description: "Detects missing bounds, converts formats, structures JSON strings, and scrubs nulls.", category: "Data", definition: {}, isBuiltin: true, isPublic: true, usageCount: 254, successRate: 0.98 },
  { id: "sk37", name: "ETL pipeline script Builder", slug: "etl-designer", description: "Assembles source fetch, parsing steps, and batch databases insertions schemas.", category: "Data", definition: {}, isBuiltin: true, isPublic: true, usageCount: 119, successRate: 0.95 },
  { id: "sk38", name: "Business intelligence Architect", slug: "bi-report", description: "Drafts comprehensive summaries highlighting key metrics, goals progress, and charts.", category: "Data", definition: {}, isBuiltin: true, isPublic: true, usageCount: 198, successRate: 0.97 },
  { id: "sk39", name: "User Feedback Classifier", slug: "survey-analysis", description: "Categorizes scores distributions, extracts sentiments groups, and lists bug issues.", category: "Data", definition: {}, isBuiltin: true, isPublic: true, usageCount: 165, successRate: 0.96 },
  { id: "sk40", name: "Enterprise KPI Tracker", slug: "kpi-tracker", description: "Monitors daily counts targets, lists variations levels, alerts values dips.", category: "Data", definition: {}, isBuiltin: true, isPublic: true, usageCount: 201, successRate: 0.98 },

  // AI Category (10)
  { id: "sk41", name: "Prompt optimizer & Architect", slug: "prompt-engineer", description: "Refines instruction structures, plans XML separators tags, and specifies precise outputs schemas.", category: "AI", definition: {}, isBuiltin: true, isPublic: true, usageCount: 480, successRate: 0.99 },
  { id: "sk42", name: "Multi-agent coordinator & Planner", slug: "multi-agent-design", description: "Designs interaction rules, roles allocations, and schedules parallel feedback channels.", category: "AI", definition: {}, isBuiltin: true, isPublic: true, usageCount: 310, successRate: 0.97 },
  { id: "sk43", name: "Dynamic Workflow Scheduler", slug: "workflow-builder", description: "Chains independent processing nodes, matches triggers state, and resolves failures.", category: "AI", definition: {}, isBuiltin: true, isPublic: true, usageCount: 245, successRate: 0.96 },
  { id: "sk44", name: "Model Accuracy Evaluator", slug: "model-evaluator", description: "Tests response matches, validates schemas JSON compliance, and measures speed times.", category: "AI", definition: {}, isBuiltin: true, isPublic: true, usageCount: 156, successRate: 0.98 },
  { id: "sk45", name: "Fine-tuning prompt packager", slug: "fine-tune-prep", description: "Compiles conversation chains, cleans context lines, and validates JSONL formats.", category: "AI", definition: {}, isBuiltin: true, isPublic: true, usageCount: 89, successRate: 0.95 },
  { id: "sk46", name: "RAG Context optimizer", slug: "rag-builder", description: "Calibrates chunking overlap sizes, adjusts weights variables, tests retrieval indices.", category: "AI", definition: {}, isBuiltin: true, isPublic: true, usageCount: 233, successRate: 0.98 },
  { id: "sk47", name: "Multi-agent debugging Auditor", slug: "agent-debugger", description: "Traces dynamic trace loops, logs models response delays, and checks system exceptions.", category: "AI", definition: {}, isBuiltin: true, isPublic: true, usageCount: 198, successRate: 0.97 },
  { id: "sk48", name: "Context limit compressor", slug: "context-optimizer", description: "Scrubs useless noise words, compiles semantic blocks, and optimizes context use.", category: "AI", definition: {}, isBuiltin: true, isPublic: true, usageCount: 167, successRate: 0.98 },
  { id: "sk49", name: "Chain-of-thought calibrator", slug: "chain-designer", description: "Injects step guides prompts, designs planning prompts, and setups validations.", category: "AI", definition: {}, isBuiltin: true, isPublic: true, usageCount: 211, successRate: 0.95 },
  { id: "sk50", name: "Self-correcting Prompt Optimizer", slug: "self-improve", description: "Monitors errors trends, refines guidelines, and auto-patches prompt files.", category: "AI", definition: {}, isBuiltin: true, isPublic: true, usageCount: 124, successRate: 0.92 }
];
