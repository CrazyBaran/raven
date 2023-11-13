import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuickFiltersTemplateComponent } from './quick-filters-template.component';

describe('QuickFiltersTemplateComponent', () => {
  let component: QuickFiltersTemplateComponent;
  let fixture: ComponentFixture<QuickFiltersTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuickFiltersTemplateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(QuickFiltersTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
