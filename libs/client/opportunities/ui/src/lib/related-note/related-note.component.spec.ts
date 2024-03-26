import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RelatedNoteComponent } from './related-note.component';

describe('RelatedNoteComponent', () => {
  let component: RelatedNoteComponent;
  let fixture: ComponentFixture<RelatedNoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RelatedNoteComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RelatedNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
