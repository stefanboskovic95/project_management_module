import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProcurementStatus } from 'src/app/models/procurementStatus';
import { ProjectItem } from 'src/app/models/ProjectItem';
import { ProjectsService } from 'src/app/services/projects.service';

@Component({
  selector: 'app-items-details',
  templateUrl: './items-details.component.html',
  styleUrls: ['./items-details.component.css']
})
export class ItemsDetailsComponent implements OnInit {
  projectItems: Array<ProjectItem> = [];
  statuses: Array<ProcurementStatus> = [];

  // Sorter
  sortCriteria: { criteria: string; ascending: boolean } = { criteria: 'id', ascending: false };

  // Filters
  filters: Array<{ name: string; value: string }> = [];

  constructor(private projectsService: ProjectsService, private router: Router) { }

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
  }

  getProjectItems() {
    const projectId = this.projectsService.getSelectedProjectId();
    let queryString = `?projectId=${projectId}&orderBy=${this.sortCriteria.criteria}&ascending=${this.sortCriteria.ascending}`;
    if (this.filters.length > 0) {
      this.filters.map((filter) => {
        queryString = queryString + `&${filter.name}=${filter.value}`;
      });
    }
    // if (this.findWhat !== '') {
    //   queryString = queryString + `&find=${this.findWhat}`;
    // }

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

  getItemStatus(statusId: number) {
    return this.statuses?.find((item) => item.id == statusId)?.status;
  }

}
