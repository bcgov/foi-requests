import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseComponent } from '../base/base.component';
import { Observable } from 'rxjs';
import { FoiRequest } from 'src/app/models/FoiRequest';
import { FormBuilder, Validators } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';
import { map } from 'rxjs/operators';

@Component({
  templateUrl: './ministry-confirmation.component.html',
  styleUrls: ['./ministry-confirmation.component.scss']
})
export class MinistryConfirmationComponent implements OnInit {
  @ViewChild(BaseComponent) base: BaseComponent;
  foiForm = this.fb.group({
    selectedMinistry: [null, Validators.required]
  });

  foiRequest: FoiRequest;
  ministries$: Observable<any>;
  ministries: Array<any>;
  defaultMinistry: string;
  targetKey: string = 'ministry';

  constructor(private fb: FormBuilder, private dataService: DataService) {
    
  }

  ngOnInit() {

    this.foiRequest = this.dataService.getCurrentState(this.targetKey);
    this.defaultMinistry = this.foiRequest.requestData[this.targetKey].default;
    if (!this.defaultMinistry){
      this.foiForm.valueChanges.subscribe(() => {
        this.base.continueDisabled =  !this.foiForm.valid;
      });
    }
    this.ministries$ = this.dataService.getMinistries().pipe(map(ministries => {
      this.ministries = ministries;
      return ministries;
    }));

    // Make sure we have a selected ministry before trying to patch it in.
    const selected = this.foiRequest.requestData[this.targetKey].selectedMinistry;
    const selectedCode = selected ? selected.code : null;
    this.foiForm.patchValue({
      selectedMinistry: selectedCode
    });

  }

  doContinue() {
    // Copy out submitted form data.
    const formData = this.foiForm.value;
    let selected = this.ministries.find(m => m['code'] === formData.selectedMinistry);
    if (!selected){
      selected = this.defaultMinistry;
    }
    this.foiRequest.requestData[this.targetKey].selectedMinistry = selected;
    // Update save data & proceed.
    this.dataService.setCurrentState(this.foiRequest);
    this.base.goFoiForward();
  }

  doGoBack() {
    this.base.goFoiBack();
  }
}
