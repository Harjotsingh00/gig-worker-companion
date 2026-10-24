"use client";

import { useState, useEffect } from "react";
import type { ChatLanguage } from "@/lib/prompts";
import { UI_TRANSLATIONS } from "@/lib/translations";
import { Key, CheckCircle, ExternalLink, X, Shield, Sparkles, ShieldCheck } from "lucide-react";

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeySaved: (key: string) => void;
  currentKey: string;
  language: ChatLanguage;
}

export default function ApiKeyModal({
  isOpen,
  onClose,
  onKeySaved,
  currentKey,
  language,
}: ApiKeyModalProps) {
  const t = UI_TRANSLATIONS[language];
  const [keyInput, setKeyInput] = useState(currentKey);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    setKeyInput(currentKey);
  }, [currentKey]);

  if (!isOpen) return null;

  function handleSave() {
    const trimmed = keyInput.trim();
    if (typeof window !== "undefined") {
      if (trimmed) {
        localStorage.setItem("saarthi_gemini_key", trimmed);
      } else {
        localStorage.removeItem("saarthi_gemini_key");
      }
    }
    onKeySaved(trimmed);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  }

  function handleClear() {
    setKeyInput("");
    if (typeof window !== "undefined") {
      localStorage.removeItem("saarthi_gemini_key");
    }
    onKeySaved("");
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md rounded-2xl border border-black/10 dark:border-white/10 dark:bg-[#0E1526] bg-white p-6 shadow-2xl transition">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-white/5 transition"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 text-emerald-500">
            <Key className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {language === "Hindi" ? "गूगल जेमिनी एपीआई कुंजी" : language === "Punjabi" ? "ਗੂਗਲ ਜੈਮਿਨੀ ਏਪੀਆਈ ਕੁੰਜੀ" : "Google Gemini API Connection"}
            </h2>
            <p className="text-xs text-slate-500 dark:text-zinc-400">{t.geminiBadge}</p>
          </div>
        </div>

        {/* Quota Pressure Guard Explainer */}
        <div className="mb-4 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.06] p-3 text-xs text-slate-700 dark:text-zinc-300">
          <div className="flex items-center gap-1.5 font-bold text-emerald-700 dark:text-emerald-400 mb-1">
            <ShieldCheck className="h-4 w-4" />
            <span>
              {language === "Hindi" ? "कोटा सुरक्षा एवं एंटी-थ्रॉटलिंग सक्रिय" : language === "Punjabi" ? "ਕੋਟਾ ਸੁਰੱਖਿਆ ਸਰਗਰਮ" : "API Quota Protection Active"}
            </span>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-zinc-400 leading-relaxed">
            {language === "Hindi"
              ? "स्मार्ट 30-मिनट कैशे और 2.5s कूलडाउन सुरक्षा के साथ, आपकी एपीआई लिमिट कभी भी सेकंडों में खत्म नहीं होगी। सभी कॉल अनुकूलित हैं।"
              : language === "Punjabi"
              ? "ਸਮਾਰਟ ਕੈਸ਼ਿੰਗ ਅਤੇ 2.5 ਸਕਿੰਟ ਕੂਲਡਾਊਨ ਕਾਰਨ ਤੁਹਾਡੀ ਏਪੀਆਈ ਲਿਮਿਟ ਕਦੇ ਵੀ ਸਕਿੰਟਾਂ ਵਿੱਚ ਖਤਮ ਨਹੀਂ ਹੋਵੇਗੀ।"
              : "Built-in 30-minute caching, bounded token limits, and 2.5-second cooldown protect your free-tier Gemini API key from quota exhaustion."}
          </p>
        </div>

        <div className="space-y-3">
          <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300">
            Gemini API Key
            <input
              type="password"
              placeholder="AIzaSy..."
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              className="mt-1.5 h-11 w-full rounded-xl border border-black/10 dark:border-white/10 dark:bg-[#070A12] bg-slate-50 px-3.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-600 outline-none transition focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/40"
            />
          </label>

          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-zinc-400">
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-cyan-600 dark:text-cyan-400 hover:underline"
            >
              Get a free key from Google AI Studio
              <ExternalLink className="h-3 w-3" />
            </a>
            {keyInput && (
              <button
                type="button"
                onClick={handleClear}
                className="text-slate-500 hover:text-rose-500"
              >
                Clear key
              </button>
            )}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-black/10 dark:border-white/10 px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-white/5 transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-5 py-2.5 text-xs font-bold text-black shadow-lg shadow-emerald-500/20 transition hover:brightness-110 active:scale-95"
          >
            {savedSuccess ? (
              <>
                <CheckCircle className="h-4 w-4" />
                Saved & Connected!
              </>
            ) : (
              <>
                <Shield className="h-4 w-4" />
                Save & Connect
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
