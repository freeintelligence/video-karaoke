import { TestBed } from '@angular/core/testing';

import { ConfigSettedGuard } from './config-setted.guard';

describe('ConfigSettedGuard', () => {
  let guard: ConfigSettedGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ConfigSettedGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
