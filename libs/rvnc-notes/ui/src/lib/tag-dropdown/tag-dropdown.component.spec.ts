import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TagDropdownComponent } from './tag-dropdown.component';

describe('TagDropdownComponent', () => {
  let component: TagDropdownComponent;
  let fixture: ComponentFixture<TagDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TagDropdownComponent, BrowserAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(TagDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
