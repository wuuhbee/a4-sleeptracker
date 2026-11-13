import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SleepinessDataPage } from './sleepiness-data.page';

describe('SleepinessDataPage', () => {
  let component: SleepinessDataPage;
  let fixture: ComponentFixture<SleepinessDataPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SleepinessDataPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
