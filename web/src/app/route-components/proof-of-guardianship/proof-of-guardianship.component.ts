import { Component, OnInit, ViewChild } from "@angular/core";
import { BaseComponent } from "src/app/utils-components/base/base.component";
import { FoiRequest } from "src/app/models/FoiRequest";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DataService } from "src/app/services/data.service";
import { startWith } from "rxjs/operators";

@Component({
  templateUrl: "./proof-of-guardianship.component.html",
  styleUrls: ["./proof-of-guardianship.component.scss"],
})
export class ProofOfGuardianshipComponent implements OnInit {
  @ViewChild(BaseComponent, { static: true }) base: BaseComponent;
  foiForm: FormGroup;

  foiRequest: FoiRequest;
  targetKey: string;
  answerYes: boolean = null;
  answerReceived: boolean;
  proofFor: string;

  constructor(private fb: FormBuilder, private dataService: DataService) {
    this.foiForm = this.fb.group({
      answerYes: [null, [Validators.required]],
    });
  }

  ngOnInit() {
    this.base.getFoiRouteData().subscribe((data) => {
      if (data) {
        this.proofFor = data.proofFor; // One of ['child', 'person']
        this.targetKey = this.proofFor === "child" ? "proofOfGuardianship" : "proofOfPermission";
        // Load the current values & populate the FormGroup.
        this.foiRequest = this.dataService.getCurrentState(this.targetKey);
        const initialValues = this.foiRequest.requestData[this.targetKey];
        this.foiForm.patchValue(initialValues);

        this.foiForm.valueChanges.pipe(startWith(initialValues)).subscribe((newValue) => {
          this.answerReceived = this.answerYes !== null;
          this.answerYes = newValue.answerYes === "true";
          this.base.continueDisabled = !this.answerYes;
        });
      }
    });
  }

  get showAlert(): boolean {
    return this.answerReceived && !this.answerYes;
  }

  doContinue() {
    // Update save data & proceed.
    this.dataService.setCurrentState(this.foiRequest, this.targetKey, this.foiForm);
    this.base.goFoiForward();
  }

  doGoBack() {
    this.base.goFoiBack();
  }
}
