import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseComponent } from 'src/app/utils-components/base/base.component';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { FoiRequest } from 'src/app/models/FoiRequest';
import { DataService } from 'src/app/services/data.service';


@Component({
  templateUrl: './foster-parent.component.html',
  styleUrls: ['./foster-parent.component.scss']
})
export class FosterParent implements OnInit {

  @ViewChild(BaseComponent) base: BaseComponent;

  foiForm = this.fb.group({
    fosterparentselection: [null, [Validators.required]]
  });

  foiRequest: FoiRequest;
  targetKey: string = "fosterparent";

  constructor(private fb: FormBuilder, private dataService: DataService) {}

  ngOnInit() {
  
  
    // Load the current values & populate the FormGroup.
    this.foiRequest = this.dataService.getCurrentState(this.targetKey);
    this.foiForm.patchValue(this.foiRequest.requestData[this.targetKey]);
  }

  doContinue() {

    const formData = this.foiForm.value;

    
    // Update save data & proceed.
    this.dataService.setCurrentState(this.foiRequest, this.targetKey, this.foiForm);
    this.base.goFoiForward();
  }

  doGoBack() {
    this.base.goFoiBack();
  }

 
}
