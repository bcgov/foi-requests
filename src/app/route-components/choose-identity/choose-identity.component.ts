import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseComponent } from 'src/app/utils-components/base/base.component';
import { FoiRequest } from 'src/app/models/FoiRequest';
import { FormBuilder, Validators } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';
import {startWith} from "rxjs/operators";
// import {KeycloakService} from '../../services/keycloak.service';
import { Router } from '@angular/router';

@Component({
  templateUrl: './choose-identity.component.html',
  styleUrls: ['./choose-identity.component.scss']
})
export class ChooseIdentityComponent implements OnInit {
  @ViewChild(BaseComponent) base: BaseComponent;
  foiForm = this.fb.group({
    answerYes: [null, [Validators.required]]
  });
  foiRequest: FoiRequest;
  answerYes: boolean = null;
  answerReceived: boolean;
  continuetext = 'Start your request'
  targetKey: string;
  constructor(private fb: FormBuilder, private dataService: DataService, public router: Router) {}


  ngOnInit() {
    console.log(sessionStorage.getItem('KC_TOKEN'));

    this.base.getFoiRouteData().subscribe(data => {
      if (data) {
        // Load the current values & populate the FormGroup.
        this.foiRequest = this.dataService.getCurrentState(this.targetKey);
        const initialValues = this.foiRequest.requestData[this.targetKey];
        this.foiForm.patchValue(initialValues);

        this.foiForm.valueChanges.pipe(startWith(initialValues)).subscribe(newValue => {
          this.answerReceived = this.answerYes !== null;
          this.answerYes = newValue.answerYes === 'true';
          if (this.answerYes) {
            this.continuetext = 'Login With BC Service Card';
          } else {
            this.continuetext = 'Continue without Logging In';
          }
          this.base.continueDisabled = !this.answerReceived;
        });
      }
    });
  }
  doContinue() {
    if (this.answerYes) {
      // this.keycloakService.login();
      this.router.navigateByUrl('signin')
    } else {
      sessionStorage.setItem('KC_TOKEN', null)
      this.base.goFoiForward();
    }
    //
  }
  doGoBack() {
    this.base.goFoiBack();
  }

  get showAlert(): Boolean {
    return this.answerReceived && !this.answerYes;
  }

}
