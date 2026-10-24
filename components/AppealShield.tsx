"use client";

import { useState } from "react";
import type { ChatLanguage, WorkerRole } from "@/lib/prompts";
import {
  type PlatformName,
  type DisputeCategory,
  DISPUTE_ISSUES,
  PLATFORM_DIRECTORY,
} from "@/lib/appeals";
import { UI_TRANSLATIONS } from "@/lib/translations";
import {
  ShieldCheck,
  Sparkles,
  Copy,
  Check,
  Mail,
  AlertTriangle,
  FileCheck,
} from "lucide-react";

interface AppealShieldProps {
  role: WorkerRole;
  language: ChatLanguage;
  apiKey: string;
}

export default function AppealShield({ role, language, apiKey }: AppealShieldProps) {
  const t = UI_TRANSLATIONS[language];

  const [platform, setPlatform] = useState<PlatformName>("Zomato");
  const [issue, setIssue] = useState<DisputeCategory>("unfair_deactivation");
  const [workerName, setWorkerName] = useState("");
  const [partnerId, setPartnerId] = useState("");
  const [orderOrTripId, setOrderOrTripId] = useState("");
  const [incidentDate, setIncidentDate] = useState(new Date().toISOString().split("T")[0]);
  const [amountDeducted, setAmountDeducted] = useState("");
  const [details, setDetails] = useState("");

  const [loading, setLoading] = useState(false);
  const [appealResult, setAppealResult] = useState<{
    recipient: string;
    subject: string;
    body: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const platforms: PlatformName[] = [
    "Zomato",
    "Swiggy",
    "Blinkit",
    "Zepto",
    "Uber",
    "Ola",
    "Porter",
    "Urban Company",
    "Amazon Flex",
  ];

  async function handleGenerate() {
    setLoading(true);
    setError("");

    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (apiKey) {
        headers["x-gemini-key"] = apiKey;
      }

      const response = await fetch("/api/appeals", {
        method: "POST",
        headers,
        body: JSON.stringify({
          platform,
          issue,
          workerName,
          partnerId,
          orderOrTripId,
          incidentDate,
          amountDeducted,
          details,
          language,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to generate appeal.");
      }

      setAppealResult(data.appeal);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error generating appeal. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleCopy() {
    if (!appealResult) return;
    const fullText = `To: ${appealResult.recipient}\nSubject: ${appealResult.subject}\n\n${appealResult.body}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleEmailLaunch() {
    if (!appealResult) return;
    const mailto = `mailto:${appealResult.recipient}?subject=${encodeURIComponent(
      appealResult.subject
    )}&body=${encodeURIComponent(appealResult.body)}`;
    window.open(mailto, "_blank");
  }

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="rounded-3xl border border-black/10 dark:border-white/10 dark:bg-[#0E1526]/90 bg-white p-6 backdrop-blur-md shadow-2xl transition">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/10 dark:border-white/[0.08] pb-5">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-emerald-500/20 border border-cyan-500/30 text-cyan-500">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {t.appealTitle}
              </h2>
              <p className="text-xs text-slate-600 dark:text-zinc-400">
                {t.appealSubtitle}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              Fair Labor & Platform Terms
            </span>
          </div>
        </div>

        {/* Input Form */}
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {/* Platform Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-2">
              {t.appealSelectPlatform}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {platforms.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPlatform(p)}
                  className={`rounded-xl border px-3 py-2 text-xs font-semibold transition text-center ${
                    platform === p
                      ? "border-cyan-500 bg-cyan-500 text-black shadow-md shadow-cyan-500/20 font-bold"
                      : "border-black/10 dark:border-white/10 dark:bg-[#070A12] bg-slate-50 text-slate-700 dark:text-zinc-400 hover:border-cyan-500/40"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
            <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-500 dark:text-zinc-400 bg-slate-50 dark:bg-white/[0.02] p-2.5 rounded-xl border border-black/5 dark:border-white/5">
              <span>Grievance Email: <strong className="text-slate-800 dark:text-white">{PLATFORM_DIRECTORY[platform].email}</strong></span>
              <span>Helpline: <strong className="text-emerald-600 dark:text-emerald-400">{PLATFORM_DIRECTORY[platform].phone}</strong></span>
            </div>
          </div>

          {/* Issue Category */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-2">
              {t.appealSelectIssue}
            </label>
            <select
              value={issue}
              onChange={(e) => setIssue(e.target.value as DisputeCategory)}
              className="h-11 w-full rounded-xl border border-black/10 dark:border-white/10 dark:bg-[#070A12] bg-slate-50 px-3.5 text-xs text-slate-900 dark:text-white outline-none transition focus:border-cyan-500"
            >
              {Object.values(DISPUTE_ISSUES).map((item) => (
                <option key={item.id} value={item.id} className="dark:bg-[#0E1526] bg-white">
                  {item.title}
                </option>
              ))}
            </select>
            <p className="mt-2 text-[11px] text-slate-500 dark:text-zinc-400 leading-relaxed">
              {DISPUTE_ISSUES[issue].description}
            </p>
          </div>

          {/* Worker Name & Partner ID */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1.5">
              {t.appealWorkerName}
            </label>
            <input
              type="text"
              placeholder="e.g. Ramesh Kumar / ਸੁਖਵਿੰਦਰ ਸਿੰਘ"
              value={workerName}
              onChange={(e) => setWorkerName(e.target.value)}
              className="h-10 w-full rounded-xl border border-black/10 dark:border-white/10 dark:bg-[#070A12] bg-slate-50 px-3.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-600 outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1.5">
              {t.appealPartnerId}
            </label>
            <input
              type="text"
              placeholder="e.g. ZOM-883921 / SWG-1104 / UBR-55"
              value={partnerId}
              onChange={(e) => setPartnerId(e.target.value)}
              className="h-10 w-full rounded-xl border border-black/10 dark:border-white/10 dark:bg-[#070A12] bg-slate-50 px-3.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-600 outline-none focus:border-cyan-500"
            />
          </div>

          {/* Order/Trip ID & Amount */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1.5">
              {t.appealOrderId}
            </label>
            <input
              type="text"
              placeholder="e.g. ORD-992381 / CRN-5441"
              value={orderOrTripId}
              onChange={(e) => setOrderOrTripId(e.target.value)}
              className="h-10 w-full rounded-xl border border-black/10 dark:border-white/10 dark:bg-[#070A12] bg-slate-50 px-3.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-600 outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1.5">
              {t.appealAmount}
            </label>
            <input
              type="number"
              placeholder="e.g. 350"
              value={amountDeducted}
              onChange={(e) => setAmountDeducted(e.target.value)}
              className="h-10 w-full rounded-xl border border-black/10 dark:border-white/10 dark:bg-[#070A12] bg-slate-50 px-3.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-600 outline-none focus:border-cyan-500"
            />
          </div>

          {/* Date & Additional Details */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1.5">
              {t.appealDate}
            </label>
            <input
              type="date"
              value={incidentDate}
              onChange={(e) => setIncidentDate(e.target.value)}
              className="h-10 w-full rounded-xl border border-black/10 dark:border-white/10 dark:bg-[#070A12] bg-slate-50 px-3.5 text-xs text-slate-900 dark:text-white outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1.5">
              {t.appealDetails}
            </label>
            <input
              type="text"
              placeholder="e.g. Wrong customer GPS pin, timer expired, food handed to building security"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="h-10 w-full rounded-xl border border-black/10 dark:border-white/10 dark:bg-[#070A12] bg-slate-50 px-3.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-600 outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-500 dark:text-rose-300">
            <AlertTriangle className="h-4 w-4 shrink-0 text-rose-500" />
            <span>{error}</span>
          </div>
        )}

        {/* Generate Button */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-black/10 dark:border-white/[0.08] pt-5">
          <span className="text-[11px] text-slate-500 dark:text-zinc-400">
            Powered by Google Gemini AI · Generates legally grounded appeal in {language}
          </span>
          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 px-6 py-3 text-xs font-bold text-black shadow-lg shadow-cyan-500/25 transition hover:brightness-110 active:scale-95 disabled:opacity-50"
          >
            <Sparkles className="h-4 w-4" />
            {loading ? t.appealGeneratingBtn : t.appealGenerateBtn}
          </button>
        </div>
      </div>

      {/* Generated Appeal Result Card */}
      {appealResult && (
        <div className="rounded-3xl border border-cyan-500/30 dark:bg-[#0E1526] bg-white p-6 backdrop-blur-md shadow-2xl animate-in fade-in transition">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/10 dark:border-white/[0.08] pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-600 dark:text-cyan-400 mb-1">
                <FileCheck className="h-4 w-4" />
                <span>Formal Grievance Draft Ready</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">{appealResult.subject}</h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                Grievance Cell Email: <strong className="text-emerald-600 dark:text-emerald-400">{appealResult.recipient}</strong>
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-1.5 rounded-xl border border-black/10 dark:border-white/10 dark:bg-white/[0.04] bg-slate-100 px-4 py-2.5 text-xs font-semibold text-slate-800 dark:text-white transition hover:bg-slate-200 dark:hover:bg-white/10 active:scale-95"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? t.appealCopiedBtn : t.appealCopyBtn}
              </button>

              <button
                type="button"
                onClick={handleEmailLaunch}
                className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2.5 text-xs font-bold text-black shadow-md shadow-emerald-500/20 transition hover:brightness-110 active:scale-95"
              >
                <Mail className="h-3.5 w-3.5" />
                <span>{t.appealEmailBtn}</span>
              </button>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-black/5 dark:border-white/[0.08] dark:bg-[#070A12]/90 bg-slate-50 p-4 sm:p-5">
            <pre className="whitespace-pre-wrap font-sans text-xs leading-relaxed text-slate-800 dark:text-zinc-200">
              {appealResult.body}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
