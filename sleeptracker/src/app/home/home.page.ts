import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonIcon, IonTabs, IonTabBar, IonTabButton, IonButton, ActionSheetController, ModalController, IonLabel, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonThumbnail, IonFooter , IonFab, IonFabButton, IonFabList} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { moon, home, addCircle, personCircle, bedOutline, moonOutline, close } from 'ionicons/icons';
import { SleepService } from '../services/sleep.service';
import { SleepData } from '../data/sleep-data';
import { OvernightSleepData } from '../data/overnight-sleep-data';
import { StanfordSleepinessData } from '../data/stanford-sleepiness-data';
import { AddSleepComponent } from '../add-sleep/add-sleep.component';
import { AddSleepinessComponent } from '../add-sleepiness/add-sleepiness.component';
import { RouterLink } from '@angular/router';

interface SleepChartBar {
	label: string;
	dateLabel: string;
	hours: number;
	x: number;
	y: number;
	height: number;
	isToday: boolean;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonIcon, IonTabs, IonTabBar, IonTabButton, IonButton, IonLabel, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonThumbnail, RouterLink, IonFooter, IonFab, IonFabButton, IonFabList],
})
export class HomePage {
  constructor(public sleepService:SleepService, public actionSheetController: ActionSheetController, public modalController: ModalController) {
	addIcons({ moon, home, addCircle, personCircle, bedOutline, moonOutline, close });
	}

	async ngOnInit() {
		await this.sleepService.ready;
		console.log(this.allSleepData);
	}

	get allSleepData() {
		return SleepService.AllSleepData;
	}

	presentActionSheet(event: Event) {
		if (event) {
			event.preventDefault(); // Prevent the default behavior of the event
		}

		this.actionSheetController.create({
			header: 'I want to...',
			buttons: [
				{
					text: 'Log My Sleep',
					icon: 'bed-outline',
					handler: () => {
						console.log('Log My Sleep clicked');
						this.addSleep();
					}
				},
				{
					text: 'Log My Sleepiness',
					icon: 'moon-outline',
					handler: () => {
						console.log('Log My Sleepiness clicked');
						this.addSleepiness();
					}
				},
				{
					text: 'Cancel',
					icon: 'close',
					role: 'cancel',
					handler: () => {
						console.log('Cancel clicked');
					}
				}
			]
	}).then((actionSheet) => {
		actionSheet.present();
	});
	}

	async addSleep() {
		var modal =  await this.modalController.create({
			component: AddSleepComponent,
			componentProps: { wakeCount: 0 }
		});
		await modal.present();

		const { data, role } = await modal.onWillDismiss(); // data = OvernightSleepData object
		if (role === 'log') {
			await this.sleepService.logOvernightData(data);
			// console.log('All Overnight Sleep Data:', this.sleepService.getAllOvernightData().map(d => d.summaryString()));
		}
	}

	async addSleepiness() {
		var modal =  await this.modalController.create({
			component: AddSleepinessComponent
		});
		await modal.present();

		const {data, role} = await modal.onWillDismiss();  // data = StandfordSleepinessData object
		if (role === 'log') {
			await this.sleepService.logSleepinessData(data);
			// console.log('All Sleepiness Data:', this.sleepService.getAllSleepinessData().map(d => d.summaryString()));

		}
	}

	averageSleepDurationLast7Days(): string {
		const daysWithSleep = this.getLastSevenDays().filter(day => day.hours > 0);
		if (daysWithSleep.length === 0) {
			return 'No data yet';
		}

		const totalSleepDuration = daysWithSleep.reduce((sum, day) => sum + day.hours, 0);
		const averageSleepDuration = totalSleepDuration / daysWithSleep.length;

		return `${averageSleepDuration.toFixed(1)} hours`;
	}

	get hasSleepChartData(): boolean {
		return this.getLastSevenDays().some(day => day.hours > 0);
	}

	get sleepChartBars(): SleepChartBar[] {
		const baseline = 168;
		const chartHeight = 144;
		const maxHours = 12;

		return this.getLastSevenDays().map((day, index) => {
			const height = Math.min(day.hours, maxHours) / maxHours * chartHeight;
			return {
				label: day.date.toLocaleDateString([], { weekday: 'short' }),
				dateLabel: String(day.date.getDate()),
				hours: day.hours,
				x: 58 + index * 45,
				y: baseline - height,
				height,
				isToday: index === 6
			};
		});
	}

	private getLastSevenDays(): { date: Date; hours: number }[] {
		const today = new Date();
		const sleepData = this.sleepService.getAllOvernightData();

		return Array.from({ length: 7 }, (_, index) => {
			const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6 + index);
			const nextDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
			const hours = sleepData
				.filter(sleep => sleep.getSleepStart() >= date && sleep.getSleepStart() < nextDate)
				.reduce((total, sleep) => total + sleep.getSleepDurationMS() / 3_600_000, 0);

			return { date, hours };
		});
	}

	getCurrentTime(): string {
		const now = new Date();
		return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
	}
}