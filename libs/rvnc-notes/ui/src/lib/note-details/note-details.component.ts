import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { LoaderComponent } from '@app/rvnc-core-ui';
import { NoteStoreFacade } from '@app/rvnc-notes/data-access';
import {
  NoteFieldData,
  NoteFieldGroupsWithFieldData,
  NoteWithRelationsData,
} from '@app/rvns-notes/data-access';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { WindowModule } from '@progress/kendo-angular-dialog';
import { ExpansionPanelModule } from '@progress/kendo-angular-layout';
import { Subject, filter, takeUntil } from 'rxjs';

@Component({
  selector: 'app-note-details',
  standalone: true,
  imports: [
    CommonModule,
    WindowModule,
    LoaderComponent,
    ExpansionPanelModule,
    ButtonsModule,
  ],
  templateUrl: './note-details.component.html',
  styleUrls: ['./note-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NoteDetailsComponent implements OnInit, OnDestroy {
  @Input() public noteId: string | null;
  @Output() public closeWindow = new EventEmitter();

  public readonly mockedTags: { name: string; color: string }[] = [
    {
      name: 'Company tag',
      color: 'text-error',
    },
    {
      name: 'Industry tag',
      color: 'text-grey-500',
    },
    {
      name: 'Investor tag',
      color: 'text-warning',
    },
    {
      name: 'Business model tag',
      color: 'text-primary-500',
    },
  ];

  public noteDetails: NoteWithRelationsData | null = null;
  public noteFields: NoteFieldData[] = [];

  public readonly noteDetails$ = this.noteStoreFacade.noteDetails$;
  public readonly isLoading$ = this.noteStoreFacade.isLoadingNoteDetails$;

  private ngUnsubscribe = new Subject<void>();

  public constructor(private readonly noteStoreFacade: NoteStoreFacade) {}

  public ngOnInit(): void {
    if (this.noteId) {
      this.noteStoreFacade.getNoteDetails(this.noteId);
    }

    this.noteDetails$
      .pipe(
        takeUntil(this.ngUnsubscribe),
        filter((details) => !!details),
      )
      .subscribe((noteDetails) => {
        this.noteDetails = noteDetails;
        this.prepareAllNotes(noteDetails?.noteFieldGroups || []);
      });
  }

  public handleCloseWindow(): void {
    this.closeWindow.emit();
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private prepareAllNotes(notes: NoteFieldGroupsWithFieldData[]): void {
    this.noteFields = notes.reduce((res, curr) => {
      if (curr.noteFields.length) {
        return [...res, ...curr.noteFields];
      }
      return res;
    }, [] as NoteFieldData[]);
  }
}
