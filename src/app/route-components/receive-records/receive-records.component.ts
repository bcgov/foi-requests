import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseComponent } from '../base/base.component';
import { Validators, FormBuilder } from '@angular/forms';
import { FoiRequest } from 'src/app/models/FoiRequest';
import { Observable } from 'rxjs';
import { DataService } from 'src/app/services/data.service';

@Component({
  templateUrl: './receive-records.component.html',
  styleUrls: ['./receive-records.component.scss']
})
export class ReceiveRecordsComponent implements OnInit {
  @ViewChild(BaseComponent) base: BaseComponent;
  foiForm = this.fb.group({
    deliveryType: [null, [Validators.required]],
    otherDetails: [null, [Validators.required]]
  });

  foiRequest: FoiRequest;
  foiFormData$: Observable<any>;

  constructor(private fb: FormBuilder, private dataService: DataService) {}

  ngOnInit() {
    this.foiRequest = this.dataService.getCurrentState();
    this.foiRequest.requestData.receiveRecords =
      this.foiRequest.requestData.receiveRecords || {};
    this.foiForm.patchValue(this.foiRequest.requestData.receiveRecords);
  }

  /**
   * Used to disable the Continue button *and* determine the navigation path.
   */
  allowContinue() {
    const formData = this.foiForm.value;
    // Note: The order these are added is important!
    // Return value is matched against the keys in data.json.
    let result = false;
    if (formData.deliveryType === 'other' && formData.otherDetails) {
      // Require that 'other' includes details!
      result = true;
    }
    if (formData.deliveryType && formData.deliveryType !== 'other') {
      //Anything that isn't 'other' detail are ignored.
      result = true;
    }
    console.log('allowContinue', result);
    return result;
  }

  doContinue() {
    // Copy out submitted form data.
    this.foiRequest.requestData.receiveRecords = {};
    const formData = this.foiForm.value;
    Object.keys(formData).map(
      k => (this.foiRequest.requestData.receiveRecords[k] = formData[k])
    );

    // Update save data & proceed.
    this.dataService.setCurrentState(this.foiRequest);
    this.base.goFoiForward();
  }

  doGoBack() {
    this.base.goFoiBack();
  }
}
