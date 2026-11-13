import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonLabel, IonItem, IonIcon, IonButtons, ModalController, IonDatetime, IonButton, IonInput } from '@ionic/angular/standalone';

@Component({
  selector: 'app-add-sleep',
  templateUrl: './add-sleep.component.html',
  styleUrls: ['./add-sleep.component.scss'],
  imports: [FormsModule, IonHeader, IonToolbar, IonTitle, IonContent, IonLabel, IonItem, IonIcon, IonButtons, IonDatetime, IonButton, IonInput]
})
export class AddSleepComponent  implements OnInit {
  sleepStart = new Date().toISOString();
  sleepEnd = new Date().toISOString();
  wakeCount?: number;

  constructor(private modalController: ModalController) { }

  ngOnInit() {}

  dismissModal() {
    this.modalController.dismiss(null, 'cancel');
  }

  logSleep() {
    this.modalController.dismiss({
      sleepStart: new Date(this.sleepStart),
      sleepEnd: new Date(this.sleepEnd),
      wakeCount: this.wakeCount
    }, 'log');
  }

}
