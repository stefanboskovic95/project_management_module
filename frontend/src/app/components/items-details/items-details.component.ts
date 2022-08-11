import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProcurementStatus } from 'src/app/models/procurementStatus';
import { ProjectItem } from 'src/app/models/ProjectItem';
import { ProjectsService } from 'src/app/services/projects.service';

@Component({
  selector: 'app-items-details',
  templateUrl: './items-details.component.html',
  styleUrls: ['./items-details.component.css']
})
export class ItemsDetailsComponent implements OnInit {
  projectItems: Array<ProjectItem> = [];
  statuses: Array<ProcurementStatus> = [];

  constructor(private projectsService: ProjectsService, private router: Router) { }

  ngOnInit(): void {
    this.projectsService.getProjectItems(this.projectsService.getSelectedProjectId()).subscribe({
      next: (projectItems) => {
        this.projectItems = projectItems;
      },
      error: (err) => {},
    });
    this.projectsService.getProcurementStatuses().subscribe((statuses) => {
      this.statuses = statuses;
    });
  }

  getItemStatus(statusId: number) {
    return this.statuses?.find((item) => item.id == statusId)?.status;
  }

}
