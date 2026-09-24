import { Store, Product, SellerAccount, Order, Category } from '../types';

const SHEETS_URL_KEY = 'gmc_google_sheets_url_v1';
export const DEFAULT_SHEETS_URL =
  'https://script.google.com/macros/s/AKfycbxs4x0-KHD0GMBL1cH3mO120oIuVneODkDw2_tY3Foan6Z0xTyooAgpitmvUqNDPUHI/exec';

export interface SheetsSyncResult {
  success: boolean;
  message: string;
  data?: any;
}

// Google Sheets cell character limit is strictly 50,000 characters
const MAX_CELL_LENGTH = 45000;

export function isCorruptedOrTruncatedImage(url?: string): boolean {
  if (!url || typeof url !== 'string') return true;
  if (url.includes('[truncated]') || url.includes('...[') || url.includes('truncated:') || url.includes('[Cloud')) {
    return true;
  }
  if (url.startsWith('data:image/') && url.length < 80) return true;
  return false;
}

function sanitizeValueForSheets(val: any): any {
  if (val === undefined || val === null) return '';
  if (typeof val === 'string') {
    if (val.length > MAX_CELL_LENGTH) {
      if (val.startsWith('data:image/')) {
        // Never append [truncated] to image data URLs - a broken data URL will fail to render.
        // Instead store a clean reference flag that image is stored in Firestore
        return '[Cloud Firestore Image]';
      }
      return val.substring(0, MAX_CELL_LENGTH - 60);
    }
    return val;
  }
  if (Array.isArray(val)) {
    // If it's an array of strings (like product images), sanitize each item
    const sanitizedArr = val.map((item) => sanitizeValueForSheets(item));
    const str = JSON.stringify(sanitizedArr);
    if (str.length > MAX_CELL_LENGTH) {
      // If the array string still exceeds 45,000 chars, keep only the first item
      return sanitizedArr.slice(0, 1);
    }
    return sanitizedArr;
  }
  if (typeof val === 'object') {
    const str = JSON.stringify(val);
    if (str.length > MAX_CELL_LENGTH) {
      const sanitizedObj: Record<string, any> = {};
      for (const [k, v] of Object.entries(val)) {
        sanitizedObj[k] = sanitizeValueForSheets(v);
      }
      return sanitizedObj;
    }
    return val;
  }
  return val;
}

function sanitizeRecordForSheets<T extends Record<string, any>>(record: T): T {
  if (!record || typeof record !== 'object') return record;
  const result: any = {};
  for (const [key, value] of Object.entries(record)) {
    result[key] = sanitizeValueForSheets(value);
  }
  return result;
}

function cleanSheetsProduct(p: any): Product {
  const images = Array.isArray(p.images)
    ? p.images.filter((img: any) => typeof img === 'string' && !isCorruptedOrTruncatedImage(img))
    : typeof p.images === 'string' && !isCorruptedOrTruncatedImage(p.images)
    ? [p.images]
    : [];

  return {
    ...p,
    images: images.length > 0 ? images : [],
    price: Number(p.price || 0),
    salePrice: p.salePrice ? Number(p.salePrice) : undefined,
    stock: Number(p.stock ?? 10),
  };
}

function cleanSheetsStore(s: any): Store {
  return {
    ...s,
    logo: isCorruptedOrTruncatedImage(s.logo) ? '' : s.logo,
    coverImage: isCorruptedOrTruncatedImage(s.coverImage) ? '' : s.coverImage,
  };
}

class GoogleSheetsService {
  private getEndpoint(): string {
    const customUrl = localStorage.getItem(SHEETS_URL_KEY);
    if (customUrl && customUrl.trim().length > 0) {
      return customUrl.trim();
    }
    // Fallback to environment variable or active deployed default URL
    return (import.meta as any).env?.VITE_GOOGLE_SHEETS_URL || DEFAULT_SHEETS_URL;
  }

  isConfigured(): boolean {
    const url = this.getEndpoint();
    return Boolean(url && url.startsWith('https://script.google.com/macros/s/'));
  }

  getSavedUrl(): string {
    return localStorage.getItem(SHEETS_URL_KEY) || (import.meta as any).env?.VITE_GOOGLE_SHEETS_URL || DEFAULT_SHEETS_URL;
  }

