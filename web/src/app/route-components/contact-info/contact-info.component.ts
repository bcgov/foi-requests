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

      isLawFirm: [null],
      isInvolvedInLegalProceeding: [null],
      legalProceedingCertificationName: [null, Validators.maxLength(255)],
      courtOrTribunal: [null, Validators.maxLength(255)],
      courtOrTribunalFileNumber: [null, Validators.maxLength(255)],
      legalProceedingType: [null],
    });

    this.igeNameRequiredSubscription();
    this.lawFirmRequiredSubscription();

    this.foiForm.patchValue(this.foiRequest.requestData[this.targetKey]);

    this.updateLawFirmValidators();
  }

  igeNameRequiredSubscription() {
    this.foiForm.get("IGE").valueChanges.subscribe((value) => {
      const igeName = this.foiForm.get("igeName");
      igeName.setValidators(this.igeNameValidators.concat(conditionalRequired(value)));
      igeName.updateValueAndValidity();
      this.igeNameRequired = value;
    });
  }

  lawFirmRequiredSubscription() {
    this.foiForm.get("isLawFirm").valueChanges.subscribe((value) => {
      if (value !== true) {
        this.foiForm.get("isInvolvedInLegalProceeding").reset(null, { emitEvent: false });
        this.foiForm.get("legalProceedingCertificationName").reset(null, { emitEvent: false });
        this.foiForm.get("courtOrTribunal").reset(null, { emitEvent: false });
        this.foiForm.get("courtOrTribunalFileNumber").reset(null, { emitEvent: false });
        this.foiForm.get("legalProceedingType").reset(null, { emitEvent: false });
      }

      this.updateLawFirmValidators();
    });

    this.foiForm.get("isInvolvedInLegalProceeding").valueChanges.subscribe((value) => {
      if (value === true) {
        this.foiForm.get("legalProceedingCertificationName").reset(null, { emitEvent: false });
      }

      if (value === false) {
        this.foiForm.get("courtOrTribunal").reset(null, { emitEvent: false });
        this.foiForm.get("courtOrTribunalFileNumber").reset(null, { emitEvent: false });
        this.foiForm.get("legalProceedingType").reset(null, { emitEvent: false });
      }

      this.updateLawFirmValidators();
    });
  }

  updateLawFirmValidators() {
    const isLawFirm = this.foiForm.get("isLawFirm").value;
    const isInvolvedInLegalProceeding = this.foiForm.get("isInvolvedInLegalProceeding").value;

    this.setValidators("isLawFirm", this.generalRequest, [], true);
    this.setValidators("isInvolvedInLegalProceeding", this.generalRequest && isLawFirm === true, [], true);

    this.setValidators(
      "legalProceedingCertificationName",
      this.generalRequest && isLawFirm === true && isInvolvedInLegalProceeding === false,
      [Validators.maxLength(255)]
    );

    this.setValidators(
      "courtOrTribunal",
      this.generalRequest && isLawFirm === true && isInvolvedInLegalProceeding === true,
      [Validators.maxLength(255)]
    );

    this.setValidators(
      "legalProceedingType",
      this.generalRequest && isLawFirm === true && isInvolvedInLegalProceeding === true,
      []
    );

    this.setValidators("courtOrTribunalFileNumber", false, [Validators.maxLength(255)]);
  }

  setValidators(controlName: string, required: boolean, validators: any[], useYesNoRequired: boolean = false) {
    const control = this.foiForm.get(controlName);
    const requiredValidator = useYesNoRequired ? yesNoRequired : Validators.required;

    control.setValidators(required ? validators.concat(requiredValidator) : validators);
    control.updateValueAndValidity({ emitEvent: false });
  }

  get isLawFirmApplicant(): boolean {
    return this.foiForm?.get("isLawFirm")?.value === true;
  }

  get isNotLawFirmApplicant(): boolean {
    return this.foiForm?.get("isLawFirm")?.value === false;
  }

  get isInvolvedInLegalProceeding(): boolean {
    return this.foiForm?.get("isInvolvedInLegalProceeding")?.value === true;
  }

  get isNotInvolvedInLegalProceeding(): boolean {
    return this.foiForm?.get("isInvolvedInLegalProceeding")?.value === false;
  }

  doContinue() {
    // Update save data & proceed.
    this.dataService.setCurrentState(this.foiRequest, this.targetKey, this.foiForm);

    const isLegalProceedingLawFirm =
      this.foiForm.value.isLawFirm === true && this.foiForm.value.isInvolvedInLegalProceeding === true;

    if (isLegalProceedingLawFirm) {
      this.base.goFoiForward(this.foiForm.value.IGE ? "legalProceedingNoPaymentPath" : "legalProceedingPaymentPath");
      return;
    }

    this.base.goFoiForward(this.foiForm.value.IGE ? "noPaymentPath" : "paymentPath");
  }

  doGoBack() {
    this.base.goFoiBack();
  }
}