import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OpportunitiesPageComponent } from './opportunities-page.component';

describe('OpportunitiesPageComponent', () => {
  let component: OpportunitiesPageComponent;
  let fixture: ComponentFixture<OpportunitiesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OpportunitiesPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OpportunitiesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
