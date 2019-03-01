import { TestBed } from '@angular/core/testing';

import { DataService } from './data.service';
import { TransomApiClientService } from '../transom-api-client.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LocalStorageService } from 'ngx-webstorage';

class MockApiClient{

}
class MockLocalStorage{

}

describe('DataService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],
    providers: [
      {provide: TransomApiClientService, useClass: MockApiClient},
      {provide: LocalStorageService, useClass: MockLocalStorage}
    ]
  }));

  it('should be created', () => {
    const service: DataService = TestBed.get(DataService);
    expect(service).toBeTruthy();
  });
});
