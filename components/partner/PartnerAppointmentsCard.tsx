/**
 * PartnerAppointmentsCard.tsx
 *
 * Displays upcoming partner/mother appointments.
 * Extracted from PartnerDashboard inline block.
 */

import React from 'react';
import { CardShell } from '../ui/CardShell';

interface Appointment {
  label: string;
  title: string;
  detail: string;
  accentColor?: string;
}

interface PartnerAppointmentsCardProps {
  partnerName: string;
  appointments?: Appointment[];
}

const DEFAULT_APPOINTMENTS: Appointment[] = [
  { label: 'In 4 Days', title: 'Anomaly Scan', detail: 'City Hospital · 11:30 AM', accentColor: 'border-blue-500' },
];

export const PartnerAppointmentsCard: React.FC<PartnerAppointmentsCardProps> = ({
  partnerName,
  appointments = DEFAULT_APPOINTMENTS,
}) => (
  <CardShell>
    <h3 className="font-bold text-slate-900 dark:text-dm-foreground mb-2">{partnerName}&apos;s Appointments</h3>
    <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">Ensure you&apos;ve blocked your calendar for these:</p>

    {appointments.map((appt, i) => (
      <div
        key={i}
        className={`bg-slate-50 dark:bg-dm-muted p-4 rounded-2xl border-l-4 ${appt.accentColor || 'border-blue-500'}${i < appointments.length - 1 ? ' mb-3' : ''}`}
      >
        <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wide block mb-1">{appt.label}</span>
        <h4 className="font-bold text-slate-900 dark:text-dm-foreground">{appt.title}</h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{appt.detail}</p>
      </div>
    ))}
  </CardShell>
);
