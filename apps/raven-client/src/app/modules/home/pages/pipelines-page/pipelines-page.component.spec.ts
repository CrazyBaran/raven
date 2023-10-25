import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OpportunitiesFacade } from '@app/rvnc-opportunities/data-access';
import { provideMockStore } from '@ngrx/store/testing';
import { PipelinesPageComponent } from './pipelines-page.component';

describe('PipelinesPageComponent', () => {
  let component: PipelinesPageComponent;
  let fixture: ComponentFixture<PipelinesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PipelinesPageComponent, HttpClientModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [provideMockStore(), OpportunitiesFacade],
    }).compileComponents();

    fixture = TestBed.createComponent(PipelinesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
