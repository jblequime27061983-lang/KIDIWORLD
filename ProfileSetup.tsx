import React, { useState, useEffect } from "react";
import { UserProfile } from "../types";
import { Shield, Sparkles, Languages, Clock, Heart, Award, Check, AlertTriangle, HelpCircle, Plus, Minus } from "lucide-react";

interface ProfileSetupProps {
  profile: UserProfile;
  onChangeProfile: (updated: UserProfile) => void;
  starsCount: number;
}

export default function ProfileSetup({ profile, onChangeProfile, starsCount }: ProfileSetupProps) {
  const [parentEmailInput, setParentEmailInput] = useState(profile.parentEmail);
  const [childNameInput, setChildNameInput] = useState(profile.childName);
  const [childAgeInput, setChildAgeInput] = useState(profile.childAge);
  const [selectedLang, setSelectedLang] = useState<"fr" | "en" | "es" | "ja">(profile.language);
  const [timeLimit, setTimeLimit] = useState<number>(profile.screenTimeLimitMinutes);
  const [parentApproved, setParentApproved] = useState<boolean>(profile.parentApproved);
  const [selectedCats, setSelectedCats] = useState<string[]>(profile.preferredCategories);

  const [simulatedTimeLeft, setSimulatedTimeLeft] = useState(profile.screenTimeLimitMinutes);
  const [isSavedDone, setIsSavedDone] = useState(false);

  useEffect(() => {
    setSimulatedTimeLeft(timeLimit);
  }, [timeLimit]);

  // Run a simulated screen-time countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setSimulatedTimeLeft((prev) => {
        if (prev <= 1) return 1; // Stay at 1m left as a demo ceiling
        return prev - 1;
      });
    }, 45000); // Reduce time slightly in demo speed to visualize it
    return () => clearInterval(timer);
  }, []);

  const availableCategories = [
    { id: "cinema", label: "Cinéma & Scénarios", color: "from-amber-500 to-orange-500" },
    { id: "music", label: "Studio de Musique & Sons", color: "from-violet-500 to-indigo-500" },
    { id: "design", label: "Mode & Beaux-Arts", color: "from-pink-500 to-rose-500" },
    { id: "animation", label: "Cinoche d'Animation & 3D", color: "from-emerald-500 to-teal-500" },
    { id: "photography", label: "Photographie & Lumière", color: "from-cyan-500 to-blue-500" },
  ];

  const languagesAvailable = [
    { code: "fr", name: "Français 🇫🇷" },
    { code: "en", name: "English 🇬🇧" },
    { code: "es", name: "Español 🇪🇸" },
    { code: "ja", name: "日本語 🇯🇵" },
  ];

  const handleToggleCategory = (catId: string) => {
    if (selectedCats.includes(catId)) {
      setSelectedCats(selectedCats.filter((c) => c !== catId));
    } else {
      setSelectedCats([...selectedCats, catId]);
    }
  };

  const handleSaveAll = () => {
    const updated: UserProfile = {
      childName: childNameInput.trim() || "Jeune Artiste",
      childAge: Math.max(4, Math.min(18, childAgeInput)),
      language: selectedLang,
      parentEmail: parentEmailInput.trim(),
      parentApproved: parentApproved,
      screenTimeLimitMinutes: timeLimit,
      preferredCategories: selectedCats,
    };
    onChangeProfile(updated);
    setIsSavedDone(true);
    setTimeout(() => setIsSavedDone(false), 3000);
  };

  const isJuniorOrMini = childAgeInput < 12;

  // Age group helper badge
  const getAgeGroupLabel = (age: number) => {
    if (age >= 4 && age <= 7) return "🌟 Bout d'Chou (Tranche 4-7 ans)";
    if (age >= 8 && age <= 11) return "🚀 Explorateur Créatif (Tranche 8-11 ans)";
    if (age >= 12 && age <= 15) return "🎨 Artiste Junior (Tranche 12-15 ans)";
    return "🔥 Pro de l'Incubation (Tranche 16-18 ans)";
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl text-left space-y-6">
      
      {/* Header and badges */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-slate-800">
        <div>
          <span className="text-[10px] font-bold text-indigo-400 tracking-widest uppercase font-mono bg-indigo-500/10 px-2.5 py-1 rounded inline-block">
            Espace Sécurisé
          </span>
          <h2 className="text-xl font-bold text-white mt-1.5 flex items-center gap-2">
            <Shield className="w-5.5 h-5.5 text-amber-500" /> Profil Jeune Talent & Contrôle Parental
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Gère tes préférences linguistiques, tes thèmes favoris et laisse tes parents superviser ta session.
          </p>
        </div>

        {/* Dynamic score */}
        <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 flex items-center gap-2 text-xs">
          <Award className="w-4 h-4 text-amber-500" />
          <span className="text-slate-400">Progression globale :</span>
          <strong className="text-white font-mono">{starsCount} Étoiles d'Or</strong>
        </div>
      </div>

      {/* Grid layouts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Kid Profile Setup Column */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono flex items-center gap-2">
            🎒 Mon Identité Kidi-Créative
          </h3>

          <div className="bg-slate-950/40 p-4 rounded-2xl border border-slate-800/60 space-y-4">
            
            {/* Name Input */}
            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-400 uppercase tracking-wider font-mono font-bold">
                Mon Nom / Surnom d'Artiste
              </label>
              <input
                type="text"
                placeholder="Ex. Bastien, Léa, Sakura..."
                value={childNameInput}
                onChange={(e) => setChildNameInput(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500 text-xs text-white px-3 py-2 rounded-xl focus:outline-none transition font-sans"
              />
            </div>

            {/* Age Input with verification limit */}
            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-400 uppercase tracking-wider font-mono font-bold flex justify-between">
                <span>Mon Âge (De 4 à 18 ans)</span>
                <span className="text-indigo-400 font-normal">{childAgeInput} ans</span>
              </label>
              <input
                type="range"
                min="4"
                max="18"
                value={childAgeInput}
                onChange={(e) => setChildAgeInput(parseInt(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <p className="text-[10px] font-medium text-slate-400">
                {getAgeGroupLabel(childAgeInput)}
              </p>
            </div>

            {/* Language Selector */}
            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-400 uppercase tracking-wider font-mono font-bold flex items-center gap-1">
                <Languages className="w-3.5 h-3.5 text-slate-400" /> 
                Traduction de Pointe en Temps Réel
              </label>
              <div className="grid grid-cols-2 gap-2">
                {languagesAvailable.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setSelectedLang(lang.code as any)}
                    className={`py-2 px-3 rounded-xl text-xs font-medium text-left transition border ${
                      selectedLang === lang.code
                        ? "bg-amber-500/15 border-amber-500 text-white"
                        : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
              <p className="text-[9px] text-slate-500 leading-normal">
                Notre traducteur IA automatique traduira instantanément tous les défis de la Terre et les commentaires du jury en {selectedLang === "en" ? "Anglais" : selectedLang === "es" ? "Espagnol" : selectedLang === "ja" ? "Japonais" : "Français"}.
              </p>
            </div>
          </div>
        </div>

        {/* Parental Controls Column */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-pink-400 uppercase tracking-wider font-mono flex items-center gap-2">
            👨‍👩‍👦 Tableau de Contrôle Parental Référent
          </h3>

          <div className="bg-slate-950/40 p-4 rounded-2xl border border-slate-800/60 space-y-4">
            
            {/* Parent Email for alerts */}
            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-400 uppercase tracking-wider font-mono font-bold">
                Adresse Email d'un Parent Référent
              </label>
              <input
                type="email"
                placeholder="parent@kidiworld.org"
                value={parentEmailInput}
                onChange={(e) => setParentEmailInput(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500 text-xs text-white px-3 py-2 rounded-xl focus:outline-none transition font-mono"
              />
              <p className="text-[9px] text-slate-500">
                Sert à recevoir les alertes d'incubation, les diplômes gagnés et valider la participation.
              </p>
            </div>

            {/* Screen time limitations slider */}
            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-400 uppercase tracking-wider font-mono font-bold flex justify-between">
                <span>Limitation quotidienne de temps d'écran</span>
                <span className="text-amber-400 font-mono font-bold">
                  {timeLimit === 9999 ? "Illimité" : `${timeLimit} min`}
                </span>
              </label>
              
              <div className="grid grid-cols-4 gap-1">
                {[15, 30, 45, 9999].map((mins) => (
                  <button
                    key={mins}
                    onClick={() => setTimeLimit(mins)}
                    className={`py-1.5 px-2 text-[10px] font-bold rounded-lg transition border ${
                      timeLimit === mins
                        ? "bg-slate-900 text-amber-400 border-amber-500/55"
                        : "bg-slate-950/50 border-transparent text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    {mins === 9999 ? "Libre" : `${mins} m`}
                  </button>
                ))}
              </div>
            </div>

            {/* Screen Time Progress Meter */}
            {(() => {
              const pct = timeLimit === 9999 ? 100 : Math.min(100, Math.max(0, Math.ceil((simulatedTimeLeft / timeLimit) * 100)));
              
              let barColor = "from-emerald-500 to-green-400";
              let textClass = "text-emerald-400";
              let borderClass = "border-emerald-500/20";
              let glowBg = "bg-emerald-950/5";
              let statusLabel = "Sécurité maximale & Utilisation libre 🌻";
              if (timeLimit !== 9999) {
                if (pct <= 25) {
                  barColor = "from-rose-600 to-red-500 animate-pulse";
                  textClass = "text-rose-400 font-black animate-pulse";
                  borderClass = "border-rose-500/35";
                  glowBg = "bg-rose-950/20";
                  statusLabel = "Attention - Temps bientôt écoulé ! 🚨";
                } else if (pct <= 60) {
                  barColor = "from-amber-500 to-orange-400";
                  textClass = "text-amber-400";
                  borderClass = "border-amber-500/20";
                  glowBg = "bg-amber-955/10";
                  statusLabel = "Temps d'écran modéré ⏳";
                } else {
                  barColor = "from-emerald-500 to-green-400";
                  textClass = "text-emerald-400";
                  borderClass = "border-emerald-500/20";
                  glowBg = "bg-emerald-955/10";
                  statusLabel = "Utilisation saine et sereine 🚀";
                }
              }

              return (
                <div id="screen-time-container-card" className={`space-y-3 p-4 rounded-2xl border transition-all duration-300 ${borderClass} ${glowBg}`}>
                  <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
                    <span className="flex items-center gap-1.5 label text-slate-300">
                      <Clock className="w-3.5 h-3.5 text-indigo-400 animate-spin" style={{ animationDuration: "12s" }} /> 
                      <span>Contrôle d'activité en temps réel :</span>
                    </span>
                    <span className="text-[9px] px-2 py-0.5 rounded-full font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                      Contrôle Parental Validé ✔
                    </span>
                  </div>

                  <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-900 space-y-2 relative overflow-hidden">
                    <div className="flex justify-between items-baseline z-10 relative">
                      <div className="space-y-0.5">
                        <span className="text-[9px] text-slate-500 font-mono block uppercase tracking-wider">Statut Détaillé</span>
                        <strong className={`text-[11px] font-extrabold ${textClass}`}>
                          {statusLabel}
                        </strong>
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] text-slate-500 font-mono block uppercase tracking-wider">Temps Restant</span>
                        <strong className={`text-sm font-mono font-black ${textClass}`}>
                          {timeLimit === 9999 ? "Illimité" : `${simulatedTimeLeft} min`}
                        </strong>
                      </div>
                    </div>

                    {/* Highly interactive and polished dynamic color visual progress bar */}
                    <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden p-[2px] border border-slate-800/80 flex items-center relative group">
                      <div 
                        className={`h-full rounded-full bg-gradient-to-r ${barColor} transition-all duration-700 ease-out relative shadow-[0_0_12px_rgba(16,185,129,0.15)]`}
                        style={{ width: `${pct}%` }}
                      >
                        {/* Animated gradient pulse inside the bar */}
                        <div className="absolute inset-0 bg-white/10 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse rounded-full" />
                      </div>
                    </div>

                    {/* Mini details summary */}
                    <div className="flex justify-between items-center text-[9px] text-slate-500 pt-1 text-left">
                      <span>Niveau de charge : <b>{pct}%</b> restant</span>
                      <span>Total alloué : {timeLimit === 9999 ? "∞" : `${timeLimit} min`}</span>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Parental Consent Checkbox */}
            <label className="flex items-start gap-2.5 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={parentApproved}
                onChange={(e) => setParentApproved(e.target.checked)}
                className="mt-0.5 rounded accent-pink-500 cursor-pointer"
              />
              <span className="text-[10px] text-slate-400 leading-snug">
                <strong>Autorisation parentale signée</strong> : J'autorise mon enfant à participer aux challenges de KIDIWORLD et à soumettre des oeuvres évaluées par des professionnels de LinkYourArt.
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Target Category Preference Filter Selection */}
      <div className="space-y-3">
        <label className="text-[10px] text-slate-400 uppercase tracking-wider font-mono font-bold block">
          🎨 Mes catégories créatives d'orientation préférées
        </label>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {availableCategories.map((cat) => {
            const isSelected = selectedCats.includes(cat.id);
            return (
              <button
                key={cat.id}
                onClick={() => handleToggleCategory(cat.id)}
                className={`p-3.5 rounded-2xl border text-left transition relative flex flex-col justify-between overflow-hidden group ${
                  isSelected
                    ? "bg-slate-950/70 border-amber-500/50 text-white"
                    : "bg-slate-950/20 border-slate-900 text-slate-400 hover:border-slate-800"
                }`}
              >
                {/* Visual glow element */}
                <span className="text-xs font-bold block tracking-tight z-10 group-hover:text-white transition">
                  {cat.label}
                </span>
                
                <span className="text-[9px] font-mono mt-1 z-10 block capitalize text-slate-500">
                  {cat.id} {isSelected && "🎯"}
                </span>

                <div 
                  className={`absolute bottom-0 right-0 w-8 h-8 rounded-tl-full bg-gradient-to-tr ${cat.color} opacity-10 group-hover:opacity-20 transition`}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Parental Notice under 12 */}
      {isJuniorOrMini && (
        <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-start gap-2 text-xs text-amber-300">
          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <div className="leading-snug">
            <strong>Protection Enfant Activable (-12 ans) :</strong> Comme tu as moins de 12 ans, l'interface Kidiworld est automatiquement adoucie. Ton adresse email parentale est obligatoire pour envoyer de vraies soumissions aux jurés LinkYourArt pour ta sécurité.
          </div>
        </div>
      )}

      {/* Action triggers */}
      <div className="pt-3 border-t border-slate-800/80 flex justify-between items-center">
        <p className="text-[10px] text-slate-500 font-mono">
          Vos préférences de sécurité et configurations de session sont chiffrées et sauvegardées localement.
        </p>

        <div className="flex gap-3">
          <button
            onClick={handleSaveAll}
            className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-pink-500 hover:from-amber-400 hover:to-pink-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition transform active:scale-95 cursor-pointer"
          >
            Sauvegarder mes Préférences
          </button>
        </div>
      </div>

      {isSavedDone && (
        <div className="p-3 bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20 rounded-xl text-center">
          ✨ Profil enregistré avec succès. Tous les défis sont traduits en temps réel en {selectedLang.toUpperCase()} !
        </div>
      )}

    </div>
  );
}
