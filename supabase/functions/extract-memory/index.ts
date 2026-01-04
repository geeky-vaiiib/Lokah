// deno-lint-ignore-file
declare const Deno: { env: { get(name: string): string | undefined } };
// @ts-expect-error - Deno remote module import
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, userName } = await req.json();
    console.log('Extracting memories from conversation');

    const GOOGLE_AI_KEY = Deno.env.get('GOOGLE_AI_API_KEY');
    if (!GOOGLE_AI_KEY) {
      throw new Error('Google AI API key not configured');
    }

    const conversationText = (messages || []).map((m: { role: string, content: string }) =>
      `${m.role}: ${m.content}`
    ).join('\n');

    const prompt = `Look at this conversation and find 1-3 interesting things worth remembering.

Conversation:
${conversationText}

Extract short, specific memories - like facts or moments that felt meaningful.

Good examples:
- "Mentioned they almost moved to Seattle"
- "Said they regret not learning guitar"
- "Talked about their fear of public speaking"

Bad examples (too vague):
- "Had a deep conversation"
- "Shared personal feelings"

Return ONLY a JSON array of strings, nothing else:
["memory 1", "memory 2"]`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GOOGLE_AI_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 200,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const aiData = await response.json();
    const rawText = aiData.candidates?.[0]?.content?.parts?.[0]?.text || '[]';

    let memories: string[] = [];
    try {
      const jsonMatch = rawText.match(/\[[\s\S]*?\]/);
      memories = jsonMatch ? JSON.parse(jsonMatch[0]) : [];
    } catch {
      memories = [];
    }

    console.log('Extracted memories:', memories.length);
    return new Response(JSON.stringify({ memories }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: unknown) {
    console.error('Error in extract-memory:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});