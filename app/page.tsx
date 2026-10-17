"use client";

import { useEffect, useRef, useState } from "react";
import DocumentHelp from "@/components/DocumentHelp";
import EarningsCheckIn from "@/components/EarningsCheckIn";
import ChatComposer from "@/components/ChatComposer";
import ChatMessages, { type Message } from "@/components/ChatMessages";
import WorkerPreferences from "@/components/WorkerPreferences";
import type { ChatLanguage, WorkerRole } from "@/lib/prompts";
import { getRecentChatMessages } from "@/lib/chat-history";

export default function Home() {
  const [role, setRole] = useState<WorkerRole>("Delivery Partner");
  const [language, setLanguage] = useState<ChatLanguage>("English");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showEarnings, setShowEarnings] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading]);

  async function sendMessage(content: string) {
    const text = content.trim();
    if (!text || loading) return;

    const previousMessages = messages;
    const nextMessages: Message[] = [...messages, { role: "user", content: text, language }];
    setMessages(nextMessages);
    setInput("");
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: getRecentChatMessages(nextMessages.map(({ role: messageRole, content }) => ({ role: messageRole, content }))), role, language }),
      });
      const data: { text?: string; error?: string } = await response.json();
      if (!response.ok) throw new Error(data.error || "Couldn't get a reply. Please try again.");
      setMessages([...nextMessages, { role: "assistant", content: data.text || "I couldn't make a reply. Please try again.", language }]);
    } catch (caught) {
      setMessages(previousMessages);
      setInput(text);
      setError(caught instanceof Error ? caught.message : "Couldn't connect. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#090d0c] text-zinc-100">
      <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col px-4 sm:px-7">
        <header className="flex items-center justify-between border-b border-white/[0.08] py-4">
          <a href="#" className="flex items-center gap-3" aria-label="Gig Sahayak home">
            <span aria-hidden="true" className="grid h-10 w-10 place-items-center rounded-xl bg-[#b7f36b] text-lg font-bold text-[#101710]">G</span>
            <span>
              <span className="block text-sm font-semibold tracking-tight">Gig Sahayak</span>
              <span className="mt-0.5 block text-[11px] text-zinc-500">Support for your workday</span>
            </span>
          </a>
          <span className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[11px] text-zinc-400 sm:flex">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#b7f36b]" /> Here to help
          </span>
        </header>

        <section className="flex flex-1 flex-col" aria-label="Gig worker assistant">
          <WorkerPreferences role={role} language={language} onRoleChange={setRole} onLanguageChange={setLanguage} />
          {showEarnings && <EarningsCheckIn role={role} language={language} onClose={() => setShowEarnings(false)} onAskForTips={(prompt) => { setShowEarnings(false); sendMessage(prompt); }} />}
          <DocumentHelp role={role} language={language} onDraft={sendMessage} disabled={loading} />
          <div className="flex flex-1 flex-col rounded-2xl border border-white/[0.08] bg-[#0d1210]">
            <div className="flex items-center justify-between border-b border-white/[0.07] px-4 py-3">
              <div>
                <h1 className="text-sm font-medium">Your chat</h1>
                <p className="mt-0.5 text-[11px] text-zinc-500">Simple, practical help for gig workers</p>
              </div>
              {messages.length > 0 && <button onClick={() => { setMessages([]); setError(""); }} className="rounded-lg px-2.5 py-1.5 text-xs text-zinc-500 hover:bg-white/5 hover:text-zinc-200">New chat <span className="text-[#b7f36b]">＋</span></button>}
            </div>
            <ChatMessages messages={messages} loading={loading} error={error} bottomRef={bottomRef} />
            <ChatComposer input={input} role={role} loading={loading} onInputChange={setInput} onSend={sendMessage} onEarnings={() => setShowEarnings(true)} />
          </div>
        </section>
        <footer className="py-4 text-center text-[10px] text-zinc-600">Gig Sahayak · A little support for the people who keep things moving</footer>
      </div>
    </main>
  );
}
