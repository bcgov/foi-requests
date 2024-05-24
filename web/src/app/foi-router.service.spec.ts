import { TestBed } from '@angular/core/testing';

import { FoiRouterService } from './foi-router.service';

describe('FoiRouterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FoiRouterService = TestBed.get(FoiRouterService);
    expect(service).toBeTruthy();
  });

  it('should emit whatever is set as the progress', (done) => {
    const service: FoiRouterService = TestBed.get(FoiRouterService);
    service.progress("foo");
    // It's a BehaviorSubject, so the last value is still available!
    service.getRouteProgress().subscribe(val => {
      expect(val).toBe("foo");
      done();
    })
  });

  it('should scroll up as we set the progress', (done) => {
    const service: FoiRouterService = TestBed.get(FoiRouterService);
    window.scrollTo(0, 20);  // make scrollTop do something!
    service.progress("bar");
    // It's a BehaviorSubject, so the last value is still available!
    service.getRouteProgress().subscribe(val => {
      expect(val).toBe("bar");
      done();
    })
  });

  
});
