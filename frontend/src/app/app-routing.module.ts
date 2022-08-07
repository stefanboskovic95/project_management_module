import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddProjectComponent } from './components/add-project/add-project.component';
import { LoginComponent } from './components/login/login.component';
import { EditProjectComponent } from './components/edit-project/edit-project.component';
import { ProjectsDetailsComponent } from './components/projects-details/projects-details.component';
import { ProjectsOverviewComponent } from './components/projects-overview/projects-overview.component';
import { AddItemComponent } from './components/add-item/add-item.component';

import { AuthGuard } from './services/auth-guard';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'projectsOverview', component: ProjectsOverviewComponent, canActivate: [AuthGuard] },
  { path: 'addProject', component: AddProjectComponent, canActivate: [AuthGuard] },
  { path: 'editProject', component: EditProjectComponent, canActivate: [AuthGuard] },
  { path: 'projectsDetails', component: ProjectsDetailsComponent, canActivate: [AuthGuard] },
  { path: 'addItem', component: AddItemComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
