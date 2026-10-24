"use client";

import type { ChatLanguage, WorkerRole } from "@/lib/prompts";
import { UI_TRANSLATIONS } from "@/lib/translations";
import {
  ShieldCheck,
  Fuel,
  FileText,
  LifeBuoy,
  Zap,
  MapPin,
  ShieldAlert,
  Sparkles,
} from "lucide-react";

interface HeroBannerProps {
  role: WorkerRole;
  language: ChatLanguage;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function HeroBanner({ role, language, activeTab, onTabChange }: HeroBannerProps) {
  const t = UI_TRANSLATIONS[language];

  const greetings: Record<ChatLanguage, string> = {
    English: "Welcome to Saarthi AI",
    Hindi: "सारथी एआई में आपका स्वागत है",
    Punjabi: "ਸਾਰਥੀ ਏਆਈ ਵਿੱਚ ਤੁਹਾਡਾ ਸਵਾਗਤ ਹੈ",
  };

  const highlightPills = [
    { id: "chat", label: t.tabChat, icon: Zap, color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" },
    { id: "appeals", label: t.tabAppeals, icon: ShieldCheck, color: "text-cyan-500 bg-cyan-500/10 border-cyan-500/20" },
    { id: "fuel", label: t.tabFuel, icon: Fuel, color: "text-amber-500 bg-amber-500/10 border-amber-500/20" },
    { id: "map", label: t.tabMap, icon: MapPin, color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" },
    { id: "documents", label: t.tabDocuments, icon: FileText, color: "text-purple-500 bg-purple-500/10 border-purple-500/20" },
    { id: "schemes", label: t.tabSchemes, icon: LifeBuoy, color: "text-blue-500 bg-blue-500/10 border-blue-500/20" },
    { id: "guardian", label: t.tabGuardian, icon: ShieldAlert, color: "text-rose-500 bg-rose-500/10 border-rose-500/20" },
  ];

  return (
    <div className="relative overflow-hidden rounded-3xl border border-black/10 dark:border-white/10 bg-gradient-to-b dark:from-[#0F172A] dark:via-[#0E1526] dark:to-[#070A12] from-white via-slate-50 to-slate-100 p-6 sm:p-8 mb-6 shadow-2xl transition">
      {/* Glow backgrounds */}
      <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-3">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            {t.heroBadge}
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {greetings[language]}
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-zinc-300 leading-relaxed">
            {t.heroTagline}
          </p>

          {/* Quick tab highlights */}
          <div className="mt-5 flex flex-wrap gap-2">
            {highlightPills.map((pill) => {
              const Icon = pill.icon;
              const isActive = activeTab === pill.id;
              return (
                <button
                  key={pill.id}
                  onClick={() => onTabChange(pill.id)}
                  className={`flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-semibold transition active:scale-95 ${
                    isActive
                      ? "border-emerald-500 bg-emerald-500 text-black shadow-md shadow-emerald-500/20 font-bold"
                      : "border-black/10 dark:border-white/10 dark:bg-[#0E1526]/80 bg-white text-slate-700 dark:text-zinc-300 hover:border-emerald-500/40 hover:text-emerald-500"
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? "text-black" : pill.color.split(" ")[0]}`} />
                  <span>{pill.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Live Stats Pill Card */}
        <div className="grid grid-cols-2 gap-3 sm:w-72 shrink-0">
          <div className="rounded-2xl border border-black/10 dark:border-white/[0.08] dark:bg-white/[0.02] bg-white p-3.5 shadow-sm backdrop-blur-md">
            <span className="text-[11px] font-medium text-slate-500 dark:text-zinc-400">
              {language === "Hindi" ? "समर्थित प्लेटफॉर्म" : language === "Punjabi" ? "ਸਮਰਥਿਤ ਪਲੇਟਫਾਰਮ" : "Supported Platforms"}
            </span>
            <span className="mt-1 block text-lg font-bold text-slate-900 dark:text-white">
              {t.supportedPlatformsCount}
            </span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400">
              Zomato, Swiggy, Uber +
            </span>
          </div>
          <div className="rounded-2xl border border-black/10 dark:border-white/[0.08] dark:bg-white/[0.02] bg-white p-3.5 shadow-sm backdrop-blur-md">
            <span className="text-[11px] font-medium text-slate-500 dark:text-zinc-400">
              {language === "Hindi" ? "सरकारी सुरक्षा" : language === "Punjabi" ? "ਸਰਕਾਰੀ ਸੁਰੱਖਿਆ" : "Govt Protection"}
            </span>
            <span className="mt-1 block text-lg font-bold text-cyan-600 dark:text-cyan-400">
              {t.govtInsuranceRange}
            </span>
            <span className="text-[10px] text-slate-500 dark:text-zinc-400">
              e-Shram & State Acts
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
