"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import HeroBanner from "@/components/HeroBanner";
import ApiKeyModal from "@/components/ApiKeyModal";
import ChatView from "@/components/ChatView";
import AppealShield from "@/components/AppealShield";
import ProfitabilityMatrix from "@/components/ProfitabilityMatrix";
import DocumentAuditor from "@/components/DocumentAuditor";
import LiveLocationMap from "@/components/LiveLocationMap";
import GuardianSOS from "@/components/GuardianSOS";
import SchemeNavigator from "@/components/SchemeNavigator";
import HotspotRadar from "@/components/HotspotRadar";
import type { ChatLanguage, WorkerRole } from "@/lib/prompts";
import { UI_TRANSLATIONS } from "@/lib/translations";
import {
  MessageSquare,
  ShieldCheck,
  Fuel,
  FileText,
  LifeBuoy,
  Navigation,
  ShieldAlert,
  Sparkles,
  MapPin,
} from "lucide-react";

export default function Home() {
  const [role, setRole] = useState<WorkerRole>("Delivery Partner");
  const [language, setLanguage] = useState<ChatLanguage>("English");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [activeTab, setActiveTab] = useState<string>("chat");
  const [apiKeyModalOpen, setApiKeyModalOpen] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [autoPromptText, setAutoPromptText] = useState<string | null>(null);

  // Initialize theme, language, and API key from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedKey = localStorage.getItem("saarthi_gemini_key");
      if (storedKey) setApiKey(storedKey);

      const storedTheme = localStorage.getItem("saarthi_theme") as "dark" | "light" | null;
      if (storedTheme === "light" || storedTheme === "dark") {
        setTheme(storedTheme);
        document.documentElement.classList.toggle("dark", storedTheme === "dark");
      } else {
        document.documentElement.classList.add("dark");
      }

      const storedLang = localStorage.getItem("saarthi_lang") as ChatLanguage | null;
      if (storedLang && ["English", "Hindi", "Punjabi"].includes(storedLang)) {
        setLanguage(storedLang);
      }
    }
  }, []);

  function handleLanguageChange(lang: ChatLanguage) {
    setLanguage(lang);
    if (typeof window !== "undefined") {
      localStorage.setItem("saarthi_lang", lang);
    }
  }

  function handleToggleTheme() {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    if (typeof window !== "undefined") {
      localStorage.setItem("saarthi_theme", nextTheme);
      document.documentElement.classList.toggle("dark", nextTheme === "dark");
    }
  }

  // Auto-prompt handler: navigates to chat tab and populates prompt
  function handleSendPromptToChat(prompt: string) {
    setAutoPromptText(prompt);
    setActiveTab("chat");
  }

  function handleSendToAppealTab(
    discrepancyDetails: string,
    amount: string,
    platformName: string
  ) {
    setActiveTab("appeals");
  }

  const t = UI_TRANSLATIONS[language];

  const navTabs = [
    { id: "chat", label: t.tabChat, icon: MessageSquare, badge: "Voice" },
    { id: "appeals", label: t.tabAppeals, icon: ShieldCheck, badge: "Legal" },
    { id: "fuel", label: t.tabFuel, icon: Fuel, badge: "Profit" },
    { id: "map", label: t.tabMap, icon: MapPin, badge: "GPS" },
    { id: "documents", label: t.tabDocuments, icon: FileText, badge: "OCR" },
    { id: "guardian", label: t.tabGuardian, icon: ShieldAlert, badge: "24/7" },
    { id: "schemes", label: t.tabSchemes, icon: LifeBuoy, badge: "Govt" },
    { id: "radar", label: t.tabRadar, icon: Navigation, badge: "Surge" },
  ];

  return (
    <div className="min-h-screen dark:bg-[#070A12] bg-[#F1F5F9] dark:text-zinc-100 text-slate-900 flex flex-col font-sans transition-colors duration-200">
      {/* Top Navbar */}
      <Navbar
        role={role}
        language={language}
        onRoleChange={setRole}
        onLanguageChange={handleLanguageChange}
        onOpenApiKey={() => setApiKeyModalOpen(true)}
        onOpenSos={() => setActiveTab("guardian")}
        onOpenMap={() => setActiveTab("map")}
        hasApiKey={Boolean(apiKey)}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      {/* Main Container */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
        {/* Dynamic Hero Banner */}
        <HeroBanner
          role={role}
          language={language}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Tab Navigation Bar */}
        <div className="mb-6 flex items-center gap-1.5 overflow-x-auto rounded-2xl border border-black/10 dark:border-white/10 dark:bg-[#0E1526]/80 bg-white p-1.5 backdrop-blur-md shadow-sm scrollbar-hide">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition active:scale-95 ${
                  isActive
                    ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-black shadow-lg shadow-emerald-500/20"
                    : "text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? "text-black" : "text-emerald-500"}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`rounded-full px-1.5 py-0.2 text-[9px] font-bold ${
                      isActive
                        ? "bg-black/20 text-black"
                        : "bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-zinc-400"
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content Panels */}
        <div className="min-h-[500px]">
          {activeTab === "chat" && (
            <ChatView
              role={role}
              language={language}
              apiKey={apiKey}
              externalAutoPrompt={autoPromptText}
              onSendToAppeal={() => setActiveTab("appeals")}
            />
          )}

          {activeTab === "appeals" && (
            <AppealShield role={role} language={language} apiKey={apiKey} />
          )}

          {activeTab === "fuel" && (
            <ProfitabilityMatrix
              role={role}
              language={language}
              apiKey={apiKey}
              onAskGeminiTips={handleSendPromptToChat}
            />
          )}

          {activeTab === "map" && (
            <LiveLocationMap
              role={role}
              language={language}
              onAskAiWithLocation={handleSendPromptToChat}
            />
          )}

          {activeTab === "documents" && (
            <DocumentAuditor
              role={role}
              language={language}
              apiKey={apiKey}
              onDraftGrievance={handleSendPromptToChat}
              onSendToAppealTab={handleSendToAppealTab}
            />
          )}

          {activeTab === "guardian" && (
            <GuardianSOS role={role} language={language} />
          )}

          {activeTab === "schemes" && (
            <SchemeNavigator
              role={role}
              language={language}
              onAskGemini={handleSendPromptToChat}
            />
          )}

          {activeTab === "radar" && (
            <HotspotRadar
              role={role}
              language={language}
              onAskGemini={handleSendPromptToChat}
            />
          )}
        </div>
      </main>

      {/* Modern Footer */}
      <footer className="mt-12 border-t border-black/10 dark:border-white/[0.08] dark:bg-[#070A12]/90 bg-white/90 py-8 backdrop-blur-xl transition">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 text-center sm:flex-row sm:text-left sm:px-6 lg:px-8">
          <div className="flex items-center gap-2.5">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-tr from-emerald-500 to-cyan-500 text-black font-black text-xs">
              स
            </div>
            <div>
              <span className="block text-xs font-bold text-slate-900 dark:text-white">
                {t.appName} · Gig Worker Companion
              </span>
              <span className="block text-[11px] text-slate-500 dark:text-zinc-500">
                {t.footerDisclaimer}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-600 dark:text-zinc-400">
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
              <Sparkles className="h-3 w-3" /> {t.geminiBadge}
            </span>
            <span className="text-slate-400 dark:text-zinc-600">·</span>
            <button
              type="button"
              onClick={() => setApiKeyModalOpen(true)}
              className="hover:text-emerald-500 transition font-medium"
            >
              {t.apiKeyButton}
            </button>
            <span className="text-slate-400 dark:text-zinc-600">·</span>
            <button
              type="button"
              onClick={() => setActiveTab("guardian")}
              className="text-rose-600 dark:text-rose-400 hover:underline font-bold transition"
            >
              Emergency 112
            </button>
          </div>
        </div>
      </footer>

      {/* API Key Modal */}
      <ApiKeyModal
        isOpen={apiKeyModalOpen}
        onClose={() => setApiKeyModalOpen(false)}
        onKeySaved={setApiKey}
        currentKey={apiKey}
        language={language}
      />
    </div>
  );
}
