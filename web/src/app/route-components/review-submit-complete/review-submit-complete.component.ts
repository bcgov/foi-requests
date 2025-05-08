import { Component, OnInit, ViewChild } from "@angular/core";
import { BaseComponent } from "src/app/utils-components/base/base.component";
import { DataService } from "src/app/services/data.service";
import { FoiRequest } from "src/app/models/FoiRequest";
import { Router } from "@angular/router";

@Component({
  selector: "app-review-submit-complete",
  templateUrl: "./review-submit-complete.component.html",
  styleUrls: ["./review-submit-complete.component.scss"],
})
export class ReviewSubmitCompleteComponent implements OnInit {
  @ViewChild(BaseComponent, { static: true }) base: BaseComponent;

  foiRequest: FoiRequest;
  constructor(private router: Router, private dataService: DataService) {}

  ngOnInit() {
    this.foiRequest = this.dataService.getCurrentState();
    this.foiRequest.requestData.selectedtopics = [];
    this.foiRequest.requestData.requestType.adoption = [];
    this.foiRequest.requestData.requestType.childprotectionchild = [];
    this.foiRequest.requestData.requestType.childprotectionparent = [];
    this.foiRequest.requestData.requestType.fosterparent = [];
    this.foiRequest.requestData.requestType.youthincarechild = [];
    this.foiRequest.requestData.requestType.youthincareparent = [];

    // Clear the current state!
    const blankState: FoiRequest = {
      requestData: {},
    };
    this.dataService.setCurrentState(blankState);
    this.dataService.removeChildFileAttachment();
    this.dataService.removePersonFileAttachment();
    this.dataService.removeAdoptionFileAttachment();
    this.dataService.removeAuthToken();
  }

  submitAnotherRequest() {
    this.router.navigate(["getting-started2"]);
    return false;
  }
}
