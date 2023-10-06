import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BadGatewayPageComponent } from './bad-gateway-page.component';

describe('BadGatewayPageComponent', () => {
  let component: BadGatewayPageComponent;
  let fixture: ComponentFixture<BadGatewayPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BadGatewayPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BadGatewayPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
