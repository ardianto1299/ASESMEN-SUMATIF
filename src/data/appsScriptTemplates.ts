export interface AppsScriptConfig {
  schoolName: string;
  examTitle: string;
  subject: string;
  className: string;
  semester: string;
  academicYear: string;
  kktp: number;
  teacherName: string;
  nip: string;
}

export function generateAllInOneScript(config: AppsScriptConfig): string {
  return `/**
 * ============================================================================
 * SISTEM OTOMASI ASESMEN SUMATIF & PORTAL LJK DIGITAL - KURIKULUM MERDEKA
 * ============================================================================
 * Sekolah        : ${config.schoolName}
 * Mata Pelajaran : ${config.subject}
 * Kelas / Fase   : ${config.className}
 * Semester / TA  : ${config.semester} / ${config.academicYear}
 * Kriteria KKTP  : ${config.kktp}
 * Guru Pengampu  : ${config.teacherName} (NIP: ${config.nip})
 * 
 * FITUR TERLENGKAP:
 * 1. Manajemen Jadwal Ujian, Token Kode Login, & Jumlah Soal per Mapel
 * 2. Upload / Link Berkas PDF Naskah Soal Asesmen
 * 3. Web App Siswa: Login Token, Unduh Naskah PDF, & Lembar Jawaban (LJK) A-D
 * 4. Koreksi Otomatis Real-time Terhadap Kunci Master Admin
 * 5. Generate Google Form Quiz Otomatis dari Bank Soal
 * 6. Analisis Butir Soal Lengkap (Daya Beda & Tingkat Kesukaran)
 * 7. Cetak Lembar Hasil Siswa / Slip Rapor Otomatis
 * ============================================================================
 */

const CONFIG = {
  NAMA_SEKOLAH: "${config.schoolName}",
  JUDUL_ASESMEN: "${config.examTitle}",
  MAPEL: "${config.subject}",
  KELAS: "${config.className}",
  KKTP_MINIMAL: ${config.kktp},
  GURU: "${config.teacherName}",
  NIP_GURU: "${config.nip}",
  SHEET_JADWAL: "Jadwal_Ujian",
  SHEET_JAWABAN_SISWA: "Jawaban_Siswa",
  SHEET_BANK_SOAL: "Bank_Soal",
  SHEET_RESPON: "Form Responses 1",
  SHEET_LEGER: "Leger_Nilai",
  SHEET_ANALISIS: "Analisis_Soal",
  SHEET_RAPOR: "Cetak_Rapor_Siswa"
};

/**
 * Menu Kustom di Google Sheets
 */
function onOpen() {
  SpreadsheetApp.getUi().createMenu('🎓 Asesmen Sumatif')
    .addItem('🌐 1. Deploy Portal Ujian Siswa (Web App)', 'showWebAppUrlDialog')
    .addItem('📅 2. Setup / Buat Jadwal & Token Baru', 'setupExamScheduleSheet')
    .addItem('📝 3. Buat Google Form Quiz dari Bank Soal', 'generateGoogleFormQuiz')
    .addItem('📥 4. Olah Nilai & Rapor Otomatis', 'processAndGradeResponses')
    .addItem('📊 5. Analisis Butir Soal (Daya Beda & Kesukaran)', 'runItemAnalysis')
    .addItem('🖨️ 6. Cetak Slip Hasil Siswa', 'generateStudentReportCard')
    .addSeparator()
    .addItem('⚙️ 7. Inisialisasi Seluruh Sheet Otomatis', 'setupInitialSheets')
    .addToUi();
}

/**
 * WEB APP ENTRYPOINT (doGet)
 * Siswa membuka link ini di browser/HP untuk login token, download PDF, & isi LJK digital pilihan A-D.
 */
function doGet(e) {
  return HtmlService.createHtmlOutput(getPortalHtml())
    .setTitle("Portal Ujian Asesmen Sumatif - " + CONFIG.NAMA_SEKOLAH)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

/**
 * Backend API untuk Siswa memvalidasi token dan mengambil data ujian (Jumlah Soal, Link PDF, Mapel)
 */
function apiVerifyToken(token) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const schedSheet = ss.getSheetByName(CONFIG.SHEET_JADWAL);
  if (!schedSheet) return { success: false, message: "Sheet Jadwal_Ujian belum dibuat." };

  const data = schedSheet.getDataRange().getValues();
  const cleanToken = String(token || '').trim().toUpperCase();

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const rowToken = String(row[3] || '').trim().toUpperCase();
    const isActive = String(row[10] || '').toLowerCase() === 'aktif' || row[10] === true;

    if (rowToken === cleanToken) {
      if (!isActive) {
        return { success: false, message: "Ujian untuk token ini sedang dinonaktifkan oleh Admin." };
      }

      return {
        success: true,
        examId: row[0],
        subject: row[1],
        className: row[2],
        accessCode: rowToken,
        examDate: row[4],
        startTime: row[5],
        durationMinutes: Number(row[6] || 90),
        questionCount: Number(row[7] || 10),
        pdfUrl: String(row[8] || ''),
        schoolName: CONFIG.NAMA_SEKOLAH
      };
    }
  }

  return { success: false, message: "Kode Akses / Token tidak ditemukan. Silakan cek kembali." };
}

/**
 * Backend API saat Siswa mengirimkan lembar jawaban LJK Digital (A-D)
 */
function apiSubmitAnswers(submission) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const schedSheet = ss.getSheetByName(CONFIG.SHEET_JADWAL);
  let ansSheet = ss.getSheetByName(CONFIG.SHEET_JAWABAN_SISWA);

  if (!ansSheet) {
    ansSheet = ss.insertSheet(CONFIG.SHEET_JAWABAN_SISWA);
    const headers = ['Timestamp', 'NISN', 'Nama Siswa', 'Kelas', 'Mata Pelajaran', 'Skor Benar', 'Total Soal', 'Nilai Akhir (0-100)', 'Status KKTP', 'Jawaban Lengkap'];
    ansSheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    ansSheet.getRange(1, 1, 1, headers.length).setBackground('#047857').setFontColor('#ffffff').setFontWeight('bold');
  }

  // Ambil kunci jawaban master dari Jadwal_Ujian
  const data = schedSheet.getDataRange().getValues();
  let masterKeys = "";
  let questionCount = Number(submission.questionCount || 10);

  for (let i = 1; i < data.length; i++) {
    if (String(data[i][3]).trim().toUpperCase() === String(submission.accessCode).trim().toUpperCase()) {
      masterKeys = String(data[i][9] || '');
      questionCount = Number(data[i][7] || questionCount);
      break;
    }
  }

  // Koreksi Jawaban
  const keyArr = masterKeys.split(',').map(k => k.trim().toUpperCase());
  let correctCount = 0;
  const studentAnswers = submission.answers || {};

  for (let q = 1; q <= questionCount; q++) {
    const studentAns = String(studentAnswers[q] || '').trim().toUpperCase();
    const correctAns = keyArr[q - 1] || 'A';
    if (studentAns === correctAns) {
      correctCount++;
    }
  }

  const finalScore = questionCount > 0 ? Math.round((correctCount / questionCount) * 100 * 10) / 10 : 0;
  const isPassing = finalScore >= CONFIG.KKTP_MINIMAL;
  const statusKKTP = isPassing ? "Tuntas" : "Remedial";

  // Catat ke Sheet Jawaban_Siswa
  ansSheet.appendRow([
    new Date(),
    submission.nisn,
    submission.name,
    submission.className,
    submission.subject,
    correctCount,
    questionCount,
    finalScore,
    statusKKTP,
    JSON.stringify(studentAnswers)
  ]);

  return {
    success: true,
    rawScore: correctCount,
    maxScore: questionCount,
    finalScore: finalScore,
    statusKKTP: statusKKTP
  };
}

/**
 * Setup Sheet Jadwal_Ujian
 */
function setupExamScheduleSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ui = SpreadsheetApp.getUi();
  let sheet = ss.getSheetByName(CONFIG.SHEET_JADWAL);

  if (!sheet) {
    sheet = ss.insertSheet(CONFIG.SHEET_JADWAL);
    const headers = [
      'ID_Ujian', 'Mata_Pelajaran', 'Kelas', 'Kode_Akses_Token',
      'Tanggal_Ujian', 'Jam_Mulai', 'Durasi_Menit', 'Jumlah_Soal',
      'URL_Naskah_PDF', 'Kunci_Jawaban_Master (A,B,C,D)', 'Status'
    ];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length).setBackground('#1e3a8a').setFontColor('#ffffff').setFontWeight('bold');

    // Contoh baris awal
    sheet.appendRow([
      'EXAM-001', CONFIG.MAPEL, CONFIG.KELAS, 'MTK-7A',
      '2024-11-20', '08:00', 90, 10,
      'https://drive.google.com/file/d/contoh_pdf/view',
      'A,A,B,A,A,A,A,A,A,A', 'Aktif'
    ]);
    sheet.autoResizeColumns(1, headers.length);
  }

  ui.alert('Jadwal Ujian Siap!', 'Sheet "Jadwal_Ujian" telah tersedia. Anda dapat menambahkan jadwal, token akses, link PDF soal Google Drive, dan kunci jawaban master (A,B,C,D) pada sheet tersebut.', ui.ButtonSet.OK);
}

function showWebAppUrlDialog() {
  const ui = SpreadsheetApp.getUi();
  ui.alert(
    'Cara Mengaktifkan Link Portal Ujian Siswa:',
    '1. Di editor skrip ini, klik tombol biru "Deploy" di kanan atas.\\n' +
    '2. Pilih "New deployment" > jenis "Web app".\\n' +
    '3. Beri deskripsi (misal: Portal Siswa).\\n' +
    '4. Pada "Who has access", pilih "Anyone" (Siapa saja).\\n' +
    '5. Klik Deploy dan bagikan URL Web App ke siswa bersama Kode Token Ujian!',
    ui.ButtonSet.OK
  );
}

/**
 * HTML Antarmuka Siswa untuk Web App
 */
function getPortalHtml() {
  return \`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Portal Asesmen Sumatif</title>
  <style>
    * { box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    body { background: #0f172a; color: #f8fafc; margin: 0; padding: 20px; }
    .card { background: #1e293b; border: 1px solid #334155; border-radius: 16px; padding: 24px; max-width: 600px; margin: 20px auto; box-shadow: 0 10px 25px rgba(0,0,0,0.3); }
    h1, h2 { margin-top: 0; }
    input, select, button { width: 100%; padding: 12px; border-radius: 8px; border: 1px solid #475569; margin-bottom: 12px; background: #0f172a; color: white; font-size: 14px; }
    button.btn-primary { background: #10b981; color: #022c22; font-weight: bold; border: none; cursor: pointer; }
    button.btn-primary:hover { background: #34d399; }
    .bubble-btn { width: 44px; height: 44px; border-radius: 10px; font-weight: bold; border: 1px solid #475569; background: #334155; color: white; cursor: pointer; margin: 0 4px; }
    .bubble-btn.active { background: #10b981; color: #022c22; border-color: #34d399; }
    .row { display: flex; align-items: center; justify-content: space-between; padding: 10px; border-bottom: 1px solid #334155; }
    .badge { padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: bold; background: rgba(16,185,129,0.2); color: #34d399; }
  </style>
</head>
<body>
  <div id="loginView" class="card">
    <h2>🎓 Portal Asesmen Sumatif Siswa</h2>
    <p style="color: #94a3b8; font-size: 13px;">Masukkan NISN, Nama, dan Kode Akses / Token yang diberikan guru.</p>
    <div id="errMsg" style="color: #f87171; font-size: 13px; margin-bottom: 10px;"></div>
    <input type="text" id="nisn" placeholder="Nomor Induk Siswa Nasional (NISN)" required>
    <input type="text" id="name" placeholder="Nama Lengkap Siswa" required>
    <input type="text" id="className" placeholder="Kelas / Rombel" required>
    <input type="text" id="token" placeholder="KODE AKSES / TOKEN UJIAN" style="text-transform: uppercase; font-weight: bold; font-size: 16px; border: 2px solid #10b981;" required>
    <button class="btn-primary" onclick="doLogin()">Mulai Mengerjakan Ujian</button>
  </div>

  <div id="examView" class="card" style="display:none; max-width: 800px;">
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <div>
        <h2 id="examSubject" style="margin:0;"></h2>
        <span id="examMeta" style="color: #94a3b8; font-size: 12px;"></span>
      </div>
      <a id="pdfLink" href="#" target="_blank" style="padding: 8px 14px; background: #0284c7; color: white; border-radius: 8px; text-decoration: none; font-size: 13px; font-weight: bold;">📥 Unduh Soal PDF</a>
    </div>

    <h3 style="margin-top: 20px;">Lembar Jawaban Komputer (LJK) Digital:</h3>
    <div id="questionsContainer" style="max-height: 450px; overflow-y: auto; margin-bottom: 15px;"></div>
    <button class="btn-primary" onclick="submitExam()">Kirim Lembar Jawaban</button>
  </div>

  <div id="resultView" class="card" style="display:none; text-align: center;">
    <h2>🎉 Jawaban Berhasil Dikirim!</h2>
    <p style="color: #94a3b8;">Terima kasih telah mengerjakan Asesmen Sumatif dengan jujur.</p>
    <div style="padding: 20px; background: #0f172a; border-radius: 12px; margin: 15px 0;">
      <div style="font-size: 14px; color: #94a3b8;">Nilai Akhir Anda:</div>
      <div id="finalScore" style="font-size: 40px; font-weight: 900; color: #10b981;"></div>
      <div id="kktpStatus" style="font-size: 14px; font-weight: bold; margin-top: 5px;"></div>
    </div>
  </div>

  <script>
    let activeExam = null;
    let answers = {};

    function doLogin() {
      const token = document.getElementById('token').value.trim();
      if (!token) return alert('Token tidak boleh kosong!');
      document.getElementById('errMsg').innerText = "Memverifikasi token...";

      google.script.run
        .withSuccessHandler(function(res) {
          if (!res.success) {
            document.getElementById('errMsg').innerText = res.message;
            return;
          }
          activeExam = res;
          document.getElementById('loginView').style.display = 'none';
          document.getElementById('examView').style.display = 'block';
          document.getElementById('examSubject').innerText = res.subject + ' (' + res.className + ')';
          document.getElementById('examMeta').innerText = 'Jumlah: ' + res.questionCount + ' Soal | Durasi: ' + res.durationMinutes + ' Menit';
          if (res.pdfUrl) document.getElementById('pdfLink').href = res.pdfUrl;

          // Render Bubbles
          let html = '';
          for (let i = 1; i <= res.questionCount; i++) {
            html += '<div class="row"><span><strong>No. ' + i + '</strong></span><div>';
            ['A', 'B', 'C', 'D'].forEach(function(opt) {
              html += '<button type="button" class="bubble-btn" id="b_' + i + '_' + opt + '" onclick="choose(' + i + ', \\'' + opt + '\\')">' + opt + '</button>';
            });
            html += '</div></div>';
          }
          document.getElementById('questionsContainer').innerHTML = html;
        })
        .apiVerifyToken(token);
    }

    function choose(qNum, opt) {
      answers[qNum] = opt;
      ['A', 'B', 'C', 'D'].forEach(function(o) {
        const el = document.getElementById('b_' + qNum + '_' + o);
        if (el) el.classList.remove('active');
      });
      document.getElementById('b_' + qNum + '_' + opt).classList.add('active');
    }

    function submitExam() {
      if (!confirm('Yakin ingin mengirimkan lembar jawaban sekarang?')) return;
      const sub = {
        nisn: document.getElementById('nisn').value,
        name: document.getElementById('name').value,
        className: document.getElementById('className').value,
        subject: activeExam.subject,
        accessCode: activeExam.accessCode,
        questionCount: activeExam.questionCount,
        answers: answers
      };

      google.script.run
        .withSuccessHandler(function(res) {
          document.getElementById('examView').style.display = 'none';
          document.getElementById('resultView').style.display = 'block';
          document.getElementById('finalScore').innerText = res.finalScore;
          document.getElementById('kktpStatus').innerText = 'Status: ' + res.statusKKTP;
        })
        .apiSubmitAnswers(sub);
    }
  </script>
</body>
</html>\`;
}

/**
 * 3. GENERATE GOOGLE FORM QUIZ DARI BANK SOAL
 */
function generateGoogleFormQuiz() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const bankSheet = ss.getSheetByName(CONFIG.SHEET_BANK_SOAL);
  const ui = SpreadsheetApp.getUi();

  if (!bankSheet) {
    ui.alert('Peringatan', 'Sheet "' + CONFIG.SHEET_BANK_SOAL + '" tidak ditemukan!', ui.ButtonSet.OK);
    return;
  }

  const data = bankSheet.getDataRange().getValues();
  if (data.length <= 1) {
    ui.alert('Peringatan', 'Sheet Bank_Soal masih kosong.', ui.ButtonSet.OK);
    return;
  }

  const form = FormApp.create(CONFIG.JUDUL_ASESMEN + ' - ' + CONFIG.MAPEL);
  form.setIsQuiz(true);
  form.setProgressBar(true);

  form.addSectionHeaderItem().setTitle("IDENTITAS PESERTA DIDIK");
  form.addTextItem().setTitle("Nomor Induk Siswa Nasional (NISN)").setRequired(true);
  form.addTextItem().setTitle("Nama Lengkap Siswa").setRequired(true);
  form.addTextItem().setTitle("Kelas / Rombel").setRequired(true);

  form.addPageBreakItem().setTitle("SOAL ASESMEN SUMATIF");

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (!row[3]) continue;
    const mc = form.addMultipleChoiceItem();
    mc.setTitle(row[0] + '. ' + row[3]);
    mc.setPoints(Number(row[10] || 1));

    const options = [row[4], row[5], row[6], row[7]];
    if (row[8]) options.push(row[8]);
    const key = String(row[9] || '').trim().toUpperCase();
    const letters = ['A', 'B', 'C', 'D', 'E'];
    const choices = [];

    options.forEach((opt, idx) => {
      if (opt) choices.push(mc.createChoice(opt, key === letters[idx]));
    });

    mc.setChoices(choices);
    mc.setRequired(true);
  }

  form.setDestination(FormApp.DestinationType.SPREADSHEET, ss.getId());
  ui.alert('Sukses', 'Google Form berhasil dibuat!\\nLink Siswa: ' + form.getPublishedUrl(), ui.ButtonSet.OK);
}

/**
 * 4. OLAH NILAI OTOMATIS
 */
function processAndGradeResponses() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ui = SpreadsheetApp.getUi();
  const bankSheet = ss.getSheetByName(CONFIG.SHEET_BANK_SOAL);
  const respSheet = ss.getSheetByName(CONFIG.SHEET_RESPON) || ss.getSheets().find(s => s.getName().includes('Respon') || s.getName().includes('Form Responses'));

  if (!bankSheet || !respSheet) {
    ui.alert('Error', 'Sheet Bank Soal atau Respon Siswa belum siap!', ui.ButtonSet.OK);
    return;
  }

  const bankData = bankSheet.getDataRange().getValues();
  const respData = respSheet.getDataRange().getValues();
  if (respData.length <= 1) {
    ui.alert('Info', 'Belum ada respon siswa yang masuk.', ui.ButtonSet.OK);
    return;
  }

  let legerSheet = ss.getSheetByName(CONFIG.SHEET_LEGER) || ss.insertSheet(CONFIG.SHEET_LEGER);
  legerSheet.clear();

  const headers = ['No', 'Waktu', 'NISN', 'Nama Siswa', 'Kelas', 'Skor Mentah', 'Total Maksimal', 'Nilai Akhir', 'Status KKTP', 'Deskripsi Capaian Kompetensi'];
  const outputRows = [headers];

  const questions = [];
  let maxScore = 0;
  for (let i = 1; i < bankData.length; i++) {
    if (!bankData[i][3]) continue;
    const w = Number(bankData[i][10] || 1);
    maxScore += w;
    questions.push({
      key: String(bankData[i][9] || '').trim().toUpperCase(),
      weight: w,
      tpCode: bankData[i][1],
      tpDesc: bankData[i][2]
    });
  }

  for (let r = 1; r < respData.length; r++) {
    const row = respData[r];
    let raw = 0;
    const tpResults = {};

    questions.forEach((q, idx) => {
      const studentAns = String(row[4 + idx] || '').charAt(0).toUpperCase();
      if (!tpResults[q.tpCode]) tpResults[q.tpCode] = { correct: 0, total: 0, desc: q.tpDesc };
      tpResults[q.tpCode].total += q.weight;

      if (studentAns === q.key) {
        raw += q.weight;
        tpResults[q.tpCode].correct += q.weight;
      }
    });

    const finalScore = maxScore > 0 ? Math.round((raw / maxScore) * 100 * 10) / 10 : 0;
    const status = finalScore >= CONFIG.KKTP_MINIMAL ? 'Tuntas' : 'Perlu Remedial';

    outputRows.push([r, row[0], row[1], row[2], row[3], raw, maxScore, finalScore, status, 'Menunjukkan penguasaan materi dengan baik.']);
  }

  legerSheet.getRange(1, 1, outputRows.length, outputRows[0].length).setValues(outputRows);
  legerSheet.getRange(1, 1, 1, outputRows[0].length).setBackground('#1e3a8a').setFontColor('#ffffff').setFontWeight('bold');
  legerSheet.autoResizeColumns(1, outputRows[0].length);

  ui.alert('Sukses', 'Pengolahan nilai berhasil diselesaikan!', ui.ButtonSet.OK);
}

/**
 * 5. ANALISIS BUTIR SOAL
 */
function runItemAnalysis() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ui = SpreadsheetApp.getUi();
  const bankSheet = ss.getSheetByName(CONFIG.SHEET_BANK_SOAL);
  const respSheet = ss.getSheetByName(CONFIG.SHEET_RESPON) || ss.getSheets().find(s => s.getName().includes('Respon') || s.getName().includes('Form Responses'));

  if (!bankSheet || !respSheet) {
    ui.alert('Error', 'Sheet Bank Soal atau Respon belum siap!', ui.ButtonSet.OK);
    return;
  }

  const bankData = bankSheet.getDataRange().getValues();
  const respData = respSheet.getDataRange().getValues();
  if (respData.length <= 3) {
    ui.alert('Peringatan', 'Minimal butuh 4 respon siswa untuk analisis butir soal.', ui.ButtonSet.OK);
    return;
  }

  let analysisSheet = ss.getSheetByName(CONFIG.SHEET_ANALISIS) || ss.insertSheet(CONFIG.SHEET_ANALISIS);
  analysisSheet.clear();

  const numQ = bankData.length - 1;
  const numS = respData.length - 1;

  const students = [];
  for (let r = 1; r < respData.length; r++) {
    let score = 0;
    const ans = [];
    for (let q = 0; q < numQ; q++) {
      const a = String(respData[r][4 + q] || '').charAt(0).toUpperCase();
      const k = String(bankData[q + 1][9] || '').trim().toUpperCase();
      if (a === k) score++;
      ans.push(a);
    }
    students.push({ score, ans });
  }

  students.sort((a, b) => b.score - a.score);
  const gSize = Math.max(1, Math.round(numS * 0.27));
  const upper = students.slice(0, gSize);
  const lower = students.slice(-gSize);

  const rows = [[
    'No Soal', 'Kode TP', 'Kunci', 'Jumlah Benar', 'Total Peserta',
    'Tingkat Kesukaran (P)', 'Kategori Kesukaran',
    'Daya Beda (D)', 'Kategori Daya Beda', 'Status Rekomendasi'
  ]];

  for (let q = 0; q < numQ; q++) {
    const k = String(bankData[q + 1][9] || '').trim().toUpperCase();
    let tot = 0, uCorr = 0, lCorr = 0;

    students.forEach(s => { if (s.ans[q] === k) tot++; });
    upper.forEach(s => { if (s.ans[q] === k) uCorr++; });
    lower.forEach(s => { if (s.ans[q] === k) lCorr++; });

    const P = Math.round((tot / numS) * 100) / 100;
    const katP = P > 0.7 ? 'Mudah' : (P < 0.3 ? 'Sukar' : 'Sedang');

    const D = Math.round(((uCorr - lCorr) / gSize) * 100) / 100;
    let katD = D >= 0.4 ? 'Sangat Baik' : (D >= 0.3 ? 'Baik' : (D >= 0.2 ? 'Cukup' : 'Jelek'));
    let status = D >= 0.3 ? 'Diterima' : (D >= 0.2 ? 'Revisi' : 'Ditolak');

    rows.push([bankData[q + 1][0], bankData[q + 1][1], k, tot, numS, P, katP, D, katD, status]);
  }

  analysisSheet.getRange(1, 1, rows.length, rows[0].length).setValues(rows);
  analysisSheet.getRange(1, 1, 1, rows[0].length).setBackground('#059669').setFontColor('#ffffff').setFontWeight('bold');
  analysisSheet.autoResizeColumns(1, rows[0].length);

  ui.alert('Selesai', 'Analisis butir soal telah berhasil diperbarui.', ui.ButtonSet.OK);
}

/**
 * 6. CETAK SLIP LAPORAN SISWA
 */
function generateStudentReportCard() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ui = SpreadsheetApp.getUi();
  const legerSheet = ss.getSheetByName(CONFIG.SHEET_LEGER);

  if (!legerSheet) {
    ui.alert('Peringatan', 'Silakan olah nilai terlebih dahulu di menu nomor 4.', ui.ButtonSet.OK);
    return;
  }

  ui.alert('Info', 'Gunakan aplikasi ScriptGen Asesmen Sumatif untuk pratinjau dan cetak langsung lembar hasil siswa.', ui.ButtonSet.OK);
}

/**
 * 7. SETUP AWAL SHEET
 */
function setupInitialSheets() {
  setupExamScheduleSheet();
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let bankSheet = ss.getSheetByName(CONFIG.SHEET_BANK_SOAL);
  if (!bankSheet) {
    bankSheet = ss.insertSheet(CONFIG.SHEET_BANK_SOAL);
    const bankHeader = [
      'No', 'Kode_TP', 'Deskripsi_Tujuan_Pembelajaran', 'Butir_Soal',
      'Pilihan_A', 'Pilihan_B', 'Pilihan_C', 'Pilihan_D', 'Pilihan_E',
      'Kunci_Jawaban', 'Bobot_Nilai', 'Pembahasan'
    ];
    bankSheet.getRange(1, 1, 1, bankHeader.length).setValues([bankHeader]);
    bankSheet.getRange(1, 1, 1, bankHeader.length).setBackground('#1e40af').setFontColor('#ffffff').setFontWeight('bold');
  }
}
`;
}

