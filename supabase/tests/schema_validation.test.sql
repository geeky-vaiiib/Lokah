-- Schema Validation Tests for Comprehensive Onboarding

-- Test: Verify all new columns exist
SELECT column_name FROM information_schema.columns
WHERE table_name = 'users' AND table_schema = 'public'
AND column_name IN ('pronouns', 'country', 'highest_education', 'personality_vector', 'completed_at');

-- Test: Basic insert and query operations work
BEGIN;
INSERT INTO public.users (id, auth_user_id, name, pronouns, country, city, highest_education, family_status, personality_vector, completed_at)
VALUES (gen_random_uuid(), gen_random_uuid(), 'Test User', 'they/them', 'Test Country', 'Test City', 'bachelor', 'single',
        '{"openness": 0.8, "conscientiousness": 0.7}', CURRENT_TIMESTAMP);

SELECT name, pronouns, country, highest_education FROM public.users WHERE name = 'Test User';
DELETE FROM public.users WHERE name = 'Test User';
ROLLBACK;
