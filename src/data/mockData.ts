import { QuestionItem, StudentSubmission, ExamSchedule } from '../utils/assessmentLogic';

export interface ExamPreset {
  id: string;
  name: string;
  level: string; // "SD (Fase C)" | "SMP (Fase D)" | "SMA (Fase E)"
  subject: string;
  schoolName: string;
  academicYear: string;
  semester: string;
  teacherName: string;
  nip: string;
  headmasterName: string;
  headmasterNip: string;
  kktp: number;
  durationMinutes: number;
  accessCode: string;
  questionCount: number;
  questions: QuestionItem[];
  sampleSubmissions: StudentSubmission[];
}

export const INITIAL_SCHEDULES: ExamSchedule[] = [
  {
    id: 'sched-1',
    subject: 'Matematika',
    className: 'Kelas VII (Fase D)',
    accessCode: 'MTK-7A',
    examDate: '2024-11-20',
    startTime: '08:00',
    endTime: '09:30',
    durationMinutes: 90,
    questionCount: 10,
    pdfUrl: '',
    pdfFileName: 'Naskah_Soal_Matematika_Fase_D.pdf',
    answerKeys: {
      1: 'A',
      2: 'A',
      3: 'B',
      4: 'A',
      5: 'A',
      6: 'A',
      7: 'A',
      8: 'A',
      9: 'A',
      10: 'A'
    },
    kktp: 75,
    isActive: true,
    schoolName: 'SMP Negeri 1 Nusantara',
    teacherName: 'Drs. Ahmad Fauzi, M.Pd.',
    nip: '19780512 200501 1 008'
  },
  {
    id: 'sched-2',
    subject: 'IPAS (Ilmu Pengetahuan Alam dan Sosial)',
    className: 'Kelas V (Fase C)',
    accessCode: 'IPAS-5B',
    examDate: '2024-11-21',
    startTime: '08:00',
    endTime: '09:00',
    durationMinutes: 60,
    questionCount: 5,
    pdfUrl: '',
    pdfFileName: 'Naskah_Soal_IPAS_Kelas_5.pdf',
    answerKeys: {
      1: 'A',
      2: 'B',
      3: 'A',
      4: 'B',
      5: 'B'
    },
    kktp: 70,
    isActive: true,
    schoolName: 'SD Negeri Harapan Bangsa',
    teacherName: 'Sri Wahyuni, S.Pd.SD',
    nip: '19840210 200801 2 005'
  },
  {
    id: 'sched-3',
    subject: 'Bahasa Indonesia',
    className: 'Kelas X (Fase E)',
    accessCode: 'BINDO-10',
    examDate: '2024-11-22',
    startTime: '07:30',
    endTime: '09:00',
    durationMinutes: 90,
    questionCount: 8,
    pdfUrl: '',
    pdfFileName: 'Naskah_Soal_Bahasa_Indonesia_X.pdf',
    answerKeys: {
      1: 'B',
      2: 'A',
      3: 'C',
      4: 'D',
      5: 'A',
      6: 'B',
      7: 'C',
      8: 'A'
    },
    kktp: 75,
    isActive: true,
    schoolName: 'SMA Negeri 1 Prestasi',
    teacherName: 'Dra. Nurhayati, M.Hum.',
    nip: '19810614 200604 2 011'
  }
];

