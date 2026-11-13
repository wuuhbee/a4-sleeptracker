import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SleepDataPage } from './sleep-data.page';

describe('SleepDataPage', () => {
  let component: SleepDataPage;
  let fixture: ComponentFixture<SleepDataPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SleepDataPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
