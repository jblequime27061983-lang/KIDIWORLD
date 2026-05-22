import React, { useState, useEffect } from "react";
import { BookOpen, Sparkles, AlertCircle, Quote, Check, FileDown } from "lucide-react";
import { jsPDF } from "jspdf";

interface ScreenplayLine {
  type: "scene" | "character" | "parenthetical" | "dialogue" | "action" | "transition";
  text: string;
}

function parseActText(text: string): ScreenplayLine[] {
  const rawLines = text.split("\n");
  const parsed: ScreenplayLine[] = [];
  
  let lastWasCharacter = false;

  for (let i = 0; i < rawLines.length; i++) {
    const lineObj = rawLines[i].trim();
    if (lineObj === "") {
      lastWasCharacter = false;
      continue;
    }

    const upperLine = lineObj.toUpperCase();
    if (
      upperLine === "DIALOGUÉ :" || 
      upperLine === "DIALOGUE :" || 
      upperLine === "DIALOGUES :" || 
      upperLine === "DIALOGUÉ"
    ) {
      continue;
    }

    // Determine type
    if (
      upperLine.startsWith("SCÈNE") || 
      upperLine.startsWith("SCENE") || 
      upperLine.startsWith("INT.") || 
      upperLine.startsWith("EXT.") || 
      upperLine.startsWith("INT/EXT") ||
      upperLine.startsWith("SÉQUENCE") ||
      upperLine.startsWith("SEQUENCE")
    ) {
      parsed.push({ type: "scene", text: lineObj });
      lastWasCharacter = false;
    }
    else if (lineObj.startsWith("(") && lineObj.endsWith(")")) {
      parsed.push({ type: "parenthetical", text: lineObj });
      lastWasCharacter = false;
    }
    else if (
      upperLine.endsWith("TRANSITION :") || 
      upperLine === "CUT TO:" || 
      upperLine === "FLOU :" || 
      upperLine === "FADE OUT" ||
      upperLine === "RACCORD :"
    ) {
      parsed.push({ type: "transition", text: lineObj });
      lastWasCharacter = false;
    }
    else if (
      lineObj.length <= 30 && 
      lineObj === upperLine && 
      !lineObj.includes(":") && 
      !lineObj.includes(",") && 
      !lineObj.includes("...") &&
      !lineObj.startsWith("DESCRIPTION") &&
      !lineObj.startsWith("ACTE")
    ) {
      parsed.push({ type: "character", text: lineObj });
      lastWasCharacter = true;
    }
    else {
      if (lastWasCharacter) {
        parsed.push({ type: "dialogue", text: lineObj });
      } else {
        let cleanText = lineObj;
        if (upperLine.startsWith("DESCRIPTION :")) {
          cleanText = lineObj.substring(13).trim();
        } else if (upperLine.startsWith("DESCRIPTION:")) {
          cleanText = lineObj.substring(12).trim();
        }
        parsed.push({ type: "action", text: cleanText });
        lastWasCharacter = false;
      }
    }
  }

  return parsed;
}

interface ScreenplayEditorProps {
  unlockedClues: string[];
  onSaveScreenplay: (act1: string, act2: string, act3: string, title: string) => void;
  savedScreenplay?: { act1: string; act2: string; act3: string; title: string };
}

