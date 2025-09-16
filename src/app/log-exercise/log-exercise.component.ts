import { ChangeDetectorRef, Component, EventEmitter, Output } from '@angular/core';
import { Exercise, ExerciseLog, Routine } from '../models/exercices.model';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environments';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-log-exercise',
  templateUrl: './log-exercise.component.html',
  styleUrl: './log-exercise.component.css'
})
export class LogExerciseComponent {
  routine: Routine | null = null;
  currentDayIndex: number = 0;
  currentExerciseIndex: number = 0;
  exercise: Exercise | null = null;
  exerciseLog: ExerciseLog | null = null;
  showSaveModal = false;
  exerciseLogForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private http: HttpClient, private cd: ChangeDetectorRef) {
    this.exerciseLogForm = this.fb.group({
      reps: [''],
      weight: [],
      notes: ['']
    });
  }

  ngOnInit() {
    this.currentDayIndex = +this.route.snapshot.paramMap.get('dayIndex')!;
    this.currentExerciseIndex = +this.route.snapshot.paramMap.get('exerciseIndex')!;
    this.loadRoutine();
  }
  loadRoutine() {
    this.http.get<Routine[]>(`${environment.apiUrl}/routines`).subscribe(data => {
      this.routine = data[0]; // TODO Cargamos la primera rutina
      if (this.routine && this.routine.exerciseDays) {
        this.exercise = this.routine.exerciseDays[this.currentDayIndex].exercises[this.currentExerciseIndex];
      }
    });
  }
  onCancel() {
    this.router.navigate(['/workout', this.currentDayIndex, this.currentExerciseIndex]);
  }

  onSave() {
    if (this.exerciseLogForm.valid) {
      this.showSaveModal = true;
    }
  }

  cancelSave() {
    this.showSaveModal = false;
  }

  confirmSave() {
    this.showSaveModal = false;
    const formValue = this.exerciseLogForm.value;
    const updatedExerciseLog: Omit<ExerciseLog, 'id'> = {
      date: new Date().toISOString(),
      exerciseId: this.exercise?.id ?? 0,
      routineId: this.routine?.id ?? 0,
      dayId: this.currentDayIndex ?? 0,
      reps: formValue.reps ? formValue.reps.split(',').map((r: string) => +r.trim()) : [],
      weight: formValue.weight ? formValue.weight.split(',').map((w: string) => +w.trim()) : [],
      notes: formValue.notes
    };
    this.http.post(`${environment.apiUrl}/exerciseLogs`, updatedExerciseLog).subscribe({
      next: () => {
        this.navigateToWorkout();
      },
      error: (err) => {
        console.error('Error guardando el log:', err);
      }
    });
  }

  navigateToWorkout() {
    this.router.navigate(['/workout', this.currentDayIndex, this.currentExerciseIndex]);
  }


}
