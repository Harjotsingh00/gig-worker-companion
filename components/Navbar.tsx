"use client";

import type { ChatLanguage, WorkerRole } from "@/lib/prompts";
import { supportedLanguages, workerRoles } from "@/lib/prompts";
import { UI_TRANSLATIONS } from "@/lib/translations";
import {
  Sparkles,
  Key,
  ShieldAlert,
  Bike,
  Car,
  HardHat,
  Globe,
  Sun,
  Moon,
  MapPin,
} from "lucide-react";

interface NavbarProps {
  role: WorkerRole;
  language: ChatLanguage;
  onRoleChange: (role: WorkerRole) => void;
  onLanguageChange: (lang: ChatLanguage) => void;
  onOpenApiKey: () => void;
  onOpenSos: () => void;
  onOpenMap: () => void;
  hasApiKey: boolean;
  theme: "dark" | "light";
  onToggleTheme: () => void;
}

export default function Navbar({
  role,
  language,
  onRoleChange,
  onLanguageChange,
  onOpenApiKey,
  onOpenSos,
  onOpenMap,
  hasApiKey,
  theme,
  onToggleTheme,
}: NavbarProps) {
  const t = UI_TRANSLATIONS[language];

  const roleIcons: Record<WorkerRole, typeof Bike> = {
    "Delivery Partner": Bike,
    Driver: Car,
    "Daily-wage": HardHat,
  };

  const roleNamesTranslated: Record<WorkerRole, Record<ChatLanguage, string>> = {
    "Delivery Partner": {
      English: "Delivery Partner",
      Hindi: "डिलीवरी पार्टनर (Swiggy/Zomato/Zepto)",
      Punjabi: "ਡਿਲੀਵਰੀ ਪਾਰਟਨਰ (ਸਵਿਗੀ/ਜ਼ੋਮੈਟੋ)",
    },
    Driver: {
      English: "Cab/Auto Driver",
      Hindi: "ड्राइवर (Uber/Ola/Rapido/Porter)",
      Punjabi: "ਕੈਬ/ਆਟੋ ਡਰਾਈਵਰ (ਊਬਰ/ਓਲਾ)",
    },
    "Daily-wage": {
      English: "Daily-wage / Worker",
      Hindi: "दैनिक वेतन / श्रमिक साथी",
      Punjabi: "ਦਿਹਾੜੀਦਾਰ / ਕਾਮਾ ਸਾਥੀ",
    },
  };

  const CurrentRoleIcon = roleIcons[role] || Bike;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-black/10 dark:border-white/[0.08] bg-white/85 dark:bg-[#070A12]/85 backdrop-blur-xl transition">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-400 font-black text-black shadow-lg shadow-emerald-500/20">
              <span className="text-xl tracking-tighter">स</span>
            </div>
            <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-[#070A12]"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white sm:text-lg">
                Saarthi <span className="bg-gradient-to-r from-emerald-500 to-cyan-500 bg-clip-text text-transparent">AI</span>
              </span>
              <span className="hidden items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400 sm:flex">
                <Sparkles className="h-2.5 w-2.5" /> {t.geminiBadge}
              </span>
            </div>
            <span className="hidden text-[11px] text-slate-500 dark:text-zinc-400 sm:block">
              {t.appSubtitle}
            </span>
          </div>
        </div>

        {/* Controls: Role, Language, Theme, Map, Key & SOS */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Work Role Selector */}
          <div className="relative hidden md:flex items-center rounded-xl border border-black/10 dark:border-white/10 dark:bg-[#0E1526] bg-slate-100 px-2.5 py-1.5 transition hover:border-emerald-500/40">
            <CurrentRoleIcon className="mr-1.5 h-3.5 w-3.5 text-emerald-500" />
            <select
              value={role}
              onChange={(e) => onRoleChange(e.target.value as WorkerRole)}
              className="bg-transparent text-xs font-semibold text-slate-800 dark:text-zinc-200 outline-none cursor-pointer"
              aria-label={t.roleLabel}
            >
              {workerRoles.map((item) => (
                <option key={item} value={item} className="dark:bg-[#0E1526] bg-white text-slate-900 dark:text-white">
                  {roleNamesTranslated[item][language] || item}
                </option>
              ))}
            </select>
          </div>

          {/* Language Selector */}
          <div className="relative flex items-center rounded-xl border border-black/10 dark:border-white/10 dark:bg-[#0E1526] bg-slate-100 px-2.5 py-1.5 transition hover:border-cyan-500/40">
            <Globe className="mr-1.5 h-3.5 w-3.5 text-cyan-500" />
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value as ChatLanguage)}
              className="bg-transparent text-xs font-bold text-slate-800 dark:text-zinc-200 outline-none cursor-pointer"
              aria-label={t.languageLabel}
            >
              {supportedLanguages.map((item) => (
                <option key={item} value={item} className="dark:bg-[#0E1526] bg-white text-slate-900 dark:text-white">
                  {item === "Hindi" ? "हिन्दी (Hindi)" : item === "Punjabi" ? "ਪੰਜਾਬੀ (Punjabi)" : "English"}
                </option>
              ))}
            </select>
          </div>

          {/* Theme Changer (Light / Dark) */}
          <button
            type="button"
            onClick={onToggleTheme}
            className="flex items-center justify-center rounded-xl border border-black/10 dark:border-white/10 dark:bg-white/[0.04] bg-slate-100 p-2 text-slate-700 dark:text-zinc-300 hover:border-emerald-500/40 transition active:scale-95"
            title={theme === "dark" ? t.themeToggleLight : t.themeToggleDark}
            aria-label="Toggle Light and Dark Mode"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4 text-amber-400" />
            ) : (
              <Moon className="h-4 w-4 text-slate-700" />
            )}
          </button>

          {/* Live Map Quick Access */}
          <button
            type="button"
            onClick={onOpenMap}
            className="hidden sm:flex items-center gap-1.5 rounded-xl border border-black/10 dark:border-white/10 dark:bg-white/[0.04] bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-800 dark:text-zinc-300 hover:border-emerald-500/40 transition active:scale-95"
            title="Live GPS Map"
          >
            <MapPin className="h-3.5 w-3.5 text-emerald-500" />
            <span className="hidden lg:inline">{t.tabMap}</span>
          </button>

          {/* API Key Modal Button */}
          <button
            type="button"
            onClick={onOpenApiKey}
            className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-medium transition ${
              hasApiKey
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20"
                : "border-black/10 dark:border-white/10 dark:bg-white/[0.04] bg-slate-100 text-slate-700 dark:text-zinc-300 hover:border-black/20"
            }`}
            title="Configure Gemini API Key"
          >
            <Key className="h-3.5 w-3.5" />
            <span className="hidden md:inline">{t.apiKeyButton}</span>
            <span
              className={`h-2 w-2 rounded-full ${
                hasApiKey ? "bg-emerald-500" : "bg-amber-400 animate-pulse"
              }`}
            />
          </button>

          {/* Emergency SOS Button */}
          <button
            type="button"
            onClick={onOpenSos}
            className="flex items-center gap-1.5 rounded-xl border border-rose-500/40 bg-rose-500/15 px-3 py-1.5 text-xs font-bold text-rose-600 dark:text-rose-300 transition hover:bg-rose-500/25 hover:border-rose-500 active:scale-95 shadow-md shadow-rose-950/20"
            aria-label={t.sosButton}
          >
            <ShieldAlert className="h-4 w-4 text-rose-500 animate-pulse" />
            <span>{t.sosButton}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
