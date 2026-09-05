import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import { Search, BookOpen, Award, CheckCircle, ArrowRight } from 'lucide-react';

export const CourseCatalogView = () => {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('ALL');
  const [enrolledIds, setEnrolledIds] = useState([1, 2]);

  useEffect(() => {
    loadCatalog();
  }, []);

  const loadCatalog = async () => {
    const data = await apiService.getCourses();
    setCourses(data.filter(c => c.isPublished));
  };

  const handleEnroll = (courseId) => {
    if (enrolledIds.includes(courseId)) return;
    setEnrolledIds(prev => [...prev, courseId]);
    alert('Successfully enrolled in course!');
  };

  const filtered = courses.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase());
    const matchesCat = category === 'ALL' || c.category === category;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="p-8 space-y-6">
      <div>
        <h2 className="text-2xl font-black text-white tracking-tight">Course Catalog & Explorer</h2>
        <p className="text-xs text-slate-400 mt-1">Discover expert-led courses, review syllabi, and enroll with 1-click</p>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search catalog by title..."
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200"
          />
        </div>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300"
        >
          <option value="ALL">All Categories</option>
          <option value="Development">Development</option>
          <option value="Data Science">Data Science</option>
          <option value="Design">Design</option>
        </select>
      </div>

      {/* Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(c => {
          const isEnrolled = enrolledIds.includes(c.id);
          return (
            <div key={c.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between group">
              <div>
                <div className="h-44 bg-slate-950 relative overflow-hidden">
                  <img src={c.thumbnailUrl} alt={c.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-indigo-300 text-[10px] font-bold border border-indigo-500/30">
                      {c.category}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="font-bold text-base text-white mb-2 line-clamp-1">{c.title}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2 mb-4">{c.description}</p>
                  <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-800">
                    <span>Instructor: <strong className="text-slate-200">{c.instructorName}</strong></span>
                    <span className="text-amber-400 font-bold flex items-center gap-1"><Award className="w-3.5 h-3.5" /> {c.creditPoints} pts</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-950/60 border-t border-slate-800 flex items-center justify-between">
                <div className="font-extrabold text-sm text-indigo-400">${c.price}</div>
                {isEnrolled ? (
                  <span className="flex items-center gap-1 text-xs text-emerald-400 font-bold px-3 py-1.5 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                    <CheckCircle className="w-4 h-4" /> Enrolled
                  </span>
                ) : (
                  <button
                    onClick={() => handleEnroll(c.id)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl text-xs shadow-lg shadow-indigo-600/30 hover:scale-105 transition-all"
                  >
                    Enroll Now <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
