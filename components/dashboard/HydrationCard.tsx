/**
 * HydrationCard.tsx
 *
 * Reusable hydration tracker card with glass indicators.
 * Extracted from PregnancyDashboard's inline "Hydration" block.
 *
 * Props-driven: current count and goal are configurable.
 * No internal state — parent manages water count via onAdd callback.
 */

import React from 'react';
import { Droplets } from 'lucide-react';

interface HydrationCardProps {
  /** Current number of glasses consumed. */
  current?: number;
  /** Daily goal in glasses. */
  goal?: number;
  /** Called when the "+ Add Water" button is clicked. */
  onAdd?: () => void;
}

export const HydrationCard: React.FC<HydrationCardProps> = ({
  current = 4,
  goal = 8,
  onAdd,
}) => {
  return (
    <div className="bg-white dark:bg-dm-card rounded-[2rem] p-6 border border-slate-100 dark:border-dm-border shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-blue-50 text-blue-500 rounded-lg">
          <Droplets size={20} />
        </div>
        <h3 className="text-xl font-display font-bold text-slate-900 dark:text-dm-foreground">
          Hydration
        </h3>
      </div>

      <div className="flex justify-between items-end mb-2">
        <span className="text-3xl font-display font-bold text-slate-900 dark:text-dm-foreground">
          {current}<span className="text-lg text-slate-400 font-normal">/{goal}</span>
        </span>
        <span className="text-xs font-bold text-blue-500">Glasses</span>
      </div>

      <div className="flex gap-1 h-12">
        {Array.from({ length: goal }, (_, i) => i + 1).map((i) => (
          <div
            key={i}
            className={`flex-1 rounded-full ${i <= current ? 'bg-blue-400' : 'bg-slate-100 dark:bg-dm-muted'}`}
          />
        ))}
      </div>

      <button
        onClick={onAdd}
        className="w-full mt-4 py-2 rounded-xl border border-slate-100 dark:border-dm-border text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-dm-muted transition-colors"
      >
        + Add Water
      </button>
    </div>
  );
};
