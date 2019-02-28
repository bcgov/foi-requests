import { Component, OnInit, ViewChild } from "@angular/core";
import { BaseComponent } from "../base/base.component";
import { FoiRequest } from "src/app/models/FoiRequest";
import { FormBuilder, Validators } from "@angular/forms";
import { DataService } from "src/app/services/data.service";

@Component({
  templateUrl: "./proof-of-guardianship.component.html",
  styleUrls: ["./proof-of-guardianship.component.scss"]
})
export class ProofOfGuardianshipComponent implements OnInit {
  @ViewChild(BaseComponent) base: BaseComponent;
  foiForm = this.fb.group({
    hasGuardianship: [null, [Validators.required]]
  });

  foiRequest: FoiRequest;
  targetKey: string = "proofOfGuardianship";

  hasGuardianship: boolean;

  constructor(private fb: FormBuilder, private dataService: DataService) {}

  ngOnInit() {
    // Load the current values & populate the FormGroup.
    this.foiRequest = this.dataService.getCurrentState(this.targetKey);
    this.hasGuardianship = (this.foiRequest.requestData[this.targetKey] && (this.foiRequest.requestData[this.targetKey].hasGuardianship === "true"));

    this.foiForm.patchValue(this.foiRequest.requestData[this.targetKey]);
  }

  doContinue() {
    // Update save data & proceed.
    const state = this.dataService.setCurrentState(this.foiRequest, this.targetKey, this.foiForm);
    this.base.goFoiForward(state.requestData[this.targetKey].requestType);
  }

  doGoBack() {
    this.base.goFoiBack();
  }

  handleValueChange(event){
    console.log('radio changed ', this.foiForm.value);
    this.hasGuardianship = (this.foiForm.value.hasGuardianship === "true");

  }
}
