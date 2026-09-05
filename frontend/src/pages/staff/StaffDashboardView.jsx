import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { apiService, MOCK_COURSES, MOCK_TEAMS } from '../../services/api';
import { BookOpen, Users, ClipboardList, Calendar, Clock, CheckCircle } from 'lucide-react';

export const StaffDashboardView = ({ setActiveTab }) => {
  const { currentUser } = useAuth();
  const [courses, setCourses] = useState([]);
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    loadStaffData();
  }, [currentUser]);

  const loadStaffData = async () => {
    const allCourses = await apiService.getCourses();
    // Filter instructor courses
    const staffCourses = allCourses.filter(c => c.instructorId === (currentUser?.id || 2));
    setCourses(staffCourses.length > 0 ? staffCourses : allCourses.slice(0, 2));

    const allTeams = await apiService.getTeams();
    setTeams(allTeams);
  };

  return (
    <div className="p-8 space-y-8">
      <div>
        <h2 className="text-2xl font-black text-white tracking-tight">Staff Instructor Command Center</h2>
        <p className="text-xs text-slate-400 mt-1">Welcome back, {currentUser?.name || 'Dr. Sarah Jenkins'}</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">Assigned Courses</p>
            <h3 className="text-3xl font-black text-white mt-1">{courses.length}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <BookOpen className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">Assigned Cohort Teams</p>
            <h3 className="text-3xl font-black text-white mt-1">{teams.length}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">Submissions Pending Grade</p>
            <h3 className="text-3xl font-black text-amber-400 mt-1">3</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <ClipboardList className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Assigned Courses Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-base font-bold text-white">Your Assigned Courses</h3>
          <button
            onClick={() => setActiveTab('my-courses')}
            className="text-xs font-bold text-indigo-400 hover:underline"
          >
            Manage Course Content &rarr;
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {courses.map(c => (
            <div key={c.id} className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex items-center gap-4">
              <img src={c.thumbnailUrl} alt={c.title} className="w-16 h-16 rounded-lg object-cover" />
              <div>
                <h4 className="font-bold text-white text-sm line-clamp-1">{c.title}</h4>
                <p className="text-xs text-slate-400">{c.category} &bull; {c.level}</p>
                <span className="inline-block mt-1 text-[10px] text-emerald-400 font-semibold">
                  Status: Active Teaching
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Schedule */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-base font-bold text-white">Upcoming Live Mentorship Sessions</h3>
        <div className="space-y-3">
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-indigo-400" />
              <div>
                <div className="font-bold text-white">Spring Boot Microservices Live Q&A</div>
                <div className="text-slate-400">Alpha Web Engineers Cohort</div>
              </div>
            </div>
            <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 font-bold rounded-lg">Today &bull; 4:00 PM</span>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-emerald-400" />
              <div>
                <div className="font-bold text-white">Data Science Project Review</div>
                <div className="text-slate-400">Data Analytics Squad 2026</div>
              </div>
            </div>
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 font-bold rounded-lg">Tomorrow &bull; 2:30 PM</span>
          </div>
        </div>
      </div>
    </div>
  );
};
