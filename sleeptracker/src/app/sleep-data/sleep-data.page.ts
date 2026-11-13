import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-sleep-data',
  templateUrl: './sleep-data.page.html',
  styleUrls: ['./sleep-data.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class SleepDataPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
