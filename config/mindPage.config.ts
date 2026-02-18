/**
 * mindPage.config.ts
 *
 * Configuration objects for the 4 Mind page variants that share the
 * MindPageShell component. Each variant differs only in text, colors,
 * storage key, chat context, and optional features.
 */

import { Heart } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// ── Mood System (centralized, was duplicated in 5 files) ─────────────────

export type MoodType = 'rough' | 'okay' | 'good';

export const moodToEmoji: Record<MoodType, string> = {
  rough: '😔',
  okay: '😐',
  good: '😊',
};

export const moodToScore: Record<MoodType, number> = {
  rough: 20,
  okay: 50,
  good: 90,
};

// ── Page Config Shape ────────────────────────────────────────────────────

export interface MindPageConfig {
  /** localStorage key for check-ins. */
  storageKey: string;
  /** Page main title. */
  title: string;
  /** Subtitle below the title. */
  subtitle: string;
  /** AI chat context key sent to sendChatMessage(). */
  chatContext: string;
  /** Title shown in the chat promo card and the ChatPanel header. */
  chatTitle: string;
  /** Description text in the chat promo card. */
  chatPromoDescription: string;
  /** First AI message shown in the ChatPanel. */
  initialChatMessage: string;
  /** Fallback response when the AI call fails. */
  fallbackChatResponse: string;
  /** recharts stroke color for the sentiment trend line. */
  sentimentChartColor: string;
  /** Available factors the user can tag their check-in with. */
  factors: string[];
  /** Which factors are selected by default. */
  defaultFactors: string[];
  /** Override rough-mood emoji (BabyCare uses 😢 instead of 😔). */
  roughEmoji?: string;
  /** Optional motivational quote shown at the top. */
  quote?: { text: string; icon: LucideIcon };
  /** Tailwind color tokens for primary accent (button bg, ring, etc.). */
  accentColor: string;
  /** SpeakButton text for the title area. */
  speakText: string;
}

// ── Variant Configs ──────────────────────────────────────────────────────

export const preConceptionMindConfig: MindPageConfig = {
  storageKey: 'preconception_mind_checkins',
  title: 'Fertility & Wellness',
  subtitle: 'Preparing your mind and body for conception.',
  chatContext: 'preconception',
  chatTitle: 'Silent Chat',
  chatPromoDescription:
    "Need to talk through your feelings? Our AI companion is here — private, secure, judgment-free.",
  initialChatMessage:
    "I'm here to listen. This space is completely private and judgment-free. What's on your mind?",
  fallbackChatResponse:
    "I hear you. It's completely normal to feel that way during this phase. Would you like to explore some coping strategies?",
  sentimentChartColor: '#10b981',
  factors: ['Sleep', 'Work', 'Family', 'My Body', 'Diet'],
  defaultFactors: ['My Body'],
  quote: {
    text: 'Your mental wellness today shapes the foundation for tomorrow. Invest in yourself.',
    icon: Heart,
  },
  accentColor: 'primary',
  speakText: 'Fertility & Wellness: Preparing your mind and body for conception.',
};

export const pregnancyMindConfig: MindPageConfig = {
  storageKey: 'pregnancy_mind_checkins',
  title: 'Prenatal Wellness',
  subtitle: 'Nurturing your emotional health during pregnancy.',
  chatContext: 'pregnancy',
  chatTitle: 'Midwife AI',
  chatPromoDescription:
    'Need to talk through pregnancy concerns? Our AI companion is here to support you.',
  initialChatMessage:
    'Welcome to your prenatal wellness space. How are you feeling today?',
  fallbackChatResponse:
    "Thank you for sharing. Pregnancy brings so many changes. Would you like to talk more about how you're coping?",
  sentimentChartColor: '#f43f5e',
  factors: ['Sleep', 'Work', 'Family', 'My Body', 'Diet'],
  defaultFactors: ['My Body'],
  quote: {
    text: 'You are stronger than you know. Each day brings you closer to meeting your little one.',
    icon: Heart,
  },
  accentColor: 'primary',
  speakText: 'Prenatal Wellness: Nurturing your emotional health during pregnancy.',
};

export const babyCareMindConfig: MindPageConfig = {
  storageKey: 'babycare_mind_checkins',
  title: 'Parent Wellness',
  subtitle: 'Taking care of yourself while caring for baby.',
  chatContext: 'babycare',
  chatTitle: 'Parent Support',
  chatPromoDescription:
    'Parenting is a journey. Chat with our AI companion for guidance and support.',
  initialChatMessage:
    "Welcome to parent wellness. Caring for a newborn is beautiful but exhausting. How are you holding up?",
  fallbackChatResponse:
    "That's completely valid. Parenting brings a mix of emotions. Would you like to talk about specific challenges?",
  sentimentChartColor: '#0ea5e9',
  factors: ['Sleep', 'Work', 'Family', 'Baby Care', 'Diet'],
  defaultFactors: ['Baby Care'],
  roughEmoji: '😢',
  accentColor: 'secondary',
  speakText: 'Parent Wellness: Taking care of yourself while caring for baby.',
};

export const genericMindConfig: MindPageConfig = {
  storageKey: 'generic_mind_checkins',
  title: 'Stress & Mind',
  subtitle: 'Understanding your emotional baseline.',
  chatContext: 'primary',
  chatTitle: 'Silent Chat',
  chatPromoDescription:
    "Need to talk through your feelings? Our AI companion is here — private, secure, judgment-free.",
  initialChatMessage:
    "I'm here to listen. This space is private and judgment-free. What's on your mind?",
  fallbackChatResponse:
    'Thank you for sharing that. Your feelings are valid. Would you like to explore this further?',
  sentimentChartColor: '#34d399',
  factors: ['Sleep', 'Work', 'Family', 'My Body', 'Diet'],
  defaultFactors: ['My Body'],
  accentColor: 'primary',
  speakText: 'Stress & Mind: Understanding your emotional baseline.',
};
