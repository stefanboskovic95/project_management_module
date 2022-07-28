import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddProjectComponent } from './components/add-project/add-project.component';
import { LoginComponent } from './components/login/login.component';
import { ProjectsComponent } from './components/projects/projects.component';

import { AuthGuard } from './services/auth-guard';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'projects_overview', component: ProjectsComponent, canActivate: [AuthGuard] },
  { path: 'add_project', component: AddProjectComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
