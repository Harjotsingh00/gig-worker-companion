import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import {
  GIG_SAHAYAK_SYSTEM_PROMPT,
  supportedLanguages,
  workerRoles,
  type ChatLanguage,
  type WorkerRole,
} from "@/lib/prompts";

export const runtime = "nodejs";
const MAX_REQUEST_BYTES = 64_000;

type Message = { role: "user" | "assistant"; content: string };

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_REQUEST_BYTES) {
    return NextResponse.json({ error: "This message is too long. Please shorten it and try again." }, { status: 413 });
  }

  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json(
      { error: "Gemini is not configured. Add GEMINI_API_KEY to .env.local and restart the app." },
      { status: 503 },
    );
  }

  try {
    const body: unknown = await request.json();
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }

    const { messages, role, language } = body as {
      messages?: unknown;
      role?: unknown;
      language?: unknown;
    };
    if (
      !Array.isArray(messages) ||
      messages.length === 0 ||
      messages.length > 12 ||
      !workerRoles.includes(role as WorkerRole) ||
      !supportedLanguages.includes(language as ChatLanguage)
    ) {
      return NextResponse.json({ error: "Choose a valid role and language, then send a message." }, { status: 400 });
    }

    const chatMessages = messages as Message[];
    const conversationLength = chatMessages.reduce(
      (total, message) => total + (typeof message?.content === "string" ? message.content.length : 0),
      0,
    );
    const invalidMessage = chatMessages.some(
      (message) =>
        !message ||
        (message.role !== "user" && message.role !== "assistant") ||
        typeof message.content !== "string" ||
        message.content.trim().length === 0 ||
        message.content.length > 2000,
    );
    if (invalidMessage || conversationLength > 10000 || chatMessages[chatMessages.length - 1]?.role !== "user") {
      return NextResponse.json({ error: "Messages must end with a valid user message." }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      // Gemini 1.5 and 2.0 Flash have been shut down. 2.5 Flash remains available.
      model: "gemini-2.5-flash",
      systemInstruction: `${GIG_SAHAYAK_SYSTEM_PROMPT}\n\nThe user's selected role is ${role}. The user selected ${language}; reply only in ${language}. For Indian government rights and schemes, do not invent scheme names, eligibility rules, amounts, or deadlines. If details may vary by state or be out of date, say so plainly and ask for the worker's state. Encourage checking current details through official government sources.`,
      generationConfig: {
        maxOutputTokens: 320,
        temperature: 0.2,
      },
    });
    const history = chatMessages.slice(0, -1).map((message) => ({
      role: message.role === "assistant" ? "model" : "user",
      parts: [{ text: message.content }],
    }));
    const chat = model.startChat({ history });
    const result = await chat.sendMessage(chatMessages[chatMessages.length - 1].content);
    return NextResponse.json({ text: result.response.text() });
  } catch (error) {
    console.error("Gemini chat request failed", error);
    return NextResponse.json({ error: "Couldn't get a reply right now. Please try again." }, { status: 500 });
  }
}
