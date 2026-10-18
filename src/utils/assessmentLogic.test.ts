import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateFinalScore,
  generateKurikulumMerdekaDescription,
  calculateItemAnalysis,
  validateExamAccess,
  gradeStudentLjk
} from './assessmentLogic.ts';
import type { QuestionItem, StudentSubmission, ExamSchedule } from './assessmentLogic.ts';

test('validateExamAccess checks login token and schedule status', () => {
  const schedule: ExamSchedule = {
    id: 'exam-1',
    subject: 'Matematika',
    className: 'VII-A',
    accessCode: 'SUMATIF7',
    examDate: '2024-11-20',
    startTime: '08:00',
    endTime: '09:30',
    durationMinutes: 90,
    questionCount: 20,
    pdfUrl: 'https://example.com/soal.pdf',
    pdfFileName: 'Soal_Sumatif_Matematika_VII.pdf',
    answerKeys: { 1: 'A', 2: 'B' },
    kktp: 75,
    isActive: true,
    schoolName: 'SMPN 1',
    teacherName: 'Guru MTK',
    nip: '123'
  };

  // Correct token
  const valid = validateExamAccess('SUMATIF7', schedule);
  assert.equal(valid.allowed, true);

  // Case-insensitive token
  const validLower = validateExamAccess('sumatif7', schedule);
  assert.equal(validLower.allowed, true);

  // Wrong token
  const invalid = validateExamAccess('WRONG', schedule);
  assert.equal(invalid.allowed, false);

  // Inactive exam
  const inactiveSchedule = { ...schedule, isActive: false };
  const blocked = validateExamAccess('SUMATIF7', inactiveSchedule);
  assert.equal(blocked.allowed, false);
});

test('gradeStudentLjk grades choices A-D against answer keys accurately', () => {
  const answerKeys: Record<number, 'A' | 'B' | 'C' | 'D'> = {
    1: 'A',
    2: 'C',
    3: 'D',
    4: 'B'
  };

  const studentAnswers = {
    1: 'A', // correct
    2: 'C', // correct
    3: 'B', // wrong (key is D)
    4: 'B'  // correct
  };

  const result = gradeStudentLjk(studentAnswers, answerKeys, 4);
  assert.equal(result.rawScore, 3);
  assert.equal(result.maxScore, 4);
  assert.equal(result.finalScore, 75); // 3/4 = 75%
  assert.equal(result.totalAnswered, 4);
  assert.equal(result.detail[2].isCorrect, false);
  assert.equal(result.detail[0].isCorrect, true);
});

test('calculateFinalScore accurately handles equal and weighted scoring', () => {
  const questions: QuestionItem[] = [
    {
      id: 1,
      tpCode: 'TP 1',
      tpDescription: 'Memahami bilangan bulat',
      question: 'Berapa hasil (-5) + 8?',
      options: ['A. -3', 'B. 3', 'C. 13', 'D. -13'],
      correctAnswer: 'B',
      weight: 2
    },
    {
      id: 2,
      tpCode: 'TP 1',
      tpDescription: 'Memahami bilangan bulat',
      question: 'Berapa hasil (-4) x (-3)?',
      options: ['A. -12', 'B. 7', 'C. 12', 'D. -7'],
      correctAnswer: 'C',
      weight: 3
    }
  ];

  const perfect = calculateFinalScore({ 1: 'B', 2: 'C' }, questions);
  assert.equal(perfect.rawScore, 5);
  assert.equal(perfect.maxScore, 5);
  assert.equal(perfect.finalScore, 100);
});
