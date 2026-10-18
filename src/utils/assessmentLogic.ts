/**
 * Core business logic for Asesmen Sumatif (Kurikulum Merdeka / K13)
 * Decoupled for pure testing and reuse in both UI and Apps Script generation.
 */

export interface ExamSchedule {
  id: string;
  subject: string;
  className: string;
  accessCode: string; // Token login siswa (e.g. "SUMATIF-7A")
  examDate: string; // YYYY-MM-DD
  startTime: string; // "07:30"
  endTime: string; // "09:00"
  durationMinutes: number;
  questionCount: number; // Ditentukan oleh admin (misal 10, 20, 25, 40)
  pdfUrl: string; // Link download / preview PDF soal
  pdfFileName: string;
  answerKeys: Record<number, 'A' | 'B' | 'C' | 'D'>; // Kunci jawaban No 1 -> "A"
  kktp: number; // Nilai kriteria ketercapaian (default 75)
  isActive: boolean;
  schoolName: string;
  teacherName: string;
  nip: string;
}

export interface QuestionItem {
  id: number;
  tpCode: string; // e.g. "TP 1", "TP 2"
  tpDescription: string;
  question: string;
  options: string[]; // [A, B, C, D]
  correctAnswer: string; // "A", "B", "C", "D"
  weight: number; // default 1
  explanation?: string;
}

export interface StudentSubmission {
  nisn: string;
  name: string;
  className: string;
  answers: Record<number, string>; // questionId -> student's answer "A", "B", "C", "D"
  timestamp?: string;
  examId?: string;
  finalScore?: number;
  rawScore?: number;
}

export interface StudentResult {
  nisn: string;
  name: string;
  className: string;
  totalCorrect: number;
  totalQuestions: number;
  rawScore: number;
  maxRawScore: number;
  finalScore: number;
  isPassing: boolean;
  tpBreakdown: Record<string, { total: number; correct: number; percentage: number }>;
  kurikulumMerdekaDescription: string;
}

export interface ItemAnalysisResult {
  questionId: number;
  tpCode: string;
  questionSnippet: string;
  correctAnswer: string;
  totalAttempts: number;
  correctCount: number;
  difficultyIndex: number;
  difficultyLabel: 'Mudah' | 'Sedang' | 'Sukar';
  discriminationIndex: number;
  discriminationLabel: 'Sangat Baik' | 'Baik' | 'Cukup' | 'Jelek / Ditolak';
  status: 'Diterima' | 'Revisi' | 'Ditolak';
  distractorCounts: Record<string, number>;
}

/**
 * Validasi token akses ujian dari siswa terhadap jadwal ujian
 */
export function validateExamAccess(
  token: string,
  schedule: ExamSchedule
): { allowed: boolean; message: string } {
  if (!token || !token.trim()) {
    return { allowed: false, message: 'Kode akses ujian tidak boleh kosong.' };
  }

  if (!schedule.isActive) {
    return { allowed: false, message: 'Ujian ini sedang dinonaktifkan oleh Admin.' };
  }

  const cleanToken = token.trim().toUpperCase();
  const cleanAccessCode = schedule.accessCode.trim().toUpperCase();

  if (cleanToken !== cleanAccessCode) {
    return { allowed: false, message: 'Kode akses ujian (Token) salah. Silakan tanyakan kepada pengawas/admin.' };
  }

  return { allowed: true, message: 'Kode akses valid. Silakan mulai mengerjakan ujian.' };
}

/**
 * Koreksi jawaban LJK digital siswa pilihan A-D terhadap kunci jawaban admin
 */
export function gradeStudentLjk(
  studentAnswers: Record<number, string>,
  answerKeys: Record<number, string>,
  questionCount: number
): {
  rawScore: number;
  maxScore: number;
  finalScore: number;
  totalAnswered: number;
  detail: Array<{ no: number; studentAnswer: string; correctAnswer: string; isCorrect: boolean }>;
} {
  let rawScore = 0;
  let totalAnswered = 0;
  const detail: Array<{ no: number; studentAnswer: string; correctAnswer: string; isCorrect: boolean }> = [];

  for (let i = 1; i <= questionCount; i++) {
    const studentAns = (studentAnswers[i] || '').trim().toUpperCase();
    const correctAns = (answerKeys[i] || '').trim().toUpperCase();

    if (studentAns) totalAnswered++;

    const isCorrect = studentAns !== '' && studentAns === correctAns;
    if (isCorrect) {
      rawScore++;
    }

    detail.push({
      no: i,
      studentAnswer: studentAns,
      correctAnswer: correctAns,
      isCorrect
    });
  }

  const maxScore = questionCount;
  const finalScore = maxScore > 0 ? Math.round((rawScore / maxScore) * 1000) / 10 : 0;

  return {
    rawScore,
    maxScore,
    finalScore,
    totalAnswered,
    detail
  };
}

/**
 * Calculate scaled final score out of 100 based on question weights.
 */
export function calculateFinalScore(
  answers: Record<number, string>,
  questions: QuestionItem[]
): { rawScore: number; maxScore: number; finalScore: number; correctCount: number } {
  let rawScore = 0;
  let maxScore = 0;
  let correctCount = 0;

  for (const q of questions) {
    maxScore += q.weight;
    const studentAns = (answers[q.id] || '').trim().toUpperCase();
    const correctAns = q.correctAnswer.trim().toUpperCase();
    if (studentAns === correctAns) {
      rawScore += q.weight;
      correctCount++;
    }
  }

  const finalScore = maxScore > 0 ? Math.round((rawScore / maxScore) * 1000) / 10 : 0;
  return { rawScore, maxScore, finalScore, correctCount };
}

