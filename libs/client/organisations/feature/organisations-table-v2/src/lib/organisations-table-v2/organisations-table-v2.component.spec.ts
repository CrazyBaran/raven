import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrganisationsTableV2Component } from './organisations-table-v2.component';

describe('OrganisationsTableV2Component', () => {
  let component: OrganisationsTableV2Component;
  let fixture: ComponentFixture<OrganisationsTableV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganisationsTableV2Component],
    }).compileComponents();

    fixture = TestBed.createComponent(OrganisationsTableV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
