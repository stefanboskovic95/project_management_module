import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ProcurementStatus } from 'src/app/models/procurementStatus';
import { Project } from 'src/app/models/project';
import { ProjectItem } from 'src/app/models/ProjectItem';
import { ProjectsService } from 'src/app/services/projects.service';

@Component({
  selector: 'app-items-details',
  templateUrl: './items-details.component.html',
  styleUrls: ['./items-details.component.css'],
})
export class ItemsDetailsComponent implements OnInit {
  @Input()
  project: Project | undefined;
  projectItems: Array<ProjectItem> = [];
  statuses: Array<ProcurementStatus> = [];
  findFormControl: FormControl = new FormControl();
  findWhat: string = '';
  deleteTooltip: string = '';

  // Sorter
  sortCriteria: { criteria: string; ascending: boolean } = { criteria: 'id', ascending: false };

  // Filters
  filters: Array<{ name: string; value: string }> = [];

  constructor(private projectsService: ProjectsService, private router: Router, private _snackBar: MatSnackBar) {}

  ngOnInit(): void {
    const projectId = this.projectsService.getSelectedProjectId();
    this.projectsService.getProjectItems(`?projectId=${projectId}`).subscribe({
      next: (projectItems) => {
        this.projectItems = projectItems;
      },
      error: (err) => {},
    });
    this.projectsService.getProcurementStatuses().subscribe((statuses) => {
      this.statuses = statuses;
    });
    this.findFormControl.valueChanges.subscribe((val) => {
      this.findWhat = val;
      this.getProjectItems();
    });
  }

  getProjectItems() {
    const projectId = this.projectsService.getSelectedProjectId();
    let queryString = `?projectId=${projectId}&orderBy=${this.sortCriteria.criteria}&ascending=${this.sortCriteria.ascending}`;
    if (this.filters.length > 0) {
      this.filters.map((filter) => {
        queryString = queryString + `&${filter.name}=${filter.value}`;
      });
    }
    if (this.findWhat !== '') {
      queryString = queryString + `&find=${this.findWhat}`;
    }

    this.projectsService.getProjectItems(queryString).subscribe((projectItems) => {
      this.projectItems = projectItems;
    });
  }

  sortBy(criteria: string) {
    if (this.sortCriteria.criteria !== criteria) {
      this.sortCriteria.criteria = criteria;
      this.sortCriteria.ascending = true;
    } else {
      this.sortCriteria.ascending = !this.sortCriteria.ascending;
    }
    this.getProjectItems();
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
    this.getProjectItems();
  }

  findIdOrName() {
    // this.findWhat = form.value.find;
  }

  isSortedAscendingBy(criteria: string) {
    if (this.sortCriteria.criteria == criteria && this.sortCriteria.ascending == true) {
      return true;
    }
    return false;
  }

  goToProjectItem(itemId: number) {
    this.projectsService.setSelectedItemId(itemId);
    this.router.navigate(['/editItem']);
  }

  isDeleteDisabled(item: ProjectItem) {
    if ('In Progress' === item.status) {
      this.deleteTooltip = 'You cannot delete items in progress';
      return true;
    }
    if (!item.isEditable) {
      this.deleteTooltip = 'You do not have delete rights for this project';
      return true;
    }
    return false;
  }

  deleteProjectItem(item: ProjectItem) {
    if (this.isDeleteDisabled(item)) {
      return;
    }
    this.projectsService.deleteProjectItem(item.id).subscribe({
      next: () => {
        this.getProjectItems();
      },
      error: (err) => {
        this.openSnackBar(err.error.message);
      },
    });
  }

  getItemStatus(statusId: number) {
    return this.statuses?.find((item) => item.id == statusId)?.status;
  }

  openSnackBar(message: string, action: string = 'Dismiss') {
    this._snackBar.open(message, action);
  }
}
