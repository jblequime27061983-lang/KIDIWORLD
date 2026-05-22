import React, { useState, useEffect, useRef } from "react";
import { Music, Play, Pause, SkipForward, SkipBack, Volume2, Coins, Sparkles, Check, Lock, Heart, Repeat, Search, Layers } from "lucide-react";
import { AccountSession } from "./AccountAuth";

interface Track {
  id: string;
  title: string;
  artist: string;
  duration: string;
  category: "space-ambient" | "retro-synth" | "cinema-score" | "vocal-chill";
  priceCoins: number;
  isUnlockedByDefault: boolean;
  bpm: number;
  coverGradient: string;
}

const DEFAULT_TRACKS: Track[] = [
  {
    id: "track-1",
    title: "Chants de la Nébuleuse d'Or",
    artist: "Orchestre KidiWorld & Linky",
    duration: "3:45",
    category: "space-ambient",
    priceCoins: 0,
    isUnlockedByDefault: true,
    bpm: 85,
    coverGradient: "from-blue-600 via-indigo-600 to-purple-600"
  },
  {
    id: "track-2",
    title: "Bip Bop Micro-Symphony",
    artist: "L'Androïde Buggé",
    duration: "2:15",
    category: "retro-synth",
    priceCoins: 0,
    isUnlockedByDefault: true,
    bpm: 120,
    coverGradient: "from-amber-500 via-orange-500 to-rose-500"
  },
  {
    id: "track-3",
    title: "Sillage de Bioluminescence",
    artist: "Symphonie Sidérale de Léa",
    duration: "4:02",
    category: "cinema-score",
    priceCoins: 30, // Premium track
    isUnlockedByDefault: false,
    bpm: 105,
    coverGradient: "from-teal-500 via-cyan-500 to-blue-500"
  },
  {
    id: "track-4",
    title: "Sérénade des Abysses stellaires",
    artist: "Bastien & AI Harmony",
    duration: "3:10",
    category: "vocal-chill",
    priceCoins: 35, // Premium track
    isUnlockedByDefault: false,
    bpm: 90,
    coverGradient: "from-purple-600 via-pink-600 to-rose-600"
  },
  {
    id: "track-5",
    title: "Le Combat de l'Alliance",
    artist: "Kidi DJ Spatiale",
    duration: "2:45",
    category: "retro-synth",
    priceCoins: 40, // Premium track
    isUnlockedByDefault: false,
    bpm: 140,
    coverGradient: "from-indigo-600 via-violet-600 to-pink-600"
  }
];

interface KidiMusicProps {
  session: AccountSession;
  onUpdateSession: (updated: AccountSession) => void;
  language: "fr" | "en" | "es" | "ja";
}

