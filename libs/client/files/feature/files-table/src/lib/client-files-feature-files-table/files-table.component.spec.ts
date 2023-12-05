import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ENVIRONMENT } from '@app/client/core/environment';
import { MsalService } from '@azure/msal-angular';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { Observable } from 'rxjs';
import {
  FilesTableComponent,
  selectFilesTableViewModel,
} from './files-table.component';

describe('ClientFilesFeatureFilesTableComponent', () => {
  let component: FilesTableComponent;
  let fixture: ComponentFixture<FilesTableComponent>;
  let actions$: Observable<unknown>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilesTableComponent, HttpClientModule],
      providers: [
        {
          provide: ENVIRONMENT,
          useValue: {},
        },
        {
          provide: MsalService,
          useValue: {},
        },
        provideMockActions(() => actions$),

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
