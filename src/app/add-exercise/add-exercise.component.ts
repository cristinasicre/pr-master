// add-exercise.component.ts
import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ExerciseDay, Exercise } from '../models/exercices.model';

@Component({
  selector: 'app-add-exercise',
  templateUrl: './add-exercise.component.html',
  styleUrls: ['./add-exercise.component.css']
})
export class AddExerciseComponent {
  exerciseName: string = '';
  exerciseSets: string = '';
  exerciseDescription: string = '';
  exerciseRIR: string = '';
  exerciseLink: string = '';
  exerciseDays: ExerciseDay[] = [];
  currentDayIndex: number = 0;
  currentDayId: number = 0;

  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit() {
    this.currentDayIndex = +this.route.snapshot.paramMap.get('dayIndex')!;
    this.loadExerciseData();
  }

  loadExerciseData() {
    this.http.get<ExerciseDay[]>('http://localhost:3000/exerciseDays').subscribe(data => {
      this.exerciseDays = data;
      this.currentDayId = this.exerciseDays[this.currentDayIndex].id;
    });
  }

  saveExercise() {
    const newExercise: Exercise = {
      name: this.exerciseName,
      sets: this.exerciseSets.split(',').map(s => s.trim()),
      description: this.exerciseDescription,
      RIR: this.exerciseRIR,
      external_link: this.exerciseLink
    };

    // Añadir el nuevo ejercicio al día seleccionado
    this.exerciseDays[this.currentDayIndex].exercises.push(newExercise);

    // Guardar el nuevo estado del JSON usando PUT para actualizar el día específico
    this.saveExerciseData();
  }

  saveExerciseData() {
    this.http.put(`http://localhost:3000/exerciseDays/${this.currentDayId}`, this.exerciseDays[this.currentDayIndex])
      .subscribe(() => {
        this.router.navigate(['/train-plan']);
      });
  }

  cancel() {
    this.router.navigate(['/train-plan']);
  }
}
