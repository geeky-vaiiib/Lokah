// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { LOKAH_SYSTEM_PROMPT } from "../_shared/prompt.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
  const { conversationId, messages, alternateSelf, userName, mode } = await req.json();
    console.log('Chat request for conversation:', conversationId);

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
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
      conversation_history: (messages || []).slice(-10).map((m: any) => ({ role: m.role, text: m.content, timestamp: m.timestamp || null })),
      task: 'chat_turn',
      safety_flags: { content_sensitivity: 'direct', allow_data_usage: true }
    };

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Context:\n${JSON.stringify(contextBlob, null, 2)}` },
          ...messages.slice(-5).map((msg: any) => ({
            role: msg.role,
            content: msg.content
          }))
        ],
        temperature: mode === 'therapy' ? 0.4 : mode === 'concise' ? 0.3 : 0.7,
        max_tokens: 800,
        top_p: 1,
        presence_penalty: 0.3,
        frequency_penalty: 0.3,
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
    let raw = aiData.choices[0].message.content as string;
    let reply = raw;
    let structured: any = null;
    // Try to parse structured Lokah response per system prompt; fallback to raw text
    const tryParse = (text: string) => {
      try {
        const parsed = JSON.parse(text);
        return parsed && typeof parsed === 'object' ? parsed : null;
      } catch {
        return null;
      }
    };
    structured = tryParse(raw);
    if (structured?.reply_text) reply = structured.reply_text;

    // One-time retry: ask model to reformat as valid JSON if first parse failed
    if (!structured) {
      const retryRes = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${LOVABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash',
          messages: [
            { role: 'system', content: systemPrompt + '\nAlways output a valid JSON object following the required schema.' },
            { role: 'user', content: `Context:\n${JSON.stringify(contextBlob, null, 2)}` },
            ...messages.slice(-5).map((msg: any) => ({ role: msg.role, content: msg.content }))
          ],
          temperature: mode === 'therapy' ? 0.4 : mode === 'concise' ? 0.3 : 0.7,
          max_tokens: 800,
          top_p: 1,
          presence_penalty: 0.3,
          frequency_penalty: 0.3,
        }),
      });
      if (retryRes.ok) {
        const retryData = await retryRes.json();
        raw = retryData.choices[0].message.content as string;
        structured = tryParse(raw);
        if (structured?.reply_text) reply = structured.reply_text;
      }
    }

    console.log('Generated reply for conversation:', conversationId);
  return new Response(JSON.stringify({ reply, structured }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Error in chat-with-parallel-self:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
