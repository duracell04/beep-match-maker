'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { QuizAnswers, LayerBAnswer } from '@/data/questions';

interface QuizContextType {
  answers: QuizAnswers | null;
  updateLayerA: (questionId: string, value: string) => void;
  updateLayerB: (answer: LayerBAnswer) => void;
  clearAnswers: () => void;
  isComplete: boolean;
  isReady: boolean;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export const QuizProvider = ({ children }: { children: ReactNode }) => {
  const [answers, setAnswers] = useState<QuizAnswers | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem('beep_quiz_answers');
    if (saved) {
      setAnswers(JSON.parse(saved));
    }
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (answers) {
      window.localStorage.setItem('beep_quiz_answers', JSON.stringify(answers));
    }
  }, [answers]);

  const updateLayerA = (questionId: string, value: string) => {
    setAnswers((prev) => {
      const eventCode = window.localStorage.getItem('beep_event_code') || '';
      return {
        layerA: { ...(prev?.layerA || {}), [questionId]: value },
        layerB: prev?.layerB || [],
        eventCode,
      };
    });
  };

  const updateLayerB = (answer: LayerBAnswer) => {
    setAnswers((prev) => {
      if (!prev) return prev;
      const existingIndex = prev.layerB.findIndex((a) => a.questionId === answer.questionId);
      const newLayerB = [...prev.layerB];
      if (existingIndex >= 0) {
        newLayerB[existingIndex] = answer;
      } else {
        newLayerB.push(answer);
      }
      return { ...prev, layerB: newLayerB };
    });
  };

  const clearAnswers = () => {
    window.localStorage.removeItem('beep_quiz_answers');
    setAnswers(null);
  };

  const isComplete = !!(
    answers &&
    Object.keys(answers.layerA).length === 5 &&
    answers.layerB.length === 5
  );

  return (
    <QuizContext.Provider value={{ answers, updateLayerA, updateLayerB, clearAnswers, isComplete, isReady }}>
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz must be used within QuizProvider');
  }
  return context;
};
