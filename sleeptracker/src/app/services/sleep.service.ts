import { Injectable } from '@angular/core';
import { SleepData } from '../data/sleep-data';
import { OvernightSleepData } from '../data/overnight-sleep-data';
import { StanfordSleepinessData } from '../data/stanford-sleepiness-data';
import { StorageService } from './storage.service';

const STORAGE_KEY = 'sleep-records';

type StoredSleepRecord =
	| {
		type: 'overnight';
		id: string;
		loggedAt: string;
		sleepStart: string;
		sleepEnd: string;
		wakeCount: number;
	}
	| {
		type: 'sleepiness';
		id: string;
		loggedAt: string;
		score: number;
	};

@Injectable({
	providedIn: 'root'
})
export class SleepService {
	public static AllSleepData: SleepData[] = [];
	public static AllOvernightData: OvernightSleepData[] = [];
	public static AllSleepinessData: StanfordSleepinessData[] = [];

	readonly ready: Promise<void>;

	constructor(private readonly storageService: StorageService) {
		this.ready = this.loadData();
	}

	private async loadData(): Promise<void> {
		const storedRecords = await this.storageService.get<StoredSleepRecord[]>(STORAGE_KEY);
		this.clearData();

		if (storedRecords === null) {
			this.addDefaultData();
			await this.persistData();
			return;
		}

		for (const record of storedRecords) {
			this.addToMemory(this.restoreRecord(record));
		}
	}

	private restoreRecord(record: StoredSleepRecord): SleepData {
		let data: SleepData;
		if (record.type === 'overnight') {
			data = new OvernightSleepData(
				new Date(record.sleepStart),
				new Date(record.sleepEnd),
				record.wakeCount
			);
		} else {
			data = new StanfordSleepinessData(record.score, new Date(record.loggedAt));
		}

		data.id = record.id;
		data.loggedAt = new Date(record.loggedAt);
		return data;
	}

	private clearData(): void {
		SleepService.AllSleepData.length = 0;
		SleepService.AllOvernightData.length = 0;
		SleepService.AllSleepinessData.length = 0;
	}

	private addToMemory(data: SleepData): void {
		SleepService.AllSleepData.push(data);
		if (data instanceof OvernightSleepData) {
			SleepService.AllOvernightData.push(data);
		} else if (data instanceof StanfordSleepinessData) {
			SleepService.AllSleepinessData.push(data);
		}
	}

	private serializeData(): StoredSleepRecord[] {
		return SleepService.AllSleepData.map((data): StoredSleepRecord => {
			if (data instanceof OvernightSleepData) {
				return {
					type: 'overnight',
					id: data.id,
					loggedAt: data.loggedAt.toISOString(),
					sleepStart: data.getSleepStart().toISOString(),
					sleepEnd: data.getSleepEnd().toISOString(),
					wakeCount: data.getWakeCount()
				};
			}

			if (data instanceof StanfordSleepinessData) {
				return {
					type: 'sleepiness',
					id: data.id,
					loggedAt: data.loggedAt.toISOString(),
					score: data.getSleepinessScore()
				};
			}

			throw new Error('Cannot persist unknown sleep data type.');
		});
	}

	private async persistData(): Promise<void> {
		await this.storageService.set(STORAGE_KEY, this.serializeData());
	}

	private addDefaultData(): void {
		const goToBed = new Date();
		goToBed.setDate(goToBed.getDate() - 1);
		goToBed.setHours(1, 3, 0);
		const wakeUp = new Date(goToBed.getTime() + 8 * 60 * 60 * 1000);
		this.addToMemory(new OvernightSleepData(goToBed, wakeUp));

		const sleepinessDate = new Date();
		sleepinessDate.setDate(sleepinessDate.getDate() - 1);
		sleepinessDate.setHours(14, 38, 0);
		this.addToMemory(new StanfordSleepinessData(4, sleepinessDate));

		const secondSleepStart = new Date();
		secondSleepStart.setDate(secondSleepStart.getDate() - 1);
		secondSleepStart.setHours(23, 11, 0);
		const secondWakeUp = new Date(secondSleepStart.getTime() + 9 * 60 * 60 * 1000);
		this.addToMemory(new OvernightSleepData(secondSleepStart, secondWakeUp));
	}

	public async logOvernightData(sleepData: OvernightSleepData): Promise<void> {
		await this.ready;
		this.addToMemory(sleepData);
		await this.persistData();
	}

	public async logSleepinessData(sleepData: StanfordSleepinessData): Promise<void> {
		await this.ready;
		this.addToMemory(sleepData);
		await this.persistData();
	}

	public getAllSleepData(): SleepData[] {
		return SleepService.AllSleepData;
	}

	public getAllOvernightData(): OvernightSleepData[] {
		return SleepService.AllOvernightData;
	}

	public getAllSleepinessData(): StanfordSleepinessData[] {
		return SleepService.AllSleepinessData;
	}

	public async removeLog(data: SleepData): Promise<void> {
		await this.ready;
		const index = SleepService.AllSleepData.findIndex(log => log.id === data.id);
		if (index === -1) {
			return;
		}

		SleepService.AllSleepData.splice(index, 1);
		if (data instanceof OvernightSleepData) {
			const overnightIndex = SleepService.AllOvernightData.findIndex(log => log.id === data.id);
			if (overnightIndex !== -1) {
				SleepService.AllOvernightData.splice(overnightIndex, 1);
			}
		} else if (data instanceof StanfordSleepinessData) {
			const sleepinessIndex = SleepService.AllSleepinessData.findIndex(log => log.id === data.id);
			if (sleepinessIndex !== -1) {
				SleepService.AllSleepinessData.splice(sleepinessIndex, 1);
			}
		}

		await this.persistData();
	}
}
