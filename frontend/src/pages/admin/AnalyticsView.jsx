import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend
} from 'recharts';
import { Users, BookOpen, UserCheck, TrendingUp } from 'lucide-react';

export const AnalyticsView = () => {
  const [activeSubTab, setActiveSubTab] = useState('user'); // 'user', 'course', 'team'

  // Sample data series for visual graphs
  const userGrowthData = [
    { month: 'Jan', signups: 42, active: 40 },
    { month: 'Feb', signups: 65, active: 62 },
    { month: 'Mar', signups: 89, active: 85 },
    { month: 'Apr', signups: 120, active: 115 },
    { month: 'May', signups: 155, active: 148 },
    { month: 'Jun', signups: 210, active: 198 }
  ];

  const roleDistributionData = [
    { name: 'Students', value: 140, color: '#3b82f6' },
    { name: 'Staff (Instructors)', value: 25, color: '#10b981' },
    { name: 'Admins', value: 5, color: '#a855f7' }
  ];

  const courseEnrollmentData = [
    { name: 'Full-Stack Web Dev', enrollments: 85, completionRate: 78 },
    { name: 'Data Science ML', enrollments: 62, completionRate: 84 },
    { name: 'UI/UX Design', enrollments: 45, completionRate: 91 },
    { name: 'Cloud Microservices', enrollments: 38, completionRate: 70 }
  ];

  const teamPerformanceData = [
    { team: 'Alpha Web Engineers', avgProgress: 88, engagement: 95 },
    { team: 'Data Science Squad', avgProgress: 92, engagement: 90 },
    { team: 'UI/UX Design Cohort', avgProgress: 81, engagement: 87 }
  ];

  return (
    <div className="p-8 space-y-8">
      <div>
        <h2 className="text-2xl font-black text-white tracking-tight">System Visual Analytics</h2>
        <p className="text-xs text-slate-400 mt-1">Cross-platform metrics, engagement insights, and growth trends</p>
      </div>

      {/* 3 Sub-Tabs Header */}
      <div className="flex items-center gap-2 p-1 bg-slate-900 border border-slate-800 rounded-2xl w-fit">
        <button
          onClick={() => setActiveSubTab('user')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all ${
            activeSubTab === 'user'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users className="w-4 h-4" /> User Analytics
        </button>

        <button
          onClick={() => setActiveSubTab('course')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all ${
            activeSubTab === 'course'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4" /> Course Analytics
        </button>

        <button
          onClick={() => setActiveSubTab('team')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all ${
            activeSubTab === 'team'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <UserCheck className="w-4 h-4" /> Team Analytics
        </button>
      </div>

      {/* Sub-Tab 1: USER ANALYTICS */}
      {activeSubTab === 'user' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h3 className="text-sm font-bold text-white mb-4">User Signups & Active Growth Trend</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={userGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
                  <Legend />
                  <Line type="monotone" dataKey="signups" stroke="#a855f7" strokeWidth={3} name="Total Signups" />
                  <Line type="monotone" dataKey="active" stroke="#10b981" strokeWidth={3} name="Active Users" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
            <h3 className="text-sm font-bold text-white mb-4">Role Distribution</h3>
            <div className="h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={roleDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {roleDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Tab 2: COURSE ANALYTICS */}
      {activeSubTab === 'course' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h3 className="text-sm font-bold text-white mb-4">Total Enrollments per Course</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={courseEnrollmentData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
                  <Bar dataKey="enrollments" fill="#6366f1" radius={[8, 8, 0, 0]} name="Enrollments" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h3 className="text-sm font-bold text-white mb-4">Course Completion Rates (%)</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={courseEnrollmentData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} />
                  <YAxis stroke="#94a3b8" fontSize={11} domain={[0, 100]} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
                  <Bar dataKey="completionRate" fill="#10b981" radius={[8, 8, 0, 0]} name="Completion Rate (%)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Tab 3: TEAM ANALYTICS */}
      {activeSubTab === 'team' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <h3 className="text-sm font-bold text-white mb-4">Team Progress vs. Student Engagement (%)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={teamPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="team" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} domain={[0, 100]} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
                <Legend />
                <Bar dataKey="avgProgress" fill="#3b82f6" name="Average Progress (%)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="engagement" fill="#f59e0b" name="Engagement Score (%)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};
