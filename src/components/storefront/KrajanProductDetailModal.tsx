import React, { useState } from 'react';
import {
  X,
  Star,
  Plus,
  Minus,
  ShoppingCart,
  MessageCircle,
  Truck,
  ShieldCheck,
  MapPin,
  Heart,
  Share2,
  Check,
} from 'lucide-react';
import { StoreProduct } from '../../data/krajanStoreData';

interface KrajanProductDetailModalProps {
  product: StoreProduct | null;
  onClose: () => void;
  onAddToCart: (product: StoreProduct, qty: number) => void;
  isWishlisted: boolean;
  onToggleWishlist: (id: string) => void;
  isMemberMode: boolean;
}

export const KrajanProductDetailModal: React.FC<KrajanProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  isWishlisted,
  onToggleWishlist,
  isMemberMode,
}) => {
  const [qty, setQty] = useState(1);
  const [copied, setCopied] = useState(false);

  if (!product) return null;

  const displayPrice = isMemberMode ? product.memberPrice : product.price;
  const totalPrice = displayPrice * qty;

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOrderWhatsApp = () => {
    const text = encodeURIComponent(
      `Halo Admin Kasir Krajan Store (KDMP),\n\nSaya ingin memesan:\n` +
        `• Produk: ${product.name}\n` +
        `• Jumlah: ${qty} ${product.unit}\n` +
        `• Total Estimasi: Rp ${totalPrice.toLocaleString('id-ID')}\n\n` +
        `Mohon info ketersediaan stok & pengiriman ke alamat saya. Terima kasih!`
    );
    window.open(`https://wa.me/6281234567890?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-gray-100 relative flex flex-col md:flex-row overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left: Product Image */}
        <div className="md:w-1/2 bg-gray-50 p-6 flex flex-col justify-between">
          <div className="relative rounded-2xl overflow-hidden aspect-square shadow-sm bg-white">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.badge && (
              <span className="absolute top-3 left-3 bg-[#D32F2F] text-white text-xs font-black px-2.5 py-1 rounded-lg shadow-md">
                {product.badge}
              </span>
            )}
          </div>

          {/* Guarantee Badges */}
          <div className="mt-4 pt-4 border-t border-gray-200/80 space-y-2 text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Bisa diantar kurir desa atau ambil di Outlet Jetakkidul</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
              <span>100% Produk Dijamin Asli & Timbangan Akurat</span>
            </div>
          </div>
        </div>

        {/* Right: Product Details & Actions */}
        <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-between space-y-5">
          <div>
            {/* Origin & Category */}
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-1.5">
              <span className="font-semibold text-red-600 uppercase tracking-wider">
                {product.category}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-gray-400" />
                {product.origin}
              </span>
            </div>

            {/* Title */}
            <h2 className="text-lg sm:text-xl font-black text-gray-900 leading-snug">
              {product.name}
            </h2>

            {/* Rating & Sold count */}
            <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
              <div className="flex items-center gap-1 text-amber-500 font-bold bg-amber-50 px-2 py-0.5 rounded-md">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{product.rating}</span>
                <span className="text-gray-400 font-normal">({product.reviewCount} ulasan)</span>
              </div>
              <span>|</span>
              <span>Terjual <strong>{product.soldCount}</strong> {product.unit}</span>
            </div>

            {/* Price Box */}
            <div className="mt-4 p-4 rounded-2xl bg-red-50/60 border border-red-100">
              {product.originalPrice && (
                <div className="text-xs text-gray-400 line-through">
                  Rp {product.originalPrice.toLocaleString('id-ID')}
                </div>
              )}
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black text-[#D32F2F]">
                  Rp {displayPrice.toLocaleString('id-ID')}
                </span>
                <span className="text-xs text-gray-500 font-medium">/{product.unit}</span>
              </div>

              <div className="mt-2 pt-2 border-t border-red-200/60 flex items-center justify-between text-xs">
                <span className="text-gray-600">Harga Spesial Anggota KDMP:</span>
                <strong className="text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded font-mono">
                  Rp {product.memberPrice.toLocaleString('id-ID')}
                </strong>
              </div>
            </div>

            {/* Description */}
            <div className="mt-4">
              <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-1">
                Deskripsi Produk:
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Quantity Selector */}
            <div className="mt-5 flex items-center justify-between">
              <span className="text-xs font-bold text-gray-700">Jumlah Beli:</span>
              <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden bg-white">
                <button
                  onClick={() => setQty((prev) => Math.max(1, prev - 1))}
                  className="px-3 py-1.5 hover:bg-gray-100 text-gray-600 transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-4 py-1.5 text-xs font-bold text-gray-900 min-w-[36px] text-center">
                  {qty}
                </span>
                <button
                  onClick={() => setQty((prev) => Math.min(product.stock, prev + 1))}
                  className="px-3 py-1.5 hover:bg-gray-100 text-gray-600 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="mt-1 text-right text-[11px] text-gray-400">
              Sisa stok tersedia: <strong>{product.stock} {product.unit}</strong>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-gray-200 space-y-2.5">
            {/* Subtotal */}
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Subtotal Belanja:</span>
              <span className="text-base font-black text-gray-900">
                Rp {totalPrice.toLocaleString('id-ID')}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {/* Add to Cart */}
              <button
                onClick={() => {
                  onAddToCart(product, qty);
                  onClose();
                }}
                className="py-3 px-4 bg-[#D32F2F] hover:bg-[#B71C1C] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-red-500/20 transition-all cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>+ Keranjang</span>
              </button>

              {/* Direct WhatsApp Order */}
              <button
                onClick={handleOrderWhatsApp}
                className="py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Order via WA</span>
              </button>
            </div>

            {/* Share & Wishlist Row */}
            <div className="flex items-center justify-between pt-1">
              <button
                onClick={() => onToggleWishlist(product.id)}
                className={`text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
                  isWishlisted ? 'text-red-600 font-bold' : 'text-gray-500 hover:text-red-600'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-red-600' : ''}`} />
                <span>{isWishlisted ? 'Tersimpan di Favorit' : 'Simpan ke Favorit'}</span>
              </button>

              <button
                onClick={handleShare}
                className="text-xs text-gray-500 hover:text-gray-800 flex items-center gap-1 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copied ? 'Link Disalin!' : 'Bagikan Produk'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
