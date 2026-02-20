import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { Nutrition } from './pages/Nutrition';
import { Mind } from './pages/Mind';
import { Education } from './pages/Education';
import { Transition } from './pages/Transition';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Community } from './pages/Community';
import { PreConceptionMind } from './pages/PreConceptionMind';
import { PregnancyMind } from './pages/PregnancyMind';
import { PostPartumMind } from './pages/PostPartumMind';
import { BabyCareMind } from './pages/BabyCareMind';
import { PreConceptionEducation } from './pages/PreConceptionEducation';
import { PregnancyEducation } from './pages/PregnancyEducation';
import { PostPartumEducation } from './pages/PostPartumEducation';
import { BabyCareEducation } from './pages/BabyCareEducation';
import { FertilityWellnessPage } from './pages/FertilityWellnessPage';
import { PartnerNutritionPage } from './pages/PartnerNutritionPage';
import { PreConceptionGuidePage } from './pages/PreConceptionGuidePage';
import { PartnerCommunityPage } from './pages/PartnerCommunityPage';
import { FamilyNutritionPage } from './pages/family/FamilyNutritionPage';
import { FamilyWellnessPage } from './pages/family/FamilyWellnessPage';
import { FamilyPreconceptionPage } from './pages/family/FamilyPreconceptionPage';
import { FamilyCommunityPage } from './pages/family/FamilyCommunityPage';
import { AboutLanding } from './pages/AboutLanding';
import { ViewState, AppPhase, UserRole, PHASE_CONFIG } from './types';
import { LanguageProvider } from './contexts/LanguageContext';
import { HealthDataProvider } from './contexts/HealthDataContext';
import { RiskDataProvider } from './contexts/RiskDataContext';
import { LanguageSelector } from './components/LanguageSelector';
import { RiskAnalysis } from './pages/RiskAnalysis';
import { ThemeProvider } from './contexts/ThemeContext';
import { SOSProvider } from './contexts/SOSContext';
import { SOSModal } from './components/SOSModal';

// Landing Page wrapper component
const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/login');
  };

  return <AboutLanding onGetStarted={handleGetStarted} />;
};

// Login Page wrapper component
const LoginPage: React.FC<{ onLogin: (phase: AppPhase, role: UserRole) => void }> = ({ onLogin }) => {
  const navigate = useNavigate();

  const handleLogin = (phase: AppPhase, role: UserRole) => {
    onLogin(phase, role);
    navigate('/app');
  };

  return (
    <LanguageProvider>
      <Login onLogin={handleLogin} onNavigateToSignup={() => navigate('/signup')} />
    </LanguageProvider>
  );
};

// Signup Page wrapper component
const SignupPage: React.FC<{ onSignup: (phase: AppPhase, role: UserRole) => void }> = ({ onSignup }) => {
  const navigate = useNavigate();

  const handleSignup = (phase: AppPhase, role: UserRole) => {
    onSignup(phase, role);
    navigate('/app');
  };

  return (
    <LanguageProvider>
      <Signup onSignup={handleSignup} onNavigateToLogin={() => navigate('/login')} />
    </LanguageProvider>
  );
};

