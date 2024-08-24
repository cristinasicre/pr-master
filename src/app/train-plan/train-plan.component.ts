import { Component } from '@angular/core';
import { ExerciseDay, Routine } from '../models/exercices.model';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { environment } from '../../environments/environments';

@Component({
  selector: 'app-train-plan',
  templateUrl: './train-plan.component.html',
  styleUrls: ['./train-plan.component.css']
})
export class TrainPlanComponent {
  selectedDayIndex: number = 0;
  exerciseDays: ExerciseDay[] = [];
  chunkedDays: ExerciseDay[][] = [];
  routine: Routine = {};
  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.selectedDayIndex = +params['dayIndex'] || 0;
    });
    this.loadRoutine();
  }

  loadRoutine() {
    this.http.get<Routine[]>(`${environment.apiUrl}/api/routines`).subscribe(data => {
      this.routine = data[0];
      if (this.routine.exerciseDays) {
        this.exerciseDays = this.routine.exerciseDays;
        this.chunkedDays = this.chunkArray(this.exerciseDays, 4);
      }

    });
  }

  get exercises() {
    return this.exerciseDays.length > 0 ? this.exerciseDays[this.selectedDayIndex].exercises : [];
  }

  selectDay(index: number) {
    this.selectedDayIndex = index;
    this.updateUrlWithSelectedDay(index);
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

  onExerciseClick(index: number) {
    this.router.navigate(['/workout', this.selectedDayIndex, index]);
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.exercises, event.previousIndex, event.currentIndex);
    this.saveExerciseOrder();
  }

  private saveExerciseOrder() {
    if (this.routine && this.routine.id != null) {
      // Actualizar solo la parte modificada del ejercicio
      const updatedRoutine = { ...this.routine, exerciseDays: [...this.exerciseDays] };

      this.http.put(`${environment.apiUrl}/api/routines/${this.routine.id}`, updatedRoutine)
        .subscribe(() => {
          console.log('Exercise order updated');
        });
    } else {
      console.error('Routine ID is not defined');
    }
  }
  
  private updateUrlWithSelectedDay(dayIndex: number) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { dayIndex },
      queryParamsHandling: 'merge',
    });
  }
}
