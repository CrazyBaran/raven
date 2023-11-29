import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoteTypeBadgeComponent } from './note-type-badge.component';

describe('FileTypeBadgeComponent', () => {
  let component: NoteTypeBadgeComponent;
  let fixture: ComponentFixture<NoteTypeBadgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoteTypeBadgeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NoteTypeBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
