import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import DrawingBoard from "./components/DrawingBoard";
import SoundtrackStudio from "./components/SoundtrackStudio";
import ScreenplayEditor from "./components/ScreenplayEditor";
import AICreativeCoach from "./components/AICreativeCoach";
import JuryDashboard from "./components/JuryDashboard";
import ProfileSetup from "./components/ProfileSetup";
import TranslatedText from "./components/TranslatedText";
import ChallengeCard from "./components/ChallengeCard";
import AccountAuth, { AccountSession } from "./components/AccountAuth";
import KidiMusic from "./components/KidiMusic";
import KidiGaming from "./components/KidiGaming";
import { Challenge, Submission, Clue, UserProfile } from "./types";
import { 
  Sparkles, 
  Calendar, 
  BookOpen, 
  Music, 
  Palette, 
  Check, 
  Play, 
  Send, 
  Bot, 
  Shield, 
  HelpCircle, 
  Heart, 
  Star, 
  Award, 
  ChevronRight,
  Filter,
  Globe,
  Lock,
  Compass,
  Zap,
  Clock,
  Gamepad2,
  Coins,
  Search,
  ArrowLeft,
  ArrowRight,
  Film,
  PenTool,
  Volume2,
  Users
} from "lucide-react";

// List of creative promotional visual artworks with custom prompts and gradients for dynamic refresh
const BANNER_VISUALS = [
  {
    slogan: "Stimule activement ton talent créatif !",
    description: "Découvre des dizaines de challenges d'écriture, de dessin de mode et d'harmonie sonore, disponibles en Version Démo d'essai pour apprendre, puis en Vrai Concours évalué par de véritables experts professionnels du cinéma d'animation !",
    imagePath: "/src/assets/images/kidiworld_hero_banner_1779248938176.png",
    badge: "🌍 LinkYourArt Incubator & KidiWorld",
    gradient: "from-slate-950 via-slate-950/80 to-indigo-950/20"
  },
  {
    slogan: "Deviens le prodige de ton propre cinéma d'animation !",
    description: "Structure ton scénario d'aventure en trois actes, sélectionne des dialogues magiques guidés par l'androïde buggé, et attire l'attention des comités de vote de LinkYourArt pro !",
    imagePath: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200", 
    badge: "🎨 Académie d'Animation Sidérale",
    gradient: "from-slate-950 via-slate-950/80 to-purple-950/30"
  },
  {
    slogan: "Harmonise tes rêves avec la librairie Kidi Music !",
    description: "Décode des vibrations chiptune comiques, compose de douces sérénades spatiales ou écoute des morceaux premium fantastiques avec ta réserve de KidiCoins récompensés !",
    imagePath: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1200",
    badge: "🎵 Studio d'Harmonie & Clavier d'Or",
    gradient: "from-slate-950 via-slate-950/80 to-pink-950/30"
  },
  {
    slogan: "Conçois des Jeux Mobiles interactifs par IA !",
    description: "Fais l'expérience de la science créative : module la constante gravitationnelle sidérale et prends immédiatement les manettes de tes propres codes de jeux mobiles compilés !",
    imagePath: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200",
    badge: "🎮 Laboratoire de Jeux Mobiles Kidi Games",
    gradient: "from-slate-950 via-slate-950/80 to-teal-950/30"
  }
];

// Initializing beautiful mock database seeds with diverse age groups, demos, and categories
const initialClues: Clue[] = [
  { day: 1, title: "Harpon cosmique", description: "L'outil énergétique d'amarrage pour harponner la poussière d'étoiles dorées.", type: "keyword", content: "harpon cosmique", isUnlocked: true },
  { day: 2, title: "Chants des abysses", description: "La fréquence sonore mystérieuse qui guide les équipages à travers le vide.", type: "sound", content: "chants des abysses", isUnlocked: true },
  { day: 3, title: "Voiles à gravité", description: "Les grandes voiles solaires conçues pour surfer l'onde d'attraction stellaire.", type: "keyword", content: "voiles à gravité", isUnlocked: true },
  { day: 4, title: "Poussière de singularité", description: "Le carburant ultra-rare sécrété par le grand cachalot sidéral.", type: "keyword", content: "poussière de singularité", isUnlocked: true },
  { day: 5, title: "Androïde buggé", description: "Un robot de bord qui bégaye et se souvient des poèmes oubliés du passé.", type: "keyword", content: "androïde buggé", isUnlocked: true },
  { day: 6, title: "Chronosphère", description: "Une mystérieuse boussole temporelle trouvée sous un astéroïde.", type: "keyword", content: "chronosphère", isUnlocked: false },
  { day: 7, title: "Sillage de Bioluminescence", description: "La traînée lumineuse que la créature laisse derrière elle.", type: "image", content: "sillage de bioluminescence", isUnlocked: false },
  { day: 8, title: "Sérénade sidérale", description: "La complainte harmonique pour apaiser la colère de la tempête.", type: "sound", content: "sérénade sidérale", isUnlocked: false },
  { day: 9, title: "Casque en Quartz stellaire", description: "Le scaphandre étincelant des stylistes de l'espace.", type: "keyword", content: "casque en quartz stellaire", isUnlocked: false },
  { day: 10, title: "L'Alliance du Cachalot", description: "Le message final envoyé par le jury : composez de toutes vos forces !", type: "text", content: "l'alliance du cachalot", isUnlocked: false },
];

