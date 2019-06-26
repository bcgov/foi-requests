import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { FoiValidComponent } from "./foi-valid.component";
import { Component } from "@angular/core";
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { By } from "@angular/platform-browser";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { OwlNativeDateTimeModule, OwlDateTimeModule } from 'ng-pick-datetime';

@Component({
  template: `
    <form [formGroup]="testform">
      <app-foi-valid [form]="testform" maxLength="maximum 10 characters.">
        <label>Sample label:</label>
        <input formControlName="samplecontrol" />
      </app-foi-valid>
      <app-foi-valid [form]="testform" maxLength="maximum 10 characters.">
        <label>Sample Max Len label:</label>
        <input formControlName="maxlenval" />
      </app-foi-valid>
    </form>
  `
})
class TestHostComponent {
  public testform: FormGroup;
  constructor(private fb: FormBuilder) {
    this.testform = fb.group({
      samplecontrol: "",
      maxlenval: ["", Validators.maxLength(9)]
    });
  }
}

describe("FoiValidComponent", () => {
  // let component: TestHostComponent;
  let testHost: TestHostComponent;
  let foiValid: FoiValidComponent;
  let foiValidMaxLen: FoiValidComponent;
  let foiMaxLenElement: any;
  let foiValidElements;

  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FoiValidComponent, TestHostComponent],
      providers: [FormBuilder],
      imports: [ReactiveFormsModule, OwlDateTimeModule, OwlNativeDateTimeModule, FontAwesomeModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestHostComponent);
    testHost = fixture.componentInstance;
    foiValidElements = fixture.nativeElement.querySelectorAll("app-foi-valid"); 
    foiMaxLenElement = foiValidElements[1];
    let foiValidDebug = fixture.debugElement.queryAll(By.directive(FoiValidComponent));
    foiValid = foiValidDebug[0].componentInstance;
    foiValidMaxLen = foiValidDebug[1].componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(foiValid).toBeTruthy();
    expect(testHost).toBeTruthy();
  });

  it("should go invalid on length exceedence", () => {
    // expect(foiValidMaxLen.isInvalid()).toBeFalsy();

    //testHost.testform.patchValue({ maxlenval: "0123456789" });
    const nameInput: HTMLInputElement = foiMaxLenElement.querySelector('input');
    nameInput.value = '0123456789';
    nameInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();


    expect(foiValidMaxLen.control.value).toEqual("0123456789");
    let validation = foiValidMaxLen.validationErrors('maxlength');
    expect(validation.requiredLength).toEqual(9);
    expect(validation.actualLength).toEqual(10);

    const errMsg: HTMLInputElement = foiMaxLenElement.querySelector('.validation-error');
    expect(errMsg.innerText).toBe("maximum 10 characters.");

  });
});
