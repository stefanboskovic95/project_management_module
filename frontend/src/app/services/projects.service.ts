import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BusinessCategory } from '../models/businessCategory';
import { User } from '../models/user';
import { Project } from '../models/project';
import { Region } from '../models/region';
import { Currency } from '../models/currency';
import { ProjectStatus } from '../models/projectStatus';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  // TODO: User's department
  private departmentId = 1;
  private selectedProjectId: number = 0;

  constructor(private http: HttpClient) { }

  addProject(name: string, description: string, budget: number, isConfidential: boolean, currencyId: number,
    projectLeadId: number, businessCategoryId: number, regionId: number) {
    return this.http.post(`${environment.backend_url}/create_project`, {
      name,
      description,
      budget,
      isConfidential,
      regionId,
      currencyId,
      businessCategoryId,
      projectLeadId,
      departmentId: this.departmentId
    })
  }

  updateProjectStatus(projectId: number, projectStatusId: number) {
    return this.http.post(`${environment.backend_url}/update_project_status`, {
      projectId,
      projectStatusId
    })
  }

  getProjects() {
    return this.http.get<Array<Project>>(`${environment.backend_url}/projects`);
  }

  getProject(projectId: number) {
    return this.http.get<any>(`${environment.backend_url}/project?projectId=${projectId}`);
  }

  getBusinessCategories() {
    return this.http.get<Array<BusinessCategory>>(`${environment.backend_url}/business_categories`);
  }

  getUsersInDepartment(departmentId: number) {
    return this.http.get<Array<User>>(`${environment.backend_url}/department_officials?departmentId=${departmentId}`);
  }

  getRegions() {
    return this.http.get<Array<Region>>(`${environment.backend_url}/regions`);
  }

  getCurrencies() {
    return this.http.get<Array<Currency>>(`${environment.backend_url}/currencies`);
  }

  getProjectStatuses() {
    return this.http.get<Array<ProjectStatus>>(`${environment.backend_url}/project_statuses`);
  }

  getDepartmentId() {
    return this.departmentId;
  }

  setSelectedProjectId(projectId: number) {
    this.selectedProjectId = projectId;
  }

  getSelectedProjectId() {
    return this.selectedProjectId;
  }
}
