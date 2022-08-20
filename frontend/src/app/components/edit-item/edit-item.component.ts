import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
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
  isEditing: boolean = false;
  item: ProjectItem | undefined;
  statuses: Array<ProcurementStatus> = [];
  selectedCurrencyId: number = 1;

  control: FormControl = new FormControl();
  departmentUsers: Array<User> = [];
  filteredUsers: Observable<Array<User>> | undefined;

  constructor(private projectsService: ProjectsService) {}

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
    });
    this.projectsService.getProcurementStatuses().subscribe((statuses) => {
      this.statuses = statuses;
    });
    this.projectsService.getUsersInDepartment().subscribe((users) => {
      this.departmentUsers = users;
      this.setDefaultUser();
    });
    this.filteredUsers = this.control.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value || ''))
    );
    this.control.disable();
  }

  setDefaultUser() {
    if (this.item && this.departmentUsers) {
      const user = this.departmentUsers.find((item) => item.id == this.item?.userId);
      if (user) {
        this.control.setValue(user.username);
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
    console.log(this.control.getRawValue());
    if (!this.item) {
      return;
    }
    this.projectsService
      .updateProjectItem(
        this.item.id,
        formData.name,
        formData.subject,
        formData.cost,
        this.control.getRawValue(),
        formData.isNdaSigned,
        formData.status
      )
      .subscribe(() => {
        this.toggleEditing();
      });
  }

  toggleEditing() {
    this.isEditing = !this.isEditing;
    this.control.disabled ? this.control.enable() : this.control.disable();
  }
}
