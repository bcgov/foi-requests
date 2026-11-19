import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { BaseComponent } from "src/app/utils-components/base/base.component";
import { FoiRequest } from "src/app/models/FoiRequest";
import { DataService } from "src/app/services/data.service";

const yesNoRequired = (control) => {
  return control.value === true || control.value === false
    ? null
    : { required: true };
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
      ministryInvolvement: [null],
    });

    this.foiForm
      .get("isRequestRelatedToProceeding")
      .valueChanges.subscribe(() => {
        this.updateMinistryValidators();
      });

    const saved = this.foiRequest.requestData[this.targetKey] || {};
    this.foiForm.patchValue(saved, { emitEvent: false });
    this.updateMinistryValidators();
  }

  updateMinistryValidators() {
    const ministry = this.foiForm.get("ministryInvolvement");

    if (this.isRequestRelatedToProceeding) {
      ministry.setValidators(Validators.required);
    } else {
      ministry.reset(null, { emitEvent: false });
      ministry.clearValidators();
    }

    ministry.updateValueAndValidity({ emitEvent: false });
  }

  get isRequestRelatedToProceeding(): boolean {
    return this.foiForm?.get("isRequestRelatedToProceeding")?.value === true;
  }

  get ministryInvolvement(): string {
    return this.foiForm?.get("ministryInvolvement")?.value;
  }

  doContinue() {
    if (this.foiForm.invalid) {
      return;
    }

    // Remove the superseded question from previously saved requests.
    const saved = this.foiRequest.requestData[this.targetKey];
    if (saved) {
      delete saved.isPartyToProceeding;
    }

    this.dataService.setCurrentState(this.foiRequest, this.targetKey, this.foiForm);
    this.base.goFoiForward();
  }

  doGoBack() {
    this.dataService.setCurrentState(this.foiRequest, this.targetKey, this.foiForm);
    this.base.goFoiBack();
  }
}