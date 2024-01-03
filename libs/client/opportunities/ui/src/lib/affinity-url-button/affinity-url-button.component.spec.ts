import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AffinityUrlButtonComponent } from './affinity-url-button.component';

describe('AffinityUrlButtonComponent', () => {
  let component: AffinityUrlButtonComponent;
  let fixture: ComponentFixture<AffinityUrlButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AffinityUrlButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AffinityUrlButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
