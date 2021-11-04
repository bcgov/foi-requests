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
    // Clear the current state!
    const blankState: FoiRequest = {
      requestData: {}
    };
    this.dataService.setCurrentState(blankState);
    this.dataService.removeChildFileAttachment();
    this.dataService.removePersonFileAttachment();
    this.dataService.removeAuthToken();
  }

  submitAnotherRequest() {
    this.router.navigate(["getting-started2"]);
    return false;
  }
}
