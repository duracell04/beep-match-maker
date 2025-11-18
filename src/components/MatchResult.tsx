import { MatchColor } from '@/lib/matcher';
import { MessageCircle, Sparkles } from 'lucide-react';

interface MatchResultProps {
  color: MatchColor;
  score: number;
  colorLabel: string;
  sharedTrait: string;
  conversationPrompt: string;
}

const palettes: Record<MatchColor, { gradient: string; glow: string; accentText: string }> = {
  green: {
    gradient: 'from-emerald-950 via-emerald-800 to-emerald-600',
    glow: 'bg-emerald-400/40',
    accentText: 'text-emerald-100',
  },
  yellow: {
    gradient: 'from-amber-900 via-amber-700 to-amber-500',
    glow: 'bg-amber-300/40',
    accentText: 'text-amber-100',
  },
  red: {
    gradient: 'from-rose-900 via-rose-700 to-rose-500',
    glow: 'bg-rose-400/40',
    accentText: 'text-rose-100',
  },
};

export const MatchResult = ({ color, score, colorLabel, sharedTrait, conversationPrompt }: MatchResultProps) => {
  const palette = palettes[color];
  const trafficLights: { id: MatchColor; className: string }[] = [
    { id: 'red', className: 'bg-rose-500' },
    { id: 'yellow', className: 'bg-amber-400' },
    { id: 'green', className: 'bg-emerald-400' },
  ];

  return (
    <div className={`relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br ${palette.gradient} p-8 md:p-12 text-white`}>
      <div className={`absolute inset-0 ${palette.glow} blur-3xl opacity-40`} />
      <div className="relative z-10 space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-8">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.4em] text-white/70">Magic Moment</p>
            <h2 className="text-4xl font-black leading-tight">{colorLabel}</h2>
            <p className={`text-lg font-medium ${palette.accentText}`}>
              {score}% Match · Green light to start talking
            </p>
            <div className="flex items-center gap-3">
              {trafficLights.map((light) => (
                <span
                  key={light.id}
                  className={`h-4 w-4 rounded-full transition ${light.id === color ? `${light.className} shadow-[0_0_20px_rgba(255,255,255,0.6)]` : 'bg-white/20'}`}
                />
              ))}
              <span className="text-xs uppercase tracking-[0.3em] text-white/60">Traffic Light Engine</span>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 blur-2xl opacity-60 bg-white/30" />
            <div className="relative flex h-40 w-40 flex-col items-center justify-center rounded-full border border-white/30 bg-white/10 backdrop-blur">
              <Sparkles className="h-6 w-6 mb-1 text-white/80" />
              <p className="text-5xl font-black leading-none">{score}%</p>
              <p className="text-xs uppercase tracking-[0.3em] text-white/70 mt-2">Match</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur">
            <p className="text-sm uppercase tracking-[0.3em] text-white/70">Why this sells</p>
            <p className="mt-3 text-lg text-white/90">
              Show prospects that the result screen doesn&apos;t just say &ldquo;matched&rdquo;—it scripts the
              first sentence so no one is awkward.
            </p>
            <p className="mt-4 text-sm text-white/70">
              The entire background glows green so the buyer instantly visualizes a win condition for their teams.
            </p>
          </div>

          <div className="rounded-3xl bg-white p-6 text-left text-slate-900 shadow-xl">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
              <MessageCircle className="h-4 w-4" />
              Conversation Starter
            </div>
            <p className="mt-3 text-xl font-bold text-slate-900">{sharedTrait}</p>
            <p className="mt-4 text-base text-slate-700">{conversationPrompt}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
