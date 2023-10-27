import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { AclService } from './acl.service';

describe('AclService', () => {
  let service: AclService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
    });
    service = TestBed.inject(AclService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
