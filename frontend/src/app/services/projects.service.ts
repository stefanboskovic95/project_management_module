import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BusinessCategory } from '../models/businessCategory';
import { User } from '../models/User';
import { Project } from '../models/project';
import { Region } from '../models/region';
import { Currency } from '../models/currency';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  // TODO: User's department
  private departmentId = 1;

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

  getProjectNames(departmentId: number) {
    return this.http.get<Array<Project>>(`${environment.backend_url}/get_projects?departmentId=${departmentId}`);
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

  getDepartmentId() {
    return this.departmentId;
  }
}
