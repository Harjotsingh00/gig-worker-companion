import type { ChatLanguage } from "./prompts";

export interface Translations {
  // Brand & Nav
  appName: string;
  appSubtitle: string;
  geminiBadge: string;
  roleLabel: string;
  languageLabel: string;
  themeToggleLight: string;
  themeToggleDark: string;
  apiKeyButton: string;
  sosButton: string;

  // Tabs
  tabChat: string;
  tabAppeals: string;
  tabFuel: string;
  tabDocuments: string;
  tabMap: string;
  tabGuardian: string;
  tabSchemes: string;
  tabRadar: string;

  // Hero Banner
  heroTagline: string;
  heroBadge: string;
  supportedPlatformsCount: string;
  govtInsuranceRange: string;

  // Chat View
  chatTitle: string;
  chatEmptyTitle: string;
  chatEmptyDesc: string;
  chatInputPlaceholder: string;
  chatListening: string;
  chatListeningHint: string;
  chatThinking: string;
  chatNewChat: string;
  chatVoiceTip: string;
  chatAutoPromptBanner: string;
  chatSendButton: string;

  // Appeal Shield
  appealTitle: string;
  appealSubtitle: string;
  appealSelectPlatform: string;
  appealSelectIssue: string;
  appealWorkerName: string;
  appealPartnerId: string;
  appealOrderId: string;
  appealAmount: string;
  appealDate: string;
  appealDetails: string;
  appealGenerateBtn: string;
  appealGeneratingBtn: string;
  appealCopyBtn: string;
  appealCopiedBtn: string;
  appealEmailBtn: string;

  // Fuel & Wage
  fuelTitle: string;
  fuelSubtitle: string;
  fuelGrossLabel: string;
  fuelDistanceLabel: string;
  fuelPriceLabel: string;
  fuelMileageLabel: string;
  fuelHoursLabel: string;
  fuelOtherLabel: string;
  fuelCalculateBtn: string;
  fuelNetCard: string;
  fuelHourlyCard: string;
  fuelCostCard: string;
  fuelProfitKmCard: string;
  fuelAskGeminiBtn: string;

  // Document Auditor
  docTitle: string;
  docSubtitle: string;
  docDropText: string;
  docBrowseBtn: string;
  docAnalyzeBtn: string;
  docSampleSwiggy: string;
  docSampleUber: string;
  docTransferAppealBtn: string;

  // Live Location Map
  mapTitle: string;
  mapSubtitle: string;
  mapGpsCoords: string;
  mapAccuracy: string;
  mapSpeed: string;
  mapFetchBtn: string;
  mapLocating: string;
  mapShareWhatsApp: string;
  mapShareSms: string;
  mapCopyLink: string;
  mapCopied: string;
  mapNearestPolice: string;
  mapNearestHospital: string;
  mapNearestFuel: string;
  mapAskAiSafeStops: string;

  // Guardian SOS
  sosTitle: string;
  sosSubtitle: string;
  sosSirenStart: string;
  sosSirenStop: string;
  sosBroadcastBtn: string;
  sosBroadcastCopied: string;
  sosHotlinesTitle: string;
  sosClaimTitle: string;

  // Scheme Navigator
  schemesTitle: string;
  schemesSubtitle: string;
  schemesCheckBtn: string;
  schemesPortalBtn: string;

  // Hotspot Radar
  radarTitle: string;
  radarSubtitle: string;
  radarAskBtn: string;

  // Common & Footer
  footerDisclaimer: string;
  footerRights: string;
  quotaSafeBadge: string;
  cooldownWait: string;
}

