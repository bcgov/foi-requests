import { Component, OnInit, ViewChild } from "@angular/core";
import { BaseComponent } from "src/app/utils-components/base/base.component";
import { FoiRequest } from "src/app/models/FoiRequest";
import { FormBuilder } from "@angular/forms";
import { DataService } from "src/app/services/data.service";

@Component({
  templateUrl: "./select-about.component.html",
  styleUrls: ["./select-about.component.scss"]
})
export class SelectAboutComponent implements OnInit {
  @ViewChild(BaseComponent) base: BaseComponent;
  foiForm = this.fb.group({
    yourself: null,
    child: null,
    another: null
  });

  foiRequest: FoiRequest;
  ministries: Array<any>;
  topics: Array<any>;
  targetKey: string = "selectAbout";

  constructor(private fb: FormBuilder, private dataService: DataService) {}

  ngOnInit() {
    // Load the current values & populate the FormGroup.
    this.foiRequest = this.dataService.getCurrentState(this.targetKey, "ministry");
    this.foiForm.patchValue(this.foiRequest.requestData[this.targetKey]);

    const about = this.foiRequest.requestData.selectAbout;
    this.topics = this.dataService.getTopicsObj(about);

    this.dataService.getMinistries().subscribe(ministries => {
      this.ministries = ministries;
    });
  }

  /**
   * Used to disable the Continue button *and* determine the navigation path.
   */
  allowContinue() {
    const formData = this.foiForm.value;
    // Note: The order these are added is important!
    // Return value is matched against the keys in data.json.
    const checks = [];
    const checkboxes = ["yourself", "child", "another"];
    checkboxes.map(c => {
      if (formData[c]) {
        checks.push(c);
      }
    });
    return checks.join("-");
  }

  doContinue() {
    const navigateTo = this.allowContinue();

    const includesChild = navigateTo.indexOf("child") > -1;
    const includesAnother = navigateTo.indexOf("another") > -1;

    // If checkbox selection includes 'child', ministry and requestTopic are fixed.
    if (includesChild) {
      this.foiRequest.requestData.requestTopic = this.topics.find(t => t.value === "childProtection");
      this.foiRequest.requestData.ministry.default = this.ministries.find(m => m.code === "MCF");
    }

    // If this request does not include 'child', remove childInformation details.
    if (!includesChild) {
      delete this.foiRequest.requestData.childInformation;
      delete this.foiRequest.requestData.proofOfGuardianship;
      this.dataService.removeChildFileAttachment();
    }

    // If this request does not include 'another', remove anotherInformation details.
    if (!includesAnother) {
      delete this.foiRequest.requestData.anotherInformation;
      delete this.foiRequest.requestData.proofOfPermission;
      this.dataService.removePersonFileAttachment();
    }


    // Update save data & proceed.
    this.dataService.setCurrentState(this.foiRequest, this.targetKey, this.foiForm);
    this.base.goFoiForward(navigateTo);
  }

  doGoBack() {
    this.base.goFoiBack();
  }
}
