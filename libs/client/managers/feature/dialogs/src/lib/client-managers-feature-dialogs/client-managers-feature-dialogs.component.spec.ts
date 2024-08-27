import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientManagersFeatureDialogsComponent } from './client-managers-feature-dialogs.component';

describe('ClientManagersFeatureDialogsComponent', () => {
  let component: ClientManagersFeatureDialogsComponent;
  let fixture: ComponentFixture<ClientManagersFeatureDialogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientManagersFeatureDialogsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ClientManagersFeatureDialogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
