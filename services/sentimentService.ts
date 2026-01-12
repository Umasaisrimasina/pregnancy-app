/**
 * Sentiment Analysis Service
 * 
 * Uses Azure AI Language for sentiment analysis
 * Calls Firebase Functions endpoint to keep API keys secure
 */

// Use Firebase Functions endpoint or direct API for demo
const FUNCTIONS_URL = import.meta.env.VITE_FIREBASE_FUNCTIONS_URL || '';
const AZURE_LANGUAGE_KEY = import.meta.env.VITE_AZURE_LANGUAGE_KEY || '';
const AZURE_LANGUAGE_ENDPOINT = import.meta.env.VITE_AZURE_LANGUAGE_ENDPOINT || 'https://imaginecuppregnancy.cognitiveservices.azure.com';

export type SentimentLabel = 'positive' | 'neutral' | 'negative' | 'mixed';

export interface SentimentResult {
  sentiment: SentimentLabel;
  confidenceScores: {
    positive: number;
    neutral: number;
    negative: number;
  };
  success: boolean;
  error?: string;
}

export interface DailyCheckIn {
  id?: string;
  date: string; // ISO date string
  text: string;
  emoji: string;
  sentiment: SentimentLabel;
  confidenceScores?: {
    positive: number;
    neutral: number;
    negative: number;
  };
  sentimentScore: number; // -1 to 1 scale
  emojiMismatch?: boolean; // true if emoji doesn't match sentiment
  factors?: string[]; // What's affecting the user
}

// Emoji to expected sentiment mapping
const EMOJI_SENTIMENT_MAP: Record<string, SentimentLabel> = {
  '😢': 'negative',
  '😞': 'negative',
  '😔': 'negative',
  '😐': 'neutral',
  '🙂': 'neutral',
  '😊': 'positive',
  '😃': 'positive',
  '😄': 'positive',
  '🥰': 'positive',
};

/**
 * Analyze sentiment of text using Azure AI Language
 */
export async function analyzeSentiment(text: string): Promise<SentimentResult> {
  try {
    // For demo: use direct Azure API call (in production, use Firebase Functions)
    const apiUrl = `${AZURE_LANGUAGE_ENDPOINT}/language/:analyze-text?api-version=2023-04-01`;
    
    const requestBody = {
      kind: 'SentimentAnalysis',
      parameters: {
        modelVersion: 'latest'
      },
      analysisInput: {
        documents: [{
          id: '1',
          language: 'en',
          text: text
        }]
      }
    };

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': AZURE_LANGUAGE_KEY
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`Azure API error: ${response.status}`);
    }

    const result = await response.json();
    const doc = result.results?.documents?.[0];

    if (!doc) {
      throw new Error('No analysis result returned');
    }

    return {
      success: true,
      sentiment: doc.sentiment as SentimentLabel,
      confidenceScores: doc.confidenceScores
    };
  } catch (error) {
    console.error('Sentiment analysis error:', error);
    return {
      success: false,
      sentiment: 'neutral',
      confidenceScores: { positive: 0, neutral: 1, negative: 0 },
      error: error instanceof Error ? error.message : 'Analysis failed'
    };
  }
}

/**
 * Convert sentiment to a numeric score (-1 to 1)
 */
export function sentimentToScore(sentiment: SentimentLabel, confidenceScores?: { positive: number; negative: number }): number {
  if (confidenceScores) {
    const positiveWeight = confidenceScores.positive;
    const negativeWeight = confidenceScores.negative;
    return positiveWeight - negativeWeight; // Range: -1 to 1
  }
  // Simple conversion based on label only
  switch (sentiment) {
    case 'positive': return 0.8;
    case 'neutral': return 0;
    case 'negative': return -0.8;
    case 'mixed': return 0;
    default: return 0;
  }
}

/**
 * Check if emoji matches the detected sentiment
 */
export function checkEmojiMismatch(emoji: string, sentiment: SentimentLabel): boolean {
  const expectedSentiment = EMOJI_SENTIMENT_MAP[emoji];
  if (!expectedSentiment) return false;
  
  // Mismatch if emoji suggests positive but sentiment is negative, or vice versa
  if (expectedSentiment === 'positive' && sentiment === 'negative') return true;
  if (expectedSentiment === 'negative' && sentiment === 'positive') return true;
  
  return false;
}

/**
 * Get sentiment badge color and label
 */
