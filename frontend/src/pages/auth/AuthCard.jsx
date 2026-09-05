import React, { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/api';
import {
  Shield,
  Briefcase,
  GraduationCap,
  AlertCircle,
  CheckCircle,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  FileText,
  KeyRound,
  Sparkles,
  ArrowRight,
  Check,
  X
} from 'lucide-react';

export const AuthCard = ({ initialRole = 'STUDENT', initialTab = 'login', onClose }) => {
  const { login, register, loading, error, setError } = useAuth();

  const [activeRole, setActiveRole] = useState(initialRole); // 'ADMIN', 'STAFF', 'STUDENT'
  const [activeTab, setActiveTab] = useState(initialTab); // 'login', 'register'

  // Log In State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Registration State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regBio, setRegBio] = useState('');
  const [regRole, setRegRole] = useState(initialRole);
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [regSuccessMsg, setRegSuccessMsg] = useState(null);

  // Forgot Password State
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [forgotMsg, setForgotMsg] = useState(null);
  const [forgotLoading, setForgotLoading] = useState(false);

  // Tab Refs for ARIA keyboard navigation
  const tabLoginRef = useRef(null);
  const tabRegisterRef = useRef(null);

  // Role details config
  const getRoleTheme = (role) => {
    switch (role) {
      case 'ADMIN':
        return {
          title: 'Admin Control Portal',
          subtitle: 'System Administrator Authentication & Management',
          badgeClass: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
          activeTabClass: 'bg-purple-600 text-white shadow-purple-500/30',
          buttonGradient: 'from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-purple-600/30',
          accentColor: 'text-purple-400',
          borderColor: 'border-purple-500/40',
          icon: <Shield className="w-5 h-5 text-purple-400" />,
          defaultEmail: 'admin@domain.com'
        };
      case 'STAFF':
        return {
          title: 'Staff & Faculty Portal',
          subtitle: 'Instructor Access to Courses, Rosters & Grading',
          badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          activeTabClass: 'bg-emerald-600 text-white shadow-emerald-500/30',
          buttonGradient: 'from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-600/30',
          accentColor: 'text-emerald-400',
          borderColor: 'border-emerald-500/40',
          icon: <Briefcase className="w-5 h-5 text-emerald-400" />,
          defaultEmail: 'instructor@domain.com'
        };
      case 'STUDENT':
      default:
        return {
          title: 'Student Learning Portal',
          subtitle: 'Access Your Enrolled Courses, Progress & Certificates',
          badgeClass: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
          activeTabClass: 'bg-blue-600 text-white shadow-blue-500/30',
          buttonGradient: 'from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-blue-600/30',
          accentColor: 'text-blue-400',
          borderColor: 'border-blue-500/40',
          icon: <GraduationCap className="w-5 h-5 text-blue-400" />,
          defaultEmail: 'student@domain.com'
        };
    }
  };

  const currentTheme = getRoleTheme(activeRole);

  // Keyboard navigation for accessible tabs
  const handleTabKeyDown = (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault();
      const nextTab = activeTab === 'login' ? 'register' : 'login';
      setActiveTab(nextTab);
      setError(null);
      if (nextTab === 'login') {
        tabLoginRef.current?.focus();
      } else {
        tabRegisterRef.current?.focus();
      }
    }
  };

  // Handle Login Submit
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(loginEmail, loginPassword, activeRole);
      if (onClose) onClose();
    } catch {
      // Error state stored in AuthContext
    }
  };

  // Handle Registration Submit
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!agreedTerms) {
      setError('You must accept the Terms of Service to register.');
      return;
    }
    try {
      const targetRegistrationRole = regRole || activeRole;
      const res = await register(regName, regEmail, regPassword, targetRegistrationRole, regBio);
      setRegSuccessMsg(
        res.message ||
        (targetRegistrationRole === 'ADMIN'
          ? 'Admin account created successfully! You can now log in.'
          : 'Registration submitted! Awaiting Admin approval.')
      );
      // Pre-fill login email for convenience
      setLoginEmail(regEmail);
      setLoginPassword(regPassword);
    } catch {
      // Error handled in AuthContext
    }
  };

  // Handle Password Reset
  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setForgotLoading(true);
    setForgotMsg(null);
    try {
      const res = await apiService.resetPassword(forgotEmail, activeRole, newPassword);
      setForgotMsg(res.message || 'Password reset request successfully processed!');
    } catch (err) {
      setForgotMsg(`Error: ${err.message || 'Unable to reset password.'}`);
    } finally {
      setForgotLoading(false);
    }
  };

  // Password Strength Calculator
  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: '', color: 'bg-slate-700' };
    let score = 0;
    if (pass.length >= 6) score++;
    if (pass.length >= 10) score++;
    if (/[A-Z]/.test(pass) && /[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    if (score <= 1) return { score: 25, label: 'Weak', color: 'bg-rose-500' };
    if (score === 2) return { score: 50, label: 'Fair', color: 'bg-amber-500' };
    if (score === 3) return { score: 75, label: 'Good', color: 'bg-emerald-500' };
    return { score: 100, label: 'Strong', color: 'bg-teal-400' };
  };

  const pwdStrength = getPasswordStrength(regPassword);

  return (
    <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-lg w-full p-6 sm:p-8 text-white relative shadow-2xl backdrop-blur-xl overflow-hidden">
      {/* Background Subtle Gradient Glow */}
      <div className="absolute -top-24 -right-24 w-60 h-60 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Close button if rendered inside modal */}
      {onClose && (
        <button
          onClick={onClose}
          aria-label="Close Authentication Modal"
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      {/* THREE LOGIN ROLE SWITCHER TOOLBAR */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Select Portal Role
          </span>
          <span className="text-[10px] text-slate-500 font-mono">3 Active Portals</span>
        </div>

        <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-950/80 rounded-2xl border border-slate-800">
          <button
            type="button"
            onClick={() => {
              setActiveRole('ADMIN');
              setRegRole('ADMIN');
              setError(null);
            }}
            className={`py-2 px-2 sm:px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeRole === 'ADMIN'
                ? 'bg-purple-600/30 text-purple-300 border border-purple-500/50 shadow-md shadow-purple-950/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Admin</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveRole('STAFF');
              setRegRole('STAFF');
              setError(null);
            }}
            className={`py-2 px-2 sm:px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeRole === 'STAFF'
                ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/50 shadow-md shadow-emerald-950/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Staff</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveRole('STUDENT');
              setRegRole('STUDENT');
              setError(null);
            }}
            className={`py-2 px-2 sm:px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeRole === 'STUDENT'
                ? 'bg-blue-600/30 text-blue-300 border border-blue-500/50 shadow-md shadow-blue-950/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Student</span>
          </button>
        </div>
      </div>

      {/* PORTAL HEADER BANNER */}
      <div className="flex items-center gap-3.5 mb-6 p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
        <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 ${currentTheme.badgeClass}`}>
          {currentTheme.icon}
        </div>
        <div>
          <h2 className="text-base font-extrabold text-white">{currentTheme.title}</h2>
          <p className="text-xs text-slate-400 leading-tight">{currentTheme.subtitle}</p>
        </div>
      </div>

      {!showForgot ? (
        <>
          {/* ACCESSIBLE TAB SWITCHER (WAI-ARIA TABLIST) */}
          <div
            role="tablist"
            aria-label="Authentication Options"
            onKeyDown={handleTabKeyDown}
            className="grid grid-cols-2 gap-1 p-1 bg-slate-950 rounded-2xl border border-slate-800 mb-6 relative"
          >
            <button
              ref={tabLoginRef}
              id="tab-login"
              role="tab"
              type="button"
              aria-selected={activeTab === 'login'}
              aria-controls="panel-login"
              tabIndex={activeTab === 'login' ? 0 : -1}
              onClick={() => {
                setActiveTab('login');
                setError(null);
              }}
              className={`py-3 px-4 rounded-xl text-xs font-extrabold tracking-wide transition-all duration-200 focus-visible:ring-2 focus-visible:ring-indigo-500 focus:outline-none ${
                activeTab === 'login'
                  ? `${currentTheme.activeTabClass} shadow-md`
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
              }`}
            >
              Log In
            </button>

            <button
              ref={tabRegisterRef}
              id="tab-register"
              role="tab"
              type="button"
              aria-selected={activeTab === 'register'}
              aria-controls="panel-register"
              tabIndex={activeTab === 'register' ? 0 : -1}
              onClick={() => {
                setActiveTab('register');
                setError(null);
              }}
              className={`py-3 px-4 rounded-xl text-xs font-extrabold tracking-wide transition-all duration-200 focus-visible:ring-2 focus-visible:ring-indigo-500 focus:outline-none ${
                activeTab === 'register'
                  ? `${currentTheme.activeTabClass} shadow-md`
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* GLOBAL ERROR ALERT */}
          {error && (
            <div
              role="alert"
              aria-live="polite"
              className="mb-5 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5 animate-fadeIn"
            >
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* TAB PANEL 1: LOG IN FORM */}
          {activeTab === 'login' && (
            <div
              id="panel-login"
              role="tabpanel"
              aria-labelledby="tab-login"
              className="space-y-4 animate-fadeIn"
            >
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
                    <input
                      type="email"
                      required
                      aria-required="true"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder={currentTheme.defaultEmail}
                      className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-xs font-semibold text-slate-300">Password</label>
                    <button
                      type="button"
                      onClick={() => {
                        setShowForgot(true);
                        setError(null);
                      }}
                      className={`text-xs ${currentTheme.accentColor} hover:underline font-medium`}
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
                    <input
                      type={showLoginPassword ? 'text' : 'password'}
                      required
                      aria-required="true"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute right-3.5 top-3.5 text-slate-500 hover:text-slate-300"
                      aria-label={showLoginPassword ? 'Hide password' : 'Show password'}
                    >
                      {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded bg-slate-950 border-slate-800 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>Remember me on this browser</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3.5 bg-gradient-to-r ${currentTheme.buttonGradient} font-bold rounded-xl text-sm shadow-lg transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50`}
                >
                  {loading ? (
                    <span>Authenticating...</span>
                  ) : (
                    <>
                      <span>Sign In to {activeRole === 'ADMIN' ? 'Admin' : activeRole === 'STAFF' ? 'Staff' : 'Student'} Portal</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="pt-2 text-center text-xs text-slate-400">
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('register');
                    setError(null);
                  }}
                  className={`${currentTheme.accentColor} font-bold hover:underline`}
                >
                  Create free account
                </button>
              </div>
            </div>
          )}

          {/* TAB PANEL 2: CREATE ACCOUNT FORM */}
          {activeTab === 'register' && (
            <div
              id="panel-register"
              role="tabpanel"
              aria-labelledby="tab-register"
              className="space-y-4 animate-fadeIn"
            >
              {regSuccessMsg ? (
                <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-white">Registration Submitted!</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{regSuccessMsg}</p>
                  <p className="text-[11px] text-slate-400">
                    You can now use your registered email and password on the Log In tab.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setRegSuccessMsg(null);
                      setActiveTab('login');
                    }}
                    className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs transition-colors"
                  >
                    Proceed to Log In
                  </button>
                </div>
              ) : (
                <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                  {/* Role selection within Registration */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Registering Account Role
                    </label>
                    <select
                      value={regRole}
                      onChange={(e) => setRegRole(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                    >
                      <option value="STUDENT">Student Learner</option>
                      <option value="STAFF">Staff (Course Instructor)</option>
                      <option value="ADMIN">System Administrator</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
                      <input
                        type="text"
                        required
                        aria-required="true"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        placeholder="e.g. Jordan Miller"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
                      <input
                        type="email"
                        required
                        aria-required="true"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="jordan@domain.com"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
                      <input
                        type={showRegPassword ? 'text' : 'password'}
                        required
                        aria-required="true"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-10 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegPassword(!showRegPassword)}
                        className="absolute right-3.5 top-3 text-slate-500 hover:text-slate-300"
                      >
                        {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Password Strength Indicator Bar */}
                    {regPassword && (
                      <div className="mt-2 space-y-1">
                        <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden flex">
                          <div
                            className={`h-full transition-all duration-300 ${pwdStrength.color}`}
                            style={{ width: `${pwdStrength.score}%` }}
                          />
                        </div>
                        <div className="flex justify-between items-center text-[10px] text-slate-400">
                          <span>Password Strength</span>
                          <span className="font-bold">{pwdStrength.label}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      {regRole === 'STAFF' ? 'Qualifications & Bio' : regRole === 'ADMIN' ? 'Admin Department & Role' : 'Academic Interests & Bio'}
                    </label>
                    <div className="relative">
                      <FileText className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
                      <textarea
                        rows={2}
                        value={regBio}
                        onChange={(e) => setRegBio(e.target.value)}
                        placeholder={
                          regRole === 'STAFF'
                            ? 'List relevant teaching subject areas or experience...'
                            : regRole === 'ADMIN'
                            ? 'System Governance & IT Lead...'
                            : 'Short description of learning goals...'
                        }
                        className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 pt-1">
                    <input
                      type="checkbox"
                      id="terms-check"
                      checked={agreedTerms}
                      onChange={(e) => setAgreedTerms(e.target.checked)}
                      className="mt-0.5 rounded bg-slate-950 border-slate-800 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label htmlFor="terms-check" className="text-[11px] text-slate-400 leading-tight select-none cursor-pointer">
                      I agree to the LMS <span className="text-indigo-400 underline">Terms of Service</span> & <span className="text-indigo-400 underline">Privacy Policy</span>.
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-3.5 bg-gradient-to-r ${currentTheme.buttonGradient} font-bold rounded-xl text-xs shadow-lg transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50`}
                  >
                    {loading ? (
                      <span>Submitting Registration...</span>
                    ) : (
                      <>
                        <span>Submit {regRole === 'STAFF' ? 'Staff' : regRole === 'ADMIN' ? 'Admin' : 'Student'} Registration</span>
                        <Check className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}

              <div className="pt-1 text-center text-xs text-slate-400">
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('login');
                    setError(null);
                  }}
                  className={`${currentTheme.accentColor} font-bold hover:underline`}
                >
                  Log in to your portal
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        /* FORGOT PASSWORD DRAWER */
        <div className="space-y-4 animate-fadeIn">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Reset Account Password</h3>
              <p className="text-xs text-slate-400">Specify details for {activeRole} portal reset</p>
            </div>
          </div>

          {forgotMsg ? (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-start gap-2.5">
              <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <span>{forgotMsg}</span>
            </div>
          ) : (
            <form onSubmit={handleForgotSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Registered Account Email</label>
                <input
                  type="email"
                  required
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder={currentTheme.defaultEmail}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">New Desired Password</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <button
                type="submit"
                disabled={forgotLoading}
                className={`w-full py-3 bg-gradient-to-r ${currentTheme.buttonGradient} font-bold rounded-xl text-xs shadow-md disabled:opacity-50`}
              >
                {forgotLoading ? 'Processing Password Reset...' : 'Reset Account Password'}
              </button>
            </form>
          )}

          <button
            type="button"
            onClick={() => {
              setShowForgot(false);
              setForgotMsg(null);
            }}
            className="w-full py-2 text-xs text-slate-400 hover:text-white transition-colors"
          >
            ← Back to Portal Log In
          </button>
        </div>
      )}
    </div>
  );
};
