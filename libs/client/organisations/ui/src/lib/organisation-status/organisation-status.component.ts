import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IsEllipsisActiveDirective } from '@app/client/shared/ui-directives';

@Component({
  standalone: true,
  selector: 'app-organisation-status',
  templateUrl: './organisation-status.component.html',
  imports: [IsEllipsisActiveDirective, TitleCasePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganisationStatusComponent {
  public color = input.required<string>();
  public name = input.required<string>();
}
