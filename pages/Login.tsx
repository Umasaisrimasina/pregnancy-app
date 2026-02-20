import React, { useState } from 'react';
import { Leaf, Mail, Lock, CheckCircle2, ArrowLeft, Moon, Sun } from 'lucide-react';
import { signInWithEmailAndPassword, sendPasswordResetEmail, sendEmailVerification, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase';
import { AppPhase, UserRole } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { UserTypeSelector } from '../components/auth/UserTypeSelector';
import { GoogleAuthButton } from '../components/auth/GoogleAuthButton';
import { AuthPrimaryCTA } from '../components/auth/AuthPrimaryCTA';

interface LoginProps {
  onLogin: (phase: AppPhase, role: UserRole) => void;
  onNavigateToSignup?: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin, onNavigateToSignup }) => {
  const { theme, toggleTheme } = useTheme();
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('mother');
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [emailVerificationPending, setEmailVerificationPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      if (!userCredential.user.emailVerified) {
        await sendEmailVerification(userCredential.user);
        setEmailVerificationPending(true);
        setError('Please verify your email before signing in. A new verification email has been sent.');
        return;
      }
      onLogin('pre-pregnancy', selectedRole);
    } catch (err: any) {
      let errorMessage = 'An error occurred. Please try again.';
      switch (err.code) {
        case 'auth/invalid-email':
          errorMessage = 'Please enter a valid email address.';
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
      await signInWithPopup(auth, provider);
      onLogin('pre-pregnancy', selectedRole);
    } catch (err: any) {
      console.error(err);
      setError('Failed to sign in with Google. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

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
            {isForgotPassword && (
              <button
                onClick={() => { setIsForgotPassword(false); setError(null); setSuccessMessage(null); }}
                className="flex items-center gap-1 text-slate-500 hover:text-slate-900 dark:text-dm-muted-fg dark:hover:text-dm-foreground mb-4 mx-auto"
              >
                <ArrowLeft size={16} /> Back to login
              </button>
            )}
            <h2 className="text-3xl font-display font-bold text-slate-900 dark:text-dm-foreground mb-2">
              {isForgotPassword ? 'Reset password' : 'Welcome back'}
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
                      placeholder="anika@example.com"
                      required
                    />
                  </div>
                </div>

                {successMessage && (
                  <div className="bg-primary-50 border border-primary-200 text-primary-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                    <CheckCircle2 size={18} />
                    {successMessage}
                  </div>
                )}

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                    {error}
                  </div>
                )}

                <AuthPrimaryCTA label="Send Reset Link" isLoading={isLoading} />
              </div>
            ) : (
              <>
                {/* Role Selection — config-driven, reusable */}
                <UserTypeSelector selectedRole={selectedRole} onSelectRole={setSelectedRole} />

                {/* Email & Password Fields */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-400 dark:text-slate-500" size={18} />
                      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-slate-50 dark:bg-dm-muted border border-slate-100 dark:border-dm-border rounded-lg py-3 pl-10 pr-4 text-slate-900 dark:text-dm-foreground focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all" placeholder="anika@example.com" required />
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

                {/* Forgot Password Link */}
                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => { setIsForgotPassword(true); setError(null); setSuccessMessage(null); }}
                    className="text-sm text-slate-500 hover:text-slate-900 dark:text-dm-foreground hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>

                <AuthPrimaryCTA label="Sign In" isLoading={isLoading} />

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-100 dark:border-dm-border"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white dark:bg-dm-background px-2 text-slate-400 dark:text-dm-muted-fg font-bold tracking-wider">Or continue with</span>
                  </div>
                </div>

                <GoogleAuthButton onClick={handleGoogleLogin} isLoading={isLoading} />
              </>
            )}

          </form>

          {!isForgotPassword && (
            <div className="mt-8 text-center">
              <p className="text-slate-500 text-sm">
                Don't have an account yet?{' '}
                <button
                  onClick={onNavigateToSignup}
                  className="font-bold text-slate-900 dark:text-dm-foreground hover:underline"
                >
                  Sign up
                </button>
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};





