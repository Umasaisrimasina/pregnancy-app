/**
 * pregnancyClinic.config.ts
 *
 * Static/demo data for the pregnancy clinical summary and appointments.
 * Extracted from PregnancyDashboard to keep components data-free.
 */

// ── Clinical Summary ─────────────────────────────────────────────────────

export interface ClinicalSummaryData {
  doctorName: string;
  lastUpdate: string;
  diagnosis: string;
  status: string;
  growthStatement: string;
  prescribedInstructions: string[];
  clinicalObservations: string;
  speakText: string;
}

export const clinicalSummary: ClinicalSummaryData = {
  doctorName: 'Dr. Aditi Sharma',
  lastUpdate: 'Oct 12',
  diagnosis:
    'G1P0 gestation at 24 weeks. Overall clinical status is',
  status: 'STABLE',
  growthStatement: 'Fetal growth matches gestational age perfectly.',
  prescribedInstructions: [
    'Sleep strictly on the left lateral position.',
    'Schedule Glucose Challenge Test (GCT).',
    'Maintain 3.5L daily hydration goal.',
  ],
  clinicalObservations:
    'Fetal Heart Rate baseline at 145 bpm with moderate variability. Patient reports mild lumbar strain. Blood pressure is within normal ranges (110/70 mmHg).',
  speakText:
    "Doctor's Clinical Summary. G1P0 gestation at 24 weeks. Overall clinical status is stable. Fetal growth matches gestational age perfectly. Prescribed instructions: Sleep strictly on the left lateral position. Schedule Glucose Challenge Test. Maintain 3.5 liters daily hydration goal.",
};

// ── Appointments ─────────────────────────────────────────────────────────

export interface AppointmentData {
  month: string;
  day: number;
  color: string;
  shadowColor: string;
  title: string;
  time: string;
  type: string;
}

export const appointments: AppointmentData[] = [
  {
    month: 'OCT',
    day: 14,
    color: 'bg-[#f43f5e]',
    shadowColor: 'shadow-primary-200',
    title: 'Obstetrician',
    time: '10:00 AM',
    type: 'Routine',
  },
  {
    month: 'DEC',
    day: 17,
    color: 'bg-[#3b82f6]',
    shadowColor: 'shadow-blue-200',
    title: 'Dietitian',
    time: '03:30 PM',
    type: 'Macros',
  },
];

// ── Midwife Chat Theme ───────────────────────────────────────────────────

/** Plum theme for Midwife AI chat card (hoisted from component body). */
export const PLUM_THEME = {
  background: '#673A51',
  accent: '#f9a8d4', // pink-300
  button: '#ec4899', // pink-500
  text: '#ffffff',
  // Concrete Tailwind classes (for proper purging)
  accentClass: 'text-pink-300',
  textClass: 'text-white',
  textMutedClass: 'text-white/60',
  bgAccentClass: 'bg-pink-300',
  bgButtonClass: 'bg-pink-500',
  borderAccentClass: 'border-pink-300',
} as const;
