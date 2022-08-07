import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ProjectsService } from 'src/app/services/projects.service';
import { BusinessCategory } from 'src/app/models/businessCategory';
import { Currency } from 'src/app/models/currency';
import { Region } from 'src/app/models/region';
import { User } from 'src/app/models/user';
import { Project } from 'src/app/models/project';
import { ProjectStatus } from 'src/app/models/projectStatus';

@Component({
  selector: 'app-edit-project',
  templateUrl: './edit-project.component.html',
  styleUrls: ['./edit-project.component.css']
})
export class EditProjectComponent implements OnInit {
  businessCategories: Array<BusinessCategory> = [];
  users: Array<User> = [];
  regions: Array<Region> = [];
  isConfidential: boolean = false;
  currencies: Array<Currency> = [];
  project: Project | undefined;
  statuses: Array<ProjectStatus> = [];
  isEditing: boolean = false;
  nda: string = ''


  constructor(private projectsService: ProjectsService) { }

  ngOnInit(): void {
    this.getProject();
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
    this.projectsService.getProjectStatuses().subscribe((statuses) => {
      this.statuses = statuses;
    })
  }

  editProject(data: any) {
    if (!this.project) {
      return;
    }

    this.projectsService.updateProject(this.project.id, data.name, data.description, data.budget, data.isConfidential, this.nda, 
      data.currencyId, data.userId, data.categoryId, data.country, data.regionId, data.statusId)
    .subscribe({
      next: () => {
        this.getProject();
        this.isEditing = false;
      },
      error: (err) => {
        console.log(err);
        // this.openSnackBar(err.error.message);
      }
    });
  }

  getProject() {
    this.projectsService.getProject(this.projectsService.getSelectedProjectId()).subscribe((project) => {
      this.project = project;
      this.isConfidential = project.isConfidential;
      this.nda = this.project?.nda ? this.project.nda.text : '';
    });
  }

  isNdaDisabled() {
    if (this.isEditing && !this.isConfidential)
      return true;
    else if (!this.isEditing)
      return true;
    return false
  }

  getCurrency(currencyId: number = 1) {
    return this.currencies?.find(item => item.id == currencyId)?.name
  }

}
