import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Shield,
  Truck,
  Award,
  Flame,
  ChevronRight,
  Layers,
  PhoneCall,
  CheckCircle2,
} from 'lucide-react';
import { INITIAL_CATEGORIES } from '../data/categories';
import { INITIAL_PRODUCTS } from '../data/products';
import { CategoryCard } from '../components/CategoryCard';
import { ProductCard } from '../components/ProductCard';

export function Home() {
  const featuredProducts = INITIAL_PRODUCTS.filter(p => p.featured).slice(0, 8);

  const categoryNameMap = new Map<string, string>();
  INITIAL_CATEGORIES.forEach(c => categoryNameMap.set(c.id, c.name));

  return (
    <div className="space-y-20 pb-16">
      {/* Hero Banner Section */}
      <section className="relative overflow-hidden bg-zinc-950 border-b border-zinc-800/80 pt-16 pb-24 lg:pt-24 lg:pb-32">
        {/* Background visual geometric accents */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-400/10 via-zinc-950/80 to-zinc-950 pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 bg-zinc-900/90 border border-zinc-700/80 px-3.5 py-1.5 rounded-full text-xs font-bold text-amber-400 uppercase tracking-widest">
                <Flame className="w-3.5 h-3.5 fill-amber-400" />
                <span>Next-Gen Heavy Commercial Spec</span>
              </div>

              <h1 className="text-4xl sm:text-6xl xl:text-7xl font-black text-white tracking-tight uppercase leading-[0.95] font-mono">
                ENGINEERED FOR <span className="text-amber-400">PEAK PERFORMANCE.</span>
              </h1>

              <p className="text-base sm:text-lg text-zinc-300 max-w-xl leading-relaxed">
                Outfitting commercial fitness clubs, varsity strength facilities, and elite home gym lifters with calibrated steel, biomechanically perfected selectorized machines, and tournament-grade free weights.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/products"
                  id="hero-explore-btn"
                  className="bg-amber-400 hover:bg-amber-300 text-zinc-950 font-black px-7 py-4 rounded-lg text-sm uppercase tracking-wider transition-all flex items-center gap-2 shadow-xl shadow-amber-400/10 hover:shadow-amber-400/20 group"
                >
                  <span>Explore 110+ Products</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>

                <a
                  href="#categories-section"
                  className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 hover:border-zinc-500 text-white font-bold px-7 py-4 rounded-lg text-sm uppercase tracking-wider transition-colors"
                >
                  Browse 15 Categories
                </a>
              </div>

              {/* Quick Trust Highlights */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-zinc-800/80 text-xs text-zinc-400">
                <div>
                  <span className="block font-black text-lg text-white font-mono">110+</span>
                  <span>Products Catalog</span>
                </div>
                <div>
                  <span className="block font-black text-lg text-white font-mono">11-Gauge</span>
                  <span>Structural Tubing</span>
                </div>
                <div>
                  <span className="block font-black text-lg text-white font-mono">10-Year</span>
                  <span>Frame Guarantee</span>
                </div>
              </div>
            </div>

            {/* Right Hero Visual Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 shadow-2xl overflow-hidden group">
                <div className="absolute top-4 right-4 z-10 bg-amber-400 text-zinc-950 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded shadow-md">
                  Flagship Station
                </div>

                <div className="h-72 w-full overflow-hidden rounded-xl relative bg-zinc-950">
                  <img
                    src="https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&w=1000&q=80"
                    alt="PeakForm Commercial Power Rack"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/70 via-transparent to-transparent pointer-events-none" />
                </div>

                <div className="mt-4 pt-4 border-t border-zinc-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">
                        Featured Rig
                      </span>
                      <h3 className="text-lg font-bold text-white">Power Rack — 3x3" 11-Gauge</h3>
                    </div>
                    <div className="text-right">
                      <span className="text-xl font-black text-amber-400 font-mono">$1,299</span>
                    </div>
                  </div>
                  <Link
                    to="/product/power-rack"
                    className="mt-4 w-full bg-zinc-800 hover:bg-amber-400 hover:text-zinc-950 text-white text-xs font-bold uppercase tracking-wider py-2.5 rounded text-center block transition-colors"
                  >
                    View Specifications
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid Section (All 15 Categories) */}
      <section id="categories-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest mb-2">
              <Layers className="w-4 h-4" />
              <span>Full Spectrum Facility Solutions</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight font-mono">
              Equipment Categories
            </h2>
            <p className="mt-1 text-sm text-zinc-400 max-w-xl">
              Spanning cardiovascular conditioning, heavy selectorized stacks, calibrated Olympic plates, strongman tools, and calisthenics rigs.
            </p>
          </div>

          <Link
            to="/products"
            className="text-xs font-bold text-amber-400 hover:text-amber-300 uppercase tracking-wider inline-flex items-center gap-1 group shrink-0"
          >
            <span>View All 110 Products</span>
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {INITIAL_CATEGORIES.map(cat => {
            const count = INITIAL_PRODUCTS.filter(p => p.categoryId === cat.id).length;
            return <CategoryCard key={cat.id} category={cat} count={count} />;
          })}
        </div>
      </section>

      {/* Featured Products Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10">
          <div>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block mb-1">
              Top Tier Gear
            </span>
            <h2 className="text-3xl font-black text-white uppercase tracking-tight font-mono">
              Featured Machinery
            </h2>
          </div>
          <Link
            to="/products"
            className="text-xs font-bold text-amber-400 hover:text-amber-300 uppercase tracking-wider inline-flex items-center gap-1"
          >
            <span>Full Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              categoryName={categoryNameMap.get(product.categoryId)}
            />
          ))}
        </div>
      </section>

      {/* Commercial Facility Consultation Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-zinc-900 via-zinc-900 to-zinc-950 border border-zinc-800 p-8 sm:p-12">
          <div className="max-w-2xl space-y-4">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
              Institutional & Club Outfitting
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
              Building or Upgrading a Commercial Facility?
            </h2>
            <p className="text-sm text-zinc-300 leading-relaxed">
              We provide comprehensive equipment packages with 3D facility CAD floor planning, bulk wholesale tier discounts, freight logistics coordination, and optional on-site assembly technicians.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-zinc-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Custom Brand Powder Coating</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Commercial Equipment Leasing</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Dedicated Commercial Account Exec</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Fast Lead Times & Freight Coordination</span>
              </div>
            </div>

            <div className="pt-4">
              <Link
                to="/contact"
                id="facility-consult-btn"
                className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold px-6 py-3 rounded text-xs uppercase tracking-wider transition-colors"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Request Commercial Quotation</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
