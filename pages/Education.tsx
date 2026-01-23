import React from 'react';
import { ArrowLeft, ShieldCheck, Clock, Brain, Baby, Shield } from 'lucide-react';
import { AppPhase } from '../types';

interface PageProps {
  phase: AppPhase;
}

export const Education: React.FC<PageProps> = ({ phase }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">

      {/* Hero */}
      <div className="bg-white dark:bg-dm-card rounded-[2rem] p-8 lg:p-12 shadow-sm border border-slate-100 dark:border-dm-border overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-50 rounded-full blur-[100px] -mr-20 -mt-20 opacity-60 pointer-events-none"></div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-xs font-bold uppercase tracking-wider mb-6 border border-primary-100">
            <ShieldCheck size={14} />
            The Science
          </div>
          <h1 className="text-4xl lg:text-5xl font-display font-extrabold text-slate-900 dark:text-dm-foreground mb-6 leading-tight">
            It starts before <br />day one.
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
            Did you know? An egg takes about 90 days to mature before it's released. The health of your body during this 3-6 month window directly impacts the genetic material you pass on.
          </p>
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Standard Care */}
        <div className="bg-white dark:bg-dm-card rounded-[2rem] p-8 border border-slate-100 dark:border-dm-border opacity-75 hover:opacity-100 transition-opacity">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 dark:text-slate-400 dark:text-slate-500">
              <Clock size={20} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-dm-foreground">Standard Care</h3>
          </div>
          <ul className="space-y-4">
            <li className="flex gap-3 text-sm text-slate-600 dark:text-slate-300">
              <span className="text-red-400 font-bold">•</span>
              Care often starts only after a positive test (Week 4-6).
            </li>
            <li className="flex gap-3 text-sm text-slate-600 dark:text-slate-300">
              <span className="text-red-400 font-bold">•</span>
              Nutrient deficiencies are treated reactively.
            </li>
          </ul>
        </div>

        {/* Preventive Care */}
        <div className="bg-gradient-to-b from-primary-50/50 to-white rounded-[2rem] p-8 border-2 border-primary-100 relative shadow-lg shadow-primary-900/5">
          <div className="absolute -top-3 left-8 bg-primary-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Recommended
          </div>
          <div className="flex items-center gap-3 mb-6 mt-2">
            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
              <ShieldCheck size={20} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-dm-foreground">Preventive Care</h3>
          </div>
          <ul className="space-y-4">
            <li className="flex gap-3 text-sm text-slate-800 font-medium">
              <span className="text-primary-600 font-bold">✔</span>
              Care begins 3-6 months pre-conception.
            </li>
            <li className="flex gap-3 text-sm text-slate-800 font-medium">
              <span className="text-primary-600 font-bold">✔</span>
              Optimized stores for baby's critical development.
            </li>
          </ul>
        </div>
      </div>

      {/* Benefits */}
      <div>
        <h2 className="text-xl font-bold font-display text-slate-900 dark:text-dm-foreground mb-6">Key Benefits</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: Brain, title: "Baby's Brain", desc: "Neural tube forms in first 4 weeks.", color: "text-blue-500", bg: "bg-blue-50" },
            { icon: Baby, title: "Recovery", desc: "Stronger iron stores mean faster postpartum recovery.", color: "text-purple-500", bg: "bg-purple-50" },
            { icon: Shield, title: "Risk Reduction", desc: "Lowers risk of gestational diabetes.", color: "text-orange-500", bg: "bg-orange-50" },
          ].map((item, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 dark:border-dm-border hover:shadow-md transition-shadow">
              <div className={`w-12 h-12 rounded-xl ${item.bg} ${item.color} flex items-center justify-center mb-4`}>
                <item.icon size={24} />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-dm-foreground mb-1">{item.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};






