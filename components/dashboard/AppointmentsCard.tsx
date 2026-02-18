/**
 * AppointmentsCard.tsx
 *
 * Reusable appointments list card with date badges.
 * Extracted from PregnancyDashboard's inline "Appointments" block.
 *
 * Config-driven — accepts an array of appointment objects.
 */

import React from 'react';

export interface AppointmentItem {
  month: string;
  day: string;
  title: string;
  time: string;
  type: string;
  color: string;
  shadowColor: string;
}

interface AppointmentsCardProps {
  appointments: readonly AppointmentItem[];
  title?: string;
  bgClass?: string;
  borderClass?: string;
}

export const AppointmentsCard: React.FC<AppointmentsCardProps> = ({
  appointments,
  title = 'Appointments',
  bgClass = 'bg-[#fff1f2]',
  borderClass = 'border border-primary-100',
}) => {
  return (
    <div className={`${bgClass} rounded-[2rem] p-6 shadow-sm ${borderClass}`}>
      <h3 className="text-xl font-bold font-display text-slate-900 dark:text-dm-foreground mb-6">
        {title}
      </h3>
      <div className="space-y-4">
        {appointments.map((appt, i) => (
          <div
            key={i}
            className="bg-white dark:bg-dm-card p-4 rounded-2xl flex items-center gap-4 shadow-sm"
          >
            <div
              className={`w-14 h-14 ${appt.color} rounded-xl flex flex-col items-center justify-center text-white shrink-0 leading-none shadow-md ${appt.shadowColor}`}
            >
              <span className="text-[10px] font-bold uppercase opacity-80 mb-0.5">
                {appt.month}
              </span>
              <span className="text-xl font-bold font-display">{appt.day}</span>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-dm-foreground text-base">
                {appt.title}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                {appt.time} · {appt.type}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
