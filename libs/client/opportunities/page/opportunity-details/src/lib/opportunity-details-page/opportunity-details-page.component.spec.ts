import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NoteStoreFacade } from '@app/client/notes/data-access';
import { OpportunitiesFacade } from '@app/client/opportunities/data-access';
import { provideMockStore } from '@ngrx/store/testing';
import { OpportunityDetailsPageComponent } from './opportunity-details-page.component';

describe('OpportunityDetailsPageComponent', () => {
  let component: OpportunityDetailsPageComponent;
  let fixture: ComponentFixture<OpportunityDetailsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OpportunityDetailsPageComponent, RouterTestingModule],
      providers: [provideMockStore({}), OpportunitiesFacade, NoteStoreFacade],
    }).compileComponents();

    fixture = TestBed.createComponent(OpportunityDetailsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
