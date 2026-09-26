import { Material } from '../types';

const DB_NAME = 'EquiLearn_OfflineDB';
const DB_VERSION = 1;
const STORE_NAME = 'materials_cache';

/**
 * Open or upgrade the IndexedDB instance for EquiLearn offline material storage
 */
export function openOfflineDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB is not supported in this environment'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('category', 'category', { unique: false });
        store.createIndex('type', 'type', { unique: false });
        store.createIndex('dateAdded', 'dateAdded', { unique: false });
        store.createIndex('isOfflineAvailable', 'isOfflineAvailable', { unique: false });
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error || new Error('Failed to open IndexedDB'));
    };
  });
}

/**
 * Compute approximate size of material data in bytes
 */
export function calculateMaterialSize(material: Material): number {
  try {
    const serialized = JSON.stringify(material);
    return new Blob([serialized]).size;
  } catch {
    return 1024;
  }
}

export function formatByteSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/**
 * Save single material to IndexedDB offline cache
 */
export async function saveMaterialToOfflineCache(material: Material): Promise<void> {
  const bytes = calculateMaterialSize(material);
  const enrichedMaterial: Material = {
    ...material,
    isOfflineAvailable: true,
    cachedAt: material.cachedAt || new Date().toISOString(),
    offlineSize: formatByteSize(bytes)
  };

  try {
    const db = await openOfflineDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(enrichedMaterial);

      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    // Fallback to localStorage if IndexedDB fails
    try {
      const existing = JSON.parse(localStorage.getItem('equilearn_offline_cache') || '{}');
      existing[material.id] = enrichedMaterial;
      localStorage.setItem('equilearn_offline_cache', JSON.stringify(existing));
    } catch (e) {
      console.warn('Fallback offline storage also failed', e);
    }
  }
}

/**
 * Save multiple materials to offline cache (e.g. on initial seed or batch convert)
 */
export async function saveBatchMaterialsToOfflineCache(materials: Material[]): Promise<void> {
  try {
    const db = await openOfflineDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);

      materials.forEach((mat) => {
        const bytes = calculateMaterialSize(mat);
        const enriched: Material = {
          ...mat,
          isOfflineAvailable: true,
          cachedAt: mat.cachedAt || new Date().toISOString(),
          offlineSize: formatByteSize(bytes)
        };
        store.put(enriched);
      });

      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    try {
      const existing = JSON.parse(localStorage.getItem('equilearn_offline_cache') || '{}');
      materials.forEach((m) => {
        existing[m.id] = { ...m, isOfflineAvailable: true, cachedAt: new Date().toISOString() };
      });
      localStorage.setItem('equilearn_offline_cache', JSON.stringify(existing));
    } catch (e) {
      console.warn('Batch storage fallback failed', e);
    }
  }
}

/**
 * Load all materials currently cached in IndexedDB
 */
export async function getAllCachedMaterialsFromOffline(): Promise<Material[]> {
  try {
    const db = await openOfflineDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();

      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    try {
      const existing = JSON.parse(localStorage.getItem('equilearn_offline_cache') || '{}');
      return Object.values(existing);
    } catch {
      return [];
    }
  }
}

/**
 * Remove a specific material from offline cache
 */
export async function removeMaterialFromOfflineCache(id: string): Promise<void> {
  try {
    const db = await openOfflineDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(id);

      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    try {
      const existing = JSON.parse(localStorage.getItem('equilearn_offline_cache') || '{}');
      delete existing[id];
      localStorage.setItem('equilearn_offline_cache', JSON.stringify(existing));
    } catch (e) {
      console.warn(e);
    }
  }
}

/**
 * Clear the entire offline cache
 */
export async function clearAllOfflineCache(): Promise<void> {
  try {
    const db = await openOfflineDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.clear();

      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    try {
      localStorage.removeItem('equilearn_offline_cache');
    } catch (e) {
      console.warn(e);
    }
  }
}

/**
 * Get stats: total cached items and total storage used
 */
export async function getOfflineCacheStats(): Promise<{ count: number; totalBytes: number; formattedSize: string }> {
  const materials = await getAllCachedMaterialsFromOffline();
  let totalBytes = 0;
  for (const m of materials) {
    totalBytes += calculateMaterialSize(m);
  }
  return {
    count: materials.length,
    totalBytes,
    formattedSize: formatByteSize(totalBytes)
  };
}
