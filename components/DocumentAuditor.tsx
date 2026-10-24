"use client";

import { useState } from "react";
import type { ChatLanguage, WorkerRole } from "@/lib/prompts";
import { UI_TRANSLATIONS } from "@/lib/translations";
import { MAX_DOCUMENT_BYTES, SUPPORTED_DOCUMENT_TYPES } from "@/lib/document-contract";
import {
  FileText,
  Upload,
  Sparkles,
  AlertTriangle,
  ArrowRight,
  FileCheck2,
} from "lucide-react";

const fields = [
  ["documentType", "Document Type"],
  ["platform", "Platform / Aggregator"],
  ["period", "Payout Period"],
  ["amount", "Gross / Net Amount"],
  ["deductions", "Deductions & Penalties"],
  ["paymentStatus", "Payment Status"],
  ["issue", "Potential Discrepancy Found"],
  ["unclear", "Unclear or Missing Notes"],
] as const;

type Facts = Record<(typeof fields)[number][0], string>;

interface DocumentAuditorProps {
  role: WorkerRole;
  language: ChatLanguage;
  apiKey: string;
  onDraftGrievance: (prompt: string) => void;
  onSendToAppealTab: (discrepancyDetails: string, amount: string, platformName: string) => void;
}

export default function DocumentAuditor({
  role,
  language,
  apiKey,
  onDraftGrievance,
  onSendToAppealTab,
}: DocumentAuditorProps) {
  const t = UI_TRANSLATIONS[language];

  const [file, setFile] = useState<File | null>(null);
  const [facts, setFacts] = useState<Facts | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  function loadSampleData(sampleType: "swiggy" | "uber") {
    setError("");
    if (sampleType === "swiggy") {
      setFacts({
        documentType: "Weekly Partner Payout Statement",
        platform: "Swiggy",
        period: "14 Oct 2026 - 20 Oct 2026",
        amount: "Gross ₹4,850 | Net Deposited ₹4,100",
        deductions: "₹350 Customer Refund Fine, ₹400 Emergency Advance repayment",
        paymentStatus: "Processed with disputed deductions",
        issue: "Disputed customer non-delivery charge of ₹350 without sharing GPS proof",
        unclear: "Floating cash reconciliation breakdown not itemized",
      });
    } else {
      setFacts({
        documentType: "Driver Partner Weekly Summary",
        platform: "Uber",
        period: "Current Week",
        amount: "Gross ₹8,420 | Net Payout ₹6,610",
        deductions: "20% Service Fee (₹1,640) + ₹170 Toll discrepancy",
        paymentStatus: "Paid",
        issue: "Highway toll fee of ₹170 paid via Fastag was omitted from payout credit",
        unclear: "Airport queue waiting time surge adjustment not credited",
      });
    }
  }

  function handleFileChange(candidate?: File) {
    setFacts(null);
    setError("");
    if (!candidate) {
      setFile(null);
      return;
    }
    if (!(SUPPORTED_DOCUMENT_TYPES as readonly string[]).includes(candidate.type)) {
      setFile(null);
      setError("Please choose a supported PDF, JPG, or PNG file.");
      return;
    }
    if (candidate.size === 0 || candidate.size > MAX_DOCUMENT_BYTES) {
      setFile(null);
      setError("File exceeds 3 MB limit. Please select a smaller file.");
      return;
    }
    setFile(candidate);
  }

  async function handleAnalyze() {
    if (!file || busy) return;
    setBusy(true);
    setError("");
    setFacts(null);

    const body = new FormData();
    body.set("file", file);
    body.set("role", role);
    body.set("language", language);

    try {
      const headers: Record<string, string> = {};
      if (apiKey) {
        headers["x-gemini-key"] = apiKey;
      }

      const response = await fetch("/api/cases/analyze", {
        method: "POST",
        headers,
        body,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Document analysis failed. Try again.");
      }

      setFacts(data.facts as Facts);
      setFile(null);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Document analysis failed. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  function handleSendToAppeal() {
    if (!facts) return;
    const cleanPlatform = facts.platform.includes("Swiggy")
      ? "Swiggy"
      : facts.platform.includes("Uber")
      ? "Uber"
      : facts.platform.includes("Zomato")
      ? "Zomato"
      : "Zomato";

    const detailText = `Payout Document Audit Discrepancy:\n- Period: ${facts.period}\n- Amount: ${facts.amount}\n- Deductions: ${facts.deductions}\n- Issue: ${facts.issue}`;
    onSendToAppealTab(detailText, "350", cleanPlatform);
  }

  function handleAutoDraftInChat() {
    if (!facts) return;
    const prompt =
      language === "Hindi"
        ? `मेरी पे-स्लिप के सत्यापित तथ्यों के आधार पर एक औपचारिक शिकायत पत्र तैयार करें:
- प्लेटफॉर्म: ${facts.platform}
- अवधि: ${facts.period}
- राशि: ${facts.amount}
- काटी गई पेनाल्टी: ${facts.deductions}
- समस्या: ${facts.issue}
कृपया एक विनम्र लेकिन कानूनी रूप से मजबूत शिकायत पत्र हिन्दी में बनाएं जिसे मैं सपोर्ट टीम को भेज सकूं।`
        : language === "Punjabi"
        ? `ਮੇਰੀ ਪੇਅ-ਸਲਿੱਪ ਦੇ ਅਧਾਰ 'ਤੇ ਸ਼ਿਕਾਇਤ ਪੱਤਰ ਤਿਆਰ ਕਰੋ:
- ਪਲੇਟਫਾਰਮ: ${facts.platform}
- ਸਮਾਂ: ${facts.period}
- ਰਕਮ: ${facts.amount}
- ਕਟੌਤੀ: ${facts.deductions}
- ਮਸਲਾ: ${facts.issue}
ਪੰਜਾਬੀ ਵਿੱਚ ਸ਼ਿਕਾਇਤ ਪੱਤਰ ਲਿਖੋ।`
        : `Using these confirmed facts extracted from my payout slip, draft a formal, polite grievance for me as a ${role}:
- Platform: ${facts.platform}
- Period: ${facts.period}
- Amount: ${facts.amount}
- Disputed Deductions: ${facts.deductions}
- Specific Issue: ${facts.issue}
Reply in English with clear recipient and subject line.`;

    onDraftGrievance(prompt);
  }

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="rounded-3xl border border-black/10 dark:border-white/10 dark:bg-[#0E1526]/90 bg-white p-6 backdrop-blur-md shadow-2xl transition">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/10 dark:border-white/[0.08] pb-5">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-tr from-purple-500/20 to-cyan-500/20 border border-purple-500/30 text-purple-500">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">{t.docTitle}</h2>
              <p className="text-xs text-slate-600 dark:text-zinc-400">{t.docSubtitle}</p>
            </div>
          </div>
          <span className="rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-[11px] font-semibold text-purple-600 dark:text-purple-400 self-start sm:self-auto">
            Gemini Multimodal Vision
          </span>
        </div>

        {/* Upload Zone & Sample Testers */}
        <div className="mt-6">
          <div className="rounded-2xl border-2 border-dashed border-slate-300 dark:border-white/15 dark:bg-[#070A12]/50 bg-slate-50 p-6 text-center transition hover:border-purple-500/40">
            <Upload className="mx-auto h-8 w-8 text-slate-400 dark:text-zinc-400 mb-2" />
            <p className="text-sm font-semibold text-slate-800 dark:text-white">
              {file ? file.name : t.docDropText}
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-zinc-500">
              PDF, PNG, JPG under 3 MB · Personal Aadhaar/Bank details redacted automatically
            </p>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
              <label className="cursor-pointer rounded-xl bg-slate-200 dark:bg-white/10 px-4 py-2 text-xs font-semibold text-slate-800 dark:text-white hover:bg-slate-300 dark:hover:bg-white/15 transition">
                <span>{t.docBrowseBtn}</span>
                <input
                  type="file"
                  accept="application/pdf,image/jpeg,image/png"
                  disabled={busy}
                  onChange={(e) => handleFileChange(e.target.files?.[0])}
                  className="sr-only"
                />
              </label>

              {file && (
                <button
                  type="button"
                  onClick={handleAnalyze}
                  disabled={busy}
                  className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 px-5 py-2 text-xs font-bold text-white shadow-lg shadow-purple-500/20 transition hover:brightness-110 disabled:opacity-50"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>{busy ? "Reading Document…" : t.docAnalyzeBtn}</span>
                </button>
              )}
            </div>
          </div>

          {/* Quick Demo Previews */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-black/5 dark:border-white/5 dark:bg-white/[0.02] bg-slate-50 p-3 text-xs text-slate-600 dark:text-zinc-400">
            <span>
              {language === "Hindi"
                ? "क्या आपके पास अभी स्लिप नहीं है? एक नमूना स्लिप जांचें:"
                : language === "Punjabi"
                ? "ਕੀ ਤੁਹਾਡੇ ਕੋਲ ਸਲਿੱਪ ਨਹੀਂ ਹੈ? ਨਮੂਨਾ ਸਲਿੱਪ ਦੇਖੋ:"
                : "Don't have a statement handy? Try a sample slip:"}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => loadSampleData("swiggy")}
                className="rounded-lg border border-black/10 dark:border-white/10 dark:bg-[#0E1526] bg-white px-3 py-1.5 text-xs text-slate-700 dark:text-zinc-300 hover:border-emerald-500 hover:text-emerald-500 transition shadow-sm"
              >
                {t.docSampleSwiggy}
              </button>
              <button
                type="button"
                onClick={() => loadSampleData("uber")}
                className="rounded-lg border border-black/10 dark:border-white/10 dark:bg-[#0E1526] bg-white px-3 py-1.5 text-xs text-slate-700 dark:text-zinc-300 hover:border-cyan-500 hover:text-cyan-500 transition shadow-sm"
              >
                {t.docSampleUber}
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-500 dark:text-rose-300">
            <AlertTriangle className="h-4 w-4 shrink-0 text-rose-500" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Extracted Facts & Actions Card */}
      {facts && (
        <div className="rounded-3xl border border-purple-500/30 dark:bg-[#0E1526]/90 bg-white p-6 backdrop-blur-md shadow-2xl animate-in fade-in transition">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-black/10 dark:border-white/[0.08] pb-4">
            <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold text-sm">
              <FileCheck2 className="h-5 w-5" />
              <span>
                {language === "Hindi" ? "पे-स्लिप से निकाले गए तथ्य" : language === "Punjabi" ? "ਪੇਅ-ਸਲਿੱਪ ਤੋਂ ਲਏ ਗਏ ਤੱਥ" : "Extracted Slip Audit Results"}
              </span>
            </div>
            <span className="text-[11px] text-slate-500 dark:text-zinc-400">
              Verify all extracted fields before taking formal action
            </span>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {fields.map(([key, label]) => (
              <div key={key} className="rounded-xl border border-black/5 dark:border-white/5 dark:bg-[#070A12] bg-slate-50 p-3">
                <label className="block text-[11px] font-bold text-slate-500 dark:text-zinc-400 mb-1">
                  {label}
                </label>
                <input
                  type="text"
                  value={facts[key]}
                  onChange={(e) => setFacts({ ...facts, [key]: e.target.value })}
                  className="w-full bg-transparent text-xs text-slate-900 dark:text-zinc-100 outline-none focus:text-purple-600 dark:focus:text-purple-300"
                />
              </div>
            ))}
          </div>

          {/* Action Footer */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-black/10 dark:border-white/[0.08] pt-5">
            <button
              type="button"
              onClick={handleAutoDraftInChat}
              className="flex items-center gap-1.5 rounded-xl border border-purple-500/30 dark:bg-purple-500/10 bg-purple-50 px-4 py-2.5 text-xs font-bold text-purple-700 dark:text-purple-300 hover:bg-purple-500/20 transition active:scale-95"
            >
              <Sparkles className="h-3.5 w-3.5 text-purple-500" />
              <span>
                {language === "Hindi" ? "एआई चैट में शिकायत पत्र लिखें" : language === "Punjabi" ? "ਏਆਈ ਚੈਟ ਵਿੱਚ ਸ਼ਿਕਾਇਤ ਲਿਖੋ" : "Auto-Draft Grievance in Chat"}
              </span>
            </button>

            <button
              type="button"
              onClick={handleSendToAppeal}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-500 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-purple-500/20 transition hover:brightness-110 active:scale-95"
            >
              <span>{t.docTransferAppealBtn}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
