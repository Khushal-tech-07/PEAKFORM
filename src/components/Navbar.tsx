import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ShoppingBag,
  Search,
  Menu,
  X,
  Dumbbell,
  ShieldCheck,
  Heart,
  User,
} from 'lucide-react';
import { useCart } from '../context/CartContext';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { cartCount, wishlist } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { label: 'Catalog', href: '/products' },
    { label: 'Cardio', href: '/category/cardio-machines' },
    { label: 'Strength', href: '/category/lower-body-machines' },
    { label: 'Free Weights', href: '/category/free-weights' },
    { label: 'Racks & Cages', href: '/category/racks-cages-stands' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800">
      {/* Top utility alert bar */}
      <div className="bg-amber-400 text-zinc-950 px-4 py-1 text-xs font-bold uppercase tracking-wider text-center flex items-center justify-center gap-2">
        <ShieldCheck className="w-3.5 h-3.5" />
        <span>Commercial Equipment Specialist • Free Freight on Orders Over $2,000 • 10-Year Frame Warranty</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link
            to="/"
            id="brand-logo-link"
            className="flex items-center gap-3 group focus:outline-none"
          >
            <div className="w-10 h-10 rounded bg-amber-400 text-zinc-950 flex items-center justify-center font-black transition-transform group-hover:scale-105 shadow-md shadow-amber-400/20">
              <Dumbbell className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center text-2xl font-black tracking-tighter uppercase font-mono">
                <span className="text-white">PEAK</span>
                <span className="text-amber-400">FORM</span>
              </div>
              <span className="text-[9px] uppercase tracking-[0.25em] text-zinc-400 font-semibold -mt-1">
                Fitness Equipment
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map(link => {
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`px-3 py-2 text-sm font-semibold tracking-wide transition-colors rounded ${
                    isActive
                      ? 'text-amber-400 bg-zinc-900'
                      : 'text-zinc-300 hover:text-white hover:bg-zinc-900/60'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Trigger Button */}
            <button
              id="search-toggle-btn"
              type="button"
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-zinc-300 hover:text-white hover:bg-zinc-900 rounded transition-colors focus:outline-none"
              title="Search Catalog"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist Link */}
            <Link
              to="/products"
              id="wishlist-nav-link"
              className="relative p-2 text-zinc-300 hover:text-white hover:bg-zinc-900 rounded transition-colors hidden sm:flex"
              title="Wishlist items"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-400" />
              )}
            </Link>

            {/* Admin Portal Link */}
            <Link
              to="/admin"
              id="admin-nav-link"
              className="p-2 text-zinc-300 hover:text-amber-400 hover:bg-zinc-900 rounded transition-colors flex items-center gap-1 text-xs font-semibold"
              title="Admin Dashboard"
            >
              <User className="w-5 h-5" />
              <span className="hidden xl:inline text-[11px] uppercase tracking-wider text-zinc-400 hover:text-amber-400">Admin</span>
            </Link>

            {/* Shopping Cart Button */}
            <Link
              to="/cart"
              id="cart-nav-link"
              className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 hover:border-amber-400/50 text-white px-3.5 py-2 rounded font-medium transition-all group"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 group-hover:text-amber-400 transition-colors" />
                {cartCount > 0 && (
                  <span
                    id="cart-badge-count"
                    className="absolute -top-2 -right-2 bg-amber-400 text-zinc-950 text-[11px] font-black w-4 h-4 rounded-full flex items-center justify-center leading-none"
                  >
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline">
                Cart
              </span>
            </Link>

            {/* Mobile Hamburger Toggle */}
            <button
              id="mobile-menu-toggle"
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-zinc-300 hover:text-white hover:bg-zinc-900 rounded lg:hidden focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Expandable Search Input Bar */}
        {searchOpen && (
          <div className="py-3 border-t border-zinc-800 animate-in fade-in slide-in-from-top-2 duration-200">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <Search className="absolute left-3 w-5 h-5 text-zinc-400" />
              <input
                id="global-search-input"
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search across 110 machines, free weights, racks, accessories..."
                className="w-full bg-zinc-900 border border-zinc-700 text-white text-sm rounded pl-10 pr-24 py-2.5 focus:outline-none focus:border-amber-400 placeholder:text-zinc-500"
                autoFocus
              />
              <button
                type="submit"
                id="search-submit-btn"
                className="absolute right-1.5 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold px-4 py-1.5 text-xs uppercase tracking-wider rounded transition-colors"
              >
                Search
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-zinc-950 border-b border-zinc-800 px-4 pt-2 pb-6 space-y-2 animate-in slide-in-from-top duration-200">
          <form onSubmit={handleSearchSubmit} className="relative mb-3">
            <input
              id="mobile-search-input"
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search equipment..."
              className="w-full bg-zinc-900 border border-zinc-800 text-white text-sm rounded px-3 py-2.5 focus:border-amber-400"
            />
          </form>

          {navLinks.map(link => (
            <Link
              key={link.href}
              to={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded text-base font-semibold text-zinc-200 hover:text-amber-400 hover:bg-zinc-900"
            >
              {link.label}
            </Link>
          ))}

          <div className="pt-4 border-t border-zinc-800 flex flex-col gap-2">
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded text-sm text-zinc-300 hover:text-amber-400 bg-zinc-900"
            >
              <User className="w-4 h-4" />
              <span>Admin Dashboard</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
