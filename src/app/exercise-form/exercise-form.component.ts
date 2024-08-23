import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Exercise } from '../models/exercices.model';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-exercise-form',
  templateUrl: './exercise-form.component.html',
})
export class ExerciseFormComponent implements OnInit {
  @Input() set exercise(value: Exercise | null) {
    this.isEditMode = !!value;
    if (value) {
      this.exerciseForm.patchValue({
        name: value.name,
        sets: value.sets.join(', '),
        description: value.description,
        RIR: value.RIR,
        external_link: value.external_link
      });
    }
  }
  @Input() dayIndex: number = 0; 
  @Output() save = new EventEmitter<Exercise>();
  @Output() cancel = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();

  exerciseForm: FormGroup;
  isEditMode: boolean = false;
  showSaveModal = false;
  showDeleteModal = false;

  constructor(private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient) {
    this.exerciseForm = this.fb.group({
      name: [''],
      sets: [''],
      description: [''],
      RIR: [''],
      external_link: ['']
    });
  }

  ngOnInit() { }

  onSave() {
    if (this.exerciseForm.valid) {
      this.showSaveModal = true;
    }
  }
  ngOnChanges() {
    if (this.exercise) {
      this.exerciseForm.patchValue(this.exercise);
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
      ...this.exerciseForm.value,
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
