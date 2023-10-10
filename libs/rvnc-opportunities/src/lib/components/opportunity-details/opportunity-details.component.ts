import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OpportunityData } from '@app/rvns-opportunities';
import { Store } from '@ngrx/store';
import { GridModule } from '@progress/kendo-angular-grid';
import { IndicatorsModule } from '@progress/kendo-angular-indicators';
import { Subject, filter, takeUntil } from 'rxjs';
import { OpportunitiesActions } from '../../+state/opportunities.actions';
import {
  selectDetails,
  selectIsLoading,
} from '../../+state/opportunities.selectors';
import { OpportunityDealLeadFieldData } from './opportunitiy-details.interface';

@Component({
  selector: 'app-opportunity-details',
  standalone: true,
  imports: [CommonModule, IndicatorsModule, GridModule],
  templateUrl: './opportunity-details.component.html',
  styleUrls: ['./opportunity-details.component.scss'],
})
export class OpportunityDetailsComponent implements OnInit, OnDestroy {
  public readonly isLoading$ = this.store.select(selectIsLoading);
  public readonly details$ = this.store.select(selectDetails);

  public details: {
    field: string;
    value: string | null;
    additionalInfo?: string;
  }[] = [];

  private ngUnsubscribe = new Subject<void>();

  public constructor(
    public readonly store: Store,
    private readonly route: ActivatedRoute,
  ) {}

  public ngOnInit(): void {
    this.route.params.subscribe(({ id }) => {
      if (id) {
        this.store.dispatch(OpportunitiesActions.getOpportunityDetails({ id }));
      }
    });

    this.details$
      .pipe(
        takeUntil(this.ngUnsubscribe),
        filter((details) => !!details),
      )
      .subscribe((details) => {
        if (details) {
          this.prepareDetailsArr(details);
        }
      });
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();

    this.store.dispatch(OpportunitiesActions.clearOpportunityDetails());
  }

  protected prepareDetailsArr(details: OpportunityData): void {
    const name = details.organisation.name;
    const domain = details.organisation.domains.join(', ');
    const dealLead = details.fields.find(
      (field) => field.displayName === 'Deal Lead',
    );

    const dealLeadValue = `${
      (dealLead?.value as unknown as OpportunityDealLeadFieldData)[
        'first_name'
      ] || ''
    } ${
      (dealLead?.value as unknown as OpportunityDealLeadFieldData)[
        'last_name'
      ] || ''
    }`;
    const dealLeadEmail =
      (dealLead?.value as unknown as OpportunityDealLeadFieldData)[
        'primary_email'
      ] || '';

    this.details = [
      {
        field: 'Name',
        value: name,
      },
      {
        field: 'Domain',
        value: domain,
      },
      {
        field: 'Deal Lead',
        value: dealLeadValue,
        additionalInfo: dealLeadEmail,
      },
    ];
  }
}
