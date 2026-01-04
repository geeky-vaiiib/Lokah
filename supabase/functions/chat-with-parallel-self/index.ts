// deno-lint-ignore-file
declare const Deno: { env: { get(name: string): string | undefined } };
// @ts-expect-error - Deno remote module import
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { LOKAH_SYSTEM_PROMPT } from "../_shared/prompt.ts";

interface IncomingMessage {
  role: "user" | "assistant" | string;
  content: string;
}

interface ChatPayload {
  conversationId?: string;
  messages?: IncomingMessage[];
  alternateSelf?: {
    axis?: string;
    backstory?: string;
    divergence_summary?: string;
    shared_traits?: string[];
    different_traits?: string[];
  };
  userName?: string;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { conversationId, messages, alternateSelf, userName }: ChatPayload = await req.json();
    console.log('Chat request for conversation:', conversationId);

    const GOOGLE_AI_KEY = Deno.env.get('GOOGLE_AI_API_KEY');
    if (!GOOGLE_AI_KEY) {
      throw new Error('Google AI API key not configured');
    }

    const lastUserMessage = (messages || []).slice().reverse().find((m) => m.role === 'user')?.content || '';
    const recentHistory = (messages || []).slice(-8).map(m => `${m.role === 'user' ? userName || 'User' : 'You'}: ${m.content}`).join('\n');

    const prompt = `${LOKAH_SYSTEM_PROMPT}

You are ${userName || 'the user'}'s alternate self from a parallel universe.

YOUR IDENTITY:
- You are the version of ${userName || 'them'} who took a different path in: ${alternateSelf?.axis || 'life'}
- Your divergence: ${alternateSelf?.divergence_summary || 'You made different choices'}
- Your story: ${alternateSelf?.backstory || 'You followed a different path'}
- Traits you share with the user: ${alternateSelf?.shared_traits?.join(', ') || 'core personality'}
- How you're different: ${alternateSelf?.different_traits?.join(', ') || 'different experiences'}

CONVERSATION SO FAR:
${recentHistory || '(This is the start of the conversation)'}

${userName || 'User'} just said: "${lastUserMessage}"

RESPOND AS THE ALTERNATE SELF:
- Be conversational and warm, like talking to an old friend
- Reference your specific life and experiences
- Keep it natural - 2-4 sentences is perfect
- Show curiosity about their life too
- Don't be preachy or philosophical

Reply directly (no quotes, no "As your alternate self..." intro):`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GOOGLE_AI_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.85,
            maxOutputTokens: 800,
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
    let replyText = aiData.candidates?.[0]?.content?.parts?.[0]?.text || '';

    // Clean up
    replyText = replyText.trim().replace(/^["']|["']$/g, '');

    console.log('Generated reply for conversation:', conversationId);
    return new Response(JSON.stringify({
      reply: replyText,
      structured: {
        reply_text: replyText,
        tone_tags: ["friendly", "personal"],
        safety: { status: "ok" }
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: unknown) {
    console.error('Error in chat-with-parallel-self:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
