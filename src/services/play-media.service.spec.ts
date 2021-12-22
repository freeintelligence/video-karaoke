import { TestBed } from '@angular/core/testing';

import { PlayMediaService } from './play-media.service';

describe('PlayMediaService', () => {
  let service: PlayMediaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlayMediaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
