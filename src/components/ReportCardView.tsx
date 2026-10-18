import React, { useState } from 'react';
import { 
  Printer, 
  ChevronLeft, 
  ChevronRight, 
  Award, 
  CheckCircle2, 
  AlertTriangle,
  FileCheck
} from 'lucide-react';
import { QuestionItem, StudentSubmission, calculateFinalScore, generateKurikulumMerdekaDescription } from '../utils/assessmentLogic';
import { AppsScriptConfig } from '../data/appsScriptTemplates';

interface ReportCardViewProps {
  questions: QuestionItem[];
  submissions: StudentSubmission[];
  config: AppsScriptConfig;
  selectedStudentNisn?: string;
}

export const ReportCardView: React.FC<ReportCardViewProps> = ({
  questions,
  submissions,
  config,
  selectedStudentNisn,
}) => {
  const [activeNisn, setActiveNisn] = useState<string>(
    selectedStudentNisn || submissions[0]?.nisn || ''
  );

  const activeIndex = submissions.findIndex((s) => s.nisn === activeNisn);
  const currentStudent = submissions[activeIndex] || submissions[0];

  if (!currentStudent) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center text-slate-500">
        Belum ada data respon siswa untuk dicetak.
      </div>
    );
  }

  // Calculate score for active student
  const scoreRes = calculateFinalScore(currentStudent.answers, questions);
  const isPassing = scoreRes.finalScore >= config.kktp;

  // Breakdown per TP
  const tpBreakdown: Record<string, { description: string; totalWeight: number; studentScore: number }> = {};
  for (const q of questions) {
    if (!tpBreakdown[q.tpCode]) {
      tpBreakdown[q.tpCode] = { description: q.tpDescription, totalWeight: 0, studentScore: 0 };
    }
    tpBreakdown[q.tpCode].totalWeight += q.weight;
    if ((currentStudent.answers[q.id] || '').trim().toUpperCase() === q.correctAnswer.trim().toUpperCase()) {
      tpBreakdown[q.tpCode].studentScore += q.weight;
    }
  }

  const tpBreakdownForDesc: Record<string, { total: number; correct: number; percentage: number; description: string }> = {};
  for (const code in tpBreakdown) {
    const item = tpBreakdown[code];
    const pct = item.totalWeight > 0 ? Math.round((item.studentScore / item.totalWeight) * 100) : 0;
    tpBreakdownForDesc[code] = {
      total: item.totalWeight,
      correct: item.studentScore,
      percentage: pct,
      description: item.description
    };
  }

  const description = generateKurikulumMerdekaDescription(tpBreakdownForDesc, scoreRes.finalScore, config.kktp);

  const handlePrev = () => {
    if (activeIndex > 0) {
      setActiveNisn(submissions[activeIndex - 1].nisn);
    }
  };

  const handleNext = () => {
    if (activeIndex < submissions.length - 1) {
      setActiveNisn(submissions[activeIndex + 1].nisn);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Student Selector Toolbar (Hidden when printing) */}
      <div className="print:hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 shrink-0">
            Pilih Siswa:
          </label>
          <select
            value={activeNisn}
            onChange={(e) => setActiveNisn(e.target.value)}
            className="w-full sm:w-64 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          >
            {submissions.map((s, idx) => (
              <option key={s.nisn} value={s.nisn}>
                {idx + 1}. {s.name} ({s.nisn})
              </option>
            ))}
          </select>

          <div className="flex items-center space-x-1">
            <button
              onClick={handlePrev}
              disabled={activeIndex <= 0}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
              title="Siswa Sebelumnya"
              aria-label="Siswa Sebelumnya"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              disabled={activeIndex >= submissions.length - 1}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
              title="Siswa Berikutnya"
              aria-label="Siswa Berikutnya"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <button
          onClick={handlePrint}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition shadow-sm w-full sm:w-auto justify-center"
        >
          <Printer className="w-4 h-4" />
          <span>Cetak Lembar Hasil / PDF</span>
        </button>
      </div>

      {/* Printable Sheet */}
      <div className="bg-white text-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl p-6 sm:p-10 shadow-lg max-w-4xl mx-auto print:border-none print:shadow-none print:p-0 print:max-w-none">
        {/* Kop Surat Sekolah */}
        <div className="text-center border-b-2 border-slate-900 pb-4 mb-6">
          <p className="text-xs uppercase tracking-widest text-slate-600 font-semibold">
            Pemerintah Daerah Dinas Pendidikan dan Kebudayaan
          </p>
          <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-slate-950 mt-1">
            {config.schoolName}
          </h1>
          <p className="text-xs text-slate-600 font-medium mt-0.5">
            LEMBAR LAPORAN HASIL ASESMEN SUMATIF SISWA
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Tahun Ajaran {config.academicYear} &bull; Semester {config.semester}
          </p>
        </div>

        {/* Student Identity Grid */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs sm:text-sm mb-6 bg-slate-50 p-4 rounded-xl border border-slate-200 print:bg-transparent print:p-0 print:border-none">
          <div className="flex">
            <span className="w-32 font-semibold text-slate-600">Nama Siswa</span>
            <span className="font-bold text-slate-950">: {currentStudent.name}</span>
          </div>
          <div className="flex">
            <span className="w-32 font-semibold text-slate-600">Kelas / Fase</span>
            <span className="font-medium text-slate-950">: {currentStudent.className}</span>
          </div>
          <div className="flex">
            <span className="w-32 font-semibold text-slate-600">NISN</span>
            <span className="font-mono text-slate-950">: {currentStudent.nisn}</span>
          </div>
          <div className="flex">
            <span className="w-32 font-semibold text-slate-600">Mata Pelajaran</span>
            <span className="font-semibold text-slate-950">: {config.subject}</span>
          </div>
        </div>

        {/* Overall Score Summary */}
        <div className="grid grid-cols-3 gap-3 mb-6 text-center">
          <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 print:bg-transparent">
            <span className="text-[11px] text-slate-500 block uppercase font-bold">Skor Mentah</span>
            <span className="text-xl font-bold font-mono text-slate-900">
              {scoreRes.rawScore} / {scoreRes.maxScore}
            </span>
          </div>

          <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 print:bg-transparent">
            <span className="text-[11px] text-slate-500 block uppercase font-bold">Nilai Akhir (Skala 100)</span>
            <span className="text-2xl font-black font-mono text-emerald-700">
              {scoreRes.finalScore}
            </span>
          </div>

          <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 print:bg-transparent">
            <span className="text-[11px] text-slate-500 block uppercase font-bold">Status KKTP ({config.kktp})</span>
            <span
              className={`text-sm font-bold uppercase block mt-1 ${
                isPassing ? 'text-emerald-700' : 'text-rose-700'
              }`}
            >
              {isPassing ? 'Tuntas Capaian' : 'Perlu Remedial'}
            </span>
          </div>
        </div>

        {/* Breakdown per TP Table */}
        <div className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Rincian Ketercapaian Tujuan Pembelajaran (TP):
          </h2>
          <table className="w-full text-left text-xs border border-slate-300">
            <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
              <tr>
                <th className="p-2.5 w-20">Kode TP</th>
                <th className="p-2.5">Deskripsi Tujuan Pembelajaran</th>
                <th className="p-2.5 w-24 text-center">Skor / Bobot</th>
                <th className="p-2.5 w-24 text-center">Persentase</th>
                <th className="p-2.5 w-32 text-center">Kategori</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {Object.entries(tpBreakdown).map(([code, item]) => {
                const pct = item.totalWeight > 0 ? Math.round((item.studentScore / item.totalWeight) * 100) : 0;
                let kat = 'Cukup';
                if (pct >= 85) kat = 'Sangat Baik';
                else if (pct >= 70) kat = 'Baik';
                else if (pct < 60) kat = 'Perlu Bimbingan';

                return (
                  <tr key={code}>
                    <td className="p-2.5 font-bold text-slate-900">{code}</td>
                    <td className="p-2.5 text-slate-700">{item.description}</td>
                    <td className="p-2.5 text-center font-mono">
                      {item.studentScore} / {item.totalWeight}
                    </td>
                    <td className="p-2.5 text-center font-mono font-bold">{pct}%</td>
                    <td className="p-2.5 text-center">
                      <span
                        className={`font-semibold text-[11px] px-2 py-0.5 rounded ${
                          pct >= 70 ? 'text-emerald-800 bg-emerald-50' : 'text-rose-800 bg-rose-50'
                        }`}
                      >
                        {kat}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Kurikulum Merdeka Narrative */}
        <div className="mb-8 p-4 rounded-xl border border-slate-200 bg-slate-50 print:bg-transparent">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-1">
            Deskripsi Capaian Kompetensi (Rapor Kurikulum Merdeka):
          </h2>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
            "{description}"
          </p>
        </div>

        {/* Signature Blocks */}
        <div className="grid grid-cols-2 gap-8 text-xs text-center pt-4">
          <div>
            <p className="text-slate-600 mb-1">Mengetahui,</p>
            <p className="font-bold text-slate-900">Kepala Sekolah</p>
            <div className="h-16" />
            <p className="font-bold underline text-slate-950">Hj. Siti Rahmawati, S.Pd., M.M.</p>
            <p className="text-[11px] text-slate-500">NIP. 19710315 199602 2 001</p>
          </div>

          <div>
            <p className="text-slate-600 mb-1">Jakarta, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            <p className="font-bold text-slate-900">Guru Mata Pelajaran</p>
            <div className="h-16" />
            <p className="font-bold underline text-slate-950">{config.teacherName}</p>
            <p className="text-[11px] text-slate-500">NIP. {config.nip}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
