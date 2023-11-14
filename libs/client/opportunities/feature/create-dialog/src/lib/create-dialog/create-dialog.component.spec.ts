import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideMockStore } from '@ngrx/store/testing';
import { DialogRef } from '@progress/kendo-angular-dialog';
import { CreateDialogComponent } from './create-dialog.component';

describe('CreateDialogComponent', () => {
  let component: CreateDialogComponent;
  let fixture: ComponentFixture<CreateDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateDialogComponent],
      providers: [
        {
          provide: DialogRef,
          useValue: {} as DialogRef,
        },
        provideMockStore({}),
        provideAnimations(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
