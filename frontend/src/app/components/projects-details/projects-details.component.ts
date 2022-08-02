import { Component, OnInit } from '@angular/core';
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
  sortNameAscending: boolean = false;
  sortIdAscending: boolean = false;
  sortBudgetAscending: boolean = false;
  sortBudgetUsedAscending: boolean = false;
  sortConfidentialAscending: boolean = false;
  sortStatusAscending: boolean = false;
  sortCategoryAscending: boolean = false;
  sortProjectLeadAscending: boolean = false;
  sortCountryAscending: boolean = false;
  sortRegionAscending: boolean = false;

  constructor(private projectsService: ProjectsService) { }

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

  sortById() {
    this.sortIdAscending = !this.sortIdAscending;
    this.projectsService.getProjects('id', this.sortIdAscending).subscribe((projects) => {
      this.projects = projects;
    });
  }

  sortByName() {
    this.sortNameAscending = !this.sortNameAscending;
    this.projectsService.getProjects('name', this.sortNameAscending).subscribe((projects) => {
      this.projects = projects;
    });
  }

  sortByBudget() {
    this.sortBudgetAscending = !this.sortBudgetAscending;
    this.projectsService.getProjects('budget', this.sortBudgetAscending).subscribe((projects) => {
      this.projects = projects;
    });
  }

  sortByBudgetUsed() {
    this.sortBudgetUsedAscending = !this.sortBudgetUsedAscending;
    this.projectsService.getProjects('totalCost', this.sortBudgetUsedAscending).subscribe((projects) => {
      this.projects = projects;
    });
  }

  sortByConfidentiality() {
    this.sortConfidentialAscending = !this.sortConfidentialAscending;
    this.projectsService.getProjects('isConfidential', this.sortConfidentialAscending).subscribe((projects) => {
      this.projects = projects;
    });
  }

  sortByProjectStatus() {
    this.sortStatusAscending = !this.sortStatusAscending;
    this.projectsService.getProjects('projectStatusId', this.sortStatusAscending).subscribe((projects) => {
      this.projects = projects;
    });
  }

  sortByCategory() {
    this.sortCategoryAscending = !this.sortCategoryAscending;
    this.projectsService.getProjects('businessCategoryId', this.sortCategoryAscending).subscribe((projects) => {
      this.projects = projects;
    });
  }

  sortByProjectLead() {
    this.sortProjectLeadAscending = !this.sortProjectLeadAscending;
    this.projectsService.getProjects('userId', this.sortProjectLeadAscending).subscribe((projects) => {
      this.projects = projects;
    });
  }

  sortByCountry() {
    this.sortCountryAscending = !this.sortCountryAscending;
    this.projectsService.getProjects('country', this.sortCountryAscending).subscribe((projects) => {
      this.projects = projects;
    });
  }

  sortByRegion() {
    this.sortRegionAscending = !this.sortRegionAscending;
    this.projectsService.getProjects('regionId', this.sortRegionAscending).subscribe((projects) => {
      this.projects = projects;
    });
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
