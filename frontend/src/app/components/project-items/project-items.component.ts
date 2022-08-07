import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { ProjectItem } from 'src/app/models/ProjectItem';
import { ProjectsService } from 'src/app/services/projects.service';

@Component({
  selector: 'app-project-items',
  templateUrl: './project-items.component.html',
  styleUrls: ['./project-items.component.css']
})
export class ProjectItemsComponent implements OnInit {
  draftProjectItems: Array<ProjectItem> = [];
  inProgressProjectItems: Array<ProjectItem> = [];
  completedProjectItems: Array<ProjectItem> = []

  constructor(private projectsService: ProjectsService) { }

  ngOnInit(): void {
    this.projectsService.getProjectItems(this.projectsService.getSelectedProjectId()).subscribe({
      next: (projectItems) => {
        console.log(projectItems)
        this.draftProjectItems = projectItems.filter(item => item.procurementStatusId == 1);
        this.inProgressProjectItems = projectItems.filter(item => item.procurementStatusId == 2);
        this.completedProjectItems = projectItems.filter(item => item.procurementStatusId == 3);
      },
      error: (err) => {

      }
    })
  }

  drop(event: CdkDragDrop<ProjectItem[]>) {
    const item = event.previousContainer.data[event.previousIndex];
    // item.projectStatusId = this.dropIdToStatusId[event.container.id];
    // this.projectsService.updateProjectStatus(item.id, this.dropIdToStatusId[event.container.id]).subscribe({
    //   next: () => { },
    //   error: (err) => {
    //     // Revert update
    //     this.swap(event, 'previousContainer', 'container');
    //     this.updateSwimLanes(event);

    //     console.log(err)
    //     this.openSnackBar(err.error.message, 'Dismiss')
    //   }
    // });
    // // To avoid flickering this is not done in next part of subscribe.
    // this.updateSwimLanes(event);
  }

  goToProjectItem(itemId: number) {
    
  }

}
