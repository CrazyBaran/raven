import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';
import { from } from 'rxjs';
import { OrganisationsTableComponent } from './organisations-table.component';
import { selectOrganisationsTableViewModel } from './organisations-table.selectors';

describe('ClientOrganisationsFeatureOrganisationsTableComponent', () => {
  let component: OrganisationsTableComponent;
  let fixture: ComponentFixture<OrganisationsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganisationsTableComponent],
      providers: [
        provideAnimations(),
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([]),
          },
        },
        provideMockStore({
          selectors: [
            {
              selector: selectOrganisationsTableViewModel,
              value: {
                queryModel: {},
                query: {},
              },
            },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OrganisationsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
