import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Shield, GraduationCap, Briefcase, Bell } from 'lucide-react';

export const Navbar = ({ activeView, setActiveView }) => {
  const { currentUser, userRole, logout } = useAuth();

  const getRoleBadge = () => {
    switch (userRole) {
      case 'ADMIN':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30"><Shield className="w-3.5 h-3.5" /> Admin Portal</span>;
      case 'STAFF':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"><Briefcase className="w-3.5 h-3.5" /> Staff (Instructor)</span>;
      case 'STUDENT':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30"><GraduationCap className="w-3.5 h-3.5" /> Student Portal</span>;
      default:
        return null;
    }
  };

  return (
    <header className="h-16 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-white flex items-center justify-between px-6 sticky top-0 z-40">
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveView('dashboard')}>
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/30">
          LMS
        </div>
        <div>
          <h1 className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            AuraLMS Platform
          </h1>
          <p className="text-[10px] text-slate-400 font-medium">Enterprise Learning Management</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {getRoleBadge()}

        {currentUser ? (
          <div className="flex items-center gap-3 pl-4 border-l border-slate-800">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-semibold text-slate-100">{currentUser.name}</div>
              <div className="text-xs text-slate-400">{currentUser.email}</div>
            </div>
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-500 flex items-center justify-center font-bold text-white uppercase text-sm border-2 border-slate-700 shadow-sm">
              {currentUser.name ? currentUser.name.charAt(0) : 'U'}
            </div>
            <button
              onClick={logout}
              title="Logout"
              className="p-2 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-slate-700 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveView('landing')}
              className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-all"
            >
              Select Portal Login
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
