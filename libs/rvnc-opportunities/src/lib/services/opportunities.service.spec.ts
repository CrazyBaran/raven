import { TestBed } from '@angular/core/testing';

import { HttpClientModule } from '@angular/common/http';
import { OpportunitiesService } from './opportunities.service';

describe('OpportunitiesService', () => {
  let service: OpportunitiesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
    });
    service = TestBed.inject(OpportunitiesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
