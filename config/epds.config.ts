/**
 * epds.config.ts
 *
 * Edinburgh Postnatal Depression Scale (EPDS) questionnaire data
 * and scoring helpers.  Extracted from PostPartumMind.tsx so the
 * screening widget + any future questionnaire can be reused.
 */

// ── Types ────────────────────────────────────────────────────────────────

export interface EPDSQuestion {
  id: number;
  question: string;
  options: readonly string[];
  reverse?: boolean;
}

export interface EPDSResult {
  totalScore: number;
  maxScore: number;
  isHighRisk: boolean;
}

// ── Questions ────────────────────────────────────────────────────────────

export const EPDS_QUESTIONS: readonly EPDSQuestion[] = [
  {
    id: 1,
    question: 'I have been able to laugh and see the funny side of things',
    options: ['As much as I always could', 'Not quite so much now', 'Definitely not so much now', 'Not at all'],
  },
  {
    id: 2,
    question: 'I have looked forward with enjoyment to things',
    options: ['As much as I ever did', 'Rather less than I used to', 'Definitely less than I used to', 'Hardly at all'],
  },
  {
    id: 3,
    question: 'I have blamed myself unnecessarily when things went wrong',
    options: ['No, never', 'Not very often', 'Yes, some of the time', 'Yes, most of the time'],
    reverse: true,
  },
  {
    id: 4,
    question: 'I have been anxious or worried for no good reason',
    options: ['No, not at all', 'Hardly ever', 'Yes, sometimes', 'Yes, very often'],
  },
  {
    id: 5,
    question: 'I have felt scared or panicky for no very good reason',
    options: ['No, not at all', 'No, not much', 'Yes, sometimes', 'Yes, quite a lot'],
    reverse: true,
  },
  {
    id: 6,
    question: 'Things have been getting on top of me',
    options: ['No, I\'ve been coping as well as ever', 'No, most of the time I cope well', 'Yes, sometimes I haven\'t been coping', 'Yes, most of the time I can\'t cope'],
    reverse: true,
  },
  {
    id: 7,
    question: 'I have been so unhappy that I have had difficulty sleeping',
    options: ['No, not at all', 'Not very often', 'Yes, sometimes', 'Yes, most of the time'],
    reverse: true,
  },
  {
    id: 8,
    question: 'I have felt sad or miserable',
    options: ['No, not at all', 'Not very often', 'Yes, quite often', 'Yes, most of the time'],
    reverse: true,
  },
  {
    id: 9,
    question: 'I have been so unhappy that I have been crying',
    options: ['No, never', 'Only occasionally', 'Yes, quite often', 'Yes, most of the time'],
    reverse: true,
  },
  {
    id: 10,
    question: 'The thought of harming myself has occurred to me',
    options: ['Never', 'Hardly ever', 'Sometimes', 'Yes, quite often'],
    reverse: true,
  },
] as const;
// ── Scoring ──────────────────────────────────────────────────────────────

const HIGH_RISK_THRESHOLD = 10;

/** Compute EPDS result from an array of selected option indices (0-3). */
export const computeEPDSResult = (answers: number[]): EPDSResult => {
  let totalScore = 0;
  
  answers.forEach((selectedIndex, index) => {
    // Ensure we don't go out of bounds if answers length > questions length
    if (index >= EPDS_QUESTIONS.length) return;
    
    const question = EPDS_QUESTIONS[index];
    const score = question.reverse 
      ? (3 - selectedIndex) // Reverse scoring: 0->3, 1->2, 2->1, 3->0
      : selectedIndex;
      
    totalScore += score;
  });

  return {
    totalScore,
    maxScore: EPDS_QUESTIONS.length * 3,
    isHighRisk: totalScore >= HIGH_RISK_THRESHOLD,
  };
};

// ── Screening history demo data ──────────────────────────────────────────

export const screeningHistoryData = [
  { month: 'Sep', score: 8 },
  { month: 'Oct', score: 12 },
  { month: 'Nov', score: 6 },
  { month: 'Dec', score: 9 },
  { month: 'Jan', score: 5 },
];

// ── Current screening status ─────────────────────────────────────────────

export const currentScreeningStatus = {
  status: 'Low Risk',
  lastScreenedDate: 'Jan 6, 2026',
  score: 5,
};
