import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseComponent } from '../base/base.component';
import { Observable, of } from 'rxjs';
import { FoiRequest } from 'src/app/models/FoiRequest';
import { FormBuilder } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';
import { map } from 'rxjs/operators';

@Component({
  templateUrl: './ministry-confirmation.component.html',
  styleUrls: ['./ministry-confirmation.component.scss']
})
export class MinistryConfirmationComponent implements OnInit {
  @ViewChild(BaseComponent) base: BaseComponent;
  foiForm = this.fb.group({
    selectedMinistry: null
  });

  foiRequest: FoiRequest;
  foiFormData$: Observable<any>;
  ministries$: Observable<any>;
  ministries: Array<any>;
  defaultMinistry: String;


  constructor(private fb: FormBuilder, private dataService: DataService) {}

  ngOnInit() {
    this.foiRequest = this.dataService.getCurrentState();
    this.foiRequest.requestData.ministry =
      this.foiRequest.requestData.ministry || {};
    this.defaultMinistry = this.foiRequest.requestData.ministry.default;
    this.ministries$ = this.dataService.getMinistries().pipe(map(ministries => {
      this.ministries = ministries;
      return ministries;
    }));

    this.foiForm.patchValue({
      selectedMinistry: this.foiRequest.requestData.ministry.selectedMinistry.code
    });

  }

  doContinue() {
    // Copy out submitted form data.
    const formData = this.foiForm.value;
    this.foiRequest.requestData.ministry.selectedMinistry = this.ministries.find(m => m['code'] === formData.selectedMinistry);
    // Update save data & proceed.
    this.dataService.setCurrentState(this.foiRequest);
    this.base.goFoiForward();
  }

  doGoBack() {
    this.base.goFoiBack();
  }
}
