/**
 * useMindCheckIn.ts
 *
 * Shared hook for the daily check-in flow used across all 4 Mind pages.
 * Centralizes localStorage operations (was duplicated in 4 files),
 * mood/factor state, live sentiment preview, and submit handler.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  analyzeSentiment,
  checkEmojiMismatch,
  sentimentToScore,
  DailyCheckIn,
  SentimentLabel,
} from '../services/sentimentService';
import { MoodType, moodToEmoji, moodToScore } from '../config/mindPage.config';

// ── localStorage Helpers (was copy-pasted across 4 files) ───────────────

function readCheckIns(storageKey: string): DailyCheckIn[] {
  try {
    const stored = localStorage.getItem(storageKey);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function persistCheckIn(storageKey: string, checkIn: DailyCheckIn) {
  const list = readCheckIns(storageKey);
  list.push(checkIn);
  localStorage.setItem(storageKey, JSON.stringify(list));
}

// ── Hook ─────────────────────────────────────────────────────────────────

export interface UseMindCheckInOptions {
  storageKey: string;
  factors: string[];
  defaultFactors: string[];
  roughEmoji?: string;
}

export function useMindCheckIn({
  storageKey,
  factors,
  defaultFactors,
  roughEmoji,
}: UseMindCheckInOptions) {
  // Mood & text state
  const [selectedMood, setSelectedMood] = useState<MoodType>('good');
  const [selectedFactors, setSelectedFactors] = useState<string[]>(defaultFactors);
  const [journalText, setJournalText] = useState('');

  // Analysis state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastResult, setLastResult] = useState<{ sentiment: SentimentLabel; mismatch: boolean } | null>(null);
  const successTimerRef = useRef<number | null>(null);

  // Check-in history
  const [checkIns, setCheckIns] = useState<DailyCheckIn[]>(() => readCheckIns(storageKey));

  // Reload checkIns when storageKey changes
  useEffect(() => {
    setCheckIns(readCheckIns(storageKey));
  }, [storageKey]);

  // Live sentiment preview
  const [livePreviewSentiment, setLivePreviewSentiment] = useState<SentimentLabel | null>(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);

  // Debounced live sentiment preview
  useEffect(() => {
    if (!journalText.trim() || journalText.length < 10) {
      setLivePreviewSentiment(null);
      return;
    }
    
    let isMounted = true;
    
    const id = setTimeout(async () => {
      if (!isMounted) return;
      setIsPreviewLoading(true);
      
      try {
        const result = await analyzeSentiment(journalText);
        if (isMounted) {
          setLivePreviewSentiment(result.sentiment);
        }
      } catch (error) {
        console.error('Sentiment analysis failed:', error);
        if (isMounted) {
          setLivePreviewSentiment(null);
        }
      } finally {
        if (isMounted) {
          setIsPreviewLoading(false);
        }
      }
    }, 500);
    
    return () => {
      isMounted = false;
      clearTimeout(id);
    };
  }, [journalText]);

  // Clean up success timer on unmount
  useEffect(() => {
    return () => {
      if (successTimerRef.current !== null) {
        clearTimeout(successTimerRef.current);
      }
    };
  }, []);

  // Toggle factor
  const toggleFactor = useCallback((factor: string) => {
    setSelectedFactors((prev) =>
      prev.includes(factor) ? prev.filter((f) => f !== factor) : [...prev, factor],
    );
  }, []);

  // Submit check-in
  const handleCheckInSubmit = useCallback(async () => {
    if (!journalText.trim()) return;

    setIsAnalyzing(true);
    
    try {
      const result = await analyzeSentiment(journalText);

      // Build emoji (respect roughEmoji override)
      const emojiMap = { ...moodToEmoji };
      if (roughEmoji) emojiMap.rough = roughEmoji;
      const emoji = emojiMap[selectedMood];

      const mismatch = checkEmojiMismatch(emoji, result.sentiment);

      const newCheckIn: DailyCheckIn = {
        date: new Date().toISOString(),
        emoji,
        text: journalText,
        sentiment: result.sentiment,
        sentimentScore: sentimentToScore(result.sentiment),
        factors: selectedFactors,
      };

      persistCheckIn(storageKey, newCheckIn);
      setCheckIns(readCheckIns(storageKey));
      setLastResult({ sentiment: result.sentiment, mismatch });
      setShowSuccess(true);
      setJournalText('');
      setLivePreviewSentiment(null);

      // Clear any existing timer before setting a new one
      if (successTimerRef.current !== null) {
        clearTimeout(successTimerRef.current);
      }
      successTimerRef.current = window.setTimeout(() => setShowSuccess(false), 5000);
    } catch (error) {
      console.error('Failed to submit check-in:', error);
      // Optionally set an error state or show a notification
    } finally {
      setIsAnalyzing(false);
    }
  }, [journalText, selectedMood, selectedFactors, storageKey, roughEmoji]);

  // Prepare sentiment trend data for the chart (last 7)
  const sentimentTrendData = checkIns.slice(-7).map((ci) => {
    const date = new Date(ci.date);
    const moodKey = Object.keys(moodToEmoji).find(
      (k) => moodToEmoji[k as MoodType] === ci.emoji,
    ) as MoodType | undefined;
    return {
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      score: (ci.sentimentScore + 1) * 50,
      moodScore: moodKey ? moodToScore[moodKey] : 50,
    };
  });

  return {
    // State
    selectedMood,
    setSelectedMood,
    selectedFactors,
    journalText,
    setJournalText,
    isAnalyzing,
    showSuccess,
    lastResult,
    checkIns,
    livePreviewSentiment,
    isPreviewLoading,
    sentimentTrendData,
    // Handlers
    toggleFactor,
    handleCheckInSubmit,
    // Config pass-through
    factors,
  };
}
