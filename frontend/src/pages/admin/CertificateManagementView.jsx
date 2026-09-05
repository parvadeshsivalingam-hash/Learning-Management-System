import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import { CertificateTemplate } from '../../components/CertificateTemplate';
import { Award, Plus, Eye, Download, ShieldCheck } from 'lucide-react';

export const CertificateManagementView = () => {
  const [certificates, setCertificates] = useState([]);
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCert, setSelectedCert] = useState(null);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [activeSection, setActiveSection] = useState('all'); // 'all', 'individual'

  // Form states for individual generator
  const [studentId, setStudentId] = useState('');
  const [courseId, setCourseId] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const certs = await apiService.getCertificates();
    setCertificates(certs);

    const uData = await apiService.getUsers();
    const stds = uData.filter(u => u.role === 'STUDENT');
    setUsers(stds);

    const cData = await apiService.getCourses();
    setCourses(cData);

    if (stds.length > 0) setStudentId(stds[0].id);
    if (cData.length > 0) setCourseId(cData[0].id);
  };

  const handleIssue = async (e) => {
    e.preventDefault();
    if (!studentId || !courseId) return;
    const newCert = await apiService.issueCertificate(studentId, courseId);
    setShowIssueModal(false);
    loadData();
    setSelectedCert(newCert);
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">Certificate Engine</h2>
          <p className="text-xs text-slate-400 mt-1">Bulk view, individual course certificate generation, and official PDF downloads</p>
        </div>

        <button
          onClick={() => setShowIssueModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold rounded-xl text-xs shadow-lg shadow-amber-500/20 transition-all"
        >
          <Plus className="w-4 h-4" /> Issue Individual Certificate
        </button>
      </div>

      {/* Section Tabs Header */}
      <div className="flex items-center gap-2 p-1 bg-slate-900 border border-slate-800 rounded-2xl w-fit">
        <button
          onClick={() => setActiveSection('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSection === 'all' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
          }`}
        >
          (1) All Course Certificates Registry
        </button>
        <button
          onClick={() => setActiveSection('individual')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSection === 'individual' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
          }`}
        >
          (2) Individual Student Generator & PDF Download
        </button>
      </div>

      {/* SECTION 1: ALL COURSE CERTIFICATES REGISTRY */}
      {activeSection === 'all' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white">Issued Course Certificates Registry ({certificates.length})</h3>
            </div>
            <span className="text-xs text-slate-400">Official System Verification Archive</span>
          </div>

          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-6 py-4">Student Name</th>
                <th className="px-6 py-4">Course Title</th>
                <th className="px-6 py-4">Verification Serial</th>
                <th className="px-6 py-4">Issue Timestamp</th>
                <th className="px-6 py-4 text-right">Certificate Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {certificates.map((cert) => (
                <tr key={cert.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-white">
                    {cert.studentName}
                  </td>
                  <td className="px-6 py-4 text-indigo-300 font-semibold">
                    {cert.courseTitle}
                  </td>
                  <td className="px-6 py-4 font-mono text-amber-400 font-bold">
                    {cert.certificateCode}
                  </td>
                  <td className="px-6 py-4 text-slate-400">
                    {new Date(cert.issueDate || Date.now()).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => setSelectedCert(cert)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-lg font-semibold text-xs transition-colors ml-auto border border-amber-500/20"
                    >
                      <Eye className="w-3.5 h-3.5" /> View & Download PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* SECTION 2: INDIVIDUAL COURSE CERTIFICATE GENERATOR PER STUDENT */}
      {activeSection === 'individual' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-400" /> Individual Certificate Generator
            </h3>
            <p className="text-xs text-slate-400">Select an active student and completed course to issue a customized certificate credential.</p>

            <form onSubmit={handleIssue} className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Target Student</label>
                <select
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200"
                >
                  {users.map(u => (
                    <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Target Course</label>
                <select
                  value={courseId}
                  onChange={(e) => setCourseId(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200"
                >
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold rounded-xl text-xs shadow-lg shadow-amber-500/20"
              >
                Generate & Issue Certificate
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white">Student Individual Certificate Quick-Download Cards</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {certificates.map(cert => (
                <div key={cert.id} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                  <div className="text-xs text-slate-400">Student: <strong className="text-white">{cert.studentName}</strong></div>
                  <div className="text-xs font-bold text-indigo-300 line-clamp-1">{cert.courseTitle}</div>
                  <div className="text-[10px] font-mono text-amber-400">{cert.certificateCode}</div>
                  <button
                    onClick={() => setSelectedCert(cert)}
                    className="w-full mt-2 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold rounded-lg text-xs flex items-center justify-center gap-1 border border-amber-500/20"
                  >
                    <Download className="w-3 h-3" /> Download PDF Certificate
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Issue Modal */}
      {showIssueModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-8 text-white">
            <h3 className="text-xl font-bold mb-4">Issue Certificate</h3>
            <form onSubmit={handleIssue} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Select Student</label>
                <select
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200"
                >
                  {users.map(u => (
                    <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Select Course</label>
                <select
                  value={courseId}
                  onChange={(e) => setCourseId(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200"
                >
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowIssueModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs"
                >
                  Generate Certificate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Certificate Modal Viewer */}
      {selectedCert && (
        <CertificateTemplate certificate={selectedCert} onClose={() => setSelectedCert(null)} />
      )}
    </div>
  );
};
