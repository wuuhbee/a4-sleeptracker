import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly storageReady: Promise<Storage>;

  constructor(storage: Storage) {
    this.storageReady = storage.create();
  }

  async set<T>(key: string, value: T): Promise<void> {
    const storage = await this.storageReady;
    await storage.set(key, value);
  }

  async get<T>(key: string): Promise<T | null> {
    const storage = await this.storageReady;
    return storage.get(key);
  }
}
