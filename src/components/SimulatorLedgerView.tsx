import React, { useState } from 'react';
import { 
  Users, 
  TrendingUp, 
  Award, 
  AlertTriangle, 
  Search, 
  Filter, 
  FileText, 
  Plus, 
  CheckCircle, 
  XCircle,
  Sparkles,
  RefreshCw,
  X
} from 'lucide-react';
import { QuestionItem, StudentSubmission, calculateFinalScore, generateKurikulumMerdekaDescription } from '../utils/assessmentLogic';

interface SimulatorLedgerViewProps {
  questions: QuestionItem[];
  submissions: StudentSubmission[];
  kktp: number;
  onAddSubmission: (sub: StudentSubmission) => void;
  onSelectStudentForReport: (studentNisn: string) => void;
  onResetToSampleSubmissions: () => void;
}

export const SimulatorLedgerView: React.FC<SimulatorLedgerViewProps> = ({
  questions,
  submissions,
  kktp,
  onAddSubmission,
  onSelectStudentForReport,
  onResetToSampleSubmissions,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'TUNTAS' | 'REMEDIAL'>('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  // New submission state
  const [newNisn, setNewNisn] = useState<string>('');
  const [newName, setNewName] = useState<string>('');
  const [newClass, setNewClass] = useState<string>('VII-A');
  const [newAnswers, setNewAnswers] = useState<Record<number, string>>({});

  // Compute results for each student
  const results = submissions.map((sub, index) => {
    const scoreRes = calculateFinalScore(sub.answers, questions);
    const isPassing = scoreRes.finalScore >= kktp;

    // TP Breakdown
    const tpBreakdown: Record<string, { total: number; correct: number; percentage: number; description: string }> = {};
    for (const q of questions) {
      if (!tpBreakdown[q.tpCode]) {
        tpBreakdown[q.tpCode] = { total: 0, correct: 0, percentage: 0, description: q.tpDescription };
      }
      tpBreakdown[q.tpCode].total += q.weight;
      if ((sub.answers[q.id] || '').trim().toUpperCase() === q.correctAnswer.trim().toUpperCase()) {
        tpBreakdown[q.tpCode].correct += q.weight;
      }
    }

    for (const code in tpBreakdown) {
      const item = tpBreakdown[code];
      item.percentage = item.total > 0 ? Math.round((item.correct / item.total) * 100) : 0;
    }

    const description = generateKurikulumMerdekaDescription(tpBreakdown, scoreRes.finalScore, kktp);

    return {
      no: index + 1,
      nisn: sub.nisn,
      name: sub.name,
      className: sub.className,
      timestamp: sub.timestamp || 'Baru Saja',
      rawScore: scoreRes.rawScore,
      maxScore: scoreRes.maxScore,
      finalScore: scoreRes.finalScore,
      isPassing,
      description,
      tpBreakdown
    };
  });

  // Calculate statistics
  const totalStudents = results.length;
  const averageScore = totalStudents > 0
    ? Math.round((results.reduce((acc, r) => acc + r.finalScore, 0) / totalStudents) * 10) / 10
    : 0;
  const maxScoreAchieved = totalStudents > 0 ? Math.max(...results.map((r) => r.finalScore)) : 0;
  const minScoreAchieved = totalStudents > 0 ? Math.min(...results.map((r) => r.finalScore)) : 0;
  const passingCount = results.filter((r) => r.isPassing).length;
  const passingPercentage = totalStudents > 0 ? Math.round((passingCount / totalStudents) * 100) : 0;

  // Filtered list
  const filteredResults = results.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.nisn.includes(searchTerm) ||
      r.className.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;
    if (statusFilter === 'TUNTAS') return r.isPassing;
    if (statusFilter === 'REMEDIAL') return !r.isPassing;
    return true;
  });

  const handleOpenAddModal = () => {
    const nextNisn = '0081234' + String(100 + results.length).padStart(3, '0');
    setNewNisn(nextNisn);
    setNewName('');
    setNewClass(submissions[0]?.className || 'VII-A');
    
    // Default answers with smart variety
    const initialAns: Record<number, string> = {};
    questions.forEach((q) => {
      initialAns[q.id] = q.correctAnswer; // default to correct
    });
    setNewAnswers(initialAns);
    setIsAddModalOpen(true);
  };

  const handleSaveNewSubmission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    onAddSubmission({
      nisn: newNisn,
      name: newName.trim(),
      className: newClass.trim(),
      answers: newAnswers,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
    });

    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400 text-xs font-medium">
            <Users className="w-4 h-4 text-blue-500" />
            <span>Total Siswa</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">{totalStudents}</p>
          <span className="text-[11px] text-slate-400">Respon Terkumpul</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400 text-xs font-medium">
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            <span>Rata-rata Nilai</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">{averageScore}</p>
          <span className="text-[11px] text-slate-400">Target KKTP: {kktp}</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400 text-xs font-medium">
            <Award className="w-4 h-4 text-amber-500" />
            <span>Nilai Tertinggi</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">{maxScoreAchieved}</p>
          <span className="text-[11px] text-slate-400">Terendah: {minScoreAchieved}</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400 text-xs font-medium">
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            <span>Tuntas KKTP</span>
          </div>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-2">{passingPercentage}%</p>
          <span className="text-[11px] text-slate-400">{passingCount} dari {totalStudents} Siswa</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm col-span-2 lg:col-span-1">
          <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400 text-xs font-medium">
            <AlertTriangle className="w-4 h-4 text-rose-500" />
            <span>Perlu Remedial</span>
          </div>
          <p className="text-2xl font-bold text-rose-600 dark:text-rose-400 mt-2">{totalStudents - passingCount}</p>
          <span className="text-[11px] text-slate-400">Nilai di bawah {kktp}</span>
        </div>
      </div>

      {/* Control Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari nama atau NISN..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center space-x-1 text-xs">
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`px-2.5 py-1.5 rounded-lg font-medium transition ${
                statusFilter === 'ALL'
                  ? 'bg-slate-800 text-white dark:bg-slate-700'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setStatusFilter('TUNTAS')}
              className={`px-2.5 py-1.5 rounded-lg font-medium transition ${
                statusFilter === 'TUNTAS'
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30'
              }`}
            >
              Tuntas ({passingCount})
            </button>
            <button
              onClick={() => setStatusFilter('REMEDIAL')}
              className={`px-2.5 py-1.5 rounded-lg font-medium transition ${
                statusFilter === 'REMEDIAL'
                  ? 'bg-rose-500 text-white font-bold'
                  : 'text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30'
              }`}
            >
              Remedial ({totalStudents - passingCount})
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-2 w-full md:w-auto justify-end">
          <button
            onClick={onResetToSampleSubmissions}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition"
            title="Reset data respon ke sampel awal"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Sampel</span>
          </button>

          <button
            onClick={handleOpenAddModal}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Simulasi Respon Siswa</span>
          </button>
        </div>
      </div>

      {/* Leger Nilai Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-sm text-slate-900 dark:text-white">Leger Nilai Asesmen Sumatif</span>
            <span className="text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono">
              Tab Sheet: Leger_Nilai
            </span>
          </div>
          <span className="text-xs text-slate-400">Skor terolah otomatis dari kunci jawaban</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4 w-12 text-center">No</th>
                <th className="py-3 px-4 w-28">NISN</th>
                <th className="py-3 px-4">Nama Siswa</th>
                <th className="py-3 px-4 w-20">Kelas</th>
                <th className="py-3 px-4 w-24 text-center">Skor Mentah</th>
                <th className="py-3 px-4 w-24 text-center">Nilai Akhir</th>
                <th className="py-3 px-4 w-28 text-center">Status KKTP</th>
                <th className="py-3 px-4 min-w-[280px]">Deskripsi Capaian Kompetensi (Kurikulum Merdeka)</th>
                <th className="py-3 px-4 w-20 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
              {filteredResults.map((row) => (
                <tr
                  key={row.nisn}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition"
                >
                  <td className="py-3 px-4 text-center font-mono text-xs text-slate-500">{row.no}</td>
                  <td className="py-3 px-4 font-mono text-xs text-slate-600 dark:text-slate-400">{row.nisn}</td>
                  <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                    {row.name}
                  </td>
                  <td className="py-3 px-4 text-xs text-slate-500 dark:text-slate-400">{row.className}</td>
                  <td className="py-3 px-4 text-center font-mono">
                    {row.rawScore} / {row.maxScore}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`font-bold font-mono text-sm px-2 py-0.5 rounded ${
                        row.finalScore >= 85
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : row.finalScore >= kktp
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                      }`}
                    >
                      {row.finalScore}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    {row.isPassing ? (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        <CheckCircle className="w-3 h-3 text-emerald-500" />
                        <span>Tuntas</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                        <XCircle className="w-3 h-3 text-rose-500" />
                        <span>Remedial</span>
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {row.description}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => onSelectStudentForReport(row.nisn)}
                      className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-slate-700 transition"
                      title="Lihat & Cetak Slip Rapor"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Rapor</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Simulated Student Submission Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Simulasi Respon Siswa Baru
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
                aria-label="Tutup"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNewSubmission} className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">NISN</label>
                  <input
                    type="text"
                    value={newNisn}
                    onChange={(e) => setNewNisn(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Kelas</label>
                  <input
                    type="text"
                    value={newClass}
                    onChange={(e) => setNewClass(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Nama Lengkap Siswa</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Contoh: Muhammad Rayhan"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-2">Jawaban Siswa per Butir Soal:</label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {questions.map((q) => (
                    <div key={q.id} className="p-2 border border-slate-200 dark:border-slate-700 rounded-lg text-center">
                      <span className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                        Soal #{q.id}
                      </span>
                      <select
                        value={newAnswers[q.id] || 'A'}
                        onChange={(e) => setNewAnswers({ ...newAnswers, [q.id]: e.target.value })}
                        className="w-full p-1 text-xs font-bold rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      >
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="D">D</option>
                        {q.options[4] && <option value="E">E</option>}
                      </select>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition"
                >
                  Simpan & Olah Nilai
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
