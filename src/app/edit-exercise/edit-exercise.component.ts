import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ExerciseDay, Exercise } from '../models/exercices.model';

@Component({
  selector: 'app-edit-exercise',
  template: `
    <app-exercise-form [exercise]="exercise" [dayIndex]="currentDayIndex" (save)="saveExercise($event)" (cancel)="cancel()" (delete)="deleteExercise()"></app-exercise-form>
  `,
})
export class EditExerciseComponent {
  exerciseDays: ExerciseDay[] = [];
  currentDayIndex: number = 0;
  currentExerciseIndex: number = 0;
  exercise: Exercise | null = null;

  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient) { }

  ngOnInit() {
    this.currentDayIndex = +this.route.snapshot.paramMap.get('dayIndex')!;
    this.currentExerciseIndex = +this.route.snapshot.paramMap.get('exerciseIndex')!;
    this.loadExerciseData();
  }

  loadExerciseData() {
    this.http.get<ExerciseDay[]>('http://localhost:3000/exerciseDays').subscribe(data => {
      this.exerciseDays = data;
      this.exercise = this.exerciseDays[this.currentDayIndex].exercises[this.currentExerciseIndex];
    });
  }

  saveExercise(updatedExercise: Exercise) {
    this.exerciseDays[this.currentDayIndex].exercises[this.currentExerciseIndex] = updatedExercise;
    this.saveExerciseData();
  }

  deleteExercise() {
    this.exerciseDays[this.currentDayIndex].exercises.splice(this.currentExerciseIndex, 1);
    this.saveExerciseDataAfterDeletion();
  }

  saveExerciseData() {
    this.http.put(`http://localhost:3000/exerciseDays/${this.currentDayIndex}`, this.exerciseDays[this.currentDayIndex])
      .subscribe(() => {
        this.router.navigate(['/workout', this.currentDayIndex, this.currentExerciseIndex]);
      });
  }

  saveExerciseDataAfterDeletion() {
    this.http.put(`http://localhost:3000/exerciseDays/${this.currentDayIndex}`, this.exerciseDays[this.currentDayIndex])
      .subscribe(() => {
        this.router.navigate(['/train-plan'], { queryParams: { dayIndex: this.currentDayIndex } });
      });
  }

  cancel() {
    this.router.navigate(['/workout', this.currentDayIndex, this.currentExerciseIndex]);
  }
}
