import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { MinistryConfirmationComponent } from "./ministry-confirmation.component";
import { ReactiveFormsModule } from "@angular/forms";
import { DataService } from "src/app/services/data.service";
import { Router } from "@angular/router";
import { MockDataService, MockRouter } from "../../MockClasses";
import { UtilsComponentsModule } from "src/app/utils-components/utils-components.module";

describe("MinistryConfirmationComponent", () => {
  let component: MinistryConfirmationComponent;
  let fixture: ComponentFixture<MinistryConfirmationComponent>;
  let dataService: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MinistryConfirmationComponent],
      imports: [ReactiveFormsModule, UtilsComponentsModule],
      providers: [{ provide: DataService, useClass: MockDataService }, { provide: Router, useClass: MockRouter }]
    }).compileComponents();

    const initialState = {
      requestData: {
        requestType: { requestType: "personal" },
        ministry: {
        },
        requestTopic: {
          value: "correctionalFacility",
          text: "The person's time spent in a correctional facility",
          ministryCode: "ABC"
        },
        
      }
    };

    dataService = TestBed.get(DataService);
    spyOn(dataService,'getCurrentState').and.returnValue(initialState);

  }));


  it("should select a ministry", () => {
    
    fixture = TestBed.createComponent(MinistryConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component).toBeTruthy();

    const inputCheckBox: HTMLInputElement = fixture.nativeElement.querySelector("input");
    const continueButon: HTMLInputElement = fixture.nativeElement.querySelector(".btn-primary");
    spyOn(dataService, "setCurrentState").and.callThrough();

    
    inputCheckBox.click();
    fixture.detectChanges();

    continueButon.dispatchEvent(new Event("click"));
    fixture.detectChanges();

    expect(dataService.setCurrentState).toHaveBeenCalledTimes(1);
    
    let call = dataService.setCurrentState.calls.mostRecent();
    expect(call.args[0].requestData.ministry.selectedMinistry.length).toEqual(1);
    expect(call.args[0].requestData.ministry.selectedMinistry[0].code).toBeTruthy();
  });

  it("should select multiple ministries", () => {
    const dataService: any = TestBed.get(DataService);
    fixture = TestBed.createComponent(MinistryConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component).toBeTruthy();

    const inputCheckBox: NodeList = fixture.nativeElement.querySelectorAll("input");
    const continueButon: HTMLInputElement = fixture.nativeElement.querySelector(".btn-primary");
    spyOn(dataService, "setCurrentState").and.callThrough();

    let input:any = inputCheckBox.item(0);
    input.click();
    input = inputCheckBox.item(1);
    input.click();
    fixture.detectChanges();

    continueButon.dispatchEvent(new Event("click"));
    fixture.detectChanges();

    expect(dataService.setCurrentState).toHaveBeenCalledTimes(1);
    
    let call = dataService.setCurrentState.calls.mostRecent();
    expect(call.args[0].requestData.ministry.selectedMinistry.length).toEqual(2);
    expect(call.args[0].requestData.ministry.selectedMinistry[0].code).toBeTruthy();
  });
});
