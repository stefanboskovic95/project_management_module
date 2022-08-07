import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProjectsOverviewComponent } from './components/projects-overview/projects-overview.component';
import { AddProjectComponent } from './components/add-project/add-project.component';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './components/login/login.component';
import { MatTooltipModule } from '@angular/material/tooltip';


// Auth Interceptor - to send token in authorization header
import { AuthInterceptor } from './services/auth-interceptor';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';
import { EditProjectComponent } from './components/edit-project/edit-project.component';
import { ProjectsDetailsComponent } from './components/projects-details/projects-details.component';
import { ItemsOverviewComponent } from './components/items-overview/items-overview.component';
import { AddItemComponent } from './components/add-item/add-item.component';


@NgModule({
  declarations: [
    AppComponent,
    ProjectsOverviewComponent,
    AddProjectComponent,
    LoginComponent,
    EditProjectComponent,
    ProjectsDetailsComponent,
    ItemsOverviewComponent,
    AddItemComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    DragDropModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatMenuModule,
    MatIconModule,
    MatSnackBarModule,
    NoopAnimationsModule,
    MatTooltipModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
