import { Component, OnInit, ViewChild } from "@angular/core";
import { BaseComponent } from "src/app/utils-components/base/base.component";
import { DataService } from "src/app/services/data.service";
import { FoiRequest } from "src/app/models/FoiRequest";
import { Router } from "@angular/router";

@Component({
  selector: "app-review-submit-complete",
  templateUrl: "./review-submit-complete.component.html",
  styleUrls: ["./review-submit-complete.component.scss"]
})
export class ReviewSubmitCompleteComponent implements OnInit {
  @ViewChild(BaseComponent) base: BaseComponent;

  foiRequest: FoiRequest;
  constructor(private router: Router, private dataService: DataService) {}

  ngOnInit() {
    this.foiRequest = this.dataService.getCurrentState();
    this.dataService.saveState("submitted", this.foiRequest);
    // Clear the current state!
    const blankState: FoiRequest = {
      requestData: {}
    };
    this.dataService.setCurrentState(blankState);
  }

  submitToAnotherMinistry() {
    const submitted = this.dataService.loadState("submitted");
    let ministryPage = "";
    // Scrub the selected ministry
    if (submitted && submitted.requestData && submitted.requestData.ministry) {
      submitted.requestData.ministry.selectedMinistry = {};
      ministryPage = submitted.requestData.ministry.ministryPage;
    }
    this.dataService.setCurrentState(submitted);
    this.router.navigate([ministryPage]);
    return false;
  }

  submitAnotherRequest() {
    this.router.navigate([""]);
    return false;
  }
}
