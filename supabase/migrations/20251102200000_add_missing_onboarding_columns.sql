-- Add missing onboarding columns
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS cultural_background TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS allow_data_usage BOOLEAN DEFAULT FALSE;
