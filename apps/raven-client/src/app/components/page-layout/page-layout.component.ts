import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PageInfoHeaderComponent } from '../page-info-header/page-info-header.component';

@Component({
  selector: 'app-legacy-page-layout',
  standalone: true,
  imports: [CommonModule, PageInfoHeaderComponent],
  templateUrl: './page-layout.component.html',
  styleUrls: ['./page-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageLayoutComponent {}
