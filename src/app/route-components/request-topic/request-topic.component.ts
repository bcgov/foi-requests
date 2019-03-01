import { Component, OnInit, ViewChild } from "@angular/core";
import { BaseComponent } from "../base/base.component";
import { FoiRequest } from "src/app/models/FoiRequest";
import { FormBuilder, Validators } from "@angular/forms";
import { DataService } from "src/app/services/data.service";

@Component({
  templateUrl: "./request-topic.component.html",
  styleUrls: ["./request-topic.component.scss"]
})
export class RequestTopicComponent implements OnInit {
  @ViewChild(BaseComponent) base: BaseComponent;
  foiForm = this.fb.group({
    requestTopic: [null, [Validators.required]],
    anotherTopicText: [null, [Validators.required, Validators.maxLength(255)]]
  });

  foiRequest: FoiRequest;
  topics: Array<any> = [];
  targetKey: string = "ministry";

  constructor(private fb: FormBuilder, private dataService: DataService) {}

  ngOnInit() {
    this.foiRequest = this.dataService.getCurrentState("requestTopic");

    this.base.getFoiRouteData().subscribe(data => {
      if (data) {
        this.topics = this.dataService.getTopics(data.topics);
        // Clear anotherTopicText if anotherTopic is not selected.
        if (this.foiRequest.requestData.requestTopic.value !== "anotherTopic") {
          this.foiRequest.requestData.anotherTopicText = null;
        }
        const selectedTopic = this.topics.find(t => t.value === this.foiRequest.requestData.requestTopic.value);
        const formInit = {
          requestTopic: selectedTopic,
          anotherTopicText: this.foiRequest.requestData.anotherTopicText
        };
        this.foiForm.patchValue(formInit);
      }
    });

    // Set the continue button state
    this.foiForm.valueChanges.subscribe(() => {
      this.base.continueDisabled = !this.allowContinue();
    });
  }

  /**
   * Used to disable the Continue button.
   */
  allowContinue() {
    let result = false;
    const formData = this.foiForm.value;
    if (
      formData.requestTopic &&
      formData.requestTopic.value === "anotherTopic" &&
      formData.anotherTopicText &&
      this.foiForm.valid
    ) {
      // Require that 'anotherTopic' includes details!
      result = true;
    }
    if (formData.requestTopic && formData.requestTopic.value !== "anotherTopic") {
      //Anything that isn't 'anotherTopic' detail are ignored.
      result = true;
    }
    return result;
  }

  doContinue() {
    // Initialize & copy out submitted form data.
    this.foiRequest.requestData.requestTopic = {};
    const formData = this.foiForm.value;

    this.dataService.getMinistries().subscribe(ministries => {
      this.foiRequest.requestData[this.targetKey] = this.foiRequest.requestData[this.targetKey] || {};

      this.foiRequest.requestData.requestTopic = formData.requestTopic;
      if (this.foiRequest.requestData.requestTopic.value === "anotherTopic") {
        this.foiRequest.requestData.anotherTopicText = formData.anotherTopicText;
      } else {
        this.foiRequest.requestData.anotherTopicText = null;
      }

      const selection = this.foiRequest.requestData.requestTopic.value;
      const ministryCode = this.foiRequest.requestData.requestTopic.ministryCode;
      const ministryMatch = ministries.find(m => m.code === ministryCode);
      if (ministryCode && !ministryMatch) {
        return alert(`Invalid default ministry (${ministryCode}), please contact the system administrator`);
      }
      this.foiRequest.requestData[this.targetKey].default = ministryMatch;
      this.foiRequest.requestData[this.targetKey].selectedMinistry = ministryMatch;
      this.dataService.setCurrentState(this.foiRequest);

      this.base.goFoiForward(selection);
    });
  }

  doGoBack() {
    this.base.goFoiBack();
  }
}
