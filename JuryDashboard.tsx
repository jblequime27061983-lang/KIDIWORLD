import React, { useState } from "react";
import { Star, ShieldAlert, Award, Send, Volume2, Sparkles, User, PlusCircle, CheckCircle, Calendar, Trash2 } from "lucide-react";
import { Submission, Challenge, Clue } from "../types";

interface JuryDashboardProps {
  challenge: Challenge;
  onPostFeedback: (submissionId: string, text: string, rating: number, author: string) => void;
  onAddClue: (clue: Clue) => void;
  onAdvanceTimeline: () => void;
  onResetTimeline: () => void;
  onAddNewChallenge: (title: string, subtitle: string, desc: string, sponsor: string, maxDays: number) => void;
}

export default function JuryDashboard({
  challenge,
  onPostFeedback,
  onAddClue,
  onAdvanceTimeline,
  onResetTimeline,
  onAddNewChallenge,
}: JuryDashboardProps) {
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string | null>(
    challenge.submissions.length > 0 ? challenge.submissions[0].id : null
  );

  // New feedback form states
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackAuthor, setFeedbackAuthor] = useState("Directeur Artistique @LinkYourArt");

  // New clue states (Pro admin panel)
  const [newClueTitle, setNewClueTitle] = useState("");
  const [newClueType, setNewClueType] = useState<"text" | "keyword" | "sound">("keyword");
  const [newClueDesc, setNewClueDesc] = useState("");
  const [isClueSuccess, setIsClueSuccess] = useState(false);

  // New challenge creation states
  const [newTitle, setNewTitle] = useState("");
  const [newSubtitle, setNewSubtitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newSponsor, setNewSponsor] = useState("");
  const [newMaxDays, setNewMaxDays] = useState(10);
  const [isChallengeSuccess, setIsChallengeSuccess] = useState(false);

  const selectedSubmission = challenge.submissions.find((s) => s.id === selectedSubmissionId);

  const handlePostFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubmissionId || !feedbackText.trim()) return;

    onPostFeedback(selectedSubmissionId, feedbackText.trim(), feedbackRating, feedbackAuthor);
    setFeedbackText("");
    setFeedbackRating(5);
  };

  const handleCreateClue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClueTitle.trim()) return;

    const nextDay = challenge.clues.length + 1;
    onAddClue({
      day: nextDay,
      title: newClueTitle.trim(),
      description: newClueDesc.trim() || `Indice du jour ${nextDay}`,
      type: newClueType,
      content: newClueTitle.trim(),
      isUnlocked: true,
    });

    setNewClueTitle("");
    setNewClueDesc("");
    setIsClueSuccess(true);
    setTimeout(() => setIsClueSuccess(false), 2500);
  };

  const handleCreateChallenge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddNewChallenge(
      newTitle.trim(),
      newSubtitle.trim() || "Nouveau Défi de Créative Industrie",
      newDesc.trim() || "Crée une œuvre originale !",
      newSponsor.trim() || "Professionnels LinkYourArt",
      newMaxDays
    );

    setNewTitle("");
    setNewSubtitle("");
    setNewDesc("");
    setNewSponsor("");
    setIsChallengeSuccess(true);
    setTimeout(() => setIsChallengeSuccess(false), 3000);
  };

  // Convert flat melody array back to playable notes visually or play single synth notes for preview
  const playSeqPreview = (melody: number[]) => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const frequencies = [523.25, 440.0, 392.0, 349.23, 261.63];

      // Play 8 steps rapidly in preview
      melody.forEach((val, index) => {
        if (val === 1) {
          const row = Math.floor(index / 8);
          const col = index % 8;
          const timeOffset = col * 0.18;

          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();

          osc.connect(gain);
          gain.connect(audioCtx.destination);
          
          osc.type = "sine";
          osc.frequency.setValueAtTime(frequencies[row], audioCtx.currentTime + timeOffset);
          
          gain.gain.setValueAtTime(0.12, audioCtx.currentTime + timeOffset);
          gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + timeOffset + 0.15);

          osc.start(audioCtx.currentTime + timeOffset);
          osc.stop(audioCtx.currentTime + timeOffset + 0.18);
        }
      });
    } catch (e) {
      console.warn("Audio Context init fail");
    }
  };

  return (
    <div className="space-y-8">
      {/* Banner / Admin Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <span className="text-xs font-bold px-3 py-1 bg-amber-500/10 text-amber-500 rounded-full border border-amber-500/20 uppercase tracking-wider font-mono">
            🛡️ Espace Jury & Professionnels (LinkYourArt)
          </span>
          <h2 className="text-2xl font-bold text-white tracking-tight mt-2.5">
            Dénicheur de Talents & Programmateur de Défis
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-xl">
            Modère le challenge actuel, lis les manuscrits des jeunes créatifs (12-18 ans), attribue des retours certifiés de l'industrie et gère les indices quotidiens.
          </p>
        </div>

        {/* Timeline controller simulation */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3 shrink-0">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400 font-semibold font-mono">TIMELINE SIMULÉE :</span>
            <span className="text-amber-400 font-bold font-mono">Jour {challenge.currentSimulatedDay} / {challenge.maxDays}</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onAdvanceTimeline}
              disabled={challenge.currentSimulatedDay >= challenge.maxDays}
              className="px-3.5 py-1.5 text-xs text-slate-950 bg-amber-500 hover:bg-amber-400 font-bold rounded-lg transition disabled:opacity-45"
            >
              Dévoiler index (+1 Jour)
            </button>
            <button
              onClick={onResetTimeline}
              className="px-3 text-xs text-slate-300 bg-slate-800 hover:bg-slate-700 font-bold rounded-lg transition border border-slate-700"
            >
              Réinitialiser
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Submissions list & feed */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              📝 Projets Jeunes Reçus ({challenge.submissions.length})
            </h3>

            {challenge.submissions.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-4">Aucun scénario ou costume n'a encore été soumis par les élèves.</p>
            ) : (
              <div className="space-y-3">
                {challenge.submissions.map((sub) => {
                  const isSelected = sub.id === selectedSubmissionId;
                  return (
                    <button
                      key={sub.id}
                      onClick={() => setSelectedSubmissionId(sub.id)}
                      className={`w-full p-4 rounded-2xl text-left border transition relative block ${
                        isSelected
                          ? "bg-gradient-to-r from-amber-500/10 to-amber-500/5 border-amber-500/50"
                          : "bg-slate-950 border-slate-900 hover:border-slate-800"
                      }`}
                    >
                      <div className="flex justify-between items-start gap-1">
                        <span className="text-xs font-bold text-white font-serif line-clamp-1">{sub.title}</span>
                        <span className="text-[10px] bg-slate-800 text-slate-400 font-mono px-2 py-0.5 rounded shrink-0">
                          {sub.category.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center mt-2.5">
                        <span className="text-[11px] text-slate-400 flex items-center gap-1">
                          <User className="w-3 h-3 text-slate-500" /> {sub.authorName} ({sub.authorAge} ans)
                        </span>
                        <div className="flex items-center gap-1 text-[11px] font-mono text-amber-400">
                          <Star className="w-3.5 h-3.5 fill-current" /> {sub.votes} votes
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* New Clue Creator Panel */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              📢 Lancer un nouvel Indice (Pro)
            </h3>
            <form onSubmit={handleCreateClue} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs text-slate-300 font-semibold block">Mot Clé d'Aide (Clue)</label>
                <input
                  type="text"
                  placeholder="Ex : Sphère Temporelle, Hydro-Combinaison..."
                  value={newClueTitle}
                  onChange={(e) => setNewClueTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 text-xs text-white px-3 py-2 rounded-xl focus:outline-none transition"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-slate-300 font-semibold block">Type d'indice</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["keyword", "text", "sound"] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setNewClueType(type)}
                      className={`text-[10px] py-1.5 rounded-lg border font-mono font-semibold transition ${
                        newClueType === type
                          ? "bg-amber-500 border-amber-400 text-slate-950"
                          : "bg-slate-950 border-slate-900 text-slate-400"
                      }`}
                    >
                      {type === "keyword" ? "Mot Clé" : type === "text" ? "Texte" : "Son"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-slate-300 font-semibold block">Consigne créative de l'expert</label>
                <textarea
                  placeholder="Explique aux enfants comment s'inspirer de cet indice..."
                  value={newClueDesc}
                  rows={2}
                  onChange={(e) => setNewClueDesc(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 text-xs text-white px-3 py-2 rounded-xl focus:outline-none transition resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center py-2.5 bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/35 hover:border-amber-500 text-xs font-bold rounded-xl transition"
              >
                {isClueSuccess ? "Indice Enregistré !" : "Diffuser aux Jeunes"}
              </button>
            </form>
          </div>
        </div>

        {/* Center / Right: Detailed Submission Review */}
        <div className="lg:col-span-2 space-y-6">
          {selectedSubmission ? (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
              {/* Submission Header */}
              <div className="border-b border-slate-800 pb-5">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                  <div>
                    <span className="text-xs font-semibold px-2.5 py-1 bg-amber-500/10 text-amber-500 rounded-full border border-amber-500/20">
                      🏅 Soumission certifiée KIDIWORLD
                    </span>
                    <h3 className="text-2xl font-bold font-serif text-white mt-2 leading-tight">
                      "{selectedSubmission.title}"
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Créé par <strong className="text-slate-200">{selectedSubmission.authorName}</strong>, {selectedSubmission.authorAge} ans, le {new Date(selectedSubmission.submittedAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <span className="px-3.5 py-1.5 bg-slate-950 text-white font-mono text-xs rounded-xl border border-slate-800">
                      {selectedSubmission.category.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Submissions actual body based on Category */}
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 text-slate-200 text-xs leading-relaxed max-h-[380px] overflow-y-auto">
                {selectedSubmission.category === "screenplay" && selectedSubmission.content.screenplay && (
                  <div className="space-y-4 font-mono text-xs whitespace-pre-wrap">
                    <div className="border-b border-slate-900 pb-2 mb-2 font-bold text-amber-400">ACTE I: L'INTRIGUE</div>
                    {selectedSubmission.content.screenplay.act1}
                    <div className="border-b border-slate-900 pb-2 mb-2 font-bold text-amber-400">ACTE II: CONFRONTATION</div>
                    {selectedSubmission.content.screenplay.act2}
                    <div className="border-b border-slate-900 pb-2 mb-2 font-bold text-amber-400">ACTE III: RÉSOLUTION</div>
                    {selectedSubmission.content.screenplay.act3}
                  </div>
                )}

                {selectedSubmission.category === "music" && selectedSubmission.content.music && (
                  <div className="space-y-5 text-left text-xs">
                    <div className="flex justify-between items-center bg-slate-900 p-3.5 rounded-xl border border-slate-800">
                      <div>
                        <span className="text-[10px] text-slate-400 font-mono block">Synthesizer Mode:</span>
                        <strong className="text-white font-mono">{selectedSubmission.content.music.instrument}</strong>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 font-mono block">Tempo:</span>
                        <strong className="text-white font-mono">{selectedSubmission.content.music.tempo} BPM</strong>
                      </div>
                    </div>

                    <div className="space-y-1 bg-slate-900/40 p-3.5 rounded-xl border border-slate-900">
                      <span className="text-[10px] text-violet-400 font-semibold block font-mono">🎹 Melodic Sequence Matrix:</span>
                      <div className="flex gap-1 items-center pt-2">
                        {selectedSubmission.content.music.melody.map((pt, idx) => (
                          <div
                            key={idx}
                            className={`w-3.5 h-3.5 rounded-sm ${pt === 1 ? "bg-violet-500 animate-pulse" : "bg-slate-900"}`}
                          />
                        ))}
                      </div>
                      <button
                        onClick={() => playSeqPreview(selectedSubmission.content.music!.melody)}
                        className="mt-3.5 flex items-center justify-center w-full py-2 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-lg transition text-[10px]"
                      >
                        <Volume2 className="w-3.5 h-3.5 mr-1" /> Précouter le synthé
                      </button>
                    </div>

                    <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                      <span className="text-[10px] font-bold text-slate-400 block font-mono mb-2">🎤 Paroles chantées :</span>
                      <p className="italic font-serif text-slate-300 leading-relaxed whitespace-pre-wrap">
                        {selectedSubmission.content.music.lyrics || "Pas de paroles renseignées pour ce thème."}
                      </p>
                    </div>
                  </div>
                )}

                {selectedSubmission.category === "costume" && selectedSubmission.content.costume && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left">
                    <div className="border-4 border-slate-800 bg-slate-900 rounded-xl overflow-hidden aspect-[4/3] flex items-center justify-center relative">
                      {selectedSubmission.content.costume.imageUrl ? (
                        <img
                          src={selectedSubmission.content.costume.imageUrl}
                          alt="Equipier croquis"
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="text-slate-500 italic">Pas de dessin</div>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div>
                        <span className="text-[10px] text-slate-400 font-mono block uppercase">Nom de l'équipage :</span>
                        <strong className="text-base text-pink-400 font-sans">{selectedSubmission.content.costume.name}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-mono block uppercase">Tissus & Fibres technologiques :</span>
                        <p className="text-xs text-slate-300 bg-slate-900 px-3 py-2.5 rounded-xl border border-slate-800 mt-1 leading-relaxed">
                          {selectedSubmission.content.costume.materials}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Existing Professional reviews */}
              <div className="space-y-3.5">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
                  💬 Évaluations et retours des experts ({selectedSubmission.feedback.length})
                </h4>

                {selectedSubmission.feedback.length === 0 ? (
                  <p className="text-xs text-slate-500 italic">Aucun jury n'a encore émis d'avis sur cette œuvre.</p>
                ) : (
                  <div className="space-y-3">
                    {selectedSubmission.feedback.map((f, idx) => (
                      <div key={idx} className="bg-slate-950 p-4 border border-slate-900 rounded-2xl flex gap-3 leading-relaxed">
                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-amber-400 text-xs font-bold font-mono">
                          {idx + 1}
                        </div>
                        <div className="flex-1 text-left">
                          <div className="flex justify-between items-center">
                            <strong className="text-xs text-white">{f.author}</strong>
                            <div className="flex items-center gap-0.5 text-amber-400">
                              {Array(f.rating)
                                .fill(null)
                                .map((_, s) => (
                                  <Star key={s} className="w-3 h-3 fill-current" />
                                ))}
                            </div>
                          </div>
                          <p className="text-xs text-slate-400 mt-1 whitespace-pre-wrap">{f.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Post feedback form */}
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800/60">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono block mb-3">
                  Avis Officiel du Comité
                </span>
                <form onSubmit={handlePostFeedbackSubmit} className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 space-y-1.5">
                      <label className="text-xs text-slate-300 font-semibold block">Signature d'Expert</label>
                      <input
                        type="text"
                        value={feedbackAuthor}
                        onChange={(e) => setFeedbackAuthor(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 text-xs text-white px-3 py-2 rounded-xl focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs text-slate-300 font-semibold block">Score créatif (1 à 5)</label>
                      <div className="flex items-center gap-1.5 pt-1.5">
                        {[1, 2, 3, 4, 5].map((num) => (
                          <button
                            key={num}
                            type="button"
                            onClick={() => setFeedbackRating(num)}
                            className="text-amber-500 hover:scale-110 active:scale-90 transition"
                          >
                            <Star className={`w-5 h-5 ${feedbackRating >= num ? "fill-current" : ""}`} />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-300 font-semibold block">Conseil de pro & appréciation constructive</label>
                    <textarea
                      placeholder="Donne d'excellentes astuces à ce jeune auteur. Valorise sa gestion des indices..."
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                      rows={3}
                      className="w-full bg-slate-900 border border-slate-800 text-xs text-white px-3 py-2.5 rounded-xl focus:outline-none focus:border-amber-500 resize-none leading-relaxed"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl shadow-md transition transform active:scale-95"
                  >
                    Déposer mon visa pro de scénario @ LinkYourArt
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="h-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl flex flex-col items-center justify-center text-slate-500 italic">
              Aucun projet sélectionné.
            </div>
          )}
        </div>
      </div>

      {/* New Challenge Creator */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
        <div className="flex items-center gap-2">
          <PlusCircle className="w-6 h-6 text-amber-400" />
          <h3 className="text-lg font-bold text-white">Lancer un Tout Nouveau Challenge Créatif</h3>
        </div>

        <form onSubmit={handleCreateChallenge} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs text-slate-300 font-semibold block font-mono">TITRE DU DÉFI</label>
              <input
                type="text"
                placeholder="Ex : Les Aventures de la Planète de Plonge"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-sm text-white px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-300 font-semibold block font-mono">INDUSTRIE PARTENAIRE & PARRAIN</label>
              <input
                type="text"
                placeholder="Ex : Céline Sciamma - Styliste de Film"
                value={newSponsor}
                onChange={(e) => setNewSponsor(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-sm text-white px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-300 font-semibold block font-mono">DURÉE DES INDICES DANS LE DÉFI (JOURS)</label>
              <input
                type="number"
                min="3"
                max="14"
                value={newMaxDays}
                onChange={(e) => setNewMaxDays(parseInt(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 text-sm text-white px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="space-y-4 flex flex-col justify-between">
            <div className="space-y-1.5">
              <label className="text-xs text-slate-300 font-semibold block font-mono">RÉSUMÉ ET INSTRUCTIONS</label>
              <textarea
                placeholder="Décris le challenge créatif pour les enfants..."
                value={newDesc}
                rows={5}
                onChange={(e) => setNewDesc(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-xs text-white px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-amber-500 resize-none leading-relaxed"
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center py-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold rounded-2xl shadow-lg transition"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              {isChallengeSuccess ? "Challenge Publié !" : "Publier le Défi sur KIDIWORLD"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
