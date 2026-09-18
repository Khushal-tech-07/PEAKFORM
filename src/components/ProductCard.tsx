import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingBag, Heart, Check, ArrowRight } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
  categoryName?: string;
}

export function ProductCard({ product, categoryName }: ProductCardProps) {
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const [addedNotice, setAddedNotice] = useState(false);
  const isWish = isInWishlist(product.id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 1500);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div
      id={`product-card-${product.slug}`}
      className="group relative bg-zinc-900/90 hover:bg-zinc-900 border border-zinc-800 hover:border-amber-400/60 rounded-xl overflow-hidden flex flex-col justify-between transition-all duration-300 shadow-md hover:shadow-xl hover:shadow-amber-400/5 hover:-translate-y-1"
    >
      {/* Top Image Container */}
      <div className="relative w-full h-56 bg-zinc-950 overflow-hidden flex items-center justify-center p-4">
        {/* Category Tag */}
        {categoryName && (
          <span className="absolute top-3 left-3 z-10 bg-zinc-950/80 backdrop-blur-md border border-zinc-700/60 text-zinc-300 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
            {categoryName}
          </span>
        )}

        {/* Stock Badge */}
        <span
          className={`absolute top-3 right-12 z-10 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
            product.inStock
              ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800/60'
              : 'bg-rose-950/80 text-rose-400 border-rose-800/60'
          }`}
        >
          {product.inStock ? 'In Stock' : 'Pre-Order'}
        </span>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={handleWishlist}
          title={isWish ? 'Remove from wishlist' : 'Add to wishlist'}
          aria-label="Wishlist toggle"
          className="absolute top-2.5 right-3 z-10 p-1.5 rounded-full bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-rose-500 transition-colors"
        >
          <Heart className={`w-4 h-4 ${isWish ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>

        {/* Product Image */}
        <Link to={`/product/${product.slug}`} className="w-full h-full flex items-center justify-center relative overflow-hidden">
          <img
            src={product.imageUrl}
            alt={product.name}
            loading="lazy"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={e => {
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/60 via-transparent to-transparent pointer-events-none" />
        </Link>
      </div>

      {/* Card Content Details */}
      <div className="p-5 flex flex-col flex-grow justify-between">
        <div>
          {/* Rating */}
          <div className="flex items-center gap-1 text-amber-400 text-xs mb-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < Math.floor(product.rating)
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-zinc-700'
                  }`}
                />
              ))}
            </div>
            <span className="text-zinc-400 font-mono text-[11px] font-semibold ml-1">
              {product.rating.toFixed(1)}
            </span>
          </div>

          {/* Title */}
          <Link to={`/product/${product.slug}`} className="focus:outline-none">
            <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-1 tracking-tight">
              {product.name}
            </h3>
          </Link>

          {/* Short Blurb */}
          <p className="mt-2 text-xs text-zinc-400 line-clamp-2 leading-relaxed">
            {product.shortDescription}
          </p>
        </div>

        {/* Price & Action Button Footer */}
        <div className="mt-5 pt-4 border-t border-zinc-800 flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold block">
              Commercial Price
            </span>
            <span className="text-lg font-black text-white font-mono">
              ${product.price.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Quick Add To Cart */}
            <button
              type="button"
              onClick={handleQuickAdd}
              id={`quick-add-${product.id}`}
              disabled={!product.inStock}
              title="Add to cart"
              className={`p-2.5 rounded border transition-all ${
                addedNotice
                  ? 'bg-amber-400 text-zinc-950 border-amber-400'
                  : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-amber-400 border-zinc-700 hover:border-amber-400/50'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {addedNotice ? <Check className="w-4 h-4 stroke-[3]" /> : <ShoppingBag className="w-4 h-4" />}
            </button>

            {/* View Details CTA Button */}
            <Link
              to={`/product/${product.slug}`}
              id={`view-details-${product.slug}`}
              className="inline-flex items-center gap-1 bg-zinc-800 hover:bg-amber-400 text-zinc-200 hover:text-zinc-950 px-3 py-2 rounded text-xs font-bold uppercase tracking-wider transition-colors border border-zinc-700 hover:border-amber-400"
            >
              <span>Details</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
