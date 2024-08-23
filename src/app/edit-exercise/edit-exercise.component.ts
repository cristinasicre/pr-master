import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ExerciseDay, Exercise } from '../models/exercices.model';

@Component({
  selector: 'app-edit-exercise',
  template: `
    <app-exercise-form 
      [exercise]="exercise" 
      [formTitle]="'Edit Exercise'" 
      (save)="saveExercise($event)" 
      (cancel)="cancel()">
    </app-exercise-form>
  `,
})
export class EditExerciseComponent implements OnInit {
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

  saveExerciseData() {
    this.http.put(`http://localhost:3000/exerciseDays/${this.currentDayIndex}`, this.exerciseDays[this.currentDayIndex])
      .subscribe(() => {
        this.router.navigate(['/train-plan']);
      });
  }

  cancel() {
    this.router.navigate(['/train-plan']);
  }
}
