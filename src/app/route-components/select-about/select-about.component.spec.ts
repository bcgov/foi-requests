import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { SelectAboutComponent } from "./select-about.component";
import { BaseComponent } from "src/app/utils-components/base/base.component";
import { FoiValidComponent } from "src/app/utils-components/foi-valid/foi-valid.component";
import { ReactiveFormsModule } from "@angular/forms";
import { DataService } from "src/app/services/data.service";
import { Router } from "@angular/router";
import { MockDataService, MockRouter } from "../../MockClasses";

describe("SelectAboutComponent", () => {
  let component: SelectAboutComponent;
  let fixture: ComponentFixture<SelectAboutComponent>;
  let dataService: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SelectAboutComponent, BaseComponent, FoiValidComponent],
      imports: [ReactiveFormsModule],
      providers: [{ provide: DataService, useClass: MockDataService }, { provide: Router, useClass: MockRouter }]
    }).compileComponents();
  }));

  beforeEach(() => {
    dataService = TestBed.get(DataService);
    spyOn(dataService, "getCurrentState").and.returnValue({
      requestData: {
        requestType: { requestType: "personal" },
        selectAbout: { yourself: null, child: null, another: null }
      }
    });

    fixture = TestBed.createComponent(SelectAboutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create 3 empty checkboxes and click each", () => {
    expect(component).toBeTruthy();

    const checkBoxes: HTMLInputElement[] = fixture.nativeElement.querySelectorAll("input");

    expect(checkBoxes.length).toBe(3);
    expect(checkBoxes[0].value).toEqual("yourself");
    expect(checkBoxes[1].value).toEqual("child");
    expect(checkBoxes[2].value).toEqual("another");
    expect(component.allowContinue()).toBeFalsy();

    // Click 0, 1, 2
    checkBoxes[0].click();
    fixture.detectChanges();
    expect(component.allowContinue()).toEqual("yourself");

    checkBoxes[1].click();
    fixture.detectChanges();
    expect(component.allowContinue()).toEqual("yourself-child");

    checkBoxes[2].click();
    fixture.detectChanges();
    expect(component.allowContinue()).toEqual("yourself-child-another");
  });

  it("should create and check 3 checkboxes then uncheck 'Child'", () => {
    const checkBoxes: HTMLInputElement[] = fixture.nativeElement.querySelectorAll("input");

    // Click 0, 1, 2, 1
    checkBoxes[0].click();
    checkBoxes[1].click();
    checkBoxes[2].click();
    checkBoxes[1].click(); // Uncheck Child!
    fixture.detectChanges();
    expect(component.allowContinue()).toEqual("yourself-another");
  });

  it("should check 'yourself', Submit goes enabled, click should record state", () => {
    const checkBoxes: HTMLInputElement[] = fixture.nativeElement.querySelectorAll("input");
    const continueButon: HTMLInputElement = fixture.nativeElement.querySelector(".btn-primary");
    expect(continueButon.disabled).toBeTruthy();

    spyOn(dataService, "setCurrentState").and.callThrough();

    checkBoxes[0].click(); // Click on Yourself
    fixture.detectChanges();

    expect(continueButon.disabled).toBeFalsy();
    continueButon.dispatchEvent(new Event("click"));
    fixture.detectChanges();

    expect(dataService.setCurrentState).toHaveBeenCalledTimes(1);

    const call = dataService.setCurrentState.calls.mostRecent();
    expect(call.args[0].requestData.selectAbout.yourself).toBeTruthy();
    expect(call.args[0].requestData.selectAbout.child).toBeFalsy();
    expect(call.args[0].requestData.selectAbout.another).toBeFalsy();
  });
});
