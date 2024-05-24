import { TestBed } from "@angular/core/testing";

import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { TransomApiClientService } from "./transom-api-client.service";
import { NgxWebstorageModule } from "ngx-webstorage";

describe("TransomApiClientService", () => {
  let apiClient: TransomApiClientService;
  let httpTestingController: HttpTestingController;
  

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, NgxWebstorageModule.forRoot()],
      providers: []
    });
    apiClient = TestBed.get(TransomApiClientService);
    httpTestingController = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });

  it("should be created", () => {
    expect(apiClient).toBeTruthy();
  });

  it("should make foi request submissions", done => {
    const obs = apiClient.postFoiRequest({ requestData: { personalInfo: { foo: "bar" } }, attachments: [] });
    expect(obs).toBeTruthy();
    obs.subscribe(value => {
        expect(value).toBeTruthy();
        done();
      });

    const req = httpTestingController.expectOne('/api/v1/fx/submitFoiRequest');
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(jasmine.any(FormData));
    expect(req.request.body.get('requestData')).toEqual('{"personalInfo":{"foo":"bar"}}');
    
    req.flush({data:true});
  });

  it("can handle an error when making an foi request", done => {
    const obs = apiClient.postFoiRequest({ requestData: { personalInfo: { foo: "bar" } }, attachments: [] });
    expect(obs).toBeTruthy();
    obs.subscribe(value => {
        expect('not').toEqual('be here');
      },
      error => {
          expect(error).toBeTruthy();
          expect(error.statusText).toEqual('Not Found')
          done();
      });

    const req = httpTestingController.expectOne('/api/v1/fx/submitFoiRequest');
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(jasmine.any(FormData));
    expect(req.request.body.get('requestData')).toEqual('{"personalInfo":{"foo":"bar"}}');
    
    req.flush("Not Found on this api", { status: 403, statusText: 'Not Found' });
  });
});
