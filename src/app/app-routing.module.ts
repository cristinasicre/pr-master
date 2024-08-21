import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TrainPlanComponent } from './train-plan/train-plan.component';
import { WorkoutComponent } from './workout/workout.component';

const routes: Routes = [
  { path: 'train-plan', component: TrainPlanComponent },
  { path: 'workout/:dayIndex', component: WorkoutComponent },
  { path: '', redirectTo: '/train-plan', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
