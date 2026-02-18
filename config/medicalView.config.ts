/**
 * medicalView.config.ts
 *
 * Static data for the Medical View (Doctor Perspective).
 * Keeps all presentational components data-free.
 */

import { type LucideIcon, CalendarCheck, Syringe, ScanLine } from 'lucide-react';

// ── Patient Data ────────────────────────────────────────────────────────

export const PATIENT_ID = 'PAT-2024-MS-0042';

export const PATIENT = {
  name: 'Maya Sharma',
  age: 28,
  weight: 64.2,
  bloodGroup: 'B+',
  rhStatus: 'Positive',
  photoUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80',
};

// ── Active Patients Sidebar ─────────────────────────────────────────────

export interface PatientListItem {
  id: number;
  name: string;
  subtitle: string;
  details?: string;
  photoUrl?: string;
  isActive?: boolean;
}

export const ACTIVE_PATIENTS: PatientListItem[] = [
  {
    id: 1,
    name: 'Maya Sharma',
    subtitle: '24 Weeks · High Risk',
    details: 'Age: 28 | LMP: April 12, 2024 | G1P0',
    photoUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80',
    isActive: true,
  },
  { id: 2, name: 'Patient 2', subtitle: 'Routine Checkup', details: 'Age: 32 | LMP: May 20, 2024 | G2P1' },
  { id: 3, name: 'Patient 3', subtitle: 'Routine Checkup', details: 'Age: 25 | LMP: June 15, 2024 | G1P0' },
  { id: 4, name: 'Patient 4', subtitle: 'Routine Checkup', details: 'Age: 30 | LMP: March 8, 2024 | G3P2' },
];

// ── Clinical Metric Cards ───────────────────────────────────────────────

export interface ClinicalMetric {
  title: string;
  value: string;
  unit: string;
  subtitle: string;
  status?: 'urgent' | 'normal';
  iconKey: 'blood-sugar' | 'weight-gain' | 'avg-sleep';
  bgClass: string;
  borderClass: string;
  titleColor: string;
  subtitleColor: string;
}

export const CLINICAL_METRICS: ClinicalMetric[] = [
  {
    title: 'Blood Sugar',
    value: '125',
    unit: 'mg/dL',
    subtitle: 'Spike detected after lunch (Today)',
    status: 'urgent',
    iconKey: 'blood-sugar',
    bgClass: 'bg-primary-50 dark:bg-primary-800/20',
    borderClass: 'border-primary-100 dark:border-primary-800/30',
    titleColor: 'text-primary-700 dark:text-primary-300',
    subtitleColor: 'text-primary-600 dark:text-primary-300',
  },
  {
    title: 'Weight Gain',
    value: '+4.2',
    unit: 'kg',
    subtitle: 'On track for trimester 2',
    iconKey: 'weight-gain',
    bgClass: 'bg-primary-50 dark:bg-primary-900/20',
    borderClass: 'border-primary-100 dark:border-primary-900/30',
    titleColor: 'text-primary-800 dark:text-primary-300',
    subtitleColor: 'text-primary-700 dark:text-primary-300',
  },
  {
    title: 'Avg Sleep',
    value: '7.5',
    unit: 'hrs',
    subtitle: 'Consistent for last 7 days',
    iconKey: 'avg-sleep',
    bgClass: 'bg-blue-50 dark:bg-blue-900/20',
    borderClass: 'border-blue-100 dark:border-blue-900/30',
    titleColor: 'text-blue-800 dark:text-blue-300',
    subtitleColor: 'text-blue-700 dark:text-blue-300',
  },
];

// ── Medical Files ───────────────────────────────────────────────────────

export interface MedicalFile {
  id: number;
  label: string;
  title: string;
  uploadedAgo: string;
}

export const MEDICAL_FILES: MedicalFile[] = [
  { id: 1, label: 'PDF', title: 'Level 2 Ultrasound Scan', uploadedAgo: '2 days ago' },
];

// ── Obstetric Data ──────────────────────────────────────────────────────

export const OBSTETRIC = {
  gravida: 1,
  para: 0,
  live: 0,
  abortions: 0,
  deaths: 0,
  lmp: '2024-04-12',
  edd: '2025-01-17',
};

// ── Risk Factors ────────────────────────────────────────────────────────

export interface RiskFlag {
  label: string;
  key: string;
  active: boolean;
}

export const RISK_FLAGS: RiskFlag[] = [
  { label: 'Hypertension', key: 'hypertension', active: true },
  { label: 'Diabetes', key: 'diabetes', active: false },
  { label: 'Seizures', key: 'seizures', active: false },
  { label: 'IVF', key: 'ivf', active: false },
  { label: 'OCP History', key: 'ocp', active: false },
];

// ── Clinical Milestones ─────────────────────────────────────────────────

export interface ClinicalMilestone {
  label: string;
  done: boolean;
  icon: LucideIcon;
}

export const MILESTONES: ClinicalMilestone[] = [
  { label: 'ANC Visit 1', done: true, icon: CalendarCheck },
  { label: 'ANC Visit 2', done: true, icon: CalendarCheck },
  { label: 'ANC Visit 3', done: true, icon: CalendarCheck },
  { label: 'ANC Visit 4', done: false, icon: CalendarCheck },
  { label: 'TT-1 Immunization', done: true, icon: Syringe },
  { label: 'TT-2 Immunization', done: false, icon: Syringe },
  { label: 'Dating Scan', done: true, icon: ScanLine },
  { label: 'Anomaly Scan', done: false, icon: ScanLine },
];

// ── Risk Level Config ───────────────────────────────────────────────────

export type RiskLevel = 'low' | 'moderate' | 'high';

export interface RiskLevelConfig {
  label: string;
  bg: string;
  border: string;
  glow: string;
  text: string;
  bgLight: string;
  borderLight: string;
}

export const RISK_LEVEL_CONFIG: Record<RiskLevel, RiskLevelConfig> = {
  low: {
    label: 'LOW RISK', bg: 'bg-emerald-500', border: 'border-emerald-400',
    glow: 'shadow-emerald-500/30', text: 'text-emerald-400',
    bgLight: 'bg-emerald-50 dark:bg-emerald-900/20', borderLight: 'border-emerald-200 dark:border-emerald-800/40',
  },
  moderate: {
    label: 'MODERATE RISK', bg: 'bg-amber-500', border: 'border-amber-400',
    glow: 'shadow-amber-500/30', text: 'text-amber-400',
    bgLight: 'bg-amber-50 dark:bg-amber-900/20', borderLight: 'border-amber-200 dark:border-amber-800/40',
  },
  high: {
    label: 'HIGH RISK', bg: 'bg-red-500', border: 'border-red-400',
    glow: 'shadow-red-500/30', text: 'text-red-400',
    bgLight: 'bg-red-50 dark:bg-red-900/20', borderLight: 'border-red-200 dark:border-red-800/40',
  },
};

// ── Helpers ──────────────────────────────────────────────────────────────

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

export function getTimeSince(isoStr: string): string {
  const diff = Date.now() - new Date(isoStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}
