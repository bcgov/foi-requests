import { waitForAsync, ComponentFixture, TestBed } from "@angular/core/testing";

import { LandingComponent } from "./landing.component";
import { BaseComponent } from "src/app/utils-components/base/base.component";
import { DataService } from "src/app/services/data.service";
import { MockDataService, MockRouter } from "../../MockClasses";
import { Router } from "@angular/router";
import { By } from "@angular/platform-browser";

describe("LandingComponent", () => {
  let component: LandingComponent;
  let fixture: ComponentFixture<LandingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [LandingComponent, BaseComponent],
      providers: [
        { provide: DataService, useClass: MockDataService },
        { provide: Router, useClass: MockRouter },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should load without the Panel, click should show it", () => {
    expect(component.showPanel).toBeFalsy();
    const continueButton: HTMLInputElement = fixture.nativeElement.querySelector(".btn-primary");
    continueButton.dispatchEvent(new Event("click"));
    fixture.detectChanges();

    expect(component.showPanel).toBeTruthy();
  });

  it("should show the Panel, click Continue and navigate", () => {
    let baseDebug = fixture.debugElement.queryAll(By.directive(BaseComponent));
    let base: BaseComponent = baseDebug[0].componentInstance;

    component.showInformationCollectPanel();
    fixture.detectChanges();

    spyOn(base, "goFoiForward").and.callThrough();
    const continueButton: HTMLInputElement = fixture.nativeElement.querySelector("#panel-continue-btn");
    continueButton.dispatchEvent(new Event("click"));
    fixture.detectChanges();

    expect(base.goFoiForward).toHaveBeenCalledTimes(1);
  });
});
