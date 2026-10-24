<div align="center">

# 🛡️ Saarthi AI (सारथी)

### The Hyper-Intelligent Co-Pilot & Rights Guardian for India's 15 Million Gig Workers

An AI companion designed for delivery partners (Zomato, Swiggy, Zepto, Blinkit, Amazon Flex), cab/auto drivers (Uber, Ola, Rapido, Porter), and daily-wage workers. Powered by **Google Gemini Generative AI**, Saarthi AI solves real-life everyday crises: unfair account suspensions, false customer non-delivery penalties, hidden wage deductions, fuel burn vs real hourly take-home pay, 24/7 roadside distress SOS, and central/state statutory social security schemes.

[![Next.js](https://img.shields.io/badge/Next.js-15.5-000000?logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-2.0_&_1.5_Flash-4285F4?logo=googlegemini&logoColor=white)](https://ai.google.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)

**English · हिन्दी (Hindi) · ਪੰਜਾਬੀ (Punjabi)** &nbsp;|&nbsp; **Mobile-First · Voice-Enabled · Natural Justice & Platform Labor Charter**

</div>

---

## 🌟 The Big Problem & The Saarthi Solution

India's 15+ million platform gig workers power the nation's instant commerce and urban transport, yet they face severe structural hurdles:
1. **Algorithmic ID Bans & Penalties**: Accounts deactivated abruptly upon fraudulent customer "food not delivered" refund claims, GPS drift, or rain delays—with zero human grievance representation.
2. **Hidden Wage Theft & Real Profit Illusions**: Workers celebrate earning ₹1,200 gross, unaware that petrol, vehicle wear, and dead mileage reduce their real earnings to under ₹90/hr (below statutory minimum wage).
3. **Complex, Disguised Payout Slips**: Weekly statements with confusing deductions ("surge reconciliation", "floating cash advance", "packaging chargeback").
4. **Road Harassment & Midnight Accidents**: Severe vulnerability during night shifts, accidents, and police checkpoints without quick access to legal protocols or insurance claims.
5. **The Social Security Gap**: 90%+ of workers are eligible for the Central **e-Shram** ₹2 Lakh accidental insurance and state acts (such as the landmark Rajasthan Gig Workers Act and Karnataka Fund), yet fail to claim due to complex procedures.

---

## 🚀 Key Features

| Feature | How It Protects Gig Workers |
| :--- | :--- |
| **🎙️ Voice-First AI Co-Pilot** | Voice input (Speech-to-Text) & natural speech audio playback (TTS) in Hindi, Punjabi, and English. Handles customer disputes, police challan checks, and platform policy queries. |
| **🛡️ Dispute & Deactivation Shield** | Generates formal, legally grounded grievance appeals to platform grievance officers (Zomato, Swiggy, Blinkit, Zepto, Uber, Ola, Porter, Urban Company, Amazon Flex) citing natural justice and fair partner charters. |
| **⛽ Fuel Burn & Real Net Wage Matrix** | Calculates true take-home earnings after fuel consumption (mileage & fuel price) and vehicle wear. Displays real net hourly wage vs statutory benchmarks, with Gemini shift optimization tactics. |
| **📑 AI Slip & Payout Deep Auditor** | Multimodal Gemini Vision extracts facts from payout PDFs, JPGs, or PNGs. Features 1-click sample statement loaders and direct transfer to the Appeal Shield. |
| **🚨 Guardian SOS & First-Aid Protocol** | Audio distress siren, 1-click GPS location broadcast, 24x7 emergency helplines (112, 108, 1091, 1033), and step-by-step accidental insurance claim guide. |
| **🏛️ Govt Scheme Navigator** | Comprehensive directory of e-Shram, PMSBY, PMJJBY, PM-SYM, Ayushman Bharat, Rajasthan Gig Worker Act, and Karnataka Gig Fund with Gemini eligibility checks. |
| **⚡ Hotspot & Surge Radar** | Optimal order clustering, corporate lunch/dinner windows, zero-idle fuel saving tips, and monsoon/heatwave weather advisories. |

---

## 🛠️ Run Locally

### Requirements
- Node.js 22.6.0 or newer
- Free Google Gemini API Key from [Google AI Studio](https://aistudio.google.com/)

### 1. Installation
```bash
npm install
```

### 2. Configure Gemini API Key
Create `.env.local` or simply click **"API Key"** directly in the top navigation bar of the web app:

```bash
# In .env.local
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Start Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Quality Assurance & Tests

Run the domain validation test suite (15 automated tests covering contracts, rate limits, calculations, appeals, and schemas):

```bash
npm test
```

Type checking:
```bash
npx tsc --noEmit
```

---

## 🔒 Privacy & Architecture

- **Client Session Key Storage**: Users can configure their Gemini API Key safely in browser memory/localStorage; keys are passed via secure server request headers.
- **No Chat Logging**: Conversations and uploaded payment slips are not stored on persistent server disks.
- **Multimodal AI**: Powered by Google's Gemini SDK. Chat uses `gemini-3.8-flash` and retries once on a missing-model or temporary 503 response with `gemini-3.6-flash`; document extraction uses `gemini-3.5-flash-lite` for lower latency. Model IDs can be overridden with `GEMINI_MODEL`, `GEMINI_BACKUP_MODEL`, and `GEMINI_DOCUMENT_MODEL`. Quota errors are surfaced without retrying.
- **Bounded Payload & Rate Limiting**: All chat and document requests enforce strict byte limits and IP-based rate limiting to protect API quotas.

---

<div align="center">
<b>Saarthi AI</b> · Dedicated to the heroes who keep India moving every single day.
</div>
