import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonIcon, IonTabs, IonTabBar, IonTabButton, IonButton, ActionSheetController, ModalController} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { moon, home, addCircle, personCircle, bedOutline, moonOutline, close } from 'ionicons/icons';
import { SleepService } from '../services/sleep.service';
import { SleepData } from '../data/sleep-data';
import { OvernightSleepData } from '../data/overnight-sleep-data';
import { StanfordSleepinessData } from '../data/stanford-sleepiness-data';
import { AddSleepComponent } from '../add-sleep/add-sleep.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonIcon, IonTabs, IonTabBar, IonTabButton, IonButton],
})
export class HomePage {
  constructor(public sleepService:SleepService, public actionSheetController: ActionSheetController, public modalController: ModalController) {
	addIcons({ moon, home, addCircle, personCircle, bedOutline, moonOutline, close });
	}

	ngOnInit() {
		console.log(this.allSleepData);
	}

	/* Ionic doesn't allow bindings to static variables, so this getter can be used instead. */
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
						// Add your logic for logging sleepiness here
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
		const now = new Date().toISOString();
		var modal =  await this.modalController.create({
			component: AddSleepComponent,
			componentProps: { sleepStart: now, sleepEnd: now, wakeCount: 0 }
		});
		await modal.present();

		const { data, role } = await modal.onWillDismiss();
				// if (data.role === 'log') {
				// 	const sleepStart = data.data.sleepStart;
				// 	const sleepEnd = data.data.sleepEnd;
				// 	if (sleepStart && sleepEnd) {
				// 		this.sleepService.logOvernightData(new OvernightSleepData(sleepStart, sleepEnd));
				// 	}
				// }
		if (role === 'log') {
			console.log('Sleep data logged:', data);
			// const sleepStart = data.sleepStart;
			// const sleepEnd = data.sleepEnd;
		}
	}
}
