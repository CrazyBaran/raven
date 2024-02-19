import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientShortlistsDataAccessComponent } from './client-shortlists-data-access.component';

describe('ClientShortlistsDataAccessComponent', () => {
  let component: ClientShortlistsDataAccessComponent;
  let fixture: ComponentFixture<ClientShortlistsDataAccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientShortlistsDataAccessComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ClientShortlistsDataAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
