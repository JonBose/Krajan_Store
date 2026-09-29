import React, { useState } from 'react';
import {
  X,
  Headphones,
  HelpCircle,
  ChevronDown,
  ShoppingBag,
  Truck,
  CreditCard,
  Gift,
  Clock,
  MessageCircle,
} from 'lucide-react';

interface KrajanFaqModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FaqItem {
  id: string;
  category: string;
  question: string;
  answer: string;
  icon: any;
}

export const KrajanFaqModal: React.FC<KrajanFaqModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [openFaqId, setOpenFaqId] = useState<string | null>('faq-1');

  if (!isOpen) return null;

  const faqs: FaqItem[] = [
    {
      id: 'faq-1',
      category: 'Pemesanan',
      question: 'Bagaimana cara berbelanja di Krajan Store?',
      answer:
        'Pilihlah produk yang diinginkan dari etalase kami (Fashion, Sembako, Hantaran & Parcel). Klik tombol "Detail" untuk membaca rincian ukuran/spesifikasi, lalu klik tombol Plus (+) untuk menambahkan ke keranjang belanja. Buka keranjang lalu klik "Lanjut ke Pembayaran" untuk konfirmasi pesanan.',
      icon: ShoppingBag,
    },
    {
      id: 'faq-2',
      category: 'Akun',
      question: 'Apakah harus membuat akun terlebih dahulu untuk berbelanja?',
      answer:
        'Tidak wajib! Pembeli umum dapat langsung berbelanja secara cepat (Guest Checkout). Anda cukup mengisi nama, nomor WhatsApp, dan alamat tujuan saat checkout. Tombol "Masuk" di kanan atas dikhususkan bagi kasir dan pengelola toko KDMP Pekalongan.',
      icon: HelpCircle,
    },
    {
      id: 'faq-3',
      category: 'Pengiriman',
      question: 'Bagaimana pilihan pengiriman dan berapa ongkos kirimnya?',
      answer:
        'Kami menyediakan 2 metode: 1) Ambil Mandiri di Toko (Pickup) di Outlet Swalayan Jetakkidul (Gratis). 2) Pesan Antar ke Rumah (Delivery) oleh kurir toko. Belanja di atas Rp 100.000 di area Jetakkidul, Wonopringgo, dan Kedungwuni mendapatkan GRATIS ongkir!',
      icon: Truck,
    },
    {
      id: 'faq-4',
      category: 'Pembayaran',
      question: 'Metode pembayaran apa saja yang didukung?',
      answer:
        'Kami mendukung: 1) QRIS Nasional (GoPay, OVO, DANA, ShopeePay, LinkAja, dan seluruh m-Banking). 2) Transfer Bank (BCA, BRI, Mandiri). 3) Bayar di Tempat (COD / Cash On Delivery) saat barang sampai di rumah Anda.',
      icon: CreditCard,
    },
    {
      id: 'faq-5',
      category: 'Parcel & Hantaran',
      question: 'Apakah bisa memesan custom Parcel Lebaran atau Hantaran Lamaran?',
      answer:
        'Sangat bisa! Anda dapat berkonsultasi langsung dengan admin mengenai tema warna pita, kombinasi isian (kue kering, sembako, busana muslim, kosmetik), serta box mika transparan atau akrilik rustic sesuai anggaran Anda.',
      icon: Gift,
    },
    {
      id: 'faq-6',
      category: 'Jam Buka',
      question: 'Kapan jam operasional toko dan layanan Krajan Store?',
      answer:
        'Outlet Swalayan Jetakkidul buka setiap hari pukul 07.00 - 21.00 WIB. Pemesanan melalui website dapat dilakukan 24 jam dan akan segera diproses serta dikonfirmasi pada jam operasional toko.',
      icon: Clock,
    },
  ];

  const toggleFaq = (id: string) => {
    setOpenFaqId((prev) => (prev === id ? null : id));
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl sm:rounded-3xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-gray-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#B71C1C] to-[#D32F2F] text-white p-4 sm:p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white shadow-xs">
              <Headphones className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black tracking-tight leading-tight">
                Krajanstore Care
              </h3>
              <p className="text-[11px] text-red-100">
                Pusat Bantuan & Tanya Jawab Pelanggan
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body: FAQ Accordion */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-2.5">
          <div className="text-xs font-semibold text-gray-500 mb-1">
            Pertanyaan Yang Sering Diajukan:
          </div>

          {faqs.map((faq) => {
            const isOpenFaq = openFaqId === faq.id;
            const Icon = faq.icon;

            return (
              <div
                key={faq.id}
                className={`border rounded-xl transition-all overflow-hidden ${
                  isOpenFaq
                    ? 'border-red-200 bg-red-50/30 shadow-2xs'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full text-left p-3 sm:p-3.5 flex items-center justify-between gap-3 cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                        isOpenFaq
                          ? 'bg-red-100 text-[#D32F2F]'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-bold text-xs sm:text-sm text-gray-900 leading-snug">
                      {faq.question}
                    </span>
                  </div>

                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 ${
                      isOpenFaq ? 'rotate-180 text-[#D32F2F]' : ''
                    }`}
                  />
                </button>

                {isOpenFaq && (
                  <div className="px-3 sm:px-3.5 pb-3.5 pt-0 text-xs text-gray-600 leading-relaxed border-t border-red-100/60 mt-1 pl-12">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer / Direct WhatsApp CS Button */}
        <div className="p-3.5 sm:p-4 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-[11px] text-gray-500 text-center sm:text-left">
            Pertanyaan belum terjawab? Hubungi tim admin kami secara langsung.
          </div>

          <a
            href="https://wa.me/6281234567890?text=Halo%20Admin%20Krajanstore%20Care,%20saya%20butuh%20bantuan%20terkait%20pemesanan"
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer whitespace-nowrap"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat WhatsApp CS</span>
          </a>
        </div>
      </div>
    </div>
  );
};
