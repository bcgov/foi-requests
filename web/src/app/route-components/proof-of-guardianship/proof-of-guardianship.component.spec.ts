import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ProofOfGuardianshipComponent } from "./proof-of-guardianship.component";
import { ReactiveFormsModule } from "@angular/forms";
import { DataService } from "src/app/services/data.service";
import { Router } from "@angular/router";
import { MockDataService, MockRouter } from "../../MockClasses";
import { UtilsComponentsModule } from "src/app/utils-components/utils-components.module";
import { BaseComponent } from "src/app/utils-components/base/base.component";
import { By } from "@angular/platform-browser";
import { FoiRequest } from "src/app/models/FoiRequest";

describe("ProofOfGuardianshipComponent", () => {
  let component: ProofOfGuardianshipComponent;
  let fixture: ComponentFixture<ProofOfGuardianshipComponent>;
  // let dataService: DataService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProofOfGuardianshipComponent],
      imports: [ReactiveFormsModule, UtilsComponentsModule],
      providers: [{ provide: DataService, useClass: MockDataService }, { provide: Router, useClass: MockRouter }]
    }).compileComponents();
  }));

  beforeEach(() => {
    // Initialize sessionStorage _before_ creating the component!
    const foi: FoiRequest = {
      requestData: {
        requestType: {
          requestType: "personal"
        },
        proofOfGuardianship: {
          answerYes: "true"
        },
        proofOfPermission: {
          answerYes: "true"
        }
      }
    };
    sessionStorage.setItem("foi-request", JSON.stringify(foi));

    fixture = TestBed.createComponent(ProofOfGuardianshipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should load (sample data) with Continue button Enabled", done => {
    const baseDebug = fixture.debugElement.queryAll(By.directive(BaseComponent));
    const base: BaseComponent = baseDebug[0].componentInstance;

    // No warning at this time
    const domElement = fixture.debugElement.nativeElement;
    expect(domElement.querySelector(".alert-warning")).toBeFalsy();

    expect(component.targetKey).toBe("proofOfPermission");
    expect(base.continueDisabled).toBeFalsy();
    done();
  });

  describe("Loading Proof with sample (Child) data", () => {
    beforeEach(() => {
      // Initialize sessionStorage _before_ creating the component!
      const foi: FoiRequest = {
        requestData: {
          requestType: {
            requestType: "personal"
          },
          proofOfGuardianship: {
            answerYes: "foo"
          }
        }
      };
      sessionStorage.setItem("foi-request", JSON.stringify(foi));

      fixture = TestBed.createComponent(ProofOfGuardianshipComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it("should load (sample data) with Warning and Continue disabled", done => {
      const baseDebug = fixture.debugElement.queryAll(By.directive(BaseComponent));
      const base: BaseComponent = baseDebug[0].componentInstance;

      base.routeData$.next({ proofFor: "child" });
      expect(component.targetKey).toBe("proofOfGuardianship");

      component.foiForm.get("answerYes").setValue("false");
      fixture.detectChanges();

      const domElement = fixture.debugElement.nativeElement;
      expect(domElement.querySelector(".alert-warning")).toBeTruthy();
      expect(base.continueDisabled).toBeTruthy();
      done();
    });

    it("should load (sample data) without Warning and Continue enabled", done => {
      const baseDebug = fixture.debugElement.queryAll(By.directive(BaseComponent));
      const base: BaseComponent = baseDebug[0].componentInstance;

      base.routeData$.next({ proofFor: "child" });
      expect(component.targetKey).toBe("proofOfGuardianship");

      component.foiForm.get("answerYes").setValue("true");
      fixture.detectChanges();

      const domElement = fixture.debugElement.nativeElement;
      expect(domElement.querySelector(".alert-warning")).toBeFalsy();
      expect(base.continueDisabled).toBeFalsy();
      done();
    });
  });

  describe("Loading Proof with sample (Person) data", () => {
    beforeEach(() => {
      // Initialize sessionStorage _before_ creating the component!
      const foi: FoiRequest = {
        requestData: {
          requestType: {
            requestType: "personal"
          },
          proofOfPermission: {
            answerYes: "true"
          }
        }
      };
      sessionStorage.setItem("foi-request", JSON.stringify(foi));

      fixture = TestBed.createComponent(ProofOfGuardianshipComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it("should load (sample data) with Warning and Continue disabled", done => {
      const baseDebug = fixture.debugElement.queryAll(By.directive(BaseComponent));
      const base: BaseComponent = baseDebug[0].componentInstance;

      base.routeData$.next({ proofFor: "person" });
      expect(component.targetKey).toBe("proofOfPermission");

      component.foiForm.get("answerYes").setValue("false");
      fixture.detectChanges();

      const domElement = fixture.debugElement.nativeElement;
      expect(domElement.querySelector(".alert-warning")).toBeTruthy();
      expect(base.continueDisabled).toBeTruthy();
      done();
    });

    it("should load (sample data) without Warning and Continue enabled", done => {
      const baseDebug = fixture.debugElement.queryAll(By.directive(BaseComponent));
      const base: BaseComponent = baseDebug[0].componentInstance;

      base.routeData$.next({ proofFor: "person" });
      expect(component.targetKey).toBe("proofOfPermission");

      // Session request data started with truthy value, no need to set it here!

      const domElement = fixture.debugElement.nativeElement;
      expect(domElement.querySelector(".alert-warning")).toBeFalsy();
      expect(base.continueDisabled).toBeFalsy();
      done();
    });
  });
});
