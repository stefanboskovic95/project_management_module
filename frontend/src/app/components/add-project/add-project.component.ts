import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Currency } from 'src/app/models/currency';
import { User } from 'src/app/models/user';
import { ProjectsService } from 'src/app/services/projects.service';

@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.css'],
})
export class AddProjectComponent implements OnInit {
  businessCategories: Array<string> = [];
  users: Array<User> = [];
  regions: Array<string> = [];
  isConfidential: boolean = false;
  currencies: Array<Currency> = [];
  currenciesMap: { [key: number]: number } = {};
  selectedCurrencyId = 1;
  budget: number = 0;

  constructor(private projectsService: ProjectsService, private _snackBar: MatSnackBar, private router: Router) {}

  ngOnInit(): void {
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
  }

  submitProject(data: any) {
    console.log(data);
    this.projectsService
      .addProject(
        data.name,
        data.description,
        this.getBudgetInEur(),
        data.isConfidential,
        data.nda,
        data.currency ? data.currency : 1,
        data.projectLead,
        data.category,
        data.region,
        data.country
      )
      .subscribe({
        next: () => {
          this._snackBar.open(`Added: "${data.name}".`, 'Dismiss');
          this.router.navigate(['/projectsOverview']);
        },
        error: (err) => {
          this.openSnackBar(err.error.message);
        },
      });
  }

  getBudgetInEur() {
    return this.budget * this.currenciesMap[this.selectedCurrencyId];
  }

  openSnackBar(message: string, action: string = 'Dismiss') {
    this._snackBar.open(message, action);
  }
}
