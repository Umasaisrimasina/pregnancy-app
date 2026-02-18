/**
 * PatientIdentityCard.tsx
 *
 * Patient identity + vitals summary for Digital Case History.
 * Presentational — all data via props.
 */

import React, { useState } from 'react';
import { User } from 'lucide-react';

interface PatientField {
  label: string;
  value: string;
}

interface PatientIdentityCardProps {
  name: string;
  patientId: string;
  photoUrl?: string;
  fields: PatientField[];
}

export const PatientIdentityCard: React.FC<PatientIdentityCardProps> = ({
  name,
  patientId,
  photoUrl,
  fields,
}) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="bg-white dark:bg-dm-card rounded-[2rem] p-6 md:p-8 border border-slate-100 dark:border-dm-border shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg">
          <User size={20} />
        </div>
        <h3 className="font-bold font-display text-slate-900 dark:text-dm-foreground">Patient Identity</h3>
      </div>

      <div className="flex items-center gap-4 mb-6">
        {photoUrl && !imageError ? (
          <img
            src={photoUrl}
            alt={name}
            onError={() => setImageError(true)}
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-white dark:ring-dm-border shadow-md"
          />
        ) : (
          <div
            role="img"
            aria-label={`Avatar for ${name}`}
            className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-dm-muted flex items-center justify-center text-slate-400"
          >
            <User size={32} aria-hidden="true" />
          </div>
        )}
        <div>
          <h4 className="text-lg font-bold font-display text-slate-900 dark:text-dm-foreground">{name}</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">ID: {patientId}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {fields.map((item) => (
          <div key={item.label} className="bg-slate-50 dark:bg-dm-muted rounded-xl p-3 border border-slate-100 dark:border-dm-border">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-1">{item.label}</span>
            <span className="text-sm font-bold text-slate-900 dark:text-dm-foreground">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
