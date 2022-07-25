import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  private projectNames: Array<string> = ['Izrada pristupnih puteva ka mostu na Adi', 'Nuklearna elektrana "Mica Pecenjara".', 'Kosmodrom', 'Nabavka nosaca aviona za rijecnu flotilu'];

  constructor() { }

  getProjectNames() {
    return this.projectNames;
  }
}
