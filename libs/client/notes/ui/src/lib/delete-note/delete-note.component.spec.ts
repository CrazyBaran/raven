import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DialogRef } from '@progress/kendo-angular-dialog';
import { DeleteNoteComponent } from './delete-note.component';

describe('DeleteNoteComponent', () => {
  let component: DeleteNoteComponent;
  let fixture: ComponentFixture<DeleteNoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteNoteComponent],
      providers: [
        {
          provide: DialogRef,
          useValue: {},
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
