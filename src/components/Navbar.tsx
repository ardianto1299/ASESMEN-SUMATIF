import React from 'react';
import { 
  FileCode2, 
  HelpCircle,
  FileSpreadsheet,
  CheckCircle2,
  GraduationCap,
  Calendar,
  UserCheck,
  ShieldAlert,
  ArrowRightLeft
} from 'lucide-react';

interface NavbarProps {
  userRole: 'ADMIN' | 'STUDENT';
  setUserRole: (role: 'ADMIN' | 'STUDENT') => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedPresetId: string;
  onSelectPreset: (id: string) => void;
  presets: Array<{ id: string; name: string; level: string; subject: string }>;
  onOpenGuide: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  userRole,
  setUserRole,
  activeTab,
  setActiveTab,
  selectedPresetId,
  onSelectPreset,
  presets,
  onOpenGuide,
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Branding */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-tight text-white">ScriptGen Asesmen</span>
                <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hidden sm:inline">
                  Kurikulum Merdeka
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Jadwal Ujian, Token Login, Naskah PDF &amp; LJK Digital
              </p>
            </div>
          </div>

          {/* Role Switcher & Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Role Toggle Button */}
            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
              <button
                onClick={() => setUserRole('ADMIN')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition ${
                  userRole === 'ADMIN'
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>👑 Panel Admin</span>
              </button>
              <button
                onClick={() => setUserRole('STUDENT')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition ${
                  userRole === 'STUDENT'
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>🎓 Portal Siswa (LJK)</span>
              </button>
            </div>

            {userRole === 'ADMIN' && (
              <button
                onClick={onOpenGuide}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white transition border border-slate-700 hidden md:flex"
                title="Panduan Pemasangan di Google Sheets"
              >
                <HelpCircle className="w-4 h-4 text-emerald-400" />
                <span>Panduan Pasang</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab Navigation for Admin */}
        {userRole === 'ADMIN' && (
          <div className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2 no-scrollbar border-t border-slate-800/80 text-xs sm:text-sm">
            <button
              onClick={() => setActiveTab('schedules')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all ${
                activeTab === 'schedules'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Jadwal, Token &amp; Naskah PDF</span>
            </button>

            <button
              onClick={() => setActiveTab('script')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all ${
                activeTab === 'script'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <FileCode2 className="w-4 h-4" />
              <span>Kode Apps Script (.gs)</span>
            </button>

            <button
              onClick={() => setActiveTab('questions')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all ${
                activeTab === 'questions'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Kisi-kisi &amp; Bank Soal</span>
            </button>

            <button
              onClick={() => setActiveTab('simulator')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all ${
                activeTab === 'simulator'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Leger Nilai &amp; Monitoring</span>
            </button>

            <button
              onClick={() => setActiveTab('analysis')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all ${
                activeTab === 'analysis'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              <span>Analisis Butir Soal</span>
            </button>

            <button
              onClick={() => setActiveTab('report')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all ${
                activeTab === 'report'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span>Slip / Lembar Hasil Siswa</span>
            </button>

            <button
              onClick={() => setActiveTab('template')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all ${
                activeTab === 'template'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span>Struktur Spreadsheet</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
