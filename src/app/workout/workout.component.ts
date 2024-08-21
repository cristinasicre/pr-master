// workout.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Exercise, ExerciseDay } from '../models/exercices.model';

@Component({
  selector: 'app-workout',
  templateUrl: './workout.component.html',
})
export class WorkoutComponent implements OnInit {
  exerciseDays: ExerciseDay[] = [];
  currentDayIndex: number = 0;
  currentExerciseIndex: number = 0;

  constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.currentDayIndex = +params.get('dayIndex')!;
    });

    this.http.get<ExerciseDay[]>('assets/exercise-data.json').subscribe(data => {
      this.exerciseDays = data;
      this.currentExerciseIndex = 0;
    });
  }

  get currentExercise(): Exercise | undefined {
    return this.exerciseDays[this.currentDayIndex]?.exercises[this.currentExerciseIndex];
  }

  nextExercise() {
    if (this.currentExerciseIndex < this.exerciseDays[this.currentDayIndex].exercises.length - 1) {
      this.currentExerciseIndex++;
    }
  }

  previousExercise() {
    if (this.currentExerciseIndex > 0) {
      this.currentExerciseIndex--;
    }
  }

  isLastExercise(): boolean {
    return this.currentExerciseIndex === this.exerciseDays[this.currentDayIndex].exercises.length - 1;
  }

  finishWorkout() {
    this.router.navigate(['/train-plan']);
  }

  goBack() {
    this.router.navigate(['/train-plan']);
  }
}
