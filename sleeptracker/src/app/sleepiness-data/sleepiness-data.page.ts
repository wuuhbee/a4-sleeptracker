import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-sleepiness-data',
  templateUrl: './sleepiness-data.page.html',
  styleUrls: ['./sleepiness-data.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class SleepinessDataPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
