import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Params, RouterLink } from '@angular/router';
import { TooltipModule } from '@progress/kendo-angular-tooltip';

@Component({
  standalone: true,
  selector: 'app-shortlist-button',
  templateUrl: './shortlist-button.component.html',
  imports: [RouterLink, TooltipModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShortlistButtonComponent {
  public isShortlisted = input(false);
  public queryParams = input.required<Params>();
}
