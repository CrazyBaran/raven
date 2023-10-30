import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NoteStoreFacade } from '@app/client/notes/data-access';
import {
  NoteDetailsComponent,
  NotesTableComponent,
} from '@app/client/notes/ui';
import { OpportunitiesFacade } from '@app/client/opportunities/data-access';
import { HeaderComponent, LoaderComponent } from '@app/client/shared/ui';
import { Subject, filter, takeUntil } from 'rxjs';

@Component({
  selector: 'app-opportunity-details-page',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    LoaderComponent,
    NotesTableComponent,
    NoteDetailsComponent,
  ],
  templateUrl: './opportunity-details-page.component.html',
  styleUrls: ['./opportunity-details-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OpportunityDetailsPageComponent implements OnInit, OnDestroy {
  // TODO: REMOVE THAT PART TO A SEPARATE SERVICE
  public openNoteId = signal(null);

  // OPPORTUNITY INFO
  public readonly isLoadingOpportunityInfo$ =
    this.opportunitiesFacade.isLoading$;
  public readonly opportunityDetails$ = this.opportunitiesFacade.details$;

  // NOTES INFO
  public readonly notes$ = this.noteStoreFacade.notes$;
  public readonly isLoadingNotes$ = this.noteStoreFacade.isLoading$;

  private _ngUnsubscribe = new Subject<void>();

  public constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly opportunitiesFacade: OpportunitiesFacade,
    private readonly noteStoreFacade: NoteStoreFacade,
  ) {}

  public ngOnInit(): void {
    this.route.params
      .pipe(takeUntil(this._ngUnsubscribe))
      .subscribe(({ id }) => {
        if (id) {
          this.opportunitiesFacade.getOpportunityDetails(id);
        }
      });

    this.route.queryParams
      .pipe(takeUntil(this._ngUnsubscribe))
      .subscribe(({ noteId }) => {
        this.openNoteId.set(noteId);
      });

    this.opportunityDetails$
      .pipe(
        takeUntil(this._ngUnsubscribe),
        filter((details) => !!details),
      )
      .subscribe((details) => {
        const tagIds = details?.tag?.id || '';
        const domain = details?.organisation?.domains?.[0] || '';

        this.noteStoreFacade.getNotes(domain, tagIds);
      });
  }

  public handleClosePreview(): void {
    this.router.navigate([], {
      queryParams: {
        noteId: null,
      },
    });
  }

  public ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }
}
