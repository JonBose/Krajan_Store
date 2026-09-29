import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  ShoppingCart,
  Headphones,
  LogIn,
  Store,
  LayoutGrid,
  ChevronDown,
  UserPlus,
} from 'lucide-react';
import { KrajanFaqModal } from './KrajanFaqModal';

interface KrajanStoreHeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenPosLogin: () => void;
  onOpenRegister?: () => void;
  onSelectCategory?: (category: 'Fashion' | 'Sembako' | 'Hantaran & Parcel') => void;
  selectedCategory?: 'Fashion' | 'Sembako' | 'Hantaran & Parcel';
}

// Custom TikTok SVG Icon
const TikTokIcon = ({ className = 'w-3.5 h-3.5' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-2.901 2.893 2.894 2.894 0 0 1-2.893-2.893 2.895 2.895 0 0 1 2.893-2.894c.277 0 .543.037.796.104V9.43a6.326 6.326 0 0 0-.796-.05 6.338 6.338 0 0 0-6.338 6.338 6.338 6.338 0 0 0 6.338 6.338 6.338 6.338 0 0 0 6.338-6.338V8.69a8.188 8.188 0 0 0 4.778 1.523v-3.48c-.352 0-.693-.016-1-.047z" />
  </svg>
);

export const KrajanStoreHeader: React.FC<KrajanStoreHeaderProps> = ({
  searchQuery,
  onSearchChange,
  cartCount,
  onOpenCart,
  onOpenPosLogin,
  onOpenRegister,
  onSelectCategory,
  selectedCategory,
}) => {
  const [isFaqOpen, setIsFaqOpen] = useState<boolean>(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState<boolean>(false);
  const categoryMenuRef = useRef<HTMLDivElement>(null);

  // Close category dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (categoryMenuRef.current && !categoryMenuRef.current.contains(e.target as Node)) {
        setIsCategoryMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Reusable search input markup
  const renderSearchInput = () => (
    <div className="relative flex items-center border border-gray-300 hover:border-red-400 focus-within:border-[#D32F2F] focus-within:ring-2 focus-within:ring-red-100 rounded-lg sm:rounded-xl overflow-hidden bg-gray-50/80 focus-within:bg-white transition-all w-full">
      <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 ml-2.5 sm:ml-3 shrink-0" />
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Cari sembako, beras, gamis, parcel..."
        className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-[11px] sm:text-xs text-gray-800 placeholder-gray-400 bg-transparent focus:outline-none"
      />
      {searchQuery && (
        <button
          type="button"
          onClick={() => onSearchChange('')}
          className="px-2 text-gray-400 hover:text-gray-600 text-xs shrink-0 cursor-pointer"
          title="Hapus pencarian"
        >
          ✕
        </button>
      )}
    </div>
  );

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200/80 shadow-xs">
        {/* 1. TOP BAR: Kiri (Krajanstore Care) & Kanan (TikTok Saja) */}
        <div className="bg-[#B71C1C] text-white text-[11px] sm:text-xs py-1.5 px-3 sm:px-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
            {/* Sebelah Kiri: Krajanstore Care (Tulisan FAQ telah dihapus) */}
            <button
              type="button"
              onClick={() => setIsFaqOpen(true)}
              className="flex items-center gap-1.5 text-white/95 hover:text-white transition-colors shrink-0 group cursor-pointer"
              title="Pusat Bantuan Krajanstore Care"
            >
              <Headphones className="w-3.5 h-3.5 text-amber-300 group-hover:scale-110 transition-transform" />
              <span className="font-semibold tracking-tight text-[11px] sm:text-xs underline-offset-2 hover:underline">
                Krajanstore Care
              </span>
            </button>

            {/* Sebelah Kanan: Medsos TikTok Cukup TikTok Saja */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[10px] text-white/70 hidden sm:inline font-normal">
                Ikuti Kami:
              </span>

              {/* TikTok */}
              <a
                href="https://www.tiktok.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-white/90 hover:text-white transition-colors px-1.5 py-0.5 rounded hover:bg-white/10"
                title="Ikuti TikTok Krajan Store"
              >
                <TikTokIcon className="w-3.5 h-3.5 text-white" />
                <span className="font-semibold text-[11px] sm:text-xs">TikTok</span>
              </a>
            </div>
          </div>
        </div>

        {/* 2. NAVBAR:
            - Mobile: Row 1 = Brand + Menu Kategori + Keranjang & Masuk.
                      Row 2 = Search bar memanjang full-width di bawah brand dan masuk.
            - Desktop: Row tunggal (Brand, Menu Kategori, Search, Keranjang & Masuk).
        */}
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 sm:py-2.5">
          {/* Row 1: Brand & Actions */}
          <div className="flex items-center justify-between gap-2.5 sm:gap-4 md:gap-6">
            {/* Logo & Nama Brand */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="flex items-center gap-2 sm:gap-2.5 shrink-0 cursor-pointer select-none group"
              >
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-[#B71C1C] to-[#E53935] flex items-center justify-center text-white shadow-sm shadow-red-500/20 group-hover:scale-105 transition-transform">
                  <Store className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="leading-none">
                  <div className="text-sm sm:text-base md:text-lg font-black tracking-tight text-gray-900">
                    KRAJAN<span className="text-[#D32F2F]">STORE</span>
                  </div>
                  <p className="hidden lg:block text-[9.5px] text-gray-400 font-medium mt-0.5">
                    KDMP Pekalongan
                  </p>
                </div>
              </div>

              {/* Menu Kategori Button & Dropdown */}
              {onSelectCategory && (
                <div className="relative" ref={categoryMenuRef}>
                  <button
                    type="button"
                    onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
                    className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl border font-bold text-[11px] sm:text-xs transition-all cursor-pointer ${
                      isCategoryMenuOpen
                        ? 'border-[#D32F2F] bg-red-50 text-[#D32F2F]'
                        : 'border-gray-200 bg-gray-50/80 hover:bg-red-50/60 hover:border-red-200 text-gray-800 hover:text-[#D32F2F]'
                    }`}
                    title="Menu Kategori Produk"
                  >
                    <LayoutGrid className="w-3.5 h-3.5 text-[#D32F2F]" />
                    <span className="hidden sm:inline">Kategori</span>
                    <ChevronDown
                      className={`w-3 h-3 text-gray-400 transition-transform duration-200 ${
                        isCategoryMenuOpen ? 'rotate-180 text-[#D32F2F]' : ''
                      }`}
                    />
                  </button>

                  {/* Dropdown Menu Kategori */}
                  {isCategoryMenuOpen && (
                    <div className="absolute left-0 mt-1.5 w-52 sm:w-56 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-50 animate-in fade-in duration-150">
                      <div className="text-[10px] font-black text-gray-400 uppercase tracking-wider px-2 py-1 mb-1">
                        Menu Kategori
                      </div>

                      <div className="space-y-1">
                        {(
                          [
                            { id: 'Fashion', icon: '👔', desc: 'Batik, gamis & daster' },
                            { id: 'Sembako', icon: '🌾', desc: 'Beras, minyak & gula' },
                            { id: 'Hantaran & Parcel', icon: '🎁', desc: 'Hampers & seserahan' },
                          ] as const
                        ).map((cat) => {
                          const isCatSelected = selectedCategory === cat.id;
                          return (
                            <button
                              key={cat.id}
                              type="button"
                              onClick={() => {
                                onSelectCategory(cat.id);
                                setIsCategoryMenuOpen(false);
                              }}
                              className={`w-full text-left p-2 rounded-xl text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                                isCatSelected
                                  ? 'bg-red-50 text-[#D32F2F]'
                                  : 'text-gray-700 hover:bg-gray-50 hover:text-[#D32F2F]'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <span className="text-sm">{cat.icon}</span>
                                <div>
                                  <div className="leading-tight">{cat.id}</div>
                                  <div className="text-[9.5px] font-normal text-gray-400">
                                    {cat.desc}
                                  </div>
                                </div>
                              </div>
                              {isCatSelected && (
                                <span className="w-1.5 h-1.5 rounded-full bg-[#D32F2F]" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Desktop Search Bar (Tampil hanya di layar md ke atas) */}
            <div className="hidden md:flex flex-1 max-w-xl mx-2">
              {renderSearchInput()}
            </div>

            {/* Keranjang & Masuk */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {/* Keranjang */}
              <button
                type="button"
                onClick={onOpenCart}
                className="relative p-1.5 sm:p-2 rounded-xl text-gray-700 hover:text-[#D32F2F] hover:bg-red-50/80 transition-colors cursor-pointer"
                title="Keranjang Belanja"
                aria-label="Buka Keranjang Belanja"
              >
                <ShoppingCart className="w-5 h-5 sm:w-5 sm:h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#D32F2F] text-white font-black text-[9.5px] min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center shadow-xs">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Tombol Masuk */}
              <button
                type="button"
                onClick={onOpenPosLogin}
                className="flex items-center gap-1 sm:gap-1.5 bg-gray-100 hover:bg-gray-200 active:scale-95 text-gray-700 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl font-bold text-[11px] sm:text-xs transition-all cursor-pointer"
                title="Masuk ke Akun / Sistem Kasir POS KDMP"
              >
                <LogIn className="w-3.5 h-3.5 text-gray-500" />
                <span className="hidden sm:inline">Masuk</span>
              </button>

              {/* Tombol Daftar */}
              {onOpenRegister && (
                <button
                  type="button"
                  onClick={onOpenRegister}
                  className="flex items-center gap-1 sm:gap-1.5 bg-[#D32F2F] hover:bg-[#B71C1C] active:scale-95 text-white px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-lg sm:rounded-xl font-bold text-[11px] sm:text-xs shadow-xs shadow-red-500/20 transition-all cursor-pointer"
                  title="Daftar Mitra / Member Krajan Store"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Daftar</span>
                </button>
              )}
            </div>
          </div>

          {/* Row 2 (Mobile Only): Search bar memanjang di bawah brand dan masuk */}
          <div className="block md:hidden mt-2 pt-0.5">
            {renderSearchInput()}
          </div>
        </div>
      </header>

      {/* Pop Up Modal FAQ (Krajanstore Care) */}
      <KrajanFaqModal
        isOpen={isFaqOpen}
        onClose={() => setIsFaqOpen(false)}
      />
    </>
  );
};
