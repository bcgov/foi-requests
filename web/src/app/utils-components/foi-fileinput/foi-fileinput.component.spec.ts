import { waitForAsync, ComponentFixture, TestBed } from "@angular/core/testing";

import { FoiFileinputComponent } from "./foi-fileinput.component";
import { Component } from "@angular/core";
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { By } from "@angular/platform-browser";

@Component({
  template: `
    <form [formGroup]="testform">
      <foi-fileinput [form]="testform" formcontrolname="myOptionalFile" tip="file one">
        <label>Optional file label:</label>
      </foi-fileinput>
      <foi-fileinput
        [form]="testform"
        formcontrolname="myRequiredFile"
        required="This field is required."
        tip="file two"
      >
        <label>Required file label:</label>
      </foi-fileinput>
    </form>
  `,
})
class TestHostComponent {
  public testform: FormGroup;
  constructor(private fb: FormBuilder) {
    this.testform = fb.group({
      myOptionalFile: null,
      myRequiredFile: [null, Validators.required],
    });
  }
}

describe("FoiValidComponent", () => {
  let testHost: TestHostComponent;
  let foiOptionalFile: FoiFileinputComponent;
  let foiRequiredFile: FoiFileinputComponent;
  let foiOptionalElement: any;
  let foiRequiredElement: any;
  let foiFileElements;

  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [FoiFileinputComponent, TestHostComponent],
      providers: [FormBuilder],
      imports: [ReactiveFormsModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestHostComponent);
    testHost = fixture.componentInstance;
    foiFileElements = fixture.nativeElement.querySelectorAll("foi-fileinput");
    foiOptionalElement = foiFileElements[0];
    foiRequiredElement = foiFileElements[1];
    let foiFileDebug = fixture.debugElement.queryAll(By.directive(FoiFileinputComponent));
    foiOptionalFile = foiFileDebug[0].componentInstance;
    foiRequiredFile = foiFileDebug[1].componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(foiOptionalFile).toBeTruthy();
    expect(foiRequiredFile).toBeTruthy();
    expect(testHost).toBeTruthy();
  });

  it("required file should be valid when empty and pristine", () => {
    foiRequiredFile.control.markAsPristine();
    fixture.detectChanges();

    const validation3 = foiRequiredFile.validationErrors("required");
    expect(validation3).toBeTruthy();

    const errMsg: HTMLInputElement = foiRequiredElement.querySelector(".validation-error");
    expect(errMsg).toBeNull(); // because it's not dirty.

    const tipMsg: HTMLInputElement = foiRequiredElement.querySelector(".validation-tip");
    expect(tipMsg.innerText).toBe("file two"); // because it's not dirty.
  });

  it("required file should be invalid when empty and not pristine", () => {
    foiRequiredFile.selectFile();
    fixture.detectChanges();

    const validation3 = foiRequiredFile.validationErrors("required");
    expect(validation3).toBeTruthy();

    const errMsg3: HTMLInputElement = foiRequiredElement.querySelector(".validation-error");
    expect(errMsg3.innerText).toBe("This field is required.");

    const tipMsg3: HTMLInputElement = foiRequiredElement.querySelector(".validation-tip");
    expect(tipMsg3).toBeNull();
  });

  it("required file should be valid when not empty and not pristine", () => {
    // Set it to a dummy filename, & look for error message / tip.
    foiRequiredFile.selectFile("myFile.txt");
    fixture.detectChanges();

    const validation2 = foiRequiredFile.validationErrors("required");
    expect(validation2).toBeNull();

    const errMsg2: HTMLInputElement = foiRequiredElement.querySelector(".validation-error");
    expect(errMsg2).toBeNull();

    const tipMsg2: HTMLInputElement = foiRequiredElement.querySelector(".validation-tip");
    expect(tipMsg2.innerText).toBe("file two"); // because it's valid and not dirty.
  });

  it("required file should be valid when not empty and pristine", () => {
    // Set it to a dummy filename, & look for error message / tip.
    foiRequiredFile.selectFile("myFile.txt");
    foiRequiredFile.control.markAsPristine();
    fixture.detectChanges();

    const validation2 = foiRequiredFile.validationErrors("required");
    expect(validation2).toBeNull();

    const errMsg2: HTMLInputElement = foiRequiredElement.querySelector(".validation-error");
    expect(errMsg2).toBeNull();

    const tipMsg2: HTMLInputElement = foiRequiredElement.querySelector(".validation-tip");
    expect(tipMsg2.innerText).toBe("file two"); // because it's valid and not dirty.
  });

  it("optional file should be valid when empty and not pristine", () => {
    foiOptionalFile.selectFile();
    fixture.detectChanges();

    const validation2 = foiOptionalFile.validationErrors("required");
    expect(validation2).toBeNull();

    const errMsg2: HTMLInputElement = foiOptionalElement.querySelector(".validation-error");
    expect(errMsg2).toBeNull();

    const tipMsg2: HTMLInputElement = foiOptionalElement.querySelector(".validation-tip");
    expect(tipMsg2.innerText).toBe("file one"); // because it's not required.
  });
});
