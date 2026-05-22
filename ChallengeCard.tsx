import React from "react";
import { Challenge } from "../types";
import TranslatedText from "./TranslatedText";
import { ChevronRight, Award, Sparkles, AlertCircle, ArrowRight, User } from "lucide-react";

export interface ChallengeCardProps {
  key?: React.Key;
  challenge: Challenge;
  isActive: boolean;
  language: "fr" | "en" | "es" | "ja";
  onSelect: (challengeId: string) => void;
}

export default function ChallengeCard({
  challenge,
  isActive,
  language,
  onSelect,
}: ChallengeCardProps) {
  const subCount = challenge.submissions?.length || 0;

  return (
    <div
      id={`challenge-card-${challenge.id}`}
      className={`group border rounded-3xl p-6 text-left flex flex-col justify-between h-[320px] transition-all duration-300 relative overflow-hidden ${
        isActive
          ? "bg-slate-900/90 border-amber-500 shadow-xl shadow-amber-500/10 ring-1 ring-amber-500/20 scale-[1.01]"
          : "bg-slate-900 border-slate-900 hover:border-slate-850 hover:bg-slate-900/75 hover:shadow-2xl"
      }`}
    >
      {/* Decorative Glow background accent */}
      <span className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-white/5 to-transparent rounded-bl-full pointer-events-none" />
      {isActive && (
        <span className="absolute top-0 left-0 w-32 h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600" />
      )}

      <div className="space-y-3 flex-1 min-w-0">
        {/* Upper Badge Indicators Row */}
        <div className="flex justify-between items-start gap-2">
          {/* Age and Category Info badges */}
          <div className="flex flex-wrap gap-1.5 items-center">
            <span 
              id={`challenge-age-badge-${challenge.id}`}
              className="text-[10px] px-2 py-0.5 rounded-md font-mono font-bold bg-slate-950 border border-slate-800 text-slate-300 uppercase shrink-0"
            >
              🧒 {challenge.ageGroup} ans
            </span>
            <span 
              id={`challenge-cat-badge-${challenge.id}`}
              className="text-[9px] bg-slate-950 text-slate-300 px-2 py-0.5 rounded border border-slate-800 uppercase font-bold font-mono shrink-0"
            >
              {challenge.category === "cinema" ? "🎬 Cinéma" 
               : challenge.category === "music" ? "🎵 Musique" 
               : challenge.category === "design" ? "🎨 Mode & Dessin"
               : challenge.category === "animation" ? "👾 Jeu Vidéo & Anim"
               : challenge.category === "photography" ? "📸 Photographie"
               : challenge.category}
            </span>
          </div>

          {/* Mode Banner Indicator: Demo vs Real Concours */}
          <div className="shrink-0">
            {challenge.isDemo ? (
              <span 
                id={`challenge-mode-demo-${challenge.id}`}
                className="text-[9px] bg-cyan-500/10 text-cyan-400 font-black px-2 py-0.5 rounded-full border border-cyan-500/20 tracking-wider inline-flex items-center gap-1"
              >
                <Sparkles className="w-2.5 h-2.5" />
                DÉMO D'ESSAI
              </span>
            ) : (
              <span 
                id={`challenge-mode-real-${challenge.id}`}
                className="text-[9px] bg-rose-500/10 text-rose-400 font-black px-2 py-0.5 rounded-full border border-rose-500/20 tracking-wider inline-flex items-center gap-1 animate-pulse"
              >
                <Award className="w-2.5 h-2.5 text-rose-400" />
                CONCOURS RÉEL
              </span>
            )}
          </div>
        </div>

        {/* Challenge Titles */}
        <div className="space-y-1">
          <h3 
            id={`challenge-title-${challenge.id}`}
            className="text-base font-black text-white group-hover:text-amber-400 transition-colors leading-snug tracking-tight truncate"
          >
            <TranslatedText text={challenge.title} targetLang={language} />
          </h3>
          <p 
            id={`challenge-subtitle-${challenge.id}`}
            className="text-[11px] text-slate-400 font-medium truncate"
          >
            <TranslatedText text={challenge.subtitle} targetLang={language} />
          </p>
        </div>

        {/* Sponsor Bio Row */}
        <div 
          id={`challenge-sponsor-${challenge.id}`}
          className="flex items-center gap-1.5 text-[10px] text-slate-500 font-medium italic"
        >
          <User className="w-3 h-3 text-slate-600 shrink-0" />
          <span className="truncate">
            Sponsor: <span className="text-slate-400 font-semibold">{challenge.sponsor}</span>
          </span>
        </div>

        {/* Challenge Description Truncated visually using tailwind line clamp */}
        <div 
          id={`challenge-desc-${challenge.id}`}
          className="text-xs text-slate-300 leading-relaxed line-clamp-3 overflow-hidden pt-1"
        >
          <TranslatedText text={challenge.description} targetLang={language} isParagraph={true} />
        </div>
      </div>

      {/* Footer Submission metrics and Selection Actions */}
      <div className="pt-3 border-t border-slate-800/80 flex justify-between items-center mt-3">
        <span 
          id={`challenge-submissions-count-${challenge.id}`}
          className="text-[10px] font-mono text-slate-400 flex items-center gap-1.5"
        >
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping" />
          {subCount} {subCount <= 1 ? "soumission" : "soumissions"}
        </span>

        <button
          id={`challenge-select-btn-${challenge.id}`}
          onClick={() => onSelect(challenge.id)}
          className={`py-1.5 px-4 rounded-xl text-xs font-bold transition-all duration-300 flex items-center gap-1.5 cursor-pointer hover:shadow-lg ${
            isActive
              ? "bg-amber-500 text-slate-950 font-black hover:bg-amber-400 active:scale-95"
              : "bg-slate-950 text-slate-300 hover:text-white hover:bg-slate-900 border border-slate-800 active:scale-95"
          }`}
        >
          {isActive ? (
            <>
              Continuer
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          ) : (
            <>
              Sélectionner
              <ChevronRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
