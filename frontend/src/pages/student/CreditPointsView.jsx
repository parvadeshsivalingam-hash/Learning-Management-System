import React from 'react';
import { Sparkles, Award, Gift, CheckCircle, TrendingUp } from 'lucide-react';

export const CreditPointsView = () => {
  const history = [
    { id: 1, activity: 'Completed Module 1 Quiz (Full-Stack Bootcamp)', points: 50, date: '2026-08-12' },
    { id: 2, activity: 'Submitted Assignment: Spring Boot REST API', points: 100, date: '2026-08-11' },
    { id: 3, activity: 'Course Completion Bonus: Data Science Fundamentals', points: 300, date: '2026-08-10' }
  ];

  return (
    <div className="p-8 space-y-6">
      <div>
        <h2 className="text-2xl font-black text-white tracking-tight">Credit Points & Rewards Ledger</h2>
        <p className="text-xs text-slate-400 mt-1">Earn credit points for completing quizzes, submitting code, and finishing courses</p>
      </div>

      {/* Points Summary Header */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 border border-indigo-500/30 rounded-3xl p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 shadow-2xl">
        <div>
          <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30 inline-flex items-center gap-1.5 mb-3">
            <Sparkles className="w-3.5 h-3.5" /> Total Earned Balance
          </span>
          <h1 className="text-5xl font-black text-white tracking-tight">450 <span className="text-xl font-bold text-amber-400">PTS</span></h1>
          <p className="text-xs text-slate-400 mt-2">Next Milestone: 500 PTS for Master Scholar Badge</p>
        </div>

        <div className="w-full sm:w-64 space-y-2">
          <div className="flex justify-between text-xs font-bold text-slate-300">
            <span>Certification Milestone</span>
            <span className="text-amber-400">90%</span>
          </div>
          <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
            <div className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full" style={{ width: '90%' }} />
          </div>
        </div>
      </div>

      {/* Points History Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-bold text-white">Points Earning History</h3>
        </div>

        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
            <tr>
              <th className="px-6 py-4">Activity Description</th>
              <th className="px-6 py-4">Points Earned</th>
              <th className="px-6 py-4">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {history.map((h) => (
              <tr key={h.id} className="hover:bg-slate-800/50 transition-colors">
                <td className="px-6 py-4 font-semibold text-white">
                  {h.activity}
                </td>
                <td className="px-6 py-4 font-bold text-amber-400">
                  +{h.points} PTS
                </td>
                <td className="px-6 py-4 text-slate-400">
                  {h.date}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
