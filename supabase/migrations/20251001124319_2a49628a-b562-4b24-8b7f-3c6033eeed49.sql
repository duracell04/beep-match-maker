-- Fix search_path security warnings by dropping and recreating functions with proper search_path

-- Drop existing functions
DROP FUNCTION IF EXISTS public.cleanup_expired_sessions();
DROP FUNCTION IF EXISTS public.update_event_stats(TEXT);

-- Recreate cleanup function with fixed search_path
CREATE OR REPLACE FUNCTION public.cleanup_expired_sessions()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM sessions
  WHERE expires_at < now();
END;
$$;

-- Recreate update stats function with fixed search_path
CREATE OR REPLACE FUNCTION public.update_event_stats(p_event_code TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE events
  SET participant_count = (
    SELECT COUNT(DISTINCT token)
    FROM sessions
    WHERE event_code = p_event_code
  )
  WHERE code = p_event_code;
END;
$$;