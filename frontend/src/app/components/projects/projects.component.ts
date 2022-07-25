import { Component, OnInit } from '@angular/core';
import { ProjectsService } from 'src/app/services/projects.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {
  projectNames: Array<string> = [];

  constructor(private projectsService: ProjectsService) { }

  ngOnInit(): void {
    this.projectNames = this.projectsService.getProjectNames();
  }

}
