import { useState, useMemo, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import {
  Search,
  Filter,
  X,
  SlidersHorizontal,
  ChevronDown,
  Dumbbell,
  ArrowUpDown,
} from 'lucide-react';
import { INITIAL_CATEGORIES } from '../data/categories';
import { INITIAL_PRODUCTS } from '../data/products';
import { ProductCard } from '../components/ProductCard';

export function Catalog() {
  const { categorySlug } = useParams<{ categorySlug?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();

  // URL Query Parameters
  const initialSearch = searchParams.get('search') || '';
  const [search, setSearch] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState<string>(categorySlug || 'all');
  const [sortOption, setSortOption] = useState<string>('featured');
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(6000);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 16;

  // Sync categorySlug changes if navigated directly
  useEffect(() => {
    if (categorySlug) {
      setSelectedCategory(categorySlug);
    }
  }, [categorySlug]);

  // Sync search URL param
  useEffect(() => {
    const q = searchParams.get('search');
    if (q !== null && q !== search) {
      setSearch(q);
    }
  }, [searchParams]);

  // Reset pagination on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedCategory, sortOption, minPrice, maxPrice, inStockOnly]);

  const categoryObj = useMemo(() => {
    if (!categorySlug || categorySlug === 'all') return null;
    return INITIAL_CATEGORIES.find(c => c.slug === categorySlug || c.id === categorySlug);
  }, [categorySlug]);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return INITIAL_PRODUCTS.filter(product => {
      // Category filter
      if (selectedCategory !== 'all') {
        if (product.categoryId !== selectedCategory) {
          return false;
        }
      }

      // Search filter
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(q);
        const matchesShort = product.shortDescription.toLowerCase().includes(q);
        const matchesFull = product.fullDescription.toLowerCase().includes(q);
        const matchesSpecs = Object.values(product.specifications).some(v =>
          v.toLowerCase().includes(q)
        );
        if (!matchesName && !matchesShort && !matchesFull && !matchesSpecs) {
          return false;
        }
      }

      // Price filter
      if (product.price < minPrice || product.price > maxPrice) {
        return false;
      }

      // Stock filter
      if (inStockOnly && !product.inStock) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortOption === 'price-asc') return a.price - b.price;
      if (sortOption === 'price-desc') return b.price - a.price;
      if (sortOption === 'rating') return b.rating - a.rating;
      if (sortOption === 'name') return a.name.localeCompare(b.name);
      // featured
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return 0;
    });
  }, [selectedCategory, search, minPrice, maxPrice, inStockOnly, sortOption]);

  const totalPages = Math.ceil(filteredProducts.length / pageSize) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }, [filteredProducts, currentPage, pageSize]);

  const categoryNameMap = useMemo(() => {
    const map = new Map<string, string>();
    INITIAL_CATEGORIES.forEach(c => map.set(c.id, c.name));
    return map;
  }, []);

  const handleClearFilters = () => {
    setSearch('');
    setSelectedCategory('all');
    setMinPrice(0);
    setMaxPrice(6000);
    setInStockOnly(false);
    setSortOption('featured');
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Header & Breadcrumbs */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs text-zinc-400 mb-3">
          <Link to="/" className="hover:text-amber-400">Home</Link>
          <span>/</span>
          <span className="text-zinc-200">Catalog</span>
          {categoryObj && (
            <>
              <span>/</span>
              <span className="text-amber-400 font-semibold">{categoryObj.name}</span>
            </>
          )}
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight font-mono">
              {categoryObj ? categoryObj.name : 'Complete Equipment Catalog'}
            </h1>
            <p className="mt-1 text-sm text-zinc-400 max-w-2xl">
              {categoryObj
                ? categoryObj.description
                : 'Engineered for commercial health clubs, CrossFit boxes, varsity athletic training centers, and home iron gyms.'}
            </p>
          </div>

          <div className="text-xs font-mono text-zinc-400">
            Showing <span className="font-bold text-white">{filteredProducts.length}</span> of {INITIAL_PRODUCTS.length} Total Units
          </div>
        </div>
      </div>

      {/* Control Bar: Search & Mobile Filter Toggle */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 bg-zinc-900/60 p-4 border border-zinc-800 rounded-xl">
        {/* Search input */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-400" />
          <input
            id="catalog-search-input"
            type="text"
            value={search}
            onChange={e => {
              setSearch(e.target.value);
              setSearchParams(e.target.value ? { search: e.target.value } : {});
            }}
            placeholder="Search equipment or specs..."
            className="w-full bg-zinc-950 border border-zinc-700 text-white text-xs rounded pl-9 pr-3 py-2.5 focus:border-amber-400 focus:outline-none placeholder:text-zinc-500"
          />
          {search && (
            <button
              onClick={() => {
                setSearch('');
                setSearchParams({});
              }}
              className="absolute right-2.5 top-2.5 text-zinc-500 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sort and Filter controls */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          {/* Mobile Filter Button */}
          <button
            type="button"
            id="mobile-filter-open-btn"
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white px-3.5 py-2 rounded text-xs font-bold uppercase tracking-wider"
          >
            <Filter className="w-4 h-4 text-amber-400" />
            <span>Filters</span>
          </button>

          {/* Sort selector */}
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-zinc-400 hidden sm:inline" />
            <span className="text-xs text-zinc-400 hidden sm:inline">Sort:</span>
            <select
              id="catalog-sort-select"
              value={sortOption}
              onChange={e => setSortOption(e.target.value)}
              className="bg-zinc-950 border border-zinc-700 text-white text-xs rounded px-3 py-2 focus:border-amber-400 focus:outline-none"
            >
              <option value="featured">Featured First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
              <option value="name">Name (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Catalog Body: Sidebar + Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block space-y-6 bg-zinc-900/40 p-6 border border-zinc-800/80 rounded-2xl h-fit">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Refine Catalog</h3>
            </div>
            <button
              onClick={handleClearFilters}
              className="text-[11px] text-zinc-400 hover:text-amber-400 underline font-medium"
            >
              Reset
            </button>
          </div>

          {/* Category Filter List */}
          <div>
            <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider mb-3">
              Categories ({INITIAL_CATEGORIES.length})
            </h4>
            <div className="space-y-1 max-h-72 overflow-y-auto pr-1">
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className={`w-full text-left px-2.5 py-1.5 rounded text-xs transition-colors flex items-center justify-between ${
                  selectedCategory === 'all'
                    ? 'bg-amber-400 text-zinc-950 font-bold'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                }`}
              >
                <span>All Equipment</span>
                <span className="font-mono text-[10px]">{INITIAL_PRODUCTS.length}</span>
              </button>

              {INITIAL_CATEGORIES.map(cat => {
                const count = INITIAL_PRODUCTS.filter(p => p.categoryId === cat.id).length;
                const isSel = selectedCategory === cat.id || selectedCategory === cat.slug;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`w-full text-left px-2.5 py-1.5 rounded text-xs transition-colors flex items-center justify-between ${
                      isSel
                        ? 'bg-amber-400 text-zinc-950 font-bold'
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                    }`}
                  >
                    <span className="truncate mr-2">{cat.name}</span>
                    <span className="font-mono text-[10px] opacity-75">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="pt-4 border-t border-zinc-800">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                Price Cap
              </h4>
              <span className="text-xs font-mono font-bold text-amber-400">
                ${maxPrice.toLocaleString()}
              </span>
            </div>
            <input
              id="price-range-slider"
              type="range"
              min="0"
              max="6000"
              step="50"
              value={maxPrice}
              onChange={e => setMaxPrice(Number(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-zinc-500 font-mono mt-1">
              <span>$0</span>
              <span>$3,000</span>
              <span>$6,000+</span>
            </div>
          </div>

          {/* Stock availability */}
          <div className="pt-4 border-t border-zinc-800">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={e => setInStockOnly(e.target.checked)}
                className="rounded accent-amber-400 text-amber-400 focus:ring-0 w-4 h-4 bg-zinc-950 border-zinc-700"
              />
              <span className="text-xs text-zinc-300 font-medium">In-Stock Units Only</span>
            </label>
          </div>
        </aside>

        {/* Product Grid Area */}
        <div className="lg:col-span-3">
          {paginatedProducts.length === 0 ? (
            /* Empty state */
            <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-12 text-center flex flex-col items-center justify-center">
              <Dumbbell className="w-12 h-12 text-zinc-600 mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">No Equipment Matches Criteria</h3>
              <p className="text-xs text-zinc-400 max-w-sm mb-6">
                Try widening your price range, searching for another keyword, or resetting category filters.
              </p>
              <button
                onClick={handleClearFilters}
                className="bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold px-5 py-2 text-xs uppercase tracking-wider rounded"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {paginatedProducts.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    categoryName={categoryNameMap.get(product.categoryId)}
                  />
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="mt-12 flex items-center justify-center gap-2">
                  <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    className="px-3.5 py-2 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>

                  <div className="flex items-center gap-1 font-mono text-xs">
                    {[...Array(totalPages)].map((_, i) => {
                      const pNum = i + 1;
                      return (
                        <button
                          key={pNum}
                          type="button"
                          onClick={() => setCurrentPage(pNum)}
                          className={`w-8 h-8 rounded flex items-center justify-center transition-colors ${
                            currentPage === pNum
                              ? 'bg-amber-400 text-zinc-950 font-black'
                              : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                          }`}
                        >
                          {pNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    className="px-3.5 py-2 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Mobile Filters Drawer Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="relative ml-auto w-full max-w-xs bg-zinc-950 p-6 shadow-2xl flex flex-col justify-between overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Filters</h3>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 text-zinc-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Categories */}
              <div>
                <h4 className="text-xs font-bold text-zinc-300 uppercase mb-2">Categories</h4>
                <div className="space-y-1 max-h-56 overflow-y-auto">
                  <button
                    onClick={() => {
                      setSelectedCategory('all');
                      setMobileFilterOpen(false);
                    }}
                    className={`w-full text-left px-2 py-1.5 rounded text-xs ${
                      selectedCategory === 'all' ? 'bg-amber-400 text-zinc-950 font-bold' : 'text-zinc-400'
                    }`}
                  >
                    All Equipment
                  </button>
                  {INITIAL_CATEGORIES.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategory(cat.id);
                        setMobileFilterOpen(false);
                      }}
                      className={`w-full text-left px-2 py-1.5 rounded text-xs truncate ${
                        selectedCategory === cat.id ? 'bg-amber-400 text-zinc-950 font-bold' : 'text-zinc-400'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div className="pt-4 border-t border-zinc-800">
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-zinc-300">Price Cap</span>
                  <span className="font-mono text-amber-400 font-bold">${maxPrice}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="6000"
                  step="50"
                  value={maxPrice}
                  onChange={e => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-amber-400"
                />
              </div>

              {/* In stock */}
              <div className="pt-4 border-t border-zinc-800">
                <label className="flex items-center gap-2 text-xs text-zinc-300">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={e => setInStockOnly(e.target.checked)}
                    className="accent-amber-400"
                  />
                  <span>In-Stock Only</span>
                </label>
              </div>
            </div>

            <div className="pt-6 border-t border-zinc-800 space-y-2">
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full bg-amber-400 text-zinc-950 font-bold py-2.5 rounded text-xs uppercase tracking-wider"
              >
                Apply Filters ({filteredProducts.length})
              </button>
              <button
                onClick={handleClearFilters}
                className="w-full bg-zinc-900 text-zinc-400 py-2 rounded text-xs uppercase tracking-wider"
              >
                Reset All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
