import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientManagersUtilsComponent } from './client-managers-utils.component';

describe('ClientManagersUtilsComponent', () => {
  let component: ClientManagersUtilsComponent;
  let fixture: ComponentFixture<ClientManagersUtilsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientManagersUtilsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ClientManagersUtilsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
