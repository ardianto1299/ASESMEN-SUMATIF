import React, { useState, useEffect } from 'react';
import { 
  Key, 
  Download, 
  Eye, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Send, 
  LogOut, 
  Award, 
  BookOpen, 
  HelpCircle,
  Sparkles,
  ChevronRight,
  Printer,
  X
} from 'lucide-react';
import { ExamSchedule, StudentSubmission, gradeStudentLjk, validateExamAccess, QuestionItem } from '../utils/assessmentLogic';
import { generateExamPdfBlob } from '../utils/pdfHelper';

interface StudentExamPortalProps {
  schedules: ExamSchedule[];
  allQuestions: QuestionItem[];
  onStudentSubmit: (sub: StudentSubmission) => void;
  prefilledToken?: string;
}

export const StudentExamPortal: React.FC<StudentExamPortalProps> = ({
  schedules,
  allQuestions,
  onStudentSubmit,
  prefilledToken = '',
}) => {
  // Portal stages: 'LOGIN' | 'EXAM' | 'COMPLETED'
  const [stage, setStage] = useState<'LOGIN' | 'EXAM' | 'COMPLETED'>('LOGIN');

  // Login form state
  const [nisn, setNisn] = useState<string>('0081299901');
  const [studentName, setStudentName] = useState<string>('Rizky Ramadhan');
  const [studentClass, setStudentClass] = useState<string>('VII-A');
  const [inputToken, setInputToken] = useState<string>(prefilledToken);
  const [loginError, setLoginError] = useState<string>('');

  // Active exam session state
  const [currentExam, setCurrentExam] = useState<ExamSchedule | null>(null);
  const [studentAnswers, setStudentAnswers] = useState<Record<number, string>>({});
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(90 * 60);
  const [isSubmitConfirmOpen, setIsSubmitConfirmOpen] = useState<boolean>(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState<boolean>(false);

  // Result state
  const [examResult, setExamResult] = useState<{
    rawScore: number;
    maxScore: number;
    finalScore: number;
    totalAnswered: number;
    detail: Array<{ no: number; studentAnswer: string; correctAnswer: string; isCorrect: boolean }>;
  } | null>(null);

  // Update token when prop changes
  useEffect(() => {
    if (prefilledToken) {
      setInputToken(prefilledToken);
    }
  }, [prefilledToken]);

  // Countdown Timer
  useEffect(() => {
    if (stage !== 'EXAM') return;

    const timer = setInterval(() => {
      setTimeLeftSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitAnswers();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [stage, studentAnswers, currentExam]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!inputToken.trim()) {
      setLoginError('Silakan masukkan Kode Akses / Token Ujian.');
      return;
    }

    // Match schedule by accessCode
    const matched = schedules.find(
      (s) => s.accessCode.trim().toUpperCase() === inputToken.trim().toUpperCase()
    );

    if (!matched) {
      setLoginError('Kode akses tidak ditemukan. Periksa kembali token yang diberikan pengawas.');
      return;
    }

    const validation = validateExamAccess(inputToken, matched);
    if (!validation.allowed) {
      setLoginError(validation.message);
      return;
    }

    // Start exam session
    setCurrentExam(matched);
    setTimeLeftSeconds(matched.durationMinutes * 60);
    setStudentAnswers({});
    setStage('EXAM');
  };

  const handleSelectOption = (questionNo: number, option: 'A' | 'B' | 'C' | 'D') => {
    setStudentAnswers((prev) => ({
      ...prev,
      [questionNo]: option
    }));
  };

  const handleDownloadPdf = () => {
    if (!currentExam) return;

    // Use PDF generator helper to build authentic printable/downloadable question sheet
    const relevantQuestions = allQuestions.slice(0, currentExam.questionCount).map((q, idx) => ({
      id: idx + 1,
      question: q.question,
      options: q.options
    }));

    const doc = generateExamPdfBlob(
      currentExam.schoolName || 'SMP Negeri 1 Nusantara',
      currentExam.subject,
      currentExam.className,
      '2024/2025',
      currentExam.durationMinutes,
      relevantQuestions
    );

    // Open printable HTML or trigger download
    const win = window.open(doc.url, '_blank');
    if (!win) {
      const a = document.createElement('a');
      a.href = doc.url;
      a.download = doc.fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const handleSubmitAnswers = () => {
    if (!currentExam) return;

    const grading = gradeStudentLjk(
      studentAnswers,
      currentExam.answerKeys,
      currentExam.questionCount
    );

    setExamResult(grading);
    setIsSubmitConfirmOpen(false);
    setStage('COMPLETED');

    // Notify parent for ledger logging
    onStudentSubmit({
      nisn,
      name: studentName,
      className: studentClass,
      answers: studentAnswers,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      examId: currentExam.id,
      finalScore: grading.finalScore,
      rawScore: grading.rawScore
    });
  };

  // Format MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Questions for preview modal
  const previewQuestions = currentExam
    ? allQuestions.slice(0, currentExam.questionCount)
    : [];

  const answeredCount = Object.keys(studentAnswers).filter((k) => studentAnswers[Number(k)]).length;

  return (
    <div className="space-y-6">
      {/* STAGE 1: LOGIN PESERTA UJIAN */}
      {stage === 'LOGIN' && (
        <div className="max-w-md mx-auto my-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
              <Key className="w-7 h-7" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Portal Asesmen Siswa
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Masukkan identitas dan <strong>Kode Akses / Token</strong> yang diberikan oleh Guru/Pengawas.
            </p>
          </div>

          {loginError && (
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-start space-x-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs sm:text-sm">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Nomor Induk Siswa Nasional (NISN)
              </label>
              <input
                type="text"
                value={nisn}
                onChange={(e) => setNisn(e.target.value)}
                placeholder="0081234567"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Nama Lengkap Siswa
              </label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="Nama Anda"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Kelas / Rombel
              </label>
              <input
                type="text"
                value={studentClass}
                onChange={(e) => setStudentClass(e.target.value)}
                placeholder="VII-A"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-emerald-600 dark:text-emerald-400 mb-1">
                Kode Akses / Token Login Ujian
              </label>
              <input
                type="text"
                value={inputToken}
                onChange={(e) => setInputToken(e.target.value.toUpperCase())}
                placeholder="CONTOH: MTK-7A"
                className="w-full px-3.5 py-3 rounded-xl border-2 border-emerald-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-base font-black tracking-widest uppercase focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl font-bold text-slate-950 bg-emerald-500 hover:bg-emerald-400 transition shadow-lg shadow-emerald-500/20 active:scale-98 flex items-center justify-center space-x-2"
            >
              <span>Mulai Asesmen Sumatif</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Token Selector for Testing/Demo */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
            <span className="text-[11px] font-semibold text-slate-500 block">
              💡 Token Ujian Aktif dari Admin (Klik untuk mencoba):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {schedules.filter(s => s.isActive).map((s) => (
                <button
                  key={s.id}
                  onClick={() => setInputToken(s.accessCode)}
                  className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-slate-100 hover:bg-emerald-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-emerald-700 dark:text-emerald-300 border border-slate-200 dark:border-slate-700 transition"
                >
                  {s.accessCode} ({s.subject})
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* STAGE 2: RUANG UJIAN ASESMEN & LJK DIGITAL */}
      {stage === 'EXAM' && currentExam && (
        <div className="space-y-6 animate-fadeIn">
          {/* Top Exam Header Bar */}
          <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sticky top-16 z-30">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs px-2 py-0.5 rounded font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {currentExam.className}
                </span>
                <h2 className="text-base sm:text-lg font-bold">{currentExam.subject}</h2>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Peserta: <strong className="text-white">{studentName}</strong> (NISN: {nisn}) &bull; Jumlah: {currentExam.questionCount} Soal
              </p>
            </div>

            {/* Timer & Buttons */}
            <div className="flex items-center space-x-3 w-full md:w-auto justify-between md:justify-end">
              {/* Countdown Timer */}
              <div
                className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl border font-mono text-sm sm:text-base font-bold shadow-xs ${
                  timeLeftSeconds < 300
                    ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse'
                    : 'bg-slate-800 text-emerald-400 border-slate-700'
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>{formatTime(timeLeftSeconds)}</span>
              </div>

              {/* PDF Actions */}
              <button
                onClick={handleDownloadPdf}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
                title="Unduh naskah soal lengkap dalam format dokumen / PDF"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                <span className="hidden sm:inline">Unduh Soal PDF</span>
              </button>

              <button
                onClick={() => setIsPdfModalOpen(true)}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
                title="Buka naskah soal di layar"
              >
                <Eye className="w-4 h-4 text-blue-400" />
                <span className="hidden sm:inline">Lihat Soal</span>
              </button>

              <button
                onClick={() => setIsSubmitConfirmOpen(true)}
                className="flex items-center space-x-1.5 px-4 py-1.5 rounded-xl text-xs sm:text-sm font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition shadow-md shadow-emerald-500/20"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Kirim Ujian</span>
              </button>
            </div>
          </div>

          {/* Main Layout: PDF Prompt + Digital LJK Sheet */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Quick Instructions & Question Paper Card */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
                <div className="flex items-center space-x-2 text-slate-900 dark:text-white font-bold text-sm">
                  <FileText className="w-4 h-4 text-emerald-500" />
                  <span>Naskah Soal &amp; Petunjuk Ujian</span>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 space-y-2 text-xs text-slate-700 dark:text-slate-300">
                  <p className="font-semibold text-emerald-800 dark:text-emerald-400">
                    Petunjuk Pengerjaan:
                  </p>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>Unduh atau buka naskah soal PDF dengan tombol di atas.</li>
                    <li>Baca butir soal secara cermat.</li>
                    <li>Pilih jawaban <strong>A, B, C, atau D</strong> pada Lembar Jawaban Komputer (LJK) Digital di samping.</li>
                    <li>Pastikan semua soal terjawab sebelum waktu habis.</li>
                  </ol>
                </div>

                <div className="pt-2 flex flex-col gap-2">
                  <button
                    onClick={handleDownloadPdf}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition flex items-center justify-center space-x-2 shadow-sm"
                  >
                    <Download className="w-4 h-4" />
                    <span>Unduh Naskah Soal PDF Sekarang</span>
                  </button>

                  <button
                    onClick={() => setIsPdfModalOpen(true)}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition flex items-center justify-center space-x-2"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Lihat Naskah Soal di Layar (Pratinjau)</span>
                  </button>
                </div>
              </div>

              {/* Navigation Grid of Question Numbers */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900 dark:text-white">Status Lembar Jawaban</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                    {answeredCount} / {currentExam.questionCount} Terjawab
                  </span>
                </div>

                <div className="grid grid-cols-5 sm:grid-cols-10 lg:grid-cols-5 gap-2">
                  {Array.from({ length: currentExam.questionCount }, (_, idx) => idx + 1).map((no) => {
                    const isAnswered = Boolean(studentAnswers[no]);
                    return (
                      <a
                        key={no}
                        href={`#soal-${no}`}
                        className={`h-9 rounded-xl flex items-center justify-center text-xs font-bold transition border ${
                          isAnswered
                            ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-xs'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-400'
                        }`}
                      >
                        {no}
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right: Lembar Jawaban Komputer (LJK) Digital */}
            <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Lembar Jawaban Komputer (LJK) Digital
                  </h3>
                  <p className="text-xs text-slate-500">Pilihlah salah satu pilihan A, B, C, atau D untuk setiap nomor soal.</p>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono font-bold">
                  {currentExam.questionCount} Butir
                </span>
              </div>

              {/* Answer Bubbles Form */}
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                {Array.from({ length: currentExam.questionCount }, (_, idx) => idx + 1).map((no) => {
                  const selected = studentAnswers[no] || '';
                  return (
                    <div
                      key={no}
                      id={`soal-${no}`}
                      className={`p-3.5 rounded-2xl border transition flex items-center justify-between gap-4 ${
                        selected
                          ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40'
                          : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/60'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-700 font-bold text-xs flex items-center justify-center text-slate-800 dark:text-slate-200 shrink-0">
                          {no}
                        </span>
                        <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 hidden sm:inline">
                          Nomor {no}
                        </span>
                      </div>

                      {/* Bubbles A, B, C, D */}
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        {(['A', 'B', 'C', 'D'] as const).map((letter) => {
                          const isChosen = selected === letter;
                          return (
                            <button
                              key={letter}
                              type="button"
                              onClick={() => handleSelectOption(no, letter)}
                              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center transition active:scale-95 ${
                                isChosen
                                  ? 'bg-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-500/30 ring-2 ring-emerald-400'
                                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700'
                              }`}
                            >
                              {letter}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Submit Button */}
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  {answeredCount === currentExam.questionCount
                    ? '✅ Semua nomor soal sudah terisi!'
                    : `⚠️ Masih ada ${currentExam.questionCount - answeredCount} butir belum terjawab.`}
                </span>

                <button
                  type="button"
                  onClick={() => setIsSubmitConfirmOpen(true)}
                  className="px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-emerald-600 hover:bg-emerald-500 text-white transition shadow-md shadow-emerald-600/20"
                >
                  Kirim Jawaban Asesmen
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STAGE 3: RESULT & TANDA TERIMA PENGUMPULAN */}
      {stage === 'COMPLETED' && currentExam && examResult && (
        <div className="max-w-2xl mx-auto my-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6 animate-fadeIn">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500 text-slate-950 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Jawaban Berhasil Dikumpulkan!
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Asesmen Sumatif telah selesai dan tercatat resmi di sistem.
            </p>
          </div>

          {/* Student Receipt Card */}
          <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 space-y-3 text-xs sm:text-sm">
            <div className="grid grid-cols-2 gap-2 pb-3 border-b border-slate-200 dark:border-slate-700">
              <div>
                <span className="text-slate-500 block text-xs">Nama Peserta:</span>
                <strong className="text-slate-900 dark:text-white">{studentName}</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-xs">NISN:</span>
                <span className="font-mono text-slate-900 dark:text-white">{nisn}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-xs">Mata Pelajaran:</span>
                <strong className="text-slate-900 dark:text-white">{currentExam.subject}</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-xs">Waktu Selesai:</span>
                <span className="text-slate-900 dark:text-white">{new Date().toLocaleTimeString('id-ID')}</span>
              </div>
            </div>

            {/* Score Showcase */}
            <div className="grid grid-cols-3 gap-3 text-center pt-2">
              <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="text-[11px] text-slate-500 block">Benar</span>
                <span className="text-lg font-bold text-slate-900 dark:text-white font-mono">
                  {examResult.rawScore} / {examResult.maxScore}
                </span>
              </div>

              <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="text-[11px] text-slate-500 block">Nilai Asesmen</span>
                <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                  {examResult.finalScore}
                </span>
              </div>

              <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="text-[11px] text-slate-500 block">Status KKTP</span>
                <span
                  className={`text-xs font-bold block mt-1 ${
                    examResult.finalScore >= currentExam.kktp
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-rose-600 dark:text-rose-400'
                  }`}
                >
                  {examResult.finalScore >= currentExam.kktp ? 'TUNTAS' : 'REMEDIAL'}
                </span>
              </div>
            </div>
          </div>

          {/* Answer Breakdown Detail */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
              Rincian Jawaban Siswa:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 max-h-48 overflow-y-auto p-2 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
              {examResult.detail.map((d) => (
                <div
                  key={d.no}
                  className={`p-2 rounded-lg text-center border ${
                    d.isCorrect
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 text-emerald-800 dark:text-emerald-300'
                      : 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 text-rose-800 dark:text-rose-300'
                  }`}
                >
                  <span className="font-bold block">#{d.no}</span>
                  <span className="font-mono text-xs">
                    Jawab: {d.studentAnswer || '-'}
                  </span>
                  <span className="block text-[10px] text-slate-500">
                    Kunci: {d.correctAnswer}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center pt-3 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={() => window.print()}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Bukti Pengumpulan</span>
            </button>

            <button
              onClick={() => {
                setStage('LOGIN');
                setCurrentExam(null);
              }}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white dark:bg-emerald-600 dark:hover:bg-emerald-500 transition"
            >
              Keluar ke Halaman Awal
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Modal Submit */}
      {isSubmitConfirmOpen && currentExam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center space-x-3 text-amber-600">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h4 className="font-bold text-base text-slate-900 dark:text-white">
                Konfirmasi Pengumpulan Jawaban
              </h4>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Anda telah menjawab <strong>{answeredCount}</strong> dari total <strong>{currentExam.questionCount}</strong> soal.
              {answeredCount < currentExam.questionCount && (
                <span className="text-rose-500 block font-medium mt-1">
                  Peringatan: Masih ada {currentExam.questionCount - answeredCount} butir yang belum terisi!
                </span>
              )}
              Apakah Anda yakin ingin mengirimkan lembar jawaban sekarang? Jawaban tidak dapat diubah kembali setelah dikirim.
            </p>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setIsSubmitConfirmOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                Periksa Lagi
              </button>
              <button
                type="button"
                onClick={handleSubmitAnswers}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition shadow-sm"
              >
                Ya, Kirim Sekarang
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PDF / Questions Preview Modal */}
      {isPdfModalOpen && currentExam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h4 className="font-bold text-base text-slate-900 dark:text-white">
                  Naskah Soal: {currentExam.subject} ({currentExam.className})
                </h4>
                <p className="text-xs text-slate-500">Jumlah Soal: {currentExam.questionCount} Butir Pilihan Ganda (A - D)</p>
              </div>
              <button
                onClick={() => setIsPdfModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
                aria-label="Tutup"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Questions Content */}
            <div className="space-y-4 text-xs sm:text-sm">
              {previewQuestions.map((q, idx) => (
                <div key={q.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-2">
                  <p className="font-bold text-slate-900 dark:text-white">
                    {idx + 1}. {q.question}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {q.options.slice(0, 4).map((opt, optIdx) => (
                      <div key={optIdx} className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                        {opt}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={handleDownloadPdf}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition shadow-sm"
              >
                <Download className="w-4 h-4" />
                <span>Unduh File PDF Soal</span>
              </button>

              <button
                onClick={() => setIsPdfModalOpen(false)}
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-slate-900 dark:bg-white text-white dark:text-slate-950 transition"
              >
                Tutup &amp; Lanjutkan Mengisi LJK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
