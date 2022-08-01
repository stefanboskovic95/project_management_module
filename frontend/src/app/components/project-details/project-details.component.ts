import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ProjectsService } from 'src/app/services/projects.service';
import { BusinessCategory } from 'src/app/models/businessCategory';
import { Currency } from 'src/app/models/currency';
import { Region } from 'src/app/models/region';
import { User } from 'src/app/models/user';
import { Project } from 'src/app/models/project';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.css']
})
export class ProjectDetailsComponent implements OnInit {
  businessCategories: Array<BusinessCategory> = [];
  users: Array<User> = [];
  regions: Array<Region> = [];
  isConfidential: boolean = false;
  currencies: Array<Currency> = [];
  project: Project | undefined;
  isEditing: boolean = false;
  nda: string = ''


  constructor(private projectsService: ProjectsService) { }

  ngOnInit(): void {
    this.projectsService.getProject(this.projectsService.getSelectedProjectId()).subscribe((project) => {
      this.project = project;
      console.log(project)
      this.isConfidential = project.isConfidential;
      this.nda = this.project?.nda ? this.project.nda.text : '';
    })
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

  editProduct(form: NgForm) {

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
