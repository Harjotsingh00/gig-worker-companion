"use client";

import { useState } from "react";
import type { ChatLanguage, WorkerRole } from "@/lib/prompts";
import { UI_TRANSLATIONS } from "@/lib/translations";
import {
  Navigation,
  Clock,
  CloudRain,
  Sun,
  Fuel,
  Sparkles,
  MapPin,
  ShieldCheck,
} from "lucide-react";

interface HotspotRadarProps {
  role: WorkerRole;
  language: ChatLanguage;
  onAskGemini: (prompt: string) => void;
}

export default function HotspotRadar({ role, language, onAskGemini }: HotspotRadarProps) {
  const t = UI_TRANSLATIONS[language];
  const [selectedCity, setSelectedCity] = useState("Delhi NCR");

  const cities = ["Delhi NCR", "Bengaluru", "Mumbai", "Hyderabad", "Pune", "Kolkata", "Chennai", "Chandigarh / Tricity"];

  const peakWindows: Record<ChatLanguage, { time: string; name: string; surge: string; tip: string }[]> = {
    English: [
      { time: "07:30 AM - 10:00 AM", name: "Morning Rush & Breakfast", surge: "1.2x - 1.4x", tip: "Focus on office commuter rides, metro stations, and breakfast cafes (Blinkit/Zepto morning grocery spike)." },
      { time: "12:30 PM - 03:00 PM", name: "Corporate Lunch Surge", surge: "1.3x - 1.6x", tip: "Position near high-density IT Tech Parks & SEZs. Pre-position near cloud kitchen clusters before 12:45 PM." },
      { time: "05:00 PM - 07:30 PM", name: "Evening Return Commute & Tea", surge: "1.4x - 1.8x", tip: "High cab & bike-taxi demand leaving office hubs. High grocery quick-commerce grocery reorders." },
      { time: "08:00 PM - 11:30 PM", name: "Prime Dinner Rush & Incentives", surge: "1.5x - 2.2x", tip: "Maximum order density for Swiggy/Zomato. Target multi-restaurant mall clusters to chain deliveries." },
    ],
    Hindi: [
      { time: "07:30 AM - 10:00 AM", name: "सुबह की भीड़ एवं नाश्ता समय", surge: "1.2x - 1.4x", tip: "मेट्रो स्टेशनों और ऑफिस रूट पर राइड। ब्लिंकिट/ज़ेप्टो पर सुबह के दूध, ब्रेड व नाश्ता ऑर्डर्स का पीक।" },
      { time: "12:30 PM - 03:00 PM", name: "कॉर्पोरेट लंच सर्ज", surge: "1.3x - 1.6x", tip: "आईटी पार्क और ऑफिस हब के पास रहें। 12:45 से पहले प्रमुख क्लाउड किचन क्लस्टर में पोजीशन लें।" },
      { time: "05:00 PM - 07:30 PM", name: "शाम की वापसी यात्रा एवं चाय स्नैक्स", surge: "1.4x - 1.8x", tip: "ऑफिस से घर जाने वाली कैब व बाइक राइड्स की भारी मांग। शाम के स्नैक्स व ग्रॉसरी डिलीवरी।" },
      { time: "08:00 PM - 11:30 PM", name: "प्राइम डिनर समय एवं इंसेंटिव बोनस", surge: "1.5x - 2.2x", tip: "ज़ोमैटो/स्विगी पर सबसे अधिक ऑर्डर्स। इंसेंटिव टारगेट पूरा करने के लिए मॉल व रेस्टोरेंट हब के पास रहें।" },
    ],
    Punjabi: [
      { time: "07:30 AM - 10:00 AM", name: "ਸਵੇਰ ਦਾ ਸਮਾਂ ਅਤੇ ਨਾਸ਼ਤਾ", surge: "1.2x - 1.4x", tip: "ਮੈਟਰੋ ਸਟੇਸ਼ਨਾਂ ਅਤੇ ਦਫਤਰ ਜਾਣ ਵਾਲਿਆਂ ਦੀਆਂ ਰਾਈਡਾਂ। ਸਵੇਰ ਦੀ ਕਰਿਆਨਾ ਡਿਲਿਵਰੀ ਦੀ ਮੰਗ।" },
      { time: "12:30 PM - 03:00 PM", name: "ਦੁਪਹਿਰ ਦਾ ਲੰਚ ਸਰਜ", surge: "1.3x - 1.6x", tip: "ਆਈਟੀ ਪਾਰਕਾਂ ਅਤੇ ਦਫਤਰਾਂ ਦੇ ਨੇੜੇ ਰਹੋ। ਕਲਾਉਡ ਕਿਚਨਾਂ ਦੇ ਨੇੜੇ ਪਹਿਲਾਂ ਤੋਂ ਪਹੁੰਚੋ।" },
      { time: "05:00 PM - 07:30 PM", name: "ਸ਼ਾਮ ਦੀ ਵਾਪਸੀ ਅਤੇ ਚਾਹ-ਸਨੈਕਸ", surge: "1.4x - 1.8x", tip: "ਘਰ ਵਾਪਸੀ ਲਈ ਕੈਬ ਅਤੇ ਬਾਈਕ ਰਾਈਡਾਂ ਦੀ ਮੰਗ। ਕਰਿਆਨਾ ਸਾਮਾਨ ਦੇ ਆਰਡਰ।" },
      { time: "08:00 PM - 11:30 PM", name: "ਰਾਤ ਦੇ ਖਾਣੇ ਦਾ ਪ੍ਰਾਈਮ ਸਮਾਂ", surge: "1.5x - 2.2x", tip: "ਸਵਿਗੀ/ਜ਼ੋਮੈਟੋ 'ਤੇ ਸਭ ਤੋਂ ਵੱਧ ਆਰਡਰ। ਇਨਸੈਂਟਿਵ ਪੂਰਾ ਕਰਨ ਲਈ ਸਭ ਤੋਂ ਵਧੀਆ ਸਮਾਂ।" },
    ],
  };

  function handleAskHotspotStrategy() {
    const prompt =
      language === "Hindi"
        ? `मैं ${selectedCity} में एक ${role} हूँ।
आज के लिए मुझे उच्च कमाई वाली शिफ्ट रणनीति बताएं:
1. बिना खाली पेट्रोल जलाए रुकने के लिए सबसे बेहतरीन हॉटस्पॉट क्लस्टर
2. इंसेंटिव टारगेट आसानी से पूरा करने का तरीका (बिना अत्यधिक थकान के)
3. वर्तमान मौसम और ट्रैफिक के अनुसार जरूरी सावधानियां
व्यावहारिक और स्पष्ट हिन्दी में बताएं।`
        : language === "Punjabi"
        ? `ਮੈਂ ${selectedCity} ਵਿੱਚ ਇੱਕ ${role} ਹਾਂ।
ਮੈਨੂੰ ਅੱਜ ਦੀ ਵੱਧ ਕਮਾਈ ਵਾਲੀ ਸ਼ਿਫਟ ਰਣਨੀਤੀ ਦੱਸੋ:
1. ਬਿਨਾਂ ਫਾਲਤੂ ਤੇਲ ਸਾੜੇ ਕਿਹੜੀਆਂ ਥਾਵਾਂ 'ਤੇ ਰੁਕਣਾ ਚਾਹੀਦਾ ਹੈ
2. ਇਨਸੈਂਟਿਵ ਟਾਰਗੇਟ ਪੂਰਾ ਕਰਨ ਦਾ ਸਭ ਤੋਂ ਵਧੀਆ ਤਰੀਕਾ
3. ਮੌਸਮ ਅਤੇ ਟ੍ਰੈਫਿਕ ਅਨੁਸਾਰ ਸੁਰੱਖਿਆ ਨੁਕਤੇ
ਪੰਜਾਬੀ ਵਿੱਚ ਦੱਸੋ।`
        : `I am a ${role} operating in ${selectedCity}, India. 
Provide a high-yield shift strategy for today:
1. Best cluster hotspots to station without burning idle fuel
2. Peak incentive achievement plan (how to hit target orders without burnout)
3. Weather and traffic precautions for this season
Reply practically and concisely in English.`;

    onAskGemini(prompt);
  }

  const windows = peakWindows[language] || peakWindows.English;

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="rounded-3xl border border-black/10 dark:border-white/10 dark:bg-[#0E1526]/90 bg-white p-6 backdrop-blur-md shadow-2xl transition">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/10 dark:border-white/[0.08] pb-5">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-teal-500/20 border border-cyan-500/30 text-cyan-500">
              <Navigation className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">{t.radarTitle}</h2>
              <p className="text-xs text-slate-600 dark:text-zinc-400">{t.radarSubtitle}</p>
            </div>
          </div>

          {/* City Selector */}
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-emerald-500" />
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="rounded-xl border border-black/10 dark:border-white/10 dark:bg-[#070A12] bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-900 dark:text-white outline-none focus:border-cyan-500 cursor-pointer"
            >
              {cities.map((city) => (
                <option key={city} value={city} className="dark:bg-[#0E1526] bg-white">
                  {city}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Peak Windows Grid */}
        <div className="mt-6">
          <h3 className="text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-cyan-500" />
            {language === "Hindi" ? "पीक ऑर्डर समय एवं सर्ज अवसर" : language === "Punjabi" ? "ਪੀਕ ਆਰਡਰ ਸਮਾਂ ਅਤੇ ਸਰਜ ਮੌਕੇ" : "Peak Order Windows & Surge Timing"}
          </h3>

          <div className="grid gap-3 sm:grid-cols-2">
            {windows.map((window, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-black/5 dark:border-white/5 dark:bg-[#070A12] bg-slate-50 p-4 transition hover:border-cyan-500/30"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">{window.name}</span>
                  <span className="rounded-md border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 text-[10px] font-bold text-cyan-600 dark:text-cyan-400">
                    {window.surge} Surge
                  </span>
                </div>
                <div className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 mb-1">{window.time}</div>
                <p className="text-[11px] text-slate-600 dark:text-zinc-400 leading-relaxed">{window.tip}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Weather & Hazard Safety Protocols */}
        <div className="mt-6 border-t border-black/10 dark:border-white/[0.08] pt-5">
          <h3 className="text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-amber-500" />
            {language === "Hindi" ? "मौसम एवं सड़क सुरक्षा नियम" : language === "Punjabi" ? "ਮੌਸਮ ਅਤੇ ਸੜਕ ਸੁਰੱਖਿਆ ਨਿਯਮ" : "Weather & Hazard Safety Playbook"}
          </h3>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-black/5 dark:border-white/5 dark:bg-[#070A12] bg-slate-50 p-3.5">
              <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 text-xs font-bold mb-1">
                <CloudRain className="h-4 w-4" />
                {language === "Hindi" ? "बारिश एवं जलभराव सुरक्षा" : language === "Punjabi" ? "ਮੀਂਹ ਅਤੇ ਪਾਣੀ ਭਰਨ ਤੋਂ ਬਚਾਅ" : "Monsoon & Rain Surge"}
              </div>
              <p className="text-[11px] text-slate-600 dark:text-zinc-400 leading-relaxed">
                वाटरप्रूफ मोबाइल कवर का प्रयोग करें। साइलेंसर से ऊपर पानी होने पर इंजन बंद कर दें। लॉग-ऑफ करने से पहले रेन सर्ज क्लेम करें।
              </p>
            </div>

            <div className="rounded-2xl border border-black/5 dark:border-white/5 dark:bg-[#070A12] bg-slate-50 p-3.5">
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-xs font-bold mb-1">
                <Sun className="h-4 w-4" />
                {language === "Hindi" ? "भीषण गर्मी एवं लू से बचाव" : language === "Punjabi" ? "ਗਰਮੀ ਅਤੇ ਲੂ ਤੋਂ ਬਚਾਅ" : "Extreme Heat Protection"}
              </div>
              <p className="text-[11px] text-slate-600 dark:text-zinc-400 leading-relaxed">
                हर 2 घंटे में ओआरएस या नीबू-नमक पानी पिएं। फोन को धूप से बचाएं ताकि बैटरी ओवरहीट होकर ऐप क्रैश न हो।
              </p>
            </div>

            <div className="rounded-2xl border border-black/5 dark:border-white/5 dark:bg-[#070A12] bg-slate-50 p-3.5">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-bold mb-1">
                <Fuel className="h-4 w-4" />
                {language === "Hindi" ? "शून्य-आइडल पेट्रोल बचत" : language === "Punjabi" ? "ਤੇਲ ਬਚਾਉਣ ਦਾ ਨਿਯਮ" : "Zero-Idle Fuel Protocol"}
              </div>
              <p className="text-[11px] text-slate-600 dark:text-zinc-400 leading-relaxed">
                30 सेकंड से लंबे रेड लाइट और होटल पर इंतजार के दौरान इंजन बंद रखें। रोजाना ₹100 से ₹150 का पेट्रोल बचेगा।
              </p>
            </div>
          </div>
        </div>

        {/* AI Hotspot Strategy Trigger */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-black/10 dark:border-white/[0.08] pt-4">
          <span className="text-[11px] text-slate-500 dark:text-zinc-400">
            {language === "Hindi"
              ? `${selectedCity} के अनुसार सटीक हॉटस्पॉट व रूट रणनीति पाएं`
              : language === "Punjabi"
              ? `${selectedCity} ਅਨੁਸਾਰ ਵਧੀਆ ਹੌਟਸਪੌਟ ਅਤੇ ਰੂਟ ਰਣਨੀਤੀ ਲਵੋ`
              : `Get personalized hotspot coordinates and route strategies for ${selectedCity}`}
          </span>

          <button
            type="button"
            onClick={handleAskHotspotStrategy}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 px-5 py-2.5 text-xs font-bold text-black shadow-lg shadow-cyan-500/20 transition hover:brightness-110 active:scale-95 shrink-0"
          >
            <Sparkles className="h-4 w-4" />
            <span>{t.radarAskBtn}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
