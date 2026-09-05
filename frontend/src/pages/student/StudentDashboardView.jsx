import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { GraduationCap, Sparkles, BookOpen, Award, CheckCircle, Clock } from 'lucide-react';

export const StudentDashboardView = ({ setActiveTab }) => {
  const { currentUser } = useAuth();

  return (
    <div className="p-8 space-y-8">
      <div>
        <h2 className="text-2xl font-black text-white tracking-tight">Student Learning Dashboard</h2>
        <p className="text-xs text-slate-400 mt-1">Welcome back, {currentUser?.name || 'Alex Rivera'}</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase">Enrolled Courses</p>
              <h3 className="text-3xl font-black text-white mt-2">2</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <BookOpen className="w-6 h-6" />
            </div>
          </div>
          <p className="text-xs text-blue-400 mt-4">Active Learning</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase">Credit Points Balance</p>
              <h3 className="text-3xl font-black text-amber-400 mt-2">450</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
          </div>
          <p className="text-xs text-amber-400 mt-4">+150 pts this week</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase">Completed Courses</p>
              <h3 className="text-3xl font-black text-white mt-2">1</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <CheckCircle className="w-6 h-6" />
            </div>
          </div>
          <p className="text-xs text-emerald-400 mt-4">100% Passed</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase">Earned Certificates</p>
              <h3 className="text-3xl font-black text-white mt-2">1</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
          </div>
          <p className="text-xs text-purple-400 mt-4">Verified Credentials</p>
        </div>
      </div>

      {/* Active Course Progress Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-base font-bold text-white">Current Active Learning Progress</h3>
          <button
            onClick={() => setActiveTab('my-learning')}
            className="text-xs font-bold text-indigo-400 hover:underline"
          >
            Continue Learning &rarr;
          </button>
        </div>

        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <span className="px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold border border-indigo-500/30">
              Development
            </span>
            <h4 className="font-bold text-white text-base mt-2">Full-Stack Web Development Bootcamp</h4>
            <p className="text-xs text-slate-400 mt-1">Instructor: Dr. Sarah Jenkins</p>
          </div>

          <div className="w-full md:w-64 space-y-2">
            <div className="flex justify-between text-xs font-bold text-slate-300">
              <span>Overall Progress</span>
              <span className="text-emerald-400">75%</span>
            </div>
            <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
              <div className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full" style={{ width: '75%' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Deadlines & Announcements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" /> Upcoming Deadlines
          </h3>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs flex justify-between items-center">
            <div>
              <div className="font-bold text-slate-200">Spring Boot REST API Assignment</div>
              <div className="text-slate-400">Full-Stack Bootcamp</div>
            </div>
            <span className="px-2.5 py-1 bg-amber-500/20 text-amber-300 font-bold rounded-lg">In 3 Days</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-base font-bold text-white">Platform Announcements</h3>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs">
            <div className="font-bold text-indigo-300">New Data Science Modules Released!</div>
            <div className="text-slate-400 mt-1">Prof. Michael Chang uploaded Advanced Neural Networks curriculum.</div>
          </div>
        </div>
      </div>
    </div>
  );
};
