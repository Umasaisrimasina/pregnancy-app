/**
 * ClinicalSummary.tsx
 *
 * Doctor's Clinical Summary card for PregnancyDashboard.
 * Reads static data from pregnancyClinic.config.ts.
 */

import React from 'react';
import { Stethoscope, ClipboardList, CheckCircle2 } from 'lucide-react';
import { clinicalSummary } from '../../config/pregnancyClinic.config';
import { SpeakButton } from '../SpeakButton';

export const ClinicalSummary: React.FC = () => {
  const cs = clinicalSummary;

  return (
    <div className="bg-white dark:bg-dm-card rounded-[2rem] p-8 shadow-sm border border-slate-100 dark:border-dm-border relative overflow-hidden flex flex-col justify-between h-full">
      <div>
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-secondary-600 dark:bg-secondary-700 text-white flex items-center justify-center shadow-lg shadow-secondary-200 dark:shadow-none">
              <Stethoscope size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-dm-foreground">
                Doctor&apos;s Clinical Summary
              </h2>
              <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">
                Last Update: {cs.lastUpdate} by {cs.doctorName}
              </p>
            </div>
            <SpeakButton text={cs.speakText} />
          </div>
          <div className="bg-secondary-50 dark:bg-secondary-900/20 text-secondary-700 dark:text-secondary-300 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide flex items-center gap-2 border border-secondary-100 dark:border-secondary-900/30">
            <div className="w-2 h-2 rounded-full bg-secondary-500 animate-pulse" />
            Clinical Record
          </div>
        </div>

        {/* Body Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Diagnosis */}
          <div className="space-y-6">
            <div className="bg-slate-50/50 dark:bg-dm-muted rounded-2xl p-6 border border-slate-100 dark:border-dm-border">
              <span className="text-xs font-bold text-secondary-500 uppercase tracking-widest mb-3 block">
                Diagnosis &amp; Status
              </span>
              <p className="text-slate-800 dark:text-slate-200 font-bold text-lg leading-relaxed">
                {cs.diagnosis} <span className="text-primary-500">{cs.status}</span>. {cs.growthStatement ?? 'Fetal growth matches gestational age perfectly.'}
              </p>
            </div>
          </div>

          {/* Prescribed Instructions */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <ClipboardList size={18} className="text-primary-400" />
                <span className="text-xs font-bold text-slate-900 dark:text-dm-foreground uppercase tracking-widest">
                  Prescribed Instructions
                </span>
              </div>
              <div className="space-y-3">
                {cs.prescribedInstructions.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-4 p-3 bg-white dark:bg-dm-muted border border-slate-100 dark:border-dm-border rounded-2xl shadow-sm hover:border-secondary-100 dark:hover:border-secondary-900/50 transition-colors"
                  >
                    <div className="w-5 h-5 rounded-full bg-secondary-50 dark:bg-secondary-900/30 text-secondary-600 dark:text-secondary-400 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 size={12} />
                    </div>
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300 leading-snug">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Clinical Observations footer */}
      <div className="mt-6 pt-6 border-t border-slate-50 dark:border-dm-border">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-bold text-secondary-500 uppercase tracking-widest">Clinical Observations</span>
          <SpeakButton
            text={`Clinical Observations. ${cs.clinicalObservations}`}
            size={12}
          />
        </div>
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{cs.clinicalObservations}</p>
      </div>
    </div>
  );
};
