import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Initialize GoogleGenAI SDK safely
let ai: GoogleGenAI | null = null;
const API_KEY = process.env.GEMINI_API_KEY;

if (API_KEY && API_KEY !== "MY_GEMINI_API_KEY") {
  try {
    ai = new GoogleGenAI({
      apiKey: API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
    console.log("⚡ Gemini API SDK initialized successfully.");
  } catch (error) {
    console.error("Configuration error initializing Gemini API:", error);
  }
} else {
  console.warn("⚠️ GEMINI_API_KEY is missing or matching placeholder in environment. AI Coach will run in offline simulation mode.");
}

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", mode: ai ? "online" : "simulation", time: new Date().toISOString() });
});

// Real-time Translation Proxy
app.post("/api/gemini/translate", async (req, res) => {
  const { text, targetLang } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Missing text to translate." });
  }

  const target = targetLang || "fr";

  // Quick fallback translation map for offline mode
  const offlineTranslationMap: { [key: string]: { [key: string]: string } } = {
    en: {
      "harpon cosmique": "cosmic harpoon",
      "chants des abysses": "abyssal songs",
      "voiles à gravité": "gravity sails",
      "poussière de singularité": "singularity dust",
      "androïde buggé": "buggy android",
      "chronosphère": "chronosphere",
      "sillage de bioluminescence": "bioluminescent trail",
      "sérénade sidérale": "sidereal serenade",
      "casque en quartz stellaire": "stellar quartz helmet",
      "l'alliance du cachalot": "the whale alliance",
    },
    es: {
      "harpon cosmique": "arpón cósmico",
      "chants des abysses": "cantos del abismo",
      "voiles à gravité": "velas de gravedad",
      "poussière de singularité": "polvo de singularidad",
      "androïde buggé": "androide con errores",
      "chronosphère": "cronosfera",
      "sillage de bioluminescence": "estela de bioluminiscencia",
      "sérénade sidérale": "serenata sideral",
      "casque en quartz stellaire": "casco de cuarzo estelar",
      "l'alliance du cachalot": "la alianza del cachalote",
    },
    ja: {
      "harpon cosmique": "宇宙のハープーン (Cosmic Harpoon)",
      "chants des abysses": "深淵の歌 (Abyssal Chant)",
      "voiles à gravité": "重力帆 (Gravity Sail)",
      "poussière de singularité": "特異点ダスト (Singularity Dust)",
      "androïde buggé": "バグだらけのアンドロイド (Buggy Android)",
      "chronosphère": "クロノスフィア (Chronosphere)",
      "sillage de bioluminescence": "生体発光の航跡 (Bioluminescent Trail)",
      "sérénade sidérale": "星のセレナーデ (Sidereal Serenade)",
      "casque en quartz stellaire": "星英クォーツヘルメット (Stellar Quartz Helmet)",
      "l'alliance du cachalot": "マッコウクジラの同盟 (The Whale Alliance)",
    }
  };

  const getOfflineTranslation = (txt: string, lang: string) => {
    const l = lang.toLowerCase();
    const clean = txt.toLowerCase().trim();
    if (offlineTranslationMap[l] && offlineTranslationMap[l][clean]) {
      return offlineTranslationMap[l][clean];
    }
    // Generic simulated bilingual response
    if (l === "en") return `[Translated to English] ${txt}`;
    if (l === "es") return `[Traducido al Español] ${txt}`;
    if (l === "ja") return `[日本語訳] ${txt}`;
    return txt;
  };

  if (!ai) {
    return res.json({ translatedText: getOfflineTranslation(text, target) });
  }

  try {
    const prompt = `You are a high-quality real-time translator for the children's platform KIDIWORLD. 
Translate the following user-submitted creative screenplay, comment, or challenge content into the target language.
Target Language Code: ${target} (fr = French, en = English, es = Spanish, ja = Japanese).
Keep the tone child-friendly, poetic, or professional depending on the style of the text. Keep all screenplay formatting, character names capitalization, and line breaks intact exactly. Only return the translated text. Do not add any conversational preamble or markdown code blocks around the translated string.

Text to translate:
"${text}"`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        temperature: 0.3, // low temperature for precise translation
      }
    });

    const translatedText = response.text?.trim() || text;
    res.json({ translatedText });
  } catch (error) {
    console.error("Translation API Error:", error);
    res.json({ translatedText: getOfflineTranslation(text, target) });
  }
});

