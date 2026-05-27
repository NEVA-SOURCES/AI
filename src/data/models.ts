export interface OpenRouterModel {
  id: string;
  name: string;
  provider: string;
  contextWindow: string;
  cost: string;
  category: "General/Logic" | "Coding/Detail" | "Speed/Chat" | "Reasoning/Advanced";
  tags: string[];
  latency: string; // e.g. "0.3s", "0.8s"
  description: string;
}

export const OPENROUTER_MODELS: OpenRouterModel[] = [
  {
    id: "google/gemini-2.5-flash:free",
    name: "Gemini 2.5 Flash",
    provider: "Google API (Free)",
    contextWindow: "1,048,576 tokens",
    cost: "Free",
    category: "General/Logic",
    tags: ["Multimodal", "Huge Context", "Fast"],
    latency: "0.25s",
    description: "Next-gen lightweight model designed for high-frequency multimodal analysis and extremely large documents."
  },
  {
    id: "deepseek/deepseek-chat:free",
    name: "DeepSeek V3",
    provider: "DeepSeek AI (Free)",
    contextWindow: "64,000 tokens",
    cost: "Free",
    category: "Coding/Detail",
    tags: ["High Logic", "Coding", "Sleek"],
    latency: "0.68s",
    description: "SOTA Chinese open weights system matching premier tier closed models in general intelligence and software design."
  },
  {
    id: "meta-llama/llama-3.3-70b-instruct:free",
    name: "Llama 3.3 70B Instruct",
    provider: "Meta (Free)",
    contextWindow: "128,000 tokens",
    cost: "Free",
    category: "Reasoning/Advanced",
    tags: ["70B Parameter", "Instruct", "Smart"],
    latency: "0.45s",
    description: "Industry standard for complex multi-turn logical instructions, reasoning pipelines, and robust compliance."
  },
  {
    id: "qwen/qwen-2.5-72b-instruct:free",
    name: "Qwen 2.5 72B Instruct",
    provider: "Alibaba (Free)",
    contextWindow: "32,768 tokens",
    cost: "Free",
    category: "Coding/Detail",
    tags: ["Code Expert", "Multilingual", "Math"],
    latency: "0.52s",
    description: "Premier intelligence tier specializing in raw mathematics, dense source code debugging, and multilingual directives."
  },
  {
    id: "google/gemini-2.5-pro:free",
    name: "Gemini 2.5 Pro",
    provider: "Google API (Free)",
    contextWindow: "1,048,576 tokens",
    cost: "Free",
    category: "Reasoning/Advanced",
    tags: ["Elite Reasoning", "Huge Context", "Multimodal"],
    latency: "0.95s",
    description: "Highest performance free Google offering. Outstanding logical depth, full-file audit support, and audiovisual understanding."
  },
  {
    id: "meta-llama/llama-3-8b-instruct:free",
    name: "Llama 3 8B Instruct",
    provider: "Meta (Free)",
    contextWindow: "8,192 tokens",
    cost: "Free",
    category: "Speed/Chat",
    tags: ["Ultra Fast", "Lightweight", "Chatty"],
    latency: "0.15s",
    description: "Blazing fast 8B model suitable for rapid sub-second validation routines, quick editing, or simple casual chat."
  },
  {
    id: "cohere/command-r:free",
    name: "Command R",
    provider: "Cohere Corp (Free)",
    contextWindow: "128,000 tokens",
    cost: "Free",
    category: "General/Logic",
    tags: ["RAG Specialist", "Tool Support", "Doc-Dense"],
    latency: "0.38s",
    description: "Engineered specifically for rich document retrieval tasks, structured API connector calls, and tabular summaries."
  },
  {
    id: "mistralai/mistral-7b-instruct:free",
    name: "Mistral 7B Instruct",
    provider: "Mistral AI (Free)",
    contextWindow: "32,768 tokens",
    cost: "Free",
    category: "Speed/Chat",
    tags: ["Fast", "European Fine-tune"],
    latency: "0.18s",
    description: "Highly robust lightweight European open model championing dense instructional command-following dynamics."
  },
  {
    id: "microsoft/phi-3-medium-128k-instruct:free",
    name: "Phi 3 Medium 128K",
    provider: "Microsoft (Free)",
    contextWindow: "128,000 tokens",
    cost: "Free",
    category: "Reasoning/Advanced",
    tags: ["SMoE Logic", "128K Context", "Reasoning"],
    latency: "0.40s",
    description: "Compact model trained on synthetic textbook data, packing surprisingly deep physics and logic deduction chops."
  },
  {
    id: "openchat/openchat-7b:free",
    name: "OpenChat 3.5 7B",
    provider: "OpenChat (Free)",
    contextWindow: "8,192 tokens",
    cost: "Free",
    category: "Speed/Chat",
    tags: ["Conversational", "High User-Score"],
    latency: "0.22s",
    description: "A specialized conversational fine-tune utilizing offline reinforcement learning to emulate empathetic chat."
  }
];
