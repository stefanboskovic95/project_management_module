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
  styleUrls: ['./add-item.component.css']
})
export class AddItemComponent implements OnInit {
  project: Project | undefined;
  currencies: Array<Currency> = [];

  constructor(private projectsService: ProjectsService, private _snackBar: MatSnackBar, private router: Router) { }

  ngOnInit(): void {
    this.projectsService.getProject(this.projectsService.getSelectedProjectId()).subscribe({
      next: (project) => {
        this.project = project; 
      },
      error: () => {

      }
    });
    this.projectsService.getCurrencies().subscribe((currencies) => {
      this.currencies = currencies;
    });
  }

  submitItem(form: any) {
    if (!this.project) {
      return;
    }
    console.log(this.project.id, form.name, form.subject, form.cost, form.isNdaSigned, form.currency);
    this.projectsService.addProjectItem(this.project.id, form.name, form.subject, form.cost, form.isNdaSigned, form.currency).subscribe(() => {
      this._snackBar.open(`Added: "${form.name}".`, 'Dismiss');
      this.router.navigate(['/editProject']);
    });
  }

  openSnackBar(message: string, action: string = 'Dismiss') {
    this._snackBar.open(message, action);
  }
}