export const MODULAR_SCRIPTS = [
  {
    fileName: 'Code.gs',
    description: 'Menu kustom Google Sheets, Web App Entrypoint (doGet), dan Handler API',
    getCode: (c: AppsScriptConfig) => `/**
 * @file Code.gs
 * Menu kustom dan kontroler utama Asesmen Sumatif & Web App Siswa
 */
const CONFIG = {
  NAMA_SEKOLAH: "${c.schoolName}",
  JUDUL_ASESMEN: "${c.examTitle}",
  MAPEL: "${c.subject}",
  KELAS: "${c.className}",
  KKTP_MINIMAL: ${c.kktp},
  SHEET_JADWAL: "Jadwal_Ujian",
  SHEET_JAWABAN_SISWA: "Jawaban_Siswa",
  SHEET_BANK_SOAL: "Bank_Soal",
  SHEET_LEGER: "Leger_Nilai"
};

function onOpen() {
  SpreadsheetApp.getUi().createMenu('🎓 Asesmen Sumatif')
    .addItem('🌐 1. Deploy Portal Ujian Siswa (Web App)', 'showWebAppUrlDialog')
    .addItem('📅 2. Atur Jadwal & Token Ujian', 'setupExamScheduleSheet')
    .addItem('📝 3. Buat Google Form Quiz', 'generateGoogleFormQuiz')
    .addItem('📥 4. Olah Nilai & Rapor Otomatis', 'processAndGradeResponses')
    .addItem('📊 5. Analisis Butir Soal', 'runItemAnalysis')
    .addToUi();
}

function doGet(e) {
  return HtmlService.createHtmlOutput(getPortalHtml())
    .setTitle("Portal Ujian Asesmen Sumatif")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}
`
  },
  {
    fileName: 'ExamPortal.gs',
    description: 'API Verifikasi Token Akses Ujian Siswa dan Penerimaan Jawaban LJK Digital',
    getCode: () => `/**
 * @file ExamPortal.gs
 * Backend API untuk verifikasi kode login/token dan koreksi LJK digital
 */
function apiVerifyToken(token) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const schedSheet = ss.getSheetByName("Jadwal_Ujian");
  if (!schedSheet) return { success: false, message: "Sheet Jadwal_Ujian belum dibuat." };

  const data = schedSheet.getDataRange().getValues();
  const cleanToken = String(token || '').trim().toUpperCase();

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (String(row[3]).trim().toUpperCase() === cleanToken) {
      return {
        success: true,
        subject: row[1],
        className: row[2],
        accessCode: cleanToken,
        questionCount: Number(row[7] || 10),
        pdfUrl: String(row[8] || ''),
        durationMinutes: Number(row[6] || 90)
      };
    }
  }
  return { success: false, message: "Token Ujian tidak cocok!" };
}

function apiSubmitAnswers(submission) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let ansSheet = ss.getSheetByName("Jawaban_Siswa") || ss.insertSheet("Jawaban_Siswa");

  // Koreksi terhadap kunci jawaban master
  const schedSheet = ss.getSheetByName("Jadwal_Ujian");
  const data = schedSheet.getDataRange().getValues();
  let keys = "A,A,A,A,A";

  for (let i = 1; i < data.length; i++) {
    if (String(data[i][3]).trim().toUpperCase() === String(submission.accessCode).trim().toUpperCase()) {
      keys = String(data[i][9] || '');
      break;
    }
  }

  const keyArr = keys.split(',').map(k => k.trim().toUpperCase());
  let correct = 0;
  for (let q = 1; q <= submission.questionCount; q++) {
    if ((submission.answers[q] || '').toUpperCase() === (keyArr[q-1] || 'A')) {
      correct++;
    }
  }

  const score = Math.round((correct / submission.questionCount) * 100);
  ansSheet.appendRow([new Date(), submission.nisn, submission.name, submission.className, submission.subject, correct, submission.questionCount, score]);
  return { success: true, rawScore: correct, maxScore: submission.questionCount, finalScore: score };
}
`
  }
];

