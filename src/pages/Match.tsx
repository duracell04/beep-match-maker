import { useLocation, useNavigate } from 'react-router-dom';
import { MatchResult as MatchResultComponent } from '@/components/MatchResult';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-card">
        <CardContent className="pt-6">
          <MatchResultComponent
            color={result.color}
            score={result.score}
            colorLabel={result.colorLabel}
          />
          <div className="space-y-3 mt-6">
            <Button
              onClick={() => navigate('/scan')}
              className="w-full"
              size="lg"
            >
              Scan Another
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/myqr')}
              className="w-full"
            >
              Back to My Code
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Match;
