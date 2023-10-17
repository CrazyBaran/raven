import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DynamicRichTextComponent } from './dynamic-rich-text.component';

describe('DynamicRichTextComponent', () => {
  let component: DynamicRichTextComponent;
  let fixture: ComponentFixture<DynamicRichTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicRichTextComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DynamicRichTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
