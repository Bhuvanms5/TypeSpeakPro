-- COMBINED UPDATE SCRIPT
-- Run this entire script in your Supabase SQL Editor to ensure your database is up to date.

-- 1. Create 'users' table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.users (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text UNIQUE NOT NULL,
  name text,
  picture text,
  google_sub text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Add 'country' column to 'users' if it is missing
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'country') THEN
        ALTER TABLE public.users ADD COLUMN country text DEFAULT 'IN';
    END IF;
END $$;

-- 3. Create 'test_results' table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.test_results (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.users(id) NOT NULL,
  wpm integer NOT NULL,
  accuracy integer NOT NULL,
  error_count integer NOT NULL,
  time_duration integer NOT NULL,
  mode text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_results ENABLE ROW LEVEL SECURITY;

-- 5. Create Policies (Drop existing to avoid conflicts if re-running, or use IF NOT EXISTS logic complexity)
-- Simpler approach: Create policies only if they don't throw errors (or just ignore policy creation errors manually)
-- For this script, we'll try to create them. If they exist, it might error, which is fine.

BEGIN;
  DROP POLICY IF EXISTS "Allow public read-write access to users" ON public.users;
  CREATE POLICY "Allow public read-write access to users" ON public.users FOR ALL USING (true) WITH CHECK (true);
  
  DROP POLICY IF EXISTS "Allow public read-write access to test_results" ON public.test_results;
  CREATE POLICY "Allow public read-write access to test_results" ON public.test_results FOR ALL USING (true) WITH CHECK (true);
COMMIT;
