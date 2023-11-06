import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientOpportunitiesFeatureTeamComponent } from './client-opportunities-feature-team.component';

describe('ClientOpportunitiesFeatureTeamComponent', () => {
  let component: ClientOpportunitiesFeatureTeamComponent;
  let fixture: ComponentFixture<ClientOpportunitiesFeatureTeamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientOpportunitiesFeatureTeamComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ClientOpportunitiesFeatureTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