export function getSentimentBadge(sentiment: SentimentLabel): { 
  color: string; 
  bgColor: string; 
  className: string;
  label: string; 
  icon: string;
  needsSupport: boolean;
} {
  switch (sentiment) {
    case 'positive':
      return { color: 'text-green-700', bgColor: 'bg-green-100', className: 'bg-green-100 text-green-700', label: 'Positive', icon: '😊', needsSupport: false };
    case 'negative':
      return { color: 'text-red-700', bgColor: 'bg-red-100', className: 'bg-red-100 text-red-700', label: 'Negative', icon: '😔', needsSupport: true };
    case 'mixed':
      return { color: 'text-amber-700', bgColor: 'bg-amber-100', className: 'bg-amber-100 text-amber-700', label: 'Mixed', icon: '😐', needsSupport: false };
    default:
      return { color: 'text-slate-700', bgColor: 'bg-slate-100', className: 'bg-slate-100 text-slate-700', label: 'Neutral', icon: '😐', needsSupport: false };
  }
}

/**
 * Check for consecutive negative check-ins (safety alert trigger)
 */
export function detectNegativeStreak(checkIns: DailyCheckIn[], threshold: number = 3): {
  hasAlert: boolean;
  streakCount: number;
  recentNegative: DailyCheckIn[];
} {
  // Sort by date descending (most recent first)
  const sorted = [...checkIns].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  let streakCount = 0;
  const recentNegative: DailyCheckIn[] = [];

  for (const checkIn of sorted) {
    if (checkIn.sentiment === 'negative') {
      streakCount++;
      recentNegative.push(checkIn);
    } else {
      break; // Streak broken
    }
  }

  return {
    hasAlert: streakCount >= threshold,
    streakCount,
    recentNegative: recentNegative.slice(0, threshold)
  };
}

/**
 * Mental health resources (non-diagnostic)
 */
export const MENTAL_HEALTH_RESOURCES = [
  {
    name: 'iCall (TISS)',
    description: 'Free counseling helpline by Tata Institute of Social Sciences',
    phone: '9152987821',
    available: 'Mon-Sat, 8am-10pm'
  },
  {
    name: 'Vandrevala Foundation',
    description: '24/7 mental health support helpline',
    phone: '1860-2662-345',
    available: '24/7'
  },
  {
    name: 'NIMHANS',
    description: 'National Institute of Mental Health helpline',
    phone: '080-46110007',
    available: 'Mon-Sat, 9am-5pm'
  },
  {
    name: 'Postpartum Support International',
    description: 'Support for postpartum mental health',
    website: 'www.postpartum.net',
    available: 'Online resources 24/7'
  }
];

/**
 * Store check-in to localStorage (for demo - use Firebase in production)
 */
export function saveCheckIn(checkIn: DailyCheckIn): void {
  const stored = localStorage.getItem('postpartum_checkins');
  const checkIns: DailyCheckIn[] = stored ? JSON.parse(stored) : [];
  checkIns.push(checkIn);
  localStorage.setItem('postpartum_checkins', JSON.stringify(checkIns));
}

/**
 * Get all stored check-ins
 */
export function getCheckIns(): DailyCheckIn[] {
  const stored = localStorage.getItem('postpartum_checkins');
  return stored ? JSON.parse(stored) : [];
}

/**
 * Generate demo check-in data for visualization
 */
export function generateDemoCheckIns(): DailyCheckIn[] {
  const today = new Date();
  const demoData: DailyCheckIn[] = [];
  
  const sentiments: Array<{ sentiment: SentimentLabel; emoji: string; text: string }> = [
    { sentiment: 'positive', emoji: '😊', text: 'Feeling good today, baby slept well!' },
    { sentiment: 'neutral', emoji: '😐', text: 'An okay day, just tired as usual.' },
    { sentiment: 'positive', emoji: '😄', text: 'Had a lovely walk with the baby!' },
    { sentiment: 'negative', emoji: '😢', text: 'Feeling overwhelmed and exhausted.' },
    { sentiment: 'negative', emoji: '😞', text: 'Struggling to cope, need rest.' },
    { sentiment: 'neutral', emoji: '🙂', text: 'Managing day by day.' },
    { sentiment: 'positive', emoji: '🥰', text: 'Baby smiled at me for the first time!' },
  ];

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const data = sentiments[6 - i];
    
    demoData.push({
      id: `demo-${i}`,
      date: date.toISOString(),
      text: data.text,
      emoji: data.emoji,
      sentiment: data.sentiment,
      confidenceScores: {
        positive: data.sentiment === 'positive' ? 0.85 : data.sentiment === 'neutral' ? 0.3 : 0.1,
        neutral: data.sentiment === 'neutral' ? 0.6 : 0.2,
        negative: data.sentiment === 'negative' ? 0.8 : 0.1
      },
      sentimentScore: data.sentiment === 'positive' ? 0.7 : data.sentiment === 'neutral' ? 0 : -0.7,
      emojiMismatch: false
    });
  }

  return demoData;
}
