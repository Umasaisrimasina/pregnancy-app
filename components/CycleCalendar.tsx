import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Info, Link, RotateCw, Plus, Flame } from 'lucide-react';
import { SpeakButton } from './SpeakButton';

export const CycleCalendar: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState<number>(14);

  // Mock Data for January 2026
  const month = "January 2026";
  const daysInMonth = 31;
  const startDayOffset = 4; // Thursday start

  // Cycle Data
  const periodDays = [2, 3, 4, 5, 6];
  const fertileDays = [11, 12, 13, 14, 15, 16, 17];
  const ovulationDay = 15;

  const renderDay = (day: number) => {
    const isPeriod = periodDays.includes(day);
    const isFertile = fertileDays.includes(day);
    const isOvulation = day === ovulationDay;
    const isSelected = day === selectedDay;

    return (
      <button 
        key={day} 
        onClick={() => setSelectedDay(day)}
        className={`
          aspect-square rounded-2xl flex flex-col items-center justify-center relative transition-all duration-200 group
          ${isSelected 
            ? 'bg-slate-900 text-white shadow-xl scale-105 z-10' 
            : isPeriod 
              ? 'bg-rose-50 text-rose-900 hover:bg-rose-100' 
              : 'hover:bg-slate-50 text-slate-700 bg-white'
          }
        `}
      >
        <span className={`text-sm font-bold ${isSelected ? 'text-white' : ''}`}>{day}</span>
        
        {/* Indicators */}
        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
          {isFertile && !isSelected && (
            <div className="w-8 h-1 rounded-full bg-emerald-400"></div>
          )}
        </div>
        
        {isOvulation && !isSelected && (
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 absolute top-2 right-2"></div>
        )}
      </button>
    );
  };

  return (
    <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
      
      {/* Component Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pb-6 border-b border-slate-50">
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center">
             <Flame size={24} fill="currentColor" />
           </div>
           <div>
             <h2 className="text-xl font-display font-bold text-slate-900">Menstrual Cycle Tracker</h2>
             <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">Conception Planning & Cycle Awareness</p>
           </div>
           <SpeakButton text="Menstrual Cycle Tracker for Conception Planning and Cycle Awareness. Track your period days, fertile window, and ovulation day to optimize your chances of conception." size={14} />
        </div>
        <button className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-rose-500/20 transition-all flex items-center gap-2">
           <Plus size={18} />
           Log Period
        </button>
      </div>

      <div className="flex flex-col xl:flex-row gap-12">
        
        {/* Left Panel: Stats (Simplified version of the left card in screenshot) */}
        <div className="xl:w-1/4 space-y-6">
           <div className="bg-rose-50 rounded-[1.5rem] p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 text-rose-200 -mt-4 -mr-4">
                 <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
              </div>
              <div className="relative z-10">
                 <span className="text-xs font-bold text-rose-400 uppercase tracking-widest mb-1 block">Current Phase</span>
                 <h3 className="text-2xl font-display font-bold text-rose-900 mb-4">Follicular Phase</h3>
                 <div className="h-2 bg-rose-200 rounded-full overflow-hidden mb-2">
                   <div className="h-full bg-rose-500 w-1/2 rounded-full"></div>
                 </div>
                 <div className="flex justify-end text-xs font-bold text-rose-500">Day 14/28</div>
              </div>
           </div>

           <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
                 <span className="text-slate-400 text-[10px] font-bold uppercase mb-1">Basal Temp</span>
                 <span className="text-xl font-display font-bold text-slate-900">36.5°C</span>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
                 <span className="text-slate-400 text-[10px] font-bold uppercase mb-1">Fertility</span>
                 <span className="text-xl font-display font-bold text-rose-500">High</span>
              </div>
           </div>
           
           <div className="space-y-2">
             <button className="w-full flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-all group">
               <span className="font-bold text-slate-700 text-sm">Symptoms & Mood</span>
               <ChevronRight size={16} className="text-slate-400 group-hover:text-slate-900" />
             </button>
             <button className="w-full flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-all group">
               <span className="font-bold text-slate-700 text-sm">Cervical Mucus</span>
               <ChevronRight size={16} className="text-slate-400 group-hover:text-slate-900" />
             </button>
           </div>
        </div>

        {/* Right Panel: Calendar */}
        <div className="flex-1">
          {/* Calendar Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <h3 className="text-2xl font-display font-bold text-slate-900">{month}</h3>
            
            <div className="flex flex-wrap items-center gap-6">
              {/* Legend */}
              <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-wider">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-rose-300"></div>
                    <span className="text-slate-500">Period</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                    <span className="text-slate-500">Fertile</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                    <span className="text-slate-500">Ovulation</span>
                  </div>
              </div>
              
              {/* Navigation */}
              <div className="flex items-center gap-2">
                  <button className="w-8 h-8 flex items-center justify-center hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-900 transition-colors">
                    <ChevronLeft size={18} />
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-900 transition-colors">
                    <ChevronRight size={18} />
                  </button>
              </div>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2 sm:gap-3 mb-6">
            {['S','M','T','W','T','F','S'].map((d, i) => (
              <div key={i} className="text-center text-xs font-bold text-slate-400 py-2 uppercase tracking-wider">
                {d}
              </div>
            ))}
            {Array.from({ length: startDayOffset }).map((_, i) => (
              <div key={`empty-${i}`}></div>
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => renderDay(i + 1))}
          </div>

          {/* Footer Insight */}
          <div className="bg-indigo-50/50 rounded-2xl p-4 flex gap-4 items-start border border-indigo-100/50">
            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-full shrink-0 mt-0.5">
              <Info size={16} />
            </div>
            <div className="text-sm text-indigo-900 leading-relaxed">
              <span className="font-bold">Your estimated ovulation</span> is in <span className="font-bold">1 day</span>. This is your most fertile window. Consistent basal body temperature (BBT) tracking can help pinpoint exact timing.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};