/**
 * FeelingTracker.tsx
 *
 * Shared "How are you feeling?" card used in Pregnancy and PostPartum dashboards.
 * Renders a 4-option mood picker (Sad, Neutral, Good, Great) with text input.
 *
 * Was duplicated verbatim in PregnancyDashboard (~40 lines) and PostPartumDashboard (~40 lines).
 */

import React, { useId, useState } from 'react';
import { Meh } from 'lucide-react';
import { SpeakButton } from '../SpeakButton';

interface FeelingTrackerProps {
  /** 'primary' uses rose / pink tones; 'secondary' uses purple / indigo tones. */
  colorScheme?: 'primary' | 'secondary';
  /** When true, mood buttons and textarea are disabled (read-only for family/observer roles). */
  readonly?: boolean;
  /** Controlled selected mood value. */
  selectedMood?: string | null;
  /** Callback when mood selection changes. */
  onMoodChange?: (mood: string | null) => void;
  /** Controlled textarea text value. */
  text?: string;
  /** Callback when textarea text changes. */
  onTextChange?: (text: string) => void;
}

const COLOR_MAP = {
  primary: {
    bg: 'bg-primary-800 dark:bg-primary-950',
    subtitle: 'text-primary-200',
    buttonBg: 'bg-primary-700/50',
    buttonHover: 'hover:bg-primary-600',
    label: 'text-primary-200',
    inputBg: 'bg-primary-700/50',
    inputBorder: 'border-primary-600/50',
    placeholder: 'placeholder-primary-300',
    ring: 'focus:ring-primary-400',
  },
  secondary: {
    bg: 'bg-secondary-900',
    subtitle: 'text-secondary-200',
    buttonBg: 'bg-secondary-800/50',
    buttonHover: 'hover:bg-secondary-700',
    label: 'text-secondary-200',
    inputBg: 'bg-secondary-800/50',
    inputBorder: 'border-secondary-700/50',
    placeholder: 'placeholder-secondary-400',
    ring: 'focus:ring-secondary-500',
  },
};

const MOODS = [
  { emoji: '😢', label: 'Sad' },
  { meh: true, label: 'Neutral' },
  { emoji: '😊', label: 'Good' },
  { emoji: '🤩', label: 'Great' },
] as const;

const SPEAK_TEXT =
  "How are you feeling? It's normal to feel a mix of emotions right now. Tracking helps. You can select Sad, Neutral, Good, or Great, and describe what's on your mind.";

export const FeelingTracker: React.FC<FeelingTrackerProps> = ({
  colorScheme = 'primary',
  readonly = false,
  selectedMood: controlledMood,
  onMoodChange,
  text: controlledText,
  onTextChange,
}) => {
  const textareaId = useId();
  const c = COLOR_MAP[colorScheme];

  // Internal state for uncontrolled mode
  const [internalMood, setInternalMood] = useState<string | null>(null);
  const [internalText, setInternalText] = useState('');

  // Use controlled values if provided, otherwise use internal state
  const selectedMood = controlledMood !== undefined ? controlledMood : internalMood;
  const text = controlledText !== undefined ? controlledText : internalText;

  const handleMoodClick = (mood: string) => {
    if (readonly) return;
    const newMood = selectedMood === mood ? null : mood; // Toggle off if clicking the same mood
    if (onMoodChange) {
      onMoodChange(newMood);
    } else {
      setInternalMood(newMood);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    if (onTextChange) {
      onTextChange(newText);
    } else {
      setInternalText(newText);
    }
  };

  return (
    <div className={`${c.bg} rounded-[2rem] p-8 flex flex-col ${readonly ? 'opacity-80' : ''}`}>
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-3">
          <h3 className="text-white text-2xl font-bold">How are you feeling?</h3>
          {readonly && (
            <span className="text-xs font-bold uppercase tracking-wider bg-white/15 text-white/80 px-2 py-0.5 rounded-full">
              View Only
            </span>
          )}
        </div>
        <SpeakButton
          text={SPEAK_TEXT}
          className="text-white border-white/30 bg-white/10 hover:bg-white/20"
        />
      </div>
      <p className={`${c.subtitle} text-sm mb-6`}>
        It&apos;s normal to feel a mix of emotions right now. Tracking helps.
      </p>

      <div className="flex flex-col gap-3 mb-6">
        <div className="flex gap-3">
          {MOODS.map((m) => (
            <button
              key={m.label}
              disabled={readonly}
              onClick={() => handleMoodClick(m.label)}
              aria-label={`${m.label} mood`}
              aria-pressed={selectedMood === m.label}
              className={`flex-1 flex flex-col items-center gap-2 p-3 rounded-xl ${selectedMood === m.label ? 'ring-2 ring-white/50' : c.buttonBg} ${readonly ? 'cursor-not-allowed' : c.buttonHover} transition-colors`}
            >
              {'meh' in m ? (
                <Meh size={32} className="text-amber-400" />
              ) : (
                <span className="text-3xl">{'emoji' in m ? m.emoji : ''}</span>
              )}
              <span className={`${c.label} text-xs font-medium`}>{m.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor={textareaId} className={`${c.label} text-sm font-medium mb-2 block`}>What&apos;s on your mind?</label>
        <textarea
          id={textareaId}
          value={text}
          onChange={handleTextChange}
          placeholder={readonly ? 'Read-only mode' : "Describe how you're feeling..."}
          rows={3}
          disabled={readonly}
          className={`w-full px-4 py-3 rounded-xl ${c.inputBg} border ${c.inputBorder} text-white ${c.placeholder} focus:outline-none focus:ring-2 ${c.ring} focus:border-transparent transition-all resize-none text-sm ${readonly ? 'cursor-not-allowed opacity-60' : ''}`}
        />
      </div>
    </div>
  );
};
