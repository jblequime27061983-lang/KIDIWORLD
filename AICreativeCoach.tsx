import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, Sparkles, Smile, Bot, VolumeX, User, Wand } from "lucide-react";
import { Message } from "../types";

interface AICreativeCoachProps {
  challengeTitle: string;
  unlockedClues: string[];
  draftScreenplay?: { title: string; act1: string; act2: string; act3: string };
  draftMusic?: any;
  draftCostume?: any;
}

export default function AICreativeCoach({
  challengeTitle,
  unlockedClues,
  draftScreenplay,
  draftMusic,
  draftCostume,
}: AICreativeCoachProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "coach",
      text: "Salut jeune prodige ! Je suis Linky, ton coach IA créatif pour KIDIWORLD. 🚀\n\nTu participes au défi de scénario d'animation ? Je suis là pour t'aider à associer nos indices stellaires et libérer ton imagination ! De quoi veux-tu parler à Lucas Besson aujourd'hui ?",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;

    const userText = input.trim();
    setInput("");

    const newMsg: Message = {
      role: "user",
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setIsTyping(true);

    // Build context to assist Gemini with children creation
    const context = {
      challengeTitle,
      cluesRevealed: unlockedClues,
      currentClue: unlockedClues[unlockedClues.length - 1] || "Libre création",
      draft: `Scénario: ${draftScreenplay?.title || "Sans titre"}. Acte 1: ${draftScreenplay?.act1?.slice(0, 150) || ""}. Musique: ${draftMusic?.lyrics?.slice(0, 100) || ""}. Costume: ${draftCostume?.name || ""}.`,
    };

    try {
      // API request to server-side Gemini 3.5 Flash endpoint
      const response = await fetch("/api/gemini/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: userText,
          context,
          history: messages.slice(-10).map((m) => ({
            role: m.role === "user" ? "user" : "model",
            text: m.text,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error("Erreur de communication avec le serveur.");
      }

      const data = await response.json();
      const coachText = data.text;

      setMessages((prev) => [
        ...prev,
        {
          role: "coach",
          text: coachText,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } catch (error) {
      console.error("Coach API error:", error);
      // Fallback
      setMessages((prev) => [
        ...prev,
        {
          role: "coach",
          text: "Oups ! Un orage électromagnétique dans la nébuleuse perturbe notre connexion. Dis-moi, as-tu déjà bien intégré tous les mots clés dans ton scénario ?",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  // Preset smart questions to guide youth
  const smartQuestions = [
    "Aide-moi à commencer l'Acte I !",
    "Comment insérer l'androïde buggé ?",
    "Idées pour le costume de l'astronaute ?",
    "Écris-moi une rime sur le cachalot",
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[520px]">
      {/* Header Info */}
      <div className="bg-slate-950 p-4 border-b border-slate-800 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-500 to-pink-500 flex items-center justify-center shadow-lg relative">
            <Bot className="w-5.5 h-5.5 text-white animate-pulse" />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-slate-950" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
              Linky <span className="text-[10px] uppercase font-mono bg-violet-500/10 text-violet-400 border border-violet-500/25 px-1.5 py-0.5 rounded">Coach IA</span>
            </h4>
            <p className="text-[10px] text-slate-400 font-medium">Spécialiste en scénarios animés</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: "6s" }} />
          <span className="text-[10px] font-mono font-semibold text-amber-400">PARTENAIRE LINKYOURART</span>
        </div>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-950/60 font-sans">
        {messages.map((msg, index) => (
          <div key={index} className={`flex gap-2.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {msg.role !== "user" && (
              <div className="w-8 h-8 rounded-lg bg-violet-600/15 flex items-center justify-center text-violet-400 self-end border border-violet-600/20">
                <Bot className="w-4 h-4" />
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-2xl p-3.5 text-xs text-left leading-relaxed shadow-md ${
                msg.role === "user"
                  ? "bg-violet-600 text-white rounded-br-none"
                  : "bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none font-medium whitespace-pre-line"
              }`}
            >
              {msg.text}
              <span className={`text-[9px] block text-right mt-1 opacity-60 font-mono`}>{msg.timestamp}</span>
            </div>
            {msg.role === "user" && (
              <div className="w-8 h-8 rounded-lg bg-indigo-600/15 flex items-center justify-center text-indigo-400 self-end border border-indigo-600/20">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-2.5 justify-start">
            <div className="w-8 h-8 rounded-lg bg-violet-600/15 flex items-center justify-center text-violet-400 self-end border border-violet-600/20">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 rounded-bl-none max-w-[80%]">
              <div className="flex gap-1.5 justify-center items-center py-1 px-2">
                <div className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Suggested fast buttons for younger users */}
      <div className="bg-slate-950 p-2.5 border-t border-slate-900 flex gap-2 overflow-x-auto whitespace-nowrap scrollbar-none">
        {smartQuestions.map((q, idx) => (
          <button
            key={idx}
            disabled={isTyping}
            onClick={() => {
              setInput(q);
            }}
            className="text-[10px] font-semibold bg-slate-900 hover:bg-slate-800 active:bg-slate-800 text-violet-300 border border-violet-800/20 px-3 py-1.5 rounded-full transition shrink-0"
          >
            💡 {q}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSendMessage} className="bg-slate-950 p-3 border-t border-slate-900 flex gap-2">
        <input
          type="text"
          placeholder="Pose une question à Linky..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isTyping}
          className="flex-1 bg-slate-900 border border-slate-800 text-xs px-3.5 py-2.5 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition"
        />
        <button
          type="submit"
          disabled={!input.trim() || isTyping}
          className="bg-violet-600 hover:bg-violet-500 active:scale-95 text-white p-2.5 rounded-xl shadow transition disabled:opacity-40"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
