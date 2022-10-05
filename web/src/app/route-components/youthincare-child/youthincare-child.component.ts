import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseComponent } from 'src/app/utils-components/base/base.component';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { FoiRequest } from 'src/app/models/FoiRequest';
import { DataService } from 'src/app/services/data.service';


@Component({
  templateUrl: './youthincare-child.component.html',
  styleUrls: ['./youthincare-child.component.scss']
})
export class YouthInCareChild implements OnInit {

  @ViewChild(BaseComponent) base: BaseComponent;

  foiForm = this.fb.group({
    youthincarechildselection: [null, [Validators.required]],
    ischildincardrecords:false,
    ismentalhealthrecords:false,
    isspecialneedsrecords:false,
    isyouthagreement:false,
    isyouthjustice:false,
    isother:false,
  });

  foiRequest: FoiRequest;
  targetKey: string = "youthincarechild";
  ischildincardrecords: boolean = false; // hidden by default
  ismentalhealthrecords: boolean = false; // hidden by default
  isspecialneedsrecords: boolean = false; // hidden by default
  isyouthagreement: boolean = false; // hidden by default
  isyouthjustice: boolean = false; // hidden by default
  isother: boolean = false; // hidden by default

  constructor(private fb: FormBuilder, private dataService: DataService) { }

  ngOnInit() {

    console.log(this.dataService.getYouthinCareChild())

    // Load the current values & populate the FormGroup.
    this.foiRequest = this.dataService.getCurrentState(this.targetKey);    
    this.foiForm.patchValue(this.foiRequest.requestData[this.targetKey]);

    this.ischildincardrecords = this.foiRequest.requestData[this.targetKey].ischildincardrecords;
    this.ismentalhealthrecords = this.foiRequest.requestData[this.targetKey].ismentalhealthrecords;
    this.isspecialneedsrecords = this.foiRequest.requestData[this.targetKey].isspecialneedsrecords;
    this.isyouthagreement = this.foiRequest.requestData[this.targetKey].isyouthagreement;
    this.isyouthjustice = this.foiRequest.requestData[this.targetKey].isyouthjustice;
    this.isother= this.foiRequest.requestData[this.targetKey].isother;
  }

  togglechildincardrecordsShow() {
    this.ischildincardrecords = !this.ischildincardrecords;
  }

  togglementalhealthrecordsShow() {
    this.ismentalhealthrecords = !this.ismentalhealthrecords;
  }

  toggleyouthagreementShow() {
    this.isyouthagreement = !this.isyouthagreement;
  }

  togglespecialneedsrecordsShow() {
    this.isspecialneedsrecords = !this.isspecialneedsrecords;
  }

  doContinue() {

    const formData = this.foiForm.value;

    this.foiRequest.requestData[this.targetKey].ischildincardrecords = this.ischildincardrecords 
    this.foiRequest.requestData[this.targetKey].ismentalhealthrecords =this.ismentalhealthrecords;
    this.foiRequest.requestData[this.targetKey].isyouthagreement =this.isyouthagreement;
    this.foiRequest.requestData[this.targetKey].isspecialneedsrecords = this.isspecialneedsrecords;
    this.foiRequest.requestData[this.targetKey].isyouthjustice = this.isyouthjustice;
    this.foiRequest.requestData[this.targetKey].isother = this.isother;
    // Update save data & proceed.
    this.dataService.setCurrentState(this.foiRequest, this.targetKey, this.foiForm);
    console.log(`Key  ${JSON.stringify(this.foiRequest.requestData[this.targetKey])}`);

    this.base.goFoiForward();
  }

  doGoBack() {
    this.base.goFoiBack();
  }


}
