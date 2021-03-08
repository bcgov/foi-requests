import { TestBed } from "@angular/core/testing";

import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { CaptchaDataService } from './captcha-data.service';

describe("CaptchaDataService", () => {
  let captchaDataService: CaptchaDataService;
  let httpTestingController: HttpTestingController;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CaptchaDataService]
    });
    captchaDataService = TestBed.get(CaptchaDataService);
    httpTestingController = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });

  it("should be created", () => {
    expect(captchaDataService).toBeTruthy();
  });

  it("should request a captcha image", done => {
    const obs = captchaDataService.fetchData('/api','nonce1')
    expect(obs).toBeTruthy();
    obs.subscribe(value => {
        expect(value).toBeTruthy();
        done();
      });

    const req = httpTestingController.expectOne('/api/captcha');
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual({ nonce: 'nonce1' });
    
    req.flush({data:'dummy content'});
  });

  it("should verify a captcha answer", done => {
    const obs = captchaDataService.verifyCaptcha('/api','nonce2','1234','!@#@#@$%')
    expect(obs).toBeTruthy();
    obs.subscribe(value => {
        expect(value).toBeTruthy();
        done();
      });

    const req = httpTestingController.expectOne('/api/captcha/verify');
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual({ nonce: 'nonce2',answer: '1234',validation: '!@#@#@$%' });
    
    req.flush({data:'dummy content'});
  });

  it("should request captcha audio", done => {
    const obs = captchaDataService.fetchAudio('/api','#$%$#','fr')
    expect(obs).toBeTruthy();
    obs.subscribe(value => {
        expect(value).toBeTruthy();
        done();
      });

    const req = httpTestingController.expectOne('/api/captcha/audio');
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual({ validation: '#$%$#', translation: 'fr' });
    
    req.flush({data:'dummy content'});
  });

});
