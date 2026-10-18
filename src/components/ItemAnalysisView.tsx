import React from 'react';
import { 
  BarChart3, 
  HelpCircle, 
  CheckCircle2, 
  AlertCircle, 
  XCircle,
  Percent,
  Layers,
  Info
} from 'lucide-react';
import { QuestionItem, StudentSubmission, calculateItemAnalysis } from '../utils/assessmentLogic';

interface ItemAnalysisViewProps {
  questions: QuestionItem[];
  submissions: StudentSubmission[];
}

export const ItemAnalysisView: React.FC<ItemAnalysisViewProps> = ({
  questions,
  submissions,
}) => {
  const analysisResults = calculateItemAnalysis(questions, submissions);

  // Summary counts
  const totalItems = analysisResults.length;
  const acceptedCount = analysisResults.filter((r) => r.status === 'Diterima').length;
  const reviseCount = analysisResults.filter((r) => r.status === 'Revisi').length;
  const rejectCount = analysisResults.filter((r) => r.status === 'Ditolak').length;

  const easyCount = analysisResults.filter((r) => r.difficultyLabel === 'Mudah').length;
  const mediumCount = analysisResults.filter((r) => r.difficultyLabel === 'Sedang').length;
  const hardCount = analysisResults.filter((r) => r.difficultyLabel === 'Sukar').length;

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Status Soal */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Kelayakan Butir Soal</span>
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
              {acceptedCount}/{totalItems} Diterima
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="flex items-center space-x-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                <CheckCircle2 className="w-4 h-4" />
                <span>Soal Diterima (Baik)</span>
              </span>
              <span className="font-bold font-mono">{acceptedCount} Soal</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center space-x-1.5 text-amber-600 dark:text-amber-400 font-medium">
                <AlertCircle className="w-4 h-4" />
                <span>Perlu Revisi (Cukup)</span>
              </span>
              <span className="font-bold font-mono">{reviseCount} Soal</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center space-x-1.5 text-rose-600 dark:text-rose-400 font-medium">
                <XCircle className="w-4 h-4" />
                <span>Ditolak / Ganti (Jelek)</span>
              </span>
              <span className="font-bold font-mono">{rejectCount} Soal</span>
            </div>
          </div>
        </div>

        {/* Tingkat Kesukaran */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Sebaran Kesukaran (P)</span>
            <span className="text-xs text-slate-400">Metode Statistik</span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40">
              <span className="block text-[11px] text-blue-600 dark:text-blue-400 font-medium">Mudah (&gt;0.7)</span>
              <span className="text-lg font-bold text-blue-900 dark:text-blue-200 font-mono mt-1 block">{easyCount}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40">
              <span className="block text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">Sedang (0.3-0.7)</span>
              <span className="text-lg font-bold text-emerald-900 dark:text-emerald-200 font-mono mt-1 block">{mediumCount}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/40">
              <span className="block text-[11px] text-purple-600 dark:text-purple-400 font-medium">Sukar (&lt;0.3)</span>
              <span className="text-lg font-bold text-purple-900 dark:text-purple-200 font-mono mt-1 block">{hardCount}</span>
            </div>
          </div>
        </div>

        {/* Info Rumus & Standar */}
        <div className="bg-gradient-to-br from-slate-900 to-indigo-950 border border-indigo-900/40 rounded-2xl p-5 text-white shadow-sm flex flex-col justify-between text-xs space-y-2">
          <div className="flex items-center space-x-2">
            <Info className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-bold text-emerald-300">Standar Evaluasi Pendidikan</span>
          </div>
          <p className="text-slate-300 leading-relaxed text-[11px]">
            Formula: <code className="text-emerald-400 font-bold font-mono">P = B / N</code> (Tingkat Kesukaran) dan <code className="text-emerald-400 font-bold font-mono">D = (B_A - B_B) / n</code> (Daya Beda kelompok 27% Atas &amp; Bawah).
          </p>
          <span className="text-[10px] text-slate-400">
            Kriteria: Soal bermutu baik memiliki proporsi <strong>Sedang (P: 0.3 - 0.7)</strong> dan daya beda <strong>D &ge; 0.30</strong>.
          </span>
        </div>
      </div>

      {/* Item Analysis Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-sm text-slate-900 dark:text-white">Tabel Analisis Butir Soal Asesmen</span>
            <span className="text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono">
              Tab Sheet: Analisis_Soal
            </span>
          </div>
          <span className="text-xs text-slate-400">Berdasarkan {submissions.length} Peserta Ujian</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-3 w-12 text-center">No</th>
                <th className="py-3 px-3 w-20">Kode TP</th>
                <th className="py-3 px-4">Kutipan Soal</th>
                <th className="py-3 px-2 w-16 text-center">Kunci</th>
                <th className="py-3 px-3 w-20 text-center">Benar/Total</th>
                <th className="py-3 px-3 w-28 text-center">Kesukaran (P)</th>
                <th className="py-3 px-3 w-28 text-center">Daya Beda (D)</th>
                <th className="py-3 px-4 w-32 text-center">Rekomendasi</th>
                <th className="py-3 px-4 w-44">Sebaran Opsi (Pengecoh)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
              {analysisResults.map((item) => (
                <tr key={item.questionId} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                  <td className="py-3 px-3 text-center font-mono font-bold text-slate-500">#{item.questionId}</td>
                  <td className="py-3 px-3 font-semibold text-slate-700 dark:text-slate-300">{item.tpCode}</td>
                  <td className="py-3 px-4 text-xs font-medium text-slate-900 dark:text-slate-100 max-w-xs truncate" title={item.questionSnippet}>
                    {item.questionSnippet}
                  </td>
                  <td className="py-3 px-2 text-center font-bold">
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 font-mono">
                      {item.correctAnswer}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center font-mono text-xs">
                    {item.correctCount} / {item.totalAttempts}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <div className="font-mono font-bold text-xs">{item.difficultyIndex}</div>
                    <span
                      className={`inline-block text-[10px] px-1.5 py-0.5 rounded font-medium mt-0.5 ${
                        item.difficultyLabel === 'Sedang'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                          : item.difficultyLabel === 'Mudah'
                          ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300'
                          : 'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300'
                      }`}
                    >
                      {item.difficultyLabel}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <div className="font-mono font-bold text-xs">{item.discriminationIndex}</div>
                    <span
                      className={`inline-block text-[10px] px-1.5 py-0.5 rounded font-medium mt-0.5 ${
                        item.discriminationLabel === 'Sangat Baik' || item.discriminationLabel === 'Baik'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                          : item.discriminationLabel === 'Cukup'
                          ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
                          : 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300'
                      }`}
                    >
                      {item.discriminationLabel}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        item.status === 'Diterima'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : item.status === 'Revisi'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                      }`}
                    >
                      {item.status === 'Diterima' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                      {item.status === 'Revisi' && <AlertCircle className="w-3 h-3 text-amber-600" />}
                      {item.status === 'Ditolak' && <XCircle className="w-3 h-3 text-rose-600" />}
                      <span>{item.status}</span>
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-1.5 text-[11px] font-mono">
                      {['A', 'B', 'C', 'D', 'E'].map((letter) => {
                        const count = item.distractorCounts[letter];
                        if (count === undefined) return null;
                        const isKey = letter === item.correctAnswer;
                        return (
                          <span
                            key={letter}
                            className={`px-1.5 py-0.5 rounded ${
                              isKey
                                ? 'bg-emerald-500 text-slate-950 font-bold'
                                : count > 0
                                ? 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                            }`}
                            title={`Opsi ${letter}: dipilih ${count} siswa`}
                          >
                            {letter}:{count}
                          </span>
                        );
                      })}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
