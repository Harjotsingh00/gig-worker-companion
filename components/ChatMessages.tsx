"use client";

import type { ChatLanguage } from "@/lib/prompts";

export type Message = { role: "user" | "assistant"; content: string; language?: ChatLanguage };

type ChatMessagesProps = {
  messages: Message[];
  loading: boolean;
  error: string;
  bottomRef: { current: HTMLDivElement | null };
};

export default function ChatMessages({ messages, loading, error, bottomRef }: ChatMessagesProps) {
  return (
    <div role="log" aria-label="Chat messages" aria-live="polite" aria-relevant="additions text" className="flex min-h-[320px] flex-1 flex-col gap-4 overflow-y-auto p-4 sm:min-h-[400px] sm:p-6">
      {messages.length === 0 ? (
        <div className="m-auto max-w-md py-10 text-center">
          <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl border border-[#b7f36b]/20 bg-[#b7f36b]/[0.08] text-xl text-[#b7f36b]">✳</div>
          <h2 className="text-lg font-medium tracking-tight">What can I help with?</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-500">Ask a question or choose a topic below to get started.</p>
        </div>
      ) : messages.map((message, index) => (
        <div key={`${index}-${message.role}`} className={`flex gap-2.5 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
          {message.role === "assistant" && <span aria-hidden="true" className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-[#b7f36b] text-[11px] font-bold text-[#101710]">G</span>}
          <div lang={message.language === "Hindi" ? "hi" : message.language === "Punjabi" ? "pa" : message.language === "English" ? "en" : undefined} className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-6 ${message.role === "user" ? "rounded-br-md bg-[#b7f36b] text-[#101710]" : "rounded-bl-md border border-white/[0.08] bg-[#151b18] text-zinc-200"}`}>
            {message.content}
          </div>
        </div>
      ))}
      {loading && <div role="status" aria-live="polite" className="flex items-center gap-2.5 text-sm text-zinc-400"><span aria-hidden="true" className="grid h-7 w-7 place-items-center rounded-lg bg-[#b7f36b] text-[11px] font-bold text-[#101710]">G</span><span className="motion-safe:animate-pulse">Thinking…</span></div>}
      {error && <p role="alert" className="self-center rounded-lg border border-red-900/50 bg-red-950/30 px-3 py-2 text-xs text-red-300">{error}</p>}
      <div ref={bottomRef} />
    </div>
  );
}
