import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Department } from 'src/app/models/department';
import { User } from 'src/app/models/user';
import { ProjectsService } from 'src/app/services/projects.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users: Array<User> = [];
  departments: Array<Department> = [];
  findFormControl = new FormControl();

  constructor(private userService: UserService, private projectsService: ProjectsService, private router: Router) { }

  ngOnInit(): void {
    if (this.userService.getUserType() != 'Admin') {
      this.router.navigate(['/']);
    }

    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users
      },
      error: (err) => {
        console.log(err);
      }
    });
    this.projectsService.getDepartments().subscribe((departments) => {
      this.departments = departments;
    })
  }

  getDepartmentForId(departmentId: number) {
    return this.departments.find((department) => department.id == departmentId)?.abbrev;
  }

}
