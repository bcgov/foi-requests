import { Component, OnInit, ViewChild } from "@angular/core";
import { BaseComponent } from "../base/base.component";
import { FoiRequest } from "src/app/models/FoiRequest";
import { Observable, of } from "rxjs";
import { FormBuilder, Validators } from "@angular/forms";
import { DataService } from "src/app/services/data.service";
import { tap } from "rxjs/operators";

@Component({
  templateUrl: "./request-topic.component.html",
  styleUrls: ["./request-topic.component.scss"]
})
export class RequestTopicComponent implements OnInit {
  @ViewChild(BaseComponent) base: BaseComponent;
  foiForm = this.fb.group({
    // values include [general, personal]
    requestTopic: [null, [Validators.required]],
    anotherTopicText: ""
  });

  foiRequest: FoiRequest;
  foiForm$: Observable<any>;

  topics: Array<any> = [];

  constructor(private fb: FormBuilder, private dataService: DataService) {
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
  }

  ngOnInit() {
    this.foiRequest = this.dataService.getCurrentState();
    console.log("Loaded requestTopic:", this.foiRequest.requestData);

    // The template does the actual subscribe, when that happens
    // this line will ensure that the reactive form is populated with data.
    this.foiForm$ = of(this.foiRequest.requestData.requestTopic || {}).pipe(tap(data => this.foiForm.patchValue(data)));
  }

  doContinue() {
    // Initialize & copy out submitted form data.
    this.foiRequest.requestData.requestTopic = {};
    const formData = this.foiForm.value;
    console.log("formData: ", formData);

    this.dataService.getMinistries().subscribe(ministries => {
      let selection = "anotherTopic";
      if (!this.foiRequest.requestData["ministry"]) {
        this.foiRequest.requestData["ministry"] = {};
      }

      if (formData.requestTopic === "anotherTopic") {
        this.foiRequest.requestData.requestTopic.text = formData.anotherTopicText;
        this.foiRequest.requestData["ministry"].default = null;
      } else {
        selection = formData.requestTopic.value;
        this.foiRequest.requestData.requestTopic = formData.requestTopic;
        const ministryMatch = ministries.find(m => m.code === formData.requestTopic.ministryCode);
        if (!ministryMatch) {
          return alert("Invalid default ministry, please contact the system administrator");
        }
        this.foiRequest.requestData["ministry"].default = ministryMatch;
      }
      this.dataService.setCurrentState(this.foiRequest);
      this.base.goFoiForward(selection);
    });
  }

  doGoBack() {
    this.base.goFoiBack();
  }
}
