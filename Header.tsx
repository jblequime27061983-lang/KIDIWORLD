import React from "react";
import { Sparkles, Users, Award, HelpCircle, Bot, Shield, Languages, Coins } from "lucide-react";

interface HeaderProps {
  userRole: "child" | "jury";
  onToggleRole: (role: "child" | "jury") => void;
  starsCount: number;
  profileName: string;
  profileAge: number;
  profileLang: "fr" | "en" | "es" | "ja";
  onOpenProfile: () => void;
  isProfileActive: boolean;
  kidiCoins?: number;
  onOpenTutorial: () => void;
}

export default function Header({ 
  userRole, 
  onToggleRole, 
  starsCount, 
  profileName, 
  profileAge, 
  profileLang, 
  onOpenProfile,
  isProfileActive,
  kidiCoins,
  onOpenTutorial
}: HeaderProps) {
  const getLangEmoji = (lang: string) => {
    switch (lang) {
      case "en": return "🇬🇧 EN";
      case "es": return "🇪🇸 ES";
      case "ja": return "🇯🇵 JA";
      default: return "🇫🇷 FR";
    }
  };

  const getAgeLabelBadge = (age: number) => {
    if (age <= 7) return "4-7 ans (Bout d'Chou)";
    if (age <= 11) return "8-11 ans (Explo)";
    if (age <= 15) return "12-15 ans (Junior)";
    return "16-18 ans (Senior)";
  };

  return (
    <header className="bg-slate-950/80 backdrop-blur-md border-b border-slate-900 sticky top-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Branding Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-pink-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
            <Sparkles className="w-5.5 h-5.5 text-slate-950 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-400 font-sans">
                KIDIWORLD
              </span>
              <span className="text-[9px] bg-amber-500/10 text-amber-400 font-bold px-1.5 py-0.5 rounded border border-amber-500/10">
                4-18 ANS SAFE
              </span>
            </div>
            <p className="text-[9px] font-mono tracking-wider text-slate-400 font-bold uppercase">
              Incubateur de Talents propulsé par LinkYourArt pro
            </p>
          </div>
        </div>

        {/* Dynamic Nav Controls View Toggle & Profile setup */}
        <div className="flex flex-wrap items-center gap-3">
          {/* User Role Switcher */}
          <div className="bg-slate-900 p-1 rounded-2xl border border-slate-800 flex gap-1 shadow-inner">
            <button
              onClick={() => onToggleRole("child")}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-bold rounded-xl transition ${
                userRole === "child"
                  ? "bg-slate-950 text-amber-400 shadow-md"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Bot className="w-3.5 h-3.5" />
              Espace Jeune
            </button>
            <button
              onClick={() => onToggleRole("jury")}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-bold rounded-xl transition ${
                userRole === "jury"
                  ? "bg-slate-950 text-pink-400 shadow-md"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              Comité Jury Pro
            </button>
          </div>

          {/* High-Visibility Interactive Tutorial Trigger Button with Pulsing Dot */}
          <button
            onClick={onOpenTutorial}
            className="group relative flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-600 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs font-extrabold transition-all duration-300 shadow-[0_0_15px_rgba(99,102,241,0.4)] hover:shadow-[0_0_22px_rgba(99,102,241,0.7)] cursor-pointer select-none active:scale-95 border border-indigo-400/30"
          >
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5 z-10">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-pink-500"></span>
            </span>
            <HelpCircle className="w-4 h-4 text-indigo-100 group-hover:rotate-12 transition-transform" />
            <span className="tracking-wide">Tutoriel Interactif 🚀</span>
          </button>

          {/* Parental Setup Shortcut trigger button */}
          <button
            onClick={onOpenProfile}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition shadow-sm ${
              isProfileActive
                ? "bg-pink-500/15 text-pink-400 border-pink-500/40"
                : "bg-slate-900 border-slate-800 text-slate-300 hover:text-white"
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-pink-500" />
            <span className="hidden sm:inline">Contrôle Parental</span>
          </button>

          {/* Quick Info Badges: Age level & Active Language Translation */}
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800/80 px-2.5 py-1.5 rounded-xl text-[10px] font-mono font-bold text-slate-400 shadow-inner">
            <span className="text-amber-500">{getAgeLabelBadge(profileAge)}</span>
            <span className="text-slate-700">|</span>
            <span className="text-indigo-400 flex items-center gap-1">
              <Languages className="w-3 h-3 text-indigo-400" /> {getLangEmoji(profileLang)}
            </span>
          </div>

          {/* User Score Stats Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 rounded-xl border border-slate-800/80 font-mono text-xs shadow-md">
            <Award className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-slate-400">Étoiles :</span>
            <strong className="text-white font-bold">{starsCount}</strong>
          </div>

          {kidiCoins !== undefined && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 rounded-xl border border-slate-800/80 font-mono text-xs shadow-md text-amber-400">
              <Coins className="w-3.5 h-3.5 text-amber-500 animate-spin" style={{ animationDuration: "12s" }} />
              <span className="text-slate-400">Coins :</span>
              <strong className="text-amber-300 font-bold">{kidiCoins}</strong>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
