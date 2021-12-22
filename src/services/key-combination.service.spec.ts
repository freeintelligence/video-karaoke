import { TestBed } from '@angular/core/testing';

import { KeyCombinationService } from './key-combination.service';

describe('KeyCombinationService', () => {
  let service: KeyCombinationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KeyCombinationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
