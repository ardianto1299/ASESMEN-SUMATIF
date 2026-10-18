import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  Copy, 
  Check, 
  Download, 
  Table, 
  Sparkles,
  Info
} from 'lucide-react';
import { GOOGLE_SHEET_CSV_TEMPLATE } from '../data/appsScriptTemplates';

export const TemplateView: React.FC = () => {
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(GOOGLE_SHEET_CSV_TEMPLATE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleDownload = () => {
    const blob = new Blob([GOOGLE_SHEET_CSV_TEMPLATE], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Template_Bank_Soal_Asesmen_Sumatif.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const sheetTabs = [
    {
      name: 'Bank_Soal',
      purpose: 'Menampung kisi-kisi, butir soal, pilihan jawaban (A-E), kunci jawaban, bobot nilai, dan pembahasan.',
      status: 'Wajib Dibuat Pertama Kali (atau klik menu 5 di Spreadsheet)',
      color: 'bg-blue-500'
    },
    {
      name: 'Form Responses 1',
      purpose: 'Otomatis dibuat oleh Google Form ketika formulir quiz disambungkan ke spreadsheet.',
      status: 'Otomatis Terhubung',
      color: 'bg-purple-500'
    },
    {
      name: 'Leger_Nilai',
      purpose: 'Daftar rekap skor mentah, nilai akhir 0-100, status KKTP, dan narasi deskripsi Kurikulum Merdeka.',
      status: 'Dihasilkan Otomatis oleh Script (Menu 2)',
      color: 'bg-emerald-500'
    },
    {
      name: 'Analisis_Soal',
      purpose: 'Laporan psikometri soal: Tingkat Kesukaran (P), Daya Pembeda (D), dan status soal (Diterima / Revisi).',
      status: 'Dihasilkan Otomatis oleh Script (Menu 3)',
      color: 'bg-amber-500'
    },
    {
      name: 'Cetak_Rapor_Siswa',
      purpose: 'Format lembar hasil asesmen siap cetak / PDF untuk siswa perorangan lengkap dengan tanda tangan.',
      status: 'Dihasilkan Otomatis oleh Script (Menu 4)',
      color: 'bg-rose-500'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Struktur Tab &amp; Kolom Google Sheets</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Panduan arsitektur sheet agar Google Apps Script dapat membaca bank soal dan mengolah nilai tanpa kendala.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopy}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-300" />}
            <span>{copied ? 'Tersalin!' : 'Salin Header CSV'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition shadow-md shadow-emerald-500/20"
          >
            <Download className="w-4 h-4 text-slate-950" />
            <span>Unduh File CSV Template</span>
          </button>
        </div>
      </div>

      {/* Tabs Architecture Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sheetTabs.map((tab) => (
          <div
            key={tab.name}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-2 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className={`w-3 h-3 rounded-full ${tab.color}`} />
                <span className="font-bold text-sm text-slate-900 dark:text-white font-mono">{tab.name}</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {tab.purpose}
              </p>
            </div>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] font-medium text-slate-500 dark:text-slate-400">
              {tab.status}
            </div>
          </div>
        ))}
      </div>

      {/* Bank Soal Columns Specification Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Table className="w-4 h-4 text-emerald-500" />
            <span className="font-bold text-sm text-slate-900 dark:text-white">
              Spesifikasi 12 Kolom Tab "Bank_Soal"
            </span>
          </div>
          <span className="text-xs text-slate-400">Baris ke-1 wajib sebagai Header</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-2.5 px-4 w-16">Kolom</th>
                <th className="py-2.5 px-4 w-36">Nama Kolom</th>
                <th className="py-2.5 px-4 w-28">Tipe Data</th>
                <th className="py-2.5 px-4">Deskripsi &amp; Contoh Pengisian</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
              <tr>
                <td className="py-2.5 px-4 font-mono font-bold text-slate-500">A</td>
                <td className="py-2.5 px-4 font-mono font-semibold">No</td>
                <td className="py-2.5 px-4 text-xs text-slate-500">Angka</td>
                <td className="py-2.5 px-4 text-xs">Nomor urut butir soal (1, 2, 3, ...)</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-mono font-bold text-slate-500">B</td>
                <td className="py-2.5 px-4 font-mono font-semibold">Kode_TP</td>
                <td className="py-2.5 px-4 text-xs text-slate-500">Teks</td>
                <td className="py-2.5 px-4 text-xs">Kode Tujuan Pembelajaran (contoh: <code>TP 1</code>, <code>TP 2</code>)</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-mono font-bold text-slate-500">C</td>
                <td className="py-2.5 px-4 font-mono font-semibold">Deskripsi_TP</td>
                <td className="py-2.5 px-4 text-xs text-slate-500">Teks</td>
                <td className="py-2.5 px-4 text-xs">Uraian kompetensi TP untuk menyusun narasi rapor otomatis</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-mono font-bold text-slate-500">D</td>
                <td className="py-2.5 px-4 font-mono font-semibold">Butir_Soal</td>
                <td className="py-2.5 px-4 text-xs text-slate-500">Teks</td>
                <td className="py-2.5 px-4 text-xs">Pertanyaan atau stimulus soal</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-mono font-bold text-slate-500">E - H</td>
                <td className="py-2.5 px-4 font-mono font-semibold">Pilihan_A s/d D</td>
                <td className="py-2.5 px-4 text-xs text-slate-500">Teks</td>
                <td className="py-2.5 px-4 text-xs">Opsi pilihan ganda A, B, C, dan D</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-mono font-bold text-slate-500">I</td>
                <td className="py-2.5 px-4 font-mono font-semibold">Pilihan_E</td>
                <td className="py-2.5 px-4 text-xs text-slate-500">Teks (Opsional)</td>
                <td className="py-2.5 px-4 text-xs">Opsi E khusus untuk jenjang SMA/SMK (bisa dikosongkan untuk SD/SMP)</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-mono font-bold text-slate-500">J</td>
                <td className="py-2.5 px-4 font-mono font-semibold">Kunci_Jawaban</td>
                <td className="py-2.5 px-4 text-xs text-slate-500">Karakter</td>
                <td className="py-2.5 px-4 text-xs font-bold text-emerald-600">Huruf opsi yang benar: <code>A</code>, <code>B</code>, <code>C</code>, <code>D</code>, atau <code>E</code></td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-mono font-bold text-slate-500">K</td>
                <td className="py-2.5 px-4 font-mono font-semibold">Bobot_Nilai</td>
                <td className="py-2.5 px-4 text-xs text-slate-500">Angka</td>
                <td className="py-2.5 px-4 text-xs">Bobot poin soal (standar bernilai 1)</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-mono font-bold text-slate-500">L</td>
                <td className="py-2.5 px-4 font-mono font-semibold">Pembahasan</td>
                <td className="py-2.5 px-4 text-xs text-slate-500">Teks (Opsional)</td>
                <td className="py-2.5 px-4 text-xs">Umpan balik / penjelasan yang otomatis muncul di Google Form bagi siswa</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
