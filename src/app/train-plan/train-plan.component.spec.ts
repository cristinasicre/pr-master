import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainPlanComponent } from './train-plan.component';

describe('TrainPlanComponent', () => {
  let component: TrainPlanComponent;
  let fixture: ComponentFixture<TrainPlanComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrainPlanComponent]
    });
    fixture = TestBed.createComponent(TrainPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
