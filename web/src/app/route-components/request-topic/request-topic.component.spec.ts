import { waitForAsync, ComponentFixture, TestBed } from "@angular/core/testing";

import { RequestTopicComponent } from "./request-topic.component";
import { BaseComponent } from "src/app/utils-components/base/base.component";
import { ReactiveFormsModule } from "@angular/forms";
import { DataService } from "src/app/services/data.service";
import { Router } from "@angular/router";
import { MockDataService, MockRouter } from "../../MockClasses";
import { BehaviorSubject } from "rxjs";

describe("RequestTopicComponent", () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [RequestTopicComponent, BaseComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: DataService, useClass: MockDataService },
        { provide: Router, useClass: MockRouter },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {});

  it("should select a topic and default the ministry", () => {
    let component: RequestTopicComponent;
    let fixture: ComponentFixture<RequestTopicComponent>;
    fixture = TestBed.createComponent(RequestTopicComponent);
    let dataService: any = TestBed.get(DataService);
    component = fixture.componentInstance;
    let base = component.base;
    const mySubject: BehaviorSubject<any> = new BehaviorSubject<any>({ url: "/personal/yourself", topics: "yourself" });
    spyOn(base, "getFoiRouteData").and.returnValue(mySubject);
    spyOn(dataService, "getTopics").and.callThrough();

    fixture.detectChanges();

    expect(dataService.getTopics).toHaveBeenCalledWith("yourself");
    expect(component).toBeTruthy();

    spyOn(dataService, "setCurrentState").and.callThrough();

    component.doContinue();

    expect(dataService.setCurrentState).toHaveBeenCalledTimes(1);
    let call = dataService.setCurrentState.calls.mostRecent();
    expect(call.args[0].requestData.ministry.defaultMinistry.code).toEqual("PSSG");
  });
});
