import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEvent } from '@/contexts/EventContext';
import { useQuiz } from '@/contexts/QuizContext';
import { BeepLogo } from '@/components/BeepLogo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { generateToken, saveSession } from '@/lib/session';
import QRCode from 'qrcode';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const MyQR = () => {
  const { eventCode } = useEvent();
  const { answers, isComplete } = useQuiz();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [currentToken, setCurrentToken] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!eventCode || !isComplete || !answers) {
      navigate('/');
      return;
    }

    const generateQR = async () => {
      try {
        const token = generateToken();
        await saveSession(token, eventCode, answers);
        const url = await QRCode.toDataURL(token, {
          width: 400,
          margin: 2,
          color: {
            dark: '#e11d48',
            light: '#ffffff',
          },
        });
        setQrDataUrl(url);
        setCurrentToken(token);
        setLoading(false);
      } catch (error) {
        console.error('Failed to generate QR:', error);
        toast({
          title: 'Error',
          description: 'Failed to generate QR code. Please try again.',
          variant: 'destructive',
        });
      }
    };

    generateQR();
    
    // Rotate QR every 90 seconds
    const interval = setInterval(generateQR, 90000);
    return () => clearInterval(interval);
  }, [eventCode, isComplete, answers, navigate, toast]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-card">
        <CardHeader className="text-center">
          <BeepLogo variant="scan" className="w-16 h-16 mx-auto mb-4 text-primary" />
          <CardTitle className="text-2xl">Your Beep Code</CardTitle>
          <CardDescription>
            Let others scan your code to see your match result
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-inner flex items-center justify-center">
            {qrDataUrl && (
              <img
                src={qrDataUrl}
                alt="Your QR Code"
                className="w-full max-w-xs"
              />
            )}
          </div>
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              This code rotates every 90 seconds for security
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => navigate('/scan')}
              >
                Scan Someone
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/admin')}
              >
                Admin
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MyQR;
