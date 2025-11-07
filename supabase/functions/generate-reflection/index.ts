// deno-lint-ignore-file
// Minimal Deno env declaration for local TS checks
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
  const { messages, alternateSelfData }: { messages: Array<{ role: string; content: string; timestamp?: string }>; alternateSelfData: { axis: string; divergence_summary: string; backstory: string } } = await req.json();

    if (!AI_API_KEY) {
      throw new Error("AI API key is not configured");
    }

  const systemPrompt = `You are a reflection assistant analyzing a conversation between someone and their alternate self from a parallel reality.

The alternate self's context:
- Divergence axis: ${alternateSelfData.axis}
- Different life path: ${alternateSelfData.divergence_summary}
- Backstory: ${alternateSelfData.backstory}

Your task: Generate a reflective summary with:
1. A poetic title (5-8 words)
2. Three insights as bullet points - each exploring what this conversation reveals about the user's real life, values, or unchosen paths
3. An emotional tone (one word: reflective, hopeful, nostalgic, curious, etc.)

Format your response as JSON:
{
  "title": "string",
  "insights": ["string", "string", "string"],
  "emotional_tone": "string"
}`;

    const contextBlob = {
      task: 'reflection_summary',
      parallel_self: {
        axis: alternateSelfData.axis,
        backstory: alternateSelfData.backstory,
        divergence_summary: alternateSelfData.divergence_summary,
      },
      conversation_history: messages.slice(-10)
    };

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
          { role: "user", content: `Context:\n${JSON.stringify(contextBlob, null, 2)}\n\nAnalyze this conversation and generate a reflection JSON.` }
        ],
        response_format: { type: "json_object" },
        temperature: 0.4,
        max_tokens: 300
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limits exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required. Please add funds to your workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("Failed to generate reflection");
    }

    const data = await response.json();
    const reflection = JSON.parse(data.choices[0].message.content);

    return new Response(JSON.stringify({ reflection }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("Error in generate-reflection:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});