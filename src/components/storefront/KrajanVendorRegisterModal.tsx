import React, { useState } from 'react';
import {
  X,
  Store,
  User,
  Phone,
  MapPin,
  Tag,
  FileText,
  CheckCircle2,
  Sparkles,
  MessageCircle,
  ArrowRight,
  Database,
  Loader2,
} from 'lucide-react';
import { saveVendorRegistration } from '../../lib/firebase';

interface KrajanVendorRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessToast: (type: 'success' | 'info' | 'warning', title: string, message: string) => void;
}

export const KrajanVendorRegisterModal: React.FC<KrajanVendorRegisterModalProps> = ({
  isOpen,
  onClose,
  onSuccessToast,
}) => {
  const [formData, setFormData] = useState({
    ownerName: '',
    storeName: '',
    category: 'Fashion' as 'Fashion' | 'Sembako' | 'Hantaran & Parcel' | 'Olahan Makanan' | 'Lainnya',
    phone: '',
    address: '',
    productDescription: '',
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [vendorCode, setVendorCode] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.ownerName || !formData.storeName || !formData.phone) {
      onSuccessToast('warning', 'Data Belum Lengkap', 'Mohon lengkapi nama pemilik, nama usaha, dan nomor WhatsApp.');
      return;
    }

    setIsSubmitting(true);
    const code = `UMKM-${Math.floor(1000 + Math.random() * 9000)}`;
    setVendorCode(code);

    // Save to Firestore Online Database
    await saveVendorRegistration({
      ownerName: formData.ownerName,
      storeName: formData.storeName,
      category: formData.category,
      phone: formData.phone,
      address: formData.address,
      productDescription: formData.productDescription,
      vendorCode: code,
      status: 'pending',
    });

    setIsSubmitting(false);
    setIsSubmitted(true);

    onSuccessToast(
      'success',
      'Pendaftaran Tersimpan di Database!',
      `Terima kasih ${formData.ownerName}. Pengajuan mitra ${formData.storeName} (${code}) telah tersimpan di cloud database Krajan Store.`
    );
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setFormData({
      ownerName: '',
      storeName: '',
      category: 'Fashion',
      phone: '',
      address: '',
      productDescription: '',
    });
    onClose();
  };

  const waMessage = encodeURIComponent(
    `Halo Admin Krajan Store, saya sudah mendaftar sebagai Calon Mitra Penjual UMKM.\n\n` +
      `*No. Pengajuan:* ${vendorCode}\n` +
      `*Nama Pemilik:* ${formData.ownerName}\n` +
      `*Nama Usaha/Toko:* ${formData.storeName}\n` +
      `*Kategori Produk:* ${formData.category}\n` +
      `*No. WA:* ${formData.phone}\n` +
      `*Alamat:* ${formData.address || '-'}\n` +
      `*Deskripsi Produk:* ${formData.productDescription || '-'}\n\n` +
      `Mohon informasi langkah selanjutnya untuk peninjauan sampel produk. Terima kasih!`
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={handleReset}
    >
      <div
        className="bg-white rounded-2xl sm:rounded-3xl max-w-lg w-full max-h-[92vh] flex flex-col shadow-2xl border border-gray-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Modal */}
        <div className="bg-gradient-to-r from-[#B71C1C] via-[#C62828] to-[#D32F2F] text-white p-4 sm:p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white shadow-xs">
              <Store className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black tracking-tight leading-tight">
                Daftar Mitra Penjual UMKM
              </h3>
              <p className="text-[11px] text-red-100">
                Kolaborasi pasarkan produk lokal di Krajan Store KDMP
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {isSubmitted ? (
            /* SUCCESS STATE */
            <div className="py-4 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-1">
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Pengajuan Terkirim
                </span>
                <h4 className="text-lg sm:text-xl font-black text-gray-900">
                  Selamat, Pendaftaran Anda Diterima!
                </h4>
                <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
                  Tim kurasi Krajan Store KDMP Pekalongan akan meninjau data usaha{' '}
                  <strong className="text-gray-800">{formData.storeName}</strong> dalam 1x24 jam kerja.
                </p>
              </div>

              {/* Detail Ringkasan */}
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 text-left text-xs space-y-2">
                <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                  <span className="text-gray-500">Nomor Registrasi:</span>
                  <span className="font-mono font-bold text-[#D32F2F] bg-red-50 px-2 py-0.5 rounded border border-red-200">
                    {vendorCode}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Nama Pemilik:</span>
                  <span className="font-bold text-gray-800">{formData.ownerName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Kategori:</span>
                  <span className="font-bold text-gray-800">{formData.category}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">WhatsApp:</span>
                  <span className="font-bold text-gray-800">{formData.phone}</span>
                </div>
              </div>

              {/* Tombol Aksi */}
              <div className="space-y-2 pt-2">
                <a
                  href={`https://wa.me/6281234567890?text=${waMessage}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold text-xs rounded-xl shadow transition-all cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Kirim Sampel Produk via WhatsApp</span>
                </a>

                <button
                  type="button"
                  onClick={handleReset}
                  className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Selesai & Kembali ke Toko
                </button>
              </div>
            </div>
          ) : (
            /* FORM STATE */
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2.5 text-xs text-amber-900">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="leading-snug">
                  Gabung bersama puluhan produsen batik, sembako, dan parcel lokal. Produk Anda akan
                  dipajang di etalase Krajan Store dan outlet swalayan Jetakkidul.
                </p>
              </div>

              {/* Nama Pemilik & Nama Usaha */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-gray-700 block mb-1">
                    Nama Pemilik Usaha <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={formData.ownerName}
                      onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                      placeholder="Contoh: Ibu Rini"
                      className="w-full pl-8 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-[#D32F2F] focus:ring-1 focus:ring-red-200 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-700 block mb-1">
                    Nama Brand / Toko <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Store className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={formData.storeName}
                      onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                      placeholder="Contoh: Batik Rini Jaya"
                      className="w-full pl-8 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-[#D32F2F] focus:ring-1 focus:ring-red-200 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Kategori Produk & No WhatsApp */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-gray-700 block mb-1">
                    Kategori Produk Utama <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Tag className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value as any })
                      }
                      className="w-full pl-8 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-[#D32F2F] focus:ring-1 focus:ring-red-200 transition-all cursor-pointer"
                    >
                      <option value="Fashion">Fashion (Batik, Gamis, Daster, Sarung)</option>
                      <option value="Sembako">Sembako & Pangan Pokok</option>
                      <option value="Hantaran & Parcel">Hantaran, Parcel & Seserahan</option>
                      <option value="Olahan Makanan">Kue Kering & Makanan Olahan</option>
                      <option value="Lainnya">Produk Kreatif Lainnya</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-700 block mb-1">
                    Nomor WhatsApp Aktif <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="081234567890"
                      className="w-full pl-8 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-[#D32F2F] focus:ring-1 focus:ring-red-200 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Alamat Usaha */}
              <div>
                <label className="text-[11px] font-bold text-gray-700 block mb-1">
                  Alamat Usaha / Lokasi Produksi
                </label>
                <div className="relative">
                  <MapPin className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3" />
                  <textarea
                    rows={2}
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Contoh: Ds. Jetakkidul RT 02 / RW 01, Kec. Wonopringgo, Pekalongan"
                    className="w-full pl-8 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-[#D32F2F] focus:ring-1 focus:ring-red-200 transition-all"
                  />
                </div>
              </div>

              {/* Deskripsi Produk */}
              <div>
                <label className="text-[11px] font-bold text-gray-700 block mb-1">
                  Rincian Produk & Perkiraan Harga Jual
                </label>
                <div className="relative">
                  <FileText className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3" />
                  <textarea
                    rows={2}
                    value={formData.productDescription}
                    onChange={(e) =>
                      setFormData({ ...formData, productDescription: e.target.value })
                    }
                    placeholder="Contoh: Kemeja batik tulis katun primisima, harga Rp 85.000 - Rp 130.000. Kapasitas produksi 50 pcs/minggu."
                    className="w-full pl-8 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-[#D32F2F] focus:ring-1 focus:ring-red-200 transition-all"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 sm:py-3 bg-gradient-to-r from-[#B71C1C] to-[#D32F2F] hover:from-[#A51616] hover:to-[#B71C1C] active:scale-98 disabled:opacity-60 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-red-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Menyimpan ke Database Cloud...</span>
                    </>
                  ) : (
                    <>
                      <Database className="w-4 h-4 text-amber-300" />
                      <span>Daftarkan Usaha Saya Sekarang</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
                <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-400 text-center mt-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Tersinkronisasi otomatis dengan Cloud Database Firebase</span>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
