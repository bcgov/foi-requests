import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseComponent } from '../base/base.component';
import { Observable } from 'rxjs';
import { FoiRequest } from 'src/app/models/FoiRequest';
import { FormBuilder, Validators } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';

@Component({
  templateUrl: './request-info.component.html',
  styleUrls: ['./request-info.component.scss']
})
export class RequestInfoComponent implements OnInit {
  @ViewChild(BaseComponent) base: BaseComponent;
  foiForm = this.fb.group({
    firstName: [null, Validators.compose([Validators.required, Validators.maxLength(10)])],
    middleName: null,
    lastName: null,
    businessName: null
  });

  foiRequest: FoiRequest;
  foiFormData$: Observable<any>;

  constructor(private fb: FormBuilder, private dataService: DataService) {}

  ngOnInit() {
    this.foiRequest = this.dataService.getCurrentState();
    this.foiRequest.requestData.personalInfo =
      this.foiRequest.requestData.personalInfo || {};
    this.foiForm.patchValue(this.foiRequest.requestData.personalInfo);
  }

  doContinue() {
    // Copy out submitted form data.
    this.foiRequest.requestData.personalInfo = {};
    const formData = this.foiForm.value;
    Object.keys(formData).map(
      k => (this.foiRequest.requestData.personalInfo[k] = formData[k])
    );

    // Update save data & proceed.
    this.dataService.setCurrentState(this.foiRequest);
    this.base.goFoiForward();
  }

  doGoBack() {
    this.base.goFoiBack();
  }
}
