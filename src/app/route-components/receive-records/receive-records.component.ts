import { Component, OnInit, ViewChild } from "@angular/core";
import { BaseComponent } from "../base/base.component";
import { Validators, FormBuilder } from "@angular/forms";
import { FoiRequest } from "src/app/models/FoiRequest";
import { DataService } from "src/app/services/data.service";

@Component({
  templateUrl: "./receive-records.component.html",
  styleUrls: ["./receive-records.component.scss"]
})
export class ReceiveRecordsComponent implements OnInit {
  @ViewChild(BaseComponent) base: BaseComponent;
  foiForm = this.fb.group({
    deliveryType: [null, [Validators.required]],
    deliveryText: [null, [Validators.required, Validators.maxLength(255)]]
  });

  foiRequest: FoiRequest;
  targetKey = "receiveRecords";
  deliveryOptions = {
    email: "Electronic records (by email)",
    paper: "Physical records (in paper)",
    other: ""
  };

  constructor(private fb: FormBuilder, private dataService: DataService) {}

  ngOnInit() {
    this.foiRequest = this.dataService.getCurrentState(this.targetKey);
    const formInit = {
      deliveryType: this.foiRequest.requestData[this.targetKey].deliveryType,
      deliveryText: null
    };
    if (formInit.deliveryType === "other") {
      formInit.deliveryText = this.foiRequest.requestData[this.targetKey].deliveryText;
    }
    this.foiForm.patchValue(formInit);
  }

  /**
   * Used to disable the Continue button.
   */
  allowContinue() {
    const formData = this.foiForm.value;
    let result = false;
    if (formData.deliveryType === "other" && formData.deliveryText) {
      // Require that 'other' includes details!
      result = true;
    }
    if (formData.deliveryType && formData.deliveryType !== "other") {
      //Anything that isn't 'other' detail are ignored.
      result = true;
    }
    return result;
  }

  doContinue() {
    // Copy out submitted form data.
    const formData = this.foiForm.value;
    this.foiRequest.requestData[this.targetKey] = {
      deliveryType: formData.deliveryType,
      deliveryText: formData.deliveryText
    };
    if (formData.deliveryType !== "other") {
      this.foiRequest.requestData[this.targetKey].deliveryText = this.deliveryOptions[formData.deliveryType];
    }

    // Update save data & proceed.
    this.dataService.setCurrentState(this.foiRequest);
    this.base.goFoiForward();
  }

  doGoBack() {
    this.base.goFoiBack();
  }
}
