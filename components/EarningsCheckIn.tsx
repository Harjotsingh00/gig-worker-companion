"use client";

import { useState, type FormEvent } from "react";
import { summarizeEarnings } from "@/lib/earnings";
import type { ChatLanguage, WorkerRole } from "@/lib/prompts";

type Earnings = ReturnType<typeof summarizeEarnings>;

type EarningsCheckInProps = {
  role: WorkerRole;
  language: ChatLanguage;
  onAskForTips: (prompt: string) => void;
  onClose: () => void;
};

const money = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 });

export default function EarningsCheckIn({ role, language, onAskForTips, onClose }: EarningsCheckInProps) {
  const [gross, setGross] = useState("");
  const [expenses, setExpenses] = useState("");
  const [summary, setSummary] = useState<Earnings | null>(null);
  const [error, setError] = useState("");

  function calculate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const grossAmount = Number(gross);
    const expenseAmount = Number(expenses || 0);
    if (!gross.trim() || !Number.isFinite(grossAmount) || !Number.isFinite(expenseAmount) || grossAmount < 0 || expenseAmount < 0 || grossAmount > 1_000_000 || expenseAmount > 1_000_000) {
      setError("Enter valid amounts from ₹0 to ₹10,00,000.");
      setSummary(null);
      return;
    }
    setError("");
    setSummary(summarizeEarnings(grossAmount, expenseAmount));
  }

  function askForTips() {
    if (!summary) return;
    onAskForTips(`I am a ${role} in India. My earnings today were: gross ₹${summary.gross.toFixed(2)}, work expenses ₹${summary.expenses.toFixed(2)}, net ₹${summary.net.toFixed(2)}. The net is calculated from the amounts I entered. Give exactly 2 short, practical tips to improve or protect my earnings. Do not change or recalculate these figures. Reply in ${language}.`);
  }

  return (
    <section aria-labelledby="earnings-title" className="mb-3 rounded-xl border border-[#b7f36b]/20 bg-[#111715] p-3 sm:p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 id="earnings-title" className="text-sm font-medium">Today&apos;s earnings check-in</h2>
          <p className="mt-1 text-xs leading-5 text-zinc-500">Your gross, expenses, and net are calculated from the numbers you enter.</p>
        </div>
        <button type="button" onClick={onClose} className="min-h-10 rounded-md px-3 py-2 text-xs text-zinc-400 hover:bg-white/5 hover:text-zinc-100" aria-label="Close earnings check-in">Close</button>
      </div>
      <form onSubmit={calculate} className="mt-3 grid gap-2 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
        <label className="text-[11px] text-zinc-500">Gross earnings (₹)<input inputMode="decimal" type="number" min="0" max="1000000" step="0.01" value={gross} onChange={(event) => { setGross(event.target.value); setSummary(null); setError(""); }} className="mt-1 h-10 w-full rounded-lg border border-white/10 bg-[#090d0c] px-3 text-sm text-zinc-100 outline-none focus:border-[#b7f36b]/40" required /></label>
        <label className="text-[11px] text-zinc-500">Work expenses (₹)<input inputMode="decimal" type="number" min="0" max="1000000" step="0.01" value={expenses} onChange={(event) => { setExpenses(event.target.value); setSummary(null); setError(""); }} className="mt-1 h-10 w-full rounded-lg border border-white/10 bg-[#090d0c] px-3 text-sm text-zinc-100 outline-none focus:border-[#b7f36b]/40" /></label>
        <button type="submit" className="min-h-10 rounded-lg bg-[#b7f36b] px-4 text-xs font-semibold text-[#101710] hover:brightness-110">Calculate</button>
      </form>
      {error && <p role="alert" className="mt-2 text-xs text-red-300">{error}</p>}
      {summary && <div className="mt-3 rounded-lg border border-white/[0.08] bg-[#090d0c] p-3" aria-live="polite">
        <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
          <p className="text-zinc-500">Gross<span className="mt-1 block text-sm font-medium text-zinc-200">{money.format(summary.gross)}</span></p>
          <p className="text-zinc-500">Expenses<span className="mt-1 block text-sm font-medium text-zinc-200">{money.format(summary.expenses)}</span></p>
          <p className="text-zinc-500">Net<span className="mt-1 block text-sm font-semibold text-[#b7f36b]">{money.format(summary.net)}</span></p>
        </div>
        <button type="button" onClick={askForTips} className="mt-3 min-h-10 w-full rounded-lg border border-[#b7f36b]/30 px-3 text-xs font-medium text-[#b7f36b] hover:bg-[#b7f36b]/[0.06]">Ask Gemini for 2 practical tips</button>
      </div>}
    </section>
  );
}
