import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock4, Sparkles, Shield } from 'lucide-react';
import { useEvent } from '@/contexts/EventContext';
import { BeepLogo } from '@/components/BeepLogo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
    <div className="min-h-screen bg-slate-950 px-4 py-10 text-white">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <div className="rounded-[32px] border border-white/10 bg-white/5 p-6 md:p-10 backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-2xl font-black text-slate-900 shadow-xl">
                TC
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-white/60">Custom branding</p>
                <p className="text-2xl font-semibold">TechCorp Summit 2025</p>
                <p className="text-sm text-white/70">Configured in under five minutes</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-white/70">
              <BeepLogo variant="ping" className="h-10 w-10 text-primary" />
              <span>Powered by Beep</span>
            </div>
          </div>
          <div className="mt-6 grid gap-4 text-sm text-white/80 md:grid-cols-3">
            <div className="flex items-center gap-2">
              <Clock4 className="h-5 w-5" />
              <span>No download required. Join in 30 seconds.</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              <span>Proof that onboarding feels like a modern landing page.</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              <span>All-in-One tool: QR, quiz, matches, admin.</span>
            </div>
          </div>
        </div>

        <div className="rounded-[32px] bg-white p-8 shadow-2xl text-slate-900">
          <p className="text-xs uppercase tracking-[0.5em] text-slate-400">Zero-Friction Entry</p>
          <h1 className="mt-3 text-4xl font-black text-slate-900">Enter Event Code</h1>
          <p className="mt-1 text-lg text-slate-500">Employees land here and are inside the product in half a minute.</p>

          <div className="mt-8 space-y-3">
            <Label htmlFor="eventCode" className="text-sm font-semibold text-slate-500">
              Event Code
            </Label>
            <Input
              id="eventCode"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="1234"
              maxLength={4}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase())}
              className="h-20 text-center text-4xl font-black tracking-[0.6em] text-slate-900 placeholder:text-slate-300"
            />
            <p className="text-sm text-slate-500 text-center">
              No downloads, no passwords. Just the event code printed on badges or screens.
            </p>
          </div>

          <Button
            onClick={handleJoin}
            className="mt-6 h-16 w-full text-lg font-semibold uppercase tracking-widest"
            size="lg"
            disabled={code.length !== 4}
          >
            Launch Experience
          </Button>
          <p className="mt-4 text-center text-sm text-slate-500">
            Break the Ice · One Beep at a Time · Trusted by hybrid offsites
          </p>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
