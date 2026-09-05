import React, { useState } from 'react';
import { ClipboardList, CheckCircle, Award, MessageSquare } from 'lucide-react';

export const StaffGradingView = () => {
  const [submissions, setSubmissions] = useState([
    {
      id: 101,
      assignmentTitle: 'Build a RESTful API with Spring Boot',
      studentName: 'Alex Rivera',
      submittedAt: new Date().toISOString(),
      content: 'https://github.com/alex/spring-boot-lms-assignment - Completed controller endpoints, security filters, and unit tests.',
      status: 'SUBMITTED',
      grade: null,
      feedback: ''
    },
    {
      id: 102,
      assignmentTitle: 'UI/UX Figma Design Tokens & Component Library',
      studentName: 'Elena Rostova',
      submittedAt: new Date(Date.now() - 86400000).toISOString(),
      content: 'https://figma.com/@elena/design-tokens-v2 - Complete Dark mode and light mode token mappings.',
      status: 'GRADED',
      grade: 96,
      feedback: 'Outstanding typography hierarchy and smooth accessibility color contrast!'
    }
  ]);

  const [activeGradeId, setActiveGradeId] = useState(null);
  const [gradeInput, setGradeInput] = useState(90);
  const [feedbackInput, setFeedbackInput] = useState('');

  const handleGradeSubmit = (id) => {
    setSubmissions(prev => prev.map(s => {
      if (s.id === id) {
        return {
          ...s,
          status: 'GRADED',
          grade: Number(gradeInput),
          feedback: feedbackInput
        };
      }
      return s;
    }));
    setActiveGradeId(null);
  };

  return (
    <div className="p-8 space-y-6">
      <div>
        <h2 className="text-2xl font-black text-white tracking-tight">Assignment Submissions & Grading Inbox</h2>
        <p className="text-xs text-slate-400 mt-1">Review student submissions, assign numerical grades, and provide feedback</p>
      </div>

      <div className="space-y-4">
        {submissions.map((sub) => (
          <div key={sub.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                  sub.status === 'GRADED' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                }`}>
                  {sub.status}
                </span>
                <h3 className="text-base font-bold text-white mt-2">{sub.assignmentTitle}</h3>
                <p className="text-xs text-slate-400 mt-0.5">Submitted by: <strong className="text-slate-200">{sub.studentName}</strong></p>
              </div>

              {sub.grade !== null && (
                <div className="text-right">
                  <div className="text-xs text-slate-400 uppercase">Assigned Score</div>
                  <div className="text-2xl font-black text-emerald-400">{sub.grade} / 100</div>
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs text-indigo-300 font-mono break-all">
              {sub.content}
            </div>

            {sub.feedback && (
              <div className="p-4 bg-emerald-950/40 rounded-xl border border-emerald-500/20 text-xs text-emerald-300">
                <strong>Instructor Feedback:</strong> {sub.feedback}
              </div>
            )}

            {activeGradeId === sub.id ? (
              <div className="p-4 bg-slate-950 rounded-xl border border-indigo-500/30 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Score (0-100)</label>
                    <input
                      type="number"
                      max={100}
                      min={0}
                      value={gradeInput}
                      onChange={(e) => setGradeInput(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Feedback Comments</label>
                    <input
                      type="text"
                      value={feedbackInput}
                      onChange={(e) => setFeedbackInput(e.target.value)}
                      placeholder="Great work on..."
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setActiveGradeId(null)}
                    className="px-3 py-1.5 bg-slate-800 text-slate-400 rounded-lg text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleGradeSubmit(sub.id)}
                    className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs"
                  >
                    Save Grade & Feedback
                  </button>
                </div>
              </div>
            ) : (
              sub.status === 'SUBMITTED' && (
                <button
                  onClick={() => { setActiveGradeId(sub.id); setGradeInput(90); setFeedbackInput(''); }}
                  className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl text-xs shadow-lg shadow-indigo-600/20"
                >
                  Grade Submission
                </button>
              )
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
