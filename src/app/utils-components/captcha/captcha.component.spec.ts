import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { CaptchaComponent } from "./captcha.component";
import { CaptchaDataService } from "src/app/services/captcha-data.service";
import { MockCaptchaDataService } from "../../MockClasses";
import { By } from "@angular/platform-browser";
import { Component } from "@angular/core";
import { of, Observable } from "rxjs";

@Component({
  template: `
    <captcha
      #captchaComponent
      [apiBaseUrl]="captchaApiBaseUrl"
      [nonce]="captchaNonce"
      (onValidToken)="onValidToken($event)"
      successMessage="You can submit your request now."
    >
    </captcha>
  `
})
class TestHostComponent {
  public captchaApiBaseUrl: string = "/api";
  public captchaNonce: string = "noncetest";
  constructor() {}

  onValidToken(event) {
    // console.log('do something');
  }
}

describe("CaptchaComponent", () => {
  let testComponent: TestHostComponent;
  let captchaComponent: CaptchaComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  let captchaComponentElements: any;
  let captchaComponentElement: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TestHostComponent, CaptchaComponent],
      providers: [{ provide: CaptchaDataService, useClass: MockCaptchaDataService }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestHostComponent);
    testComponent = fixture.componentInstance;
    let captchaComponentDebug = fixture.debugElement.queryAll(By.directive(CaptchaComponent));
    captchaComponent = captchaComponentDebug[0].componentInstance;

    //get dom element references
    captchaComponentElements = fixture.nativeElement.querySelectorAll("captcha");
    captchaComponentElement = captchaComponentElements[0];

    fixture.detectChanges();
  });

  it("should create", () => {
    expect(testComponent).toBeTruthy();
    expect(captchaComponent).toBeTruthy();
  });

  it("should validate an answer through the captcha data service", () => {
    const captchaDataService: CaptchaDataService = TestBed.get(CaptchaDataService);
    spyOn(captchaDataService, "verifyCaptcha").and.returnValue(of({ body: { valid: true } }));
    const answerInput: HTMLInputElement = captchaComponentElement.querySelector("input");

    // only 5 characters in input, no call expected
    answerInput.value = "mfht4";
    answerInput.dispatchEvent(new Event("input"));
    fixture.detectChanges();

    //now 6 characters in in put, make the call
    answerInput.value = "mfhtnj";
    answerInput.dispatchEvent(new Event("input"));
    fixture.detectChanges();

    expect(captchaDataService.verifyCaptcha).toHaveBeenCalledTimes(1);

    //validate that the given answer is used in the args
    expect(captchaDataService.verifyCaptcha).toHaveBeenCalledWith("/api", "noncetest", "mfhtnj", {}); //the mock class uses an empty object for the validation
  });

  it("should handle an incorrect answer", () => {
    const captchaDataService: CaptchaDataService = TestBed.get(CaptchaDataService);
    spyOn(captchaDataService, "verifyCaptcha").and.returnValue(of({ body: { valid: false } })); //answer will be incorrect :)
    spyOn(captchaDataService, "fetchData").and.callThrough();
    const answerInput: HTMLInputElement = captchaComponentElement.querySelector("input");

    //first validate that the 'invalid try again' message is *NOT* displayed
    const errorDivPre: HTMLInputElement = captchaComponentElement.querySelector(".captcha-error");
    expect(errorDivPre).toBeFalsy()

    //now 6 characters in input, make the call
    answerInput.value = "mfhtnj";
    answerInput.dispatchEvent(new Event("input"));
    fixture.detectChanges();

    expect(captchaDataService.verifyCaptcha).toHaveBeenCalledTimes(1);

    //a new catcha must have been called
    expect(captchaDataService.fetchData).toHaveBeenCalledTimes(1);

    //now validate that the 'invalid try again' message is displayed
    const errorDiv: HTMLInputElement = captchaComponentElement.querySelector(".captcha-error");
    expect(errorDiv.innerText).toEqual("Incorrect answer, please try again.");
  });

  it("should handle an error when verifying an answer", () => {

    const errorObs = new Observable(observer => {
      throw new Error("Yikes");
    });

    const captchaDataService: CaptchaDataService = TestBed.get(CaptchaDataService);
    spyOn(captchaDataService, "verifyCaptcha").and.returnValue(errorObs); //answer will be incorrect :)
    spyOn(captchaDataService, "fetchData").and.callThrough();
    const answerInput: HTMLInputElement = captchaComponentElement.querySelector("input");

    //first validate that the 'invalid try again' message is *NOT* displayed
    const errorDivPre: HTMLInputElement = captchaComponentElement.querySelector(".error-captcha");
    expect(errorDivPre).toBeFalsy()

    //now 6 characters in input, make the call
    answerInput.value = "mfhtnj";
    answerInput.dispatchEvent(new Event("input"));
    fixture.detectChanges();

    expect(captchaDataService.verifyCaptcha).toHaveBeenCalledTimes(1);

    //a new catcha must have been called
    expect(captchaDataService.fetchData).toHaveBeenCalledTimes(0);

    //now validate that the 'invalid try again' message is displayed
    const errorDiv: HTMLInputElement = captchaComponentElement.querySelector(".error-captcha");
    expect(errorDiv).toBeTruthy();
  });

  it("should handle an invalid response when verifying an answer", () => {

    const captchaDataService: CaptchaDataService = TestBed.get(CaptchaDataService);
    spyOn(captchaDataService, "verifyCaptcha").and.returnValue(of({ body: { bad: false } })); //answer will be invalid :)
    spyOn(captchaDataService, "fetchData").and.callThrough();
    const answerInput: HTMLInputElement = captchaComponentElement.querySelector("input");

    //first validate that the 'invalid try again' message is *NOT* displayed
    const errorDivPre: HTMLInputElement = captchaComponentElement.querySelector(".error-captcha");
    expect(errorDivPre).toBeFalsy()

    //now 6 characters in input, make the call
    answerInput.value = "mfhtnj";
    answerInput.dispatchEvent(new Event("input"));
    fixture.detectChanges();

    expect(captchaDataService.verifyCaptcha).toHaveBeenCalledTimes(1);

    //a new catcha must have been called
    expect(captchaDataService.fetchData).toHaveBeenCalledTimes(0);

    //now validate that the 'invalid try again' message is displayed
    const errorDiv: HTMLInputElement = captchaComponentElement.querySelector(".error-captcha");
    expect(errorDiv).toBeTruthy();
  });

  it("should handle an error retrieving a captcha", (done) => {

    const errorObs = new Observable(observer => {
      throw new Error("Yikes");
    });

    const captchaDataService: CaptchaDataService = TestBed.get(CaptchaDataService);
    spyOn(captchaDataService, "fetchData").and.returnValue(errorObs);
    const fetchLink: HTMLInputElement = captchaComponentElement.querySelector(".try-another-image");
    fetchLink.dispatchEvent(new Event("click"));
    fixture.detectChanges();
    // try another captcha handler uses a settimeout, so we have to use one here as well.
    setTimeout(() => {
      expect(captchaDataService.fetchData).toHaveBeenCalledTimes(1);
      const errorDiv: HTMLInputElement = captchaComponentElement.querySelector(".error-captcha");
  
      expect(errorDiv).toBeTruthy();
      done();
    }, 500)
    
    
  });

  it("should retrieve captcha audio", (done) => {
    const captchaDataService: CaptchaDataService = TestBed.get(CaptchaDataService);
    spyOn(captchaDataService, "fetchAudio").and.callThrough();
    
    captchaComponent.playAudio(false);

    expect(captchaDataService.fetchAudio).toHaveBeenCalledTimes(1);

    done();

  });

  afterEach(() => {
    delete window["ca.bcgov.captchaRefresh"];
  });
});
