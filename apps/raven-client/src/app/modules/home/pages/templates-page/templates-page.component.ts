import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PageLayoutComponent } from '../../../../components/page-layout/page-layout.component';
import { LogoComponent } from '../under-construction/logo.component';

@Component({
  selector: 'app-templates-page',
  standalone: true,
  imports: [CommonModule, LogoComponent, PageLayoutComponent],
  templateUrl: './templates-page.component.html',
  styleUrls: ['./templates-page.component.scss'],
})
export class TemplatesPageComponent {}
