import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import { BookOpen, Plus, Video, FileText, CheckCircle } from 'lucide-react';

export const StaffCoursesView = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showAddLessonModal, setShowAddLessonModal] = useState(false);
  const [showAddAssignmentModal, setShowAddAssignmentModal] = useState(false);

  // Lesson form
  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonContent, setLessonContent] = useState('');
  const [videoUrl, setVideoUrl] = useState('');

  // Assignment form
  const [assignmentTitle, setAssignmentTitle] = useState('');
  const [assignmentDesc, setAssignmentDesc] = useState('');

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    const data = await apiService.getCourses();
    setCourses(data);
    if (data.length > 0) setSelectedCourse(data[0]);
  };

  const handleAddLesson = (e) => {
    e.preventDefault();
    alert(`Lesson "${lessonTitle}" added to ${selectedCourse.title}!`);
    setShowAddLessonModal(false);
    setLessonTitle('');
    setLessonContent('');
    setVideoUrl('');
  };

  const handleAddAssignment = (e) => {
    e.preventDefault();
    alert(`Assignment "${assignmentTitle}" created!`);
    setShowAddAssignmentModal(false);
    setAssignmentTitle('');
    setAssignmentDesc('');
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">Course Content & Syllabus Builder</h2>
          <p className="text-xs text-slate-400 mt-1">Add modules, video lessons, reading materials, and course assignments</p>
        </div>

        {selectedCourse && (
          <div className="flex gap-3">
            <button
              onClick={() => setShowAddLessonModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-indigo-600/20"
            >
              <Plus className="w-4 h-4" /> Add Lesson Module
            </button>

            <button
              onClick={() => setShowAddAssignmentModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-emerald-600/20"
            >
              <Plus className="w-4 h-4" /> Create Assignment
            </button>
          </div>
        )}
      </div>

      {/* Select Course Switcher */}
      <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-2xl p-4 overflow-x-auto">
        {courses.map(c => (
          <button
            key={c.id}
            onClick={() => setSelectedCourse(c)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCourse?.id === c.id
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-slate-950 text-slate-400 hover:text-white'
            }`}
          >
            {c.title}
          </button>
        ))}
      </div>

      {/* Course Detail Builder Frame */}
      {selectedCourse && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div>
            <span className="px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold border border-indigo-500/30">
              {selectedCourse.category}
            </span>
            <h3 className="text-xl font-bold text-white mt-2">{selectedCourse.title}</h3>
            <p className="text-xs text-slate-400 mt-1">{selectedCourse.description}</p>
          </div>

          {/* Lessons List */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Video className="w-4 h-4 text-indigo-400" /> Published Lesson Modules
            </h4>

            <div className="space-y-3">
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
                <div>
                  <div className="font-bold text-slate-200">Module 1: Introduction to Web Architecture & HTML5</div>
                  <div className="text-slate-400 text-[11px] mt-0.5">Video Lesson &bull; 45 mins</div>
                </div>
                <span className="px-2 py-1 bg-emerald-500/20 text-emerald-300 font-bold rounded">Active</span>
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
                <div>
                  <div className="font-bold text-slate-200">Module 2: Advanced CSS Grid & Flexbox Micro-animations</div>
                  <div className="text-slate-400 text-[11px] mt-0.5">Video Lesson &bull; 60 mins</div>
                </div>
                <span className="px-2 py-1 bg-emerald-500/20 text-emerald-300 font-bold rounded">Active</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Lesson Modal */}
      {showAddLessonModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-8 text-white">
            <h3 className="text-xl font-bold mb-4">Add Lesson Module</h3>
            <form onSubmit={handleAddLesson} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Lesson Title</label>
                <input
                  type="text"
                  required
                  value={lessonTitle}
                  onChange={(e) => setLessonTitle(e.target.value)}
                  placeholder="e.g. Module 4: REST API Design"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Video Embed URL</label>
                <input
                  type="text"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://www.youtube.com/embed/..."
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Content Text / Instructions</label>
                <textarea
                  rows={3}
                  value={lessonContent}
                  onChange={(e) => setLessonContent(e.target.value)}
                  placeholder="Detailed lesson content..."
                  className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddLessonModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-xl text-xs"
                >
                  Save Lesson
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Assignment Modal */}
      {showAddAssignmentModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-8 text-white">
            <h3 className="text-xl font-bold mb-4">Create Assignment</h3>
            <form onSubmit={handleAddAssignment} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Assignment Title</label>
                <input
                  type="text"
                  required
                  value={assignmentTitle}
                  onChange={(e) => setAssignmentTitle(e.target.value)}
                  placeholder="e.g. Build Spring Boot REST Controllers"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Instructions</label>
                <textarea
                  rows={3}
                  value={assignmentDesc}
                  onChange={(e) => setAssignmentDesc(e.target.value)}
                  placeholder="Assignment guidelines..."
                  className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddAssignmentModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white font-bold rounded-xl text-xs"
                >
                  Create Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
