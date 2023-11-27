import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FileTypeBadgeComponent } from './file-type-badge.component';

describe('FileTypeBadgeComponent', () => {
  let component: FileTypeBadgeComponent;
  let fixture: ComponentFixture<FileTypeBadgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileTypeBadgeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FileTypeBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
