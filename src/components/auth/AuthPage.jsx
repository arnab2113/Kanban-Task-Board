import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import {
  Layers,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  KanbanSquare,
  ShieldCheck,
  Zap,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ThemeToggle } from '../common/ThemeToggle';

export function AuthPage() {
  const { login, register } = useAuth();

  const [mode, setMode] = useState('login'); // 'login' | 'register'

  // Form states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginRemember, setLoginRemember] = useState(true);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Register form state
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerRole, setRegisterRole] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [registerErrors, setRegisterErrors] = useState({});

  // GSAP animation refs
  const cardRef = useRef(null);
  const formAreaRef = useRef(null);
  const showcaseRef = useRef(null);

  // Initial entrance animation with GSAP
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate card container entrance
      gsap.from(cardRef.current, {
        y: 35,
        opacity: 0,
        scale: 0.98,
        duration: 0.75,
        ease: 'power3.out',
      });

      // Animate showcase bullet items
      gsap.from('.showcase-item', {
        x: 25,
        opacity: 0,
        stagger: 0.1,
        duration: 0.6,
        delay: 0.25,
        ease: 'power2.out',
      });
    });

    return () => ctx.revert();
  }, []);

  // Animate form transition when switching modes
  useEffect(() => {
    if (formAreaRef.current) {
      gsap.fromTo(
        formAreaRef.current,
        {
          opacity: 0,
          y: 12,
          scale: 0.99,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.35,
          ease: 'power2.out',
        }
      );
    }
  }, [mode]);

  // Password strength calculation
  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: '', color: '' };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 8) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 1) return { score: 1, label: 'Weak', color: 'bg-rose-500' };
    if (score === 2) return { score: 2, label: 'Fair', color: 'bg-amber-500' };
    if (score === 3) return { score: 3, label: 'Good', color: 'bg-indigo-500' };
    return { score: 4, label: 'Strong', color: 'bg-emerald-500' };
  };

  const passwordStrength = getPasswordStrength(registerPassword);

  // Handle Login Submission
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setLoginError('');

    if (!loginEmail.trim()) {
      setLoginError('Please enter your email.');
      return;
    }
    if (!loginPassword) {
      setLoginError('Please enter your password.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const result = login(loginEmail, loginPassword, loginRemember);
      setIsSubmitting(false);
      if (!result.success) {
        setLoginError(result.error);
        if (cardRef.current) {
          gsap.fromTo(
            cardRef.current,
            { x: -8 },
            { x: 8, duration: 0.08, repeat: 3, yoyo: true, ease: 'power1.inOut' }
          );
        }
      }
    }, 250);
  };

  // Handle Register Submission
  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    const errs = {};

    if (!registerName.trim()) {
      errs.name = 'Full name is required.';
    }
    if (!registerEmail.trim()) {
      errs.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerEmail.trim())) {
      errs.email = 'Please provide a valid email format.';
    }
    if (!registerPassword) {
      errs.password = 'Password is required.';
    } else if (registerPassword.length < 6) {
      errs.password = 'Password must be at least 6 characters.';
    }
    if (registerPassword !== registerConfirmPassword) {
      errs.confirmPassword = 'Passwords do not match.';
    }

    if (Object.keys(errs).length > 0) {
      setRegisterErrors(errs);
      return;
    }

    setRegisterErrors({});
    setIsSubmitting(true);

    setTimeout(() => {
      const result = register({
        name: registerName,
        email: registerEmail,
        password: registerPassword,
        role: registerRole || 'Product Designer',
      });
      setIsSubmitting(false);

      if (!result.success) {
        setRegisterErrors({ general: result.error });
      }
    }, 250);
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface-light dark:bg-surface-dark text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* Top Bar with Brand & Theme Toggle */}
      <header className="p-4 sm:p-6 flex items-center justify-between max-w-7xl w-full mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-500 text-white flex items-center justify-center shadow-md">
            <Layers className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              TaskFlow
              <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-brand-50 text-brand-700 dark:bg-brand-950/80 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
                PRO
              </span>
            </span>
            <span className="text-xs text-slate-400 font-medium">Agile Workspace</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </header>

      {/* Main Form Centerpiece */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div
          ref={cardRef}
          className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-elevated overflow-hidden"
        >
          {/* Left Form Area (7 Cols on desktop) */}
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center">
            {/* Mode Switcher Tabs */}
            <div className="flex p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl mb-8">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setLoginError('');
                }}
                className={`flex-1 py-2.5 text-xs sm:text-sm font-semibold rounded-xl transition-all duration-200 ${
                  mode === 'login'
                    ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-xs scale-100'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setRegisterErrors({});
                }}
                className={`flex-1 py-2.5 text-xs sm:text-sm font-semibold rounded-xl transition-all duration-200 ${
                  mode === 'register'
                    ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-xs scale-100'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                Create Account
              </button>
            </div>

            <div ref={formAreaRef}>
              {/* LOGIN MODE */}
              {mode === 'login' && (
                <div>
                  <div className="mb-6">
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                      Welcome back
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      Enter your account credentials to access your Kanban sprint board.
                    </p>
                  </div>

                  {/* Error Banner */}
                  {loginError && (
                    <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800/60 flex items-center gap-2.5 text-xs text-rose-700 dark:text-rose-400 animate-slideDown">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{loginError}</span>
                    </div>
                  )}

                  <form onSubmit={handleLoginSubmit} className="space-y-4">
                    {/* Email */}
                    <div>
                      <label
                        htmlFor="login-email"
                        className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
                      >
                        Email Address
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <Mail className="w-4 h-4" />
                        </div>
                        <input
                          id="login-email"
                          type="email"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          placeholder="arnab.maity@taskflow.dev"
                          className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all"
                        />
                      </div>
                    </div>

                    {/* Password */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label
                          htmlFor="login-password"
                          className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300"
                        >
                          Password
                        </label>
                      </div>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <Lock className="w-4 h-4" />
                        </div>
                        <input
                          id="login-password"
                          type={showLoginPassword ? 'text' : 'password'}
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full pl-10 pr-10 py-2.5 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowLoginPassword(!showLoginPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                          aria-label={showLoginPassword ? 'Hide password' : 'Show password'}
                        >
                          {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Remember Me */}
                    <div className="flex items-center justify-between pt-1">
                      <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600 dark:text-slate-400">
                        <input
                          type="checkbox"
                          checked={loginRemember}
                          onChange={(e) => setLoginRemember(e.target.checked)}
                          className="w-4 h-4 rounded text-brand-600 border-slate-300 dark:border-slate-700 focus:ring-brand-500"
                        />
                        <span>Keep me signed in</span>
                      </label>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 active:scale-[0.99] shadow-sm hover:shadow transition-all focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 mt-2 disabled:opacity-70 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <span className="inline-block animate-spin mr-1">⌛</span>
                      ) : (
                        <>
                          <span>Sign In</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>

                  <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-6">
                    Don't have an account yet?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setMode('register');
                        setRegisterErrors({});
                      }}
                      className="font-semibold text-brand-600 dark:text-brand-400 hover:underline"
                    >
                      Create one in 10 seconds
                    </button>
                  </p>
                </div>
              )}

              {/* REGISTER MODE */}
              {mode === 'register' && (
                <div>
                  <div className="mb-6">
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                      Create an account
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      Join TaskFlow to start organizing and managing sprints.
                    </p>
                  </div>

                  {/* General Register Error */}
                  {registerErrors.general && (
                    <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800/60 flex items-center gap-2.5 text-xs text-rose-700 dark:text-rose-400 animate-slideDown">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{registerErrors.general}</span>
                    </div>
                  )}

                  <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                    {/* Full Name */}
                    <div>
                      <label
                        htmlFor="register-name"
                        className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1"
                      >
                        Full Name <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <User className="w-4 h-4" />
                        </div>
                        <input
                          id="register-name"
                          type="text"
                          value={registerName}
                          onChange={(e) => setRegisterName(e.target.value)}
                          placeholder="Arnab Maity"
                          className={`w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800/80 border rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
                            registerErrors.name
                              ? 'border-rose-400 focus:ring-rose-400/40'
                              : 'border-slate-200 dark:border-slate-700 focus:ring-brand-500/50 focus:border-brand-500'
                          }`}
                        />
                      </div>
                      {registerErrors.name && (
                        <p className="text-xs text-rose-500 font-medium mt-1">{registerErrors.name}</p>
                      )}
                    </div>

                    {/* Email & Role Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label
                          htmlFor="register-email"
                          className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1"
                        >
                          Work Email <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                            <Mail className="w-4 h-4" />
                          </div>
                          <input
                            id="register-email"
                            type="email"
                            value={registerEmail}
                            onChange={(e) => setRegisterEmail(e.target.value)}
                            placeholder="arnab.maity@company.com"
                            className={`w-full pl-9 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
                              registerErrors.email
                                ? 'border-rose-400 focus:ring-rose-400/40'
                                : 'border-slate-200 dark:border-slate-700 focus:ring-brand-500/50 focus:border-brand-500'
                            }`}
                          />
                        </div>
                        {registerErrors.email && (
                          <p className="text-xs text-rose-500 font-medium mt-1">{registerErrors.email}</p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="register-role"
                          className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1"
                        >
                          Role / Title
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                            <Briefcase className="w-4 h-4" />
                          </div>
                          <input
                            id="register-role"
                            type="text"
                            value={registerRole}
                            onChange={(e) => setRegisterRole(e.target.value)}
                            placeholder="Lead Engineer"
                            className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Password & Confirm */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label
                          htmlFor="register-password"
                          className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1"
                        >
                          Password <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                            <Lock className="w-4 h-4" />
                          </div>
                          <input
                            id="register-password"
                            type={showRegisterPassword ? 'text' : 'password'}
                            value={registerPassword}
                            onChange={(e) => setRegisterPassword(e.target.value)}
                            placeholder="Min. 6 chars"
                            className={`w-full pl-9 pr-8 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
                              registerErrors.password
                                ? 'border-rose-400 focus:ring-rose-400/40'
                                : 'border-slate-200 dark:border-slate-700 focus:ring-brand-500/50 focus:border-brand-500'
                            }`}
                          />
                          <button
                            type="button"
                            onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                            className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                          >
                            {showRegisterPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                        {registerErrors.password && (
                          <p className="text-xs text-rose-500 font-medium mt-1">{registerErrors.password}</p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="register-confirm"
                          className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1"
                        >
                          Confirm Password <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                            <Lock className="w-4 h-4" />
                          </div>
                          <input
                            id="register-confirm"
                            type={showRegisterPassword ? 'text' : 'password'}
                            value={registerConfirmPassword}
                            onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                            placeholder="Confirm pass"
                            className={`w-full pl-9 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
                              registerErrors.confirmPassword
                                ? 'border-rose-400 focus:ring-rose-400/40'
                                : 'border-slate-200 dark:border-slate-700 focus:ring-brand-500/50 focus:border-brand-500'
                            }`}
                          />
                        </div>
                        {registerErrors.confirmPassword && (
                          <p className="text-xs text-rose-500 font-medium mt-1">{registerErrors.confirmPassword}</p>
                        )}
                      </div>
                    </div>

                    {/* Password strength indicator */}
                    {registerPassword && (
                      <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                        <div className="flex items-center justify-between text-xs mb-1 font-medium">
                          <span className="text-slate-500">Password strength:</span>
                          <span className="font-semibold text-slate-800 dark:text-slate-200">
                            {passwordStrength.label}
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${passwordStrength.color} transition-all duration-300 rounded-full`}
                            style={{ width: `${(passwordStrength.score / 4) * 100}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Register Submit */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 active:scale-[0.99] shadow-sm hover:shadow transition-all focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 mt-4 disabled:opacity-70 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <span className="inline-block animate-spin mr-1">⌛</span>
                      ) : (
                        <>
                          <span>Create TaskFlow Account</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>

                  <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-5">
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setMode('login');
                        setLoginError('');
                      }}
                      className="font-semibold text-brand-600 dark:text-brand-400 hover:underline"
                    >
                      Sign in here
                    </button>
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Visual Showcase Panel (5 cols on desktop) */}
          <div
            ref={showcaseRef}
            className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-brand-900 via-indigo-900 to-slate-950 p-10 flex-col justify-between text-white relative overflow-hidden"
          >
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold mb-6 border border-white/10">
                <KanbanSquare className="w-3.5 h-3.5 text-brand-300" />
                Modern Sprint Kanban
              </div>

              <h2 className="text-2xl font-bold tracking-tight text-white leading-tight">
                Plan, organize, and ship software with clarity.
              </h2>
              <p className="mt-3 text-sm text-indigo-200/80 leading-relaxed">
                TaskFlow gives teams a fast, beautiful workspace with intuitive drag-and-drop, overdue tracking, and sprint analytics.
              </p>

              {/* Feature Points */}
              <div className="mt-8 space-y-4">
                <div className="showcase-item flex items-start gap-3">
                  <div className="p-1 rounded-lg bg-emerald-500/20 text-emerald-400 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">Interactive Drag-and-Drop</p>
                    <p className="text-[11px] text-indigo-200/70">
                      Seamlessly move tasks across To Do, In Progress, and Completed.
                    </p>
                  </div>
                </div>

                <div className="showcase-item flex items-start gap-3">
                  <div className="p-1 rounded-lg bg-amber-500/20 text-amber-400 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">Smart Overdue Indicators</p>
                    <p className="text-[11px] text-indigo-200/70">
                      Instantly catch missed deadlines before sprints wrap up.
                    </p>
                  </div>
                </div>

                <div className="showcase-item flex items-start gap-3">
                  <div className="p-1 rounded-lg bg-indigo-500/20 text-indigo-400 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">LocalStorage Persistence & Export</p>
                    <p className="text-[11px] text-indigo-200/70">
                      Your work stays saved across refreshes with JSON backup options.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Security / Trust Badge */}
            <div className="relative z-10 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-indigo-200/70">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Enterprise Session Storage
              </span>
              <span>v1.0.0</span>
            </div>

            {/* Ambient Background Glows */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-56 h-56 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
          </div>
        </div>
      </main>
    </div>
  );
}
