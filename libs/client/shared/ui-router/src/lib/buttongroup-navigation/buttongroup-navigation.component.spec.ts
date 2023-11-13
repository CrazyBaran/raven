import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtongroupNavigationComponent } from './buttongroup-navigation.component';

describe('ButtongroupNavigationComponent', () => {
  let component: ButtongroupNavigationComponent;
  let fixture: ComponentFixture<ButtongroupNavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
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
