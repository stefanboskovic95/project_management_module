import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Project } from 'src/app/models/project';
import { ProjectItem } from 'src/app/models/ProjectItem';
import { ProjectsService } from 'src/app/services/projects.service';

@Component({
  selector: 'app-project-items',
  templateUrl: './items-overview.component.html',
  styleUrls: ['./items-overview.component.css'],
})
export class ItemsOverviewComponent implements OnInit {
  @Input()
  project: Project | undefined;
  draftProjectItems: Array<ProjectItem> = [];
  inProgressProjectItems: Array<ProjectItem> = [];
  completedProjectItems: Array<ProjectItem> = [];
  dropIdToStatus: { [key: string]: string } = {
    'list-0': 'Draft',
    'list-1': 'In Progress',
    'list-2': 'Completed',
  };
  addDisabledTooltip = '';

  constructor(private projectsService: ProjectsService, private router: Router, private _snackBar: MatSnackBar) {}

  ngOnInit(): void {
    const projectId = this.projectsService.getSelectedProjectId();
    this.projectsService.getProjectItems(`?projectId=${projectId}`).subscribe({
      next: (projectItems) => {
        this.draftProjectItems = projectItems.filter((item) => item.status === 'Draft');
        this.inProgressProjectItems = projectItems.filter((item) => item.status === 'In Progress');
        this.completedProjectItems = projectItems.filter((item) => item.status === 'Completed');
      },
      error: (err) => {},
    });
  }

  drop(event: CdkDragDrop<ProjectItem[]>) {
    const item = event.previousContainer.data[event.previousIndex];
    item.status = this.dropIdToStatus[event.container.id];
    this.projectsService.updateProjectItemStatus(item.id, this.dropIdToStatus[event.container.id]).subscribe({
      next: () => {},
      error: (err) => {
        console.log(err);
        // Revert update
        this.swap(event, 'previousContainer', 'container');
        this.updateSwimLanes(event);

        console.log(err);
        this.openSnackBar(err.error.message, 'Dismiss');
      },
    });
    // To avoid flickering this is not done in next part of subscribe.
    this.updateSwimLanes(event);
  }

  updateSwimLanes(event: CdkDragDrop<ProjectItem[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    }
  }

  isAddDisabled() {
    if (!this.project) {
      return true;
    }
    if (!this.project.isEditable) {
      this.addDisabledTooltip = 'You do not have access to this project';
      return true;
    }
    if (this.project.budget === 0 || !this.project.budget) {
      this.addDisabledTooltip = 'Project budget must be set before items can be added';
      return true;
    }
    return false;
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  goToAddItem() {
    if (this.isAddDisabled()) {
      return;
    }
    this.router.navigate(['/addItem']);
  }

  goToProjectItem(itemId: number) {
    this.projectsService.setSelectedItemId(itemId);
    this.router.navigate(['/editItem']);
  }

  swap(obj: any, key1: string, key2: string) {
    [obj[key1], obj[key2]] = [obj[key2], obj[key1]];
  }
}
