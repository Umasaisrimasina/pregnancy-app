import React, { useState } from 'react';
import { ArrowRight, Leaf, Heart, Stethoscope, Baby, Mail, Lock, User, CheckCircle2, Users, HeartHandshake, ArrowLeft, Moon, Sun } from 'lucide-react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, sendPasswordResetEmail, sendEmailVerification, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase';
import { AppPhase, PHASE_CONFIG, UserRole } from '../types';
import { useTheme } from '../contexts/ThemeContext';

interface LoginProps {
  onLogin: (phase: AppPhase, role: UserRole) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const { theme, toggleTheme } = useTheme();
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
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
      if (isSignUp) {
        // Create new user
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // Update display name
        if (fullName) {
          await updateProfile(userCredential.user, { displayName: fullName });
        }
        // Send email verification
        await sendEmailVerification(userCredential.user);
        setEmailVerificationPending(true);
        setSuccessMessage('Account created! Please check your email to verify your account.');
        return; // Don't proceed to dashboard until verified
      } else {
        // Sign in existing user
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        // Check if email is verified
        if (!userCredential.user.emailVerified) {
          // Send another verification email
          await sendEmailVerification(userCredential.user);
          setEmailVerificationPending(true);
          setError('Please verify your email before signing in. A new verification email has been sent.');
          return;
        }
      }
      // On success, call onLogin
      onLogin(selectedPhase, selectedRole);
    } catch (err: any) {
      // Handle Firebase auth errors
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
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email. Please sign up.';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Incorrect password. Please try again.';
          break;
        case 'auth/invalid-credential':
          errorMessage = 'Invalid credentials. Please check your email and password.';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many attempts. Please try again later.';
          break;
        default:
          errorMessage = err.message || errorMessage;
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    if (!email) {
      setError('Please enter your email address.');
      setIsLoading(false);
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccessMessage('Password reset email sent! Check your inbox.');
    } catch (err: any) {
      let errorMessage = 'Failed to send reset email. Please try again.';
      switch (err.code) {
        case 'auth/invalid-email':
          errorMessage = 'Please enter a valid email address.';
          break;
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email.';
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

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      // Determine if new user or existing? 
      // FireBase handles this, but we might want to ensure 'role' and 'phase' are set if it's a new user.
      // For now, allow simple login.
      onLogin(selectedPhase, selectedRole);
    } catch (err: any) {
      console.error(err);
      setError('Failed to sign in with Google. Please try again.');
    } finally {
      setIsLoading(false);
    }
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
            <span className="font-display font-bold text-lg tracking-tight">PreConceive</span>
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
          <span>© 2024 PreConceive</span>
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
            {isForgotPassword && (
              <button
                onClick={() => { setIsForgotPassword(false); setError(null); setSuccessMessage(null); }}
                className="flex items-center gap-1 text-slate-500 hover:text-slate-900 dark:text-dm-muted-fg dark:hover:text-dm-foreground mb-4 mx-auto"
              >
                <ArrowLeft size={16} /> Back to login
              </button>
            )}
            <h2 className="text-3xl font-display font-bold text-slate-900 dark:text-dm-foreground mb-2">
              {isForgotPassword ? 'Reset password' : isSignUp ? 'Create an account' : 'Welcome back'}
            </h2>
            <p className="text-slate-400 dark:text-dm-muted-fg">
              {isForgotPassword
                ? 'Enter your email and we\'ll send you a reset link.'
                : 'Enter your details to access your dashboard.'}
            </p>
          </div>

          <form onSubmit={isForgotPassword ? handleForgotPassword : handleSubmit} className="space-y-6">

            {/* Forgot Password Mode */}
            {isForgotPassword ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-400 dark:text-slate-500" size={18} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-dm-muted border border-slate-100 dark:border-dm-border rounded-lg py-3 pl-10 pr-4 text-slate-900 dark:text-dm-foreground focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                      placeholder="sarah@example.com"
                      required
                    />
                  </div>
                </div>

                {/* Success Message */}
                {successMessage && (
                  <div className="bg-primary-50 border border-primary-200 text-primary-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                    <CheckCircle2 size={18} />
                    {successMessage}
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                    {error}
                  </div>
                )}

                <button
                  disabled={isLoading}
                  className={`
                    w-full bg-slate-900 dark:bg-dm-foreground text-white font-bold py-4 rounded-xl shadow-lg shadow-dark-950/20 hover:bg-slate-700 dark:hover:bg-dm-muted transition-all flex items-center justify-center gap-2
                    ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}
                  `}
                >
                  {isLoading ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  ) : (
                    <>Send Reset Link</>
                  )}
                </button>
              </div>
            ) : (
              <>
                {/* Role Selection */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 dark:text-dm-muted-fg uppercase tracking-wider mb-3 text-center">I am the...</label>
                  <div className="grid grid-cols-4 gap-3">
                    {roles.map((r) => {
                      const isActive = selectedRole === r.id;
                      const Icon = r.icon;
                      // Define colors for each role - matching Dark Matter theme
                      const roleColors: Record<string, { gradient: string; border: string; icon: string; shadow: string }> = {
                        mother: { gradient: 'from-[#c2633a] to-[#d97b4a]', border: 'border-[#c2633a]', icon: 'text-[#c2633a] dark:text-[#d97b4a]', shadow: 'shadow-[#c2633a]/30' },
                        partner: { gradient: 'from-[#3d7a7a] to-[#4a8585]', border: 'border-[#3d7a7a]', icon: 'text-[#3d7a7a] dark:text-[#4a8585]', shadow: 'shadow-[#3d7a7a]/30' },
                        family: { gradient: 'from-[#d97b4a] to-[#e8c07a]', border: 'border-[#d97b4a]', icon: 'text-[#d97b4a] dark:text-[#e8c07a]', shadow: 'shadow-[#d97b4a]/30' },
                        medical: { gradient: 'from-[#4a8585] to-[#5a9595]', border: 'border-[#4a8585]', icon: 'text-[#4a8585] dark:text-[#5a9595]', shadow: 'shadow-[#4a8585]/30' },
                      };
                      const colors = roleColors[r.id] || roleColors.mother;
                      return (
                        <button
                          key={r.id}
                          type="button"
                          onClick={() => setSelectedRole(r.id)}
                          className={`
                            relative flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all duration-300 transform
                            ${isActive
                              ? `bg-gradient-to-br ${colors.gradient} text-white border-transparent shadow-lg ${colors.shadow} scale-105`
                              : `border-slate-200 dark:border-dm-border bg-white dark:bg-dm-card text-slate-500 dark:text-dm-muted-fg hover:border-slate-300 dark:hover:border-dm-foreground/50 hover:scale-[1.02] hover:shadow-md`}
                          `}
                        >
                          {isActive && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-md">
                              <CheckCircle2 size={12} className={colors.icon} />
                            </div>
                          )}
                          <div className={`
                            w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300
                            ${isActive 
                              ? 'bg-white/20' 
                              : `bg-slate-100 dark:bg-dm-muted`}
                          `}>
                            <Icon size={22} className={isActive ? 'text-white' : colors.icon} />
                          </div>
                          <span className={`text-[10px] font-bold uppercase tracking-wide ${isActive ? 'text-white' : 'text-slate-600 dark:text-dm-muted-fg'}`}>{r.label}</span>
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
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-400 dark:text-slate-500" size={18} />
                        <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full bg-slate-50 dark:bg-dm-muted border border-slate-100 dark:border-dm-border rounded-lg py-3 pl-10 pr-4 text-slate-900 dark:text-dm-foreground focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all" placeholder="Sarah Jenkins" />
                      </div>
                    </div>

                    {/* Phase Selection Grid */}
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-dm-muted-fg mb-3">Current Journey Phase</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {phases.map((p) => {
                          const isActive = selectedPhase === p.id;
                          // Define colors for each phase - matching Dark Matter theme
                          const phaseColors: Record<string, { border: string; bg: string; iconBg: string; iconText: string; checkmark: string }> = {
                            'pre-pregnancy': { 
                              border: 'border-[#c2633a]', 
                              bg: 'bg-[#c2633a]/10 dark:bg-[#d97b4a]/20', 
                              iconBg: 'bg-[#c2633a]/20 dark:bg-[#d97b4a]/30', 
                              iconText: 'text-[#c2633a] dark:text-[#d97b4a]',
                              checkmark: 'text-[#c2633a] dark:text-[#d97b4a]'
                            },
                            'pregnancy': { 
                              border: 'border-[#3d7a7a]', 
                              bg: 'bg-[#3d7a7a]/10 dark:bg-[#4a8585]/20', 
                              iconBg: 'bg-[#3d7a7a]/20 dark:bg-[#4a8585]/30', 
                              iconText: 'text-[#3d7a7a] dark:text-[#4a8585]',
                              checkmark: 'text-[#3d7a7a] dark:text-[#4a8585]'
                            },
                            'post-partum': { 
                              border: 'border-[#d97b4a]', 
                              bg: 'bg-[#d97b4a]/10 dark:bg-[#e8c07a]/20', 
                              iconBg: 'bg-[#d97b4a]/20 dark:bg-[#e8c07a]/30', 
                              iconText: 'text-[#d97b4a] dark:text-[#e8c07a]',
                              checkmark: 'text-[#d97b4a] dark:text-[#e8c07a]'
                            },
                            'baby-care': { 
                              border: 'border-[#4a8585]', 
                              bg: 'bg-[#4a8585]/10 dark:bg-[#5a9595]/20', 
                              iconBg: 'bg-[#4a8585]/20 dark:bg-[#5a9595]/30', 
                              iconText: 'text-[#4a8585] dark:text-[#5a9595]',
                              checkmark: 'text-[#4a8585] dark:text-[#5a9595]'
                            },
                          };
                          const colors = phaseColors[p.id] || phaseColors['pre-pregnancy'];
                          
                          return (
                            <div
                              key={p.id}
                              onClick={() => setSelectedPhase(p.id)}
                              className={`cursor-pointer rounded-xl p-3 border-2 transition-all flex flex-col gap-2 relative overflow-hidden
                                ${isActive
                                  ? `${colors.border} ${colors.bg}`
                                  : 'border-slate-100 bg-white dark:bg-dm-card dark:border-dm-border hover:border-slate-300 dark:hover:border-dm-foreground/50'}
                              `}
                            >
                              {isActive && (
                                <div className={`absolute top-2 right-2 ${colors.checkmark}`}>
                                  <CheckCircle2 size={16} />
                                </div>
                              )}
                              <div className={`
                                w-8 h-8 rounded-lg flex items-center justify-center
                                ${isActive ? `${colors.iconBg} ${colors.iconText}` : 'bg-slate-100 dark:bg-dm-muted text-slate-400 dark:text-dm-muted-fg'}
                              `}>
                                <p.icon size={16} />
                              </div>
                              <div>
                                <span className={`block text-xs font-bold ${isActive ? 'text-slate-900 dark:text-dm-foreground' : 'text-slate-600 dark:text-dm-muted-fg'}`}>{PHASE_CONFIG[p.id].label}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* Common Fields */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-400 dark:text-slate-500" size={18} />
                      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-slate-50 dark:bg-dm-muted border border-slate-100 dark:border-dm-border rounded-lg py-3 pl-10 pr-4 text-slate-900 dark:text-dm-foreground focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all" placeholder="sarah@example.com" required />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-400 dark:text-slate-500" size={18} />
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
                        <button
                          type="button"
                          onClick={handleResendVerification}
                          className="text-primary-800 underline text-xs mt-1"
                        >
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
                      <button
                        type="button"
                        onClick={handleResendVerification}
                        className="text-red-800 underline text-xs block mt-1"
                      >
                        Resend verification email
                      </button>
                    )}
                  </div>
                )}

                {/* Forgot Password Link */}
                {!isSignUp && (
                  <div className="text-right">
                    <button
                      type="button"
                      onClick={() => { setIsForgotPassword(true); setError(null); setSuccessMessage(null); }}
                      className="text-sm text-slate-500 hover:text-slate-900 dark:text-dm-foreground hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                <button
                  disabled={isLoading}
                  className={`
                    w-full bg-slate-900 dark:bg-dm-foreground text-white font-bold py-4 rounded-xl shadow-lg shadow-dark-950/20 hover:bg-slate-700 dark:hover:bg-dm-muted transition-all flex items-center justify-center gap-2 group
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

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-100 dark:border-dm-border"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white dark:bg-dm-background px-2 text-slate-400 dark:text-dm-muted-fg font-bold tracking-wider">Or continue with</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  className="w-full bg-white dark:bg-dm-card border-2 border-slate-100 dark:border-dm-border text-slate-700 dark:text-dm-foreground font-bold py-4 rounded-xl hover:bg-slate-50 dark:hover:bg-dm-border transition-all flex items-center justify-center gap-3"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  Sign in with Google
                </button>
              </>
            )}

          </form>

          {!isForgotPassword && (
            <div className="mt-8 text-center">
              <p className="text-slate-500 text-sm">
                {isSignUp ? "Already have an account?" : "Don't have an account yet?"}{' '}
                <button
                  onClick={() => { setIsSignUp(!isSignUp); setError(null); setSuccessMessage(null); }}
                  className="font-bold text-slate-900 dark:text-dm-foreground hover:underline"
                >
                  {isSignUp ? 'Log in' : 'Sign up'}
                </button>
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};





