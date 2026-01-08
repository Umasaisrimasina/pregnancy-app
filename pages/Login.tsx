import React, { useState } from 'react';
import { ArrowRight, Leaf, Heart, Stethoscope, Baby, Mail, Lock, User, CheckCircle2, Users, HeartHandshake } from 'lucide-react';
import { AppPhase, PHASE_CONFIG, UserRole } from '../types';

interface LoginProps {
  onLogin: (phase: AppPhase, role: UserRole) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [selectedPhase, setSelectedPhase] = useState<AppPhase>('pre-pregnancy');
  const [selectedRole, setSelectedRole] = useState<UserRole>('mother');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate network delay
    setTimeout(() => {
      onLogin(selectedPhase, selectedRole);
    }, 800);
  };

  const phases: { id: AppPhase; icon: any; description: string }[] = [
    { id: 'pre-pregnancy', icon: Leaf, description: 'Planning & preparing for conception' },
    { id: 'pregnancy', icon: Heart, description: 'Tracking growth & maternal health' },
    { id: 'post-partum', icon: Stethoscope, description: 'Recovery & newborn bonding' },
    { id: 'baby-care', icon: Baby, description: 'Milestones, feeding & sleep' },
  ];

  const roles: { id: UserRole; label: string; icon: any }[] = [
    { id: 'mother', label: 'Mother', icon: User },
    { id: 'partner', label: 'Partner', icon: Users },
    { id: 'family', label: 'Family', icon: HeartHandshake },
    { id: 'medical', label: 'Medical', icon: Stethoscope },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row font-sans">
      
      {/* Left Side - Visuals */}
      <div className="lg:w-1/2 bg-slate-900 relative overflow-hidden flex flex-col justify-between p-8 lg:p-16 text-white min-h-[300px] lg:min-h-screen">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=2070&auto=format&fit=crop" 
            alt="Motherhood Journey" 
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
              <Leaf size={16} className="text-white" />
            </div>
            <span className="font-display font-bold text-lg tracking-tight">PreConceive</span>
          </div>
        </div>

        <div className="relative z-10 max-w-lg">
          <h1 className="text-4xl lg:text-5xl font-display font-extrabold mb-6 leading-tight">
            Your companion for every step of the journey.
          </h1>
          <p className="text-slate-300 text-lg leading-relaxed">
            From pre-conception nutrition to baby milestones, we provide the science-backed tools you need to thrive.
          </p>
        </div>
        
        <div className="relative z-10 hidden lg:flex gap-8 text-sm font-medium text-slate-400">
          <span>© 2024 PreConceive</span>
          <span>Privacy Policy</span>
          <span>Terms</span>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="lg:w-1/2 flex items-center justify-center p-6 lg:p-16 bg-white animate-in slide-in-from-right-4 duration-500">
        <div className="w-full max-w-md">
          
          <div className="text-center mb-8">
            <h2 className="text-3xl font-display font-bold text-slate-900 mb-2">
              {isSignUp ? 'Create an account' : 'Welcome back'}
            </h2>
            <p className="text-slate-500">
              Enter your details to access your dashboard.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

             {/* Role Selection */}
             <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 text-center">I am the...</label>
                <div className="grid grid-cols-4 gap-2">
                  {roles.map((r) => {
                    const isActive = selectedRole === r.id;
                    const Icon = r.icon;
                    return (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => setSelectedRole(r.id)}
                        className={`
                          flex flex-col items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all
                          ${isActive 
                            ? 'border-slate-900 bg-slate-50 text-slate-900' 
                            : 'border-slate-100 bg-white text-slate-400 hover:border-slate-200 hover:text-slate-600'}
                        `}
                      >
                        <Icon size={20} className={isActive ? 'text-slate-900' : 'text-slate-400'} />
                        <span className="text-[10px] font-bold uppercase tracking-wide">{r.label}</span>
                      </button>
                    );
                  })}
                </div>
             </div>
            
            {/* Sign Up Specific Fields */}
            {isSignUp && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 pt-2 border-t border-slate-100">
                <div>
                   <label className="block text-sm font-bold text-slate-700 mb-1.5">Full Name</label>
                   <div className="relative">
                     <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                     <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-slate-900 focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all" placeholder="Sarah Jenkins" />
                   </div>
                </div>

                {/* Phase Selection Grid */}
                <div>
                   <label className="block text-sm font-bold text-slate-700 mb-3">Current Journey Phase</label>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                     {phases.map((p) => (
                       <div 
                         key={p.id}
                         onClick={() => setSelectedPhase(p.id)}
                         className={`cursor-pointer rounded-xl p-3 border-2 transition-all flex flex-col gap-2 relative overflow-hidden
                           ${selectedPhase === p.id 
                             ? `border-${PHASE_CONFIG[p.id].theme}-500 bg-${PHASE_CONFIG[p.id].theme}-50` 
                             : 'border-slate-100 bg-white hover:border-slate-200'}
                         `}
                       >
                         {selectedPhase === p.id && (
                           <div className={`absolute top-2 right-2 text-${PHASE_CONFIG[p.id].theme}-600`}>
                             <CheckCircle2 size={16} />
                           </div>
                         )}
                         <div className={`
                           w-8 h-8 rounded-lg flex items-center justify-center
                           ${selectedPhase === p.id ? `bg-${PHASE_CONFIG[p.id].theme}-200 text-${PHASE_CONFIG[p.id].theme}-700` : 'bg-slate-100 text-slate-400'}
                         `}>
                           <p.icon size={16} />
                         </div>
                         <div>
                            <span className={`block text-xs font-bold ${selectedPhase === p.id ? 'text-slate-900' : 'text-slate-600'}`}>{PHASE_CONFIG[p.id].label}</span>
                         </div>
                       </div>
                     ))}
                   </div>
                </div>
              </div>
            )}

            {/* Common Fields */}
            <div className="space-y-4">
              <div>
                 <label className="block text-sm font-bold text-slate-700 mb-1.5">Email Address</label>
                 <div className="relative">
                   <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                   <input type="email" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-slate-900 focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all" placeholder="sarah@example.com" />
                 </div>
              </div>

              <div>
                 <label className="block text-sm font-bold text-slate-700 mb-1.5">Password</label>
                 <div className="relative">
                   <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                   <input type="password" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-slate-900 focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all" placeholder="••••••••" />
                 </div>
              </div>
            </div>

            <button 
              disabled={isLoading}
              className={`
                w-full bg-slate-900 text-white font-bold py-4 rounded-xl shadow-lg shadow-slate-900/20 hover:bg-slate-800 transition-all flex items-center justify-center gap-2 group
                ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}
              `}
            >
              {isLoading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : (
                <>
                  {isSignUp ? 'Start My Journey' : 'Sign In'}
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

          </form>

          <div className="mt-8 text-center">
            <p className="text-slate-500 text-sm">
              {isSignUp ? "Already have an account?" : "Don't have an account yet?"}{' '}
              <button 
                onClick={() => setIsSignUp(!isSignUp)}
                className="font-bold text-slate-900 hover:underline"
              >
                {isSignUp ? 'Log in' : 'Sign up'}
              </button>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};