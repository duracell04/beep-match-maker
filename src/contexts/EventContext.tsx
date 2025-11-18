'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface EventContextType {
  eventCode: string | null;
  setEventCode: (code: string) => void;
  clearEvent: () => void;
  isReady: boolean;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export const EventProvider = ({ children }: { children: ReactNode }) => {
  const [eventCode, setEventCodeState] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem('beep_event_code');
    if (stored) {
      setEventCodeState(stored);
    }
    setIsReady(true);
  }, []);

  const setEventCode = (code: string) => {
    window.localStorage.setItem('beep_event_code', code);
    setEventCodeState(code);
  };

  const clearEvent = () => {
    window.localStorage.removeItem('beep_event_code');
    window.localStorage.removeItem('beep_quiz_answers');
    setEventCodeState(null);
  };

  return (
    <EventContext.Provider value={{ eventCode, setEventCode, clearEvent, isReady }}>
      {children}
    </EventContext.Provider>
  );
};

export const useEvent = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvent must be used within EventProvider');
  }
  return context;
};
