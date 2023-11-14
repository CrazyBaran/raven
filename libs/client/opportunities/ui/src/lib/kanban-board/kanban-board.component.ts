/* eslint-disable @angular-eslint/no-input-rename */
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  EventEmitter,
  Input,
  Output,
  signal,
} from '@angular/core';

import { RxFor } from '@rx-angular/template/for';

import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import {
  CdkFixedSizeVirtualScroll,
  CdkVirtualForOf,
  CdkVirtualScrollViewport,
} from '@angular/cdk/scrolling';
import { RxIf } from '@rx-angular/template/if';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import {
  BehaviorSubject,
  combineLatest,
  delay,
  distinctUntilChanged,
  filter,
  map,
  Observable,
  shareReplay,
  startWith,
  Subject,
  take,
} from 'rxjs';

import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { distinctUntilChangedDeep } from '@app/client/shared/util-rxjs';

import { PipelineDefinition } from '@app/client/pipelines/state';
import { concatLatestFrom } from '@ngrx/effects';
import { RxLet } from '@rx-angular/template/let';
import { RxPush } from '@rx-angular/template/push';
import * as _ from 'lodash';
import { OpportunitiesCardComponent } from '../opportunities-card/opportunities-card.component';
import {
  ColumnData,
  OpportunityDetails,
  OpportunityRow,
} from './kanban-board.interface';

