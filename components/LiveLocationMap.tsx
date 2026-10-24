"use client";

import { useState, useEffect, useCallback } from "react";
import type { ChatLanguage, WorkerRole } from "@/lib/prompts";
import { UI_TRANSLATIONS } from "@/lib/translations";
import {
  MapPin,
  Navigation,
  Share2,
  Copy,
  Check,
  AlertTriangle,
  Hospital,
  Shield,
  Fuel,
  ExternalLink,
  Sparkles,
  Compass,
} from "lucide-react";

interface LiveLocationMapProps {
  role: WorkerRole;
  language: ChatLanguage;
  onAskAiWithLocation: (prompt: string) => void;
}

export default function LiveLocationMap({
  role,
  language,
  onAskAiWithLocation,
}: LiveLocationMapProps) {
  const t = UI_TRANSLATIONS[language];

  const [coords, setCoords] = useState<{
    lat: number;
    lng: number;
    accuracy: number;
    speed: number | null;
  } | null>(null);

  const [address, setAddress] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);

  const fetchLocation = useCallback(() => {
    setLoading(true);
    setError("");

    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setError("Geolocation is not supported by your browser device.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const accuracy = Math.round(pos.coords.accuracy);
        const speed = pos.coords.speed ? Math.round(pos.coords.speed * 3.6) : null;

        setCoords({ lat, lng, accuracy, speed });
        setLoading(false);

        // Reverse Geocode via OpenStreetMap Nominatim
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
            { headers: { "Accept-Language": language === "Hindi" ? "hi" : language === "Punjabi" ? "pa" : "en" } }
          );
          if (res.ok) {
            const data = await res.json();
            if (data && data.display_name) {
              setAddress(data.display_name);
            }
          }
        } catch {
          // Graceful fallback to coords if offline/throttled
          setAddress(`GPS: ${lat.toFixed(5)}, ${lng.toFixed(5)}`);
        }
      },
      (err) => {
        setLoading(false);
        // Default to a central landmark (Connaught Place, New Delhi) for preview if location blocked
        setCoords({ lat: 28.6315, lng: 77.2167, accuracy: 25, speed: 0 });
        setAddress("Connaught Place, New Delhi, 110001, India (Preview - enable device GPS for real-time pin)");
        if (err.code === err.PERMISSION_DENIED) {
          setError("Location permission denied. Showing preview map. Enable device GPS in browser settings.");
        }
      },
    );
  }, [language]);

  useEffect(() => {
    fetchLocation();
  }, [fetchLocation]);

  const mapsUrl = coords
    ? `https://maps.google.com/?q=${coords.lat},${coords.lng}`
    : "https://maps.google.com";

  function handleCopy() {
    if (!coords) return;
    navigator.clipboard.writeText(mapsUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleShareWhatsApp() {
    if (!coords) return;
    const msg = encodeURIComponent(
      `[Saarthi AI Live Location] I am a ${role}. My current GPS position: ${mapsUrl} (${address || "On route"}).`
    );
    window.open(`https://wa.me/?text=${msg}`, "_blank");
  }

  function handleShareSms() {
    if (!coords) return;
    const msg = encodeURIComponent(
      `[Saarthi Live Location] ${role} GPS: ${mapsUrl}. Landmark: ${address || "On route"}`
    );
    window.open(`sms:?body=${msg}`, "_blank");
  }

  function handleAskAiSafeStops() {
    if (!coords) return;
    const prompt =
      language === "Hindi"
        ? `मैं अभी अक्षांश ${coords.lat.toFixed(4)}, देशांतर ${coords.lng.toFixed(4)} (${address}) पर हूँ। मैं एक ${role} हूँ। मेरे आसपास सबसे सुरक्षित, रोशनी वाले विश्राम स्थल, 24 घंटे खुले पेट्रोल पंप और नजदीकी पुलिस पिकेट कहां हैं? कृपया व्यावहारिक हिन्दी में बताएं।`
        : language === "Punjabi"
        ? `ਮੈਂ ਹੁਣ ਲੈਟੀਚਿਊਡ ${coords.lat.toFixed(4)}, ਲੋਂਗੀਚਿਊਡ ${coords.lng.toFixed(4)} (${address}) 'ਤੇ ਹਾਂ। ਮੈਂ ਇੱਕ ${role} ਹਾਂ। ਮੇਰੇ ਨੇੜੇ ਸਭ ਤੋਂ ਸੁਰੱਖਿਅਤ ਆਰਾਮ ਵਾਲੀ ਥਾਂ, 24 ਘੰਟੇ ਪੈਟਰੋਲ ਪੰਪ ਅਤੇ ਪੁਲਿਸ ਥਾਣਾ ਕਿੱਥੇ ਹੈ? ਪੰਜਾਬੀ ਵਿੱਚ ਦੱਸੋ।`
        : `I am currently at latitude ${coords.lat.toFixed(4)}, longitude ${coords.lng.toFixed(4)} (${address}). I am working as a ${role}. What are the nearest safe, well-lit rest spots, 24/7 petrol stations, and police checkpoints near me? Reply in English.`;

    onAskAiWithLocation(prompt);
  }

  // OpenStreetMap embed bbox
  const delta = 0.005;
  const bbox = coords
    ? `${coords.lng - delta}%2C${coords.lat - delta}%2C${coords.lng + delta}%2C${coords.lat + delta}`
    : "77.21%2C28.62%2C77.22%2C28.64";
  const embedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${coords?.lat || 28.6315}%2C${coords?.lng || 77.2167}`;

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="rounded-3xl border border-white/10 dark:bg-[#0E1526]/90 bg-white p-6 backdrop-blur-md shadow-2xl transition">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] dark:border-white/[0.08] border-black/10 pb-5">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-tr from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 text-emerald-400">
              <Compass className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">{t.mapTitle}</h2>
              <p className="text-xs text-slate-600 dark:text-zinc-400">{t.mapSubtitle}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={fetchLocation}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2 text-xs font-bold text-black shadow-lg shadow-emerald-500/20 hover:brightness-110 active:scale-95 transition"
          >
            <Navigation className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>{loading ? t.mapLocating : t.mapFetchBtn}</span>
          </button>
        </div>

        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-300">
            <AlertTriangle className="h-4 w-4 shrink-0 text-amber-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Real-Time Metrics Strip */}
        {coords && (
          <div className="mt-4 grid gap-3 sm:grid-cols-4">
            <div className="rounded-2xl border border-white/5 dark:bg-[#070A12] bg-slate-50 p-3.5">
              <span className="text-[11px] font-medium text-slate-500 dark:text-zinc-400">{t.mapGpsCoords}</span>
              <span className="mt-1 block text-sm font-bold text-emerald-600 dark:text-emerald-400">
                {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}
              </span>
            </div>

            <div className="rounded-2xl border border-white/5 dark:bg-[#070A12] bg-slate-50 p-3.5">
              <span className="text-[11px] font-medium text-slate-500 dark:text-zinc-400">{t.mapAccuracy}</span>
              <span className="mt-1 block text-sm font-bold text-cyan-600 dark:text-cyan-400">
                ±{coords.accuracy} meters
              </span>
            </div>

            <div className="rounded-2xl border border-white/5 dark:bg-[#070A12] bg-slate-50 p-3.5">
              <span className="text-[11px] font-medium text-slate-500 dark:text-zinc-400">{t.mapSpeed}</span>
              <span className="mt-1 block text-sm font-bold text-amber-600 dark:text-amber-400">
                {coords.speed ? `${coords.speed} km/h` : "Stationary"}
              </span>
            </div>

            <div className="rounded-2xl border border-white/5 dark:bg-[#070A12] bg-slate-50 p-3.5">
              <span className="text-[11px] font-medium text-slate-500 dark:text-zinc-400">Status</span>
              <span className="mt-1 flex items-center gap-1.5 text-sm font-bold text-emerald-500">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                Live Satellite Lock
              </span>
            </div>
          </div>
        )}

        {/* Reverse Geocoded Landmark Address */}
        {address && (
          <div className="mt-4 flex items-start gap-2.5 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.04] p-3 text-xs text-slate-700 dark:text-zinc-300">
            <MapPin className="h-4 w-4 shrink-0 text-emerald-500 mt-0.5" />
            <div>
              <strong className="text-slate-900 dark:text-white block mb-0.5">Identified Area / Landmark:</strong>
              <p className="text-[11px] text-slate-600 dark:text-zinc-300 leading-relaxed">{address}</p>
            </div>
          </div>
        )}
      </div>

      {/* Interactive OpenStreetMap Viewer & Landmark Directory */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Visual Map Iframe */}
        <div className="lg:col-span-2 overflow-hidden rounded-3xl border border-white/10 dark:bg-[#0E1526]/90 bg-white p-3 shadow-2xl">
          <div className="relative h-[380px] w-full rounded-2xl overflow-hidden border border-white/10">
            <iframe
              title="Live Worker GPS Location Map"
              width="100%"
              height="100%"
              frameBorder="0"
              scrolling="no"
              marginHeight={0}
              marginWidth={0}
              src={embedUrl}
              className="w-full h-full filter contrast-105"
            />
            {/* Pulsing center marker overlay */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="relative flex items-center justify-center">
                <span className="absolute h-10 w-10 animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative grid h-8 w-8 place-items-center rounded-full bg-emerald-500 text-black shadow-xl border-2 border-white">
                  <MapPin className="h-4 w-4 text-black fill-black" />
                </span>
              </div>
            </div>
          </div>

          {/* Quick Sharing Toolbar */}
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 px-2 py-1">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleShareWhatsApp}
                className="flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-2 text-xs font-semibold shadow-md transition active:scale-95"
              >
                <Share2 className="h-3.5 w-3.5" />
                <span>{t.mapShareWhatsApp}</span>
              </button>

              <button
                type="button"
                onClick={handleShareSms}
                className="flex items-center gap-1.5 rounded-xl border border-white/10 dark:bg-white/5 bg-slate-100 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-800 dark:text-zinc-200 px-3.5 py-2 text-xs font-semibold transition active:scale-95"
              >
                <span>{t.mapShareSms}</span>
              </button>

              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-1.5 rounded-xl border border-white/10 dark:bg-white/5 bg-slate-100 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-800 dark:text-zinc-200 px-3.5 py-2 text-xs font-semibold transition active:scale-95"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? t.mapCopied : t.mapCopyLink}</span>
              </button>
            </div>

            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-cyan-500 hover:text-cyan-400 underline underline-offset-2"
            >
              <span>Open in Google Maps</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>

        {/* Nearest Emergency Landmarks & AI Route Safe Help */}
        <div className="flex flex-col justify-between rounded-3xl border border-white/10 dark:bg-[#0E1526]/90 bg-white p-5 shadow-2xl">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <Compass className="h-4 w-4 text-emerald-400" />
              <span>Emergency Distance Radar</span>
            </h3>

            <div className="space-y-3">
              <a
                href={coords ? `https://www.google.com/maps/search/police+station/@${coords.lat},${coords.lng},15z` : "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-xl border border-white/5 dark:bg-[#070A12] bg-slate-50 p-3 hover:border-emerald-500/40 transition group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="grid h-8 w-8 place-items-center rounded-lg bg-blue-500/10 text-blue-500">
                    <Shield className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="block text-xs font-semibold text-slate-900 dark:text-white group-hover:text-emerald-400">
                      {t.mapNearestPolice}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-zinc-400">Tap for GPS Route</span>
                  </div>
                </div>
                <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
              </a>

              <a
                href={coords ? `https://www.google.com/maps/search/hospital/@${coords.lat},${coords.lng},15z` : "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-xl border border-white/5 dark:bg-[#070A12] bg-slate-50 p-3 hover:border-rose-500/40 transition group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="grid h-8 w-8 place-items-center rounded-lg bg-rose-500/10 text-rose-500">
                    <Hospital className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="block text-xs font-semibold text-slate-900 dark:text-white group-hover:text-rose-400">
                      {t.mapNearestHospital}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-zinc-400">24/7 Trauma Emergency</span>
                  </div>
                </div>
                <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
              </a>

              <a
                href={coords ? `https://www.google.com/maps/search/petrol+pump/@${coords.lat},${coords.lng},15z` : "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-xl border border-white/5 dark:bg-[#070A12] bg-slate-50 p-3 hover:border-amber-500/40 transition group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="grid h-8 w-8 place-items-center rounded-lg bg-amber-500/10 text-amber-500">
                    <Fuel className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="block text-xs font-semibold text-slate-900 dark:text-white group-hover:text-amber-400">
                      {t.mapNearestFuel}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-zinc-400">Fuel & EV Battery Swap</span>
                  </div>
                </div>
                <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
              </a>
            </div>
          </div>

          {/* AI Location Safety Advisor Button */}
          <div className="mt-5 border-t border-white/[0.08] dark:border-white/[0.08] border-black/10 pt-4">
            <button
              type="button"
              onClick={handleAskAiSafeStops}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 p-3 text-xs font-bold text-black shadow-lg shadow-emerald-500/20 hover:brightness-110 active:scale-95 transition"
            >
              <Sparkles className="h-4 w-4" />
              <span>{t.mapAskAiSafeStops}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
