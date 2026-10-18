import React from 'react';
import { 
  X, 
  CheckCircle, 
  ExternalLink, 
  HelpCircle, 
  ShieldAlert, 
  Key, 
  Terminal, 
  FileCheck2,
  AlertCircle
} from 'lucide-react';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Panduan Pemasangan Google Apps Script Asesmen Sumatif
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Langkah mudah menghubungkan script otomasi ke Google Spreadsheet Anda
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            aria-label="Tutup Panduan"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Steps */}
        <div className="space-y-4 text-xs sm:text-sm">
          <div className="flex items-start space-x-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
            <span className="w-7 h-7 rounded-full bg-emerald-500 text-slate-950 font-bold flex items-center justify-center shrink-0 text-xs">
              1
            </span>
            <div className="space-y-1">
              <h4 className="font-bold text-slate-900 dark:text-white">Buka Google Sheets &amp; Ekstensi</h4>
              <p className="text-slate-600 dark:text-slate-300">
                Buka file Google Sheets baru atau lembar bank soal Anda di Google Drive. Pada menu atas, klik <strong>Ekstensi (Extensions)</strong> &gt; pilih <strong>Apps Script</strong>. Tab baru editor skrip Google akan terbuka.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
            <span className="w-7 h-7 rounded-full bg-emerald-500 text-slate-950 font-bold flex items-center justify-center shrink-0 text-xs">
              2
            </span>
            <div className="space-y-1">
              <h4 className="font-bold text-slate-900 dark:text-white">Salin &amp; Tempel Kode Script</h4>
              <p className="text-slate-600 dark:text-slate-300">
                Di editor Apps Script, buka file <code className="bg-slate-200 dark:bg-slate-700 px-1 py-0.5 rounded text-emerald-600 dark:text-emerald-400 font-mono">Code.gs</code>. Hapus teks bawaan <code className="font-mono text-slate-500">function myFunction() ...</code>, lalu tempelkan (Paste) seluruh kode dari tombol <strong>"Salin Kode Script"</strong> pada aplikasi ini.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
            <span className="w-7 h-7 rounded-full bg-emerald-500 text-slate-950 font-bold flex items-center justify-center shrink-0 text-xs">
              3
            </span>
            <div className="space-y-1">
              <h4 className="font-bold text-slate-900 dark:text-white">Simpan Script (Save Project)</h4>
              <p className="text-slate-600 dark:text-slate-300">
                Klik ikon <strong>Simpan (Disket)</strong> atau tekan <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 font-mono text-xs">Ctrl + S</kbd> (<kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 font-mono text-xs">Cmd + S</kbd> di Mac). Anda juga dapat memberi nama proyek, misal <em>"Otomasi Asesmen Sumatif"</em>.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
            <span className="w-7 h-7 rounded-full bg-emerald-500 text-slate-950 font-bold flex items-center justify-center shrink-0 text-xs">
              4
            </span>
            <div className="space-y-1">
              <h4 className="font-bold text-slate-900 dark:text-white">Muat Ulang (Refresh) Google Sheets</h4>
              <p className="text-slate-600 dark:text-slate-300">
                Kembali ke tab Google Sheets Anda dan muat ulang halaman (tekan <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 font-mono text-xs">F5</kbd>). Dalam 2-4 detik, menu kustom baru bernama <strong>🎓 Asesmen Sumatif</strong> akan muncul otomatis di sebelah menu Bantuan (Help)!
              </p>
            </div>
          </div>
        </div>

        {/* Authorization Note */}
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 space-y-2 text-xs">
          <div className="flex items-center space-x-2 text-amber-800 dark:text-amber-300 font-bold">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>Penting: Mengizinkan Otorisasi (Hanya Sekali Pertama Kali)</span>
          </div>
          <p className="text-amber-900/80 dark:text-amber-200/80 leading-relaxed">
            Saat pertama kali mengklik menu di Google Sheets (misal: "Buat Google Form"), Google akan meminta izin akses untuk membuat Form dan membaca Sheet Anda.
          </p>
          <ol className="list-decimal list-inside space-y-1 text-amber-900 dark:text-amber-200">
            <li>Klik tombol <strong>Lanjutkan (Continue)</strong>.</li>
            <li>Pilih akun Google Anda.</li>
            <li>Klik <strong>Lanjutan (Advanced)</strong> di bagian bawah &gt; pilih <strong>Buka Proyek (tidak aman) / Go to project (unsafe)</strong>.</li>
            <li>Klik <strong>Izinkan (Allow)</strong>. Script kini siap beroperasi 100%!</li>
          </ol>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold text-xs sm:text-sm hover:opacity-90 transition"
          >
            Saya Mengerti &amp; Siap Memasang
          </button>
        </div>
      </div>
    </div>
  );
};
