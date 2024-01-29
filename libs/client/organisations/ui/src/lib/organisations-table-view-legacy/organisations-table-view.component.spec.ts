import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { from } from 'rxjs';
import { OrganisationsTableViewComponent } from './organisations-table-view.component';

describe('ClientOrganisationsUiComponent', () => {
  let component: OrganisationsTableViewComponent;
  let fixture: ComponentFixture<OrganisationsTableViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganisationsTableViewComponent],
      providers: [
        provideAnimations(),
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([]),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OrganisationsTableViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
