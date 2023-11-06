import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-client-opportunities-feature-finacials',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './client-opportunities-feature-finacials.component.html',
  styleUrls: ['./client-opportunities-feature-finacials.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientOpportunitiesFeatureFinacialsComponent {}
