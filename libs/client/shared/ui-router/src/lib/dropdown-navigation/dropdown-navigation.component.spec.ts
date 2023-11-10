import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { from } from 'rxjs';
import { DropdownNavigationComponent } from './dropdown-navigation.component';

describe('DropdownNavigationComponent', () => {
  let component: DropdownNavigationComponent;
  let fixture: ComponentFixture<DropdownNavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DropdownNavigationComponent, BrowserAnimationsModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([]),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DropdownNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
