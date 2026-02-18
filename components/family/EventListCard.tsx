/**
 * EventListCard.tsx
 *
 * Family events list card with date labels.
 * Extracted from FamilyDashboard's inline "Family Events" block.
 * Config-driven — events via props, no internal state.
 */

import React from 'react';
import { Calendar, type LucideIcon } from 'lucide-react';

export interface FamilyEvent {
  id: number;
  title: string;
  date: string;
}

interface EventListCardProps {
  heading?: string;
  icon?: LucideIcon;
  events: FamilyEvent[];
}

export const EventListCard: React.FC<EventListCardProps> = ({
  heading = 'Family Events',
  icon: Icon = Calendar,
  events,
}) => {
  return (
    <div className="bg-white dark:bg-dm-card rounded-[2rem] p-8 border border-slate-100 dark:border-dm-border">
      <div className="flex items-center gap-3 mb-6">
        <Icon size={20} className="text-primary-500" />
        <h3 className="font-bold text-slate-900 dark:text-dm-foreground text-lg">{heading}</h3>
      </div>
      <div className="space-y-3">
        {events.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Calendar size={32} className="text-slate-300 dark:text-slate-600 mb-3" />
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">No upcoming events</p>
          </div>
        ) : (
          events.map((event) => (
            <div
              key={event.id}
              className="flex justify-between items-center p-4 bg-slate-50 dark:bg-dm-muted rounded-xl"
            >
              <span className="font-bold text-slate-700 dark:text-slate-300 text-sm">{event.title}</span>
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500">{event.date}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
