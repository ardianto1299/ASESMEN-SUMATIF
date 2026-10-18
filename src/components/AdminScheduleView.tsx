import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Key, 
  FileText, 
  Upload, 
  Plus, 
  Edit3, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  Sparkles,
  Download,
  Eye,
  Shuffle,
  Hash,
  ExternalLink,
  X
} from 'lucide-react';
import { ExamSchedule } from '../utils/assessmentLogic';

interface AdminScheduleViewProps {
  schedules: ExamSchedule[];
  onAddSchedule: (sched: ExamSchedule) => void;
  onUpdateSchedule: (sched: ExamSchedule) => void;
  onDeleteSchedule: (id: string) => void;
  onLaunchStudentTest: (accessCode: string) => void;
}

export const AdminScheduleView: React.FC<AdminScheduleViewProps> = ({
  schedules,
  onAddSchedule,
  onUpdateSchedule,
  onDeleteSchedule,
  onLaunchStudentTest,
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [subject, setSubject] = useState<string>('Matematika');
  const [className, setClassName] = useState<string>('Kelas VII (Fase D)');
  const [accessCode, setAccessCode] = useState<string>('MTK-7A');
  const [examDate, setExamDate] = useState<string>('2024-11-20');
  const [startTime, setStartTime] = useState<string>('08:00');
  const [endTime, setEndTime] = useState<string>('09:30');
  const [durationMinutes, setDurationMinutes] = useState<number>(90);
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [pdfFileName, setPdfFileName] = useState<string>('Naskah_Soal_Matematika.pdf');
  const [pdfUrl, setPdfUrl] = useState<string>('');
  const [kktp, setKktp] = useState<number>(75);
  const [isActive, setIsActive] = useState<boolean>(true);
  const [answerKeys, setAnswerKeys] = useState<Record<number, 'A' | 'B' | 'C' | 'D'>>({
    1: 'A', 2: 'A', 3: 'B', 4: 'A', 5: 'A',
    6: 'A', 7: 'A', 8: 'A', 9: 'A', 10: 'A'
  });

  const handleGenerateRandomToken = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setAccessCode(`${subject.substring(0, 3).toUpperCase()}-${code}`);
  };

  const handleQuestionCountChange = (newCount: number) => {
    const count = Math.max(1, Math.min(100, newCount));
    setQuestionCount(count);
    
    // adjust answer keys
    const newKeys = { ...answerKeys };
    for (let i = 1; i <= count; i++) {
      if (!newKeys[i]) newKeys[i] = 'A';
    }
    setAnswerKeys(newKeys);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPdfFileName(file.name);
      const fileUrl = URL.createObjectURL(file);
      setPdfUrl(fileUrl);
    }
  };

  const handleOpenNew = () => {
    setEditingId(null);
    setSubject('Matematika');
    setClassName('Kelas VII (Fase D)');
    setAccessCode('MTK-' + Math.floor(1000 + Math.random() * 9000));
    setExamDate(new Date().toISOString().substring(0, 10));
    setStartTime('08:00');
    setEndTime('09:30');
    setDurationMinutes(90);
    setQuestionCount(10);
    setPdfFileName('Naskah_Soal_Ujian.pdf');
    setPdfUrl('');
    setKktp(75);
    setIsActive(true);

    const keys: Record<number, 'A' | 'B' | 'C' | 'D'> = {};
    for (let i = 1; i <= 10; i++) keys[i] = 'A';
    setAnswerKeys(keys);

    setIsModalOpen(true);
  };

  const handleOpenEdit = (sched: ExamSchedule) => {
    setEditingId(sched.id);
    setSubject(sched.subject);
    setClassName(sched.className);
    setAccessCode(sched.accessCode);
    setExamDate(sched.examDate);
    setStartTime(sched.startTime);
    setEndTime(sched.endTime);
    setDurationMinutes(sched.durationMinutes);
    setQuestionCount(sched.questionCount);
    setPdfFileName(sched.pdfFileName);
    setPdfUrl(sched.pdfUrl);
    setKktp(sched.kktp);
    setIsActive(sched.isActive);
    setAnswerKeys({ ...sched.answerKeys });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingId) {
      onUpdateSchedule({
        id: editingId,
        subject,
        className,
        accessCode: accessCode.trim().toUpperCase(),
        examDate,
        startTime,
        endTime,
        durationMinutes,
        questionCount,
        pdfUrl,
        pdfFileName,
        answerKeys,
        kktp,
        isActive,
        schoolName: 'SMP Negeri 1 Nusantara',
        teacherName: 'Drs. Ahmad Fauzi, M.Pd.',
        nip: '19780512 200501 1 008'
      });
    } else {
      const newId = 'sched-' + Date.now();
      onAddSchedule({
        id: newId,
        subject,
        className,
        accessCode: accessCode.trim().toUpperCase(),
        examDate,
        startTime,
        endTime,
        durationMinutes,
        questionCount,
        pdfUrl,
        pdfFileName,
        answerKeys,
        kktp,
        isActive,
        schoolName: 'SMP Negeri 1 Nusantara',
        teacherName: 'Drs. Ahmad Fauzi, M.Pd.',
        nip: '19780512 200501 1 008'
      });
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Manajemen Jadwal, Token &amp; Naskah Soal PDF</h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Panel Admin
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Admin menentukan jadwal ujian, durasi, <strong>Kode Token Login Ujian</strong>, jumlah butir soal per mata pelajaran, upload berkas PDF soal, dan kunci jawaban master (A–D).
          </p>
        </div>

        <button
          onClick={handleOpenNew}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition shadow-md shadow-emerald-500/20 active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Jadwal &amp; Token Baru</span>
        </button>
      </div>

      {/* Schedules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {schedules.map((sched) => (
          <div
            key={sched.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:border-emerald-500/40 transition flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              {/* Header Status & Subject */}
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block uppercase tracking-wider">
                    {sched.className}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                    {sched.subject}
                  </h3>
                </div>
                <span
                  className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                    sched.isActive
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                  }`}
                >
                  {sched.isActive ? <CheckCircle className="w-3 h-3 text-emerald-500" /> : <XCircle className="w-3 h-3 text-slate-400" />}
                  <span>{sched.isActive ? 'Aktif' : 'Nonaktif'}</span>
                </span>
              </div>

              {/* Token Box (Prominent) */}
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-slate-800/80 border border-emerald-200 dark:border-emerald-800/60 p-3 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-emerald-800 dark:text-emerald-400 block tracking-wider">
                    Kode Akses / Token Login:
                  </span>
                  <span className="font-mono text-base font-black text-emerald-950 dark:text-emerald-200 tracking-wider">
                    {sched.accessCode}
                  </span>
                </div>
                <button
                  onClick={() => navigator.clipboard.writeText(sched.accessCode)}
                  className="px-2 py-1 rounded bg-white dark:bg-slate-800 text-[11px] font-medium text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 hover:bg-emerald-100 dark:hover:bg-slate-700 transition"
                  title="Salin Token"
                >
                  Salin
                </button>
              </div>

              {/* Details List */}
              <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Tanggal: <strong>{sched.examDate}</strong></span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Waktu: <strong>{sched.startTime} - {sched.endTime}</strong> ({sched.durationMinutes} menit)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Hash className="w-3.5 h-3.5 text-slate-400" />
                  <span>Jumlah Soal Ditentukan: <strong className="text-emerald-600 dark:text-emerald-400">{sched.questionCount} Butir Soal</strong></span>
                </div>
                <div className="flex items-center space-x-2">
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate">Naskah: <strong>{sched.pdfFileName}</strong></span>
                </div>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
              <button
                onClick={() => onLaunchStudentTest(sched.accessCode)}
                className="flex-1 py-1.5 px-3 rounded-lg text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white dark:bg-emerald-600 dark:hover:bg-emerald-500 transition text-center"
              >
                Uji Coba Sebagai Siswa
              </button>

              <div className="flex items-center space-x-1">
                <button
                  onClick={() => handleOpenEdit(sched)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  title="Edit Jadwal"
                  aria-label="Edit Jadwal"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDeleteSchedule(sched.id)}
                  className="p-1.5 rounded-lg text-rose-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
                  title="Hapus Jadwal"
                  aria-label="Hapus Jadwal"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Schedule Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-2xl max-h-[92vh] overflow-y-auto p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {editingId ? 'Edit Jadwal & Konfigurasi Ujian' : 'Tambah Jadwal Ujian & Token Akses'}
                </h3>
                <p className="text-xs text-slate-500">Tentukan durasi, token, naskah PDF, jumlah butir soal, dan kunci jawaban master.</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
                aria-label="Tutup"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Mata Pelajaran</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Matematika"
                    required
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Kelas / Rombel / Fase</label>
                  <input
                    type="text"
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Kelas VII (Fase D)"
                    required
                  />
                </div>
              </div>

              {/* Access Code Token Section */}
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block font-bold text-slate-800 dark:text-slate-200">
                    Kode Akses / Token Login Ujian
                  </label>
                  <button
                    type="button"
                    onClick={handleGenerateRandomToken}
                    className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center space-x-1 hover:underline"
                  >
                    <Shuffle className="w-3.5 h-3.5" />
                    <span>Acak Kode Token</span>
                  </button>
                </div>
                <input
                  type="text"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 rounded-xl font-mono text-base font-bold uppercase tracking-wider border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="CONTOH: MTK-7A"
                  required
                />
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Siswa wajib memasukkan token ini pada portal ujian untuk membuka soal.
                </p>
              </div>

              {/* Schedule Timing */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Tanggal Ujian</label>
                  <input
                    type="date"
                    value={examDate}
                    onChange={(e) => setExamDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Jam Mulai</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Durasi (Menit)</label>
                  <input
                    type="number"
                    min="10"
                    max="300"
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                    required
                  />
                </div>
              </div>

              {/* Question Count & PDF Upload */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Jumlah Soal Ditentukan Admin
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={questionCount}
                      onChange={(e) => handleQuestionCountChange(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                      required
                    />
                    <span className="text-xs text-slate-500 shrink-0">Butir</span>
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Naskah Soal (Upload Berkas PDF)
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileUpload}
                      className="w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                    />
                  </div>
                  {pdfFileName && (
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 block truncate">
                      File: {pdfFileName}
                    </span>
                  )}
                </div>
              </div>

              {/* Master Answer Keys (Pilihan A, B, C, D) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block font-bold text-slate-800 dark:text-slate-200">
                    Kunci Jawaban Master (Nomor 1 s/d {questionCount} - Pilihan A, B, C, D):
                  </label>
                  <span className="text-[11px] text-slate-500">Koreksi otomatis instan</span>
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-10 gap-2 max-h-48 overflow-y-auto p-2 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700">
                  {Array.from({ length: questionCount }, (_, idx) => idx + 1).map((num) => (
                    <div key={num} className="text-center p-1.5 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-xs">
                      <span className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                        #{num}
                      </span>
                      <select
                        value={answerKeys[num] || 'A'}
                        onChange={(e) => setAnswerKeys({ ...answerKeys, [num]: e.target.value as 'A' | 'B' | 'C' | 'D' })}
                        className="w-full p-1 text-xs font-bold rounded border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-center"
                      >
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="D">D</option>
                      </select>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-800">
                <label className="flex items-center space-x-2 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-slate-700 dark:text-slate-300 font-medium">Aktifkan ujian ini sekarang</span>
                </label>

                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition"
                  >
                    {editingId ? 'Simpan Perubahan' : 'Buat Jadwal'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
