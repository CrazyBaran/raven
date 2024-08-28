import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import {
  RelationStrengthColor,
  RelationStrengthName,
} from '@app/client/managers/data-access';
import { FundManagerRelationStrength } from 'rvns-shared';

@Component({
  selector: 'app-relationship-strength',
  standalone: true,
  templateUrl: './relationship-strength.component.html',
  styleUrl: './relationship-strength.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RelationshipStrengthComponent {
  public relationshipStrength = input.required<FundManagerRelationStrength>();

  public data = computed(() => ({
    name: RelationStrengthName[this.relationshipStrength()],
    color: RelationStrengthColor[this.relationshipStrength()],
  }));
}
