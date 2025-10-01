import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEvent } from '@/contexts/EventContext';
import { useQuiz } from '@/contexts/QuizContext';
import { layerAQuestions, layerBQuestions, ImportanceLevel } from '@/data/questions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { BeepLogo } from '@/components/BeepLogo';

const Quiz = () => {
  const { eventCode } = useEvent();
  const { answers, updateLayerA, updateLayerB } = useQuiz();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [layerAAnswers, setLayerAAnswers] = useState<Record<string, string>>(answers?.layerA || {});
  const [layerBAnswers, setLayerBAnswers] = useState<Record<string, { value: string; importance: ImportanceLevel; dealBreaker: boolean }>>(
    answers?.layerB.reduce((acc, ans) => ({
      ...acc,
      [ans.questionId]: { value: ans.value, importance: ans.importance, dealBreaker: ans.dealBreaker }
    }), {}) || {}
  );

  if (!eventCode) {
    navigate('/');
    return null;
  }

  const totalSteps = layerAQuestions.length + layerBQuestions.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;
  const isLayerA = currentStep < layerAQuestions.length;
  const currentQuestion = isLayerA
    ? layerAQuestions[currentStep]
    : layerBQuestions[currentStep - layerAQuestions.length];

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
      setCurrentStep(currentStep + 1);
    } else {
      navigate('/myqr');
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

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <BeepLogo variant="monogram" className="w-10 h-10 text-primary" />
            <Badge variant="outline">
              {currentStep + 1} / {totalSteps}
            </Badge>
          </div>
          <Progress value={progress} className="mb-4" />
          <CardTitle className="text-2xl">
            {isLayerA ? 'About You' : 'Your Preferences'}
          </CardTitle>
          <CardDescription>
            {isLayerA ? 'Tell us about your personality' : 'What matters to you in a match?'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">{currentQuestion.text}</h3>
            <RadioGroup value={currentAnswer} onValueChange={handleAnswerChange}>
              <div className="space-y-3">
                {currentQuestion.options.map((option) => (
                  <div key={option.value} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-accent/50 transition-colors">
                    <RadioGroupItem value={option.value} id={option.value} />
                    <Label htmlFor={option.value} className="flex-1 cursor-pointer">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>

          {!isLayerA && currentAnswer && (
            <div className="space-y-4 p-4 bg-muted rounded-lg">
              <div>
                <Label className="text-sm font-semibold mb-2 block">Importance Level</Label>
                <div className="flex gap-2">
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
                      className="flex-1 capitalize"
                    >
                      {level}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="dealbreaker" className="text-sm font-semibold">
                  This is a deal-breaker
                </Label>
                <Switch
                  id="dealbreaker"
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
          )}

          <div className="flex gap-3">
            {currentStep > 0 && (
              <Button
                variant="outline"
                onClick={() => setCurrentStep(currentStep - 1)}
              >
                Back
              </Button>
            )}
            <Button
              onClick={handleNext}
              disabled={!canProceed}
              className="flex-1"
            >
              {currentStep < totalSteps - 1 ? 'Next' : 'Complete'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Quiz;
