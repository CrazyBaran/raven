import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShortlistTableComponent } from './shortlist-table.component';

describe('ClientShortlistsUiComponent', () => {
  let component: ShortlistTableComponent;
  let fixture: ComponentFixture<ShortlistTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShortlistTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ShortlistTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
