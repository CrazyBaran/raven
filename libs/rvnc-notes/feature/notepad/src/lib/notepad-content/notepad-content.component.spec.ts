import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TemplatesStoreFacade } from '@app/rvnc-templates/data-access';
import { of } from 'rxjs';
import { NotepadContentComponent } from './notepad-content.component';

describe('NotepadContentComponent', () => {
  let component: NotepadContentComponent;
  let fixture: ComponentFixture<NotepadContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotepadContentComponent, BrowserAnimationsModule],
      providers: [
        {
          provide: TemplatesStoreFacade,
          useValue: {
            templates$: of([]),
            getTemplates: (): void => {
              return;
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NotepadContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
