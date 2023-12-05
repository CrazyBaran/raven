import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ENVIRONMENT } from '@app/client/core/environment';
import { MsalService } from '@azure/msal-angular';
import { provideMockStore } from '@ngrx/store/testing';
import {
  FilesTableComponent,
  selectFilesTableViewModel,
} from './files-table.component';

describe('ClientFilesFeatureFilesTableComponent', () => {
  let component: FilesTableComponent;
  let fixture: ComponentFixture<FilesTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilesTableComponent],
      providers: [
        {
          provide: ENVIRONMENT,
          useValue: {},
        },
        {
          provide: MsalService,
          useValue: {},
        },
        provideMockStore({
          selectors: [
            {
              selector: selectFilesTableViewModel,
              value: {},
            },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FilesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
