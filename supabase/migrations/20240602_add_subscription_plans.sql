-- Add subscription_plan column to users table
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS subscription_plan TEXT DEFAULT 'free',
ADD COLUMN IF NOT EXISTS plan_start_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN IF NOT EXISTS plan_end_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS daily_prompts_used INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_prompt_date DATE DEFAULT CURRENT_DATE;

-- Create saved_prompts table
CREATE TABLE IF NOT EXISTS public.saved_prompts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id),
    prompt TEXT NOT NULL,
    enhanced_prompt TEXT,
    title TEXT,
    tags TEXT[],
    use_count INTEGER DEFAULT 1,
    is_favorite BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add RLS policy for saved_prompts
ALTER TABLE public.saved_prompts ENABLE ROW LEVEL SECURITY;

-- Create policy for saved_prompts
DROP POLICY IF EXISTS "Users can manage their own prompts";
CREATE POLICY "Users can manage their own prompts"
ON public.saved_prompts
FOR ALL
USING (auth.uid() = user_id);

-- Add realtime for saved_prompts
alter publication supabase_realtime add table saved_prompts;

-- Update existing users to have the free plan with 15 prompts limit
UPDATE public.users
SET subscription_plan = 'free', prompts_limit = 15
WHERE subscription_plan IS NULL;
