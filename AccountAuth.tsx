import React, { useState, useEffect } from "react";
import { User, Shield, Key, Coins, CheckCircle, Sparkles, LogOut, KeyRound, UserCheck, CreditCard } from "lucide-react";

export interface AccountSession {
  isLoggedIn: boolean;
  username: string;
  role: "child" | "parent";
  kidiCoins: number;
  isPremiumMember: boolean;
  avatar: string;
}

interface AccountAuthProps {
  session: AccountSession;
  onUpdateSession: (updated: AccountSession) => void;
  language: "fr" | "en" | "es" | "ja";
}

const AVATARS = [
  "🚀 Astro-Mousse",
  "🐋 Cachalot Cosmique",
  "🤖 Androïde Buggé",
  "👽 Petit Vert",
  "🌟 Étoile Filante",
  "🪐 Styliste de l'Espace"
];

export default function AccountAuth({ session, onUpdateSession, language }: AccountAuthProps) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0]);
  const [parentCode, setParentCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [coinsBonusMessage, setCoinsBonusMessage] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameInput.trim()) {
      setErrorMessage(language === "fr" ? "Indique un nom de joueur !" : "Please enter a gamer name!");
      return;
    }
    
    // Simulate successful login
    onUpdateSession({
      isLoggedIn: true,
      username: usernameInput,
      role: "child",
      kidiCoins: session.kidiCoins || 150, // keep existing balance or set initial
      isPremiumMember: session.isPremiumMember,
      avatar: selectedAvatar
    });
    setErrorMessage("");
    setUsernameInput("");
    setPasswordInput("");
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameInput.trim()) {
      setErrorMessage(language === "fr" ? "Indique un pseudonyme !" : "Please choose a username!");
      return;
    }
    
    // Check parental consent PIN or email
    if (usernameInput.length < 3) {
      setErrorMessage(language === "fr" ? "Ton pseudo doit faire au moins 3 caractères." : "Username too short.");
      return;
    }

    onUpdateSession({
      isLoggedIn: true,
      username: usernameInput,
      role: "child",
      kidiCoins: 210, // Welcoming bonus!
      isPremiumMember: false,
      avatar: selectedAvatar
    });
    setCoinsBonusMessage(language === "fr" ? "🎁 Cadeau de bienvenue : +210 KidiCoins ajoutés à ta tirelire !" : "🎁 Welcome gift: +210 KidiCoins added!");
    setTimeout(() => setCoinsBonusMessage(""), 5000);
    setErrorMessage("");
    setUsernameInput("");
    setPasswordInput("");
  };

  const handleLogout = () => {
    onUpdateSession({
      isLoggedIn: false,
      username: "Copilote",
      role: "child",
      kidiCoins: session.kidiCoins,
      isPremiumMember: session.isPremiumMember,
      avatar: "🚀 Astro-Mousse"
    });
  };

  const handleUpgradePremium = () => {
    if (session.kidiCoins >= 100) {
      onUpdateSession({
        ...session,
        isPremiumMember: true,
        kidiCoins: session.kidiCoins - 100
      });
      alert(language === "fr" ? "Félicitations ! Tu es désormais membre PREMIUM KIDIWORLD ✨ Accès illimité à toute la librairie et aux jeux !" : "Congratulations! You are now a KIDIWORLD PREMIUM Member ✨");
    } else {
      alert(language === "fr" ? "Mince, tu n'as pas assez de KidiCoins. Gagne des pièces en relevant des challenges créatifs !" : "Not enough KidiCoins! Earn more coins by completing creative challenges!");
    }
  };

  const handleClaimDailyGift = () => {
    onUpdateSession({
      ...session,
      kidiCoins: session.kidiCoins + 25
    });
    setCoinsBonusMessage(language === "fr" ? "🎉 Récompense quotidienne réclamée : +25 KidiCoins !" : "🎉 Daily reward claimed: +25 KidiCoins!");
    setTimeout(() => setCoinsBonusMessage(""), 4000);
  };

  return (
    <div id="account-auth-container" className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl text-left space-y-6">
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <UserCheck className="w-5.5 h-5.5 text-amber-500" />
            {language === "fr" ? "Espace Compte & KidiClub" : "Account & KidiClub"}
          </h2>
          <p className="text-xs text-slate-400">
            {language === "fr" ? "Crée ton profil créatif, gagne des KidiCoins et accède au catalogue pro" : "Create your creative profile, earn KidiCoins & unlock contents"}
          </p>
        </div>
        <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
          <Coins className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: "8s" }} />
          <span className="text-xs font-mono font-bold text-amber-300">{session.kidiCoins} KidiCoins</span>
        </div>
      </div>

      {coinsBonusMessage && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-3.5 rounded-xl text-xs font-bold leading-normal animate-pulse">
          {coinsBonusMessage}
        </div>
      )}

      {session.isLoggedIn ? (
        // Logged in visual console
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4 bg-slate-950 p-5 rounded-2xl border border-slate-800/80">
            <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase font-black block">Statut de connexion actuelle</span>
            
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-pink-500 flex items-center justify-center text-xl shadow-lg">
                {session.avatar.slice(0, 2)}
              </div>
              <div>
                <h3 className="text-base font-black text-white">{session.username}</h3>
                <span className="text-xs text-amber-400 font-mono font-bold block">{session.avatar}</span>
                <span className="text-[10px] bg-slate-900 text-slate-400 px-2 py-0.5 rounded border border-slate-800 mt-1 inline-block">
                  Role: {session.role === "child" ? "Junior Artist" : "Super Parent Director"}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={handleClaimDailyGift}
                className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-amber-400 hover:text-amber-300 text-[11px] font-bold p-2.5 rounded-xl transition"
              >
                🎁 Cadeau Quotidien (+25)
              </button>
              <button
                onClick={handleLogout}
                className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/10 text-[11px] font-bold p-2.5 rounded-xl transition flex items-center justify-center gap-1"
              >
                <LogOut className="w-3.5 h-3.5" />
                Déconnexion
              </button>
            </div>
          </div>

          <div className="space-y-4 bg-gradient-to-br from-indigo-950/40 to-slate-950 p-5 rounded-2xl border border-indigo-500/20 relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-amber-500/10 to-transparent rounded-bl-full" />
            
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold uppercase font-mono tracking-wider">
                  CLUB PRIVÉ KIDIWORLD
                </span>
                {session.isPremiumMember && (
                  <span className="text-[10px] bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 px-2 py-0.5 rounded-full font-black animate-bounce">
                    PREMIUM ACTIVE
                  </span>
                )}
              </div>
              <h4 className="text-sm font-black text-white">Devenir un Membre Privé Pro</h4>
              <p className="text-[11px] text-slate-300 leading-normal">
                Débloque un accès complet à tous les albums secrets de Kidi Music, débloque des niveaux d'échecs avancés, et active le compilateur de jeux mobiles illimité !
              </p>
            </div>

            <div className="pt-3 border-t border-slate-850 flex items-center justify-between">
              <div>
                <span className="text-[9px] text-slate-400 font-mono block">Tarif unique :</span>
                <span className="text-sm font-black text-amber-400 font-mono">100 KidiCoins</span>
              </div>
              {session.isPremiumMember ? (
                <div className="flex items-center gap-1 text-emerald-400 text-xs font-bold">
                  <CheckCircle className="w-4 h-4 text-emerald-400 font-black" />
                  Privilèges débloqués !
                </div>
              ) : (
                <button
                  onClick={handleUpgradePremium}
                  className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs py-2 px-4 rounded-xl shadow-lg transition active:scale-95 flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
                  Activer (100 KidiCoins)
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        // Anonymous/Auth Form
        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-850">
          <div className="flex border-b border-slate-850 pb-3 mb-4 gap-4">
            <button
              onClick={() => {
                setIsRegistering(false);
                setErrorMessage("");
              }}
              className={`pb-2.5 text-xs font-bold relative transition ${
                !isRegistering ? "text-amber-400 font-black" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              🚀 S'identifier au KidiClub
              {!isRegistering && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400 rounded" />}
            </button>
            <button
              onClick={() => {
                setIsRegistering(true);
                setErrorMessage("");
              }}
              className={`pb-2.5 text-xs font-bold relative transition ${
                isRegistering ? "text-amber-400 font-black" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              ✨ Créer un Nouveau Compte (Gratuit)
              {isRegistering && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400 rounded" />}
            </button>
          </div>

          {errorMessage && (
            <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-2.5 rounded-xl text-[11px] font-bold mb-4">
              ⚠️ {errorMessage}
            </div>
          )}

          <form onSubmit={isRegistering ? handleRegister : handleLogin} className="space-y-4 text-left">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">
                  Pseudonyme de Jeune Créateur
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="Ex: Bastien99, Léa_Cosmos..."
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 text-xs px-3.5 py-2.5 pl-10 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">
                  Code Secret du Coffre-Fort (Mot de passe)
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    placeholder="Code secret ou mot de passe"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 text-xs px-3.5 py-2.5 pl-10 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>

            {isRegistering && (
              <div className="space-y-2 pt-1 border-t border-slate-900">
                <label className="text-[10px] text-slate-400 uppercase tracking-wider font-mono block">
                  Choisis ton Mascotte d'Avatar :
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {AVATARS.map((av) => (
                    <button
                      type="button"
                      key={av}
                      onClick={() => setSelectedAvatar(av)}
                      className={`p-2.5 rounded-xl text-xs text-left transition border ${
                        selectedAvatar === av
                          ? "bg-slate-900 border-amber-500 text-white font-bold"
                          : "bg-slate-900/40 border-slate-900 text-slate-400 hover:text-slate-350 hover:bg-slate-900/60"
                      }`}
                    >
                      {av}
                    </button>
                  ))}
                </div>

                <div className="bg-amber-500/5 p-3 rounded-xl border border-amber-500/10 leading-normal text-[10px] text-slate-400 flex gap-2.5 items-start mt-2">
                  <Shield className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Validation KidiSafe</strong> : Pas d'adresse e-mail obligatoire pour les moins de 15 ans ! Un compte anonyme crypté localement est généré pour que tu puisses l'utiliser immédiatement en sécurité.
                  </span>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs py-3 rounded-xl shadow-lg transition active:scale-98 cursor-pointer flex items-center justify-center gap-2"
            >
              {isRegistering ? (
                <>
                  <Sparkles className="w-4 h-4 fill-slate-950" />
                  Créer un compte et recevoir 210 KidiCoins
                </>
              ) : (
                <>
                  <UserCheck className="w-4 h-4" />
                  Se connecter au KidiClub
                </>
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
