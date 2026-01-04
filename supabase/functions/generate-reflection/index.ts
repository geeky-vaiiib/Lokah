// deno-lint-ignore-file
declare const Deno: { env: { get(name: string): string | undefined } };
// @ts-expect-error - Deno remote module import
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, alternateSelf, userName } = await req.json();
    console.log('Generating reflection');

    const GOOGLE_AI_KEY = Deno.env.get('GOOGLE_AI_API_KEY');
    if (!GOOGLE_AI_KEY) {
      throw new Error('Google AI API key not configured');
    }

    const conversationSummary = (messages || []).slice(-10).map((m: { role: string, content: string }) =>
      `${m.role}: ${m.content}`
    ).join('\n');

    const prompt = `Based on this conversation between ${userName || 'someone'} and their alternate self, write a SHORT personal reflection.

Conversation:
${conversationSummary}

About the alternate self:
${alternateSelf?.backstory || 'They took a different path in life.'}

Write a brief, honest reflection (2-3 sentences) that:
- Points out something interesting they learned
- Keeps it real and grounded (not poetic)
- Sounds like a friend giving honest feedback

Example good reflection:
"Sounds like your other self found peace by slowing down - maybe there's something there for you too. Not saying quit your job, but what if you took more breaks?"

Write ONLY the reflection text, no quotes, no labels:`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GOOGLE_AI_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 150,
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
    let reflection = aiData.candidates?.[0]?.content?.parts?.[0]?.text || '';
    reflection = reflection.trim().replace(/^["']|["']$/g, '');

    console.log('Generated reflection');
    return new Response(JSON.stringify({ reflection }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: unknown) {
    console.error('Error in generate-reflection:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});