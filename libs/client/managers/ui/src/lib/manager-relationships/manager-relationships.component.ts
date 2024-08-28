import {
  ChangeDetectionStrategy,
  Component,
  effect,
  input,
  output,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RelationshipStrengthData } from '@app/client/managers/data-access';
import { FundManagerData } from '@app/rvns-fund-managers';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { SkeletonModule } from '@progress/kendo-angular-indicators';
import { LabelModule } from '@progress/kendo-angular-label';

interface DropdownOption {
  id: string;
  name: string;
}

@Component({
  selector: 'app-manager-relationships',
  standalone: true,
  imports: [
    SkeletonModule,
    ButtonModule,
    DropDownsModule,
    LabelModule,
    ReactiveFormsModule,
  ],
  templateUrl: './manager-relationships.component.html',
  styleUrl: './manager-relationships.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManagerRelationShipsComponent {
  public readonly relationshipStrengthData = RelationshipStrengthData;

  public isLoading = input(false);
  public manager = input<FundManagerData>();
  public peopleData = input<Array<DropdownOption>>([]);
  public peopleDataIsLoading = input(false);

  public updateRelationshipStrength = output<string>();
  public updateKeyRelationship = output<Array<string>>();

  public relationshipStrength = new FormControl<DropdownOption | undefined>(
    undefined,
  );
  public keyRelationship = new FormControl<Array<DropdownOption>>([]);

  private synchronizeFormControlsEffect = effect(() => {
    if (this.manager()?.relationStrength) {
      this.relationshipStrength.setValue(
        this.relationshipStrengthData.find(
          (el) => el.id === this.manager()!.relationStrength,
        ),
      );
    }

    if (this.manager()?.keyRelationships.length) {
      this.keyRelationship.setValue(this.manager()!.keyRelationships);
    }
  });

  public handleUpdateRelationshipStrength(option: DropdownOption): void {
    this.updateRelationshipStrength.emit(option.id);
  }

  public handleUpdateKeyRelationship(options: Array<DropdownOption>): void {
    this.updateKeyRelationship.emit(options.map((el) => el.id));
  }
}
