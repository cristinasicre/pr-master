import { Component } from '@angular/core';
import { ExerciseDay, } from '../models/exercices.model';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-train-plan',
  templateUrl: './train-plan.component.html',
  styleUrls: ['./train-plan.component.css']
})
export class TrainPlanComponent {
  selectedDayIndex: number = 0;
  exerciseDays: ExerciseDay[] = [];
  chunkedDays: ExerciseDay[][] = [];

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit() {
    this.loadExerciseData();
  }

  loadExerciseData() {
    this.http.get<ExerciseDay[]>('http://localhost:3000/exerciseDays').subscribe(data => {
      this.exerciseDays = data;
      this.chunkedDays = this.chunkArray(this.exerciseDays, 4);
    });
  }
  
  get exercises() {
    return this.exerciseDays.length > 0 ? this.exerciseDays[this.selectedDayIndex].exercises : [];
  }

  selectDay(index: number) {
    this.selectedDayIndex = index;
  }

  startWorkout() {
    this.router.navigate(['/workout', this.selectedDayIndex]);
  }

  chunkArray(array: ExerciseDay[], chunkSize: number): ExerciseDay[][] {
    let index = 0;
    const arrayLength = array.length;
    const tempArray: ExerciseDay[][] = [];

    for (index = 0; index < arrayLength; index += chunkSize) {
      const chunk = array.slice(index, index + chunkSize);
      tempArray.push(chunk);
    }

    return tempArray;
  }
  addExercise() {
    this.router.navigate(['/add-exercise', this.selectedDayIndex]);
  }
}
