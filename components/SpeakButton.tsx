/**
 * SpeakButton.tsx
 * 
 * Reusable component for text-to-speech functionality.
 * Displays a 🔊 icon that triggers translation and speech.
 * Shows loading indicator while processing.
 */

import React, { useState, useCallback } from 'react';
import { Volume2, VolumeX, Loader2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { translateAndSpeak, playAudioWithControl, stopCurrentAudio } from '../services/speechService';

interface SpeakButtonProps {
  /** The text content to translate and speak */
  text: string;
  /** Optional size of the icon (default: 14) */
  size?: number | 'sm' | 'md' | 'lg';
  /** Optional className for styling */
  className?: string;
  /** Optional callback when speech starts */
  onSpeechStart?: () => void;
  /** Optional callback when speech ends */
  onSpeechEnd?: () => void;
  /** Optional callback on error */
  onError?: (error: string) => void;
  /** Show translated text tooltip */
  showTooltip?: boolean;
}

// Size mappings
const sizeMap = {
  'sm': 12,
  'md': 14,
  'lg': 16
};

/**
 * SpeakButton Component
 * 
 * A button that translates text to the selected language and speaks it aloud.
 * Uses Azure Translation and Text-to-Speech APIs.
 */
export const SpeakButton: React.FC<SpeakButtonProps> = ({
  text,
  size = 14,
  className = '',
  onSpeechStart,
  onSpeechEnd,
  onError,
  showTooltip = true
}) => {
  // Resolve size to number
  const iconSize = typeof size === 'string' ? sizeMap[size] || 14 : size;
  // State management
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [translatedText, setTranslatedText] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Get current language from context
  const { currentLanguage } = useLanguage();

  /**
   * Handle click on the speak button
   * Translates text and plays audio
   */
  const handleClick = useCallback(async () => {
    // If already playing, stop the audio
    if (isPlaying) {
      stopCurrentAudio();
      setIsPlaying(false);
      onSpeechEnd?.();
      return;
    }

    // Don't process if already loading
    if (isLoading) return;

    // Clear previous state
    setError(null);
    setIsLoading(true);

    try {
      // Translate and get speech audio
      const result = await translateAndSpeak(text, currentLanguage.code);

      if (!result.success) {
        throw new Error(result.error || 'Failed to process audio');
      }

      if (!result.audioBlob) {
        throw new Error('No audio generated');
      }

      // Store translated text for tooltip
      setTranslatedText(result.translatedText);

      // Play the audio
      setIsPlaying(true);
      onSpeechStart?.();

      await playAudioWithControl(result.audioBlob);

      setIsPlaying(false);
      onSpeechEnd?.();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      onError?.(errorMessage);
      setIsPlaying(false);
    } finally {
      setIsLoading(false);
    }
  }, [text, currentLanguage.code, isPlaying, isLoading, onSpeechStart, onSpeechEnd, onError]);

  // Determine button state and icon
  const getIcon = () => {
    if (isLoading) {
      return <Loader2 size={iconSize} className="animate-spin" />;
    }
    if (isPlaying) {
      return <VolumeX size={iconSize} />;
    }
    return <Volume2 size={iconSize} />;
  };

  // Determine tooltip text
  const getTooltipText = () => {
    if (isLoading) return 'Processing...';
    if (isPlaying) return 'Click to stop';
    if (error) return `Error: ${error}`;
    if (translatedText && showTooltip && currentLanguage.code !== 'en') {
      return `${currentLanguage.nativeName}: ${translatedText.substring(0, 100)}${translatedText.length > 100 ? '...' : ''}`;
    }
    return `Listen in ${currentLanguage.nativeName}`;
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`
        inline-flex items-center justify-center
        p-1.5 rounded-full
        transition-all duration-200
        shadow-sm border
        active:scale-95
        disabled:opacity-50 disabled:cursor-wait
        focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1
        ${isPlaying 
          ? 'bg-emerald-500 text-white border-emerald-600 shadow-emerald-200' 
          : 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100 hover:text-emerald-700 hover:border-emerald-300'}
        ${error ? 'bg-red-50 text-red-500 border-red-200 hover:bg-red-100' : ''}
        ${className}
      `}
      title={getTooltipText()}
      aria-label={isPlaying ? 'Stop speaking' : 'Listen to text'}
    >
      {getIcon()}
    </button>
  );
};

/**
 * SpeakableText Component
 * 
 * Wrapper component that adds a speak button next to text content.
 */
interface SpeakableTextProps {
  /** The text content */
  text: string;
  /** Children elements to render */
  children: React.ReactNode;
  /** Position of the speak button */
  buttonPosition?: 'left' | 'right' | 'top-right';
  /** Additional className */
  className?: string;
}

export const SpeakableText: React.FC<SpeakableTextProps> = ({
  text,
  children,
  buttonPosition = 'right',
  className = ''
}) => {
  const positionClasses = {
    'left': 'flex-row-reverse',
    'right': 'flex-row',
    'top-right': 'relative'
  };

  if (buttonPosition === 'top-right') {
    return (
      <div className={`relative group ${className}`}>
        {children}
        <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <SpeakButton text={text} size={16} />
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-start gap-2 ${positionClasses[buttonPosition]} ${className}`}>
      <div className="flex-1">{children}</div>
      <SpeakButton text={text} size={16} className="flex-shrink-0 mt-1" />
    </div>
  );
};

export default SpeakButton;
