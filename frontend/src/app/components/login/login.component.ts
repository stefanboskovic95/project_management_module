import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  private authSubscription: Subscription | undefined;
  message: string = '';

  constructor(private router: Router, private userService: UserService) {}

  ngOnInit(): void {
    this.authSubscription = this.userService.getAuthStatusListener().subscribe({
      next: (isAuthenticated) => {
        if (!isAuthenticated) {
          this.message = this.userService.getErrorMsg();
          return;
        }
        this.router.navigate(['/projectsOverview']);
      },
      error: (err) => {
        this.message = err.message;
      },
    });

    if (this.userService.isAuthenticated() != '') this.router.navigate(['/projectsOverview']);
  }

  login(form: NgForm) {
    if (form.invalid) {
      return;
    }

    const user = {
      username: form.value.username,
      password: form.value.password,
    };

    this.userService.login(user);
  }
}
