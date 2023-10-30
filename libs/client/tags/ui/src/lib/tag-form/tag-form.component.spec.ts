import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DialogRef } from '@progress/kendo-angular-dialog';
import { TagFormComponent } from './tag-form.component';

describe('TagFormComponent', () => {
  let component: TagFormComponent;
  let fixture: ComponentFixture<TagFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TagFormComponent],
      providers: [
        {
          provide: DialogRef,
          useValue: {},
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TagFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
