import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { from } from 'rxjs';
import { ButtongroupNavigationComponent } from './buttongroup-navigation.component';

describe('ButtongroupNavigationComponent', () => {
  let component: ButtongroupNavigationComponent;
  let fixture: ComponentFixture<ButtongroupNavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([]),
          },
        },
      ],
      imports: [ButtongroupNavigationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ButtongroupNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
