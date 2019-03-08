import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { VerifyYourIdentityComponent } from "./verify-your-identity.component";
import { ReactiveFormsModule } from "@angular/forms";
import { DataService } from "src/app/services/data.service";
import { Router } from "@angular/router";
import { MockRouter } from "../../MockClasses";
import { UtilsComponentsModule } from "src/app/utils-components/utils-components.module";
import { NgxWebstorageModule } from "ngx-webstorage";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { FoiRequest } from "src/app/models/FoiRequest";
import { BaseComponent } from "src/app/utils-components/base/base.component";
import { By } from "protractor";
import { of } from "rxjs";

describe("VerifyYourIdentityComponent", () => {
  let component: VerifyYourIdentityComponent;
  let fixture: ComponentFixture<VerifyYourIdentityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [VerifyYourIdentityComponent],
      imports: [HttpClientTestingModule, ReactiveFormsModule, NgxWebstorageModule.forRoot(), UtilsComponentsModule],
      providers: [DataService, { provide: Router, useClass: MockRouter }]
    }).compileComponents();
  }));

  beforeEach(() => {
    // Initialize sessionStorage _before_ creating the component!
    const foi: FoiRequest = {
      requestData: {
        requestType: {
          requestType: "personal"
        },
        contactInfo: {
          firstName: null,
          middleName: "Tiberius",
          lastName: "Kirk",
          birthDate: "1921-09-29",
          alsoKnownAs: "Captain",
          businessName: "Starship Enterprise"
        }
      }
    };
    sessionStorage.setItem("foi-request", JSON.stringify(foi));

    fixture = TestBed.createComponent(VerifyYourIdentityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
    const item = sessionStorage.getItem("foi-request");
    expect(item).toBeTruthy();
  });

  it("should contain no untested Controls", () => {
    expect(component.includeBirthDate).toBeFalsy();
    expect(Object.keys(component.foiForm.controls).length).toBe(6);
  });

  it("should initialize form to use values from the session", () => {
    expect(component.foiForm.get("firstName").value).toBeFalsy();
    expect(component.foiForm.get("middleName").value).toBe("Tiberius");
    expect(component.foiForm.get("lastName").value).toBe("Kirk");
    expect(component.foiForm.get("alsoKnownAs").value).toBe("Captain");
    expect(component.foiForm.get("birthDate").value).toBe("1921-09-29");
    expect(component.foiForm.get("businessName").value).toBe("Starship Enterprise");
    expect(component.foiForm.valid).toBeFalsy();
    // Fix the first name & try again.
    component.foiForm.get("firstName").setValue("George");
    expect(component.foiForm.valid).toBeTruthy();
  });

  it("should save form values to session", () => {
    component.foiForm.get("firstName").setValue("George");
    component.foiForm.get("middleName").setValue("J.");
    component.foiForm.get("lastName").setValue("Jetson");
    component.foiForm.get("alsoKnownAs").setValue("JJ Jefferson");
    component.foiForm.get("birthDate").setValue("1972-02-28");
    component.foiForm.get("businessName").setValue("Spacely's Space Sprockets");

    // Submit the form...
    expect(component.foiForm.valid).toBeTruthy();
    component.doContinue();
    const item: FoiRequest = JSON.parse(sessionStorage.getItem("foi-request"));

    expect(item.requestData.contactInfo.firstName).toEqual("George");
    expect(item.requestData.contactInfo.middleName).toEqual("J.");
    expect(item.requestData.contactInfo.lastName).toEqual("Jetson");
    expect(item.requestData.contactInfo.alsoKnownAs).toEqual("JJ Jefferson");
    expect(item.requestData.contactInfo.birthDate).toEqual("1972-02-28");
    expect(item.requestData.contactInfo.businessName).toEqual("Spacely's Space Sprockets");
  });
});
