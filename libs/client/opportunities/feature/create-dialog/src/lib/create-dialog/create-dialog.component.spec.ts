import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { DialogRef } from '@progress/kendo-angular-dialog';
import { Observable } from 'rxjs';
import { CreateDialogComponent } from './create-dialog.component';
import { selectCreateOpportunityDialogViewModel } from './create-dialog.selectors';

describe('CreateDialogComponent', () => {
  let component: CreateDialogComponent;
  let fixture: ComponentFixture<CreateDialogComponent>;
  let actions$: Observable<unknown>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateDialogComponent],
      providers: [
        {
          provide: DialogRef,
          useValue: {} as DialogRef,
        },
        provideMockActions(() => actions$),
        provideMockStore({
          selectors: [
            {
              selector: selectCreateOpportunityDialogViewModel,
              value: {
                opportunityDropdown: {},
              },
            },
          ],
        }),
        provideAnimations(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
