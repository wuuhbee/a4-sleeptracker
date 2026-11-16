import { TestBed } from '@angular/core/testing';
import { Storage } from '@ionic/storage-angular';

import { StorageService } from './storage.service';

describe('StorageService', () => {
  let service: StorageService;
  const values = new Map<string, unknown>();

  beforeEach(() => {
    values.clear();
    const storage = {
      get: async (key: string) => values.get(key) ?? null,
      set: async (key: string, value: unknown) => {
        values.set(key, value);
      }
    };

    TestBed.configureTestingModule({
      providers: [{
        provide: Storage,
        useValue: { create: async () => storage }
      }]
    });
    service = TestBed.inject(StorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('stores and reads values using the requested key', async () => {
    await service.set('sleep-records', [{ type: 'sleepiness', score: 4 }]);

    await expectAsync(service.get('sleep-records')).toBeResolvedTo([
      { type: 'sleepiness', score: 4 }
    ]);
  });
});
