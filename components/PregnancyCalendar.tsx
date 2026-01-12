import React from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Bell, Shield, Trash2, EyeOff, Plus, AlertCircle } from 'lucide-react';
import { SpeakButton } from './SpeakButton';

export const PregnancyCalendar: React.FC = () => {
  const month = "January 2026";
  const daysInMonth = 31;
  const startDayOffset = 4; // Jan 1 2026 is Thursday (0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu)

  const events = [
    { day: 14, type: 'checkup', color: 'bg-blue-400' },
    { day: 18, type: 'vaccine', color: 'bg-amber-400' },
    { day: 22, type: 'checkup', color: 'bg-blue-400' },
    { day: 28, type: 'vaccine', color: 'bg-amber-400' },
  ];

  const milestones = [
    {
      title: "Obstetrician Checkup",
      date: "January 14 • 10:00 AM",
      type: "checkup",
      icon: Bell,
      color: "text-blue-600",
      bg: "bg-blue-50"
    },
    {
      title: "TT-1 (Tetanus Shot)",
      date: "January 18 • 11:30 AM",
      type: "vaccine",
      icon: Shield,
      color: "text-amber-600",
      bg: "bg-amber-50"
    },
    {
      title: "Glucose Challenge Test",
      date: "January 22 • 09:00 AM",
      type: "checkup",
      icon: Bell,
      color: "text-blue-600",
      bg: "bg-blue-50"
    },
    {
      title: "Flu Vaccination",
      date: "January 28 • 04:00 PM",
      type: "vaccine",
      icon: Shield,
      color: "text-amber-600",
      bg: "bg-amber-50"
    }
  ];

  const renderDay = (day: number) => {
    const isToday = day === 8;
    const dayEvents = events.filter(e => e.day === day);

    return (
      <div 
        key={day} 
        className={`
          aspect-square rounded-xl flex flex-col items-center justify-center relative font-medium text-sm transition-all
          ${isToday 
            ? 'bg-rose-50 text-rose-600 border border-rose-200 shadow-sm ring-4 ring-rose-50' 
            : 'text-slate-700 hover:bg-slate-50'
          }
        `}
      >
        <span className={isToday ? 'font-bold' : ''}>{day}</span>
        
        {/* Dots */}
        <div className="flex gap-1 mt-1">
          {dayEvents.map((e, i) => (
            <div key={i} className={`w-1.5 h-1.5 rounded-full ${e.color}`}></div>
          ))}
        </div>
        
        {/* Today Indicator Circle if needed, styled via container above */}
        {isToday && (
            <div className="absolute inset-0 border-2 border-rose-500 rounded-xl opacity-20 pointer-events-none"></div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 h-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
        <div>
           <div className="flex items-center gap-3 mb-2">
             <div className="p-3 bg-rose-50 text-rose-500 rounded-xl">
               <CalendarIcon size={24} />
             </div>
             <h2 className="text-2xl font-display font-bold text-slate-900">Pregnancy Calendar</h2>
             <SpeakButton text="Pregnancy Calendar. Week 24, Trimester 2 Milestones. Track your checkups, vaccinations, and important appointments." size={14} />
           </div>
           <p className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-14">Week 24 • Trimester 2 Milestones</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors shadow-sm whitespace-nowrap">
           <img src="https://www.gstatic.com/images/branding/product/1x/calendar_2020q4_48dp.png" alt="Google Calendar" className="w-4 h-4" />
           LINK GOOGLE CALENDAR
        </button>
      </div>

      <div className="flex flex-col xl:flex-row gap-12">
        {/* Left: Calendar View */}
        <div className="flex-1 min-w-[300px]">
           <div className="flex items-center justify-between mb-6">
             <h3 className="text-lg font-bold text-slate-900">{month}</h3>
             <div className="flex gap-2">
                <button className="w-8 h-8 flex items-center justify-center text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
                  <ChevronLeft size={18} />
                </button>
                <button className="w-8 h-8 flex items-center justify-center text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
                  <ChevronRight size={18} />
                </button>
             </div>
           </div>

           {/* Grid */}
           <div className="grid grid-cols-7 gap-3 mb-6">
             {['S','M','T','W','T','F','S'].map(d => (
               <div key={d} className="text-center text-xs font-bold text-slate-300 uppercase py-2">{d}</div>
             ))}
             {Array.from({ length: startDayOffset }).map((_, i) => <div key={`empty-${i}`}></div>)}
             {Array.from({ length: daysInMonth }).map((_, i) => renderDay(i + 1))}
           </div>

           {/* Legend */}
           <div className="flex gap-4 mt-auto pt-4 border-t border-slate-50">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-400"></div>
                <span className="text-[10px] font-bold text-slate-500 uppercase">Checkup</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                <span className="text-[10px] font-bold text-slate-500 uppercase">Vaccine</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-400"></div>
                <span className="text-[10px] font-bold text-slate-500 uppercase">Personal</span>
              </div>
           </div>
        </div>

        {/* Right: Milestones */}
        <div className="flex-1 flex flex-col">
           <div className="flex justify-between items-center mb-6">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Medical Milestones</h3>
              <button className="text-rose-500 hover:bg-rose-50 p-1.5 rounded-lg transition-colors">
                <Plus size={16} />
              </button>
           </div>

           <div className="space-y-4 mb-6">
             {milestones.map((m, i) => (
               <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 group hover:border-slate-200 transition-colors">
                  <div className={`w-10 h-10 rounded-xl ${m.bg} ${m.color} flex items-center justify-center shrink-0`}>
                    <m.icon size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-900 text-sm truncate">{m.title}</h4>
                    <p className="text-xs text-slate-500 font-medium">{m.date}</p>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="text-slate-400 hover:text-slate-600"><EyeOff size={16}/></button>
                    {m.type === 'checkup' && <button className="text-slate-400 hover:text-rose-500"><Trash2 size={16}/></button>}
                  </div>
               </div>
             ))}
           </div>

           {/* Alert Box */}
           <div className="mt-auto bg-rose-50 rounded-xl p-4 border border-rose-100">
             <div className="flex gap-3">
               <AlertCircle size={16} className="text-rose-600 shrink-0 mt-0.5" />
               <p className="text-[11px] leading-relaxed text-rose-900">
                 <span className="font-bold text-rose-700">IMPORTANT:</span> Tetanus toxoid (TT-1) is crucial between 16-24 weeks. Flu shots can be taken anytime to protect your baby's early immunity.
               </p>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};