// Main App content (after authentication)
const MainApp: React.FC<{
  currentView: ViewState;
  setView: (view: ViewState) => void;
  currentPhase: AppPhase;
  setPhase: (phase: AppPhase) => void;
  currentRole: UserRole;
  onLogout: () => void;
}> = ({ currentView, setView, currentPhase, setPhase, currentRole, onLogout }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const themeColor = PHASE_CONFIG[currentPhase].theme;

  const renderView = () => {
    switch (currentView) {
      case 'overview':
        return <Dashboard phase={currentPhase} role={currentRole} />;
      case 'nutrition':
        if (currentRole === 'partner') return <PartnerNutritionPage phase={currentPhase} />;
        if (currentRole === 'family') return <FamilyNutritionPage phase={currentPhase} />;
        return <Nutrition phase={currentPhase} />;
      case 'mind':
        if (currentRole === 'partner') return <FertilityWellnessPage />;
        if (currentRole === 'family') return <FamilyWellnessPage />;
        switch (currentPhase) {
          case 'pre-pregnancy': return <PreConceptionMind />;
          case 'pregnancy': return <PregnancyMind />;
          case 'post-partum': return <PostPartumMind phase={currentPhase} />;
          case 'baby-care': return <BabyCareMind />;
          default: return <Mind phase={currentPhase} />;
        }
      case 'education':
        if (currentRole === 'partner') return <PreConceptionGuidePage />;
        if (currentRole === 'family') return <FamilyPreconceptionPage />;
        switch (currentPhase) {
          case 'pre-pregnancy': return <PreConceptionEducation />;
          case 'pregnancy': return <PregnancyEducation />;
          case 'post-partum': return <PostPartumEducation />;
          case 'baby-care': return <BabyCareEducation />;
          default: return <Education phase={currentPhase} />;
        }
      case 'community':
        if (currentRole === 'partner') return <PartnerCommunityPage phase={currentPhase} />;
        if (currentRole === 'family') return <FamilyCommunityPage phase={currentPhase} />;
        return <Community phase={currentPhase} />;
      case 'transition': return <Transition phase={currentPhase} setPhase={setPhase} />;
      case 'risk-analysis': return <RiskAnalysis />;
      default: return <Dashboard phase={currentPhase} role={currentRole} />;
    }
  };

  return (
    <LanguageProvider>
      <HealthDataProvider>
        <RiskDataProvider>
          <SOSProvider>
            <div className={`min-h-screen bg-gray-50/50 dark:bg-dm-background flex text-slate-900 dark:text-dm-foreground font-sans theme-${themeColor} transition-colors duration-300`}>
              <Sidebar
                currentView={currentView}
                setView={setView}
                currentPhase={currentPhase}
                currentRole={currentRole}
                setPhase={setPhase}
                isMobileOpen={isMobileOpen}
                setIsMobileOpen={setIsMobileOpen}
                onLogout={onLogout}
              />
              <main className="flex-1 flex flex-col min-w-0 transition-all duration-300 lg:ml-72">
                <header className="lg:hidden sticky top-0 z-30 bg-white/80 dark:bg-dm-card/80 backdrop-blur-md border-b border-gray-100 dark:border-dm-border p-4 flex items-center justify-between transition-colors duration-300">
                  <button
                    onClick={() => setIsMobileOpen(true)}
                    className="p-2 -ml-2 text-slate-600 dark:text-dm-muted-fg hover:bg-slate-100 dark:hover:bg-dm-muted rounded-lg transition-colors"
                  >
                    <Menu size={24} />
                  </button>
                  <span className="font-display font-bold text-lg text-slate-900 dark:text-dm-foreground">NurtureNet</span>
                  <div className="flex items-center gap-2">
                    <LanguageSelector compact />
                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-dm-muted border border-white dark:border-dm-border shadow-sm overflow-hidden">
                      <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop" alt="User" />
                    </div>
                  </div>
                </header>
                <div className="hidden lg:flex justify-end p-4 pb-0">
                  <LanguageSelector />
                </div>
                <div className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto max-h-screen scroll-smooth">
                  <div className="max-w-[1600px] mx-auto">
                    {renderView()}
                  </div>
                </div>
              </main>
              <SOSModal />
            </div>
          </SOSProvider>
        </RiskDataProvider>
      </HealthDataProvider>
    </LanguageProvider>
  );
};

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [currentView, setView] = useState<ViewState>('overview');
  const [currentPhase, setPhase] = useState<AppPhase>(() => {
    return (localStorage.getItem('nurturenet_phase') as AppPhase) || 'pre-pregnancy';
  });
  const [currentRole, setRole] = useState<UserRole>(() => {
    return (localStorage.getItem('nurturenet_role') as UserRole) || 'mother';
  });

  // Listen for Firebase auth state changes (persists across reloads)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = (selectedPhase: AppPhase, selectedRole: UserRole) => {
    setPhase(selectedPhase);
    setRole(selectedRole);
    localStorage.setItem('nurturenet_phase', selectedPhase);
    localStorage.setItem('nurturenet_role', selectedRole);
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    await signOut(auth);
    localStorage.removeItem('nurturenet_phase');
    localStorage.removeItem('nurturenet_role');
    setIsAuthenticated(false);
    setView('overview');
    setPhase('pre-pregnancy');
    setRole('mother');
  };

  // Wrap setPhase to also persist to localStorage
  const handleSetPhase = (phase: AppPhase) => {
    setPhase(phase);
    localStorage.setItem('nurturenet_phase', phase);
  };

  // Show loading spinner while Firebase checks auth state
  if (authLoading) {
    return (
      <ThemeProvider>
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dm-background">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-purple-300 border-t-purple-600 rounded-full animate-spin" />
            <p className="text-slate-500 dark:text-dm-muted-fg text-sm">Loading...</p>
          </div>
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/login"
            element={
              isAuthenticated ? (
                <Navigate to="/app" replace />
              ) : (
                <LoginPage onLogin={handleLogin} />
              )
            }
          />
          <Route
            path="/signup"
            element={
              isAuthenticated ? (
                <Navigate to="/app" replace />
              ) : (
                <SignupPage onSignup={handleLogin} />
              )
            }
          />
          <Route
            path="/app/*"
            element={
              isAuthenticated ? (
                <MainApp
                  currentView={currentView}
                  setView={setView}
                  currentPhase={currentPhase}
                  setPhase={handleSetPhase}
                  currentRole={currentRole}
                  onLogout={handleLogout}
                />
              ) : (
                <LoginPage onLogin={handleLogin} />
              )
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;



