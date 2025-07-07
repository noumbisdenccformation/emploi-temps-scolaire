import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TimetableComponent } from './components/timetable/timetable.component';
import { AuthComponent } from './components/auth/auth.component';

const routes: Routes = [
  { path: '', redirectTo: '/auth', pathMatch: 'full' },
  { path: 'auth', component: AuthComponent },
  { path: 'timetable', component: TimetableComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }