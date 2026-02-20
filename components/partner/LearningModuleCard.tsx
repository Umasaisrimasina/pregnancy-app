/**
 * LearningModuleCard.tsx
 *
 * Video-based learning module card.
 * Extracted from PartnerDashboard inline block.
 */

import React from 'react';
import { Play } from 'lucide-react';
import { CardShell } from '../ui/CardShell';

interface LearningModuleCardProps {
  title?: string;
  description?: string;
  onPlay: () => void;
}

export const LearningModuleCard: React.FC<LearningModuleCardProps> = ({
  title = 'Learning Module',
  description = 'How to prepare for the third trimester transition.',
  onPlay,
}) => (
  <CardShell>
    <h3 className="font-bold text-slate-900 dark:text-dm-foreground mb-2">{title}</h3>
    <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">{description}</p>

    <button
      type="button"
      onClick={onPlay}
      aria-label={`Play video: ${description}`}
      className="aspect-video bg-slate-100 dark:bg-dm-muted rounded-2xl flex items-center justify-center relative overflow-hidden group cursor-pointer w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-dm-card transition-all"
    >
      <div className="w-12 h-12 bg-white dark:bg-dm-accent rounded-full flex items-center justify-center shadow-lg text-blue-600 dark:text-blue-400 z-10 group-hover:scale-110 transition-transform">
        <Play size={20} className="ml-1" fill="currentColor" />
      </div>
      <div className="absolute inset-0 bg-slate-200/50 dark:bg-dm-card/50"></div>
    </button>
  </CardShell>
);
