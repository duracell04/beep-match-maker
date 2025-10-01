import { MatchColor } from '@/lib/matcher';
import { Heart, Sparkles, X } from 'lucide-react';

interface MatchResultProps {
  color: MatchColor;
  score: number;
  colorLabel: string;
}

export const MatchResult = ({ color, score, colorLabel }: MatchResultProps) => {
  const colorStyles = {
    green: 'bg-success/20 border-success text-success',
    yellow: 'bg-warning/20 border-warning text-warning',
    red: 'bg-destructive/20 border-destructive text-destructive',
  };

  const Icon = color === 'green' ? Heart : color === 'yellow' ? Sparkles : X;

  return (
    <div className="flex flex-col items-center gap-6 py-8">
      <div
        className={`relative w-48 h-48 rounded-full border-8 ${colorStyles[color]} flex items-center justify-center shadow-glow`}
      >
        <div className="text-center">
          <Icon className="w-16 h-16 mx-auto mb-2" />
          <div className="text-5xl font-bold">{score}%</div>
        </div>
        <div className="absolute inset-0 rounded-full animate-pulse" style={{ opacity: 0.2 }} />
      </div>
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">{colorLabel}</h2>
        <p className="text-muted-foreground max-w-md">
          {color === 'green' && 'High compatibility - great chemistry potential!'}
          {color === 'yellow' && 'Some common ground - worth exploring further.'}
          {color === 'red' && 'Limited compatibility based on preferences.'}
        </p>
      </div>
    </div>
  );
};
