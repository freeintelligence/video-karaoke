import { TestBed } from '@angular/core/testing';

import { DisableScrollKeysService } from './disable-scroll-keys.service';

describe('DisableScrollKeysService', () => {
  let service: DisableScrollKeysService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DisableScrollKeysService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
