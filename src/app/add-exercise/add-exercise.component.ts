import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ExerciseDay, Exercise } from '../models/exercices.model';
import { environment } from '../../environments/environments';

@Component({
  selector: 'app-add-exercise',
  template: `
    <app-exercise-form [dayIndex]="currentDayIndex" (save)="saveExercise($event)" (cancel)="cancel()"></app-exercise-form>
  `,
})
export class AddExerciseComponent {
  currentDayIndex: number = 0;
  exerciseDays: ExerciseDay[] = [];

  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient) { }

  ngOnInit() {
    this.currentDayIndex = +this.route.snapshot.paramMap.get('dayIndex')!;
    this.loadExerciseData();
  }

  loadExerciseData() {
    this.http.get<ExerciseDay[]>(`${environment.apiUrl}/exerciseDays`).subscribe(data => {
      this.exerciseDays = data;
    });
  }

  saveExercise(newExercise: Exercise) {
    this.exerciseDays[this.currentDayIndex].exercises.push(newExercise);
    this.saveExerciseData();
  }

  saveExerciseData() {
    this.http.put(`${environment.apiUrl}/exerciseDays/${this.currentDayIndex}`, this.exerciseDays[this.currentDayIndex])
      .subscribe(() => {
        this.router.navigate(['/train-plan'], { queryParams: { dayIndex: this.currentDayIndex } });
      });
  }

  cancel() {
    this.router.navigate(['/train-plan'], { queryParams: { dayIndex: this.currentDayIndex } });
  }
}
