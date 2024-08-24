import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ExerciseDay, Exercise, Routine } from '../models/exercices.model';
import { environment } from '../../environments/environments';

@Component({
  selector: 'app-edit-exercise',
  template: `
    <app-exercise-form [exercise]="exercise" [dayIndex]="currentDayIndex" (save)="saveExercise($event)" (cancel)="cancel()" (delete)="deleteExercise()"></app-exercise-form>
  `,
})
export class EditExerciseComponent {
  routine: Routine | null = null;
  currentDayIndex: number = 0;
  currentExerciseIndex: number = 0;
  exercise: Exercise | null = null;

  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient) { }

  ngOnInit() {
    this.currentDayIndex = +this.route.snapshot.paramMap.get('dayIndex')!;
    this.currentExerciseIndex = +this.route.snapshot.paramMap.get('exerciseIndex')!;
    this.loadRoutine();
  }

  loadRoutine() {
    this.http.get<Routine[]>(`${environment.apiUrl}/routines`).subscribe(data => {
      this.routine = data[0]; // Cargamos la primera rutina
      if (this.routine && this.routine.exerciseDays) {
        this.exercise = this.routine.exerciseDays[this.currentDayIndex].exercises[this.currentExerciseIndex];
      }
    });
  }

  saveExercise(updatedExercise: Exercise) {
    if (this.routine && this.routine.exerciseDays) {
      this.routine.exerciseDays[this.currentDayIndex].exercises[this.currentExerciseIndex] = updatedExercise;
      this.updateRoutine();
    }
  }

  deleteExercise() {
    if (this.routine && this.routine.exerciseDays) {
      this.routine.exerciseDays[this.currentDayIndex].exercises.splice(this.currentExerciseIndex, 1);
      this.updateRoutine(() => {
        this.router.navigate(['/train-plan'], { queryParams: { dayIndex: this.currentDayIndex } });
      });
    }
  }

  updateRoutine(callback?: () => void) {
    if (this.routine) {
      this.http.put(`${environment.apiUrl}/routines/${this.routine.id}`, this.routine)
        .subscribe(() => {
          if (callback) {
            callback();
          } else {
            this.router.navigate(['/workout', this.currentDayIndex, this.currentExerciseIndex]);
          }
        });
    }
  }

  cancel() {
    this.router.navigate(['/workout', this.currentDayIndex, this.currentExerciseIndex]);
  }
}
