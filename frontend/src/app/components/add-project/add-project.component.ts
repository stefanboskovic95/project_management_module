import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BusinessCategory } from 'src/app/models/businessCategory';
import { Currency } from 'src/app/models/currency';
import { Region } from 'src/app/models/region';
import { User } from 'src/app/models/user';
import { ProjectsService } from 'src/app/services/projects.service';

@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.css']
})
export class AddProjectComponent implements OnInit {
  businessCategories: Array<BusinessCategory> = [];
  users: Array<User> = [];
  regions: Array<Region> = [];
  isConfidential: boolean = false;
  currencies: Array<Currency> = [];

  constructor(private projectsService: ProjectsService, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.projectsService.getBusinessCategories().subscribe((businessCategories) => {
      this.businessCategories = businessCategories;
    });
    this.projectsService.getUsersInDepartment(this.projectsService.getDepartmentId()).subscribe((users) => {
      this.users = users;
    });
    this.projectsService.getRegions().subscribe((regions) => {
      this.regions = regions;
    });
    this.projectsService.getCurrencies().subscribe((currencies) => {
      this.currencies = currencies;
    });
  }

  submitProduct(data:any) {
    this.projectsService.addProject(data.name, data.description, data.budget, data.isConfidential, data.currency, data.projectLead, data.category, data.region)
      .subscribe({
        next: () => {
        },
        error: (err) => {
          this.openSnackBar(err.error.message);
        }
      })
  }

  openSnackBar(message: string, action: string = 'Dismiss') {
    this._snackBar.open(message, action);
  }
}
