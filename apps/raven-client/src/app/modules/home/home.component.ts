import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavAsideComponent } from '../../components/nav-aside/nav-aside.component';
import { UiNavAsideRoute } from '../../components/nav-aside/nav-aside.interface';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, NavAsideComponent, RouterOutlet],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  public readonly mainRoutes: UiNavAsideRoute[] = [
    {
      name: 'Pipeline',
      path: 'pipeline',
      icon: 'fa-regular fa-building',
    },
  ];
}
