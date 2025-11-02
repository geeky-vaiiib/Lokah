-- Comprehensive Onboarding Schema Migration
-- Adds all 42+ fields needed for the complete onboarding flow

-- Basic identity and location fields
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS pronouns TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS display_name_preference TEXT DEFAULT 'real';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS country TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS state TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS birth_year INTEGER;

-- Education and career fields
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS highest_education TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS field_of_study TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS current_occupation TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS career_highlight TEXT;

-- Family and social context fields
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS family_status TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS children INTEGER DEFAULT 0;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS household_members TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS family_economic_background TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS family_issues TEXT[] DEFAULT '{}';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS family_issues_notes TEXT;

-- Life choices and values
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS defining_moments TEXT[] DEFAULT '{}';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS life_challenges TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS life_regret TEXT;

-- Economic situation
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS current_economic_status TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS employment_security TEXT;

-- Identity and culture
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS ethnicity TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS religion_or_spirituality TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS personality_vector JSONB;

-- Privacy and safety
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS has_experienced_trauma BOOLEAN DEFAULT false;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS trauma_brief_note TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS content_sensitivity_preference TEXT DEFAULT 'gentle';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS share_anonymized BOOLEAN DEFAULT false;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS store_memories BOOLEAN DEFAULT true;

-- Tracking
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP WITH TIME ZONE;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_values_gin ON public.users USING GIN (values);
CREATE INDEX IF NOT EXISTS idx_users_major_choices_gin ON public.users USING GIN (major_choices);
CREATE INDEX IF NOT EXISTS idx_users_languages_spoken_gin ON public.users USING GIN (languages_spoken);
