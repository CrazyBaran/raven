import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { FundManagerData } from '@app/rvns-fund-managers';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { SkeletonModule } from '@progress/kendo-angular-indicators';

@Component({
  selector: 'app-manager-profile',
  standalone: true,
  imports: [SkeletonModule, ButtonModule],
  templateUrl: './manager-profile.component.html',
  styleUrl: './manager-profile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManagerProfileComponent {
  public isLoading = input(false);
  public manager = input<FundManagerData>();

  public editDetails = output();
}
