"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { supportedLanguages, workerRoles, type ChatLanguage, type WorkerRole } from "@/lib/prompts";

type Message = { role: "user" | "assistant"; content: string };

const quickActions = [
  {
    label: "Earnings",
    icon: "₹",
    message: (role: WorkerRole) => `I am a ${role}. Help me review my earnings today. First ask how much I earned and what my expenses were, then give me a short summary and 2 tips.`,
  },
  {
    label: "Safety",
    icon: "✳",
    message: (role: WorkerRole) => `Give me top 5 safety tips for a ${role} in India.`,
  },
  {
    label: "Rights",
    icon: "⌂",
    message: (role: WorkerRole) => `Explain useful government schemes and rights for a ${role} in simple language.`,
  },
  {
    label: "Grievance",
    icon: "✉",
    message: (role: WorkerRole) => `I am a ${role} in India. I have a problem with payment. Write a short polite grievance letter.`,
  },
  {
    label: "Document Help",
    icon: "▤",
    message: (role: WorkerRole) => `I am a ${role} in India. Help me understand what documents I may need for worker schemes or a payment issue. Ask what I need help with first.`,
  },
];

export default function Home() {
  const [role, setRole] = useState<WorkerRole>("Delivery Partner");
  const [language, setLanguage] = useState<ChatLanguage>("English");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading]);

  async function sendMessage(content: string) {
    const text = content.trim();
    if (!text || loading) return;

    const previousMessages = messages;
    const nextMessages: Message[] = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setInput("");
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages, role, language }),
      });
      const data: { text?: string; error?: string } = await response.json();
      if (!response.ok) throw new Error(data.error || "Couldn't get a reply. Please try again.");
      setMessages([...nextMessages, { role: "assistant", content: data.text || "I couldn't make a reply. Please try again." }]);
    } catch (caught) {
      setMessages(previousMessages);
      setInput(text);
      setError(caught instanceof Error ? caught.message : "Couldn't connect. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage(input);
  }

  return (
    <main className="min-h-screen bg-[#090d0c] text-zinc-100">
      <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col px-4 sm:px-7">
        <header className="flex items-center justify-between border-b border-white/[0.08] py-4">
          <a href="#" className="flex items-center gap-3" aria-label="Gig Sahayak home">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#b7f36b] text-lg font-bold text-[#101710]">G</span>
            <span>
              <span className="block text-sm font-semibold tracking-tight">Gig Sahayak</span>
              <span className="mt-0.5 block text-[11px] text-zinc-500">Support for your workday</span>
            </span>
          </a>
          <span className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[11px] text-zinc-400 sm:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-[#b7f36b]" /> Here to help
          </span>
        </header>

        <section className="flex flex-1 flex-col">
          <div className="flex flex-wrap gap-3 py-4">
            <label className="flex min-w-[190px] flex-1 flex-col gap-1.5 text-[11px] text-zinc-500">
              Your work
              <select value={role} onChange={(event) => setRole(event.target.value as WorkerRole)} className="h-10 rounded-xl border border-white/10 bg-[#111715] px-3 text-sm text-zinc-200 outline-none transition focus:border-[#b7f36b]/50">
                {workerRoles.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </label>
            <label className="flex min-w-[150px] flex-1 flex-col gap-1.5 text-[11px] text-zinc-500">
              Reply language
              <select value={language} onChange={(event) => setLanguage(event.target.value as ChatLanguage)} className="h-10 rounded-xl border border-white/10 bg-[#111715] px-3 text-sm text-zinc-200 outline-none transition focus:border-[#b7f36b]/50">
                {supportedLanguages.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </label>
          </div>

          <div className="flex flex-1 flex-col rounded-2xl border border-white/[0.08] bg-[#0d1210]">
            <div className="flex items-center justify-between border-b border-white/[0.07] px-4 py-3">
              <div>
                <h1 className="text-sm font-medium">Your chat</h1>
                <p className="mt-0.5 text-[11px] text-zinc-500">Simple, practical help for gig workers</p>
              </div>
              {messages.length > 0 && <button onClick={() => { setMessages([]); setError(""); }} className="rounded-lg px-2.5 py-1.5 text-xs text-zinc-500 hover:bg-white/5 hover:text-zinc-200">New chat <span className="text-[#b7f36b]">＋</span></button>}
            </div>

            <div role="log" aria-label="Chat messages" aria-live="polite" aria-relevant="additions text" className="flex min-h-[320px] flex-1 flex-col gap-4 overflow-y-auto p-4 sm:min-h-[400px] sm:p-6">
              {messages.length === 0 ? (
                <div className="m-auto max-w-md py-10 text-center">
                  <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl border border-[#b7f36b]/20 bg-[#b7f36b]/[0.08] text-xl text-[#b7f36b]">✳</div>
                  <h2 className="text-lg font-medium tracking-tight">What can I help with?</h2>
                  <p className="mt-2 text-sm leading-6 text-zinc-500">Ask a question or choose a topic below to get started.</p>
                </div>
              ) : messages.map((message, index) => (
                <div key={`${index}-${message.role}`} className={`flex gap-2.5 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  {message.role === "assistant" && <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-[#b7f36b] text-[11px] font-bold text-[#101710]">G</span>}
                  <div className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-6 ${message.role === "user" ? "rounded-br-md bg-[#b7f36b] text-[#101710]" : "rounded-bl-md border border-white/[0.08] bg-[#151b18] text-zinc-200"}`}>
                    {message.content}
                  </div>
                </div>
              ))}
              {loading && <div role="status" aria-live="polite" className="flex items-center gap-2.5 text-sm text-zinc-500"><span className="grid h-7 w-7 place-items-center rounded-lg bg-[#b7f36b] text-[11px] font-bold text-[#101710]">G</span><span className="animate-pulse">Thinking…</span></div>}
              {error && <p role="alert" className="self-center rounded-lg border border-red-900/50 bg-red-950/30 px-3 py-2 text-xs text-red-300">{error}</p>}
              <div ref={bottomRef} />
            </div>

            <div className="border-t border-white/[0.07] p-3 sm:p-4">
              <form onSubmit={handleSubmit} className="flex items-end gap-2 rounded-xl border border-white/10 bg-[#111715] p-2 transition focus-within:border-[#b7f36b]/40">
                <textarea value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); void sendMessage(input); }
                }} rows={2} maxLength={2000} placeholder="Type your message…" aria-label="Type your message" className="max-h-32 min-h-10 flex-1 resize-none bg-transparent px-2 py-1.5 text-sm leading-6 text-zinc-100 outline-none placeholder:text-zinc-600" />
                <button type="submit" disabled={!input.trim() || loading} className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#b7f36b] text-lg font-medium text-[#101710] transition hover:brightness-110 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-zinc-600" aria-label="Send message">↑</button>
              </form>
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-5">
                {quickActions.map((action) => (
                  <button key={action.label} type="button" disabled={loading} onClick={() => void sendMessage(action.message(role))} className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.02] px-3 py-2.5 text-left text-xs text-zinc-400 transition hover:border-[#b7f36b]/30 hover:bg-[#b7f36b]/[0.04] hover:text-zinc-100 disabled:cursor-not-allowed disabled:opacity-40">
                    <span className="text-sm text-[#b7f36b]">{action.icon}</span>{action.label}
                  </button>
                ))}
              </div>
              <p className="mt-3 text-center text-[10px] text-zinc-600">All replies are live Gemini calls – no mocks.</p>
            </div>
          </div>
        </section>
        <footer className="py-4 text-center text-[10px] text-zinc-600">Gig Sahayak · A little support for the people who keep things moving</footer>
      </div>
    </main>
  );
}
