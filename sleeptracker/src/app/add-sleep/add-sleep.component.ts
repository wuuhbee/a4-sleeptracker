import { Component, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonIcon, IonButtons, ModalController, IonDatetime, IonButton, IonInput } from '@ionic/angular/standalone';

@Component({
  selector: 'app-add-sleep',
  templateUrl: './add-sleep.component.html',
  styleUrls: ['./add-sleep.component.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonIcon, IonButtons, IonDatetime, IonButton, IonInput]
})
export class AddSleepComponent  implements OnInit {
  sleepStart?: Date;
  sleepEnd?: Date;
  name?: string;

  constructor(private modalController: ModalController) { }

  ngOnInit() {}

  dismissModal() {
    this.modalController.dismiss(null, 'cancel');
  }

  logSleep() {
    this.modalController.dismiss({ sleepStart: this.sleepStart, sleepEnd: this.sleepEnd, name: this.name }, 'log');
  }

}
