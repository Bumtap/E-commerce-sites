import { supabase } from '../lib/supabase';
import { Product, Store, Category, SellerAccount, Order } from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_STORES,
  INITIAL_CATEGORIES,
} from '../data/mockData';
import { DEFAULT_SELLERS } from './storageService';

// Supabase table names and operations
export class SupabaseService {
  private isInitialized = false;

  async initializeAndSeed(forceCheck = false) {
    if (this.isInitialized && !forceCheck) return;
    this.isInitialized = true;

    try {
      // 1. Stores table verification & seeding
      const { data: testStores, error: storesErr } = await supabase.from('stores').select('id').limit(1);
      if (!storesErr && (!testStores || testStores.length === 0)) {
        console.log('Seeding stores to Supabase...');
        await supabase.from('stores').upsert(INITIAL_STORES);
      }

      // 2. Categories table verification & seeding
      const { data: testCats, error: catsErr } = await supabase.from('categories').select('id').limit(1);
      if (!catsErr && (!testCats || testCats.length === 0)) {
        console.log('Seeding categories to Supabase...');
        await supabase.from('categories').upsert(INITIAL_CATEGORIES);
      }

      // 3. Products table verification & seeding
      const { data: testProds, error: prodsErr } = await supabase.from('products').select('id').limit(1);
      if (!prodsErr && (!testProds || testProds.length === 0)) {
        console.log('Seeding products to Supabase...');
        await supabase.from('products').upsert(INITIAL_PRODUCTS);
      }

      // 4. Sellers table verification & seeding
      const { data: testSellers, error: sellersErr } = await supabase.from('sellers').select('id').limit(1);
      if (!sellersErr && (!testSellers || testSellers.length === 0)) {
        console.log('Seeding sellers to Supabase...');
        const sanitizedSellers = DEFAULT_SELLERS.map((s) => ({
          id: s.id,
          email: s.email,
          password: s.password || 'seller123',
          storeId: s.storeId,
          storeName: s.storeName,
          ownerName: s.ownerName || '',
          phone: s.phone || '',
          location: s.location || '',
          joinedDate: s.joinedDate || new Date().toISOString().split('T')[0],
          isVerified: s.isVerified !== undefined ? s.isVerified : true,
          status: s.status || 'approved',
        }));
        await supabase.from('sellers').upsert(sanitizedSellers);
      }
    } catch (err) {
      console.warn('Supabase initialization notice:', err);
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
      .channel('realtime:stores')
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
      .channel('realtime:products')
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
      .channel('realtime:categories')
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
      .channel('realtime:sellers')
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
      .channel('realtime:orders')
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

  async saveStore(store: Store): Promise<boolean> {
    try {
      const payload = {
        ...store,
        rating: Number(store.rating || 5),
        reviewCount: Number(store.reviewCount || 0),
        productCount: Number(store.productCount || 0),
        isVerified: store.isVerified !== undefined ? store.isVerified : true,
      };
      const { error } = await supabase.from('stores').upsert(payload);
      if (error) {
        console.warn('Supabase saveStore warning:', error.message);
        return false;
      }
      return true;
    } catch (err) {
      console.warn('Supabase saveStore error:', err);
      return false;
    }
  }

  async deleteStore(storeId: string): Promise<boolean> {
    try {
      const { error } = await supabase.from('stores').delete().eq('id', storeId);
      if (error) {
        console.warn('Supabase deleteStore warning:', error.message);
        return false;
      }
      return true;
    } catch (err) {
      console.warn('Supabase deleteStore error:', err);
      return false;
    }
  }

  async saveProduct(product: Product): Promise<boolean> {
    try {
      // Clean undefined fields and guarantee proper formats for Postgres columns
      const payload = {
        ...product,
        price: Number(product.price),
        salePrice: product.salePrice ? Number(product.salePrice) : null,
        discountPercentage: product.discountPercentage ? Number(product.discountPercentage) : null,
        stock: Number(product.stock ?? 10),
        lowStockThreshold: Number(product.lowStockThreshold ?? 5),
        rating: Number(product.rating ?? 5),
        reviewCount: Number(product.reviewCount ?? 0),
        images: Array.isArray(product.images) ? product.images : [],
        variants: Array.isArray(product.variants) ? product.variants : [],
        tags: Array.isArray(product.tags) ? product.tags : [],
        attributes: product.attributes || {},
        isOrganic: Boolean(product.isOrganic),
        isMadeInBhutan: Boolean(product.isMadeInBhutan),
        isGmcExclusive: Boolean(product.isGmcExclusive),
        isFeatured: Boolean(product.isFeatured),
        isBestSeller: Boolean(product.isBestSeller),
        isNewArrival: Boolean(product.isNewArrival),
        isFlashDeal: Boolean(product.isFlashDeal),
        isActive: product.isActive !== undefined ? Boolean(product.isActive) : true,
      };

      const { error } = await supabase.from('products').upsert(payload);
      if (error) {
        console.warn('Supabase saveProduct warning:', error.message);
        return false;
      }
      return true;
    } catch (err) {
      console.warn('Supabase saveProduct error:', err);
      return false;
    }
  }

  async deleteProduct(productId: string): Promise<boolean> {
    try {
      const { error } = await supabase.from('products').delete().eq('id', productId);
      if (error) {
        console.warn('Supabase deleteProduct warning:', error.message);
        return false;
      }
      return true;
    } catch (err) {
      console.warn('Supabase deleteProduct error:', err);
      return false;
    }
  }

  async saveCategory(category: Category): Promise<boolean> {
    try {
      const payload = {
        ...category,
        itemCount: Number(category.itemCount || 0),
        order: Number(category.order || 1),
        featured: category.featured !== undefined ? Boolean(category.featured) : true,
        isActive: category.isActive !== undefined ? Boolean(category.isActive) : true,
      };
      const { error } = await supabase.from('categories').upsert(payload);
      if (error) {
        console.warn('Supabase saveCategory warning:', error.message);
        return false;
      }
      return true;
    } catch (err) {
      console.warn('Supabase saveCategory error:', err);
      return false;
    }
  }

  async deleteCategory(categoryId: string): Promise<boolean> {
    try {
      const { error } = await supabase.from('categories').delete().eq('id', categoryId);
      if (error) {
        console.warn('Supabase deleteCategory warning:', error.message);
        return false;
      }
      return true;
    } catch (err) {
      console.warn('Supabase deleteCategory error:', err);
      return false;
    }
  }

  async saveSeller(seller: SellerAccount): Promise<boolean> {
    try {
      // First try complete payload
      const { error } = await supabase.from('sellers').upsert(seller);
      if (!error) return true;

      // If specific custom columns do not exist in the Supabase schema, sanitize to schema columns
      const sanitized = {
        id: seller.id,
        email: seller.email,
        password: seller.password || 'seller123',
        storeId: seller.storeId,
        storeName: seller.storeName,
        ownerName: seller.ownerName || '',
        phone: seller.phone || '',
        location: seller.location || '',
        joinedDate: seller.joinedDate || new Date().toISOString().split('T')[0],
        isVerified: seller.isVerified !== undefined ? seller.isVerified : true,
        status: seller.status || 'approved',
      };
      const retry = await supabase.from('sellers').upsert(sanitized);
      if (retry.error) {
        console.warn('Supabase saveSeller retry error:', retry.error.message);
        return false;
      }
      return true;
    } catch (err) {
      console.warn('Supabase saveSeller error:', err);
      return false;
    }
  }

  async deleteSeller(sellerId: string): Promise<boolean> {
    try {
      const { error } = await supabase.from('sellers').delete().eq('id', sellerId);
      if (error) {
        console.warn('Supabase deleteSeller warning:', error.message);
        return false;
      }
      return true;
    } catch (err) {
      console.warn('Supabase deleteSeller error:', err);
      return false;
    }
  }

  async updateSellerPassword(sellerId: string, newPass: string): Promise<boolean> {
    try {
      const { error } = await supabase.from('sellers').update({ password: newPass }).eq('id', sellerId);
      if (error) {
        console.warn('Supabase updateSellerPassword warning:', error.message);
        return false;
      }
      return true;
    } catch (err) {
      console.warn('Supabase updateSellerPassword error:', err);
      return false;
    }
  }

  async saveOrder(order: Order): Promise<boolean> {
    try {
      const payload = {
        ...order,
        subtotal: Number(order.subtotal),
        deliveryFee: Number(order.deliveryFee || 0),
        discount: Number(order.discount || 0),
        tax: Number(order.tax || 0),
        grandTotal: Number(order.grandTotal),
        items: Array.isArray(order.items) ? order.items : [],
        statusHistory: Array.isArray(order.statusHistory) ? order.statusHistory : [],
      };
      const { error } = await supabase.from('orders').upsert(payload);
      if (error) {
        console.warn('Supabase saveOrder warning:', error.message);
        return false;
      }
      return true;
    } catch (err) {
      console.warn('Supabase saveOrder error:', err);
      return false;
    }
  }
}

export const supabaseService = new SupabaseService();
