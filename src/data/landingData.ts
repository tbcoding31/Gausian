import { LandingData } from '../types';

export const landingData: LandingData = {
  hero: {
    headline: 'Miliki "The Next Nusa Dua" Banten Sebelum Harga Lahan Meroket 300%',
    subheadline:
      'Kesempatan eksklusif mengakuisisi lahan premium di Kawasan Ekonomi Khusus (KEK) Tanjung Lesung. Dirancang khusus untuk visionary developer dan investor komersial yang menargetkan capital gain eksponensial di destinasi super prioritas nasional.',
    ctaText: 'Schedule Now',
    backgroundImage:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=85',
  },
  whyTanjungLesung: {
    title: 'Satu\nKawasan,\nBerbagai\nPeluang.',
    subtitle:
      'Rp2,5 triliun telah ditanamkan di kawasan seluas 1.500 hektare ini — dan pertumbuhannya baru dimulai.',
    items: [
      {
        id: 'ujung-kulon',
        title: 'Gerbang ke Ujung Kulon',
        description:
          'Berdekatan dengan Taman Nasional Ujung Kulon, situs warisan dunia UNESCO — nilai tambah destinasi, bukan berdiri sendiri.',
        image:
          'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 'tol-serang',
        title: '2 Jam dari Jakarta',
        description:
          'Tol Serang-Panimbang memangkas waktu tempuh dari 5 jam menjadi 1,5-2 jam, ditargetkan rampung akhir 2026.',
        image:
          'https://images.unsplash.com/photo-1545459720-aac8509eb02c?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 'kek-resmi',
        title: 'KEK Resmi, Insentif Nyata',
        description:
          'Status Kawasan Ekonomi Khusus sejak 2012 memberi tax holiday hingga 100% dan kemudahan perizinan, bukan sekadar klaim.',
        image:
          'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 'lahan-pengembangan',
        title: '1.500 Hektare Lahan Pengembangan',
        description:
          'Nilai investasi riil yang sudah terserap di kawasan per 2026, menyerap 6.500 tenaga kerja lokal.',
        image:
          'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 'kepemilikan-asing',
        title: 'Kepemilikan Terbuka untuk Asing',
        description:
          'Kemudahan bagi investor/WNA untuk memiliki properti plus fasilitas visa di kawasan KEK.',
        image:
          'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 'operator-berpengalaman',
        title: 'Dikelola Operator Berpengalaman',
        description:
          'Bagian dari PT Kawasan Industri Jababeka Tbk (KIJA), perusahaan publik dengan rekam jejak puluhan tahun.',
        image:
          'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 'dukungan-pemerintah',
        title: 'Didukung Penuh Pemerintah',
        description:
          'Pemerintah provinsi dan pusat aktif mendorong kawasan ini sebagai destinasi pariwisata unggulan.',
        image:
          'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=800&q=80',
      },
    ],
  },
  directionMap: {
    title: 'Rute perjalanan yang kami sarankan',
    subtitle: 'Rute yang paling nyaman dari Soekarno-Hatta menuju KEK Tanjung Lesung.',
    nationalRoute: {
      title: 'Jalan Nasional',
      duration: '2 Jam 40 Menit',
      description: 'Gerbang toll Rangkasbitung, Menuju Tanjung Lesung',
    },
    tollRoute: {
      title: 'Jalan Tol',
      duration: '1 Jam 30 Menit',
      description: 'Bandara Soekarno-Hatta, Menuju Gerbang toll Rangkasbitung',
    },
    totalDuration: 'Total Perjalanan : 4 Jam 10 Menit',
    googleMapsUrl: 'https://maps.google.com/?q=KEK+Tanjung+Lesung',
    mapImage: '/images/direction-map.png',
  },
};
