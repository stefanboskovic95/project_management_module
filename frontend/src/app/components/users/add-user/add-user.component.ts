import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Department } from 'src/app/models/department';
import { ProjectsService } from 'src/app/services/projects.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css'],
})
export class AddUserComponent implements OnInit {
  departments: Array<Department> = [];
  userTypes: Array<string> = [];
  selectedDepartmentId: number = 1;
  selectedType: string = 'Regular';
  passwordFormControl = new FormControl();
  passwordRepeatFormControl = new FormControl();

  constructor(
    private userService: UserService,
    private projectService: ProjectsService,
    private _snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userService.getUserTypes().subscribe((userTypes) => {
      this.userTypes = userTypes;
      console.log(userTypes);
    });
    this.projectService.getDepartments().subscribe((departments) => {
      this.departments = departments;
    });
  }

  submitItem(data: any) {
    if (this.passwordFormControl.value !== this.passwordRepeatFormControl.value) {
      this.passwordFormControl.setErrors({ password: true });
      this.passwordRepeatFormControl.setErrors({ password: true });
      return;
    }

    this.userService
      .createUser(
        data.username,
        this.passwordFormControl.value,
        data.firstName,
        data.lastName,
        this.selectedType,
        this.selectedDepartmentId
      )
      .subscribe(() => {
        this._snackBar.open(`Added: "${data.username}".`, 'Dismiss');
        this.router.navigate(['/users']);
      });
  }
}
