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
  dropIdToStatusId: { [key: string]: number } = {
    'cdk-drop-list-0': 1, // draft
    'cdk-drop-list-1': 2, // draft
    'cdk-drop-list-2': 3, // draft
  }

  projectsDraft: Array<Project> = [];
  projectsDeliberation: Array<Project> = [];
  projectsAccepted: Array<Project> = [];

  constructor(private projectsService: ProjectsService, private router: Router) { }

  ngOnInit(): void {
    this.projectsService.getProjects(this.projectsService.getDepartmentId()).subscribe((projects) => {
      this.projectsDraft = projects.filter(project => project.projectStatusId == 1);
      this.projectsDeliberation = projects.filter(project => project.projectStatusId == 2);
      this.projectsAccepted = projects.filter(project => project.projectStatusId == 3);
    });
  }

  drop(event: CdkDragDrop<Project[]>) {
    const item = event.previousContainer.data[event.previousIndex];
    item.projectStatusId = this.dropIdToStatusId[event.container.id];
    this.projectsService.updateProjectStatus(item.id, this.dropIdToStatusId[event.container.id]).subscribe();

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