export const UI_TRANSLATIONS: Record<ChatLanguage, Translations> = {
  English: {
    appName: "Saarthi",
    appSubtitle: "Daily companion for delivery partners, drivers & workers",
    geminiBadge: "Gemini Intelligence",
    roleLabel: "Your Work",
    languageLabel: "Language",
    themeToggleLight: "Daylight Mode",
    themeToggleDark: "Night Shift Mode",
    apiKeyButton: "API Key",
    sosButton: "SOS",

    tabChat: "Assistant",
    tabAppeals: "Disputes & ID Help",
    tabFuel: "Earnings & Fuel",
    tabMap: "Live Location",
    tabDocuments: "Pay-Slip Audit",
    tabGuardian: "Emergency SOS",
    tabSchemes: "Govt Schemes",
    tabRadar: "Shift & Hotspots",

    heroTagline: "Practical answers, polite grievance letters, real net earnings calculation, live GPS sharing, and government welfare schemes in plain language.",
    heroBadge: "Everyday Support for Your Shift",
    supportedPlatformsCount: "9 Platforms Supported",
    govtInsuranceRange: "₹2L - ₹5L Accident Cover",

    chatTitle: "Saarthi Assistant",
    chatEmptyTitle: "How can we help your workday right now?",
    chatEmptyDesc: "Type or use the mic to speak in English, Hindi, or Punjabi. Get quick, practical answers on customer issues, wrong fines, routes, or schemes.",
    chatInputPlaceholder: "Type your question or click the mic to speak…",
    chatListening: "Listening… Speak naturally",
    chatListeningHint: "Supports English, Hindi, or Punjabi",
    chatThinking: "Finding the best practical advice for you…",
    chatNewChat: "New Chat",
    chatVoiceTip: "Speak via microphone or listen to the answer",
    chatAutoPromptBanner: "Auto-Prompt Ready. Click Send or make any changes you like.",
    chatSendButton: "Send",

    appealTitle: "Dispute & Account Grievance Help",
    appealSubtitle: "Prepare a clear, polite grievance letter for wrongful account blocks, false customer claims, or unjustified penalties.",
    appealSelectPlatform: "Select Platform (Zomato, Swiggy, Uber, etc.)",
    appealSelectIssue: "What happened?",
    appealWorkerName: "Your Full Name",
    appealPartnerId: "Partner / Driver ID",
    appealOrderId: "Order / Trip ID",
    appealAmount: "Amount Deducted (₹)",
    appealDate: "Incident Date",
    appealDetails: "Brief details of what occurred",
    appealGenerateBtn: "Draft Polite Grievance Letter",
    appealGeneratingBtn: "Drafting Letter…",
    appealCopyBtn: "Copy Letter",
    appealCopiedBtn: "Copied!",
    appealEmailBtn: "Open in Gmail / Email",

    fuelTitle: "Real Net Earnings & Fuel Calculator",
    fuelSubtitle: "Find out what you truly took home after petrol, vehicle wear, and return-trip kilometers.",
    fuelGrossLabel: "Gross Earnings Shown on App (₹)",
    fuelDistanceLabel: "Total Kilometers Driven",
    fuelPriceLabel: "Petrol / Fuel Price (₹/Liter)",
    fuelMileageLabel: "Vehicle Mileage (km/L)",
    fuelHoursLabel: "Total Shift Duration (Hours)",
    fuelOtherLabel: "Other Expenses (Toll, Tea, Phone Recharge ₹)",
    fuelCalculateBtn: "Calculate True Net Profit",
    fuelNetCard: "True Take-Home Net Pay",
    fuelHourlyCard: "Real Net Hourly Wage",
    fuelCostCard: "Fuel Cost Incurred",
    fuelProfitKmCard: "Profit per Kilometer",
    fuelAskGeminiBtn: "Ask for Shift & Fuel Optimization Tips",

    docTitle: "Pay-Slip & Payout Check",
    docSubtitle: "Check your weekly payout statement or screenshot for hidden penalties and missing toll/rain incentives.",
    docDropText: "Upload payout statement (PDF, PNG, JPG)",
    docBrowseBtn: "Choose File",
    docAnalyzeBtn: "Check Statement",
    docSampleSwiggy: "Try Sample Swiggy Slip",
    docSampleUber: "Try Sample Uber Summary",
    docTransferAppealBtn: "Send Facts to Dispute Letter",

    mapTitle: "Live Location & Landmark Radar",
    mapSubtitle: "Check your live GPS coordinates, find nearby 24/7 petrol pumps, hospitals, or police posts, and share your location.",
    mapGpsCoords: "GPS Location",
    mapAccuracy: "Accuracy",
    mapSpeed: "Speed",
    mapFetchBtn: "Refresh Location",
    mapLocating: "Finding your location…",
    mapShareWhatsApp: "Share on WhatsApp",
    mapShareSms: "Share via SMS",
    mapCopyLink: "Copy Maps Link",
    mapCopied: "Link Copied!",
    mapNearestPolice: "Nearest Police Station",
    mapNearestHospital: "Nearest Government / Trauma Hospital",
    mapNearestFuel: "Nearest 24/7 Petrol / EV Station",
    mapAskAiSafeStops: "Find Safe Rest Stops & Well-Lit Roads",

    sosTitle: "Emergency SOS & Roadside Safety",
    sosSubtitle: "Quick emergency alarm, one-tap GPS message broadcast to family/friends, and accident insurance steps.",
    sosSirenStart: "Sound Safety Siren",
    sosSirenStop: "Stop Siren",
    sosBroadcastBtn: "1-Tap Emergency Message",
    sosBroadcastCopied: "Emergency Message Ready!",
    sosHotlinesTitle: "Direct Emergency Helplines",
    sosClaimTitle: "Step-by-Step Accident Claim Guide",

    schemesTitle: "Government Social Security & Insurance",
    schemesSubtitle: "Central and state schemes (e-Shram, PMSBY, state boards) offering ₹2 Lakh to ₹5 Lakh insurance and pension.",
    schemesCheckBtn: "Check My Eligibility",
    schemesPortalBtn: "Official Portal",

    radarTitle: "Shift & Hotspot Guide",
    radarSubtitle: "Best times for order surges, heatwave and rain safety tips, and simple ways to cut idle petrol burn.",
    radarAskBtn: "Get Today's Shift Strategy",

    footerDisclaimer: "Saarthi is a practical, non-profit digital companion created for the hardworking people who keep India moving.",
    footerRights: "Private & Safe · No personal chat history stored on servers",
    quotaSafeBadge: "Quota Protected: Low Pressure",
    cooldownWait: "Please wait 3 seconds before next question",
  },

  Hindi: {
    appName: "सारथी (Saarthi)",
    appSubtitle: "डिलीवरी पार्टनर्स और ड्राइवरों का सच्चा मददगार साथी",
    geminiBadge: "जेमिनी पावर्ड",
    roleLabel: "आपका काम",
    languageLabel: "भाषा",
    themeToggleLight: "दिन (डे-लाइट) मोड",
    themeToggleDark: "रात (नाइट) मोड",
    apiKeyButton: "एपीआई की",
    sosButton: "एसओएस (आपातकाल)",

    tabChat: "सहायक",
    tabAppeals: "आईडी व पेनाल्टी समाधान",
    tabFuel: "कमाई व पेट्रोल हिसाब",
    tabMap: "लाइव लोकेशन",
    tabDocuments: "पे-स्लिप जांच",
    tabGuardian: "आपातकालीन सहायता (SOS)",
    tabSchemes: "सरकारी योजनाएं",
    tabRadar: "शिफ्ट व हॉटस्पॉट",

    heroTagline: "कस्टमर विवाद, गलत पेनाल्टी हटाने के लिए पत्र, पेट्रोल खर्च के बाद शुद्ध बचत का हिसाब, लाइव लोकेशन और सरकारी बीमा योजनाएं — सब कुछ सरल भाषा में।",
    heroBadge: "आपकी हर शिफ्ट में मददगार",
    supportedPlatformsCount: "9 प्रमुख प्लेटफॉर्म समर्थित",
    govtInsuranceRange: "₹2 लाख - ₹5 लाख सरकारी बीमा",

    chatTitle: "सारथी साथी",
    chatEmptyTitle: "नमस्ते साथी! आज आपके काम में हम कैसे मदद कर सकते हैं?",
    chatEmptyDesc: "बोलकर या लिखकर कोई भी सवाल पूछें। कस्टमर विवाद, गलत पेनाल्टी, रास्ता या सरकारी योजनाओं पर तुरंत व्यावहारिक सलाह पाएं।",
    chatInputPlaceholder: "सवाल लिखें या माइक दबाकर हिन्दी, पंजाबी या अंग्रेजी में बोलें…",
    chatListening: "सुन रहा हूँ... बोलिए",
    chatListeningHint: "हिन्दी, पंजाबी या अंग्रेजी में बोलना समर्थित है",
    chatThinking: "आपके लिए सही और व्यावहारिक सलाह तैयार कर रहे हैं…",
    chatNewChat: "नई बातचीत",
    chatVoiceTip: "माइक से बोलें या जवाब सुनें",
    chatAutoPromptBanner: "तैयार सवाल दर्ज हो गया है। भेजने के लिए तीर दबाएं या बदलाव करें।",
    chatSendButton: "भेजें",

    appealTitle: "आईडी सस्पेंशन व पेनाल्टी समाधान",
    appealSubtitle: "गलत आईडी ब्लॉक, झूठी ग्राहक शिकायतों और अनुचित पेनाल्टी के खिलाफ विनम्र व कानूनी रूप से मजबूत अपील पत्र तैयार करें।",
    appealSelectPlatform: "अपना प्लेटफॉर्म चुनें (Zomato, Swiggy, Uber आदि)",
    appealSelectIssue: "क्या समस्या हुई?",
    appealWorkerName: "आपका पूरा नाम",
    appealPartnerId: "पार्टनर / ड्राइवर आईडी",
    appealOrderId: "ऑर्डर / ट्रिप आईडी",
    appealAmount: "काटी गई राशि (₹)",
    appealDate: "घटना की तारीख",
    appealDetails: "क्या हुआ था? (संक्षेप में लिखें)",
    appealGenerateBtn: "अपील पत्र तैयार करें",
    appealGeneratingBtn: "पत्र तैयार हो रहा है…",
    appealCopyBtn: "पत्र कॉपी करें",
    appealCopiedBtn: "कॉपी हो गया!",
    appealEmailBtn: "ईमेल में खोलें",

    fuelTitle: "वास्तविक शुद्ध कमाई व पेट्रोल हिसाब",
    fuelSubtitle: "पेट्रोल, गाड़ी की सर्विस और खाली किलोमीटर चलने के बाद असल में आपकी जेब में क्या बचा, इसका सच्चा हिसाब।",
    fuelGrossLabel: "ऐप पर दिखी कुल कमाई (₹)",
    fuelDistanceLabel: "कुल चले किलोमीटर (km)",
    fuelPriceLabel: "वर्तमान पेट्रोल/डीजल भाव (₹/लीटर)",
    fuelMileageLabel: "गाड़ी का माइलेज (km/L)",
    fuelHoursLabel: "शिफ्ट का समय (घंटे)",
    fuelOtherLabel: "अन्य खर्चे (टोल, चाय-पानी, फोन रिचार्ज ₹)",
    fuelCalculateBtn: "सच्ची शुद्ध बचत निकालें",
    fuelNetCard: "घर ले जाने वाली शुद्ध बचत (Net)",
    fuelHourlyCard: "प्रति घंटा शुद्ध कमाई",
    fuelCostCard: "पेट्रोल का कुल खर्च",
    fuelProfitKmCard: "प्रति किलोमीटर बचत",
    fuelAskGeminiBtn: "कमाई व पेट्रोल बचाने के उपाय पूछें",

    docTitle: "पे-स्लिप एवं कटौती जांच",
    docSubtitle: "साप्ताहिक पेआउट स्लिप या स्क्रीनशॉट चेक करें और गलत कटी पेनाल्टी या छुपे हुए चार्ज पकड़ें।",
    docDropText: "पे-स्लिप अपलोड करें (PDF, PNG, JPG)",
    docBrowseBtn: "फाइल चुनें",
    docAnalyzeBtn: "स्लिप जांचें",
    docSampleSwiggy: "स्विगी नमूना स्लिप देखें",
    docSampleUber: "उबर नमूना समरी देखें",
    docTransferAppealBtn: "अपील पत्र में विवरण जोड़ें",

    mapTitle: "लाइव लोकेशन व आपातकालीन लैंडमार्क",
    mapSubtitle: "सटीक जीपीएस लोकेशन देखें, नजदीकी 24 घंटे खुले पेट्रोल पंप, अस्पताल व पुलिस थाना ढूंढें और घर वालों को लोकेशन भेजें।",
    mapGpsCoords: "जीपीएस लोकेशन",
    mapAccuracy: "सटीकता",
    mapSpeed: "स्पीड",
    mapFetchBtn: "लोकेशन रीफ्रेश करें",
    mapLocating: "आपकी लोकेशन खोजी जा रही है…",
    mapShareWhatsApp: "व्हाट्सएप पर भेजें",
    mapShareSms: "एसएमएस द्वारा भेजें",
    mapCopyLink: "नक्शा लिंक कॉपी करें",
    mapCopied: "लिंक कॉपी हो गया!",
    mapNearestPolice: "नजदीकी पुलिस थाना",
    mapNearestHospital: "नजदीकी सरकारी अस्पताल",
    mapNearestFuel: "नजदीकी पेट्रोल पंप / ईवी स्टेशन",
    mapAskAiSafeStops: "सुरक्षित विश्राम स्थल व रास्ता पूछें",

    sosTitle: "आपातकालीन सहायता (SOS) व सड़क सुरक्षा",
    sosSubtitle: "सड़क पर किसी भी परेशानी, दुर्घटना या रात में खतरे के समय सायरन अलार्म, त्वरित जीपीएस संदेश व बीमा क्लेम प्रक्रिया।",
    sosSirenStart: "सुरक्षा सायरन बजाएं",
    sosSirenStop: "सायरन बंद करें",
    sosBroadcastBtn: "1-टैप आपातकालीन संदेश",
    sosBroadcastCopied: "आपातकालीन संदेश तैयार!",
    sosHotlinesTitle: "सीधे कॉल करें (जरूरी हेल्पलाइन)",
    sosClaimTitle: "दुर्घटना बीमा क्लेम कैसे करें (आसान तरीका)",

    schemesTitle: "सरकारी सामाजिक सुरक्षा व बीमा योजनाएं",
    schemesSubtitle: "ई-श्रम (e-Shram), पीएमएसबीवाई और राज्य कल्याण बोर्ड के तहत ₹2 लाख से ₹5 लाख तक का सरकारी बीमा व पेंशन।",
    schemesCheckBtn: "मेरी पात्रता जांचें",
    schemesPortalBtn: "सरकारी पोर्टल खोलें",

    radarTitle: "शिफ्ट व हॉटस्पॉट गाइड",
    radarSubtitle: "अधिक ऑर्डर का समय, धूप व बारिश से बचाव और खाली खड़े रहने पर पेट्रोल बचाने के आसान तरीके।",
    radarAskBtn: "आज की शिफ्ट योजना पूछें",

    footerDisclaimer: "सारथी भारत के मेहनती गिग कामगारों के सम्मान, सुरक्षा और आर्थिक मजबूती के लिए बनाया गया एक गैर-लाभकारी डिजिटल साथी है।",
    footerRights: "सुरक्षित एवं गोपनीय · कोई निजी डेटा सर्वर पर सुरक्षित नहीं रखा जाता",
    quotaSafeBadge: "कोटा सुरक्षित: सामान्य उपयोग",
    cooldownWait: "कृपया अगले सवाल से पहले 3 सेकंड प्रतीक्षा करें",
  },

  Punjabi: {
    appName: "ਸਾਰਥੀ (Saarthi)",
    appSubtitle: "ਡਿਲਿਵਰੀ ਪਾਰਟਨਰਾਂ ਅਤੇ ਡਰਾਈਵਰਾਂ ਦਾ ਸੱਚਾ ਮਦਦਗਾਰ ਸਾਥੀ",
    geminiBadge: "ਜੈਮਿਨੀ ਪਾਵਰਡ",
    roleLabel: "ਤੁਹਾਡਾ ਕੰਮ",
    languageLabel: "ਭਾਸ਼ਾ",
    themeToggleLight: "ਦਿਨ (ਡੇ-ਲਾਈਟ) ਮੋਡ",
    themeToggleDark: "ਰਾਤ (ਨਾਈਟ) ਮੋਡ",
    apiKeyButton: "ਏਪੀਆਈ ਕੀ",
    sosButton: "ਐਸਓਐਸ (ਐਮਰਜੈਂਸੀ)",

    tabChat: "ਸਹਾਇਕ",
    tabAppeals: "ਆਈਡੀ ਤੇ ਜੁਰਮਾਨਾ ਹੱਲ",
    tabFuel: "ਕਮਾਈ ਤੇ ਤੇਲ ਹਿਸਾਬ",
    tabMap: "ਲਾਈਵ ਲੋਕੇਸ਼ਨ",
    tabDocuments: "ਪੇਅ-ਸਲਿੱਪ ਜਾਂਚ",
    tabGuardian: "ਐਮਰਜੈਂਸੀ ਸਹਾਇਤਾ (SOS)",
    tabSchemes: "ਸਰਕਾਰੀ ਸਕੀਮਾਂ",
    tabRadar: "ਸ਼ਿਫਟ ਤੇ ਹੌਟਸਪੌਟ",

    heroTagline: "ਗਾਹਕ ਝਗੜੇ, ਗਲਤ ਜੁਰਮਾਨਾ ਹਟਾਉਣ ਲਈ ਚਿੱਠੀ, ਤੇਲ ਖਰਚ ਕੱਢ ਕੇ ਅਸਲ ਕਮਾਈ, ਲਾਈਵ ਲੋਕੇਸ਼ਨ ਅਤੇ ਸਰਕਾਰੀ ਬੀਮਾ — ਸਭ ਕੁਝ ਸਾਫ਼ ਪੰਜਾਬੀ ਵਿੱਚ।",
    heroBadge: "ਤੁਹਾਡੀ ਹਰ ਸ਼ਿਫਟ ਵਿੱਚ ਮਦਦਗਾਰ",
    supportedPlatformsCount: "9 ਪ੍ਰਮੁੱਖ ਪਲੇਟਫਾਰਮ ਸਮਰਥਿਤ",
    govtInsuranceRange: "₹2 ਲੱਖ - ₹5 ਲੱਖ ਸਰਕਾਰੀ ਬੀਮਾ",

    chatTitle: "ਸਾਰਥੀ ਸਾਥੀ",
    chatEmptyTitle: "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ਸਾਥੀਓ! ਅੱਜ ਅਸੀਂ ਤੁਹਾਡੀ ਕੀ ਮਦਦ ਕਰ ਸਕਦੇ ਹਾਂ?",
    chatEmptyDesc: "ਬੋਲ ਕੇ ਜਾਂ ਲਿਖ ਕੇ ਕੋਈ ਵੀ ਸਵਾਲ ਪੁੱਛੋ। ਗਾਹਕ ਝਗੜੇ, ਗਲਤ ਜੁਰਮਾਨੇ, ਰਸਤੇ ਜਾਂ ਸਰਕਾਰੀ ਸਕੀਮਾਂ ਬਾਰੇ ਸਹੀ ਸਲਾਹ ਲਵੋ।",
    chatInputPlaceholder: "ਸਵਾਲ ਲਿਖੋ ਜਾਂ ਮਾਈਕ ਦਬਾ ਕੇ ਪੰਜਾਬੀ, ਹਿੰਦੀ ਜਾਂ ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ ਬੋਲੋ…",
    chatListening: "ਸੁਣ ਰਿਹਾ ਹਾਂ... ਬੋਲੋ",
    chatListeningHint: "ਪੰਜਾਬੀ, ਹਿੰਦੀ ਜਾਂ ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ ਬੋਲਣਾ ਸਮਰਥਿਤ ਹੈ",
    chatThinking: "ਤੁਹਾਡੇ ਲਈ ਸਭ ਤੋਂ ਵਧੀਆ ਸਲਾਹ ਤਿਆਰ ਹੋ ਰਹੀ ਹੈ…",
    chatNewChat: "ਨਵੀਂ ਗੱਲਬਾਤ",
    chatVoiceTip: "ਮਾਈਕ ਨਾਲ ਬੋਲੋ ਜਾਂ ਜਵਾਬ ਸੁਣੋ",
    chatAutoPromptBanner: "ਸਵਾਲ ਤਿਆਰ ਹੈ। ਭੇਜਣ ਲਈ ਤੀਰ ਦਬਾਓ ਜਾਂ ਬਦਲਾਅ ਕਰੋ।",
    chatSendButton: "ਭੇਜੋ",

    appealTitle: "ਆਈਡੀ ਸਸਪੈਂਸ਼ਨ ਤੇ ਜੁਰਮਾਨਾ ਹੱਲ",
    appealSubtitle: "ਗਲਤ ਆਈਡੀ ਬਲਾਕ, ਝੂਠੀਆਂ ਗਾਹਕ ਸ਼ਿਕਾਇਤਾਂ ਅਤੇ ਨਾਜਾਇਜ਼ ਜੁਰਮਾਨਿਆਂ ਵਿਰੁੱਧ ਸਾਫ਼ ਤੇ ਕਾਨੂੰਨੀ ਸ਼ਿਕਾਇਤ ਚਿੱਠੀ ਤਿਆਰ ਕਰੋ।",
    appealSelectPlatform: "ਪਲੇਟਫਾਰਮ ਚੁਣੋ (Zomato, Swiggy, Uber ਆਦਿ)",
    appealSelectIssue: "ਕੀ ਮਸਲਾ ਹੋਇਆ?",
    appealWorkerName: "ਤੁਹਾਡਾ ਪੂਰਾ ਨਾਮ",
    appealPartnerId: "ਪਾਰਟਨਰ / ਡਰਾਈਵਰ ਆਈਡੀ",
    appealOrderId: "ਆਰਡਰ / ਟ੍ਰਿਪ ਆਈਡੀ",
    appealAmount: "ਕੱਟੀ ਗਈ ਰਕਮ (₹)",
    appealDate: "ਘਟਨਾ ਦੀ ਮਿਤੀ",
    appealDetails: "ਕੀ ਵਾਪਰਿਆ ਸੀ? (ਸੰਖੇਪ ਵਿੱਚ ਲਿਖੋ)",
    appealGenerateBtn: "ਸ਼ਿਕਾਇਤ ਚਿੱਠੀ ਤਿਆਰ ਕਰੋ",
    appealGeneratingBtn: "ਚਿੱਠੀ ਤਿਆਰ ਹੋ ਰਹੀ ਹੈ…",
    appealCopyBtn: "ਚਿੱਠੀ ਕਾਪੀ ਕਰੋ",
    appealCopiedBtn: "ਕਾਪੀ ਹੋ ਗਿਆ!",
    appealEmailBtn: "ਈਮੇਲ ਵਿੱਚ ਖੋਲ੍ਹੋ",

    fuelTitle: "ਅਸਲ ਸ਼ੁੱਧ ਕਮਾਈ ਤੇ ਤੇਲ ਹਿਸਾਬ",
    fuelSubtitle: "ਤੇਲ ਖਰਚ, ਗੱਡੀ ਦਾ ਕੰਮ ਅਤੇ ਖਾਲੀ ਕਿਲੋਮੀਟਰਾਂ ਤੋਂ ਬਾਅਦ ਤੁਹਾਡੀ ਜੇਬ ਵਿੱਚ ਕੀ ਬਚਿਆ, ਇਸਦਾ ਸੱਚਾ ਹਿਸਾਬ।",
    fuelGrossLabel: "ਐਪ 'ਤੇ ਦਿਖੀ ਕੁੱਲ ਕਮਾਈ (₹)",
    fuelDistanceLabel: "ਕੁੱਲ ਚੱਲੇ ਕਿਲੋਮੀਟਰ (km)",
    fuelPriceLabel: "ਮੌਜੂਦਾ ਤੇਲ ਭਾਅ (₹/ਲਿਟਰ)",
    fuelMileageLabel: "ਗੱਡੀ ਦੀ ਮਾਈਲੇਜ (km/L)",
    fuelHoursLabel: "ਸ਼ਿਫਟ ਦਾ ਸਮਾਂ (ਘੰਟੇ)",
    fuelOtherLabel: "ਹੋਰ ਖਰਚੇ (ਟੋਲ, ਚਾਹ-ਪਾਣੀ, ਮੋਬਾਈਲ ₹)",
    fuelCalculateBtn: "ਅਸਲ ਬੱਚਤ ਹਿਸਾਬ ਲਗਾਓ",
    fuelNetCard: "ਘਰ ਲਿਜਾਣ ਵਾਲੀ ਸ਼ੁੱਧ ਬੱਚਤ (Net)",
    fuelHourlyCard: "ਪ੍ਰਤੀ ਘੰਟਾ ਕਮਾਈ",
    fuelCostCard: "ਤੇਲ ਦਾ ਕੁੱਲ ਖਰਚਾ",
    fuelProfitKmCard: "ਪ੍ਰਤੀ ਕਿਲੋਮੀਟਰ ਬੱਚਤ",
    fuelAskGeminiBtn: "ਕਮਾਈ ਵਧਾਉਣ ਤੇ ਤੇਲ ਬਚਾਉਣ ਦੇ ਸੁਝਾਅ ਮੰਗੋ",

    docTitle: "ਪੇਅ-ਸਲਿੱਪ ਤੇ ਕਟੌਤੀ ਜਾਂਚ",
    docSubtitle: "ਹਫ਼ਤਾਵਾਰੀ ਪੇਆਉਟ ਸਲਿੱਪ ਚੈੱਕ ਕਰੋ ਅਤੇ ਲੁਕਵੇਂ ਜੁਰਮਾਨੇ ਜਾਂ ਘੱਟ ਆਏ ਪੈਸੇ ਫੜੋ।",
    docDropText: "ਪੇਅ-ਸਲਿੱਪ ਅਪਲੋਡ ਕਰੋ (PDF, PNG, JPG)",
    docBrowseBtn: "ਫਾਈਲ ਚੁਣੋ",
    docAnalyzeBtn: "ਸਲਿੱਪ ਜਾਂਚੋ",
    docSampleSwiggy: "ਸਵਿਗੀ ਨਮੂਨਾ ਸਲਿੱਪ ਦੇਖੋ",
    docSampleUber: "ਊਬਰ ਨਮੂਨਾ ਸਮਰੀ ਦੇਖੋ",
    docTransferAppealBtn: "ਸ਼ਿਕਾਇਤ ਚਿੱਠੀ ਵਿੱਚ ਸ਼ਾਮਲ ਕਰੋ",

    mapTitle: "ਲਾਈਵ ਲੋਕੇਸ਼ਨ ਤੇ ਜ਼ਰੂਰੀ ਨਕਸ਼ਾ",
    mapSubtitle: "ਸਹੀ ਜੀਪੀਐਸ ਲੋਕੇਸ਼ਨ ਦੇਖੋ, ਨੇੜਲੇ 24 ਘੰਟੇ ਖੁੱਲ੍ਹੇ ਪੈਟਰੋਲ ਪੰਪ, ਹਸਪਤਾਲ ਤੇ ਥਾਣਾ ਲੱਭੋ ਅਤੇ ਘਰ ਵਾਲਿਆਂ ਨੂੰ ਲੋਕੇਸ਼ਨ ਭੇਜੋ।",
    mapGpsCoords: "ਜੀਪੀਐਸ ਲੋਕੇਸ਼ਨ",
    mapAccuracy: "ਸ਼ੁੱਧਤਾ",
    mapSpeed: "ਰਫਤਾਰ",
    mapFetchBtn: "ਲੋਕੇਸ਼ਨ ਤਾਜ਼ਾ ਕਰੋ",
    mapLocating: "ਲੋਕੇਸ਼ਨ ਲੱਭ ਰਿਹਾ ਹੈ…",
    mapShareWhatsApp: "ਵਟਸਐਪ 'ਤੇ ਭੇਜੋ",
    mapShareSms: "ਐਸਐਮਐਸ ਰਾਹੀਂ ਭੇਜੋ",
    mapCopyLink: "ਨਕਸ਼ਾ ਲਿੰਕ ਕਾਪੀ ਕਰੋ",
    mapCopied: "ਲਿੰਕ ਕਾਪੀ ਹੋ ਗਿਆ!",
    mapNearestPolice: "ਨਜ਼ਦੀਕੀ ਪੁਲਿਸ ਥਾਣਾ",
    mapNearestHospital: "ਨਜ਼ਦੀਕੀ ਸਰਕਾਰੀ ਹਸਪਤਾਲ",
    mapNearestFuel: "ਨਜ਼ਦੀਕੀ ਪੈਟਰੋਲ ਪੰਪ / ਈਵੀ ਸਟੇਸ਼ਨ",
    mapAskAiSafeStops: "ਸੁਰੱਖਿਅਤ ਆਰਾਮ ਵਾਲੀ ਥਾਂ ਪੁੱਛੋ",

    sosTitle: "ਐਮਰਜੈਂਸੀ ਸਹਾਇਤਾ (SOS) ਤੇ ਸੜਕ ਸੁਰੱਖਿਆ",
    sosSubtitle: "ਸੜਕ 'ਤੇ ਦੁਰਘਟਨਾ ਜਾਂ ਰਾਤ ਸਮੇਂ ਕਿਸੇ ਵੀ ਖਤਰੇ ਲਈ ਤੁਰੰਤ ਸਾਇਰਨ ਅਲਾਰਮ, ਜੀਪੀਐਸ ਸੁਨੇਹਾ ਅਤੇ ਬੀਮਾ ਕਲੇਮ ਨਿਯਮ।",
    sosSirenStart: "ਸੁਰੱਖਿਆ ਸਾਇਰਨ ਵਜਾਓ",
    sosSirenStop: "ਸਾਇਰਨ ਬੰਦ ਕਰੋ",
    sosBroadcastBtn: "1-ਟੈਪ ਐਮਰਜੈਂਸੀ ਸੁਨੇਹਾ",
    sosBroadcastCopied: "ਐਮਰਜੈਂਸੀ ਸੁਨੇਹਾ ਤਿਆਰ!",
    sosHotlinesTitle: "ਸਿੱਧਾ ਕਾਲ ਕਰੋ (ਜ਼ਰੂਰੀ ਨੰਬਰ)",
    sosClaimTitle: "ਦੁਰਘਟਨਾ ਬੀਮਾ ਕਲੇਮ ਦਾ ਸੌਖਾ ਤਰੀਕਾ",

    schemesTitle: "ਸਰਕਾਰੀ ਸਮਾਜਿਕ ਸੁਰੱਖਿਆ ਤੇ ਬੀਮਾ",
    schemesSubtitle: "ਈ-ਸ਼੍ਰਮ (e-Shram) ਅਤੇ ਸਟੇਟ ਗਿੱਗ ਵਰਕਰ ਬੋਰਡ ਤਹਿਤ ₹2 ਲੱਖ ਤੋਂ ₹5 ਲੱਖ ਦਾ ਸਰਕਾਰੀ ਬੀਮਾ ਤੇ ਪੈਨਸ਼ਨ।",
    schemesCheckBtn: "ਮੇਰੀ ਯੋਗਤਾ ਜਾਂਚੋ",
    schemesPortalBtn: "ਸਰਕਾਰੀ ਪੋਰਟਲ ਖੋਲ੍ਹੋ",

    radarTitle: "ਸ਼ਿਫਟ ਤੇ ਹੌਟਸਪੌਟ ਗਾਈਡ",
    radarSubtitle: "ਵੱਧ ਆਰਡਰਾਂ ਦਾ ਸਮਾਂ, ਧੁੱਪ-ਮੀਂਹ ਤੋਂ ਬਚਾਅ ਅਤੇ ਖੜ੍ਹੇ ਰਹਿਣ ਸਮੇਂ ਤੇਲ ਬਚਾਉਣ ਦੇ ਸੌਖੇ ਨੁਕਤੇ।",
    radarAskBtn: "ਅੱਜ ਦੀ ਸ਼ਿਫਟ ਯੋਜਨਾ ਪੁੱਛੋ",

    footerDisclaimer: "ਸਾਰਥੀ ਭਾਰਤ ਦੇ ਮਿਹਨਤੀ ਗਿੱਗ ਕਾਮਿਆਂ ਦੀ ਇੱਜ਼ਤ, ਸੁਰੱਖਿਆ ਅਤੇ ਆਰਥਿਕ ਮਜ਼ਬੂਤੀ ਲਈ ਬਣਾਇਆ ਗਿਆ ਇੱਕ ਗੈਰ-ਮੁਨਾਫਾ ਸਾਥੀ ਹੈ।",
    footerRights: "ਸੁਰੱਖਿਅਤ ਅਤੇ ਗੁਪਤ · ਸਰਵਰ 'ਤੇ ਕੋਈ ਨਿੱਜੀ ਗੱਲਬਾਤ ਸੁਰੱਖਿਅਤ ਨਹੀਂ ਹੁੰਦੀ",
    quotaSafeBadge: "ਕੋਟਾ ਸੁਰੱਖਿਅਤ: ਆਮ ਵਰਤੋਂ",
    cooldownWait: "ਕਿਰਪਾ ਕਰਕੇ ਅਗਲੇ ਸਵਾਲ ਤੋਂ ਪਹਿਲਾਂ 3 ਸਕਿੰਟ ਉਡੀਕ ਕਰੋ",
  },
};
