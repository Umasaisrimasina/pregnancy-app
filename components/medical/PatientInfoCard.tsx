/**
 * PatientInfoCard.tsx
 *
 * Patient summary header for the clinical dashboard main content area.
 * Presentational — all data via props.
 */

import React from 'react';
import { User, MessageCircle, ClipboardList } from 'lucide-react';

interface PatientInfoCardProps {
  name: string;
  details: string;
  onMessage?: () => void;
  onClipboard?: () => void;
}

export const PatientInfoCard: React.FC<PatientInfoCardProps> = ({
  name,
  details,
  onMessage,
  onClipboard,
}) => {
  return (
    <div className="flex justify-between items-start mb-8">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-dm-muted flex items-center justify-center text-slate-400 dark:text-slate-500">
          <User size={32} />
        </div>
        <div>
          <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-dm-foreground">{name}</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">{details}</p>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={onMessage}
          aria-label="Send message to patient"
          className="p-2.5 text-slate-400 hover:text-slate-600 dark:bg-dm-muted dark:text-slate-400 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-dm-accent rounded-xl transition-colors"
        >
          <MessageCircle size={20} />
        </button>
        <button
          onClick={onClipboard}
          aria-label="Copy patient info to clipboard"
          className="p-2.5 text-slate-400 hover:text-slate-600 dark:bg-dm-muted dark:text-slate-400 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-dm-accent rounded-xl transition-colors"
        >
          <ClipboardList size={20} />
        </button>
      </div>
    </div>
  );
};
