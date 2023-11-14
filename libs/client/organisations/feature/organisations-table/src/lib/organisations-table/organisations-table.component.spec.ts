import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrganisationsTableComponent } from './organisations-table.component';

describe('ClientOrganisationsFeatureOrganisationsTableComponent', () => {
  let component: OrganisationsTableComponent;
  let fixture: ComponentFixture<OrganisationsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganisationsTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OrganisationsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
