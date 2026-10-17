"use client";

import { useState } from "react";
import { MAX_DOCUMENT_BYTES, SUPPORTED_DOCUMENT_TYPES } from "@/lib/document-contract";
import type { ChatLanguage, WorkerRole } from "@/lib/prompts";

const fields = [
  ["documentType", "Document type"], ["platform", "Platform"], ["period", "Period"], ["amount", "Amount"],
  ["deductions", "Deductions"], ["paymentStatus", "Payment status"], ["issue", "Issue shown"], ["unclear", "Unclear or missing"],
] as const;
type Facts = Record<(typeof fields)[number][0], string>;

type DocumentHelpProps = {
  role: WorkerRole;
  language: ChatLanguage;
  onDraft: (prompt: string) => void;
  disabled: boolean;
};

export default function DocumentHelp({ role, language, onDraft, disabled }: DocumentHelpProps) {
  const [file, setFile] = useState<File | null>(null);
  const [facts, setFacts] = useState<Facts | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function analyze() {
    if (!file || busy || disabled) return;
    setBusy(true);
    setError("");
    setFacts(null);
    const body = new FormData();
    body.set("file", file);
    body.set("role", role);
    body.set("language", language);
    try {
      const response = await fetch("/api/cases/analyze", { method: "POST", body });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Document analysis failed. Try again.");
      setFacts(data.facts as Facts);
      setFile(null);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Document analysis failed. Try again.");
    } finally {
      setBusy(false);
    }
  }

  function chooseFile(candidate: File | undefined) {
    setFacts(null);
    setError("");
    if (!candidate) {
      setFile(null);
      return;
    }
    if (!(SUPPORTED_DOCUMENT_TYPES as readonly string[]).includes(candidate.type)) {
      setFile(null);
      setError("Choose a PDF, JPG, or PNG file.");
      return;
    }
    if (candidate.size === 0 || candidate.size > MAX_DOCUMENT_BYTES) {
      setFile(null);
      setError("Choose a non-empty file under 3 MB.");
      return;
    }
    setFile(candidate);
  }

  function draft() {
    if (!facts) return;
    const confirmedFacts = fields.map(([key, label]) => `${label}: ${facts[key]}`).join("\n");
    onDraft(`Using only these facts I reviewed and confirmed from my document, draft a short, polite payment grievance for me as a ${role}. Do not add details that are not listed. If important details are missing, leave clear placeholders for me to fill in. Reply in ${language}.\n\n${confirmedFacts}`);
  }

  return (
    <section aria-labelledby="document-help-title" className="mb-3 rounded-xl border border-white/[0.08] bg-[#111715] p-3 sm:p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 id="document-help-title" className="text-sm font-medium">Payment document help</h2>
          <p className="mt-1 text-xs leading-5 text-zinc-500">Upload a payout statement or screenshot. Check every extracted detail before drafting.</p>
        </div>
        <span className="rounded-full border border-white/10 px-2 py-1 text-[10px] text-zinc-500">PDF · JPG · PNG · max 3 MB</span>
      </div>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <label className="flex min-h-11 flex-1 cursor-pointer items-center rounded-lg border border-white/10 px-3 text-xs text-zinc-400 hover:border-white/20 focus-within:ring-2 focus-within:ring-[#b7f36b] focus-within:ring-offset-2 focus-within:ring-offset-[#111715]">
          <span className="truncate">{file?.name ?? "Choose a document"}</span>
          <input type="file" accept="application/pdf,image/jpeg,image/png" disabled={busy || disabled} onChange={(event) => chooseFile(event.target.files?.[0])} className="sr-only" aria-label="Choose a payment document" />
        </label>
        <button type="button" onClick={analyze} disabled={!file || busy || disabled} className="min-h-10 rounded-lg bg-[#b7f36b] px-4 text-xs font-semibold text-[#101710] hover:brightness-110 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-zinc-500">{busy ? "Reading…" : "Read document"}</button>
      </div>
      {error && <p role="alert" className="mt-2 text-xs text-red-300">{error}</p>}
      {facts && <div className="mt-4 border-t border-white/[0.08] pt-3">
        <p className="mb-2 text-xs font-medium text-[#b7f36b]">Review and correct these extracted facts</p>
        <div className="grid gap-2 sm:grid-cols-2">
          {fields.map(([key, label]) => <label key={key} className="text-[11px] text-zinc-500">{label}<input value={facts[key]} onChange={(event) => setFacts({ ...facts, [key]: event.target.value })} maxLength={300} className="mt-1 h-9 w-full rounded-lg border border-white/10 bg-[#090d0c] px-2 text-xs text-zinc-200 outline-none focus:border-[#b7f36b]/40" /></label>)}
        </div>
        <button type="button" onClick={draft} disabled={disabled} className="mt-3 min-h-10 w-full rounded-lg border border-[#b7f36b]/30 px-3 text-xs font-medium text-[#b7f36b] hover:bg-[#b7f36b]/[0.06] disabled:opacity-50">Use confirmed facts to draft a grievance</button>
        <p className="mt-2 text-[10px] leading-4 text-zinc-600">The file is sent to Gemini for analysis and is not saved by this app. Redact bank details or ID numbers first, then confirm each fact before using a draft.</p>
      </div>}
    </section>
  );
}
