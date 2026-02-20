/**
 * ObstetricOverviewCard.tsx
 *
 * GPLAD + LMP/EDD display for Digital Case History.
 * Editable GPLAD inputs with info tooltips.
 */

import React, { useState } from 'react';
import { Baby, Info } from 'lucide-react';

interface GPLADEntry {
  letter: string;
  value: number;
  label: string;
  description: string;
}

interface ObstetricOverviewCardProps {
  gplad: GPLADEntry[];
  lmpFormatted: string;
  eddFormatted: string;
  onGPLADChange?: (letter: string, value: number) => void;
}

const InfoTooltip: React.FC<{ text: string }> = ({ text }) => (
  <span className="relative group/tip inline-flex ml-1 cursor-help">
    <Info size={13} className="text-purple-400 dark:text-purple-500 hover:text-purple-600 dark:hover:text-purple-300 transition-colors" />
    <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-52 px-3 py-2 text-[11px] leading-relaxed font-normal text-white dark:text-dm-foreground bg-slate-800 dark:bg-dm-card border border-slate-700 dark:border-dm-border rounded-lg shadow-lg opacity-0 group-hover/tip:opacity-100 transition-opacity duration-200 z-50 text-center normal-case tracking-normal">
      {text}
      <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent border-t-slate-800 dark:border-t-dm-card" />
    </span>
  </span>
);

export const ObstetricOverviewCard: React.FC<ObstetricOverviewCardProps> = ({
  gplad,
  lmpFormatted,
  eddFormatted,
  onGPLADChange,
}) => {
  const [editingField, setEditingField] = useState<string | null>(null);

  const handleValueChange = (letter: string, rawValue: string) => {
    const num = Math.max(0, Math.min(20, parseInt(rawValue) || 0));
    onGPLADChange?.(letter, num);
  };

  return (
    <div className="bg-white dark:bg-dm-card rounded-[2rem] p-6 md:p-8 border border-slate-100 dark:border-dm-border shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-lg">
          <Baby size={20} />
        </div>
        <h3 className="font-bold font-display text-slate-900 dark:text-dm-foreground">Obstetric Overview</h3>
      </div>

      {/* GPLAD */}
      <div className="bg-purple-50 dark:bg-purple-900/15 rounded-2xl p-5 border border-purple-100 dark:border-purple-800/30 mb-5">
        <span className="text-[10px] font-bold text-purple-700 dark:text-purple-300 uppercase tracking-widest block mb-3">GPLAD</span>
        <div className="flex items-start gap-2 sm:gap-3 flex-wrap">
          {gplad.map((g) => (
            <div key={g.letter} className="flex flex-col items-center gap-1 min-w-[52px]">
              {/* Letter + Info tooltip */}
              <div className="flex items-center gap-0.5">
                <span className="text-xs font-bold text-purple-600 dark:text-purple-300 uppercase tracking-wide">
                  {g.letter}
                </span>
                <InfoTooltip text={g.description} />
              </div>

              {/* Editable value */}
              {editingField === g.letter ? (
                <input
                  type="number"
                  min={0}
                  max={20}
                  autoFocus
                  value={g.value}
                  onChange={(e) => handleValueChange(g.letter, e.target.value)}
                  onBlur={() => setEditingField(null)}
                  onKeyDown={(e) => { if (e.key === 'Enter') setEditingField(null); }}
                  className="w-12 h-10 text-center text-2xl font-display font-bold text-slate-900 dark:text-dm-foreground bg-white dark:bg-dm-muted border-2 border-purple-400 dark:border-purple-500 rounded-xl outline-none focus:ring-2 focus:ring-purple-300 dark:focus:ring-purple-700 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              ) : (
                <button
                  onClick={() => setEditingField(g.letter)}
                  title={`Click to edit ${g.label}`}
                  className="w-12 h-10 flex items-center justify-center text-2xl font-display font-bold text-slate-900 dark:text-dm-foreground bg-white/60 dark:bg-dm-muted/60 hover:bg-white dark:hover:bg-dm-muted border border-purple-200 dark:border-purple-700/40 hover:border-purple-400 dark:hover:border-purple-500 rounded-xl cursor-pointer transition-all"
                >
                  {g.value}
                </button>
              )}

              {/* Label below */}
              <span className="text-[9px] text-purple-500 dark:text-purple-400 font-medium leading-tight text-center">
                {g.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* LMP / EDD */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-50 dark:bg-dm-muted rounded-xl p-3 border border-slate-100 dark:border-dm-border">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-1">LMP</span>
          <span className="text-sm font-bold text-slate-900 dark:text-dm-foreground">{lmpFormatted}</span>
        </div>
        <div className="bg-slate-50 dark:bg-dm-muted rounded-xl p-3 border border-slate-100 dark:border-dm-border">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-1">EDD</span>
          <span className="text-sm font-bold text-slate-900 dark:text-dm-foreground">{eddFormatted}</span>
        </div>
      </div>
    </div>
  );
};
