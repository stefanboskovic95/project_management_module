import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectsService } from './services/projects.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'frontend';
  isAuthenticated = true;

  constructor(private router: Router,private projectsService:ProjectsService) {}

  goToProjects() {
    this.router.navigate(['/']);
  }

  onLogout() {

  }

  goToAddProject() {
    this.router.navigate(['add_project']);
  }
}
