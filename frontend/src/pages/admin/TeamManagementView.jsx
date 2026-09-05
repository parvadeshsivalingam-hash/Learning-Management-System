import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import { UserCheck, Plus, Users, BookOpen, Trash2 } from 'lucide-react';

export const TeamManagementView = () => {
  const [teams, setTeams] = useState([]);
  const [courses, setCourses] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [instructorId, setInstructorId] = useState(2);
  const [courseId, setCourseId] = useState(1);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const teamData = await apiService.getTeams();
    setTeams(teamData);

    const courseData = await apiService.getCourses();
    setCourses(courseData);

    const userData = await apiService.getUsers();
    setInstructors(userData.filter(u => u.role === 'STAFF'));
    const stds = userData.filter(u => u.role === 'STUDENT');
    setStudents(stds);
    if (stds.length > 0) setSelectedStudentIds([stds[0].id]);
  };

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    await apiService.createTeam({
      name,
      description,
      instructorId,
      courseId,
      studentIds: selectedStudentIds
    });
    setShowAddModal(false);
    setName('');
    setDescription('');
    loadData();
  };

  const handleDeleteTeam = async (id) => {
    if (!window.confirm('Are you sure you want to delete this team?')) return;
    await apiService.deleteTeam(id);
    loadData();
  };

  const toggleStudentSelect = (id) => {
    if (selectedStudentIds.includes(id)) {
      setSelectedStudentIds(selectedStudentIds.filter(s => s !== id));
    } else {
      setSelectedStudentIds([...selectedStudentIds, id]);
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">Team & Cohort Management</h2>
          <p className="text-xs text-slate-400 mt-1">Form batches, assign staff instructors, and manage memberships</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-indigo-600/30 transition-all"
        >
          <Plus className="w-4 h-4" /> Create Team / Cohort
        </button>
      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {teams.map((tItem, idx) => {
          const t = tItem.team || tItem;
          return (
            <div key={t.id || idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 relative">
              <div className="flex justify-between items-start">
                <div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 text-[10px] font-bold border border-emerald-500/20">
                    Active Cohort
                  </span>
                  <h3 className="text-lg font-bold text-white mt-2">{t.name}</h3>
                  <p className="text-xs text-slate-400 mt-1">{t.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  {t.id && (
                    <button
                      onClick={() => handleDeleteTeam(t.id)}
                      className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20"
                      title="Delete Team"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400">Assigned Instructor:</span>
                  <p className="font-semibold text-slate-200 mt-0.5">{t.instructorName || 'Dr. Sarah Jenkins'}</p>
                </div>
                <div>
                  <span className="text-slate-400">Linked Course:</span>
                  <p className="font-semibold text-indigo-300 mt-0.5 line-clamp-1">{t.courseTitle || 'Bootcamp'}</p>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2 text-xs text-slate-400">
                <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5 text-slate-500" /> {tItem.memberCount || 2} Enrolled Students</span>
                <span className="text-emerald-400 font-bold">92% Engagement Rate</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Team Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-8 text-white max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Form New Team / Cohort</h3>
            <form onSubmit={handleCreateTeam} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Team Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Beta Data Science Squad"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Cohort goals..."
                  className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Assign Staff Instructor</label>
                <select
                  value={instructorId}
                  onChange={(e) => setInstructorId(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200"
                >
                  {instructors.map(inst => (
                    <option key={inst.id} value={inst.id}>{inst.name} ({inst.email})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Linked Course</label>
                <select
                  value={courseId}
                  onChange={(e) => setCourseId(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200"
                >
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Assign Students to Cohort</label>
                <div className="space-y-1.5 max-h-36 overflow-y-auto p-3 bg-slate-950 rounded-xl border border-slate-800">
                  {students.map(st => (
                    <label key={st.id} className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedStudentIds.includes(st.id)}
                        onChange={() => toggleStudentSelect(st.id)}
                        className="rounded border-slate-800 bg-slate-900 text-indigo-600 focus:ring-0"
                      />
                      <span>{st.name} ({st.email})</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-xl text-xs"
                >
                  Create Team
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
