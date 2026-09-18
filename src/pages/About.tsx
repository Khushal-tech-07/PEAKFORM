import { Link } from 'react-router-dom';
import { ShieldCheck, Award, Dumbbell, Factory, CheckCircle, ArrowRight } from 'lucide-react';

export function About() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Top Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
          Heavy Industrial Craftsmanship
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-white uppercase tracking-tight font-mono">
          The PeakForm Standard
        </h1>
        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
          PeakForm was founded on a simple conviction: commercial gym equipment should endure decades of non-stop athletic abuse without rattle, play, or mechanical breakdown.
        </p>
      </div>

      {/* Engineering Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-6 space-y-3">
          <div className="w-12 h-12 rounded-lg bg-zinc-800 text-amber-400 flex items-center justify-center">
            <Factory className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white uppercase font-mono">
            11-Gauge Structural Steel
          </h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            All PeakForm uprights and cross-members are fabricated from high-tensile 3" x 3" 11-gauge steel with robotic continuous seam welding, designed to withstand loads exceeding 2,500 lbs.
          </p>
        </div>

        <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-6 space-y-3">
          <div className="w-12 h-12 rounded-lg bg-zinc-800 text-amber-400 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white uppercase font-mono">
            Biomechanic CAM Profiling
          </h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Our selectorized machinery features variable-radius mechanical cams engineered to match human musculoskeletal strength curves, maximizing muscle activation throughout the full range of motion.
          </p>
        </div>

        <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-6 space-y-3">
          <div className="w-12 h-12 rounded-lg bg-zinc-800 text-amber-400 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white uppercase font-mono">
            10-Year Frame Warranty
          </h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Every structural weld, post, and base plate comes backed by our comprehensive 10-year commercial warranty, protecting fitness directors and club owners from costly downtime.
          </p>
        </div>
      </div>

      {/* Facility Capabilities Story */}
      <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div className="space-y-4">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
            Institutional Outfitting
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight font-mono">
            From 2D Blueprints to Turnkey Training Facilities
          </h2>
          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
            Whether you are outfitting a 20,000 sq ft commercial health club, a collegiate varsity weight room, or a private boutique strength studio, our engineering team handles end-to-end 3D CAD facility floor plans, traffic flow modeling, and pallet freight logistics.
          </p>

          <div className="space-y-2 text-xs text-zinc-400 pt-2">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Free 3D Architectural CAD floor space planning with every quote</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Certified white-glove uncrating and bolt-down rigging services</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Custom brand powder coat colors and laser-cut logo nameplates</span>
            </div>
          </div>

          <div className="pt-4">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold px-6 py-3 rounded text-xs uppercase tracking-wider transition-colors"
            >
              <span>Consult with Equipment Engineer</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-zinc-900 text-amber-400 flex items-center justify-center mx-auto">
            <Dumbbell className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white uppercase">110 Standard Production SKUs</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            We maintain permanent stock across 15 distinct functional training categories ready for rapid nationwide deployment from our central Texas fulfillment hub.
          </p>
          <div className="grid grid-cols-2 gap-2 pt-2 text-left text-xs font-mono">
            <div className="bg-zinc-900 p-2.5 rounded border border-zinc-800">
              <span className="text-zinc-500 block">Warehouse</span>
              <span className="text-white font-bold">140,000 Sq Ft</span>
            </div>
            <div className="bg-zinc-900 p-2.5 rounded border border-zinc-800">
              <span className="text-zinc-500 block">Avg Dispatch</span>
              <span className="text-white font-bold">48 Hours</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
