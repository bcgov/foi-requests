import { waitForAsync, ComponentFixture, TestBed } from "@angular/core/testing";

import { BaseComponent } from "./base.component";
import { DataService } from "src/app/services/data.service";
import { MockDataService, MockRouter } from "../../MockClasses";
import { Router } from "@angular/router";

describe("BaseComponent", () => {
  let component: BaseComponent;
  let fixture: ComponentFixture<BaseComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [BaseComponent],
      providers: [
        { provide: DataService, useClass: MockDataService },
        { provide: Router, useClass: MockRouter },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
