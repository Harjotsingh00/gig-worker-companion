"use client";

import { useState, useRef, useEffect } from "react";
import type { ChatLanguage, WorkerRole } from "@/lib/prompts";
import { UI_TRANSLATIONS } from "@/lib/translations";
import { quotaGuard } from "@/lib/gemini-cache";
import {
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  Clock,
} from "lucide-react";

export interface Message {
  role: "user" | "assistant";
  content: string;
  language?: ChatLanguage;
  timestamp?: string;
  fromCache?: boolean;
}

interface ChatViewProps {
  role: WorkerRole;
  language: ChatLanguage;
  apiKey: string;
  externalAutoPrompt?: string | null;
  onSendToAppeal?: (text: string) => void;
}

export default function ChatView({
  role,
  language,
  apiKey,
  externalAutoPrompt,
  onSendToAppeal,
}: ChatViewProps) {
  const t = UI_TRANSLATIONS[language];

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [currentlySpeakingIndex, setCurrentlySpeakingIndex] = useState<number | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [quotaCount, setQuotaCount] = useState<number>(0);
  const [autoPromptActive, setAutoPromptActive] = useState<boolean>(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync external auto-prompt from buttons in other tabs
  useEffect(() => {
    if (externalAutoPrompt) {
      setInput(externalAutoPrompt);
      setAutoPromptActive(true);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [externalAutoPrompt]);

  // Suggested prompt chips localized
  const promptSuggestions: Record<WorkerRole, Record<ChatLanguage, { label: string; text: string }[]>> = {
    "Delivery Partner": {
      English: [
        { label: "Customer unreachable / Timer ended", text: "I am at the customer delivery location, but the customer is not answering the phone and the 10-minute app timer has expired. What are my exact safe steps to prevent penalty or strike?" },
        { label: "Cash collected vs UPI mismatch", text: "The customer paid the bill via direct UPI link, but the delivery partner app still shows cash collection pending in my floating wallet. How do I fix this discrepancy?" },
        { label: "Rain & Waterlogging Surge", text: "Heavy rain has caused road waterlogging on my route. How can I request rain surge compensation and extra delivery time without getting penalized for delays?" },
        { label: "False 1-star restaurant rating", text: "Customer gave me a 1-star rating because the food was cold, but the merchant made me wait 35 minutes for food preparation. How do I dispute this rating?" },
      ],
      Hindi: [
        { label: "ग्राहक फोन नहीं उठा रहा / टाइमर समाप्त", text: "मैं कस्टमर की लोकेशन पर हूँ, लेकिन ग्राहक फोन नहीं उठा रहा और 10 मिनट का टाइमर खत्म हो गया है। पेनाल्टी से बचने के लिए मुझे क्या सुरक्षित कदम उठाने चाहिए?" },
        { label: "कैश और यूपीआई भुगतान में विसंगति", text: "ग्राहक ने मर्चेंट क्यूआर कोड पर ऑनलाइन भुगतान कर दिया, लेकिन मेरे ऐप में अभी भी कैश कलेक्शन पेंडिंग दिखा रहा है। इसे कैसे ठीक करूं?" },
        { label: "बारिश एवं जलभराव सर्ज भत्ता", text: "भारी बारिश के कारण रास्ते में पानी भरा है। बिना लेट डिलीवरी पेनल्टी के रेन सर्ज पे और अतिरिक्त समय का अनुरोध कैसे करें?" },
        { label: "होटल की देरी पर 1-स्टार रेटिंग विवाद", text: "रेस्टोरेंट ने खाना तैयार करने में 35 मिनट लगाए और ग्राहक ने खाना ठंडा होने पर मुझे 1-स्टार दे दिया। इस गलत रेटिंग को कैसे हटवाएं?" },
      ],
      Punjabi: [
        { label: "ਗਾਹਕ ਫੋਨ ਨਹੀਂ ਚੁੱਕ ਰਿਹਾ / ਸਮਾਂ ਖਤਮ", text: "ਮੈਂ ਕਸਟਮਰ ਦੀ ਲੋਕੇਸ਼ਨ 'ਤੇ ਹਾਂ ਪਰ ਗਾਹਕ ਫੋਨ ਨਹੀਂ ਚੁੱਕ ਰਿਹਾ ਅਤੇ 10 ਮਿੰਟ ਦਾ ਟਾਈਮਰ ਖਤਮ ਹੋ ਗਿਆ ਹੈ। ਜੁਰਮਾਨੇ ਤੋਂ ਬਚਣ ਲਈ ਸੁਰੱਖਿਅਤ ਤਰੀਕਾ ਕੀ ਹੈ?" },
        { label: "ਨਕਦ ਅਤੇ ਆਨਲਾਈਨ ਭੁਗਤਾਨ ਮਸਲਾ", text: "ਗਾਹਕ ਨੇ ਆਨਲਾਈਨ ਭੁਗਤਾਨ ਕੀਤਾ ਪਰ ਮੇਰੀ ਐਪ ਵਿੱਚ ਕੈਸ਼ ਕਲੈਕਸ਼ਨ ਬਾਕੀ ਦਿਖਾ ਰਿਹਾ ਹੈ। ਇਸ ਹਿਸਾਬ ਨੂੰ ਕਿਵੇਂ ਦਰੁਸਤ ਕਰੀਏ?" },
        { label: "ਮੀਂਹ ਅਤੇ ਪਾਣੀ ਭਰਨ ਦਾ ਸਰਜ ਭੱਤਾ", text: "ਭਾਰੀ ਮੀਂਹ ਕਾਰਨ ਰਸਤੇ ਵਿੱਚ ਪਾਣੀ ਭਰਿਆ ਹੈ। ਲੇਟ ਪੈਨਲਟੀ ਤੋਂ ਬਿਨਾਂ ਮੀਂਹ ਦਾ ਸਰਜ ਭੱਤਾ ਕਿਵੇਂ ਮੰਗੀਏ?" },
        { label: "ਹੋਟਲ ਦੀ ਦੇਰੀ 'ਤੇ 1-ਸਟਾਰ ਰੇਟਿੰਗ ਝਗੜਾ", text: "ਰੈਸਟੋਰੈਂਟ ਨੇ ਖਾਣਾ ਬਣਾਉਣ ਵਿੱਚ ਦੇਰੀ ਕੀਤੀ ਪਰ ਗਾਹਕ ਨੇ ਮੈਨੂੰ 1-ਸਟਾਰ ਰੇਟਿੰਗ ਦਿੱਤੀ। ਇਸ ਰੇਟਿੰਗ ਨੂੰ ਕਿਵੇਂ ਹਟਾਈਏ?" },
      ],
    },
    Driver: {
      English: [
        { label: "Toll plaza charge missing", text: "I paid a state highway toll of ₹85 from my pocket during the trip, but the platform app did not include the toll reimbursement in the final fare. How do I claim it?" },
        { label: "Passenger interior damage / spill", text: "A passenger spilled liquids inside my cab and damaged the seat. What is the standard procedure and evidence required to claim a sanitation and cleaning reimbursement fee?" },
        { label: "Rider requested off-app ride", text: "A passenger asked me to cancel the trip on the app and offered to pay cash directly. What are the legal, insurance, and deactivation risks of doing this?" },
        { label: "Traffic challan dispute", text: "I was issued an e-challan while waiting for a passenger in a pickup zone. How can I appeal or verify if the passenger's app pickup pin caused this violation?" },
      ],
      Hindi: [
        { label: "टोल टैक्स किराया में नहीं जुड़ा", text: "मैंने ट्रिप के दौरान अपनी जेब से ₹85 का टोल चुकाया, लेकिन ऐप ने अंतिम किराए में टोल प्रतिपूर्ति नहीं जोड़ी। इसे वापस कैसे क्लेम करूं?" },
        { label: "सवारी द्वारा सीट गंदी / नुकसान", text: "सवारी ने कैब में उल्टी या खाना गिराकर सीट खराब कर दी। क्लीनिंग और सफाई चार्ज क्लेम करने की सही प्रक्रिया क्या है?" },
        { label: "सवारी द्वारा ऐप बंद कर कैश की मांग", text: "सवारी ने ऐप ट्रिप कैंसिल करके नकद पैसे देने को कहा। ऐसा करने में दुर्घटना बीमा और आईडी ब्लॉक के क्या कानूनी खतरे हैं?" },
        { label: "पिकअप जोन में ट्रैफिक चालान", text: "सवारी का इंतजार करते समय ट्रैफिक पुलिस ने नो-पार्किंग चालान बना दिया। क्या इस चालान की भरपाई प्लेटफॉर्म करता है?" },
      ],
      Punjabi: [
        { label: "ਟੋਲ ਟੈਕਸ ਕਿਰਾਏ ਵਿੱਚ ਨਹੀਂ ਜੁੜਿਆ", text: "ਮੈਂ ਸਫ਼ਰ ਦੌਰਾਨ ਆਪਣੀ ਜੇਬ ਵਿੱਚੋਂ ₹85 ਟੋਲ ਦਿੱਤਾ ਪਰ ਐਪ ਵਿੱਚ ਇਹ ਰਕਮ ਨਹੀਂ ਆਈ। ਇਸਨੂੰ ਕਿਵੇਂ ਕਲੇਮ ਕਰੀਏ?" },
        { label: "ਸਵਾਰੀ ਵੱਲੋਂ ਸੀਟ ਖਰਾਬ / ਨੁਕਸਾਨ", text: "ਸਵਾਰੀ ਨੇ ਗੱਡੀ ਵਿੱਚ ਗੰਦਗੀ ਪਾ ਦਿੱਤੀ। ਸਫ਼ਾਈ ਖਰਚਾ ਕਲੇਮ ਕਰਨ ਦਾ ਨਿਯਮ ਕੀ ਹੈ?" },
        { label: "ਸਵਾਰੀ ਵੱਲੋਂ ਐਪ ਬੰਦ ਕਰਕੇ ਨਕਦ ਰਾਈਡ", text: "ਸਵਾਰੀ ਨੇ ਰਾਈਡ ਕੈਂਸਲ ਕਰਕੇ ਨਕਦ ਪੈਸੇ ਦੇਣ ਦੀ ਪੇਸ਼ਕਸ਼ ਕੀਤੀ। ਇਸਦੇ ਕੀ ਖਤਰੇ ਹਨ?" },
        { label: "ਪਿਕਅੱਪ ਦੌਰਾਨ ਟ੍ਰੈਫਿਕ ਚਲਾਨ", text: "ਸਵਾਰੀ ਨੂੰ ਪਿਕ ਕਰਦੇ ਸਮੇਂ ਚਲਾਨ ਕੱਟਿਆ ਗਿਆ। ਇਸਦੀ ਅਪੀਲ ਕਿਵੇਂ ਕਰੀਏ?" },
      ],
    },
    "Daily-wage": {
      English: [
        { label: "Contractor withheld wage", text: "The site contractor has not paid my daily wages for the past 5 days and is giving false excuses. What legal rights and labor helpline can I contact in India?" },
        { label: "Workplace accident claim", text: "I suffered an injury while working on a construction site. How can I claim immediate medical reimbursement under the Workmen's Compensation Act or e-Shram?" },
        { label: "e-Shram card registration help", text: "I want to apply for the government e-Shram card on my mobile. What are the exact documents needed and how does the ₹2 Lakh accidental insurance work?" },
        { label: "Minimum wage check", text: "What is the official minimum daily wage for semi-skilled and unskilled labor, and how can I verify if my contractor is underpaying me?" },
      ],
      Hindi: [
        { label: "ठेकेदार ने मजदूरी रोकी", text: "ठेकेदार ने पिछले 5 दिनों की दिहाड़ी नहीं दी है और बहाने बना रहा है। मुझे अपनी मजदूरी पाने के लिए किस श्रम हेल्पलाइन पर शिकायत करनी चाहिए?" },
        { label: "कार्यस्थल पर चोट / दुर्घटना", text: "काम करते समय मुझे चोट लग गई। वर्कमैन कंपेंसेशन एक्ट या ई-श्रम के तहत अस्पताल खर्च और मुआवजा कैसे क्लेम करें?" },
        { label: "ई-श्रम कार्ड मोबाइल से बनाएं", text: "मैं अपने फोन से ई-श्रम कार्ड कैसे बना सकता हूँ? इसमें ₹2 लाख का दुर्घटना बीमा कैसे काम करता है?" },
        { label: "सरकारी न्यूनतम मजदूरी दर", text: "अकुशल और अर्ध-कुशल श्रमिकों के लिए आज की सरकारी न्यूनतम मजदूरी क्या है? ठेकेदार द्वारा कम पैसे देने पर क्या करें?" },
      ],
      Punjabi: [
        { label: "ਠੇਕੇਦਾਰ ਨੇ ਦਿਹਾੜੀ ਰੋਕੀ", text: "ਠੇਕੇਦਾਰ ਨੇ ਪਿਛਲੇ 5 ਦਿਨਾਂ ਦੇ ਪੈਸੇ ਨਹੀਂ ਦਿੱਤੇ। ਲੇਬਰ ਹੈਲਪਲਾਈਨ 'ਤੇ ਸ਼ਿਕਾਇਤ ਕਿਵੇਂ ਕਰੀਏ?" },
        { label: "ਕੰਮ ਦੌਰਾਨ ਸੱਟ ਲੱਗਣ 'ਤੇ ਮੁਆਵਜ਼ਾ", text: "ਸਾਈਟ 'ਤੇ ਕੰਮ ਦੌਰਾਨ ਸੱਟ ਲੱਗ ਗਈ। ਇਲਾਜ ਖਰਚਾ ਅਤੇ ਸਰਕਾਰੀ ਮੁਆਵਜ਼ਾ ਕਿਵੇਂ ਮਿਲੇਗਾ?" },
        { label: "ਈ-ਸ਼੍ਰਮ ਕਾਰਡ ਕਿਵੇਂ ਬਣਾਈਏ", text: "ਮੋਬਾਈਲ ਤੋਂ ਈ-ਸ਼੍ਰਮ ਕਾਰਡ ਕਿਵੇਂ ਬਣੇਗਾ ਅਤੇ ₹2 ਲੱਖ ਬੀਮੇ ਦਾ ਲਾਭ ਕਿਵੇਂ ਮਿਲੇਗਾ?" },
        { label: "ਸਰਕਾਰੀ ਘੱਟੋ-ਘੱਟ ਦਿਹਾੜੀ", text: "ਮੌਜੂਦਾ ਸਰਕਾਰੀ ਘੱਟੋ-ਘੱਟ ਦਿਹਾੜੀ ਕੀ ਹੈ ਅਤੇ ਘੱਟ ਪੈਸੇ ਮਿਲਣ 'ਤੇ ਕੀ ਕਰੀਏ?" },
      ],
    },
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Voice Speech Recognition with dynamic language
  function toggleSpeechRecognition() {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      (window as unknown as { SpeechRecognition?: any }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: any }).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please use Chrome or Edge.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;

      const langMap: Record<ChatLanguage, string> = {
        English: "en-IN",
        Hindi: "hi-IN",
        Punjabi: "pa-IN",
      };
      recognition.lang = langMap[language] || "hi-IN";

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join("");
        setInput(transcript);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }
  }

  // Voice Text-to-Speech Output
  function handleSpeak(text: string, index: number) {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    if (currentlySpeakingIndex === index) {
      window.speechSynthesis.cancel();
      setCurrentlySpeakingIndex(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const langMap: Record<ChatLanguage, string> = {
      English: "en-IN",
      Hindi: "hi-IN",
      Punjabi: "pa-IN",
    };
    utterance.lang = langMap[language] || "hi-IN";
    utterance.rate = 0.95;

    utterance.onend = () => setCurrentlySpeakingIndex(null);
    utterance.onerror = () => setCurrentlySpeakingIndex(null);

    setCurrentlySpeakingIndex(index);
    window.speechSynthesis.speak(utterance);
  }

  function handleCopy(text: string, index: number) {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    }
  }

  async function sendMessage(textToSend?: string) {
    const text = (textToSend || input).trim();
    if (!text || loading) return;

    // Check Client Quota Protection & Cache
    const cachedResponse = quotaGuard.getCached(text, role, language);
    if (cachedResponse) {
      const newMsg: Message = {
        role: "user",
        content: text,
        language,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      const assistantMsg: Message = {
        role: "assistant",
        content: cachedResponse,
        language,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        fromCache: true,
      };
      setMessages((prev) => [...prev, newMsg, assistantMsg]);
      setInput("");
      setAutoPromptActive(false);
      return;
    }

    // Check rate limit pressure
    const quotaCheck = quotaGuard.canMakeRequest();
    if (!quotaCheck.allowed) {
      setError(`${t.cooldownWait} (${quotaCheck.waitSeconds}s remaining) to protect API quota.`);
      return;
    }

    const newMsg: Message = {
      role: "user",
      content: text,
      language,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const updatedHistory = [...messages, newMsg];
    setMessages(updatedHistory);
    setInput("");
    setError("");
    setAutoPromptActive(false);
    setLoading(true);

    try {
      quotaGuard.recordRequest();
      setQuotaCount(quotaGuard.getMinuteUsage());

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (apiKey) {
        headers["x-gemini-key"] = apiKey;
      }

      // Keep recent turns to save tokens and avoid quota pressure
      const boundedMessages = updatedHistory.slice(-4).map((m) => ({ role: m.role, content: m.content }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers,
        body: JSON.stringify({
          messages: boundedMessages,
          role,
          language,
        }),
      });

      const responseText = await response.text();
      let data: { error?: string; text?: string };
      try {
        data = JSON.parse(responseText) as typeof data;
      } catch {
        throw new Error(response.ok
          ? "The server returned an unreadable reply. Refresh the page and try again."
          : `The assistant request failed (HTTP ${response.status}). Please try again.`);
      }
      if (!response.ok) {
        throw new Error(data.error || "Failed to receive AI reply.");
      }

      const replyContent = data.text || "I was unable to formulate a response.";

      // Cache this result to save future API calls
      quotaGuard.setCache(text, role, language, replyContent);

      const assistantMsg: Message = {
        role: "assistant",
        content: replyContent,
        language,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages([...updatedHistory, assistantMsg]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Connection failed. Please retry.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  const rolePrompts = promptSuggestions[role]?.[language] || promptSuggestions[role]?.English;

  return (
    <div className="flex flex-col rounded-3xl border border-black/10 dark:border-white/10 dark:bg-[#0E1526]/90 bg-white backdrop-blur-md shadow-2xl overflow-hidden transition">
      {/* Chat Header Bar */}
      <div className="flex items-center justify-between border-b border-black/10 dark:border-white/[0.08] px-5 py-4 dark:bg-[#070A12]/40 bg-slate-50">
        <div className="flex items-center gap-2.5">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 text-black font-bold text-sm">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">{t.chatTitle}</h2>
            <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-zinc-400">
              <span>{t.roleLabel}: <strong className="text-emerald-600 dark:text-emerald-400">{role}</strong></span>
              <span>·</span>
              <span>{t.languageLabel}: <strong className="text-cyan-600 dark:text-cyan-400">{language}</strong></span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Quota Pressure Guard Indicator */}
          <span className="hidden sm:inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="h-3 w-3" />
            <span>{t.quotaSafeBadge}</span>
          </span>

          {messages.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setMessages([]);
                setError("");
              }}
              className="flex items-center gap-1.5 rounded-lg border border-black/10 dark:border-white/10 dark:bg-white/[0.03] bg-white px-3 py-1.5 text-xs text-slate-700 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-white/10 transition"
            >
              <RotateCcw className="h-3 w-3" />
              <span>{t.chatNewChat}</span>
            </button>
          )}
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex min-h-[380px] max-h-[550px] flex-1 flex-col gap-4 overflow-y-auto p-4 sm:p-6">
        {messages.length === 0 ? (
          <div className="m-auto max-w-lg py-8 text-center">
            <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-500 shadow-inner">
              <Sparkles className="h-7 w-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t.chatEmptyTitle}</h3>
            <p className="mt-1 text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
              {t.chatEmptyDesc}
            </p>

            {/* Localized Role-Specific Prompt Chips */}
            <div className="mt-6 flex flex-col gap-2 text-left">
              <span className="text-[11px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                <HelpCircle className="h-3.5 w-3.5 text-emerald-500" />
                {language === "Hindi"
                  ? "अक्सर पूछे जाने वाले सवाल (क्लिक करें):"
                  : language === "Punjabi"
                  ? "ਅਕਸਰ ਪੁੱਛੇ ਜਾਂਦੇ ਸਵਾਲ (ਕਲਿੱਕ ਕਰੋ):"
                  : `Common Scenarios for ${role}:`}
              </span>
              <div className="grid gap-2 sm:grid-cols-2">
                {rolePrompts?.map((prompt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => sendMessage(prompt.text)}
                    className="group rounded-xl border border-black/10 dark:border-white/[0.08] dark:bg-[#070A12]/60 bg-slate-50 p-3 text-left transition hover:border-emerald-500/40 hover:bg-emerald-500/[0.04]"
                  >
                    <span className="block text-xs font-semibold text-emerald-600 dark:text-emerald-400 group-hover:underline">
                      {prompt.label}
                    </span>
                    <span className="mt-0.5 line-clamp-2 text-[11px] text-slate-500 dark:text-zinc-400">
                      {prompt.text}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          messages.map((message, index) => {
            const isUser = message.role === "user";
            return (
              <div
                key={index}
                className={`flex items-start gap-3 ${isUser ? "justify-end" : "justify-start"}`}
              >
                {!isUser && (
                  <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 text-xs font-bold text-black shadow-md">
                    स
                  </div>
                )}

                <div
                  className={`group relative max-w-[85%] sm:max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-lg ${
                    isUser
                      ? "rounded-tr-xs bg-gradient-to-r from-emerald-500 to-teal-600 text-black font-semibold"
                      : "rounded-tl-xs border border-black/10 dark:border-white/[0.08] dark:bg-[#070A12] bg-slate-100 text-slate-900 dark:text-zinc-200"
                  }`}
                >
                  <div className="whitespace-pre-wrap">{message.content}</div>

                  <div className="mt-2 flex items-center justify-between gap-3 border-t border-black/10 pt-1.5 text-[10px]">
                    <div className="flex items-center gap-1.5">
                      <span className={isUser ? "text-emerald-950/70" : "text-slate-500 dark:text-zinc-500"}>
                        {message.timestamp}
                      </span>
                      {message.fromCache && (
                        <span className="rounded bg-emerald-500/10 px-1 text-[9px] font-bold text-emerald-600 dark:text-emerald-400">
                          Cached (0 Quota)
                        </span>
                      )}
                    </div>

                    {!isUser && (
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleSpeak(message.content, index)}
                          className={`rounded-md p-1 transition ${
                            currentlySpeakingIndex === index
                              ? "bg-emerald-500/20 text-emerald-500"
                              : "text-slate-500 dark:text-zinc-400 hover:text-emerald-500"
                          }`}
                          title="Listen with voice speech"
                          aria-label="Listen with voice speech"
                        >
                          {currentlySpeakingIndex === index ? (
                            <VolumeX className="h-3.5 w-3.5 text-emerald-500 animate-pulse" />
                          ) : (
                            <Volume2 className="h-3.5 w-3.5" />
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleCopy(message.content, index)}
                          className="rounded-md p-1 text-slate-500 dark:text-zinc-400 hover:text-emerald-500 transition"
                          title="Copy reply"
                          aria-label="Copy reply"
                        >
                          {copiedIndex === index ? (
                            <Check className="h-3.5 w-3.5 text-emerald-500" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}

        {loading && (
          <div className="flex items-center gap-2.5 text-xs text-slate-500 dark:text-zinc-400">
            <div className="grid h-7 w-7 place-items-center rounded-lg bg-emerald-500/20 text-emerald-500">
              <Sparkles className="h-3.5 w-3.5 animate-spin" />
            </div>
            <span className="animate-pulse">{t.chatThinking}</span>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-500 dark:text-rose-300">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
            <span className="flex-1">{error}</span>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Auto-Prompt Notification Banner */}
      {autoPromptActive && (
        <div className="flex items-center justify-between border-t border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-xs font-semibold text-emerald-700 dark:text-emerald-300 animate-in fade-in">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-emerald-500" />
            <span>{t.chatAutoPromptBanner}</span>
          </div>
          <button
            type="button"
            onClick={() => sendMessage()}
            className="rounded-lg bg-emerald-500 px-3 py-1 text-[11px] font-bold text-black hover:bg-emerald-400 transition"
          >
            {t.chatSendButton}
          </button>
        </div>
      )}

      {/* Voice Listening Active Visualizer */}
      {isListening && (
        <div className="flex items-center justify-between border-t border-rose-500/30 bg-rose-500/10 px-4 py-2.5 text-xs text-rose-600 dark:text-rose-300 animate-pulse">
          <div className="flex items-center gap-2">
            <Mic className="h-4 w-4 text-rose-500 animate-bounce" />
            <span className="font-bold">{t.chatListening}</span>
            <span className="text-[11px] opacity-80">({t.chatListeningHint})</span>
          </div>
          <button
            type="button"
            onClick={toggleSpeechRecognition}
            className="text-[11px] underline font-bold"
          >
            Stop
          </button>
        </div>
      )}

      {/* Input Composer Bar */}
      <div className="border-t border-black/10 dark:border-white/[0.08] dark:bg-[#070A12]/80 bg-slate-50 p-3 sm:p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
          className="relative flex items-center rounded-2xl border border-black/10 dark:border-white/10 dark:bg-[#0E1526] bg-white p-1.5 transition focus-within:border-emerald-500/60 focus-within:ring-1 focus-within:ring-emerald-500/40"
        >
          {/* Multi-language Microphone Button */}
          <button
            type="button"
            onClick={toggleSpeechRecognition}
            className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl transition ${
              isListening
                ? "bg-rose-500 text-white animate-pulse"
                : "text-slate-500 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-emerald-500"
            }`}
            title={isListening ? "Listening... click to stop" : "Speak in English, Hindi, or Punjabi"}
            aria-label="Voice input"
          >
            {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </button>

          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              if (autoPromptActive) setAutoPromptActive(false);
            }}
            placeholder={isListening ? t.chatListening : t.chatInputPlaceholder}
            className="flex-1 bg-transparent px-3 py-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 outline-none"
            disabled={loading}
          />

          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 font-bold text-black transition hover:brightness-110 disabled:opacity-30 disabled:cursor-not-allowed active:scale-95 shadow-md shadow-emerald-500/20"
            aria-label="Send message"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>

        <div className="mt-2 flex items-center justify-between px-1 text-[11px] text-slate-500 dark:text-zinc-500">
          <span>{t.chatVoiceTip}</span>
          <span>Google Gemini Generative AI</span>
        </div>
      </div>
    </div>
  );
}
