import React from 'react';
import { Store, Phone, MapPin, Mail, ShieldCheck } from 'lucide-react';

interface KrajanFooterProps {
  onExploreProducts?: (category?: 'Fashion' | 'Sembako' | 'Hantaran & Parcel') => void;
  onOpenVendorRegister?: () => void;
}

export const KrajanFooter: React.FC<KrajanFooterProps> = ({
  onExploreProducts,
  onOpenVendorRegister,
}) => {
  return (
    <footer className="bg-slate-900 text-gray-300 text-xs border-t border-slate-800 mt-10">
      {/* 1. TOP BANNER: Mau Ikut Berjualan di Krajan Store? */}
      <div className="bg-[#B71C1C] text-white py-5 px-3 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="space-y-0.5">
            <h4 className="text-base sm:text-lg font-black tracking-tight">
              Mau ikut berjualan di Krajan Store?
            </h4>
            <p className="text-[11px] sm:text-xs text-red-100">
              Daftarkan produk usahamu sekarang untuk menjangkau lebih banyak pembeli di Krajan Store!
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenVendorRegister}
            className="px-6 py-2.5 bg-white text-[#D32F2F] hover:bg-red-50 active:scale-95 rounded-xl font-black text-xs shadow-md transition-all shrink-0 cursor-pointer flex items-center gap-1.5"
            title="Daftar Menjadi Mitra Penjual Krajan Store"
          >
            <span>Daftar Sekarang</span>
          </button>
        </div>
      </div>

      {/* 2. MAIN FOOTER BODY (3 Kolom Seimbang) */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-8 sm:py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Kolom 1: Brand Info */}
        <div className="space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#D32F2F] flex items-center justify-center text-white shadow-xs">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <div className="text-base font-black text-white tracking-tight">
                KRAJAN<span className="text-red-500">STORE</span>
              </div>
              <div className="text-[10px] text-gray-400">Pekalongan, Jawa Tengah</div>
            </div>
          </div>
          <p className="text-gray-400 leading-relaxed text-[11px]">
            Platform belanja digital terpercaya dan modern. Menyediakan sembako murah berkualitas, aneka fashion terbaik, hantaran & parcel istimewa, serta kebutuhan harian warga Pekalongan dan sekitarnya.
          </p>
          <div className="pt-0.5 flex items-center gap-2 text-emerald-400 font-semibold text-[11px]">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>Jaminan Produk Berkualitas & Pelayanan Cepat</span>
          </div>
        </div>

        {/* Kolom 2: Layanan Belanja */}
        <div className="space-y-3">
          <h5 className="font-bold text-white text-xs uppercase tracking-wider">
            Katalog Belanja
          </h5>
          <ul className="space-y-2 text-gray-400 text-[11px]">
            <li>
              <button
                type="button"
                onClick={() => onExploreProducts?.('Fashion')}
                className="hover:text-white transition-colors cursor-pointer text-left"
              >
                👔 Fashion & Busana Muslim
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => onExploreProducts?.('Sembako')}
                className="hover:text-white transition-colors cursor-pointer text-left"
              >
                🌾 Sembako Pokok & Minyak Goreng
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => onExploreProducts?.('Hantaran & Parcel')}
                className="hover:text-white transition-colors cursor-pointer text-left"
              >
                🎁 Hantaran Lamaran & Parcel Berkah
              </button>
            </li>
            <li>
              <a
                href="https://wa.me/6281234567890"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition-colors block"
              >
                💬 Layanan Pesan Antar Cepat WhatsApp
              </a>
            </li>
          </ul>
        </div>

        {/* Kolom 3: Lokasi & Kontak */}
        <div className="space-y-3">
          <h5 className="font-bold text-white text-xs uppercase tracking-wider">
            Lokasi & Kontak
          </h5>
          <div className="space-y-2 text-gray-400 text-[11px]">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span>
                <strong>Outlet Swalayan Jetakkidul:</strong><br />
                Jl. Raya Jetakkidul No. 1, Kec. Wonopringgo / Kedungwuni, Pekalongan
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>WhatsApp CS: 0812-3456-7890</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-blue-500 shrink-0" />
              <span>krajanstore@gmail.com</span>
            </div>
            <div className="text-[10.5px] text-gray-500 pt-0.5">
              Jam Operasional: Setiap Hari 07:00 - 21:00 WIB
            </div>
          </div>
        </div>
      </div>

      {/* 3. COPYRIGHT BAR */}
      <div className="border-t border-slate-800 py-3.5 px-3 sm:px-6 text-center text-gray-500 text-[11px]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1.5">
          <span className="font-medium text-gray-400">
            © 2026 KRAJAN STORE •
          </span>
          <span className="text-gray-500 text-[10.5px]">
            Belanja Mudah, Murah, dan Cepat untuk Semua Warga
          </span>
        </div>
      </div>
    </footer>
  );
};
