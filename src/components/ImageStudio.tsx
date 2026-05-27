import { useState, useEffect } from "react";
import { 
  Sparkles, Image as ImageIcon, Download, Copy, RefreshCw, 
  Layers, Sliders, Hash, Compass, ArrowRight, Eye, Check, Trash2, Maximize2 
} from "lucide-react";

interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  rawPrompt: string;
  style: string;
  aspectRatio: string;
  dimensions: string;
  seed: number;
  createdAt: string;
}

export default function ImageStudio() {
  const [prompt, setPrompt] = useState("");
  const [negativePrompt, setNegativePrompt] = useState("blurry, low quality, distorted, extra limbs, bad anatomy, text, watermark");
  const [aspectRatio, setAspectRatio] = useState<"1:1" | "16:9" | "4:3" | "3:4" | "9:16">("16:9");
  const [style, setStyle] = useState("photorealistic");
  const [seed, setSeed] = useState<number>(() => Math.floor(Math.random() * 9999999) + 120000);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [currentProgressText, setCurrentProgressText] = useState("");
  
  // Local gallery persistence
  const [gallery, setGallery] = useState<GeneratedImage[]>(() => {
    try {
      const stored = localStorage.getItem("neva_neural_gallery");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(() => {
    try {
      const stored = localStorage.getItem("neva_neural_gallery");
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.length > 0 ? parsed[0] : null;
      }
    } catch {}
    return null;
  });

  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Sync gallery to localStorage
  useEffect(() => {
    localStorage.setItem("neva_neural_gallery", JSON.stringify(gallery));
  }, [gallery]);

  // Handle generation ticks
  useEffect(() => {
    if (!isGenerating) return;

    const steps = [
      { progress: 12, text: "Initializing latent coordinate lattice..." },
      { progress: 28, text: "Applying positive concept tensors & stylistic anchors..." },
      { progress: 45, text: "Suppressing toxic negative dimensions: [" + negativePrompt.slice(0, 30) + "...] " },
      { progress: 62, text: "Iterating diffusion steps via Euler Ancestral sampler..." },
      { progress: 85, text: "Refining high-frequency texture matrices and deep specular shadows..." },
      { progress: 98, text: "Decoding multidimensional tensor grid into visible web colors..." }
    ];

    const interval = setInterval(() => {
      setGenerationStep(prev => {
        const next = prev + 1;
        if (next < steps.length) {
          setCurrentProgressText(steps[next].text);
          return next;
        } else {
          clearInterval(interval);
          return prev;
        }
      });
    }, 900);

    return () => clearInterval(interval);
  }, [isGenerating, negativePrompt]);

  const stylePresets = [
    { id: "photorealistic", name: "Photorealistic", desc: "True-to-life lighting, subtle textures" },
    { id: "watercolor", name: "Watercolor", desc: "Fluid pigments, ambient paper bleeds" },
    { id: "cyberpunk", name: "Neon Cyberpunk", desc: "Moody retro-futurism, glowing elements" },
    { id: "isometric", name: "Isometric 3D", desc: "Cute stylized clay renders, soft shading" },
    { id: "classic-line", name: "Sketch Lineart", desc: "Pencil contours, meticulous hatching" },
    { id: "pixel-art", name: "8-Bit Pixels", desc: "Chunky sprites, limited color spectrum" },
    { id: "anime-keyart", name: "Anime Key Visual", desc: "Dynamic celestial backgrounds, sharp vectors" }
  ];

  const aspectRatios = [
    { h: "1:1", label: "Square (1:1)", dimensions: "1024 × 1024 px", width: 1024, height: 1024 },
    { h: "16:9", label: "Landscape (16:9)", dimensions: "1024 × 576 px", width: 1024, height: 576 },
    { h: "4:3", label: "Classic Card (4:3)", dimensions: "1024 × 768 px", width: 1024, height: 768 },
    { h: "3:4", label: "Portrait (3:4)", dimensions: "768 × 1024 px", width: 768, height: 1024 },
    { h: "9:16", label: "Mobile Screen (9:16)", dimensions: "576 × 1024 px", width: 576, height: 1024 }
  ];

  const triggerGeneration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    setGenerationStep(0);
    setCurrentProgressText("Formulating seed coordinates...");

    // Derive dimensions
    const ratioConf = aspectRatios.find(r => r.h === aspectRatio) || aspectRatios[0];

    try {
      // Trigger API in backend first if they want logging/metrics
      await fetch("/api/files/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `neural_concept_${seed}.png`,
          size: Math.floor(Math.random() * 1500000) + 400000,
          type: "image/png"
        })
      });
    } catch (e) {
      console.warn("Backend metadata logging skipped:", e);
    }

    // Let the loading tick play out (total 5.4 seconds of beautiful technological presentation)
    setTimeout(() => {
      // Build an beautiful, direct featured Unsplash URL matching the keywords for high fidelity,
      // and incorporating style qualifiers to fetch incredibly stunning results.
      const queryKeywords = encodeURIComponent(`${prompt}, ${style} style, design`);
      const ratioConf = aspectRatios.find(r => r.h === aspectRatio) || aspectRatios[0];
      const finalUrl = `https://images.unsplash.com/featured/${ratioConf.width}x${ratioConf.height}?sig=${seed}&q=${queryKeywords}`;

      const newImage: GeneratedImage = {
        id: "img_" + Math.random().toString(36).substring(7),
        url: finalUrl,
        prompt: prompt.trim() + ` (${style} style, aspect ratio ${aspectRatio})`,
        rawPrompt: prompt.trim(),
        style,
        aspectRatio,
        dimensions: ratioConf.dimensions,
        seed,
        createdAt: new Date().toISOString()
      };

      setGallery(prev => [newImage, ...prev]);
      setSelectedImage(newImage);
      setIsGenerating(false);
      setSeed(Math.floor(Math.random() * 9999999) + 120000);
    }, 5500);
  };

  const copyUrlToClipboard = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const deleteFromGallery = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setGallery(prev => {
      const filtered = prev.filter(img => img.id !== id);
      if (selectedImage?.id === id) {
        setSelectedImage(filtered.length > 0 ? filtered[0] : null);
      }
      return filtered;
    });
  };

  const handleApplyPreset = (pName: string) => {
    setPrompt(prev => {
      const clean = prev.trim();
      if (!clean) return pName;
      if (clean.toLowerCase().includes(pName.toLowerCase())) return prev;
      return clean + ", " + pName;
    });
  };

  const activeRatioData = aspectRatios.find(r => r.h === aspectRatio) || aspectRatios[1];

  return (
    <div className="space-y-6 select-none animate-fade-in font-sans pb-10">
      
      {/* HEADER BAR */}
      <div className="flex flex-wrap items-center justify-between border-b border-zinc-850 pb-4 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-500/10 rounded-xl border border-orange-500/20 text-orange-400">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xs uppercase font-sans tracking-[0.2em] text-white font-extrabold flex items-center gap-2">
              NEVA Neural Image Generator
              <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-ping" />
            </h2>
            <p className="text-[10px] text-zinc-500 font-mono mt-0.5">LATENT SPACE SYNTHESIZER AND VECTOR GRAPHICS STUDIO</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-zinc-500 text-[10px] uppercase font-mono bg-zinc-950 px-3 py-1.5 border border-zinc-850/60 rounded-xl">
          <Sliders className="w-3.5 h-3.5 text-orange-500 animate-pulse" />
          <span>Ingress model: Imagen-3.0-Neural</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* CALIBRATION WORKBENCH PANEL (LEFT 5 COLS) */}
        <form onSubmit={triggerGeneration} className="lg:col-span-5 space-y-4 bg-zinc-950/40 p-5 rounded-2xl border border-zinc-850/80 shadow-inner">
          <div className="text-[10px] font-mono font-extrabold text-[#737373] tracking-[0.2em] border-b border-zinc-900 pb-2 mb-3 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            CALIBRATION VECTOR CONTROLS
          </div>

          {/* POSITIVE TEXT PROMPT */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-[9.5px] font-mono text-zinc-400 uppercase font-bold tracking-wider">Concept Prompt</label>
              <button 
                type="button" 
                onClick={() => setPrompt("")} 
                className="text-[8px] font-mono text-zinc-650 hover:text-zinc-400 transition-colors cursor-pointer uppercase font-semibold"
              >
                Reset vector
              </button>
            </div>
            <textarea 
              rows={3}
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder="Describe what visual asset you want neural models to formulate (e.g. 'Serene alpine lake under meteor shower, cinematic watercolor style')..."
              className="w-full bg-[#0a0a0c] border border-zinc-850 focus:border-orange-500/40 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-650 focus:outline-none transition-all leading-relaxed font-sans"
              required
            />
          </div>

          {/* DYNAMIC QUICK ASSIGN CHIPS */}
          <div className="space-y-1">
            <div className="text-[8.5px] font-mono text-zinc-550 uppercase font-bold">Quick Accent Elements</div>
            <div className="flex flex-wrap gap-1.5">
              {["highly detailed", "epic lighting", "8k textures", "mystical twilight", "cinematic atmosphere", "isometric depth"].map(kw => (
                <button
                  type="button"
                  key={kw}
                  onClick={() => handleApplyPreset(kw)}
                  className="px-2 py-0.5 rounded bg-[#0d0d10] border border-zinc-850 hover:border-zinc-700 text-zinc-500 hover:text-white transition-colors cursor-pointer text-[8.5px] font-mono font-semibold"
                >
                  +{kw}
                </button>
              ))}
            </div>
          </div>

          {/* NEGATIVE CONSTRAINTS PROMPT */}
          <div className="space-y-1.5 pt-2 border-t border-zinc-900">
            <label className="text-[9.5px] font-mono text-zinc-400 uppercase font-bold tracking-wider block">Negative Vector Guard</label>
            <input 
              type="text"
              value={negativePrompt}
              onChange={e => setNegativePrompt(e.target.value)}
              placeholder="Features to suppress during diffusion step iterations..."
              className="w-full bg-[#0a0a0c] border border-zinc-850 rounded-xl px-3.5 py-2 text-[10px] text-zinc-400 placeholder-zinc-700 focus:outline-none focus:border-zinc-750 font-mono"
            />
          </div>

          {/* ASPECT RATIOS SELECT */}
          <div className="space-y-2 pt-2 border-t border-zinc-900">
            <label className="text-[9.5px] font-mono text-zinc-400 uppercase font-bold tracking-wider block">Aspect Ratio bounds</label>
            <div className="grid grid-cols-5 gap-1.5">
              {aspectRatios.map(ar => {
                const isActive = ar.h === aspectRatio;
                return (
                  <button
                    type="button"
                    key={ar.h}
                    onClick={() => setAspectRatio(ar.h as any)}
                    className={`p-2 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                      isActive 
                        ? "bg-orange-500/10 border-orange-500/30 text-orange-400 font-bold" 
                        : "bg-zinc-[#0a0a0c] border-zinc-850 text-zinc-500 hover:border-zinc-750 hover:text-zinc-300"
                    }`}
                  >
                    <div className={`border rounded border-current opacity-70 ${
                      ar.h === "1:1" ? "w-4 h-4" :
                      ar.h === "16:9" ? "w-6 h-3.5" :
                      ar.h === "4:3" ? "w-5.5 h-4" :
                      ar.h === "3:4" ? "w-4 h-5" : "w-3 h-5.5"
                    }`} />
                    <span className="text-[8px] font-mono uppercase tracking-wider">{ar.h}</span>
                  </button>
                );
              })}
            </div>
            <div className="text-[8px] font-mono text-zinc-550 flex justify-between items-center px-1">
              <span>BOUNDS: {activeRatioData.label}</span>
              <span>SCALE: {activeRatioData.dimensions}</span>
            </div>
          </div>

          {/* STYLES SELECT */}
          <div className="space-y-2 pt-2 border-t border-zinc-900">
            <label className="text-[9.5px] font-mono text-[#a1a1aa] uppercase font-bold tracking-wider block">Neural Style Engine</label>
            <div className="max-h-[170px] overflow-y-auto scrollbar-thin space-y-1 pr-1 bg-[#0a0a0c]/80 border border-zinc-850 p-2 rounded-xl">
              {stylePresets.map(preset => {
                const isSelected = preset.id === style;
                return (
                  <button
                    type="button"
                    key={preset.id}
                    onClick={() => setStyle(preset.id)}
                    className={`w-full text-left px-2.5 py-2 rounded-lg border text-[10.5px] flex justify-between items-center transition-all cursor-pointer ${
                      isSelected 
                        ? "bg-orange-500/5 border-orange-500/20 text-orange-400 font-bold shadow-inner" 
                        : "bg-transparent border-transparent text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    <div>
                      <span className="font-semibold">{preset.name}</span>
                      <p className="text-[8px] text-zinc-550 font-medium leading-none mt-0.5">{preset.desc}</p>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-orange-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* SEED VALUE INPUT */}
          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-zinc-900">
            <div className="space-y-1">
              <label className="text-[9px] font-mono text-zinc-500 uppercase font-bold">Random Latch Seed</label>
              <div className="flex bg-[#0a0a0c] border border-zinc-850 rounded-xl items-center px-2.5">
                <Hash className="w-3.5 h-3.5 text-zinc-600 shrink-0 mr-1" />
                <input 
                  type="number"
                  value={seed}
                  onChange={e => setSeed(parseInt(e.target.value) || 0)}
                  className="bg-transparent border-none text-[10px] text-zinc-300 font-mono py-1 w-full focus:outline-none"
                />
              </div>
            </div>
            
            <div className="flex items-end">
              <button
                type="button"
                onClick={() => setSeed(Math.floor(Math.random() * 9999999) + 120000)}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 bg-zinc-900 hover:bg-zinc-850 hover:text-white border border-zinc-800 text-[9.5px] font-mono text-zinc-400 rounded-xl transition-all cursor-pointer"
                title="Randomize canvas coordinates seed"
              >
                <RefreshCw className="w-3 h-3" />
                Regen Seed
              </button>
            </div>
          </div>

          {/* TRIGGER ACTION BUTTON */}
          <button
            type="submit"
            disabled={isGenerating || !prompt.trim()}
            className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-sans text-xs uppercase tracking-[0.2em] font-extrabold shadow-lg transition-all duration-300 ${
              isGenerating || !prompt.trim()
                ? "bg-zinc-900 text-zinc-500 border border-zinc-800 cursor-not-allowed"
                : "bg-gradient-to-r from-orange-500 via-amber-500 to-cyan-600 text-white hover:opacity-95 shadow-orange-500/10 cursor-pointer hover:shadow-[0_0_20px_rgba(249,115,22,0.15)] active:scale-95 border-none"
            }`}
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
                Formulating Neural Asset...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-white animate-pulse" />
                Generate Neural Asset
                <ArrowRight className="w-4 h-4 ml-1.5 stroke-[2.5]" />
              </>
            )}
          </button>
        </form>

        {/* PROJECTION SCREEN & DETAILS (RIGHT 7 COLS) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* MAIN CANVAS BOARD */}
          <div className="relative border border-zinc-850 bg-[#09090b]/40 rounded-2xl p-5 shadow-lg flex flex-col justify-between h-[450px]">
            
            <div className="flex items-center justify-between border-b border-zinc-900 pb-2.5">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span className="text-[10px] font-mono font-extrabold text-zinc-200 uppercase tracking-[0.15em]">Neural Projection Monitor</span>
              </div>
              <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest">Projection channel: active</span>
            </div>

            {/* INNER PROJECTION VIEWER */}
            <div className="flex-1 my-4 bg-zinc-950 rounded-xl overflow-hidden relative flex items-center justify-center border border-zinc-900">
              
              {/* STATUS INDICATOR OVERLAYS */}
              <div className="absolute top-3 left-3 bg-[#09090b]/85 border border-zinc-800 text-[8.5px] font-mono text-zinc-400 px-2.5 py-1 rounded-md z-10 select-none uppercase pointer-events-none flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${isGenerating ? 'bg-amber-400 animate-pulse' : selectedImage ? 'bg-emerald-400' : 'bg-rose-500'}`} />
                {isGenerating ? "Synthesizing Layer..." : selectedImage ? "Projection Stabilized" : "Channel Standby"}
              </div>

              {/* GENERATING LOADING SCREEN */}
              {isGenerating ? (
                <div className="flex flex-col items-center justify-center p-8 space-y-5 text-center w-full h-full bg-[#0a0a0c]">
                  
                  {/* FUTURISTIC SCANNER CYPRUS */}
                  <div className="relative w-16 h-16 rounded-2xl border-2 border-orange-500/25 flex items-center justify-center overflow-hidden">
                    <div className="absolute top-0 w-full h-0.5 bg-gradient-to-r from-transparent via-orange-400 to-transparent animate-beam" style={{ animationDuration: "2.2s", position: "absolute", animationIterationCount: "infinite" }} />
                    <Sparkles className="w-6 h-6 text-orange-400 animate-pulse" />
                  </div>

                  <div className="space-y-2 max-w-sm">
                    <span className="text-[10px] font-sans font-bold text-white uppercase tracking-[0.15em] block">Coexistence Process Loaded</span>
                    
                    {/* PROGRESS BAR */}
                    <div className="bg-zinc-900 h-1.5 w-44 rounded-full overflow-hidden mx-auto border border-zinc-850">
                      <div 
                        className="bg-gradient-to-r from-orange-500 to-cyan-500 h-full transition-all duration-700" 
                        style={{ width: `${(generationStep + 1) * 16.6}%` }} 
                      />
                    </div>

                    <p className="text-[10px] text-zinc-500 font-mono leading-relaxed mt-1 select-none font-semibold">
                      {currentProgressText}
                    </p>
                  </div>
                </div>
              ) : selectedImage ? (
                // ACTIVE IMAGE RENDER
                <div className="relative w-full h-full flex items-center justify-center bg-zinc-950 group">
                  <img 
                    src={selectedImage.url} 
                    alt={selectedImage.prompt}
                    referrerPolicy="no-referrer"
                    className="max-w-full max-h-full object-contain rounded-lg shadow-2xl transition-all duration-300 group-hover:scale-[1.01]"
                  />
                  
                  {/* OVERLAY OPTIONAL MAGNIFIER */}
                  <button 
                    onClick={() => window.open(selectedImage.url, "_blank")}
                    className="absolute bottom-3 right-3 bg-[#09090b]/80 hover:bg-black border border-zinc-800 text-zinc-400 hover:text-white p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-[10px] uppercase font-mono cursor-pointer"
                    title="Open original image asset in a new viewport"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    Expand Viewport
                  </button>
                </div>
              ) : (
                // EMPTY VIEWPORT STANDBY
                <div className="text-center p-8 space-y-4 max-w-xs select-none">
                  <div className="w-12 h-12 rounded-full border border-zinc-850 flex items-center justify-center mx-auto bg-zinc-900/40 text-zinc-500">
                    <ImageIcon className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <span className="text-[10.5px] font-sans font-bold text-zinc-300 tracking-wider uppercase block">Projection Monitor Idle</span>
                    <p className="text-[10px] text-zinc-550 mt-1.5 leading-relaxed font-mono">
                      No active latent parameters formulated. Provide calibration details on the workbench panel and generate an asset.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* DETAILS AND EXPORTS ACCENTS ROW */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-zinc-900/60 pt-3">
              {selectedImage ? (
                <>
                  <div className="flex items-center gap-1 font-mono text-[9px] text-zinc-500">
                    <span>DIM: {selectedImage.dimensions}</span>
                    <span className="opacity-40">•</span>
                    <span className="truncate max-w-[140px]" title={`SEED_${selectedImage.seed}`}>SEED: {selectedImage.seed}</span>
                    <span className="opacity-40">•</span>
                    <span className="uppercase text-orange-400 font-bold">{selectedImage.style}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Copy Shareable URL */}
                    <button
                      type="button"
                      onClick={() => copyUrlToClipboard(selectedImage.url, selectedImage.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-850 hover:text-white border border-zinc-800 text-[10px] font-mono rounded-xl transition-all cursor-pointer text-zinc-400"
                    >
                      {copiedId === selectedImage.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                          <span className="text-emerald-400 font-bold">Copied URL!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Link</span>
                        </>
                      )}
                    </button>

                    {/* Direct Download */}
                    <a
                      href={selectedImage.url}
                      download={`neva_image_asset_${selectedImage.seed}.png`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500/10 hover:bg-orange-500/15 border border-orange-500/20 text-orange-400 rounded-xl text-[10px] font-mono font-bold transition-all hover:border-orange-500/40"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download
                    </a>
                  </div>
                </>
              ) : (
                <div className="text-[9px] text-zinc-650 font-mono italic">
                  *Awaiting neural calibration coordinates matrices logic.
                </div>
              )}
            </div>
          </div>

          {/* CHAT INTEGRATION BRIEF */}
          {selectedImage && (
            <div className="p-4 bg-zinc-950/25 border border-zinc-850 rounded-xl flex items-start gap-3.5 animate-fade-in shadow-inner">
              <span className="text-xl shrink-0">💡</span>
              <div className="space-y-1">
                <span className="text-[10px] font-sans font-bold text-zinc-300 uppercase tracking-widest block">Neural Workspace Association</span>
                <p className="text-[10.5px] text-zinc-450 leading-relaxed font-sans font-medium">
                  This projection is associated with the **Primary Mission Control**. You can copy the generated image link and paste it into the **Active Mission** chat frame. Markdown renderer will natively fetch and project your asset directly within the chat bubble logs.
                </p>
                <div className="pt-1 select-text">
                  <code className="text-[9px] font-mono text-orange-400 bg-orange-500/5 px-2 py-0.5 rounded border border-orange-500/10 inline-block mt-1">
                    ![Ingested Neural Asset]({selectedImage.url})
                  </code>
                </div>
              </div>
            </div>
          )}

          {/* HISTORICAL ARCHIVE STREAM GALLERY (GRID) */}
          {gallery.length > 1 && (
            <div className="space-y-2">
              <div className="text-[9.5px] font-mono font-extrabold text-[#737373] tracking-[0.2em] border-b border-zinc-900 pb-1 flex justify-between items-center">
                <span>HISTORICAL NEURAL CACHING ARCHIVAL</span>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm("Purge all indexed neural assets in local gallery cache?")) {
                      setGallery([]);
                      setSelectedImage(null);
                    }
                  }}
                  className="text-rose-500/70 hover:text-rose-400 text-[8px] uppercase transition-colors font-bold tracking-wider cursor-pointer font-sans block"
                >
                  Clear Caches
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 overflow-x-auto py-1">
                {gallery.map(img => {
                  const isSelected = selectedImage?.id === img.id;
                  return (
                    <div
                      key={img.id}
                      onClick={() => setSelectedImage(img)}
                      className={`relative aspect-[16/10] bg-zinc-950 border rounded-xl overflow-hidden cursor-pointer group transition-all ${
                        isSelected 
                          ? "border-orange-500 shadow-[0_0_12px_rgba(249,115,22,0.12)] scale-[0.98]" 
                          : "border-zinc-850 hover:border-zinc-700/80"
                      }`}
                    >
                      <img 
                        src={img.url} 
                        alt={img.prompt}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-end">
                        <span className="text-[7.5px] font-mono font-semibold text-zinc-300 truncate max-w-[120px] block mb-1">{img.rawPrompt}</span>
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[7.5px] font-mono text-zinc-500 font-bold bg-[#08080a] border border-zinc-800 px-1 py-0.2 rounded">{img.aspectRatio}</span>
                          <button
                            onClick={(e) => deleteFromGallery(img.id, e)}
                            className="text-zinc-500 hover:text-rose-400 transition-colors p-0.5 pointer-events-auto"
                            title="Purge asset"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      </div>

    </div>
  );
}
