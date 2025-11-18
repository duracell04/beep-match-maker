import { useLocation, useNavigate } from 'react-router-dom';
import { MatchResult as MatchResultComponent } from '@/components/MatchResult';
import { Button } from '@/components/ui/button';
import { MatchResult } from '@/lib/matcher';

const Match = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state as MatchResult;

  if (!result) {
    navigate('/');
    return null;
  }

  return (
    <div className={`min-h-screen bg-gradient-to-b ${result.color === 'green' ? 'from-emerald-950 via-slate-950 to-slate-900' : 'from-slate-950 to-slate-900'} flex items-center justify-center p-4`}>
      <div className="w-full max-w-4xl space-y-6">
        <MatchResultComponent
          color={result.color}
          score={result.score}
          colorLabel={result.colorLabel}
          sharedTrait={result.sharedTrait}
          conversationPrompt={result.conversationPrompt}
        />
        <div className="grid gap-3 md:grid-cols-2">
          <Button
            onClick={() => navigate('/scan')}
            className="h-16 text-lg font-semibold tracking-wide"
            size="lg"
          >
            Scan Another
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/myqr')}
            className="h-16 text-lg font-semibold tracking-wide bg-white/10 text-white border-white/40 hover:bg-white/20"
          >
            Back to My QR
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Match;
