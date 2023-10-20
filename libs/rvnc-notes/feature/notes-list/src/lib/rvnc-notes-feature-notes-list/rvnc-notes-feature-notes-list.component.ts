import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HeaderComponent, LoaderComponent } from '@app/rvnc-core-ui';
import { NoteStoreFacadeService } from '@app/rvnc-notes/data-access';
import { NotesTableComponent, QuickFiltersComponent } from '@app/rvnc-notes/ui';
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
  ],
  templateUrl: './rvnc-notes-feature-notes-list.component.html',
  styleUrls: ['./rvnc-notes-feature-notes-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RvncNotesFeatureNotesListComponent implements OnInit, OnDestroy {
  public readonly isLoading$ = this.noteStoreFacadeService.isLoading$;
  public readonly notes$ = this.noteStoreFacadeService.notes$;

  private ngUnsubscribe = new Subject<void>();

  public constructor(
    private readonly noteStoreFacadeService: NoteStoreFacadeService,
    private readonly route: ActivatedRoute,
  ) {}

  public ngOnInit(): void {
    this.noteStoreFacadeService.getNotes();

    this.route.queryParams
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(({ noteId }) => {
        if (noteId) {
          console.log({ noteId });
        }
      });
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
