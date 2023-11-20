import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import {
  OpportunitiesRelatedNotesComponent,
  selectOpportunitiesRelatedNotesViewModel,
} from './opportunities-related-notes.component';

describe('ClientOpportunitiesFeatureRelatedNotesComponent', () => {
  let component: OpportunitiesRelatedNotesComponent;
  let fixture: ComponentFixture<OpportunitiesRelatedNotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OpportunitiesRelatedNotesComponent, HttpClientModule],
      providers: [
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
