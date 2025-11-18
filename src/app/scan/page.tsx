'use client';

import { useEffect, useRef, useState } from 'react';
import type { Html5Qrcode } from 'html5-qrcode';
import { useRouter } from 'next/navigation';
import { useEvent } from '@/contexts/EventContext';
import { useQuiz } from '@/contexts/QuizContext';
import { BeepLogo } from '@/components/BeepLogo';
import { Button } from '@/components/ui/button';
import { calculateMatch } from '@/lib/matcher';
import { getSessionByToken } from '@/lib/session';
import { useToast } from '@/hooks/use-toast';
import { useMatchResult } from '@/contexts/MatchContext';
import { Loader2, Camera } from 'lucide-react';

const ScanPage = () => {
  const { eventCode, isReady: isEventReady } = useEvent();
  const { answers, isReady: isQuizReady } = useQuiz();
  const { setResult } = useMatchResult();
  const router = useRouter();
  const { toast } = useToast();
  const [scanning, setScanning] = useState(false);
  const [loading, setLoading] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const qrReaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return () => {
      if (scannerRef.current && scanning) {
        scannerRef.current.stop().catch(() => undefined);
      }
    };
  }, [scanning]);

  useEffect(() => {
    if (isEventReady && isQuizReady && (!eventCode || !answers)) {
      router.replace('/onboarding');
    }
  }, [eventCode, answers, isEventReady, isQuizReady, router]);

  const startScanning = async () => {
    if (!qrReaderRef.current) return;

    try {
      setScanning(true);
      const { Html5Qrcode } = await import('html5-qrcode');
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
            if (scanner.isScanning) {
              await scanner.stop();
            }
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
            setResult(result);
            router.push('/match');
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
        () => undefined,
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
    if (scannerRef.current && scanning) {
      scannerRef.current
        .stop()
        .then(() => {
          setScanning(false);
        })
        .catch(() => {
          setScanning(false);
        });
    }
  };

  if (!isEventReady || !isQuizReady) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!eventCode || !answers) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6 rounded-[32px] border border-border bg-card p-6 shadow-card">
        <div className="text-center">
          <BeepLogo variant="scan" className="w-16 h-16 mx-auto mb-4 text-primary" />
          <h1 className="text-2xl font-bold">Scan a Beep Code</h1>
          <p className="text-muted-foreground">Point your camera at someone&apos;s QR code to see your match</p>
        </div>
        <div
          ref={qrReaderRef}
          id="qr-reader"
          className={`w-full rounded-3xl overflow-hidden ${scanning ? 'bg-black' : 'bg-muted'} aspect-square flex items-center justify-center`}
        >
          {!scanning && !loading && <Camera className="w-16 h-16 text-muted-foreground" />}
          {loading && <Loader2 className="w-12 h-12 animate-spin text-primary" />}
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
            onClick={() => router.push('/myqr')}
            className="w-full"
            disabled={loading}
          >
            Back to My Code
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ScanPage;
