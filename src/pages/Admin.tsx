import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEvent } from '@/contexts/EventContext';
import { BeepLogo } from '@/components/BeepLogo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getEventStats } from '@/lib/session';
import { Users, Activity } from 'lucide-react';
import { Loader2 } from 'lucide-react';

const Admin = () => {
  const { eventCode, clearEvent } = useEvent();
  const navigate = useNavigate();
  const [stats, setStats] = useState<{ participantCount: number; participants: any[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!eventCode) {
      navigate('/');
      return;
    }

    const fetchStats = async () => {
      try {
        const data = await getEventStats(eventCode);
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, [eventCode, navigate]);

  const handleLeaveEvent = () => {
    clearEvent();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-6 py-8">
        <Card className="shadow-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <BeepLogo variant="traffic" className="w-12 h-12 text-primary" />
                <div>
                  <CardTitle className="text-2xl">Event Dashboard</CardTitle>
                  <CardDescription>Code: {eventCode}</CardDescription>
                </div>
              </div>
              <Badge variant="outline" className="text-lg px-4 py-2">
                <Activity className="w-4 h-4 mr-2" />
                Live
              </Badge>
            </div>
          </CardHeader>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Participants
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-5xl font-bold text-primary">
                {stats?.participantCount || 0}
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Active users at this event
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Total Scans</span>
                <Badge variant="secondary">Coming Soon</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Avg Match Score</span>
                <Badge variant="secondary">Coming Soon</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest participants to join</CardDescription>
          </CardHeader>
          <CardContent>
            {stats?.participants && stats.participants.length > 0 ? (
              <div className="space-y-2">
                {stats.participants.slice(0, 10).map((p, i) => (
                  <div key={p.token} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <span className="text-sm font-mono">User #{i + 1}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(p.created_at).toLocaleTimeString()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No participants yet
              </p>
            )}
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => navigate('/myqr')}
            className="flex-1"
          >
            Back to My Code
          </Button>
          <Button
            variant="destructive"
            onClick={handleLeaveEvent}
          >
            Leave Event
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Admin;
