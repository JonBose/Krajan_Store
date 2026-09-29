import React, { useState, useEffect } from 'react';
import { Sparkles, Clock, Plus, Eye } from 'lucide-react';
import { StoreProduct } from '../../data/krajanStoreData';

interface KrajanFlashSaleProps {
  products: StoreProduct[];
  onAddToCart: (product: StoreProduct) => void;
  onQuickView: (product: StoreProduct) => void;
  isMemberMode: boolean;
}

export const KrajanFlashSale: React.FC<KrajanFlashSaleProps> = ({
  products,
  onAddToCart,
  onQuickView,
  isMemberMode,
}) => {
  // Countdown Timer state
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 32, seconds: 18 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const promoItems = products.filter((p) => p.isFlashSale).slice(0, 4);

  if (promoItems.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-3 sm:px-6 py-2 sm:py-3">
      <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 text-white shadow-sm">
        {/* Promo Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-white/20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-400 text-red-950 flex items-center justify-center font-black shadow-xs">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-red-700 fill-red-700" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black tracking-tight text-white uppercase">
                  Promo Hari Ini
                </h3>
                <span className="bg-white/25 text-[9.5px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                  Terbatas
                </span>
              </div>
              <p className="text-[11px] text-white/85">
                Penawaran harga terbaik & hemat produk pilihan hari ini!
              </p>
            </div>
          </div>

          {/* Countdown Clock */}
          <div className="flex items-center gap-2 self-start sm:self-auto bg-black/25 backdrop-blur-xs px-3 py-1 rounded-xl border border-white/20 text-xs">
            <Clock className="w-3.5 h-3.5 text-amber-300" />
            <span className="text-[11px] font-medium text-white/90">Berakhir dalam:</span>
            <div className="flex items-center gap-1 font-mono font-bold text-[11px]">
              <span className="bg-white text-gray-900 px-1.5 py-0.5 rounded">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span>:</span>
              <span className="bg-white text-gray-900 px-1.5 py-0.5 rounded">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span>:</span>
              <span className="bg-white text-gray-900 px-1.5 py-0.5 rounded">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
            </div>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3.5 pt-3 sm:pt-4">
          {promoItems.map((product) => {
            const finalPrice = isMemberMode ? product.memberPrice : product.price;

            return (
              <div
                key={product.id}
                className="bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-2xs hover:shadow-md transition-all text-gray-900 flex flex-col justify-between group"
              >
                {/* Image Box */}
                <div
                  className="relative h-32 sm:h-40 bg-gray-100 cursor-pointer overflow-hidden"
                  onClick={() => onQuickView(product)}
                >
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />

                  {/* Badge */}
                  <div className="absolute top-2 left-2 bg-[#D32F2F] text-white text-[9.5px] font-black px-1.5 py-0.5 rounded shadow-2xs">
                    {product.badge || 'PROMO'}
                  </div>

                  {/* Quick View Overlay Button */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="bg-white text-gray-800 text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-sm flex items-center gap-1">
                      <Eye className="w-3 h-3 text-[#D32F2F]" />
                      Detail
                    </span>
                  </div>
                </div>

                {/* Content Box */}
                <div className="p-2.5 sm:p-3 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-[9.5px] font-semibold text-gray-400 uppercase tracking-wider">
                      {product.category}
                    </div>
                    <h4
                      onClick={() => onQuickView(product)}
                      className="text-[11px] sm:text-xs font-bold text-gray-900 line-clamp-2 mt-0.5 hover:text-red-600 transition-colors cursor-pointer leading-tight"
                      title={product.name}
                    >
                      {product.name}
                    </h4>

                    {/* Pricing */}
                    <div className="mt-1.5">
                      {product.originalPrice && (
                        <div className="text-[10px] text-gray-400 line-through">
                          Rp {product.originalPrice.toLocaleString('id-ID')}
                        </div>
                      )}
                      <div className="flex items-baseline gap-1">
                        <span className="text-xs sm:text-sm font-black text-[#D32F2F]">
                          Rp {finalPrice.toLocaleString('id-ID')}
                        </span>
                        <span className="text-[9.5px] text-gray-400">/{product.unit}</span>
                      </div>
                    </div>
                  </div>

                  {/* Buttons: Detail & Plus */}
                  <div className="mt-2.5 pt-2 border-t border-gray-100 flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => onQuickView(product)}
                      className="flex-1 py-1.5 px-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 active:scale-95 rounded-lg font-bold text-[11px] flex items-center justify-center gap-1 transition-all cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-gray-500" />
                      <span>Detail</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onAddToCart(product)}
                      className="py-1.5 px-2.5 sm:px-3 bg-[#D32F2F] hover:bg-[#B71C1C] active:scale-95 text-white rounded-lg font-bold text-[11px] flex items-center justify-center gap-1 shadow-2xs transition-all cursor-pointer shrink-0"
                      title="Tambah ke Keranjang"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
