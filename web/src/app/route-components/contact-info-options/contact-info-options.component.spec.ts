import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactInfoOptionsComponent } from './contact-info-options.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';
import { MockRouter } from '../../MockClasses';
import { Router } from '@angular/router';
import { FoiRequest } from 'src/app/models/FoiRequest';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgxWebstorageModule } from 'ngx-webstorage';
import { UtilsComponentsModule } from 'src/app/utils-components/utils-components.module';

describe('ContactInfoOptionsComponent', () => {
  let component: ContactInfoOptionsComponent;
  let fixture: ComponentFixture<ContactInfoOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactInfoOptionsComponent ],
      imports: [HttpClientTestingModule, ReactiveFormsModule, NgxWebstorageModule.forRoot(), UtilsComponentsModule],
      providers: [
        DataService,
        {provide: Router, useClass: MockRouter}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    // Initialize sessionStorage _before_ creating the component!
    const foi: FoiRequest = {
      requestData: {
        requestType: {
          requestType: "personal"
        },
        contactInfoOptions: {
          phonePrimary: "1-000-555-1234",
          phoneSecondary: "1-111-555-7890",
          email: "spongebob.squarepants@seamail.com",
          address: "124 Conch Street",
          city: "Bikini Bottom",
          postal: "12345",
          province: "N/A",
          country: "Pacific Ocean"
        },
        requestTopic: {
          value: "correctionalFacility",
          text: "The person's time spent in a correctional facility",
          ministryCode: "PSSG"
        },
      }
    };
    sessionStorage.setItem("foi-request", JSON.stringify(foi));

    fixture = TestBed.createComponent(ContactInfoOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
    const item = sessionStorage.getItem("foi-request");
    expect(item).toBeTruthy();
  });

  it("should contain no untested Controls", () => {
    expect(Object.keys(component.foiForm.controls).length).toBe(8);
  });

  it("should initialize form to use values from the session", () => {
    expect(component.foiForm.get("phonePrimary").value).toBe("1-000-555-1234");
    expect(component.foiForm.get("phoneSecondary").value).toBe("1-111-555-7890");
    expect(component.foiForm.get("email").value).toBe("spongebob.squarepants@seamail.com");
    expect(component.foiForm.get("address").value).toBe("124 Conch Street");
    expect(component.foiForm.get("city").value).toBe("Bikini Bottom");
    expect(component.foiForm.get("postal").value).toBe("12345");
    expect(component.foiForm.get("province").value).toBe("N/A");
    expect(component.foiForm.get("country").value).toBe("Pacific Ocean");
    expect(component.foiForm.valid).toBeTruthy();
  });

  it("should save form values to session", () => {
    component.foiForm.get("phonePrimary").setValue("1-888-got-x-men");
    component.foiForm.get("phoneSecondary").setValue("1-800-mutants-r-us");
    component.foiForm.get("email").setValue("xavier@institute.com");
    component.foiForm.get("address").setValue("1407 Graymalkin Lane");
    component.foiForm.get("city").setValue("Salem Center");
    component.foiForm.get("postal").setValue("10821");
    component.foiForm.get("province").setValue("New York");
    component.foiForm.get("country").setValue("USA");

    expect(component.foiForm.valid).toBeTruthy();
    
    // Submit the form...
    expect(component.foiForm.valid).toBeTruthy();
    component.doContinue();
    const item: FoiRequest = JSON.parse(sessionStorage.getItem("foi-request"));

    expect(item.requestData.contactInfoOptions.phonePrimary).toBe("1-888-got-x-men");
    expect(item.requestData.contactInfoOptions.phoneSecondary).toBe("1-800-mutants-r-us");
    expect(item.requestData.contactInfoOptions.email).toBe("xavier@institute.com");
    expect(item.requestData.contactInfoOptions.address).toBe("1407 Graymalkin Lane");
    expect(item.requestData.contactInfoOptions.city).toBe("Salem Center");
    expect(item.requestData.contactInfoOptions.postal).toBe("10821");
    expect(item.requestData.contactInfoOptions.province).toBe("New York");
    expect(item.requestData.contactInfoOptions.country).toBe("USA");
  });

  it("should navigate back", () => {
    spyOn(component.base, 'goSkipBack').and.callThrough();  //personal and adoption
    component.doGoBack();
    expect(component.base.goSkipBack).toHaveBeenCalledTimes(1);
  });

});
