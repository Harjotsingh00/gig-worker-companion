import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { generateAppealDraft, type AppealData, PLATFORM_DIRECTORY, DISPUTE_ISSUES } from "@/lib/appeals";
import { consumeGeminiRequest, getRequestIdentifier } from "@/lib/rate-limit";
import { GEMINI_MODEL } from "@/lib/gemini-config";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(request: Request) {
  let body: AppealData;
  try {
    body = (await request.json()) as AppealData;
  } catch {
    return NextResponse.json({ error: "Invalid JSON request." }, { status: 400 });
  }

  if (!body.platform || !body.issue || !PLATFORM_DIRECTORY[body.platform] || !DISPUTE_ISSUES[body.issue]) {
    return NextResponse.json({ error: "Invalid platform or dispute category selected." }, { status: 400 });
  }

  const apiKey = request.headers.get("x-gemini-key") || process.env.GEMINI_API_KEY;

  // Baseline template fallback if Gemini is not configured
  const baseline = generateAppealDraft(body);

  if (!apiKey) {
    return NextResponse.json({
      success: true,
      appeal: baseline,
      source: "template",
      note: "Generated using standard labor charter template. Add a Gemini API key for AI-enhanced legal phrasing.",
    });
  }

  // Rate limiting check
  const rateLimit = consumeGeminiRequest(getRequestIdentifier(request));
  if (!rateLimit.allowed) {
    return NextResponse.json({
      success: true,
      appeal: baseline,
      source: "template_rate_limited",
      note: "Rate limit reached. Serving verified standard legal template.",
    });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: GEMINI_MODEL,
      systemInstruction: `You are an expert legal advocate and labor grievance specialist representing Indian gig economy workers (delivery partners, drivers). Draft high-stakes, respectful, legally grounded appeal letters to platform grievance officers in ${body.language || "English"}. Refer to standard digital commerce dispute norms, GPS telematics proof, and fair hearing principles. Format the response with clear Subject, Body, and Checklist of Attachments.`,
    });

    const prompt = `Draft a formal grievance and appeal letter for a gig worker:
Platform: ${body.platform} (Grievance email: ${PLATFORM_DIRECTORY[body.platform].email})
Issue: ${DISPUTE_ISSUES[body.issue].title}
Worker Name: ${body.workerName || "Partner"}
Partner ID: ${body.partnerId || "Not specified"}
Order/Trip ID: ${body.orderOrTripId || "Recent"}
Incident Date: ${body.incidentDate || "Recent shift"}
Amount Deducted: ${body.amountDeducted ? `₹${body.amountDeducted}` : "Not monetary"}
Worker's statement: "${body.details || DISPUTE_ISSUES[body.issue].description}"
Desired outcome: Reverse unfair deduction, restore account standing, and request manual audit of app logs.

Language required: ${body.language || "English"}. Keep tone professional, urgent yet courteous.`;

    const result = await model.generateContent(prompt);
    const aiText = result.response.text();

    return NextResponse.json({
      success: true,
      appeal: {
        recipient: PLATFORM_DIRECTORY[body.platform].email,
        subject: baseline.subject,
        body: aiText,
      },
      source: "gemini",
    });
  } catch (error) {
    console.error("Gemini appeal generation error:", error);
    return NextResponse.json({
      success: true,
      appeal: baseline,
      source: "template_fallback",
      note: "Gemini service temporarily unavailable; standard appeal template provided.",
    });
  }
}
