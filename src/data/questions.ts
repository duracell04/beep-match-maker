export interface QuestionOption {
  value: string;
  label: string;
}

export interface Question {
  id: string;
  text: string;
  options: QuestionOption[];
  layer: 'A' | 'B';
  weight?: number; // For Layer A
}

// Layer A: "Who I am" - stable traits with fixed weights
export const layerAQuestions: Question[] = [
  {
    id: 'a1',
    text: 'How do you prefer to spend your free time?',
    layer: 'A',
    weight: 1.0,
    options: [
      { value: 'social', label: 'Out with friends' },
      { value: 'quiet', label: 'Quiet time at home' },
      { value: 'active', label: 'Physical activities' },
      { value: 'creative', label: 'Creative pursuits' },
    ],
  },
  {
    id: 'a2',
    text: 'What best describes your communication style?',
    layer: 'A',
    weight: 0.9,
    options: [
      { value: 'direct', label: 'Direct and straightforward' },
      { value: 'thoughtful', label: 'Thoughtful and measured' },
      { value: 'expressive', label: 'Expressive and animated' },
      { value: 'reserved', label: 'Reserved and observant' },
    ],
  },
  {
    id: 'a3',
    text: 'How do you handle conflict?',
    layer: 'A',
    weight: 1.2,
    options: [
      { value: 'address', label: 'Address it immediately' },
      { value: 'avoid', label: 'Avoid confrontation' },
      { value: 'mediate', label: 'Find middle ground' },
      { value: 'reflect', label: 'Take time to reflect' },
    ],
  },
  {
    id: 'a4',
    text: 'What energizes you most?',
    layer: 'A',
    weight: 0.8,
    options: [
      { value: 'people', label: 'Being around people' },
      { value: 'solitude', label: 'Time alone' },
      { value: 'achievement', label: 'Accomplishing goals' },
      { value: 'learning', label: 'Learning new things' },
    ],
  },
];

// Layer B: "What I want" - preferences with user-set importance
export const layerBQuestions: Question[] = [
  {
    id: 'b1',
    text: 'What matters most to you in a relationship?',
    layer: 'B',
    options: [
      { value: 'trust', label: 'Trust and loyalty' },
      { value: 'passion', label: 'Passion and chemistry' },
      { value: 'growth', label: 'Growth and support' },
      { value: 'fun', label: 'Fun and adventure' },
    ],
  },
  {
    id: 'b2',
    text: 'How important is shared lifestyle?',
    layer: 'B',
    options: [
      { value: 'veryactive', label: 'Very active lifestyle' },
      { value: 'balanced', label: 'Balanced activity' },
      { value: 'relaxed', label: 'Relaxed and low-key' },
      { value: 'varied', label: 'Varied activities' },
    ],
  },
  {
    id: 'b3',
    text: 'What role does family play?',
    layer: 'B',
    options: [
      { value: 'central', label: 'Central to my life' },
      { value: 'important', label: 'Important but balanced' },
      { value: 'independent', label: 'I value independence' },
      { value: 'flexible', label: 'Depends on situation' },
    ],
  },
  {
    id: 'b4',
    text: 'Communication frequency preference?',
    layer: 'B',
    options: [
      { value: 'constant', label: 'Constant connection' },
      { value: 'daily', label: 'Daily check-ins' },
      { value: 'space', label: 'Need personal space' },
      { value: 'natural', label: 'Whatever feels natural' },
    ],
  },
  {
    id: 'b5',
    text: 'Long-term relationship goals?',
    layer: 'B',
    options: [
      { value: 'marriage', label: 'Marriage and family' },
      { value: 'committed', label: 'Long-term commitment' },
      { value: 'exploring', label: 'Still exploring' },
      { value: 'casual', label: 'Casual dating' },
    ],
  },
];

export type ImportanceLevel = 'low' | 'medium' | 'high';

export interface LayerBAnswer {
  questionId: string;
  value: string;
  importance: ImportanceLevel;
  dealBreaker: boolean;
}

export interface QuizAnswers {
  layerA: Record<string, string>;
  layerB: LayerBAnswer[];
  eventCode: string;
}
