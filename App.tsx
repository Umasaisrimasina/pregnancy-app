import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { Nutrition } from './pages/Nutrition';
import { Mind } from './pages/Mind';
import { Education } from './pages/Education';
import { Transition } from './pages/Transition';
import { Login } from './pages/Login';
import { Community } from './pages/Community';
import { PreConceptionMind } from './pages/PreConceptionMind';
import { PregnancyMind } from './pages/PregnancyMind';
import { PostPartumMind } from './pages/PostPartumMind';
import { BabyCareMind } from './pages/BabyCareMind';
import { PreConceptionEducation } from './pages/PreConceptionEducation';
import { PregnancyEducation } from './pages/PregnancyEducation';
import { PostPartumEducation } from './pages/PostPartumEducation';
import { BabyCareEducation } from './pages/BabyCareEducation';
import { ViewState, AppPhase, UserRole, PHASE_CONFIG } from './types';
import { LanguageProvider } from './contexts/LanguageContext';
import { LanguageSelector } from './components/LanguageSelector';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setView] = useState<ViewState>('overview');
  const [currentPhase, setPhase] = useState<AppPhase>('pre-pregnancy');
  const [currentRole, setRole] = useState<UserRole>('mother');
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleLogin = (selectedPhase: AppPhase, selectedRole: UserRole) => {
    setPhase(selectedPhase);
    setRole(selectedRole);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setView('overview');
    setPhase('pre-pregnancy');
    setRole('mother');
  };

  const renderView = () => {
    switch (currentView) {
      case 'overview': return <Dashboard phase={currentPhase} role={currentRole} />;
      case 'nutrition': return <Nutrition phase={currentPhase} />;
      case 'mind': 
        switch (currentPhase) {
          case 'pre-pregnancy': return <PreConceptionMind />;
          case 'pregnancy': return <PregnancyMind />;
          case 'post-partum': return <PostPartumMind phase={currentPhase} />;
          case 'baby-care': return <BabyCareMind />;
          default: return <Mind phase={currentPhase} />;
        }
      case 'education':
        switch (currentPhase) {
          case 'pre-pregnancy': return <PreConceptionEducation />;
          case 'pregnancy': return <PregnancyEducation />;
          case 'post-partum': return <PostPartumEducation />;
          case 'baby-care': return <BabyCareEducation />;
          default: return <Education phase={currentPhase} />;
        }
      case 'community': return <Community phase={currentPhase} />;
      case 'transition': return <Transition phase={currentPhase} setPhase={setPhase} />;
      default: return <Dashboard phase={currentPhase} role={currentRole} />;
    }
  };

  const themeColor = PHASE_CONFIG[currentPhase].theme;

  if (!isAuthenticated) {
    return (
      <LanguageProvider>
        <Login onLogin={handleLogin} />
      </LanguageProvider>
    );
  }

  return (
    <LanguageProvider>
      <div className={`min-h-screen bg-gray-50/50 flex text-slate-900 font-sans theme-${themeColor}`}>
        
        {/* Sidebar Component */}
        <Sidebar 
          currentView={currentView} 
          setView={setView} 
          currentPhase={currentPhase}
          currentRole={currentRole}
          setPhase={setPhase}
          isMobileOpen={isMobileOpen}
          setIsMobileOpen={setIsMobileOpen}
          onLogout={handleLogout}
        />

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col min-w-0 transition-all duration-300">
          
          {/* Mobile Header */}
          <header className="lg:hidden sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 p-4 flex items-center justify-between">
            <button 
              onClick={() => setIsMobileOpen(true)}
              className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              <Menu size={24} />
            </button>
            <span className="font-display font-bold text-lg text-slate-900">PreConceive</span>
            <div className="flex items-center gap-2">
              <LanguageSelector compact />
              <div className="w-8 h-8 rounded-full bg-slate-100 border border-white shadow-sm overflow-hidden">
                <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop" alt="User" />
              </div>
            </div>
          </header>

          {/* Desktop Language Selector */}
          <div className="hidden lg:flex justify-end p-4 pb-0">
            <LanguageSelector />
          </div>

          {/* Page Content */}
          <div className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto max-h-screen scroll-smooth">
            <div className="max-w-[1600px] mx-auto">
              {renderView()}
            </div>
          </div>
        </main>
      </div>
    </LanguageProvider>
  );
};

export default App;