'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles } from 'lucide-react';
import { useEvent } from '@/contexts/EventContext';
import { useQuiz } from '@/contexts/QuizContext';
import { layerAQuestions, layerBQuestions, ImportanceLevel } from '@/data/questions';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { BeepLogo } from '@/components/BeepLogo';

const questionDeck = [...layerAQuestions, ...layerBQuestions];

const QuizPage = () => {
  const { eventCode, isReady: isEventReady } = useEvent();
  const { answers, updateLayerA, updateLayerB, isReady: isQuizReady } = useQuiz();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [layerAAnswers, setLayerAAnswers] = useState<Record<string, string>>({});
  const [layerBAnswers, setLayerBAnswers] = useState<Record<string, { value: string; importance: ImportanceLevel; dealBreaker: boolean }>>({});

  useEffect(() => {
    if (answers?.layerA) {
      setLayerAAnswers(answers.layerA);
    }
    if (answers?.layerB) {
      const formatted = answers.layerB.reduce(
        (acc, ans) => ({
          ...acc,
          [ans.questionId]: { value: ans.value, importance: ans.importance, dealBreaker: ans.dealBreaker },
        }),
        {},
      );
      setLayerBAnswers(formatted);
    }
  }, [answers]);

  useEffect(() => {
    if (isEventReady && !eventCode) {
      router.replace('/onboarding');
    }
  }, [isEventReady, eventCode, router]);

  const totalSteps = questionDeck.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;
  const isLayerA = currentStep < layerAQuestions.length;
  const currentQuestion = questionDeck[currentStep];

  const currentAnswer = isLayerA
    ? layerAAnswers[currentQuestion.id]
    : layerBAnswers[currentQuestion.id]?.value;

  const canProceed = !!currentAnswer && (!isLayerA ? !!layerBAnswers[currentQuestion.id]?.importance : true);

  const handleNext = () => {
    if (isLayerA) {
      updateLayerA(currentQuestion.id, currentAnswer!);
    } else {
      const bAnswer = layerBAnswers[currentQuestion.id];
      updateLayerB({
        questionId: currentQuestion.id,
        value: bAnswer.value,
        importance: bAnswer.importance,
        dealBreaker: bAnswer.dealBreaker,
      });
    }

    if (currentStep < totalSteps - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      router.push('/myqr');
    }
  };

  const handleAnswerChange = (value: string) => {
    if (isLayerA) {
      setLayerAAnswers({ ...layerAAnswers, [currentQuestion.id]: value });
    } else {
      setLayerBAnswers({
        ...layerBAnswers,
        [currentQuestion.id]: {
          value,
          importance: layerBAnswers[currentQuestion.id]?.importance || 'medium',
          dealBreaker: layerBAnswers[currentQuestion.id]?.dealBreaker || false,
        },
      });
    }
  };

  if (!isEventReady || !isQuizReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        Loading your experience...
      </div>
    );
  }

  if (!eventCode) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10 text-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-white/60">Rapid Fire Setup</p>
            <h1 className="mt-2 text-4xl font-black leading-tight">10 swipeable questions that feel built for work</h1>
            <p className="mt-3 text-base text-white/70">
              Show buyers how fast employees can personalize the experience. Each card speaks the language of corporate offsites.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-white/70">
            <BeepLogo variant="monogram" className="h-8 w-8 text-primary" />
            <span>{isLayerA ? 'Layer A · Employee identity' : 'Layer B · Event preferences'}</span>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <div className="rounded-[32px] border border-white/10 bg-white/5 p-6 md:p-10 backdrop-blur">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.4em] text-white/60">
                  Card {String(currentStep + 1).padStart(2, '0')} / {totalSteps}
                </p>
                <h2 className="mt-2 text-2xl font-semibold">{isLayerA ? 'Signal who they are' : 'Tune what they want'}</h2>
              </div>
              <div className="flex items-center gap-2 text-sm text-white/70">
                <Sparkles className="h-4 w-4" />
                <span>{Math.round(progress)}% complete</span>
              </div>
            </div>
            <Progress value={progress} className="mt-4" />

            <div className="relative mt-8 min-h-[360px]">
              <div className="pointer-events-none absolute inset-0 -rotate-2 rounded-[28px] border border-white/10 opacity-40" />
              <div className="relative rounded-[28px] border border-white/20 bg-white/10 p-6 md:p-8 shadow-2xl shadow-primary/10">
                <p className="text-xs uppercase tracking-[0.4em] text-white/60">The question</p>
                <h3 className="mt-3 text-2xl font-bold leading-snug">{currentQuestion.text}</h3>
                <p className="mt-2 text-sm text-white/70">
                  {isLayerA ? 'Signals the employee profile so buyers see the corporate relevance.' : 'Let them weight what the event should deliver.'}
                </p>

                <RadioGroup value={currentAnswer} onValueChange={handleAnswerChange} className="mt-6 space-y-4">
                  {currentQuestion.options.map((option) => {
                    const id = `${currentQuestion.id}-${option.value}`;
                    const isSelected = currentAnswer === option.value;
                    return (
                      <Label
                        key={option.value}
                        htmlFor={id}
                        className={`flex cursor-pointer flex-col gap-3 rounded-2xl border p-5 transition ${
                          isSelected
                            ? 'border-white bg-white text-slate-900 shadow-2xl'
                            : 'border-white/20 bg-white/5 text-white/80 hover:border-white/50'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <p className="text-lg font-semibold">{option.label}</p>
                            {option.conversationHook && (
                              <p className={`mt-1 text-xs ${isSelected ? 'text-slate-500' : 'text-white/60'}`}>
                                {option.conversationHook}
                              </p>
                            )}
                          </div>
                          <RadioGroupItem
                            id={id}
                            value={option.value}
                            className={`h-5 w-5 border-2 ${isSelected ? 'border-slate-900 bg-slate-900' : 'border-white/60'}`}
                          />
                        </div>
                      </Label>
                    );
                  })}
                </RadioGroup>
              </div>
            </div>

            {!isLayerA && currentAnswer && (
              <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                <p className="text-xs uppercase tracking-[0.4em] text-white/60">Personalize the weight</p>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div>
                    <Label className="text-sm font-semibold text-white/80">Importance level</Label>
                    <div className="mt-3 grid grid-cols-3 gap-2">
                      {(['low', 'medium', 'high'] as ImportanceLevel[]).map((level) => (
                        <Button
                          key={level}
                          type="button"
                          variant={layerBAnswers[currentQuestion.id]?.importance === level ? 'default' : 'outline'}
                          size="sm"
                          onClick={() =>
                            setLayerBAnswers({
                              ...layerBAnswers,
                              [currentQuestion.id]: {
                                ...layerBAnswers[currentQuestion.id],
                                importance: level,
                              },
                            })
                          }
                          className={`h-12 uppercase tracking-widest ${layerBAnswers[currentQuestion.id]?.importance === level ? '' : 'border-white/40 text-white'}`}
                        >
                          {level}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col justify-between rounded-2xl border border-white/10 bg-white/5 p-4">
                    <Label htmlFor={`dealbreaker-${currentQuestion.id}`} className="text-sm font-semibold text-white/80">
                      Flip to deal-breaker
                    </Label>
                    <div className="flex items-center justify-between text-sm text-white/70">
                      <span>Make this non-negotiable</span>
                      <Switch
                        id={`dealbreaker-${currentQuestion.id}`}
                        checked={layerBAnswers[currentQuestion.id]?.dealBreaker || false}
                        onCheckedChange={(checked) =>
                          setLayerBAnswers({
                            ...layerBAnswers,
                            [currentQuestion.id]: {
                              ...layerBAnswers[currentQuestion.id],
                              dealBreaker: checked,
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-8 flex flex-wrap gap-3">
              {currentStep > 0 && (
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep((prev) => prev - 1)}
                  className="h-12 min-w-[120px] border-white/40 text-white"
                >
                  Back
                </Button>
              )}
              <Button
                onClick={handleNext}
                disabled={!canProceed}
                className="h-12 min-w-[200px] flex-1 text-base font-semibold uppercase tracking-widest"
              >
                {currentStep < totalSteps - 1 ? 'Next Card' : 'Lock My Answers'}
              </Button>
            </div>
          </div>

          <div className="rounded-[32px] bg-white p-6 text-slate-900 shadow-xl">
            <p className="text-xs uppercase tracking-[0.4em] text-slate-400">The 10 questions</p>
            <p className="mt-3 text-base text-slate-600">
              Corporate-relevant prompts that prove you can configure for any culture or offsite goal.
            </p>
            <div className="mt-6 space-y-4">
              {questionDeck.map((question, index) => (
                <div key={question.id} className="rounded-2xl border border-slate-100 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-400">Q{index + 1}</p>
                  <p className="mt-2 text-base font-semibold">{question.text}</p>
                  <p className="mt-1 text-sm text-slate-500">
                    {question.options.slice(0, 3).map((opt) => opt.label).join(' / ')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
