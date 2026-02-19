/**
 * MedicalRoadmapCard.tsx
 *
 * Vaccination tracker + genetic monitoring card extracted from BabyCareDashboard.
 * Config-driven via props — presentational only.
 */

import React from 'react';
import { ClipboardList } from 'lucide-react';
import { SpeakButton } from '../SpeakButton';
import { CardShell } from '../ui/CardShell';

// ── Types ────────────────────────────────────────────────────────────────

interface VaccinationEntry {
  vaccine: string;
  [key: string]: unknown;
}

interface MedicalRoadmapCardProps {
  completedVaccinations: VaccinationEntry[];
  nextVaccination: VaccinationEntry | null;
  speakText?: string;
}

// ── Component ────────────────────────────────────────────────────────────

export const MedicalRoadmapCard: React.FC<MedicalRoadmapCardProps> = ({
  completedVaccinations,
  nextVaccination,
  speakText = 'Medical Roadmap. Vaccination tracker and genetic monitoring information.',
}) => (
  <CardShell className="h-full flex flex-col">
    <div className="flex items-center gap-3 mb-6">
      <div className="text-primary-400">
        <ClipboardList size={20} />
      </div>
      <h3 className="text-xl font-bold font-display text-slate-900 dark:text-dm-foreground">Medical Roadmap</h3>
      <SpeakButton text={speakText} size={12} />
    </div>

    <div className="bg-primary-50 rounded-2xl p-4 mb-4">
      <span className="text-[10px] font-bold text-primary-500 uppercase tracking-wider mb-3 block">Vaccination Tracker</span>
      <div className="space-y-3">
        {completedVaccinations.map((v, i) => (
          <div key={i} className="flex justify-between items-center">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">{v.vaccine}</span>
            <span className="px-2 py-0.5 bg-primary-100 text-primary-700 text-[10px] font-bold rounded">DONE</span>
          </div>
        ))}
        {nextVaccination && (
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">{nextVaccination.vaccine}</span>
            <span className="px-2 py-0.5 bg-primary-200 text-primary-700 text-[10px] font-bold rounded">NEXT</span>
          </div>
        )}
      </div>
    </div>

    <div className="bg-blue-50 rounded-2xl p-4 flex-1">
      <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-2 block">Genetic Monitoring</span>
      <p className="text-sm text-slate-600 leading-relaxed">
        Entered birth data is analyzed for genetic markers. Follow up on infant metabolic screening results.
      </p>
    </div>
  </CardShell>
);
