import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-client-opportunities-api-organisations',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './client-opportunities-api-organisations.component.html',
  styleUrls: ['./client-opportunities-api-organisations.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientOpportunitiesApiOrganisationsComponent {}
