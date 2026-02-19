import React, { useState } from 'react';
import { Leaf, Heart, Stethoscope, Baby, Mail, Lock, User, CheckCircle2, Moon, Sun } from 'lucide-react';
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase';
import { AppPhase, PHASE_CONFIG, UserRole } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { UserTypeSelector } from '../components/auth/UserTypeSelector';
import { GoogleAuthButton } from '../components/auth/GoogleAuthButton';
import { AuthPrimaryCTA } from '../components/auth/AuthPrimaryCTA';

interface SignupProps {
  onSignup: (phase: AppPhase, role: UserRole) => void;
  onNavigateToLogin?: () => void;
}

export const Signup: React.FC<SignupProps> = ({ onSignup, onNavigateToLogin }) => {
  const { theme, toggleTheme } = useTheme();
  const [selectedPhase, setSelectedPhase] = useState<AppPhase>('pre-pregnancy');
  const [selectedRole, setSelectedRole] = useState<UserRole>('mother');
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [emailVerificationPending, setEmailVerificationPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      if (fullName) {
        await updateProfile(userCredential.user, { displayName: fullName });
      }
      await sendEmailVerification(userCredential.user);
      setEmailVerificationPending(true);
      setSuccessMessage('Account created! Please check your email to verify your account.');
    } catch (err: any) {
      let errorMessage = 'An error occurred. Please try again.';
      switch (err.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'This email is already registered. Please sign in.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Please enter a valid email address.';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password should be at least 6 characters.';
          break;
        default:
          errorMessage = err.message || errorMessage;
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (auth.currentUser) {
      setIsLoading(true);
      try {
        await sendEmailVerification(auth.currentUser);
        setSuccessMessage('Verification email sent! Please check your inbox.');
      } catch (err: any) {
        setError('Failed to send verification email. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleGoogleSignup = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      onSignup(selectedPhase, selectedRole);
    } catch (err: any) {
      console.error(err);
      setError('Failed to sign up with Google. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const phases: { id: AppPhase; icon: React.ElementType; description: string }[] = [
    { id: 'pre-pregnancy', icon: Leaf, description: 'Planning & preparing for conception' },
    { id: 'pregnancy', icon: Heart, description: 'Tracking growth & maternal health' },
    { id: 'post-partum', icon: Stethoscope, description: 'Recovery & newborn bonding' },
    { id: 'baby-care', icon: Baby, description: 'Milestones, feeding & sleep' },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-dm-background flex flex-col lg:flex-row font-sans">

      {/* Left Side - Visuals */}
      <div className="lg:w-1/2 bg-dm-background relative overflow-hidden flex flex-col justify-between p-8 lg:p-16 text-white min-h-[300px] lg:min-h-screen">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/mother-baby-illustration.png"
            alt="Mother and Baby"
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dm-background/90 via-dm-background/30 to-transparent"></div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-md bg-primary-500 flex items-center justify-center">
              <Leaf size={16} className="text-white" />
            </div>
            <span className="font-display font-bold text-lg tracking-tight">NurtureNet</span>
          </div>
        </div>

        <div className="relative z-10 max-w-lg">
          <h1 className="text-4xl lg:text-5xl font-display font-extrabold mb-6 leading-tight text-white drop-shadow-sm">
            Your companion for every step of the journey.
          </h1>
          <p className="text-white/90 text-lg leading-relaxed font-medium drop-shadow-sm">
            From pre-conception nutrition to baby milestones, we provide the science-backed tools you need to thrive.
          </p>
        </div>

        <div className="relative z-10 hidden lg:flex gap-8 text-sm font-medium text-white/80">
          <span>© 2024 NurtureNet</span>
          <span>Privacy Policy</span>
          <span>Terms</span>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="lg:w-1/2 flex items-center justify-center p-6 lg:p-16 bg-white dark:bg-dm-background animate-in slide-in-from-right-4 duration-500 relative">
        <button
          onClick={toggleTheme}
          className="absolute top-6 right-6 p-2 rounded-full bg-slate-100 dark:bg-dm-muted text-slate-600 dark:text-dm-muted-fg hover:bg-slate-200 dark:hover:bg-dm-border transition-colors"
          aria-label="Toggle dark mode"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <div className="w-full max-w-md">

          <div className="text-center mb-8">
            <h2 className="text-3xl font-display font-bold text-slate-900 dark:text-dm-foreground mb-2">
              Create an account
            </h2>
            <p className="text-slate-400 dark:text-dm-muted-fg">
              Set up your profile to get started.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Role Selection — config-driven, reusable */}
            <UserTypeSelector selectedRole={selectedRole} onSelectRole={setSelectedRole} />

            {/* Signup-specific Fields */}
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 pt-2 border-t border-slate-100">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
                  <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full bg-slate-50 dark:bg-dm-muted border border-slate-100 dark:border-dm-border rounded-lg py-3 pl-10 pr-4 text-slate-900 dark:text-dm-foreground focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all" placeholder="Anika Sharma" />
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
                          ? `border-${PHASE_CONFIG[p.id].theme}-500 bg-${PHASE_CONFIG[p.id].theme}-50 dark:bg-${PHASE_CONFIG[p.id].theme}-900/20`
                          : 'border-slate-100 bg-white dark:bg-dm-card dark:border-dm-border hover:border-dark-700 dark:hover:border-dm-foreground'}
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
                        <span className={`block text-xs font-bold ${selectedPhase === p.id ? 'text-slate-900 dark:text-dm-foreground' : 'text-slate-600'}`}>{PHASE_CONFIG[p.id].label}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Email & Password Fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-slate-50 dark:bg-dm-muted border border-slate-100 dark:border-dm-border rounded-lg py-3 pl-10 pr-4 text-slate-900 dark:text-dm-foreground focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all" placeholder="anika@example.com" required />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-slate-50 dark:bg-dm-muted border border-slate-100 dark:border-dm-border rounded-lg py-3 pl-10 pr-4 text-slate-900 dark:text-dm-foreground focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all" placeholder="••••••••" required />
                </div>
              </div>
            </div>

            {/* Success Message */}
            {successMessage && (
              <div className="bg-primary-50 border border-primary-200 text-primary-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                <CheckCircle2 size={18} />
                <div>
                  <p>{successMessage}</p>
                  {emailVerificationPending && (
                    <button type="button" onClick={handleResendVerification} className="text-primary-800 underline text-xs mt-1">
                      Resend verification email
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                {error}
                {emailVerificationPending && (
                  <button type="button" onClick={handleResendVerification} className="text-red-800 underline text-xs block mt-1">
                    Resend verification email
                  </button>
                )}
              </div>
            )}

            <AuthPrimaryCTA label="Start My Journey" isLoading={isLoading} />

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100 dark:border-dm-border"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-dm-background px-2 text-slate-400 dark:text-dm-muted-fg font-bold tracking-wider">Or continue with</span>
              </div>
            </div>

            <GoogleAuthButton onClick={handleGoogleSignup} isLoading={isLoading} label="Sign up with Google" />

          </form>

          <div className="mt-8 text-center">
            <p className="text-slate-500 text-sm">
              Already have an account?{' '}
              <button
                onClick={onNavigateToLogin}
                className="font-bold text-slate-900 dark:text-dm-foreground hover:underline"
              >
                Log in
              </button>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};
