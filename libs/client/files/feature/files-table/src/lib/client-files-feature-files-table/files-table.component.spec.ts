import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FilesTableComponent } from './files-table.component';

describe('ClientFilesFeatureFilesTableComponent', () => {
  let component: FilesTableComponent;
  let fixture: ComponentFixture<FilesTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilesTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FilesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
