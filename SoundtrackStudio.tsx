import React, { useState, useEffect, useRef } from "react";
import { Play, Square, Music, Volume2, Sparkles, Wand2, CheckCircle } from "lucide-react";

interface SoundtrackStudioProps {
  onSaveSoundtrack: (melody: number[], instrument: string, lyrics: string, tempo: number) => void;
  savedSoundtrack?: { melody: number[]; instrument: string; lyrics: string; tempo: number };
}

export default function SoundtrackStudio({ onSaveSoundtrack, savedSoundtrack }: SoundtrackStudioProps) {
  const [instrument, setInstrument] = useState(savedSoundtrack?.instrument || "space-piano");
  const [tempo, setTempo] = useState(savedSoundtrack?.tempo || 120);
  const [lyrics, setLyrics] = useState(savedSoundtrack?.lyrics || "");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // 8 steps, 4 pitch levels: C5(high), A4, F4, G4, C4(low)
  const pitchFrequencies = [523.25, 440.0, 392.0, 349.23, 261.63]; // C5, A4, G4, F4, C4
  const pitchNames = ["Do 5 (Haut)", "La 4", "Sol 4", "Fa 4", "Do 4 (Bas)"];

  // Initialize melody matrix grid: 5 pitches x 8 steps
  const [grid, setGrid] = useState<boolean[][]>(() => {
    if (savedSoundtrack?.melody && savedSoundtrack.melody.length === 40) {
      const g: boolean[][] = [];
      for (let r = 0; r < 5; r++) {
        g.push(savedSoundtrack.melody.slice(r * 8, r * 8 + 8).map(v => v === 1));
      }
      return g;
    }
    // Default pleasant arpeggio pattern
    const defaultGrid = Array(5).fill(null).map(() => Array(8).fill(false));
    defaultGrid[0][0] = true;
    defaultGrid[1][2] = true;
    defaultGrid[2][4] = true;
    defaultGrid[3][6] = true;
    defaultGrid[4][7] = true;
    return defaultGrid;
  });

  const audioCtxRef = useRef<AudioContext | null>(null);
  const playIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Toggle cell on grid
  const toggleCell = (row: number, col: number) => {
    const nextGrid = grid.map((r, rIdx) =>
      r.map((cell, cIdx) => (rIdx === row && cIdx === col ? !cell : cell))
    );
    setGrid(nextGrid);
    // Play the note single shot on click to give immediate feedback
    playTone(pitchFrequencies[row], 0.15);
  };

  const playTone = (frequency: number, duration: number) => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      // Select waveform based on instrument selection
      if (instrument === "space-piano") {
        osc.type = "sine";
      } else if (instrument === "cosmic-synth") {
        osc.type = "triangle";
      } else if (instrument === "pulsar-laser") {
        osc.type = "sawtooth";
      } else {
        osc.type = "square";
      }

      osc.frequency.setValueAtTime(frequency, ctx.currentTime);

      // Creative Envelope styling
      gainNode.gain.setValueAtTime(0.18, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      console.warn("Web Audio API not supported in the current container iframe browser state.");
    }
  };

  // Sound loop generator
  useEffect(() => {
    if (isPlaying) {
      const stepDuration = (60 / tempo) / 2; // eighth notes
      let step = 0;
      setCurrentStep(0);

      playIntervalRef.current = setInterval(() => {
        // Find which pitches are active on current step
        for (let row = 0; row < 5; row++) {
          if (grid[row][step]) {
            playTone(pitchFrequencies[row], 0.25);
          }
        }
        setCurrentStep(step);
        step = (step + 1) % 8;
      }, stepDuration * 1000);
    } else {
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current);
      }
      setCurrentStep(-1);
    }

    return () => {
      if (playIntervalRef.current) clearInterval(playIntervalRef.current);
    };
  }, [isPlaying, grid, tempo, instrument]);

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSaveMusic = () => {
    // Flatten grid to 1D array of 40 numbers (0 or 1) for database submission
    const melody: number[] = [];
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 8; c++) {
        melody.push(grid[r][c] ? 1 : 0);
      }
    }
    onSaveSoundtrack(melody, instrument, lyrics, tempo);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  // Generate magical cosmic lyrics boilerplate
  const handleAutoLyrics = () => {
    const starryLyrics = [
      "Dans l'infini du noir de jais / Flotte notre cachalot étoilé / Le harpon cosmique est ancré \nPour amener la sérénité...",
      "Baleine stellaire du firmament / Tu traces un sillage d'argent / Tes ondes parlent profondément \nÀ travers ce vide géant...",
      "Naviguons, naviguons dans la nébuleuse / Sous la lumière chaleureuse / Ton chant de lumière cristalline \nSauve de la solitude orpheline..."
    ];
    setLyrics(starryLyrics[Math.floor(Math.random() * starryLyrics.length)]);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-violet-500/10 text-violet-400 rounded-full border border-violet-500/20">
            🎵 Défi Musique & Sound Design
          </span>
          <h3 className="text-xl font-bold tracking-tight text-white mt-1.5 flex items-center gap-2">
            Studio Musical Galactique <Music className="w-5 h-5 text-violet-400" />
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Rejoins l'équipage créatif en composant le thème musical officiel du film avec notre synthétiseur interactif !
          </p>
        </div>

        {/* Play/Stop controls */}
        <button
          onClick={togglePlayback}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold shadow-lg transition active:scale-95 ${
            isPlaying
              ? "bg-rose-500 hover:bg-rose-400 text-white"
              : "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-violet-950/20"
          }`}
        >
          {isPlaying ? (
            <>
              <Square className="w-4 h-4 fill-current" /> Arrêter la Boucle
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" /> Écouter le Thème
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Playback Configuration */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono block">Paramétrage Synthé</span>

            {/* Instrument Selection */}
            <div className="space-y-1.5">
              <label className="text-xs text-slate-300 font-semibold block">Synthétiseur</label>
              <select
                value={instrument}
                onChange={(e) => setInstrument(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 focus:border-violet-500 text-xs text-white px-3 py-2 rounded-xl focus:outline-none transition appearance-none"
              >
                <option value="space-piano">🎹 Piano Cosmique (Onde Sinusoïdale)</option>
                <option value="cosmic-synth">🛸 Flûte Galactique (Onde Triangulaire)</option>
                <option value="pulsar-laser">☄️ Laser Pulsar (Onde en Dents de Scie)</option>
                <option value="retro-arcade">👾 Arcade 8-Bit (Onde Carrée)</option>
              </select>
            </div>

            {/* Tempo Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-semibold">Tempo (Vitesse)</span>
                <span className="text-violet-400 font-mono font-bold">{tempo} BPM</span>
              </div>
              <input
                type="range"
                min="60"
                max="200"
                value={tempo}
                onChange={(e) => setTempo(parseInt(e.target.value))}
                className="w-full accent-violet-500 cursor-pointer"
              />
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-950/30 to-slate-950 p-4 rounded-2xl border border-indigo-500/10 text-xs text-slate-400 space-y-2">
            <span className="flex items-center gap-1.5 font-semibold text-indigo-300">
              <Volume2 className="w-4 h-4 text-violet-400" /> Mode d'Emploi
            </span>
            <p className="leading-relaxed">
              Clique sur les cases de la grille pour allumer des notes du synthétiseur. La ligne blanche clignotante indique le temps actuel. Mixe tes harmonies !
            </p>
          </div>
        </div>

        {/* 8-step Musical Sequencer Grid */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 overflow-x-auto">
            <div className="min-w-[420px] space-y-3">
              <div className="flex justify-between items-center text-[10px] text-slate-500 uppercase tracking-wider font-mono px-2">
                <span>Gamme Celesete</span>
                <div className="flex gap-2.5">
                  {Array(8).fill(null).map((_, idx) => (
                    <span key={idx} className={`w-8 text-center ${currentStep === idx ? "text-violet-400 font-bold" : ""}`}>
                      T{idx + 1}
                    </span>
                  ))}
                </div>
              </div>

              {/* Rows */}
              <div className="space-y-2">
                {grid.map((row, rIdx) => (
                  <div key={rIdx} className="flex justify-between items-center gap-4">
                    <span className="text-xs text-slate-400 font-serif w-24 truncate">{pitchNames[rIdx]}</span>
                    <div className="flex gap-2">
                      {row.map((cellActive, cIdx) => (
                        <button
                          key={cIdx}
                          onClick={() => toggleCell(rIdx, cIdx)}
                          className={`w-8 h-8 rounded-lg border-2 transition transform duration-100 active:scale-90 ${
                            cellActive
                              ? "bg-violet-500 border-violet-400 shadow-lg shadow-violet-500/40"
                              : "bg-slate-900 border-slate-800 hover:border-slate-700"
                          } ${currentStep === cIdx ? "ring-2 ring-amber-400" : ""}`}
                          title={`Note du temps ${cIdx + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Lyrics & Save block */}
        <div className="lg:col-span-1 flex flex-col justify-between space-y-4">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono block">Chanson & Paroles</span>
              <button
                onClick={handleAutoLyrics}
                className="text-[10px] flex items-center gap-1 text-violet-400 hover:text-violet-300 font-bold transition"
              >
                <Wand2 className="w-3 h-3" /> Générateur
              </button>
            </div>

            <textarea
              placeholder="Écris un poème ou des paroles inspirées des indices ! Ex : Dans le noir stellaire, le cachalot danse..."
              value={lyrics}
              onChange={(e) => setLyrics(e.target.value)}
              rows={4}
              className="w-full bg-slate-900 border border-slate-800 focus:border-violet-500 text-xs text-white px-3 py-2 rounded-xl focus:outline-none transition resize-none leading-relaxed"
            />
          </div>

          <button
            onClick={handleSaveMusic}
            className={`w-full flex items-center justify-center py-3.5 px-4 font-bold rounded-2xl transition shadow-lg ${
              savedSuccess
                ? "bg-emerald-500 text-white"
                : "bg-violet-500 hover:bg-violet-400 text-white hover:shadow-violet-500/25 active:scale-95"
            }`}
          >
            {savedSuccess ? (
              <>
                <CheckCircle className="w-5 h-5 mr-2 animate-bounce" />
                Thème Audio Sauvegardé !
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Enregistrer la Musique
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
