-- Create sessions table for storing QR scan data
CREATE TABLE IF NOT EXISTS public.sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token TEXT UNIQUE NOT NULL,
  event_code TEXT NOT NULL,
  answers JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ DEFAULT (now() + interval '4 hours')
);

-- Index for fast token lookups
CREATE INDEX IF NOT EXISTS idx_sessions_token ON public.sessions(token);
CREATE INDEX IF NOT EXISTS idx_sessions_event_code ON public.sessions(event_code);
CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON public.sessions(expires_at);

-- Enable Row Level Security
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert sessions (no auth required for MVP)
CREATE POLICY "Anyone can create sessions"
  ON public.sessions
  FOR INSERT
  WITH CHECK (true);

-- Allow anyone to read sessions (needed for QR scanning)
CREATE POLICY "Anyone can read sessions"
  ON public.sessions
  FOR SELECT
  USING (true);

-- Clean up expired sessions function
CREATE OR REPLACE FUNCTION public.cleanup_expired_sessions()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM public.sessions
  WHERE expires_at < now();
END;
$$;

-- Create events table for tracking event stats
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  participant_count INTEGER DEFAULT 0,
  avg_match_score DECIMAL(5,2) DEFAULT 0.0
);

-- Enable RLS for events
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Public read access for events
CREATE POLICY "Anyone can read events"
  ON public.events
  FOR SELECT
  USING (true);

-- Only allow inserts (event creation is implicit)
CREATE POLICY "Anyone can create events"
  ON public.events
  FOR INSERT
  WITH CHECK (true);

-- Function to update event stats
CREATE OR REPLACE FUNCTION public.update_event_stats(p_event_code TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.events
  SET participant_count = (
    SELECT COUNT(DISTINCT token)
    FROM public.sessions
    WHERE event_code = p_event_code
  )
  WHERE code = p_event_code;
END;
$$;