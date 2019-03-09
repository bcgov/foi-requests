import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { GettingStarted1Component } from "./getting-started1.component";
import { FoiValidComponent } from "src/app/utils-components/foi-valid/foi-valid.component";
import { BaseComponent } from "src/app/utils-components/base/base.component";
import { ReactiveFormsModule } from "@angular/forms";
import { DataService } from "src/app/services/data.service";
import { MockDataService, MockRouter } from "../../MockClasses";
import { Router } from "@angular/router";
import { StaticContactBlockComponent } from "src/app/utils-components/static-contact-block/static-contact-block.component";
import { By } from "@angular/platform-browser";

describe("GettingStarted1Component", () => {
  let component: GettingStarted1Component;
  let fixture: ComponentFixture<GettingStarted1Component>;
  let dataService: DataService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GettingStarted1Component, BaseComponent, FoiValidComponent, StaticContactBlockComponent],
      imports: [ReactiveFormsModule],
      providers: [{ provide: DataService, useClass: MockDataService }, { provide: Router, useClass: MockRouter }]
    }).compileComponents();
  }));

  beforeEach(() => {
    dataService = TestBed.get(DataService);
    fixture = TestBed.createComponent(GettingStarted1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should go forward on continue click", done => {
    let baseDebug = fixture.debugElement.queryAll(By.directive(BaseComponent));
    let base: BaseComponent = baseDebug[0].componentInstance;

    spyOn(dataService, "setCurrentState").and.callThrough();
    spyOn(base, "goFoiForward").and.callThrough();
    const continueButon: HTMLInputElement = fixture.nativeElement.querySelector(".btn-primary");
    continueButon.dispatchEvent(new Event("click"));
    fixture.detectChanges();

    expect(dataService.setCurrentState).toHaveBeenCalledTimes(1);
    expect(base.goFoiForward).toHaveBeenCalledTimes(1);
    done();
  });
});
