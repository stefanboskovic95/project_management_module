import { Component, Input, OnInit } from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';
import { ProjectsService } from 'src/app/services/projects.service';
import { Currency } from 'src/app/models/currency';
import { User } from 'src/app/models/user';
import { Project } from 'src/app/models/project';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-edit-project',
  templateUrl: './edit-project.component.html',
  styleUrls: ['./edit-project.component.css'],
})
export class EditProjectComponent implements OnInit {
  businessCategories: Array<string> = [];
  users: Array<User> = [];
  regions: Array<string> = [];
  isConfidential: boolean = false;
  currencies: Array<Currency> = [];
  currenciesMap: { [key: number]: number } = {};
  project: Project | undefined;
  statuses: Array<string> = [];
  isEditing: boolean = false;
  nda: string = '';
  itemsOverview: boolean = true;
  private itemsOverviewName = 'itemsOverview';
  selectedCurrencyId: number = 1;
  budgetFormControl: FormControl = new FormControl();
  budget: number = 0;

  constructor(private projectsService: ProjectsService, private _snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.getProject();
    this.projectsService.getBusinessCategories().subscribe((businessCategories) => {
      this.businessCategories = businessCategories;
    });
    this.projectsService.getDepartmentOfficials().subscribe((users) => {
      this.users = users;
    });
    this.projectsService.getRegions().subscribe((regions) => {
      this.regions = regions;
    });
    this.projectsService.getCurrencies().subscribe((currencies) => {
      this.currencies = currencies;
      for (const currency of currencies) {
        this.currenciesMap[currency.id] = currency.ratioToEur;
      }
    });
    this.projectsService.getProjectStatuses().subscribe((statuses) => {
      this.statuses = statuses;
    });
  }

  editProject(data: any) {
    if (!this.project) {
      return;
    }

    this.projectsService
      .updateProject(
        this.project.id,
        data.name,
        data.description,
        this.getBudgetInEur(),
        data.isConfidential,
        this.nda,
        data.currencyId,
        data.userId,
        data.categoryId,
        data.country,
        data.region,
        data.status
      )
      .subscribe({
        next: () => {
          this.getProject();
          this.isEditing = false;
        },
        error: (err) => {
          const msg = err.error.message;
          console.log(err.error.message)
          if (msg.includes('budget')) {
            this.budgetFormControl.setErrors({ budget: true });
          } else if (msg.includes('Project lead')) {
            this.budgetFormControl.setErrors({ projectLead: true });
          }
          this.openSnackBar(msg);
        },
      });
  }

  getProject() {
    this.projectsService.getProject(this.projectsService.getSelectedProjectId()).subscribe((project) => {
      this.project = project;
      this.budget = project.budget;
      this.isConfidential = project.isConfidential;
      this.nda = this.project?.nda ? this.project.nda.text : '';
    });
  }

  isNdaDisabled() {
    if (this.isEditing && !this.isConfidential) return true;
    else if (!this.isEditing) return true;
    return false;
  }

  getCurrency(currencyId: number = 1) {
    return this.currencies?.find((item) => item.id == currencyId)?.name;
  }

  toggleItemsOverview() {
    this.itemsOverview = !(sessionStorage.getItem(this.itemsOverviewName) == 'true');
    // this.itemsOverview = !this.itemsOverview;
    console.log(this.itemsOverview);
    sessionStorage.setItem(this.itemsOverviewName, String(this.itemsOverview));
    return this.itemsOverview;
  }

  getBudgetInEur() {
    return this.budget * this.currenciesMap[this.selectedCurrencyId];
  }

  getBudgetAvailable() {
    if (!this.project) {
      return 0;
    }

    return this.getBudgetInEur() - this.project.totalCost
  }

  getItemsOverview() {
    return sessionStorage.getItem(this.itemsOverviewName) == 'true';
  }

  openSnackBar(message: string, action: string = 'Dismiss') {
    this._snackBar.open(message, action);
  }

  toggleEditing() {
    this.isEditing = !this.isEditing;
    this.budgetFormControl.disabled ? this.budgetFormControl.enable() : this.budgetFormControl.disable();
  }
}
