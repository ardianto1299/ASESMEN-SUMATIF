import React, { useState } from 'react';
import { 
  Copy, 
  Check, 
  Download, 
  Sliders, 
  Terminal, 
  Sparkles, 
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Zap,
  BookOpen
} from 'lucide-react';
import { AppsScriptConfig, generateAllInOneScript, MODULAR_SCRIPTS } from '../data/appsScriptTemplates';

interface ScriptGeneratorViewProps {
  config: AppsScriptConfig;
  onUpdateConfig: (newConfig: AppsScriptConfig) => void;
  onOpenGuide: () => void;
}

export const ScriptGeneratorView: React.FC<ScriptGeneratorViewProps> = ({
  config,
  onUpdateConfig,
  onOpenGuide
}) => {
  const [selectedFile, setSelectedFile] = useState<string>('all-in-one');
  const [copied, setCopied] = useState<boolean>(false);
  const [isEditingConfig, setIsEditingConfig] = useState<boolean>(false);

  // Form local state
  const [formData, setFormData] = useState<AppsScriptConfig>(config);

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateConfig(formData);
    setIsEditingConfig(false);
  };

  // Get active code
  let activeCode = '';
  if (selectedFile === 'all-in-one') {
    activeCode = generateAllInOneScript(config);
  } else {
    const found = MODULAR_SCRIPTS.find((s) => s.fileName === selectedFile);
    activeCode = found ? found.getCode(config) : generateAllInOneScript(config);
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(activeCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleDownload = () => {
    const fileName = selectedFile === 'all-in-one' ? 'AsesmenSumatif_AllInOne.gs' : selectedFile;
    const blob = new Blob([activeCode], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Highlights */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-900/40 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Google Apps Script Resmi untuk Guru & Sekolah</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Otomasi Asesmen Sumatif Kurikulum Merdeka
            </h1>
            <p className="text-slate-300 text-sm leading-relaxed">
              Script Google Spreadsheet lengkap untuk membuat Google Form Kuis secara instan, mengolah skor mentah menjadi nilai akhir, menyusun deskripsi capaian rapor otomatis, serta menghitung analisis butir soal (daya beda dan kesukaran).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsEditingConfig(!isEditingConfig)}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition shadow-sm"
            >
              <Sliders className="w-4 h-4 text-emerald-400" />
              <span>{isEditingConfig ? 'Tutup Pengaturan' : 'Sesuaikan Identitas'}</span>
            </button>

            <button
              onClick={handleCopy}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition shadow-md shadow-emerald-500/20 active:scale-95"
            >
              {copied ? <Check className="w-4 h-4 text-slate-950" /> : <Copy className="w-4 h-4 text-slate-950" />}
              <span>{copied ? 'Tersalin ke Clipboard!' : 'Salin Kode Script'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition"
              title="Unduh file .gs"
            >
              <Download className="w-4 h-4 text-slate-300" />
              <span className="hidden sm:inline">Unduh .gs</span>
            </button>
          </div>
        </div>

        {/* Feature Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800/80 text-xs">
          <div className="flex items-center space-x-2 text-slate-300">
            <Zap className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Generate Google Form Kuis 1-Klik</span>
          </div>
          <div className="flex items-center space-x-2 text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Koreksi & Kunci Jawaban Akurat</span>
          </div>
          <div className="flex items-center space-x-2 text-slate-300">
            <BookOpen className="w-4 h-4 text-blue-400 shrink-0" />
            <span>Deskripsi Rapor Kurikulum Merdeka</span>
          </div>
          <div className="flex items-center space-x-2 text-slate-300">
            <Sliders className="w-4 h-4 text-purple-400 shrink-0" />
            <span>Analisis Butir Soal & Daya Beda</span>
          </div>
        </div>
      </div>

      {/* Configuration Form (Collapsible) */}
      {isEditingConfig && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-md animate-fadeIn">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Pengaturan Identitas Asesmen</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Parameter ini langsung terinjeksi ke dalam variabel CONFIG pada Google Apps Script.</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-full">
              Kriteria KKTP: {formData.kktp}
            </span>
          </div>

          <form onSubmit={handleSaveConfig} className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm">
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Nama Satuan Pendidikan (Sekolah)</label>
              <input
                type="text"
                value={formData.schoolName}
                onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                placeholder="Contoh: SMP Negeri 1 Jakarta"
                required
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Judul Asesmen</label>
              <input
                type="text"
                value={formData.examTitle}
                onChange={(e) => setFormData({ ...formData, examTitle: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                placeholder="Contoh: Asesmen Sumatif Akhir Semester"
                required
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Mata Pelajaran</label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                placeholder="Contoh: Matematika"
                required
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Kelas / Fase</label>
              <input
                type="text"
                value={formData.className}
                onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                placeholder="Contoh: VII (Fase D)"
                required
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Semester & Tahun Ajaran</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={formData.semester}
                  onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  placeholder="Ganjil"
                />
                <input
                  type="text"
                  value={formData.academicYear}
                  onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  placeholder="2024/2025"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Kriteria Ketercapaian (KKTP / KKM)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.kktp}
                onChange={(e) => setFormData({ ...formData, kktp: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                placeholder="75"
                required
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Nama Guru Mata Pelajaran</label>
              <input
                type="text"
                value={formData.teacherName}
                onChange={(e) => setFormData({ ...formData, teacherName: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                placeholder="Nama & Gelar Guru"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">NIP Guru</label>
              <input
                type="text"
                value={formData.nip}
                onChange={(e) => setFormData({ ...formData, nip: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                placeholder="Contoh: 19800101 200501 1 005"
              />
            </div>

            <div className="flex items-end space-x-2">
              <button
                type="submit"
                className="w-full py-2 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm transition"
              >
                Terapkan Perubahan
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Code Viewer Card */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        {/* File Explorer Bar */}
        <div className="bg-slate-900 border-b border-slate-800 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto text-xs">
            <span className="text-slate-400 font-mono text-[11px] mr-1 hidden sm:inline">File Script:</span>
            
            <button
              onClick={() => setSelectedFile('all-in-one')}
              className={`px-3 py-1.5 rounded-md font-mono text-xs transition ${
                selectedFile === 'all-in-one'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              ⭐ All-in-One.gs (Disarankan)
            </button>

            {MODULAR_SCRIPTS.map((script) => (
              <button
                key={script.fileName}
                onClick={() => setSelectedFile(script.fileName)}
                className={`px-2.5 py-1.5 rounded-md font-mono text-xs transition ${
                  selectedFile === script.fileName
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-semibold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {script.fileName}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition"
              title="Salin kode aktif"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Tersalin' : 'Salin'}</span>
            </button>
          </div>
        </div>

        {/* Code Description Notice */}
        <div className="bg-slate-900/50 px-4 py-2 text-xs text-slate-400 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span>
              {selectedFile === 'all-in-one'
                ? 'Paket Lengkap: Berisi Menu Kustom, FormGenerator, GradingEngine, ItemAnalysis, dan Cetak Rapor.'
                : MODULAR_SCRIPTS.find((s) => s.fileName === selectedFile)?.description}
            </span>
          </div>
          <span className="font-mono text-[11px] text-slate-500 hidden md:inline">Google Apps Script V8 Runtime</span>
        </div>

        {/* Code Content */}
        <div className="relative">
          <pre className="p-4 sm:p-6 text-slate-200 font-mono text-xs sm:text-[13px] leading-relaxed overflow-x-auto max-h-[550px] selection:bg-emerald-500 selection:text-slate-950">
            <code>{activeCode}</code>
          </pre>
        </div>
      </div>

      {/* Quick 4-Step Installation Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 text-slate-300 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm sm:text-base font-bold text-white flex items-center space-x-2">
            <span className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center text-xs font-bold">
              ?
            </span>
            <span>Cara Memasang Script Ini di Google Spreadsheet Anda</span>
          </h3>
          <button
            onClick={onOpenGuide}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center space-x-1"
          >
            <span>Lihat Panduan Bergambar</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60 space-y-1.5">
            <span className="text-emerald-400 font-mono font-bold">Langkah 1</span>
            <p className="font-semibold text-white">Buka Google Sheets</p>
            <p className="text-slate-400">Buka spreadsheet baru atau spreadsheet bank soal Anda di Google Drive.</p>
          </div>

          <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60 space-y-1.5">
            <span className="text-emerald-400 font-mono font-bold">Langkah 2</span>
            <p className="font-semibold text-white">Buka Apps Script</p>
            <p className="text-slate-400">Klik menu <strong>Ekstensi (Extensions)</strong> &gt; <strong>Apps Script</strong> di bilah atas spreadsheet.</p>
          </div>

          <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60 space-y-1.5">
            <span className="text-emerald-400 font-mono font-bold">Langkah 3</span>
            <p className="font-semibold text-white">Tempel (Paste) Kode</p>
            <p className="text-slate-400">Hapus isi file bawaan, lalu paste kode <strong>All-in-One.gs</strong> ini dan klik tombol Simpan (Ikon Disket).</p>
          </div>

          <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60 space-y-1.5">
            <span className="text-emerald-400 font-mono font-bold">Langkah 4</span>
            <p className="font-semibold text-white">Muat Ulang & Nikmati</p>
            <p className="text-slate-400">Kembali ke spreadsheet dan refresh halaman (F5). Menu kustom <strong>🎓 Asesmen Sumatif</strong> akan langsung muncul!</p>
          </div>
        </div>
      </div>
    </div>
  );
};
