import { Component, OnInit, ViewChild } from "@angular/core";
import { BaseComponent } from "../base/base.component";
import { FoiRequest } from "src/app/models/FoiRequest";
import { Observable } from "rxjs";
import { FormBuilder, Validators } from "@angular/forms";
import { DataService } from "src/app/services/data.service";
// import { map } from 'rxjs/operators';

@Component({
  templateUrl: "./description-timeframe.component.html",
  styleUrls: ["./description-timeframe.component.scss"]
})
export class DescriptionTimeframeComponent implements OnInit {
  @ViewChild(BaseComponent) base: BaseComponent;
  foiForm = this.fb.group({
    topic: [null, [Validators.required]],
    description: [null, [Validators.required]],
    fromDate: [null, [Validators.required]],
    toDate: [null, [Validators.required]],
    publicServiceEmployeeNumber: [null, [Validators.required]]
  });

  foiRequest: FoiRequest;
  foiFormData$: Observable<any>;
  showRequestTopic: Boolean = false;
  showPublicServiceEmployeeNumber: Boolean = false;

  constructor(private fb: FormBuilder, private dataService: DataService) {}

  ngOnInit() {
    this.base.getFoiRouteData().subscribe(data => {
      if (data) {
        this.showRequestTopic = data.showRequestTopic || false;
        this.showPublicServiceEmployeeNumber = data.showPublicServiceEmployeeNumber || false;
      }
    });

    this.foiRequest = this.dataService.getCurrentState();

    const formInit = {
      topic: this.foiRequest.requestData.topic,
      description: this.foiRequest.requestData.description,
      fromDate: this.foiRequest.requestData.fromDate,
      toDate: this.foiRequest.requestData.toDate,
      publicServiceEmployeeNumber: this.foiRequest.requestData.publicServiceEmployeeNumber
    };
    if (!this.showRequestTopic) {
      formInit.topic = this.foiRequest.requestData.requestTopic.text || 'field is hidden';
    }
    // Satisfy the validator with dummy text.
    if (!this.showPublicServiceEmployeeNumber) {
      formInit.publicServiceEmployeeNumber = 'field is hidden';
    }

    this.foiForm.patchValue(formInit);
  }

  /**
   * Used to disable the Continue button.
   */
  // allowContinue() {
  //   const formData = this.foiForm.value;
  //   let result = false;
  //   if (formData.deliveryType === 'other' && formData.otherDetails) {
  //     // Require that 'other' includes details!
  //     result = true;
  //   }
  //   if (formData.deliveryType && formData.deliveryType !== 'other') {
  //     //Anything that isn't 'other' detail are ignored.
  //     result = true;
  //   }
  //   console.log('allowContinue', result);
  //   return result;
  // }

  doContinue() {
    // Copy out submitted form data.
    const formData = this.foiForm.value;
    this.foiRequest.requestData.topic = formData.topic;
    this.foiRequest.requestData.description = formData.description;
    this.foiRequest.requestData.fromDate = formData.fromDate;
    this.foiRequest.requestData.toDate = formData.toDate;
    this.foiRequest.requestData.publicServiceEmployeeNumber = this.showPublicServiceEmployeeNumber ? formData.publicServiceEmployeeNumber : null;

    // Update save data & proceed.
    this.dataService.setCurrentState(this.foiRequest);
    this.base.goFoiForward();
  }

  doGoBack() {
    this.base.goFoiBack();
  }
}
