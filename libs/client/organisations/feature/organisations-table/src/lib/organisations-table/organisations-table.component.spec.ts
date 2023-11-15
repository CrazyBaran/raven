import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { OrganisationsTableComponent } from './organisations-table.component';
import { selectOrganisationsTableViewModel } from './organisations-table.selectors';

describe('ClientOrganisationsFeatureOrganisationsTableComponent', () => {
  let component: OrganisationsTableComponent;
  let fixture: ComponentFixture<OrganisationsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganisationsTableComponent],
      providers: [
        provideMockStore({
          selectors: [
            {
              selector: selectOrganisationsTableViewModel,
              value: {},
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
