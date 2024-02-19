import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientShortlistsUiComponent } from './client-shortlists-ui.component';

describe('ClientShortlistsUiComponent', () => {
  let component: ClientShortlistsUiComponent;
  let fixture: ComponentFixture<ClientShortlistsUiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientShortlistsUiComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ClientShortlistsUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
