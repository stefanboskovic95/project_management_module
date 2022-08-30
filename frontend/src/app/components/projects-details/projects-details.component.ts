import { Component, OnInit } from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Currency } from 'src/app/models/currency';
import { Project } from 'src/app/models/project';
import { User } from 'src/app/models/user';
import { ProjectsService } from 'src/app/services/projects.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-projects-details',
  templateUrl: './projects-details.component.html',
  styleUrls: ['./projects-details.component.css'],
})
export class ProjectsDetailsComponent implements OnInit {
  projects: Array<Project> = [];
  users: Array<User> = [];
  regions: Array<string> = [];
  currencies: Array<Currency> = [];
  businessCategories: Array<string> = [];
  projectsStatuses: Array<string> = [];
  distinctCountries: Array<string> = [];
  findFormControl: FormControl = new FormControl();
  findWhat: string = '';
  deleteTooltip: string = ''

  // Sorter
  sortCriteria: { criteria: string; ascending: boolean } = { criteria: 'id', ascending: false };

  // Filters
  filters: Array<{ name: string; value: string }> = [];

  constructor(private projectsService: ProjectsService, private router: Router, private _snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.projectsService.getProjects().subscribe({
      next: (projects) => {
        this.projects = projects;
        this.projects.forEach((project) => {
          if (!this.distinctCountries.includes(project.country)) {
            this.distinctCountries.push(project.country);
          }
        });
      },
      error: (err) => {},
    });
    this.projectsService.getDepartmentOfficials().subscribe((users) => {
      this.users = users;
    });
    this.projectsService.getRegions().subscribe((regions) => {
      this.regions = regions;
    });
    this.projectsService.getCurrencies().subscribe((currencies) => {
      this.currencies = currencies;
    });
    this.projectsService.getBusinessCategories().subscribe((businessCategories) => {
      this.businessCategories = businessCategories;
    });
    this.projectsService.getProjectStatuses().subscribe((projectStatuses) => {
      this.projectsStatuses = projectStatuses;
    });
    this.findFormControl.valueChanges.subscribe((val) => {
      this.findWhat = val;
      this.getProjects();
    });
  }

  getProjects() {
    let queryString = `?orderBy=${this.sortCriteria.criteria}&ascending=${this.sortCriteria.ascending}`;
    if (this.filters.length > 0) {
      this.filters.map((filter) => {
        queryString = queryString + `&${filter.name}=${filter.value}`;
      });
    }
    if (this.findWhat !== '') {
      queryString = queryString + `&find=${this.findWhat}`;
    }

    this.projectsService.getProjects(queryString).subscribe((projects) => {
      this.projects = projects;
    });
  }

  sortBy(criteria: string) {
    if (this.sortCriteria.criteria !== criteria) {
      this.sortCriteria.criteria = criteria;
      this.sortCriteria.ascending = true;
    } else {
      this.sortCriteria.ascending = !this.sortCriteria.ascending;
    }
    this.getProjects();
  }

  isSortedAscendingBy(criteria: string) {
    if (this.sortCriteria.criteria == criteria && this.sortCriteria.ascending == true) {
      return true;
    }
    return false;
  }

  applyFilters(event: any, filter: string, value = '') {
    event.stopPropagation();
    // Options for formatting query parameters to be sent in GET request.
    // Option 1: filter = filter
    if (
      this.filters.map((filter) => filter.name).includes(filter) &&
      this.filters.map((filter) => filter.value).includes(filter)
    ) {
      // Filter all entries that do not exactly match option 1
      this.filters = this.filters.filter((item) => item.name != filter || item.value != filter);
    }
    // Option 2: filter = value
    else if (
      this.filters.map((filter) => filter.name).includes(filter) &&
      this.filters.map((filter) => filter.value).includes(value)
    ) {
      // Filter all entries that do not exactly match option 2
      this.filters = this.filters.filter((item) => item.name != filter || item.value != value);
    } else {
      this.filters.push({ name: filter, value: value != '' ? value : filter });
    }
    this.getProjects();
  }

  goToProject(projectId: number) {
    this.projectsService.setSelectedProjectId(projectId);
    this.router.navigate(['editProject']);
  }

  goToProjectReport(project: Project) {
    if (project.status !== 'Completed') {
      return;
    }
    this.projectsService.setSelectedProjectId(project.id);
    this.router.navigate(['projectReport']);
  }

  isDeleteDisabled(project: Project) {
    if ('Accepted' === project.status) {
      this.deleteTooltip = 'You cannot delete projects in progress';
      return true;
    }
    if (!project.isEditable) {
      this.deleteTooltip = 'You do not have delete rights for this project';
      return true;
    }
    return false;
  }

  deleteProject(project: Project) {
    if (this.isDeleteDisabled(project)) {
      return;
    }

    this.projectsService.deleteProject(project.id).subscribe({
      next: (resp: any) => {
        this.openSnackBar(resp.message);
        this.getProjects();
      },
      error: (err: any) => {
        this.openSnackBar(err.error.message);
      },
    });
  }

  getCurrency(currencyId: number) {
    return this.currencies?.find((item) => item.id == currencyId)?.name;
  }

  getCountries() {
    return this.distinctCountries;
  }

  getProjectLead(userId: number) {
    return this.users?.find((item) => item.id == userId)?.username;
  }

  openSnackBar(message: string, action: string = 'Dismiss') {
    this._snackBar.open(message, action);
  }
}
