import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotepadTemplateComponent } from './notepad-template.component';

describe('NotepadTemplateComponent', () => {
  let component: NotepadTemplateComponent;
  let fixture: ComponentFixture<NotepadTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotepadTemplateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NotepadTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
