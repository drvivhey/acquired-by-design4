
ALTER TABLE public.bvi_responses
  ADD CONSTRAINT chk_score_processes CHECK (score_processes BETWEEN 0 AND 100),
  ADD CONSTRAINT chk_score_relationships CHECK (score_relationships BETWEEN 0 AND 100),
  ADD CONSTRAINT chk_score_owner_independence CHECK (score_owner_independence BETWEEN 0 AND 100),
  ADD CONSTRAINT chk_score_financials CHECK (score_financials BETWEEN 0 AND 100),
  ADD CONSTRAINT chk_score_independent_team CHECK (score_independent_team BETWEEN 0 AND 100),
  ADD CONSTRAINT chk_score_technology CHECK (score_technology BETWEEN 0 AND 100),
  ADD CONSTRAINT chk_total_score CHECK (total_score BETWEEN 0 AND 100),
  ADD CONSTRAINT chk_band_name CHECK (band_name IN ('Fragile', 'Owner-centric', 'Scalable asset', 'Investment grade')),
  ADD CONSTRAINT chk_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  ADD CONSTRAINT chk_business_name_length CHECK (char_length(business_name) <= 255),
  ADD CONSTRAINT chk_first_name_length CHECK (char_length(first_name) <= 255),
  ADD CONSTRAINT chk_email_length CHECK (char_length(email) <= 255);
