import { supabase } from '../lib/supabase';
import { Product, Store, Category, SellerAccount, Order } from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_STORES,
  INITIAL_CATEGORIES,
} from '../data/mockData';
import { DEFAULT_SELLERS } from './storageService';

// Supabase table names (or json-backed collections)
// Supports dedicated tables or fallback to app_collection table
export class SupabaseService {
  private isInitialized = false;

  async initializeAndSeed(forceCheck = false) {
    if (this.isInitialized && !forceCheck) return;
    this.isInitialized = true;

    try {
      // Test if supabase tables exist, otherwise initialize safely
      const { data: testStores, error } = await supabase.from('stores').select('id').limit(1);
      if (error) {
        console.warn('Supabase tables notice:', error.message);
        return;
      }

      // If stores table exists and is empty, seed initial stores
      if (!testStores || testStores.length === 0) {
        console.log('Seeding stores to Supabase...');
        await supabase.from('stores').upsert(INITIAL_STORES);
      }

      // If products table exists and is empty, seed initial products
      const { data: testProds } = await supabase.from('products').select('id').limit(1);
      if (!testProds || testProds.length === 0) {
        console.log('Seeding products to Supabase...');
        await supabase.from('products').upsert(INITIAL_PRODUCTS);
      }

      // If categories table exists and is empty, seed initial categories
      const { data: testCats } = await supabase.from('categories').select('id').limit(1);
      if (!testCats || testCats.length === 0) {
        console.log('Seeding categories to Supabase...');
        await supabase.from('categories').upsert(INITIAL_CATEGORIES);
      }

      // If sellers table exists and is empty, seed initial sellers
      const { data: testSellers } = await supabase.from('sellers').select('id').limit(1);
      if (!testSellers || testSellers.length === 0) {
        console.log('Seeding sellers to Supabase...');
        await supabase.from('sellers').upsert(DEFAULT_SELLERS);
      }
    } catch (err) {
      console.warn('Supabase seeding notice:', err);
    }
  }

  // --- Fetchers ---

  async fetchStores(): Promise<Store[]> {
    try {
      const { data, error } = await supabase.from('stores').select('*');
      if (error) {
        console.warn('Supabase fetchStores notice:', error.message);
        return [];
      }
      return (data as Store[]) || [];
    } catch (err) {
      console.warn('Supabase fetchStores error:', err);
      return [];
    }
  }

  async fetchProducts(): Promise<Product[]> {
    try {
      const { data, error } = await supabase.from('products').select('*');
      if (error) {
        console.warn('Supabase fetchProducts notice:', error.message);
        return [];
      }
      return (data as Product[]) || [];
    } catch (err) {
      console.warn('Supabase fetchProducts error:', err);
      return [];
    }
  }

  async fetchCategories(): Promise<Category[]> {
    try {
      const { data, error } = await supabase.from('categories').select('*');
      if (error) {
        console.warn('Supabase fetchCategories notice:', error.message);
        return [];
      }
      return (data as Category[]) || [];
    } catch (err) {
      console.warn('Supabase fetchCategories error:', err);
      return [];
    }
  }

  async fetchSellers(): Promise<SellerAccount[]> {
    try {
      const { data, error } = await supabase.from('sellers').select('*');
      if (error) {
        console.warn('Supabase fetchSellers notice:', error.message);
        return [];
      }
      return (data as SellerAccount[]) || [];
    } catch (err) {
      console.warn('Supabase fetchSellers error:', err);
      return [];
    }
  }

  async fetchOrders(): Promise<Order[]> {
    try {
      const { data, error } = await supabase.from('orders').select('*');
      if (error) {
        console.warn('Supabase fetchOrders notice:', error.message);
        return [];
      }
      return (data as Order[]) || [];
    } catch (err) {
      console.warn('Supabase fetchOrders error:', err);
      return [];
    }
  }

  // --- Realtime Subscriptions ---

