import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { from } from 'rxjs';
import { TextBoxNavigationComponent } from './text-box-navigation.component';

describe('TextBoxNavigationComponent', () => {
  let component: TextBoxNavigationComponent;
  let fixture: ComponentFixture<TextBoxNavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextBoxNavigationComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([]),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TextBoxNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
