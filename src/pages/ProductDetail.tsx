import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Star,
  ShoppingBag,
  Heart,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
  ChevronRight,
  ArrowLeft,
  Share2,
  PhoneCall,
} from 'lucide-react';
import { Product, Category } from '../types';
import { INITIAL_CATEGORIES } from '../data/categories';
import { INITIAL_PRODUCTS } from '../data/products';
import { useCart } from '../context/CartContext';
import { ProductCard } from '../components/ProductCard';

export function ProductDetail() {
  const { productSlug } = useParams<{ productSlug: string }>();
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, isInWishlist } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [category, setCategory] = useState<Category | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [addedToast, setAddedToast] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    // Look up product by slug or id
    const found = INITIAL_PRODUCTS.find(
      p => p.slug === productSlug || p.id === productSlug
    );

    if (found) {
      setProduct(found);
      setSelectedImage(found.imageUrl);
      setQuantity(1);

      // Find category
      const cat = INITIAL_CATEGORIES.find(c => c.id === found.categoryId);
      setCategory(cat || null);

      // Set page title and meta description dynamically
      document.title = `${found.name} | PeakForm Commercial Fitness`;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', found.shortDescription);
      }

      // Related products from same category
      const related = INITIAL_PRODUCTS.filter(
        p => p.categoryId === found.categoryId && p.id !== found.id
      ).slice(0, 4);
      setRelatedProducts(related);

      // Scroll top
      window.scrollTo(0, 0);
    } else {
      setProduct(null);
    }
  }, [productSlug]);

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Product Not Found</h2>
        <p className="text-sm text-zinc-400 mb-6 max-w-md">
          The requested gym equipment item could not be located in our catalog.
        </p>
        <button
          onClick={() => navigate('/products')}
          className="bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold px-6 py-2.5 rounded text-sm uppercase tracking-wider transition-colors"
        >
          Return to Catalog
        </button>
      </div>
    );
  }

  const isWish = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2500);
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-zinc-400 mb-8 overflow-x-auto whitespace-nowrap">
        <Link to="/" className="hover:text-amber-400 transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
        <Link to="/products" className="hover:text-amber-400 transition-colors">Products</Link>
        {category && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
            <Link to={`/category/${category.slug}`} className="hover:text-amber-400 transition-colors">
              {category.name}
            </Link>
          </>
        )}
        <ChevronRight className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
        <span className="text-zinc-200 font-semibold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        {/* Left Column: Product Image Showcase */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="relative w-full aspect-[4/3] bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden flex items-center justify-center shadow-2xl group">
            {/* Stock Pill */}
            <span
              className={`absolute top-4 left-4 z-10 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded border shadow-lg ${
                product.inStock
                  ? 'bg-emerald-950/90 text-emerald-400 border-emerald-800'
                  : 'bg-rose-950/90 text-rose-400 border-rose-800'
              }`}
            >
              {product.inStock ? 'In Stock • Ready to Ship' : 'Special Order Backorder'}
            </span>

            {/* Quick Share */}
            <button
              onClick={handleShare}
              title="Copy share link"
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700 shadow-md transition-colors"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>

            <img
              id="main-product-image"
              src={selectedImage || product.imageUrl}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={e => {
                (e.target as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/60 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* Interactive Thumbnail Gallery */}
          {product.images && product.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-1 pt-1">
              {product.images.map((imgUrl, idx) => {
                const isSelected = (selectedImage || product.imageUrl) === imgUrl;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImage(imgUrl)}
                    aria-label={`${product.name} view ${idx + 1}`}
                    className={`relative w-20 h-16 rounded-lg overflow-hidden border-2 transition-all shrink-0 bg-zinc-900 ${
                      isSelected
                        ? 'border-amber-400 ring-2 ring-amber-400/30 opacity-100 scale-105 shadow-md shadow-amber-400/10'
                        : 'border-zinc-800 hover:border-zinc-600 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={imgUrl}
                      alt={`${product.name} view ${idx + 1}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </button>
                );
              })}
            </div>
          )}

          {/* Value Assurance Badges */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-3 flex flex-col items-center text-center">
              <Truck className="w-5 h-5 text-amber-400 mb-1" />
              <span className="text-[11px] font-bold text-white uppercase tracking-wider">Freight Included</span>
              <span className="text-[10px] text-zinc-400">Orders $2k+</span>
            </div>
            <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-3 flex flex-col items-center text-center">
              <ShieldCheck className="w-5 h-5 text-amber-400 mb-1" />
              <span className="text-[11px] font-bold text-white uppercase tracking-wider">Club Warranty</span>
              <span className="text-[10px] text-zinc-400">10-Year Structural</span>
            </div>
            <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-3 flex flex-col items-center text-center">
              <RotateCcw className="w-5 h-5 text-amber-400 mb-1" />
              <span className="text-[11px] font-bold text-white uppercase tracking-wider">30-Day Guarantee</span>
              <span className="text-[10px] text-zinc-400">Commercial Trial</span>
            </div>
          </div>
        </div>

        {/* Right Column: Information, Pricing, Specs & Purchase */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div>
            {/* Category badge */}
            {category && (
              <Link
                to={`/category/${category.slug}`}
                className="inline-block text-xs font-bold text-amber-400 hover:text-amber-300 uppercase tracking-widest mb-2"
              >
                {category.name}
              </Link>
            )}

            {/* Title */}
            <h1 id="product-title" className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              {product.name}
            </h1>

            {/* Rating and SKU */}
            <div className="flex items-center gap-4 mt-3 pb-4 border-b border-zinc-800">
              <div className="flex items-center gap-1.5 text-amber-400 text-sm">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-zinc-700'
                      }`}
                    />
                  ))}
                </div>
                <span className="font-mono font-bold text-xs text-white">{product.rating.toFixed(1)} / 5.0</span>
              </div>
              <span className="text-zinc-600">•</span>
              <span className="text-xs text-zinc-400 font-mono">
                SKU: PKF-{product.id.toUpperCase()}
              </span>
            </div>

            {/* Price section */}
            <div className="my-5 flex items-baseline gap-3">
              <span id="product-price" className="text-4xl font-black text-white font-mono tracking-tight">
                ${product.price.toLocaleString()}
              </span>
              <span className="text-xs text-zinc-400 uppercase tracking-wider">USD / Unit</span>
            </div>

            {/* Short description */}
            <p className="text-sm text-zinc-300 leading-relaxed">
              {product.shortDescription}
            </p>

            {/* Long description */}
            <div className="mt-4 p-4 bg-zinc-900/50 border border-zinc-800/80 rounded-xl">
              <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                Engineering & Athletic Focus
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                {product.fullDescription}
              </p>
            </div>

            {/* Specifications Table */}
            <div className="mt-6">
              <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-3">
                Technical Specifications
              </h3>
              <div className="border border-zinc-800 rounded-xl overflow-hidden text-xs">
                {Object.entries(product.specifications).map(([key, val], idx) => (
                  <div
                    key={key}
                    className={`flex items-center justify-between p-3 ${
                      idx % 2 === 0 ? 'bg-zinc-900/60' : 'bg-zinc-900/20'
                    } border-b border-zinc-800/60 last:border-b-0`}
                  >
                    <span className="text-zinc-400 font-medium">{key}</span>
                    <span className="text-white font-mono font-semibold text-right max-w-[60%]">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Area: Quantity & Add to Cart */}
          <div className="mt-8 pt-6 border-t border-zinc-800 space-y-4">
            <div className="flex items-center gap-4">
              {/* Quantity selector */}
              <div className="flex items-center border border-zinc-700 bg-zinc-900 rounded-lg overflow-hidden">
                <button
                  type="button"
                  id="qty-decrement-btn"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3.5 py-2.5 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors text-base font-bold"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span id="qty-display" className="px-4 py-2.5 font-mono text-sm font-bold text-white min-w-[3rem] text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  id="qty-increment-btn"
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3.5 py-2.5 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors text-base font-bold"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              {/* Add to Wishlist */}
              <button
                type="button"
                id="wishlist-toggle-btn"
                onClick={() => toggleWishlist(product.id)}
                className={`p-3 rounded-lg border transition-colors flex items-center justify-center ${
                  isWish
                    ? 'bg-rose-500/10 border-rose-500 text-rose-500'
                    : 'bg-zinc-900 hover:bg-zinc-800 border-zinc-700 text-zinc-300 hover:text-white'
                }`}
                title={isWish ? 'Saved in Wishlist' : 'Add to Wishlist'}
                aria-label="Wishlist"
              >
                <Heart className={`w-5 h-5 ${isWish ? 'fill-rose-500' : ''}`} />
              </button>

              {/* Commercial Quote Consultation */}
              <Link
                to="/contact"
                className="p-3 rounded-lg border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-amber-400 transition-colors flex items-center justify-center"
                title="Commercial facility quotation"
              >
                <PhoneCall className="w-5 h-5" />
              </Link>
            </div>

            {/* Primary Add to Cart Button */}
            <button
              type="button"
              id="add-to-cart-btn"
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className={`w-full py-3.5 px-6 rounded-lg font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg ${
                addedToast
                  ? 'bg-emerald-500 text-zinc-950 shadow-emerald-500/20'
                  : 'bg-amber-400 hover:bg-amber-300 text-zinc-950 shadow-amber-400/20 hover:shadow-amber-400/30'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {addedToast ? (
                <>
                  <Check className="w-5 h-5 stroke-[3]" />
                  <span>Added {quantity} to Cart!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-5 h-5" />
                  <span>Add to Equipment Cart • ${(product.price * quantity).toLocaleString()}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Related Products Strip from Same Category */}
      {relatedProducts.length > 0 && (
        <div className="mt-20 pt-12 border-t border-zinc-800">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block mb-1">
                Same Equipment Category
              </span>
              <h2 className="text-2xl font-black text-white uppercase tracking-tight">
                Related {category?.name || 'Machinery'}
              </h2>
            </div>
            {category && (
              <Link
                to={`/category/${category.slug}`}
                className="text-xs font-bold text-amber-400 hover:text-amber-300 uppercase tracking-wider inline-flex items-center gap-1"
              >
                <span>View Full Group</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map(rel => (
              <ProductCard
                key={rel.id}
                product={rel}
                categoryName={category?.name}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
