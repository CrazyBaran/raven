import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideMockStore } from '@ngrx/store/testing';
import { TagDropdownComponent } from './tag-dropdown.component';

describe('TagDropdownComponent', () => {
  let component: TagDropdownComponent;
  let fixture: ComponentFixture<TagDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TagDropdownComponent,
        BrowserAnimationsModule,
        HttpClientTestingModule,
      ],
      providers: [
        provideMockStore({
          selectors: [],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TagDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
