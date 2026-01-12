import React, { useState } from 'react';
import { ArrowRight, Leaf, Heart, Stethoscope, Baby, Mail, Lock, User, CheckCircle2, Users, HeartHandshake, ArrowLeft } from 'lucide-react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, sendPasswordResetEmail, sendEmailVerification } from 'firebase/auth';
import { auth } from '../firebase';
import { AppPhase, PHASE_CONFIG, UserRole } from '../types';

interface LoginProps {
  onLogin: (phase: AppPhase, role: UserRole) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
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
            src="/images/mother-baby-illustration.png"
            alt="Mother and Baby"
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent"></div>
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
            {isForgotPassword && (
              <button
                onClick={() => { setIsForgotPassword(false); setError(null); setSuccessMessage(null); }}
                className="flex items-center gap-1 text-slate-500 hover:text-slate-900 mb-4 mx-auto"
              >
                <ArrowLeft size={16} /> Back to login
              </button>
            )}
            <h2 className="text-3xl font-display font-bold text-slate-900 mb-2">
              {isForgotPassword ? 'Reset password' : isSignUp ? 'Create an account' : 'Welcome back'}
            </h2>
            <p className="text-slate-500">
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
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-slate-900 focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all"
                      placeholder="sarah@example.com"
                      required
                    />
                  </div>
                </div>

                {/* Success Message */}
                {successMessage && (
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
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
                    w-full bg-slate-900 text-white font-bold py-4 rounded-xl shadow-lg shadow-slate-900/20 hover:bg-slate-800 transition-all flex items-center justify-center gap-2
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
                        <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-slate-900 focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all" placeholder="Sarah Jenkins" />
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
                      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-slate-900 focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all" placeholder="sarah@example.com" required />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-slate-900 focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all" placeholder="••••••••" required />
                    </div>
                  </div>
                </div>

                {/* Success Message */}
                {successMessage && (
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                    <CheckCircle2 size={18} />
                    <div>
                      <p>{successMessage}</p>
                      {emailVerificationPending && (
                        <button
                          type="button"
                          onClick={handleResendVerification}
                          className="text-emerald-800 underline text-xs mt-1"
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
                      className="text-sm text-slate-500 hover:text-slate-900 hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

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
              </>
            )}

          </form>

          {!isForgotPassword && (
            <div className="mt-8 text-center">
              <p className="text-slate-500 text-sm">
                {isSignUp ? "Already have an account?" : "Don't have an account yet?"}{' '}
                <button
                  onClick={() => { setIsSignUp(!isSignUp); setError(null); setSuccessMessage(null); }}
                  className="font-bold text-slate-900 hover:underline"
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