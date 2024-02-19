import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'lib-client-shortlists-ui',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './client-shortlists-ui.component.html',
  styleUrl: './client-shortlists-ui.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientShortlistsUiComponent {}
