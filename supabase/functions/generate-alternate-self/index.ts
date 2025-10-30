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
    const { userId, axis, userData } = await req.json();
    console.log('Generating alternate self for user:', userId, 'axis:', axis);

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Create prompt for generating alternate backstory
    const prompt = `Create a believable alternate-reality version of ${userData.name}.

Facts about real user:
- Core values: ${userData.values.join(', ')}
- Major choices: ${userData.major_choices.join(', ')}
- Unchosen path: ${userData.unchosen_path}

Task:
Invent an alternate version of their life where one major decision changed on the ${axis} axis.
Describe:
1. How the divergence happened.
2. Their alternate career, home, and relationships.
3. One big success and one regret.
4. Their current worldview.
5. Keep the tone vivid, introspective, and first-person.

Output in JSON format:
{
  "divergence_summary": "...",
  "backstory": "...",
  "shared_traits": ["...", "...", "..."],
  "different_traits": ["...", "...", "..."]
}`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: 'You are a creative writer specializing in alternate reality narratives. Always respond with valid JSON only.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.9,
        max_tokens: 1500,
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

  } catch (error: any) {
    console.error('Error in generate-alternate-self:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
