import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OpportunitiesCardComponent } from './opportunities-card.component';

describe('OpportunitiesCardComponent', () => {
  let component: OpportunitiesCardComponent;
  let fixture: ComponentFixture<OpportunitiesCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OpportunitiesCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OpportunitiesCardComponent);
    component = fixture.componentInstance;

    component.data = {
      organisation: {
        name: 'Foo',
        domains: ['foo.com'],
      },
      stage: {
        id: '',
        displayName: '',
        order: 0,
        mappedFrom: '',
      },
      fields: [],
      id: '',
    };

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
