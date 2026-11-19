import { SleepData } from './sleep-data';

export class OvernightSleepData extends SleepData {
	private sleepStart:Date;
	private sleepEnd:Date;
	private wakeCount:number;

	constructor(sleepStart:Date, sleepEnd:Date, wakeCount?:number) {
		super();
		this.sleepStart = sleepStart;
		this.sleepEnd = sleepEnd;
		this.wakeCount = wakeCount || 0;
	}

	override summaryString():string {
		var difference_ms = this.getSleepDurationMS();		    
		// Convert to hours and minutes
		return Math.floor(difference_ms / (1000*60*60)) + " hours and " + Math.floor(difference_ms / (1000*60) % 60) + " minutes. You woke up " + this.wakeCount + " time(s).";
	}

	getSleepDurationMS():number {
		var sleepStart_ms = this.sleepStart.getTime();
		var sleepEnd_ms = this.sleepEnd.getTime();
		return sleepEnd_ms - sleepStart_ms;
	}

	getWakeCount():number {
		return this.wakeCount;
	}

	getSleepStart():Date {
		return this.sleepStart;
	}

	getSleepEnd():Date {
		return this.sleepEnd;
	}

	override dateString():string {
		return this.sleepStart.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
	}
}
