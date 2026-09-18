import {
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
  addDoc,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { Category, Product, ContactSubmission } from '../types';
import { INITIAL_CATEGORIES } from '../data/categories';
import { INITIAL_PRODUCTS } from '../data/products';

export async function fetchCategories(): Promise<Category[]> {
  try {
    const querySnapshot = await getDocs(collection(db, 'categories'));
    if (!querySnapshot.empty) {
      const items: Category[] = [];
      querySnapshot.forEach(docSnap => {
        items.push(docSnap.data() as Category);
      });
      return items;
    }
  } catch (error) {
    console.warn('Firestore categories read fallback to initial data:', error);
  }
  return INITIAL_CATEGORIES;
}

export async function fetchProducts(): Promise<Product[]> {
  try {
    const querySnapshot = await getDocs(collection(db, 'products'));
    if (!querySnapshot.empty) {
      const items: Product[] = [];
      querySnapshot.forEach(docSnap => {
        items.push(docSnap.data() as Product);
      });
      return items;
    }
  } catch (error) {
    console.warn('Firestore products read fallback to initial data:', error);
  }
  return INITIAL_PRODUCTS;
}

export async function saveProductToFirestore(product: Product): Promise<void> {
  const path = 'products';
  try {
    await setDoc(doc(db, path, product.id), product);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${path}/${product.id}`);
  }
}

export async function deleteProductFromFirestore(productId: string): Promise<void> {
  const path = 'products';
  try {
    await deleteDoc(doc(db, path, productId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${path}/${productId}`);
  }
}

export async function submitContactInquiry(submission: Omit<ContactSubmission, 'id' | 'createdAt'>): Promise<ContactSubmission> {
  const newSubmission: ContactSubmission = {
    ...submission,
    id: `contact-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    createdAt: new Date().toISOString(),
  };

  // Try API first
  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSubmission),
    });
    if (res.ok) {
      const json = await res.json();
      if (json.data) return json.data;
    }
  } catch {
    // Continue to Firestore
  }

  // Save to Firestore contact_submissions
  const path = 'contact_submissions';
  try {
    await setDoc(doc(db, path, newSubmission.id), newSubmission);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `${path}/${newSubmission.id}`);
  }

  return newSubmission;
}

export async function seedAllToFirestore(onProgress?: (msg: string) => void): Promise<number> {
  let count = 0;
  onProgress?.('Seeding categories...');
  for (const cat of INITIAL_CATEGORIES) {
    try {
      await setDoc(doc(db, 'categories', cat.id), cat);
      count++;
    } catch (e) {
      console.error('Error seeding category:', cat.id, e);
    }
  }

  onProgress?.('Seeding 110 products to Firestore...');
  for (const prod of INITIAL_PRODUCTS) {
    try {
      await setDoc(doc(db, 'products', prod.id), prod);
      count++;
    } catch (e) {
      console.error('Error seeding product:', prod.id, e);
    }
  }

  onProgress?.(`Successfully seeded ${count} documents to Firestore.`);
  return count;
}
