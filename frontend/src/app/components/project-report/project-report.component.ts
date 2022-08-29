import { Component, OnInit } from '@angular/core';
import { Project } from 'src/app/models/project';
import { ProjectItem } from 'src/app/models/ProjectItem';
import { User } from 'src/app/models/user';
import { ProjectsService } from 'src/app/services/projects.service';

@Component({
  selector: 'app-project-report',
  templateUrl: './project-report.component.html',
  styleUrls: ['./project-report.component.css']
})
export class ProjectReportComponent implements OnInit {
  project: Project | undefined;
  projectItems: Array<ProjectItem> = [];
  departmentUsers: Array<User> = [];
  projectLeads: Array<User> = [];

  constructor(private projectsService: ProjectsService) { }

  ngOnInit(): void {
    this.projectsService.getProject(this.projectsService.getSelectedProjectId()).subscribe({
      next: (project) => {
        this.project = project;
        this.projectsService.getProjectItems(`?projectId=${project.id}&orderBy=completedAt&ascending=true`).subscribe({
          next: (projectItems) => {
            this.projectItems = projectItems;
          },
          error: (err) => {

          }
        })
      },
      error: (err) => {
        
      }
    });
    this.projectsService.getDepartmentOfficials().subscribe((users) => {
      this.projectLeads = users;
    });
    this.projectsService.getUsersInDepartment().subscribe((users) => {
      this.departmentUsers = users;
    });
  }

  getAssignee(userId: number) {
    const user = this.departmentUsers.find((user) => user.id == userId);
    if (user) {
      return `${user.firstName} ${user.lastName} (${user.username})`;
    }
    return '';
  }

  getProjectLead(userId: number) {
    const user = this.projectLeads.find((user) => user.id == userId);
    if (user) {
      return `${user.firstName} ${user.lastName} (${user.username})`;
    }
    return '';
  }

}
