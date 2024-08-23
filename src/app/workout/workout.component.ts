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
      this.currentExerciseIndex = +params.get('exerciseIndex')! || 0;
    });

    this.loadExerciseData();
  }

  loadExerciseData() {
    this.http.get<ExerciseDay[]>('http://localhost:3000/exerciseDays').subscribe(data => {
      this.exerciseDays = data;
    });
  }

  get currentExercise(): Exercise | undefined {
    if (this.exerciseDays.length > 0 && this.exerciseDays[this.currentDayIndex]) {
      return this.exerciseDays[this.currentDayIndex].exercises[this.currentExerciseIndex];
    }
    return undefined;
  }

  nextExercise() {
    if (this.currentExerciseIndex < this.exerciseDays[this.currentDayIndex].exercises.length - 1) {
      this.currentExerciseIndex++;
    } else {
      this.router.navigate(['/train-plan']);
    }
  }

  previousExercise() {
    if (this.currentExerciseIndex > 0) {
      this.currentExerciseIndex--;
    }
  }

  isLastExercise(): boolean {
    return (
      this.exerciseDays.length > 0 &&
      this.currentDayIndex < this.exerciseDays.length &&
      this.currentExerciseIndex === this.exerciseDays[this.currentDayIndex].exercises.length - 1
    );
  }

  finishWorkout() {
    this.router.navigate(['/train-plan']);
  }

  goBack() {
    this.router.navigate(['/train-plan']);
  }
}