  setSavedUrl(url: string): void {
    if (!url || !url.trim()) {
      localStorage.removeItem(SHEETS_URL_KEY);
    } else {
      localStorage.setItem(SHEETS_URL_KEY, url.trim());
    }
  }

  // Test communication with Google Apps Script Web App
  async testConnection(testUrl?: string): Promise<SheetsSyncResult> {
    const endpoint = testUrl || this.getEndpoint();
    if (!endpoint || !endpoint.startsWith('https://script.google.com/macros/s/')) {
      return {
        success: false,
        message: 'Invalid Google Apps Script Web App URL. It must begin with https://script.google.com/macros/s/.../exec',
      };
    }

    try {
      const target = endpoint.includes('?') ? `${endpoint}&action=ping` : `${endpoint}?action=ping`;
      const res = await fetch(target, { method: 'GET', redirect: 'follow' });
      const text = await res.text();

      let data: any = null;
      try {
        data = JSON.parse(text);
      } catch (jsonErr) {
        if (text.trim().startsWith('<') || text.includes('<!DOCTYPE')) {
          if (text.includes('accounts.google.com') || text.includes('ServiceLogin') || text.includes('Sign in')) {
            return {
              success: false,
              message:
                'Access Denied by Google: Your Apps Script Web App is set to "Only myself". In Apps Script, click Deploy > Manage deployments > Edit > set "Who has access" to "Anyone" and create a New Version.',
            };
          }
          if (text.includes('Sorry, unable to open the file') || text.includes('Page not found')) {
            return {
              success: false,
              message:
                'Google Drive Session Conflict: Multiple Google accounts are active in this browser, or "Who has access" is not set to "Anyone". Try opening in an Incognito window or re-deploying with "Anyone".',
            };
          }
          return {
            success: false,
            message:
              'Google Apps Script returned an HTML page. Ensure your Web App is deployed with "Execute as: Me" and "Who has access: Anyone".',
          };
        }
        return { success: false, message: 'Invalid response format from Google Apps Script.' };
      }

      if (data && (data.status === 'success' || data.success)) {
        return {
          success: true,
          message: data.message || 'Connected to Google Sheet successfully!',
          data,
        };
      }
      return { success: false, message: data?.message || 'Script responded with an error.' };
    } catch (err: any) {
      return {
        success: false,
        message: `Connection failed: ${err.message || 'Check deployment access permissions (Must be set to "Anyone").'}`,
      };
    }
  }

  // Fetch all collections from Google Sheet in one call
  async fetchAll(): Promise<{
    stores?: Store[];
    products?: Product[];
    sellers?: SellerAccount[];
    orders?: Order[];
    categories?: Category[];
  }> {
    if (!this.isConfigured()) return {};

    try {
      const endpoint = this.getEndpoint();
      const target = endpoint.includes('?') ? `${endpoint}&action=getAll` : `${endpoint}?action=getAll`;
      const res = await fetch(target, { method: 'GET', redirect: 'follow' });
      if (!res.ok) return {};

      const text = await res.text();
      let json: any = null;
      try {
        json = JSON.parse(text);
      } catch (e) {
        console.warn('Google Sheets fetchAll received non-JSON (likely HTML auth page):', text.slice(0, 100));
        return {};
      }

      if (json && (json.status === 'success' || json.success)) {
        const raw = json.data || json;
        return {
          stores: (raw.stores || []).map(cleanSheetsStore),
          products: (raw.products || []).map(cleanSheetsProduct),
          sellers: raw.sellers || [],
          orders: raw.orders || [],
          categories: raw.categories || [],
        };
      }
      return {};
    } catch (err) {
      console.warn('Google Sheets fetchAll warning:', err);
      return {};
    }
  }

  // Send an action to the Google Apps Script Web App
  private async postAction(action: string, payload: any): Promise<boolean> {
    if (!this.isConfigured()) return false;

    try {
      const endpoint = this.getEndpoint();
      const sanitizedPayload = sanitizeRecordForSheets(payload);
      // Package payload both at top-level and in nested .payload for broad script compatibility
      const body = {
        action,
        ...sanitizedPayload,
        payload: sanitizedPayload,
      };

      // Using text/plain prevents CORS preflight OPTIONS rejection in Google Apps Script
      await fetch(endpoint, {
        method: 'POST',
        redirect: 'follow',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(body),
      });
      return true;
    } catch (err) {
      console.warn(`Google Sheets postAction "${action}" error:`, err);
      return false;
    }
  }

