"use client";

import { supportedLanguages, workerRoles, type ChatLanguage, type WorkerRole } from "@/lib/prompts";

type WorkerPreferencesProps = {
  role: WorkerRole;
  language: ChatLanguage;
  onRoleChange: (role: WorkerRole) => void;
  onLanguageChange: (language: ChatLanguage) => void;
};

export default function WorkerPreferences({ role, language, onRoleChange, onLanguageChange }: WorkerPreferencesProps) {
  return (
    <div className="flex flex-wrap gap-3 py-4">
      <label className="flex min-w-[190px] flex-1 flex-col gap-1.5 text-[11px] text-zinc-500">
        Your work
        <select value={role} onChange={(event) => onRoleChange(event.target.value as WorkerRole)} className="h-10 rounded-xl border border-white/10 bg-[#111715] px-3 text-sm text-zinc-200 outline-none transition focus:border-[#b7f36b]/50">
          {workerRoles.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
      </label>
      <label className="flex min-w-[150px] flex-1 flex-col gap-1.5 text-[11px] text-zinc-500">
        Reply language
        <select value={language} onChange={(event) => onLanguageChange(event.target.value as ChatLanguage)} className="h-10 rounded-xl border border-white/10 bg-[#111715] px-3 text-sm text-zinc-200 outline-none transition focus:border-[#b7f36b]/50">
          {supportedLanguages.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
      </label>
    </div>
  );
}
