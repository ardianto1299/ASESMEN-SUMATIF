import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Copy, 
  Check, 
  BookOpen, 
  Layers, 
  Filter,
  CheckCircle2,
  X
} from 'lucide-react';
import { QuestionItem } from '../utils/assessmentLogic';

interface QuestionBankViewProps {
  questions: QuestionItem[];
  onAddQuestion: (q: QuestionItem) => void;
  onUpdateQuestion: (q: QuestionItem) => void;
  onDeleteQuestion: (id: number) => void;
  subject: string;
}

export const QuestionBankView: React.FC<QuestionBankViewProps> = ({
  questions,
  onAddQuestion,
  onUpdateQuestion,
  onDeleteQuestion,
  subject,
}) => {
  const [selectedTp, setSelectedTp] = useState<string>('ALL');
  const [copiedCsv, setCopiedCsv] = useState<boolean>(false);
  const [editingQuestion, setEditingQuestion] = useState<QuestionItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Form states for modal
  const [tpCode, setTpCode] = useState<string>('TP 1');
  const [tpDesc, setTpDesc] = useState<string>('');
  const [questionText, setQuestionText] = useState<string>('');
  const [optA, setOptA] = useState<string>('');
  const [optB, setOptB] = useState<string>('');
  const [optC, setOptC] = useState<string>('');
  const [optD, setOptD] = useState<string>('');
  const [optE, setOptE] = useState<string>('');
  const [correctAnswer, setCorrectAnswer] = useState<string>('A');
  const [weight, setWeight] = useState<number>(1);
  const [explanation, setExplanation] = useState<string>('');

  // Extract unique TPs
  const uniqueTps = Array.from(new Set(questions.map((q) => q.tpCode)));

  const filteredQuestions = selectedTp === 'ALL'
    ? questions
    : questions.filter((q) => q.tpCode === selectedTp);

  const handleOpenNew = () => {
    setEditingQuestion(null);
    setTpCode(uniqueTps[0] || 'TP 1');
    setTpDesc('');
    setQuestionText('');
    setOptA('A. ');
    setOptB('B. ');
    setOptC('C. ');
    setOptD('D. ');
    setOptE('');
    setCorrectAnswer('A');
    setWeight(1);
    setExplanation('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (q: QuestionItem) => {
    setEditingQuestion(q);
    setTpCode(q.tpCode);
    setTpDesc(q.tpDescription);
    setQuestionText(q.question);
    setOptA(q.options[0] || '');
    setOptB(q.options[1] || '');
    setOptC(q.options[2] || '');
    setOptD(q.options[3] || '');
    setOptE(q.options[4] || '');
    setCorrectAnswer(q.correctAnswer);
    setWeight(q.weight);
    setExplanation(q.explanation || '');
    setIsModalOpen(true);
  };

  const handleSubmitModal = (e: React.FormEvent) => {
    e.preventDefault();
    const options = [optA, optB, optC, optD];
    if (optE.trim()) options.push(optE);

    if (editingQuestion) {
      onUpdateQuestion({
        id: editingQuestion.id,
        tpCode,
        tpDescription: tpDesc,
        question: questionText,
        options,
        correctAnswer,
        weight,
        explanation
      });
    } else {
      const nextId = questions.length > 0 ? Math.max(...questions.map((q) => q.id)) + 1 : 1;
      onAddQuestion({
        id: nextId,
        tpCode,
        tpDescription: tpDesc,
        question: questionText,
        options,
        correctAnswer,
        weight,
        explanation
      });
    }
    setIsModalOpen(false);
  };

  const handleCopySpreadsheetFormat = () => {
    // Generate TSV format (Tab Separated Values) perfect for direct paste into Google Sheets
    const header = ['No', 'Kode_TP', 'Deskripsi_TP', 'Butir_Soal', 'Pilihan_A', 'Pilihan_B', 'Pilihan_C', 'Pilihan_D', 'Pilihan_E', 'Kunci_Jawaban', 'Bobot_Nilai', 'Pembahasan'].join('\t');
    const rows = questions.map((q) => [
      q.id,
      q.tpCode,
      `"${q.tpDescription.replace(/"/g, '""')}"`,
      `"${q.question.replace(/"/g, '""')}"`,
      `"${(q.options[0] || '').replace(/"/g, '""')}"`,
      `"${(q.options[1] || '').replace(/"/g, '""')}"`,
      `"${(q.options[2] || '').replace(/"/g, '""')}"`,
      `"${(q.options[3] || '').replace(/"/g, '""')}"`,
      `"${(q.options[4] || '').replace(/"/g, '""')}"`,
      q.correctAnswer,
      q.weight,
      `"${(q.explanation || '').replace(/"/g, '""')}"`
    ].join('\t'));

    const fullTsv = [header, ...rows].join('\n');
    navigator.clipboard.writeText(fullTsv);
    setCopiedCsv(true);
    setTimeout(() => setCopiedCsv(false), 2200);
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Kisi-kisi & Bank Soal Asesmen</h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              {questions.length} Butir Soal
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Mata Pelajaran: <span className="text-emerald-400 font-semibold">{subject}</span>. Terstruktur berdasarkan Capaian & Tujuan Pembelajaran (TP).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleCopySpreadsheetFormat}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
            title="Salin format untuk langsung di-paste ke Google Sheets"
          >
            {copiedCsv ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-300" />}
            <span>{copiedCsv ? 'Tersalin untuk Sheets!' : 'Salin untuk Google Sheets'}</span>
          </button>

          <button
            onClick={handleOpenNew}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition shadow-md shadow-emerald-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Butir Soal</span>
          </button>
        </div>
      </div>

      {/* Filter by TP */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
        <Filter className="w-4 h-4 text-slate-400 shrink-0" />
        <span className="text-slate-400 font-medium shrink-0">Filter TP:</span>
        <button
          onClick={() => setSelectedTp('ALL')}
          className={`px-3 py-1.5 rounded-lg font-medium transition ${
            selectedTp === 'ALL'
              ? 'bg-emerald-500 text-slate-950 font-bold'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          Semua ({questions.length})
        </button>
        {uniqueTps.map((tp) => (
          <button
            key={tp}
            onClick={() => setSelectedTp(tp)}
            className={`px-3 py-1.5 rounded-lg font-medium transition whitespace-nowrap ${
              selectedTp === tp
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {tp} ({questions.filter((q) => q.tpCode === tp).length})
          </button>
        ))}
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {filteredQuestions.map((q) => (
          <div
            key={q.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition"
          >
            <div className="flex items-start justify-between gap-4 pb-3 border-b border-slate-100 dark:border-slate-800/80">
              <div className="flex items-center space-x-2">
                <span className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs border border-emerald-500/20">
                  #{q.id}
                </span>
                <span className="text-xs px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-semibold border border-blue-200 dark:border-blue-900">
                  {q.tpCode}: {q.tpDescription}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                  Bobot: {q.weight} Poin
                </span>
                <button
                  onClick={() => handleOpenEdit(q)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  title="Edit Soal"
                  aria-label="Edit Soal"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDeleteQuestion(q.id)}
                  className="p-1.5 rounded-lg text-rose-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
                  title="Hapus Soal"
                  aria-label="Hapus Soal"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Question Text */}
            <div className="pt-3 pb-4">
              <p className="text-slate-900 dark:text-slate-100 font-medium text-sm sm:text-base leading-relaxed">
                {q.question}
              </p>
            </div>

            {/* Options Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm">
              {q.options.map((opt, idx) => {
                const letter = String.fromCharCode(65 + idx);
                const isCorrect = q.correctAnswer === letter;
                return (
                  <div
                    key={idx}
                    className={`p-2.5 rounded-xl border flex items-start space-x-2 transition ${
                      isCorrect
                        ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200 font-medium'
                        : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold shrink-0 ${
                        isCorrect
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {letter}
                    </span>
                    <span className="flex-1">{opt}</span>
                    {isCorrect && (
                      <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-600 text-white shrink-0">
                        Kunci
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Explanation / Pembahasan */}
            {q.explanation && (
              <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 rounded-xl text-xs text-amber-900 dark:text-amber-200">
                <span className="font-bold">Pembahasan: </span>
                {q.explanation}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal Add / Edit Question */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {editingQuestion ? 'Edit Butir Soal Asesmen' : 'Tambah Butir Soal Baru'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
                aria-label="Tutup Modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitModal} className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Kode TP</label>
                  <input
                    type="text"
                    value={tpCode}
                    onChange={(e) => setTpCode(e.target.value)}
                    placeholder="TP 1"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Deskripsi Tujuan Pembelajaran</label>
                  <input
                    type="text"
                    value={tpDesc}
                    onChange={(e) => setTpDesc(e.target.value)}
                    placeholder="Memahami konsep dan menyelesaikan masalah..."
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Teks Butir Soal</label>
                <textarea
                  rows={3}
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  placeholder="Tuliskan butir soal atau stimulus di sini..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block font-medium text-slate-700 dark:text-slate-300">Pilihan Jawaban</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <input
                      type="text"
                      value={optA}
                      onChange={(e) => setOptA(e.target.value)}
                      placeholder="Pilihan A"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={optB}
                      onChange={(e) => setOptB(e.target.value)}
                      placeholder="Pilihan B"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={optC}
                      onChange={(e) => setOptC(e.target.value)}
                      placeholder="Pilihan C"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={optD}
                      onChange={(e) => setOptD(e.target.value)}
                      placeholder="Pilihan D"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      required
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      value={optE}
                      onChange={(e) => setOptE(e.target.value)}
                      placeholder="Pilihan E (Opsional untuk jenjang SMA)"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Kunci Jawaban Benar</label>
                  <select
                    value={correctAnswer}
                    onChange={(e) => setCorrectAnswer(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                  >
                    <option value="A">Kunci: A</option>
                    <option value="B">Kunci: B</option>
                    <option value="C">Kunci: C</option>
                    <option value="D">Kunci: D</option>
                    <option value="E">Kunci: E</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Bobot Nilai</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={weight}
                    onChange={(e) => setWeight(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Pembahasan / Umpan Balik</label>
                <textarea
                  rows={2}
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                  placeholder="Penjelasan kenapa opsi ini benar untuk siswa..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition"
                >
                  {editingQuestion ? 'Simpan Perubahan' : 'Tambahkan Soal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
