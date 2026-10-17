import assert from "node:assert/strict";
import test from "node:test";
import { buildSystemInstruction, validateChatRequest } from "../lib/chat-contract.ts";
import { supportedLanguages, workerRoles } from "../lib/prompts.ts";
import { summarizeEarnings } from "../lib/earnings.ts";
import { isSupportedDocument, MAX_DOCUMENT_BYTES } from "../lib/document-contract.ts";
import { consumeGeminiRequest, getRequestIdentifier } from "../lib/rate-limit.ts";
import { readBodyAtMost } from "../lib/request-body.ts";
import { getGeminiFailure } from "../lib/gemini-errors.ts";

test("earnings summary calculates net from worker-provided amounts", () => {
  assert.deepEqual(summarizeEarnings(1_200, 135.5), {
    gross: 1_200,
    expenses: 135.5,
    net: 1_064.5,
  });
});

test("earnings summary supports zero and a negative net after real expenses", () => {
  assert.deepEqual(summarizeEarnings(0, 0), { gross: 0, expenses: 0, net: 0 });
  assert.deepEqual(summarizeEarnings(100, 120), { gross: 100, expenses: 120, net: -20 });
});

test("earnings summary rejects negative and non-finite inputs", () => {
  assert.throws(() => summarizeEarnings(-1, 0), RangeError);
  assert.throws(() => summarizeEarnings(100, Number.NaN), RangeError);
});

test("chat contract accepts a real request with supported role and language", () => {
  const result = validateChatRequest({
    role: "Delivery Partner",
    language: "Hindi",
    messages: [{ role: "user", content: "Meri payment kab milegi?" }],
  });
  assert.equal(result.ok, true);
});

test("chat contract rejects unsupported choices, malformed messages, and invalid turn order", () => {
  assert.equal(validateChatRequest({ role: "Pilot", language: "English", messages: [{ role: "user", content: "Help" }] }).ok, false);
  assert.equal(validateChatRequest({ role: "Driver", language: "English", messages: [{ role: "assistant", content: "Hello" }] }).ok, false);
  assert.equal(validateChatRequest({ role: "Driver", language: "English", messages: [{ role: "user", content: "  " }] }).ok, false);
  assert.equal(validateChatRequest({ role: "Driver", language: "English", messages: [{ role: "user", content: "Help" }, { role: "user", content: "Again" }] }).ok, false);
  assert.equal(validateChatRequest({ role: "Driver", language: "English", messages: [{ role: "user", content: "Help" }, { role: "assistant", content: "Hello" }, { role: "assistant", content: "Again" }, { role: "user", content: "Next" }] }).ok, false);
});

test("chat contract enforces message and conversation limits", () => {
  assert.equal(validateChatRequest({ role: "Driver", language: "English", messages: [{ role: "user", content: "x".repeat(2_001) }] }).ok, false);
  assert.equal(validateChatRequest({ role: "Driver", language: "English", messages: Array.from({ length: 13 }, () => ({ role: "user", content: "x" })) }).ok, false);
  const messages = Array.from({ length: 6 }, (_, index) => ({
    role: index % 2 === 0 ? "user" : "assistant",
    content: "x".repeat(2_000),
  }));
  const result = validateChatRequest({ role: "Driver", language: "English", messages });
  assert.equal(result.ok, false);
  if (!result.ok) assert.equal(result.status, 413);
});

test("system instruction carries every supported role and response language", () => {
  for (const role of workerRoles) {
    for (const language of supportedLanguages) {
      const prompt = buildSystemInstruction(role, language);
      assert.ok(prompt.includes(`role is ${role}`));
      assert.ok(prompt.includes(`reply only in ${language}`));
      assert.match(prompt, /never invent scheme names/);
      assert.match(prompt, /never claim the worker qualifies/);
    }
  }
});

test("document validation accepts supported file signatures only", () => {
  assert.equal(isSupportedDocument("application/pdf", new TextEncoder().encode("%PDF-1.7")), true);
  assert.equal(isSupportedDocument("image/jpeg", new Uint8Array([0xff, 0xd8, 0xff, 0x00])), true);
  assert.equal(isSupportedDocument("image/png", new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10])), true);
  assert.equal(isSupportedDocument("application/pdf", new TextEncoder().encode("<html>")), false);
  assert.equal(isSupportedDocument("image/gif", new Uint8Array([71, 73, 70])), false);
});

test("document upload limit is 3 MiB", () => {
  assert.equal(MAX_DOCUMENT_BYTES, 3 * 1024 * 1024);
});

test("Gemini request limiter allows ten calls then asks the client to wait", () => {
  const id = `rate-limit-test-${Date.now()}`;
  for (let index = 0; index < 10; index += 1) {
    assert.equal(consumeGeminiRequest(id, 1_000).allowed, true);
  }
  assert.deepEqual(consumeGeminiRequest(id, 1_000), { allowed: false, remaining: 0, retryAfterSeconds: 60 });
  assert.equal(consumeGeminiRequest(id, 61_001).allowed, true);
});

test("Gemini failures give safe, actionable guidance without exposing provider details", () => {
  assert.match(getGeminiFailure({ status: 403, message: "sensitive provider body" }, "chat").message, /API key is valid/);
  assert.match(getGeminiFailure({ status: 429 }, "document").message, /quota or rate limit/);
  assert.match(getGeminiFailure({ status: 503 }, "chat").message, /temporarily unavailable/);
  const unknownFailure = getGeminiFailure(new Error("private SDK details"), "document");
  assert.match(unknownFailure.message, /model access, quota, and connection/);
  assert.doesNotMatch(unknownFailure.message, /private SDK details/);
});

test("request identifier uses the server proxy IP when available", () => {
  const request = new Request("http://localhost", { headers: { "x-real-ip": "192.0.2.1", "x-forwarded-for": "192.0.2.2, 192.0.2.3" } });
  assert.equal(getRequestIdentifier(request), "192.0.2.1");
});

test("bounded request reader accepts bodies at the limit and rejects larger streams", async () => {
  const withinLimit = new Request("http://localhost", { method: "POST", body: "1234" });
  assert.equal(new TextDecoder().decode(await readBodyAtMost(withinLimit, 4)), "1234");

  const tooLarge = new Request("http://localhost", { method: "POST", body: "12345" });
  assert.equal(await readBodyAtMost(tooLarge, 4), null);
});
