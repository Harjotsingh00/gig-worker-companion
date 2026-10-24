import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import {
  buildSystemInstruction,
  MAX_REQUEST_BYTES,
  validateChatRequest,
} from "@/lib/chat-contract";
import { consumeGeminiRequest, getRequestIdentifier } from "@/lib/rate-limit";
import { readBodyAtMost } from "@/lib/request-body";
import { GEMINI_MODEL, BACKUP_GEMINI_MODEL } from "@/lib/gemini-config";
import { getGeminiFailure } from "@/lib/gemini-errors";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(request: Request) {
  const apiKey = request.headers.get("x-gemini-key") || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Gemini is not configured. Add GEMINI_API_KEY to .env.local or click 'API Key' in the top bar to connect." },
      { status: 503 },
    );
  }

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_REQUEST_BYTES) {
    return NextResponse.json({ error: "This request is too large. Please shorten it and try again." }, { status: 413 });
  }

  let boundedBody: Uint8Array | null;
  try {
    boundedBody = await readBodyAtMost(request, MAX_REQUEST_BYTES);
  } catch {
    return NextResponse.json({ error: "Could not read this request. Please try again." }, { status: 400 });
  }
  if (!boundedBody) {
    return NextResponse.json({ error: "This request is too large. Please shorten it and try again." }, { status: 413 });
  }

  let body: unknown;
  try {
    body = JSON.parse(new TextDecoder().decode(boundedBody));
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  const validation = validateChatRequest(body);
  if (!validation.ok) {
    return NextResponse.json({ error: validation.error }, { status: validation.status });
  }

  const rateLimit = consumeGeminiRequest(getRequestIdentifier(request));
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "Too many requests. Please wait a minute and try again." }, { status: 429, headers: { "Retry-After": String(rateLimit.retryAfterSeconds) } });
  }

  const { messages, role, language } = validation.value;
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    let modelName = GEMINI_MODEL;
    let model = genAI.getGenerativeModel({
      model: modelName,
      systemInstruction: buildSystemInstruction(role, language),
      generationConfig: {
        maxOutputTokens: 500,
      },
    });

    const history = messages.slice(0, -1).map((message) => ({
      role: message.role === "assistant" ? "model" : "user",
      parts: [{ text: message.content }],
    }));

    try {
      const chat = model.startChat({ history });
      const result = await chat.sendMessage(messages[messages.length - 1].content, {
        signal: request.signal,
        timeout: 25_000,
      });
      return NextResponse.json({ text: result.response.text() });
    } catch (err: unknown) {
      // If primary model is not found, fallback to backup model
      const msg = err instanceof Error ? err.message : "";
      if (msg.includes("not found") || msg.includes("404")) {
        model = genAI.getGenerativeModel({
          model: BACKUP_GEMINI_MODEL,
          systemInstruction: buildSystemInstruction(role, language),
          generationConfig: { maxOutputTokens: 500 },
        });
        const chat = model.startChat({ history });
        const result = await chat.sendMessage(messages[messages.length - 1].content, {
          signal: request.signal,
          timeout: 25_000,
        });
        return NextResponse.json({ text: result.response.text() });
      }
      throw err;
    }
  } catch (error) {
    const failure = getGeminiFailure(error, "chat");
    console.error("Gemini chat request failed", failure.providerStatus ?? (error instanceof Error ? error.name : "UnknownError"));
    return NextResponse.json({ error: failure.message }, { status: 502 });
  }
}
