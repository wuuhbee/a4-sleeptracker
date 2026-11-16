import { TestBed } from '@angular/core/testing';
import { OvernightSleepData } from '../data/overnight-sleep-data';
import { SleepService } from './sleep.service';
import { StorageService } from './storage.service';

describe('SleepService', () => {
  let service: SleepService;
  let storedRecords: unknown;

  beforeEach(async () => {
    storedRecords = [];
    SleepService.AllSleepData.length = 0;
    SleepService.AllOvernightData.length = 0;
    SleepService.AllSleepinessData.length = 0;
    const storage = {
      get: async () => storedRecords,
      set: async (_key: string, value: unknown) => {
        storedRecords = value;
      }
    };

    TestBed.configureTestingModule({
      providers: [{ provide: StorageService, useValue: storage }]
    });
    service = TestBed.inject(SleepService);
    await service.ready;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('persists newly logged overnight sleep', async () => {
    const loggedSleep = new OvernightSleepData(
      new Date('2026-11-15T22:00:00'),
      new Date('2026-11-16T06:00:00'),
      1
    );

    await service.logOvernightData(loggedSleep);

    expect(storedRecords).toEqual([jasmine.objectContaining({
      type: 'overnight',
      id: loggedSleep.id,
      sleepStart: loggedSleep.getSleepStart().toISOString(),
      sleepEnd: loggedSleep.getSleepEnd().toISOString(),
      wakeCount: 1
    })]);
  });

  it('restores persisted sleep records as data model instances', async () => {
    TestBed.resetTestingModule();
    const savedRecords = [{
      type: 'overnight',
      id: 'saved-sleep',
      loggedAt: '2026-11-16T08:00:00.000Z',
      sleepStart: '2026-11-15T22:00:00.000Z',
      sleepEnd: '2026-11-16T06:00:00.000Z',
      wakeCount: 2
    }];
    const storage = {
      get: async () => savedRecords,
      set: async () => {}
    };
    TestBed.configureTestingModule({
      providers: [{ provide: StorageService, useValue: storage }]
    });

    const restoredService = TestBed.inject(SleepService);
    await restoredService.ready;

    const [restoredSleep] = restoredService.getAllOvernightData();
    expect(restoredSleep).toEqual(jasmine.any(OvernightSleepData));
    expect(restoredSleep.id).toBe('saved-sleep');
    expect(restoredSleep.getSleepStart()).toEqual(new Date('2026-11-15T22:00:00.000Z'));
    expect(restoredSleep.getWakeCount()).toBe(2);
  });
});
