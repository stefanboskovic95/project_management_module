import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { Currency } from 'src/app/models/currency';
import { ProcurementStatus } from 'src/app/models/procurementStatus';
import { Project } from 'src/app/models/project';
import { ProjectItem } from 'src/app/models/ProjectItem';
import { User } from 'src/app/models/user';
import { ProjectsService } from 'src/app/services/projects.service';

@Component({
  selector: 'app-edit-item',
  templateUrl: './edit-item.component.html',
  styleUrls: ['./edit-item.component.css'],
})
export class EditItemComponent implements OnInit {
  project: Project | undefined;
  currencies: Array<Currency> = [];
  currenciesMap: { [key: number]: number } = {};
  isEditing: boolean = false;
  item: ProjectItem | undefined;
  statuses: Array<ProcurementStatus> = [];
  selectedCurrencyId: number = 1;

  assigneeControl: FormControl = new FormControl();
  costFormControl: FormControl = new FormControl();
  nameFormControl: FormControl = new FormControl();
  departmentUsers: Array<User> = [];
  filteredUsers: Observable<Array<User>> | undefined;

  constructor(private projectsService: ProjectsService, private _snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.projectsService.getProject(this.projectsService.getSelectedProjectId()).subscribe({
      next: (project) => {
        this.project = project;
      },
      error: (err) => {
        console.log(err);
      },
    });
    this.projectsService.getProjectItem(this.projectsService.getSelectedItemId()).subscribe({
      next: (item: ProjectItem) => {
        this.item = item;
        this.setDefaultUser();
      },
      error: (err: any) => {
        console.log(err);
      },
    });
    this.projectsService.getCurrencies().subscribe((currencies) => {
      this.currencies = currencies;
      for (const currency of currencies) {
        this.currenciesMap[currency.id] = currency.ratioToEur;
      }
    });
    this.projectsService.getProcurementStatuses().subscribe((statuses) => {
      this.statuses = statuses;
    });
    this.projectsService.getUsersInDepartment().subscribe((users) => {
      this.departmentUsers = users;
      this.setDefaultUser();
    });
    this.filteredUsers = this.assigneeControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value || ''))
    );
    this.assigneeControl.disable();
  }

  setDefaultUser() {
    if (this.item && this.departmentUsers) {
      const user = this.departmentUsers.find((item) => item.id == this.item?.userId);
      if (user) {
        this.assigneeControl.setValue(user.username);
      }
    }
  }

  private _filter(value: string): Array<User> {
    const filterValue = this._normalizeValue(value);
    return this.departmentUsers.filter((user) => this._normalizeValue(user.username).includes(filterValue));
  }

  private _normalizeValue(value: string): string {
    return value.toLowerCase().replace(/\s/g, '');
  }

  submitItem(formData: any) {
    if (!this.item) {
      return;
    }
    this.projectsService
      .updateProjectItem(
        this.item.id,
        formData.name,
        formData.subject,
        this.getCostInEur(),
        this.assigneeControl.value,
        formData.isNdaSigned,
        formData.status
      )
      .subscribe({
        next: (resp: any) => {
          this.item = resp.projectItem;
          this.toggleEditing();
        },
        error: (err) => {
          if (err.error.message.includes('cost')) {
            this.costFormControl.setErrors({ cost: true });
          }
          if (err.error.message.includes('name')) {
            this.nameFormControl.setErrors({ name: true });
          }
          if (err.error.message.includes('assignee')) {
            this.assigneeControl.setErrors({ assignee: true });
          }
          this.openSnackBar(err.error.message);
        },
      });
  }

  getCostInEur() {
    if (this.item) {
      return this.item.cost * this.currenciesMap[this.selectedCurrencyId];
    }
    return 0;
  }

  toggleEditing() {
    this.isEditing = !this.isEditing;
    this.assigneeControl.disabled ? this.assigneeControl.enable() : this.assigneeControl.disable();
  }

  openSnackBar(message: string, action: string = 'Dismiss') {
    this._snackBar.open(message, action);
  }
}
