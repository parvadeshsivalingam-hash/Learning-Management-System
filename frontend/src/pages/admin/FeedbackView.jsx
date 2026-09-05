import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import { MessageSquare, Star, Flag, CornerUpLeft, Filter } from 'lucide-react';

export const FeedbackView = () => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [activeRespondId, setActiveRespondId] = useState(null);
  const [responseText, setResponseText] = useState('');

  useEffect(() => {
    loadFeedback();
  }, []);

  const loadFeedback = async () => {
    const data = await apiService.getFeedback();
    setFeedbackList(data);
  };

  const handleRespond = async (id) => {
    if (!responseText) return;
    await apiService.respondFeedback(id, responseText);
    setActiveRespondId(null);
    setResponseText('');
    loadFeedback();
  };

  const filtered = feedbackList.filter(f => {
    if (categoryFilter === 'ALL') return true;
    return f.category === categoryFilter;
  });

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">Student & Staff Feedback</h2>
          <p className="text-xs text-slate-400 mt-1">Review ratings, platform reviews, and post responses</p>
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300"
        >
          <option value="ALL">All Feedback Categories</option>
          <option value="COURSE">Course Reviews</option>
          <option value="PLATFORM">Platform Feedback</option>
        </select>
      </div>

      <div className="space-y-4">
        {filtered.map((fb) => (
          <div key={fb.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-sm">{fb.userName}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-semibold">{fb.userRole}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30">
                    {fb.category}
                  </span>
                </div>
                <div className="text-xs text-indigo-400 font-semibold mt-1">
                  Target: {fb.courseTitle || 'Platform General'}
                </div>
              </div>

              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < (fb.rating || 5) ? 'fill-amber-400' : 'text-slate-700'}`} />
                ))}
              </div>
            </div>

            <p className="text-xs text-slate-300 bg-slate-950 p-4 rounded-xl border border-slate-800 italic">
              "{fb.comment}"
            </p>

            {fb.adminResponse && (
              <div className="pl-4 border-l-2 border-indigo-500 text-xs text-indigo-300 space-y-1">
                <div className="font-bold flex items-center gap-1"><CornerUpLeft className="w-3.5 h-3.5" /> Admin Official Response:</div>
                <p className="text-slate-300">{fb.adminResponse}</p>
              </div>
            )}

            {!fb.adminResponse && (
              <div>
                {activeRespondId === fb.id ? (
                  <div className="mt-3 space-y-2">
                    <textarea
                      rows={2}
                      value={responseText}
                      onChange={(e) => setResponseText(e.target.value)}
                      placeholder="Write official response..."
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setActiveRespondId(null)}
                        className="px-3 py-1 bg-slate-800 text-slate-400 rounded-lg text-xs"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleRespond(fb.id)}
                        className="px-3 py-1 bg-indigo-600 text-white font-bold rounded-lg text-xs"
                      >
                        Submit Response
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => { setActiveRespondId(fb.id); setResponseText(''); }}
                    className="text-xs text-indigo-400 hover:underline font-semibold flex items-center gap-1 pt-1"
                  >
                    <CornerUpLeft className="w-3.5 h-3.5" /> Post Official Response
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
