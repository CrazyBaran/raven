import { TestBed } from '@angular/core/testing';

import { HttpClientModule } from '@angular/common/http';
import { TagsService } from './tags.service';

describe('TagsService', () => {
  let service: TagsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
    });
    service = TestBed.inject(TagsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
