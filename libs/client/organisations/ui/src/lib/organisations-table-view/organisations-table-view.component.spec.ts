import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrganisationsTableViewComponent } from './organisations-table-view.component';

describe('ClientOrganisationsUiComponent', () => {
  let component: OrganisationsTableViewComponent;
  let fixture: ComponentFixture<OrganisationsTableViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganisationsTableViewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OrganisationsTableViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
