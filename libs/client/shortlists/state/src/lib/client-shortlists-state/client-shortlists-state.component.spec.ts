import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientShortlistsStateComponent } from './client-shortlists-state.component';

describe('ClientShortlistsStateComponent', () => {
  let component: ClientShortlistsStateComponent;
  let fixture: ComponentFixture<ClientShortlistsStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientShortlistsStateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ClientShortlistsStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
