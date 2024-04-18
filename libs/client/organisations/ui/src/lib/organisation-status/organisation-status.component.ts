import { TitleCasePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
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
  public subName = input<string>();

  public statusName = computed(
    () =>
      `${this.titleCasePipe.transform(this.name())} ${
        this.subName() ? `(${this.subName()})` : ''
      }`,
  );

  private titleCasePipe = new TitleCasePipe();
}
