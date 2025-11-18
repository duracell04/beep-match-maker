import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, ShieldCheck, RefreshCw } from 'lucide-react';
import { useEvent } from '@/contexts/EventContext';
import { useQuiz } from '@/contexts/QuizContext';
import { Button } from '@/components/ui/button';
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
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10 text-white">
      <div className="mx-auto w-full max-w-4xl space-y-6">
        <div className="rounded-[40px] border border-white/10 bg-white/5 p-4 lg:p-6">
          <div className="grid gap-4">
            <div className="grid h-[520px] grid-rows-[1.4fr_0.8fr] overflow-hidden rounded-[32px] border border-white/10 bg-black/20">
              <div className="relative flex flex-col justify-between bg-gradient-to-br from-emerald-900 via-slate-900 to-slate-950 p-6">
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.4em] text-white/70">
                  <span>Active Mode</span>
                  <span>{eventCode}</span>
                </div>
                <div className="flex flex-1 items-center justify-center">
                  <div className="rounded-[24px] bg-white/90 p-6 shadow-2xl">
                    {qrDataUrl && (
                      <img
                        src={qrDataUrl}
                        alt="Your QR Code"
                        className="w-full max-w-xs"
                      />
                    )}
                  </div>
                </div>
                <p className="text-center text-sm text-white/70">
                  Rotates every 90 seconds · Token {currentToken ? `${currentToken.slice(0, 6)}...` : 'generating'}
                </p>
              </div>
              <div className="flex flex-col items-center justify-center gap-5 bg-white p-6 text-center text-slate-900">
                <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-500">
                  Break the Ice · One Beep at a Time
                </p>
                <Button
                  onClick={() => navigate('/scan')}
                  className="h-24 w-full rounded-[24px] bg-gradient-to-r from-fuchsia-600 via-pink-500 to-orange-500 text-2xl font-black uppercase tracking-[0.3em] text-white shadow-[0_15px_45px_rgba(255,0,150,0.35)] transition hover:scale-[1.01]"
                >
                  BEEP SOMEONE
                </Button>
                <p className="text-sm text-slate-500">Opens the camera and scanning view instantly.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3 text-sm text-white/80">
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
            <Zap className="h-5 w-5 text-primary" />
            <span>Looks like a digital badge but behaves like a game.</span>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <span>Secure rotation keeps enterprise IT comfortable.</span>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
            <RefreshCw className="h-5 w-5 text-primary" />
            <span>90-second refresh proves it is truly dynamic.</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            className="border-white/40 bg-white/10 text-white hover:bg-white/20"
            onClick={() => navigate('/admin')}
          >
            Admin
          </Button>
          <Button
            variant="outline"
            className="border-white/40 bg-white/10 text-white hover:bg-white/20"
            onClick={() => navigate('/scan')}
          >
            Scan someone
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MyQR;
