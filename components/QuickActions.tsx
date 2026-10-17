"use client";

import type { WorkerRole } from "@/lib/prompts";

const quickActions: { label: string; icon: string; message?: (role: WorkerRole) => string }[] = [
  {
    label: "Earnings",
    icon: "₹",
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

export default function QuickActions({ role, disabled, onSend, onEarnings }: { role: WorkerRole; disabled: boolean; onSend: (message: string) => void; onEarnings: () => void }) {
  return (
    <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-5">
      {quickActions.map((action) => (
        <button key={action.label} type="button" disabled={disabled} onClick={() => action.message ? onSend(action.message(role)) : onEarnings()} className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.02] px-3 py-2.5 text-left text-xs text-zinc-400 transition hover:border-[#b7f36b]/30 hover:bg-[#b7f36b]/[0.04] hover:text-zinc-100 disabled:cursor-not-allowed disabled:opacity-40">
          <span className="text-sm text-[#b7f36b]">{action.icon}</span>{action.label}
        </button>
      ))}
    </div>
  );
}
