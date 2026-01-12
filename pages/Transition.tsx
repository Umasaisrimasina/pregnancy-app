import React from 'react';
import { ArrowRight, CheckCircle2, Lock, Shield } from 'lucide-react';
import { AppPhase } from '../types';
import { SpeakButton } from '../components/SpeakButton';

interface PageProps {
  phase: AppPhase;
  setPhase: (phase: AppPhase) => void;
}

export const Transition: React.FC<PageProps> = ({ phase, setPhase }) => {
  
  const getNextPhase = (): AppPhase => {
     if (phase === 'pre-pregnancy') return 'pregnancy';
     if (phase === 'pregnancy') return 'post-partum';
     if (phase === 'post-partum') return 'baby-care';
     return 'pre-pregnancy';
  };

  const nextPhase = getNextPhase();

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in zoom-in-95 duration-500 pb-12">
      
      <div className="text-center mb-10">
        <div className="flex items-center justify-center gap-3">
          <h1 className="text-4xl lg:text-5xl font-display font-extrabold text-slate-900 mb-4">
            Phase Transition
          </h1>
          <SpeakButton text="Phase Transition. Congratulations on reaching this milestone. Let's review your progress before unlocking the next chapter." />
        </div>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto">
          Congratulations on reaching this milestone. Let's review your progress before unlocking the next chapter.
        </p>
      </div>

      {/* Readiness Status */}
      <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
           <div className="flex items-center gap-2">
             <div>
               <h2 className="text-xl font-bold text-slate-900">Readiness Status</h2>
               <p className="text-sm text-slate-500">Based on recent data</p>
             </div>
             <SpeakButton text="Readiness Status based on recent data: Overall 92%, Health Excellent, Stress Low. Ready for Next Phase." size="sm" />
           </div>
           <div className="bg-primary-50 text-primary-700 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide flex items-center gap-2 border border-primary-100">
             <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse"></div>
             Ready for Next Phase
           </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
           <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
             <span className="text-xs font-bold text-slate-400 uppercase">Overall</span>
             <div className="text-3xl font-display font-bold text-slate-900 mt-1">92%</div>
           </div>
           <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
             <span className="text-xs font-bold text-slate-400 uppercase">Health</span>
             <div className="text-3xl font-display font-bold text-primary-600 mt-1">Excellent</div>
           </div>
           <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
             <span className="text-xs font-bold text-slate-400 uppercase">Stress</span>
             <div className="text-3xl font-display font-bold text-yellow-600 mt-1">Low</div>
           </div>
        </div>

        <div className="bg-blue-50 rounded-2xl p-5 flex gap-4 items-start text-blue-900">
          <div className="p-1 bg-blue-100 rounded-full text-blue-600 shrink-0">
            <Lock size={16} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-sm mb-1">Seamless Data Transition</h4>
              <SpeakButton text={`Seamless Data Transition: We are securely migrating your historical logs to the ${nextPhase} dashboard.`} size="sm" />
            </div>
            <p className="text-sm opacity-80 leading-relaxed">
              We are securely migrating your historical logs to the {nextPhase} dashboard.
            </p>
          </div>
        </div>
      </div>

      {/* Confirmation */}
      <div className="bg-white rounded-[2rem] p-8 shadow-lg border border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-full blur-3xl -mr-10 -mt-10"></div>
        
        <div className="relative z-10 flex flex-col items-center text-center">
           <div className="w-16 h-16 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center mb-6">
             <Shield size={32} />
           </div>
           <div className="flex items-center gap-2 mb-2">
             <h3 className="text-xl font-bold text-slate-900">Confirm Transition</h3>
             <SpeakButton text={`Confirm Transition: You are about to enter the ${nextPhase.replace('-', ' ')} mode. This will update your dashboard and available tools.`} size="sm" />
           </div>
           <p className="text-sm text-slate-500 max-w-md mb-8">
             You are about to enter the <strong>{nextPhase.replace('-', ' ')}</strong> mode. This will update your dashboard and available tools.
           </p>

           <div className="w-full max-w-md space-y-3">
             <button 
               onClick={() => setPhase(nextPhase)}
               className="w-full py-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold shadow-lg shadow-slate-900/20 transition-all flex items-center justify-center gap-2 group"
             >
               Enter {nextPhase.charAt(0).toUpperCase() + nextPhase.slice(1).replace('-', ' ')} Phase
               <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
             </button>
             <button className="w-full py-4 rounded-xl bg-white border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors">
               Cancel
             </button>
           </div>
        </div>
      </div>

    </div>
  );
};