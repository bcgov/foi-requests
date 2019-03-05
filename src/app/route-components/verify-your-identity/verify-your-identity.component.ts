import { Component, OnInit, ViewChild } from "@angular/core";
import { BaseComponent } from "src/app/utils-components/base/base.component";
import { Validators, FormBuilder } from "@angular/forms";
import { FoiRequest } from "src/app/models/FoiRequest";
import { DataService } from "src/app/services/data.service";

@Component({
  templateUrl: "./verify-your-identity.component.html",
  styleUrls: ["./verify-your-identity.component.scss"]
})
export class VerifyYourIdentityComponent implements OnInit {
  @ViewChild(BaseComponent) base: BaseComponent;

  foiRequest: FoiRequest;
  targetKey: string = "contactInfo";
  infoBlock: string;

  foiForm = this.fb.group({
    firstName: [null, Validators.compose([Validators.required, Validators.maxLength(255)])],
    middleName: [null, [Validators.maxLength(255)]],
    lastName: [null, Validators.compose([Validators.required, Validators.maxLength(255)])],
    birthDate: [null, [Validators.required]],
    alsoKnownAs: [null, Validators.compose([Validators.maxLength(255)])],
    businessName: [null, [Validators.maxLength(255)]]
  });

  constructor(private fb: FormBuilder, private dataService: DataService) {}

  ngOnInit() {
    this.foiRequest = this.dataService.getCurrentState(this.targetKey);
    this.foiForm.patchValue(this.foiRequest.requestData[this.targetKey]);

    this.base.getFoiRouteData().subscribe(data => {
      if (data) {
        this.infoBlock = data.infoBlock;
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
