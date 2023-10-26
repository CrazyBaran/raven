import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NoteStoreFacade } from '@app/rvnc-notes/data-access';
import {
  NoteDetailsComponent,
  NotesTableComponent,
  QuickFiltersComponent,
} from '@app/rvnc-notes/ui';
import { HeaderComponent, LoaderComponent } from '@app/rvnc-shared/ui';
import { ShelfModule, ShelfStoreFacade } from '@app/rvnc-shelf';
import { DialogModule, WindowModule } from '@progress/kendo-angular-dialog';
import { FilterMenuModule } from '@progress/kendo-angular-grid';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-rvnc-notes-feature-notes-list',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    LoaderComponent,
    NotesTableComponent,
    FilterMenuModule,
    QuickFiltersComponent,
    ShelfModule,
    DialogModule,
    WindowModule,
    NoteDetailsComponent,
  ],
  templateUrl: './rvnc-notes-feature-notes-list.component.html',
  styleUrls: ['./rvnc-notes-feature-notes-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RvncNotesFeatureNotesListComponent implements OnInit, OnDestroy {
  public readonly isLoading$ = this.noteStoreFacadeService.isLoading$;
  public readonly notes$ = this.noteStoreFacadeService.notes$;

  public openNoteId = signal(null);

  private ngUnsubscribe = new Subject<void>();

  public constructor(
    private readonly noteStoreFacadeService: NoteStoreFacade,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly shelfFacade: ShelfStoreFacade,
  ) {}

  public ngOnInit(): void {
    this.noteStoreFacadeService.getNotes();

    this.route.queryParams
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(({ noteId }) => {
        this.openNoteId.set(noteId || null);
      });
  }

  public handleClosePreview(): void {
    this.router.navigate([], {
      queryParams: {
        noteId: null,
      },
    });
  }

  public handleOpenNotepad(): void {
    this.shelfFacade.openNotepad();
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
