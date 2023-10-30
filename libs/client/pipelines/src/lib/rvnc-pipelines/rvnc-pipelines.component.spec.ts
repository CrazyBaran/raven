import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RvncPipelinesComponent } from './rvnc-pipelines.component';

describe('RvncPipelinesComponent', () => {
  let component: RvncPipelinesComponent;
  let fixture: ComponentFixture<RvncPipelinesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RvncPipelinesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RvncPipelinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
