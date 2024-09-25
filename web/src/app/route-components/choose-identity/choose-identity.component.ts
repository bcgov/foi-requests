import { Component, OnInit, ViewChild } from "@angular/core";
import { BaseComponent } from "src/app/utils-components/base/base.component";
import { FoiRequest } from "src/app/models/FoiRequest";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DataService } from "src/app/services/data.service";
import { startWith } from "rxjs/operators";
// import {KeycloakService} from '../../services/keycloak.service';
import { Router } from "@angular/router";

@Component({
  templateUrl: "./choose-identity.component.html",
  styleUrls: ["./choose-identity.component.scss"],
})
export class ChooseIdentityComponent implements OnInit {
  @ViewChild(BaseComponent, { static: true }) base: BaseComponent;

  foiForm: FormGroup;

  foiRequest: FoiRequest;
  answerYes: boolean = null;
  answerReceived: boolean;
  continuetext = "Start your request";
  targetKey = "choose-idenity";
  showEmailAlert = false;

  constructor(private fb: FormBuilder, private dataService: DataService, public router: Router) {
    this.foiForm = this.fb.group({
      answerYes: [null, [Validators.required]],
    });
  }

  ngOnInit() {
    this.base.getFoiRouteData().subscribe((data) => {
      if (data) {
        // Load the current values & populate the FormGroup.
        this.foiRequest = this.dataService.getCurrentState(this.targetKey);
        const initialValues = this.foiRequest.requestData[this.targetKey];
        this.foiForm.patchValue(initialValues);

        this.foiForm.valueChanges.pipe(startWith(initialValues)).subscribe((newValue) => {
          this.answerYes = newValue.answerYes === "true";
          this.answerReceived = this.answerYes !== null;
          this.base.continueDisabled = !this.answerReceived;
        });
      }
    });
    // Set the flag to show alert message for email
    if (this.dataService.getShowEmailAlert()) {
      this.showEmailAlert = true;
      this.dataService.removeShowEmailAlert();
    }
  }
  doContinue() {
    // Update save data & proceed.
    const state = this.dataService.setCurrentState(this.foiRequest, this.targetKey, this.foiForm);
    if (this.answerYes) {
      this.router.navigateByUrl("signin");
    } else {
      sessionStorage.removeItem("KC_TOKEN");
      this.base.goFoiForward();
    }
    //
  }

  doContinueWithoutLogin() {
    const state = this.dataService.setCurrentState(this.foiRequest, this.targetKey, this.foiForm);
    sessionStorage.removeItem("KC_TOKEN");
    this.base.goFoiForward();
  }

  doLogin() {
    const state = this.dataService.setCurrentState(this.foiRequest, this.targetKey, this.foiForm);
    this.router.navigateByUrl("signin");
  }

  doGoBack() {
    this.base.goFoiBack();
  }

  get showAlert(): Boolean {
    return this.answerReceived && !this.answerYes;
  }
}
