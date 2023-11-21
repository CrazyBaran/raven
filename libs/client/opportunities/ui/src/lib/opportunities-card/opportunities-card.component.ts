/* eslint-disable @nx/enforce-module-boundaries */
//TODO: create model library

import { CommonModule } from '@angular/common';

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DealLeadsPipe } from '@app/client/shared/ui-pipes';
import { OpportunityData } from '@app/rvns-opportunities';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { RxIf } from '@rx-angular/template/if';
import { RxLet } from '@rx-angular/template/let';
import { RxUnpatch } from '@rx-angular/template/unpatch';

@Component({
  selector: 'app-opportunities-card',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RxIf,
    RxLet,
    DealLeadsPipe,
    RxUnpatch,
    ButtonsModule,
  ],
  templateUrl: './opportunities-card.component.html',
  styleUrls: ['./opportunities-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OpportunitiesCardComponent {
  @Input() public data: OpportunityData;

  public get affinityUrl(): string {
    return this.data?.organisation.affinityUrl ?? '';
  }

  public openAffinityUrl(): void {
    window.open(this.affinityUrl, '_blank');
  }
}
