// Deno edge function types (minimal) for local type checking
// deno-lint-ignore-file
declare const Deno: {
  env: { get(name: string): string | undefined };
};
// Provide a module declaration so TS doesn't error locally
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// @ts-expect-error - Deno remote module import for local TS
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { LOKAH_SYSTEM_PROMPT } from "../_shared/prompt.ts";

interface IncomingMessage {
  role: "user" | "assistant" | string;
  content: string;
  timestamp?: string;
}

interface ChatInvokePayload {
  conversationId?: string;
  messages?: IncomingMessage[];
  alternateSelf?: {
    id?: string;
    axis?: string;
    backstory?: string;
    divergence_summary?: string;
  };
  userName?: string;
  mode?: string;
}

interface StructuredAIReply {
  reply_text: string;
  tone_tags?: string[];
  action_suggestions?: string[];
  memory_candidates?: unknown[];
  safety?: { status?: string };
  [key: string]: unknown;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
  const { conversationId, messages, alternateSelf, userName, mode }: ChatInvokePayload = await req.json();
    console.log('Chat request for conversation:', conversationId);

  const AI_API_KEY = Deno.env.get('LOKAH_AI_API_KEY') || Deno.env.get('OPENAI_API_KEY');
  const AI_GATEWAY_URL = Deno.env.get('AI_GATEWAY_URL') || 'https://api.openai.com/v1/chat/completions';
    if (!AI_API_KEY) {
      throw new Error('AI API key not configured');
    }

  // Lokah shared system prompt
  const systemPrompt = LOKAH_SYSTEM_PROMPT;

    const contextBlob = {
      user: { id: conversationId || "unknown", name: userName || "Friend" },
      profile: {},
      parallel_self: {
        id: alternateSelf?.id || "alt",
        divergence_axes: { career: null, location: null, relationships: null, education: null, values: null, axis: alternateSelf?.axis || null },
        backstory: alternateSelf?.backstory || "",
        core_traits: [],
        memory_snippets: [],
        emotion_profile: []
      },
  conversation_history: (messages || []).slice(-10).map((m) => ({ role: m.role, text: m.content, timestamp: m.timestamp || null })),
      task: 'chat_turn',
      safety_flags: { content_sensitivity: 'direct', allow_data_usage: true }
    };

    // Build a compact context and last user message
  const lastUserMessage = (messages || []).slice().reverse().find((m) => m.role === 'user')?.content || '';

    const response = await fetch(AI_GATEWAY_URL, {
      method: 'POST',
      headers: {
  'Authorization': `Bearer ${AI_API_KEY}`,
        'Content-Type': 'application/json',
      },
    body: JSON.stringify({
  model: 'gpt-4-turbo',
  temperature: 0.6,
  top_p: 0.9,
  presence_penalty: 0.2,
  frequency_penalty: 0.2,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: JSON.stringify({ context: { ...contextBlob, mode, tone_preference: 'friendly' }, user_message: lastUserMessage }) }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({
          error: 'Rate limit exceeded. Please try again in a moment.'
        }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({
          error: 'AI credits depleted. Please add credits to continue.'
        }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const aiData = await response.json();
    const raw = (aiData.choices?.[0]?.message?.content as string) || "";
    let output: StructuredAIReply;
    try {
      output = JSON.parse(raw) as StructuredAIReply;
    } catch (_) {
      // Minimal fallback if model fails to return JSON
      output = {
        reply_text: raw || "Got it.",
        tone_tags: ["friendly"],
        action_suggestions: [],
        memory_candidates: [],
        safety: { status: "ok" }
      };
    }

    console.log('Generated reply for conversation:', conversationId);
    return new Response(JSON.stringify({ reply: output.reply_text, structured: output }), {
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
