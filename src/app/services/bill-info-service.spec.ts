import { TestBed } from '@angular/core/testing';

import { BillInfoService } from './bill-info-service';

describe('BillInfoService', () => {
  let service: BillInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BillInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
