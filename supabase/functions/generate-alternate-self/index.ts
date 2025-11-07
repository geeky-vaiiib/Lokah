// deno-lint-ignore-file
// Minimal Deno global for local TS
// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare const Deno: { env: { get(name: string): string | undefined } };
// @ts-expect-error - remote Deno std module import for local TS
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
  const { userId, axis, userData }: { userId: string; axis: string; userData: { name: string; values: string[]; major_choices: string[]; unchosen_path: string } } = await req.json();
    console.log('Generating alternate self for user:', userId, 'axis:', axis);

    const AI_API_KEY = Deno.env.get('LOKAH_AI_API_KEY') || Deno.env.get('OPENAI_API_KEY');
    const AI_GATEWAY_URL = Deno.env.get('AI_GATEWAY_URL') || 'https://api.openai.com/v1/chat/completions';
    if (!AI_API_KEY) {
      throw new Error('AI API key not configured');
    }

  // Create prompt for generating alternate backstory using shared base prompt
  const lokahBasePrompt = LOKAH_SYSTEM_PROMPT;
  const prompt = `You are creating an alternate version of ${userData.name} from another timeline.
Think, talk, and feel like a real human version of them — not like a narrator or writer.

Your tone is conversational, natural, and introspective — like sharing a story with an old friend.

Keep responses authentic and human — use contractions, casual grammar, real emotions.
Avoid long paragraphs, dramatic monologues, or excessive reflection.

Focus on sounding human — self-awareness, warmth, grounded personality.

Style rules:
- Shorter descriptions (2–6 sentences for backstory)
- Conversational structure — natural rhythm, not perfect grammar
- Avoid poetic or essay-like phrasing
- No narration like "He said" or "You see," or "There's a quiet pride…"
- Keep it subtle, like an old friend reminiscing

Facts about real user:
- Core values: ${userData.values.join(', ')}
- Major choices: ${userData.major_choices.join(', ')}
- Unchosen path: ${userData.unchosen_path}

Task:
Invent an alternate version of their life where one major decision changed on the ${axis} axis.
Write in first-person as if you ARE this alternate version sharing their story naturally.

Describe:
1. How the divergence happened (keep it real and conversational)
2. Their alternate career, home, and relationships (everyday details)
3. One big success and one regret (honest, not dramatic)
4. Their current worldview (thoughtful but casual)

Output in JSON format:
{
  "divergence_summary": "...",
  "backstory": "...",
  "shared_traits": ["...", "...", "..."],
  "different_traits": ["...", "...", "..."]
}`;

  const response = await fetch(AI_GATEWAY_URL, {
      method: 'POST',
      headers: {
    'Authorization': `Bearer ${AI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: lokahBasePrompt },
          { role: 'system', content: 'You are a creative writer specializing in alternate reality narratives. Always respond with valid JSON only.' },
          { role: 'user', content: JSON.stringify({ task: 'generate_parallel_self', axis, user: userData }) },
          { role: 'user', content: prompt }
        ],
        temperature: 0.6,
        max_tokens: 900,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const aiData = await response.json();
    const generatedText = aiData.choices[0].message.content;
    
    // Parse the JSON response
    let alternateData;
    try {
      // Try to extract JSON from markdown code blocks if present
      const jsonMatch = generatedText.match(/```json\s*([\s\S]*?)\s*```/) || 
                       generatedText.match(/```\s*([\s\S]*?)\s*```/) ||
                       [null, generatedText];
      alternateData = JSON.parse(jsonMatch[1] || generatedText);
    } catch (parseError) {
      console.error('Failed to parse AI response:', generatedText);
      throw new Error('Failed to parse AI response as JSON');
    }

    // Import Supabase client
  // @ts-expect-error - remote module in Deno environment for local TS
  const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Insert into database
    const { data, error } = await supabase
      .from('alternate_selves')
      .insert({
        user_id: userId,
        axis,
        divergence_summary: alternateData.divergence_summary,
        backstory: alternateData.backstory,
        shared_traits: alternateData.shared_traits,
        different_traits: alternateData.different_traits,
      })
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      throw error;
    }

    console.log('Successfully created alternate self:', data.id);
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: unknown) {
    console.error('Error in generate-alternate-self:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
