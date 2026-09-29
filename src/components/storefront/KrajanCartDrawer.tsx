import React, { useState } from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  Truck,
  Store,
  Tag,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { CartItem, StoreProduct } from '../../data/krajanStoreData';

interface KrajanCartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQty: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onProceedToCheckout: (deliveryType: 'pickup' | 'delivery', discountAmount: number) => void;
  isMemberMode: boolean;
}

export const KrajanCartDrawer: React.FC<KrajanCartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
  onProceedToCheckout,
  isMemberMode,
}) => {
  const [deliveryType, setDeliveryType] = useState<'pickup' | 'delivery'>('pickup');
  const [voucherCode, setVoucherCode] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState<{ code: string; discount: number } | null>(null);
  const [voucherError, setVoucherError] = useState('');

  if (!isOpen) return null;

  // Subtotal calculation
  const subtotal = items.reduce((sum, item) => {
    const price = isMemberMode ? item.product.memberPrice : item.product.price;
    return sum + price * item.quantity;
  }, 0);

  // Delivery fee: 0 for pickup, 5000 for delivery (free if subtotal >= 100000)
  const deliveryFee =
    deliveryType === 'pickup' ? 0 : subtotal >= 100000 ? 0 : 5000;

  const discount = appliedVoucher ? appliedVoucher.discount : 0;
  const grandTotal = Math.max(0, subtotal + deliveryFee - discount);

  const handleApplyVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    setVoucherError('');
    const code = voucherCode.trim().toUpperCase();

    if (code === 'KRAJANHEMAT' || code === 'KDMP2024') {
      setAppliedVoucher({ code, discount: 5000 });
      setVoucherCode('');
    } else if (code === 'ONGKIRGRATIS') {
      setAppliedVoucher({ code, discount: 5000 });
      setVoucherCode('');
    } else {
      setVoucherError('Kode voucher tidak valid atau sudah kadaluarsa.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          {/* 1. DRAWER HEADER */}
          <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-red-50 text-[#D32F2F] flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-sm sm:text-base">
                  Keranjang Belanja
                </h3>
                <p className="text-[11px] text-gray-500">
                  {items.length} item produk terpilih
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {items.length > 0 && (
                <button
                  onClick={onClearCart}
                  className="text-[11px] text-red-600 hover:text-red-700 font-semibold px-2 py-1 rounded hover:bg-red-50 transition-colors"
                >
                  Kosongkan
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1.5 rounded-xl hover:bg-gray-200 text-gray-500 hover:text-gray-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* 2. DRAWER ITEMS LIST */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 divide-y divide-gray-100">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-red-50 text-[#D32F2F] flex items-center justify-center text-2xl mb-3">
                  🛍️
                </div>
                <h4 className="font-bold text-gray-800 text-sm">Keranjang Anda Masih Kosong</h4>
                <p className="text-xs text-gray-500 mt-1 max-w-xs">
                  Yuk jelajahi sembako murah dan produk khas UMKM Dapur Krajan sekarang!
                </p>
                <button
                  onClick={onClose}
                  className="mt-4 px-4 py-2 bg-[#D32F2F] text-white rounded-xl text-xs font-bold shadow-md shadow-red-500/20"
                >
                  Mulai Belanja
                </button>
              </div>
            ) : (
              items.map((item) => {
                const price = isMemberMode ? item.product.memberPrice : item.product.price;
                const totalItem = price * item.quantity;

                return (
                  <div key={item.product.id} className="pt-3 first:pt-0 flex gap-3 items-center">
                    {/* Thumbnail */}
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-16 h-16 rounded-xl object-cover bg-gray-50 shrink-0 border border-gray-100"
                    />

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-gray-900 truncate">
                        {item.product.name}
                      </h4>
                      <div className="text-[11px] text-gray-500 mt-0.5">
                        Rp {price.toLocaleString('id-ID')} / {item.product.unit}
                      </div>
                      <div className="text-xs font-black text-[#D32F2F] mt-1">
                        Rp {totalItem.toLocaleString('id-ID')}
                      </div>
                    </div>

                    {/* Counter & Delete */}
                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <button
                        onClick={() => onRemoveItem(item.product.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors p-1"
                        title="Hapus"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                        <button
                          onClick={() => onUpdateQty(item.product.id, -1)}
                          className="px-2 py-1 text-gray-600 hover:bg-gray-200 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-bold text-gray-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQty(item.product.id, 1)}
                          className="px-2 py-1 text-gray-600 hover:bg-gray-200 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* 3. DRAWER FOOTER (Calculation & Checkout) */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-gray-200 bg-gray-50/70 space-y-3">
              {/* Delivery Choice */}
              <div>
                <span className="block text-[11px] font-bold text-gray-600 mb-1.5">
                  Metode Pengambilan / Pengiriman:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDeliveryType('pickup')}
                    className={`p-2.5 rounded-xl border text-left flex items-start gap-2 transition-all cursor-pointer ${
                      deliveryType === 'pickup'
                        ? 'border-red-500 bg-red-50/60 text-red-950 font-bold'
                        : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Store className="w-4 h-4 text-[#D32F2F] shrink-0 mt-0.5" />
                    <div className="text-[11px] leading-tight">
                      <div>Ambil di Outlet</div>
                      <div className="text-[10px] text-emerald-700 font-bold mt-0.5">Gratis (Rp 0)</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliveryType('delivery')}
                    className={`p-2.5 rounded-xl border text-left flex items-start gap-2 transition-all cursor-pointer ${
                      deliveryType === 'delivery'
                        ? 'border-red-500 bg-red-50/60 text-red-950 font-bold'
                        : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Truck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div className="text-[11px] leading-tight">
                      <div>Kurir Desa Krajan</div>
                      <div className="text-[10px] text-gray-500 mt-0.5">
                        {subtotal >= 100000 ? (
                          <span className="text-emerald-700 font-bold">Gratis (&gt;100rb)</span>
                        ) : (
                          'Rp 5.000'
                        )}
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Voucher Code Form */}
              <form onSubmit={handleApplyVoucher} className="flex gap-2">
                <input
                  type="text"
                  value={voucherCode}
                  onChange={(e) => setVoucherCode(e.target.value)}
                  placeholder="Kode voucher: KRAJANHEMAT"
                  className="flex-1 px-3 py-1.5 text-xs uppercase bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-red-500"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-gray-800 hover:bg-gray-900 text-white rounded-xl text-xs font-bold"
                >
                  Pakai
                </button>
              </form>

              {appliedVoucher && (
                <div className="flex items-center justify-between text-xs bg-emerald-50 text-emerald-800 p-2 rounded-xl border border-emerald-200">
                  <span className="flex items-center gap-1 font-bold">
                    <Tag className="w-3.5 h-3.5" />
                    Voucher {appliedVoucher.code} Aktif
                  </span>
                  <div className="flex items-center gap-2 font-bold">
                    <span>- Rp {appliedVoucher.discount.toLocaleString('id-ID')}</span>
                    <button
                      onClick={() => setAppliedVoucher(null)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )}

              {voucherError && (
                <div className="text-[11px] text-red-600 font-medium">
                  {voucherError}
                </div>
              )}

              {/* Pricing Breakdown */}
              <div className="space-y-1.5 text-xs pt-1 border-t border-gray-200 text-gray-600">
                <div className="flex items-center justify-between">
                  <span>Subtotal Produk</span>
                  <span className="font-semibold text-gray-900">
                    Rp {subtotal.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Biaya Pengantaran</span>
                  <span className="font-semibold text-gray-900">
                    {deliveryFee === 0 ? (
                      <strong className="text-emerald-700">GRATIS</strong>
                    ) : (
                      `Rp ${deliveryFee.toLocaleString('id-ID')}`
                    )}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex items-center justify-between text-emerald-700">
                    <span>Diskon Voucher</span>
                    <span className="font-bold">- Rp {discount.toLocaleString('id-ID')}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-sm pt-2 border-t border-gray-200">
                  <span className="font-bold text-gray-900">Total Pembayaran</span>
                  <span className="font-black text-base text-[#D32F2F]">
                    Rp {grandTotal.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => onProceedToCheckout(deliveryType, discount)}
                className="w-full py-3 px-4 bg-[#D32F2F] hover:bg-[#B71C1C] text-white font-bold text-xs rounded-xl shadow-md shadow-red-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>Lanjut ke Pembayaran & Pesan</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
