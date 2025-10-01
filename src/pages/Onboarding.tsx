import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEvent } from '@/contexts/EventContext';
import { BeepLogo } from '@/components/BeepLogo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const Onboarding = () => {
  const [code, setCode] = useState('');
  const { setEventCode } = useEvent();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleJoin = () => {
    if (code.length !== 4) {
      toast({
        title: 'Invalid Code',
        description: 'Please enter a 4-digit event code.',
        variant: 'destructive',
      });
      return;
    }

    setEventCode(code.toUpperCase());
    navigate('/quiz');
  };

  return (
    <div className="min-h-screen bg-background gradient-hero flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-card">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <BeepLogo variant="ping" className="w-24 h-24 text-primary" />
          </div>
          <CardTitle className="text-4xl gradient-primary bg-clip-text text-transparent">
            Welcome to Beep
          </CardTitle>
          <CardDescription className="text-lg">
            The 0-swipe dating experience
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="eventCode">Event Code</Label>
            <Input
              id="eventCode"
              type="text"
              placeholder="Enter 4-digit code"
              maxLength={4}
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className="text-center text-2xl tracking-widest font-mono"
            />
          </div>
          <Button
            onClick={handleJoin}
            className="w-full"
            size="lg"
            disabled={code.length !== 4}
          >
            Join Event
          </Button>
          <p className="text-sm text-center text-muted-foreground">
            Enter the code provided by your event host
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Onboarding;
