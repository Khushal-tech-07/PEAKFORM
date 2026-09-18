export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  imageUrl?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  shortDescription: string;
  fullDescription: string;
  specifications: Record<string, string>;
  price: number;
  currency: string;
  imageUrl: string;
  images?: string[];
  inStock: boolean;
  rating: number;
  featured: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}
