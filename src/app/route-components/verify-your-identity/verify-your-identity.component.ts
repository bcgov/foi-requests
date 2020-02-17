import { Component, OnInit, ViewChild } from "@angular/core";
import { BaseComponent } from "src/app/utils-components/base/base.component";
import { Validators, FormBuilder, FormGroup, FormControl } from "@angular/forms";
import { FoiRequest } from "src/app/models/FoiRequest";
import { DataService } from "src/app/services/data.service";
import { KeycloakService } from '../../services/keycloak.service';

@Component({
  templateUrl: "./verify-your-identity.component.html",
  styleUrls: ["./verify-your-identity.component.scss"]
})
export class VerifyYourIdentityComponent implements OnInit {
  @ViewChild(BaseComponent) base: BaseComponent;

  foiRequest: FoiRequest;
  targetKey: string = "contactInfo";
  infoBlock: string;
  includeBirthDate: boolean = false;
  decodedToken: any;

  foiForm: FormGroup;

  constructor(private fb: FormBuilder, private dataService: DataService, private keycloak: KeycloakService) {}

  ngOnInit() {
    let token = this.keycloak.getDecodedToken();
    console.log('token')
    this.foiForm = this.fb.group({
      firstName: [token.firstname, Validators.compose([Validators.required, Validators.maxLength(255)])],
      middleName: [null, [Validators.maxLength(255)]],
      lastName: [token.lastname, Validators.compose([Validators.required, Validators.maxLength(255)])],
      birthDate: [null],
      alsoKnownAs: [null, Validators.compose([Validators.maxLength(255)])],
      businessName: [null, [Validators.maxLength(255)]]
    });

    this.foiRequest = this.dataService.getCurrentState(this.targetKey);
    this.foiForm.patchValue(this.foiRequest.requestData[this.targetKey]);

    this.base.getFoiRouteData().subscribe(data => {
      if (data) {
        this.infoBlock = data.infoBlock;
        this.includeBirthDate = data.includeBirthDate;
        if (this.includeBirthDate) {
          const currentValue = this.foiForm.get("birthDate").value;
          this.foiForm.setControl("birthDate", new FormControl(currentValue, [Validators.required, this.base.noFutureValidator]));
        }
      }
    });
  }

  doContinue() {
    // Copy out submitted form data.
    this.foiRequest.requestData[this.targetKey] = {};
    const formData = this.foiForm.value;
    Object.keys(formData).map(k => (this.foiRequest.requestData[this.targetKey][k] = formData[k]));

    // Update save data & proceed.
    this.dataService.setCurrentState(this.foiRequest);
    this.base.goFoiForward();
  }

  doGoBack() {
    this.base.goFoiBack();
  }


}
