/**
 * Utility to generate downloadable PDF or data URI for Exam Question Paper (Naskah Soal).
 */

export function generateExamPdfBlob(
  schoolName: string,
  subject: string,
  className: string,
  academicYear: string,
  durationMinutes: number,
  questions: Array<{ id: number; question: string; options: string[] }>
): { url: string; fileName: string } {
  // Construct a well-formatted printable HTML document that can be viewed or printed/saved as PDF
  const questionsHtml = questions.map((q) => `
    <div style="margin-bottom: 18px; page-break-inside: avoid;">
      <p style="margin: 0 0 8px 0; font-weight: bold; font-size: 14px;">
        ${q.id}. ${q.question}
      </p>
      <div style="margin-left: 18px; display: grid; grid-template-columns: 1fr 1fr; gap: 6px; font-size: 13px;">
        ${q.options.map((opt) => `<div>${opt}</div>`).join('')}
      </div>
    </div>
  `).join('');

  const fullHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Naskah Soal - ${subject} ${className}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      padding: 30px;
      color: #111;
      max-width: 800px;
      margin: 0 auto;
      line-height: 1.5;
    }
    .header {
      text-align: center;
      border-bottom: 2px solid #000;
      padding-bottom: 12px;
      margin-bottom: 15px;
    }
    .title {
      font-size: 18px;
      font-weight: bold;
      text-transform: uppercase;
      margin: 3px 0;
    }
    .meta-table {
      width: 100%;
      margin-bottom: 15px;
      font-size: 13px;
      border-bottom: 1px dashed #999;
      padding-bottom: 10px;
    }
    .instructions {
      background: #f4f4f4;
      padding: 10px 15px;
      border-radius: 6px;
      font-size: 12px;
      margin-bottom: 20px;
    }
    @media print {
      body { padding: 0; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="no-print" style="margin-bottom: 20px; text-align: right;">
    <button onclick="window.print()" style="padding: 8px 16px; background: #059669; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer;">
      🖨️ Cetak / Simpan sebagai PDF
    </button>
  </div>
  <div class="header">
    <div style="font-size: 13px; font-weight: bold; letter-spacing: 1px;">PEMERINTAH DAERAH DINAS PENDIDIKAN</div>
    <div class="title">${schoolName}</div>
    <div style="font-size: 14px; font-weight: bold;">NASKAH SOAL ASESMEN SUMATIF</div>
    <div style="font-size: 12px; color: #555;">Tahun Ajaran ${academicYear}</div>
  </div>
  <table class="meta-table">
    <tr>
      <td width="20%"><strong>Mata Pelajaran</strong></td>
      <td width="35%">: ${subject}</td>
      <td width="20%"><strong>Alokasi Waktu</strong></td>
      <td width="25%">: ${durationMinutes} Menit</td>
    </tr>
    <tr>
      <td><strong>Kelas / Fase</strong></td>
      <td>: ${className}</td>
      <td><strong>Bentuk Soal</strong></td>
      <td>: Pilihan Ganda (A - D)</td>
    </tr>
  </table>
  <div class="instructions">
    <strong>PETUNJUK UMUM:</strong>
    <ol style="margin: 5px 0 0 15px; padding: 0;">
      <li>Periksalah naskah soal dan pastikan butir soal terbaca dengan jelas.</li>
      <li>Pilihlah salah satu jawaban yang paling tepat pada Lembar Jawaban Komputer (LJK) Digital.</li>
      <li>Periksa kembali jawaban Anda sebelum menekan tombol Kirim Ujian.</li>
    </ol>
  </div>
  <div class="questions">
    ${questionsHtml}
  </div>
</body>
</html>`;

  const blob = new Blob([fullHtml], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const cleanSubject = subject.replace(/[^a-zA-Z0-9]/g, '_');
  const fileName = `Naskah_Soal_${cleanSubject}_${className.replace(/[^a-zA-Z0-9]/g, '_')}.html`;

  return { url, fileName };
}
