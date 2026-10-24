"use client";

import { useState } from "react";
import type { ChatLanguage, WorkerRole } from "@/lib/prompts";
import { UI_TRANSLATIONS } from "@/lib/translations";
import {
  ShieldAlert,
  PhoneCall,
  Volume2,
  VolumeX,
  MapPin,
  Share2,
  HeartPulse,
} from "lucide-react";

interface GuardianSOSProps {
  role: WorkerRole;
  language: ChatLanguage;
}

export default function GuardianSOS({ role, language }: GuardianSOSProps) {
  const t = UI_TRANSLATIONS[language];

  const [sirenActive, setSirenActive] = useState(false);
  const [audioCtx, setAudioCtx] = useState<AudioContext | null>(null);
  const [oscillator, setOscillator] = useState<OscillatorNode | null>(null);
  const [locationText, setLocationText] = useState("");
  const [locating, setLocating] = useState(false);
  const [copiedSos, setCopiedSos] = useState(false);

  function toggleSiren() {
    if (sirenActive) {
      if (oscillator) {
        try {
          oscillator.stop();
          oscillator.disconnect();
        } catch {}
      }
      if (audioCtx) {
        audioCtx.close();
      }
      setSirenActive(false);
      setOscillator(null);
      setAudioCtx(null);
    } else {
      try {
        const AudioCtxClass =
          window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new AudioCtxClass();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        let time = ctx.currentTime;
        for (let i = 0; i < 20; i++) {
          osc.frequency.linearRampToValueAtTime(1400, time + 0.4);
          osc.frequency.linearRampToValueAtTime(800, time + 0.8);
          time += 0.8;
        }

        gain.gain.setValueAtTime(0.5, ctx.currentTime);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();

        setAudioCtx(ctx);
        setOscillator(osc);
        setSirenActive(true);
      } catch (err) {
        console.error("Audio error", err);
      }
    }
  }

  function getGpsLocation() {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const mapsLink = `https://maps.google.com/?q=${latitude},${longitude}`;
        setLocationText(mapsLink);
        setLocating(false);
      },
      () => {
        setLocationText("Location permission denied or unavailable.");
        setLocating(false);
      },
      { timeout: 10000 }
    );
  }

  function handleShareSos() {
    const loc = locationText ? `Location: ${locationText}` : "Location: On shift road";
    const sosMsg = `[EMERGENCY SOS] I am a gig ${role} facing distress or an accident. ${loc}. Please contact me or send emergency assistance immediately.`;

    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(sosMsg);
      setCopiedSos(true);
      setTimeout(() => setCopiedSos(false), 2500);
    }

    if (typeof navigator !== "undefined" && navigator.share) {
      navigator.share({
        title: "EMERGENCY SOS",
        text: sosMsg,
      }).catch(() => {});
    }
  }

  const emergencyContacts = [
    { name: "National Emergency Helpline", number: "112", desc: "Unified police, fire, & medical" },
    { name: "Ambulance Services", number: "108", desc: "Emergency accident & medical response" },
    { name: "Women's Safety Helpline", number: "1091", desc: "24x7 women harassment distress" },
    { name: "National Highway Accident Line", number: "1033", desc: "NHAI emergency road assistance" },
    { name: "e-Shram National Support", number: "14434", desc: "Accidental insurance claim desk" },
    { name: "Cyber Crime / Wallet Fraud", number: "1930", desc: "Floating balance UPI theft helpline" },
  ];

  return (
    <div className="space-y-6">
      {/* High-Alert Emergency Bar */}
      <div className="rounded-3xl border border-rose-500/40 bg-gradient-to-r from-rose-950/40 via-[#0E1526] to-[#070A12] p-6 backdrop-blur-md shadow-2xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400">
              <ShieldAlert className="h-7 w-7 animate-pulse" />
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-rose-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black tracking-tight text-white">
                  {t.sosTitle}
                </h2>
                <span className="rounded-full bg-rose-500/20 border border-rose-500/30 px-2.5 py-0.5 text-[10px] font-bold text-rose-300">
                  24x7 Live
                </span>
              </div>
              <p className="mt-1 text-xs text-zinc-300">
                {t.sosSubtitle}
              </p>
            </div>
          </div>

          {/* Quick Alarm & Share Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={toggleSiren}
              className={`flex items-center gap-2 rounded-xl px-5 py-3 text-xs font-bold transition shadow-lg active:scale-95 ${
                sirenActive
                  ? "bg-rose-600 text-white animate-bounce shadow-rose-600/50"
                  : "border border-rose-500/30 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20"
              }`}
            >
              {sirenActive ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              <span>{sirenActive ? t.sosSirenStop : t.sosSirenStart}</span>
            </button>

            <button
              type="button"
              onClick={handleShareSos}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-red-600 px-5 py-3 text-xs font-bold text-white shadow-lg shadow-rose-500/30 transition hover:brightness-110 active:scale-95"
            >
              <Share2 className="h-4 w-4" />
              <span>{copiedSos ? t.sosBroadcastCopied : t.sosBroadcastBtn}</span>
            </button>
          </div>
        </div>

        {/* GPS Coordinates Bar */}
        <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl border border-white/[0.08] bg-[#070A12]/80 p-3 text-xs">
          <div className="flex items-center gap-2 text-zinc-300 truncate max-w-xl">
            <MapPin className="h-4 w-4 shrink-0 text-rose-400" />
            <span className="truncate">
              {locationText ? locationText : "GPS location not yet fetched"}
            </span>
          </div>

          <button
            type="button"
            onClick={getGpsLocation}
            disabled={locating}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-medium text-zinc-300 hover:bg-white/10 hover:text-white transition shrink-0"
          >
            {locating ? "Locating…" : "Fetch Exact GPS Coordinates"}
          </button>
        </div>
      </div>

      {/* Helplines Directory & Insurance Claim Guide */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Helplines Directory */}
        <div className="rounded-3xl border border-black/10 dark:border-white/10 dark:bg-[#0E1526]/90 bg-white p-6 backdrop-blur-md shadow-2xl transition">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-base mb-4 border-b border-black/10 dark:border-white/[0.08] pb-3">
            <PhoneCall className="h-5 w-5 text-emerald-500" />
            <span>{t.sosHotlinesTitle}</span>
          </div>

          <div className="grid gap-3">
            {emergencyContacts.map((contact) => (
              <a
                key={contact.number}
                href={`tel:${contact.number}`}
                className="flex items-center justify-between rounded-xl border border-black/5 dark:border-white/5 dark:bg-[#070A12] bg-slate-50 p-3.5 transition hover:border-emerald-500/30 hover:bg-emerald-500/[0.04]"
              >
                <div>
                  <span className="block text-xs font-bold text-slate-900 dark:text-white">{contact.name}</span>
                  <span className="text-[11px] text-slate-500 dark:text-zinc-400">{contact.desc}</span>
                </div>
                <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  {contact.number}
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Accidental Insurance Claim Navigator */}
        <div className="rounded-3xl border border-black/10 dark:border-white/10 dark:bg-[#0E1526]/90 bg-white p-6 backdrop-blur-md shadow-2xl transition">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-base mb-4 border-b border-black/10 dark:border-white/[0.08] pb-3">
            <HeartPulse className="h-5 w-5 text-rose-500" />
            <span>{t.sosClaimTitle}</span>
          </div>

          <div className="space-y-3.5 text-xs text-slate-700 dark:text-zinc-300">
            <div className="rounded-xl border border-black/5 dark:border-white/5 dark:bg-[#070A12] bg-slate-50 p-3">
              <span className="font-bold text-slate-900 dark:text-white block mb-1">
                1. Immediate Medical Care & FIR / MLC
              </span>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                Admit to nearest hospital immediately. Collect the MLC (Medico-Legal Certificate) or police daily dairy entry (DDE), essential for insurance verification.
              </p>
            </div>

            <div className="rounded-xl border border-black/5 dark:border-white/5 dark:bg-[#070A12] bg-slate-50 p-3">
              <span className="font-bold text-slate-900 dark:text-white block mb-1">
                2. Inform Platform Support within 48 Hours
              </span>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                Log the incident via Zomato/Swiggy/Uber support ticket to trigger group accidental coverage (covers up to ₹5 Lakh hospitalization & permanent disability).
              </p>
            </div>

            <div className="rounded-xl border border-black/5 dark:border-white/5 dark:bg-[#070A12] bg-slate-50 p-3">
              <span className="font-bold text-slate-900 dark:text-white block mb-1">
                3. e-Shram ₹2,00,000 PMSBY Benefit
              </span>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                If registered with e-Shram, submit Aadhaar, UAN card copy, and hospital bills to the district labor officer or online via the e-Shram claim desk.
              </p>
            </div>

            <div className="rounded-xl border border-black/5 dark:border-white/5 dark:bg-[#070A12] bg-slate-50 p-3">
              <span className="font-bold text-slate-900 dark:text-white block mb-1">
                4. Rajasthan & Karnataka Welfare Act
              </span>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                If operating in Rajasthan or Karnataka, gig workers are statutorily entitled to emergency state medical compensation funds up to ₹2 Lakh - ₹4 Lakh.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
