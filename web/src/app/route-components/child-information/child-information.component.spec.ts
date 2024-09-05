import { waitForAsync, ComponentFixture, TestBed } from "@angular/core/testing";

import { ChildInformationComponent } from "./child-information.component";
import { BaseComponent } from "src/app/utils-components/base/base.component";
import { ReactiveFormsModule } from "@angular/forms";
import { DataService } from "src/app/services/data.service";
import { MockRouter } from "../../MockClasses";
import { Router } from "@angular/router";
import { FoiValidComponent } from "src/app/utils-components/foi-valid/foi-valid.component";
import { FoiFileinputComponent } from "src/app/utils-components/foi-fileinput/foi-fileinput.component";
import { FoiRequest } from "src/app/models/FoiRequest";
import { NgxWebstorageModule } from "ngx-webstorage";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { OwlNativeDateTimeModule, OwlDateTimeModule } from "@danielmoncada/angular-datetime-picker";

describe("ChildInformationComponent", () => {
  let component: ChildInformationComponent;
  let fixture: ComponentFixture<ChildInformationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ChildInformationComponent, BaseComponent, FoiValidComponent, FoiFileinputComponent],
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        NgxWebstorageModule.forRoot(),
        OwlDateTimeModule,
        OwlNativeDateTimeModule,
        FontAwesomeModule,
      ],
      providers: [DataService, { provide: Router, useClass: MockRouter }],
    }).compileComponents();
  }));

  beforeEach(() => {
    // Initialize sessionStorage _before_ creating the component!
    const foi: FoiRequest = {
      requestData: {
        requestType: {
          requestType: "personal",
        },
        childInformation: {
          firstName: "James",
          middleName: "Tiberius",
          lastName: "Kirk",
          alsoKnownAs: "Captain",
          dateOfBirth: "2233-01-04",
          proofOfGuardianship: "birth_certificate.jpg",
        },
      },
    };
    sessionStorage.setItem("foi-request", JSON.stringify(foi));

    fixture = TestBed.createComponent(ChildInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
    const item = sessionStorage.getItem("foi-request");
    expect(item).toBeTruthy();
  });

  it("should contain no untested Controls", () => {
    expect(Object.keys(component.foiForm.controls).length).toBe(6);
  });

  it("should initialize form to use values from the session", () => {
    expect(component.foiForm.get("firstName").value).toBe("James");
    expect(component.foiForm.get("middleName").value).toBe("Tiberius");
    expect(component.foiForm.get("lastName").value).toBe("Kirk");
    expect(component.foiForm.get("alsoKnownAs").value).toBe("Captain");
    expect(component.foiForm.get("dateOfBirth").value).toBe("2233-01-04");
    expect(component.foiForm.get("proofOfGuardianship").value).toBe("birth_certificate.jpg");
    expect(component.foiForm.valid).toBeFalsy();
    // Fix the date & try again.
    component.foiForm.get("dateOfBirth").setValue("1971-09-22");
    expect(component.foiForm.valid).toBeTruthy();
  });

  it("should save form values to session", () => {
    component.foiForm.get("firstName").setValue("George");
    component.foiForm.get("middleName").setValue("J.");
    component.foiForm.get("lastName").setValue("Jetson");
    component.foiForm.get("alsoKnownAs").setValue("Dad");
    component.foiForm.get("dateOfBirth").setValue("1962-08-27");
    component.foiForm.get("proofOfGuardianship").setValue("baby_george.jpg");

    // Submit the form...
    expect(component.foiForm.valid).toBeTruthy();
    component.doContinue();
    const item: FoiRequest = JSON.parse(sessionStorage.getItem("foi-request"));

    expect(item.requestData.childInformation.firstName).toEqual("George");
    expect(item.requestData.childInformation.middleName).toEqual("J.");
    expect(item.requestData.childInformation.lastName).toEqual("Jetson");
    expect(item.requestData.childInformation.alsoKnownAs).toEqual("Dad");
    expect(item.requestData.childInformation.dateOfBirth).toEqual("1962-08-27");
    expect(item.requestData.childInformation.proofOfGuardianship).toEqual("baby_george.jpg");
  });
});
