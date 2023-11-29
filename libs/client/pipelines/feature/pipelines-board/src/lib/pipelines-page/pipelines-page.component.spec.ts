import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { OpportunitiesFacade } from '@app/client/opportunities/data-access';
import { provideMockStore } from '@ngrx/store/testing';
import { from } from 'rxjs';
import { PipelinesPageComponent } from './pipelines-page.component';
import {
  selectAllOpportunitiesDictionary,
  selectOportunitiesStageDictionary,
  selectPipelinesPageViewModel,
} from './pipelines-page.selectors';

describe('PipelinesPageComponent', () => {
  let component: PipelinesPageComponent;
  let fixture: ComponentFixture<PipelinesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PipelinesPageComponent, HttpClientModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [
        OpportunitiesFacade,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([]),
          },
        },
        provideMockStore({
          selectors: [
            {
              selector: selectPipelinesPageViewModel,
              value: {
                buttonGroups: {},
              },
            },
            {
              selector: selectAllOpportunitiesDictionary,
              value: {},
            },
            {
              selector: selectOportunitiesStageDictionary,
              value: {},
            },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PipelinesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
