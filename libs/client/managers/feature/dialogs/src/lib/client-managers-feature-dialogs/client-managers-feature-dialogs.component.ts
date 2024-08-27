import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'lib-client-managers-feature-dialogs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './client-managers-feature-dialogs.component.html',
  styleUrl: './client-managers-feature-dialogs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientManagersFeatureDialogsComponent {}
