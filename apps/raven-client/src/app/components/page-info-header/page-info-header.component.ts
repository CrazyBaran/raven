import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-page-info-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './page-info-header.component.html',
  styleUrls: ['./page-info-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageInfoHeaderComponent {}
