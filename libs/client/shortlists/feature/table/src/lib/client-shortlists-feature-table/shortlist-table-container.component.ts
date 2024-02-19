import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-shortlist-table-container',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shortlist-table-container.component.html',
  styleUrl: './shortlist-table-container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShortlistTableContainerComponent {}
