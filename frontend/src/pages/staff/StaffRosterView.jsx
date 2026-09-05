import React, { useState, useEffect } from 'react';
import { apiService, MOCK_USERS } from '../../services/api';
import { Users, CheckCircle, UserCheck, Search } from 'lucide-react';

export const StaffRosterView = () => {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({ 5: true, 6: true }); // Default present

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    const data = await apiService.getUsers();
    setStudents(data.filter(u => u.role === 'STUDENT' && u.status === 'ACTIVE'));
  };

  const toggleAttendance = (id) => {
    setAttendance(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="p-8 space-y-6">
      <div>
        <h2 className="text-2xl font-black text-white tracking-tight">Student Roster & Attendance Tracker</h2>
        <p className="text-xs text-slate-400 mt-1">Track student progress percentage and log daily live session attendance</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
            <tr>
              <th className="px-6 py-4">Student</th>
              <th className="px-6 py-4">Course Progress</th>
              <th className="px-6 py-4">Credit Points</th>
              <th className="px-6 py-4 text-right">Session Attendance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {students.map((st) => {
              const isPresent = attendance[st.id] ?? true;
              return (
                <tr key={st.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold">
                        {st.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-white">{st.name}</div>
                        <div className="text-[11px] text-slate-400">{st.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="w-48">
                      <div className="flex justify-between text-[11px] font-bold text-slate-300 mb-1">
                        <span>Completion Rate</span>
                        <span className="text-emerald-400">75%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: '75%' }} />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-amber-400">
                    450 pts
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => toggleAttendance(st.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        isPresent
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      }`}
                    >
                      {isPresent ? 'Marked Present' : 'Marked Absent'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
