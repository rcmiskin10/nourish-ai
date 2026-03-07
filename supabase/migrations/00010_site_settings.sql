-- ============================================
-- Site Settings (app-level key-value config)
-- ============================================
-- Used to store encrypted API keys and app configuration.
-- Only accessible via service_role (admin server actions).

CREATE TABLE IF NOT EXISTS public.site_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Service role only — admin actions use service role client
CREATE POLICY "Service role full access" ON public.site_settings
  FOR ALL USING (auth.role() = 'service_role');
