import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  UserCheck,
  BarChart3,
  Award,
  MessageSquare,
  CheckSquare,
  FileSpreadsheet,
  GraduationCap,
  Sparkles,
  ClipboardList
} from 'lucide-react';

export const Sidebar = ({ activeTab, setActiveTab }) => {
  const { userRole } = useAuth();

  const adminNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'courses', label: 'Course Management', icon: BookOpen },
    { id: 'teams', label: 'Team Management', icon: UserCheck },
    { id: 'analytics', label: 'System Analytics', icon: BarChart3 },
    { id: 'certificates', label: 'Certificate Engine', icon: Award },
    { id: 'feedback', label: 'Feedback Moderation', icon: MessageSquare },
    { id: 'approvals', label: 'Approval Queue', icon: CheckSquare, badge: 'Queue' }
  ];

  const staffNavItems = [
    { id: 'dashboard', label: 'Instructor Overview', icon: LayoutDashboard },
    { id: 'my-courses', label: 'My Courses & Lessons', icon: BookOpen },
    { id: 'students-teams', label: 'My Students & Teams', icon: Users },
    { id: 'grading', label: 'Submissions & Grading', icon: ClipboardList }
  ];

  const studentNavItems = [
    { id: 'dashboard', label: 'Student Dashboard', icon: LayoutDashboard },
    { id: 'catalog', label: 'Course Catalog', icon: BookOpen },
    { id: 'my-learning', label: 'My Courses & Progress', icon: GraduationCap },
    { id: 'credits', label: 'Credit Points & Perks', icon: Sparkles },
    { id: 'my-certificates', label: 'Earned Certificates', icon: Award },
    { id: 'submit-feedback', label: 'Submit Feedback', icon: MessageSquare }
  ];

  const getNavItems = () => {
    switch (userRole) {
      case 'ADMIN':
        return adminNavItems;
      case 'STAFF':
        return staffNavItems;
      case 'STUDENT':
        return studentNavItems;
      default:
        return [];
    }
  };

  const items = getNavItems();

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 text-slate-300 flex flex-col shrink-0 min-h-[calc(100vh-4rem)]">
      <div className="p-4 uppercase text-[11px] font-bold tracking-wider text-slate-500">
        Navigation Menu
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-semibold shadow-lg shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-4 m-3 rounded-2xl bg-gradient-to-br from-indigo-950/40 to-slate-900 border border-indigo-500/20 text-center">
        <Sparkles className="w-6 h-6 mx-auto text-indigo-400 mb-2" />
        <div className="text-xs font-bold text-slate-200">Aura LMS v2.6</div>
        <div className="text-[10px] text-slate-400 mt-1">Multi-Role Active Session</div>
      </div>
    </aside>
  );
};
