import { Component, OnInit } from '@angular/core';
import { ProjectsService } from 'src/app/services/projects.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Router } from '@angular/router';
import { Project } from 'src/app/models/project';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {
  projectsDraft: Array<Project> = [];
  projectNamesDraft: Array<string> = [];
  projectsDeliberation: Array<Project> = [];
  projectNamesDeliberation: Array<string> = [];
  projectsAccepted: Array<Project> = [];
  projectNamesAccepted: Array<string> = [];

  constructor(private projectsService: ProjectsService, private router: Router) { }

  ngOnInit(): void {
    this.projectsService.getProjects(this.projectsService.getDepartmentId()).subscribe((projects) => {
      this.projectsDraft = projects.filter(project => project.projectStatusId == 1);
      this.projectNamesDraft = this.projectsDraft.map((project) => project.name);
      this.projectsDeliberation = projects.filter(project => project.projectStatusId == 2);
      this.projectNamesDeliberation = this.projectsDeliberation.map((project) => project.name);
      this.projectsAccepted = projects.filter(project => project.projectStatusId == 3);
      this.projectNamesAccepted = this.projectsAccepted.map(project => project.name);
    });
  }

  drop(event: CdkDragDrop<string[]>) {
    const item = event.previousContainer.data[event.previousIndex];
    console.log(item)
    console.log(event.container.id)
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }

  gotoNewProject() {
    this.router.navigate(['add_project']);
  }

}
