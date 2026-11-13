import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { OvernightSleepData } from '../data/overnight-sleep-data';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonLabel, IonItem, IonIcon, IonButtons, ModalController, IonDatetime, IonButton, IonInput } from '@ionic/angular/standalone';

const localDateTimeValue = (): string => {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60_000)
    .toISOString()
    .slice(0, -1);
};

@Component({
  selector: 'app-add-sleep',
  templateUrl: './add-sleep.component.html',
  styleUrls: ['./add-sleep.component.scss'],
  imports: [FormsModule, IonHeader, IonToolbar, IonTitle, IonContent, IonLabel, IonItem, IonIcon, IonButtons, IonDatetime, IonButton, IonInput]
})
export class AddSleepComponent  implements OnInit {
  sleepStart = localDateTimeValue();
  sleepEnd = this.sleepStart;
  wakeCount?: number;

  constructor(private modalController: ModalController) { }

  ngOnInit() {}

  dismissModal() {
    this.modalController.dismiss(null, 'cancel');
  }

  logSleep() {
    this.modalController.dismiss(new OvernightSleepData(
      new Date(this.sleepStart),
      new Date(this.sleepEnd),
      this.wakeCount
    ), 'log');
  }

}
