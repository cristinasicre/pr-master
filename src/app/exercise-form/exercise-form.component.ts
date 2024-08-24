import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Exercise } from '../models/exercices.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-exercise-form',
  templateUrl: './exercise-form.component.html',
})
export class ExerciseFormComponent implements OnInit, OnChanges {
  @Input() exercise: Exercise | null = null;
  @Input() dayIndex: number = 0; 
  @Output() save = new EventEmitter<Exercise>();
  @Output() cancel = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();

  exerciseForm: FormGroup;
  isEditMode: boolean = false;
  showSaveModal = false;
  showDeleteModal = false;

  constructor(private fb: FormBuilder, private router: Router, private cd: ChangeDetectorRef) {
    this.exerciseForm = this.fb.group({
      name: [''],
      sets: [''],
      description: [''],
      RIR: [''],
      external_link: ['']
    });
  }

  ngOnInit() {
    this.setFormValues();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['exercise'] && changes['exercise'].currentValue) {
      this.isEditMode = true;
      this.setFormValues();
    }
  }

  private setFormValues() {
    if (this.exercise) {
        this.exerciseForm.patchValue({
            name: this.exercise.name,
            sets: this.exercise.sets.join(', '), // Presenta como string unido por comas
            description: this.exercise.description,
            RIR: this.exercise.RIR,
            external_link: this.exercise.external_link
        });
    }
}


  onSave() {
    if (this.exerciseForm.valid) {
      this.showSaveModal = true;
    }
  }

  onCancel() {
    this.cancel.emit();
  }

  onDelete() {
    this.showDeleteModal = true;
  }

  confirmDelete() {
    this.showDeleteModal = false;
    this.delete.emit();
    this.navigateToTrainPlan();
  }

  cancelDelete() {
    this.showDeleteModal = false;
  }

  confirmSave() {
    this.showSaveModal = false;
    const formValue = this.exerciseForm.value;
    const updatedExercise: Exercise = {
      ...this.exercise,
      ...formValue,
      sets: formValue.sets.split(',').map((set: string) => set.trim())
    };
    this.save.emit(updatedExercise);
    this.navigateToTrainPlan();
  }

  cancelSave() {
    this.showSaveModal = false;
  }

  private navigateToTrainPlan() {
    this.router.navigate(['/train-plan'], { queryParams: { dayIndex: this.dayIndex } });
  }
}
