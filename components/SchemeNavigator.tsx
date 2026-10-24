"use client";

import { useState } from "react";
import type { ChatLanguage, WorkerRole } from "@/lib/prompts";
import { WELFARE_SCHEMES, type WelfareScheme } from "@/lib/schemes";
import { UI_TRANSLATIONS } from "@/lib/translations";
import {
  LifeBuoy,
  ExternalLink,
  Sparkles,
  Filter,
} from "lucide-react";

interface SchemeNavigatorProps {
  role: WorkerRole;
  language: ChatLanguage;
  onAskGemini: (prompt: string) => void;
}

export default function SchemeNavigator({
  role,
  language,
  onAskGemini,
}: SchemeNavigatorProps) {
  const t = UI_TRANSLATIONS[language];

  const [filterCategory, setFilterCategory] = useState<string>("All");
  const [filterScope, setFilterScope] = useState<string>("All");

  const categories = ["All", "Insurance", "Pension", "Health", "Social Security"];
  const scopes = ["All", "Central", "State"];

  const filtered = WELFARE_SCHEMES.filter((scheme) => {
    const matchesCategory = filterCategory === "All" || scheme.category === filterCategory;
    const matchesScope = filterScope === "All" || scheme.scope === filterScope;
    return matchesCategory && matchesScope;
  });

  function handleCheckEligibility(scheme: WelfareScheme) {
    const prompt =
      language === "Hindi"
        ? `मैं भारत में एक ${role} हूँ। मैं "${scheme.name}" (${scheme.coverageAmount}) के लिए अपनी पात्रता और रजिस्ट्रेशन प्रक्रिया जानना चाहता हूँ।
कृपया बताएं:
1. क्या मैं एक ${role} के रूप में इसके योग्य हूँ?
2. मुझे किन दस्तावेज़ों (Documents) की आवश्यकता होगी?
3. मोबाइल या सीएससी (CSC) सेंटर से सबसे जल्दी आवेदन करने का तरीका क्या है?
सरल और स्पष्ट हिन्दी में उत्तर दें।`
        : language === "Punjabi"
        ? `ਮੈਂ ਭਾਰਤ ਵਿੱਚ ਇੱਕ ${role} ਹਾਂ। ਮੈਂ "${scheme.name}" (${scheme.coverageAmount}) ਦੀ ਯੋਗਤਾ ਅਤੇ ਅਪਲਾਈ ਕਰਨ ਦਾ ਤਰੀਕਾ ਜਾਣਨਾ ਚਾਹੁੰਦਾ ਹਾਂ।
ਦੱਸੋ:
1. ਕੀ ਮੈਂ ਇੱਕ ${role} ਵਜੋਂ ਯੋਗ ਹਾਂ?
2. ਕਿਹੜੇ ਕਾਗਜ਼ਾਤ (Documents) ਚਾਹੀਦੇ ਹਨ?
3. ਫੋਨ ਤੋਂ ਸਭ ਤੋਂ ਆਸਾਨ ਤਰੀਕਾ ਕੀ ਹੈ?
ਪੰਜਾਬੀ ਵਿੱਚ ਸਾਫ਼ ਜਵਾਬ ਦਿਓ।`
        : `I am a ${role} in India. I want to check my eligibility and registration procedure for "${scheme.name}" (${scheme.coverageAmount}). 
Explain:
1. Do I qualify as a ${role}?
2. What are the key documents needed?
3. What is the fastest step-by-step method to register online or at a CSC center?
Keep your advice clear, practical, and in English.`;

    onAskGemini(prompt);
  }

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="rounded-3xl border border-black/10 dark:border-white/10 dark:bg-[#0E1526]/90 bg-white p-6 backdrop-blur-md shadow-2xl transition">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/10 dark:border-white/[0.08] pb-5">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-tr from-blue-500/20 to-emerald-500/20 border border-blue-500/30 text-blue-500">
              <LifeBuoy className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">{t.schemesTitle}</h2>
              <p className="text-xs text-slate-600 dark:text-zinc-400">{t.schemesSubtitle}</p>
            </div>
          </div>
          <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 self-start sm:self-auto">
            Statutory Protections
          </span>
        </div>

        {/* Filters */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          {/* Category Filter */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-medium text-slate-500 dark:text-zinc-400 mr-1 flex items-center gap-1">
              <Filter className="h-3 w-3" /> Category:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setFilterCategory(cat)}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                  filterCategory === cat
                    ? "bg-blue-500 text-white shadow-md shadow-blue-500/20"
                    : "border border-black/5 dark:border-white/5 dark:bg-white/5 bg-slate-100 text-slate-700 dark:text-zinc-400 hover:text-blue-500"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Scope Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-medium text-slate-500 dark:text-zinc-400 mr-1">Scope:</span>
            {scopes.map((scope) => (
              <button
                key={scope}
                type="button"
                onClick={() => setFilterScope(scope)}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                  filterScope === scope
                    ? "bg-emerald-500 text-black shadow-md shadow-emerald-500/20"
                    : "border border-black/5 dark:border-white/5 dark:bg-white/5 bg-slate-100 text-slate-700 dark:text-zinc-400 hover:text-emerald-500"
                }`}
              >
                {scope}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Schemes Grid */}
      <div className="grid gap-5 md:grid-cols-2">
        {filtered.map((scheme) => (
          <div
            key={scheme.id}
            className="rounded-3xl border border-black/10 dark:border-white/10 dark:bg-[#0E1526]/80 bg-white p-5 backdrop-blur-md shadow-xl flex flex-col justify-between transition hover:border-blue-500/40"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <span className="inline-block rounded-md bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 text-[10px] font-bold text-blue-600 dark:text-blue-400 mb-1">
                    {scheme.scope} {scheme.state ? `(${scheme.state})` : ""} · {scheme.category}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">{scheme.name}</h3>
                  {scheme.nameLocal && (
                    <span className="text-xs text-slate-500 dark:text-zinc-400 font-medium">{scheme.nameLocal}</span>
                  )}
                </div>
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-center shrink-0">
                  <span className="block text-[10px] text-slate-500 dark:text-zinc-400 font-medium">Coverage</span>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{scheme.coverageAmount}</span>
                </div>
              </div>

              <p className="mt-2 text-xs text-slate-600 dark:text-zinc-300 leading-relaxed">{scheme.benefits}</p>

              {/* Eligibility & Documents */}
              <div className="mt-4 space-y-2 border-t border-black/10 dark:border-white/[0.08] pt-3 text-[11px]">
                <div>
                  <strong className="text-slate-700 dark:text-zinc-400 block mb-1">Key Eligibility:</strong>
                  <ul className="list-disc list-inside text-slate-600 dark:text-zinc-300 space-y-0.5">
                    {scheme.eligibility.slice(0, 3).map((item, idx) => (
                      <li key={idx} className="line-clamp-1">{item}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <strong className="text-slate-700 dark:text-zinc-400 block mb-1">Required Documents:</strong>
                  <div className="flex flex-wrap gap-1.5">
                    {scheme.documentsRequired.map((doc, idx) => (
                      <span
                        key={idx}
                        className="rounded-md border border-black/5 dark:border-white/5 dark:bg-white/[0.03] bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600 dark:text-zinc-400"
                      >
                        {doc}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-5 flex items-center justify-between gap-2 border-t border-black/10 dark:border-white/[0.08] pt-3">
              <a
                href={scheme.applyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-xl border border-black/10 dark:border-white/10 dark:bg-white/5 bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-800 dark:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition"
              >
                <span>{t.schemesPortalBtn}</span>
                <ExternalLink className="h-3 w-3 text-cyan-500" />
              </a>

              <button
                type="button"
                onClick={() => handleCheckEligibility(scheme)}
                className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-500 to-emerald-500 px-3.5 py-1.5 text-xs font-bold text-black shadow-md shadow-blue-500/20 transition hover:brightness-110 active:scale-95"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>{t.schemesCheckBtn}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
