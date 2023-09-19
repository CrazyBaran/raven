import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent {
  public handleOpenDocumentationPage(): void {
    window.open('https://www.telerik.com/kendo-angular-ui', '_blank');
  }
}
