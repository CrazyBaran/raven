import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { AccessDeniedPageComponent } from './access-denied-page.component';

describe('AccessDeniedPageComponent', () => {
  let component: AccessDeniedPageComponent;
  let fixture: ComponentFixture<AccessDeniedPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccessDeniedPageComponent, RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(AccessDeniedPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