export default function KidiMusic({ session, onUpdateSession, language }: KidiMusicProps) {
  // Persistence key
  const [unlockedTrackIds, setUnlockedTrackIds] = useState<string[]>(() => {
    const saved = localStorage.getItem("kidiworld_unlocked_tracks_v1");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return ["track-1", "track-2"];
  });

  const [tracks, setTracks] = useState<Track[]>(DEFAULT_TRACKS);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(35); // simulated percent
  const [volume, setVolume] = useState(75);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);

  // Sync unlocked tracks to local storage
  useEffect(() => {
    localStorage.setItem("kidiworld_unlocked_tracks_v1", JSON.stringify(unlockedTrackIds));
  }, [unlockedTrackIds]);

  // Audio spectrum visualizer simulation inside Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = canvas.width;
    let height = canvas.height;
    let localTicker = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      
      const barsCount = 38;
      const spacing = 4;
      const barWidth = (width - (barsCount - 1) * spacing) / barsCount;

      for (let i = 0; i < barsCount; i++) {
        // Calculate dynamic height based on sound index, playing state and a time offset
        let factor = isPlaying ? Math.sin((i / 4) + localTicker / 8) * 0.5 + 0.5 : 0.08;
        // add some random fluctuation if playing
        if (isPlaying) {
          factor += Math.random() * 0.25;
          if (factor > 1) factor = 1;
        }

        const barHeight = factor * (height - 10) + 4;
        const x = i * (barWidth + spacing);
        const y = height - barHeight;

        // Custom Gradient color depending on active track category
        const currentTrack = tracks[currentTrackIndex] || tracks[0];
        let colorGrad = ctx.createLinearGradient(0, height, 0, 0);
        if (currentTrack.category === "retro-synth") {
          colorGrad.addColorStop(0, "#f59e0b");
          colorGrad.addColorStop(1, "#f43f5e");
        } else if (currentTrack.category === "space-ambient") {
          colorGrad.addColorStop(0, "#2563eb");
          colorGrad.addColorStop(1, "#a855f7");
        } else if (currentTrack.category === "cinema-score") {
          colorGrad.addColorStop(0, "#14b8a6");
          colorGrad.addColorStop(1, "#06b6d4");
        } else {
          colorGrad.addColorStop(0, "#8b5cf6");
          colorGrad.addColorStop(1, "#ec4899");
        }

        ctx.fillStyle = colorGrad;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, 3);
        ctx.fill();
      }

      if (isPlaying) {
        localTicker += 1;
        setProgress((prev) => {
          if (prev >= 100) {
            // Loop or auto-forward
            handleNext();
            return 0;
          }
          return prev + 0.12;
        });
      }
      animationRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying, currentTrackIndex, tracks]);

  const activeTrack = tracks[currentTrackIndex] || tracks[0];
  const isUnlocked = activeTrack.isUnlockedByDefault || unlockedTrackIds.includes(activeTrack.id) || session.isPremiumMember;

  const handlePlayToggle = () => {
    if (!isUnlocked) {
      // Invite to buy
      handleBuyTrack(activeTrack);
      return;
    }
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % tracks.length);
    setProgress(0);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + tracks.length) % tracks.length);
    setProgress(0);
  };

  const handleBuyTrack = (track: Track) => {
    if (session.isPremiumMember) return; // free for premium
    
    if (session.kidiCoins >= track.priceCoins) {
      if (window.confirm(language === "fr" 
        ? `Veux-tu débloquer le morceau permanent "${track.title}" pour ${track.priceCoins} KidiCoins ?`
        : `Do you want to buy "${track.title}" for ${track.priceCoins} KidiCoins?`)) {
        
        onUpdateSession({
          ...session,
          kidiCoins: session.kidiCoins - track.priceCoins
        });
        setUnlockedTrackIds((prev) => [...prev, track.id]);
        alert(language === "fr" ? `🎉 "${track.title}" est maintenant décodé et déverrouillé ! Lance la musique.` : `🎉 "${track.title}" unlocked!`);
      }
    } else {
      alert(language === "fr" 
        ? `⚠️ Solde insuffisant ! Ce morceau pro coûte ${track.priceCoins} KidiCoins. Rédige des scénarios ou dessine pour gagner des pièces !`
        : `⚠️ Not enough KidiCoins! This track costs ${track.priceCoins} KidiCoins. Complete challenges to earn coins!`);
    }
  };

  const toggleFavorite = (trackId: string) => {
    setFavorites((prev) => 
      prev.includes(trackId) ? prev.filter(id => id !== trackId) : [...prev, trackId]
    );
  };

  // Filter track queue
  const filteredTracks = tracks.filter((t) => {
    const matchesCategory = selectedCategory === "all" || t.category === selectedCategory;
    const matchesQuery = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.artist.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <div id="kidi-music-root" className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
      
      {/* Visual audio controller panel - 1 Column */}
      <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between space-y-6 shadow-xl min-h-[460px]">
        {/* Track details heading */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase font-black block">Lecteur KIDI MUSIC</span>
            <div className="flex items-center gap-1.5 text-xs text-amber-400 font-bold bg-amber-500/5 px-2.5 py-1 rounded-full border border-amber-500/10">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{activeTrack.bpm} BPM</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Visual Cover art */}
            <div className={`w-20 h-20 rounded-2xl bg-gradient-to-tr ${activeTrack.coverGradient} flex items-center justify-center text-white relative shadow-lg shrink-0 overflow-hidden group`}>
              <Music className={`w-8 h-8 ${isPlaying ? "animate-bounce" : "opacity-80"}`} />
              <div className="absolute inset-0 bg-black/10 mix-blend-overlay" />
            </div>

            <div className="min-w-0">
              <h3 className="text-base font-black text-white leading-tight truncate">
                {activeTrack.title}
              </h3>
              <p className="text-xs text-slate-400 mt-1 truncate">
                {activeTrack.artist}
              </p>
              <span className="inline-block mt-2 text-[9px] uppercase font-mono bg-slate-950 px-2 py-0.5 rounded text-slate-500 border border-slate-850">
                {activeTrack.category}
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Waveform Visualizer simulation */}
        <div id="visualizer-container" className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-850">
          <canvas ref={canvasRef} width={260} height={70} className="w-full h-[70px] pointer-events-none rounded-lg" />
          <div className="flex justify-between text-[9px] text-slate-500 font-mono mt-2">
            <span>Simulé par Canvas IA</span>
            <span>Freq: 44.1kHz</span>
          </div>
        </div>

        {/* Lock Screen overlay or player indicators */}
        <div className="space-y-4">
          {/* Timeline slider bar */}
          <div className="space-y-1.5">
            <div className="relative h-1 w-full bg-slate-950 rounded-full overflow-hidden">
              <div 
                className="absolute left-0 top-0 h-full bg-gradient-to-r from-amber-500 to-pink-500 rounded-full transition-all duration-300" 
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0:{Math.floor(progress * 2.2).toString().padStart(2, "0")}</span>
              <span>{activeTrack.duration}</span>
            </div>
          </div>

          {!isUnlocked ? (
            // Lock overlay with Purchase CTA
            <div className="bg-slate-950 p-4 rounded-xl border border-rose-500/20 text-center space-y-2.5">
              <p className="text-xs text-rose-300 font-bold flex items-center justify-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-rose-400" />
                Morceau pro verrouillé
              </p>
              <button
                onClick={() => handleBuyTrack(activeTrack)}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs py-2 px-4 rounded-xl shadow transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Coins className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: "5s" }} />
                Débloquer pour {activeTrack.priceCoins} KidiCoins
              </button>
            </div>
          ) : (
            // Premium or unlocked controls
            <div className="flex justify-between items-center gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleFavorite(activeTrack.id)}
                  className={`p-2.5 rounded-xl border transition ${
                    favorites.includes(activeTrack.id) 
                      ? "bg-rose-500/10 border-rose-500/30 text-rose-400" 
                      : "bg-slate-950 border-slate-850 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Heart className="w-4 h-4" />
                </button>
                
                <button
                  onClick={() => setProgress(0)}
                  className="p-2.5 rounded-xl border bg-slate-950 border-slate-850 text-slate-400 hover:text-slate-200 transition"
                  title="Recommencer"
                >
                  <Repeat className="w-4 h-4" />
                </button>
              </div>

              {/* Main player controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrev}
                  className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-850 text-slate-300 transition"
                >
                  <SkipBack className="w-4 h-4" />
                </button>
                <button
                  onClick={handlePlayToggle}
                  className="p-4 rounded-full bg-amber-500 text-slate-950 hover:bg-amber-400 active:scale-90 transition shadow-lg shrink-0 cursor-pointer"
                >
                  {isPlaying ? <Pause className="w-5 h-5 fill-slate-950" /> : <Play className="w-5 h-5 fill-slate-950 pl-0.5" />}
                </button>
                <button
                  onClick={handleNext}
                  className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-850 text-slate-300 transition"
                >
                  <SkipForward className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Volume control row */}
          <div className="flex items-center gap-2.5 text-slate-500 pt-1">
            <Volume2 className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-full accent-amber-500 bg-slate-950 h-1.5 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-[10px] font-mono w-6 text-right shrink-0">{volume}%</span>
          </div>
        </div>
      </div>

      {/* Playlist and categories - 2 Columns */}
      <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between space-y-5 shadow-xl">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h3 className="text-base font-black text-white">
                🎵 {language === "fr" ? "Baladeuse de l'Espace" : "Space Playlist"}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {language === "fr" ? "Écoute nos productions originales ou débloque des pistes exclusives" : "Listen to unique school bands and lock sounds"}
              </p>
            </div>
            
            {/* Search Input bar */}
            <div className="relative w-full sm:w-auto">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder={language === "fr" ? "Rechercher..." : "Search..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-950 border border-slate-850 text-xs rounded-xl py-1.5 pl-8 pr-3.5 text-slate-300 placeholder-slate-600 focus:outline-none focus:border-amber-500 w-full sm:w-48"
              />
            </div>
          </div>

          {/* Music Category filter chips */}
          <div className="flex flex-wrap gap-1.5">
            {[
              { code: "all", label: "Toutes les musiques" },
              { code: "space-ambient", label: "Ambiance Spatiale 🌌" },
              { code: "retro-synth", label: "Chiptune & Synth 👾" },
              { code: "cinema-score", label: "Orchestre Épique 🎬" },
              { code: "vocal-chill", label: "Sérénade Douce 🎤" }
            ].map((cat) => (
              <button
                key={cat.code}
                onClick={() => setSelectedCategory(cat.code)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition border ${
                  selectedCategory === cat.code
                    ? "bg-slate-950 border-amber-500 text-amber-400"
                    : "bg-slate-950/40 border-slate-900 text-slate-400 hover:text-slate-200"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tracks lists display */}
        <div className="flex-1 overflow-y-auto max-h-[290px] space-y-2.5 pr-1.5">
          {filteredTracks.map((item, index) => {
            const isCurrentlyPlaying = tracks[currentTrackIndex]?.id === item.id;
            const isBought = unlockedTrackIds.includes(item.id) || item.priceCoins === 0;
            const hasFreeClaim = session.isPremiumMember;
            const isAccessPermitted = isBought || hasFreeClaim;

            return (
              <div
                key={item.id}
                onClick={() => {
                  if (isAccessPermitted) {
                    const realIndex = tracks.findIndex(t => t.id === item.id);
                    setCurrentTrackIndex(realIndex >= 0 ? realIndex : 0);
                    setProgress(0);
                    setIsPlaying(true);
                  } else {
                    handleBuyTrack(item);
                  }
                }}
                className={`group/item p-3 rounded-2xl border transition flex items-center justify-between cursor-pointer ${
                  isCurrentlyPlaying
                    ? "bg-slate-950 border-amber-500/45 text-white"
                    : "bg-slate-950/30 border-slate-950/10 text-slate-300 hover:bg-slate-950/60 hover:border-slate-800"
                }`}
              >
                {/* Visual playing state node index */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${item.coverGradient} flex items-center justify-center text-white text-xs font-bold relative shrink-0 overflow-hidden`}>
                    {isCurrentlyPlaying && isPlaying ? (
                      <span className="flex gap-1 justify-center items-end h-4 w-4">
                        <span className="animate-music-bar-1 w-0.5 bg-white rounded-full h-full" />
                        <span className="animate-music-bar-2 w-0.5 bg-white rounded-full h-3" />
                        <span className="animate-music-bar-3 w-0.5 bg-white rounded-full h-4" />
                      </span>
                    ) : (
                      index + 1
                    )}
                  </div>

                  <div className="min-w-0">
                    <h4 className={`text-xs font-bold leading-tight truncate ${isCurrentlyPlaying ? "text-amber-400" : "text-white group-hover/item:text-amber-400"}`}>
                      {item.title}
                    </h4>
                    <span className="text-[10px] text-slate-400 block mt-0.5 truncate">
                      {item.artist}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {favorites.includes(item.id) && (
                    <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                  )}

                  {!isAccessPermitted ? (
                    // Display lock price tag
                    <span className="text-[10px] bg-amber-500/10 text-amber-400 font-mono font-bold px-2 py-1 rounded-lg border border-amber-500/20 flex items-center gap-1">
                      <Lock className="w-2.5 h-2.5 text-amber-500" />
                      {item.priceCoins} KidiCoins
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-slate-500 group-hover/item:text-slate-400">
                      {item.duration}
                    </span>
                  )}
                </div>
              </div>
            );
          })}

          {filteredTracks.length === 0 && (
            <p className="text-xs text-slate-500 italic text-center py-6">
              Aucun morceau ne correspond aux critères.
            </p>
          )}
        </div>

        {/* Library Info banner */}
        <div className="bg-slate-950/40 p-3 rounded-2xl border border-slate-900 flex justify-between items-center text-[10px] text-slate-400">
          <span className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            Accès sécurisé pour mineurs de 4 à 18 ans
          </span>
          <span className="text-[9px] font-mono uppercase bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/15">
            Contrôlé Parental OK
          </span>
        </div>
      </div>
    </div>
  );
}
