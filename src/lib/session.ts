import { supabase } from '@/integrations/supabase/client';
import { QuizAnswers } from '@/data/questions';

/**
 * Generate a random UUID token for QR codes
 */
export function generateToken(): string {
  return crypto.randomUUID();
}

/**
 * Save a session to the backend
 */
export async function saveSession(token: string, eventCode: string, answers: QuizAnswers) {
  const { data, error } = await supabase
    .from('sessions')
    .insert({
      token,
      event_code: eventCode,
      answers: answers as any,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Fetch a session by token
 */
export async function getSessionByToken(token: string): Promise<QuizAnswers | null> {
  const { data, error } = await supabase
    .from('sessions')
    .select('answers, event_code')
    .eq('token', token)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return data.answers as unknown as QuizAnswers;
}

/**
 * Get event stats for admin view
 */
export async function getEventStats(eventCode: string) {
  const { data: sessions, error } = await supabase
    .from('sessions')
    .select('token, created_at')
    .eq('event_code', eventCode);

  if (error) throw error;

  return {
    participantCount: sessions?.length || 0,
    participants: sessions || [],
  };
}
