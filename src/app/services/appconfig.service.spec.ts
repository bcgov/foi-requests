import { TestBed } from '@angular/core/testing';

import { AppConfigService } from './appconfig.service';

describe('ConfigService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AppConfigService = TestBed.get(AppConfigService);
    expect(service).toBeTruthy();
  });
});
