import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import { Search, Plus, Edit2, Trash2, Eye, EyeOff, BookOpen, Layers, DollarSign, Award } from 'lucide-react';

export const CourseManagementView = () => {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Development');
  const [level, setLevel] = useState('Beginner to Advanced');
  const [instructorId, setInstructorId] = useState(2);
  const [instructorName, setInstructorName] = useState('Dr. Sarah Jenkins');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [syllabus, setSyllabus] = useState('');
  const [price, setPrice] = useState(199.99);
  const [creditPoints, setCreditPoints] = useState(200);

  const [editCourse, setEditCourse] = useState(null);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    const data = await apiService.getCourses();
    setCourses(data);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    await apiService.createCourse({
      title,
      description,
      category,
      level,
      instructorId: Number(instructorId),
      instructorName,
      thumbnailUrl: thumbnailUrl || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
      syllabus,
      price: Number(price),
      creditPoints: Number(creditPoints),
      isPublished: true
    });
    setShowAddModal(false);
    resetForm();
    loadCourses();
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editCourse) return;
    await apiService.updateCourse(editCourse.id, editCourse);
    setEditCourse(null);
    loadCourses();
  };

  const handleDeleteCourse = async (id) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    await apiService.deleteCourse(id);
    loadCourses();
  };

  const handleTogglePublish = async (id) => {
    await apiService.toggleCoursePublish(id);
    loadCourses();
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCategory('Development');
    setLevel('Beginner to Advanced');
    setThumbnailUrl('');
    setSyllabus('');
    setPrice(199.99);
    setCreditPoints(200);
  };

  const filteredCourses = courses.filter((c) => {
    const matchesSearch = c.title?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'ALL' || c.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">Course Management</h2>
          <p className="text-xs text-slate-400 mt-1">Catalog builder, pricing, syllabus allocation, and publishing</p>
        </div>

        <button
          onClick={() => { resetForm(); setShowAddModal(true); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-indigo-600/30 transition-all"
        >
          <Plus className="w-4 h-4" /> Add Course
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by course title..."
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300"
        >
          <option value="ALL">All Categories</option>
          <option value="Development">Development</option>
          <option value="Data Science">Data Science</option>
          <option value="Design">Design</option>
        </select>
      </div>

      {/* Course Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((c) => (
          <div key={c.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between group">
            <div>
              <div className="h-44 bg-slate-950 relative overflow-hidden">
                <img
                  src={c.thumbnailUrl || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80'}
                  alt={c.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-indigo-300 text-[10px] font-bold border border-indigo-500/30">
                    {c.category}
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border backdrop-blur-md ${
                    c.isPublished ? 'bg-emerald-900/80 text-emerald-300 border-emerald-500/40' : 'bg-slate-900/80 text-slate-400 border-slate-700'
                  }`}>
                    {c.isPublished ? 'Published' : 'Draft'}
                  </span>
                </div>
              </div>

              <div className="p-6 space-y-3">
                <h3 className="font-bold text-base text-white line-clamp-1">{c.title}</h3>
                <p className="text-xs text-slate-400 line-clamp-2">{c.description}</p>
                {c.syllabus && (
                  <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-300">
                    <span className="font-bold text-indigo-400 block mb-0.5">Syllabus Overview:</span>
                    <p className="whitespace-pre-line line-clamp-3 text-slate-400">{c.syllabus}</p>
                  </div>
                )}
                <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-800">
                  <span>Instructor: <strong className="text-slate-200">{c.instructorName}</strong></span>
                  <span className="text-amber-400 font-bold flex items-center gap-1"><Award className="w-3.5 h-3.5" /> {c.creditPoints} pts</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-950/60 border-t border-slate-800 flex items-center justify-between">
              <div className="font-extrabold text-sm text-indigo-400">${c.price}</div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEditCourse({ ...c })}
                  className="p-2 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/20"
                  title="Edit Course"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleTogglePublish(c.id)}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1"
                >
                  {c.isPublished ? <EyeOff className="w-3.5 h-3.5 text-amber-400" /> : <Eye className="w-3.5 h-3.5 text-emerald-400" />}
                </button>
                <button
                  onClick={() => handleDeleteCourse(c.id)}
                  className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20"
                  title="Delete Course"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Course Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-8 text-white max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Create New Course</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Course Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Advanced Cloud Microservices"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
                <textarea
                  required
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Syllabus Breakdown</label>
                <textarea
                  rows={3}
                  value={syllabus}
                  onChange={(e) => setSyllabus(e.target.value)}
                  placeholder="Module 1: Introduction...&#10;Module 2: Advanced APIs..."
                  className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200"
                  >
                    <option value="Development">Development</option>
                    <option value="Data Science">Data Science</option>
                    <option value="Design">Design</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Level</label>
                  <input
                    type="text"
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Credit Points</label>
                  <input
                    type="number"
                    value={creditPoints}
                    onChange={(e) => setCreditPoints(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Thumbnail Image URL</label>
                <input
                  type="text"
                  value={thumbnailUrl}
                  onChange={(e) => setThumbnailUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm"
                />
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
                  Save Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Course Modal */}
      {editCourse && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-8 text-white max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Edit Course</h3>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Course Title</label>
                <input
                  type="text"
                  required
                  value={editCourse.title || ''}
                  onChange={(e) => setEditCourse({ ...editCourse, title: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
                <textarea
                  required
                  rows={2}
                  value={editCourse.description || ''}
                  onChange={(e) => setEditCourse({ ...editCourse, description: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Syllabus Breakdown</label>
                <textarea
                  rows={3}
                  value={editCourse.syllabus || ''}
                  onChange={(e) => setEditCourse({ ...editCourse, syllabus: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                  <select
                    value={editCourse.category || 'Development'}
                    onChange={(e) => setEditCourse({ ...editCourse, category: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200"
                  >
                    <option value="Development">Development</option>
                    <option value="Data Science">Data Science</option>
                    <option value="Design">Design</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Level</label>
                  <input
                    type="text"
                    value={editCourse.level || ''}
                    onChange={(e) => setEditCourse({ ...editCourse, level: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editCourse.price || 0}
                    onChange={(e) => setEditCourse({ ...editCourse, price: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Credit Points</label>
                  <input
                    type="number"
                    value={editCourse.creditPoints || 0}
                    onChange={(e) => setEditCourse({ ...editCourse, creditPoints: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Thumbnail Image URL</label>
                <input
                  type="text"
                  value={editCourse.thumbnailUrl || ''}
                  onChange={(e) => setEditCourse({ ...editCourse, thumbnailUrl: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditCourse(null)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-xl text-xs"
                >
                  Update Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
