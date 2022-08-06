import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BusinessCategory } from 'src/app/models/businessCategory';
import { Currency } from 'src/app/models/currency';
import { Project } from 'src/app/models/project';
import { ProjectStatus } from 'src/app/models/projectStatus';
import { Region } from 'src/app/models/region';
import { SortOption } from 'src/app/models/sortOption';
import { User } from 'src/app/models/user';
import { ProjectsService } from 'src/app/services/projects.service';

@Component({
  selector: 'app-projects-details',
  templateUrl: './projects-details.component.html',
  styleUrls: ['./projects-details.component.css']
})
export class ProjectsDetailsComponent implements OnInit {
  projects: Array<Project> | undefined;
  users: Array<User> | undefined;
  regions: Array<Region> | undefined;
  currencies: Array<Currency> | undefined;
  businessCategories: Array<BusinessCategory> | undefined;
  projectsStatuses: Array<ProjectStatus> | undefined;

  // Sorter
  sortCriteria: { criteria: string, ascending: boolean } = { criteria: 'id', ascending: false };

  // Filters
  filters: Array<string> = [];

  constructor(private projectsService: ProjectsService, private router: Router) { }

  ngOnInit(): void {
    this.projectsService.getProjects().subscribe({
      next: (projects) => {
        this.projects = projects;
      },
      error: (err) => {

      }
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
    this.projectsService.getBusinessCategories().subscribe((businessCategories) => {
      this.businessCategories = businessCategories;
    });
    this.projectsService.getProjectStatuses().subscribe((projectStatuses) => {
      this.projectsStatuses = projectStatuses
    })
  }

  getProjects() {
    let queryString = `?orderBy=${this.sortCriteria.criteria}&ascending=${this.sortCriteria.ascending}`
    if (this.filters.length > 0) {
      
      this.filters.map(filter => {
        queryString = queryString + `&${filter}=true`;
      })
    }

    this.projectsService.getProjects(queryString).subscribe((projects) => {
      this.projects = projects;
    });
  }

  sortBy(criteria: string) {
    if (this.sortCriteria.criteria !== criteria) {
      this.sortCriteria.criteria = criteria;
      this.sortCriteria.ascending = true;
    }
    else {
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

  applyFilters(event: any, filter: string) {
    event.stopPropagation();
    if (this.filters.includes(filter)) {
      this.filters = this.filters.filter(item => item != filter);
    }
    else {
      this.filters.push(filter);
    }
    this.getProjects();
  }

  goToProject(projectId: number) {
    this.projectsService.setSelectedProjectId(projectId);
    this.router.navigate(['project_details']);
  }

  getCurrency(currencyId: number) {
    return this.currencies?.find(item => item.id == currencyId)?.name;
  }

  getProjectStatus(statusId: number) {
    return this.projectsStatuses?.find(item => item.id == statusId)?.status;
  }

  getBusinessCategory(categoryId: number) {
    return this.businessCategories?.find(item => item.id == categoryId)?.type;
  }

  getRegion(regionId: number) {
    return this.regions?.find(item => item.id == regionId)?.name;
  }

  getProjectLead(userId: number) {
    return this.users?.find(item => item.id == userId)?.username;
  }
}