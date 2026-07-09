import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { BaseComponent } from "src/app/utils-components/base/base.component";
import { FoiRequest } from "src/app/models/FoiRequest";
import { DataService } from "src/app/services/data.service";

const yesNoRequired = (control) => {
  return control.value === true || control.value === false ? null : { required: true };
};

@Component({
  templateUrl: "./legal-proceeding-details.component.html",
  styleUrls: ["./legal-proceeding-details.component.scss"],
})
export class LegalProceedingDetailsComponent implements OnInit {
  @ViewChild(BaseComponent, { static: true }) base: BaseComponent;

  foiForm = null;
  foiRequest: FoiRequest;
  targetKey: string = "legalProceedingDetails";

  constructor(private fb: FormBuilder, private dataService: DataService) {}

  ngOnInit() {
    this.foiRequest = this.dataService.getCurrentState(this.targetKey);

    this.foiForm = this.fb.group({
      isRequestRelatedToProceeding: [null, yesNoRequired],
      isPartyToProceeding: [null],
    });

    this.foiForm.get("isRequestRelatedToProceeding").valueChanges.subscribe((value) => {
      const isPartyToProceeding = this.foiForm.get("isPartyToProceeding");

      if (value === true) {
        isPartyToProceeding.setValidators(yesNoRequired);
      } else {
        isPartyToProceeding.reset(null, { emitEvent: false });
        isPartyToProceeding.clearValidators();
      }

      isPartyToProceeding.updateValueAndValidity({ emitEvent: false });
    });

    this.foiForm.patchValue(this.foiRequest.requestData[this.targetKey]);
    this.updatePartyToProceedingValidators();
  }

  updatePartyToProceedingValidators() {
    const isRequestRelatedToProceeding = this.foiForm.get("isRequestRelatedToProceeding").value;
    const isPartyToProceeding = this.foiForm.get("isPartyToProceeding");

    if (isRequestRelatedToProceeding === true) {
      isPartyToProceeding.setValidators(yesNoRequired);
    } else {
      isPartyToProceeding.clearValidators();
    }

    isPartyToProceeding.updateValueAndValidity({ emitEvent: false });
  }

  get isRequestRelatedToProceeding(): boolean {
    return this.foiForm?.get("isRequestRelatedToProceeding")?.value === true;
  }

  doContinue() {
    this.dataService.setCurrentState(this.foiRequest, this.targetKey, this.foiForm);
    this.base.goFoiForward();
  }

  doGoBack() {
    this.base.goFoiBack();
  }
}