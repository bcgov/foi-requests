import { waitForAsync, ComponentFixture, TestBed } from "@angular/core/testing";

import { AdoptiveParentsComponent } from "./adoptive-parents.component";
import { BaseComponent } from "src/app/utils-components/base/base.component";
import { ReactiveFormsModule } from "@angular/forms";
import { DataService } from "src/app/services/data.service";
import { Router } from "@angular/router";
import { FoiValidComponent } from "src/app/utils-components/foi-valid/foi-valid.component";
import { FoiRequest } from "src/app/models/FoiRequest";
import { provideNgxWebstorage } from "ngx-webstorage";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { OwlNativeDateTimeModule, OwlDateTimeModule } from "@danielmoncada/angular-datetime-picker";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";

describe("AdoptiveParentsComponent", () => {
  let component: AdoptiveParentsComponent;
  let fixture: ComponentFixture<AdoptiveParentsComponent>;

  class MockRouter {
    // url: "/general/somewhere";
    navigate(...args) {
      console.log("MockRouter.navigate=", args);
    }
  }

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AdoptiveParentsComponent, BaseComponent, FoiValidComponent],
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
        adoptiveParents: {
          motherFirstName: "Lois",
          motherLastName: "Lane",
          fatherFirstName: "Clark",
          fatherLastName: "Kent",
        },
      },
    };
    sessionStorage.setItem("foi-request", JSON.stringify(foi));

    // Create the Component to be tested.
    fixture = TestBed.createComponent(AdoptiveParentsComponent);
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

  it("should initialize form to use values from the session", () => {
    expect(component.foiForm.get("motherFirstName").value).toBe("Lois");
    expect(component.foiForm.get("motherLastName").value).toBe("Lane");
    expect(component.foiForm.get("fatherFirstName").value).toBe("Clark");
    expect(component.foiForm.get("fatherLastName").value).toBe("Kent");
  });

  it("should save form values to session", () => {
    component.foiForm.get("motherFirstName").setValue("Betty");
    component.foiForm.get("motherLastName").setValue("Rubble");
    component.foiForm.get("fatherFirstName").setValue("Fred");
    component.foiForm.get("fatherLastName").setValue("Flintstone");

    // Submit the form...
    expect(component.foiForm.valid).toBeTruthy();
    component.doContinue();
    const item: FoiRequest = JSON.parse(sessionStorage.getItem("foi-request"));

    expect(item.requestData.adoptiveParents.motherFirstName).toEqual("Betty");
    expect(item.requestData.adoptiveParents.motherLastName).toEqual("Rubble");
    expect(item.requestData.adoptiveParents.fatherFirstName).toEqual("Fred");
    expect(item.requestData.adoptiveParents.fatherLastName).toEqual("Flintstone");
  });
});
