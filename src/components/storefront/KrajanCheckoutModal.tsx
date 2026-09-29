import React, { useState } from 'react';
import {
  X,
  CheckCircle,
  Truck,
  Store,
  QrCode,
  Banknote,
  Building,
  MessageCircle,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { CartItem } from '../../data/krajanStoreData';

interface KrajanCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  deliveryType: 'pickup' | 'delivery';
  discountAmount: number;
  onOrderSuccess: (orderData: any) => void;
  isMemberMode: boolean;
}

export const KrajanCheckoutModal: React.FC<KrajanCheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  deliveryType,
  discountAmount,
  onOrderSuccess,
  isMemberMode,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'QRIS' | 'COD' | 'Transfer Bank'>('QRIS');
  const [isCompleted, setIsCompleted] = useState(false);
  const [orderInvoice, setOrderInvoice] = useState('');

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => {
    const price = isMemberMode ? item.product.memberPrice : item.product.price;
    return sum + price * item.quantity;
  }, 0);

  const deliveryFee =
    deliveryType === 'pickup' ? 0 : subtotal >= 100000 ? 0 : 5000;
  const grandTotal = Math.max(0, subtotal + deliveryFee - discountAmount);

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !phone.trim()) {
      alert('Mohon lengkapi Nama dan Nomor WhatsApp.');
      return;
    }

    const invoice = `KRJ-${Date.now().toString().slice(-6)}`;
    setOrderInvoice(invoice);
    setIsCompleted(true);

    onOrderSuccess({
      invoice,
      customerName,
      phone,
      address,
      items,
      grandTotal,
      paymentMethod,
      deliveryType,
      date: new Date().toLocaleString('id-ID'),
    });
  };

  const handleSendToWhatsApp = () => {
    const itemSummary = items
      .map(
        (i) =>
          `• ${i.product.name} (${i.quantity}x) = Rp ${(
            (isMemberMode ? i.product.memberPrice : i.product.price) * i.quantity
          ).toLocaleString('id-ID')}`
      )
      .join('\n');

    const msg = encodeURIComponent(
      `*PESANAN BARU - KRAJAN STORE (KDMP)*\n` +
        `No. Invoice: *${orderInvoice}*\n\n` +
        `*Data Pemesan:*\n` +
        `• Nama: ${customerName}\n` +
        `• No. WA: ${phone}\n` +
        `• Layanan: ${deliveryType === 'pickup' ? 'Ambil Sendiri di Outlet KDMP' : 'Antar ke Rumah'}\n` +
        (deliveryType === 'delivery' ? `• Alamat Antar: ${address}\n` : '') +
        (notes ? `• Catatan: ${notes}\n` : '') +
        `\n*Rincian Barang:*\n` +
        `${itemSummary}\n\n` +
        `*Total Pembayaran: Rp ${grandTotal.toLocaleString('id-ID')}*\n` +
        `*Metode Bayar: ${paymentMethod}*\n\n` +
        `Mohon segera diproses ya tim kasir KDMP. Terima kasih!`
    );

    window.open(`https://wa.me/6281234567890?text=${msg}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-gray-100 p-6 relative">
        {/* Close Button */}
        {!isCompleted && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {isCompleted ? (
          /* SUCCESS SCREEN */
          <div className="text-center py-4 space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle className="w-10 h-10" />
            </div>

            <div>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Pesanan Berhasil Dicatat!
              </span>
              <h3 className="text-xl font-black text-gray-900 mt-2">
                Terima Kasih, {customerName}!
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Nomor Invoice Anda:{' '}
                <strong className="text-gray-900 font-mono text-sm">{orderInvoice}</strong>
              </p>
            </div>

            {/* Total Box */}
            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 text-left space-y-2 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Total Belanja:</span>
                <span className="font-bold text-gray-900 text-sm">
                  Rp {grandTotal.toLocaleString('id-ID')}
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Metode Pembayaran:</span>
                <span className="font-semibold text-gray-800">{paymentMethod}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Layanan:</span>
                <span className="font-semibold text-gray-800">
                  {deliveryType === 'pickup' ? 'Ambil di Outlet Jetakkidul' : 'Diantar Kurir Desa'}
                </span>
              </div>

              {/* QRIS / Payment simulation display */}
              {paymentMethod === 'QRIS' && (
                <div className="pt-3 border-t border-gray-200 text-center">
                  <span className="text-[11px] font-bold text-gray-700 block mb-2">
                    Scan QRIS KDMP via GoPay, Dana, OVO, BCA, Livin:
                  </span>
                  <div className="w-36 h-36 mx-auto bg-white p-2 rounded-xl border border-gray-300 shadow-sm flex items-center justify-center">
                    <img
                      src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=KRAJAN-STORE-KDMP-001"
                      alt="QRIS KDMP"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="text-[10px] text-gray-400 mt-1 block">NMID: ID1020240928KDMP</span>
                </div>
              )}
            </div>

            {/* WA Forward Button */}
            <div className="pt-2 space-y-2">
              <button
                onClick={handleSendToWhatsApp}
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Kirim Bukti Pesanan ke Kasir KDMP (WhatsApp)</span>
              </button>

              <button
                onClick={onClose}
                className="w-full py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                Selesai & Kembali ke Toko
              </button>
            </div>
          </div>
        ) : (
          /* FORM CHECKOUT */
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-red-50 text-[#D32F2F] flex items-center justify-center">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-black text-gray-900">
                  Formulir Pemesanan Krajan Store
                </h3>
                <p className="text-[11px] text-gray-500">
                  Lengkapi data pemesanan untuk konfirmasi kasir KDMP
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmitOrder} className="space-y-3.5 text-xs">
              {/* Nama & WA */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Nama Lengkap Pemesan <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Contoh: Ibu Siti Rahayu"
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-red-500 focus:bg-white text-xs text-gray-900"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Nomor WhatsApp / HP Aktif <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Contoh: 081234567890"
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-red-500 focus:bg-white text-xs text-gray-900"
                />
              </div>

              {/* Delivery Address */}
              {deliveryType === 'delivery' ? (
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Alamat Lengkap Pengantaran <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Contoh: RT 02 / RW 01, Gang Melati, Depan Balai Desa Jetakkidul"
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-red-500 focus:bg-white text-xs text-gray-900"
                  />
                </div>
              ) : (
                <div className="p-3 bg-red-50 rounded-xl border border-red-100 flex items-start gap-2 text-[11px] text-red-900">
                  <Store className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>Lokasi Pengambilan Sendiri:</strong>
                    <p className="text-gray-600 mt-0.5">
                      Outlet Pusat KDMP, Jl. Raya Jetakkidul No. 1, Pekalongan.
                    </p>
                  </div>
                </div>
              )}

              {/* Notes */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Catatan untuk Kasir / Toko (Opsional)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Contoh: Minyak jangan dibanting, siap diambil jam 15:00"
                  className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-red-500 focus:bg-white text-xs text-gray-900"
                />
              </div>

              {/* Payment Methods */}
              <div>
                <label className="block font-bold text-gray-700 mb-1.5">
                  Pilih Cara Pembayaran:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('QRIS')}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                      paymentMethod === 'QRIS'
                        ? 'border-red-500 bg-red-50 text-red-950 font-bold'
                        : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <QrCode className="w-4 h-4 mx-auto mb-1 text-[#D32F2F]" />
                    <span className="text-[11px] block">QRIS Cepat</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('COD')}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                      paymentMethod === 'COD'
                        ? 'border-red-500 bg-red-50 text-red-950 font-bold'
                        : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <Banknote className="w-4 h-4 mx-auto mb-1 text-emerald-600" />
                    <span className="text-[11px] block">COD / Tunai</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Transfer Bank')}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                      paymentMethod === 'Transfer Bank'
                        ? 'border-red-500 bg-red-50 text-red-950 font-bold'
                        : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <Building className="w-4 h-4 mx-auto mb-1 text-blue-600" />
                    <span className="text-[11px] block">Transfer KDMP</span>
                  </button>
                </div>
              </div>

              {/* Total & Submit */}
              <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-gray-500">Total Bayar:</div>
                  <div className="text-base font-black text-[#D32F2F]">
                    Rp {grandTotal.toLocaleString('id-ID')}
                  </div>
                </div>

                <button
                  type="submit"
                  className="py-3 px-5 bg-[#D32F2F] hover:bg-[#B71C1C] text-white font-bold text-xs rounded-xl shadow-md shadow-red-500/20 flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <span>Konfirmasi Pesanan</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
