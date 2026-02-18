import React, { useState } from 'react';
import { LayoutGrid, Utensils, BrainCircuit, GraduationCap, ArrowRightCircle, LogOut, Leaf, ChevronDown, Baby, Heart, Stethoscope, Users, Activity, Moon, Sun, Phone, X, AlertTriangle } from 'lucide-react';
import { ViewState, AppPhase, UserRole, PHASE_CONFIG } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { useSOS } from '../contexts/SOSContext';

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
  const { triggerSOS } = useSOS();
  const { theme, toggleTheme } = useTheme();

  const getNavItems = () => {
    const baseItems = [
      { id: 'overview', label: 'Overview', icon: LayoutGrid },
      { id: 'nutrition', label: 'Nutrition & Diet', icon: Utensils },
    ];

    let mindLabel = 'Wellness & Mind';
    let educationLabel = 'Library';

    switch (currentPhase) {
      case 'pre-pregnancy':
        mindLabel = 'Fertility & Wellness';
        educationLabel = 'Pre-Conception Guide';
        break;
      case 'pregnancy':
        mindLabel = 'Prenatal Wellness';
        educationLabel = 'Pregnancy Library';
        break;
      case 'post-partum':
        mindLabel = 'Stress & Mind';
        educationLabel = 'Recovery Resources';
        break;
      case 'baby-care':
        mindLabel = 'Parent Wellness';
        educationLabel = 'Baby Care Guide';
        break;
    }

    const allItems = [
      ...baseItems,
      // Add Risk Analysis only for pregnancy phase
      ...(currentPhase === 'pregnancy' ? [{ id: 'risk-analysis', label: 'Risk Analysis', icon: Activity }] : []),
      { id: 'mind', label: mindLabel, icon: BrainCircuit },
      { id: 'education', label: educationLabel, icon: GraduationCap },
      { id: 'community', label: 'Mom Community', icon: Users },
    ];

    // Medical role only sees Overview + Risk Analysis
    if (currentRole === 'medical') {
      const hiddenForMedical = new Set(['nutrition', 'mind', 'education', 'community']);
      return allItems.filter(item => !hiddenForMedical.has(item.id));
    }

    return allItems;
  };

  const navItems = getNavItems();

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

  // Dynamic Tailwind classes based on phase (Dark Matter warm palette)
  const getPhaseColor = (phase: AppPhase) => {
    switch (phase) {
      case 'pre-pregnancy': return 'text-primary-600 bg-primary-50 border-primary-100 dark:bg-primary-900/20 dark:border-primary-800 dark:text-primary-400';
      case 'pregnancy': return 'text-primary-500 bg-primary-50 border-primary-100 dark:bg-primary-900/30 dark:border-primary-700 dark:text-primary-300';
      case 'post-partum': return 'text-secondary-600 bg-secondary-50 border-secondary-100 dark:bg-secondary-900/20 dark:border-secondary-800 dark:text-secondary-400';
      case 'baby-care': return 'text-secondary-500 bg-secondary-50 border-secondary-100 dark:bg-secondary-900/30 dark:border-secondary-700 dark:text-secondary-300';
      default: return 'text-slate-600 bg-slate-50 dark:bg-dm-muted border-dm-border dark:text-dm-muted-fg';
    }
  };

  const getActiveClass = (isActive: boolean) => {
    if (!isActive) return 'text-gray-500 hover:bg-gray-50 hover:text-slate-900 dark:text-dm-muted-fg dark:hover:bg-dm-accent dark:hover:text-dm-foreground';
    switch (currentPhase) {
      case 'pre-pregnancy': return 'bg-primary-50 text-primary-700 shadow-dm-sm ring-1 ring-primary-100 dark:bg-primary-900/20 dark:text-primary-400 dark:ring-primary-800';
      case 'pregnancy': return 'bg-primary-50 text-primary-600 shadow-dm-sm ring-1 ring-primary-100 dark:bg-primary-900/30 dark:text-primary-300 dark:ring-primary-700';
      case 'post-partum': return 'bg-secondary-50 text-secondary-700 shadow-dm-sm ring-1 ring-secondary-100 dark:bg-secondary-900/20 dark:text-secondary-400 dark:ring-secondary-800';
      case 'baby-care': return 'bg-secondary-50 text-secondary-600 shadow-dm-sm ring-1 ring-secondary-100 dark:bg-secondary-900/30 dark:text-secondary-300 dark:ring-secondary-700';
    }
  };

  const sidebarClasses = `
    fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-dm-sidebar border-r border-gray-100 dark:border-dm-border transform transition-transform duration-300 ease-in-out
    lg:translate-x-0 overflow-y-auto
    ${isMobileOpen ? 'translate-x-0 shadow-dm-xl' : '-translate-x-full'}
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
          <div className="p-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg transition-colors duration-500
                ${currentPhase === 'pre-pregnancy' ? 'bg-gradient-to-br from-primary-400 to-primary-600 shadow-primary-500/20' : ''}
                ${currentPhase === 'pregnancy' ? 'bg-gradient-to-br from-primary-300 to-primary-500 shadow-primary-400/20' : ''}
                ${currentPhase === 'post-partum' ? 'bg-gradient-to-br from-secondary-400 to-secondary-600 shadow-secondary-500/20' : ''}
                ${currentPhase === 'baby-care' ? 'bg-gradient-to-br from-secondary-300 to-secondary-500 shadow-secondary-400/20' : ''}
              `}>
                {currentPhase === 'pre-pregnancy' && <Leaf size={20} fill="currentColor" />}
                {currentPhase === 'pregnancy' && <Heart size={20} fill="currentColor" />}
                {currentPhase === 'post-partum' && <Stethoscope size={20} />}
                {currentPhase === 'baby-care' && <Baby size={20} />}
              </div>
              <span className="font-display font-bold text-xl tracking-tight text-slate-900 dark:text-dm-foreground">
                NurtureNet
              </span>
            </div>

          </div>

          {/* User Profile & Phase Selector */}
          <div className="px-6 mb-8 relative">
            <button
              onClick={() => setIsPhaseMenuOpen(!isPhaseMenuOpen)}
              className="w-full bg-gray-50 dark:bg-dm-muted p-4 rounded-lg flex items-center gap-4 border border-gray-100 dark:border-dm-border hover:border-gray-300 dark:hover:border-dm-accent transition-all text-left group"
            >
              <div className="relative">
                <img
                  alt="User"
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-white dark:ring-dm-border"
                  src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop"
                />
                <span className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-white dark:border-dm-card rounded-full
                  ${currentPhase === 'pre-pregnancy' ? 'bg-primary-500' : ''}
                  ${currentPhase === 'pregnancy' ? 'bg-primary-400' : ''}
                  ${currentPhase === 'post-partum' ? 'bg-secondary-500' : ''}
                  ${currentPhase === 'baby-care' ? 'bg-secondary-400' : ''}
                `}></span>
              </div>
              <div className="flex flex-col flex-1">
                <span className="text-sm font-bold font-display text-slate-900 dark:text-dm-foreground">Sarah Jenkins</span>
                <span className={`text-[10px] font-bold uppercase tracking-wider mt-1 truncate max-w-[100px]
                   ${currentPhase === 'pre-pregnancy' ? 'text-primary-600 dark:text-primary-400' : ''}
                   ${currentPhase === 'pregnancy' ? 'text-primary-500 dark:text-primary-300' : ''}
                   ${currentPhase === 'post-partum' ? 'text-secondary-600 dark:text-secondary-400' : ''}
                   ${currentPhase === 'baby-care' ? 'text-secondary-500 dark:text-secondary-300' : ''}
                `}>
                  {currentRole === 'mother' ? PHASE_CONFIG[currentPhase].label : `${currentRole.charAt(0).toUpperCase() + currentRole.slice(1)} View`}
                </span>
              </div>
              <ChevronDown size={16} className={`text-gray-400 dark:text-dm-muted-fg transition-transform ${isPhaseMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Phase Selection Dropdown */}
            {isPhaseMenuOpen && (
              <div className="absolute top-full left-6 right-6 mt-2 bg-white dark:bg-dm-card rounded-lg shadow-dm-xl border border-gray-100 dark:border-dm-border p-2 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="text-xs font-bold text-gray-400 dark:text-dm-muted-fg px-3 py-2 uppercase tracking-wider">Switch Phase</div>
                {phases.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setPhase(p.id);
                      setIsPhaseMenuOpen(false);
                      setView('overview');
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-md text-sm font-medium transition-colors
                      ${currentPhase === p.id ? 'bg-gray-50 dark:bg-dm-accent text-slate-900 dark:text-dm-foreground' : 'text-gray-500 dark:text-dm-muted-fg hover:bg-gray-50 dark:hover:bg-dm-accent hover:text-slate-900 dark:hover:text-dm-foreground'}
                    `}
                  >
                    <div className={`p-1.5 rounded-md ${currentPhase === p.id ? 'bg-white dark:bg-dm-muted shadow-dm-sm' : 'bg-gray-100 dark:bg-dm-muted'}`}>
                      <p.icon size={14} className={currentPhase === p.id ? 'text-slate-900 dark:text-dm-foreground' : 'text-gray-500 dark:text-dm-muted-fg'} />
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
                    w-full flex items-center gap-3.5 px-4 py-3.5 text-sm font-semibold rounded-lg transition-all duration-200
                    ${getActiveClass(isActive)}
                  `}
                >
                  <Icon size={22} className={isActive ? 'currentColor' : 'text-gray-400 dark:text-dm-muted-fg'} />
                  {item.label}
                </button>
              );
            })}

            {/* SOS Emergency Button — hidden for medical role */}
            {currentRole !== 'medical' && (
              <button
                onClick={triggerSOS}
                className="w-full flex items-center gap-3.5 px-4 py-3.5 text-sm font-bold rounded-lg transition-all duration-200 mt-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg shadow-red-500/30 hover:shadow-red-500/50"
              >
                <AlertTriangle size={22} className="animate-pulse" />
                SOS Emergency
              </button>
            )}
          </nav>

          {/* Bottom Actions */}
          <div className="p-6 mt-auto space-y-2">
            <button
              onClick={toggleTheme}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-400 dark:text-dm-muted-fg hover:text-slate-900 dark:hover:text-dm-foreground hover:bg-gray-50 dark:hover:bg-dm-accent rounded-md transition-all"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
              {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
            </button>
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-400 dark:text-dm-muted-fg hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-all"
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