@Component({
  selector: 'app-kanban-board',
  standalone: true,
  imports: [
    CommonModule,
    OpportunitiesCardComponent,
    RxFor,
    RxIf,
    CdkDropList,
    CdkDropListGroup,
    CdkDrag,
    InfiniteScrollModule,
    CdkFixedSizeVirtualScroll,
    CdkVirtualScrollViewport,
    CdkVirtualForOf,
    RxLet,
    RxPush,
  ],
  templateUrl: './kanban-board.component.html',
  styleUrls: ['./kanban-board.component.scss'],
  animations: [
    trigger('simpleFadeAnimation', [
      state('in', style({ opacity: 1 })),
      transition(':enter', [style({ opacity: 0 }), animate(600)]),
      transition(':leave', animate(600, style({ opacity: 0 }))),
    ]),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KanbanBoardComponent {
  @Output()
  public dragEndEvent = new EventEmitter<{
    pipelineStageId: string;
    opportunityId: string;
  }>();

  @Input() public opportunitiesDictionary$: Observable<
    _.Dictionary<OpportunityDetails>
  >;

  public searchQuery$ = new BehaviorSubject<string>('');

  public filteredOpportunitiesIds$ = this.searchQuery$.pipe(
    concatLatestFrom(() => this.opportunitiesDictionary$),
    map(([searchQuery, opportunitiesDictionary]) => {
      const opportunities = Object.values(opportunitiesDictionary);

      if (!searchQuery?.trim()) {
        return null;
      }

      return opportunities
        .filter(
          (o) =>
            o.organisation.name
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            o.organisation.domains.some((domain) =>
              domain.toLowerCase().includes(searchQuery.toLowerCase()),
            ),
        )
        .map(({ id }) => id);
    }),
    startWith(null),
  );

  public opportunitiesStageSubjectDictioanry = {} as Record<
    string,
    BehaviorSubject<{ ids: string[]; withoutEmission?: boolean }>
  >;

  public pipelines = signal<PipelineDefinition[]>([], {
    equal: _.isEqual,
  });

  public infinityScrollDictionary = {} as Record<
    string,
    BehaviorSubject<number>
  >;

  public opportunitySubjectDictionary = {} as Record<
    string,
    BehaviorSubject<OpportunityDetails>
  >;

  public renderedItemsDictionary$ = new BehaviorSubject<string[]>([]);

  public updatedOpportunities$ = new BehaviorSubject<string[]>([]);

  public stages = computed(() => this.pipelines()[0]?.stages || []);

  public columns = computed(() =>
    this.stages().map((item, index): ColumnData => {
      return {
        name: item.displayName,
        id: item.id,
        color: {
          color: item.primaryColor,
          palette: item.secondaryColor,
        },
        length$: this.opportunitiesStageSubjectDictioanry[item.id].pipe(
          map((o) => o?.ids.length),
          distinctUntilChanged(),
        ),
        data$: this._getColumnData$(item.id),
        renderSubject: this._getRenderObserver(item.id),
        onceRendered$: this._getOnceRendered$(item.id),
      };
    }),
  );

  @Input() public set searchQuery(value: string | null) {
    this.searchQuery$.next(value ?? '');
  }

  @Input() public set opportunitiesStageDictionary(
    value: _.Dictionary<string[]>,
  ) {
    this.pipelines()[0].stages.forEach((stage) => {
      const key = stage.id;
      const ids = value[key] ?? [];
      let subject = this.opportunitiesStageSubjectDictioanry[key];
      if (!subject) {
        subject = new BehaviorSubject<{ ids: string[] }>({
          ids,
        });

        this.opportunitiesStageSubjectDictioanry[key] = subject;
      } else {
        const currrentIds = subject.value.ids;
        if (!_.isEqual(_.sortBy(currrentIds), _.sortBy(ids))) {
          const updatedOpportunities = _.difference(ids, currrentIds);

          updatedOpportunities.forEach((id) => {
            const opportunity = this.opportunitySubjectDictionary[id]?.value;
            if (opportunity) {
              this.opportunitySubjectDictionary[id].next({
                ...opportunity,
                state: 'updated',
              } as OpportunityDetails);
            }

            setTimeout(() => {
              const opportunity = this.opportunitySubjectDictionary[id]?.value;
              if (opportunity) {
                this.opportunitySubjectDictionary[id].next({
                  ...opportunity,
                  state: 'default',
                } as OpportunityDetails);
              }
            }, 1000);
          });

          if (updatedOpportunities.length > 0) {
            this.updatedOpportunities$.next([
              ...this.updatedOpportunities$.value,
              ...updatedOpportunities,
            ]);

            setTimeout(() => {
              this.updatedOpportunities$.next(
                this.updatedOpportunities$.value.filter(
                  (id) => !updatedOpportunities.includes(id),
                ),
              );
            }, 1000);
          }
          subject.next({ ids: ids });
        }
      }
    });
  }

  @Input({ required: true, alias: 'pipelines' })
  public set _pipelines(value: PipelineDefinition[]) {
    this.pipelines.set(value);
  }

  public drop(
    event: CdkDragDrop<{
      id: string;
      data: OpportunityRow[];
    }>,
  ): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data.data,
        event.previousIndex,
        event.currentIndex,
      );
    } else {
      const opportunityId = event.item.data.id;
      const pipelineStageId = event.container.data.id;
      this.dragEndEvent.emit({ pipelineStageId, opportunityId });

      transferArrayItem(
        event.previousContainer.data.data,
        event.container.data.data,
        event.previousIndex,
        event.currentIndex,
      );

      this.opportunitiesStageSubjectDictioanry[event.container.data.id].next({
        withoutEmission: true,
        ids: [
          ...this.opportunitiesStageSubjectDictioanry[event.container.data.id]
            .value.ids,
          event.item.data.id,
        ],
      });

      this.opportunitiesStageSubjectDictioanry[
        event.previousContainer.data.id
      ].next({
        withoutEmission: true,
        ids: [
          ...this.opportunitiesStageSubjectDictioanry[
            event.previousContainer.data.id
          ].value.ids.filter((id) => id !== event.item.data.id),
        ],
      });
    }
  }

  public onInfinityScroll(columnId: string): void {
    const columnScrollBehavior = this.infinityScrollDictionary[columnId];
    if (columnScrollBehavior) {
      columnScrollBehavior.next(columnScrollBehavior.value + 1);
    }
  }

  private _getColumnData$(columnId: string): Observable<OpportunityRow[]> {
    let columnScrollBehavior = this.infinityScrollDictionary[columnId];

    if (!columnScrollBehavior) {
      columnScrollBehavior = new BehaviorSubject<number>(1);

      this.infinityScrollDictionary = {
        ...this.infinityScrollDictionary,
        [columnId]: columnScrollBehavior,
      };
    }

    const offset$ = columnScrollBehavior.pipe(
      map((scrollIndex) => {
        return (scrollIndex || 1) * 10;
      }),
      distinctUntilChangedDeep({ ignoreOrder: true }),
    );

    return combineLatest([
      offset$,
      this.opportunitiesStageSubjectDictioanry[columnId]?.pipe(
        filter(({ withoutEmission }) => !withoutEmission),
        map(({ ids }) => ({ ids })),
      ),
      this.filteredOpportunitiesIds$,
    ]).pipe(
      map(([offset, opportunityIds, filteredOpportunitiesIds]) => {
        return opportunityIds?.ids
          .filter(
            (id) =>
              !filteredOpportunitiesIds ||
              filteredOpportunitiesIds.includes(id),
          )
          .slice(0, offset)
          .map((id) => {
            let source$ = this.opportunitySubjectDictionary[id];

            if (!source$) {
              this.opportunitiesDictionary$
                .pipe(take(1))
                .subscribe((dictionary) => {
                  source$ = new BehaviorSubject<OpportunityDetails>(
                    dictionary[id],
                  );
                });

              this.opportunitySubjectDictionary = {
                ...this.opportunitySubjectDictionary,
                [id]: source$,
              };
            }

            return {
              id,
              source: source$,
            };
          });
      }),
      shareReplay(1),
    );
  }

  private _getRenderObserver(columnId: string): Subject<void> {
    const renderSubject = new Subject<void>();

    renderSubject.pipe(take(1)).subscribe(() => {
      this.renderedItemsDictionary$.next([
        ...this.renderedItemsDictionary$.value,
        columnId,
      ]);
    });

    return renderSubject;
  }

  private _getOnceRendered$(columnId: string): Observable<boolean> {
    return this.renderedItemsDictionary$.pipe(
      map((renderedItems) => {
        return renderedItems.includes(columnId);
      }),
      distinctUntilChanged(),
      delay(25),
    );
  }
}
