import { useState } from "react";
import { useApp } from "../AppContext";
import ReactMarkdown from "react-markdown";
import { ListFilter, Copy, Share2, CornerDownLeft, Eye, Download, Archive, Landmark } from "lucide-react";
import { downloadOutputItem, downloadOutputsAsZip } from "../utils/fileExporter";

export default function OutputStudio() {
  const { outputs } = useApp();
  const [selectedOutputId, setSelectedOutputId] = useState<string | null>(null);
  const [outputFilter, setOutputFilter] = useState<string>("All");

  const filtered = outputs.filter(ot => 
    outputFilter === "All" || ot.kind === outputFilter
  );

  const activeOutput = outputs.find(o => o.id === (selectedOutputId || (filtered[0]?.id)));

  const handleCopy = () => {
    if (activeOutput) {
      navigator.clipboard.writeText(activeOutput.contentInline);
      alert("Executive report copied to system clipboard.");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-full select-none animate-fade-in font-sans">
      {/* SIDE OUTPUTS GALLERY LIST */}
      <div className="w-full lg:w-72 flex flex-col gap-3">
        <div className="flex items-center justify-between border-b border-white/10 pb-1">
          <div className="text-[10px] font-sans uppercase tracking-[0.2em] text-[#a3a3a3] font-bold flex items-center gap-1.5">
            <ListFilter className="w-3.5 h-3.5" /> Output archives
          </div>
          {outputs.length > 0 && (
            <button
              onClick={() => downloadOutputsAsZip(outputs, "neva_all_outputs.zip")}
              className="px-2 py-0.5 border border-cyan-500/20 bg-cyan-950/10 text-cyan-400 text-[8px] font-mono rounded hover:bg-cyan-500/20 transition-all cursor-pointer flex items-center gap-1 uppercase"
              title="Download all outputs as a ZIP file"
            >
              <Download className="w-2.5 h-2.5" />
              ZIP ALL
            </button>
          )}
        </div>

        {/* CLASSIFICATION TABS */}
        <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-thin">
          {["All", "report", "diagram", "markdown"].map(kind => (
            <button
              key={kind}
              onClick={() => setOutputFilter(kind)}
              className={`px-2 py-0.5 rounded-none text-[8px] tracking-widest font-mono border transition-colors uppercase ${
                outputFilter === kind 
                  ? "border-white/40 text-white bg-white/10" 
                  : "border-white/5 text-[#737373] hover:text-white"
              }`}
            >
              {kind}
            </button>
          ))}
        </div>

        {/* GALLERY THUMBNAILS */}
        <div className="space-y-2 overflow-y-auto max-h-[350px] scrollbar-thin">
          {filtered.map(ot => {
            const isSelected = activeOutput?.id === ot.id;
            return (
              <div
                key={ot.id}
                onClick={() => setSelectedOutputId(ot.id)}
                className={`p-3 rounded-none border transition-all cursor-pointer ${
                  isSelected 
                    ? "border-white/40 bg-white/5" 
                    : "border-white/10 bg-[#121212]/40 hover:bg-[#121212]"
                }`}
              >
                <div className="flex justify-between items-center text-[8px] font-mono opacity-50 uppercase tracking-widest">
                  <span>{ot.kind}</span>
                  <span>{new Date(ot.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="font-serif italic font-bold text-white text-xs truncate mt-1">{ot.title}</div>
                <p className="text-[10px] text-[#a3a3a3] mt-1 leading-snug line-clamp-2 font-body">{ot.contentInline.slice(0, 80)}...</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* RENDER VIEW CARD */}
      <div className="flex-1 border border-white/10 rounded-none bg-[#121212] p-5 flex flex-col justify-between h-[450px]">
        {activeOutput ? (
          <>
            <div className="flex justify-between items-center border-b border-white/10 pb-3 flex-wrap gap-2">
              <div>
                <span className="text-[8px] tracking-[0.2em] font-sans text-cyan-400 uppercase block mb-1 font-bold">PREVIEW WRITER ACTIVE</span>
                <h3 className="font-bold text-sm text-white font-serif italic">{activeOutput.title}</h3>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <button 
                  onClick={handleCopy}
                  className="p-1 px-2.5 border border-white/10 bg-transparent text-[8.5px] font-mono hover:bg-white/5 text-zinc-350 hover:text-white flex items-center gap-1 transition-colors uppercase cursor-pointer"
                  title="Copy Raw Markdown contents to clipboard"
                >
                  <Copy className="w-2.5 h-2.5 text-zinc-400" /> Copy
                </button>
                <div className="h-4 w-[1px] bg-white/10 mx-0.5"></div>
                <button 
                  onClick={() => downloadOutputItem(activeOutput, "md")}
                  className="p-1 px-2 border border-zinc-800 bg-zinc-950 text-[8.5px] font-mono text-cyan-400 hover:text-cyan-300 hover:bg-zinc-900 flex items-center gap-1 transition-colors uppercase cursor-pointer"
                  title="Download as markdown file"
                >
                  <Download className="w-2.5 h-2.5" /> .MD
                </button>
                <button 
                  onClick={() => downloadOutputItem(activeOutput, "txt")}
                  className="p-1 px-2 border border-zinc-800 bg-zinc-950 text-[8.5px] font-mono text-cyan-400 hover:text-cyan-300 hover:bg-zinc-900 flex items-center gap-1 transition-colors uppercase cursor-pointer"
                  title="Download as clean text file"
                >
                  <Download className="w-2.5 h-2.5" /> .TXT
                </button>
                <button 
                  onClick={() => downloadOutputItem(activeOutput, "json")}
                  className="p-1 px-2 border border-zinc-800 bg-zinc-950 text-[8.5px] font-mono text-cyan-400 hover:text-cyan-300 hover:bg-zinc-900 flex items-center gap-1 transition-colors uppercase cursor-pointer"
                  title="Download raw dataset JSON metadata"
                >
                  <Download className="w-2.5 h-2.5" /> .JSON
                </button>

                <button 
                  onClick={async () => {
                    await downloadOutputsAsZip([activeOutput], `${activeOutput.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.zip`);
                  }}
                  className="p-1 px-2 border border-cyan-500/30 bg-cyan-950/20 text-[8.5px] font-mono text-emerald-400 hover:text-emerald-300 hover:bg-cyan-900/40 flex items-center gap-1 transition-colors uppercase cursor-pointer"
                  title="Download this single file zipped"
                >
                  <Archive className="w-2.5 h-2.5" /> .ZIP
                </button>
              </div>
            </div>

            {/* EMBED RENDERING SPACE */}
            <div className="flex-1 overflow-y-auto my-3 p-4 bg-[#0d0d0d]/80 border border-white/5 rounded-none text-xs leading-relaxed text-[#d4d4d4] scrollbar-thin">
              <div className="markdown-body">
                <ReactMarkdown>{activeOutput.contentInline}</ReactMarkdown>
              </div>
            </div>

            {/* FOOTER */}
            <div className="border-t border-white/5 pt-2 flex items-center justify-between text-[8px] font-mono text-[#737373] tracking-widest">
              <span>COMPILED INTEGRATION RECORD</span>
              <span className="text-white opacity-40">TAG CODE: 3pa8</span>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center py-20">
            <div className="w-10 h-[1px] bg-white/25 mb-3"></div>
            <span className="text-[10px] text-neutral-400 font-sans tracking-wide uppercase">NO VERIFIED GENERATED OUTPUTS</span>
          </div>
        )}
      </div>
    </div>
  );
}