  async saveStore(store: Store): Promise<boolean> {
    return this.postAction('saveStore', { store, id: store.id });
  }

  async deleteStore(storeId: string): Promise<boolean> {
    return this.postAction('deleteStore', { storeId, id: storeId });
  }

  async saveSeller(seller: SellerAccount): Promise<boolean> {
    return this.postAction('saveSeller', { seller, id: seller.id });
  }

  async deleteSeller(sellerId: string): Promise<boolean> {
    return this.postAction('deleteSeller', { sellerId, id: sellerId });
  }

  async saveProduct(product: Product): Promise<boolean> {
    return this.postAction('saveProduct', { product, id: product.id });
  }

  async deleteProduct(productId: string): Promise<boolean> {
    return this.postAction('deleteProduct', { productId, id: productId });
  }

  async saveCategory(category: Category): Promise<boolean> {
    return this.postAction('saveCategory', { category, id: category.id });
  }

  async deleteCategory(categoryId: string): Promise<boolean> {
    return this.postAction('deleteCategory', { categoryId, id: categoryId });
  }

  async saveOrder(order: Order): Promise<boolean> {
    return this.postAction('saveOrder', { order, id: order.id });
  }

  // Sync entire current database (stores, products, sellers, categories) to Google Sheet
  async syncAllToSheet(data: {
    stores: Store[];
    products: Product[];
    sellers: SellerAccount[];
    categories: Category[];
  }): Promise<SheetsSyncResult> {
    if (!this.isConfigured()) {
      return { success: false, message: 'Google Sheets Web App URL is not configured.' };
    }

    try {
      const endpoint = this.getEndpoint();
      const sanitizedStores = data.stores.map(sanitizeRecordForSheets);
      const sanitizedProducts = data.products.map(sanitizeRecordForSheets);
      const sanitizedSellers = data.sellers.map(sanitizeRecordForSheets);
      const sanitizedCategories = data.categories.map(sanitizeRecordForSheets);

      const body = {
        action: 'syncAll',
        stores: sanitizedStores,
        products: sanitizedProducts,
        sellers: sanitizedSellers,
        categories: sanitizedCategories,
        payload: {
          stores: sanitizedStores,
          products: sanitizedProducts,
          sellers: sanitizedSellers,
          categories: sanitizedCategories,
        },
      };

      const res = await fetch(endpoint, {
        method: 'POST',
        redirect: 'follow',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(body),
      });

      const text = await res.text();
      let resData: any = null;
      try {
        resData = JSON.parse(text);
      } catch (jsonErr) {
        if (text.trim().startsWith('<') || text.includes('<!DOCTYPE')) {
          if (text.includes('accounts.google.com') || text.includes('ServiceLogin') || text.includes('Sign in')) {
            return {
              success: false,
              message:
                'Access Denied by Google: Your Apps Script Web App was deployed without public access. In Apps Script, click Deploy > Manage deployments > Edit > set "Who has access" to "Anyone" and create a New Version.',
            };
          }
          if (text.includes('Sorry, unable to open the file') || text.includes('Page not found')) {
            return {
              success: false,
              message:
                'Google Drive Access Conflict: Multiple Google accounts are active in this browser, or "Who has access" is not set to "Anyone". Try opening in an Incognito window or re-deploying with "Anyone".',
            };
          }
          return {
            success: false,
            message:
              'Google Apps Script returned an HTML page. Ensure your Web App is deployed with "Execute as: Me" and "Who has access: Anyone".',
          };
        }
      }

      if (resData && (resData.status === 'success' || resData.success)) {
        return {
          success: true,
          message: resData.message || 'All stores, products, sellers, and categories synced to Google Sheets!',
        };
      }
      return { success: false, message: resData?.message || 'Sheet sync failed.' };
    } catch (err: any) {
      return { success: false, message: `Sync error: ${err.message || 'Unknown network error'}` };
    }
  }
}

export const googleSheetsService = new GoogleSheetsService();