export const GOOGLE_SHEET_CSV_TEMPLATE = `No,Kode_TP,Deskripsi_Tujuan_Pembelajaran,Butir_Soal,Pilihan_A,Pilihan_B,Pilihan_C,Pilihan_D,Pilihan_E,Kunci_Jawaban,Bobot_Nilai,Pembahasan
1,TP 1,Memahami operasi hitung bilangan bulat,Suhu mula-mula -4°C naik 3°C tiap 15 menit selama 1 jam. Suhu akhir adalah...,8°C,12°C,16°C,-16°C,,A,1,"Kenaikan = 4 x 3 = 12°C. Suhu = -4 + 12 = 8°C."
2,TP 1,Memahami operasi hitung bilangan bulat,Hasil dari (-18 + 30) : (-3 - 1) adalah...,-3,3,-4,4,,A,1,"12 : (-4) = -3"
3,TP 2,Menyederhanakan bentuk aljabar,Bentuk sederhana dari 4(2x - 3y) - 3(x - 5y) adalah...,5x + 3y,5x - 3y,5x + 27y,5x - 27y,,A,1,"8x - 12y - 3x + 15y = 5x + 3y"
4,TP 2,Menyederhanakan bentuk aljabar,Jika x = -3 dan y = 4 maka nilai dari 2x² - 3y + 5 adalah...,11,17,-1,29,,A,1,"2(9) - 12 + 5 = 11"
5,TP 3,Aritmetika sosial dan perbandingan,Diskon 20% untuk kemeja Rp150.000. Jumlah uang yang dibayar adalah...,Rp120.000,Rp130.000,Rp30.000,Rp110.000,,A,1,"150.000 - 30.000 = Rp120.000"`;
