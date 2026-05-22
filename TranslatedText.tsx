import React, { useState, useEffect } from "react";
import { Globe, Languages, FlipHorizontal, HelpCircle } from "lucide-react";

interface TranslatedTextProps {
  text: string;
  targetLang: "fr" | "en" | "es" | "ja";
  className?: string;
  isParagraph?: boolean;
}

export default function TranslatedText({ text, targetLang, className = "", isParagraph = false }: TranslatedTextProps) {
  const [translated, setTranslated] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [showOriginal, setShowOriginal] = useState(false);

  // Keep track of the last rendered text and target language to avoid loops
  const [lastText, setLastText] = useState("");
  const [lastLang, setLastLang] = useState("");

  const handleTranslate = async () => {
    if (!text.trim()) return;
    if (targetLang === "fr" && !text.startsWith("[") && !text.includes("Translated")) {
      // If target is French and original text seems to be French, skip translation logic and restore
      setTranslated(text);
      return;
    }

    setLoading(true);
    setError(false);
    try {
      const response = await fetch("/api/gemini/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, targetLang }),
      });

      if (!response.ok) throw new Error("Translation failed");
      const data = await response.json();
      setTranslated(data.translatedText);
    } catch (err) {
      console.error(err);
      setError(true);
      setTranslated(text); // Fallback to original
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch if either text or language actually changed
    if (text !== lastText || targetLang !== lastLang) {
      setLastText(text);
      setLastLang(targetLang);
      
      if (targetLang === "fr") {
        setTranslated(text);
      } else {
        handleTranslate();
      }
    }
  }, [text, targetLang]);

  // Handle manual force-refresh or retry
  const forceRetry = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleTranslate();
  };

  const displayText = showOriginal ? text : (translated || text);

  if (isParagraph) {
    return (
      <div className={`group/trans relative ${className}`}>
        <div className="whitespace-pre-line leading-relaxed transition-all duration-300">
          {loading ? (
            <span className="inline-flex gap-1 items-center text-slate-500 italic">
              <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              Traduction en cours...
            </span>
          ) : (
            displayText
          )}
        </div>

        {/* Tiny translate helper controls available on hover or inline to empower users */}
        <div className="absolute -top-6 right-0 opacity-0 group-hover/trans:opacity-100 transition-opacity bg-slate-950/90 text-[10px] text-slate-300 px-2 py-0.5 rounded-md border border-slate-800 flex items-center gap-1.5 z-10 pointer-events-auto">
          <Languages className="w-3 h-3 text-amber-500" />
          <button
            onClick={() => setShowOriginal(!showOriginal)}
            className="hover:text-amber-400 font-bold cursor-pointer"
            title="Afficher l'original / la version traduite"
          >
            {showOriginal ? "Voir Traduit" : "Voir Original"}
          </button>
          <span className="text-slate-700">|</span>
          <button
            onClick={forceRetry}
            className="hover:text-amber-400 cursor-pointer font-bold"
            title="Forcer la traduction par l'IA"
          >
            Trad. {targetLang.toUpperCase()}
          </button>
        </div>
      </div>
    );
  }

  return (
    <span className={`group/trans relative inline-block ${className}`}>
      <span className="transition-all duration-300">
        {loading ? "..." : displayText}
      </span>

      {/* Helper controls styled strictly as span/inline-flex so no nested div inside span/p */}
      <span className="absolute -top-6 right-0 opacity-0 group-hover/trans:opacity-100 transition-opacity bg-slate-950/90 text-[10px] text-slate-300 px-2 py-0.5 rounded-md border border-slate-800 inline-flex items-center gap-1.5 z-10 pointer-events-auto">
        <Languages className="w-3 h-3 text-amber-500" />
        <button
          onClick={() => setShowOriginal(!showOriginal)}
          className="hover:text-amber-400 font-bold cursor-pointer"
          title="Afficher l'original / la version traduite"
        >
          {showOriginal ? "Voir Traduit" : "Voir Original"}
        </button>
        <span className="text-slate-700">|</span>
        <button
          onClick={forceRetry}
          className="hover:text-amber-400 cursor-pointer font-bold"
          title="Forcer la traduction par l'IA"
        >
          Trad. {targetLang.toUpperCase()}
        </button>
      </span>
    </span>
  );
}
