/*
  Heuristic tone test for Lokah replies.
  This script simulates responses and validates constraints (length < 80 words,
  tone tags include friendly/human/alternate-self, no academic/poetic words).
  In a real integration, replace mockResponses with actual API calls.
*/

const samples = [
  "how's life?",
  "been feeling lost",
  "do you ever feel stuck?",
  "what if I chose the other path?",
  "i'm tired lately",
  "are you different from me?",
  "what do you regret?",
  "i'm anxious about work",
  "is it normal to feel this way?",
  "can we keep it short?"
];

// Mock replies to avoid network calls; structure should mirror edge function output
const mockResponses = samples.map((s, i) => ({
  reply_text:
    i % 3 === 0
      ? "Pretty good lately. A bit of chaos, but kind of fun too. How’s yours?"
      : i % 3 === 1
      ? "Yeah, I get that. I’ve had those stretches too. Want to talk it out a bit?"
      : "Same here sometimes. In my version, I just take a small step and it helps. What sounds doable today?",
  tone_tags: ["friendly", "human", "alternate-self"],
  memory_candidates: [],
  safety: { status: "ok" }
}));

const bannedWords = [
  "journey",
  "growth",
  "indeed",
  "thus",
  "therefore",
  "hence"
];

const wordCount = (t) => t.trim().split(/\s+/).filter(Boolean).length;
const hasBanned = (t) => bannedWords.some((w) => new RegExp(`\\b${w}\\b`, "i").test(t));

const results = mockResponses.map((res, idx) => {
  const lengthOk = wordCount(res.reply_text) < 80;
  const toneOk = ["friendly", "human", "alternate-self"].every((tag) => res.tone_tags.includes(tag));
  const phrasingOk = !hasBanned(res.reply_text);
  const pass = lengthOk && toneOk && phrasingOk;
  return {
    sample: samples[idx],
    length: wordCount(res.reply_text),
    lengthOk,
    toneOk,
    phrasingOk,
    pass,
  };
});

const summary = {
  total: results.length,
  passed: results.filter((r) => r.pass).length,
  failed: results.filter((r) => !r.pass).length,
  avgLength: Math.round(
    results.reduce((sum, r) => sum + r.length, 0) / results.length
  ),
};

console.table(results);
console.log("\nSummary:", summary);

if (results.some((r) => !r.pass)) {
  process.exitCode = 1;
}
