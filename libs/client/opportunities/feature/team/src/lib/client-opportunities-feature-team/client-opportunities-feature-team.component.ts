import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-client-opportunities-feature-team',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './client-opportunities-feature-team.component.html',
  styleUrls: ['./client-opportunities-feature-team.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientOpportunitiesFeatureTeamComponent {}
