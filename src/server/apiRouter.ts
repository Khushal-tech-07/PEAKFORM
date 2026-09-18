import { Router, Request, Response } from 'express';
import { INITIAL_CATEGORIES } from '../data/categories';
import { INITIAL_PRODUCTS } from '../data/products';
import { Category, Product, ContactSubmission } from '../types';

export const apiRouter = Router();

// In-memory runtime cache synchronized with initial dataset + mutations
let memoryCategories: Category[] = [...INITIAL_CATEGORIES];
let memoryProducts: Product[] = [...INITIAL_PRODUCTS];
let memorySubmissions: ContactSubmission[] = [];

// GET /api/categories
apiRouter.get('/categories', (_req: Request, res: Response) => {
  res.json({ success: true, data: memoryCategories });
});

// GET /api/products
apiRouter.get('/products', (req: Request, res: Response) => {
  const { category, search, sort, minPrice, maxPrice, page = '1', limit = '24' } = req.query;

  let filtered = [...memoryProducts];

  // Category filter
  if (category && typeof category === 'string' && category !== 'all') {
    filtered = filtered.filter(
      p => p.categoryId === category || p.categoryId === category.toLowerCase()
    );
  }

  // Search filter
  if (search && typeof search === 'string' && search.trim().length > 0) {
    const q = search.trim().toLowerCase();
    filtered = filtered.filter(
      p =>
        p.name.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q) ||
        p.fullDescription.toLowerCase().includes(q) ||
        Object.values(p.specifications).some(val => val.toLowerCase().includes(q))
    );
  }

  // Price range filter
  if (minPrice && !isNaN(Number(minPrice))) {
    filtered = filtered.filter(p => p.price >= Number(minPrice));
  }
  if (maxPrice && !isNaN(Number(maxPrice))) {
    filtered = filtered.filter(p => p.price <= Number(maxPrice));
  }

  // Sorting
  if (sort === 'price-asc') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sort === 'price-desc') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sort === 'rating') {
    filtered.sort((a, b) => b.rating - a.rating);
  } else if (sort === 'name') {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  }

  const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit as string, 10) || 24));
  const total = filtered.length;
  const totalPages = Math.ceil(total / limitNum);
  const start = (pageNum - 1) * limitNum;
  const paginated = filtered.slice(start, start + limitNum);

  res.json({
    success: true,
    data: paginated,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages,
    },
  });
});

// GET /api/products/:slug
apiRouter.get('/products/:slug', (req: Request, res: Response) => {
  const { slug } = req.params;
  const product = memoryProducts.find(p => p.slug === slug || p.id === slug);
  if (!product) {
    res.status(404).json({ success: false, error: 'Product not found' });
    return;
  }

  const related = memoryProducts
    .filter(p => p.categoryId === product.categoryId && p.id !== product.id)
    .slice(0, 4);

  res.json({ success: true, data: product, related });
});

// POST /api/contact
apiRouter.post('/contact', (req: Request, res: Response) => {
  const { name, email, subject, message } = req.body || {};

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    res.status(400).json({ success: false, error: 'Name is required' });
    return;
  }
  if (!email || typeof email !== 'string' || !email.includes('@')) {
    res.status(400).json({ success: false, error: 'Valid email is required' });
    return;
  }
  if (!subject || typeof subject !== 'string' || subject.trim().length === 0) {
    res.status(400).json({ success: false, error: 'Subject is required' });
    return;
  }
  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    res.status(400).json({ success: false, error: 'Message is required' });
    return;
  }

  const submission: ContactSubmission = {
    id: `contact-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    name: name.trim().slice(0, 100),
    email: email.trim().slice(0, 150),
    subject: subject.trim().slice(0, 200),
    message: message.trim().slice(0, 3000),
    createdAt: new Date().toISOString(),
  };

  memorySubmissions.push(submission);
  res.status(201).json({ success: true, message: 'Inquiry received successfully', data: submission });
});

// POST /api/products (Admin)
apiRouter.post('/products', (req: Request, res: Response) => {
  const item = req.body;
  if (!item.name || !item.price || !item.categoryId) {
    res.status(400).json({ success: false, error: 'Missing required product attributes (name, price, categoryId)' });
    return;
  }

  const slug = item.slug || item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const newProduct: Product = {
    id: item.id || `prod-${Date.now()}`,
    name: item.name,
    slug,
    categoryId: item.categoryId,
    shortDescription: item.shortDescription || 'Commercial gym equipment.',
    fullDescription: item.fullDescription || item.shortDescription || 'Engineered for peak performance.',
    specifications: item.specifications || { 'Warranty': '5-Year Commercial' },
    price: Number(item.price),
    currency: 'USD',
    imageUrl: item.imageUrl || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
    inStock: item.inStock ?? true,
    rating: Number(item.rating) || 5.0,
    featured: Boolean(item.featured),
  };

  memoryProducts.unshift(newProduct);
  res.status(201).json({ success: true, data: newProduct });
});

// PUT /api/products/:id (Admin)
apiRouter.put('/products/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const index = memoryProducts.findIndex(p => p.id === id || p.slug === id);
  if (index === -1) {
    res.status(404).json({ success: false, error: 'Product not found' });
    return;
  }

  const updated: Product = {
    ...memoryProducts[index],
    ...req.body,
    id: memoryProducts[index].id, // Prevent tampering with immutable ID
  };

  memoryProducts[index] = updated;
  res.json({ success: true, data: updated });
});

// DELETE /api/products/:id (Admin)
apiRouter.delete('/products/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const beforeLen = memoryProducts.length;
  memoryProducts = memoryProducts.filter(p => p.id !== id && p.slug !== id);

  if (memoryProducts.length === beforeLen) {
    res.status(404).json({ success: false, error: 'Product not found' });
    return;
  }

  res.json({ success: true, message: 'Product deleted' });
});

// GET /api/submissions (Admin view)
apiRouter.get('/contact/submissions', (_req: Request, res: Response) => {
  res.json({ success: true, data: memorySubmissions });
});
