import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { LogoComponent } from '../under-construction/logo.component';

@Component({
  selector: 'app-companies-page',
  standalone: true,
  imports: [CommonModule, LogoComponent],
  templateUrl: './companies-page.component.html',
  styleUrls: ['./companies-page.component.scss'],
})
export class CompaniesPageComponent {}
