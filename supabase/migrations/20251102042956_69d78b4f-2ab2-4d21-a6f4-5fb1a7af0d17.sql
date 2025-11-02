-- Lokah Schema Enhancement: Add comprehensive user profiling columns

-- Add new columns to users table for detailed onboarding
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS pronouns text;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS country text;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS state text;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS city text;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS highest_education text;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS field_of_study text;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS current_occupation text;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS family_status text;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS family_issues jsonb DEFAULT '[]'::jsonb;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS family_economic_background text;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS current_economic_status text;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS employment_security text;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS personality_vector jsonb DEFAULT '{}'::jsonb;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS religion_or_spirituality text;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS ethnicity text;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS languages_spoken text[] DEFAULT '{}'::text[];
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS life_regret text;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS life_challenges text;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS defining_moments text[] DEFAULT '{}'::text[];
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS allow_data_usage boolean DEFAULT true;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS completed_at timestamp with time zone;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_auth_user_id ON public.users(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_users_completed_at ON public.users(completed_at) WHERE completed_at IS NOT NULL;

-- Add comment for documentation
COMMENT ON TABLE public.users IS 'Lokah user profiles with comprehensive onboarding data for generating emotionally intelligent parallel selves';