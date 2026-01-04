// deno-lint-ignore-file
declare const Deno: { env: { get(name: string): string | undefined } };
// @ts-expect-error - Deno remote module import
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { LOKAH_SYSTEM_PROMPT } from "../_shared/prompt.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface UserData {
  name?: string;
  age?: number;
  gender?: string;
  country?: string;
  city?: string;
  education?: string;
  fieldOfStudy?: string;
  occupation?: string;
  familyStatus?: string;
  religion?: string;
  personalityType?: string;
  values?: string[];
  major_choices?: string[];
  unchosen_path?: string;
  life_regret?: string;
  life_challenges?: string;
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId, axis, divergencePoint, userData }: { userId: string; axis: string; divergencePoint?: string; userData: UserData } = await req.json();
    console.log('Generating alternate self for user:', userId, 'axis:', axis);

    const GOOGLE_AI_KEY = Deno.env.get('GOOGLE_AI_API_KEY');
    if (!GOOGLE_AI_KEY) {
      throw new Error('Google AI API key not configured');
    }

    // Build comprehensive user profile
    const userProfile = `
ABOUT THE REAL USER:
- Name: ${userData.name || 'Unknown'}
- Age: ${userData.age || 'Not specified'}
- Gender: ${userData.gender || 'Not specified'}
- Location: ${userData.city || 'Unknown city'}, ${userData.country || 'Unknown country'}
- Education: ${userData.education || 'Not specified'} in ${userData.fieldOfStudy || 'general studies'}
- Current job: ${userData.occupation || 'Not specified'}
- Family status: ${userData.familyStatus || 'Not specified'}
- Religious/spiritual: ${userData.religion || 'Not specified'}
- Personality type: ${userData.personalityType || 'Not specified'}
- Core values: ${userData.values?.join(', ') || 'growth, curiosity'}
- Major life choices made: ${userData.major_choices?.join('; ') || 'various decisions'}
- Path they didn't take: ${userData.unchosen_path || 'alternative paths'}
- Life regrets: ${userData.life_regret || 'None shared'}
- Life challenges: ${userData.life_challenges || 'None shared'}
`.trim();

    const prompt = `${LOKAH_SYSTEM_PROMPT}

${userProfile}

THE DIVERGENCE:
- Category: ${axis}
- Specific divergence point: ${divergencePoint || 'A different path in ' + axis}

YOUR TASK:
Create a vivid, personal alternate version of ${userData.name || 'this person'}. This parallel self made a different choice at the divergence point and now lives a different life.

Write as the ALTERNATE SELF speaking in first person. Be specific, personal, and authentic.

Include realistic details about:
- How exactly the divergence happened (the specific moment/decision)
- Where they live now and what they do
- Their daily life, relationships, small joys and frustrations
- What they wonder about their other self (the user)

IMPORTANT: Sound like a real person, not a story. Use casual language, contractions, specific details.

Respond with ONLY this JSON (no markdown):
{
  "divergence_summary": "2-3 sentences explaining specifically how your life diverged based on the divergence point",
  "backstory": "A 4-5 sentence personal story from your perspective as the alternate self. Be specific about your life - job title, city name, relationship status, daily routines. Make it feel real and grounded.",
  "shared_traits": ["3 personality traits you share with the real user"],
  "different_traits": ["3 ways your experiences have made you different"]
}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GOOGLE_AI_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 2000,
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
    const generatedText = aiData.candidates?.[0]?.content?.parts?.[0]?.text || '';

    let alternateData;
    try {
      const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
      alternateData = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
      if (!alternateData) throw new Error('No JSON found');
    } catch {
      console.error('Failed to parse AI response:', generatedText);
      // Fallback with user's data
      alternateData = {
        divergence_summary: divergencePoint
          ? `When it came to ${axis}, I chose differently. ${divergencePoint} That decision changed everything about where I am today.`
          : `In this timeline, I made a different choice about ${axis} and it led me down a completely different path.`,
        backstory: `Life's funny, you know? ${userData.occupation ? `While you ended up as a ${userData.occupation}` : 'While you took one path'}, I went the other direction. ${userData.city ? `I'm not in ${userData.city} anymore` : 'I moved somewhere unexpected'}. My days look different now. I sometimes wonder what it would be like to have made your choice instead - but then again, you probably wonder about mine too.`,
        shared_traits: userData.values?.slice(0, 3) || ["curious", "determined", "thoughtful"],
        different_traits: ["took a different path in " + axis, "developed different daily routines", "built different relationships"]
      };
    }

    // @ts-expect-error - remote module
    const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

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
