import { CurrencyPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { ThousandSuffixesPipe } from '@app/client/shared/ui-pipes';
import { FundManagerData } from '@app/rvns-fund-managers';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { SkeletonModule } from '@progress/kendo-angular-indicators';
import { CurrencySymbol } from 'rvns-shared';

@Component({
  selector: 'app-manager-profile',
  standalone: true,
  imports: [SkeletonModule, ButtonModule, CurrencyPipe, ThousandSuffixesPipe],
  templateUrl: './manager-profile.component.html',
  styleUrl: './manager-profile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManagerProfileComponent {
  public readonly currencySymbol = CurrencySymbol;

  public isLoading = input(false);
  public manager = input<FundManagerData>();

  public editDetails = output();
}
