import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import { CheckSquare, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';

export const ApprovalDashboardView = () => {
  const [approvals, setApprovals] = useState([]);
  const [typeFilter, setTypeFilter] = useState('ALL'); // 'ALL', 'REGISTRATION', 'COURSE_SUBMISSION', 'CERTIFICATE_REQUEST'
  const [activeModalItem, setActiveModalItem] = useState(null);
  const [actionType, setActionType] = useState('APPROVE');
  const [reason, setReason] = useState('');

  useEffect(() => {
    loadApprovals();
  }, []);

  const loadApprovals = async () => {
    const data = await apiService.getApprovals();
    setApprovals(data);
  };

  const handleActionSubmit = async (e) => {
    e.preventDefault();
    if (!activeModalItem) return;
    await apiService.handleApprovalAction(activeModalItem.id, actionType, reason);
    setActiveModalItem(null);
    setReason('');
    loadApprovals();
  };

  const filteredApprovals = approvals.filter(a => {
    if (typeFilter === 'ALL') return true;
    return a.type === typeFilter;
  });

  return (
    <div className="p-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">Admin Approval Dashboard</h2>
          <p className="text-xs text-slate-400 mt-1">Central sign-off queue for pending registrations, course submissions, and certificate requests</p>
        </div>

        {/* Type Filter Sub-Tabs */}
        <div className="flex items-center gap-2 p-1 bg-slate-900 border border-slate-800 rounded-2xl">
          <button
            onClick={() => setTypeFilter('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${typeFilter === 'ALL' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
          >
            All Requests
          </button>
          <button
            onClick={() => setTypeFilter('REGISTRATION')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${typeFilter === 'REGISTRATION' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
          >
            Registrations
          </button>
          <button
            onClick={() => setTypeFilter('COURSE_SUBMISSION')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${typeFilter === 'COURSE_SUBMISSION' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
          >
            Course Submissions
          </button>
          <button
            onClick={() => setTypeFilter('CERTIFICATE_REQUEST')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${typeFilter === 'CERTIFICATE_REQUEST' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
          >
            Certificate Requests
          </button>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white">Pending Sign-off Queue</h3>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
            {filteredApprovals.filter(a => a.status === 'PENDING').length} Pending Sign-offs
          </span>
        </div>

        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
            <tr>
              <th className="px-6 py-4">Requester</th>
              <th className="px-6 py-4">Role / Scope</th>
              <th className="px-6 py-4">Approval Category</th>
              <th className="px-6 py-4">Target Title</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filteredApprovals.map((req) => (
              <tr key={req.id} className="hover:bg-slate-800/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-bold text-white">{req.requesterName}</div>
                  <div className="text-[11px] text-slate-400">{req.requesterEmail}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                    req.requesterRole === 'STAFF' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-blue-500/20 text-blue-300'
                  }`}>
                    {req.requesterRole}
                  </span>
                </td>
                <td className="px-6 py-4 font-semibold text-slate-300">
                  <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[10px] font-mono">
                    {req.type}
                  </span>
                </td>
                <td className="px-6 py-4 text-indigo-300 font-semibold max-w-xs truncate">
                  {req.targetTitle || 'Account Activation'}
                </td>
                <td className="px-6 py-4">
                  {req.status === 'PENDING' && <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 font-bold text-[10px]">PENDING</span>}
                  {req.status === 'APPROVED' && <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">APPROVED</span>}
                  {req.status === 'REJECTED' && <span className="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 font-bold text-[10px]">REJECTED</span>}
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  {req.status === 'PENDING' ? (
                    <>
                      <button
                        onClick={() => { setActiveModalItem(req); setActionType('APPROVE'); setReason(''); }}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-xs shadow"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => { setActiveModalItem(req); setActionType('REJECT'); setReason(''); }}
                        className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-bold text-xs shadow"
                      >
                        Reject
                      </button>
                    </>
                  ) : (
                    <span className="text-[11px] text-slate-500 italic">Completed</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Action Dialog Modal */}
      {activeModalItem && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-8 text-white">
            <h3 className="text-xl font-bold mb-2">
              {actionType === 'APPROVE' ? 'Approve Registration' : 'Reject Registration'}
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Sign-off for <strong>{activeModalItem.requesterName}</strong> ({activeModalItem.requesterRole})
            </p>

            <form onSubmit={handleActionSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Optional Reason / Comment</label>
                <textarea
                  rows={3}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder={actionType === 'APPROVE' ? 'Welcome to the platform!' : 'Registration criteria not met...'}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveModalItem(null)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 text-white font-bold rounded-xl text-xs ${
                    actionType === 'APPROVE' ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-rose-600 hover:bg-rose-500'
                  }`}
                >
                  Confirm {actionType}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
