import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'lib-client-managers-utils',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './client-managers-utils.component.html',
  styleUrl: './client-managers-utils.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientManagersUtilsComponent {}
