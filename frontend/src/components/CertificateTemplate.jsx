import React, { useRef } from 'react';
import { Award, Download, CheckCircle2, ShieldCheck } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const CertificateTemplate = ({ certificate, onClose }) => {
  const certRef = useRef(null);

  const handleDownloadPDF = async () => {
    if (!certRef.current) return;
    try {
      const canvas = await html2canvas(certRef.current, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('landscape', 'mm', 'a4');
      const width = pdf.internal.pageSize.getWidth();
      const height = pdf.internal.pageSize.getHeight();
      pdf.addImage(imgData, 'PNG', 0, 0, width, height);
      pdf.save(`${certificate.studentName.replace(/\s+/g, '_')}_Certificate.pdf`);
    } catch (err) {
      console.error('PDF export failed:', err);
      alert('Could not export PDF automatically. Print view is available.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-4xl w-full p-6 text-white shadow-2xl relative">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-bold">Official Course Certificate</h3>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/20 text-xs transition-all"
            >
              <Download className="w-4 h-4" /> Download PDF Certificate
            </button>
            <button
              onClick={onClose}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-400 hover:text-white text-xs"
            >
              Close
            </button>
          </div>
        </div>

        {/* Certificate Printable Canvas Container */}
        <div
          ref={certRef}
          className="bg-slate-950 border-8 border-double border-amber-500/40 rounded-2xl p-10 text-center relative overflow-hidden shadow-inner text-slate-100"
          style={{ backgroundImage: 'radial-gradient(circle at center, #1e1b4b 0%, #090d16 100%)' }}
        >
          {/* Watermark / Seal Background */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
            <Award className="w-96 h-96 text-amber-400" />
          </div>

          <div className="relative z-10">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-400 to-amber-600 p-0.5 shadow-xl shadow-amber-500/30 flex items-center justify-center">
                <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center">
                  <ShieldCheck className="w-8 h-8 text-amber-400" />
                </div>
              </div>
            </div>

            <p className="text-xs font-semibold tracking-widest text-amber-400 uppercase mb-2">
              Aura Learning Management Academy
            </p>
            <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100 bg-clip-text text-transparent mb-4">
              CERTIFICATE OF COMPLETION
            </h2>

            <p className="text-sm text-slate-300 italic mb-4">This is to officially certify that</p>

            <h1 className="text-3xl font-black text-white tracking-wide border-b-2 border-amber-500/40 inline-block px-8 py-2 mb-6">
              {certificate.studentName || 'Student Name'}
            </h1>

            <p className="text-sm text-slate-300 max-w-xl mx-auto mb-6">
              has successfully fulfilled all curriculum requirements, passed comprehensive assessments, and demonstrated mastery in
            </p>

            <div className="text-xl font-bold text-indigo-300 bg-indigo-950/60 border border-indigo-500/30 rounded-xl py-3 px-6 inline-block max-w-2xl mb-8 shadow-lg">
              {certificate.courseTitle || 'Course Title'}
            </div>

            <div className="grid grid-cols-2 gap-8 max-w-lg mx-auto pt-6 border-t border-slate-800 text-xs text-slate-400">
              <div>
                <p className="font-semibold text-slate-200">Date Issued</p>
                <p className="text-slate-400 mt-0.5">{new Date(certificate.issueDate || Date.now()).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="font-semibold text-slate-200">Certificate Verification Code</p>
                <p className="font-mono text-amber-400 font-bold mt-0.5">{certificate.certificateCode}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
