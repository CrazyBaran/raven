import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { Observable } from 'rxjs';
import { OpportunitiesRelatedNotesComponent } from './opportunities-related-notes.component';
import { selectOpportunitiesRelatedNotesViewModel } from './opportunities-related-notes.selectors';

describe('ClientOpportunitiesFeatureRelatedNotesComponent', () => {
  let component: OpportunitiesRelatedNotesComponent;
  let fixture: ComponentFixture<OpportunitiesRelatedNotesComponent>;
  let actions$: Observable<unknown>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OpportunitiesRelatedNotesComponent, HttpClientModule],
      providers: [
        provideMockActions(() => actions$),
        provideMockStore({
          selectors: [
            {
              selector: selectOpportunitiesRelatedNotesViewModel,
              value: {},
            },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OpportunitiesRelatedNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
