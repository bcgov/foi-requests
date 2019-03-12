import { Component, OnInit, ViewChild } from "@angular/core";
import { BaseComponent } from "src/app/utils-components/base/base.component";
import { FoiRequest } from "src/app/models/FoiRequest";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { DataService } from "src/app/services/data.service";

@Component({
  templateUrl: "./description-timeframe.component.html",
  styleUrls: ["./description-timeframe.component.scss"]
})
export class DescriptionTimeframeComponent implements OnInit {
  @ViewChild(BaseComponent) base: BaseComponent;
  foiForm: FormGroup;

  foiRequest: FoiRequest;
  targetKey: string = "descriptionTimeframe";
  topic: string;
  personalRequest: boolean = false;
  showPublicServiceEmployeeNumber: boolean = false;
  showCorrectionalServiceNumber: boolean = false;

  constructor(private fb: FormBuilder, private dataService: DataService) {}

  ngOnInit() {
    this.foiForm = this.fb.group({
      description: [null, Validators.required],
      fromDate: [null, Validators.compose([Validators.required, this.base.noFutureValidator])],
      toDate: [null, [Validators.required, this.base.noFutureValidator]],
      correctionalServiceNumber: [null, Validators.maxLength(255)],
      publicServiceEmployeeNumber: [null, Validators.maxLength(255)]
    });

    this.foiRequest = this.dataService.getCurrentState(this.targetKey, "requestType", "requestTopic", "ministry");
    this.foiRequest.requestData.ministry.defaultMinistry = this.foiRequest.requestData.ministry.defaultMinistry || {};

    // If ministry is PSA, show the Public Service Employee number field.
    // If ministry is PSSG, show the Correctional Service number field.
    const currentMinistries = this.foiRequest.requestData.ministry.selectedMinistry
      ? this.foiRequest.requestData.ministry.selectedMinistry
      : [this.foiRequest.requestData.ministry.defaultMinistry] || [];

    this.personalRequest = this.foiRequest.requestData.requestType.requestType === "personal";
    if (this.personalRequest) {
      this.showPublicServiceEmployeeNumber = !!currentMinistries.find(m => m.code === "PSA");
      this.showCorrectionalServiceNumber = !!currentMinistries.find(m => m.code === "PSSG");
    }

    let ministryTopic = "General Request";
    if (currentMinistries.length === 1) {
      ministryTopic = currentMinistries[0].name;
    } else if (currentMinistries.length > 1) {
      ministryTopic = `General request for ${currentMinistries.length} ministries`;
    }
    this.topic = this.foiRequest.requestData.requestTopic.text || ministryTopic;

    const formInit = {};
    Object.assign(formInit, this.foiRequest.requestData[this.targetKey]);
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

    // Populate the request topic calculated during init.
    this.foiRequest.requestData[this.targetKey].topic = this.topic;

    // If this is not an Adoption request, remove adoptiveParent details.
    const isAdoption = this.foiRequest.requestData.requestTopic.value === "adoption";
    if (!isAdoption) {
      delete this.foiRequest.requestData.adoptiveParents;
    }

    // Update save data & proceed.
    this.dataService.setCurrentState(this.foiRequest);

    const personalNonAdoption = this.personalRequest && !isAdoption;
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

  inputMaxDate(): string {
    return new Date().toISOString().split("T")[0];
  }
}
