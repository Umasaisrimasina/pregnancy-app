/**
 * SupportPromptList.tsx
 *
 * Numbered list of support suggestions for family members.
 * Extracted from FamilyDashboard's inline "Support Maya Today" block.
 * Config-driven — items via props, no internal state.
 */

import React from 'react';
import { Info, type LucideIcon } from 'lucide-react';

export interface SupportPrompt {
  id: number;
  text: string;
}

interface SupportPromptListProps {
  title?: string;
  icon?: LucideIcon;
  prompts: SupportPrompt[];
}

export const SupportPromptList: React.FC<SupportPromptListProps> = ({
  title = 'Support Maya Today',
  icon: Icon = Info,
  prompts,
}) => {
  return (
    <div className="bg-white dark:bg-dm-card rounded-[2rem] p-8 border border-slate-100 dark:border-dm-border">
      <div className="flex items-center gap-3 mb-6">
        <Icon size={20} className="text-blue-500" />
        <h3 className="font-bold text-slate-900 dark:text-dm-foreground text-lg">{title}</h3>
      </div>
      <div className="space-y-4">
        {prompts.map((prompt) => (
          <div
            key={prompt.id}
            className="flex gap-4 p-4 rounded-xl bg-slate-50 dark:bg-dm-muted border border-slate-100 dark:border-dm-border"
          >
            <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded flex items-center justify-center font-bold text-xs shrink-0">
              {prompt.id}
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{prompt.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
