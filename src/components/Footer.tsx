import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Dumbbell, Mail, Shield, Truck, Clock, Award, CheckCircle } from 'lucide-react';

export function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-zinc-950 border-t border-zinc-800/80 text-zinc-400">
      {/* Guarantees Strip */}
      <div className="border-b border-zinc-900 bg-zinc-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-zinc-800 text-amber-400 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Free Freight</h4>
              <p className="text-xs text-zinc-400">On all orders exceeding $2,000</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-zinc-800 text-amber-400 flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">10-Year Warranty</h4>
              <p className="text-xs text-zinc-400">Structural steel frame guarantee</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-zinc-800 text-amber-400 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Commercial Grade</h4>
              <p className="text-xs text-zinc-400">Engineered for 24/7 club use</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-zinc-800 text-amber-400 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Facility Direct</h4>
              <p className="text-xs text-zinc-400">Fast logistics & white-glove setup</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Newsletter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-amber-400 text-zinc-950 flex items-center justify-center font-black">
                <Dumbbell className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div className="text-xl font-black tracking-tighter uppercase font-mono text-white">
                PEAK<span className="text-amber-400">FORM</span>
              </div>
            </Link>
            <p className="text-sm text-zinc-400 leading-relaxed max-w-sm">
              PeakForm Fitness Equipment manufactures and distributes elite-tier commercial gym machinery, calibrated free weights, strongman apparatus, and calisthenics rigs for high-performance athletic facilities worldwide.
            </p>
            <div className="text-xs text-zinc-500 font-mono">
              HQ: 1040 Ironworks Blvd, Austin, TX 78701 • (800) 555-PEAK
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-4">
              Catalog Hub
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/category/cardio-machines" className="hover:text-amber-400 transition-colors">Cardio Machines</Link></li>
              <li><Link to="/category/lower-body-machines" className="hover:text-amber-400 transition-colors">Lower Body Machines</Link></li>
              <li><Link to="/category/back-chest-machines" className="hover:text-amber-400 transition-colors">Back & Chest Machines</Link></li>
              <li><Link to="/category/free-weights" className="hover:text-amber-400 transition-colors">Free Weights</Link></li>
              <li><Link to="/category/racks-cages-stands" className="hover:text-amber-400 transition-colors">Racks & Cages</Link></li>
              <li><Link to="/category/benches" className="hover:text-amber-400 transition-colors">Olympic Benches</Link></li>
            </ul>
          </div>

          {/* Customer & Company */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-4">
              Company
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/about" className="hover:text-amber-400 transition-colors">About PeakForm</Link></li>
              <li><Link to="/contact" className="hover:text-amber-400 transition-colors">Commercial Quotations</Link></li>
              <li><Link to="/products" className="hover:text-amber-400 transition-colors">110-Item Catalog</Link></li>
              <li><Link to="/admin" className="hover:text-amber-400 transition-colors">Admin Portal</Link></li>
              <li><span className="text-zinc-500">Commercial Financing</span></li>
              <li><span className="text-zinc-500">Facility Floor Planning</span></li>
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-4">
              VIP Equipment Drops
            </h3>
            <p className="text-xs text-zinc-400 mb-3">
              Subscribe for wholesale commercial catalog releases and seasonal freight promos.
            </p>
            {subscribed ? (
              <div className="bg-amber-400/10 border border-amber-400/30 text-amber-400 rounded p-3 text-xs flex items-center gap-2 font-medium">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>Subscribed! Check your inbox for updates.</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletter} className="space-y-2">
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
                  <input
                    id="newsletter-email-input"
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="gym.director@facility.com"
                    className="w-full bg-zinc-900 border border-zinc-800 text-white text-xs rounded pl-9 pr-3 py-2.5 focus:border-amber-400 focus:outline-none placeholder:text-zinc-600"
                  />
                </div>
                <button
                  type="submit"
                  id="newsletter-submit-btn"
                  className="w-full bg-amber-400 hover:bg-amber-300 text-zinc-950 text-xs font-bold uppercase tracking-wider py-2 rounded transition-colors"
                >
                  Join VIP Register
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="mt-12 pt-8 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div>
            © {new Date().getFullYear()} PeakForm Fitness Equipment Co. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <span>ISO 9001 Certified Factory Spec</span>
            <span>IPF & IWF Standard Geometry</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
