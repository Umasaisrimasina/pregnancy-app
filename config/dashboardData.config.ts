/**
 * dashboardData.config.ts
 *
 * Static / demo data arrays used by dashboard views.
 * Extracted from Dashboard.tsx to keep components data-free.
 */

// ── Fetal Growth Timeline ────────────────────────────────────────────────

export interface FetalMonth {
  month: string;
  title: string;
  desc: string;
  feelings: string;
  nurture: string;
  img: string;
  size: string;
}

export const fetalTimeline: FetalMonth[] = [
  {
    month: 'Month 1',
    title: 'Early Development',
    desc: 'The neural tube forms. The embryo is poppy-seed sized.',
    feelings: 'Nausea, fatigue, and tender breasts.',
    nurture: 'Take prenatal vitamins with folic acid daily.',
    img: '/images/fetal-growth/1.jpg',
    size: 'Poppy Seed',
  },
  {
    month: 'Month 2',
    title: 'The Heart Beat',
    desc: 'Heart begins to beat. Fingers and toes form.',
    feelings: 'Frequent urination and food aversions.',
    nurture: 'Eat small meals to manage morning sickness.',
    img: '/images/fetal-growth/2.jpg',
    size: 'Raspberry',
  },
  {
    month: 'Month 3',
    title: 'Becoming a Fetus',
    desc: 'Arms and legs lengthen. Baby starts moving.',
    feelings: 'Energy levels may start to return.',
    nurture: 'Stay hydrated and eat iron-rich foods.',
    img: '/images/fetal-growth/3.jpg',
    size: 'Lemon',
  },
  {
    month: 'Month 4',
    title: 'Distinct Features',
    desc: 'Eyebrows, eyelashes, and eyelids form.',
    feelings: 'Bump becomes visible. Appetite increases.',
    nurture: 'Moisturize skin to help with stretching.',
    img: '/images/fetal-growth/4.jpg',
    size: 'Avocado',
  },
  {
    month: 'Month 5',
    title: 'Movement Felt',
    desc: 'You may feel flutters (quickening). Vernix coats skin.',
    feelings: 'Backaches or hip pain may occur.',
    nurture: 'Consider a pregnancy pillow for sleep support.',
    img: '/images/fetal-growth/5.jpg',
    size: 'Banana',
  },
  {
    month: 'Month 6',
    title: 'Senses Awakening',
    desc: 'Responds to sounds. Fingerprints formed.',
    feelings: 'Possible heartburn or indigestion.',
    nurture: 'Practice pelvic floor exercises (Kegels).',
    img: '/images/fetal-growth/6.jpg',
    size: 'Ear of Corn',
  },
  {
    month: 'Month 7',
    title: 'Opening Eyes',
    desc: 'Eyelids open. Fat stores begin to accumulate.',
    feelings: 'Shortness of breath as uterus grows.',
    nurture: 'Monitor kick counts daily.',
    img: '/images/fetal-growth/7.jpg',
    size: 'Eggplant',
  },
  {
    month: 'Month 8',
    title: 'Rapid Growth',
    desc: 'Brain development accelerates. Lungs maturing.',
    feelings: 'Frequent Braxton Hicks contractions.',
    nurture: 'Pack your hospital bag and finalize birth plan.',
    img: '/images/fetal-growth/8.jpg',
    size: 'Pineapple',
  },
  {
    month: 'Month 9',
    title: 'Ready for Birth',
    desc: 'Baby positions head-down. Organs fully developed.',
    feelings: 'Pelvic pressure and nesting instinct.',
    nurture: 'Rest often and prepare for labor.',
    img: '/images/fetal-growth/9.jpg',
    size: 'Watermelon',
  },
];

// ── Vitals / Chart Data ──────────────────────────────────────────────────

export const initialVitals = {
  sugar: 105,
  hr: 73,
  spo2: 98,
  stress: 35,
  sleep: 7.5,
  snoring: 15,
  weight: 64.2,
};

export const stressGraphData = [
  { day: 'Mon', value: 35 },
  { day: 'Tue', value: 56 },
  { day: 'Wed', value: 40 },
  { day: 'Thu', value: 32 },
  { day: 'Fri', value: 38 },
  { day: 'Sat', value: 45 },
  { day: 'Sun', value: 30 },
];

export const sleepData = [
  { day: 'Mon', hours: 5.5 },
  { day: 'Tue', hours: 6.8 },
  { day: 'Wed', hours: 7.2 },
  { day: 'Thu', hours: 6.0 },
  { day: 'Fri', hours: 8.5 },
  { day: 'Sat', hours: 9.0 },
  { day: 'Sun', hours: 7.5 },
];

// ── Medical Chart Data ───────────────────────────────────────────────────

export const bloodSugarTrend = [
  { day: 'Mon', value: 99 },
  { day: 'Tue', value: 126 },
  { day: 'Wed', value: 108 },
  { day: 'Thu', value: 105 },
  { day: 'Fri', value: 118 },
  { day: 'Sat', value: 110 },
  { day: 'Sun', value: 104 },
];

// ── Post-Partum Data ─────────────────────────────────────────────────────

export const postPartumMoodData = [
  { day: 'Mon', value: 5 },
  { day: 'Tue', value: 6 },
  { day: 'Wed', value: 4 },
  { day: 'Thu', value: 7 },
  { day: 'Fri', value: 6 },
  { day: 'Sat', value: 8 },
  { day: 'Sun', value: 7 },
];

export const postPartumSleepData = [
  { day: 'Mon', hours: 4.5 },
  { day: 'Tue', hours: 5.2 },
  { day: 'Wed', hours: 3.8 },
  { day: 'Thu', hours: 5.0 },
  { day: 'Fri', hours: 6.2 },
  { day: 'Sat', hours: 5.5 },
  { day: 'Sun', hours: 4.8 },
];
