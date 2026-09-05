import React, { useState } from 'react';
import { AuthCard } from './AuthCard';
import { Sparkles, Shield, Briefcase, GraduationCap, Info } from 'lucide-react';

export const LandingPage = ({ defaultRole = 'ADMIN', defaultTab = 'login' }) => {
  const [showPortalOverview, setShowPortalOverview] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans">
      {/* Background Decorative Ambient Lights */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-indigo-600/15 via-purple-600/10 to-transparent blur-3xl pointer-events-none" />

      {/* Header Banner */}
      <header className="border-b border-slate-800/80 bg-slate-900/40 backdrop-blur-md px-6 sm:px-10 py-4 flex justify-between items-center sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center font-black text-white shadow-xl shadow-indigo-500/30 text-lg">
            LMS
          </div>
          <div>
            <h1 className="font-black text-xl tracking-tight bg-gradient-to-r from-white via-indigo-200 to-purple-300 bg-clip-text text-transparent">
              Aura LMS System
            </h1>
            <span className="text-[10px] text-indigo-400 font-semibold tracking-wider uppercase">Enterprise Edition</span>
          </div>
        </div>

        <button
          onClick={() => setShowPortalOverview(!showPortalOverview)}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 rounded-xl transition-all"
        >
          <Info className="w-4 h-4 text-indigo-400" />
          <span>{showPortalOverview ? 'Hide Portal Overview' : 'Explore Portal Features'}</span>
        </button>
      </header>

      {/* Main Hero Container centering the AuthCard as the Main Page */}
      <main className="max-w-6xl mx-auto px-4 py-8 sm:py-12 flex-1 flex flex-col items-center justify-center relative z-10 w-full">
        {/* Page Title Header */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 text-indigo-300 text-xs font-bold border border-indigo-500/20 mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Unified Authentication Portal
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
            Sign In or Create Account
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-2 leading-relaxed">
            Switch between Admin, Staff, and Student portals using the accessible role switcher below.
          </p>
        </div>

        {/* PRIMARY HERO CENTERPIECE: UNIFIED AUTH CARD */}
        <div className="w-full flex justify-center mb-10">
          <AuthCard initialRole={defaultRole} initialTab={defaultTab} />
        </div>

        {/* Optional Portal Overview Details Expandable Drawer */}
        {showPortalOverview && (
          <div className="w-full max-w-4xl mb-10 p-6 rounded-3xl bg-slate-900/90 border border-slate-800 animate-fadeIn">
            <h3 className="text-sm font-extrabold text-white mb-4 text-center uppercase tracking-wider">
              Three Portals Architecture Overview
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-500/30">
                <div className="flex items-center gap-2 mb-2 text-purple-300 font-bold">
                  <Shield className="w-4 h-4 text-purple-400" /> Admin Portal
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  User CRUD, pending approval queues, team assignment, 3-tab visual analytics, certificate generation, and feedback moderation.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30">
                <div className="flex items-center gap-2 mb-2 text-emerald-300 font-bold">
                  <Briefcase className="w-4 h-4 text-emerald-400" /> Staff (Instructor) Portal
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Lesson module creation, cohort roster management, student attendance tracking, assignment grading, and feedback.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-blue-950/30 border border-blue-500/30">
                <div className="flex items-center gap-2 mb-2 text-blue-300 font-bold">
                  <GraduationCap className="w-4 h-4 text-blue-400" /> Student Portal
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Browse course catalog, interactive video lessons, credit point tracking, and instant PDF completion certificates.
                </p>
              </div>
            </div>
          </div>
        )}

      </main>

      <footer className="border-t border-slate-800/80 py-5 text-center text-xs text-slate-500 bg-slate-950">
        Aura Learning Management System &copy; 2026. Built with Java Spring Boot & React.
      </footer>
    </div>
  );
};
