import { waitForAsync, ComponentFixture, TestBed } from "@angular/core/testing";
import { ReviewSubmitComponent } from "./review-submit.component";
import { BaseComponent } from "src/app/utils-components/base/base.component";
import { DataService } from "src/app/services/data.service";
import { Router } from "@angular/router";
import { MockDataService, MockRouter, MockCaptchaDataService } from "../../MockClasses";
import { CaptchaDataService } from "src/app/services/captcha-data.service";
import { CaptchaComponent } from "src/app/utils-components/captcha/captcha.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { of, Observable, throwError } from "rxjs";

describe("ReviewSubmitComponent", () => {
  let component: ReviewSubmitComponent;
  let fixture: ComponentFixture<ReviewSubmitComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ReviewSubmitComponent, BaseComponent, CaptchaComponent],
      imports: [FontAwesomeModule],
      providers: [
        { provide: DataService, useClass: MockDataService },
        { provide: Router, useClass: MockRouter },
        { provide: CaptchaDataService, useClass: MockCaptchaDataService },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewSubmitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should submit the request", () => {
    const dataService: any = TestBed.get(DataService);

    spyOn(dataService, "submitRequest").and.returnValue(of(true));
    component.doContinue();
    expect(dataService.submitRequest).toHaveBeenCalledTimes(1);
    expect(component).toBeTruthy();
  });

  it("should handle a submit error", () => {
    const dataService: any = TestBed.get(DataService);

    spyOn(dataService, "submitRequest").and.returnValue(throwError("that was bad"));
    spyOn(window, "alert");
    component.doContinue();
    expect(dataService.submitRequest).toHaveBeenCalledTimes(1);
    expect(window.alert).toHaveBeenCalledWith(
      "Temporarily unable to submit your request. Please try again in a few minutes."
    );
    expect(component).toBeTruthy();
  });
});
