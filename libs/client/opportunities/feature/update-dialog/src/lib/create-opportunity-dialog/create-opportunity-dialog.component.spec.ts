import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { DialogRef } from '@progress/kendo-angular-dialog';
import { Observable, from } from 'rxjs';
import { CreateOpportunityDialogComponent } from './create-opportunity-dialog.component';
import { selectCreateOpportunityDialogViewModel } from './create-opportunity-dialog.selectors';

describe('UpdateDialogComponent', () => {
  let component: CreateOpportunityDialogComponent;
  let fixture: ComponentFixture<CreateOpportunityDialogComponent>;
  let actions$: Observable<unknown>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateOpportunityDialogComponent],
      providers: [
        {
          provide: DialogRef,
          useValue: {} as DialogRef,
        },
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([]),
          },
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

    fixture = TestBed.createComponent(CreateOpportunityDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
