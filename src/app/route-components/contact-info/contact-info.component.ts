import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseComponent } from '../base/base.component';
import { FoiRequest } from 'src/app/models/FoiRequest';
import { FormBuilder, Validators } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';

@Component({
  templateUrl: './contact-info.component.html',
  styleUrls: ['./contact-info.component.scss']
})
export class ContactInfoComponent implements OnInit {
  @ViewChild(BaseComponent) base: BaseComponent;
  foiForm = this.fb.group({
    firstName: [null, Validators.compose([Validators.required, Validators.maxLength(255)])],
    middleName:  [null, [Validators.maxLength(255)]],
    lastName:  [null, Validators.compose([Validators.required, Validators.maxLength(255)])],
    businessName:  [null, [Validators.maxLength(255)]]
  });

  foiRequest: FoiRequest;
  targetKey: string = 'contactInfo';

  constructor(private fb: FormBuilder, private dataService: DataService) {}

  ngOnInit() {
    // Load the current values & populate the FormGroup.
    this.foiRequest = this.dataService.getCurrentState(this.targetKey);
    this.foiForm.patchValue(this.foiRequest.requestData[this.targetKey]);
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
