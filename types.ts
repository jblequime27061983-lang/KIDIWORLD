export interface UserProfile {
  childName: string;
  childAge: number; // 4 to 18
  language: "fr" | "en" | "es" | "ja";
  parentEmail: string;
  parentApproved: boolean;
  screenTimeLimitMinutes: number; // 15, 30, 45, 60 or unlimited
  preferredCategories: string[]; // e.g., ["cinema", "music"]
}

export interface Clue {
  day: number;
  title: string;
  description: string;
  type: "text" | "sound" | "image" | "keyword";
  content: string; // The specific index hint
  isUnlocked: boolean;
  unlockedAt?: string;
}

export interface NestedChallenge {
  id: string;
  title: string;
  category: "music" | "costume" | "poster";
  description: string;
  reward: string;
  status: "active" | "locked" | "completed";
}

export interface Submission {
  id: string;
  challengeId: string;
  authorName: string;
  authorAge: number;
  title: string;
  submittedAt: string;
  category: "all-in-one" | "screenplay" | "music" | "costume" | "poster";
  content: {
    screenplay?: {
      act1: string;
      act2: string;
      act3: string;
      title: string;
    };
    music?: {
      melody: number[];
      instrument: string;
      lyrics: string;
      tempo: number;
    };
    costume?: {
      imageUrl: string; 
      materials: string;
      name: string;
    };
    poster?: {
      tagline: string;
      themeColor: string;
      imageUrl: string;
    };
  };
  votes: number;
  feedback: {
    author: string;
    text: string;
    rating: number;
    date: string;
  }[];
}

export interface Challenge {
  id: string;
  title: string;
  subtitle: string;
  sponsor: string; // e.g. "Lucas Besson - LinkYourArt Movies"
  description: string;
  category: "cinema" | "music" | "design" | "animation" | "photography";
  ageGroup: "4-7" | "8-11" | "12-15" | "16-18"; 
  isDemo: boolean; // demo vs real flag
  startDate: string;
  endDate: string;
  cluesDurationDays: number; // e.g., 10 days
  currentSimulatedDay: number; // For demo/sandbox timeline control
  maxDays: number;
  clues: Clue[];
  nestedChallenges: NestedChallenge[];
  submissions: Submission[];
}

export interface Message {
  role: "user" | "coach";
  text: string;
  timestamp: string;
}
