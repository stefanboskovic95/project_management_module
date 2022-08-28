import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Department } from 'src/app/models/department';
import { User } from 'src/app/models/user';
import { ProjectsService } from 'src/app/services/projects.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css'],
})
export class EditUserComponent implements OnInit {
  user: User | undefined;
  departments: Array<Department> = [];
  userTypes: Array<string> = [];
  selectedDepartmentId: number = 1;
  selectedType: string = 'Regular';
  passwordFormControl = new FormControl();
  passwordRepeatFormControl = new FormControl();
  isEditing: boolean = false;

  constructor(
    private userService: UserService,
    private projectService: ProjectsService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.userService.getUser(this.userService.getSelectedUserId()).subscribe({
      next: (user) => {
        this.user = user;
        this.selectedDepartmentId = user.departmentId;
        this.selectedType = user.type;
      },
      error: (err) => {
        console.log(err);
      },
    });
    this.userService.getUserTypes().subscribe((userTypes) => {
      this.userTypes = userTypes;
      console.log(userTypes);
    });
    this.projectService.getDepartments().subscribe((departments) => {
      this.departments = departments;
    });
    this.passwordFormControl.disable();
    this.passwordRepeatFormControl.disable();
  }

  submitItem() {
    if (!this.user) {
      return;
    }

    if (this.passwordFormControl.value !== this.passwordRepeatFormControl.value) {
      this.passwordFormControl.setErrors({ password: true });
      this.passwordRepeatFormControl.setErrors({ password: true });
      return;
    }

    this.userService
      .updateUser(
        this.user.id,
        this.user.username,
        this.passwordFormControl.value,
        this.user.firstName,
        this.user.lastName,
        this.selectedType,
        this.selectedDepartmentId
      )
      .subscribe(() => {
        if (this.user) {
          this._snackBar.open(`Updated: "${this.user.username}".`, 'Dismiss');
          this.toggleEditing();
        }
      });
  }

  toggleEditing() {
    this.isEditing = !this.isEditing;
    this.passwordFormControl.disabled ? this.passwordFormControl.enable() : this.passwordFormControl.disable();
    this.passwordRepeatFormControl.disabled
      ? this.passwordRepeatFormControl.enable()
      : this.passwordRepeatFormControl.disable();
  }
}
