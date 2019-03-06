import { Component, OnInit, ViewChild } from "@angular/core";
import { BaseComponent } from "src/app/utils-components/base/base.component";
import { FoiRequest } from "src/app/models/FoiRequest";
import { FormBuilder, Validators, FormControl, FormGroup } from "@angular/forms";
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
  showRequestTopic: boolean = false;
  hidePersonalNumbers: boolean = false;
  showPublicServiceEmployeeNumber: boolean = false;
  showCorrectionalServiceNumber: boolean = false;

  constructor(private fb: FormBuilder, private dataService: DataService) {
    
  }

  ngOnInit() {
    this.foiForm = this.fb.group({
      topic: [null, Validators.compose([Validators.required, Validators.maxLength(255)])],
      description: [null, Validators.required],
      fromDate: [null, Validators.compose([Validators.required, this.base.noFutureValidator])],
      toDate: [null, [Validators.required, this.base.noFutureValidator]],
      correctionalServiceNumber: [null, Validators.maxLength(255)],
      publicServiceEmployeeNumber: [null, Validators.maxLength(255)]
    });
    this.base.getFoiRouteData().subscribe(data => {
      if (data) {
        this.hidePersonalNumbers = data.hidePersonalNumbers;
      }
    });

    this.foiRequest = this.dataService.getCurrentState(this.targetKey, "requestType", "requestTopic", "ministry");
    this.foiRequest.requestData.ministry.default = this.foiRequest.requestData.ministry.default || {};

    // Show Topic field for all General requests!
    this.showRequestTopic = false; //this.foiRequest.requestData.requestType.requestType === "general";

    // If ministry is PSA, show the Public Service Employee number field.
    // If ministry is PSSG, show the Correctional Service number field.
    const currentMinistry = this.foiRequest.requestData.ministry.selectedMinistry
      ? this.foiRequest.requestData.ministry.selectedMinistry
      : this.foiRequest.requestData.ministry.defaultMinistry;

    this.showPublicServiceEmployeeNumber = currentMinistry.code === "PSA";
    this.showCorrectionalServiceNumber = currentMinistry.code === "PSSG";

    const formInit = {};
    Object.assign(formInit, this.foiRequest.requestData[this.targetKey]);
    if (!this.showRequestTopic) {
      formInit["topic"] = this.foiRequest.requestData.requestTopic.text || currentMinistry.name;
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
    const isAdoption = this.foiRequest.requestData.requestTopic.value === "adoption"
    const personalNonAdoption = (requestIspersonal && !isAdoption);
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

  

  // Possible future use...
  // dateValidator(c: FormControl) {
  //   const dateRegex = /^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/;
  //   if (c.value === "" || dateRegex.test(c.value)) {
  //     return null;
  //   }
  //   // Failed!
  //   return {
  //     validateDate: {
  //       valid: false
  //     }
  //   };
  // }

  inputMaxDate(): string {
    return new Date().toISOString().split("T")[0];
  }
}
