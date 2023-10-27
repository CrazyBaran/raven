import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TagsButtonGroupComponent } from './tags-button-group.component';

describe('TagsButtonGroupComponent', () => {
  let component: TagsButtonGroupComponent;
  let fixture: ComponentFixture<TagsButtonGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TagsButtonGroupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TagsButtonGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
