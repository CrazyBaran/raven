import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PageInfoHeaderComponent } from '../page-info-header/page-info-header.component';

@Component({
  selector: 'app-page-layout',
  standalone: true,
  imports: [CommonModule, PageInfoHeaderComponent],
  templateUrl: './page-layout.component.html',
  styleUrls: ['./page-layout.component.scss'],
})
export class PageLayoutComponent {}
