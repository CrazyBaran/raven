import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PageInfoHeaderComponent } from './page-info-header.component';

describe('PageInfoHeaderComponent', () => {
  let component: PageInfoHeaderComponent;
  let fixture: ComponentFixture<PageInfoHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageInfoHeaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PageInfoHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
