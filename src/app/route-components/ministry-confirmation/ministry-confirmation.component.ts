import { Component, OnInit, ViewChild } from "@angular/core";
import { BaseComponent } from "src/app/utils-components/base/base.component";
import { Observable } from "rxjs";
import { FoiRequest } from "src/app/models/FoiRequest";
import { FormBuilder, Validators, FormControl } from "@angular/forms";
import { DataService } from "src/app/services/data.service";
import { map } from "rxjs/operators";

@Component({
  templateUrl: "./ministry-confirmation.component.html",
  styleUrls: ["./ministry-confirmation.component.scss"]
})
export class MinistryConfirmationComponent implements OnInit {
  @ViewChild(BaseComponent) base: BaseComponent;
  foiForm = this.fb.group({
    selectedMinistry: null
  });

  foiRequest: FoiRequest;
  ministries$: Observable<any>;
  ministries: Array<any>;
  defaultMinistry: any;
  targetKey: string = "ministry";

  constructor(private fb: FormBuilder, private dataService: DataService) {}

  ngOnInit() {
    // Fetch Ministries from the data service.
    this.ministries$ = this.dataService.getMinistries().pipe(
      map(ministries => {
        this.ministries = ministries;
        return ministries;
      })
    );

    this.foiRequest = this.dataService.getCurrentState(this.targetKey);
    this.defaultMinistry = this.foiRequest.requestData[this.targetKey].default;
    let selectedMinistry = this.foiRequest.requestData[this.targetKey].selectedMinistry;

    if (this.defaultMinistry) {
      // If selectedMinistry is the same as default, don't re-select it in form!
      if (selectedMinistry && selectedMinistry.code === this.defaultMinistry.code) {
        selectedMinistry = null;
      }
    } else {
      // If thert's no default Ministry, make selectedMinistry required!
      this.foiForm.setControl("selectedMinistry", new FormControl([null, Validators.required]));
      this.base.continueDisabled = true;
    }

    // Make sure we have a selected ministry before trying to patch it in.
    const selectedCode = selectedMinistry ? selectedMinistry.code : null;
    this.foiForm.patchValue({
      selectedMinistry: selectedCode
    });

    // When the form changes, enable/disable the Continue button.
    this.foiForm.valueChanges.subscribe(() => {
      this.base.continueDisabled = !this.foiForm.valid;
    });
  }

  doContinue() {
    // Copy out submitted form data.
    const formData = this.foiForm.value;
    let selected = this.ministries.find(m => m["code"] === formData.selectedMinistry);
    if (!selected) {
      selected = this.defaultMinistry;
    }
    this.foiRequest.requestData[this.targetKey].selectedMinistry = selected;
    this.foiRequest.requestData[this.targetKey].ministryPage = this.base.getCurrentRoute();
    // Update save data & proceed.
    this.dataService.setCurrentState(this.foiRequest);
    this.base.goFoiForward();
  }

  doGoBack() {
    this.base.goFoiBack();
  }
}
