import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PageInfoHeaderComponent } from '../../../../components/page-info-header/page-info-header.component';

@Component({
  selector: 'app-pipelines-page',
  standalone: true,
  imports: [CommonModule, PageInfoHeaderComponent],
  templateUrl: './pipelines-page.component.html',
  styleUrls: ['./pipelines-page.component.scss'],
})
export class PipelinesPageComponent {}
