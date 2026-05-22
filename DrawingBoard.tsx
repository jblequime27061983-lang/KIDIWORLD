import React, { useRef, useState, useEffect } from "react";
import { Paintbrush, Eraser, Trash2, CheckCircle, Sparkles } from "lucide-react";

interface DrawingBoardProps {
  onSaveSketch: (imageUrl: string, characterName: string, materials: string) => void;
  savedSketch?: { imageUrl: string; name: string; materials: string };
  suggestedClues: string[];
}

export default function DrawingBoard({ onSaveSketch, savedSketch, suggestedClues }: DrawingBoardProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState("#fbbf24"); // Amber star-whale yellow
  const [brushSize, setBrushSize] = useState(5);
  const [isEraser, setIsEraser] = useState(false);

  // Character metadata
  const [charName, setCharName] = useState(savedSketch?.name || "");
  const [materials, setMaterials] = useState(savedSketch?.materials || "");
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Sticker Stamps state
  const [selectedStamp, setSelectedStamp] = useState<string | null>(null);
  const stamps = ["🐳", "⭐", "🛸", "👨‍🚀", "🤖", "🚀", "🪐", "👾", "✨", "📡", "⚓", "🎨"];

  // Palette colors suited for a neon space-whale adventure
  const palette = [
    "#fbbf24", // Amber Yellow
    "#ef4444", // Ruby Red
    "#ec4899", // Nebula Pink
    "#a855f7", // Deep Cosmic Purple
    "#3b82f6", // Star Blue
    "#10b981", // Emerald Aurora
    "#06b6d4", // Glowing Cyan
    "#ffffff", // Cosmic White
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Get client dimensions
    const rect = canvas.parentElement?.getBoundingClientRect();
    canvas.width = (rect?.width || 500) * 2; // double size for retina/high-DPI
    canvas.height = 360 * 2;
    canvas.style.width = "100%";
    canvas.style.height = "360px";

    const context = canvas.getContext("2d");
    if (!context) return;

    context.scale(2, 2);
    context.lineCap = "round";
    context.lineJoin = "round";
    context.strokeStyle = brushColor;
    context.lineWidth = brushSize;
    contextRef.current = context;

    // Set background to charcoal space grey
    context.fillStyle = "#1e293b";
    context.fillRect(0, 0, canvas.width, canvas.height);

    // If pre-existing sketch, load it
    if (savedSketch?.imageUrl) {
      const img = new Image();
      img.src = savedSketch.imageUrl;
      img.referrerPolicy = "no-referrer";
      img.onload = () => {
        // Clear background
        context.drawImage(img, 0, 0, rect?.width || 500, 360);
      };
    } else {
      // Draw grid or guidance text helper subtly
      context.fillStyle = "rgba(255, 255, 255, 0.05)";
      context.font = "italic 14px Inter, sans-serif";
      context.fillText("Dessine ton costume ou personnage ici...", 20, 35);
    }
  }, []);

  // Sync brush props
  useEffect(() => {
    if (contextRef.current) {
      contextRef.current.strokeStyle = isEraser ? "#1e293b" : brushColor;
      contextRef.current.lineWidth = brushSize;
    }
  }, [brushColor, brushSize, isEraser]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!contextRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    let clientX = 0;
    let clientY = 0;

    if ("touches" in e) {
      if (e.touches.length === 0) return;
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    if (selectedStamp) {
      const ctx = contextRef.current;
      ctx.font = `${brushSize * 2.5 + 24}px system-ui, -apple-system, BlinkMacSystemFont, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(selectedStamp, x, y);
      setIsDrawing(false);
      return;
    }

    contextRef.current.beginPath();
    contextRef.current.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !contextRef.current || !canvasRef.current) return;
    e.preventDefault();

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    let clientX = 0;
    let clientY = 0;

    if ("touches" in e) {
      if (e.touches.length === 0) return;
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    contextRef.current.lineTo(x, y);
    contextRef.current.stroke();
  };

  const stopDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();
    contextRef.current?.closePath();
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = contextRef.current;
    if (!canvas || !context) return;

    context.fillStyle = "#1e293b";
    context.fillRect(0, 0, canvas.width / 2, canvas.height / 2);

    // Restore text helper subtly
    context.fillStyle = "rgba(255, 255, 255, 0.05)";
    context.font = "italic 14px Inter, sans-serif";
    context.fillText("Dessine ton costume ou personnage ici...", 20, 35);
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Convert to image URL
    const imageUrl = canvas.toDataURL("image/png");
    onSaveSketch(imageUrl, charName || "Membre d'Équipage Mystère", materials || "Fibre de néon stellaire");
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-pink-500/10 text-pink-400 rounded-full border border-pink-500/20">
            🎨 Défi Dessin & Costume Design
          </span>
          <h3 className="text-xl font-bold tracking-tight text-white mt-1.5 flex items-center gap-2">
            Styliste de l'Espace <Sparkles className="w-5 h-5 text-amber-400" />
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Les scénaristes décrivent l'équipage, imagine et dessine leur combinaison stellaire bi-luminescente !
          </p>
        </div>

        {/* Display clues suggested for costumes */}
        {suggestedClues.length > 0 && (
          <div className="flex flex-wrap gap-1.5 max-w-sm">
            {suggestedClues.map((clue, idx) => (
              <span
                key={idx}
                className="text-[10px] bg-slate-800 text-slate-300 font-mono px-2 py-0.5 rounded border border-slate-700"
              >
                🔍 {clue}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sketch Controls Panel */}
        <div className="lg:col-span-1 space-y-4">
          {/* Action selection */}
          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono block">Outils de Pinceau</span>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setIsEraser(false);
                  setSelectedStamp(null);
                }}
                className={`flex-1 flex justify-center py-2.5 rounded-xl border transition text-xs font-semibold ${
                  !isEraser && !selectedStamp
                    ? "bg-amber-500 border-amber-400 text-slate-950"
                    : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
                }`}
              >
                <Paintbrush className="w-3.5 h-3.5 mr-1.5" />
                Crayon
              </button>
              <button
                onClick={() => {
                  setIsEraser(true);
                  setSelectedStamp(null);
                }}
                className={`flex-1 flex justify-center py-2.5 rounded-xl border transition text-xs font-semibold ${
                  isEraser && !selectedStamp
                    ? "bg-pink-500 border-pink-400 text-slate-950"
                    : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
                }`}
              >
                <Eraser className="w-3.5 h-3.5 mr-1.5" />
                Gomme
              </button>
            </div>

            {/* Thickness */}
            <div className="space-y-1.5 pt-2 border-t border-slate-800">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-mono">Taille:</span>
                <span className="text-white font-mono">{brushSize}px</span>
              </div>
              <input
                type="range"
                min="2"
                max="30"
                value={brushSize}
                onChange={(e) => setBrushSize(parseInt(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Color palette */}
          {!isEraser && !selectedStamp && (
            <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono block">Palette Magique</span>
              <div className="grid grid-cols-4 gap-2">
                {palette.map((color) => (
                  <button
                    key={color}
                    onClick={() => setBrushColor(color)}
                    style={{ backgroundColor: color }}
                    className={`w-8 h-8 rounded-xl border-2 transition transform active:scale-95 ${
                      brushColor === color ? "border-amber-400 scale-110 shadow-lg" : "border-slate-800 hover:scale-105"
                    }`}
                    title={color}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Sticker Stamps Panel - Dynamic & highly interactive */}
          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono block">Tampons Stellaires</span>
              {selectedStamp && (
                <button
                  type="button"
                  onClick={() => setSelectedStamp(null)}
                  className="text-[9px] text-amber-400 font-mono hover:underline cursor-pointer bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded"
                >
                  Annuler Tampon
                </button>
              )}
            </div>
            <div className="grid grid-cols-4 gap-2">
              {stamps.map((stamp) => (
                <button
                  key={stamp}
                  type="button"
                  onClick={() => {
                    setSelectedStamp(stamp);
                    setIsEraser(false);
                  }}
                  className={`w-8 h-8 rounded-xl text-lg flex items-center justify-center border transition transform active:scale-95 cursor-pointer ${
                    selectedStamp === stamp
                      ? "bg-amber-550 border-amber-400 scale-110 shadow-lg text-white"
                      : "bg-slate-900 border-slate-800 hover:bg-slate-800 hover:scale-105 text-slate-200"
                  }`}
                  title={`Tampon stellaire : ${stamp}`}
                >
                  {stamp}
                </button>
              ))}
            </div>
            <p className="text-[9px] text-slate-500 leading-relaxed pt-1">
              {selectedStamp 
                ? `Mode actif : clique n'importe où sur la toile pour coller le sticker "${selectedStamp}" ! Ajuste sa taille avec la jauge ci-dessus.` 
                : "Choisis un émoji ci-dessus pour le coller sur ton œuvre !"}
            </p>
          </div>

          {/* Clear Canvas */}
          <button
            onClick={clearCanvas}
            className="w-full flex items-center justify-center p-3 text-xs text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-2xl transition"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Effacer tout le dessin
          </button>
        </div>

        {/* The Digital Canvas Container */}
        <div className="lg:col-span-2 flex flex-col items-stretch">
          <div className="relative border-4 border-slate-800 bg-slate-900 rounded-2xl overflow-hidden cursor-crosshair">
            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="block"
            />
            {/* Soft grid watermark overlays to add custom aesthetic tech atmosphere */}
            <div className="absolute top-4 right-4 text-xs font-mono text-slate-600 select-none pointer-events-none">
              GRID: KIDI-ART v1
            </div>
          </div>
        </div>

        {/* Description / Story Details Input */}
        <div className="lg:col-span-1 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono block">Fiche Costume</span>
              
              <div className="space-y-1">
                <label className="text-xs text-slate-300 font-semibold block">Nom du Personnage</label>
                <input
                  type="text"
                  placeholder="Ex : Capitaine Cosmos"
                  value={charName}
                  onChange={(e) => setCharName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500 text-sm text-white px-3 py-2 rounded-xl focus:outline-none transition"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-300 font-semibold block">Tissus & Éléments du costume</label>
                <textarea
                  placeholder="Ex : Fibre bi-luminescente, casque en quartz stellaire, bottes magnétiques..."
                  value={materials}
                  rows={3}
                  onChange={(e) => setMaterials(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500 text-xs text-white px-3 py-2 rounded-xl focus:outline-none transition resize-none"
                />
              </div>
            </div>

            <div className="bg-slate-950/50 p-3.5 rounded-2xl border border-slate-900 text-[11px] text-slate-400 leading-relaxed font-mono">
              💡 <strong>Astuce de Pro :</strong> Un bon costume raconte l'histoire du personnage. Si ton astronaute vient de la planète d'eau, prévois des ouïes artificielles translucides !
            </div>
          </div>

          <button
            onClick={handleSave}
            className={`w-full flex items-center justify-center py-3.5 px-4 font-bold rounded-2xl transition shadow-lg ${
              savedSuccess
                ? "bg-emerald-500 text-white"
                : "bg-amber-500 hover:bg-amber-400 text-slate-950 hover:shadow-amber-500/25 active:scale-95"
            }`}
          >
            {savedSuccess ? (
              <>
                <CheckCircle className="w-5 h-5 mr-2 animate-bounce" />
                Costume Sauvegardé !
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Enregistrer le Costume
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
