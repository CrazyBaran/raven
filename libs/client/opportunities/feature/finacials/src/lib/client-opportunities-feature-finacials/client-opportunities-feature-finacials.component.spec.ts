import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientOpportunitiesFeatureFinacialsComponent } from './client-opportunities-feature-finacials.component';

describe('ClientOpportunitiesFeatureFinacialsComponent', () => {
  let component: ClientOpportunitiesFeatureFinacialsComponent;
  let fixture: ComponentFixture<ClientOpportunitiesFeatureFinacialsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientOpportunitiesFeatureFinacialsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(
      ClientOpportunitiesFeatureFinacialsComponent,
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
