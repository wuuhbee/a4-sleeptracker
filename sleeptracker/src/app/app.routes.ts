import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'sleep-data',
    loadComponent: () => import('./sleep-data/sleep-data.page').then( m => m.SleepDataPage)
  },
  {
    path: 'sleepiness-data',
    loadComponent: () => import('./sleepiness-data/sleepiness-data.page').then( m => m.SleepinessDataPage)
  }
];