export const PRESETS: ExamPreset[] = [
  {
    id: 'matematika-smp-7',
    name: 'Asesmen Sumatif Akhir Semester (SAS) Matematika Kelas 7',
    level: 'SMP (Fase D)',
    subject: 'Matematika',
    schoolName: 'SMP Negeri 1 Nusantara',
    academicYear: '2024/2025',
    semester: 'Ganjil',
    teacherName: 'Drs. Ahmad Fauzi, M.Pd.',
    nip: '19780512 200501 1 008',
    headmasterName: 'Hj. Siti Rahmawati, S.Pd., M.M.',
    headmasterNip: '19710315 199602 2 001',
    kktp: 75,
    durationMinutes: 90,
    accessCode: 'MTK-7A',
    questionCount: 10,
    questions: [
      {
        id: 1,
        tpCode: 'TP 1',
        tpDescription: 'Memahami operasi hitung bilangan bulat dan sifat-sifatnya',
        question: 'Suhu di dalam lemari es mula-mula -4°C. Pada saat listrik padam, suhu naik 3°C setiap 15 menit. Suhu lemari es setelah listrik padam selama 1 jam adalah...',
        options: ['A. 8°C', 'B. 12°C', 'C. 16°C', 'D. -16°C'],
        correctAnswer: 'A',
        weight: 1,
        explanation: '1 jam = 60 menit. Kenaikan suhu = (60 / 15) x 3°C = 4 x 3°C = 12°C. Suhu akhir = -4°C + 12°C = 8°C.'
      },
      {
        id: 2,
        tpCode: 'TP 1',
        tpDescription: 'Memahami operasi hitung bilangan bulat dan sifat-sifatnya',
        question: 'Hasil dari (-18 + 30) : (-3 - 1) adalah...',
        options: ['A. -3', 'B. 3', 'C. -4', 'D. 4'],
        correctAnswer: 'A',
        weight: 1,
        explanation: '(-18 + 30) = 12. (-3 - 1) = -4. 12 : (-4) = -3.'
      },
      {
        id: 3,
        tpCode: 'TP 1',
        tpDescription: 'Memahami operasi hitung bilangan bulat dan sifat-sifatnya',
        question: 'Seorang penyelam berada pada kedalaman 15 meter di bawah permukaan laut. Kemudian ia naik sejauh 7 meter. Posisi penyelam sekarang terhadap permukaan laut dinyatakan dalam bilangan bulat adalah...',
        options: ['A. 8 meter', 'B. -8 meter', 'C. -22 meter', 'D. 22 meter'],
        correctAnswer: 'B',
        weight: 1,
        explanation: 'Kedalaman 15 m = -15. Naik 7 m = +7. Posisi = -15 + 7 = -8 meter.'
      },
      {
        id: 4,
        tpCode: 'TP 2',
        tpDescription: 'Menyederhanakan bentuk aljabar dan substitusi nilai variabel',
        question: 'Bentuk sederhana dari 4(2x - 3y) - 3(x - 5y) adalah...',
        options: ['A. 5x + 3y', 'B. 5x - 3y', 'C. 5x + 27y', 'D. 5x - 27y'],
        correctAnswer: 'A',
        weight: 1,
        explanation: '4(2x - 3y) = 8x - 12y. -3(x - 5y) = -3x + 15y. Gabungkan suku sejenis: (8x - 3x) + (-12y + 15y) = 5x + 3y.'
      },
      {
        id: 5,
        tpCode: 'TP 2',
        tpDescription: 'Menyederhanakan bentuk aljabar dan substitusi nilai variabel',
        question: 'Jika nilai x = -3 dan y = 4, maka nilai dari bentuk aljabar 2x² - 3y + 5 adalah...',
        options: ['A. 11', 'B. 17', 'C. -1', 'D. 29'],
        correctAnswer: 'A',
        weight: 1,
        explanation: '2(-3)² - 3(4) + 5 = 2(9) - 12 + 5 = 18 - 12 + 5 = 11.'
      },
      {
        id: 6,
        tpCode: 'TP 2',
        tpDescription: 'Menyederhanakan bentuk aljabar dan substitusi nilai variabel',
        question: 'Penyelesaian dari persamaan linear satu variabel 3(x - 2) = 2(x + 5) adalah...',
        options: ['A. x = 16', 'B. x = 4', 'C. x = -4', 'D. x = 10'],
        correctAnswer: 'A',
        weight: 1,
        explanation: '3x - 6 = 2x + 10 => 3x - 2x = 10 + 6 => x = 16.'
      },
      {
        id: 7,
        tpCode: 'TP 3',
        tpDescription: 'Menyelesaikan permasalahan aritmetika sosial dan perbandingan',
        question: 'Sebuah toko memberikan diskon 20% untuk semua jenis pakaian. Pak Rudi membeli kemeja seharga Rp150.000,00. Jumlah uang yang harus dibayar Pak Rudi setelah diskon adalah...',
        options: ['A. Rp120.000,00', 'B. Rp130.000,00', 'C. Rp30.000,00', 'D. Rp110.000,00'],
        correctAnswer: 'A',
        weight: 1,
        explanation: 'Diskon = 20% x 150.000 = Rp30.000. Bayar = 150.000 - 30.000 = Rp120.000,00.'
      },
      {
        id: 8,
        tpCode: 'TP 3',
        tpDescription: 'Menyelesaikan permasalahan aritmetika sosial dan perbandingan',
        question: 'Seorang pedagang membeli 1 kodi baju seharga Rp800.000,00. Jika pedagang ingin memperoleh keuntungan 25%, harga jual tiap potong baju adalah...',
        options: ['A. Rp50.000,00', 'B. Rp48.000,00', 'C. Rp40.000,00', 'D. Rp60.000,00'],
        correctAnswer: 'A',
        weight: 1,
        explanation: '1 kodi = 20 potong. Modal per potong = 800.000 / 20 = Rp40.000. Untung 25% = 25% x 40.000 = Rp10.000. Harga jual = 40.000 + 10.000 = Rp50.000,00.'
      },
      {
        id: 9,
        tpCode: 'TP 3',
        tpDescription: 'Menyelesaikan permasalahan aritmetika sosial dan perbandingan',
        question: 'Sebuah mobil memerlukan 5 liter bensin untuk menempuh jarak 60 km. Berapa liter bensin yang diperlukan untuk menempuh jarak 180 km dengan kecepatan yang sama?',
        options: ['A. 15 liter', 'B. 12 liter', 'C. 18 liter', 'D. 20 liter'],
        correctAnswer: 'A',
        weight: 1,
        explanation: 'Perbandingan senilai: 5 / 60 = x / 180 => x = (5 x 180) / 60 = 15 liter.'
      },
      {
        id: 10,
        tpCode: 'TP 3',
        tpDescription: 'Menyelesaikan permasalahan aritmetika sosial dan perbandingan',
        question: 'Suatu pekerjaan dapat diselesaikan oleh 12 orang dalam waktu 20 hari. Jika pekerjaan tersebut ingin diselesaikan dalam waktu 15 hari, banyaknya pekerja tambahan yang diperlukan adalah...',
        options: ['A. 4 orang', 'B. 16 orang', 'C. 8 orang', 'D. 5 orang'],
        correctAnswer: 'A',
        weight: 1,
        explanation: 'Perbandingan berbalik nilai: 12 x 20 = x x 15 => x = 240 / 15 = 16 orang. Pekerja tambahan = 16 - 12 = 4 orang.'
      }
    ],
    sampleSubmissions: [
      {
        nisn: '0081234561',
        name: 'Aditya Pratama',
        className: 'VII-A',
        answers: { 1: 'A', 2: 'A', 3: 'B', 4: 'A', 5: 'A', 6: 'A', 7: 'A', 8: 'A', 9: 'A', 10: 'A' },
        timestamp: '2024-11-20 08:15:22'
      },
      {
        nisn: '0081234562',
        name: 'Bella Kusuma Dewi',
        className: 'VII-A',
        answers: { 1: 'A', 2: 'A', 3: 'B', 4: 'A', 5: 'A', 6: 'A', 7: 'A', 8: 'A', 9: 'A', 10: 'B' },
        timestamp: '2024-11-20 08:18:40'
      },
      {
        nisn: '0081234563',
        name: 'Dimas Anggara',
        className: 'VII-A',
        answers: { 1: 'A', 2: 'A', 3: 'B', 4: 'A', 5: 'B', 6: 'A', 7: 'A', 8: 'B', 9: 'A', 10: 'A' },
        timestamp: '2024-11-20 08:21:10'
      },
      {
        nisn: '0081234564',
        name: 'Fadhil Muhammad',
        className: 'VII-A',
        answers: { 1: 'A', 2: 'B', 3: 'B', 4: 'A', 5: 'A', 6: 'A', 7: 'A', 8: 'C', 9: 'A', 10: 'B' },
        timestamp: '2024-11-20 08:24:05'
      },
      {
        nisn: '0081234565',
        name: 'Gita Maharani',
        className: 'VII-A',
        answers: { 1: 'A', 2: 'A', 3: 'B', 4: 'B', 5: 'A', 6: 'D', 7: 'A', 8: 'A', 9: 'B', 10: 'A' },
        timestamp: '2024-11-20 08:27:14'
      },
      {
        nisn: '0081234566',
        name: 'Hafiz Al-Fikri',
        className: 'VII-A',
        answers: { 1: 'B', 2: 'A', 3: 'A', 4: 'A', 5: 'A', 6: 'A', 7: 'B', 8: 'A', 9: 'A', 10: 'B' },
        timestamp: '2024-11-20 08:30:19'
      },
      {
        nisn: '0081234567',
        name: 'Indah Puspitasari',
        className: 'VII-A',
        answers: { 1: 'A', 2: 'A', 3: 'B', 4: 'C', 5: 'C', 6: 'A', 7: 'A', 8: 'A', 9: 'A', 10: 'C' },
        timestamp: '2024-11-20 08:33:45'
      },
      {
        nisn: '0081234568',
        name: 'Joko Susanto',
        className: 'VII-A',
        answers: { 1: 'B', 2: 'C', 3: 'B', 4: 'B', 5: 'B', 6: 'B', 7: 'A', 8: 'B', 9: 'A', 10: 'B' },
        timestamp: '2024-11-20 08:35:12'
      },
      {
        nisn: '0081234569',
        name: 'Kirana Larasati',
        className: 'VII-A',
        answers: { 1: 'A', 2: 'B', 3: 'C', 4: 'A', 5: 'B', 6: 'C', 7: 'B', 8: 'B', 9: 'A', 10: 'B' },
        timestamp: '2024-11-20 08:39:00'
      },
      {
        nisn: '0081234570',
        name: 'Lukman Hakim',
        className: 'VII-A',
        answers: { 1: 'C', 2: 'B', 3: 'A', 4: 'B', 5: 'C', 6: 'D', 7: 'C', 8: 'B', 9: 'B', 10: 'D' },
        timestamp: '2024-11-20 08:42:15'
      }
    ]
  },
  {
    id: 'ipas-sd-5',
    name: 'Asesmen Sumatif Lingkup Materi IPAS Kelas 5',
    level: 'SD (Fase C)',
    subject: 'IPAS (Ilmu Pengetahuan Alam dan Sosial)',
    schoolName: 'SD Negeri Harapan Bangsa',
    academicYear: '2024/2025',
    semester: 'Ganjil',
    teacherName: 'Sri Wahyuni, S.Pd.SD',
    nip: '19840210 200801 2 005',
    headmasterName: 'Drs. H. Bambang Irawan',
    headmasterNip: '19671120 199103 1 004',
    kktp: 70,
    durationMinutes: 60,
    accessCode: 'IPAS-5B',
    questionCount: 5,
    questions: [
      {
        id: 1,
        tpCode: 'TP 1',
        tpDescription: 'Menganalisis hubungan antar komponen dalam rantai makanan',
        question: 'Pada sebuah ekosistem sawah, populasi ular mengalami penurunan drastis karena diburu manusia. Dampak yang paling mungkin terjadi pada ekosistem tersebut adalah...',
        options: [
          'A. Populasi tikus meningkat pesat sehingga merusak tanaman padi',
          'B. Populasi tanaman padi meningkat pesat',
          'C. Populasi elang akan bertambah banyak',
          'D. Populasi belalang akan punah'
        ],
        correctAnswer: 'A',
        weight: 1,
        explanation: 'Ular adalah predator alami bagi tikus. Jika ular menurun drastis, populasi tikus akan melonjak dan merusak padi.'
      },
      {
        id: 2,
        tpCode: 'TP 1',
        tpDescription: 'Menganalisis hubungan antar komponen dalam rantai makanan',
        question: 'Makhluk hidup yang berperan menguraikan sisa organisme mati menjadi zat hara penyubur tanah disebut...',
        options: ['A. Produsen', 'B. Dekomposer (Pengurai)', 'C. Konsumen primer', 'D. Predator'],
        correctAnswer: 'B',
        weight: 1,
        explanation: 'Dekomposer seperti bakteri dan jamur menguraikan materi organik kembali ke tanah.'
      },
      {
        id: 3,
        tpCode: 'TP 2',
        tpDescription: 'Menjelaskan sifat-sifat cahaya dan perambatannya',
        question: 'Ketika kita memasukkan sebatang pensil ke dalam gelas berisi air bening, pensil terlihat patah atau bengkok. Fenomena ini membuktikan sifat cahaya yaitu...',
        options: [
          'A. Cahaya dapat dibiaskan (pembiasan cahaya)',
          'B. Cahaya dapat dipantulkan sempurna',
          'C. Cahaya merambat lurus tanpa belok',
          'D. Cahaya menembus benda gelap'
        ],
        correctAnswer: 'A',
        weight: 1,
        explanation: 'Pembiasan (refraksi) terjadi karena cahaya merambat melalui dua medium yang berbeda kerapatan optiknya (udara dan air).'
      },
      {
        id: 4,
        tpCode: 'TP 2',
        tpDescription: 'Menjelaskan sifat-sifat cahaya dan perambatannya',
        question: 'Bayangan yang terbentuk pada cermin datar saat kita bercermin memiliki sifat...',
        options: [
          'A. Nyata, terbalik, dan diperbesar',
          'B. Maya, tegak, dan sama besar',
          'C. Nyata, tegak, dan diperkecil',
          'D. Maya, terbalik, dan lebih kecil'
        ],
        correctAnswer: 'B',
        weight: 1,
        explanation: 'Sifat bayangan pada cermin datar adalah maya, tegak, dan sama besar serta bertukar sisi kiri dan kanan.'
      },
      {
        id: 5,
        tpCode: 'TP 3',
        tpDescription: 'Memahami tahapan siklus air dan upaya pelestariannya',
        question: 'Proses penguapan air dari permukaan bumi ke atmosfer yang berasal dari tumbuh-tumbuhan disebut...',
        options: ['A. Evaporasi', 'B. Transpirasi', 'C. Kondensasi', 'D. Presipitasi'],
        correctAnswer: 'B',
        weight: 1,
        explanation: 'Penguapan dari tubuh tumbuhan disebut transpirasi, sedangkan dari badan air (sungai/laut) disebut evaporasi.'
      }
    ],
    sampleSubmissions: [
      {
        nisn: '0123456701',
        name: 'Aisyah Putri Azzahra',
        className: 'V-B',
        answers: { 1: 'A', 2: 'B', 3: 'A', 4: 'B', 5: 'B' },
        timestamp: '2024-11-18 09:10:00'
      },
      {
        nisn: '0123456702',
        name: 'Bagas Pratama',
        className: 'V-B',
        answers: { 1: 'A', 2: 'B', 3: 'A', 4: 'B', 5: 'A' },
        timestamp: '2024-11-18 09:12:30'
      },
      {
        nisn: '0123456703',
        name: 'Cantika Dewi',
        className: 'V-B',
        answers: { 1: 'A', 2: 'B', 3: 'B', 4: 'B', 5: 'B' },
        timestamp: '2024-11-18 09:15:00'
      },
      {
        nisn: '0123456704',
        name: 'Daffa Raihan',
        className: 'V-B',
        answers: { 1: 'C', 2: 'B', 3: 'A', 4: 'A', 5: 'B' },
        timestamp: '2024-11-18 09:18:20'
      },
      {
        nisn: '0123456705',
        name: 'Eka Septiani',
        className: 'V-B',
        answers: { 1: 'B', 2: 'C', 3: 'C', 4: 'B', 5: 'A' },
        timestamp: '2024-11-18 09:21:45'
      }
    ]
  }
];