  subscribeStores(callback: (stores: Store[]) => void): () => void {
    const channel = supabase
      .channel('public:stores')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'stores' }, async () => {
        const fresh = await this.fetchStores();
        if (fresh.length > 0) callback(fresh);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }

  subscribeProducts(callback: (products: Product[]) => void): () => void {
    const channel = supabase
      .channel('public:products')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, async () => {
        const fresh = await this.fetchProducts();
        if (fresh.length > 0) callback(fresh);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }

  subscribeCategories(callback: (categories: Category[]) => void): () => void {
    const channel = supabase
      .channel('public:categories')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'categories' }, async () => {
        const fresh = await this.fetchCategories();
        if (fresh.length > 0) callback(fresh);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }

  subscribeSellers(callback: (sellers: SellerAccount[]) => void): () => void {
    const channel = supabase
      .channel('public:sellers')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'sellers' }, async () => {
        const fresh = await this.fetchSellers();
        if (fresh.length > 0) callback(fresh);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }

  subscribeOrders(callback: (orders: Order[]) => void): () => void {
    const channel = supabase
      .channel('public:orders')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, async () => {
        const fresh = await this.fetchOrders();
        if (fresh.length > 0) callback(fresh);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }

  // --- Mutations (Save / Delete) ---

  async saveStore(store: Store): Promise<void> {
    try {
      const { error } = await supabase.from('stores').upsert(store);
      if (error) console.warn('Supabase saveStore warning:', error.message);
    } catch (err) {
      console.warn('Supabase saveStore error:', err);
    }
  }

  async deleteStore(storeId: string): Promise<void> {
    try {
      const { error } = await supabase.from('stores').delete().eq('id', storeId);
      if (error) console.warn('Supabase deleteStore warning:', error.message);
    } catch (err) {
      console.warn('Supabase deleteStore error:', err);
    }
  }

  async saveProduct(product: Product): Promise<void> {
    try {
      const { error } = await supabase.from('products').upsert(product);
      if (error) console.warn('Supabase saveProduct warning:', error.message);
    } catch (err) {
      console.warn('Supabase saveProduct error:', err);
    }
  }

  async deleteProduct(productId: string): Promise<void> {
    try {
      const { error } = await supabase.from('products').delete().eq('id', productId);
      if (error) console.warn('Supabase deleteProduct warning:', error.message);
    } catch (err) {
      console.warn('Supabase deleteProduct error:', err);
    }
  }

  async saveCategory(category: Category): Promise<void> {
    try {
      const { error } = await supabase.from('categories').upsert(category);
      if (error) console.warn('Supabase saveCategory warning:', error.message);
    } catch (err) {
      console.warn('Supabase saveCategory error:', err);
    }
  }

  async deleteCategory(categoryId: string): Promise<void> {
    try {
      const { error } = await supabase.from('categories').delete().eq('id', categoryId);
      if (error) console.warn('Supabase deleteCategory warning:', error.message);
    } catch (err) {
      console.warn('Supabase deleteCategory error:', err);
    }
  }

  async saveSeller(seller: SellerAccount): Promise<void> {
    try {
      const { error } = await supabase.from('sellers').upsert(seller);
      if (error) console.warn('Supabase saveSeller warning:', error.message);
    } catch (err) {
      console.warn('Supabase saveSeller error:', err);
    }
  }

  async deleteSeller(sellerId: string): Promise<void> {
    try {
      const { error } = await supabase.from('sellers').delete().eq('id', sellerId);
      if (error) console.warn('Supabase deleteSeller warning:', error.message);
    } catch (err) {
      console.warn('Supabase deleteSeller error:', err);
    }
  }

  async saveOrder(order: Order): Promise<void> {
    try {
      const { error } = await supabase.from('orders').upsert(order);
      if (error) console.warn('Supabase saveOrder warning:', error.message);
    } catch (err) {
      console.warn('Supabase saveOrder error:', err);
    }
  }
}

export const supabaseService = new SupabaseService();
