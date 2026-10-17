<div align="center">

# Gig Sahayak

### Practical, multilingual support for India's gig workers

An AI companion for delivery partners, drivers, and daily-wage workers. Track a workday, get straightforward guidance, understand payout documents, and prepare a grievance—with Gemini generating the replies in the language you choose.

[![Next.js](https://img.shields.io/badge/Next.js-15.5.28-000000?logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Gemini](https://img.shields.io/badge/Gemini-3.5_Flash--Lite-4285F4?logo=googlegemini&logoColor=white)](https://ai.google.dev/gemini-api/docs/models/gemini-3.5-flash-lite)
![PromptWars](https://img.shields.io/badge/PromptWars-GenAI_Challenge-6DBE45.svg)

**English · हिन्दी · ਪੰਜਾਬੀ** &nbsp;|&nbsp; **Mobile-first · No account required · No saved chat history**

</div>

---

## What it does

Gig Sahayak turns common workday questions into simple next steps. Choose a role and language, then use chat or a focused tool.

| Feature | How it helps |
| --- | --- |
| **Ask Gig Sahayak** | Get concise, role-aware answers in English, Hindi, or Punjabi. |
| **Earnings check-in** | Enter gross earnings and work expenses to calculate net earnings locally. Ask Gemini for two practical tips only when you choose. |
| **Safety, rights, and schemes** | Start with useful prompts for practical safety guidance and worker rights or welfare scheme questions. The assistant is instructed to flag uncertain eligibility and changing rules. |
| **Payment document help** | Send a PDF, JPG, or PNG payout document for extraction of visible facts. Review and correct the facts before using them in a grievance draft. |
| **Grievance drafting** | Prepare a short, polite payment complaint without inventing missing details. Document-based drafts use facts you have reviewed and confirmed. |

## Run locally

**Requirements:** Node.js 22.6.0 or newer and a Gemini API key for live AI features.

```bash
npm install
```

Create `.env.local` from the example and add the key on your own machine:

```powershell
Copy-Item .env.local.example .env.local
```

Then edit `.env.local` and set `GEMINI_API_KEY`. Never commit that file. Start the app:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The API key is read by server routes only; it is not sent to browser code. Without a configured key, Gemini actions show a setup message and do not return simulated replies.

## Gemini usage and privacy

- The chat and document analysis routes make real server-side calls to Google's official `@google/generative-ai` SDK, using the stable `gemini-3.5-flash-lite` model.
- Calls happen only after a user action. Earnings arithmetic is local and does not use Gemini.
- Output is capped at 320 tokens for chat and 300 tokens for document extraction. Requests time out after 25 seconds.
- A process-local limit allows up to 10 validated Gemini-backed requests per minute per client identifier. For a multi-instance deployment, replace this with a shared rate-limit store.
- Chat history and uploaded files are not saved by the app. Uploaded documents are sent to Google for analysis; redact bank details and identity numbers before uploading.
- Errors are converted to concise, status-specific guidance. Raw provider messages and document contents are not returned to the browser or included in app logs.
- Document extraction can be wrong or incomplete. Review every field before using it. The assistant is not a legal, financial, or government authority; verify current scheme details with official sources.

See Google's [model guide](https://ai.google.dev/gemini-api/docs/models) and [Gemini 3.5 Flash-Lite documentation](https://ai.google.dev/gemini-api/docs/models/gemini-3.5-flash-lite).

## Evaluator walkthrough

This sequence exercises the main workflows with **up to six Gemini calls**, or seven if you also request earnings tips. Local earnings calculation costs no Gemini calls.

1. **Safety:** Delivery Partner · English → select **Safety**. Check that the response is practical and concise.
2. **Rights and schemes:** Driver · Hindi → select **Rights**. Check the response language and that it does not claim eligibility or invent amounts.
3. **Grievance:** Daily-wage · Punjabi → select **Grievance**. Check that it drafts a polite complaint without fabricated personal details.
4. **Earnings:** Enter gross ₹1,200 and expenses ₹150, then calculate. Confirm ₹1,050 net. Request Gemini tips only if you want the additional call.
5. **Document help:** Upload a redacted payout PDF, JPG, or PNG under 3 MiB. Review and correct extracted fields, then draft a grievance. The draft should use only confirmed facts and leave placeholders for missing details.
6. **Follow-up:** Ask one follow-up in chat and check that the selected role and language are retained.

Use a test document without real account or identity details. If the key is missing, the app should show a setup error rather than a made-up answer.

## Quality checks

```bash
npm test
npm run lint
npx tsc --noEmit
npm run build
```

The automated tests do not call Gemini or consume API quota. They cover earnings calculations, request validation and limits, supported document signatures, rate limiting, and safe Gemini error messages.

## Project structure

```text
app/
  api/chat/route.ts          # Validated, rate-limited Gemini chat endpoint
  api/cases/analyze/route.ts # Bounded, validated document analysis endpoint
  page.tsx                   # Main assistant experience
components/                  # Chat, role/language controls, earnings, documents
lib/                         # Prompts, model config, validation, limits, helpers
tests/                       # Gemini-free domain tests
.env.local.example           # API key placeholder (never put a real key here)
```

## Built with

Next.js App Router · React · TypeScript · Tailwind CSS · Google Gemini API · `@google/generative-ai`

## Topics

`gig-workers` · `worker-support` · `gemini-api` · `generative-ai` · `nextjs` · `multilingual` · `india`
