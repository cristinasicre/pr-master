import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Exercise } from '../models/exercices.model';

@Component({
  selector: 'app-exercise-form',
  templateUrl: './exercise-form.component.html',
  styleUrls: ['./exercise-form.component.css']
})
export class ExerciseFormComponent implements OnInit, OnChanges {
  @Input() exercise: Exercise | null = null;
  @Input() formTitle: string = 'Add Exercise';
  @Output() save = new EventEmitter<Exercise>();
  @Output() cancel = new EventEmitter<void>();

  exerciseForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.exerciseForm = this.fb.group({
      name: [''],
      sets: [''],
      description: [''],
      RIR: [''],
      external_link: ['']
    });
  }

  ngOnInit(): void {
    this.updateForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['exercise'] && changes['exercise'].currentValue) {
      this.updateForm();
    }
  }

  updateForm(): void {
    if (this.exercise) {
      this.exerciseForm.patchValue(this.exercise);
    }
  }
  

  onSave(): void {
    if (this.exerciseForm.valid) {
      this.save.emit(this.exerciseForm.value);
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
