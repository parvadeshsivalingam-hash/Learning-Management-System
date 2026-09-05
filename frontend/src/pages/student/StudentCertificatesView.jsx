import React, { useState } from 'react';
import { CertificateTemplate } from '../../components/CertificateTemplate';
import { Award, Download, Eye, ShieldCheck } from 'lucide-react';

export const StudentCertificatesView = () => {
  const [selectedCert, setSelectedCert] = useState(null);

  const certificates = [
    {
      id: 1,
      studentName: 'Alex Rivera',
      courseTitle: 'Data Science & Machine Learning Fundamentals',
      certificateCode: 'LMS-CERT-2026-88492',
      issueDate: '2026-08-10T14:30:00'
    }
  ];

  return (
    <div className="p-8 space-y-6">
      <div>
        <h2 className="text-2xl font-black text-white tracking-tight">Earned Official Certificates</h2>
        <p className="text-xs text-slate-400 mt-1">Download and verify your accredited course completion certificates</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {certificates.map((cert) => (
          <div key={cert.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div>
                <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30 inline-flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Accredited Certificate
                </span>
                <h3 className="text-lg font-bold text-white mt-3">{cert.courseTitle}</h3>
                <p className="text-xs text-slate-400 mt-0.5">Issued to: <strong className="text-slate-200">{cert.studentName}</strong></p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Award className="w-6 h-6" />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Code: <strong className="text-amber-400">{cert.certificateCode}</strong></span>
              <span className="text-slate-500">{new Date(cert.issueDate).toLocaleDateString()}</span>
            </div>

            <button
              onClick={() => setSelectedCert(cert)}
              className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all"
            >
              <Eye className="w-4 h-4" /> View & Download PDF Certificate
            </button>
          </div>
        ))}
      </div>

      {selectedCert && (
        <CertificateTemplate certificate={selectedCert} onClose={() => setSelectedCert(null)} />
      )}
    </div>
  );
};
