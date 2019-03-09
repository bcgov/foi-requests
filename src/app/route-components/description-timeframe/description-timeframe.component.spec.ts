import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { DescriptionTimeframeComponent } from "./description-timeframe.component";
import { ReactiveFormsModule } from "@angular/forms";
import { DataService } from "src/app/services/data.service";
import { MockRouter } from "../../MockClasses";
import { Router } from "@angular/router";
import { FoiRequest } from "src/app/models/FoiRequest";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { NgxWebstorageModule } from "ngx-webstorage";
import { UtilsComponentsModule } from "src/app/utils-components/utils-components.module";

describe("DescriptionTimeframeComponent", () => {
  let component: DescriptionTimeframeComponent;
  let fixture: ComponentFixture<DescriptionTimeframeComponent>;

  const staticFoiData: FoiRequest = {
    requestData: {
      requestType: {
        requestType: "personal"
      },
      ministry: {
        defaultMinistry: null,
        selectedMinistry: null
      },
      descriptionTimeframe: {
        description: "Hello world.",
        publicServiceEmployeeNumber: "0123456789",
        correctionalServiceNumber: "ABCDEFGHIJ",
        fromDate: "1999-06-18",
        toDate: "2001-01-25"
      }
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DescriptionTimeframeComponent],
      imports: [HttpClientTestingModule, ReactiveFormsModule, NgxWebstorageModule.forRoot(), UtilsComponentsModule],
      providers: [DataService, { provide: Router, useClass: MockRouter }]
    }).compileComponents();
  }));

  beforeEach(() => {
    // Initialize sessionStorage _before_ creating the component!
    sessionStorage.setItem("foi-request", JSON.stringify(staticFoiData));

    fixture = TestBed.createComponent(DescriptionTimeframeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    staticFoiData.requestData.ministry.defaultMinistry = null;
    staticFoiData.requestData.ministry.selectedMinistry = null;
  });

  it("should create with Public Service # and Correctional Service # both hidden", () => {
    expect(component).toBeTruthy();
    expect(component.showPublicServiceEmployeeNumber).toBeFalsy();
    expect(component.showCorrectionalServiceNumber).toBeFalsy();
    const item = sessionStorage.getItem("foi-request");
    expect(item).toBeTruthy();
  });

  it("should contain no untested Controls", () => {
    expect(Object.keys(component.foiForm.controls).length).toBe(5);
  });

  it("should initialize form to use values from the session", () => {
    expect(component.foiForm.get("description").value).toBe("Hello world.");
    expect(component.foiForm.get("fromDate").value).toBe("1999-06-18");
    expect(component.foiForm.get("toDate").value).toBe("2001-01-25");
    expect(component.foiForm.get("publicServiceEmployeeNumber").value).toBe("0123456789");
    expect(component.foiForm.get("correctionalServiceNumber").value).toBe("ABCDEFGHIJ");
    expect(component.foiForm.valid).toBeTruthy();
  });

  it("should save form values to session", () => {
    component.foiForm.get("description").setValue("Nikola Tesla");
    component.foiForm.get("fromDate").setValue("1856-07-10");
    component.foiForm.get("toDate").setValue("1943-01-07");
    component.foiForm.get("publicServiceEmployeeNumber").setValue("Froot Loops");
    component.foiForm.get("correctionalServiceNumber").setValue("Shreddies");

    expect(component.foiForm.valid).toBeTruthy();

    // Submit the form...
    expect(component.foiForm.valid).toBeTruthy();
    component.doContinue();
    const item: FoiRequest = JSON.parse(sessionStorage.getItem("foi-request"));

    expect(item.requestData.descriptionTimeframe.description).toBe("Nikola Tesla");
    expect(item.requestData.descriptionTimeframe.fromDate).toBe("1856-07-10");
    expect(item.requestData.descriptionTimeframe.toDate).toBe("1943-01-07");
    expect(item.requestData.descriptionTimeframe.publicServiceEmployeeNumber).toBe("Froot Loops");
    expect(item.requestData.descriptionTimeframe.correctionalServiceNumber).toBe("Shreddies");
  });

  describe("Initialize Description Timeframe with Public Service Ministry", () => {
    beforeEach(() => {
      // Initialize sessionStorage _before_ creating the component!
      staticFoiData.requestData.ministry.selectedMinistry = [{ code: "PSA" }];
      sessionStorage.setItem("foi-request", JSON.stringify(staticFoiData));

      fixture = TestBed.createComponent(DescriptionTimeframeComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it("should create with Public Service # visible", () => {
      expect(component).toBeTruthy();
      expect(component.showPublicServiceEmployeeNumber).toBeTruthy();
      expect(component.showCorrectionalServiceNumber).toBeFalsy();
    });
  });

  describe("Initialize Description Timeframe with Correctional Services Ministry", () => {
    beforeEach(() => {
      // Initialize sessionStorage _before_ creating the component!
      staticFoiData.requestData.ministry.selectedMinistry = [{ code: "PSSG" }];
      sessionStorage.setItem("foi-request", JSON.stringify(staticFoiData));

      fixture = TestBed.createComponent(DescriptionTimeframeComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it("should create with Corrections Service # visible", () => {
      expect(component).toBeTruthy();
      expect(component.showPublicServiceEmployeeNumber).toBeFalsy();
      expect(component.showCorrectionalServiceNumber).toBeTruthy();
    });
  });
});
