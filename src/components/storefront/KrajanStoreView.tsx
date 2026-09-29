import React, { useState } from 'react';
import { KrajanStoreHeader } from './KrajanStoreHeader';
import { KrajanStoreHero } from './KrajanStoreHero';
import { KrajanFlashSale } from './KrajanFlashSale';
import { KrajanProductGrid } from './KrajanProductGrid';
import { KrajanProductDetailModal } from './KrajanProductDetailModal';
import { KrajanCartDrawer } from './KrajanCartDrawer';
import { KrajanCheckoutModal } from './KrajanCheckoutModal';
import { KrajanFooter } from './KrajanFooter';
import { KrajanVendorRegisterModal } from './KrajanVendorRegisterModal';
import { saveOnlineOrder } from '../../lib/firebase';
import {
  KRAJAN_STORE_PRODUCTS,
  StoreProduct,
  CartItem,
} from '../../data/krajanStoreData';

interface KrajanStoreViewProps {
  onOpenPosLogin: () => void;
  onShowToast: (type: 'success' | 'info' | 'warning', title: string, message: string) => void;
}

export const KrajanStoreView: React.FC<KrajanStoreViewProps> = ({
  onOpenPosLogin,
  onShowToast,
}) => {
  const [products] = useState<StoreProduct[]>(KRAJAN_STORE_PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState<'Fashion' | 'Sembako' | 'Hantaran & Parcel'>('Fashion');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isMemberMode] = useState<boolean>(false);
  const [isVendorRegisterOpen, setIsVendorRegisterOpen] = useState<boolean>(false);

  // Cart State (ambil 1 sembako & 1 fashion default)
  const [cartItems, setCartItems] = useState<CartItem[]>([
    { product: KRAJAN_STORE_PRODUCTS[0], quantity: 1 }, // Kemeja Batik
    { product: KRAJAN_STORE_PRODUCTS[6], quantity: 1 }, // Beras Rojo Lele
  ]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  // Wishlist State
  const [wishlistIds, setWishlistIds] = useState<string[]>(['krj-fas-01', 'krj-par-01']);

  // Quick View / Detail Modal State
  const [selectedProduct, setSelectedProduct] = useState<StoreProduct | null>(null);

  // Checkout Modal State
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [checkoutDeliveryType, setCheckoutDeliveryType] = useState<'pickup' | 'delivery'>('pickup');
  const [checkoutDiscount, setCheckoutDiscount] = useState<number>(0);

  // Cart Calculations
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Add to cart handler
  const handleAddToCart = (product: StoreProduct, qty: number = 1) => {
    setCartItems((prev) => {
      const idx = prev.findIndex((i) => i.product.id === product.id);
      if (idx > -1) {
        return prev.map((item, i) =>
          i === idx ? { ...item, quantity: item.quantity + qty } : item
        );
      }
      return [...prev, { product, quantity: qty }];
    });

    onShowToast(
      'success',
      'Ditambahkan ke Keranjang',
      `"${product.name}" (${qty} ${product.unit}) berhasil dimasukkan.`
    );
  };

  // Update item quantity
  const handleUpdateQty = (productId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const next = item.quantity + delta;
            return next > 0 ? { ...item, quantity: next } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  // Remove item
  const handleRemoveItem = (productId: string) => {
    setCartItems((prev) => prev.filter((i) => i.product.id !== productId));
    onShowToast('info', 'Item Dihapus', 'Produk dikeluarkan dari keranjang belanja.');
  };

  // Clear Cart
  const handleClearCart = () => {
    setCartItems([]);
    onShowToast('info', 'Keranjang Kosong', 'Semua item keranjang telah dibersihkan.');
  };

  // Toggle Wishlist
  const handleToggleWishlist = (productId: string) => {
    setWishlistIds((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        onShowToast('info', 'Favorit', 'Dihapus dari daftar favorit.');
        return prev.filter((id) => id !== productId);
      } else {
        onShowToast('success', 'Favorit', 'Disimpan ke daftar favorit.');
        return [...prev, productId];
      }
    });
  };

  // Handle Category Select with Smooth Scroll
  const handleSelectCategory = (cat: 'Fashion' | 'Sembako' | 'Hantaran & Parcel') => {
    setSelectedCategory(cat);
    setSearchQuery(''); // Bersihkan pencarian agar seluruh produk kategori tampil

    setTimeout(() => {
      const el = document.getElementById('katalog-produk');
      if (el) {
        const header = document.querySelector('header');
        const headerHeight = header ? header.getBoundingClientRect().height : 90;
        const targetY = el.getBoundingClientRect().top + window.pageYOffset - headerHeight - 14;
        window.scrollTo({
          top: Math.max(0, targetY),
          behavior: 'smooth',
        });
      }
    }, 40);
  };

  // Proceed to Checkout
  const handleProceedToCheckout = (
    deliveryType: 'pickup' | 'delivery',
    discountAmount: number
  ) => {
    setCheckoutDeliveryType(deliveryType);
    setCheckoutDiscount(discountAmount);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  // Order Completed
  const handleOrderSuccess = async (orderData: any) => {
    setCartItems([]);
    
    // Save to Cloud Firestore
    await saveOnlineOrder({
      invoice: orderData.invoice,
      customerName: orderData.customerName,
      customerPhone: orderData.customerPhone,
      address: orderData.address || '',
      deliveryType: checkoutDeliveryType,
      items: orderData.items || [],
      subtotal: orderData.subtotal || 0,
      discount: orderData.discount || 0,
      grandTotal: orderData.grandTotal || 0,
      status: 'pending',
    });

    onShowToast(
      'success',
      'Pesanan Berhasil Disimpan ke Database!',
      `Invoice ${orderData.invoice} senilai Rp ${orderData.grandTotal.toLocaleString('id-ID')} tersimpan secara online.`
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-gray-900 flex flex-col font-sans antialiased selection:bg-red-500/20 selection:text-red-700">
      {/* 1. STORE HEADER (Top Bar CS & Medsos, Navbar Compact, Menu Kategori, Masuk & Daftar) */}
      <KrajanStoreHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        cartCount={cartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenPosLogin={onOpenPosLogin}
        onOpenRegister={() => setIsVendorRegisterOpen(true)}
        onSelectCategory={handleSelectCategory}
        selectedCategory={selectedCategory}
      />

      {/* 2. STORE BODY */}
      <main className="flex-1 space-y-1 sm:space-y-2">
        {/* Compact Hero Slider & 3 Category Cards */}
        <KrajanStoreHero
          onSelectCategory={handleSelectCategory}
          selectedCategory={selectedCategory}
        />

        {/* Promo Hari Ini Section */}
        {!searchQuery && (
          <KrajanFlashSale
            products={products}
            onAddToCart={(p) => handleAddToCart(p, 1)}
            onQuickView={(p) => setSelectedProduct(p)}
            isMemberMode={isMemberMode}
          />
        )}

        {/* Produk Krajan Store (Underneath 1-Line Filter & 18 Products) */}
        <div id="katalog-produk" className="scroll-mt-28">
          <KrajanProductGrid
            products={products}
            selectedCategory={selectedCategory}
            onSelectCategory={handleSelectCategory}
            searchQuery={searchQuery}
            onAddToCart={(p) => handleAddToCart(p, 1)}
            onQuickView={(p) => setSelectedProduct(p)}
            wishlistIds={wishlistIds}
            onToggleWishlist={handleToggleWishlist}
            isMemberMode={isMemberMode}
          />
        </div>
      </main>

      {/* 3. STORE FOOTER */}
      <KrajanFooter
        onExploreProducts={(cat) => handleSelectCategory(cat || 'Fashion')}
        onOpenVendorRegister={() => setIsVendorRegisterOpen(true)}
      />

      {/* 4. MODALS & DRAWERS */}
      {/* Product Quick View / Detail Modal */}
      <KrajanProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        isWishlisted={selectedProduct ? wishlistIds.includes(selectedProduct.id) : false}
        onToggleWishlist={handleToggleWishlist}
        isMemberMode={isMemberMode}
      />

      {/* Slide-over Cart Drawer */}
      <KrajanCartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onProceedToCheckout={handleProceedToCheckout}
        isMemberMode={isMemberMode}
      />

      {/* Checkout Modal */}
      <KrajanCheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        deliveryType={checkoutDeliveryType}
        discountAmount={checkoutDiscount}
        onOrderSuccess={handleOrderSuccess}
        isMemberMode={isMemberMode}
      />

      {/* Pendaftaran Mitra Penjual UMKM (Tersambung ke Cloud Firestore) */}
      <KrajanVendorRegisterModal
        isOpen={isVendorRegisterOpen}
        onClose={() => setIsVendorRegisterOpen(false)}
        onSuccessToast={onShowToast}
      />
    </div>
  );
};
