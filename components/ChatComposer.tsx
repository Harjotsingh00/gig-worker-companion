"use client";

import type { FormEvent, KeyboardEvent } from "react";
import QuickActions from "@/components/QuickActions";
import type { WorkerRole } from "@/lib/prompts";

type ChatComposerProps = {
  input: string;
  role: WorkerRole;
  loading: boolean;
  onInputChange: (value: string) => void;
  onSend: (value: string) => void;
  onEarnings: () => void;
};

export default function ChatComposer({ input, role, loading, onInputChange, onSend, onEarnings }: ChatComposerProps) {
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSend(input);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      onSend(input);
    }
  }

  return (
    <div className="border-t border-white/[0.07] p-3 sm:p-4">
      <form onSubmit={submit} className="flex items-end gap-2 rounded-xl border border-white/10 bg-[#111715] p-2 transition focus-within:border-[#b7f36b]/40">
        <textarea value={input} onChange={(event) => onInputChange(event.target.value)} onKeyDown={handleKeyDown} rows={2} maxLength={2_000} placeholder="Type your message…" aria-label="Type your message" className="max-h-32 min-h-10 flex-1 resize-none bg-transparent px-2 py-1.5 text-sm leading-6 text-zinc-100 outline-none placeholder:text-zinc-600" />
        <button type="submit" disabled={!input.trim() || loading} className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-[#b7f36b] text-lg font-medium text-[#101710] transition hover:brightness-110 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-zinc-600" aria-label="Send message">↑</button>
      </form>
      <QuickActions role={role} disabled={loading} onSend={onSend} onEarnings={onEarnings} />
      <p className="mt-3 text-center text-[10px] text-zinc-600">All replies are live Gemini calls – no mocks.</p>
    </div>
  );
}
