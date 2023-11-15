import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientOpportunitiesApiOrganisationsComponent } from './client-opportunities-api-organisations.component';

describe('ClientOpportunitiesApiOrganisationsComponent', () => {
  let component: ClientOpportunitiesApiOrganisationsComponent;
  let fixture: ComponentFixture<ClientOpportunitiesApiOrganisationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientOpportunitiesApiOrganisationsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(
      ClientOpportunitiesApiOrganisationsComponent,
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
