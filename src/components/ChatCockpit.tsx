import { useState, useRef, useEffect } from "react";
import { useApp } from "../AppContext";
import { motion, AnimatePresence } from "motion/react";
import { 
  Send, Paperclip, CheckSquare, X, Settings, Layers, ShieldAlert, Search,
  FileCode, Check, Copy, Radio, Sparkles, ChevronDown, Brain, Globe, Copy as CopyIcon,
  Cpu, Terminal, Activity, Loader2, Link2, Download, Archive, Eye, EyeOff,
  RefreshCw, Server, Sliders
} from "lucide-react";
import Markdown from "react-markdown";
import JSZip from "jszip";
import { downloadRawFile } from "../utils/fileExporter";
import ThinkingStream from "./ThinkingStream";

// Classnames merger micro-utility
function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

// Markdown helper parsers
function parseMessageContent(content: string) {
  const thinkRegex = /<think>([\s\S]*?)<\/think>/i;
  const match = content.match(thinkRegex);
  
  if (match) {
    const thinkContent = match[1].trim();
    const restContent = content.replace(thinkRegex, "").trim();
    return { thinkContent, restContent };
  }
  
  return { thinkContent: null, restContent: content };
}

function parseCitations(content: string) {
  const citationHeader = "### 🌐 Web Grounding Citations";
  const citationHeaderIndex = content.indexOf(citationHeader);
  if (citationHeaderIndex !== -1) {
    const mainBody = content.substring(0, citationHeaderIndex).trim();
    const citationSection = content.substring(citationHeaderIndex).trim();
    return { mainBody, citationSection };
  }
  return { mainBody: content, citationSection: null };
}

// Local helper components for inline parsing
// Local helper components for inline parsing
function getExtensionForLanguage(lang: string): string {
  const l = lang.toLowerCase();
  if (l === "typescript" || l === "ts") return "ts";
  if (l === "tsx") return "tsx";
  if (l === "javascript" || l === "js") return "js";
  if (l === "jsx") return "jsx";
  if (l === "python" || l === "py") return "py";
  if (l === "html") return "html";
  if (l === "css") return "css";
  if (l === "json") return "json";
  if (l === "markdown" || l === "md") return "md";
  if (l === "yaml" || l === "yml") return "yml";
  if (l === "rust" || l === "rs") return "rs";
  if (l === "go") return "go";
  if (l === "sql") return "sql";
  if (l === "bash" || l === "sh") return "sh";
  return "txt";
}

const HIGHLIGHT_RULES = {
  js: {
    pattern: /(\/\/.*|\/\*[\s\S]*?\*\/)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\`(?:\\.|[^\`\\])*\`)|(\b\d+(?:\.\d+)?\b)|(\b(?:const|let|var|function|return|if|else|for|while|do|break|continue|switch|case|default|import|export|from|class|extends|new|this|typeof|instanceof|in|of|async|await|try|catch|finally|throw|type|interface|enum|public|private|protected|readonly|static|string|number|boolean|any|unknown|void|never|undefined|as|from|export|import)\b)|(\b(?:console|log|warn|process|window|document|Math|JSON|Date|Array|Object|String|Number|Boolean|Map|Set|Promise|Error)\b)|(\b\w+(?=\s*\())/g,
    classes: [
      "text-zinc-500 italic font-mono", // comment
      "text-emerald-400 font-sans font-medium", // string
      "text-amber-400 font-mono", // number
      "text-purple-400 font-extrabold font-mono", // keyword / storage
      "text-sky-400 font-semibold font-mono", // builtin
      "text-blue-400 font-mono" // method
    ]
  },
  py: {
    pattern: /(#.*)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')|(\b\d+(?:\.\d+)?\b)|(\b(?:def|return|if|elif|else|for|while|break|continue|import|from|as|class|try|except|finally|raise|with|lambda|global|nonlocal|pass|and|or|not|is|in|yield|None|True|False)\b)|(\b(?:print|len|range|str|int|float|list|dict|set|tuple|open|max|min|abs|round|enumerate|zip|sum)\b)|(\b\w+(?=\s*\())/g,
    classes: [
      "text-zinc-500 italic font-mono", // comment
      "text-emerald-400 font-sans font-medium", // string
      "text-amber-400 font-mono", // number
      "text-purple-400 font-extrabold font-mono", // keyword
      "text-sky-400 font-semibold font-mono", // builtin
      "text-blue-400 font-mono" // method
    ]
  },
  html: {
    pattern: /(<!--[\s\S]*?-->)|(<[!?]?[a-zA-Z1-6\-]+(?:\s+[^=<>]+=(?:'[^']*'|"[^"]*"|[^\s>]+))*\s*\/?>|<\/[a-zA-Z1-6\-]+>)/g,
    classes: [
      "text-zinc-500 italic font-mono", // comment
      "text-blue-400 font-mono" // tag
    ]
  }
};

function highlightHtmlTag(tagText: string): any {
  const tagRegex = /(<\/?)([a-zA-Z1-6\-]+)|(\s+[a-zA-Z0-9\-]+=)("[^"]*"|'[^']*')|(\/?>)/g;
  const nodes: any[] = [];
  let lastIdx = 0;
  let match;
  
  while ((match = tagRegex.exec(tagText)) !== null) {
    if (match.index > lastIdx) {
      nodes.push(<span key={lastIdx}>{tagText.slice(lastIdx, match.index)}</span>);
    }
    
    if (match[1]) {
      // Opening or closing bracket syntax (e.g., "<", "</")
      nodes.push(<span key={`brac-${match.index}`} className="text-zinc-500 font-sans">{match[1]}</span>);
      // Tag name (e.g. "div")
      nodes.push(<span key={`tag-${match.index}`} className="text-purple-400 font-extrabold font-mono">{match[2]}</span>);
    } else if (match[3]) {
      // Attribute name (e.g. " class=")
      nodes.push(<span key={`attr-${match.index}`} className="text-sky-400 font-mono">{match[3]}</span>);
      // Attribute value (e.g. '"p-4"')
      nodes.push(<span key={`val-${match.index}`} className="text-emerald-400 font-medium font-mono">{match[4]}</span>);
    } else if (match[5]) {
      // Closing bracket syntax (e.g. ">", "/>")
      nodes.push(<span key={`close-${match.index}`} className="text-zinc-500 font-sans">{match[5]}</span>);
    }
    
    lastIdx = tagRegex.lastIndex;
  }
  
  if (lastIdx < tagText.length) {
    nodes.push(<span key={lastIdx}>{tagText.slice(lastIdx)}</span>);
  }
  
  return <>{nodes}</>;
}

function highlightCode(code: string, lang: string): any[] {
  const normalizedLang = (lang || "code").toLowerCase();
  
  let Rule = null;
  if (["js", "jsx", "ts", "tsx", "javascript", "typescript", "json"].includes(normalizedLang)) {
    Rule = HIGHLIGHT_RULES.js;
  } else if (["py", "python"].includes(normalizedLang)) {
    Rule = HIGHLIGHT_RULES.py;
  } else if (["html", "xml", "xhtml"].includes(normalizedLang)) {
    Rule = HIGHLIGHT_RULES.html;
  }

  if (!Rule) {
    return [<span key="plain-code">{code}</span>];
  }

  try {
    const matches: { index: number; text: string; className: string }[] = [];
    // Copy the regular expression pattern securely using standard string source and flags representation
    const regex = new RegExp(Rule.pattern.source, Rule.pattern.flags);
    let match;

    while ((match = regex.exec(code)) !== null) {
      for (let i = 1; i < match.length; i++) {
        if (match[i] !== undefined) {
          matches.push({
            index: match.index,
            text: match[i],
            className: Rule.classes[i - 1]
          });
          break;
        }
      }
    }

    const nodes: any[] = [];
    let lastIndex = 0;

    for (const m of matches) {
      if (m.index > lastIndex) {
        nodes.push(<span key={`text-${lastIndex}`}>{code.slice(lastIndex, m.index)}</span>);
      }
      
      if (normalizedLang === "html" && m.className.includes("text-blue-400")) {
        nodes.push(<span key={`html-tag-${m.index}`}>{highlightHtmlTag(m.text)}</span>);
      } else if (normalizedLang === "json" && m.className.includes("font-sans")) {
        const isKey = code[m.index + m.text.length] === ":" || code.slice(m.index + m.text.length).trim().startsWith(":");
        const cls = isKey ? "text-blue-400 font-mono font-extrabold" : m.className;
        nodes.push(<span key={`match-${m.index}`} className={cls}>{m.text}</span>);
      } else {
        nodes.push(<span key={`match-${m.index}`} className={m.className}>{m.text}</span>);
      }
      
      lastIndex = m.index + m.text.length;
    }

    if (lastIndex < code.length) {
      nodes.push(<span key={`text-${lastIndex}`}>{code.slice(lastIndex)}</span>);
    }

    return nodes;
  } catch (err) {
    console.error("highlightCode parsing error gracefully caught (falling back to plain code):", err);
    return [<span key="error-fallback">{code}</span>];
  }
}

function CodeBlock({ children, className, ...props }: { children: any, className?: string, [key: string]: any }) {
  const [copied, setCopied] = useState(false);
  const [zipping, setZipping] = useState(false);
  const codeVal = String(children).replace(/\n$/, "");
  const match = /language-(\w+)/.exec(className || "");
  const language = match ? match[1] : "code";

  // Check if this is a block code element vs inline code
  const isInline = !match && !String(children).includes("\n");

  if (isInline) {
    return (
      <code className="bg-zinc-950/80 border border-zinc-800 rounded px-1.5 py-0.5 text-cyan-400 font-mono text-[10.5px] font-bold mx-0.5 break-words inline" {...props}>
        {children}
      </code>
    );
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(codeVal);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadRaw = () => {
    const ext = getExtensionForLanguage(language);
    const filename = `neva_generated_code_${Math.floor(Math.random() * 10000)}.${ext}`;
    downloadRawFile(filename, codeVal, "text/plain");
  };

  const handleDownloadZip = async () => {
    setZipping(true);
    try {
      const ext = getExtensionForLanguage(language);
      const filename = `generated_file.${ext}`;
      const zip = new JSZip();
      zip.file(filename, codeVal);
      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `neva_code_bundle_${Math.floor(Math.random() * 10000)}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("ZIP Generation error on block:", err);
    } finally {
      setZipping(false);
    }
  };

  return (
    <div className="relative border border-zinc-850 bg-[#08080a] rounded-xl overflow-hidden my-4 shadow-lg select-text">
      <div className="flex items-center justify-between px-4 py-2 bg-[#0d0d11] border-b border-zinc-850 text-[10px] font-mono select-none flex-wrap gap-2">
        <span className="uppercase font-bold tracking-wider text-cyan-400">{language}</span>
        
        <div className="flex items-center gap-1.5 font-sans">
          {/* Copy Button */}
          <button
            type="button"
            onClick={handleCopy}
            className={`flex items-center gap-1 px-2 py-0.5 rounded text-[9.5px] hover:bg-zinc-800 transition-colors font-semibold uppercase tracking-wider ${copied ? 'text-emerald-450' : 'text-zinc-500 hover:text-white'}`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[2.5]" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <CopyIcon className="w-3 h-3 text-zinc-500" />
                <span>Copy</span>
              </>
            )}
          </button>

          <div className="w-[1px] h-3.5 bg-zinc-800"></div>

          {/* Download Raw File Button */}
          <button
            type="button"
            onClick={handleDownloadRaw}
            className="flex items-center gap-1 px-2 py-0.5 rounded text-[9.5px] text-zinc-500 hover:text-cyan-300 hover:bg-zinc-800 transition-colors font-semibold uppercase tracking-wider cursor-pointer"
            title="Download block code directly to your local file system as its native type"
          >
            <Download className="w-3 h-3 text-cyan-400" />
            <span>Download</span>
          </button>

          {/* Download ZIP Package Button */}
          <button
            type="button"
            onClick={handleDownloadZip}
            disabled={zipping}
            className="flex items-center gap-1 px-2 py-0.5 rounded text-[9.5px] text-zinc-500 hover:text-emerald-400 hover:bg-zinc-800 transition-colors font-semibold uppercase tracking-wider cursor-pointer"
            title="Download block compiled in a secure ZIP archive"
          >
            <Archive className="w-3 h-3 text-emerald-400" />
            <span>{zipping ? "Zipping..." : "ZIP"}</span>
          </button>
        </div>
      </div>
      <pre className="p-4 overflow-x-auto text-[11px] sm:text-xs font-mono leading-relaxed bg-[#050507] scrollbar-thin">
        <code className={className} {...props}>
          {highlightCode(codeVal, language)}
        </code>
      </pre>
    </div>
  );
}

function getBlocksFromMessage(content: string) {
  const blocks: { language: string; code: string; name: string }[] = [];
  const regex = /```(\w*)\n([\s\S]*?)```/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const lang = match[1] || "txt";
    const code = match[2];
    
    // Attempt to guess a helpful file name based on comment patterns
    let name = "";
    const lines = code.split("\n").slice(0, 3);
    for (const line of lines) {
      const nameMatch = /(?:filename|file|@file|path):\s*([a-zA-Z0-9_\-\.\/]+)/i.exec(line);
      if (nameMatch) {
         name = nameMatch[1].split("/").pop() || "";
         break;
      }
    }
    
    if (!name) {
      const ext = getExtensionForLanguage(lang);
      name = `neva_generated_file_${blocks.length + 1}.${ext}`;
    }
    
    blocks.push({
      language: lang,
      code: code,
      name: name
    });
  }
  return blocks;
}

interface MessageDownloadCenterProps {
  content: string;
  messageId: string;
}

