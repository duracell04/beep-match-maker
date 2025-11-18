'use client';

import { createContext, ReactNode, useContext, useState } from 'react';
import { MatchResult } from '@/lib/matcher';

interface MatchContextType {
  result: MatchResult | null;
  setResult: (result: MatchResult | null) => void;
}

const MatchContext = createContext<MatchContextType | undefined>(undefined);

export const MatchProvider = ({ children }: { children: ReactNode }) => {
  const [result, setResult] = useState<MatchResult | null>(null);

  return <MatchContext.Provider value={{ result, setResult }}>{children}</MatchContext.Provider>;
};

export const useMatchResult = () => {
  const context = useContext(MatchContext);
  if (!context) {
    throw new Error('useMatchResult must be used within MatchProvider');
  }
  return context;
};
