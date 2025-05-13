-- Add prompts_used and prompts_limit columns to users table
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS prompts_used INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS prompts_limit INTEGER DEFAULT 5;

-- Update existing users to have the default limit
UPDATE public.users
SET prompts_limit = 5
WHERE prompts_limit IS NULL;

-- Update existing users to have 0 prompts used if null
UPDATE public.users
SET prompts_used = 0
WHERE prompts_used IS NULL;
