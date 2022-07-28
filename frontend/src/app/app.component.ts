import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProjectsService } from './services/projects.service';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private authListenerSubscription: Subscription | undefined;
  title = 'frontend';
  isAuthenticated = false;

  constructor(private router: Router, private userService: UserService, private projectsService: ProjectsService) { }

  ngOnInit() {
    this.authListenerSubscription = this.userService.
      getAuthStatusListener().
      subscribe(isAuthenticated => {
        this.isAuthenticated = isAuthenticated
      });
    this.userService.autoAuthUser();
  }

  ngOnDestroy() {
    if (this.authListenerSubscription)
      this.authListenerSubscription.unsubscribe();
  }

  goToProjects() {
    this.router.navigate(['projects_overview']);
  }

  onLogout() {
    this.userService.logout();
  }

  goToAddProject() {
    this.router.navigate(['add_project']);
  }
}
