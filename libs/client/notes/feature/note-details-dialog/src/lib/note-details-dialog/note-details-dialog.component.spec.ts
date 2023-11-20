import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { NoteStoreFacade } from '@app/client/notes/data-access';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { WindowRef } from '@progress/kendo-angular-dialog';
import { Observable, from } from 'rxjs';
import { NoteDetailsDialogComponent } from './note-details-dialog.component';
import { selectNoteDetailsDialogViewModel } from './note-details-dialog.selectors';

describe('ClientNotesFeatureNoteDetailsDialogComponent', () => {
  let component: NoteDetailsDialogComponent;
  let fixture: ComponentFixture<NoteDetailsDialogComponent>;
  let actions$: Observable<unknown>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoteDetailsDialogComponent],
      providers: [
        NoteStoreFacade,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([]),
          },
        },
        {
          provide: WindowRef,
          useValue: {},
        },
        provideMockActions(() => actions$),
        provideMockStore({
          selectors: [
            {
              selector: selectNoteDetailsDialogViewModel,
              value: {},
            },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NoteDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
