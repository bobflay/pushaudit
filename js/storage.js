/* ============================================
   PushAudit - Storage Module
   IndexedDB wrapper for data persistence
   ============================================ */

const Storage = {
  dbName: 'PushAuditDB',
  version: 1,
  db: null,

  // Initialize database
  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => {
        console.error('Failed to open database:', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        console.log('Database opened successfully');
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        console.log('Upgrading database schema...');
        this.createStores(db);
      };
    });
  },

  // Create object stores
  createStores(db) {
    // Audits - main records
    if (!db.objectStoreNames.contains('audits')) {
      const audits = db.createObjectStore('audits', { keyPath: 'id' });
      audits.createIndex('status', 'status', { unique: false });
      audits.createIndex('department', 'department', { unique: false });
      audits.createIndex('createdAt', 'createdAt', { unique: false });
    }

    // Tasks - Section 2 timeline
    if (!db.objectStoreNames.contains('tasks')) {
      const tasks = db.createObjectStore('tasks', { keyPath: 'id' });
      tasks.createIndex('auditId', 'auditId', { unique: false });
    }

    // Processes - Section 3 mappings
    if (!db.objectStoreNames.contains('processes')) {
      const processes = db.createObjectStore('processes', { keyPath: 'id' });
      processes.createIndex('auditId', 'auditId', { unique: false });
    }

    // Use Cases - Section 8
    if (!db.objectStoreNames.contains('useCases')) {
      const useCases = db.createObjectStore('useCases', { keyPath: 'id' });
      useCases.createIndex('auditId', 'auditId', { unique: false });
    }

    // Opportunities - Section 9
    if (!db.objectStoreNames.contains('opportunities')) {
      const opportunities = db.createObjectStore('opportunities', { keyPath: 'id' });
      opportunities.createIndex('auditId', 'auditId', { unique: false });
    }
  },

  // Save (insert or update)
  async save(storeName, data) {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const request = store.put(data);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },

  // Get by ID
  async get(storeName, id) {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },

  // Get all records
  async getAll(storeName) {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },

  // Get by index
  async getByIndex(storeName, indexName, value) {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const index = store.index(indexName);
      const request = index.getAll(value);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },

  // Delete by ID
  async delete(storeName, id) {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  },

  // Delete multiple by index
  async deleteByIndex(storeName, indexName, value) {
    const items = await this.getByIndex(storeName, indexName, value);
    for (const item of items) {
      await this.delete(storeName, item.id);
    }
  },

  // Count records
  async count(storeName) {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const request = store.count();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },

  // Clear all data from a store
  async clear(storeName) {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  },

  // Clear all stores
  async clearAll() {
    const stores = ['audits', 'tasks', 'processes', 'useCases', 'opportunities'];
    for (const store of stores) {
      await this.clear(store);
    }
  }
};
