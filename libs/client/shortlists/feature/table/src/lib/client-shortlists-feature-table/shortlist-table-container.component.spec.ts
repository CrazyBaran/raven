import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShortlistTableContainerComponent } from './shortlist-table-container.component';

describe('ClientShortlistsFeatureTableComponent', () => {
  let component: ShortlistTableContainerComponent;
  let fixture: ComponentFixture<ShortlistTableContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShortlistTableContainerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ShortlistTableContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
