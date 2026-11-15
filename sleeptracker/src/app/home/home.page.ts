import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonIcon, IonTabs, IonTabBar, IonTabButton, IonButton, ActionSheetController, ModalController, IonLabel} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { moon, home, addCircle, personCircle, bedOutline, moonOutline, close } from 'ionicons/icons';
import { SleepService } from '../services/sleep.service';
import { SleepData } from '../data/sleep-data';
import { OvernightSleepData } from '../data/overnight-sleep-data';
import { StanfordSleepinessData } from '../data/stanford-sleepiness-data';
import { AddSleepComponent } from '../add-sleep/add-sleep.component';
import { RouterLink } from '@angular/router';
import { AddSleepinessComponent } from '../add-sleepiness/add-sleepiness.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [RouterLink, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonIcon, IonTabs, IonTabBar, IonTabButton, IonButton, IonLabel],
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
			this.sleepService.logOvernightData(data);
			// console.log('All Overnight Sleep Data:', this.sleepService.getAllOvernightData().map(d => d.summaryString()));
		}
	}

	async addSleepiness() {
		var modal =  await this.modalController.create({
			component: AddSleepinessComponent,
			componentProps: { sleepinessScore: 0 }
		});
		await modal.present();

		const {data, role} = await modal.onWillDismiss();  // data = StandfordSleepinessData object
		if (role === 'log') {
			this.sleepService.logSleepinessData(data);
			// console.log('All Sleepiness Data:', this.sleepService.getAllSleepinessData().map(d => d.summaryString()));

		}
	}
}
