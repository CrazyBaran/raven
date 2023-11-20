import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { DialogRef } from '@progress/kendo-angular-dialog';
import { Observable, from } from 'rxjs';
import { UpdateDialogComponent } from './update-dialog.component';
import { selectCreateOpportunityDialogViewModel } from './update-dialog.selectors';

describe('UpdateDialogComponent', () => {
  let component: UpdateDialogComponent;
  let fixture: ComponentFixture<UpdateDialogComponent>;
  let actions$: Observable<unknown>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateDialogComponent],
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

    fixture = TestBed.createComponent(UpdateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
