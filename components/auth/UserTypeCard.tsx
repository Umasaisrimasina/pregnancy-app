import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { UserTypeConfig } from '../../config/userTypes.config';

interface UserTypeCardProps {
  config: UserTypeConfig;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

/**
 * Atomic presentational component for a single user-type card.
 * Renders role icon, label, and selected/unselected visual state.
 * Contains NO routing, auth, permissions, or onboarding logic.
 */
export const UserTypeCard: React.FC<UserTypeCardProps> = ({ config, isSelected, onSelect }) => {
  const { id, label, icon: Icon, colors } = config;

  return (
    <button
      type="button"
      onClick={() => onSelect(id)}
      className={`
        relative flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all duration-300 transform
        ${isSelected
          ? `bg-gradient-to-br ${colors.gradient} text-white border-transparent shadow-lg ${colors.shadow} scale-105`
          : 'border-slate-200 dark:border-dm-border bg-white dark:bg-dm-card text-slate-500 dark:text-dm-muted-fg hover:border-slate-300 dark:hover:border-dm-foreground/50 hover:scale-[1.02] hover:shadow-md'}
      `}
    >
      {isSelected && (
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-md">
          <CheckCircle2 size={12} className={colors.icon} />
        </div>
      )}
      <div className={`
        w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300
        ${isSelected ? 'bg-white/20' : 'bg-slate-100 dark:bg-dm-muted'}
      `}>
        <Icon size={22} className={isSelected ? 'text-white' : colors.icon} />
      </div>
      <span className={`text-[10px] font-bold uppercase tracking-wide ${isSelected ? 'text-white' : 'text-slate-600 dark:text-dm-muted-fg'}`}>
        {label}
      </span>
    </button>
  );
};
