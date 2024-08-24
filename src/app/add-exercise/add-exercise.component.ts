import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ExerciseDay, Exercise, Routine } from '../models/exercices.model';
import { environment } from '../../environments/environments';

@Component({
  selector: 'app-add-exercise',
  template: `
    <app-exercise-form [dayIndex]="currentDayIndex" (save)="saveExercise($event)" (cancel)="cancel()"></app-exercise-form>
  `,
})
export class AddExerciseComponent {
  currentDayIndex: number = 0;
  routine: Routine | null = null;

  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient) { }

  ngOnInit() {
    this.currentDayIndex = +this.route.snapshot.paramMap.get('dayIndex')!;
    this.loadRoutine();
  }

  loadRoutine() {
    this.http.get<Routine[]>(`${environment.apiUrl}/api/routines`).subscribe(data => {
      this.routine = data[0]; // Cargamos la primera rutina
    });
  }

  saveExercise(newExercise: Exercise) {
    if (this.routine && this.routine.exerciseDays) {
      this.routine.exerciseDays[this.currentDayIndex].exercises.push(newExercise);
      this.saveRoutine();
    }
  }

  saveRoutine() {
    if (this.routine) {
      this.http.put(`${environment.apiUrl}/api/routines/${this.routine.id}`, this.routine)
        .subscribe(() => {
          this.router.navigate(['/train-plan'], { queryParams: { dayIndex: this.currentDayIndex } });
        });
    }
  }

  cancel() {
    this.router.navigate(['/train-plan'], { queryParams: { dayIndex: this.currentDayIndex } });
  }
}
