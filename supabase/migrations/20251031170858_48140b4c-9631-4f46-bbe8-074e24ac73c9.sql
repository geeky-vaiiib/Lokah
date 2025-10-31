-- Create profiles table for authenticated users
CREATE TABLE public.profiles (
  id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  email text,
  name text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create reflections table
CREATE TABLE public.reflections (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  alternate_self_id uuid NOT NULL REFERENCES public.alternate_selves ON DELETE CASCADE,
  conversation_id uuid NOT NULL REFERENCES public.conversations ON DELETE CASCADE,
  title text NOT NULL,
  insights jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.reflections ENABLE ROW LEVEL SECURITY;

-- Reflections policies
CREATE POLICY "Users can view their own reflections"
  ON public.reflections FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own reflections"
  ON public.reflections FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reflections"
  ON public.reflections FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reflections"
  ON public.reflections FOR DELETE
  USING (auth.uid() = user_id);

-- Create memory_snippets table
CREATE TABLE public.memory_snippets (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  alternate_self_id uuid NOT NULL REFERENCES public.alternate_selves ON DELETE CASCADE,
  conversation_id uuid NOT NULL REFERENCES public.conversations ON DELETE CASCADE,
  content text NOT NULL,
  emotional_tone text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.memory_snippets ENABLE ROW LEVEL SECURITY;

-- Memory snippets policies
CREATE POLICY "Users can view their own memory snippets"
  ON public.memory_snippets FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own memory snippets"
  ON public.memory_snippets FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own memory snippets"
  ON public.memory_snippets FOR DELETE
  USING (auth.uid() = user_id);

-- Add auth_user_id to existing tables
ALTER TABLE public.users ADD COLUMN auth_user_id uuid REFERENCES auth.users ON DELETE CASCADE;

-- Drop old policies using DO block
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Allow all access to alternate_selves" ON public.alternate_selves;
  DROP POLICY IF EXISTS "Allow all access to conversations" ON public.conversations;
  DROP POLICY IF EXISTS "Allow all access to users" ON public.users;
EXCEPTION
  WHEN undefined_object THEN
    NULL;
END $$;

-- Create new policies for alternate_selves
CREATE POLICY "Users can view their own alternate selves"
  ON public.alternate_selves FOR SELECT
  USING (
    user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid())
  );

CREATE POLICY "Users can create their own alternate selves"
  ON public.alternate_selves FOR INSERT
  WITH CHECK (
    user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid())
  );

CREATE POLICY "Users can update their own alternate selves"
  ON public.alternate_selves FOR UPDATE
  USING (
    user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid())
  );

CREATE POLICY "Users can delete their own alternate selves"
  ON public.alternate_selves FOR DELETE
  USING (
    user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid())
  );

-- Create new policies for conversations
CREATE POLICY "Users can view their own conversations"
  ON public.conversations FOR SELECT
  USING (
    user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid())
  );

CREATE POLICY "Users can create their own conversations"
  ON public.conversations FOR INSERT
  WITH CHECK (
    user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid())
  );

CREATE POLICY "Users can update their own conversations"
  ON public.conversations FOR UPDATE
  USING (
    user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid())
  );

CREATE POLICY "Users can delete their own conversations"
  ON public.conversations FOR DELETE
  USING (
    user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid())
  );

-- Create new policies for users table
CREATE POLICY "Users can view their own user record"
  ON public.users FOR SELECT
  USING (auth_user_id = auth.uid());

CREATE POLICY "Users can create their own user record"
  ON public.users FOR INSERT
  WITH CHECK (auth_user_id = auth.uid());

CREATE POLICY "Users can update their own user record"
  ON public.users FOR UPDATE
  USING (auth_user_id = auth.uid());

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'name', new.email)
  );
  RETURN new;
END;
$$;

-- Trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create indexes
CREATE INDEX idx_reflections_user_id ON public.reflections(user_id);
CREATE INDEX idx_reflections_alternate_self_id ON public.reflections(alternate_self_id);
CREATE INDEX idx_memory_snippets_user_id ON public.memory_snippets(user_id);
CREATE INDEX idx_memory_snippets_alternate_self_id ON public.memory_snippets(alternate_self_id);
CREATE INDEX idx_users_auth_user_id ON public.users(auth_user_id);