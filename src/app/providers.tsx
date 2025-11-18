'use client';

import { ReactNode, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ThemeProvider } from 'next-themes';
import { EventProvider } from '@/contexts/EventContext';
import { QuizProvider } from '@/contexts/QuizContext';
import { MatchProvider } from '@/contexts/MatchContext';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <TooltipProvider>
          <EventProvider>
            <QuizProvider>
              <MatchProvider>
                {children}
                <Toaster />
                <Sonner />
              </MatchProvider>
            </QuizProvider>
          </EventProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
