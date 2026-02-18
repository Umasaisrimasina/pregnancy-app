/**
 * ActivePatientList.tsx
 *
 * Sidebar list of active patients for the clinical dashboard.
 * Presentational — patient data via props, no internal state.
 */

import React from 'react';
import type { PatientListItem } from '../../config/medicalView.config';

interface ActivePatientListProps {
  patients: PatientListItem[];
  onSelect?: (id: number) => void;
}

export const ActivePatientList: React.FC<ActivePatientListProps> = ({ patients, onSelect }) => {
  return (
    <div className="lg:w-64 shrink-0 space-y-2">
      <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4 px-2">
        Active Patients
      </h3>

      {patients.map((patient) =>
        patient.isActive ? (
          <div
            key={patient.id}
            role="button"
            tabIndex={0}
            onClick={() => onSelect?.(patient.id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
                e.preventDefault();
                onSelect?.(patient.id);
              }
            }}
            className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30 p-3 rounded-2xl flex items-center gap-3 cursor-pointer"
          >
            {patient.photoUrl ? (
              <img src={patient.photoUrl} alt={patient.name} className="w-10 h-10 rounded-full object-cover" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-dm-accent" />
            )}
            <div>
              <h4 className="font-bold text-slate-900 dark:text-dm-foreground text-sm">{patient.name}</h4>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">{patient.subtitle}</p>
            </div>
            <div className="w-1 h-8 bg-blue-500 rounded-full ml-auto" />
          </div>
        ) : (
          <div
            key={patient.id}
            role="button"
            tabIndex={0}
            onClick={() => onSelect?.(patient.id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
                e.preventDefault();
                onSelect?.(patient.id);
              }
            }}
            className="p-3 rounded-2xl flex items-center gap-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-dm-muted transition-colors opacity-60 hover:opacity-100"
          >
            {patient.photoUrl ? (
              <img src={patient.photoUrl} alt={patient.name} className="w-10 h-10 rounded-full object-cover" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-dm-accent" />
            )}
            <div>
              <h4 className="font-bold text-slate-900 dark:text-dm-foreground text-sm">{patient.name}</h4>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">{patient.subtitle}</p>
            </div>
          </div>
        )
      )}
    </div>
  );
};
