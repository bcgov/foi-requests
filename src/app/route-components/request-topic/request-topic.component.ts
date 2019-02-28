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
    anotherTopicText: [null, [Validators.required]]
  });

  foiRequest: FoiRequest;
  topics: Array<any> = [];

  constructor(private fb: FormBuilder, private dataService: DataService) {
    // TODO: move this to the data.json and feed it from the data service!
    this.topics.push({
      value: "publicServiceEmployment",
      text: "Your employment with the public service",
      ministryCode: "PSA"
    });
    this.topics.push({
      value: "correctionalFacility",
      text: "Your time spent in a correctional facility",
      ministryCode: "PSSG"
    });
    this.topics.push({ value: "incomeAssistance", text: "Your income assistance history", ministryCode: "SDPR" });
    this.topics.push({ value: "childProtection", text: "Child protection and youth care", ministryCode: "MCF" });
    this.topics.push({ value: "adoption", text: "Adoption", ministryCode: "MCF" });
    this.topics.push({ value: "communityLiving", text: "Community Living BC", ministryCode: "MCF" });
    this.topics.push({ value: "anotherTopic", text: "Another Topic", ministryCode: null });
  }

  ngOnInit() {
    this.foiRequest = this.dataService.getCurrentState("requestTopic");
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

  /**
   * Used to disable the Continue button.
   */
  allowContinue() {
    const formData = this.foiForm.value;
    let result = false;
    if (formData.requestTopic && formData.requestTopic.value === "anotherTopic" && formData.anotherTopicText) {
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
      this.foiRequest.requestData["ministry"] = this.foiRequest.requestData["ministry"] || {};

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
      this.foiRequest.requestData["ministry"].default = ministryMatch;
      this.dataService.setCurrentState(this.foiRequest);

      this.base.goFoiForward(selection);
    });
  }

  doGoBack() {
    this.base.goFoiBack();
  }
}
