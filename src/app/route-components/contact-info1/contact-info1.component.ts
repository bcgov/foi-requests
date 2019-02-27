import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseComponent } from '../base/base.component';
import { FoiRequest } from 'src/app/models/FoiRequest';
import { FormBuilder, Validators } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';

@Component({
  templateUrl: './contact-info1.component.html',
  styleUrls: ['./contact-info1.component.scss']
})
export class ContactInfo1Component implements OnInit {
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
    this.base.goFoiBack();
  }
}
