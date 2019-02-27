import { Component, OnInit, ViewChild } from "@angular/core";
import { BaseComponent } from "../base/base.component";
import { FoiRequest } from "src/app/models/FoiRequest";
import { FormBuilder, Validators } from "@angular/forms";
import { DataService } from "src/app/services/data.service";
import { Observable } from "rxjs";

@Component({
  templateUrl: "./child-information.component.html",
  styleUrls: ["./child-information.component.scss"]
})
export class ChildInformationComponent implements OnInit {
  @ViewChild(BaseComponent) base: BaseComponent;
  foiForm = this.fb.group({
    firstName: [null, Validators.compose([Validators.required, Validators.maxLength(255)])],
    middleName: [null, [Validators.maxLength(255)]],
    lastName: [null, Validators.compose([Validators.required, Validators.maxLength(255)])],
    alsoKnownAs: [null, [Validators.maxLength(255)]],
    dateOfBirth: null,
    proofOfGuardianship: null
  });

  foiRequest: FoiRequest;
  targetKey: string = "childInformation";

  constructor(private fb: FormBuilder, private dataService: DataService) {}

  ngOnInit() {
    // Load the current values & populate the FormGroup.
    this.foiRequest = this.dataService.getCurrentState(this.targetKey);
    const formInit = this.foiRequest.requestData[this.targetKey];
    // formInit.proofOfGuardianship = ''; // Can only patch empty strings to a file type.
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
    this.dataService.setChildFileAttachment(f);
    this.foiForm.controls["proofOfGuardianship"].setValue(f.name);
  }
}
