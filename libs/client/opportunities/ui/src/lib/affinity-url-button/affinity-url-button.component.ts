import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { OpenInNewTabDirective } from '@app/client/shared/ui-directives';
import { ButtonModule } from '@progress/kendo-angular-buttons';

@Component({
  selector: 'app-affinity-url-button',
  standalone: true,
  imports: [CommonModule, ButtonModule, OpenInNewTabDirective],
  templateUrl: './affinity-url-button.component.html',
  styleUrl: './affinity-url-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AffinityUrlButtonComponent {
  public url = input.required<string>();

  public vertical = input<boolean>();
}
