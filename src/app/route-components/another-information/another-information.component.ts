import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseComponent } from '../base/base.component';
import { Validators, FormBuilder } from '@angular/forms';
import { FoiRequest } from 'src/app/models/FoiRequest';
import { DataService } from 'src/app/services/data.service';

@Component({
  templateUrl: './another-information.component.html',
  styleUrls: ['./another-information.component.scss']
})
export class AnotherInformationComponent implements OnInit {

  @ViewChild(BaseComponent) base: BaseComponent;
  foiForm = this.fb.group({
    firstName: [null, Validators.compose([Validators.required, Validators.maxLength(255)])],
    middleName: [null, [Validators.maxLength(255)]],
    lastName: [null, Validators.compose([Validators.required, Validators.maxLength(255)])],
    alsoKnownAs: [null, [Validators.maxLength(255)]],
    dateOfBirth: null,
    proofOfAuthorization: [null, [Validators.required]]
  });

  foiRequest: FoiRequest;
  targetKey: string = "anotherInformation";
  attachmentname: string;

  constructor(private fb: FormBuilder, private dataService: DataService) {}

  ngOnInit() {
    // Load the current values & populate the FormGroup.
    this.foiRequest = this.dataService.getCurrentState(this.targetKey);
    const formInit = this.foiRequest.requestData[this.targetKey];
    this.attachmentname = formInit.proofOfAuthorization;
    this.foiForm.patchValue(formInit);
  }

  doContinue() {
    // Update save data & proceed.
    this.dataService.setCurrentState(this.foiRequest, this.targetKey, this.foiForm);
    this.base.goFoiForward();
  }

  doGoBack() {
    this.base.goFoiBack();
  }

  changeImageListener(event){
    const f: File = event.target.files[0];
    this.dataService.setPersonFileAttachment(f);
    this.foiForm.controls["proofOfAuthorization"].setValue(f.name);
  }

  newFileSelected(newFile: File){
    this.dataService.setPersonFileAttachment(newFile);
    this.foiForm.controls["proofOfAuthorization"].setValue(newFile.name);
  }
}
