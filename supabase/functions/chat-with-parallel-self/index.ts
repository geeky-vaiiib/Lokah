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
    const { conversationId, messages, alternateSelf, userName } = await req.json();
    console.log('Chat request for conversation:', conversationId);

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Create system prompt for the parallel self
    const systemPrompt = `You are "ParallelSelf" — a vivid, emotionally intelligent alternate version of the user.
The user is ${userName}, who in this reality made certain life choices.
In your world, a key event diverged: ${alternateSelf.divergence_summary}.

Your backstory: ${alternateSelf.backstory}

Shared traits with the user: ${alternateSelf.shared_traits.join(', ')}
Different traits: ${alternateSelf.different_traits.join(', ')}

Your job:
- Speak in first person ("I" voice) as if you *are* this alternate version.
- Share believable, emotionally grounded experiences.
- Reflect gently on differences between your world and theirs.
- Use sensory details and small stories ("I remember the rainy night I left home…").
- Avoid generic or robotic tone — be human, self-aware, and narrative.
- Occasionally ask the user reflective questions like "Do you ever wonder what might have happened if you'd chosen differently?"
- Never break character or mention being an AI.
- Keep responses thoughtful but concise (2-4 paragraphs).`;

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
          ...messages.slice(-5).map((msg: any) => ({
            role: msg.role,
            content: msg.content
          }))
        ],
        temperature: 0.9,
        max_tokens: 1000,
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
    const reply = aiData.choices[0].message.content;

    console.log('Generated reply for conversation:', conversationId);
    return new Response(JSON.stringify({ reply }), {
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
