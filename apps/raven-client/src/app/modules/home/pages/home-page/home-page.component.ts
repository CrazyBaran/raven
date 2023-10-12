import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { UnderConstructionComponent } from '../under-construction/under-construction.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, UnderConstructionComponent],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent {}