const seedSubmissions: Submission[] = [
  {
    id: "sub-1",
    challengeId: "movie-whale-1",
    authorName: "Bastien",
    authorAge: 14,
    title: "Le Dernier sillage d'Or",
    submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    category: "screenplay",
    content: {
      screenplay: {
        title: "Le Dernier sillage d'Or",
        act1: "SCÈNE 1 - L'ANCRAGE DU GRAND HARPON\nDescription : Le navire pirate 'L'Horizon' tangue. Un jeune garçon, Bastien, ajuste sa combinaison.\nBastien jette alors le HARPON COSMIQUE dans la nébuleuse d'Or.\n\nDIALOGUE :\nBASTIEN\nRegardez ! L'ancre lumineuse a mordu !",
        act2: "SCÈNE 2 - LA COMPLAINTE DE L'ANDROÏDE\nDescription : L'esprit du bateau tremble. Un ANDROÏDE BUGGÉ fait des étincelles bleues.\n\nDIALOGUE :\nL'ANDROÏDE\nLes CHANTS DES ABYSSES m'appellent de l'intérieur... La baleine est là.",
        act3: "SCÈNE 3 - LE VOL SUR LA GRAVITÉ\nDescription : Les VOILES À GRAVITÉ s'ouvrent, captant la POUSSIÈRE DE SINGULARITÉ. Le cachalot s'éloigne tranquillement, sauf qu'il est maintenant libre et guidé par la musique.",
      },
    },
    votes: 42,
    feedback: [
      {
        author: "Lucas Besson - LinkYourArt Movies",
        text: "Magnifique Bastien ! La transition à l'acte III est très aérienne. Ton utilisation de l'androïde apporte beaucoup de poésie à ce décor de science-fiction.",
        rating: 5,
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
  },
  {
    id: "sub-2",
    challengeId: "movie-whale-1",
    authorName: "Léa",
    authorAge: 12,
    title: "Symphonie Lactée v2",
    submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    category: "music",
    content: {
      music: {
        melody: [
          1, 0, 0, 1, 0, 0, 1, 0,
          0, 1, 0, 0, 1, 0, 0, 1,
          0, 0, 1, 0, 0, 1, 0, 0,
          0, 0, 0, 1, 0, 0, 1, 0,
          1, 0, 0, 0, 0, 1, 0, 1,
        ],
        instrument: "space-piano",
        lyrics: "Dans la nébuleuse d'Or chantent les cachalots\nLeurs ondes percent le grand vide sidéral\nOuvrez les voiles de gravité pour aller tout là-haut...",
        tempo: 125,
      },
    },
    votes: 35,
    feedback: [
      {
        author: "Compositeur en Chef @ LinkYourArt Records",
        text: "Des harmonies très raccord avec le cahier des charges ! Les paroles sont touchantes et la mélodie monte bien en arpeggio.",
        rating: 4,
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
  },
];

// Seed collection of 6 rich challenges covering multiple age bands & trials
const initialChallengesList: Challenge[] = [
  {
    id: "movie-whale-1",
    title: "L'Énigme du Cachalot Stellaire",
    subtitle: "Challenge d'écriture cinématographique & design initié par LinkYourArt",
    sponsor: "Lucas Besson - Réalisateur & Producteur @ LinkYourArt Movies",
    description: "Un immense Cachalot Stellaire dérive paisiblement à travers la Nébuleuse d'Or. À bord de vos navires pirates d'écriture, composez le premier scénario de film d'animation qui lui donnera vie en sillage de bioluminescence ! Pour stimuler votre esprit créatif d'artiste, l'équipe distillera des indices de scénario originaux sur 10 jours. Ensuite, à vous de jouer et de remporter une place d'études dans nos ateliers d'animation !",
    category: "cinema",
    ageGroup: "12-15",
    isDemo: false,
    startDate: "2026-05-15",
    endDate: "2026-08-15",
    cluesDurationDays: 10,
    currentSimulatedDay: 5,
    maxDays: 10,
    clues: initialClues,
    nestedChallenges: [
      { id: "nest-1", title: "Thème Audio du Cachalot", category: "music", description: "Le scénario a besoin de vibrations ! Compose un thème pour le chant du cachalot.", reward: "Insigne de Compositeur d'Argent", status: "active" },
      { id: "nest-2", title: "Garde-Robe Cosmique (Costumes)", category: "costume", description: "Dessine la combinaison spatiale bioluminescente portée par Bastien pour flotter dans le vide d'or.", reward: "Insigne Styliste d'Or", status: "active" },
    ],
    submissions: seedSubmissions,
  },
  {
    id: "demo-whale-2",
    title: "Le Voyage Cosmique des Petits Pas",
    subtitle: "Version Démo d'initiation au dessin d'animation pour les tout-petits",
    sponsor: "Karla - Concept Artist @ LinkYourArt Junior",
    description: "Bienvenue aux plus jeunes créateurs ! Pour ce challenge démo, imagine un gentil monstre ou une méduse scintillante qui vole à côté du navire pirate de Bastien. Utilise notre tableau de dessin avec des couleurs pastel et des étoiles lumineuses pour stimuler ta créativité !",
    category: "design",
    ageGroup: "4-7",
    isDemo: true,
    startDate: "2026-05-01",
    endDate: "2026-09-30",
    cluesDurationDays: 5,
    currentSimulatedDay: 3,
    maxDays: 5,
    clues: [
      { day: 1, title: "Étoiles Roses", description: "De petites poussières d'étoiles scintillantes de couleur rose bonbon.", type: "keyword", content: "etoile rose", isUnlocked: true },
      { day: 2, title: "Bulle d'eau", description: "Une bulle magique qui protège les animaux du froid de l'espace.", type: "keyword", content: "bulle magique", isUnlocked: true },
      { day: 3, title: "Grand Sourire", description: "La créature doit avoir un grand sourire chaleureux pour rassurer l'équipage.", type: "text", content: "sourire", isUnlocked: true },
      { day: 4, title: "Nageoire Violette", description: "Une nageoire pour naviguer sur la traînée de lumière.", type: "keyword", content: "nageoire violette", isUnlocked: false },
      { day: 5, title: "Ami Robot", description: "Un croquis rapide de la main de l'androïde buggé tenant la créature.", type: "image", content: "robot ami", isUnlocked: false },
    ],
    nestedChallenges: [
      { id: "nest-2-1", title: "La Couleur Spatiale", category: "costume", description: "Fais des touches de bleu néon pour éclairer tes arrières-plans !", reward: "Insigne Petit Initié", status: "active" }
    ],
    submissions: [
      {
        id: "sub-2-1",
        challengeId: "demo-whale-2",
        authorName: "Maya",
        authorAge: 6,
        title: "Mon Petit Poulpe Spatial Rigolo",
        submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        category: "costume",
        content: {
          costume: {
            imageUrl: "",
            materials: "Eau pétillante d'étoile et peinture rose",
            name: "Poulpy"
          }
        },
        votes: 18,
        feedback: [
          { author: "Karla - Concept Artist", text: "Trop mignon Maya ! Les grands yeux bleus de Poulpy sont fantastiques !", rating: 5, date: new Date().toISOString() }
        ]
      }
    ]
  },
  {
    id: "demo-whale-3",
    title: "Le Rythme Magique de l'Androïde",
    subtitle: "Challenge d'initiation musicale pour composer tes premières notes d'or",
    sponsor: "Hans Zimmer Jr - LinkYourArt Soundscapes",
    description: "Notre androïde de bord fait des bruits super comiques quand son système a des bugs ! Dans cette démo, compose une chanson rythmée pour réparer les circuits de l'androïde. Ajuste le tempo et rédige des paroles rigolotes !",
    category: "music",
    ageGroup: "8-11",
    isDemo: true,
    startDate: "2026-05-10",
    endDate: "2026-10-10",
    cluesDurationDays: 5,
    currentSimulatedDay: 4,
    maxDays: 5,
    clues: [
      { day: 1, title: "Sifflement Bip-Bop", description: "Le bruit métallique que l'androïde fait au réveil.", type: "sound", content: "bip bop sifflement", isUnlocked: true },
      { day: 2, title: "Surchauffe Cosmique", description: "Un rythme rapide accélérant comme une fusée.", type: "keyword", content: "surchauffe", isUnlocked: true },
      { day: 3, title: "Mélodie douce", description: "Un air de piano de l'espace doux pour l'endormir.", type: "sound", content: "air doux piano", isUnlocked: true },
      { day: 4, title: "Batterie d'Étoile", description: "Des chocs de percussions réguliers.", type: "keyword", content: "batterie etoile", isUnlocked: true },
      { day: 5, title: "Accord Majeur", description: "Le signal final de rétablissement.", type: "sound", content: "cloche triomphale", isUnlocked: false },
    ],
    nestedChallenges: [
      { id: "nest-3-1", title: "Refrain de Robot", category: "music", description: "Écris un refrain avec les mots Bip-Bop et Cachalot.", reward: "Microphone de Bronze", status: "active" }
    ],
    submissions: [
      {
        id: "sub-3-1",
        challengeId: "demo-whale-3",
        authorName: "Kenzo",
        authorAge: 10,
        title: "La Chanson Geek de Linky",
        submittedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        category: "music",
        content: {
          music: {
            melody: [1, 0, 1, 0, 1, 1, 0, 0, 1, 1],
            tempo: 110,
            instrument: "space-piano",
            lyrics: "Bip bop machine, s'il te plaît ne bug plus, bois une poussière d'étoile !"
          }
        },
        votes: 21,
        feedback: [
          { author: "Hans - Sound Designer", text: "Superbe Kenzo, la boucle de notes est très entraînante !", rating: 4, date: new Date().toISOString() }
        ]
      }
    ]
  },
  {
    id: "real-whale-4",
    title: "Symphonie Galactique Avancée",
    subtitle: "Vrai Concours Professionnel de composition de haute volée",
    sponsor: "Yuki - Chef d'Orchestre @ LinkYourArt Records",
    description: "Ce challenge s'adresse aux grands compositeurs adolescents ! Invente une musique de film d'animation complexe et épique pour l'entrée du grand Cachalot Stellaire dans le port galactique d'Or. Tu recevras une vraie évaluation pro avec la chance de gagner un Casque de Monitoring haut de gamme KidiWorld !",
    category: "music",
    ageGroup: "16-18",
    isDemo: false,
    startDate: "2026-05-18",
    endDate: "2026-08-18",
    cluesDurationDays: 10,
    currentSimulatedDay: 5,
    maxDays: 10,
    clues: initialClues,
    nestedChallenges: [
      { id: "nest-4-1", title: "Harmonie d'Orfèvre", category: "music", description: "Utilise un tempo rapide à 140 BPM et des accords en arpeggio.", reward: "Grand Prix Composition", status: "active" }
    ],
    submissions: []
  },
  {
    id: "real-whale-5",
    title: "Uniforme de la Haute Coque Spatiale",
    subtitle: "Vrai Défi de Stylisme et Design de Costumes d'équipes de films d'animation",
    sponsor: "Chanel - Directrice Mode @ LinkYourArt Creative House",
    description: "Imagine les tenues hautement révolutionnaires pour l'équipage du navire d'exploration 'Le Polaris'. Utilise notre palette de dessin pour superposer des textures luminescentes et dessine le scaphandre ultime fait avec des fibres de quartz.",
    category: "design",
    ageGroup: "12-15",
    isDemo: false,
    startDate: "2026-05-12",
    endDate: "2026-08-20",
    cluesDurationDays: 10,
    currentSimulatedDay: 6,
    maxDays: 10,
    clues: initialClues,
    nestedChallenges: [
      { id: "nest-5-1", title: "Finition Quartz", category: "costume", description: "Mets en valeur la visière en quartz stellaire magique.", reward: "Aiguille d'Or pro", status: "active" }
    ],
    submissions: []
  },
  {
    id: "demo-whale-6",
    title: "L'Odyssée de la Bioluminescence",
    subtitle: "Version Démo d'écriture scénaristique de cinéma d'animation",
    sponsor: "Alex - Réalisateur & Écrivain @ LinkYourArt Movies",
    description: "Découvre comment on structure une histoire de film d'animation SF ! Dans cette démo, écris les péripéties d'un petit pilote qui suit la traînée fluorescente laissée par la baleine stellaire.",
    category: "cinema",
    ageGroup: "16-18",
    isDemo: true,
    startDate: "2026-05-14",
    endDate: "2026-12-01",
    cluesDurationDays: 10,
    currentSimulatedDay: 5,
    maxDays: 10,
    clues: initialClues,
    nestedChallenges: [
      { id: "nest-6-1", title: "Script d'Initiation", category: "poster", description: "Rédige le dénouement de la traversée de la nébuleuse.", reward: "Insigne d'Écrivain de Plâtre", status: "active" }
    ],
    submissions: []
  },
  {
    id: "real-photo-7",
    title: "Chasseurs de Supernovas Lumineuses",
    subtitle: "Vrai Concours de Photographie Stellor-Cosmique & Lumière",
    sponsor: "Nathalie - Astrophysicienne & Reporter Photo @ LinkYourArt Photography",
    description: "Ajustez l'obturateur de votre objectif d'imagination ! Pour ce concours réel de photographie galactique, capturez l'instant magique où une étoile s'évanouit en supernova. Jouez sur l'exposition, le contraste de l'ombre à paupière des nébuleuses et l'alignement des prismes spatiaux pour rafler le trophée !",
    category: "photography",
    ageGroup: "12-15",
    isDemo: false,
    startDate: "2026-05-19",
    endDate: "2026-08-25",
    cluesDurationDays: 10,
    currentSimulatedDay: 4,
    maxDays: 10,
    clues: initialClues,
    nestedChallenges: [
      { id: "nest-7-1", title: "Prisme Stellor", category: "poster", description: "Cadre la lueur bleutée d'un fragment de comète.", reward: "Insigne de l'Oeil d'Or", status: "active" }
    ],
    submissions: [
      {
        id: "sub-7-1",
        challengeId: "real-photo-7",
        authorName: "Éloi",
        authorAge: 13,
        title: "Larme de Perséide",
        submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        category: "poster",
        content: {
          poster: {
            tagline: "Un éclat infini sous le regard du ciel fraternel.",
            themeColor: "#0284c7",
            imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200"
          }
        },
        votes: 42,
        feedback: [
          { author: "Nathalie - Reporter", text: "Magnifique gestion de la lumière froide et de la perspective astrale !", rating: 5, date: new Date().toISOString() }
        ]
      }
    ]
  }
];

export default function App() {
  const [role, setRole] = useState<"child" | "jury">("child");
  const [activeTab, setActiveTab] = useState<"explorer" | "workspace" | "profile" | "kidi-games" | "kidi-music" | "accounts">("explorer");
  const [activeWorkspaceSubTab, setActiveWorkspaceSubTab] = useState<"guide" | "screenplay" | "music" | "costume">("guide");

  // Onboarding On-load Tutorial Modal State at Root level to bypass header rendering constraints
  const [isTutorialOpen, setIsTutorialOpen] = useState(() => {
    const dismissed = localStorage.getItem("kidiworld_welcome_tutorial_dismissed");
    return dismissed !== "true";
  });
  const [tutorialStep, setTutorialStep] = useState(1);

  // Account Session for KidiClub & KidiCoins Wallet with LocalStorage persistence
  const [accountSession, setAccountSession] = useState<AccountSession>(() => {
    const saved = localStorage.getItem("kidiworld_account_session_v1");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      isLoggedIn: false,
      username: "Copilote",
      role: "child",
      kidiCoins: 120,
      isPremiumMember: false,
      avatar: "🚀 Astro-Mousse"
    };
  });

  // Pick a random visual index at load to stimulate dynamic talent
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);

  useEffect(() => {
    localStorage.setItem("kidiworld_account_session_v1", JSON.stringify(accountSession));
  }, [accountSession]);

  useEffect(() => {
    if (accountSession.isLoggedIn) {
      setProfile((prev) => ({
        ...prev,
        childName: accountSession.username
      }));
    }
  }, [accountSession.isLoggedIn, accountSession.username]);

  useEffect(() => {
    const rand = Math.floor(Math.random() * BANNER_VISUALS.length);
    setActiveBannerIndex(rand);
  }, []);

  // User Profile with Parental Control states
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem("kidiworld_user_profile_v2");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      childName: "Bastien",
      childAge: 14,
      language: "fr",
      parentEmail: "parents@kidiworld.org",
      parentApproved: true,
      screenTimeLimitMinutes: 45,
      preferredCategories: ["cinema", "music", "design", "animation", "photography"]
    };
  });

  // Load challenges database from LocalStorage or initialize with seed
  const [challenges, setChallenges] = useState<Challenge[]>(() => {
    const saved = localStorage.getItem("kidiworld_all_challenges_v2");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return initialChallengesList;
  });

  const [activeChallengeId, setActiveChallengeId] = useState<string>("movie-whale-1");

  // Get active challenge
  const challenge = challenges.find((c) => c.id === activeChallengeId) || challenges[0];

  // Youth drafts
  const [draftTitle, setDraftTitle] = useState("Le Berceau de la Constellation");
  const [draftScreenplay, setDraftScreenplay] = useState({
    title: "Le Berceau de la Constellation",
    act1: "SCÈNE 1 - LE QUART DE NUIT\nDescription : Le navire spatial avance lentement. Un jeune mécano observe la nébuleuse scintillante.\nTout à coup, il prépare son HARPON COSMIQUE pour s'amarrer au grand vaisseau fantôme...\n\n",
    act2: "SCÈNE 2 - LA VOIX VIBRANTE\nDescription : Des CHANTS DES ABYSSES résonnent à travers les cloisons d'acier. Un ANDROÏDE BUGGÉ commence à peindre des poissons d'eau dorée sur les écrans radar.\n\n",
    act3: "SCÈNE 3 - SURF GRAVITATIONNEL\nDescription : Les VOILES À GRAVITÉ captent la POUSSIÈRE DE SINGULARITÉ pour lancer un saut hyper-vitesse. La bête stellaire les accompagne en chantant une merveilleuse mélodie finale.",
  });

  const [draftMusic, setDraftMusic] = useState({
    melody: [1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1],
    instrument: "space-piano",
    lyrics: "Un chant de cristal / Un lointain récital...",
    tempo: 120,
  });

  const [draftCostume, setDraftCostume] = useState({
    imageUrl: "",
    name: "Combinaison Solaire Bastien",
    materials: "Tissu d'or liquide à fils luminescents",
  });

  // Submit states
  const [childSubmitName, setChildSubmitName] = useState(profile.childName);
  const [childSubmitAge, setChildSubmitAge] = useState(profile.childAge);
  const [isSubmittedSuccessfully, setIsSubmittedSuccessfully] = useState(false);

  // Filters for the Challenge Explorer
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterAge, setFilterAge] = useState<string>("all");
  const [filterMode, setFilterMode] = useState<string>("all"); // "all", "real", "demo"
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Sync states with LocalStorage
  useEffect(() => {
    localStorage.setItem("kidiworld_all_challenges_v2", JSON.stringify(challenges));
  }, [challenges]);

  useEffect(() => {
    localStorage.setItem("kidiworld_user_profile_v2", JSON.stringify(profile));
    setChildSubmitName(profile.childName);
    setChildSubmitAge(profile.childAge);
  }, [profile]);

  // Derived calculations for keys unlocking based on simulated date
  const unlockedClues = challenge.clues
    .filter((clue) => clue.day <= challenge.currentSimulatedDay)
    .map((clue) => clue.title);

  const statsStars = challenges.reduce((acc, currentCh) => {
    return acc + currentCh.submissions.reduce((sAcc, curr) => sAcc + curr.votes, 0);
  }, 125);

  // Kids events dispatcher
  const handleSaveScreenplay = (act1: string, act2: string, act3: string, title: string) => {
    setDraftScreenplay({ act1, act2, act3, title });
  };

  const handleSaveMusic = (melody: number[], instrument: string, lyrics: string, tempo: number) => {
    setDraftMusic({ melody, instrument, lyrics, tempo });
  };

  const handleSaveSketch = (imageUrl: string, characterName: string, materials: string) => {
    setDraftCostume({ imageUrl, name: characterName, materials });
  };

  // Helper drop-in setter to stay backwards compatible with previous single state calls
  const setChallenge = (updater: Challenge | ((prev: Challenge) => Challenge)) => {
    setChallenges((prevList) => {
      return prevList.map((c) => {
        if (c.id === challenge.id) {
          return typeof updater === "function" ? updater(c) : updater;
        }
        return c;
      });
    });
  };

  // Submission handler for active challenge
  const handleSubmittingProject = (category: "screenplay" | "music" | "costume") => {
    if (!childSubmitName.trim()) {
      alert("S'il te plaît, entre ton nom de jeune créatif ou enregistre ton profil !");
      return;
    }

    if (!profile.parentApproved && childSubmitAge < 15) {
      alert("⚠️ Attention : Une signature d'approbation parentale est nécessaire dans l'onglet 'Contrôle Parental' pour valider de vrais concours !");
      return;
    }

    const newSub: Submission = {
      id: `sub-${Date.now()}`,
      challengeId: challenge.id,
      authorName: childSubmitName.trim(),
      authorAge: childSubmitAge,
      title: category === "screenplay" ? draftScreenplay.title : category === "music" ? "Thème Symphonique de " + childSubmitName : "Uniforme de " + childSubmitName,
      submittedAt: new Date().toISOString(),
      category: category,
      content: {
        screenplay: category === "screenplay" ? draftScreenplay : undefined,
        music: category === "music" ? draftMusic : undefined,
        costume: category === "costume" ? draftCostume : undefined,
      },
      votes: 1, 
      feedback: [],
    };

    setChallenge((prev) => ({
      ...prev,
      submissions: [newSub, ...prev.submissions],
    }));

    setIsSubmittedSuccessfully(true);
    setTimeout(() => setIsSubmittedSuccessfully(false), 4500);
  };

  // Jury Events Dispatchers (Updates specific submission in correct challenge)
  const handlePostFeedback = (submissionId: string, text: string, rating: number, author: string) => {
    setChallenge((prev) => {
      const nextSubmissions = prev.submissions.map((sub) => {
        if (sub.id === submissionId) {
          return {
            ...sub,
            votes: sub.votes + Math.floor(Math.random() * 8) + 3,
            feedback: [
              ...sub.feedback,
              {
                author,
                text,
                rating,
                date: new Date().toISOString(),
              },
            ],
          };
        }
        return sub;
      });
      return { ...prev, submissions: nextSubmissions };
    });
  };

  const handleAddClue = (clue: Clue) => {
    setChallenge((prev) => {
      return {
        ...prev,
        clues: [...prev.clues, clue],
      };
    });
  };

  const handleAdvanceTimeline = () => {
    setChallenge((prev) => {
      const nextDay = Math.min(prev.currentSimulatedDay + 1, prev.maxDays);
      const nextClues = prev.clues.map((clue) => {
        if (clue.day <= nextDay) {
          return { ...clue, isUnlocked: true };
        }
        return clue;
      });
      return { ...prev, currentSimulatedDay: nextDay, clues: nextClues };
    });
  };

  const handleResetTimeline = () => {
    setChallenge((prev) => {
      const resetClues = prev.clues.map((clue) => {
        return { ...clue, isUnlocked: clue.day <= 2 };
      });
      return { ...prev, currentSimulatedDay: 2, clues: resetClues };
    });
  };

  const handleAddNewChallenge = (title: string, subtitle: string, desc: string, sponsor: string, maxDays: number) => {
    const newChallengeSetup: Challenge = {
      id: `challenge-${Date.now()}`,
      title,
      subtitle,
      sponsor,
      description: desc,
      category: "cinema",
      ageGroup: "12-15",
      isDemo: false,
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      cluesDurationDays: maxDays,
      currentSimulatedDay: 1,
      maxDays: maxDays,
      clues: Array(maxDays).fill(null).map((_, i) => ({
        day: i + 1,
        title: `Indice magique ${i + 1}`,
        description: `Trouve comment enrichir ton histoire avec l'indice du jour ${i + 1}.`,
        type: "keyword",
        content: `indice ${i + 1}`,
        isUnlocked: i === 0,
      })),
      nestedChallenges: [
        { id: `nest-mus-${Date.now()}`, title: "La Musique de " + title, category: "music", description: "Compose un hymne sonore original.", reward: "Insigne Pro", status: "active" },
        { id: `nest-cos-${Date.now()}`, title: "La Tenue de " + title, category: "costume", description: "Imagine le croquis.", reward: "Dessinateur Certifié", status: "active" },
      ],
      submissions: [],
    };

    setChallenges((prev) => [newChallengeSetup, ...prev]);
    setActiveChallengeId(newChallengeSetup.id);
    setActiveTab("workspace");
    setActiveWorkspaceSubTab("guide");
  };

  // Filters calculation
  const filteredChallengesList = challenges.filter((ch) => {
    const matchesCategory = filterCategory === "all" || ch.category === filterCategory;
    const matchesAge = filterAge === "all" || ch.ageGroup === filterAge;
    const matchesMode = filterMode === "all" || 
      (filterMode === "demo" && ch.isDemo) || 
      (filterMode === "real" && !ch.isDemo);

    const q = searchQuery.toLowerCase().trim();
    if (!q) {
      return matchesCategory && matchesAge && matchesMode;
    }

    // Match title, subtitle, or description
    const matchTitle = ch.title.toLowerCase().includes(q);
    const matchSubtitle = ch.subtitle.toLowerCase().includes(q);
    const matchDescription = ch.description.toLowerCase().includes(q);
    
    // Match category
    const matchCategoryText = ch.category.toLowerCase().includes(q);
    
    // Match category readable labels in French/English
    const categoryLabel = ch.category === "cinema" ? "cinéma cinoche film movie scénario scenario" 
      : ch.category === "music" ? "musique chanson sound original song track compositeur son" 
      : ch.category === "design" ? "mode dessin stylisme beaux-arts croquis costume tenue"
      : ch.category === "animation" ? "jeu vidéo anim 3d cinoche d'animation"
      : ch.category === "photography" ? "photographie photo lumière prisme zoom supernova"
      : "";
    const matchCategoryLabel = categoryLabel.includes(q);

    // Match keywords or clue metadata
    const matchClues = ch.clues.some(clue => 
      clue.title.toLowerCase().includes(q) ||
      clue.description.toLowerCase().includes(q) ||
      clue.content.toLowerCase().includes(q)
    );

    // Match nested challenges
    const matchNested = ch.nestedChallenges.some(nest =>
      nest.title.toLowerCase().includes(q) ||
      nest.description.toLowerCase().includes(q)
    );

    const matchesSearch = matchTitle || matchSubtitle || matchDescription || matchCategoryText || matchCategoryLabel || matchClues || matchNested;

    return matchesCategory && matchesAge && matchesMode && matchesSearch;
  });

  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 selection:bg-amber-500 selection:text-slate-900 pb-12 flex flex-col font-sans">
      
      {/* Dynamic Smart Header */}
      <Header 
        userRole={role} 
        onToggleRole={(r) => {
          setRole(r);
          // If going to jury, toggle off profile setups
          if (r === "jury") {
            setActiveTab("workspace");
          }
        }} 
        starsCount={statsStars}
        profileName={profile.childName}
        profileAge={profile.childAge}
        profileLang={profile.language}
        onOpenProfile={() => {
          setRole("child");
          setActiveTab("profile");
        }}
        isProfileActive={activeTab === "profile" && role === "child"}
        kidiCoins={accountSession.kidiCoins}
        onOpenTutorial={() => {
          setTutorialStep(1);
          setIsTutorialOpen(true);
        }}
      />

      {role === "child" ? (
        // Children view workspace
        <main className="max-w-7xl mx-auto px-6 mt-6 flex-1 w-full space-y-6">
          
          {/* Main Top Navigation Row between Explorer, Creative Studio, Games, Music, and settings */}
          <div className="flex flex-col lg:flex-row justify-between items-center bg-slate-900/60 p-2 rounded-2xl border border-slate-900 gap-3">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveTab("explorer")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
                  activeTab === "explorer"
                    ? "bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md"
                    : "text-slate-400 hover:text-white hover:bg-slate-900"
                }`}
              >
                <Compass className="w-4 h-4" />
                🚀 Explorateur
              </button>
              
              <button
                onClick={() => setActiveTab("workspace")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
                  activeTab === "workspace"
                    ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md"
                    : "text-slate-400 hover:text-white hover:bg-slate-900"
                }`}
              >
                <Zap className="w-4 h-4" />
                🎨 Mon Studio : {challenge.title.slice(0, 16)}...
              </button>

              <button
                onClick={() => setActiveTab("kidi-games")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
                  activeTab === "kidi-games"
                    ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md"
                    : "text-slate-400 hover:text-white hover:bg-slate-900"
                }`}
              >
                <Gamepad2 className="w-4 h-4" />
                🎮 Kidi Games & IA
              </button>

              <button
                onClick={() => setActiveTab("kidi-music")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
                  activeTab === "kidi-music"
                    ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md"
                    : "text-slate-400 hover:text-white hover:bg-slate-900"
                }`}
              >
                <Music className="w-4 h-4" />
                🎵 Kidi Music
              </button>

              <button
                onClick={() => setActiveTab("accounts")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
                  activeTab === "accounts"
                    ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md"
                    : "text-slate-400 hover:text-white hover:bg-slate-900"
                }`}
              >
                <Coins className="w-4 h-4 text-amber-400" />
                🔑 KidiClub
                {accountSession.isLoggedIn ? (
                  <span className="text-[10px] bg-amber-500/10 text-amber-400 px-1.5 py-0.5 rounded font-mono font-bold">
                    {accountSession.kidiCoins} Coins
                  </span>
                ) : null}
              </button>
            </div>

            {/* Quick alert bar to show leftover screen-time limits dynamically */}
            {profile.screenTimeLimitMinutes !== 9999 && (
              <div className="flex items-center gap-2 text-xs text-amber-400 bg-amber-500/5 px-3.5 py-1.5 rounded-xl border border-amber-500/10 font-mono">
                <Clock className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: "10s" }} />
                <span>Supervision active : session sécurisée</span>
              </div>
            )}
          </div>

          {activeTab === "explorer" && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Whimsical Kids Hero Banner with randomized dynamic artwork */}
              <div className="relative rounded-3xl overflow-hidden border border-slate-900 shadow-2xl bg-slate-950 p-6 md:p-10 flex flex-col md:flex-row justify-between items-center gap-6 min-h-[260px]">
                {/* Background decorative image matching target index */}
                <div className="absolute inset-0 z-0 opacity-40 hover:opacity-55 transition-opacity duration-500 overflow-hidden">
                  <img
                    src={BANNER_VISUALS[activeBannerIndex].imagePath}
                    alt="Atmosphère Créative"
                    className="w-full h-full object-cover scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-r ${BANNER_VISUALS[activeBannerIndex].gradient}`} />
                </div>

                <div className="relative z-10 space-y-3 text-left max-w-xl">
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest bg-amber-500/10 border border-amber-500/25 px-3 py-1 rounded-full inline-block font-mono">
                    {BANNER_VISUALS[activeBannerIndex].badge}
                  </span>
                  <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">
                    {BANNER_VISUALS[activeBannerIndex].slogan}
                  </h1>
                  <p className="text-xs md:text-sm text-slate-300 font-medium leading-relaxed font-sans">
                    {BANNER_VISUALS[activeBannerIndex].description}
                  </p>

                  <button
                    id="shuffle-visual-indicator"
                    onClick={() => {
                      const nextIndex = (activeBannerIndex + 1) % BANNER_VISUALS.length;
                      setActiveBannerIndex(nextIndex);
                    }}
                    className="mt-2 text-[11px] font-extrabold text-amber-400 bg-amber-500/15 border border-amber-400/25 hover:bg-amber-500/35 transition cursor-pointer px-3.5 py-1.5 rounded-full flex items-center gap-1.5 select-none"
                  >
                    ✨ Stimuler mon talent (Changer de visuel d'IA)
                  </button>
                </div>

                <div className="relative z-10 shrink-0 bg-slate-900/95 backdrop-blur-sm p-5 py-4 rounded-2xl border border-slate-800 text-left max-w-xs space-y-2.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">Évaluation Mondiale :</span>
                  <strong className="text-xs text-amber-400 font-sans block">De vraies récompenses</strong>
                  <p className="text-[10px] text-slate-300 leading-normal">
                    Reçois des retours constructifs et gagne ta place d'études en atelier d'animation, n'importe où dans le monde !
                  </p>
                </div>
              </div>

              {/* Advanced Interactive Filtering system for Categories, Age limits, and Demo flag */}
              <div className="bg-slate-900 border border-slate-950 shadow-lg p-5 rounded-3xl text-left space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-amber-500" />
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider font-sans">
                      Filtres de Pointe de la Plateforme (4 - 18 ans)
                    </h3>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {filteredChallengesList.length} défis trouvés pour ton profil
                  </span>
                </div>

                {/* Challenge Search Bar Input integration */}
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                    <Search className="w-4 h-4 text-slate-400" />
                  </span>
                  <input
                    type="text"
                    id="challenge-search-input"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Chercher un défi par titre, mot-clé, catégorie (ex: cinéma, photo, musique, herbes, lune)..."
                    className="w-full pl-10 pr-24 py-3 bg-slate-950/80 border border-slate-800/80 focus:border-amber-500/80 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none transition shadow-inner font-sans"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-[10px] hover:text-white transition font-mono font-bold text-rose-400 cursor-pointer"
                    >
                      Effacer [×]
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Category Filter selector */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">
                      Catégories Artistiques
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {["all", "cinema", "music", "design", "animation", "photography"].map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setFilterCategory(cat)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                            filterCategory === cat
                              ? "bg-amber-500 text-slate-950 font-black"
                              : "bg-slate-950/60 text-slate-400 hover:text-slate-200 border border-slate-800"
                          }`}
                        >
                          {cat === "all" ? "🔥 Toutes" 
                           : cat === "cinema" ? "🎬 Cinéma" 
                           : cat === "music" ? "🎵 Musique" 
                           : cat === "design" ? "🎨 Mode & Dessin"
                           : cat === "animation" ? "👾 Jeu Vidéo"
                           : cat === "photography" ? "📸 Photo"
                           : cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Developmental Age filter selector */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">
                      Tranche d'Âge Créatif
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {["all", "4-7", "8-11", "12-15", "16-18"].map((age) => (
                        <button
                          key={age}
                          onClick={() => setFilterAge(age)}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition ${
                            filterAge === age
                              ? "bg-indigo-500 text-white font-black"
                              : "bg-slate-950/60 text-slate-400 hover:text-slate-200 border border-slate-800"
                          }`}
                        >
                          {age === "all" ? "Tout Âge" : `${age} ans`}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Mode demo vs real concours filter */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">
                      Type de participation
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { code: "all", label: "Tous les modes" },
                        { code: "demo", label: "Essais & Démos" },
                        { code: "real", label: "Vrais Concours Pro" }
                      ].map((mode) => (
                        <button
                          key={mode.code}
                          onClick={() => setFilterMode(mode.code)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                            filterMode === mode.code
                              ? "bg-pink-500 text-white font-black"
                              : "bg-slate-950/60 text-slate-400 hover:text-slate-200 border border-slate-800"
                          }`}
                        >
                          {mode.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bento Grid view of dynamic challenges with empty fallback */}
              {filteredChallengesList.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredChallengesList.map((ch) => (
                    <ChallengeCard
                      key={ch.id}
                      challenge={ch}
                      isActive={ch.id === activeChallengeId}
                      language={profile.language}
                      onSelect={(challengeId) => {
                        setActiveChallengeId(challengeId);
                        setActiveTab("workspace");
                      }}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-slate-900/45 border border-slate-900 rounded-3xl p-10 text-center space-y-4 max-w-sm mx-auto shadow-xl animate-fadeIn mt-4">
                  <div className="w-14 h-14 bg-amber-500/10 text-amber-400 rounded-full flex items-center justify-center mx-auto text-2xl border border-amber-500/20">
                    🔍
                  </div>
                  <div className="space-y-1.5">
                    <h4 className="text-white font-bold text-sm">Aucun défi trouvé</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Zut ! Aucun défi ne correspond précisément à votre recherche ou vos filtres. Essayez d'ajuster vos mots-clés ou réinitialisez tout pour explorer de nouvelles idées !
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setFilterCategory("all");
                      setFilterAge("all");
                      setFilterMode("all");
                    }}
                    className="w-full py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 text-xs font-black rounded-xl transition cursor-pointer shadow-md"
                  >
                    Réinitialiser tous les filtres
                  </button>
                </div>
              )}

            </div>
          )}

          {activeTab === "profile" && (
            <div className="animate-fadeIn">
              <ProfileSetup 
                profile={profile} 
                onChangeProfile={(updated) => setProfile(updated)} 
                starsCount={statsStars}
              />
            </div>
          )}

          {activeTab === "accounts" && (
            <div className="animate-fadeIn">
              <AccountAuth
                session={accountSession}
                onUpdateSession={(newSession) => setAccountSession(newSession)}
                language={profile.language}
              />
            </div>
          )}

          {activeTab === "kidi-games" && (
            <div className="animate-fadeIn">
              <KidiGaming
                session={accountSession}
                onUpdateSession={(newSession) => setAccountSession(newSession)}
                language={profile.language}
              />
            </div>
          )}

          {activeTab === "kidi-music" && (
            <div className="animate-fadeIn">
              <KidiMusic
                session={accountSession}
                onUpdateSession={(newSession) => setAccountSession(newSession)}
                language={profile.language}
              />
            </div>
          )}

          {activeTab === "workspace" && (
            <div className="space-y-6">
              
              {/* Workspace Mini Banner showing Active Challenge & Category details with Real-time translate */}
              <div className="bg-slate-900/95 border border-slate-800/70 p-5 rounded-3xl text-left flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                      challenge.isDemo ? "bg-sky-500/10 text-sky-400" : "bg-rose-500/10 text-rose-400"
                    }`}>
                      {challenge.isDemo ? "MODE DÉMO" : "CONCOURS RÉEL LINKYOURART"}
                    </span>
                    <span className="text-[10px] bg-slate-950 border border-slate-800 px-2 py-0.5 rounded text-slate-400 font-mono">
                      Âge visé : {challenge.ageGroup} ans
                    </span>
                  </div>
                  
                  <h2 className="text-xl font-black text-white leading-tight">
                    <TranslatedText text={challenge.title} targetLang={profile.language} />
                  </h2>
                  <p className="text-xs text-slate-400">
                    <TranslatedText text={challenge.subtitle} targetLang={profile.language} />
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-slate-400 font-mono">Langue Traduite :</span>
                  <span className="text-xs font-bold bg-slate-950 px-2.5 py-1.5 border border-slate-800 rounded-lg text-amber-400">
                    {profile.language.toUpperCase()} (IA Temps Réel)
                  </span>
                </div>
              </div>

              {/* Core Kids Workspace Layout Grid */}
              <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start">
                
                {/* Main Tabs and Workspace Work - 3 Columns */}
                <div className="xl:col-span-3 space-y-6">
                  {/* Kids Interface tab navigation and categories */}
                  <div className="bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800 flex flex-wrap gap-1.5 shadow-md">
                    <button
                      onClick={() => setActiveWorkspaceSubTab("guide")}
                      className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                        activeWorkspaceSubTab === "guide" ? "bg-slate-950 text-white border border-slate-900 shadow" : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      <HelpCircle className="w-4 h-4 text-slate-400" />
                      1. Guide du Challenge & Indices
                    </button>
                    
                    <button
                      onClick={() => setActiveWorkspaceSubTab("screenplay")}
                      className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                        activeWorkspaceSubTab === "screenplay" ? "bg-slate-950 text-amber-400 border border-slate-900 shadow" : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      <BookOpen className="w-4 h-4 text-amber-500" />
                      2. Scénariste (Textes)
                    </button>
                    
                    <button
                      onClick={() => setActiveWorkspaceSubTab("music")}
                      className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                        activeWorkspaceSubTab === "music" ? "bg-slate-950 text-violet-400 border border-slate-900 shadow" : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      <Music className="w-4 h-4 text-violet-400" />
                      3. Studio Sonore (Chanson)
                    </button>
                    
                    <button
                      onClick={() => setActiveWorkspaceSubTab("costume")}
                      className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                        activeWorkspaceSubTab === "costume" ? "bg-slate-950 text-pink-400 border border-slate-900 shadow" : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      <Palette className="w-4 h-4 text-pink-400" />
                      4. Dessin (Costumes d'Équipage)
                    </button>
                  </div>

                  {/* Display respective active component workspace */}
                  {activeWorkspaceSubTab === "guide" && (
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6 text-left">
                      <div>
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                          Règles de Participation & Distributeur d'Indices de Pro
                        </h3>
                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                          Chaque jour, le jury professionnel LinkYourArt déverrouille de nouveaux indices d'orientation. Combine tous les indices débloqués pour bâtir le dossier créatif le plus original dans l'âge cible.
                        </p>
                      </div>

                      {/* Summary of mission description */}
                      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-900 flex gap-4 leading-relaxed text-xs text-slate-300">
                        <div className="w-1.5 bg-gradient-to-b from-amber-500 to-pink-500 rounded-full shrink-0" />
                        <div>
                          <strong className="text-white block mb-1">Le Pitch Artistique :</strong>
                          <TranslatedText text={challenge.description} targetLang={profile.language} isParagraph={true} />
                        </div>
                      </div>

                      {/* 10 days timeline cards */}
                      <div className="space-y-4">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono block">
                          📆 L'Évolution des Indices de l'Académie
                        </span>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
                          {challenge.clues.map((clue) => (
                            <div
                              key={clue.day}
                              className={`p-3.5 rounded-2xl border transition relative flex flex-col justify-between h-40 ${
                                clue.isUnlocked
                                  ? "bg-slate-950 border-amber-500/30 text-slate-100"
                                  : "bg-slate-900/40 border-slate-950/20 text-slate-600 select-none"
                              }`}
                            >
                              <div>
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-[10px] bg-slate-900 font-mono text-slate-500 px-1.5 py-0.5 rounded">
                                    Jour {clue.day}
                                  </span>
                                  {clue.isUnlocked ? (
                                    <span className="text-[10px] text-amber-400 font-mono">DEVOILÉ</span>
                                  ) : (
                                    <span className="text-[10px] text-slate-700 font-mono">VERROUILLÉ</span>
                                  )}
                                </div>
                                <h4 className={`text-xs font-bold truncate ${clue.isUnlocked ? "text-amber-400" : "text-slate-600"}`}>
                                  {clue.isUnlocked ? <TranslatedText text={clue.title} targetLang={profile.language} /> : "???"}
                                </h4>
                                <div className="text-[10px] text-slate-400 leading-normal mt-1 line-clamp-3">
                                  {clue.isUnlocked ? <TranslatedText text={clue.description} targetLang={profile.language} isParagraph={true} /> : "Cet indice sera dévoilé prochainement par le jury de LinkYourArt."}
                                </div>
                              </div>

                              {clue.isUnlocked && (
                                <div className="mt-2 flex items-center justify-between text-[9px] font-mono text-slate-400 border-t border-slate-900 pt-1.5">
                                  <span>VALEUR : PRO</span>
                                  <span className="text-amber-500">{clue.type.toUpperCase()}</span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Production nested challs team builder info */}
                      <div className="p-4 bg-slate-950 rounded-2xl border border-slate-900">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono mb-3 block">
                          🤝 Challenges de Spécialités (La constitution de l'Équipe)
                        </h4>
                        <p className="text-xs text-slate-400 mb-4 leading-normal">
                          Pas de bon film d'animation sans musique et sans style ! Travailles ton scénario principal en même temps que tes camarades composent et dessinent. Le projet gagnant constituera la Dream Team créative de demain !
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {challenge.nestedChallenges.map((nest) => (
                            <div key={nest.id} className="bg-slate-900 p-4 border border-slate-800 rounded-xl flex items-start gap-3">
                              <div className={`p-2.5 rounded-lg shrink-0 ${
                                nest.category === "music" ? "bg-violet-500/15 text-violet-400 border border-violet-500/20" : "bg-pink-500/15 text-pink-400 border border-pink-500/20"
                              }`}>
                                {nest.category === "music" ? <Music className="w-5 h-5" /> : <Palette className="w-5 h-5" />}
                              </div>
                              <div className="text-left text-xs">
                                <strong className="text-white block">
                                  <TranslatedText text={nest.title} targetLang={profile.language} />
                                </strong>
                                <div className="text-slate-400 mt-1 leading-normal">
                                  <TranslatedText text={nest.description} targetLang={profile.language} isParagraph={true} />
                                </div>
                                <span className="text-[10px] bg-slate-950 border border-slate-800 text-slate-400 px-2 py-0.5 rounded mt-2 inline-block">
                                  🎁 Récompense : <strong className="text-amber-400">{nest.reward}</strong>
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeWorkspaceSubTab === "screenplay" && (
                    <ScreenplayEditor
                      unlockedClues={unlockedClues}
                      onSaveScreenplay={handleSaveScreenplay}
                      savedScreenplay={draftScreenplay}
                    />
                  )}

                  {activeWorkspaceSubTab === "music" && (
                    <SoundtrackStudio
                      onSaveSoundtrack={handleSaveMusic}
                      savedSoundtrack={draftMusic}
                    />
                  )}

                  {activeWorkspaceSubTab === "costume" && (
                    <DrawingBoard
                      onSaveSketch={handleSaveSketch}
                      savedSketch={draftCostume}
                      suggestedClues={unlockedClues.slice(0, 3)}
                    />
                  )}

                  {/* Final Submitting Form Frame to send to LinkYourArt Jury */}
                  <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl text-left space-y-4">
                    <div className="flex items-center gap-2">
                      <Award className="w-6 h-6 text-amber-400" />
                      <h3 className="text-lg font-bold text-white">Prêt à soumettre mon projet artistique à l'évaluation ?</h3>
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed">
                      Lorsque tu es fier de tes textes d'animation, de ta musique ou de ton dessin de styliste cosmique, remplis tes coordonnées pour transmettre ton travail au Comité d'Évaluation de LinkYourArt.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-800/60 max-w-3xl items-end">
                      <div className="space-y-1.5 text-left">
                        <label className="text-[10px] text-slate-400 uppercase tracking-wider font-mono font-medium block">
                          Mon Prénom Créatif
                        </label>
                        <input
                          type="text"
                          placeholder="Saisis ton prénom..."
                          value={childSubmitName}
                          onChange={(e) => setChildSubmitName(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500 text-xs text-white px-3 py-2 rounded-xl focus:outline-none transition font-sans"
                        />
                      </div>

                      <div className="space-y-1.5 text-left">
                        <label className="text-[10px] text-slate-400 uppercase tracking-wider font-mono font-medium block">
                          Mon Âge de participation (4 à 18 ans)
                        </label>
                        <input
                          type="number"
                          min="4"
                          max="18"
                          value={childSubmitAge}
                          onChange={(e) => setChildSubmitAge(parseInt(e.target.value))}
                          className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500 text-xs text-white px-3 py-2 rounded-xl focus:outline-none transition font-mono"
                        />
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSubmittingProject(activeWorkspaceSubTab === "guide" ? "screenplay" : activeWorkspaceSubTab)}
                          className="flex-1 py-2 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow transition transform active:scale-95 text-center cursor-pointer"
                        >
                          Soumettre mon Chef-d'Œuvre
                        </button>
                      </div>
                    </div>

                    {isSubmittedSuccessfully && (
                      <div className="p-4 bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20 rounded-2xl animate-pulse">
                        🚀 Magnifique ! Ton projet a été envoyé avec succès au Jury de LinkYourArt. Rend-toi dans l'onglet "Comité de Jury" en haut de la page pour jouer le rôle des experts professionnels et évaluer ton œuvre sous toutes ses coutures !
                      </div>
                    )}
                  </div>
                </div>

                {/* AI Coach Assistant Sidebar - 1 Column */}
                <div className="xl:col-span-1">
                  <AICreativeCoach
                    challengeTitle={challenge.title}
                    unlockedClues={unlockedClues}
                    draftScreenplay={draftScreenplay}
                    draftMusic={draftMusic}
                    draftCostume={draftCostume}
                  />
                </div>
              </div>
            </div>
          )}
        </main>
      ) : (
        // Professional Jury View
        <main className="max-w-7xl mx-auto px-6 mt-6 flex-1 w-full space-y-6">
          <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 text-left">
            <h4 className="text-xs font-bold text-amber-500 uppercase tracking-wider font-mono">
              Mode Évaluateur Activé
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              Vous agissez actuellement en tant que Juré professionnel pour l'évaluation et l'apport de feedback auprès des enfants. Sélectionnez le challenge à corriger ci-dessous :
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              {challenges.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActiveChallengeId(c.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    c.id === challenge.id
                      ? "bg-amber-500 text-slate-950"
                      : "bg-slate-950 border border-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  {c.title} ({c.isDemo ? "Démo" : "Réel"})
                </button>
              ))}
            </div>
          </div>

          <JuryDashboard
            challenge={challenge}
            onPostFeedback={handlePostFeedback}
            onAddClue={handleAddClue}
            onAdvanceTimeline={handleAdvanceTimeline}
            onResetTimeline={handleResetTimeline}
            onAddNewChallenge={handleAddNewChallenge}
          />
        </main>
      )}

      {/* Aesthetic human literal clean footer */}
      <footer className="mt-16 border-t border-slate-900 py-6 text-center text-slate-500 text-[11px] font-mono leading-relaxed">
        KIDIWORLD — Une plateforme d'incubation créative développée en partenariat exclusif avec LinkYourArt. <br />
        Dénichons et stimulons ensemble l'émergence de tous les talents de demain : cinéma, écriture, musique originale, stylisme de mode, graphisme, dessins, jeux vidéo et photographie !
      </footer>

      {/* GLOBAL HIGH-INDEX ONBOARDING WELCOME MODAL OVERLAY */}
      {isTutorialOpen && (
        <div 
          id="tutorial-modal-overlay" 
          className="fixed inset-0 bg-slate-950/90 backdrop-blur-2xl flex justify-center items-start md:items-center z-[9999] overflow-y-auto p-4 md:p-6 animate-fadeIn"
          onClick={(e) => {
            if ((e.target as HTMLElement).id === "tutorial-modal-overlay") {
              localStorage.setItem("kidiworld_welcome_tutorial_dismissed", "true");
              setIsTutorialOpen(false);
            }
          }}
        >
          <div className="relative w-full max-w-4xl bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-[0_0_80px_rgba(245,158,11,0.15)] flex flex-col md:flex-row transition-all duration-500 my-8">
            
            {/* Top glowing kinetic neon bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-pink-500 to-indigo-500 z-10" />

            {/* LEFT PROFILE EMBLEM BLOCK (COSMIC RADAR STATUS) */}
            <div className="w-full md:w-[290px] bg-slate-900/30 p-6 md:p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-900 shrink-0 relative overflow-hidden">
              {/* Internal glow accents */}
              <div className="absolute -left-12 -top-12 w-44 h-44 rounded-full bg-indigo-500/10 blur-3xl" />
              <div className="absolute -right-12 -bottom-12 w-44 h-44 rounded-full bg-amber-500/10 blur-3xl" />

              <div className="space-y-6 relative z-10 text-left">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/25 text-amber-400 text-[9px] font-black uppercase tracking-widest rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                    Creative Hub
                  </div>
                  <h3 className="text-2xl font-black text-white tracking-tight leading-none">
                    KIDI<span className="text-amber-400">WORLD</span>
                  </h3>
                  <p className="text-[10.5px] text-slate-400 font-bold leading-relaxed">
                    L'incubateur de talents artistiques pour les créateurs de 4 à 18 ans !
                  </p>
                </div>

                {/* Integration Details card */}
                <div className="space-y-3 pt-4 border-t border-slate-900">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider font-mono block">Ton Profil Actif :</span>
                  
                  {/* Participant Card */}
                  <div className="p-3 bg-slate-950/60 border border-slate-900/60 rounded-xl flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1.5">
                      <Bot className="w-3.5 h-3.5 text-amber-500" /> Nom :
                    </span>
                    <span className="text-[10px] font-black text-white">
                      {profile.childName}
                    </span>
                  </div>

                  {/* Role Card */}
                  <div className="p-3 bg-slate-950/60 border border-slate-900/60 rounded-xl flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-indigo-450" /> Rôle :
                    </span>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg border ${
                      role === "jury"
                        ? "bg-pink-500/10 border-pink-500/25 text-pink-400"
                        : "bg-amber-500/10 border-amber-500/25 text-amber-400"
                    }`}>
                      {role === "jury" ? "Comité Jury" : "Jeune Artiste"}
                    </span>
                  </div>

                  {/* Stars Card */}
                  <div className="p-3 bg-slate-950/60 border border-slate-900/60 rounded-xl flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-amber-500" /> Palmarès :
                    </span>
                    <span className="text-[10px] font-black text-white font-mono flex items-center gap-1">
                      {statsStars} Étoiles ⭐
                    </span>
                  </div>

                  {/* Coins Card */}
                  <div className="p-3 bg-slate-950/60 border border-slate-900/60 rounded-xl flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1.5">
                      <Coins className="w-3.5 h-3.5 text-amber-500" /> KidiCoins :
                    </span>
                    <span className="text-[10px] font-black text-amber-400 font-mono">
                      {accountSession.kidiCoins} Coins 💰
                    </span>
                  </div>
                </div>
              </div>

              {/* Sidebar Footer brand-note */}
              <div className="pt-6 border-t border-slate-900/60 mt-6 md:mt-0 relative z-10 text-left">
                <p className="text-[9.5px] text-slate-500 leading-normal font-semibold">
                  Soutenu par <strong className="text-slate-400 font-bold">LinkYourArt</strong>, incubateur mondial de l'excellence artistique.
                </p>
              </div>
            </div>

            {/* RIGHT COLUMN: INTERACTIVE SLIDES SECTION */}
            <div className="flex-1 p-6 md:p-8 flex flex-col justify-between space-y-6 bg-slate-950 text-left">
              
              {/* Stepper progress & header indicators */}
              <div className="flex justify-between items-center pb-4 border-b border-slate-900">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-indigo-455 uppercase tracking-widest font-mono">
                      GUIDE D'INITIATION DÉFI ARTISTIQUE
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-800" />
                    <span className="text-[10px] font-semibold text-slate-400 font-mono">
                      Étape {tutorialStep} sur 3
                    </span>
                  </div>

                  {/* Progress sliding trace */}
                  <div className="flex items-center gap-1 w-24 h-1 bg-slate-900 rounded-full overflow-hidden mt-1">
                    <div 
                      className={`h-full transition-all duration-500 rounded-full ${
                        tutorialStep === 1 ? "w-1/3 bg-amber-500" : tutorialStep === 2 ? "w-2/3 bg-pink-500" : "w-full bg-indigo-500"
                      }`}
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    localStorage.setItem("kidiworld_welcome_tutorial_dismissed", "true");
                    setIsTutorialOpen(false);
                  }}
                  className="px-2.5 py-1 text-[10px] font-extrabold text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition"
                >
                  Fermer [×]
                </button>
              </div>

              {/* Active tutorial content cards */}
              <div className="flex-1 py-1">
                {tutorialStep === 1 && (
                  <div className="space-y-5 animate-fadeIn">
                    <div className="space-y-1">
                      <h4 className="text-lg font-black text-white flex items-center gap-2">
                        <span>Étape 1 : Libère ton Génie Créatif !</span>
                        <span className="text-amber-400">🎨</span>
                      </h4>
                      <p className="text-xs text-slate-400 font-semibold">
                        Trois ateliers amusants pour écrire, dessiner et composer ton univers original :
                      </p>
                    </div>

                    <div className="grid gap-3.5">
                      {/* Sub-item Film Dialogue */}
                      <div className="p-3 bg-slate-900/40 border border-slate-900/60 rounded-xl flex gap-3 hover:border-amber-500/20 hover:bg-slate-900/60 transition duration-300">
                        <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg flex-shrink-0 border border-amber-500/20 h-9 w-9 flex items-center justify-center">
                          <Film className="w-4 h-4" />
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-xs font-extrabold text-slate-200">Scénariste de Cinéma d'Animation 📜</span>
                          <p className="text-[11px] text-slate-400 leading-relaxed font-semibold">
                            Écris ton histoire ou utilise nos modèles d'aventure. Clique sur l'onglet <strong className="text-amber-400 font-bold">"🎬 Aperçu Cinéma"</strong> pour formater tes répliques automatiquement à la hollywoodienne, puis télécharge le PDF !
                          </p>
                        </div>
                      </div>

                      {/* Sub-item Canvas sketch */}
                      <div className="p-3 bg-slate-900/40 border border-slate-900/60 rounded-xl flex gap-3 hover:border-pink-500/20 hover:bg-slate-900/60 transition duration-300">
                        <div className="p-2 bg-pink-500/10 text-pink-400 rounded-lg flex-shrink-0 border border-pink-500/20 h-9 w-9 flex items-center justify-center">
                          <PenTool className="w-4 h-4" />
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-xs font-extrabold text-slate-200">Dessinateur Galactique & Autocollants 🎨</span>
                          <p className="text-[11px] text-slate-400 leading-relaxed font-semibold">
                            Peins avec le pinceau laser ou efface d'un trait. Amuse-toi avec les <strong className="text-pink-400 font-bold">Tampons Stellaires</strong> : sélectionne un emoji rigolo pour dessiner des tampons géants en couleur !
                          </p>
                        </div>
                      </div>

                      {/* Sub-item Music track */}
                      <div className="p-3 bg-slate-900/40 border border-slate-900/60 rounded-xl flex gap-3 hover:border-indigo-500/20 hover:bg-slate-900/60 transition duration-300">
                        <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg flex-shrink-0 border border-indigo-500/20 h-9 w-9 flex items-center justify-center">
                          <Volume2 className="w-4 h-4" />
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-xs font-extrabold text-slate-200">Compositeur Symphonique & Rythmes 🎵</span>
                          <p className="text-[11px] text-slate-400 leading-relaxed font-semibold">
                            Imagine une bande-son rétro-gaming, rythme tes percussions stellaires et joue sur le synthétiseur spatial pour donner du relief sonore à tes histoires d'animation.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {tutorialStep === 2 && (
                  <div className="space-y-5 animate-fadeIn">
                    <div className="space-y-1">
                      <h4 className="text-lg font-black text-white flex items-center gap-2">
                        <span>Étape 2 : Le Comité d'Évaluation de Jury Pro !</span>
                        <span className="text-pink-400">🎬</span>
                      </h4>
                      <p className="text-xs text-slate-400 font-semibold">
                        Fais analyser tes chefs-d'œuvre par des experts bienveillants de LinkYourArt pour progresser :
                      </p>
                    </div>

                    <div className="grid gap-3.5">
                      {/* Sub-item submitted works */}
                      <div className="p-3 bg-slate-900/40 border border-slate-900/60 rounded-xl flex gap-3 hover:border-pink-500/20 hover:bg-slate-900/60 transition duration-300">
                        <div className="p-2 bg-pink-500/10 text-pink-400 rounded-lg flex-shrink-0 border border-pink-500/20 h-9 w-9 flex items-center justify-center">
                          <Award className="w-4 h-4" />
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-xs font-extrabold text-slate-200">Présente tes œuvres comme un Professionnel 🎭</span>
                          <p className="text-[11px] text-slate-400 leading-relaxed font-semibold">
                            Bascule vers l'espace <strong className="text-pink-400 font-bold">Comité Jury Pro</strong> pour évaluer tes créations et celles de tes paires avec les boutons de notation bienveillants.
                          </p>
                        </div>
                      </div>

                      {/* Sub-item recommendations feedback */}
                      <div className="p-3 bg-slate-900/40 border border-slate-900/60 rounded-xl flex gap-3 hover:border-emerald-500/20 hover:bg-slate-900/60 transition duration-300">
                        <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg flex-shrink-0 border border-emerald-500/20 h-9 w-9 flex items-center justify-center">
                          <Sparkles className="w-4 h-4" />
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-xs font-extrabold text-slate-200">Retours Chaleureux & Conseils Stimulants ❤️</span>
                          <p className="text-[11px] text-slate-400 leading-relaxed font-semibold">
                            Nos experts de l'animation te partagent de vrais secrets d'écriture, de la bienveillance constructive et des encouragements chaleureux pour t'améliorer sans pression.
                          </p>
                        </div>
                      </div>

                      {/* Sub-item stargift */}
                      <div className="p-3 bg-slate-900/40 border border-slate-900/60 rounded-xl flex gap-3 hover:border-amber-500/20 hover:bg-slate-900/60 transition duration-300">
                        <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg flex-shrink-0 border border-amber-500/20 h-9 w-9 flex items-center justify-center">
                          <Coins className="w-4 h-4" />
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-xs font-extrabold text-slate-200">Gagne d'Inestimables KidiCoins 💰</span>
                          <p className="text-[11px] text-slate-400 leading-relaxed font-semibold">
                            Chaque correction constructive et chaque projet validé augmente ton score en étoiles et crédite ton portefeuille de KidiCoins récompensés.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {tutorialStep === 3 && (
                  <div className="space-y-5 animate-fadeIn">
                    <div className="space-y-1">
                      <h4 className="text-lg font-black text-white flex items-center gap-2">
                        <span>Étape 3 : Une Session Sécurisée & Équilibrée !</span>
                        <span className="text-indigo-400">🛡️</span>
                      </h4>
                      <p className="text-xs text-slate-400 font-semibold">
                        Le tableau de bord adulte KidiSafe assure la sérénité de toute la famille :
                      </p>
                    </div>

                    <div className="grid gap-3.5">
                      {/* Sub-item safe parental configuration controls info */}
                      <div className="p-3 bg-slate-900/40 border border-slate-900/60 rounded-xl flex gap-3 hover:border-pink-500/20 hover:bg-slate-900/60 transition duration-300">
                        <div className="p-2 bg-pink-500/10 text-pink-400 rounded-lg flex-shrink-0 border border-pink-500/20 h-9 w-9 flex items-center justify-center">
                          <Shield className="w-4 h-4" />
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-xs font-extrabold text-slate-200">Contrôle Adulte Protégé KidiSafe 🔒</span>
                          <p className="text-[11px] text-slate-400 leading-relaxed font-semibold">
                            Entrez votre email de tuteur dans l'onglet de contrôle pour ajuster les limites intelligentes de temps d'écran hebdomadaire et superviser les projets en toute sérénité.
                          </p>
                        </div>
                      </div>

                      {/* Sub-item dynamic gauges screen life */}
                      <div className="p-3 bg-slate-900/40 border border-slate-900/60 rounded-xl flex gap-3 hover:border-emerald-500/20 hover:bg-slate-900/60 transition duration-300">
                        <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg flex-shrink-0 border border-emerald-500/20 h-9 w-9 flex items-center justify-center">
                          <Clock className="w-4 h-4" />
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-xs font-extrabold text-slate-200">Compteur de Temps Visuel Adaptatif ⏳</span>
                          <p className="text-[11px] text-slate-400 leading-relaxed font-semibold">
                            Une jauge chromatique glisse doucement du vert vif vers le rouge alarmant dans l'inspecteur pour aider les enfants à doser calmement l'exposition aux écrans.
                          </p>
                        </div>
                      </div>

                      {/* Sub-item custom options space language */}
                      <div className="p-3 bg-slate-900/40 border border-slate-900/60 rounded-xl flex gap-3 hover:border-indigo-500/20 hover:bg-slate-900/60 transition duration-300">
                        <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg flex-shrink-0 border border-indigo-500/20 h-9 w-9 flex items-center justify-center">
                          <Globe className="w-4 h-4" />
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-xs font-extrabold text-slate-200">Choisis ta Langue de Travail 🌍</span>
                          <p className="text-[11px] text-slate-400 leading-relaxed font-semibold">
                            Apprends en t'amusant ! Bascule ton profil d'artiste à tout moment pour pratiquer l'anglais, l'espagnol, le japonais ou le français d'un simple geste.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer controls for steps */}
              <div className="pt-4 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-[10px] text-slate-500 font-semibold italic flex items-center gap-1">
                  🍵 Pensez à faire une petite pause active toutes les 15 minutes !
                </span>

                <div className="flex gap-2.5 w-full sm:w-auto">
                  {tutorialStep > 1 && (
                    <button
                      type="button"
                      onClick={() => setTutorialStep(prev => prev - 1)}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white font-bold text-xs rounded-xl shadow transition cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" /> Précédent
                    </button>
                  )}

                  {tutorialStep < 3 ? (
                    <button
                      type="button"
                      onClick={() => setTutorialStep(prev => prev + 1)}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-xs rounded-xl shadow transition cursor-pointer"
                    >
                      Suivant <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        localStorage.setItem("kidiworld_welcome_tutorial_dismissed", "true");
                        setIsTutorialOpen(false);
                      }}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg transition transform active:scale-95 cursor-pointer"
                    >
                      C'est parti ! 🚀
                    </button>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
