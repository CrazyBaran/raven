import { TestBed } from '@angular/core/testing';

import { HttpClientModule } from '@angular/common/http';
import { PipelinesService } from './pipelines.service';

describe('PipelinesService', () => {
  let service: PipelinesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
    });
    service = TestBed.inject(PipelinesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