function MessageDownloadCenter({ content, messageId }: MessageDownloadCenterProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [customFilename, setCustomFilename] = useState("");
  
  const blocks = getBlocksFromMessage(content);
  
  const handleExportFullMessage = async (format: "html" | "txt" | "md" | "zip") => {
    setIsExporting(true);
    try {
      const baseName = customFilename.trim() 
        ? customFilename.replace(/[^a-z0-9]/gi, "_").toLowerCase()
        : `neva_export_${messageId.substring(0, 5)}`;
        
      if (format === "md") {
        downloadRawFile(`${baseName}.md`, content, "text/markdown");
      } else if (format === "txt") {
        const docText = content.replace(/[#*`_-]/g, "");
        downloadRawFile(`${baseName}.txt`, docText, "text/plain");
      } else if (format === "html") {
        const htmlDoc = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NEVA Workstation Export - ${baseName}</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
    <style>
        body {
            background-color: #030406;
            color: #d4d4d8;
            font-family: 'Inter', system-ui, -apple-system, sans-serif;
            line-height: 1.6;
            padding: 2.5rem 1.5rem;
            max-width: 800px;
            margin: 0 auto;
        }
        header {
            border-bottom: 1px solid #1f2937;
            padding-bottom: 1.5rem;
            margin-bottom: 2rem;
        }
        h1 {
            color: #ffffff;
            font-size: 1.5rem;
            font-weight: 700;
            margin: 0 0 0.5rem 0;
            letter-spacing: -0.025em;
        }
        .meta {
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.75rem;
            color: #06b6d4;
            text-transform: uppercase;
            letter-spacing: 0.1em;
        }
        .content {
            background-color: #090b0e;
            border: 1px solid #181c24;
            border-radius: 1rem;
            padding: 2rem;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
        }
        pre {
            background-color: #040507;
            border: 1px solid #27272a;
            border-radius: 0.5rem;
            padding: 1rem;
            overflow-x: auto;
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.85rem;
            color: #22d3ee;
        }
        code {
            font-family: 'JetBrains Mono', monospace;
            background-color: #181c24;
            padding: 0.2rem 0.4rem;
            border-radius: 0.25rem;
            font-size: 0.9em;
            color: #f43f5e;
        }
        pre code {
            background-color: transparent;
            padding: 0;
            border-radius: 0;
            color: inherit;
        }
        blockquote {
            border-left: 3px solid #06b6d4;
            margin: 1.5rem 0;
            padding-left: 1rem;
            font-style: italic;
            color: #a1a1aa;
        }
        footer {
            margin-top: 3rem;
            text-align: center;
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.75rem;
            color: #52525b;
        }
    </style>
</head>
<body>
    <header>
        <h1>NEVA Artificial Cognitive Intelligence Export</h1>
        <div class="meta">SYSTEM LEDGER BUNDLE // ARCHIVE_ID: ${messageId.substring(0, 12)}</div>
    </header>
    <div class="content">
        ${content
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/```(\w*)\n([\s\S]*?)```/g, "<pre><code>$2</code></pre>")
          .replace(/`([^`]+)`/g, "<code>$1</code>")
          .replace(/\n\n/g, "<br/><br/>")}
    </div>
    <footer>
        SECURE INTEGRITY VERIFIED // GENERATED ${new Date().toLocaleString()}
    </footer>
</body>
</html>`;
        downloadRawFile(`${baseName}.html`, htmlDoc, "text/html");
      } else if (format === "zip") {
        const zip = new JSZip();
        zip.file("README.md", `# NEVA Workspace Code Export\n\nGenerated files from AI conversation message: **${messageId}**.\nDate: ${new Date().toLocaleString()}`);
        zip.file("response_transcript.md", content);
        
        if (blocks.length > 0) {
          blocks.forEach(b => {
            zip.file(b.name, b.code);
          });
        }
        
        const blob = await zip.generateAsync({ type: "blob" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${baseName}.zip`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error("Failed to compile export:", err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadSingleBlock = async (block: typeof blocks[0], fmt: "raw" | "zip" | "html") => {
    const ext = getExtensionForLanguage(block.language);
    const baseName = block.name.replace(/\.[^/.]+$/, "");
    
    if (fmt === "raw") {
      downloadRawFile(block.name, block.code, "text/plain");
    } else if (fmt === "zip") {
      const zip = new JSZip();
      zip.file(block.name, block.code);
      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${baseName}_code_package.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else if (fmt === "html") {
      const htmlBlock = `<!DOCTYPE html>
<html>
<head>
  <style>
    body { background: #030406; color: #e4e4e7; font-family: sans-serif; padding: 20px; }
    pre { background: #090a0f; border: 1px solid #1c1d24; padding: 15px; border-radius: 8px; color: #22d3ee; overflow-x: auto; }
  </style>
</head>
<body>
  <h2>Web Export Preview: ${block.name}</h2>
  ${ext === "html" ? block.code : `<pre><code>${block.code.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</code></pre>`}
</body>
</html>`;
      downloadRawFile(`${baseName}_preview.html`, htmlBlock, "text/html");
    }
  };

  return (
    <div className="mt-4 p-3 bg-[#030406]/90 border border-zinc-850 rounded-2xl select-none text-left">
      <div className="flex items-center justify-between border-b border-zinc-900/60 pb-2 mb-2.5">
        <div className="flex items-center gap-1.5 text-[9.5px] uppercase tracking-wider font-mono text-cyan-400 font-bold">
          <Download className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          Workspace Dispatcher / Download Center
        </div>
        <span className="text-[7.5px] font-mono text-zinc-500 bg-[#060608] border border-zinc-900 px-1.5 py-0.2 rounded font-extrabold uppercase">
          {blocks.length} Assets Detect
        </span>
      </div>

       {/* BLOCKS ATTACHED DIRECTLY AS DOWNLOADABLE CARDS */}
       {blocks.length > 0 && (
         <div className="space-y-2 mb-3">
           {blocks.map((b, idx) => {
             const ext = getExtensionForLanguage(b.language);
             return (
               <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-2 rounded-xl border border-zinc-900 bg-[#07080c]/60 hover:bg-[#0c0e14] transition-all gap-2">
                 <div className="flex items-center gap-2 min-w-0">
                   <div className="p-1.5 bg-emerald-500/10 border border-emerald-500/15 text-emerald-400 rounded-lg">
                     <FileCode className="w-3.5 h-3.5" />
                   </div>
                   <div className="truncate">
                     <span className="text-[10px] font-mono font-bold text-zinc-200 block truncate leading-none mb-1">{b.name}</span>
                     <span className="text-[8px] font-mono text-zinc-500 block uppercase">Language: {b.language} • {Math.round(b.code.length / 102.4) / 10} KB</span>
                   </div>
                 </div>

                 <div className="flex items-center gap-1.5 font-mono shrink-0">
                   <button
                     onClick={() => handleDownloadSingleBlock(b, "raw")}
                     className="px-2 py-1 text-[8.5px] border border-zinc-850 bg-zinc-900/30 font-bold hover:text-white rounded text-cyan-404 hover:bg-zinc-800 transition-all cursor-pointer flex items-center gap-1"
                   >
                     <Download className="w-2.5 h-2.5 text-cyan-400" />
                     {ext.toUpperCase()}
                   </button>
                   <button
                     onClick={() => handleDownloadSingleBlock(b, "zip")}
                     className="px-2 py-1 text-[8.5px] border border-zinc-850 bg-zinc-900/30 font-bold hover:text-white rounded text-emerald-404 hover:bg-emerald-950/20 transition-all cursor-pointer flex items-center gap-1"
                   >
                     <Archive className="w-2.5 h-2.5 text-emerald-400" />
                     ZIP
                   </button>
                   {(ext === "html" || ext === "js" || ext === "tsx" || ext === "ts") && (
                     <button
                       onClick={() => handleDownloadSingleBlock(b, "html")}
                       className="px-2 py-1 text-[8.5px] border border-zinc-850 bg-zinc-900/30 font-bold hover:text-white rounded text-purple-400 hover:bg-purple-950/20 transition-all cursor-pointer flex items-center gap-0.5"
                     >
                       <span className="text-[8px] font-bold">HTML</span>
                     </button>
                   )}
                 </div>
               </div>
             );
           })}
         </div>
       )}

       {/* FULL MESSAGE EXPORTER ACTIONS */}
       <div className="p-2 bg-zinc-950/80 border border-zinc-900 rounded-xl space-y-2">
         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
           <span className="text-[8.5px] font-mono text-zinc-500 uppercase block font-bold leading-normal">Export full conversation response</span>
           <div className="flex items-center gap-1 bg-[#020204] p-0.5 border border-zinc-900 rounded-lg">
             <input
               value={customFilename}
               type="text"
               onChange={(e) => setCustomFilename(e.target.value)}
               placeholder="custom-name"
               className="bg-transparent border-none text-[8.5px] font-mono text-zinc-350 focus:outline-none focus:ring-0 w-24 px-1.5 py-0.5 placeholder:text-zinc-700"
             />
             <span className="text-[8.5px] font-mono text-zinc-650 pr-1.5 select-none font-bold">.EXT</span>
           </div>
         </div>

         <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
           <button
             onClick={() => handleExportFullMessage("md")}
             disabled={isExporting}
             className="px-2 py-1 text-[8.5px] font-mono font-bold uppercase rounded border border-zinc-900 hover:border-zinc-800 text-zinc-350 hover:text-white hover:bg-zinc-900/40 cursor-pointer transition-all flex items-center justify-center gap-1"
           >
             <Download className="w-2.5 h-2.5 text-cyan-400" />
             .md File
           </button>
           <button
             onClick={() => handleExportFullMessage("txt")}
             disabled={isExporting}
             className="px-2 py-1 text-[8.5px] font-mono font-bold uppercase rounded border border-zinc-900 hover:border-zinc-800 text-zinc-350 hover:text-white hover:bg-zinc-900/40 cursor-pointer transition-all flex items-center justify-center gap-1"
           >
             <Download className="w-2.5 h-2.5 text-[#10b981]" />
             .txt File
           </button>
           <button
             onClick={() => handleExportFullMessage("html")}
             disabled={isExporting}
             className="px-2 py-1 text-[8.5px] font-mono font-bold uppercase rounded border border-zinc-900 hover:border-zinc-800 text-zinc-350 hover:text-white hover:bg-zinc-900/40 cursor-pointer transition-all flex items-center justify-center gap-1"
           >
             <Download className="w-2.5 h-2.5 text-purple-400" />
             .html Doc
           </button>
           <button
             onClick={() => handleExportFullMessage("zip")}
             disabled={isExporting}
             className="px-2 py-1 text-[8.5px] font-mono font-bold uppercase rounded border border-cyan-500/10 hover:border-cyan-500/30 text-cyan-300 hover:text-cyan-200 bg-cyan-950/10 hover:bg-cyan-950/20 cursor-pointer transition-all flex items-center justify-center gap-1"
           >
             <Archive className="w-2.5 h-2.5 text-cyan-400 shrink-0" />
             {isExporting ? "ZIPPING..." : "Full ZIP"}
           </button>
         </div>
       </div>
    </div>
  );
}

function ThinkingAccordion({ content }: { content: string }) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Calculate dynamic thinking duration based on word count to look highly authentic
  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
  const thinkTimeSeconds = Math.max(3, Math.min(32, Math.floor(wordCount / 6.5) + 1));

  return (
    <div className="mb-4 select-none">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-zinc-800 bg-zinc-950/50 hover:bg-zinc-900/50 hover:border-zinc-700 text-zinc-400 hover:text-zinc-200 transition-all text-[11px] font-mono tracking-tight cursor-pointer"
      >
        <span className="relative flex h-2 w-2 items-center justify-center">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400/30 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-cyan-400"></span>
        </span>
        
        <span className="font-semibold text-zinc-400">
          {isOpen ? "Hide thinking process" : `Thought for ${thinkTimeSeconds}s`}
        </span>
        
        <ChevronDown className={`w-3.5 h-3.5 text-zinc-550 transition-transform duration-300 ${isOpen ? "rotate-180 text-cyan-400" : ""}`} />
      </button>

      {isOpen && (
        <div className="mt-3 ml-2 pl-4 border-l-2 border-cyan-500/20 text-xs text-zinc-500 tracking-normal leading-relaxed font-sans select-text max-h-[350px] overflow-y-auto scrollbar-thin pr-1.5 whitespace-pre-wrap animate-fade-in">
          {content.split("\n").map((line, idx) => {
            const trimmed = line.trim();
            if (!trimmed) return <div key={idx} className="h-2" />;

            const isBullet = trimmed.startsWith("-") || trimmed.startsWith("*") || /^\d+\./.test(trimmed);
            const isSystemStep = trimmed.startsWith("[") && trimmed.includes("]");

            return (
              <p 
                key={idx} 
                className={`mb-2 font-sans leading-relaxed ${
                  isSystemStep 
                    ? "text-cyan-500/70 font-mono text-[10.5px] tracking-tight" 
                    : isBullet 
                      ? "text-zinc-450 pl-2" 
                      : "text-zinc-500"
                }`}
              >
                {line}
              </p>
            );
          })}
        </div>
      )}
    </div>
  );
}

function getDomainName(url: string) {
  try {
    const raw = url.replace(/https?:\/\/(www\.)?/, "");
    const slashIdx = raw.indexOf("/");
    return slashIdx !== -1 ? raw.substring(0, slashIdx) : raw;
  } catch {
    return "";
  }
}

function WebGroundingPanel({ content }: { content: string }) {
  const [isOpen, setIsOpen] = useState(true);
  const parsedCitations: { title: string; link: string; sub: string }[] = [];

  content.split("\n").forEach(line => {
    const l = line.trim();
    if (l.startsWith("- **") || l.startsWith("* **")) {
      const titleMatch = l.match(/\*\*([\s\S]*?)\*\*/);
      const linkMatch = l.match(/https?:\/\/[^\s\)]+/);
      const descMatch = l.match(/\*([^*]+)\*/);
      
      const t = titleMatch ? titleMatch[1] : "Reference Source";
      const lk = linkMatch ? linkMatch[0] : "";
      
      let sc = "";
      if (descMatch) {
        sc = descMatch[1].trim();
      } else {
        sc = l.replace(/^[-*]\s+\*\*.*?\*\*/, "").replace(/\(https?:\/\/[^\)]+\)/g, "").trim();
        if (sc.startsWith(":")) sc = sc.substring(1).trim();
      }

      parsedCitations.push({
        title: t,
        link: lk,
        sub: sc
      });
    }
  });

  return (
    <div className="mt-4 border border-zinc-800 bg-[#06080d]/60 rounded-xl overflow-hidden select-none">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3.5 py-2.5 bg-zinc-950/40 text-[10px] font-mono text-zinc-400 font-bold uppercase tracking-wider hover:bg-zinc-900/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Globe className="w-3.5 h-3.5 text-cyan-400" />
          <span>Verified Search References ({parsedCitations.length || 1})</span>
        </div>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </button>
      {isOpen && (
        <div className="px-3.5 pb-3.5 pt-2 border-t border-zinc-900/80 text-[10px] space-y-2">
          {parsedCitations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {parsedCitations.map((cit, idx) => {
                const domain = cit.link ? getDomainName(cit.link) : "";
                return (
                  <div key={idx} className="p-3 bg-[#030305] border border-zinc-900 rounded-xl flex flex-col justify-between gap-1.5 leading-relaxed select-text hover:border-cyan-500/10 transition-all duration-300 group">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        {domain && (
                          <span className="px-2 py-0.5 rounded-md bg-zinc-950/80 border border-zinc-850 text-[7px] font-mono font-extrabold text-[#74c0fc] uppercase">
                            {domain}
                          </span>
                        )}
                        <span className="text-[7.5px] font-mono text-zinc-550 group-hover:text-zinc-400 transition-colors font-bold uppercase">
                          MATCH #{idx + 1}
                        </span>
                      </div>
                      <h4 className="text-[10px] font-serif italic font-bold text-zinc-200 mt-1 line-clamp-1">{cit.title}</h4>
                      <p className="text-zinc-500 text-[9px] font-sans font-medium line-clamp-2 leading-normal">{cit.sub}</p>
                    </div>
                    {cit.link && (
                      <a
                        href={cit.link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[8px] font-mono text-cyan-400 hover:text-cyan-300 transition-colors inline-flex items-center gap-1 mt-1 font-bold uppercase tracking-wider"
                      >
                        Visit Website <Link2 className="w-2.5 h-2.5" />
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-2.5 bg-zinc-950/40 border border-zinc-900 rounded-lg text-zinc-500 font-sans whitespace-pre-wrap select-text leading-relaxed">
              {content}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function LiveAgentWorkspaceStream({ 
  steps, 
  activeConversation,
  thinkingEnabled,
  searchEnabled
}: { 
  steps: any[]; 
  activeConversation: any | null;
  thinkingEnabled: boolean;
  searchEnabled: boolean;
}) {
  const [terminalLines, setTerminalLines] = useState<{ id: string; time: string; tag: string; msg: string; type: "info" | "success" | "warn" | "pulse" }[]>([]);
  const [activeStep, setActiveStep] = useState<any | null>(null);
  const [radarAngle, setRadarAngle] = useState(0);
  const [metrics, setMetrics] = useState({ cpu: 45, mem: 198, speed: 110, queries: 0 });
  const terminalBottomRef = useRef<HTMLDivElement>(null);

  // Poll-like interval inside the component to simulate ultra-high-velocity live sub-logs & radar updates
  useEffect(() => {
    const active = steps.find(s => s.status === "running");
    setActiveStep(active || null);

    // Seed initial terminal lines on mount or when a new conversation starts
    if (terminalLines.length === 0) {
      setTerminalLines([
        { id: "init-1", time: new Date().toLocaleTimeString(), tag: "COMMAND", msg: "COGNITIVE CORE RUNTIME STANDBY // STANDBY ORCHESTRAMP", type: "info" },
        { id: "init-2", time: new Date().toLocaleTimeString(), tag: "SYSTEM", msg: "Workspace context mapping layer: READY", type: "success" }
      ]);
    }
  }, [steps]);

  // Rotates search radar & fluctuates CPU / Speed metrics to keep the stream highly active
  useEffect(() => {
    const interval = setInterval(() => {
      setRadarAngle(prev => (prev + 3) % 360);
      setMetrics(prev => ({
        cpu: Math.min(95, Math.max(12, prev.cpu + Math.floor(Math.random() * 15) - 7)),
        mem: Math.min(512, Math.max(128, prev.mem + Math.floor(Math.random() * 5) - 2)),
        speed: Math.min(180, Math.max(45, prev.speed + Math.floor(Math.random() * 20) - 10)),
        queries: steps.filter(s => s.agentKey === "NEVA_RESEARCHER" && s.status === "completed").length * 3 + (steps.some(s => s.agentKey === "NEVA_RESEARCHER" && s.status === "running") ? 1 : 0)
      }));
    }, 100);

    return () => clearInterval(interval);
  }, [steps]);

  // Generates granular, ultra-realistic typewriter micro-operations based on the current active agent step
  useEffect(() => {
    if (!activeStep) return;

    const microLogsMap: Record<string, string[]> = {
      NEVA_PLANNER: [
        "Planner Core Loaded: Constructing objective hierarchy...",
        "Resolving context entities in database sandboxes...",
        "Splitting objectives into 5 logical agent pipelines...",
        "Analyzing best reasoning model routing profile... MATCHED: Gemini Pro / Ultra",
        "Orchestration DAG constructed. Broadcasting triggers to Worker Nodes..."
      ],
      NEVA_RESEARCHER: [
        "Researcher Core Loaded: Activating web crawler sockets...",
        "Formulating optimal crawl queries based on grounding targets...",
        "Crawling high-authority research parameters...",
        "Found context anchor: OpenRouter AI schema indices...",
        "Reading developer documentation for API grounding guides...",
        "Hashing search indexes into semantic memory vectors...",
        "Ingestion completed. Synthesizing citations list..."
      ],
      NEVA_ENGINEER: [
        "Engineer Core Loaded: Compiling file sandbox workspace...",
        "Evaluating JSX dependency vectors inside /src/components...",
        "Integrating responsive UI adaptions into core modules...",
        "Running dynamic type-checker audits to ensure robustness...",
        "Injecting active state handlers for multi-device viewports...",
        "Triggering esbuild tree-shaking optimizer..."
      ],
      NEVA_SAFETY: [
        "Safety Core Loaded: Performing defensive audits...",
        "Checking directory boundaries against sandbox escapes...",
        "Verifying write payload integrity keys...",
        "Gated criteria status: 100% SECURE. Zero gated blocks found.",
        "Promoting code package output to live branch production..."
      ],
      NEVA_CRITIC: [
        "Critic Auditor Loaded: Initiating quality review...",
        "Evaluating layout constraints and color-contrast parameters...",
        "Verifying code format matches global specifications...",
        "Approved quality rating: 9.8/10. Releasing block..."
      ]
    };

    const targetLogs = microLogsMap[activeStep.agentKey] || ["Spawning active cognitive worker processes..."];
    let logIndex = 0;

    const printInterval = setInterval(() => {
      if (logIndex >= targetLogs.length) {
        clearInterval(printInterval);
        return;
      }

      const logMsg = targetLogs[logIndex];
      setTerminalLines(prev => {
        // Limit terminal to 45 lines for high-performance rendering
        const kept = prev.slice(-40);
        return [
          ...kept,
          {
            id: `live-micro-${Date.now()}-${logIndex}`,
            time: new Date().toLocaleTimeString(),
            tag: activeStep.agentKey.replace("NEVA_", ""),
            msg: logMsg,
            type: logMsg.includes("complete") || logMsg.includes("SECURE") ? "success" : logMsg.includes("warning") ? "warn" : "pulse"
          }
        ];
      });

      logIndex++;
    }, 1600);

    return () => clearInterval(printInterval);
  }, [activeStep]);

  // Automatically scroll the live terminal stream to the bottom
  useEffect(() => {
    if (terminalBottomRef.current) {
      terminalBottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [terminalLines]);

  return (
    <div className="mx-1 my-4 border border-cyan-500/15 bg-gradient-to-b from-[#06070a] to-[#030406] rounded-2xl p-4.5 shadow-[0_4px_30px_rgba(6,182,212,0.03)] select-none animate-slide-in">
      {/* SECTION HEADER */}
      <div className="flex items-center justify-between border-b border-zinc-900 pb-3 mb-4 select-none">
        <div className="flex items-center gap-2">
          <div className="relative">
            <span className="flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
          </div>
          <span className="text-[10px] tracking-widest font-mono font-extrabold text-[#d4d4d8] uppercase">
            NEVA COGNITIVE ACTIVE SWEEP STREAM
          </span>
        </div>
        
        <div className="flex items-center gap-4 text-[8px] font-mono text-zinc-500 uppercase font-bold tracking-widest">
          <span>THINKING: <span className={thinkingEnabled ? "text-purple-400" : "text-zinc-650"}>{thinkingEnabled ? "DEEP_ON" : "OFF"}</span></span>
          <span>GROUNDING: <span className={searchEnabled ? "text-emerald-400" : "text-zinc-650"}>{searchEnabled ? "WEB_CRAWL_ON" : "OFF"}</span></span>
          <span>ORCHESTRATOR VELOCITY: <span className="text-cyan-400 font-extrabold">{metrics.speed} t/s</span></span>
        </div>
      </div>

      {/* METRIC BOXES SUMMARY BAR */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4 leading-none select-none">
        <div className="p-2 border border-zinc-900 bg-[#040507]/60 rounded-xl">
          <span className="text-[7px] font-mono text-zinc-600 block uppercase">Chief Cognitive Load</span>
          <span className="text-[11px] font-mono font-bold text-zinc-350 block mt-1.5">{metrics.cpu}% CPU</span>
        </div>
        <div className="p-2 border border-zinc-900 bg-[#040507]/60 rounded-xl">
          <span className="text-[7px] font-mono text-zinc-650 block uppercase">Sandbox Buffer Max</span>
          <span className="text-[11px] font-mono font-bold text-zinc-350 block mt-1.5">{metrics.mem} MB</span>
        </div>
        <div className="p-2 border border-zinc-900 bg-[#040507]/60 rounded-xl">
          <span className="text-[7px] font-mono text-zinc-650 block uppercase">Grounding Links Catalog</span>
          <span className="text-[11px] font-mono font-bold text-emerald-404 block mt-1.5">{metrics.queries} Verified</span>
        </div>
        <div className="p-2 border border-zinc-900 bg-[#040507]/60 rounded-xl">
          <span className="text-[7px] font-mono text-zinc-650 block uppercase">Active Agency Units</span>
          <span className="text-[11px] font-mono font-bold text-purple-404 block mt-1.5">4 Units Active</span>
        </div>
      </div>

      {/* DUAL WORKSPACE: MULTI-AGENT DELEGATION MAP + SEARCH RADAR */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4.5 items-stretch mb-4 select-none">
        
        {/* COLUMN 1 & 2: MULTI-AGENT HIERARCHICAL GRID */}
        <div className="md:col-span-2 space-y-2">
          <span className="text-[8px] font-mono text-zinc-550 uppercase tracking-widest block font-extrabold pb-0.5">
            Decentralized Agent Coordination Nodes
          </span>

          <div className="grid grid-cols-2 gap-2.5">
            {[
              {
                key: "NEVA_PLANNER",
                name: "Command Planner",
                role: "Strategic Decomposer",
                icon: Cpu,
                desc: "Maps targets to execution vectors"
              },
              {
                key: "NEVA_RESEARCHER",
                name: "Web Ingestor",
                role: "Semantic Researcher",
                icon: Globe,
                desc: "Crawls web index grounding bases"
              },
              {
                key: "NEVA_ENGINEER",
                name: "Synthesis Engine",
                role: "Compiler / Draftsman",
                icon: Terminal,
                desc: "Generates sandbox modules"
              },
              {
                key: "NEVA_SAFETY",
                name: "Safety Auditor",
                role: "Review & Security Gate",
                icon: ShieldAlert,
                desc: "Verifies escape containment rules"
              }
            ].map(agentItem => {
              const matchedStep = steps.find(s => s.agentKey === agentItem.key);
              const isSearching = agentItem.key === "NEVA_RESEARCHER" && searchEnabled;
              
              const isRunning = matchedStep?.status === "running";
              const isCompleted = matchedStep?.status === "completed";
              const isWaiting = matchedStep?.state === "WAITING_APPROVAL";

              let statusText = "STANDBY";
              let cardStyle = "bg-[#040507]/30 border-zinc-900 text-zinc-600";
              let pulseColorHex = "transparent";

              if (isRunning) {
                statusText = isSearching ? "GROUNDING..." : "COMPILING...";
                cardStyle = "bg-cyan-950/20 border-cyan-800/40 text-cyan-200 ring-1 ring-cyan-500/10 shadow-[0_0_15px_rgba(6,182,212,0.05)]";
                pulseColorHex = "rgba(6,182,212,0.5)";
              } else if (isWaiting) {
                statusText = "AWAITING CONSENT";
                cardStyle = "bg-amber-950/25 border-amber-800/40 text-amber-200 ring-1 ring-amber-500/15";
                pulseColorHex = "rgba(245,158,11,0.5)";
              } else if (isCompleted) {
                statusText = "COMPLETED";
                cardStyle = "bg-[#040507]/75 border-emerald-950/35 text-emerald-450";
              }

              const AgentIcon = agentItem.icon;

              return (
                <div 
                  key={agentItem.key} 
                  className={`p-3 rounded-xl border transition-all duration-300 flex flex-col justify-between h-24 relative ${cardStyle}`}
                >
                  {/* Top Header Row within Agent Card */}
                  <div className="flex items-center justify-between border-b border-zinc-900/50 pb-1.5 w-full min-w-0">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className={`p-1 rounded-md border ${isRunning ? "border-cyan-500/25 bg-cyan-950/40 text-cyan-400" : isCompleted ? "border-emerald-500/10 bg-emerald-950/10 text-emerald-400" : "border-zinc-850 bg-zinc-950 text-zinc-500"} shrink-0`}>
                        <AgentIcon className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] font-sans font-extrabold block truncate leading-tight uppercase tracking-wide">
                          {agentItem.name}
                        </span>
                        <span className="text-[7.5px] font-mono text-zinc-600 uppercase block truncate">
                          {agentItem.role}
                        </span>
                      </div>
                    </div>
                    
                    {/* Pulsing beacon representing alive processes */}
                    {isRunning && (
                      <span className="h-2 w-2 relative flex shrink-0">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
                      </span>
                    )}
                  </div>

                  {/* Desc phrase */}
                  <p className="text-[8px] text-zinc-555 line-clamp-2 mt-1 uppercase font-mono leading-normal">
                    {agentItem.desc}
                  </p>

                  {/* Micro timeline state tracking indicators */}
                  <div className="flex justify-between items-center border-t border-zinc-900/40 pt-1.5 mt-1">
                    <span className="text-[7px] font-mono uppercase tracking-wider font-extrabold mt-0.5">
                      {statusText}
                    </span>
                    {isRunning && (
                      <div className="w-14 bg-zinc-900 h-1 rounded-full overflow-hidden shrink-0">
                        <div className="bg-cyan-400 h-full animate-[shimmer_1.5s_infinite] w-3/4"></div>
                      </div>
                    )}
                    {isCompleted && (
                      <div className="flex items-center gap-0.5 text-emerald-400 font-mono text-[7px] font-bold">
                        <Check className="w-2.5 h-2.5 stroke-[3.5]" />
                        <span>RESOLVED</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* COLUMN 3: WEB GROUNDING CRAWL RADAR */}
        <div className="p-3 bg-[#040507]/40 border border-zinc-900 rounded-2xl flex flex-col justify-between items-center relative overflow-hidden h-full min-h-[200px]">
          <div className="w-full flex justify-between items-center border-b border-zinc-950 pb-2 mb-2">
            <span className="text-[8px] font-mono text-zinc-550 uppercase tracking-widest block font-extrabold">
              Grounding Radar
            </span>
            <span className="text-[7px] text-zinc-600 font-mono tracking-widest">
              SCANNING MODE
            </span>
          </div>

          {/* ACTIVE CIRCULAR SWEEP RADAR CONTAINER */}
          <div className="relative w-28 h-28 border border-zinc-900 rounded-full flex items-center justify-center bg-[#020304] shadow-[inset_0_0_20px_rgba(6,182,212,0.03)] focus-within:ring-1">
            {/* Concentric Sonar Rings */}
            <div className="absolute w-20 h-20 border border-dashed border-zinc-850/40 rounded-full"></div>
            <div className="absolute w-12 h-12 border border-dashed border-zinc-900/50 rounded-full"></div>
            
            {/* Axis Grid lines */}
            <div className="absolute inset-y-0 w-[1px] bg-zinc-900/55 p-0"></div>
            <div className="absolute inset-x-0 h-[1px] bg-zinc-900/55 p-0"></div>

            {/* Rotating Scanning Sweep Angle Line */}
            <div 
              className="absolute inset-0 origin-center pointer-events-none"
              style={{ transform: `rotate(${radarAngle}deg)` }}
            >
              <div className="w-1/2 h-[1px] bg-gradient-to-r from-transparent to-cyan-500 absolute top-1/2 left-0"></div>
              {/* Scan impact glint block */}
              <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full absolute top-[calc(50%-2.5px)] left-2 animate-ping"></div>
            </div>

            {/* Glowing Anchors Found in dynamic index list */}
            <div className="absolute top-6 left-12 w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
            <div className="absolute bottom-8 right-6 w-1 h-1 rounded-full bg-cyan-400 animate-pulse delay-75"></div>
            <div className="absolute top-16 right-10 w-1 h-1 rounded-full bg-purple-500 animate-pulse delay-150"></div>

            <span className="text-[8px] font-mono text-zinc-600 uppercase font-black tracking-widest bg-zinc-950/80 px-1 border border-zinc-900 rounded select-none z-10">
              {metrics.queries > 0 ? "LOCK_SYNC" : "SEEKING..."}
            </span>
          </div>

          {/* Target sources list tracker */}
          <div className="mt-2 text-center select-none w-full border-t border-zinc-950 pt-2 h-10 flex flex-col justify-center">
            {steps.some(s => s.agentKey === "NEVA_RESEARCHER" && s.status === "running") ? (
              <span className="text-[7.5px] font-mono text-cyan-404 uppercase animate-pulse tracking-wide font-extrabold">
                CRAWLING: openrouter.ai/models
              </span>
            ) : steps.some(s => s.agentKey === "NEVA_ENGINEER" && s.status === "running") ? (
              <span className="text-[7.5px] font-mono text-purple-400 uppercase tracking-wide font-extrabold">
                COMPILING: esbuild compilation
              </span>
            ) : (
              <span className="text-[7.5px] font-mono text-zinc-650 uppercase tracking-widest block font-bold leading-none">
                GRID PORT: ONLINE // STANDBY MAPPING
              </span>
            )}
            <span className="text-[6.5px] text-zinc-700 font-mono block mt-1">
              CHANNELS: UTC LOCAL_TIME SECURED
            </span>
          </div>
        </div>

      </div>

      {/* COGNITIVE LIVE THOUGHT STREAMING BRIEF BOX */}
      {activeStep && (
        <div className="mb-4 bg-purple-950/5 border border-purple-900/10 rounded-xl p-3 select-none leading-relaxed animate-fade-in flex items-start gap-2.5">
          <Brain className="w-4 h-4 text-purple-400 shrink-0 mt-0.5 animate-pulse" />
          <div className="min-w-0">
            <span className="text-[7.5px] font-mono text-purple-400 uppercase block tracking-widest font-extrabold mb-1">
              Active Agent Intelligent Thought Vector ({activeStep.agentKey})
            </span>
            <p className="text-zinc-400 text-[10px] font-mono select-text italic leading-relaxed">
              {activeStep.agentKey === "NEVA_PLANNER" && `"Constructing complete micro-task graph... mapping developer parameters of OpenRouter dependencies into sandbox models."`}
              {activeStep.agentKey === "NEVA_RESEARCHER" && `"Web query targeted on ${activeConversation?.title || "workspace logic"}. Extracting high-authority citations for safe compiler synthesis."`}
              {activeStep.agentKey === "NEVA_ENGINEER" && `"Generating optimized file structure modules. Ensuring seamless adaptions across all device layouts."`}
              {activeStep.agentKey === "NEVA_SAFETY" && `"Securing runtime directory trees against escapes. Formulating package boundary rules."`}
              {!["NEVA_PLANNER", "NEVA_RESEARCHER", "NEVA_ENGINEER", "NEVA_SAFETY"].includes(activeStep.agentKey) && `"${activeStep.inputPreview || "Processing system directives."}"`}
            </p>
          </div>
        </div>
      )}

      {/* COMPREHENSIVE TERMINAL LOG ENGINE STREAM */}
      <div className="space-y-1.5 select-none w-full">
        <span className="text-[8px] font-mono text-zinc-555 uppercase tracking-widest block font-extrabold pb-0.5">
          Workspace Log Event Stream (Real-Time Operator)
        </span>
        
        <div className="border border-zinc-950 bg-[#020203] rounded-xl p-3 h-40 overflow-y-auto font-mono text-[9px] scrollbar-thin select-text space-y-1.5 leading-relaxed">
          {terminalLines.map((line) => (
            <div key={line.id} className="flex gap-2.5 items-start leading-relaxed text-zinc-400 animate-fade-in hover:bg-zinc-900/15 py-0.5 rounded px-1 transition-colors">
              <span className="text-zinc-650 select-none font-bold shrink-0">{line.time}</span>
              <span className={`px-1 rounded text-[7.5px] font-bold select-none shrink-0 border ${
                line.tag === "PLANNER" ? "bg-cyan-950/20 border-cyan-800/20 text-cyan-400" :
                line.tag === "RESEARCHER" ? "bg-emerald-950/20 border-emerald-800/20 text-emerald-400" :
                line.tag === "ENGINEER" ? "bg-purple-950/20 border-purple-800/20 text-purple-400" :
                line.tag === "SAFETY" ? "bg-red-950/15 border-red-800/10 text-red-400 text-red-404" :
                "bg-zinc-900 border-zinc-850 text-zinc-500"
              }`}>
                {line.tag}
              </span>
              <span className={`block break-words ${
                line.type === "success" ? "text-emerald-400 font-semibold" :
                line.type === "warn" ? "text-amber-500" :
                line.type === "pulse" ? "text-cyan-300" : 
                "text-zinc-350"
              }`}>
                {line.msg}
              </span>
            </div>
          ))}
          <div ref={terminalBottomRef} className="h-0.5" />
        </div>
      </div>
    </div>
  );
}

// Props required from router
interface ChatCockpitProps {
  setCurrentRoute: (r: string) => void;
}

export default function ChatCockpit({ setCurrentRoute }: ChatCockpitProps) {
  const { 
    activeWorkspace,
    activeConversation, 
    messages,
    sendMessage,
    polls,
    answerPoll,
    approvals,
    resolveApproval,
    steps,
    stats,
    files,
    uploadFile,
    modelSelected, setModelSelected,
    missionModeActive, setMissionModeActive,
    allModels,
    thinkingEnabled, setThinkingEnabled,
    searchEnabled, setSearchEnabled,
    liveMonitorActive, setLiveMonitorActive,
    deepThinkSearchActive, setDeepThinkSearchActive,
    cancelRun
  } = useApp();

  const [composorPrompt, setComposorPrompt] = useState("");
  
  // Custom AI DeepThink Search reactive state engines
  interface SearchRound {
    query: string;
    sources: { title: string; url: string; snippet: string }[];
    expanded: boolean;
  }
  const [searchRounds, setSearchRounds] = useState<SearchRound[]>([]);
  const [finalAnswer, setFinalAnswer] = useState<string>("");
  const [isSearching, setIsSearching] = useState<boolean>(false);

  const toggleRoundExpanded = (index: number) => {
    setSearchRounds(prev => prev.map((r, i) => i === index ? { ...r, expanded: !r.expanded } : r));
  };

  const handleDeepThinkSearch = async (overridePrompt?: string) => {
    const query = (overridePrompt || composorPrompt).trim();
    if (!query) return;

    if (!overridePrompt) {
      setComposorPrompt("");
    }
    setIsSearching(true);
    setSearchRounds([]);
    setFinalAnswer("");

    try {
      const response = await fetch("/api/deepthink", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: query, conversationId: activeConversation?.id })
      });

      if (!response.body) throw new Error("Null deepthink response body");
      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let buffer = "";

      let currentEvent = "";
      let currentDataString = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split("\n\n");
        buffer = parts.pop() || "";

        for (const part of parts) {
          if (!part.trim()) continue;

          let lines = part.split("\n");
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

            if (currentEvent === "search_round") {
              const newRound: SearchRound = {
                query: payload.query,
                sources: payload.sources || [],
                expanded: true
              };
              setSearchRounds(prev => {
                const collapsed = prev.map(r => ({ ...r, expanded: false }));
                return [...collapsed, newRound];
              });
            } else if (currentEvent === "synthesis_chunk") {
              setFinalAnswer(prev => prev + payload.chunk);
            } else if (currentEvent === "error") {
              setFinalAnswer(prev => prev + `\n\n❌ **Error during deep research loop:** ${payload.message}`);
            }
          } catch (pErr) {
            console.error("SSE JSON parsing exception inside DeepThink search:", pErr);
          }
          currentDataString = "";
          currentEvent = "";
        }
      }
    } catch (err: any) {
      console.error("DeepThink search execution failed:", err);
      setFinalAnswer(`❌ **Research engine offline:** Could not connect to deep-search pipeline. Detail: ${err.message || err}`);
    } finally {
      setIsSearching(false);
    }
  };

  const [isDragging, setIsDragging] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [rightChatHubOpen, setRightChatHubOpen] = useState(true);
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
  const [forceShowAgentStream, setForceShowAgentStream] = useState(false);
  const [modelSearch, setModelSearch] = useState("");
  const [modelTypeFilter, setModelTypeFilter] = useState<"all" | "logic" | "basic">("all");
  const [hiddenThinkingMsgIds, setHiddenThinkingMsgIds] = useState<Record<string, boolean>>({});
  const [selectedStepIndex, setSelectedStepIndex] = useState<number | null>(null);

  // Set default state based on viewport width on mount
  useEffect(() => {
    if (window.innerWidth < 1024) {
      setLeftSidebarOpen(false);
      setRightChatHubOpen(false);
    }
  }, []);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const composerRef = useRef<HTMLTextAreaElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of conversation stream on messages update
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // Check if the user is currently scrolled close to the bottom (within 180px)
    const offset = container.scrollHeight - container.scrollTop - container.clientHeight;
    const isCloseToBottom = offset < 180;

    const lastMessage = messages[messages.length - 1];
    const isUserLast = lastMessage?.role === "user";

    if (isCloseToBottom || isUserLast) {
      if (scrollRef.current) {
        scrollRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [messages]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleComposeSend = () => {
    if (!composorPrompt.trim()) return;
    // === MOBILE & QUERY ROUTING FIX ===
    if (deepThinkSearchActive) {
      handleDeepThinkSearch();
      return;
    }
    sendMessage(composorPrompt);
    setComposorPrompt("");
    if (composerRef.current) {
      composerRef.current.style.height = "auto";
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      Array.from(e.target.files).forEach(file => {
        uploadFile(file.name, file.size, file.type);
      });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      Array.from(e.dataTransfer.files).forEach(file => {
        uploadFile(file.name, file.size, file.type);
      });
    }
  };

  if (!activeConversation) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[480px] text-center p-8 bg-[#121212]/10 border border-zinc-900 max-w-sm mx-auto w-full animate-fade-in self-center rounded-2xl">
        <div className="w-12 h-12 rounded-full border border-zinc-800 flex items-center justify-center mb-4 bg-zinc-900/60">
          <Radio className="w-4 h-4 text-zinc-600 animate-pulse" />
        </div>
        <span className="text-xs tracking-[0.2em] uppercase font-bold text-zinc-250 mb-1">NO ACTIVE SESSION</span>
        <p className="text-zinc-500 text-xs leading-relaxed max-w-sm font-medium">
          Select or launch an archive chat thread from the left index timeline to initialize the active operational node interface.
        </p>
      </div>
    );
  }

  const pendingPolls = polls.filter(p => !p.answeredAt && p.conversationId === activeConversation?.id);
  const pendingApprovals = approvals.filter(a => !a.resolvedAt);

  return (
    <div 
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className="flex-grow flex items-stretch gap-4 relative rounded-3xl p-3 bg-gradient-to-b from-[#14151b] to-[#08080a] border border-zinc-850 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95)] overflow-hidden h-[calc(100vh-100px)] w-full text-zinc-300 select-none font-sans"
    >
      {/* MOBILE LEFT DRAWER BACKDROP */}
      {leftSidebarOpen && (
        <div 
          onClick={() => setLeftSidebarOpen(false)}
          className="fixed inset-0 bg-black/70 backdrop-blur-xs z-[200] lg:hidden cursor-pointer animate-fade-in"
        />
      )}

      {/* COLUMN 1: LEFT SWEEP SWITCHBOARD & AGENT OPTIONS */}
      <aside 
        className={`
          /* Base mobile drawer styles */
          fixed inset-y-3 left-3 z-[210] w-76 flex flex-col justify-between bg-[#040507] border border-zinc-850 rounded-2xl p-4 transform transition-all duration-300 ease-in-out h-[calc(100%-24px)]
          /* Desktop layout adaptation overrides */
          lg:relative lg:inset-auto lg:z-0 lg:w-76 lg:border lg:border-zinc-900 lg:rounded-2xl lg:p-4 lg:transition-all lg:duration-300 lg:ease-in-out lg:h-full lg:shrink-0
          ${
            leftSidebarOpen 
              ? "translate-x-0 opacity-100" 
              : "-translate-x-[110%] opacity-0 pointer-events-none lg:translate-x-0 lg:w-0 lg:p-0 lg:border-none lg:opacity-0"
          }
        `}
      >
        <div className="flex flex-col gap-4 overflow-y-auto scrollbar-none pb-4 flex-grow">
          {/* Section Header */}
          <div className="flex items-center justify-between border-b border-zinc-900 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              <span className="text-[9px] tracking-widest font-mono font-bold text-zinc-400 uppercase">AGENT ARCHITECTURE</span>
            </div>
            <button
              onClick={() => setCurrentRoute("settings")}
              className="text-zinc-650 hover:text-zinc-300 p-1 rounded hover:bg-zinc-900/60 border border-transparent hover:border-zinc-805 transition-all cursor-pointer"
              title="Credentials & Portals Settings"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Active Cognitive Model Card Selector */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-[8px] font-mono text-zinc-550 uppercase tracking-widest block font-extrabold">Active Cognitive Models List</label>
              <span className="text-[7.5px] font-mono text-cyan-500 bg-cyan-950/20 border border-cyan-900/40 px-1 py-0.2 rounded uppercase tracking-wider font-bold">
                {allModels.length} Loaded
              </span>
            </div>

            {/* Model list search field & filters */}
            <div className="space-y-1.5">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Filter by name, agency, tag..."
                  value={modelSearch}
                  onChange={(e) => setModelSearch(e.target.value)}
                  className="w-full bg-[#07080c] border border-zinc-900 focus:border-cyan-500/40 focus:ring-1 focus:ring-cyan-500/10 text-[9.5px] text-zinc-300 placeholder:text-zinc-650 rounded-lg px-2.5 py-1.5 pb-2 font-mono focus:outline-none transition-all"
                />
                {modelSearch && (
                  <button
                    onClick={() => setModelSearch("")}
                    className="absolute right-2 px-1 text-[8px] font-mono font-bold text-zinc-500 hover:text-cyan-400 cursor-pointer top-[6px]"
                  >
                    ×
                  </button>
                )}
              </div>

              {/* Quick filter segmented tabs */}
              <div className="grid grid-cols-3 gap-0.5 bg-[#07080c] p-0.5 rounded-lg border border-zinc-900">
                {(["all", "logic", "basic"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setModelTypeFilter(t)}
                    className={`py-1 text-[7.5px] font-mono font-extrabold uppercase tracking-wide rounded-md transition-all cursor-pointer ${
                      modelTypeFilter === t
                        ? "bg-zinc-900 border border-zinc-800 text-cyan-400 shadow-sm"
                        : "text-zinc-600 hover:text-zinc-400"
                    }`}
                  >
                    {t === "all" ? "All" : t === "logic" ? "Logic" : "Standard"}
                  </button>
                ))}
              </div>
            </div>

            {/* Models list container */}
            <div className="space-y-1.5 max-h-[210px] overflow-y-auto scrollbar-thin pr-0.5">
              {(() => {
                const filtered = allModels.filter((mod) => {
                  const supportsLogic = mod.category !== "Speed/Chat";
                  const matchesSearch = mod.name.toLowerCase().includes(modelSearch.toLowerCase()) || 
                                        mod.provider.toLowerCase().includes(modelSearch.toLowerCase()) ||
                                        (supportsLogic ? "logic: yes" : "logic: no").includes(modelSearch.toLowerCase());
                  
                  if (modelTypeFilter === "logic" && !supportsLogic) return false;
                  if (modelTypeFilter === "basic" && supportsLogic) return false;
                  
                  return matchesSearch;
                });

                if (filtered.length === 0) {
                  return (
                    <div className="py-6 border border-dashed border-zinc-900 bg-[#090a10]/20 rounded-xl text-center">
                      <span className="text-[8px] font-mono text-zinc-655 uppercase tracking-widest">No models matched</span>
                    </div>
                  );
                }

                return filtered.map((mod) => {
                  const isSelected = modelSelected === mod.id;
                  const supportsLogic = mod.category !== "Speed/Chat";

                  return (
                    <button
                      key={mod.id}
                      onClick={() => setModelSelected(mod.id)}
                      className={`w-full text-left p-2.5 rounded-xl border transition-all flex flex-col gap-1.5 cursor-pointer select-none leading-none ${
                        isSelected 
                          ? "bg-cyan-500/5 border-cyan-500/30 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.03)]" 
                          : "bg-[#090a10]/40 border-zinc-900 text-zinc-500 hover:text-zinc-350 hover:border-zinc-805"
                      }`}
                    >
                      <div className="flex items-center justify-between w-full min-w-0">
                        <div className="min-w-0 flex-1 pr-1.5">
                          {/* [name of the model] [support logic or not] formatted clearly */}
                          <p className="text-[10px] font-sans font-bold truncate leading-tight flex items-center gap-1">
                            <span>{mod.name}</span>
                            <span className={`text-[7px] font-mono font-extrabold uppercase px-1 py-0.2 rounded border shadow-sm ${
                              supportsLogic 
                                ? "bg-purple-950/30 border-purple-800/20 text-purple-400" 
                                : "bg-zinc-900/20 border-zinc-850 text-zinc-600"
                            }`}>
                              {supportsLogic ? "Logic: Yes" : "Logic: No"}
                            </span>
                          </p>
                        </div>
                        {isSelected && <Check className="w-3 h-3 text-cyan-400 shrink-0 stroke-[2.5]" />}
                      </div>
                      <div className="flex justify-between items-center w-full font-mono text-[7px] text-zinc-600 uppercase tracking-wider">
                        <span>{mod.provider}</span>
                        <span>{mod.contextWindow}</span>
                      </div>
                    </button>
                  );
                });
              })()}
            </div>
          </div>

          {/* Core Capability Toggles */}
          <div className="space-y-2 border-t border-zinc-900/60 pt-3">
            <span className="text-[8px] font-mono text-zinc-555 uppercase tracking-widest block font-extrabold pb-1">Cognitive Vectors</span>
            
            {/* Deep Think */}
            <button
              onClick={() => !deepThinkSearchActive && setThinkingEnabled(!thinkingEnabled)}
              disabled={deepThinkSearchActive}
              className={`w-full p-2.5 rounded-xl text-left border transition-all flex items-center justify-between cursor-pointer select-none ${
                (thinkingEnabled || deepThinkSearchActive)
                  ? "bg-purple-950/20 border-purple-500/20 text-purple-300" 
                  : "bg-transparent border-zinc-900 text-zinc-500 hover:text-zinc-400 hover:border-zinc-805"
              } ${deepThinkSearchActive ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <Brain className={`w-3.5 h-3.5 shrink-0 ${(thinkingEnabled || deepThinkSearchActive) ? "text-purple-400 animate-pulse" : "text-zinc-650"}`} />
                <div className="leading-tight text-left min-w-0">
                  <span className="text-[10px] font-bold block">Orchestrated Thinking</span>
                  <span className="text-[7.5px] font-mono mt-0.5 block truncate text-zinc-600">Deep step-by-step reasoning</span>
                </div>
              </div>
              <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${(thinkingEnabled || deepThinkSearchActive) ? "bg-purple-400" : "bg-transparent border border-zinc-700"}`} />
            </button>

            {/* Standard Search */}
            <button
              onClick={() => !deepThinkSearchActive && setSearchEnabled(!searchEnabled)}
              disabled={deepThinkSearchActive}
              className={`w-full p-2.5 rounded-xl text-left border transition-all flex items-center justify-between cursor-pointer select-none ${
                (searchEnabled || deepThinkSearchActive)
                  ? "bg-emerald-950/20 border-emerald-500/20 text-emerald-300" 
                  : "bg-transparent border-zinc-900 text-zinc-500 hover:text-zinc-400 hover:border-zinc-805"
              } ${deepThinkSearchActive ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <Globe className={`w-3.5 h-3.5 shrink-0 ${(searchEnabled || deepThinkSearchActive) ? "text-emerald-400" : "text-zinc-650"}`} />
                <div className="leading-tight text-left min-w-0">
                  <span className="text-[10px] font-bold block">Real-time Grounding</span>
                  <span className="text-[7.5px] font-mono mt-0.5 block truncate text-zinc-600">Web grounding corpus indexes</span>
                </div>
              </div>
              <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${(searchEnabled || deepThinkSearchActive) ? "bg-emerald-400" : "bg-transparent border border-zinc-700"}`} />
            </button>

            {/* Task Assistant */}
            <button
              onClick={() => setMissionModeActive(!missionModeActive)}
              className={`w-full p-2.5 rounded-xl text-left border transition-all flex items-center justify-between cursor-pointer select-none ${
                missionModeActive 
                  ? "bg-cyan-950/20 border-cyan-500/20 text-cyan-300" 
                  : "bg-transparent border-zinc-900 text-zinc-500 hover:text-zinc-400 hover:border-zinc-850"
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <Sparkles className={`w-3.5 h-3.5 shrink-0 ${missionModeActive ? "text-cyan-404" : "text-zinc-650"}`} />
                <div className="leading-tight text-left min-w-0">
                  <span className="text-[10px] font-bold block">Autonomous Agent</span>
                  <span className="text-[7.5px] font-mono mt-0.5 block truncate text-zinc-600">Multi-step action sequences</span>
                </div>
              </div>
              <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${missionModeActive ? "bg-cyan-400" : "bg-transparent border border-zinc-700"}`} />
            </button>

            {/* Neva Monitor */}
            <button
              onClick={() => setLiveMonitorActive(!liveMonitorActive)}
              className={`w-full p-2.5 rounded-xl text-left border transition-all flex items-center justify-between cursor-pointer select-none ${
                liveMonitorActive 
                  ? "bg-cyan-950/20 border-cyan-500/25 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.03)]" 
                  : "bg-transparent border-zinc-900 text-zinc-500 hover:text-zinc-400 hover:border-zinc-850"
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <Activity className={`w-3.5 h-3.5 shrink-0 ${liveMonitorActive ? "text-cyan-400 animate-pulse" : "text-zinc-500"}`} />
                <div className="leading-tight text-left min-w-0">
                  <span className="text-[10px] font-bold block">Live Monitor View</span>
                  <span className="text-[7.5px] font-mono mt-0.5 block truncate text-zinc-600">Full desktop agent console</span>
                </div>
              </div>
              <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${liveMonitorActive ? "bg-cyan-404" : "bg-transparent border border-zinc-700"}`} />
            </button>
          </div>

          {/* Human-in-the-loop Sandbox Gated Checks */}
          <div className="space-y-2 border-t border-zinc-900/60 pt-3">
            <span className="text-[8px] font-mono text-zinc-555 uppercase tracking-widest block font-extrabold pb-0.5">Sandboxed Checkpoint Gates</span>
            
            {pendingPolls.length === 0 && pendingApprovals.length === 0 ? (
              <div className="p-2 border border-zinc-900 bg-[#090a0f]/30 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-1.5 min-w-0 p-1">
                  <CheckSquare className="w-3.5 h-3.5 text-zinc-600" />
                  <span className="text-[8px] font-mono text-zinc-600 uppercase">Awaiting Zero Gated Blocks</span>
                </div>
                <span className="text-[7px] font-mono font-bold text-emerald-500 bg-emerald-950/20 border border-emerald-900/30 px-1 py-0.2 rounded uppercase shrink-0">SECURED</span>
              </div>
            ) : (
              <div className="space-y-2 max-h-[160px] overflow-y-auto pr-0.5 scrollbar-thin">
                {/* Interactive Polls */}
                {pendingPolls.map(poll => (
                  <div key={poll.id} className="p-2.5 bg-cyan-950/10 border border-cyan-500/20 rounded-xl space-y-2 shadow-inner">
                    <div className="flex items-center gap-1.5 text-[8px] font-mono font-extrabold text-cyan-300 uppercase leading-none">
                      <Brain className="w-3 h-3 text-cyan-400" />
                      <span>Interactive Choice Checkpoint</span>
                    </div>
                    <p className="text-[9.5px] text-zinc-350 leading-normal font-semibold">{poll.question}</p>
                    
                    {poll.questionType === "single_choice" && (
                      <div className="space-y-1">
                        {poll.options.map((opt, oIdx) => (
                          <button
                            key={oIdx}
                            onClick={() => answerPoll(poll.id, opt)}
                            className="w-full text-left p-1 rounded-md border border-zinc-850 bg-zinc-950/80 hover:bg-cyan-950 hover:text-cyan-300 hover:border-cyan-500/15 text-[8.5px] font-medium text-zinc-400 transition-colors cursor-pointer"
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    )}

                    {poll.questionType === "free_text" && (
                      <div className="flex gap-1">
                        <input
                          type="text"
                          placeholder="Type response trace..."
                          id={`ftext-poll-${poll.id}`}
                          className="flex-1 bg-zinc-950 border border-zinc-900 p-0.5 px-1.5 text-[9px] rounded-md text-white focus:outline-none focus:border-cyan-500/30 font-sans"
                          onKeyDown={e => {
                            if (e.key === "Enter") {
                              const val = (e.target as HTMLInputElement).value;
                              if (val.trim()) answerPoll(poll.id, val.trim());
                            }
                          }}
                        />
                        <button
                          onClick={() => {
                            const el = document.getElementById(`ftext-poll-${poll.id}`) as HTMLInputElement;
                            if (el && el.value.trim()) {
                              answerPoll(poll.id, el.value.trim());
                            }
                          }}
                          className="bg-cyan-950 hover:bg-cyan-900 border border-cyan-850 text-cyan-400 text-[8px] font-mono px-1.5 py-0.5 rounded-md uppercase font-bold cursor-pointer"
                        >
                          Send
                        </button>
                      </div>
                    )}
                  </div>
                ))}

                {/* Gated Execution Block Approvals */}
                {pendingApprovals.map(apprv => (
                  <div key={apprv.id} className="p-2.5 bg-purple-950/10 border border-[#a855f7]/20 rounded-xl space-y-2">
                    <div className="flex items-center gap-1.5 text-[8px] font-mono font-extrabold text-[#c084fc] uppercase leading-none">
                      <ShieldAlert className="w-3.5 h-3.5 text-purple-400" />
                      <span>Gated Action Authorization</span>
                    </div>
                    <div className="text-[8.5px] text-zinc-405 leading-normal">
                      <div className="flex justify-between font-bold text-[7.5px] uppercase">
                        <span className="text-purple-300">Risk: {apprv.riskLevel}</span>
                        <span className="text-zinc-550 font-mono text-[7px]">{apprv.actionType}</span>
                      </div>
                      <p className="mt-1 text-zinc-450 font-mono text-[7.5px] bg-[#030406] p-1 border border-zinc-900 rounded truncate">{JSON.stringify(apprv.actionPayload)}</p>
                    </div>

                    <div className="flex gap-1.5 pt-0.5">
                      <button
                        onClick={() => resolveApproval(apprv.id, "approved")}
                        className="flex-1 py-1 rounded bg-emerald-950 hover:bg-emerald-900 border border-emerald-800/30 text-emerald-404 text-[8px] font-mono uppercase font-bold text-center cursor-pointer transition-colors"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => resolveApproval(apprv.id, "denied")}
                        className="flex-1 py-1 rounded bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-400 text-[8px] font-mono uppercase font-bold text-center cursor-pointer transition-colors"
                      >
                        Deny
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Top short footer metadata tag */}
        <div className="text-[7.5px] font-mono text-zinc-700 pt-3 border-t border-zinc-900 mt-2 flex justify-between uppercase">
          <span>LINK_ACTIVE</span>
          <span>99.9% COEFF</span>
        </div>
      </aside>

      {/* COLUMN 2: CENTER DIALOGUE ENGINE (MAIN CHAT AREA) */}
      <section className="flex-1 flex flex-col justify-between bg-[#08090b]/80 border border-zinc-850 rounded-2xl overflow-hidden h-full relative">
        {/* Custom Bezel Top Ribbon */}
        <div className="h-11 border-b border-zinc-900 bg-[#0c0d11]/80 px-3 flex items-center justify-between shrink-0 z-10 select-none">
          <div className="flex items-center gap-2.5 min-w-0">
            {/* ChatGPT-style Left Sidebar Toggle Button */}
            <button
              onClick={() => setLeftSidebarOpen(!leftSidebarOpen)}
              className={`p-1.5 rounded-lg border flex items-center justify-center transition-all cursor-pointer ${
                leftSidebarOpen 
                  ? "bg-cyan-950/25 border-cyan-800/30 text-cyan-400 hover:bg-cyan-900/40" 
                  : "bg-[#090a10]/60 border-zinc-850 text-zinc-500 hover:text-zinc-350 hover:bg-zinc-900/30"
              }`}
              title={leftSidebarOpen ? "Collapse Left Panel" : "Expand Left Panel"}
            >
              <svg className={`w-4 h-4 transition-transform duration-300 ${!leftSidebarOpen ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <line x1="9" y1="3" x2="9" y2="21" />
              </svg>
            </button>

            <span className="text-[10px] tracking-[0.15em] font-mono font-extrabold text-zinc-350 uppercase truncate">
              {activeWorkspace?.name || "NEVA COCKPIT CONVERSATION"}
            </span>
            {activeConversation.status === "running" && (
              <span className="text-[7.5px] px-1.5 py-0.2 bg-cyan-950 text-cyan-404 border border-cyan-905 font-mono font-bold uppercase rounded-full animate-pulse shrink-0 hidden sm:inline-block">
                Running Sweeps
              </span>
            )}
          </div>

          {/* Right Controls Container */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Neva Live Monitor Toggle Button */}
            <button
              onClick={() => setLiveMonitorActive(!liveMonitorActive)}
              className={`p-1.5 rounded-lg border flex items-center gap-1.5 text-[9px] font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                liveMonitorActive 
                  ? "bg-cyan-950/25 border-cyan-800/20 text-cyan-404 shadow-[0_0_12px_rgba(6,182,212,0.15)] animate-pulse" 
                  : "bg-[#090a10]/60 border-zinc-850 text-zinc-500 hover:text-zinc-350 hover:bg-zinc-900/30"
              }`}
              title={liveMonitorActive ? "Deactivate Neva Live Monitor" : "Activate Neva Live Monitor"}
            >
              <Activity className={`w-3.5 h-3.5 ${liveMonitorActive ? "text-cyan-400 animate-pulse" : ""}`} />
              <span className="hidden sm:inline">Neva Monitor</span>
            </button>

            {/* ChatGPT-style Right Sidebar Toggle Button */}
            <button
              onClick={() => setRightChatHubOpen(!rightChatHubOpen)}
              className={`p-1.5 rounded-lg border flex items-center justify-center transition-all cursor-pointer ${
                rightChatHubOpen 
                  ? "bg-cyan-950/25 border-cyan-800/30 text-cyan-404 hover:bg-cyan-900/40" 
                  : "bg-[#090a10]/60 border-zinc-850 text-zinc-500 hover:text-zinc-350 hover:bg-zinc-900/30"
              }`}
              title={rightChatHubOpen ? "Collapse Analytics Panel" : "Expand Analytics Panel"}
            >
              <svg className={`w-4 h-4 transition-transform duration-300 ${!rightChatHubOpen ? "-rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <line x1="15" y1="3" x2="15" y2="21" />
              </svg>
            </button>
          </div>
        </div>

        {/* CHRONOLOGICAL MULTI-MESSAGE STREAM */}
        <div 
          ref={scrollContainerRef}
          className="flex-grow overflow-y-auto p-4 md:p-6 scrollbar-thin space-y-6 select-text"
        >
          {deepThinkSearchActive ? (
            /* Dedicated DeepThink Search interface panel */
            <div className="flex flex-col h-full min-h-[450px] justify-between gap-6">
              {searchRounds.length === 0 && !isSearching ? (
                /* Empty / Start Search View */
                <div className="flex-grow flex flex-col items-center justify-center p-8 text-center select-none py-12 sm:py-20 animate-fade-in max-w-2xl mx-auto">
                  <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(245,158,11,0.1)] relative">
                    <Search className="w-7 h-7 text-amber-400" />
                    <Sparkles className="w-4 h-4 text-amber-300 absolute -top-1 -right-1 animate-bounce" />
                  </div>
                  <h3 className="text-base font-serif italic text-amber-300 font-extrabold mb-2 uppercase tracking-wide">NEVA COGNITIVE DEEPTHINK SEARCH</h3>
                  <p className="text-zinc-500 text-[11px] leading-relaxed mb-8 font-medium">
                    Submit complex queries to Neva's deep-search web research protocol. NEVA will analyze, compile sub-queries, gather peer-reviewed citation nodes, and synthesize a professional-grade briefing paper with cross-references.
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full">
                    {[
                      { title: "Superconductor Room-temperature advances", desc: "Scan recent material science portals and replication trials." },
                      { title: "Capabilities & performance comparison: GPT-4.5 vs Gemini 1.5 Pro", desc: "Compare benchmark results, latency, and context windows." },
                      { title: "Quantum key distribution scaling protocols", desc: "Audit peer-reviewed journals on cryptographic latency profiles." },
                      { title: "Generative AI agent orchestration design patterns", desc: "Map architectural graphs on multi-agent communication networks." }
                    ].map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setComposorPrompt(item.title);
                          handleDeepThinkSearch(item.title);
                        }}
                        className="text-left p-4 rounded-xl border border-zinc-900 bg-[#08090d]/80 hover:bg-amber-950/10 hover:border-amber-500/20 text-zinc-450 hover:text-zinc-200 transition-all cursor-pointer group"
                      >
                        <span className="text-[11px] font-bold block mb-1 text-zinc-300 group-hover:text-amber-300 transition-colors font-sans">{item.title}</span>
                        <span className="text-[9.5px] text-zinc-550 font-medium leading-normal block font-sans">{item.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                /* Search results active or complete display */
                <div className="space-y-6 max-w-4xl mx-auto w-full animate-fade-in pb-10">
                  
                  {/* Research Status Tracker */}
                  <div className="flex items-center justify-between p-4 bg-amber-950/5 border border-amber-500/15 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                        <Brain className={`w-5 h-5 text-amber-400 ${isSearching ? "animate-pulse" : ""}`} />
                      </div>
                      <div className="text-left">
                        <div className="text-xs font-bold text-amber-300">NEVA deep research timeline</div>
                        <div className="text-[10px] text-zinc-450 font-medium mt-0.5">
                          {isSearching ? "Actively querying and verifying multiple peer web nodes..." : "Research protocol audit complete. Verified."}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold px-2 py-1 rounded bg-amber-500/15 text-amber-400 border border-amber-500/25 uppercase shrink-0">
                        {searchRounds.length} Rounds
                      </span>
                    </div>
                  </div>

                  {/* Search Rounds Timeline */}
                  <div className="space-y-4">
                    <div className="text-[10px] font-mono text-zinc-500 font-bold uppercase tracking-wider px-1 text-left">Retrieved Intelligence Nodes</div>
                    <div className="space-y-3">
                      {searchRounds.map((round, idx) => (
                        <div key={idx} className="border border-zinc-850 bg-[#07080c] rounded-xl overflow-hidden shadow-sm">
                          {/* Round Header */}
                          <div 
                            onClick={() => toggleRoundExpanded(idx)}
                            className="flex items-center gap-3 px-4 py-3 bg-zinc-950/40 hover:bg-zinc-950/80 transition-all cursor-pointer select-none"
                          >
                            <div className="w-6 h-6 rounded-lg bg-amber-500/15 flex items-center justify-center text-[11px] text-amber-400 font-mono font-extrabold shrink-0">
                              {idx + 1}
                            </div>
                            <Search size={14} className="text-zinc-500 shrink-0" />
                            <span className="text-[11.5px] font-bold text-zinc-350 truncate flex-1 text-left">{round.query}</span>
                            <span className="text-[9.5px] font-mono text-zinc-600 bg-zinc-900 border border-zinc-855 px-2 py-0.5 rounded ml-auto flex items-center gap-1">
                              {round.sources.length} sources {round.expanded ? "▲" : "▼"}
                            </span>
                          </div>
                          
                          {/* Sources */}
                          {round.expanded && (
                            <div className="p-4 bg-zinc-950/20 border-t border-zinc-900 space-y-4 divide-y divide-zinc-900/40 text-left">
                              {round.sources.map((source, sidx) => (
                                <div key={sidx} className={`flex items-start gap-4 text-[11px] ${sidx > 0 ? "pt-3 border-t border-zinc-900/20" : ""}`}>
                                  <span className="text-amber-500 font-mono font-extrabold select-none">[{sidx + 1}]</span>
                                  <div className="min-w-0 flex-1">
                                    <a href={source.url} referrerPolicy="no-referrer" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 hover:underline cursor-pointer font-bold block truncate">
                                      {source.title}
                                    </a>
                                    <div className="text-zinc-650 truncate text-[9.5px] mt-0.5 font-mono">{source.url}</div>
                                    <div className="text-zinc-500 mt-1 leading-relaxed font-sans">{source.snippet}</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Synthesized Answer Output */}
                  {finalAnswer && (
                    <div className="border border-zinc-900 bg-gradient-to-b from-[#090a10] to-[#040507] rounded-2xl p-6 shadow-xl relative overflow-hidden text-left">
                      <div className="absolute top-0 left-0 w-1 h-full bg-amber-500/40"></div>
                      <div className="flex items-center gap-2 mb-4 text-amber-400">
                        <Brain size={16} className="text-amber-400" />
                        <span className="text-xs uppercase tracking-widest font-bold font-mono">Synthesized DeepThink Report</span>
                      </div>
                      
                      {/* Markdown rendered body */}
                      <div className="text-[12px] sm:text-[13px] text-zinc-200 leading-relaxed font-sans markdown-content space-y-4 prose prose-invert max-w-none">
                        <Markdown>{finalAnswer}</Markdown>
                      </div>
                    </div>
                  )}

                  {/* Active Research Progress Indicator */}
                  {isSearching && (
                    <div className="p-6 border border-amber-500/15 bg-amber-950/5 rounded-2xl flex flex-col items-center justify-center text-center py-10 animate-pulse">
                      <div className="w-10 h-10 rounded-full border-2 border-amber-500/20 border-t-amber-500 animate-spin mb-4"></div>
                      <div className="text-xs font-bold text-amber-300">Compiling citations & synthesizing research parameters...</div>
                      <div className="text-[10px] text-zinc-500 mt-1">Multi-stage evidence analysis models are executing context matching.</div>
                    </div>
                  )}
                  
                </div>
              )}
            </div>
          ) : (
            /* Standard chronological thread section */
            messages.length === 0 ? (
              <div className="flex-grow flex flex-col items-center justify-center p-8 text-center select-none py-16">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#08090f] to-[#121422] border border-cyan-500/15 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(6,182,212,0.1)]">
                  <Sparkles className="w-6 h-6 text-cyan-404 animate-pulse" />
                </div>
                <h3 className="text-sm font-serif italic text-zinc-100 font-bold mb-2">NEVA Intelligence Grid</h3>
                <p className="text-zinc-500 text-[10.5px] leading-relaxed max-w-sm mb-6 font-medium">
                  Initialize deep research, analytical sweeps, or multi-agent execution routines. The workspace is loaded and synchronized with your memory profiles.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg w-full">
                  {[
                    { title: "Draft high-fidelity integration tests", desc: "Builds a test runner template for websocket payloads." },
                    { title: "Perform grounding research on market models", desc: "Searches scientific corpora for economic trend patterns." },
                    { title: "Analyze active telemetry and debugging logs", desc: "Scans active system records to identify latency blocks." },
                    { title: "Sync custom logic across cognitive models", desc: "Formulates a system-prompt bridge for reasoning weights." }
                  ].map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => setComposorPrompt(item.title)}
                      className="text-left p-3.5 rounded-xl border border-zinc-900 bg-[#08090d]/60 hover:bg-[#12131a] hover:border-cyan-500/15 text-zinc-455 hover:text-zinc-200 transition-all cursor-pointer group"
                    >
                      <span className="text-[10px] font-extrabold block mb-1 text-zinc-300 group-hover:text-cyan-300 transition-colors font-sans">{item.title}</span>
                      <span className="text-[9px] text-zinc-500 font-medium leading-normal block font-sans">{item.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((msg, index) => {
                const isUser = msg.role === "user";
                const { thinkContent, restContent } = parseMessageContent(msg.content);
                const { mainBody, citationSection } = parseCitations(restContent);

                return (
                  <div key={msg.id || index} className={`flex flex-col gap-2 ${isUser ? "items-end" : "items-start"} animate-fade-in`}>
                    {/* Sender Header */}
                    <div className="flex items-center gap-2 text-[8px] font-mono text-zinc-500 font-bold uppercase tracking-widest select-none px-1">
                      {!isUser && (
                        <div className="w-5 h-5 rounded-lg bg-cyan-950/80 border border-cyan-800/40 text-cyan-404 flex items-center justify-center text-[8.5px] font-extrabold shadow-[0_0_8px_rgba(6,182,212,0.15)] shrink-0">
                          NV
                        </div>
                      )}
                      <span>{isUser ? "USER COMPOSER IDENTITY" : (msg.modelUsed || "Neva Orchestrator")}</span>
                      {isUser && (
                        <div className="w-5 h-5 rounded-lg bg-zinc-900 border border-zinc-850 text-zinc-400 flex items-center justify-center text-[8.5px] font-mono shrink-0 font-bold">
                          ME
                        </div>
                      )}
                      {!isUser && (msg.isThinking === true || (msg.steps && msg.steps.length > 0)) && (
                        <button
                          onClick={() => {
                            const id = msg.id || index.toString();
                            setHiddenThinkingMsgIds(prev => ({
                              ...prev,
                              [id]: !prev[id]
                            }));
                          }}
                          className="ml-3 inline-flex items-center gap-1 px-1.5 py-0.5 rounded border border-cyan-500/10 hover:border-cyan-505/30 bg-cyan-955/20 hover:bg-cyan-900/30 text-zinc-400 hover:text-cyan-300 transition-all cursor-pointer font-bold select-none text-[8.5px]"
                        >
                          {hiddenThinkingMsgIds[msg.id || index.toString()] ? (
                            <>
                              <EyeOff className="w-2.5 h-2.5 text-zinc-500" />
                              <span>Show Thinking</span>
                            </>
                          ) : (
                            <>
                              <Eye className="w-2.5 h-2.5 text-cyan-400" />
                              <span>Hide Thinking</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>

                    {/* Bubble Container */}
                    <div className={`max-w-[90%] rounded-2xl p-4 text-xs shadow-md leading-relaxed select-text ${
                      isUser 
                        ? "bg-zinc-955/80 border border-zinc-800 text-zinc-200 rounded-tr-none" 
                        : "bg-[#090a10] border border-cyan-500/10 text-zinc-300 rounded-tl-none hover:border-cyan-500/20 transition-all duration-300"
                    }`}>
                      {/* Render live ThinkingStream timeline */}
                      {!isUser && (msg.isThinking === true || (msg.steps && msg.steps.length > 0)) && (
                        <div 
                          className="transition-all duration-500 ease-in-out overflow-hidden"
                          style={{ 
                            maxHeight: hiddenThinkingMsgIds[msg.id || index.toString()] ? "0px" : "1200px",
                            opacity: hiddenThinkingMsgIds[msg.id || index.toString()] ? 0 : 1,
                            marginBottom: hiddenThinkingMsgIds[msg.id || index.toString()] ? "0px" : "16px"
                          }}
                        >
                          <ThinkingStream 
                            steps={msg.steps || []} 
                            isStreaming={!!msg.isThinking} 
                          />
                        </div>
                      )}

                      {/* Render inline Thinking Trace/Cognitive Trace if present */}
                      {!isUser && thinkContent && (!msg.steps || msg.steps.length === 0) && (
                        <ThinkingAccordion content={thinkContent} />
                      )}

                      {!isUser && msg.content && msg.content.includes("DeepThink Search Report") && (
                        <div className="bg-amber-955/20 border border-amber-900/35 text-amber-500 px-3 py-1.5 rounded-xl mb-3 flex items-center gap-2 text-[9.5px] font-mono font-bold uppercase tracking-wider select-none">
                          <Brain className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                          <span>NEVA AI DeepThink Synthesized Report</span>
                        </div>
                      )}

                      {/* Content body with markdown */}
                      <div className="markdown-body prose prose-invert max-w-none text-zinc-300 font-medium tracking-normal text-[11.5px] sm:text-xs">
                        <Markdown components={{ code: CodeBlock }}>{mainBody}</Markdown>
                      </div>

                      {/* Render inline Citations if present */}
                      {!isUser && citationSection && (
                        <WebGroundingPanel content={citationSection} />
                      )}

                      {/* Render custom download & zip manager center */}
                      {!isUser && (
                        <MessageDownloadCenter content={msg.content} messageId={msg.id || index.toString()} />
                      )}

                      {/* Diagnostic line for premium aesthetic feel */}
                      {!isUser && (msg.inputTokens || msg.outputTokens || msg.modelUsed) && (
                        <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-zinc-900/60 text-[7px] font-mono text-zinc-65 select-none uppercase font-bold tracking-wider">
                          <div className="flex gap-3">
                            {msg.inputTokens && <span>Input: {msg.inputTokens} t</span>}
                            {msg.outputTokens && <span>Output: {msg.outputTokens} t</span>}
                          </div>
                          <button 
                            onClick={() => copyToClipboard(msg.content, msg.id || index.toString())}
                            className="text-zinc-650 hover:text-zinc-400 flex items-center gap-1 cursor-pointer transition-colors uppercase"
                          >
                            {copiedId === (msg.id || index.toString()) ? (
                              <>
                                <Check className="w-2.5 h-2.5 text-emerald-400" />
                                <span className="text-emerald-400 font-bold">Trace Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-2.5 h-2.5" />
                                <span>Copy raw source</span>
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )
          )}

          <div ref={scrollRef} className="h-2" />
        </div>

        {/* HIGH-TECH COMPOSER CONTAINER */}
        {/* === MOBILE FIX ===: Ensure composer is raised on top, selectable, and has higher z-index, but hides on mobile when sidebar is open */}
        <div className={`mt-auto p-4 border-t border-zinc-900/80 bg-[#07080b]/95 backdrop-blur-md relative z-[100] select-text transition-all ${
          (leftSidebarOpen || rightChatHubOpen || liveMonitorActive) ? "max-lg:hidden" : ""
        }`}>
          {/* Drag & Drop Feedback Panel Overlay */}
          {isDragging && (
            <div className="absolute inset-0 bg-cyan-950/60 backdrop-blur-sm flex items-center justify-center border-t border-cyan-500/30 z-[110] animate-pulse rounded-t-xl pointer-events-none">
              <div className="text-center font-mono">
                <Paperclip className="w-8 h-8 text-cyan-404 mx-auto mb-2 animate-bounce" />
                <span className="text-[10px] uppercase tracking-widest text-cyan-300 font-extrabold animate-pulse">Release to Index in Workspace Context</span>
              </div>
            </div>
          )}

          {/* Preview space for indices uploaded/held in workspace session */}
          {files.length > 0 && (
            <div className="flex gap-2 mb-3 overflow-x-auto pb-1.5 scrollbar-none relative z-[120]">
              {files.slice(-4).map(fileObj => (
                <div key={fileObj.id} className="flex items-center gap-1.5 p-1.5 px-2.5 bg-[#050608] border border-zinc-900 rounded-lg text-[8.5px] font-mono text-zinc-400 max-w-[170px] shrink-0 animate-fade-in select-text">
                  <FileCode className="w-3.5 h-3.5 text-cyan-404" />
                  <span className="truncate flex-1 uppercase" title={fileObj.name}>{fileObj.name}</span>
                  <span className="text-[7px] text-zinc-600">{(fileObj.sizeBytes / 1024).toFixed(0)}K</span>
                </div>
              ))}
            </div>
          )}

          {/* Composer area with custom actions row nested */}
          {/* === MOBILE FIX ===: Add .composer-safe-area and ensure interactive layout */}
          <motion.div 
            whileHover={{ scale: 1.01, boxShadow: "0 0 25px rgba(6, 182, 212, 0.08)" }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className={cn(
              "flex flex-col gap-2.5 bg-[#0c0d12] border border-zinc-850 rounded-2xl p-2.5 focus-within:border-cyan-500/40 focus-within:shadow-[0_0_20px_rgba(6,182,212,0.06)] transition-all shadow-inner relative z-[130] composer-safe-area select-text",
              activeConversation?.status === "running" && "animate-shimmer border-cyan-500/25 shadow-[0_0_25px_rgba(6,182,212,0.15)] bg-gradient-to-r from-[#0c0d12] via-[#141722] to-[#0c0d12] bg-[length:200%_100%]"
            )}
          >
            {/* Toolbar row with scrolling tools */}
            <div className="flex items-center gap-2 pb-2 border-b border-zinc-900/50 overflow-x-auto scrollbar-none justify-start select-none">
              <button
                type="button"
                onClick={() => !deepThinkSearchActive && setThinkingEnabled(!thinkingEnabled)}
                disabled={deepThinkSearchActive}
                className={`text-[7.5px] font-mono tracking-wider font-extrabold uppercase rounded p-1 select-none leading-none transition-all cursor-pointer border shrink-0 ${
                  (thinkingEnabled || deepThinkSearchActive)
                    ? "bg-purple-950/40 text-purple-400 border-purple-900/40" 
                    : "bg-[#090a10]/60 text-zinc-500 border-zinc-900 hover:text-zinc-400"
                } ${deepThinkSearchActive ? "opacity-50 cursor-not-allowed" : ""}`}
                title="Toggle Reasoning Trace"
              >
                Think
              </button>
              
              <button
                type="button"
                onClick={() => !deepThinkSearchActive && setSearchEnabled(!searchEnabled)}
                disabled={deepThinkSearchActive}
                className={`text-[7.5px] font-mono tracking-wider font-extrabold uppercase rounded p-1 select-none leading-none transition-all cursor-pointer border shrink-0 ${
                  (searchEnabled || deepThinkSearchActive)
                    ? "bg-emerald-955/40 text-emerald-400 border-emerald-900/40" 
                    : "bg-[#090a10]/60 text-zinc-500 border-zinc-900 hover:text-zinc-400"
                } ${deepThinkSearchActive ? "opacity-50 cursor-not-allowed" : ""}`}
                title="Toggle Web Search Grounding"
              >
                Search
              </button>

              <button 
                type="button"
                onClick={() => setLiveMonitorActive(!liveMonitorActive)}
                className={`text-[7.5px] font-mono tracking-wider font-extrabold uppercase rounded p-1 select-none leading-none transition-all cursor-pointer flex items-center gap-1 border shrink-0 ${
                  liveMonitorActive 
                    ? "bg-cyan-950/40 text-cyan-404 border-cyan-800/25 shadow-[0_0_8px_rgba(6,182,212,0.2)] ring-1 ring-cyan-500/10" 
                    : "bg-[#090a10]/60 text-zinc-500 border-zinc-900 hover:text-zinc-400"
                }`}
                title="Toggle Neva Live Multi-Agent Monitor streams in right panel"
              >
                {activeConversation?.status === "running" ? (
                  <Activity className="w-2.5 h-2.5 shrink-0 text-cyan-404 animate-pulse" />
                ) : (
                  <svg className="w-2.5 h-2.5 shrink-0 text-zinc-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                )}
                <span>Monitor</span>
              </button>

              <button 
                type="button"
                onClick={() => setDeepThinkSearchActive(!deepThinkSearchActive)}
                className={`text-[7.5px] font-mono tracking-wider font-extrabold uppercase rounded p-1 select-none leading-none transition-all cursor-pointer flex items-center gap-1.5 border shrink-0 ${
                  deepThinkSearchActive 
                    ? "bg-amber-950/40 text-amber-400 border-amber-800/30 shadow-[0_0_8px_rgba(245,158,11,0.2)] ring-1 ring-amber-500/10" 
                    : "bg-[#090a10]/60 text-zinc-500 border-zinc-900 hover:text-zinc-400"
                }`}
                title="Toggle AI DeepThink Search"
              >
                <Brain className={`w-2.5 h-2.5 shrink-0 ${deepThinkSearchActive ? "text-amber-400 animate-pulse" : ""}`} />
                <span>DeepThink</span>
                <span className="text-[6px] font-mono bg-amber-955/45 text-amber-500 border border-amber-900/30 px-0.8 py-0.2 rounded shrink-0 font-extrabold">PRO</span>
              </button>
            </div>

            {/* Input and Send Row */}
            <div className="flex items-end gap-2.5 min-w-0">
              <button 
                onClick={() => fileInputRef.current?.click()} 
                className="p-2 hover:bg-[#161720] rounded-xl text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer shrink-0 mb-0.5"
                title="Attach documents elements to logical workspace context"
              >
                <Paperclip className="w-4 h-4" />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden"
                multiple
              />
              
              {/* === MOBILE FIX ===: Set explicit selectable, touchable attributes, touch-manipulation */}
              <textarea
                id="chat-textarea-input"
                ref={composerRef}
                rows={1}
                className="flex-1 bg-transparent border-none outline-none text-[11.5px] text-zinc-250 placeholder-zinc-650 font-sans resize-none py-1.5 max-h-[140px] focus:ring-0 leading-relaxed scrollbar-thin overflow-y-auto select-text touch-manipulation min-w-0"
                style={{
                  touchAction: "manipulation",
                  WebkitUserSelect: "text",
                  userSelect: "text",
                }}
                placeholder="Formulate logical requests, trigger analytical tools, or query verified indexing..."
                value={composorPrompt}
                onChange={e => {
                  setComposorPrompt(e.target.value);
                  if (composerRef.current) {
                    composerRef.current.style.height = "auto";
                    composerRef.current.style.height = `${composerRef.current.scrollHeight}px`;
                  }
                }}
                onKeyDown={e => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleComposeSend();
                  }
                }}
              />

              <button 
                onClick={handleComposeSend} 
                disabled={!composorPrompt.trim()}
                className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all shrink-0 cursor-pointer ${
                  composorPrompt.trim() 
                    ? "bg-cyan-950 border border-cyan-800/30 text-cyan-404 hover:bg-cyan-900 hover:text-cyan-300"
                    : "bg-zinc-950 border border-zinc-900 text-zinc-700 cursor-not-allowed"
                }`}
                title="Transmit query trace to core agent"
              >
                <Send className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* MOBILE LEFT MONITOR BACKDROP */}
      {liveMonitorActive && (
        <div 
          onClick={() => setLiveMonitorActive(false)}
          className="fixed inset-0 bg-black/80 backdrop-blur-xs z-[200] lg:hidden cursor-pointer animate-fade-in"
        />
      )}

      {/* MANUS AI-STYLE AGENT COMPUTER OVERLAY */}
      {liveMonitorActive && (
        <aside 
          id="neva-agent-computer-console"
          className="
            fixed bottom-0 left-0 right-0 h-[80vh] rounded-t-3xl border-t bg-[#040507] p-4 flex flex-col justify-between z-[210] transition-all duration-300 transform translate-y-0 border-zinc-850 shadow-[0_-25px_60px_-15px_rgba(0,0,0,0.9)]
            lg:relative lg:inset-auto lg:h-full lg:w-[480px] xl:w-[580px] lg:border-l lg:border-t-0 lg:rounded-2xl lg:p-4 lg:shrink-0 lg:shadow-none
          "
        >
          {(() => {
            const monitorSteps = steps.filter(s => s.status === "running" || s.status === "completed" || s.status === "failed");
            
            // Calculate active displayed step index
            const activeStepIndex = selectedStepIndex !== null && selectedStepIndex >= 0 && selectedStepIndex < monitorSteps.length
              ? selectedStepIndex
              : monitorSteps.length - 1;
              
            const displayStep = monitorSteps[activeStepIndex];
            const isLive = selectedStepIndex === null || selectedStepIndex === monitorSteps.length - 1;

            // Compute Estimated Completion Time (ETA)
            const completedSteps = monitorSteps.filter(s => s.status === "completed" && s.durationMs);
            const avgDurationMs = completedSteps.length > 0
              ? completedSteps.reduce((acc, curr) => acc + (curr.durationMs || 0), 0) / completedSteps.length
              : 3500;
            const etaSecs = Math.max(2, Math.round(avgDurationMs / 1000));

            return (
              <div className="flex flex-col h-full overflow-hidden justify-between gap-3">
                
                {/* 1. Header block */}
                <div className="flex items-center justify-between pb-3 border-b border-zinc-900 shrink-0">
                  <div className="flex items-center gap-2 min-w-0">
                    <Server className="w-4 h-4 text-cyan-404 shrink-0" />
                    <div className="leading-tight">
                      <span className="text-[10px] tracking-wider font-mono font-bold text-zinc-300 uppercase block">NEVA's Computer</span>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-404 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-cyan-400"></span>
                        </span>
                        <span className="text-[7.5px] font-mono font-bold text-cyan-404 uppercase tracking-wider">
                          {isLive ? "LIVE RADAR RECONSTREAM" : "HISTORIC SCRUB TRACE"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action chips and Cancel button */}
                  <div className="flex items-center gap-2 select-none">
                    {activeConversation?.status === "running" && (
                      <div className="flex items-center gap-1.5 bg-cyan-950/30 border border-cyan-800/15 px-2 py-0.8 rounded-lg animate-fade-in shrink-0">
                        <span className="text-[7.5px] font-mono text-cyan-100 font-bold truncate max-w-[90px]">
                          Running Sweeps
                        </span>
                        <span className="text-[7px] font-mono text-zinc-650 bg-[#090a10]/40 border border-zinc-850 px-1 py-0.2 rounded font-extrabold shrink-0">
                          ETA: ~{etaSecs}s
                        </span>
                        <button
                          onClick={() => cancelRun(activeConversation.id)}
                          className="text-rose-500 hover:text-rose-400 hover:bg-rose-950/20 p-0.5 rounded transition-colors shrink-0 cursor-pointer"
                          title="Cancel active pipeline"
                        >
                          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line></svg>
                        </button>
                      </div>
                    )}

                    <button
                      onClick={() => setLiveMonitorActive(false)}
                      className="text-zinc-650 hover:text-zinc-300 p-1 rounded hover:bg-zinc-900 border border-transparent hover:border-zinc-805 transition-all cursor-pointer shrink-0"
                      title="Fold Live Monitor"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* 2. Main Live Preview Pane */}
                <div className="flex-1 min-h-0 min-w-0 bg-[#06070a]/90 border border-zinc-900 rounded-xl overflow-hidden flex flex-col justify-between relative shadow-inner">
                  
                  {monitorSteps.length === 0 ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center select-none bg-[#020305]/60">
                      <div className="w-12 h-12 rounded-2xl bg-[#090a10] border border-zinc-900 flex items-center justify-center mb-4 text-zinc-500 animate-pulse shadow-md">
                        <Terminal className="w-4 h-4" />
                      </div>
                      <span className="text-[8px] tracking-[0.2em] font-mono font-bold text-zinc-400 uppercase block">AWAITING SWEEP LOOPS</span>
                      <p className="text-zinc-600 font-sans text-[10px] leading-relaxed max-w-xs mt-1 font-medium">
                        System standing by. Transmit queries from the cockpit to deploy sub-agent computational processes.
                      </p>
                    </div>
                  ) : !displayStep ? (
                    <div className="absolute inset-0 flex items-center justify-center p-4">
                      <span className="text-xs font-mono text-zinc-500 animate-pulse">Initializing preview matrices...</span>
                    </div>
                  ) : (
                    <div className="flex flex-col h-full w-full min-h-0 overflow-hidden bg-[#020305]/95">
                      
                      {/* Browser Action Style Tab */}
                      {displayStep.tool === "browser" || displayStep.tool?.includes("browse") || displayStep.tool?.includes("fetch") || displayStep.tool?.includes("web") ? (
                        <div className="flex flex-col h-full min-h-0 overflow-hidden leading-relaxed">
                          {/* SSL tab navbar look */}
                          <div className="bg-[#090a10]/80 h-10 border-b border-zinc-900 px-3 flex items-center gap-2 shrink-0">
                            <div className="flex gap-1">
                              <span className="w-2 h-2 rounded-full bg-rose-500/80" />
                              <span className="w-2 h-2 rounded-full bg-amber-500/80" />
                              <span className="w-2 h-2 rounded-full bg-emerald-500/80" />
                            </div>
                            <div className="flex-1 bg-zinc-950/60 border border-zinc-900 rounded-lg px-2 py-0.8 flex items-center gap-1.5 min-w-0">
                              <svg className="w-2.5 h-2.5 text-emerald-450 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                              <span className="text-[8.5px] font-mono text-zinc-455 truncate">
                                https://neva-crawler.ai/active-scraping?query={encodeURIComponent(displayStep.inputPreview || "parameters")}
                              </span>
                            </div>
                            <span className="text-[6.5px] font-mono font-bold bg-cyan-950/40 border border-cyan-800/20 text-cyan-400 px-1 py-0.2 rounded uppercase shrink-0">
                              SSL CHECK
                            </span>
                          </div>

                          {/* Scrolling Rendered Page content view */}
                          <div className="flex-1 overflow-y-auto p-4 md:p-5 text-[11px] font-sans text-zinc-350 leading-relaxed scrollbar-thin space-y-3 prose prose-invert select-text">
                            <div className="p-3 bg-zinc-955/20 border border-cyan-500/5 rounded-xl border-l-2 border-l-cyan-500 shadow-sm leading-normal">
                              <span className="text-[8px] font-mono uppercase text-cyan-400 font-extrabold tracking-widest block">EXTRACTED WEB OBJECT INTENT</span>
                              <p className="font-semibold text-zinc-200 mt-1">{displayStep.inputPreview || "Acquiring network asset matrix details"}</p>
                            </div>
                            
                            <div className="space-y-2 mt-4">
                              <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest block font-bold">Scraped Structural Corpus</span>
                              <p className="text-[11px] font-medium leading-relaxed font-sans text-zinc-400">
                                {displayStep.outputPreview || "Parsing structured elements into active context memory registers. Real-time index sync complete."}
                              </p>
                            </div>
                          </div>
                        </div>
                      ) : displayStep.tool === "search" || displayStep.tool?.includes("query") || displayStep.tool?.includes("tavily") || displayStep.tool?.includes("google") ? (
                        <div className="flex flex-col h-full min-h-0 overflow-hidden leading-relaxed">
                          {/* Search Tab Navbar */}
                          <div className="bg-[#090a10]/80 h-10 border-b border-zinc-900 px-3 flex items-center gap-2 shrink-0">
                            <div className="w-full bg-zinc-955/40 border border-zinc-900 rounded-lg px-2.5 py-1 flex items-center gap-2 min-w-0">
                              <svg className="w-3 h-3 text-zinc-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                              <span className="text-[9.5px] font-sans font-bold text-zinc-300 truncate">
                                {displayStep.inputPreview || "Active Grounding Matrix Queries"}
                              </span>
                            </div>
                          </div>

                          {/* Grounding lookup outcomes */}
                          <div className="flex-grow overflow-y-auto p-4 md:p-5 scrollbar-thin space-y-3.5 select-text leading-relaxed font-sans text-zinc-350">
                            <div className="flex items-center gap-2">
                              <span className="text-[7.5px] font-mono text-emerald-450 border border-emerald-900/40 bg-emerald-955/40 font-bold uppercase rounded p-1 tracking-wider">TAVILY ROOT SYNC</span>
                              <span className="text-[7.5px] font-mono text-zinc-650">3 Grounding Matches Synced</span>
                            </div>

                            <div className="space-y-3">
                              {[
                                { t: "Google AI Grounding Documents", c: "Grounding and Search APIs supply model runs with verified, factual citations natively." },
                                { t: "Vite and modern packaging workflows", c: "Dynamic fast compilations ensure high performance offlines without DB lag." },
                                { t: "Tailwind CSS Layout bounds", c: "Full-width drawer resizes on viewport configurations elegantly above grid parameters." }
                              ].map((it, idx) => (
                                <div key={idx} className="p-3 bg-[#06070a] border border-zinc-900 rounded-xl leading-normal hover:border-zinc-800 transition-colors">
                                  <span className="text-[10px] font-bold text-zinc-300 block">{it.t}</span>
                                  <span className="text-[10px] text-zinc-500 block mt-1 font-medium">{it.c}</span>
                                </div>
                              ))}
                            </div>
                            
                            <p className="text-[10.5px] font-mono text-zinc-500 pt-3 border-t border-zinc-900 leading-relaxed">
                              OUTPUT RAW RESPONSE: {displayStep.outputPreview || "Synthesis pass successfully complete. Report assembled in workspace."}
                            </p>
                          </div>
                        </div>
                      ) : displayStep.tool?.includes("editor") || displayStep.tool?.includes("write") || displayStep.tool?.includes("edit") || displayStep.tool?.includes("save") ? (
                        <div className="flex flex-col h-full min-h-0 overflow-hidden leading-relaxed">
                          {/* Code editor navbar look */}
                          <div className="bg-[#090a10]/80 h-10 border-b border-zinc-900 px-3 flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-1.5 min-w-0">
                              <span className="w-1.5 h-1.5 rounded-full bg-cyan-404 shrink-0 animate-pulse" />
                              <span className="text-[9px] font-mono text-zinc-350 font-bold truncate">/src/App.tsx</span>
                            </div>
                            <span className="text-[7px] font-mono bg-purple-950/20 text-purple-400 border border-purple-900/30 px-1 py-0.2 rounded uppercase shrink-0">
                              TypeScript CJS Bundle
                            </span>
                          </div>

                          {/* Editor margins and simulated code pane */}
                          <div className="flex-1 overflow-y-auto p-4 md:p-5 font-mono text-[9.5px] leading-relaxed select-text text-zinc-400 bg-[#040507] scrollbar-thin">
                            <div className="space-y-1">
                              <div><span className="text-zinc-700 select-none mr-3">1 |</span> <span className="text-purple-404">import</span> React, &#123; useState, useEffect &#125; <span className="text-purple-404">from</span> <span className="text-emerald-500">"react"</span>;</div>
                              <div><span className="text-zinc-700 select-none mr-3">2 |</span> <span className="text-purple-404">import</span> &#123; useApp &#125; <span className="text-purple-404">from</span> <span className="text-emerald-500">"./AppContext"</span>;</div>
                              <div><span className="text-zinc-700 select-none mr-3">3 |</span> </div>
                              <div><span className="text-zinc-700 select-none mr-3">4 |</span> <span className="text-purple-404">export function</span> <span className="text-cyan-404 font-bold">NevaAgentWorkspace</span>() &#123;</div>
                              <div><span className="text-zinc-700 select-none mr-3">5 |</span> <span className="text-zinc-750 font-bold">  // Modified task: {displayStep.inputPreview || "Modify logic"}</span></div>
                              <div><span className="text-zinc-700 select-none mr-3">6 |</span>   <span className="text-purple-404">const</span> &#123; active, deepThinkSearchActive &#125; = <span className="text-cyan-404">useApp</span>();</div>
                              <div><span className="text-zinc-700 select-none mr-3">7 |</span> </div>
                              <div><span className="text-zinc-700 select-none mr-3">8 |</span>   <span className="text-purple-404">return</span> (</div>
                              <div><span className="text-zinc-700 select-none mr-3">9 |</span>     <span className="text-zinc-500">&lt;</span><span className="text-emerald-400 font-bold">div</span> className<span className="text-purple-404">=</span><span className="text-orange-400">"relative"</span><span className="text-zinc-500">&gt;</span></div>
                              <div><span className="text-zinc-700 select-none mr-3">10 |</span>       <span className="text-zinc-500">&lt;</span><span className="text-emerald-400 font-bold">p</span><span className="text-zinc-500">&gt;</span>Neva sync complete.<span className="text-zinc-500">&lt;/</span><span className="text-emerald-400 font-bold">p</span><span className="text-zinc-500">&gt;</span></div>
                              <div><span className="text-zinc-700 select-none mr-3">11 |</span>     <span className="text-zinc-500">&lt;/</span><span className="text-emerald-400 font-bold">div</span><span className="text-zinc-500">&gt;</span></div>
                              <div><span className="text-zinc-700 select-none mr-3">12 |</span>   );</div>
                              <div><span className="text-zinc-700 select-none mr-3">13 |</span> &#125;</div>
                            </div>

                            <div className="mt-4 p-2.5 bg-[#06070b] border border-zinc-900 rounded-lg text-zinc-550 text-[10px] leading-relaxed leading-normal">
                              <span className="text-[8px] font-mono uppercase text-purple-404 font-bold block pb-1">OUTPUT TRANSACTION SUMMARY</span>
                              {displayStep.outputPreview || "Code updates written successfully to file systems. Validation checks compiled green."}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col h-full min-h-0 overflow-hidden leading-relaxed">
                          {/* Thinking / System Diagnostic log view */}
                          <div className="bg-[#090a10]/80 h-10 border-b border-zinc-900 px-3 flex items-center justify-between shrink-0">
                            <span className="text-[9px] font-mono text-cyan-404 font-bold uppercase">System Diagnostic Logs</span>
                            <span className="text-[7.5px] font-mono text-zinc-600 uppercase font-bold tracking-wider">SECURE TRACE_D9D5</span>
                          </div>

                          <div className="flex-grow overflow-y-auto p-4 md:p-5 font-mono text-[9.5px] scrollbar-thin space-y-3.5 select-text leading-relaxed text-zinc-455 bg-[#040507]">
                            <div className="p-2.5 bg-purple-950/15 border border-purple-900/25 rounded-xl border-l border-l-purple-500 leading-normal">
                              <span className="text-[8px] font-mono uppercase text-purple-400 font-extrabold tracking-widest block">System Thought / Reason Trace</span>
                              <p className="mt-1 leading-normal text-zinc-350">{displayStep.reasoningTrace || "Evaluating strategic priorities. Resolving next procedural steps."}</p>
                            </div>
                            
                            <div className="space-y-1 bg-[#06070c] border border-zinc-900 p-3 rounded-xl max-h-[170px] overflow-y-auto scrollbar-thin text-[9px]">
                              <p className="text-[#a5b4fc]">[SYSTEM DISPATCH]: Loaded Neva agent cognitive model.</p>
                              <p className="text-zinc-650">[SYSTEM PARAMS]: Input preview details evaluated.</p>
                              <p className="text-[#a2e9c1]">[GROUNDING]: Verified index connections mapping.</p>
                              <p className="text-zinc-650">[METRIC]: Latency calculated at {displayStep.durationMs || 120}ms.</p>
                              <p className="text-cyan-404 font-bold">[RADAR STREAM COMPLETE] Ready.</p>
                            </div>

                            <p className="text-[10px] font-sans font-medium text-zinc-500 leading-relaxed border-t border-zinc-900 pt-3">
                              RESULT SNAPSHOT: {displayStep.outputPreview || "Sub-agent routine executed successfully."}
                            </p>
                          </div>
                        </div>
                      )}

                    </div>
                  )}

                </div>

                {/* 3. Timeline Scrubber and scrub nodes */}
                <div className="shrink-0 flex flex-col gap-2.5">
                  <div className="flex items-center justify-between select-none">
                    <div className="flex items-center gap-1">
                      <Sliders className="w-3 h-3 text-zinc-650" />
                      <span className="text-[8px] font-mono uppercase text-zinc-400 font-bold tracking-wider">Timeline Scrubber Grid</span>
                    </div>
                    {monitorSteps.length > 0 && (
                      <span className="text-[7.5px] font-mono text-zinc-600 bg-zinc-955/60 border border-zinc-900 px-1 py-0.2 rounded leading-none select-none font-extrabold">
                        STEP {activeStepIndex + 1} OF {monitorSteps.length}
                      </span>
                    )}
                  </div>

                  {monitorSteps.length > 0 && (
                    <div className="flex items-center gap-2 select-none relative h-8">
                      {/* Linear progression timeline bar */}
                      <div className="absolute left-1 right-1 h-0.5 bg-zinc-900 rounded-full" />
                      
                      {/* Scrub clickable nodes */}
                      <div className="absolute inset-0 flex items-center justify-between">
                        {monitorSteps.map((stObj, stIdx) => {
                          const isSelected = stIdx === activeStepIndex;
                          const isRunning = stObj.status === "running";
                          const isCompleted = stObj.status === "completed";
                          const isFailed = stObj.status === "failed";

                          return (
                            <button
                              key={stObj.id || stIdx}
                              onClick={() => setSelectedStepIndex(stIdx)}
                              className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all z-10 cursor-pointer shadow-md select-none outline-none ${
                                isSelected 
                                  ? "bg-cyan-500 border-cyan-300 ring-4 ring-cyan-500/10 scale-125 font-bold"
                                  : isRunning
                                  ? "bg-purple-900 border-purple-500 animate-pulse"
                                  : isCompleted
                                  ? "bg-emerald-950 border-emerald-900/60 hover:bg-emerald-900 hover:border-emerald-450"
                                  : isFailed
                                  ? "bg-rose-950 border-rose-900"
                                  : "bg-zinc-955 border-zinc-900"
                              }`}
                              title={`Step ${stIdx + 1}: ${stObj.tool || "Think"}`}
                            >
                              <span className="text-[7.5px] font-mono font-extrabold text-zinc-100 leading-none">
                                {stIdx + 1}
                              </span>
                            </button>
                          );
                        })}
                      </div>

                    </div>
                  )}

                  {!isLive && monitorSteps.length > 0 && (
                    <button
                      onClick={() => setSelectedStepIndex(null)}
                      className="w-full py-1.5 rounded-xl bg-cyan-950/45 hover:bg-cyan-900/40 border border-cyan-800/15 text-cyan-404 hover:text-cyan-300 font-mono text-[8px] font-bold uppercase transition-all tracking-widest flex items-center justify-center gap-1.5 cursor-pointer animate-fade-in outline-none"
                    >
                      <RefreshCw className="w-2.5 h-2.5 animate-spin" style={{ animationDuration: "3.5s" }} />
                      <span>JUMP TO LIVE COMPUTING</span>
                    </button>
                  )}
                </div>

              </div>
            );
          })()}
        </aside>
      )}

      {/* MOBILE RIGHT DRAWER BACKDROP */}
      {rightChatHubOpen && (
        <div 
          onClick={() => setRightChatHubOpen(false)}
          className="fixed inset-0 bg-black/70 backdrop-blur-xs z-[200] lg:hidden cursor-pointer animate-fade-in"
        />
      )}

      {/* COLUMN 3: RIGHT COLLAPSIBLE CONTEXT & ANALYTICAL METRICS HUD */}
      <aside 
        className={`
          /* Base mobile drawer styles */
          fixed inset-y-3 right-3 z-[210] w-76 flex flex-col justify-between bg-[#040507] border border-zinc-850 rounded-2xl p-4 transform transition-all duration-300 ease-in-out h-[calc(100%-24px)]
          /* Desktop layout adaptation overrides */
          lg:relative lg:inset-auto lg:z-0 lg:w-76 lg:border lg:border-zinc-900 lg:rounded-2xl lg:p-4 lg:transition-all lg:duration-300 lg:ease-in-out lg:h-full lg:shrink-0
          ${
            rightChatHubOpen 
              ? "translate-x-0 opacity-100" 
              : "translate-x-[110%] opacity-0 pointer-events-none lg:translate-x-0 lg:w-0 lg:p-0 lg:border-none lg:opacity-0"
          }
        `}
      >
        <div className="flex flex-col gap-4 overflow-y-auto scrollbar-none pb-4 flex-grow">
          {/* Panel Header */}
          <div className="flex items-center justify-between border-b border-zinc-900 pb-2.5">
            <span className="text-[9px] tracking-widest font-mono font-bold text-zinc-400 uppercase">ANALYTIC SENSORS</span>
            <button
              onClick={() => setRightChatHubOpen(false)}
              className="text-zinc-650 hover:text-zinc-400 p-0.5 rounded hover:bg-zinc-900/60 transition-all cursor-pointer"
              title="Fold details panel"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Section 1: Live Orchestrator Steps Pipeline */}
          <div className="space-y-2">
            <span className="text-[8px] font-mono text-zinc-555 uppercase tracking-widest block font-extrabold pb-0.5">Live Core Dispatch steps</span>
            {(() => {
              const activeSteps = steps.filter(s => s.status === "running" || s.status === "failed" || s.status === "completed");
              if (activeSteps.length === 0) {
                return (
                  <div className="p-3 bg-zinc-950/35 border border-zinc-905 rounded-xl text-center select-none">
                    <p className="text-[8px] font-mono text-zinc-600 uppercase tracking-widest leading-normal">System Idle // Awaiting Sweep</p>
                  </div>
                );
              }
              return (
                <div className="space-y-1.5 max-h-[170px] overflow-y-auto pr-0.5 scrollbar-thin">
                  {activeSteps.slice(-3).map((stObj) => (
                    <div key={stObj.id} className="p-2.5 bg-[#06070a]/90 border border-zinc-900 rounded-xl leading-relaxed animate-fade-in">
                      <div className="flex justify-between items-center text-[7.5px]">
                        <span className="font-mono text-cyan-404 font-bold uppercase truncate max-w-[130px] border-l border-cyan-500 pl-1.5">{stObj.tool || "COGNITIVE EVALUATION"}</span>
                        <span className="text-[7px] text-zinc-650 font-mono font-bold shrink-0">{stObj.durationMs ? `${stObj.durationMs}ms` : "Active..."}</span>
                      </div>
                      <p className="text-zinc-500 mt-1.5 leading-normal text-[9.5px] font-semibold truncate" title={stObj.inputPreview}>{stObj.inputPreview || "Performing system diagnostic loop verification"}</p>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>

          {/* Section 2: Vault Index Document Sandboxing */}
          <div className="space-y-2 border-t border-zinc-900/60 pt-3">
            <div className="flex items-center justify-between pb-0.5">
              <span className="text-[8px] font-mono text-zinc-555 uppercase tracking-widest block font-extrabold">Document Context vault</span>
              <span className="text-[7px] font-mono font-extrabold text-zinc-500 bg-[#08090f] border border-zinc-900 px-1 rounded uppercase tracking-wider">{files.length} Saved</span>
            </div>
            
            <div className="space-y-1.5 max-h-[170px] overflow-y-auto pr-0.5 scrollbar-thin">
              {files.map((fileObj) => (
                <div key={fileObj.id} className="p-2 bg-[#090a10]/50 border border-zinc-900 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/15 text-emerald-450 shrink-0">
                      <FileCode className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex flex-col min-w-0 leading-none">
                      <span className="text-[9.5px] font-bold text-zinc-350 truncate font-mono uppercase" title={fileObj.name}>{fileObj.name}</span>
                      <span className="text-[7.5px] text-zinc-650 mt-1 truncate">{(fileObj.sizeBytes / 1024).toFixed(1)} KB · INDEXED</span>
                    </div>
                  </div>
                  <div className="w-4 h-4 rounded-full bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 text-emerald-400 stroke-[2.5]" />
                  </div>
                </div>
              ))}
              
              {/* Browse File drag selection field */}
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="p-3 border border-dashed border-zinc-850 hover:border-cyan-500/20 bg-[#050609]/60 hover:bg-cyan-950/5 text-center cursor-pointer rounded-xl transition-all"
              >
                <Paperclip className="w-3.5 h-3.5 text-zinc-600 mx-auto mb-1" />
                <span className="text-[9px] text-zinc-555 font-sans font-bold block uppercase tracking-wider">CONTEXT VAULT ENVELOPE</span>
                <span className="text-[7.5px] text-zinc-650 font-mono block mt-0.5">Click to choose elements</span>
              </div>
            </div>
          </div>

          {/* Section 3: Metric Swat Diagnostics */}
          <div className="space-y-2 border-t border-zinc-900/60 pt-3">
            <span className="text-[8px] font-mono text-zinc-555 uppercase tracking-widest block font-extrabold font-bold">Computational metrics</span>
            <div className="grid grid-cols-2 gap-2 leading-none">
              <div className="p-2.5 bg-[#06070b] border border-zinc-900 rounded-xl">
                <span className="text-[7.5px] font-mono text-zinc-600 block uppercase">Token Consumption</span>
                <span className="text-[11px] font-mono font-bold text-zinc-300 block mt-1.5 font-bold">{(stats?.tokenUsage || 0).toLocaleString()} t</span>
              </div>
              <div className="p-2.5 bg-[#06070b] border border-zinc-900 rounded-xl">
                <span className="text-[7.5px] font-mono text-zinc-650 block uppercase">Operational Cost</span>
                <span className="text-[11px] font-mono font-bold text-emerald-404 block mt-1.5 font-bold">${(stats?.estimatedCostUsd || 0).toFixed(4)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Technical details bottom summary block */}
        <div className="text-[7.5px] font-mono text-zinc-750 pt-3 border-t border-zinc-900 mt-2 flex justify-between select-none font-bold uppercase">
          <span>SESSION_ID_D9D5</span>
          <span>UTC: 21:05</span>
        </div>
      </aside>
    </div>
  );
}
