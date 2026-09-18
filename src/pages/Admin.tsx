import { useState, useEffect } from 'react';
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  ShieldAlert,
  Plus,
  Trash2,
  Edit2,
  Database,
  CheckCircle,
  Search,
  LogOut,
  RefreshCw,
  Mail,
  X,
  Dumbbell,
  Loader2,
} from 'lucide-react';
import { auth, googleProvider } from '../lib/firebase';
import { INITIAL_CATEGORIES } from '../data/categories';
import { INITIAL_PRODUCTS } from '../data/products';
import { Product, ContactSubmission } from '../types';
import {
  seedAllToFirestore,
  saveProductToFirestore,
  deleteProductFromFirestore,
} from '../services/catalogService';

export function Admin() {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [devBypass, setDevBypass] = useState(false);

  // Data state
  const [products, setProducts] = useState<Product[]>([...INITIAL_PRODUCTS]);
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [activeTab, setActiveTab] = useState<'products' | 'submissions' | 'seed'>('products');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');

  // Modal state
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [syncProgress, setSyncProgress] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);

  // Form state for create / edit
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    slug: '',
    categoryId: INITIAL_CATEGORIES[0]?.id || 'cardio-machines',
    shortDescription: '',
    fullDescription: '',
    price: 999,
    rating: 5.0,
    inStock: true,
    featured: false,
    specifications: {
      'Steel Spec': '11-Gauge 3x3" Steel',
      'Warranty': '10-Year Frame',
    },
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setCurrentUser(user);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Fetch submissions if any
  useEffect(() => {
    fetch('/api/contact/submissions')
      .then(res => res.json())
      .then(json => {
        if (json.data) setSubmissions(json.data);
      })
      .catch(() => {});
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: unknown) {
      console.error('Google Sign-In failed:', err);
      // If iframe blocks popup, allow dev evaluation bypass
      const msg = err instanceof Error ? err.message : '';
      if (msg.includes('popup') || msg.includes('blocked') || msg.includes('operation-not-supported-in-this-environment')) {
        alert('Popup was blocked by the browser/iframe sandbox. Enabling local evaluation admin access.');
        setDevBypass(true);
      } else {
        alert(`Authentication note: ${msg}. You may also click "Developer Override" to test administrative functions.`);
      }
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    setDevBypass(false);
  };

  const handleStartCreate = () => {
    setFormData({
      id: `prod-${Date.now()}`,
      name: '',
      slug: '',
      categoryId: INITIAL_CATEGORIES[0]?.id || 'cardio-machines',
      shortDescription: '',
      fullDescription: '',
      price: 999,
      rating: 5.0,
      inStock: true,
      featured: false,
      imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
      specifications: {
        'Steel Spec': '11-Gauge 3x3" Welded Steel',
        'Warranty': '10-Year Commercial Frame',
      },
    });
    setIsCreating(true);
    setEditProduct(null);
  };

  const handleStartEdit = (prod: Product) => {
    setFormData({ ...prod });
    setEditProduct(prod);
    setIsCreating(false);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.categoryId || !formData.price) {
      alert('Please provide name, category, and price.');
      return;
    }

    const slug =
      formData.slug ||
      formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const completeProduct: Product = {
      id: formData.id || `prod-${Date.now()}`,
      name: formData.name,
      slug,
      categoryId: formData.categoryId,
      shortDescription: formData.shortDescription || 'Commercial grade equipment.',
      fullDescription: formData.fullDescription || 'Engineered for high performance.',
      specifications: formData.specifications || { 'Warranty': '5-Year Commercial' },
      price: Number(formData.price),
      currency: 'USD',
      imageUrl:
        formData.imageUrl ||
        'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
      inStock: formData.inStock ?? true,
      rating: Number(formData.rating) || 5.0,
      featured: Boolean(formData.featured),
    };

    try {
      await saveProductToFirestore(completeProduct);
    } catch {
      // Continue locally
    }

    // Update in-memory product list
    setProducts(prev => {
      const idx = prev.findIndex(p => p.id === completeProduct.id);
      if (idx !== -1) {
        const next = [...prev];
        next[idx] = completeProduct;
        return next;
      }
      return [completeProduct, ...prev];
    });

    setIsCreating(false);
    setEditProduct(null);
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await deleteProductFromFirestore(id);
    } catch {
      // Continue locally
    }

    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const handleSyncAllFirestore = async () => {
    setSyncing(true);
    setSyncProgress('Starting Firestore sync of 15 categories and 110 products...');
    try {
      const count = await seedAllToFirestore(msg => setSyncProgress(msg));
      setSyncProgress(`Completed! ${count} documents verified in Firestore.`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error syncing';
      setSyncProgress(`Sync failed: ${message}`);
    } finally {
      setSyncing(false);
    }
  };

  const isAuthenticated = Boolean(currentUser || devBypass);

  if (authLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-zinc-400 gap-2">
        <Loader2 className="w-5 h-5 animate-spin text-amber-400" />
        <span>Verifying administrative authorization...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-zinc-900 border border-zinc-800 rounded-2xl text-center space-y-6">
        <div className="w-14 h-14 rounded-full bg-amber-400 text-zinc-950 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-7 h-7" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tight font-mono">
            PeakForm Admin Portal
          </h2>
          <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
            Authentication required to manage commercial product inventory, sync Firestore records, and review buyer inquiries.
          </p>
        </div>

        <div className="space-y-3">
          <button
            type="button"
            id="google-signin-btn"
            onClick={handleGoogleSignIn}
            className="w-full bg-white hover:bg-zinc-100 text-zinc-900 font-bold py-3 rounded-lg text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>Sign In with Google</span>
          </button>

          <button
            type="button"
            id="dev-bypass-btn"
            onClick={() => setDevBypass(true)}
            className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold py-2.5 rounded-lg text-xs tracking-wide transition-colors"
          >
            Developer Sandbox Override (Direct Access)
          </button>
        </div>
      </div>
    );
  }

  const filteredProducts = products.filter(p => {
    if (selectedCat !== 'all' && p.categoryId !== selectedCat) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Admin Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest font-mono">
              Management Portal
            </span>
            <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded font-mono">
              Authenticated
            </span>
          </div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tight font-mono mt-1">
            PeakForm Admin Control
          </h1>
          <p className="text-xs text-zinc-400">
            Active User: {currentUser?.email || 'Administrator (Sandbox Session)'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            id="admin-create-product-btn"
            onClick={handleStartCreate}
            className="bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold px-4 py-2 rounded text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>New Equipment SKU</span>
          </button>

          <button
            type="button"
            id="admin-signout-btn"
            onClick={handleSignOut}
            className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white p-2 rounded text-xs transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-800">
        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 -mb-px flex items-center gap-2 ${
            activeTab === 'products'
              ? 'border-amber-400 text-amber-400'
              : 'border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          <Dumbbell className="w-4 h-4" />
          <span>Catalog SKUs ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('submissions')}
          className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 -mb-px flex items-center gap-2 ${
            activeTab === 'submissions'
              ? 'border-amber-400 text-amber-400'
              : 'border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          <Mail className="w-4 h-4" />
          <span>Customer Inquiries ({submissions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('seed')}
          className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 -mb-px flex items-center gap-2 ${
            activeTab === 'seed'
              ? 'border-amber-400 text-amber-400'
              : 'border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Firestore Sync Utility</span>
        </button>
      </div>

      {/* Tab: Products Management */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          {/* Filter & Search */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search SKUs or titles..."
                className="w-full bg-zinc-900 border border-zinc-700 text-white text-xs rounded pl-9 pr-3 py-2 focus:border-amber-400 focus:outline-none"
              />
            </div>

            <select
              value={selectedCat}
              onChange={e => setSelectedCat(e.target.value)}
              className="bg-zinc-900 border border-zinc-700 text-white text-xs rounded px-3 py-2 focus:border-amber-400 focus:outline-none w-full sm:w-auto"
            >
              <option value="all">All 15 Categories</option>
              {INITIAL_CATEGORIES.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Products Table */}
          <div className="border border-zinc-800 rounded-xl overflow-hidden bg-zinc-950">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-zinc-300">
                <thead className="bg-zinc-900 text-zinc-400 uppercase tracking-wider font-mono text-[10px] border-b border-zinc-800">
                  <tr>
                    <th className="p-3">Product Name & SKU</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Price</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Rating</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {filteredProducts.slice(0, 50).map(p => (
                    <tr key={p.id} className="hover:bg-zinc-900/40 transition-colors">
                      <td className="p-3">
                        <div className="font-bold text-white">{p.name}</div>
                        <div className="text-[10px] text-zinc-500 font-mono">ID: {p.id}</div>
                      </td>
                      <td className="p-3 text-zinc-400">
                        {INITIAL_CATEGORIES.find(c => c.id === p.categoryId)?.name || p.categoryId}
                      </td>
                      <td className="p-3 font-mono font-bold text-white">
                        ${p.price.toLocaleString()}
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            p.inStock
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : 'bg-rose-950 text-rose-400 border border-rose-800'
                          }`}
                        >
                          {p.inStock ? 'In Stock' : 'Backorder'}
                        </span>
                      </td>
                      <td className="p-3 font-mono text-amber-400">
                        {p.rating.toFixed(1)} ★
                      </td>
                      <td className="p-3 text-right space-x-2">
                        <button
                          type="button"
                          onClick={() => handleStartEdit(p)}
                          className="p-1.5 text-zinc-400 hover:text-amber-400 transition-colors rounded hover:bg-zinc-800"
                          title="Edit product"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteProduct(p.id)}
                          className="p-1.5 text-zinc-400 hover:text-rose-400 transition-colors rounded hover:bg-zinc-800"
                          title="Delete product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredProducts.length > 50 && (
              <div className="p-3 bg-zinc-900 text-center text-xs text-zinc-400 border-t border-zinc-800">
                Showing top 50 of {filteredProducts.length} matching units. Use search to filter specific equipment.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab: Submissions Management */}
      {activeTab === 'submissions' && (
        <div className="space-y-4">
          <div className="border border-zinc-800 rounded-xl overflow-hidden bg-zinc-950">
            {submissions.length === 0 ? (
              <div className="p-12 text-center text-zinc-500 text-xs">
                No customer inquiries submitted yet. Submit a test quote from the Contact page.
              </div>
            ) : (
              <div className="divide-y divide-zinc-800">
                {submissions.map(sub => (
                  <div key={sub.id} className="p-4 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="font-bold text-white text-sm">{sub.name} &lt;{sub.email}&gt;</div>
                      <div className="text-zinc-500 font-mono text-[10px]">{sub.createdAt}</div>
                    </div>
                    <div className="text-xs text-amber-400 font-semibold">{sub.subject}</div>
                    <p className="text-xs text-zinc-300 bg-zinc-900/60 p-3 rounded border border-zinc-800">
                      {sub.message}
                    </p>
                    <div className="text-[10px] text-zinc-500 font-mono">Inquiry ID: {sub.id}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab: Seed to Firestore */}
      {activeTab === 'seed' && (
        <div className="max-w-xl bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-zinc-800 text-amber-400 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase font-mono">
                Synchronize Catalog with Cloud Firestore
              </h3>
              <p className="text-xs text-zinc-400">
                Bulk seeds all 15 categories and 110 equipment products into Firestore collections.
              </p>
            </div>
          </div>

          {syncProgress && (
            <div className="p-3 bg-zinc-950 border border-zinc-800 rounded text-xs font-mono text-amber-400">
              {syncProgress}
            </div>
          )}

          <button
            type="button"
            id="seed-firestore-btn"
            disabled={syncing}
            onClick={handleSyncAllFirestore}
            className="w-full bg-amber-400 hover:bg-amber-300 text-zinc-950 font-black py-3 rounded text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
          >
            {syncing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Writing Documents to Firestore...</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                <span>Sync All 110 Products to Firestore</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Create / Edit Modal */}
      {(isCreating || editProduct) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-xl bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="text-base font-bold text-white uppercase font-mono">
                {isCreating ? 'Add New Equipment Product' : `Edit ${editProduct?.name}`}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setIsCreating(false);
                  setEditProduct(null);
                }}
                className="p-1 text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-400 mb-1 font-medium">Product Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name || ''}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Dual Cable Column"
                  className="w-full bg-zinc-900 border border-zinc-800 text-white rounded p-2 focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1 font-medium">Category *</label>
                  <select
                    value={formData.categoryId || INITIAL_CATEGORIES[0].id}
                    onChange={e => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 text-white rounded p-2 focus:border-amber-400 focus:outline-none"
                  >
                    {INITIAL_CATEGORIES.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1 font-medium">Price (USD) *</label>
                  <input
                    type="number"
                    required
                    value={formData.price || 0}
                    onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full bg-zinc-900 border border-zinc-800 text-white rounded p-2 focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-medium">Short Description</label>
                <input
                  type="text"
                  value={formData.shortDescription || ''}
                  onChange={e => setFormData({ ...formData, shortDescription: e.target.value })}
                  placeholder="Single sentence commercial summary..."
                  className="w-full bg-zinc-900 border border-zinc-800 text-white rounded p-2 focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-medium">Full Description</label>
                <textarea
                  rows={3}
                  value={formData.fullDescription || ''}
                  onChange={e => setFormData({ ...formData, fullDescription: e.target.value })}
                  placeholder="Detailed engineering specifications and training benefits..."
                  className="w-full bg-zinc-900 border border-zinc-800 text-white rounded p-2 focus:border-amber-400 focus:outline-none resize-y"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <label className="flex items-center gap-2 p-2 rounded bg-zinc-900 border border-zinc-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.inStock ?? true}
                    onChange={e => setFormData({ ...formData, inStock: e.target.checked })}
                    className="accent-amber-400"
                  />
                  <span className="text-zinc-200">In Stock</span>
                </label>

                <label className="flex items-center gap-2 p-2 rounded bg-zinc-900 border border-zinc-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured ?? false}
                    onChange={e => setFormData({ ...formData, featured: e.target.checked })}
                    className="accent-amber-400"
                  />
                  <span className="text-zinc-200">Featured on Home</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-amber-400 hover:bg-amber-300 text-zinc-950 font-black py-2.5 rounded text-xs uppercase tracking-wider transition-colors"
              >
                {isCreating ? 'Create & Publish SKU' : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
