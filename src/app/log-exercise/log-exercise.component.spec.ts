import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogExerciseComponent } from './log-exercise.component';

describe('LogExerciseComponent', () => {
  let component: LogExerciseComponent;
  let fixture: ComponentFixture<LogExerciseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogExerciseComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LogExerciseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
