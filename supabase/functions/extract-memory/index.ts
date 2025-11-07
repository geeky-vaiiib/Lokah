// deno-lint-ignore-file
// Minimal Deno global for local type checks
// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare const Deno: { env: { get(name: string): string | undefined } };
// @ts-expect-error - Deno remote module import for local TS
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { LOKAH_SYSTEM_PROMPT } from "../_shared/prompt.ts";

const AI_API_KEY = Deno.env.get("LOKAH_AI_API_KEY") || Deno.env.get("OPENAI_API_KEY");
const AI_GATEWAY_URL = Deno.env.get('AI_GATEWAY_URL') || 'https://api.openai.com/v1/chat/completions';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messageContent }: { messageContent: string } = await req.json();

    if (!AI_API_KEY) {
      throw new Error("AI API key is not configured");
    }

  const systemPrompt = `You are a memory extraction assistant. Analyze the following message and determine if it contains a meaningful quote or emotional moment worth saving.

If yes, extract:
1. The specific quote or memorable line (exact words, 1-3 sentences max)
2. The emotional tone (one word: nostalgic, hopeful, melancholic, curious, profound, etc.)

If the message is too mundane or doesn't contain anything memorable, respond with null values.

Format as JSON:
{
  "content": "string or null",
  "emotional_tone": "string or null"
}`;

  const response = await fetch(AI_GATEWAY_URL, {
      method: "POST",
      headers: {
    Authorization: `Bearer ${AI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: LOKAH_SYSTEM_PROMPT },
          { role: "system", content: systemPrompt },
          { role: "user", content: `Extract memory from: ${messageContent}` }
        ],
        response_format: { type: "json_object" },
        temperature: 0.35,
        max_tokens: 250
      }),
    });

    if (!response.ok) {
      if (response.status === 429 || response.status === 402) {
        // Don't fail if memory extraction hits rate limits - it's non-critical
        return new Response(
          JSON.stringify({ memory: null }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("Failed to extract memory");
    }

    const data = await response.json();
    const memory = JSON.parse(data.choices[0].message.content);

    return new Response(JSON.stringify({ memory }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("Error in extract-memory:", error);
    // Return null memory on error - it's a non-critical feature
    return new Response(
      JSON.stringify({ memory: null }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});