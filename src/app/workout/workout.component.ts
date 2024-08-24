import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Exercise, ExerciseDay, Routine } from '../models/exercices.model';
import { environment } from '../../environments/environments';

@Component({
  selector: 'app-workout',
  templateUrl: './workout.component.html',
})
export class WorkoutComponent implements OnInit {
  exerciseDays: ExerciseDay[] = [];
  currentDayIndex: number = 0;
  currentExerciseIndex: number = 0;
  routine: Routine | undefined;

  constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.currentDayIndex = +params.get('dayIndex')!;
      this.currentExerciseIndex = +params.get('exerciseIndex')! || 0;
    });

    this.loadRoutine();
  }

  loadRoutine() {
    this.http.get<Routine[]>(`${environment.apiUrl}/routines`).subscribe(data => {
      this.routine = data[0]; // Suponiendo que quieres cargar la primera rutina disponible
      if (this.routine?.exerciseDays) {
        this.exerciseDays = this.routine.exerciseDays;
      }
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
      this.router.navigate(['/train-plan'], { queryParams: { dayIndex: this.currentDayIndex } });
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
    this.router.navigate(['/train-plan'], { queryParams: { dayIndex: this.currentDayIndex } });
  }

  goBack() {
    this.router.navigate(['/train-plan'], { queryParams: { dayIndex: this.currentDayIndex } });
  }

  editExercise() {
    this.router.navigate(['/edit-exercise', this.currentDayIndex, this.currentExerciseIndex]);
  }
}
