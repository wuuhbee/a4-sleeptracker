import { Component, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonIcon, IonTabs, IonTabBar, IonTabButton, IonButton, ActionSheetController, ModalController, IonLabel, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonThumbnail, IonFab, IonFabButton, IonFabList, IonSegment, IonSegmentButton, SegmentChangeEventDetail, IonFooter, IonList, IonItemSliding, IonItemOption, IonItemOptions } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { moon, home, addCircle, personCircle, bedOutline, moonOutline, close, sparkles } from 'ionicons/icons';
import { SleepService } from '../services/sleep.service';
import { SleepData } from '../data/sleep-data';
import { OvernightSleepData } from '../data/overnight-sleep-data';
import { StanfordSleepinessData } from '../data/stanford-sleepiness-data';
import { AddSleepComponent } from '../add-sleep/add-sleep.component';
import { AddSleepinessComponent } from '../add-sleepiness/add-sleepiness.component';
import { RouterLink } from '@angular/router';



@Component({
  selector: 'app-sleep-data',
  templateUrl: './sleep-data.page.html',
  styleUrls: ['./sleep-data.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonTabs, IonTabButton, IonTabBar, IonIcon, IonLabel, IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonThumbnail, RouterLink, IonFab, IonFabButton, IonFabList, IonSegment, IonSegmentButton, IonFooter, IonList, IonItemSliding, IonItemOption, IonItemOptions]
})
export class SleepDataPage implements OnInit {
  selectedSegment: 'overnight' | 'sleepiness' = 'overnight';

  constructor(public sleepService:SleepService, public actionSheetController: ActionSheetController, public modalController: ModalController) {
	addIcons({ moon, home, addCircle, personCircle, bedOutline, moonOutline, close, sparkles });
	}

	async ngOnInit() {
		await this.sleepService.ready;
		console.log(this.allSleepData);
	}

	get allSleepData() {
		return SleepService.AllSleepData;
	}

	onSegmentChanged(event: CustomEvent<SegmentChangeEventDetail>) {
		const value = event.detail.value;
		if (value === 'overnight' || value === 'sleepiness') {
		  this.selectedSegment = value;
		}
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
		const now = new Date();
		const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

		const last7DaysSleepData = this.sleepService.getAllOvernightData().filter(data => data.loggedAt >= sevenDaysAgo);
		
		if (last7DaysSleepData.length === 0) {
			return "No sleep data for the last 7 days.";
		}

		const totalSleepDuration = last7DaysSleepData.reduce((sum, data) => {
			return sum + data.getSleepDurationMS() / (1000 * 60 * 60); // Convert milliseconds to hours
		}, 0);
		const averageSleepDuration = totalSleepDuration / last7DaysSleepData.length;

		return averageSleepDuration.toFixed(2) + " hours";
	}

  get overnightSleepData() {
    return [...this.sleepService.getAllOvernightData()].sort(
      (a, b) => b.getSleepStart().getTime() - a.getSleepStart().getTime()
    );
  }
}
