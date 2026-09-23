import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  getDocs,
  writeBatch,
  Unsubscribe
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { Product, Store, Category, SellerAccount, Order } from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_STORES,
  INITIAL_CATEGORIES
} from '../data/mockData';
import { DEFAULT_SELLERS } from './storageService';

// Utility to clean undefined values before sending to Firestore
function cleanForFirestore<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

class FirestoreService {
  private isInitialized = false;

  // Check if collections are empty, and if so seed them to Firestore
  async initializeAndSeed(forceCheck = false) {
    if (this.isInitialized && !forceCheck) return;
    this.isInitialized = true;

    try {
      // 1. Check Categories
      const catSnap = await getDocs(collection(db, 'categories'));
      if (catSnap.empty) {
        console.log('Seeding initial categories to Firestore...');
        const batch = writeBatch(db);
        INITIAL_CATEGORIES.forEach((cat) => {
          batch.set(doc(db, 'categories', cat.id), cleanForFirestore(cat));
        });
        await batch.commit();
      }

      // 2. Check Stores
      const storeSnap = await getDocs(collection(db, 'stores'));
      if (storeSnap.empty) {
        console.log('Seeding initial stores to Firestore...');
        const batch = writeBatch(db);
        INITIAL_STORES.forEach((store) => {
          batch.set(doc(db, 'stores', store.id), cleanForFirestore(store));
        });
        await batch.commit();
      }

      // 3. Check Sellers
      const sellerSnap = await getDocs(collection(db, 'sellers'));
      if (sellerSnap.empty) {
        console.log('Seeding initial sellers to Firestore...');
        const batch = writeBatch(db);
        DEFAULT_SELLERS.forEach((seller) => {
          batch.set(doc(db, 'sellers', seller.id), cleanForFirestore(seller));
        });
        await batch.commit();
      }

      // 4. Check Products
      const prodSnap = await getDocs(collection(db, 'products'));
      if (prodSnap.empty) {
        console.log('Seeding initial products to Firestore...');
        const batch = writeBatch(db);
        INITIAL_PRODUCTS.forEach((prod) => {
          batch.set(doc(db, 'products', prod.id), cleanForFirestore(prod));
        });
        await batch.commit();
      }
    } catch (err) {
      console.warn('Firestore initial seeding note:', err);
    }
  }

  // Synchronize any locally created stores, sellers, or products to Firestore
  async syncLocalDataToFirestore(
    localStores: Store[],
    localSellers: SellerAccount[],
    localProducts: Product[]
  ) {
    try {
      const storeSnap = await getDocs(collection(db, 'stores'));
      const existingStoreIds = new Set(storeSnap.docs.map((d) => d.id));
      for (const store of localStores) {
        if (!existingStoreIds.has(store.id)) {
          try {
            console.log(`Syncing store "${store.name}" (${store.id}) to cloud Firestore...`);
            await this.saveStore(store);
          } catch (e) {
            console.warn(`Error syncing store ${store.id}:`, e);
          }
        }
      }

      const sellerSnap = await getDocs(collection(db, 'sellers'));
      const existingSellerIds = new Set(sellerSnap.docs.map((d) => d.id));
      for (const seller of localSellers) {
        if (!existingSellerIds.has(seller.id)) {
          try {
            console.log(`Syncing seller account "${seller.storeName}" (${seller.id}) to cloud Firestore...`);
            await this.saveSeller(seller);
          } catch (e) {
            console.warn(`Error syncing seller ${seller.id}:`, e);
          }
        }
      }

      const prodSnap = await getDocs(collection(db, 'products'));
      const existingProdIds = new Set(prodSnap.docs.map((d) => d.id));
      for (const prod of localProducts) {
        if (!existingProdIds.has(prod.id)) {
          try {
            console.log(`Syncing product "${prod.name}" (${prod.id}) to cloud Firestore...`);
            await this.saveProduct(prod);
          } catch (e) {
            console.warn(`Error syncing product ${prod.id}:`, e);
          }
        }
      }
    } catch (err) {
      console.warn('Error during local to Firestore sync:', err);
    }
  }

  // --- Active Fetches (Fast immediate hydration on page load) ---

