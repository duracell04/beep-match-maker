import { QuizAnswers, layerAQuestions, ImportanceLevel } from '@/data/questions';

export type MatchColor = 'green' | 'yellow' | 'red';

export interface MatchResult {
  color: MatchColor;
  score: number;
  colorLabel: string;
}

const importanceWeights: Record<ImportanceLevel, number> = {
  low: 0.5,
  medium: 1.0,
  high: 1.5,
};

/**
 * Calculate Layer A similarity based on trait matching with fixed weights
 */
function calculateLayerA(user1: QuizAnswers, user2: QuizAnswers): number {
  let totalWeight = 0;
  let matchedWeight = 0;

  layerAQuestions.forEach(question => {
    const weight = question.weight || 1.0;
    totalWeight += weight;

    const val1 = user1.layerA[question.id];
    const val2 = user2.layerA[question.id];

    if (val1 === val2) {
      matchedWeight += weight;
    }
  });

  return totalWeight > 0 ? matchedWeight / totalWeight : 0;
}

/**
 * Calculate Layer B preference satisfaction with importance and deal-breakers
 */
function calculateLayerB(user1: QuizAnswers, user2: QuizAnswers): { score: number; dealBreakerHit: boolean } {
  let totalWeight = 0;
  let matchedWeight = 0;
  let dealBreakerHit = false;

  // Check user1's preferences against user2's answers
  user1.layerB.forEach(pref1 => {
    const pref2 = user2.layerB.find(p => p.questionId === pref1.questionId);
    if (!pref2) return;

    const weight = importanceWeights[pref1.importance];
    totalWeight += weight;

    if (pref1.value === pref2.value) {
      matchedWeight += weight;
    } else if (pref1.dealBreaker) {
      dealBreakerHit = true;
    }
  });

  const score = totalWeight > 0 ? matchedWeight / totalWeight : 0;
  return { score, dealBreakerHit };
}

/**
 * Main matching function following v0.9 spec
 */
export function calculateMatch(user1: QuizAnswers, user2: QuizAnswers): MatchResult {
  // Layer A: Trait similarity
  const layerAScore = calculateLayerA(user1, user2);

  // Layer B: Preference satisfaction (bidirectional)
  const user1PrefsResult = calculateLayerB(user1, user2);
  const user2PrefsResult = calculateLayerB(user2, user1);

  // Deal-breaker fast-fail
  if (user1PrefsResult.dealBreakerHit || user2PrefsResult.dealBreakerHit) {
    return {
      color: 'red',
      score: 0,
      colorLabel: 'Not Compatible',
    };
  }

  // Composite score (60% Layer A, 40% Layer B average)
  const layerBAvg = (user1PrefsResult.score + user2PrefsResult.score) / 2;
  const compositeScore = (layerAScore * 0.6) + (layerBAvg * 0.4);

  // Map to traffic-light thresholds
  let color: MatchColor;
  let colorLabel: string;

  if (compositeScore >= 0.80) {
    color = 'green';
    colorLabel = 'Strong Match';
  } else if (compositeScore >= 0.50) {
    color = 'yellow';
    colorLabel = 'Potential Match';
  } else {
    color = 'red';
    colorLabel = 'Low Compatibility';
  }

  return {
    color,
    score: Math.round(compositeScore * 100),
    colorLabel,
  };
}
