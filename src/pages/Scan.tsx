import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEvent } from '@/contexts/EventContext';
import { useQuiz } from '@/contexts/QuizContext';
import { Html5Qrcode } from 'html5-qrcode';
import { BeepLogo } from '@/components/BeepLogo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getSessionByToken } from '@/lib/session';
import { calculateMatch } from '@/lib/matcher';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Camera } from 'lucide-react';

const Scan = () => {
  const { eventCode } = useEvent();
  const { answers } = useQuiz();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [scanning, setScanning] = useState(false);
  const [loading, setLoading] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const qrReaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!eventCode || !answers) {
      navigate('/');
      return;
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(console.error);
      }
    };
  }, [eventCode, answers, navigate]);

  const startScanning = async () => {
    if (!qrReaderRef.current) return;

    try {
      setScanning(true);
      const scanner = new Html5Qrcode('qr-reader');
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        async (decodedText) => {
          setLoading(true);
          try {
            await scanner.stop();
            const otherUserAnswers = await getSessionByToken(decodedText);

            if (!otherUserAnswers) {
              toast({
                title: 'Invalid Code',
                description: 'Could not find this user. Please try again.',
                variant: 'destructive',
              });
              setScanning(false);
              setLoading(false);
              return;
            }

            if (otherUserAnswers.eventCode !== eventCode) {
              toast({
                title: 'Wrong Event',
                description: 'This person is at a different event.',
                variant: 'destructive',
              });
              setScanning(false);
              setLoading(false);
              return;
            }

            const result = calculateMatch(answers!, otherUserAnswers);
            navigate('/match', { state: result });
          } catch (error) {
            console.error('Scan error:', error);
            toast({
              title: 'Error',
              description: 'Failed to process scan. Please try again.',
              variant: 'destructive',
            });
            setLoading(false);
            setScanning(false);
          }
        },
        (errorMessage) => {
          // Ignore scanning errors, they happen constantly
        }
      );
    } catch (error) {
      console.error('Camera error:', error);
      toast({
        title: 'Camera Error',
        description: 'Could not access camera. Please check permissions.',
        variant: 'destructive',
      });
      setScanning(false);
    }
  };

  const stopScanning = () => {
    if (scannerRef.current) {
      scannerRef.current.stop().then(() => {
        setScanning(false);
      }).catch(console.error);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-card">
        <CardHeader className="text-center">
          <BeepLogo variant="scan" className="w-16 h-16 mx-auto mb-4 text-primary" />
          <CardTitle className="text-2xl">Scan a Beep Code</CardTitle>
          <CardDescription>
            Point your camera at someone's QR code to see your match
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div
            ref={qrReaderRef}
            id="qr-reader"
            className={`w-full rounded-lg overflow-hidden ${scanning ? 'bg-black' : 'bg-muted'} aspect-square flex items-center justify-center`}
          >
            {!scanning && !loading && (
              <Camera className="w-16 h-16 text-muted-foreground" />
            )}
            {loading && (
              <Loader2 className="w-12 h-12 animate-spin text-primary" />
            )}
          </div>

          <div className="space-y-2">
            {!scanning && !loading && (
              <Button onClick={startScanning} className="w-full" size="lg">
                <Camera className="mr-2" />
                Start Camera
              </Button>
            )}
            {scanning && (
              <Button onClick={stopScanning} variant="destructive" className="w-full" size="lg">
                Stop Scanning
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => navigate('/myqr')}
              className="w-full"
              disabled={loading}
            >
              Back to My Code
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Scan;