  async fetchStores(): Promise<Store[]> {
    try {
      const snap = await getDocs(collection(db, 'stores'));
      const stores: Store[] = [];
      snap.forEach((d) => stores.push({ id: d.id, ...d.data() } as Store));
      return stores;
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, 'stores', false);
      return [];
    }
  }

  async fetchProducts(): Promise<Product[]> {
    try {
      const snap = await getDocs(collection(db, 'products'));
      const products: Product[] = [];
      snap.forEach((d) => products.push({ id: d.id, ...d.data() } as Product));
      return products;
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, 'products', false);
      return [];
    }
  }

  async fetchCategories(): Promise<Category[]> {
    try {
      const snap = await getDocs(collection(db, 'categories'));
      const categories: Category[] = [];
      snap.forEach((d) => categories.push({ id: d.id, ...d.data() } as Category));
      return categories;
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, 'categories', false);
      return [];
    }
  }

  async fetchSellers(): Promise<SellerAccount[]> {
    try {
      const snap = await getDocs(collection(db, 'sellers'));
      const sellers: SellerAccount[] = [];
      snap.forEach((d) => sellers.push({ id: d.id, ...d.data() } as SellerAccount));
      return sellers;
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, 'sellers', false);
      return [];
    }
  }

  async fetchOrders(): Promise<Order[]> {
    try {
      const snap = await getDocs(collection(db, 'orders'));
      const orders: Order[] = [];
      snap.forEach((d) => orders.push({ id: d.id, ...d.data() } as Order));
      return orders;
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, 'orders', false);
      return [];
    }
  }

  // --- Real-time Subscriptions ---

  subscribeStores(callback: (stores: Store[]) => void): Unsubscribe {
    const colRef = collection(db, 'stores');
    return onSnapshot(
      colRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const stores: Store[] = [];
          snapshot.forEach((d) => stores.push({ id: d.id, ...d.data() } as Store));
          callback(stores);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'stores', false);
      }
    );
  }

  subscribeProducts(callback: (products: Product[]) => void): Unsubscribe {
    const colRef = collection(db, 'products');
    return onSnapshot(
      colRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const products: Product[] = [];
          snapshot.forEach((d) => products.push({ id: d.id, ...d.data() } as Product));
          callback(products);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'products', false);
      }
    );
  }

  subscribeCategories(callback: (categories: Category[]) => void): Unsubscribe {
    const colRef = collection(db, 'categories');
    return onSnapshot(
      colRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const categories: Category[] = [];
          snapshot.forEach((d) => categories.push({ id: d.id, ...d.data() } as Category));
          callback(categories);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'categories', false);
      }
    );
  }

  subscribeSellers(callback: (sellers: SellerAccount[]) => void): Unsubscribe {
    const colRef = collection(db, 'sellers');
    return onSnapshot(
      colRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const sellers: SellerAccount[] = [];
          snapshot.forEach((d) => sellers.push({ id: d.id, ...d.data() } as SellerAccount));
          callback(sellers);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'sellers', false);
      }
    );
  }

  subscribeOrders(callback: (orders: Order[]) => void): Unsubscribe {
    const colRef = collection(db, 'orders');
    return onSnapshot(
      colRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const orders: Order[] = [];
          snapshot.forEach((d) => orders.push({ id: d.id, ...d.data() } as Order));
          callback(orders);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'orders', false);
      }
    );
  }

  // --- Real-time Writes to Firestore ---

  async saveStore(store: Store): Promise<void> {
    const path = `stores/${store.id}`;
    try {
      await setDoc(doc(db, 'stores', store.id), cleanForFirestore(store), { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path, false);
    }
  }

  async deleteStore(storeId: string): Promise<void> {
    const path = `stores/${storeId}`;
    try {
      await deleteDoc(doc(db, 'stores', storeId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path, false);
    }
  }

  async saveProduct(product: Product): Promise<void> {
    const path = `products/${product.id}`;
    try {
      await setDoc(doc(db, 'products', product.id), cleanForFirestore(product), { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path, false);
    }
  }

  async deleteProduct(productId: string): Promise<void> {
    const path = `products/${productId}`;
    try {
      await deleteDoc(doc(db, 'products', productId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path, false);
    }
  }

  async saveCategory(category: Category): Promise<void> {
    const path = `categories/${category.id}`;
    try {
      await setDoc(doc(db, 'categories', category.id), cleanForFirestore(category), { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path, false);
    }
  }

  async deleteCategory(categoryId: string): Promise<void> {
    const path = `categories/${categoryId}`;
    try {
      await deleteDoc(doc(db, 'categories', categoryId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path, false);
    }
  }

  async saveSeller(seller: SellerAccount): Promise<void> {
    const path = `sellers/${seller.id}`;
    try {
      await setDoc(doc(db, 'sellers', seller.id), cleanForFirestore(seller), { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path, false);
    }
  }

  async deleteSeller(sellerId: string): Promise<void> {
    const path = `sellers/${sellerId}`;
    try {
      await deleteDoc(doc(db, 'sellers', sellerId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path, false);
    }
  }

  async saveOrder(order: Order): Promise<void> {
    const path = `orders/${order.id}`;
    try {
      await setDoc(doc(db, 'orders', order.id), cleanForFirestore(order), { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path, false);
    }
  }
}

export const firestoreService = new FirestoreService();
