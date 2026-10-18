/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { AdminScheduleView } from './components/AdminScheduleView';
import { StudentExamPortal } from './components/StudentExamPortal';
import { ScriptGeneratorView } from './components/ScriptGeneratorView';
import { QuestionBankView } from './components/QuestionBankView';
import { SimulatorLedgerView } from './components/SimulatorLedgerView';
import { ItemAnalysisView } from './components/ItemAnalysisView';
import { ReportCardView } from './components/ReportCardView';
import { TemplateView } from './components/TemplateView';
import { GuideModal } from './components/GuideModal';
import { PRESETS, INITIAL_SCHEDULES } from './data/mockData';
import { AppsScriptConfig } from './data/appsScriptTemplates';
import { QuestionItem, StudentSubmission, ExamSchedule } from './utils/assessmentLogic';

export default function App() {
  const [userRole, setUserRole] = useState<'ADMIN' | 'STUDENT'>('ADMIN');
  const [selectedPresetId, setSelectedPresetId] = useState<string>('matematika-smp-7');
  const currentPreset = PRESETS.find((p) => p.id === selectedPresetId) || PRESETS[0];

  const [activeTab, setActiveTab] = useState<string>('schedules');
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
  const [selectedStudentNisn, setSelectedStudentNisn] = useState<string>('');
  const [studentPrefilledToken, setStudentPrefilledToken] = useState<string>('MTK-7A');

  // Exam Schedules managed by admin
  const [schedules, setSchedules] = useState<ExamSchedule[]>(INITIAL_SCHEDULES);

  // Assessment config state
  const [config, setConfig] = useState<AppsScriptConfig>({
    schoolName: currentPreset.schoolName,
    examTitle: currentPreset.name,
    subject: currentPreset.subject,
    className: currentPreset.level,
    semester: currentPreset.semester,
    academicYear: currentPreset.academicYear,
    kktp: currentPreset.kktp,
    teacherName: currentPreset.teacherName,
    nip: currentPreset.nip,
  });

  // Question bank state
  const [questions, setQuestions] = useState<QuestionItem[]>(currentPreset.questions);

  // Submissions state
  const [submissions, setSubmissions] = useState<StudentSubmission[]>(currentPreset.sampleSubmissions);

  // Switch preset
  const handleSelectPreset = (id: string) => {
    setSelectedPresetId(id);
    const p = PRESETS.find((item) => item.id === id);
    if (p) {
      setConfig({
        schoolName: p.schoolName,
        examTitle: p.name,
        subject: p.subject,
        className: p.level,
        semester: p.semester,
        academicYear: p.academicYear,
        kktp: p.kktp,
        teacherName: p.teacherName,
        nip: p.nip,
      });
      setQuestions(p.questions);
      setSubmissions(p.sampleSubmissions);
      setSelectedStudentNisn(p.sampleSubmissions[0]?.nisn || '');
      setStudentPrefilledToken(p.accessCode);
    }
  };

  // Schedule handlers
  const handleAddSchedule = (sched: ExamSchedule) => {
    setSchedules((prev) => [sched, ...prev]);
  };

  const handleUpdateSchedule = (updated: ExamSchedule) => {
    setSchedules((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
  };

  const handleDeleteSchedule = (id: string) => {
    setSchedules((prev) => prev.filter((s) => s.id !== id));
  };

  const handleLaunchStudentTest = (accessCode: string) => {
    setStudentPrefilledToken(accessCode);
    setUserRole('STUDENT');
  };

  // Question handlers
  const handleAddQuestion = (q: QuestionItem) => {
    setQuestions((prev) => [...prev, q]);
  };

  const handleUpdateQuestion = (updated: QuestionItem) => {
    setQuestions((prev) => prev.map((q) => (q.id === updated.id ? updated : q)));
  };

  const handleDeleteQuestion = (id: number) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  // Submission handlers
  const handleAddSubmission = (sub: StudentSubmission) => {
    setSubmissions((prev) => [sub, ...prev]);
  };

  const handleStudentSubmit = (sub: StudentSubmission) => {
    setSubmissions((prev) => [sub, ...prev]);
  };

  const handleResetToSampleSubmissions = () => {
    const p = PRESETS.find((item) => item.id === selectedPresetId) || PRESETS[0];
    setSubmissions(p.sampleSubmissions);
  };

  const handleSelectStudentForReport = (studentNisn: string) => {
    setSelectedStudentNisn(studentNisn);
    setActiveTab('report');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Top Navigation */}
      <Navbar
        userRole={userRole}
        setUserRole={setUserRole}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedPresetId={selectedPresetId}
        onSelectPreset={handleSelectPreset}
        presets={PRESETS.map((p) => ({ id: p.id, name: p.name, level: p.level, subject: p.subject }))}
        onOpenGuide={() => setIsGuideOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {userRole === 'STUDENT' ? (
          <StudentExamPortal
            schedules={schedules}
            allQuestions={questions}
            onStudentSubmit={handleStudentSubmit}
            prefilledToken={studentPrefilledToken}
          />
        ) : (
          <>
            {activeTab === 'schedules' && (
              <AdminScheduleView
                schedules={schedules}
                onAddSchedule={handleAddSchedule}
                onUpdateSchedule={handleUpdateSchedule}
                onDeleteSchedule={handleDeleteSchedule}
                onLaunchStudentTest={handleLaunchStudentTest}
              />
            )}

            {activeTab === 'script' && (
              <ScriptGeneratorView
                config={config}
                onUpdateConfig={setConfig}
                onOpenGuide={() => setIsGuideOpen(true)}
              />
            )}

            {activeTab === 'questions' && (
              <QuestionBankView
                questions={questions}
                onAddQuestion={handleAddQuestion}
                onUpdateQuestion={handleUpdateQuestion}
                onDeleteQuestion={handleDeleteQuestion}
                subject={config.subject}
              />
            )}

            {activeTab === 'simulator' && (
              <SimulatorLedgerView
                questions={questions}
                submissions={submissions}
                kktp={config.kktp}
                onAddSubmission={handleAddSubmission}
                onSelectStudentForReport={handleSelectStudentForReport}
                onResetToSampleSubmissions={handleResetToSampleSubmissions}
              />
            )}

            {activeTab === 'analysis' && (
              <ItemAnalysisView
                questions={questions}
                submissions={submissions}
              />
            )}

            {activeTab === 'report' && (
              <ReportCardView
                questions={questions}
                submissions={submissions}
                config={config}
                selectedStudentNisn={selectedStudentNisn}
              />
            )}

            {activeTab === 'template' && (
              <TemplateView />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-xs text-slate-500 text-center print:hidden">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>
            ScriptGen Asesmen Sumatif &bull; Otomasi Google Apps Script, Jadwal Ujian, Token Login &amp; LJK Digital
          </p>
          <div className="flex items-center space-x-3 text-slate-400">
            <span>Mode Aktif: <strong className="text-emerald-400">{userRole === 'ADMIN' ? '👑 Panel Admin / Guru' : '🎓 Portal Siswa (LJK Digital)'}</strong></span>
            <span>&bull;</span>
            <button
              onClick={() => setUserRole(userRole === 'ADMIN' ? 'STUDENT' : 'ADMIN')}
              className="text-emerald-400 hover:underline font-semibold"
            >
              Ganti ke {userRole === 'ADMIN' ? 'Portal Siswa' : 'Panel Admin'}
            </button>
          </div>
        </div>
      </footer>

      {/* Step by Step Guide Modal */}
      <GuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
    </div>
  );
}
