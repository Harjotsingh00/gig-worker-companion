# Gig Worker Companion

A mobile-first AI companion for Indian gig workers, built with the Next.js App Router, TypeScript, Tailwind CSS, and Google's `@google/generative-ai` SDK.

## Run locally

1. Install dependencies with `npm install`.
2. Copy `.env.local.example` to `.env.local` and add your Gemini API key.
3. Start the app with `npm run dev` and open `http://localhost:3000`.

`GEMINI_API_KEY` is read only by the server route at `/api/chat`; it is never sent to the browser. The route makes live `gemini-2.5-flash` calls, limits response size and conversation history, and uses the system prompt in `lib/prompts.ts`. No messages are persisted after the page is closed.
