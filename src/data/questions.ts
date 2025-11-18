export interface QuestionOption {
  value: string;
  label: string;
  conversationHook?: string;
  conversationPrompt?: string;
}

export interface Question {
  id: string;
  text: string;
  options: QuestionOption[];
  layer: 'A' | 'B';
  weight?: number; // For Layer A
}

// Layer A: Corporate identity - who the employee is
export const layerAQuestions: Question[] = [
  {
    id: 'a1',
    text: 'Which department are you representing right now?',
    layer: 'A',
    weight: 1.1,
    options: [
      { value: 'sales', label: 'Revenue & Sales' },
      { value: 'product', label: 'Product & Tech' },
      { value: 'people', label: 'People Ops / HR' },
      { value: 'customer', label: 'Customer Success & Ops' },
    ],
  },
  {
    id: 'a2',
    text: 'What is your office superpower?',
    layer: 'A',
    weight: 1.0,
    options: [
      {
        value: 'excel',
        label: 'Excel Wizard',
        conversationHook: "Both of you flex the same spreadsheet superpower.",
        conversationPrompt: 'Ask them which dashboard they are most proud of shipping this quarter.',
      },
      { value: 'culture', label: 'Culture Builder' },
      { value: 'bugfixer', label: 'Bug Fixer' },
      { value: 'dealcloser', label: 'Deal Closer' },
    ],
  },
  {
    id: 'a3',
    text: 'How do you like your meetings to feel?',
    layer: 'A',
    weight: 0.9,
    options: [
      { value: 'whiteboard', label: 'Whiteboard sprint' },
      { value: 'async', label: 'Async + clear notes' },
      { value: 'cameraon', label: 'Camera-on facilitation' },
      { value: 'walktalk', label: 'Walk-and-talk' },
    ],
  },
  {
    id: 'a4',
    text: 'When a decision stalls, what do you do?',
    layer: 'A',
    weight: 1.2,
    options: [
      { value: 'data', label: 'Pull a dashboard' },
      { value: 'consensus', label: 'Poll the floor' },
      { value: 'experiment', label: 'Run a micro experiment' },
      { value: 'escalate', label: 'Text an exec sponsor' },
    ],
  },
  {
    id: 'a5',
    text: 'What is your networking alter ego tonight?',
    layer: 'A',
    weight: 0.8,
    options: [
      { value: 'connector', label: 'Super Connector' },
      { value: 'futurist', label: 'Futurist Scout' },
      { value: 'fixer', label: 'Firefighter / Fixer' },
      { value: 'storyteller', label: 'Storyteller' },
    ],
  },
];

// Layer B: Event preferences - what they want from the experience
export const layerBQuestions: Question[] = [
  {
    id: 'b1',
    text: 'Who do you want to meet first?',
    layer: 'B',
    options: [
      { value: 'pipeline', label: 'Sales pipeline ally' },
      { value: 'xdei', label: 'Cross-functional co-creator' },
      { value: 'exec', label: 'Executive sponsor' },
      { value: 'innovator', label: 'Innovation sparring partner' },
    ],
  },
  {
    id: 'b2',
    text: 'Breakout format that wakes you up?',
    layer: 'B',
    options: [
      { value: 'rapid', label: 'Rapid-fire standups' },
      { value: 'deepwork', label: 'Deep-work labs' },
      { value: 'debate', label: 'Panel debates' },
      { value: 'coffee', label: 'Coffee walks' },
    ],
  },
  {
    id: 'b3',
    text: 'Conversation fuel you never get tired of?',
    layer: 'B',
    options: [
      {
        value: 'scifi',
        label: 'Sci-Fi & future tech',
        conversationHook: "You both listed 'Sci-Fi' as your favorite genre.",
        conversationPrompt: 'Ask them: What is the most overrated Sci-Fi movie of all time?',
      },
      {
        value: 'sports',
        label: 'Data-driven sports talk',
        conversationHook: 'You both geek out over advanced stats.',
        conversationPrompt: 'Compare the boldest sports analytics bet you have made this season.',
      },
      {
        value: 'climate',
        label: 'Climate innovation',
        conversationHook: 'You are both chasing climate breakthroughs.',
        conversationPrompt: 'Swap notes on the most practical climate initiative your org is piloting.',
      },
      {
        value: 'wellbeing',
        label: 'Workplace wellbeing hacks',
        conversationHook: 'You both champion wellbeing rituals.',
        conversationPrompt: 'Ask what recharge ritual they protect on the calendar.',
      },
    ],
  },
  {
    id: 'b4',
    text: 'After-hours mission for tonight?',
    layer: 'B',
    options: [
      { value: 'dinner', label: 'Find the dinner crew' },
      { value: 'hack', label: 'Map a hackathon idea' },
      { value: 'demo', label: 'Test the latest gadget' },
      { value: 'reset', label: 'Reserve the decompress lounge' },
    ],
  },
  {
    id: 'b5',
    text: 'Preferred follow-up handshake?',
    layer: 'B',
    options: [
      {
        value: 'slack',
        label: 'Slack DM within 24h',
        conversationHook: 'You both live in Slack.',
        conversationPrompt: 'Share the boldest Slack automation you rely on.',
      },
      {
        value: 'teams',
        label: 'Teams call next week',
        conversationHook: 'You both prefer face time to lock decisions.',
        conversationPrompt: 'Ask what makes a 15-minute sync wildly productive for them.',
      },
      {
        value: 'espresso',
        label: 'Espresso chat at the office cafe',
        conversationHook: 'You both negotiate over strong coffee.',
        conversationPrompt: 'Trade tips on the best off-menu drink near HQ.',
      },
      {
        value: 'recap',
        label: 'Shared strategy doc',
        conversationHook: 'You both document obsessively.',
        conversationPrompt: 'Ask which template or doc trick saves them the most time.',
      },
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
