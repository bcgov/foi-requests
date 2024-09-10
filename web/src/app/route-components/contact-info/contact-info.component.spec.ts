import { waitForAsync, ComponentFixture, TestBed } from "@angular/core/testing";

import { ContactInfoComponent } from "./contact-info.component";
import { FoiValidComponent } from "src/app/utils-components/foi-valid/foi-valid.component";
import { BaseComponent } from "src/app/utils-components/base/base.component";
import { ReactiveFormsModule } from "@angular/forms";
import { DataService } from "src/app/services/data.service";
import { MockRouter } from "../../MockClasses";
import { Router } from "@angular/router";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { provideNgxWebstorage } from "ngx-webstorage";
import { FoiRequest } from "src/app/models/FoiRequest";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { OwlNativeDateTimeModule, OwlDateTimeModule } from "@danielmoncada/angular-datetime-picker";

describe("ContactInfoComponent", () => {
  let component: ContactInfoComponent;
  let fixture: ComponentFixture<ContactInfoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ContactInfoComponent, BaseComponent, FoiValidComponent],
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        OwlDateTimeModule,
        OwlNativeDateTimeModule,
        FontAwesomeModule,
      ],
      providers: [DataService, { provide: Router, useClass: MockRouter }, provideNgxWebstorage()],
    }).compileComponents();
  }));

  beforeEach(() => {
    // Initialize sessionStorage _before_ creating the component!
    const foi: FoiRequest = {
      requestData: {
        requestType: {
          requestType: "personal",
        },
        contactInfo: {
          firstName: null,
          middleName: "Tiberius",
          lastName: "Kirk",
          businessName: "Starship Enterprise",
        },
      },
    };
    sessionStorage.setItem("foi-request", JSON.stringify(foi));

    fixture = TestBed.createComponent(ContactInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
    const item = sessionStorage.getItem("foi-request");
    expect(item).toBeTruthy();
  });

  it("should contain no untested Controls", () => {
    expect(Object.keys(component.foiForm.controls).length).toBe(4);
  });

  it("should navigate back", () => {
    spyOn(component.base, "goFoiBack").and.callThrough();
    component.doGoBack();
    expect(component.base.goFoiBack).toHaveBeenCalledTimes(1);
  });

  it("should initialize form to use values from the session", () => {
    expect(component.foiForm.get("firstName").value).toBeFalsy();
    expect(component.foiForm.get("middleName").value).toBe("Tiberius");
    expect(component.foiForm.get("lastName").value).toBe("Kirk");
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
    component.foiForm.get("businessName").setValue("Spacely's Space Sprockets");

    // Submit the form...
    expect(component.foiForm.valid).toBeTruthy();
    component.doContinue();
    const item: FoiRequest = JSON.parse(sessionStorage.getItem("foi-request"));

    expect(item.requestData.contactInfo.firstName).toEqual("George");
    expect(item.requestData.contactInfo.middleName).toEqual("J.");
    expect(item.requestData.contactInfo.lastName).toEqual("Jetson");
    expect(item.requestData.contactInfo.businessName).toEqual("Spacely's Space Sprockets");
  });
});
