import { getApiUrl } from '../config/apiConfig';
/**
 * Client-Side IndexedDB Offline Queue Manager for CardioSentinel ASHA Field Screening (Addendum 2 §B.1 & Addendum 3 Fix 3).
 * Ensures idempotent syncing via client-generated UUIDs and automatic flushing when online.
 */

const DB_NAME = 'CardioSentinelOfflineDB';
const DB_VERSION = 1;
const STORE_NAME = 'screening_queue';

export function openOfflineDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'client_uuid' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function queueOfflineScreening(record) {
  const db = await openOfflineDB();
  const client_uuid = record.client_uuid || (self.crypto?.randomUUID ? self.crypto.randomUUID() : 'client-' + Date.now() + '-' + Math.random().toString(36).substring(2, 8));
  
  const payload = {
    ...record,
    client_uuid,
    queued_at: new Date().toISOString()
  };

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.put(payload);
    req.onsuccess = () => resolve(payload);
    req.onerror = () => reject(req.error);
  });
}

export async function getPendingOfflineCount() {
  try {
    const db = await openOfflineDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.count();
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(0);
    });
  } catch (e) {
    return 0;
  }
}

export async function flushOfflineQueue() {
  try {
    const db = await openOfflineDB();
    const records = await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });

    if (records.length === 0) return { synced: 0, conflicts: 0 };

    const res = await fetch(getApiUrl('/api/triage/sync-offline'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: records })
    });

    if (res.ok) {
      // Clear flushed items from IndexedDB
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.clear();
      return await res.json();
    }
    return { synced: 0, conflicts: 0 };
  } catch (e) {
    console.error('Failed to flush offline queue:', e);
    return { synced: 0, conflicts: 0 };
  }
}
