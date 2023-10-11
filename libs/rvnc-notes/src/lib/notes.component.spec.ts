import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RvncNotesComponent } from './notes.component';

describe('RvncNotesComponent', () => {
  let component: RvncNotesComponent;
  let fixture: ComponentFixture<RvncNotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RvncNotesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RvncNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
