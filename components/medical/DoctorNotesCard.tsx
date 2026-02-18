/**
 * DoctorNotesCard.tsx
 *
 * Editable doctor notes card for Digital Case History.
 * Presentational — note value + onChange callback via props.
 * Does NOT persist to backend directly.
 */

import React from 'react';
import { FileText, Save } from 'lucide-react';

interface DoctorNotesCardProps {
  notes: string;
  onChange: (value: string) => void;
  isSaved?: boolean;
  lastSavedTime?: string;
}

export const DoctorNotesCard: React.FC<DoctorNotesCardProps> = ({
  notes,
  onChange,
  isSaved = false,
  lastSavedTime,
}) => {
  return (
    <div className="bg-white dark:bg-dm-card rounded-[2rem] p-6 md:p-8 border border-slate-100 dark:border-dm-border shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-lg">
          <FileText size={20} />
        </div>
        <h3 id="doctor-notes-label" className="font-bold font-display text-slate-900 dark:text-dm-foreground">Doctor Notes</h3>
        {isSaved && (
          <div className="ml-auto flex items-center gap-1 text-emerald-500 animate-in fade-in duration-300">
            <Save size={12} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Saved</span>
          </div>
        )}
      </div>

      <textarea
        aria-labelledby="doctor-notes-label"
        value={notes}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter emergency treatment notes..."
        rows={8}
        className="w-full bg-slate-50 dark:bg-dm-muted rounded-xl p-4 border border-slate-200 dark:border-dm-border text-sm text-slate-900 dark:text-dm-foreground placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none font-mono leading-relaxed"
      />
      {lastSavedTime && (
        <p className="mt-2 text-[10px] text-slate-400 dark:text-slate-500 font-medium">
          Notes auto-save and persist to Case History. Last saved: {lastSavedTime}
        </p>
      )}
    </div>
  );
};
