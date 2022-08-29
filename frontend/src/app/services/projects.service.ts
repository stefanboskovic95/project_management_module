import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { User } from '../models/user';
import { Project } from '../models/project';
import { Currency } from '../models/currency';
import { ProjectItem } from '../models/ProjectItem';
import { ProcurementStatus } from '../models/procurementStatus';
import { Department } from '../models/department';

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {

  constructor(private http: HttpClient) {}

  addProject(
    name: string,
    description: string,
    budget: number,
    isConfidential: boolean,
    nda: string,
    currencyId: number,
    projectLeadId: number,
    businessCategory: number,
    region: string,
    country: string
  ) {
    return this.http.post(`${environment.backend_url}/project`, {
      name,
      description,
      budget,
      isConfidential,
      nda,
      country,
      region,
      currencyId,
      businessCategory,
      projectLeadId,
    });
  }

  updateProjectStatus(projectId: number, status: string) {
    return this.http.patch(`${environment.backend_url}/project/status`, {
      projectId,
      status,
    });
  }

  updateProject(
    projectId: number,
    name: string,
    description: string,
    budget: number,
    isConfidential: boolean,
    nda: string,
    currencyId: number,
    projectLeadId: number,
    businessCategory: string,
    country: string,
    region: string,
    status: string
  ) {
    return this.http.put(`${environment.backend_url}/project`, {
      projectId,
      name,
      description,
      budget,
      isConfidential,
      nda,
      country,
      region,
      currencyId,
      businessCategory,
      projectLeadId,
      status,
    });
  }

  addProjectItem(
    projectId: number,
    name: string,
    subject: string,
    cost: number,
    isNdaSigned: boolean,
    currencyId: number
  ) {
    return this.http.post(`${environment.backend_url}/project/item`, {
      projectId,
      name,
      subject,
      cost,
      isNdaSigned,
      currencyId,
    });
  }

  updateProjectItem(
    itemId: number,
    name: string,
    subject: string,
    cost: number,
    assignee: string,
    isNdaSigned: boolean,
    status: number
  ) {
    return this.http.put(`${environment.backend_url}/project/item`, {
      itemId,
      name,
      subject,
      cost,
      assignee,
      isNdaSigned,
      status,
    });
  }

  updateProjectItemStatus(itemId: number, status: string) {
    return this.http.patch(`${environment.backend_url}/project/item`, {
      itemId,
      status,
    });
  }

  deleteProject(projectId: number) {
    return this.http.delete(`${environment.backend_url}/project?projectId=${projectId}`);
  }

  deleteProjectItem(itemId: number) {
    return this.http.delete(`${environment.backend_url}/project/item?itemId=${itemId}`);
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

  getProjectItems(queryString: string) {
    return this.http.get<Array<ProjectItem>>(`${environment.backend_url}/project/items${queryString}`);
  }

  getBusinessCategories() {
    return this.http.get<Array<string>>(`${environment.backend_url}/project/category`);
  }

  getDepartmentOfficials() {
    return this.http.get<Array<User>>(`${environment.backend_url}/department/officials`);
  }

  getUsersInDepartment() {
    return this.http.get<Array<User>>(`${environment.backend_url}/department/users`);
  }

  getDepartments() {
    return this.http.get<Array<Department>>(`${environment.backend_url}/department`);
  }

  getRegions() {
    return this.http.get<Array<string>>(`${environment.backend_url}/project/regions`);
  }

  getCurrencies() {
    return this.http.get<Array<Currency>>(`${environment.backend_url}/currencies`);
  }

  getProjectStatuses() {
    return this.http.get<Array<string>>(`${environment.backend_url}/project/status`);
  }

  getProcurementStatuses() {
    return this.http.get<Array<ProcurementStatus>>(`${environment.backend_url}/project/items/status`);
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
