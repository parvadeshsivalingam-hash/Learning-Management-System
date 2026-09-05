import React, { useState } from 'react';
import { MessageSquare, Star, Send, CheckCircle } from 'lucide-react';

export const StudentFeedbackView = () => {
  const [rating, setRating] = useState(5);
  const [category, setCategory] = useState('COURSE');
  const [comment, setComment] = useState('');
  const [submittedMsg, setSubmittedMsg] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmittedMsg('Feedback submitted successfully! Thank you for helping improve the platform.');
    setComment('');
  };

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-black text-white tracking-tight">Submit Feedback & Course Review</h2>
        <p className="text-xs text-slate-400 mt-1">Share your learning experience with instructors and platform administrators</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-xl space-y-6">
        {submittedMsg ? (
          <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs text-center space-y-3">
            <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto" />
            <div className="font-bold text-sm">{submittedMsg}</div>
            <button
              onClick={() => setSubmittedMsg(null)}
              className="px-4 py-2 bg-slate-800 text-white rounded-xl font-bold"
            >
              Submit Another Review
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Select Feedback Category</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setCategory('COURSE')}
                  className={`py-2.5 rounded-xl font-bold text-xs border transition-all ${
                    category === 'COURSE'
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30'
                      : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}
                >
                  Course Review
                </button>
                <button
                  type="button"
                  onClick={() => setCategory('PLATFORM')}
                  className={`py-2.5 rounded-xl font-bold text-xs border transition-all ${
                    category === 'PLATFORM'
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30'
                      : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}
                >
                  Platform Feedback
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Overall Star Rating</label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    className="p-1 text-amber-400 transition-transform hover:scale-125"
                  >
                    <Star className={`w-7 h-7 ${star <= rating ? 'fill-amber-400' : 'text-slate-700'}`} />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Your Detailed Feedback</label>
              <textarea
                required
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="What did you like best about the curriculum? Any suggested improvements?"
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all"
            >
              <Send className="w-4 h-4" /> Submit Feedback
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
