import { Component, OnInit, ViewChild } from "@angular/core";
import { BaseComponent } from "../base/base.component";
import { FoiRequest } from "src/app/models/FoiRequest";
import { FormBuilder, Validators } from "@angular/forms";
import { DataService } from "src/app/services/data.service";

@Component({
  templateUrl: "./description-timeframe.component.html",
  styleUrls: ["./description-timeframe.component.scss"]
})
export class DescriptionTimeframeComponent implements OnInit {
  @ViewChild(BaseComponent) base: BaseComponent;
  foiForm = this.fb.group({
    topic: [null, Validators.compose([Validators.required, Validators.maxLength(255)])],
    description: [null, Validators.required],
    fromDate: [null, Validators.required],
    toDate: [null, Validators.required],
    correctionalServiceNumber: [null, Validators.maxLength(255)],
    publicServiceEmployeeNumber: [null, Validators.maxLength(255)]
  });

  foiRequest: FoiRequest;
  targetKey: string = "descriptionTimeframe";
  showRequestTopic: boolean = false;
  showPublicServiceEmployeeNumber: boolean = false;
  showCorrectionalServiceNumber: boolean = false;

  constructor(private fb: FormBuilder, private dataService: DataService) {}

  ngOnInit() {
    this.foiRequest = this.dataService.getCurrentState(this.targetKey, 'requestType', 'requestTopic', 'ministry');
    this.foiRequest.requestData.ministry.default = this.foiRequest.requestData.ministry.default || {};

    // Show Topic field for all General requests!
    this.showRequestTopic = this.foiRequest.requestData.requestType.requestType === "general";

    // If ministry is PSA, show the Public Service Employee number field.
    // If ministry is PSSG, show the Correctional Service number field.
    let ministryCode = null;
    if (this.foiRequest.requestData.ministry.selectedMinistry) {
      ministryCode = this.foiRequest.requestData.ministry.selectedMinistry.code;
    }
    this.showPublicServiceEmployeeNumber = ministryCode === "PSA";
    this.showCorrectionalServiceNumber = ministryCode === "PSSG";

    const formInit = {};
    Object.assign(formInit, this.foiRequest.requestData[this.targetKey]);
    if (!this.showRequestTopic) {
      formInit["topic"] = this.foiRequest.requestData.requestTopic.text;
    }
    this.foiForm.patchValue(formInit);

    // Lets make sure the continue button is enabled
    this.foiForm.valueChanges.subscribe(() => {
      this.base.continueDisabled = !this.foiForm.valid;
    });
  }

  doContinue() {
    // Copy out submitted form data.
    const formData = this.foiForm.value;
    Object.assign(this.foiRequest.requestData[this.targetKey], formData);

    // Update save data & proceed.
    this.dataService.setCurrentState(this.foiRequest);

    const requestIspersonal = this.foiRequest.requestData.requestType.requestType === "personal";
    const personalNonAdoption = requestIspersonal && this.foiRequest.requestData.requestTopic.value !== "adoption";
    if (personalNonAdoption) {
      // Personal non-Adoption can skip over the next route, 'adoptive-parents'.
      this.base.goSkipForward();
      return;
    }
    this.base.goFoiForward();
  }

  doGoBack() {
    this.base.goFoiBack();
  }
}