/**
 * Evaluates student performance across different Tujuan Pembelajaran (TP)
 * and produces a descriptive narrative for Kurikulum Merdeka report cards.
 */
export function generateKurikulumMerdekaDescription(
  tpBreakdown: Record<string, { total: number; correct: number; percentage: number; description?: string }>,
  finalScore: number,
  kktp: number
): string {
  const tpList = Object.entries(tpBreakdown).map(([code, data]) => ({
    code,
    description: data.description || code,
    percentage: data.percentage,
  }));

  if (tpList.length === 0) {
    return finalScore >= kktp
      ? 'Menunjukkan penguasaan materi asesmen dengan baik.'
      : 'Perlu bimbingan intensif dalam menguasai materi asesmen.';
  }

  // Sort by mastery
  tpList.sort((a, b) => b.percentage - a.percentage);

  const highest = tpList.filter((t) => t.percentage >= 70);
  const lowest = tpList.filter((t) => t.percentage < 60);

  let desc = '';
  if (highest.length > 0) {
    const highestNames = highest.slice(0, 2).map((t) => `${t.code} (${t.description})`).join(' dan ');
    desc += `Menunjukkan penguasaan yang sangat baik dalam mencapai ${highestNames}.`;
  } else {
    desc += `Menunjukkan pemahaman dasar terhadap materi yang diujikan.`;
  }

  if (lowest.length > 0) {
    const lowestNames = lowest.slice(0, 2).map((t) => `${t.code} (${t.description})`).join(' dan ');
    desc += ` Namun masih perlu penguatan dan pendampingan lebih lanjut dalam ${lowestNames}.`;
  } else if (finalScore >= 90) {
    desc += ` Pertahankan prestasi dan siap untuk materi pengayaan tingkat lanjut.`;
  }

  return desc;
}

/**
 * Compute Item Analysis (Analisis Butir Soal):
 * - Tingkat Kesukaran (P = B / N)
 * - Daya Pembeda (D = (B_A - B_B) / (0.5 * N_cohort)) using upper 27% & lower 27%
 */
export function calculateItemAnalysis(
  questions: QuestionItem[],
  submissions: StudentSubmission[]
): ItemAnalysisResult[] {
  if (submissions.length === 0) {
    return questions.map((q) => ({
      questionId: q.id,
      tpCode: q.tpCode,
      questionSnippet: q.question.slice(0, 50),
      correctAnswer: q.correctAnswer,
      totalAttempts: 0,
      correctCount: 0,
      difficultyIndex: 0,
      difficultyLabel: 'Sedang',
      discriminationIndex: 0,
      discriminationLabel: 'Cukup',
      status: 'Revisi',
      distractorCounts: {},
    }));
  }

  const scoredStudents = submissions.map((s) => {
    const scoreRes = calculateFinalScore(s.answers, questions);
    return { submission: s, score: scoreRes.finalScore };
  });

  scoredStudents.sort((a, b) => b.score - a.score);

  const nTotal = scoredStudents.length;
  const groupSize = Math.max(1, Math.round(nTotal * 0.27));
  const upperGroup = scoredStudents.slice(0, groupSize);
  const lowerGroup = scoredStudents.slice(-groupSize);

  return questions.map((q) => {
    let totalCorrect = 0;
    const distractorCounts: Record<string, number> = {};

    for (const opt of q.options) {
      const letter = opt.charAt(0).toUpperCase();
      distractorCounts[letter] = 0;
    }

    for (const s of submissions) {
      const ans = (s.answers[q.id] || '').trim().toUpperCase();
      if (ans) {
        distractorCounts[ans] = (distractorCounts[ans] || 0) + 1;
      }
      if (ans === q.correctAnswer.trim().toUpperCase()) {
        totalCorrect++;
      }
    }

    const P = Math.round((totalCorrect / nTotal) * 100) / 100;
    let difficultyLabel: 'Mudah' | 'Sedang' | 'Sukar' = 'Sedang';
    if (P > 0.7) difficultyLabel = 'Mudah';
    else if (P < 0.3) difficultyLabel = 'Sukar';

    let upperCorrect = 0;
    for (const u of upperGroup) {
      if ((u.submission.answers[q.id] || '').trim().toUpperCase() === q.correctAnswer.trim().toUpperCase()) {
        upperCorrect++;
      }
    }

    let lowerCorrect = 0;
    for (const l of lowerGroup) {
      if ((l.submission.answers[q.id] || '').trim().toUpperCase() === q.correctAnswer.trim().toUpperCase()) {
        lowerCorrect++;
      }
    }

    const D = Math.round(((upperCorrect - lowerCorrect) / groupSize) * 100) / 100;
    let discriminationLabel: 'Sangat Baik' | 'Baik' | 'Cukup' | 'Jelek / Ditolak' = 'Cukup';
    let status: 'Diterima' | 'Revisi' | 'Ditolak' = 'Revisi';

    if (D >= 0.4) {
      discriminationLabel = 'Sangat Baik';
      status = 'Diterima';
    } else if (D >= 0.3) {
      discriminationLabel = 'Baik';
      status = 'Diterima';
    } else if (D >= 0.2) {
      discriminationLabel = 'Cukup';
      status = 'Revisi';
    } else {
      discriminationLabel = 'Jelek / Ditolak';
      status = 'Ditolak';
    }

    return {
      questionId: q.id,
      tpCode: q.tpCode,
      questionSnippet: q.question.slice(0, 60) + (q.question.length > 60 ? '...' : ''),
      correctAnswer: q.correctAnswer,
      totalAttempts: nTotal,
      correctCount: totalCorrect,
      difficultyIndex: P,
      difficultyLabel,
      discriminationIndex: D,
      discriminationLabel,
      status,
      distractorCounts,
    };
  });
}
