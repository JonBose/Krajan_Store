import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Truck,
  ShieldCheck,
  CreditCard,
  Sparkles,
  ArrowRight,
  Tag,
  Shirt,
  Wheat,
  Gift,
  ChevronRight as ChevronNext,
} from 'lucide-react';

interface KrajanStoreHeroProps {
  onSelectCategory: (category: 'Fashion' | 'Sembako' | 'Hantaran & Parcel') => void;
  selectedCategory: string;
}

export const KrajanStoreHero: React.FC<KrajanStoreHeroProps> = ({
  onSelectCategory,
  selectedCategory,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      badge: 'PROMO BULAN INI',
      title: 'Gebyar Sembako Murah Krajan',
      subtitle: 'Beras pulen, minyak kemasan 2L, dan gula murni harga hemat langsung dari distributor.',
      bgGradient: 'from-red-900 via-rose-800 to-amber-900',
      actionText: 'Lihat Sembako',
      category: 'Sembako' as const,
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80',
      highlightTag: 'Hemat s/d 15%',
    },
    {
      id: 2,
      badge: 'KOLEKSI TERBARU',
      title: 'Fashion Batik & Busana Muslim',
      subtitle: 'Kemeja batik khas Pekalongan, gamis rayon twill, daster santung adem & sarung halus.',
      bgGradient: 'from-rose-950 via-red-900 to-orange-950',
      actionText: 'Lihat Fashion',
      category: 'Fashion' as const,
      image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1200&q=80',
      highlightTag: 'Motif Eksklusif',
    },
    {
      id: 3,
      badge: 'ISTIMEWA & ELEGAN',
      title: 'Hantaran Seserahan & Parcel Cantik',
      subtitle: 'Paket parcel hari raya, hampers kue kering, dan kotak seserahan pernikahan rustic akrilik.',
      bgGradient: 'from-purple-950 via-rose-900 to-red-900',
      actionText: 'Lihat Parcel',
      category: 'Hantaran & Parcel' as const,
      image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1200&q=80',
      highlightTag: 'Siap Hantar',
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const categoryCards = [
    {
      id: 'Fashion' as const,
      name: 'Fashion',
      desc: 'Batik Pekalongan, gamis, daster & sarung',
      count: '6 Produk',
      icon: Shirt,
      gradient: 'from-rose-500/10 to-red-500/10 hover:from-rose-500/20 hover:to-red-500/20',
      border: 'border-rose-200/80 hover:border-rose-400',
      iconBg: 'bg-rose-500 text-white',
    },
    {
      id: 'Sembako' as const,
      name: 'Sembako',
      desc: 'Beras premium, minyak, gula & telur segar',
      count: '6 Produk',
      icon: Wheat,
      gradient: 'from-amber-500/10 to-orange-500/10 hover:from-amber-500/20 hover:to-orange-500/20',
      border: 'border-amber-200/80 hover:border-amber-400',
      iconBg: 'bg-amber-500 text-white',
    },
    {
      id: 'Hantaran & Parcel' as const,
      name: 'Hantaran & Parcel',
      desc: 'Parcel sembako, seserahan & hampers',
      count: '6 Produk',
      icon: Gift,
      gradient: 'from-purple-500/10 to-indigo-500/10 hover:from-purple-500/20 hover:to-indigo-500/20',
      border: 'border-purple-200/80 hover:border-purple-400',
      iconBg: 'bg-purple-600 text-white',
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-4">
      {/* 1. COMPACT HERO SLIDER & 3 CATEGORY CARDS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 items-stretch">
        {/* Main Banner Slider (Tinggi Dikurangi / Dipadatkan) */}
        <div className="lg:col-span-8 relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm min-h-[175px] sm:min-h-[210px] md:min-h-[230px] flex items-center bg-gray-900">
          {/* Slides */}
          {slides.map((s, idx) => (
            <div
              key={s.id}
              onClick={() => onSelectCategory(s.category)}
              className={`absolute inset-0 transition-opacity duration-700 cursor-pointer ${
                idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              {/* Image & Gradient Overlay */}
              <img
                src={s.image}
                alt={s.title}
                className="w-full h-full object-cover object-center"
              />
              <div
                className={`absolute inset-0 bg-gradient-to-r ${s.bgGradient} opacity-90 mix-blend-multiply`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent" />

              {/* Slide Content (Dipadatkan) */}
              <div className="absolute inset-0 p-4 sm:p-5 md:p-6 flex flex-col justify-between text-white z-20">
                <div className="flex items-center gap-2">
                  <span className="bg-white/20 backdrop-blur-xs text-white text-[9.5px] sm:text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    {s.badge}
                  </span>
                  <span className="bg-amber-400 text-slate-950 text-[9.5px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Tag className="w-2.5 h-2.5" />
                    {s.highlightTag}
                  </span>
                </div>

                <div className="max-w-lg space-y-1">
                  <h2 className="text-lg sm:text-2xl font-black text-white leading-tight drop-shadow-xs">
                    {s.title}
                  </h2>
                  <p className="text-[11px] sm:text-xs text-gray-200 line-clamp-2 max-w-md">
                    {s.subtitle}
                  </p>
                </div>

                <div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectCategory(s.category);
                    }}
                    className="inline-flex items-center gap-1.5 bg-[#D32F2F] hover:bg-red-700 active:scale-95 text-white font-bold text-[11px] sm:text-xs px-3.5 py-1.5 rounded-lg shadow-sm transition-all cursor-pointer relative z-30"
                  >
                    <span>{s.actionText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Slider Arrows */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
            }}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-30 p-1.5 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-xs transition-colors cursor-pointer"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setCurrentSlide((prev) => (prev + 1) % slides.length);
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-30 p-1.5 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-xs transition-colors cursor-pointer"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentSlide(i);
                }}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  i === currentSlide ? 'w-5 bg-white' : 'w-1.5 bg-white/40'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* 3 CATEGORY CARDS (Fashion, Sembako, Hantaran & Parcel) */}
        <div className="lg:col-span-4 flex flex-col gap-2 sm:gap-2.5 justify-between">
          {categoryCards.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const Icon = cat.icon;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(cat.id)}
                className={`w-full text-left flex-1 rounded-xl sm:rounded-2xl p-2.5 sm:p-3 border transition-all cursor-pointer flex items-center justify-between gap-3 shadow-2xs group active:scale-[0.99] ${
                  isSelected
                    ? 'border-[#D32F2F] bg-red-50/80 shadow-xs ring-2 ring-red-400/60'
                    : `bg-white ${cat.border} hover:bg-gray-50/80`
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform ${cat.iconBg}`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-extrabold text-xs sm:text-sm text-gray-900 group-hover:text-[#D32F2F] transition-colors truncate">
                        {cat.name}
                      </h4>
                      <span className="text-[9.5px] font-semibold text-gray-400 bg-gray-100 px-1.5 py-0.2 rounded shrink-0">
                        {cat.count}
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-500 truncate leading-snug">
                      {cat.desc}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 p-1 text-gray-400 group-hover:text-[#D32F2F] group-hover:translate-x-0.5 transition-all">
                  <ChevronNext className="w-4 h-4" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. VALUE PROPOSITION BAR */}
      <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 bg-white p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border border-gray-100 shadow-2xs text-xs">
        <div className="flex items-center gap-2.5 p-1">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-red-50 text-[#D32F2F] flex items-center justify-center shrink-0">
            <Truck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <div>
            <div className="text-[11px] sm:text-xs font-bold text-gray-900">Antar Cepat</div>
            <div className="text-[10px] text-gray-500">Gratis ongkir &gt; Rp 100.000</div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 p-1">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <div>
            <div className="text-[11px] sm:text-xs font-bold text-gray-900">Produk Pilihan</div>
            <div className="text-[10px] text-gray-500">Kualitas terbaik warga</div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 p-1">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <CreditCard className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <div>
            <div className="text-[11px] sm:text-xs font-bold text-gray-900">Bayar Mudah</div>
            <div className="text-[10px] text-gray-500">QRIS, COD, & Transfer</div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 p-1">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <div>
            <div className="text-[11px] sm:text-xs font-bold text-gray-900">Jaminan Mutu</div>
            <div className="text-[10px] text-gray-500">Timbangan & kondisi pas</div>
          </div>
        </div>
      </div>
    </section>
  );
};
