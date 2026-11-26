import { Component, OnInit, ViewChild } from "@angular/core";
import { BaseComponent } from "src/app/utils-components/base/base.component";
import { FoiRequest } from "src/app/models/FoiRequest";
import { FormBuilder, Validators } from "@angular/forms";
import { DataService } from "src/app/services/data.service";

const conditionalRequired = (condition) => {
  return condition ? Validators.required : Validators.nullValidator;
};

const yesNoRequired = (control) => {
  return control.value === true || control.value === false ? null : { required: true };
};

@Component({
  templateUrl: "./contact-info.component.html",
  styleUrls: ["./contact-info.component.scss"],
})
export class ContactInfoComponent implements OnInit {
  @ViewChild(BaseComponent, { static: true }) base: BaseComponent;
  foiForm = null;
  generalRequest = null;
  foiRequest: FoiRequest;
  targetKey: string = "contactInfo";
  igeNameValidators = [Validators.maxLength(255)];
  igeNameRequired = false;

  constructor(private fb: FormBuilder, private dataService: DataService) { }

  ngOnInit() {
    // Load the current values before building conditional validators.
    this.foiRequest = this.dataService.getCurrentState(this.targetKey);
    this.generalRequest = this.foiRequest.requestData.requestType.requestType === "general";

    this.foiForm = this.fb.group({
      firstName: [null, Validators.compose([Validators.required, Validators.maxLength(255)])],
      middleName: [null, [Validators.maxLength(255)]],
      lastName: [null, Validators.compose([Validators.required, Validators.maxLength(255)])],
      businessName: [null, Validators.maxLength(255)],
      IGE: [null],
      igeName: [null, this.igeNameValidators],

      isLawFirm: [null, this.generalRequest ? yesNoRequired : Validators.nullValidator],
    });

    this.igeNameRequiredSubscription();

    this.foiForm.patchValue(this.foiRequest.requestData[this.targetKey]);

  }

  igeNameRequiredSubscription() {
    this.foiForm.get("IGE").valueChanges.subscribe((value) => {
      const igeName = this.foiForm.get("igeName");
      igeName.setValidators(this.igeNameValidators.concat(conditionalRequired(value)));
      igeName.updateValueAndValidity();
      this.igeNameRequired = value;
    });
  }

  doContinue() {
    this.dataService.setCurrentState(this.foiRequest, this.targetKey, this.foiForm);

    const isLawFirmApplicant = this.generalRequest && this.foiForm.value.isLawFirm === true;

    if (isLawFirmApplicant) {
      this.base.goFoiForward(
        this.foiForm.value.IGE ? "legalProceedingNoPaymentPath" : "legalProceedingPaymentPath"
      );
      return;
    }

    this.base.goFoiForward(this.foiForm.value.IGE ? "noPaymentPath" : "paymentPath");
  }

  doGoBack() {
    this.base.goFoiBack();
  }
}