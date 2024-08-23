import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TrainPlanComponent } from './train-plan/train-plan.component';
import { WorkoutComponent } from './workout/workout.component';
import { AddExerciseComponent } from './add-exercise/add-exercise.component';
import { EditExerciseComponent } from './edit-exercise/edit-exercise.component';

const routes: Routes = [
  { path: '', redirectTo: '/train-plan', pathMatch: 'full' },
  { path: 'train-plan', component: TrainPlanComponent },
  { path: 'workout/:dayIndex', component: WorkoutComponent },
  { path: 'workout/:dayIndex/:exerciseIndex', component: WorkoutComponent },
  { path: 'add-exercise/:dayIndex', component: AddExerciseComponent },
  { path: 'edit-exercise/:dayIndex/:exerciseIndex', component: EditExerciseComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
