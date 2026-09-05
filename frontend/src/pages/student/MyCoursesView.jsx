import React, { useState } from 'react';
import { BookOpen, PlayCircle, CheckCircle, Award, Send } from 'lucide-react';

export const MyCoursesView = () => {
  const [activeLessonModal, setActiveLessonModal] = useState(null);
  const [submissionText, setSubmissionText] = useState('');
  const [submittedMsg, setSubmittedMsg] = useState(null);

  const myCourses = [
    {
      id: 1,
      title: 'Full-Stack Web Development Bootcamp',
      instructor: 'Dr. Sarah Jenkins',
      progress: 75,
      thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
      lessons: [
        { id: 1, title: 'Module 1: Introduction to Web Architecture & HTML5', completed: true, videoUrl: 'https://www.youtube.com/embed/gQojMIhELvM' },
        { id: 2, title: 'Module 2: Advanced CSS Grid & Flexbox Micro-animations', completed: true, videoUrl: 'https://www.youtube.com/embed/1Rs2ND1ryYc' },
        { id: 3, title: 'Module 3: Spring Boot REST API Architecture', completed: false, videoUrl: 'https://www.youtube.com/embed/vtPkZShrvXQ' }
      ]
    },
    {
      id: 2,
      title: 'Data Science & Machine Learning Fundamentals',
      instructor: 'Prof. Michael Chang',
      progress: 100,
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80',
      lessons: [
        { id: 1, title: 'Module 1: Data Analytics Foundations', completed: true, videoUrl: 'https://www.youtube.com/embed/r-uOLxNrNk8' },
        { id: 2, title: 'Module 2: Supervised Machine Learning Algorithms', completed: true, videoUrl: 'https://www.youtube.com/embed/i_LwzRVP7bg' }
      ]
    }
  ];

  const handleAssignmentSubmit = (e) => {
    e.preventDefault();
    setSubmittedMsg('Assignment submission sent to instructor! +75 credit points awarded.');
    setSubmissionText('');
  };

  return (
    <div className="p-8 space-y-6">
      <div>
        <h2 className="text-2xl font-black text-white tracking-tight">My Courses & Learning Player</h2>
        <p className="text-xs text-slate-400 mt-1">Access video lessons, track completion, and submit assignments</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {myCourses.map(c => (
          <div key={c.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between">
            <div>
              <div className="h-44 bg-slate-950 relative">
                <img src={c.thumbnail} alt={c.title} className="w-full h-full object-cover" />
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <h3 className="font-bold text-lg text-white">{c.title}</h3>
                  <p className="text-xs text-slate-400">Instructor: {c.instructor}</p>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-300">Course Progress</span>
                    <span className={c.progress === 100 ? 'text-emerald-400' : 'text-indigo-400'}>{c.progress}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className={`h-full rounded-full ${c.progress === 100 ? 'bg-emerald-500' : 'bg-gradient-to-r from-indigo-500 to-purple-500'}`}
                      style={{ width: `${c.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-950/60 border-t border-slate-800 flex justify-between items-center">
              <span className="text-xs text-slate-400">{c.lessons.length} Modules</span>
              <button
                onClick={() => setActiveLessonModal(c)}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-indigo-600/30"
              >
                <PlayCircle className="w-4 h-4" /> Continue Learning
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Lesson Reader & Player Modal */}
      {activeLessonModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-3xl w-full p-8 text-white space-y-6 relative shadow-2xl">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">Interactive Course Viewer</span>
                <h3 className="text-2xl font-bold">{activeLessonModal.title}</h3>
              </div>
              <button
                onClick={() => { setActiveLessonModal(null); setSubmittedMsg(null); }}
                className="px-3 py-1.5 bg-slate-800 text-slate-400 hover:text-white rounded-xl text-xs"
              >
                Close
              </button>
            </div>

            {/* Video Player */}
            <div className="aspect-video bg-black rounded-2xl overflow-hidden border border-slate-800 shadow-inner">
              <iframe
                src={activeLessonModal.lessons[0]?.videoUrl || 'https://www.youtube.com/embed/gQojMIhELvM'}
                title="Lesson Video"
                className="w-full h-full border-0"
                allowFullScreen
              />
            </div>

            {/* Modules Checkbox List */}
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-white">Course Modules</h4>
              {activeLessonModal.lessons.map(l => (
                <div key={l.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <CheckCircle className={`w-4 h-4 ${l.completed ? 'text-emerald-400' : 'text-slate-600'}`} />
                    <span className={l.completed ? 'text-slate-200 line-through' : 'text-white font-semibold'}>{l.title}</span>
                  </div>
                  <span className="text-[10px] text-indigo-400 font-bold">+50 pts</span>
                </div>
              ))}
            </div>

            {/* Submit Assignment Box */}
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-slate-200">Submit Assignment Solution</h4>
              {submittedMsg ? (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs rounded-xl font-semibold">
                  {submittedMsg}
                </div>
              ) : (
                <form onSubmit={handleAssignmentSubmit} className="space-y-3">
                  <textarea
                    required
                    rows={2}
                    value={submissionText}
                    onChange={(e) => setSubmissionText(e.target.value)}
                    placeholder="Paste repository URL or solution text..."
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow"
                  >
                    <Send className="w-3.5 h-3.5" /> Submit Assignment Solution
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
