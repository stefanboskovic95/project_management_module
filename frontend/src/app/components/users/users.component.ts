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

  findWhat: string = '';

  constructor(private userService: UserService, private projectsService: ProjectsService, private router: Router) { }

  ngOnInit(): void {
    if (this.userService.getUserType() != 'Admin') {
      this.router.navigate(['/']);
    }

    this.getUsers()
    this.projectsService.getDepartments().subscribe((departments) => {
      this.departments = departments;
    });
    this.findFormControl.valueChanges.subscribe((val) => {
      this.findWhat = val;
      this.getUsers();
    })
  }

  getUsers() {
    let queryString = '';
    if (this.findWhat !== '') {
      queryString = queryString + `find=${this.findWhat}`;
    }
    this.userService.getUsers(queryString).subscribe({
      next: (users) => {
        this.users = users
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  getDepartmentForId(departmentId: number) {
    return this.departments.find((department) => department.id == departmentId)?.abbrev;
  }

}
