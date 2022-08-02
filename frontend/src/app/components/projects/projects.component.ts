import { Component, OnInit } from '@angular/core';
import { ProjectsService } from 'src/app/services/projects.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Router } from '@angular/router';
import { Project } from 'src/app/models/project';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {
  dropIdToStatusId: { [key: string]: number } = {
    'cdk-drop-list-0': 1, // draft
    'cdk-drop-list-1': 2, // deliberation
    'cdk-drop-list-2': 3, // accepted
    'cdk-drop-list-3': 4, // rejected
    'cdk-drop-list-4': 5, // completed
  }

  projectsDraft: Array<Project> = [];
  projectsDeliberation: Array<Project> = [];
  projectsAccepted: Array<Project> = [];
  projectsRejected: Array<Project> = [];
  projectsCompleted: Array<Project> = [];

  constructor(private userService:UserService, private projectsService: ProjectsService, private router: Router, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.projectsService.getProjects().subscribe((projects) => {
      this.projectsDraft = projects.filter(project => project.projectStatusId == 1);
      this.projectsDeliberation = projects.filter(project => project.projectStatusId == 2);
      this.projectsAccepted = projects.filter(project => project.projectStatusId == 3);
      this.projectsRejected = projects.filter(project => project.projectStatusId == 4);
      this.projectsCompleted = projects.filter(project => project.projectStatusId == 5);
    });
  }

  drop(event: CdkDragDrop<Project[]>) {
    const item = event.previousContainer.data[event.previousIndex];
    item.projectStatusId = this.dropIdToStatusId[event.container.id];
    this.projectsService.updateProjectStatus(item.id, this.dropIdToStatusId[event.container.id]).subscribe({
      next: () => { },
      error: (err) => {
        // Revert update
        this.swap(event, 'previousContainer', 'container');
        this.updateSwimLanes(event);

        console.log(err)
        this.openSnackBar(err.error.message, 'Dismiss')
      }
    });
    // To avoid flickering this is not done in next part of subscribe.
    this.updateSwimLanes(event);
  }

  updateSwimLanes(event: CdkDragDrop<Project[]>) {
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

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  goToAddProject() {
    this.router.navigate(['add_project']);
  }

  goToProject(projectId: number) {
    this.projectsService.setSelectedProjectId(projectId);
    this.router.navigate(['project_details']);
  }

  isAddProjectDisabled() {
    if (this.userService.getUserTypeId() == 1) {
      return true;
    }
    return false;
  }

  swap(obj: any, key1: string, key2: string) {
    [obj[key1], obj[key2]] = [obj[key2], obj[key1]];
  }
}
