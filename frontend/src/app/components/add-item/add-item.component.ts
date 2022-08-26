import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Currency } from 'src/app/models/currency';
import { Project } from 'src/app/models/project';
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

  getCostInEur() {
    return this.cost * this.currenciesMap[this.selectedCurrencyId];
  }

  openSnackBar(message: string, action: string = 'Dismiss') {
    this._snackBar.open(message, action);
  }
}