export default function ScreenplayEditor({ unlockedClues, onSaveScreenplay, savedScreenplay }: ScreenplayEditorProps) {
  const [title, setTitle] = useState(savedScreenplay?.title || "");
  const [act1, setAct1] = useState(savedScreenplay?.act1 || "");
  const [act2, setAct2] = useState(savedScreenplay?.act2 || "");
  const [act3, setAct3] = useState(savedScreenplay?.act3 || "");
  const [currentTab, setCurrentTab] = useState<"act1" | "act2" | "act3">("act1");
  const [clueStatus, setClueStatus] = useState<{ [key: string]: boolean }>({});
  const [editorMode, setEditorMode] = useState<"edit" | "preview">("edit");

  const defaultTemplates = {
    act1: "SCÈNE 1 - L'ANCRAGE DU HARPON\nDescription : Le navire spatial flotte au bord de la Nébuleuse d'Or. À la passerelle, le capitaine s'impatiente.\n\nDIALOGUÉ :\nLE CAPITAINE\nLancez le harpon cosmique ! Allons chercher la poussière de singularité.\n\n",
    act2: "SCÈNE 2 - CHANT DANS L'ABÎME\nDescription : Les voiles à gravité vibrent alors qu'un énorme sillage d'eau dorée se dessine sous la coque. Un androïde buggé regarde par le hublot.\n\nDIALOGUÉ :\nL'ANDROÏDE\nJ'entends la symphonie dans l'abîme stellaire... Les cachalots chantent.\n\n",
    act3: "SCÈNE 3 - L'HARMONIE RETROUVÉE\nDescription : Tous les instruments se calibrent. La musique s'accorde au sifflement sublime de la bête.\n\nDIALOGUÉ :\nLE CAPITAINE\nNotre scénario se termine ici, au cœur des étoiles.\n\n"
  };

  const handleApplyTemplate = () => {
    if (!act1) setAct1(defaultTemplates.act1);
    if (!act2) setAct2(defaultTemplates.act2);
    if (!act3) setAct3(defaultTemplates.act3);
    if (!title) setTitle("L'Alliance du Cachalot d'Argent");
  };

  // Check which keywords (unlocked clues) are used in the text blocks
  useEffect(() => {
    const combinedText = (title + " " + act1 + " " + act2 + " " + act3).toLowerCase();
    const nextStatus: { [key: string]: boolean } = {};
    
    unlockedClues.forEach((clue) => {
      // Create flexible regex-friendly check for indices matching
      const cleanClue = clue.replace(/[^\w\sàéèêëîïôöûüç]/gi, "").toLowerCase().trim();
      if (cleanClue.length > 2) {
        nextStatus[clue] = combinedText.includes(cleanClue);
      } else {
        nextStatus[clue] = false;
      }
    });

    setClueStatus(nextStatus);
  }, [title, act1, act2, act3, unlockedClues]);

  const [author, setAuthor] = useState(() => {
    return localStorage.getItem("screenplay_author_name") || "Jeune Scénariste";
  });

  useEffect(() => {
    localStorage.setItem("screenplay_author_name", author);
  }, [author]);

  const handleExportPDF = () => {
    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "letter"
      });

      // 1. Title Page
      const pdfTitle = (title || "SANS TITRE").toUpperCase();
      const pdfAuthor = author || "Jeune Scénariste";

      doc.setFont("courier", "bold");
      doc.setFontSize(18);
      const wrappedTitleLines: string[] = doc.splitTextToSize(pdfTitle, 400);
      let titleY = 280;
      wrappedTitleLines.forEach((tLine) => {
        doc.text(tLine, 306, titleY, { align: "center" });
        titleY += 22;
      });

      doc.setFont("courier", "normal");
      doc.setFontSize(11);
      doc.text("Écrit par", 306, 350, { align: "center" });

      doc.setFont("courier", "bold");
      doc.setFontSize(13);
      doc.text(pdfAuthor, 306, 375, { align: "center" });

      doc.setFont("courier", "normal");
      doc.setFontSize(10);
      doc.text("KIDI GAMES - LABO DE JEUX MOBILES", 108, 640);
      const currentDate = new Date().toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric"
      });
      doc.text(`Généré le : ${currentDate}`, 108, 660);
      doc.text("Format Standard : Police Courier 10pt (équiv. 12pt Papier)", 108, 680);

      // Coordinates
      let pageCount = 0;
      let y = 72;

      const startContentPage = () => {
        doc.addPage();
        pageCount++;
        y = 72; // Reset top margin
        
        // Write standard screenplay page number at top right of content page
        doc.setFont("courier", "normal");
        doc.setFontSize(10);
        doc.text(`${pageCount}.`, 540, 45, { align: "right" });
      };

      const checkPageSpace = (neededHeight: number) => {
        if (y + neededHeight > 720) {
          startContentPage();
        }
      };

      const drawFormattedBlock = (
        text: string,
        type: "scene" | "character" | "parenthetical" | "dialogue" | "action" | "transition"
      ) => {
        let fontStyle = "normal";
        let fontSize = 10;
        let leftX = 108; // X coordinate
        let blockWidth = 432; // Width
        let align = "left";

        if (type === "scene") {
          fontStyle = "bold";
        } else if (type === "character") {
          fontStyle = "bold";
          leftX = 240;
          blockWidth = 200;
        } else if (type === "parenthetical") {
          fontStyle = "normal";
          leftX = 190;
          blockWidth = 180;
        } else if (type === "dialogue") {
          fontStyle = "normal";
          leftX = 160;
          blockWidth = 250;
        } else if (type === "transition") {
          fontStyle = "bold";
          align = "right";
          leftX = 540;
        }

        doc.setFont("courier", fontStyle);
        doc.setFontSize(fontSize);

        let lines: string[] = [];
        if (type === "transition") {
          lines = [text];
        } else {
          lines = doc.splitTextToSize(text, blockWidth);
        }

        // Standard screenplay spacing before blocks
        let spaceBefore = 10;
        if (type === "scene") spaceBefore = 24;
        if (type === "character") spaceBefore = 14;
        if (type === "parenthetical") spaceBefore = 2;
        if (type === "dialogue") spaceBefore = 2;
        if (type === "transition") spaceBefore = 12;

        if (y > 72) {
          y += spaceBefore;
        }

        const blockHeight = lines.length * 14;
        checkPageSpace(blockHeight);

        lines.forEach((line) => {
          if (align === "right") {
            doc.text(line, leftX, y, { align: "right" });
          } else {
            doc.text(line, leftX, y);
          }
          y += 14;
        });
      };

      // Helper to append a full parsed Act to the PDF standard script stream
      const renderAct = (actTitle: string, actText: string) => {
        if (!actText.trim()) return;

        // Introduce standard Act Heading in bold centered
        checkPageSpace(60);
        y += 20;
        doc.setFont("courier", "bold");
        doc.setFontSize(11);
        doc.text(actTitle.toUpperCase(), 306, y, { align: "center" });
        y += 24;

        const lines = parseActText(actText);
        lines.forEach((lineBlock) => {
          drawFormattedBlock(lineBlock.text, lineBlock.type);
        });
      };

      // Begin writing screenplay content pages
      // This will add page 2 of document (which is script page 1)
      startContentPage();

      renderAct("ACTE I : L'INTRIGUE", act1);
      
      if (act2.trim()) {
        startContentPage(); // New page for Act II
        renderAct("ACTE II : LA CONFRONTATION", act2);
      }
      
      if (act3.trim()) {
        startContentPage(); // New page for Act III
        renderAct("ACTE III : LA RÉSOLUTION", act3);
      }

      // Safe filename conversion
      const safeTitle = (title || "mon_scenario_stellaire")
        .toLowerCase()
        .replace(/[^a-z0-9]/gi, "_")
        .substring(0, 30);
      doc.save(`scenario_${safeTitle}.pdf`);
    } catch (err) {
      console.error("Erreur lors de la génération du PDF standard:", err);
      alert("Une erreur s'est produite lors de la génération du PDF.");
    }
  };

  // Save changes
  const handleSave = () => {
    onSaveScreenplay(act1, act2, act3, title || "Mon Scénario Stellaire");
  };

  const totalUsedClues = Object.values(clueStatus).filter(Boolean).length;
  const totalClues = unlockedClues.length;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-amber-500/10 text-amber-400 rounded-full border border-amber-500/20">
            🎬 Défi Écriture Cinéma
          </span>
          <h3 className="text-xl font-bold tracking-tight text-white mt-1.5 flex items-center gap-2">
            Rédacteur de Scénario <BookOpen className="w-5 h-5 text-amber-400" />
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Chaque jour, Lucas Besson a lancé un conseil de pro. Combine-les tous pour créer ton aventure animée !
          </p>
        </div>

        {/* Templates setup helper */}
        <button
          onClick={handleApplyTemplate}
          className="text-xs flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Utiliser un modèle de départ
        </button>
      </div>

      {/* Checklist tracking clues matching */}
      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80">
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider">
            📊 Indices intégrés : {totalUsedClues} / {totalClues}
          </span>
          {totalClues > 0 && totalUsedClues === totalClues && (
            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 font-bold px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
              <Check className="w-3" /> Défi Contraintes Réussi !
            </span>
          )}
        </div>

        {totalClues === 0 ? (
          <p className="text-xs text-slate-500 italic">Le jury n'a pas encore dévoilé d'indices pour ce challenge.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {unlockedClues.map((clue, idx) => {
              const isUsed = clueStatus[clue];
              return (
                <span
                  key={idx}
                  className={`text-xs font-mono py-1 px-3 rounded-xl border flex items-center gap-1.5 transition ${
                    isUsed
                      ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                      : "bg-slate-900/50 border-slate-800 text-slate-50 relative opacity-70 group"
                  }`}
                  title={isUsed ? `Bravo ! Tu as écrit '${clue}'` : `Écris '${clue}' pour cocher cet indice.`}
                >
                  <span className={`w-2 h-2 rounded-full ${isUsed ? "bg-amber-400" : "bg-slate-700"}`} />
                  {clue}
                  {isUsed && <Check className="w-3 h-3" />}
                </span>
              );
            })}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Editor Screenplays Panel */}
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs text-slate-300 font-semibold block">Titre de l'œuvre originale</label>
              <input
                type="text"
                placeholder="Saisis le titre de ton court-métrage..."
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  onSaveScreenplay(act1, act2, act3, e.target.value);
                }}
                className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 text-sm font-semibold text-white px-4 py-3 rounded-2xl focus:outline-none transition placeholder-slate-600 font-medium"
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-xs text-slate-300 font-semibold block">Auteur / Scénariste(s)</label>
              <input
                type="text"
                placeholder="Nom du scénariste (ex. Luc Besson, ...)"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 text-sm font-semibold text-white px-4 py-3 rounded-2xl focus:outline-none transition placeholder-slate-600 font-medium"
              />
            </div>
          </div>

          {/* Act Tabs */}
          <div className="bg-slate-950 p-1.5 rounded-2xl border border-slate-800 flex gap-2">
            <button
              onClick={() => setCurrentTab("act1")}
              className={`flex-1 text-center py-2.5 text-xs font-bold rounded-xl transition ${
                currentTab === "act1" ? "bg-slate-800 text-white shadow" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              🚀 Acte I : L'Intrigue
            </button>
            <button
              onClick={() => setCurrentTab("act2")}
              className={`flex-1 text-center py-2.5 text-xs font-bold rounded-xl transition ${
                currentTab === "act2" ? "bg-slate-800 text-white shadow" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              🌊 Acte II : Le Confrontation
            </button>
            <button
              onClick={() => setCurrentTab("act3")}
              className={`flex-1 text-center py-2.5 text-xs font-bold rounded-xl transition ${
                currentTab === "act3" ? "bg-slate-800 text-white shadow" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              🎵 Acte III : La Résolution
            </button>
          </div>

          {/* Core Textarea or Live Preview */}
          <div className="bg-slate-950 rounded-2xl border border-slate-800 p-4 space-y-4 relative">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">
                Éditeur de Script : {currentTab.toUpperCase()}
              </span>
              
              <div className="flex bg-slate-900 rounded-lg p-0.5 border border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditorMode("edit")}
                  className={`px-3 py-1 text-[10px] font-bold rounded-md transition ${
                    editorMode === "edit" ? "bg-amber-500 text-slate-950 shadow" : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Saisie Texte
                </button>
                <button
                  type="button"
                  onClick={() => setEditorMode("preview")}
                  className={`px-3 py-1 text-[10px] font-bold rounded-md transition flex items-center gap-1 ${
                    editorMode === "preview" ? "bg-amber-500 text-slate-950 shadow" : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <span>🎬 Aperçu Cinéma</span>
                </button>
              </div>
            </div>

            {editorMode === "preview" ? (
              <div className="bg-slate-900 rounded-xl p-5 border border-slate-800 min-h-[280px] font-mono text-xs overflow-y-auto max-h-[350px] space-y-3 shadow-inner scrollbar-thin">
                <div className="text-center text-[9px] text-slate-500 border-b border-slate-800/80 pb-2 mb-3 uppercase tracking-wider">
                  Rendu Temps Réel : Standard de l'Industrie du Cinéma
                </div>
                {(() => {
                  const activeText = currentTab === "act1" ? act1 : currentTab === "act2" ? act2 : act3;
                  const parsedLines = parseActText(activeText);
                  
                  if (parsedLines.length === 0) {
                    return (
                      <p className="text-slate-500 italic text-center py-12">
                        Le texte de cet acte est vide ou ne respecte pas encore le format.<br />
                        Saisis des dialogues et des scènes pour voir la mise en scène automatique !
                      </p>
                    );
                  }

                  return (
                    <div className="space-y-3 max-w-lg mx-auto py-1">
                      {parsedLines.map((block, index) => {
                        if (block.type === "scene") {
                          return (
                            <div key={index} className="text-white font-extrabold uppercase tracking-wide mt-5 text-[11px] border-b border-slate-800 pb-1 pt-1">
                              {block.text}
                            </div>
                          );
                        }
                        if (block.type === "character") {
                          return (
                            <div key={index} className="text-amber-400 font-extrabold text-center uppercase tracking-wider mt-4">
                              {block.text}
                            </div>
                          );
                        }
                        if (block.type === "parenthetical") {
                          return (
                            <div key={index} className="text-slate-400 text-center italic text-[10px] -mt-1 block">
                              {block.text}
                            </div>
                          );
                        }
                        if (block.type === "dialogue") {
                          return (
                            <div key={index} className="max-w-[75%] mx-auto text-slate-200 text-center text-xs leading-relaxed font-semibold mb-2 bg-slate-950/40 py-1.5 px-3 rounded-lg border border-slate-800/30">
                              "{block.text}"
                            </div>
                          );
                        }
                        if (block.type === "transition") {
                          return (
                            <div key={index} className="text-pink-400 text-right font-bold tracking-widest text-[10px] uppercase my-2">
                              {block.text}
                            </div>
                          );
                        }
                        // Default is action description
                        return (
                          <div key={index} className="text-slate-400 text-left text-xs leading-relaxed mb-2 font-medium italic pl-3 border-l-2 border-slate-800">
                            {block.text}
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>
            ) : (
              <div className="min-h-[280px]">
                {currentTab === "act1" && (
                  <textarea
                    placeholder="Rédige l'Acte I... Introduis tes personnages et énonce la découverte du Harpon Cosmique."
                    value={act1}
                    onChange={(e) => {
                      setAct1(e.target.value);
                      onSaveScreenplay(e.target.value, act2, act3, title);
                    }}
                    rows={12}
                    className="w-full bg-transparent border-0 text-sm text-slate-200 focus:outline-none font-mono resize-none leading-relaxed"
                  />
                )}
                {currentTab === "act2" && (
                  <textarea
                    placeholder="Rédige l'Acte II... Raconte les difficultés au sein de la Nébuleuse d'Or et comment l'androïde communique avec le cachalot."
                    value={act2}
                    onChange={(e) => {
                      setAct2(e.target.value);
                      onSaveScreenplay(act1, e.target.value, act3, title);
                    }}
                    rows={12}
                    className="w-full bg-transparent border-0 text-sm text-slate-200 focus:outline-none font-mono resize-none leading-relaxed"
                  />
                )}
                {currentTab === "act3" && (
                  <textarea
                    placeholder="Rédige l'Acte III... Apporte la résolution de l'histoire grâce aux voiles de gravité et la symphonie sonore."
                    value={act3}
                    onChange={(e) => {
                      setAct3(e.target.value);
                      onSaveScreenplay(act1, act2, e.target.value, title);
                    }}
                    rows={12}
                    className="w-full bg-transparent border-0 text-sm text-slate-200 focus:outline-none font-mono resize-none leading-relaxed"
                  />
                )}
              </div>
            )}
          </div>
        </div>

        {/* Cinematic Tips & Direct Save */}
        <div className="lg:col-span-1 flex flex-col justify-between space-y-4">
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono block">
              💡 Conseils d'Écriture de Lucas
            </span>

            <div className="space-y-3.5 divide-y divide-slate-900">
              <div className="text-xs text-slate-400 leading-relaxed pt-0">
                <span className="text-amber-400 font-semibold block mb-1">🎭 Structure dialogue :</span>
                Écris le nom du personnage EN MAJUSCULES au centre avant qu'il ne parle. Cela facilite la lecture des acteurs !
              </div>

              <div className="text-xs text-slate-400 leading-relaxed pt-3">
                <span className="text-amber-400 font-semibold block mb-1">☄️ Utilise les indices :</span>
                N'ajoute pas les mots magiques n'importe comment. Intègre-les dans les actions des personnages pour créer de la poésie.
              </div>

              <div className="text-xs text-slate-400 leading-relaxed pt-3">
                <span className="text-amber-400 font-semibold block mb-1">🐳 Construis ton équipe :</span>
                Fais appel aux stylistes et musiciens du jeu. Demande-leur de dessiner les combinaisons de ton équipage !
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleSave}
              className="w-full flex items-center justify-center py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-2xl shadow-lg transition active:scale-95 hover:shadow-amber-500/20 cursor-pointer"
            >
              Sauvegarder les Textes (.SCR)
            </button>

            <button
              onClick={handleExportPDF}
              className="w-full flex items-center justify-center gap-2 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl shadow-md transition border border-slate-700 active:scale-95 hover:shadow-slate-500/10 cursor-pointer"
            >
              <FileDown className="w-5 h-5 text-red-400" /> Exporter en PDF (Format Cinéma)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
