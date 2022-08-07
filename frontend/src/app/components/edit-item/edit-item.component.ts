import { Component, OnInit } from '@angular/core';
import { Currency } from 'src/app/models/currency';
import { Project } from 'src/app/models/project';
import { ProjectItem } from 'src/app/models/ProjectItem';
import { ProjectsService } from 'src/app/services/projects.service';

@Component({
  selector: 'app-edit-item',
  templateUrl: './edit-item.component.html',
  styleUrls: ['./edit-item.component.css']
})
export class EditItemComponent implements OnInit {
  project: Project | undefined;
  currencies: Array<Currency> = [];
  isEditing: boolean = false;
  item: ProjectItem | undefined;

  constructor(private projectsService: ProjectsService) { }

  ngOnInit(): void {
    this.projectsService.getProject(this.projectsService.getSelectedProjectId()).subscribe({
      next: (project) => {
        this.project = project;
      },
      error: (err) => {
        console.log(err);
      }
    });
    this.projectsService.getProjectItem(this.projectsService.getSelectedItemId()).subscribe({
      next: (item: ProjectItem) => {
        this.item = item;
      },
      error: (err: any) => {
        console.log(err);
      }
    });
    this.projectsService.getCurrencies().subscribe((currencies) => {
      this.currencies = currencies;
    });
  }

  submitItem(formData: any) {
    if (!this.item) {
      return;
    }
    this.projectsService.updateProjectItem(
      this.item.id,
      formData.name,
      formData.subject,
      formData.cost,
      formData.isNdaSigned,
      formData.procurementStatusId).subscribe(() => {
        this.isEditing = false;
      })
  }

}
