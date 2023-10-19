import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { HeaderComponent, LoaderComponent } from '@app/rvnc-core-ui';
import { NoteStoreFacadeService } from '@app/rvnc-notes/data-access';
import { NotesTableComponent, QuickFiltersComponent } from '@app/rvnc-notes/ui';
import { FilterMenuModule } from '@progress/kendo-angular-grid';

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
export class RvncNotesFeatureNotesListComponent implements OnInit {
  public readonly isLoading$ = this.noteStoreFacadeService.isLoading$;
  public readonly notes$ = this.noteStoreFacadeService.notes$;

  public constructor(
    private readonly noteStoreFacadeService: NoteStoreFacadeService,
  ) {}

  public ngOnInit(): void {
    this.noteStoreFacadeService.getNotes();
  }
}
