import { Component, OnInit } from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { map, Observable, startWith } from 'rxjs';
import { Currency } from 'src/app/models/currency';
import { Project } from 'src/app/models/project';
import { User } from 'src/app/models/user';
import { ProjectsService } from 'src/app/services/projects.service';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.css'],
})
export class AddItemComponent implements OnInit {
  project: Project | undefined;
  cost: number = 0;
  currencies: Array<Currency> = [];
  currenciesMap: { [key: number]: number } = {};
  selectedCurrencyId = 1;

  assigneeControl: FormControl = new FormControl();
  departmentUsers: Array<User> = [];
  filteredUsers: Observable<Array<User>> | undefined;

  constructor(private projectsService: ProjectsService, private _snackBar: MatSnackBar, private router: Router) {}

  ngOnInit(): void {
    this.projectsService.getProject(this.projectsService.getSelectedProjectId()).subscribe({
      next: (project) => {
        this.project = project;
      },
      error: () => {},
    });
    this.projectsService.getCurrencies().subscribe((currencies) => {
      this.currencies = currencies;
      for (const currency of currencies) {
        this.currenciesMap[currency.id] = currency.ratioToEur;
      }
    });
    this.projectsService.getUsersInDepartment().subscribe((users) => {
      this.departmentUsers = users;
    });
    this.filteredUsers = this.assigneeControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value || ''))
    );
  }

  submitItem(formData: any) {
    if (!this.project) {
      return;
    }
    this.projectsService
      .addProjectItem(
        this.project.id,
        formData.name,
        formData.subject,
        this.getCostInEur(),
        formData.isNdaSigned || false,
        formData.currency
      )
      .subscribe(() => {
        this._snackBar.open(`Added: "${formData.name}".`, 'Dismiss');
        this.router.navigate(['/editProject']);
      });
  }

  private _filter(value: string): Array<User> {
    const filterValue = this._normalizeValue(value);
    return this.departmentUsers.filter((user) => this._normalizeValue(user.username).includes(filterValue));
  }

  private _normalizeValue(value: string): string {
    return value.toLowerCase().replace(/\s/g, '');
  }

  getCostInEur() {
    return this.cost * this.currenciesMap[this.selectedCurrencyId];
  }

  openSnackBar(message: string, action: string = 'Dismiss') {
    this._snackBar.open(message, action);
  }
}
