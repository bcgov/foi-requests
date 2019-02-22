  import { Component, OnInit, ViewChild } from '@angular/core';
  import { BaseComponent } from '../base/base.component';
  import { Observable } from 'rxjs';
  import { FoiRequest } from 'src/app/models/FoiRequest';
  import { FormBuilder, Validators } from '@angular/forms';
  import { DataService } from 'src/app/services/data.service';
  
@Component({
  templateUrl: './contact-info2.component.html',
  styleUrls: ['./contact-info2.component.scss']
})
export class ContactInfo2Component implements OnInit {
  @ViewChild(BaseComponent) base: BaseComponent;
    foiForm = this.fb.group({
      deliveryType: [null, [Validators.required]]
    });
  
    foiRequest: FoiRequest;
    foiFormData$: Observable<any>;
  
    constructor(private fb: FormBuilder, private dataService: DataService) {}
  
    ngOnInit() {
      this.foiRequest = this.dataService.getCurrentState();
      this.foiRequest.requestData.contactInfoB =
        this.foiRequest.requestData.contactInfoB || {};
      this.foiForm.patchValue(this.foiRequest.requestData.contactInfoB);
    }
  
    doContinue() {
      // Copy out submitted form data.
      this.foiRequest.requestData.contactInfoB = {};
      const formData = this.foiForm.value;
      Object.keys(formData).map(
        k => (this.foiRequest.requestData.contactInfoB[k] = formData[k])
      );
  
      // Update save data & proceed.
      this.dataService.setCurrentState(this.foiRequest);
      this.base.goFoiForward();
    }
  
    doGoBack() {
      this.base.goFoiBack();
    }
  }
  