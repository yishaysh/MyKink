export type AnswerValue = 'YES' | 'MAYBE' | 'NO';
export type RoleType = 'SYMMETRIC' | 'GIVER' | 'RECEIVER';
export type MatchStatus = 'MUTUAL_YES' | 'MUTUAL_MAYBE' | 'TENTATIVE_MIXED' | 'HIDDEN';

export interface RawAnswer {
  userId: string;
  questionId: string;
  value: AnswerValue;
  roleType: RoleType;
  linkedQuestionId?: string | null;
}

export interface MatchEvaluationResult {
  questionId: string;
  matchStatus: MatchStatus;
}

/**
 * Double-Blind Algorithmic Matching & Asymmetric Engine Logic
 * Pure function enforcing strict privacy guarantees.
 */
export function evaluateDoubleBlindMatch(
  userAAnswers: RawAnswer[],
  userBAnswers: RawAnswer[]
): MatchEvaluationResult[] {
  const matches: MatchEvaluationResult[] = [];
  
  // Map User B answers by question ID
  const mapB = new Map<string, RawAnswer>();
  for (const ansB of userBAnswers) {
    mapB.set(ansB.questionId, ansB);
  }

  for (const ansA of userAAnswers) {
    // Handle asymmetric role mapping
    let targetQuestionIdOnB = ansA.questionId;
    if (ansA.roleType === 'GIVER' && ansA.linkedQuestionId) {
      targetQuestionIdOnB = ansA.linkedQuestionId;
    } else if (ansA.roleType === 'RECEIVER' && ansA.linkedQuestionId) {
      targetQuestionIdOnB = ansA.linkedQuestionId;
    }

    const ansB = mapB.get(targetQuestionIdOnB);
    if (!ansB) {
      // Waiting for Partner B to answer this question
      continue;
    }

    // STRICT DOUBLE-BLIND PRIVACY GUARD:
    // If either user selected NO, the result is HIDDEN.
    if (ansA.value === 'NO' || ansB.value === 'NO') {
      matches.push({
        questionId: ansA.questionId,
        matchStatus: 'HIDDEN'
      });
      continue;
    }

    // Resolve positive mutual matches
    if (ansA.value === 'YES' && ansB.value === 'YES') {
      matches.push({
        questionId: ansA.questionId,
        matchStatus: 'MUTUAL_YES'
      });
    } else if (ansA.value === 'MAYBE' && ansB.value === 'MAYBE') {
      matches.push({
        questionId: ansA.questionId,
        matchStatus: 'MUTUAL_MAYBE'
      });
    } else {
      // One YES, One MAYBE -> Tentative Mixed Match
      matches.push({
        questionId: ansA.questionId,
        matchStatus: 'TENTATIVE_MIXED'
      });
    }
  }

  return matches;
}
