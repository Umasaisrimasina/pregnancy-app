export type AppPhase = 'pre-pregnancy' | 'pregnancy' | 'post-partum' | 'baby-care';
export type UserRole = 'mother' | 'partner' | 'family' | 'medical';

export type ViewState = 'overview' | 'nutrition' | 'mind' | 'education' | 'community' | 'transition' | 'risk-analysis';

export interface User {
  name: string;
  avatar: string;
  phase: AppPhase;
  role: UserRole;
  week: number;
}

export interface Metric {
  label: string;
  value: number; // 0-100
  status: 'Good' | 'Fair' | 'Low' | 'Excellent';
  trend: 'up' | 'down' | 'steady';
}

export interface DailyLog {
  date: string;
  mood: 'rough' | 'anxious' | 'okay' | 'good' | 'great';
  stressLevel: number; // 0-100
  nutritionScore: number;
}

export const PHASE_CONFIG: Record<AppPhase, { label: string; color: string; theme: string }> = {
  'pre-pregnancy': { label: 'Pre-Conception', color: 'bg-emerald-500', theme: 'emerald' },
  'pregnancy': { label: 'Pregnancy', color: 'bg-rose-500', theme: 'rose' },
  'post-partum': { label: 'Post-Partum', color: 'bg-indigo-500', theme: 'indigo' },
  'baby-care': { label: 'Baby Care', color: 'bg-sky-500', theme: 'sky' },
};