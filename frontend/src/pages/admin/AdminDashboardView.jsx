import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import { Users, BookOpen, UserCheck, GraduationCap, Clock, AlertTriangle, ArrowUpRight, CheckCircle, TrendingUp } from 'lucide-react';

export const AdminDashboardView = ({ setActiveTab }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    const data = await apiService.getAdminStats();
    setStats(data);
    setLoading(false);
  };

  if (loading) return <div className="p-8 text-center text-slate-400">Loading Dashboard Metrics...</div>;

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">Admin Executive Overview</h2>
          <p className="text-xs text-slate-400 mt-1">Real-time system health and platform operations</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('approvals')}
            className="flex items-center gap-2 px-4 py-2 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-bold hover:bg-amber-500/30 transition-all"
          >
            <Clock className="w-4 h-4" /> Pending Approvals ({stats?.pendingApprovals || 0})
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total System Users</p>
              <h3 className="text-3xl font-black text-white mt-2">{stats?.totalUsers || 0}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs text-emerald-400 gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +12% active user growth
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Active Courses</p>
              <h3 className="text-3xl font-black text-white mt-2">{stats?.totalCourses || 0}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <BookOpen className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs text-indigo-400 gap-1">
            <CheckCircle className="w-3.5 h-3.5" /> Published catalog
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Teams & Cohorts</p>
              <h3 className="text-3xl font-black text-white mt-2">{stats?.totalTeams || 0}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <UserCheck className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs text-slate-400">
            Assigned instructor cohorts
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Course Enrollments</p>
              <h3 className="text-3xl font-black text-white mt-2">{stats?.totalEnrollments || 0}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
              <GraduationCap className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs text-cyan-400 gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> High student retention
          </div>
        </div>
      </div>

      {/* Quick Action & Breakdown Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-base font-bold text-white">System Role Breakdown</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs p-3 bg-slate-950 rounded-xl">
              <span className="text-purple-300 font-semibold">Administrators</span>
              <span className="font-bold text-white">{stats?.roleDistribution?.ADMIN || 1}</span>
            </div>
            <div className="flex justify-between items-center text-xs p-3 bg-slate-950 rounded-xl">
              <span className="text-emerald-300 font-semibold">Staff (Instructors)</span>
              <span className="font-bold text-white">{stats?.roleDistribution?.STAFF || 0}</span>
            </div>
            <div className="flex justify-between items-center text-xs p-3 bg-slate-950 rounded-xl">
              <span className="text-blue-300 font-semibold">Students</span>
              <span className="font-bold text-white">{stats?.roleDistribution?.STUDENT || 0}</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-bold text-white">Quick Platform Actions</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <button
              onClick={() => setActiveTab('users')}
              className="p-4 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-center transition-all group"
            >
              <Users className="w-6 h-6 mx-auto text-purple-400 group-hover:scale-110 transition-transform mb-2" />
              <div className="text-xs font-bold text-slate-200">Manage Users</div>
            </button>

            <button
              onClick={() => setActiveTab('courses')}
              className="p-4 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-center transition-all group"
            >
              <BookOpen className="w-6 h-6 mx-auto text-indigo-400 group-hover:scale-110 transition-transform mb-2" />
              <div className="text-xs font-bold text-slate-200">Manage Courses</div>
            </button>

            <button
              onClick={() => setActiveTab('teams')}
              className="p-4 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-center transition-all group"
            >
              <UserCheck className="w-6 h-6 mx-auto text-emerald-400 group-hover:scale-110 transition-transform mb-2" />
              <div className="text-xs font-bold text-slate-200">Form Teams</div>
            </button>

            <button
              onClick={() => setActiveTab('certificates')}
              className="p-4 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-center transition-all group"
            >
              <GraduationCap className="w-6 h-6 mx-auto text-amber-400 group-hover:scale-110 transition-transform mb-2" />
              <div className="text-xs font-bold text-slate-200">Issue Certificate</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
