import React, { useState } from 'react';
import { 
  FileCheck2, 
  Compass, 
  Settings, 
  Eye, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  Building2,
  Lock,
  Mail,
  User,
  HelpCircle,
  RefreshCw
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';

export const LoginView: React.FC = () => {
  const { 
    signInWithGoogle, 
    signInWithEmail, 
    signUpWithEmail, 
    resetPassword,
    loginAsDemoRole,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<'signin' | 'signup' | 'demo'>('signin');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showForgotModal, setShowForgotModal] = useState<boolean>(false);
  const [forgotEmail, setForgotEmail] = useState<string>('');

  const demoRoles = [
    {
      role: 'Revenue Officer' as UserRole,
      title: 'Revenue Officer',
      dept: 'Tehsil Land Revenue Administration',
      desc: 'Verify cadastral boundaries, arbitrate deed area discrepancies, sanction mutations, and publish official RoR.',
      icon: FileCheck2
    },
    {
      role: 'Field Surveyor' as UserRole,
      title: 'Field Surveyor',
      dept: 'Survey of India / Field Directorate',
      desc: 'Ground truthing terminal with CORS RTK rover connectivity, physical stone verification, and cm-level positioning.',
      icon: Compass
    },
    {
      role: 'System Admin' as UserRole,
      title: 'System Administrator',
      dept: 'NIC GeoAI Technical Computing Unit',
      desc: 'Supervise 8-stage automated ETL pipelines, geodetic tolerances, 10 data sources, and staff role assignments.',
      icon: Settings
    },
    {
      role: 'Public Viewer' as UserRole,
      title: 'Citizen / Public Viewer',
      dept: 'Public Open Land Registry',
      desc: 'Citizen search by Khasra/Survey number, land-use zoning verification, and public grievance submission.',
      icon: Eye
    }
  ];

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    setErrorMsg(null);
    try {
      await signInWithEmail(email, password);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to sign in. Please verify your email and password.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !name) return;
    setLoading(true);
    setErrorMsg(null);
    try {
      await signUpWithEmail(email, password, name);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to create account.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      setErrorMsg(err.message || 'Google authentication was cancelled or failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    try {
      await resetPassword(forgotEmail);
      setShowForgotModal(false);
      setForgotEmail('');
    } catch (err: any) {
      setErrorMsg(err.message || 'Could not send reset email.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F5F7] dark:bg-[#121417] text-[#1B1F23] dark:text-[#E8EAED] flex flex-col justify-between transition-colors duration-150">
      {/* Official Government Header */}
      <Navbar currentViewTitle="Authentication Portal" />

      {/* Main Container */}
      <main id="main-content" className="flex-1 max-w-[1280px] mx-auto w-full px-4 sm:px-6 py-8 flex flex-col items-center justify-center">
        {/* Sign In / Access Box */}
        <div className="w-full max-w-xl bg-white dark:bg-[#1A1D21] border border-[#D5D9DE] dark:border-[#2F343A] rounded-[4px] shadow-sm p-6 sm:p-8">
          {/* Header Title */}
          <div className="border-b border-[#D5D9DE] dark:border-[#2F343A] pb-4 mb-6">
            <h1 className="text-xl font-bold tracking-tight text-[#1B1F23] dark:text-[#E8EAED]">
              Official Identity & Access Gateway
            </h1>
            <p className="text-xs text-[#718096] dark:text-[#7D858E] mt-1 leading-relaxed">
              National Urban Land Record Management Platform · Department of Land Resources (DoLR)
            </p>
          </div>

          {/* Clean Flat Tabs */}
          <div className="grid grid-cols-3 border border-[#D5D9DE] dark:border-[#2F343A] rounded-[4px] p-0.5 mb-6 bg-[#E9ECF0] dark:bg-[#22262B] text-xs font-semibold">
            <button
              onClick={() => { setActiveTab('signin'); setErrorMsg(null); }}
              className={`py-2 px-3 rounded-[2px] transition-colors cursor-pointer ${
                activeTab === 'signin'
                  ? 'bg-white dark:bg-[#1A1D21] text-[#1B1F23] dark:text-[#E8EAED] shadow-xs'
                  : 'text-[#4A5568] dark:text-[#AEB4BB] hover:text-[#1B1F23] dark:hover:text-[#E8EAED]'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setActiveTab('signup'); setErrorMsg(null); }}
              className={`py-2 px-3 rounded-[2px] transition-colors cursor-pointer ${
                activeTab === 'signup'
                  ? 'bg-white dark:bg-[#1A1D21] text-[#1B1F23] dark:text-[#E8EAED] shadow-xs'
                  : 'text-[#4A5568] dark:text-[#AEB4BB] hover:text-[#1B1F23] dark:hover:text-[#E8EAED]'
              }`}
            >
              Citizen Sign Up
            </button>
            <button
              onClick={() => { setActiveTab('demo'); setErrorMsg(null); }}
              className={`py-2 px-3 rounded-[2px] transition-colors cursor-pointer ${
                activeTab === 'demo'
                  ? 'bg-[#1F4E8C] dark:bg-[#3F7CC4] text-white shadow-xs'
                  : 'text-[#4A5568] dark:text-[#AEB4BB] hover:text-[#1B1F23] dark:hover:text-[#E8EAED]'
              }`}
            >
              Demo Personas
            </button>
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div className="mb-4 p-3 rounded-[4px] bg-[#C4584F]/10 border border-[#C4584F]/30 text-[#C62828] dark:text-[#C4584F] text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* 1. SIGN IN TAB */}
          {activeTab === 'signin' && (
            <div className="space-y-4">
              <form onSubmit={handleEmailSignIn} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1B1F23] dark:text-[#E8EAED] mb-1">
                    Official Email Address <span className="text-[#C4584F]">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="officer@nic.in or citizen@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-10 px-3 text-xs rounded-[4px] border border-[#D5D9DE] dark:border-[#2F343A] bg-[#F4F5F7] dark:bg-[#22262B] text-[#1B1F23] dark:text-[#E8EAED] focus:outline-none focus:ring-2 focus:ring-[#C9A24B]"
                  />
                  <p className="text-[11px] text-[#718096] dark:text-[#7D858E] mt-1">
                    Authorized staff may use official nic.in / gov.in credentials.
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-[#1B1F23] dark:text-[#E8EAED]">
                      Password <span className="text-[#C4584F]">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowForgotModal(true)}
                      className="text-[11px] text-[#1F4E8C] dark:text-[#7FB0E8] hover:underline cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-10 px-3 text-xs rounded-[4px] border border-[#D5D9DE] dark:border-[#2F343A] bg-[#F4F5F7] dark:bg-[#22262B] text-[#1B1F23] dark:text-[#E8EAED] focus:outline-none focus:ring-2 focus:ring-[#C9A24B]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-10 px-4 rounded-[4px] bg-[#1F4E8C] dark:bg-[#3F7CC4] text-white font-semibold text-xs tracking-wide hover:opacity-95 transition-opacity flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <span>Sign In to Platform</span>}
                </button>
              </form>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#D5D9DE] dark:border-[#2F343A]" />
                </div>
                <div className="relative flex justify-center text-[11px] uppercase tracking-wider text-[#718096]">
                  <span className="bg-white dark:bg-[#1A1D21] px-2">or single sign-on</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full h-10 px-4 rounded-[4px] border border-[#D5D9DE] dark:border-[#2F343A] bg-[#F4F5F7] dark:bg-[#22262B] hover:border-[#1F4E8C] dark:hover:border-[#3F7CC4] text-[#1B1F23] dark:text-[#E8EAED] font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span>Continue with Google SSO</span>
              </button>
            </div>
          )}

          {/* 2. SIGN UP TAB */}
          {activeTab === 'signup' && (
            <form onSubmit={handleEmailSignUp} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#1B1F23] dark:text-[#E8EAED] mb-1">
                  Full Name <span className="text-[#C4584F]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Shri / Smt / Kum"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-10 px-3 text-xs rounded-[4px] border border-[#D5D9DE] dark:border-[#2F343A] bg-[#F4F5F7] dark:bg-[#22262B] text-[#1B1F23] dark:text-[#E8EAED] focus:outline-none focus:ring-2 focus:ring-[#C9A24B]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1B1F23] dark:text-[#E8EAED] mb-1">
                  Email Address <span className="text-[#C4584F]">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="user@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-10 px-3 text-xs rounded-[4px] border border-[#D5D9DE] dark:border-[#2F343A] bg-[#F4F5F7] dark:bg-[#22262B] text-[#1B1F23] dark:text-[#E8EAED] focus:outline-none focus:ring-2 focus:ring-[#C9A24B]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1B1F23] dark:text-[#E8EAED] mb-1">
                  Password (minimum 6 characters) <span className="text-[#C4584F]">*</span>
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-10 px-3 text-xs rounded-[4px] border border-[#D5D9DE] dark:border-[#2F343A] bg-[#F4F5F7] dark:bg-[#22262B] text-[#1B1F23] dark:text-[#E8EAED] focus:outline-none focus:ring-2 focus:ring-[#C9A24B]"
                />
              </div>

              <div className="p-3 rounded-[4px] bg-[#E9ECF0] dark:bg-[#22262B] border border-[#D5D9DE] dark:border-[#2F343A] text-[11px] text-[#4A5568] dark:text-[#AEB4BB] leading-relaxed">
                <strong>Statutory Notice:</strong> New citizen registrations default to <strong>Public Viewer</strong> access. Departmental elevation to Revenue Officer or Field Surveyor is sanctioned by the District System Administrator upon credentials verification.
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-10 px-4 rounded-[4px] bg-[#1F4E8C] dark:bg-[#3F7CC4] text-white font-semibold text-xs tracking-wide hover:opacity-95 transition-opacity flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <span>Register Citizen Account</span>}
              </button>
            </form>
          )}

          {/* 3. DEMO PERSONAS TAB */}
          {activeTab === 'demo' && (
            <div className="space-y-3">
              <p className="text-xs text-[#718096] dark:text-[#7D858E] mb-2 leading-relaxed">
                Select an authorized operational role below to enter the live national workspace with pre-populated geospatial test state:
              </p>

              <div className="space-y-2">
                {demoRoles.map((r) => {
                  const Icon = r.icon;
                  return (
                    <button
                      key={r.role}
                      onClick={() => loginAsDemoRole(r.role)}
                      className="w-full p-3.5 rounded-[4px] border border-[#D5D9DE] dark:border-[#2F343A] bg-white dark:bg-[#22262B] hover:border-[#1F4E8C] dark:hover:border-[#3F7CC4] text-left transition-colors flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-[2px] bg-[#E9ECF0] dark:bg-[#1A1D21] border border-[#D5D9DE] dark:border-[#2F343A] flex items-center justify-center text-[#1F4E8C] dark:text-[#7FB0E8] shrink-0 mt-0.5">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h2 className="text-xs font-bold text-[#1B1F23] dark:text-[#E8EAED]">
                              {r.title}
                            </h2>
                            <span className="text-[10px] px-1.5 py-0.2 border border-[#D5D9DE] dark:border-[#2F343A] text-[#718096] dark:text-[#7D858E] rounded-[2px]">
                              {r.dept}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#4A5568] dark:text-[#AEB4BB] mt-0.5 line-clamp-2">
                            {r.desc}
                          </p>
                        </div>
                      </div>

                      <ArrowRight className="w-4 h-4 text-[#718096] dark:text-[#7D858E] shrink-0 ml-3" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Card Footer notice */}
          <div className="mt-6 pt-4 border-t border-[#D5D9DE] dark:border-[#2F343A] text-[11px] text-[#718096] dark:text-[#7D858E] flex items-center justify-between">
            <span>GIGW 3.0 & NAKSHA Certified</span>
            <button
              onClick={() => { setActiveTab('demo'); setErrorMsg(null); }}
              className="text-[#1F4E8C] dark:text-[#7FB0E8] hover:underline font-medium cursor-pointer"
            >
              Demo Personas Available
            </button>
          </div>
        </div>
      </main>

      {/* Forgot Password Modal (max 6px radius) */}
      {showForgotModal && (
        <div 
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
          onClick={() => setShowForgotModal(false)}
          role="dialog"
          aria-modal="true"
        >
          <div 
            className="bg-white dark:bg-[#22262B] border border-[#D5D9DE] dark:border-[#2F343A] rounded-[4px] p-6 max-w-sm w-full shadow-lg space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-sm font-bold text-[#1B1F23] dark:text-[#E8EAED]">
              Official Password Reset
            </h3>
            <p className="text-xs text-[#4A5568] dark:text-[#AEB4BB] leading-relaxed">
              Enter your registered official email address to dispatch an authenticated password reset link.
            </p>
            <form onSubmit={handleForgotPassword} className="space-y-3">
              <input
                type="email"
                required
                placeholder="name@organization.gov.in"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                className="w-full h-10 px-3 text-xs rounded-[4px] border border-[#D5D9DE] dark:border-[#2F343A] bg-[#F4F5F7] dark:bg-[#1A1D21] text-[#1B1F23] dark:text-[#E8EAED] focus:outline-none focus:ring-2 focus:ring-[#C9A24B]"
              />
              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="px-3 py-1.5 text-xs text-[#4A5568] dark:text-[#AEB4BB] hover:bg-[#F4F5F7] dark:hover:bg-[#1A1D21] rounded-[2px] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold rounded-[2px] bg-[#1F4E8C] dark:bg-[#3F7CC4] text-white hover:opacity-95 transition-opacity cursor-pointer"
                >
                  Send Reset Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Official Government Footer */}
      <Footer />
    </div>
  );
};
