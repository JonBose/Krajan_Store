import React, { useState, useMemo, useEffect } from 'react';
import {
  Star,
  Plus,
  Heart,
  Eye,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { StoreProduct } from '../../data/krajanStoreData';

interface KrajanProductGridProps {
  products: StoreProduct[];
  selectedCategory: 'Fashion' | 'Sembako' | 'Hantaran & Parcel';
  onSelectCategory: (cat: 'Fashion' | 'Sembako' | 'Hantaran & Parcel') => void;
  searchQuery: string;
  onAddToCart: (product: StoreProduct) => void;
  onQuickView: (product: StoreProduct) => void;
  wishlistIds: string[];
  onToggleWishlist: (productId: string) => void;
  isMemberMode: boolean;
}

export const KrajanProductGrid: React.FC<KrajanProductGridProps> = ({
  products,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onAddToCart,
  onQuickView,
  wishlistIds,
  onToggleWishlist,
  isMemberMode,
}) => {
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'rating'>('default');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 6;

  // Reset pagination to page 1 whenever category or search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery, sortBy]);

  // Filter & Search Logic
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category filter (Fashion, Sembako, Hantaran & Parcel)
      const matchesCategory = p.category === selectedCategory;

      // Search Query filter
      const matchesSearch =
        !searchQuery.trim() ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.origin.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  // Sort logic
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    }
    return list;
  }, [filteredProducts, sortBy]);

  // Pagination calculation
  const totalPages = Math.ceil(sortedProducts.length / pageSize);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedProducts.slice(start, start + pageSize);
  }, [sortedProducts, currentPage, pageSize]);

  return (
    <section className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-5">
      {/* 1. SECTION TITLE: Produk Krajan Store (Warna Merah Font Size Dibesarkan) */}
      <div className="mb-2.5">
        <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-[#D32F2F] tracking-tight">
          Produk Krajan Store
        </h3>
      </div>

      {/* 2. DIBAWAHNYA LANGSUNG TAB: Fashion, Sembako, Hantaran & Parcel + SORT */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2 mb-4 border-b border-gray-200">
        {/* Direct Tabs: Fashion, Sembako, Hantaran & Parcel */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 py-0.5">
          {(['Fashion', 'Sembako', 'Hantaran & Parcel'] as const).map((cat) => {
            const isActive = selectedCategory === cat;
            const count = products.filter((p) => p.category === cat).length;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  onSelectCategory(cat);
                  setCurrentPage(1);
                }}
                className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 shadow-2xs ${
                  isActive
                    ? 'bg-[#D32F2F] text-white shadow-sm shadow-red-500/20'
                    : 'bg-white text-gray-700 hover:text-[#D32F2F] hover:bg-red-50/50 border border-gray-200'
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Sort Selector */}
        <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0">
          <span className="text-[11px] text-gray-400 sm:hidden">Urutkan:</span>
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value as any);
              setCurrentPage(1);
            }}
            className="bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs text-gray-700 font-semibold focus:outline-none focus:border-[#D32F2F] cursor-pointer"
          >
            <option value="default">Urutkan: Rekomendasi</option>
            <option value="price-asc">Harga Termurah</option>
            <option value="price-desc">Harga Tertinggi</option>
            <option value="rating">Rating Tertinggi</option>
          </select>
        </div>
      </div>

      {/* 3. PRODUCT CARDS GRID (Jumlah 6 per halaman) */}
      {paginatedProducts.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center border border-gray-100 shadow-2xs max-w-sm mx-auto my-6">
          <div className="w-12 h-12 mx-auto rounded-full bg-red-50 text-[#D32F2F] flex items-center justify-center text-xl mb-2">
            🔍
          </div>
          <h4 className="text-sm font-bold text-gray-800">Produk Tidak Ditemukan</h4>
          <p className="text-[11px] text-gray-500 mt-1">
            Silakan cek kata kunci pencarian atau pilih tab kategori lainnya.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2.5 sm:gap-3.5">
          {paginatedProducts.map((product) => {
            const isWishlisted = wishlistIds.includes(product.id);
            const displayPrice = isMemberMode ? product.memberPrice : product.price;

            return (
              <div
                key={product.id}
                className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-2xs hover:shadow-md hover:border-red-200 transition-all flex flex-col justify-between group overflow-hidden"
              >
                {/* Thumbnail */}
                <div className="relative h-36 sm:h-44 bg-gray-50 overflow-hidden cursor-pointer">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />

                  {/* Badge */}
                  {product.badge && (
                    <div
                      className={`absolute top-2 left-2 text-[9px] font-black px-1.5 py-0.5 rounded shadow-2xs text-white ${
                        product.badgeColor === 'green'
                          ? 'bg-emerald-600'
                          : product.badgeColor === 'amber'
                          ? 'bg-amber-600'
                          : product.badgeColor === 'purple'
                          ? 'bg-purple-600'
                          : product.badgeColor === 'blue'
                          ? 'bg-blue-600'
                          : 'bg-[#D32F2F]'
                      }`}
                    >
                      {product.badge}
                    </div>
                  )}

                  {/* Wishlist Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleWishlist(product.id);
                    }}
                    className={`absolute top-2 right-2 p-1 rounded-full backdrop-blur-xs transition-all shadow-2xs ${
                      isWishlisted
                        ? 'bg-red-500 text-white'
                        : 'bg-white/80 hover:bg-white text-gray-500 hover:text-red-500'
                    }`}
                    title={isWishlisted ? 'Hapus favorit' : 'Simpan favorit'}
                  >
                    <Heart className="w-3 h-3 fill-current" />
                  </button>

                  {/* Quick View Trigger on Hover */}
                  <div
                    onClick={() => onQuickView(product)}
                    className="absolute inset-0 bg-black/15 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                  >
                    <span className="bg-white/95 text-gray-900 text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-sm flex items-center gap-1">
                      <Eye className="w-3 h-3 text-[#D32F2F]" />
                      Detail
                    </span>
                  </div>
                </div>

                {/* Product Meta */}
                <div className="p-2.5 sm:p-3 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Origin & Category */}
                    <div className="flex items-center gap-1 text-[9.5px] text-gray-400 mb-0.5">
                      <span className="text-[#D32F2F] font-bold">{product.category}</span>
                      <span>•</span>
                      <span className="truncate">{product.origin}</span>
                    </div>

                    {/* Title */}
                    <h3
                      onClick={() => onQuickView(product)}
                      className="text-[11px] sm:text-xs font-bold text-gray-900 line-clamp-2 hover:text-[#D32F2F] transition-colors cursor-pointer leading-tight min-h-[30px]"
                      title={product.name}
                    >
                      {product.name}
                    </h3>

                    {/* Rating & Sold count */}
                    <div className="flex items-center gap-1.5 mt-1 text-[10px] text-gray-500">
                      <div className="flex items-center gap-0.5 text-amber-500 font-bold">
                        <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                        <span>{product.rating}</span>
                      </div>
                      <span className="text-gray-300">|</span>
                      <span>Terjual {product.soldCount}</span>
                    </div>

                    {/* Price Block */}
                    <div className="mt-1.5">
                      {product.originalPrice && (
                        <div className="text-[10px] text-gray-400 line-through">
                          Rp {product.originalPrice.toLocaleString('id-ID')}
                        </div>
                      )}

                      <div className="flex items-baseline gap-1">
                        <span className="text-xs sm:text-sm font-black text-[#D32F2F]">
                          Rp {displayPrice.toLocaleString('id-ID')}
                        </span>
                        <span className="text-[9px] text-gray-400">/{product.unit}</span>
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
      )}

      {/* 4. PAGINATION: Tampil Jika Jumlah Produk Lebih Dari 6 */}
      {sortedProducts.length > pageSize && (
        <div className="mt-6 pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="text-gray-500 font-medium text-[11px] sm:text-xs">
            Menampilkan{' '}
            <strong className="text-gray-900">
              {(currentPage - 1) * pageSize + 1} -{' '}
              {Math.min(currentPage * pageSize, sortedProducts.length)}
            </strong>{' '}
            dari <strong className="text-gray-900">{sortedProducts.length}</strong> produk {selectedCategory}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => {
                setCurrentPage((p) => Math.max(p - 1, 1));
                const el = document.getElementById('katalog-produk');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed font-bold flex items-center gap-1 cursor-pointer"
              title="Halaman Sebelumnya"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Sebelumnya</span>
            </button>

            {Array.from({ length: totalPages }).map((_, i) => {
              const pageNum = i + 1;
              const isCurrent = pageNum === currentPage;
              return (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => {
                    setCurrentPage(pageNum);
                    const el = document.getElementById('katalog-produk');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`w-8 h-8 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-[#D32F2F] text-white shadow-xs'
                      : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => {
                setCurrentPage((p) => Math.min(p + 1, totalPages));
                const el = document.getElementById('katalog-produk');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed font-bold flex items-center gap-1 cursor-pointer"
              title="Halaman Berikutnya"
            >
              <span className="hidden sm:inline">Selanjutnya</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
