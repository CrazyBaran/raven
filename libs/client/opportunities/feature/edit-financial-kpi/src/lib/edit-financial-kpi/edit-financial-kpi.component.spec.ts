import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditFinancialKpiComponent } from './edit-financial-kpi.component';

describe('EditFinancialKpiComponent', () => {
  let component: EditFinancialKpiComponent;
  let fixture: ComponentFixture<EditFinancialKpiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditFinancialKpiComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EditFinancialKpiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
