import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { PipelinesPageComponent } from './pipelines-page.component';

describe('PipelinesPageComponent', () => {
  let component: PipelinesPageComponent;
  let fixture: ComponentFixture<PipelinesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PipelinesPageComponent, HttpClientModule],
      providers: [provideMockStore()],
    }).compileComponents();

    fixture = TestBed.createComponent(PipelinesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
