-- Entity Table: Meal Plans
-- Auto-generated from IdeaLaunch pipeline
-- Uses DROP + CREATE to handle reruns where the AI may generate a different schema.

DROP TABLE IF EXISTS public.entities CASCADE;

CREATE TABLE public.entities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,

  -- Meal Plan fields
  plan_name TEXT NOT NULL,
  dietary_restrictions TEXT[],
  nutritional_goals TEXT[],
  generation_date DATE NOT NULL,
  available_ingredients TEXT[],
  total_calories INTEGER,
  recipes TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  is_favorite BOOLEAN DEFAULT FALSE,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_entities_user_id ON public.entities(user_id);
CREATE INDEX idx_entities_status ON public.entities(status);
CREATE INDEX idx_entities_created_at ON public.entities(created_at DESC);

-- Auto-update updated_at trigger
CREATE OR REPLACE FUNCTION update_entity_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS entities_updated_at ON public.entities;
CREATE TRIGGER entities_updated_at
  BEFORE UPDATE ON public.entities
  FOR EACH ROW EXECUTE FUNCTION update_entity_updated_at();

-- RLS Policies
ALTER TABLE public.entities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own entities"
  ON public.entities FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own entities"
  ON public.entities FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own entities"
  ON public.entities FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own entities"
  ON public.entities FOR DELETE
  USING (auth.uid() = user_id);