// Creative AI Coach Proxy
app.post("/api/gemini/coach", async (req, res) => {
  const { prompt, context, history } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Missing prompt parameter." });
  }

  // Define fallback simulated response in case API key is missing or calls fail
  const getSimulatedCoachFeedback = (userInput: string, taskCtx: any) => {
    const feedbackTemplates = [
      `Wow! C'est une idée fantastique à explorer. Travailler sur "${taskCtx?.challengeTitle || "le challenge"}" est super stimulant. Pour enrichir ton idée, as-tu pensé à intégrer l'indice du jour : "${taskCtx?.currentClue || "les éléments célestes"}" ?`,
      `Ton style d'écriture est déjà très imagé et engageant ! Pour ton scénario, essaie de donner un trait de caractère rigolo ou secret à ton personnage principal en lien avec '${taskCtx?.currentClue || "l'aventure"}'. Qui est-il vraiment ?`,
      `Incroyable créativité ! Que penses-tu d'accentuer cet aspect dans le deuxième acte de ton histoire ? Un bon rebondissement garde toujours l'audience suspendue !`,
      `Cette direction artistique est magnifique ! Pour le costume ou la musique, inspire-toi des couleurs scintillantes de notre Cachalot Stellaire. Continue comme ça, tu as l'âme d'un grand artiste !`
    ];
    return {
      text: feedbackTemplates[Math.floor(Math.random() * feedbackTemplates.length)] + 
        "\n\n*(Note : Le Coach fonctionne actuellement en mode simulation créative)*"
    };
  };

  if (!ai) {
    return res.json(getSimulatedCoachFeedback(prompt, context));
  }

  try {
    const systemInstruction = 
      "Tu es 'Linky', un coach créatif super sympa et ultra-encourageant pour la plateforme KIDIWORLD (en partenariat avec LinkYourArt). " +
      "Ton but est d'accompagner des jeunes de 12 à 18 ans à développer leurs talents créatifs (scénario, musique, dessin, design). " +
      "Sois bienveillant, inspirant, ludique mais professionnel. Donne-leur des astuces de pro : structures en 3 actes, harmonies musicales, contrastes de couleurs, etc. " +
      "Parle-leur en français chaleureux d'un ton d'égal à égal qui suscite l'enthousiasme, utilise des comparaisons inspirantes et ne fais jamais de remarques rabaissantes. " +
      "Garde tes réponses concises et structurées (max 3 courts paragraphes), idéales pour des adolescents, avec des puces claires si nécessaire.";

    const contents = [];

    // Format chat history for Gemini if present
    if (history && Array.isArray(history)) {
      for (const msg of history) {
        contents.push({
          role: msg.role === "user" ? "user" : "model",
          parts: [{ text: msg.text }]
        });
      }
    }

    // Add current user prompt with rich contextual info
    const contentText = 
      `[CONTEXTE DE CRÉATION - Défi: ${context?.challengeTitle || "Challenge général Kidiworld"}, Étape: ${context?.step || "Création libre"}]\n` +
      `[Indices révélés jusqu'ici: ${context?.cluesRevealed?.join(", ") || "Aucun pour l'instant"}]\n` +
      `[Projet de l'enfant (Brouillon/Idées actuelles): ${context?.draft || "Pas encore rédigé"}]\n\n` +
      `Message du jeune créatif : ${prompt}`;

    contents.push({
      role: "user",
      parts: [{ text: contentText }]
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.8,
      }
    });

    const text = response.text || "Désolé, j'ai eu une petite panne d'inspiration interstellaire ! Peux-tu reformuler ton idée ?";
    res.json({ text });
  } catch (error: any) {
    console.error("Gemini API Error details:", error);
    res.json(getSimulatedCoachFeedback(prompt, context));
  }
});

// Setup Vite Dev Server / Static Asset Serving
async function initializeServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("🛠️ Vite Dev Middleware loaded.");
  } else {
    // Serve static files in production
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("📦 Production static assets serving configured.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Kidiworld full-stack server running on http://0.0.0.0:${PORT}`);
  });
}

initializeServer().catch((err) => {
  console.error("Failed to start Kidiworld server:", err);
});
