import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseComponent } from 'src/app/utils-components/base/base.component';
import { FoiRequest } from 'src/app/models/FoiRequest';
import { FormBuilder, Validators } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';
import {KeycloakService} from '../../services/keycloak.service';

@Component({
  templateUrl: './getting-started3.component.html',
  styleUrls: ['./getting-started3.component.scss']
})
export class GettingStarted3Component implements OnInit {
  @ViewChild(BaseComponent) base: BaseComponent;
  foiForm = this.fb.group({
    requestType: [null, [Validators.required]]
  });

  foiRequest: FoiRequest;
  targetKey: string = 'requestType';
  token = '';
  firstName = ''

  constructor(private fb: FormBuilder, private dataService: DataService, private keyclokservice: KeycloakService) {}

  ngOnInit() {
    // Load the current values & populate the FormGroup.
    this.foiRequest = this.dataService.getCurrentState(this.targetKey);
    this.foiForm.patchValue(this.foiRequest.requestData[this.targetKey]);
    console.log('TOKEN:', this.keyclokservice.getToken())
    this.token = this.keyclokservice.getToken();
    this.firstName = this.keyclokservice.getFirstName();
  }

  doContinue() {
    // Update save data & proceed.
    const state = this.dataService.setCurrentState(
      this.foiRequest,
      this.targetKey,
      this.foiForm
    );
    this.base.goFoiForward(state.requestData[this.targetKey].requestType);
  }
  onClickMe() {
    console.log('saying hello')
    this.keyclokservice.login()
  }

  doGoBack() {
    this.base.goFoiBack();
  }
}
