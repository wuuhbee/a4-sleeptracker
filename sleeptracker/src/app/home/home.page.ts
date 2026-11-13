import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonIcon, IonTabs, IonTabBar, IonTabButton} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { moon, home, addCircle, personCircle } from 'ionicons/icons';
import { SleepService } from '../services/sleep.service';
import { SleepData } from '../data/sleep-data';
import { OvernightSleepData } from '../data/overnight-sleep-data';
import { StanfordSleepinessData } from '../data/stanford-sleepiness-data';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonIcon, IonTabs, IonTabBar, IonTabButton],
})
export class HomePage {
  constructor(public sleepService:SleepService) {
	addIcons({ moon, home, addCircle, personCircle });
	}

	ngOnInit() {
		console.log(this.allSleepData);
	}

	/* Ionic doesn't allow bindings to static variables, so this getter can be used instead. */
	get allSleepData() {
		return SleepService.AllSleepData;
	}
}
