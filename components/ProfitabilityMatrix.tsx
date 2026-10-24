"use client";

import { useState } from "react";
import type { ChatLanguage, WorkerRole } from "@/lib/prompts";
import { UI_TRANSLATIONS } from "@/lib/translations";
import { calculateShiftProfitability, type FuelShiftResult } from "@/lib/fuel-optimizer";
import {
  Fuel,
  TrendingUp,
  Sparkles,
  Gauge,
  Clock,
  Coins,
  ArrowUpRight,
} from "lucide-react";

interface ProfitabilityMatrixProps {
  role: WorkerRole;
  language: ChatLanguage;
  apiKey: string;
  onAskGeminiTips: (prompt: string) => void;
}

export default function ProfitabilityMatrix({
  role,
  language,
  apiKey,
  onAskGeminiTips,
}: ProfitabilityMatrixProps) {
  const t = UI_TRANSLATIONS[language];

  const [gross, setGross] = useState("1200");
  const [distance, setDistance] = useState("75");
  const [fuelPrice, setFuelPrice] = useState("102");
  const [mileage, setMileage] = useState(role === "Driver" ? "18" : "40");
  const [hours, setHours] = useState("8");
  const [otherExpenses, setOtherExpenses] = useState("40");

  const [result, setResult] = useState<FuelShiftResult>(() =>
    calculateShiftProfitability({
      grossEarnings: 1200,
      distanceKm: 75,
      fuelPricePerLiter: 102,
      mileageKmPerLiter: role === "Driver" ? 18 : 40,
      shiftHours: 8,
      otherExpenses: 40,
    })
  );

  function handleCalculate(e?: React.FormEvent) {
    if (e) e.preventDefault();
    const calculated = calculateShiftProfitability({
      grossEarnings: Number(gross) || 0,
      distanceKm: Number(distance) || 0,
      fuelPricePerLiter: Number(fuelPrice) || 100,
      mileageKmPerLiter: Number(mileage) || 35,
      shiftHours: Number(hours) || 8,
      otherExpenses: Number(otherExpenses) || 0,
    });
    setResult(calculated);
  }

  function handleAskGemini() {
    const prompt =
      language === "Hindi"
        ? `मैं भारत में एक ${role} हूँ। आज की शिफ्ट के आर्थिक आंकड़े ये हैं:
- कुल सकल कमाई: ₹${result.grossEarnings}
- कुल तय दूरी: ${distance} किमी
- शिफ्ट समय: ${hours} घंटे
- जला हुआ पेट्रोल: ${result.fuelConsumedLiters} लीटर (लागत: ₹${result.fuelCost} @ ₹${fuelPrice}/लीटर)
- अन्य खर्च: ₹${result.otherExpenses}
- वास्तविक शुद्ध बचत (Net Take-home): ₹${result.netEarnings}
- प्रति घंटा वास्तविक दर: ₹${result.realHourlyWage}/घंटा
- खर्च अनुपात: सकल कमाई का ${result.costPercentage}%

कृपया इन वास्तविक आंकड़ों का विश्लेषण करके मुझे प्रति घंटा शुद्ध कमाई बढ़ाने और खाली किलोमीटर का पेट्रोल खर्च घटाने के 3 व्यावहारिक तरीके बताएं। हिन्दी में उत्तर दें।`
        : language === "Punjabi"
        ? `ਮੈਂ ਭਾਰਤ ਵਿੱਚ ਇੱਕ ${role} ਹਾਂ। ਅੱਜ ਦੀ ਸ਼ਿਫਟ ਦੇ ਅੰਕੜੇ ਇਹ ਹਨ:
- ਕੁੱਲ ਕਮਾਈ: ₹${result.grossEarnings}
- ਕੁੱਲ ਦੂਰੀ: ${distance} ਕਿਮੀ
- ਸ਼ਿਫਟ ਸਮਾਂ: ${hours} ਘੰਟੇ
- ਤੇਲ ਖਪਤ: ${result.fuelConsumedLiters} ਲਿਟਰ (ਖਰਚ: ₹${result.fuelCost} @ ₹${fuelPrice}/ਲਿਟਰ)
- ਹੋਰ ਖਰਚੇ: ₹${result.otherExpenses}
- ਅਸਲ ਸ਼ੁੱਧ ਬੱਚਤ: ₹${result.netEarnings}
- ਪ੍ਰਤੀ ਘੰਟਾ ਕਮਾਈ: ₹${result.realHourlyWage}/ਘੰਟਾ
- ਤੇਲ ਖਰਚਾ ਅਨੁਪਾਤ: ਕੁੱਲ ਕਮਾਈ ਦਾ ${result.costPercentage}%

ਮੈਨੂੰ ਪ੍ਰਤੀ ਘੰਟਾ ਸ਼ੁੱਧ ਕਮਾਈ ਵਧਾਉਣ ਅਤੇ ਖਾਲੀ ਤੇਲ ਖਰਚ ਘਟਾਉਣ ਦੇ 3 ਪੱਕੇ ਤਰੀਕੇ ਦੱਸੋ। ਪੰਜਾਬੀ ਵਿੱਚ ਜਵਾਬ ਦਿਓ।`
        : `I am a ${role} in India. I ran a shift with these exact economics:
- Gross Earnings: ₹${result.grossEarnings}
- Total Distance: ${distance} km
- Shift Duration: ${hours} hours
- Fuel Burned: ${result.fuelConsumedLiters} Liters (Cost: ₹${result.fuelCost} at ₹${fuelPrice}/L)
- Other Operating Expenses: ₹${result.otherExpenses}
- Net Take-Home Earnings: ₹${result.netEarnings}
- Real Net Hourly Rate: ₹${result.realHourlyWage}/hr
- Operating Expense Ratio: ${result.costPercentage}% of gross

Analyze these exact figures and give me 3 specific, practical strategies to improve my net earnings per hour and cut down dead-kilometer fuel burn. Reply in English.`;

    onAskGeminiTips(prompt);
  }

  const formatINR = (val: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(val);

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="rounded-3xl border border-black/10 dark:border-white/10 dark:bg-[#0E1526]/90 bg-white p-6 backdrop-blur-md shadow-2xl transition">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/10 dark:border-white/[0.08] pb-5">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-tr from-amber-500/20 to-emerald-500/20 border border-amber-500/30 text-amber-500">
              <Fuel className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">{t.fuelTitle}</h2>
              <p className="text-xs text-slate-600 dark:text-zinc-400">{t.fuelSubtitle}</p>
            </div>
          </div>
          <span className="self-start sm:self-auto rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400">
            Real Hourly Benchmark
          </span>
        </div>

        {/* Input Form */}
        <form onSubmit={handleCalculate} className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1.5">
              {t.fuelGrossLabel}
            </label>
            <input
              type="number"
              min="0"
              step="10"
              value={gross}
              onChange={(e) => setGross(e.target.value)}
              className="h-11 w-full rounded-xl border border-black/10 dark:border-white/10 dark:bg-[#070A12] bg-slate-50 px-3.5 text-sm text-slate-900 dark:text-white outline-none focus:border-amber-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1.5">
              {t.fuelDistanceLabel}
            </label>
            <input
              type="number"
              min="1"
              step="1"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
              className="h-11 w-full rounded-xl border border-black/10 dark:border-white/10 dark:bg-[#070A12] bg-slate-50 px-3.5 text-sm text-slate-900 dark:text-white outline-none focus:border-amber-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1.5">
              {t.fuelPriceLabel}
            </label>
            <input
              type="number"
              min="50"
              step="0.5"
              value={fuelPrice}
              onChange={(e) => setFuelPrice(e.target.value)}
              className="h-11 w-full rounded-xl border border-black/10 dark:border-white/10 dark:bg-[#070A12] bg-slate-50 px-3.5 text-sm text-slate-900 dark:text-white outline-none focus:border-amber-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1.5">
              {t.fuelMileageLabel}
            </label>
            <input
              type="number"
              min="5"
              step="1"
              value={mileage}
              onChange={(e) => setMileage(e.target.value)}
              className="h-11 w-full rounded-xl border border-black/10 dark:border-white/10 dark:bg-[#070A12] bg-slate-50 px-3.5 text-sm text-slate-900 dark:text-white outline-none focus:border-amber-500"
              required
            />
            <span className="mt-1 block text-[10px] text-slate-500 dark:text-zinc-500">
              Bike ~38-45, Auto ~18-22, Cab ~14-16 km/L
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1.5">
              {t.fuelHoursLabel}
            </label>
            <input
              type="number"
              min="1"
              max="24"
              step="0.5"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              className="h-11 w-full rounded-xl border border-black/10 dark:border-white/10 dark:bg-[#070A12] bg-slate-50 px-3.5 text-sm text-slate-900 dark:text-white outline-none focus:border-amber-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1.5">
              {t.fuelOtherLabel}
            </label>
            <input
              type="number"
              min="0"
              step="5"
              value={otherExpenses}
              onChange={(e) => setOtherExpenses(e.target.value)}
              className="h-11 w-full rounded-xl border border-black/10 dark:border-white/10 dark:bg-[#070A12] bg-slate-50 px-3.5 text-sm text-slate-900 dark:text-white outline-none focus:border-amber-500"
            />
          </div>

          <div className="sm:col-span-2 lg:col-span-3 flex justify-end">
            <button
              type="submit"
              className="rounded-xl bg-gradient-to-r from-amber-500 to-emerald-500 px-6 py-2.5 text-xs font-bold text-black shadow-lg shadow-amber-500/20 transition hover:brightness-110 active:scale-95"
            >
              {t.fuelCalculateBtn}
            </button>
          </div>
        </form>
      </div>

      {/* Visual KPI Breakdown Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Net Take-Home */}
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/[0.05] p-5 backdrop-blur-md">
          <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400 text-xs">
            <span>{t.fuelNetCard}</span>
            <Coins className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
            {formatINR(result.netEarnings)}
          </div>
          <div className="mt-1 text-[11px] text-slate-500 dark:text-zinc-400">
            ₹{result.totalExpenses} total shift expenses
          </div>
        </div>

        {/* Real Hourly Wage */}
        <div className="rounded-2xl border border-cyan-500/30 bg-cyan-500/[0.05] p-5 backdrop-blur-md">
          <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400 text-xs">
            <span>{t.fuelHourlyCard}</span>
            <Clock className="h-4 w-4 text-cyan-500" />
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-cyan-600 dark:text-cyan-400">
            ₹{result.realHourlyWage}/hr
          </div>
          <div className="mt-1 text-[11px] text-slate-500 dark:text-zinc-400">
            {result.realHourlyWage >= 100 ? (
              <span className="text-emerald-600 dark:text-emerald-400">✓ Above baseline minimum wage</span>
            ) : (
              <span className="text-amber-600 dark:text-amber-400">⚠ Below standard wage efficiency</span>
            )}
          </div>
        </div>

        {/* Fuel Burn & Expenses */}
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/[0.05] p-5 backdrop-blur-md">
          <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400 text-xs">
            <span>{t.fuelCostCard}</span>
            <Fuel className="h-4 w-4 text-amber-500" />
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-amber-600 dark:text-amber-400">
            {formatINR(result.fuelCost)}
          </div>
          <div className="mt-1 text-[11px] text-slate-500 dark:text-zinc-400">
            {result.fuelConsumedLiters}L burned ({result.costPercentage.toFixed(1)}% of gross)
          </div>
        </div>

        {/* Profit per KM */}
        <div className="rounded-2xl border border-purple-500/30 bg-purple-500/[0.05] p-5 backdrop-blur-md">
          <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400 text-xs">
            <span>{t.fuelProfitKmCard}</span>
            <Gauge className="h-4 w-4 text-purple-500" />
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-purple-600 dark:text-purple-400">
            ₹{result.profitPerKm.toFixed(2)} / km
          </div>
          <div className="mt-1 text-[11px] text-slate-500 dark:text-zinc-400">
            Over {distance} total shift kilometers
          </div>
        </div>
      </div>

      {/* Advisory & Gemini Optimization Trigger */}
      <div className="rounded-3xl border border-black/10 dark:border-white/10 dark:bg-[#0E1526]/90 bg-white p-6 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-5 transition">
        <div className="flex items-start gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Shift Economic Diagnostic</h3>
            <p className="text-xs text-slate-600 dark:text-zinc-300 mt-0.5 leading-relaxed">
              {result.summaryText} Operating costs account for{" "}
              <strong className="text-amber-500">{result.costPercentage.toFixed(1)}%</strong> of gross revenue.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleAskGemini}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-3 text-xs font-bold text-black shadow-lg shadow-emerald-500/20 transition hover:brightness-110 active:scale-95 shrink-0"
        >
          <Sparkles className="h-4 w-4" />
          <span>{t.fuelAskGeminiBtn}</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
