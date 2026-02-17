import React from 'react';
import { ArrowRight } from 'lucide-react';

interface AuthPrimaryCTAProps {
  label: string;
  isLoading?: boolean;
  disabled?: boolean;
}

/**
 * Reusable primary CTA button for auth pages.
 * Supports loading spinner and disabled state.
 * Contains NO validation, API calls, or routing logic.
 */
export const AuthPrimaryCTA: React.FC<AuthPrimaryCTAProps> = ({
  label,
  isLoading = false,
  disabled = false,
}) => {
  return (
    <button
      type="submit"
      disabled={isLoading || disabled}
      className={`
        w-full bg-slate-900 dark:bg-dm-foreground text-white font-bold py-4 rounded-xl shadow-lg shadow-dark-950/20 hover:bg-slate-700 dark:hover:bg-dm-muted transition-all flex items-center justify-center gap-2 group
        ${isLoading || disabled ? 'opacity-70 cursor-not-allowed' : ''}
      `}
    >
      {isLoading ? (
        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : (
        <>
          {label}
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </>
      )}
    </button>
  );
};
