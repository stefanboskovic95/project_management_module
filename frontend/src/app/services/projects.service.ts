import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BusinessCategory } from '../models/businessCategory';
import { User } from '../models/user';
import { Project } from '../models/project';
import { Region } from '../models/region';
import { Currency } from '../models/currency';
import { ProjectStatus } from '../models/projectStatus';
import { ProjectItem } from '../models/ProjectItem';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  // TODO: User's department
  private departmentId = 1;
  private selectedProjectId: number = 0;

  constructor(private http: HttpClient) { }

  addProject(name: string, description: string, budget: number, isConfidential: boolean, nda: string, currencyId: number,
    projectLeadId: number, businessCategoryId: number, regionId: number, country: string) {
    return this.http.post(`${environment.backend_url}/project`, {
      name,
      description,
      budget,
      isConfidential,
      nda,
      country,
      regionId,
      currencyId,
      businessCategoryId,
      projectLeadId,
      departmentId: this.departmentId
    });
  }

  updateProjectStatus(projectId: number, projectStatusId: number) {
    return this.http.patch(`${environment.backend_url}/update_project_status`, {
      projectId,
      projectStatusId
    })
  }

  updateProject(projectId: number, name: string, description: string, budget: number, isConfidential: boolean,
    nda: string, currencyId: number, projectLeadId: number, businessCategoryId: number, country:string, regionId: number, statusId: number) {
    return this.http.put(`${environment.backend_url}/project`, {
      projectId,
      name,
      description,
      budget,
      isConfidential,
      nda,
      country,
      regionId,
      currencyId,
      businessCategoryId,
      projectLeadId,
      statusId,
      departmentId: this.departmentId
    });
  }

  addProjectItem(projectId: number, name: string, subject: string, cost: number, isNdaSigned: boolean, currencyId: number) {
    return this.http.post(`${environment.backend_url}/project/item`, {
      projectId,
      name,
      subject,
      cost,
      isNdaSigned,
      currencyId
    });
  }

  updateProjectItem(itemId: number, name: string, subject: string, cost: number, isNdaSigned: boolean, procurementStatusId: number) {
    return this.http.put(`${environment.backend_url}/project/item`, {
      itemId,
      name,
      subject,
      cost,
      isNdaSigned,
      procurementStatusId
    });
  }

  getProjectItem(itemId: number) {
    return this.http.get<ProjectItem>(`${environment.backend_url}/project/item?itemId=${itemId}`);
  }

  getProjects(queryString: string = '?orderBy=id&ascending=false') {
    return this.http.get<Array<Project>>(`${environment.backend_url}/projects${queryString}`);
  }

  getProject(projectId: number) {
    return this.http.get<any>(`${environment.backend_url}/project?projectId=${projectId}`);
  }

  getProjectItems(projectId: number) {
    return this.http.get<Array<ProjectItem>>(`${environment.backend_url}/project/items?projectId=${projectId}`);
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
    sessionStorage.setItem('selectedProjectId', projectId.toString());
  }

  getSelectedProjectId() {
    return Number(sessionStorage.getItem('selectedProjectId'));
  }

  setSelectedItemId(itemId: number) {
    sessionStorage.setItem('selectedItemId', itemId.toString());
  }

  getSelectedItemId() {
    return Number(sessionStorage.getItem('selectedItemId'));
  }
}
