/**
 * CardShell.tsx
 *
 * Shared base card wrapper used across all dashboards.
 * Eliminates the 20+ duplicated `bg-white dark:bg-dm-card rounded-[2rem] p-8 border…` pattern.
 *
 * Presentational only — no state, no business logic.
 */

import React from 'react';

interface CardShellProps {
  children: React.ReactNode;
  /** Additional Tailwind classes appended to the base card style. */
  className?: string;
  /** Override the default padding (p-8). */
  padding?: string;
}

export const CardShell: React.FC<CardShellProps> = ({
  children,
  className = '',
  padding = 'p-8',
}) => (
  <div
    className={`bg-white dark:bg-dm-card rounded-[2rem] ${padding} border border-slate-100 dark:border-dm-border shadow-sm ${className}`}
  >
    {children}
  </div>
);
