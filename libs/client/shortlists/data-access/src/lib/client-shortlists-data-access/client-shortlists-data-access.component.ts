import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'lib-client-shortlists-data-access',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './client-shortlists-data-access.component.html',
  styleUrl: './client-shortlists-data-access.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientShortlistsDataAccessComponent {}
