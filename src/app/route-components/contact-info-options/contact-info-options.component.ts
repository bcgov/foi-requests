import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseComponent } from 'src/app/utils-components/base/base.component';
import { FoiRequest } from 'src/app/models/FoiRequest';
import { FormBuilder, Validators } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';

@Component({
  templateUrl: './contact-info-options.component.html',
  styleUrls: ['./contact-info-options.component.scss']
})
export class ContactInfoOptionsComponent implements OnInit {
  @ViewChild(BaseComponent) base: BaseComponent;
  foiForm = this.fb.group({
    phonePrimary: [null, [Validators.minLength(10), Validators.maxLength(25)]],
    phoneSecondary: [null, [Validators.minLength(10), Validators.maxLength(25)]],
    // Regex: (non-whitespace) + '@' + (non-whitespace) + '.' + (non-whitespace)
    email: [null, [Validators.maxLength(255), Validators.pattern(/\S+@\S+\.\S/)]],
    address: [null, [Validators.maxLength(255)]],
    city: [null, [Validators.maxLength(255)]],
    postal: [null, [Validators.maxLength(255)]],
    province: [null, [Validators.maxLength(255)]],
    country: [null, [Validators.maxLength(255)]]
  });

  foiRequest: FoiRequest;
  targetKey: string = 'contactInfoOptions';

  constructor(private fb: FormBuilder, private dataService: DataService) {}

  ngOnInit() {
    // Load the current values & populate the FormGroup.
    this.foiRequest = this.dataService.getCurrentState(this.targetKey);
    this.foiForm.patchValue(this.foiRequest.requestData[this.targetKey]);
  }

  /**
   * Used to disable the Continue button.
   */
  allowContinue() {
    const formData = this.foiForm.value;
    let result = false;
    if (formData.email) {
      result = true;
    }
    if (formData.phonePrimary) {
      result = true;
    }
    if (formData.phoneSecondary) {
      result = true;
    }
    if (formData.address && formData.city && formData.postal && formData.province && formData.country ) {
      result = true;
    }
    return result;
  }

  doContinue() {
    // Update save data & proceed.
    this.dataService.setCurrentState(
      this.foiRequest,
      this.targetKey,
      this.foiForm
    );
    this.base.goFoiForward();
  }

  doGoBack() {
    const requestIspersonal = this.foiRequest.requestData.requestType.requestType === "personal";
    const isAdoption = this.foiRequest.requestData.requestTopic.value === "adoption";
    const personalNonAdoption = (requestIspersonal && !isAdoption);
    if (personalNonAdoption) {
      // Personal non-Adoption can skip over the previous route, 'adoptive-parents'.
      this.base.goSkipBack();
      return;
    }    
    this.base.goFoiBack();
  }
}
