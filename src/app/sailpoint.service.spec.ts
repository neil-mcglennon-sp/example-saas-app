import { TestBed } from '@angular/core/testing';

import { SailPointService } from './sailpoint.service';

describe('SailpointService', () => {
  let service: SailPointService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SailPointService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
