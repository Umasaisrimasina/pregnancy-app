/**
 * familyOverview.config.ts
 *
 * Static data for the FamilyOverviewPage.
 * Keeps presentational components data-free.
 */

import type { SupportPrompt } from '../components/family/SupportPromptList';
import type { FamilyEvent } from '../components/family/EventListCard';

export const FAMILY_SUPPORT_PROMPTS: SupportPrompt[] = [
  { id: 1, text: "Ask about her sleep—third trimester is starting soon." },
  { id: 2, text: "Maya mentioned craving traditional homemade Makhana." },
];

export const FAMILY_EVENTS: FamilyEvent[] = [
  { id: 1, title: 'Baby Shower Planning', date: 'Nov 12' },
  { id: 2, title: 'Hospital Visit (Maya)', date: 'Dec 01' },
];

export const FAMILY_PHOTOS: string[] = [
  'https://images.unsplash.com/photo-1544126566-475a890b0e53?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1519834785169-98be25ec3f84?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=400&q=80',
];

export const MILESTONE_DATA = {
  title: 'Milestone Alert: 24 Weeks!',
  description: 'The baby is now about the size of an ear of corn and can hear sounds from the outside world!',
  speakText: 'Milestone Alert: 24 Weeks! The baby is now about the size of an ear of corn and can hear sounds from the outside world!',
};
