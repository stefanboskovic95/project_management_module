import { Component, OnInit } from '@angular/core';
import { BusinessCategory } from 'src/app/models/businessCategory';
import { Currency } from 'src/app/models/currency';
import { Project } from 'src/app/models/project';
import { ProjectStatus } from 'src/app/models/projectStatus';
import { Region } from 'src/app/models/region';
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
  sortNameAscending: boolean = true;

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

  sortByName() {
    this.sortNameAscending = !this.sortNameAscending;
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
