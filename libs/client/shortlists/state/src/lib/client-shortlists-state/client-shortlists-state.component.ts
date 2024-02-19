import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'lib-client-shortlists-state',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './client-shortlists-state.component.html',
  styleUrl: './client-shortlists-state.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientShortlistsStateComponent {}
