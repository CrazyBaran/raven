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
  public readonly mainRoutes2: UiNavAsideRoute[] = [
    {
      name: 'Home Dashboard',
      path: '',
      icon: 'fa-sharp fa-solid fa-grid',
      exact: true,
    },
    {
      name: 'Companies',
      path: 'companies',
      icon: 'fa-solid fa-building',
      subRoutes: [
        {
          name: 'All Companies',
          path: 'companies',
          icon: 'fa-regular fa-cart-shopping',
        },
        {
          name: 'Shortlist',
          path: 'companies/shortlist',
          icon: 'fa-solid fa-check',
          disabled: true,
        },
        {
          name: 'Pipeline',
          path: 'companies/pipeline',
          icon: 'fa-regular fa-fire',
        },
        {
          name: 'portfolio',
          path: 'companies/portfolio',
          icon: 'fa-regular fa-house',
          disabled: true,
        },
      ],
    },
    {
      name: 'Investors',
      path: 'investors',
      icon: 'fa-solid fa-user-tie',
      disabled: true,
    },
    {
      name: 'Notes',
      path: 'notes',
      icon: 'fa-solid fa-notebook',
      subRoutes: [
        {
          name: 'All Notes',
          path: 'notes',
          icon: 'fa-solid fa-notebook',
        },
      ],
    },
    {
      name: 'Reminders',
      path: 'reminders',
      icon: 'fa-solid fa-alarm-clock',
      disabled: true,
    },
  ];
}
