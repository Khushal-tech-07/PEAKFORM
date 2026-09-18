import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  ShieldCheck,
  Truck,
  CheckCircle,
  X,
  CreditCard,
} from 'lucide-react';
import { useCart } from '../context/CartContext';

export function Cart() {
  const { cart, updateQuantity, removeFromCart, clearCart, subtotal } = useCart();
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    paymentMethod: 'invoice',
  });

  const navigate = useNavigate();

  // Freight logic: Free freight over $2,000, else $150 commercial pallet freight
  const freight = subtotal > 2000 || subtotal === 0 ? 0 : 150;
  const tax = subtotal * 0.0825;
  const total = subtotal + freight + tax;

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const generatedId = `PKF-ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderId(generatedId);
    setOrderComplete(true);
    clearCart();
  };

  if (cart.length === 0 && !orderComplete) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="max-w-md mx-auto bg-zinc-900/60 border border-zinc-800 rounded-2xl p-10 flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-zinc-800 text-zinc-500 flex items-center justify-center mb-4">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Your Equipment Cart is Empty</h2>
          <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
            Browse our commercial catalog of 110 cardio machines, power racks, barbells, and calisthenics rigs to start outfitting your facility.
          </p>
          <Link
            to="/products"
            className="bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold px-6 py-3 rounded text-xs uppercase tracking-wider transition-colors inline-flex items-center gap-2"
          >
            <span>Browse Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between pb-6 border-b border-zinc-800 mb-8">
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tight font-mono">
            Equipment Cart
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Review your commercial machinery selections, freight eligibility, and order summary.
          </p>
        </div>

        {cart.length > 0 && (
          <button
            type="button"
            onClick={clearCart}
            className="text-xs text-zinc-400 hover:text-rose-400 flex items-center gap-1.5 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear Cart</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {cart.map(({ product, quantity }) => (
            <div
              key={product.id}
              className="bg-zinc-900/70 border border-zinc-800 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all"
            >
              {/* Product Thumbnail and Info */}
              <div className="flex items-center gap-4">
                <Link
                  to={`/product/${product.slug}`}
                  className="w-20 h-20 bg-zinc-950 rounded-lg border border-zinc-800 overflow-hidden flex items-center justify-center shrink-0 group"
                >
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    onError={e => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                </Link>

                <div>
                  <Link
                    to={`/product/${product.slug}`}
                    className="text-base font-bold text-white hover:text-amber-400 transition-colors line-clamp-1"
                  >
                    {product.name}
                  </Link>
                  <div className="text-xs text-zinc-400 mt-0.5">
                    SKU: PKF-{product.id.toUpperCase()}
                  </div>
                  <div className="text-sm font-black text-amber-400 font-mono mt-1">
                    ${product.price.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Quantity Controls & Remove */}
              <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 pt-3 sm:pt-0 border-t sm:border-t-0 border-zinc-800">
                <div className="flex items-center border border-zinc-700 bg-zinc-950 rounded-md">
                  <button
                    type="button"
                    onClick={() => updateQuantity(product.id, quantity - 1)}
                    className="p-1.5 text-zinc-400 hover:text-white transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 font-mono text-xs font-bold text-white min-w-[2rem] text-center">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(product.id, quantity + 1)}
                    className="p-1.5 text-zinc-400 hover:text-white transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-right min-w-[5rem]">
                  <span className="text-base font-black text-white font-mono">
                    ${(product.price * quantity).toLocaleString()}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => removeFromCart(product.id)}
                  className="p-2 text-zinc-500 hover:text-rose-400 transition-colors rounded hover:bg-zinc-800"
                  title="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {/* Value note banner */}
          <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-4 flex items-center gap-3 text-xs text-zinc-400">
            <Truck className="w-5 h-5 text-amber-400 shrink-0" />
            <span>
              {subtotal >= 2000
                ? 'Your order qualifies for FREE commercial curbside freight delivery!'
                : `Add $${(2000 - subtotal).toLocaleString()} more in equipment to unlock FREE commercial freight.`}
            </span>
          </div>
        </div>

        {/* Right Column: Order Financial Summary */}
        <div className="lg:col-span-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-widest pb-3 border-b border-zinc-800">
              Commercial Order Summary
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between text-zinc-400">
                <span>Equipment Subtotal</span>
                <span className="font-mono text-white font-semibold">
                  ${subtotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Commercial Freight Delivery</span>
                <span className="font-mono text-white font-semibold">
                  {freight === 0 ? (
                    <span className="text-emerald-400 font-bold">FREE</span>
                  ) : (
                    `$${freight.toLocaleString()}`
                  )}
                </span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Estimated Sales Tax (8.25%)</span>
                <span className="font-mono text-white font-semibold">
                  ${tax.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-800 flex justify-between items-baseline">
              <span className="text-sm font-bold text-white uppercase tracking-wider">
                Total (USD)
              </span>
              <span className="text-2xl font-black text-amber-400 font-mono">
                ${total.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </span>
            </div>

            <button
              type="button"
              id="proceed-checkout-btn"
              onClick={() => setCheckoutModalOpen(true)}
              className="w-full bg-amber-400 hover:bg-amber-300 text-zinc-950 font-black py-3.5 rounded-lg text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-lg shadow-amber-400/20"
            >
              <CreditCard className="w-4 h-4" />
              <span>Proceed to Commercial Checkout</span>
            </button>

            <div className="pt-3 text-[11px] text-zinc-500 space-y-1">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Encrypted Commercial SSL Checkout</span>
              </div>
              <div>Standard delivery window: 5-8 business days via freight carrier.</div>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      {checkoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="text-base font-bold text-white uppercase tracking-wider font-mono">
                Commercial Order Checkout
              </h3>
              <button
                type="button"
                onClick={() => setCheckoutModalOpen(false)}
                className="p-1 text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCheckoutSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-zinc-400 mb-1 font-medium">Facility / Company Name</label>
                  <input
                    type="text"
                    required
                    value={formData.company}
                    onChange={e => setFormData({ ...formData, company: e.target.value })}
                    placeholder="Apex Athletic Club"
                    className="w-full bg-zinc-900 border border-zinc-800 text-white rounded p-2 focus:border-amber-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1 font-medium">Contact Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Doe"
                    className="w-full bg-zinc-900 border border-zinc-800 text-white rounded p-2 focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="text-xs">
                <label className="block text-zinc-400 mb-1 font-medium">Commercial Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  placeholder="purchasing@facility.com"
                  className="w-full bg-zinc-900 border border-zinc-800 text-white rounded p-2 focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div className="text-xs">
                <label className="block text-zinc-400 mb-1 font-medium">Freight Delivery Address</label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                  placeholder="100 Commercial Pkwy, Loading Dock B"
                  className="w-full bg-zinc-900 border border-zinc-800 text-white rounded p-2 focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <label className="block text-zinc-400 mb-1 font-medium">City</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={e => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Austin"
                    className="w-full bg-zinc-900 border border-zinc-800 text-white rounded p-2 focus:border-amber-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1 font-medium">State</label>
                  <input
                    type="text"
                    required
                    value={formData.state}
                    onChange={e => setFormData({ ...formData, state: e.target.value })}
                    placeholder="TX"
                    className="w-full bg-zinc-900 border border-zinc-800 text-white rounded p-2 focus:border-amber-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1 font-medium">ZIP</label>
                  <input
                    type="text"
                    required
                    value={formData.zip}
                    onChange={e => setFormData({ ...formData, zip: e.target.value })}
                    placeholder="78701"
                    className="w-full bg-zinc-900 border border-zinc-800 text-white rounded p-2 focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="text-xs pt-2">
                <label className="block text-zinc-400 mb-1.5 font-medium">Payment Option</label>
                <div className="grid grid-cols-2 gap-2">
                  <label className="flex items-center gap-2 p-2.5 rounded bg-zinc-900 border border-zinc-800 cursor-pointer">
                    <input
                      type="radio"
                      name="pay"
                      checked={formData.paymentMethod === 'invoice'}
                      onChange={() => setFormData({ ...formData, paymentMethod: 'invoice' })}
                      className="accent-amber-400"
                    />
                    <span className="text-zinc-200">Net 30 / Invoice</span>
                  </label>
                  <label className="flex items-center gap-2 p-2.5 rounded bg-zinc-900 border border-zinc-800 cursor-pointer">
                    <input
                      type="radio"
                      name="pay"
                      checked={formData.paymentMethod === 'card'}
                      onChange={() => setFormData({ ...formData, paymentMethod: 'card' })}
                      className="accent-amber-400"
                    />
                    <span className="text-zinc-200">Credit Card / Wire</span>
                  </label>
                </div>
              </div>

              <div className="pt-3 border-t border-zinc-800 flex items-center justify-between text-xs">
                <span className="text-zinc-400">Total Charged:</span>
                <span className="font-mono text-base font-black text-amber-400">
                  ${total.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </span>
              </div>

              <button
                type="submit"
                id="submit-order-btn"
                className="w-full bg-amber-400 hover:bg-amber-300 text-zinc-950 font-black py-3 rounded text-xs uppercase tracking-wider transition-colors"
              >
                Place Commercial Order
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Order Confirmation Receipt Modal */}
      {orderComplete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in zoom-in-95 duration-200">
          <div className="relative w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-2xl p-8 shadow-2xl text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-amber-400 text-zinc-950 flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 stroke-[2.5]" />
            </div>

            <h2 className="text-2xl font-black text-white uppercase tracking-tight font-mono">
              Order Confirmed!
            </h2>

            <p className="text-xs text-zinc-300 leading-relaxed">
              Thank you for choosing PeakForm. Your commercial equipment order has been routed to our logistics team for freight pallet preparation.
            </p>

            <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono">
              <span className="text-zinc-500 block">Order Reference Number</span>
              <span className="text-amber-400 font-bold text-sm">{orderId}</span>
            </div>

            <p className="text-[11px] text-zinc-500">
              A detailed invoice and freight tracking link have been dispatched to your email.
            </p>

            <div className="pt-4">
              <button
                type="button"
                onClick={() => {
                  setOrderComplete(false);
                  navigate('/products');
                }}
                className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-2.5 rounded text-xs uppercase tracking-wider transition-colors"
              >
                Continue Browsing Catalog
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
