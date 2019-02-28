import { Component, OnInit, ViewChild } from "@angular/core";
import { BaseComponent } from "../base/base.component";
import { FoiRequest } from "src/app/models/FoiRequest";
import { Observable } from "rxjs";
import { FormBuilder, Validators } from "@angular/forms";
import { DataService } from "src/app/services/data.service";

@Component({
  templateUrl: "./description-timeframe.component.html",
  styleUrls: ["./description-timeframe.component.scss"]
})
export class DescriptionTimeframeComponent implements OnInit {
  @ViewChild(BaseComponent) base: BaseComponent;
  foiForm = this.fb.group({
    topic: [null, [Validators.required]],
    description: [null, [Validators.required]],
    fromDate: [null, [Validators.required]],
    toDate: [null, [Validators.required]],
    publicServiceEmployeeNumber: [null] // Not required! TODO: maybe [Validators.maxLength]
  });

  foiRequest: FoiRequest;
  showRequestTopic: boolean = false;
  showPublicServiceEmployeeNumber: boolean = false;
  showCorrectionalServiceNumber: boolean = false;

  constructor(private fb: FormBuilder, private dataService: DataService) {}

  ngOnInit() {
    // this.base.getFoiRouteData().subscribe(data => {
    //   if (data) {
    //     this.showRequestTopic = data.showRequestTopic || false;
    //     this.showPublicServiceEmployeeNumber = data.showPublicServiceEmployeeNumber || false;
    //     this.showCorrectionalServiceNumber = data.showCorrectionalServiceNumber || false;
    //   }
    // });

    this.foiRequest = this.dataService.getCurrentState();

    this.showRequestTopic = !this.foiRequest.requestData.ministry.selectedMinistry;
    this.showPublicServiceEmployeeNumber =
      this.foiRequest.requestData.ministry.selectedMinistry &&
      this.foiRequest.requestData.ministry.selectedMinistry.code === "PSA";

    this.showCorrectionalServiceNumber =
      this.foiRequest.requestData.ministry.selectedMinistry &&
      this.foiRequest.requestData.ministry.selectedMinistry.code === "PSSG";

    const requestTopic = this.foiRequest.requestData.topic || this.foiRequest.requestData.anotherTopicText;

    const formInit = {
      topic: requestTopic,
      description: this.foiRequest.requestData.description,
      fromDate: this.foiRequest.requestData.fromDate,
      toDate: this.foiRequest.requestData.toDate,
      publicServiceEmployeeNumber: this.foiRequest.requestData.publicServiceEmployeeNumber
    };
    if (!this.showRequestTopic) {
      formInit.topic = this.foiRequest.requestData.requestTopic.text;
    }
    this.foiForm.patchValue(formInit);
  }

  doContinue() {
    // Copy out submitted form data.
    const formData = this.foiForm.value;
    Object.assign(this.foiRequest.requestData, formData);

    // Update save data & proceed.
    this.dataService.setCurrentState(this.foiRequest);
    this.base.goFoiForward();
  }

  doGoBack() {
    this.base.goFoiBack();
  }
}
