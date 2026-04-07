
CREATE TABLE public.bvi_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  business_name TEXT NOT NULL,
  first_name TEXT NOT NULL,
  email TEXT NOT NULL,
  total_score INTEGER NOT NULL,
  band_name TEXT NOT NULL,
  score_processes INTEGER NOT NULL DEFAULT 0,
  score_relationships INTEGER NOT NULL DEFAULT 0,
  score_owner_independence INTEGER NOT NULL DEFAULT 0,
  score_financials INTEGER NOT NULL DEFAULT 0,
  score_independent_team INTEGER NOT NULL DEFAULT 0,
  score_technology INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.bvi_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert bvi responses"
ON public.bvi_responses
FOR INSERT
WITH CHECK (true);
