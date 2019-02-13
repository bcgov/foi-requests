import { TestBed } from '@angular/core/testing';

import { FoiRouterService } from './foi-router.service';

describe('FoiRouterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FoiRouterService = TestBed.get(FoiRouterService);
    expect(service).toBeTruthy();
  });
});
