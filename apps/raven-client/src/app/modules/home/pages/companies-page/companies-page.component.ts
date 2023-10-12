import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { UnderConstructionComponent } from '../under-construction/under-construction.component';

@Component({
  selector: 'app-companies-page',
  standalone: true,
  imports: [CommonModule, UnderConstructionComponent],
  templateUrl: './companies-page.component.html',
  styleUrls: ['./companies-page.component.scss'],
})
export class CompaniesPageComponent {}
