import { User, Users, HeartHandshake, Stethoscope, LucideIcon } from 'lucide-react';
import { UserRole } from '../types';

export type AccessLevel = 'full' | 'limited';

export interface UserTypeConfig {
  id: UserRole;
  label: string;
  icon: LucideIcon;
  access: AccessLevel;
  colors: {
    gradient: string;
    border: string;
    icon: string;
    shadow: string;
  };
}

/**
 * Static configuration defining all user roles.
 * This is the ONLY place to add, remove, or modify user types.
 */
export const USER_TYPES: UserTypeConfig[] = [
  {
    id: 'mother',
    label: 'Mother',
    icon: User,
    access: 'full',
    colors: {
      gradient: 'from-pink-500 to-rose-500',
      border: 'border-pink-400',
      icon: 'text-pink-500',
      shadow: 'shadow-pink-500/30',
    },
  },
  {
    id: 'partner',
    label: 'Partner',
    icon: Users,
    access: 'full',
    colors: {
      gradient: 'from-blue-500 to-indigo-500',
      border: 'border-blue-400',
      icon: 'text-blue-500',
      shadow: 'shadow-blue-500/30',
    },
  },
  {
    id: 'family',
    label: 'Family',
    icon: HeartHandshake,
    access: 'limited',
    colors: {
      gradient: 'from-amber-500 to-orange-500',
      border: 'border-amber-400',
      icon: 'text-amber-500',
      shadow: 'shadow-amber-500/30',
    },
  },
  {
    id: 'medical',
    label: 'Medical',
    icon: Stethoscope,
    access: 'limited',
    colors: {
      gradient: 'from-emerald-500 to-teal-500',
      border: 'border-emerald-400',
      icon: 'text-emerald-500',
      shadow: 'shadow-emerald-500/30',
    },
  },
];

/** Lookup a single user type by role id */
export const getUserType = (id: UserRole): UserTypeConfig | undefined =>
  USER_TYPES.find((t) => t.id === id);
