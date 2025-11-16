import { storage } from './localStorage';

interface LocalDBData<T> {
  items: T[];
  lastSync: string;
}

export const localDB = {
  getAll<T>(key: string): T[] {
    console.log(`[LocalDB] 📂 Reading from key: ${key}`);
    
    const data = storage.get<LocalDBData<T>>(key);
    
    if (!data || !Array.isArray(data.items)) {
      console.log(`[LocalDB] ⚠️ No data found for key: ${key}`);
      return [];
    }
    
    console.log(`[LocalDB] ✅ Found ${data.items.length} items (last sync: ${data.lastSync})`);
    return data.items;
  },

  setItems<T>(key: string, items: T[]): void {
    console.log(`[LocalDB] 💾 Saving ${items.length} items to key: ${key}`);
    
    const data: LocalDBData<T> = {
      items,
      lastSync: new Date().toISOString(),
    };
    
    storage.set(key, data);
    console.log(`[LocalDB] ✅ Saved successfully`);
  },

  insert<T extends { $id?: string; id?: string }>(key: string, item: T): void {
    console.log(`[LocalDB] ➕ Inserting item into key: ${key}`);
    
    const items = this.getAll<T>(key);
    const itemId = item.$id || item.id;
    
    if (!itemId) {
      console.warn(`[LocalDB] ⚠️ Item has no ID, cannot insert`);
      return;
    }
    
    const existingIndex = items.findIndex(
      (i) => (i.$id || i.id) === itemId
    );
    
    if (existingIndex !== -1) {
      console.log(`[LocalDB] 🔄 Item exists, updating instead`);
      items[existingIndex] = item;
    } else {
      items.unshift(item);
    }
    
    this.setItems(key, items);
    console.log(`[LocalDB] ✅ Insert complete`);
  },

  update<T extends { $id?: string; id?: string }>(
    key: string,
    item: T
  ): void {
    console.log(`[LocalDB] 🔄 Updating item in key: ${key}`);
    
    const items = this.getAll<T>(key);
    const itemId = item.$id || item.id;
    
    if (!itemId) {
      console.warn(`[LocalDB] ⚠️ Item has no ID, cannot update`);
      return;
    }
    
    const index = items.findIndex((i) => (i.$id || i.id) === itemId);
    
    if (index === -1) {
      console.log(`[LocalDB] ⚠️ Item not found, inserting instead`);
      this.insert(key, item);
      return;
    }
    
    items[index] = item;
    this.setItems(key, items);
    console.log(`[LocalDB] ✅ Update complete`);
  },

  remove<T extends { $id?: string; id?: string }>(key: string, id: string): void {
    console.log(`[LocalDB] 🗑️ Removing item from key: ${key}`);
    
    const items = this.getAll<T>(key);
    const filtered = items.filter(
      (item) => item.$id !== id && item.id !== id
    );
    
    if (filtered.length === items.length) {
      console.log(`[LocalDB] ⚠️ Item not found, nothing removed`);
      return;
    }
    
    this.setItems(key, filtered);
    console.log(`[LocalDB] ✅ Remove complete`);
  },

  deduplicateById<T extends { $id?: string; id?: string }>(items: T[]): T[] {
    console.log(`[LocalDB] 🔍 Deduplicating ${items.length} items`);
    
    const map = new Map<string, T>();
    
    items.forEach((item) => {
      const id = item.$id || item.id;
      if (id) {
        map.set(id, item);
      }
    });
    
    const unique = Array.from(map.values());
    console.log(`[LocalDB] ✨ After deduplication: ${unique.length} unique items`);
    
    return unique;
  },

  mergeAndDeduplicate<T extends { $id?: string; id?: string }>(
    localItems: T[],
    remoteItems: T[]
  ): T[] {
    console.log(
      `[LocalDB] 🔄 Merging ${localItems.length} local + ${remoteItems.length} remote items`
    );
    
    const remoteMap = new Map<string, T>();
    remoteItems.forEach((item) => {
      const id = item.$id || item.id;
      if (id) {
        remoteMap.set(id, item);
      }
    });
    
    const localMap = new Map<string, T>();
    localItems.forEach((item) => {
      const id = item.$id || item.id;
      if (id && !remoteMap.has(id)) {
        localMap.set(id, item);
      }
    });
    
    const merged = [...Array.from(remoteMap.values()), ...Array.from(localMap.values())];
    
    console.log(`[LocalDB] ✅ Merged to ${merged.length} unique items`);
    return merged;
  },

  clear(key: string): void {
    console.log(`[LocalDB] 🗑️ Clearing all data for key: ${key}`);
    storage.remove(key);
    console.log(`[LocalDB] ✅ Clear complete`);
  },

  getLastSync(key: string): string | null {
    const data = storage.get<LocalDBData<unknown>>(key);
    return data?.lastSync || null;
  },
};
