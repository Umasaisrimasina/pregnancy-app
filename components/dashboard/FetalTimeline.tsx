/**
 * FetalTimeline.tsx
 *
 * Horizontal-scroll fetal growth timeline.
 * Self-contained — reads fetalTimeline from config.
 */

import React from 'react';
import { SpeakButton } from '../SpeakButton';
import { fetalTimeline } from '../../config/dashboardData.config';

export const FetalTimeline: React.FC = () => (
  <div className="flex flex-col overflow-hidden">
    <div className="flex justify-between items-end mb-6">
      <div className="flex items-center gap-2">
        <h2 className="text-xl font-bold font-display text-slate-900 dark:text-dm-foreground">
          Fetal Growth Timeline
        </h2>
        <SpeakButton text="Fetal Growth Timeline. Track your baby's development from Month 1 as a poppy seed through Month 9 as a watermelon. Swipe to explore each month's milestones." />
      </div>
      <span className="text-xs font-bold text-primary-300 tracking-widest uppercase animate-pulse">
        Swipe to explore
      </span>
    </div>

    <div className="flex overflow-x-auto gap-4 pb-8 snap-x snap-mandatory custom-scrollbar flex-1">
      {fetalTimeline.map((item, i) => (
        <div
          key={i}
          className="min-w-[260px] md:min-w-[280px] bg-primary-50/40 border border-primary-100 rounded-[1.5rem] p-5 snap-center flex flex-col hover:bg-primary-50/60 transition-colors group"
        >
          <div className="flex justify-between items-start mb-4">
            <span className="bg-white text-primary-400 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
              {item.month}
            </span>
          </div>
          <div className="w-32 h-32 mx-auto mb-2 rounded-full bg-white border-4 border-white shadow-lg shadow-primary-100 overflow-hidden relative group-hover:scale-105 transition-transform duration-500">
            <img src={item.img} alt={item.title} className="w-full h-full object-cover" />
          </div>
          <div className="text-center mb-3">
            <span className="inline-block bg-primary-100 text-primary-500 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Size: {item.size}
            </span>
          </div>
          <h3 className="text-lg font-bold font-display text-slate-900 dark:text-dm-foreground mb-1.5">
            {item.title}
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 leading-relaxed line-clamp-3">{item.desc}</p>
        </div>
      ))}
    </div>
  </div>
);
