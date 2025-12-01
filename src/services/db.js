const DB_NAME = 'AILMS_DB';
const DB_VERSION = 2;

let db = null;

export const initDB = () => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
            db = request.result;
            resolve(db);
        };

        request.onupgradeneeded = (event) => {
            db = event.target.result;

            // Create object stores if they don't exist
            const stores = [
                'users',
                'courses',
                'lessons',
                'progress',
                'quizzes',
                'assignments',
                'forum',
                'certificates',
                'notifications',
                'chatHistory',
                'announcements'
            ];

            stores.forEach((storeName) => {
                if (!db.objectStoreNames.contains(storeName)) {
                    const objectStore = db.createObjectStore(storeName, { keyPath: 'id' });

                    // Create indexes for common queries
                    if (storeName === 'users') {
                        objectStore.createIndex('email', 'email', { unique: true });
                    }
                    if (storeName === 'progress') {
                        objectStore.createIndex('userId', 'userId', { unique: false });
                        objectStore.createIndex('courseId', 'courseId', { unique: false });
                    }
                    if (storeName === 'notifications') {
                        objectStore.createIndex('userId', 'userId', { unique: false });
                    }
                }
            });
        };
    });
};

// Generic CRUD operations
export const dbService = {
    async add(storeName, data) {
        if (!db) await initDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.add(data);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    },

    async get(storeName, id) {
        if (!db) await initDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.get(id);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    },

    async getAll(storeName) {
        if (!db) await initDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.getAll();

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    },

    async getAllByIndex(storeName, indexName, value) {
        if (!db) await initDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            const index = store.index(indexName);
            const request = index.getAll(value);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    },

    async update(storeName, data) {
        if (!db) await initDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.put(data);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    },

    async updatePartial(storeName, id, updates) {
        if (!db) await initDB();
        const existing = await this.get(storeName, id);
        if (!existing) throw new Error('Record not found');

        const updated = { ...existing, ...updates };
        return this.update(storeName, updated);
    },

    async delete(storeName, id) {
        if (!db) await initDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.delete(id);

            request.onsuccess = () => resolve(true);
            request.onerror = () => reject(request.error);
        });
    },

    async clear(storeName) {
        if (!db) await initDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.clear();

            request.onsuccess = () => resolve(true);
            request.onerror = () => reject(request.error);
        });
    },
};

export default dbService;
