import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonLabel, IonItem, IonIcon, IonButtons, ModalController, IonDatetime, IonButton, IonInput, IonRadio, IonRadioGroup } from '@ionic/angular/standalone';
import { StanfordSleepinessData } from '../data/stanford-sleepiness-data';

const localDateTimeValue = (): string => {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60_000)
    .toISOString()
    .slice(0, -1);
};

@Component({
  selector: 'app-add-sleepiness',
  templateUrl: './add-sleepiness.component.html',
  styleUrls: ['./add-sleepiness.component.scss'],
  imports: [FormsModule, IonHeader, IonToolbar, IonTitle, IonContent, IonLabel, IonItem, IonIcon, IonButtons, IonDatetime, IonButton, IonInput, IonRadio, IonRadioGroup]
})
export class AddSleepinessComponent  implements OnInit {
  readonly sleepinessScores = [1, 2, 3, 4, 5, 6, 7];
  sleepinessScore: number = 1;
  loggedAt = localDateTimeValue();

  constructor(public modalController: ModalController) { }

  ngOnInit() {}

  get sleepinessDescription(): string | undefined {
    return StanfordSleepinessData.ScaleValues[this.sleepinessScore];
  }

  logSleepiness() {
    this.modalController.dismiss(
      new StanfordSleepinessData(this.sleepinessScore, new Date(this.loggedAt))
    , 'log');    
  }

  dismissModal() {
    this.modalController.dismiss(null, 'cancel');
  }

}
