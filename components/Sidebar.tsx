import React, { useState } from 'react';
import { LayoutGrid, Utensils, BrainCircuit, GraduationCap, ArrowRightCircle, LogOut, Leaf, ChevronDown, Baby, Heart, Stethoscope } from 'lucide-react';
import { ViewState, AppPhase, UserRole, PHASE_CONFIG } from '../types';

interface SidebarProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
  currentPhase: AppPhase;
  currentRole: UserRole;
  setPhase: (phase: AppPhase) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (isOpen: boolean) => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, currentPhase, currentRole, setPhase, isMobileOpen, setIsMobileOpen, onLogout }) => {
  const [isPhaseMenuOpen, setIsPhaseMenuOpen] = useState(false);
  
  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutGrid },
    { id: 'nutrition', label: 'Nutrition & Diet', icon: Utensils },
    { id: 'mind', label: 'Wellness & Mind', icon: BrainCircuit },
    { id: 'education', label: 'Library', icon: GraduationCap },
  ];

  const handleNavClick = (view: ViewState) => {
    setView(view);
    setIsMobileOpen(false);
  };

  const phases: { id: AppPhase; icon: any; label: string }[] = [
    { id: 'pre-pregnancy', icon: Leaf, label: 'Pre-Conception' },
    { id: 'pregnancy', icon: Heart, label: 'Pregnancy' },
    { id: 'post-partum', icon: Stethoscope, label: 'Post-Partum' },
    { id: 'baby-care', icon: Baby, label: 'Baby Care' },
  ];

  // Dynamic Tailwind classes based on phase
  const getPhaseColor = (phase: AppPhase) => {
    switch(phase) {
      case 'pre-pregnancy': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      case 'pregnancy': return 'text-rose-600 bg-rose-50 border-rose-100';
      case 'post-partum': return 'text-indigo-600 bg-indigo-50 border-indigo-100';
      case 'baby-care': return 'text-sky-600 bg-sky-50 border-sky-100';
      default: return 'text-slate-600 bg-slate-50 border-slate-100';
    }
  };

  const getActiveClass = (isActive: boolean) => {
    if (!isActive) return 'text-gray-500 hover:bg-gray-50 hover:text-slate-900';
    switch(currentPhase) {
       case 'pre-pregnancy': return 'bg-emerald-50 text-emerald-700 shadow-sm ring-1 ring-emerald-100';
       case 'pregnancy': return 'bg-rose-50 text-rose-700 shadow-sm ring-1 ring-rose-100';
       case 'post-partum': return 'bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-100';
       case 'baby-care': return 'bg-sky-50 text-sky-700 shadow-sm ring-1 ring-sky-100';
    }
  };

  const sidebarClasses = `
    fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-100 transform transition-transform duration-300 ease-in-out
    lg:translate-x-0 lg:static lg:inset-0
    ${isMobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
  `;

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside className={sidebarClasses}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-8 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg transition-colors duration-500
              ${currentPhase === 'pre-pregnancy' ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-emerald-500/20' : ''}
              ${currentPhase === 'pregnancy' ? 'bg-gradient-to-br from-rose-400 to-rose-600 shadow-rose-500/20' : ''}
              ${currentPhase === 'post-partum' ? 'bg-gradient-to-br from-indigo-400 to-indigo-600 shadow-indigo-500/20' : ''}
              ${currentPhase === 'baby-care' ? 'bg-gradient-to-br from-sky-400 to-sky-600 shadow-sky-500/20' : ''}
            `}>
              {currentPhase === 'pre-pregnancy' && <Leaf size={20} fill="currentColor" />}
              {currentPhase === 'pregnancy' && <Heart size={20} fill="currentColor" />}
              {currentPhase === 'post-partum' && <Stethoscope size={20} />}
              {currentPhase === 'baby-care' && <Baby size={20} />}
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-slate-900">
              PreConceive
            </span>
          </div>

          {/* User Profile & Phase Selector */}
          <div className="px-6 mb-8 relative">
            <button 
              onClick={() => setIsPhaseMenuOpen(!isPhaseMenuOpen)}
              className="w-full bg-gray-50 p-4 rounded-2xl flex items-center gap-4 border border-gray-100 hover:border-gray-300 transition-all text-left group"
            >
              <div className="relative">
                <img 
                  alt="User" 
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-white" 
                  src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop" 
                />
                <span className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-white rounded-full
                  ${currentPhase === 'pre-pregnancy' ? 'bg-emerald-500' : ''}
                  ${currentPhase === 'pregnancy' ? 'bg-rose-500' : ''}
                  ${currentPhase === 'post-partum' ? 'bg-indigo-500' : ''}
                  ${currentPhase === 'baby-care' ? 'bg-sky-500' : ''}
                `}></span>
              </div>
              <div className="flex flex-col flex-1">
                <span className="text-sm font-bold font-display text-slate-900">Sarah Jenkins</span>
                <span className={`text-[10px] font-bold uppercase tracking-wider mt-1 truncate max-w-[100px]
                   ${currentPhase === 'pre-pregnancy' ? 'text-emerald-600' : ''}
                   ${currentPhase === 'pregnancy' ? 'text-rose-600' : ''}
                   ${currentPhase === 'post-partum' ? 'text-indigo-600' : ''}
                   ${currentPhase === 'baby-care' ? 'text-sky-600' : ''}
                `}>
                  {currentRole === 'mother' ? PHASE_CONFIG[currentPhase].label : `${currentRole.charAt(0).toUpperCase() + currentRole.slice(1)} View`}
                </span>
              </div>
              <ChevronDown size={16} className={`text-gray-400 transition-transform ${isPhaseMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Phase Selection Dropdown */}
            {isPhaseMenuOpen && (
              <div className="absolute top-full left-6 right-6 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="text-xs font-bold text-gray-400 px-3 py-2 uppercase tracking-wider">Switch Phase</div>
                {phases.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setPhase(p.id);
                      setIsPhaseMenuOpen(false);
                      setView('overview');
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-colors
                      ${currentPhase === p.id ? 'bg-gray-50 text-slate-900' : 'text-gray-500 hover:bg-gray-50 hover:text-slate-900'}
                    `}
                  >
                    <div className={`p-1.5 rounded-lg ${currentPhase === p.id ? 'bg-white shadow-sm' : 'bg-gray-100'}`}>
                      <p.icon size={14} className={currentPhase === p.id ? 'text-slate-900' : 'text-gray-500'} />
                    </div>
                    {p.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id as ViewState)}
                  className={`
                    w-full flex items-center gap-3.5 px-4 py-3.5 text-sm font-semibold rounded-2xl transition-all duration-200
                    ${getActiveClass(isActive)}
                  `}
                >
                  <Icon size={22} className={isActive ? 'currentColor' : 'text-gray-400'} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Bottom Actions */}
          <div className="p-6 mt-auto space-y-2">
            <button 
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
            >
              <LogOut size={20} />
              Log Out
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};